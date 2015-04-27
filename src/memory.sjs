/* --- MEMORY & ABSTRACT GRAMMAR --- */

function MEMORY(size) {

	function ASM_MEMORY(stdlib, foreign, heap) {
		"use asm"

		/* -- IMPORTS & VARIABLES -- */

		//memory
		var MEM8 = new stdlib.Uint8Array(heap);
		var MEM32 = new stdlib.Uint32Array(heap);
		var FLT32 = new stdlib.Float32Array(heap);
		var fround = stdlib.Math.fround;
		var STKTOP = foreign.heapSize|0;
		var MEMSIZ = foreign.heapSize|0;
		var MEMTOP = 0;

		/* -- FUNCTIONS -- */

// **********************************************************************
// ***************************** MEMORY *********************************
// **********************************************************************

		/* MEMORY MANAGEMENT & GARBAGE COLLECTION */

		function available() {
			return (STKTOP - MEMTOP)|0;
		}

		function collectGarbage() {
			STKTOP = (STKTOP - 4)|0;
			MEM32[STKTOP >> 2] = makeBusy(STKTOP)|0;
			mark((MEMSIZ - 4)|0);
			update();
			crunch();
			zap();
		}

		function mark(pos) {
			pos = pos|0;
			var cel = 0;
			var ptr = 0;
			var len = 0;
			for(;;) {
				cel = MEM32[pos >> 2]|0;
				switch(cel & 0x3) { //last 2 bits
					case 0x0: //bp
						ptr = cel;
						cel = MEM32[ptr >> 2]|0;
						switch (cel & 0x7) { //last 3 bits
							case 0x0: //rbp
								MEM32[ptr >> 2] = makeBusy(pos)|0;
								MEM32[pos >> 2] = cel;
								len = headerSize(cel)|0;
								pos = (len ? (ptr + (len<<2))|0 : (pos - 4)|0);
								continue;
							case 0x2: //rBp
							case 0x6: //RBp
								ptr = makeFree(cel)|0;
								cel = MEM32[ptr >> 2]|0;
							case 0x4: //Rbp
								MEM32[ptr >> 2] = makeBusy(pos)|0;
								MEM32[pos >> 2] = cel;
								pos = (pos - 4)|0;
						}
						continue; 
					case 0x2: //Bp
						pos = makeFree(cel)|0;
						if((pos|0) == (STKTOP|0))
							return;
					case 0x1: //bP
					case 0x3: //BP
						pos = (pos - 4)|0;
				}
			}
		}

		function update() {
			var src = 0;
			var dst = 0;
			var cel = 0;
			var ptr = 0;
			var len = 0;
			var siz = 0;
			var cur = 0;
			while((src|0) < (MEMTOP|0)) {
				cel = MEM32[src >> 2]|0;
				if(cel & 0x2) { //marked chunk
					do {				
						ptr = cel;
						cel = MEM32[ptr >> 2]|0;
						MEM32[ptr >> 2] = dst;
					} while(cel & 0x2);
					MEM32[src >> 2] = makeBusy(cel)|0;
					len = ((headerSize(cel)|0)+1) << 2;				
					src = (src + len)|0;
					dst = (dst + len)|0;
				} else { //unmarked chunk
					siz = ((headerSize(cel)|0)+1) << 2;
					for(cur = (src+siz)|0; 
						(cur|0) < (MEMTOP|0);
						cur = (cur+len)|0, siz = (siz+len)|0) {
						cel = MEM32[cur >> 2]|0;
						if(cel & 0x2) break; //busy
						len = ((headerSize(cel)|0)+1) << 2;
						if(((siz+len)|0) > 0x3FFFFFC) break; //size overflow
					}
					MEM32[src >> 2] = makeHeader(0,((siz>>2)-1)|0)|0;
					src = (src + siz)|0;
				}
			}
		}

		function crunch() {
			var src = 0;
			var dst = 0;
			var len = 0;
			var cel = 0;
			while((src|0) < (MEMTOP|0)) {
				cel = MEM32[src>>2]|0;
				len = headerSize(cel)|0;
				if(cel & 0x2) { //busy
					MEM32[dst>>2] = makeFree(cel)|0;
					src=(src+4)|0;
					dst=(dst+4)|0;
					for(;(len|0)>0;len=(len-1)|0) {
						MEM32[dst>>2] = MEM32[src>>2];
						src=(src+4)|0;					
						dst=(dst+4)|0;
					}
				} else {
					len = (len + 1) << 2;
					src = (src + len)|0;
				}
			}
			MEMTOP = dst;
		}


		/* CELLS */

		function makeHeader(tag, siz) {
			tag = tag|0;
			siz = siz|0;
			var hdr = 0;
			hdr = (siz << 6)|tag;
			return (hdr << 2)|0; 
		}

		function headerSize(hdr) {
			hdr = hdr|0;
			return (hdr >>> 8)|0;
		}

		function makeFree(ofs) {
			ofs = ofs|0;
			return (ofs & 0xFFFFFFFD)|0;
		}

		function makeBusy(ofs) {
			ofs = ofs|0;
			return (ofs | 0x2)|0;
		}

		function makeImmediate(val) {
			val = val|0;
			return ((val<<1)|0x1)|0; 
		}

		/* IMMEDIATES */

		function isImmediate(exp) {
			exp = exp|0;
			return (exp & 0x1)|0;
		}

		function immediateVal(exp) {
			exp = exp|0;
			return (exp >> 1)|0;
		}

		/* CHUNKS */

		function makeChunk(tag, siz) {
			tag = tag|0;
			siz = siz|0;
			var adr = 0;
			adr = MEMTOP;
			MEMTOP = (MEMTOP + ((siz+1) << 2))|0;
			MEM32[adr >> 2] = makeHeader(tag, siz)|0;
			return adr|0;
		}
		
		function chunkTag(ptr) {
			ptr = ptr|0;
			var hdr = 0;
			hdr = MEM32[ptr >> 2]|0;
			return ((hdr >>> 2) & 0x3F)|0;
		}

		function chunkSize(ptr) {
			ptr = ptr|0;
			var hdr = 0;
			hdr = MEM32[ptr >> 2]|0;
			return headerSize(hdr)|0;
		}

		function chunkGet(ptr, idx) {
			ptr = ptr|0;
			idx = idx|0;
			return MEM32[(ptr + idx) >> 2]|0;
		}

		function chunkGetByte(ptr, idx) {
			ptr = ptr|0;
			idx = idx|0;
			return MEM8[(ptr + idx)|0]|0;
		}
		
		function chunkGetFloat(ptr, idx) {
			ptr = ptr|0;
			idx = idx|0;
			return fround(FLT32[(ptr + idx) >> 2]);
		}

		function chunkSet(ptr, idx, val) {
			ptr = ptr|0;
			idx = idx|0;
			val = val|0;
			MEM32[(ptr + idx) >> 2] = val|0;
		}	

		function chunkSetByte(ptr, idx, byt) {
			ptr = ptr|0;
			idx = idx|0;
			byt = byt|0;
			MEM8[(ptr + idx)|0] = byt;
		}

		function chunkSetFloat(ptr, idx, flt) {
			ptr = ptr|0;
			idx = idx|0;
			flt = fround(flt);
			FLT32[(ptr + idx) >> 2] = flt;
		}

		/* STACK */

		function push(el) {
			el = el|0;
			STKTOP = (STKTOP - 4)|0;
			MEM32[STKTOP >> 2] = el;
		}

		function pop() {
			var tmp = 0;
			tmp = MEM32[STKTOP >> 2]|0;
			STKTOP = (STKTOP + 4)|0;
			return tmp|0;
		}

		function peek() {
			return MEM32[STKTOP >> 2]|0;
		}

		function poke(el) {
			el = el|0;
			MEM32[STKTOP >> 2] = el;
		}

		function zap() {
			STKTOP = (STKTOP + 4)|0;
		}

		function emptyStk() {
			STKTOP = MEMSIZ;
		}

// **********************************************************************
// ************************* ABSTRACT GRAMMAR ***************************
// **********************************************************************

	// NOTE: cfr. tag definitions in macros.sjs

	/*  31 BITS FOR IMMEDIATE VALUES 
		[0x00000000 - 0x3ffffe00[ :: SIGNED SMALLINT
		[0x3ffffe00 - 0x3fffff00[ :: ASCII CHARACTER
		[0x3fffff00 - 0x3ffffffc[ :: NATIVE POINTER
		[0x3ffffffc - 0x3fffffff] :: SPECIAL VALUE */

		/* -- CONSTANTS -- */
		define falseVal 0
		define trueVal 1
		define nullVal 2
		define voidVal 3
		define specialMask 0x3
		define byteMask 0xff
		define maxImm 0x3fffffff
		define maxNum 0x3ffffe00
		define maxChr 0x3fffff00
		define maxNat 0x3ffffffc

		function tag(exp) {
			exp = exp|0;
			var val = 0;
			if(isImmediate(exp)|0) {
				val = immediateVal(exp)|0;
				if ((val|0) < maxNum) 		//signed smallint
					return __NUMBER_TAG__
				else if ((val|0) < maxChr) 	//character
					return __CHAR_TAG__
				else if ((val|0) < maxNat) 	//native pointer
					return __NATIVE_TAG__
				else  					//special value
					switch (val & specialMask) {
						case falseVal: return __FALSE_TAG__
						case trueVal: return __TRUE_TAG__
						case nullVal: return __NULL_TAG__
						case voidVal: return __VOID_TAG__
					}
		 	}
			return chunkTag(exp)|0;
		}

		/*==================*/
		/* -- IMMEDIATES -- */
		/*==================*/

		/* ---- CHARS ---- */

		function makeChar(charCode) {
			charCode = charCode|0;
			return makeImmediate(maxNum | charCode)|0;
		}

		function charCode(ch) {
			ch = ch|0;
			return (immediateVal(ch)|0) & byteMask; 
		}

		typecheck __CHAR_TAG__ => isChar

		/* ---- SPECIAL VALUES ---- */

		typecheck __TRUE_TAG__ => isTrue
		typecheck __FALSE_TAG__ => isFalse
		typecheck __VOID_TAG__ => isVoid
		typecheck __NULL_TAG__ => isNull

		/* ---- SMALL INTEGERS/NUMBERS ---- */

		function makeNumber(nbr) {
			nbr = nbr|0;
			return makeImmediate(nbr)|0;
		}

		function numberVal(exp) {
			exp = exp|0;
			return immediateVal(exp)|0;
		}

		typecheck __NUMBER_TAG__ => isNumber

		/* ---- NATIVES ----- */

		function makeNative(nat) {
			nat = nat|0;
			return makeImmediate(maxChr | nat)|0;
		}

		function nativePtr(nat) {
			nat = nat|0;
			return (immediateVal(nat)|0) & byteMask;
		}

		typecheck __NATIVE_TAG__ => isNative

		/*==================*/
		/* ---- CHUNKS ---- */
		/*==================*/

		/* ---- PAIR ---- */

		define __PAIR_SIZ__ 2
		define __PAIR_CAR__ 4
		define __PAIR_CDR__ 8

		function makePair(car, cdr) {
			car = car|0;
			cdr = cdr|0;
			var pair = 0;
			pair = makeChunk(__PAIR_TAG__, __PAIR_SIZ__)|0;
			chunkSet(pair, __PAIR_CAR__, car);
			chunkSet(pair, __PAIR_CDR__, cdr);
			return pair|0;
		}

		function pairCar(ptr) {
			ptr = ptr|0;
			return chunkGet(ptr, __PAIR_CAR__)|0;
		}

		function pairCdr(ptr) {
			ptr = ptr|0;
			return chunkGet(ptr, __PAIR_CDR__)|0;
		}

		function pairSetCar(ptr, exp) {
			ptr = ptr|0;
			exp = exp|0;
			chunkSet(ptr, __PAIR_CAR__, exp);
		}

		function pairSetCdr(ptr, exp) {
			ptr = ptr|0;
			exp = exp|0;
			chunkSet(ptr, __PAIR_CDR__, exp);
		}

		typecheck __PAIR_TAG__ => isPair

		/* ---- PROCEDURE ---- */

		define __PROCEDURE_SIZ__ 3
		define __PROCEDURE_PAR__ 4
		define __PROCEDURE_BDY__ 8
		define __PROCEDURE_ENV__ 12

		function makeProcedure(par, bdy, env) {
			par = par|0;
			bdy = bdy|0;
			env = env|0;
			var fun = 0;
			fun = makeChunk(__PROCEDURE_TAG__, __PROCEDURE_SIZ__)|0;
			chunkSet(fun, __PROCEDURE_PAR__, par);
			chunkSet(fun, __PROCEDURE_BDY__, bdy);
			chunkSet(fun, __PROCEDURE_ENV__, env);
			return fun|0;
		}

		function procedurePar(exp) {
			exp = exp|0;
			return chunkGet(exp, __PROCEDURE_PAR__)|0;
		}

		function procedureBdy(exp) {
			exp = exp|0;
			return chunkGet(exp, __PROCEDURE_BDY__)|0;
		}

		function procedureEnv(exp) {
			exp = exp|0;
			return chunkGet(exp, __PROCEDURE_ENV__)|0;
		}

		typecheck __PROCEDURE_TAG__ => isProcedure

		/* ---- VECTOR ---- */

		function makeVector(siz) {
			siz = siz|0;
			return makeChunk(__VECTOR_TAG__, siz)|0;
		}

		function fillVector(siz, exp) {
			siz = siz|0;
			exp = exp|0;
			var vct = 0;
			var idx = 0;
			vct = makeChunk(__VECTOR_TAG__, siz)|0;
			for(idx = 1; (idx|0) <= (siz|0); idx=(idx+1)|0)
				chunkSet(vct, idx<<2, exp);
			return vct|0;
		}

		function vectorRef(vct, idx) {
			vct = vct|0;
			idx = idx|0;
			return chunkGet(vct, idx<<2)|0;
		}

		function vectorSet(vct, idx, val) {
			vct = vct|0;
			idx = idx|0;
			val = val|0;
			chunkSet(vct, idx<<2, val);
		}

		function vectorLength(vct) {
			vct = vct|0;
			return chunkSize(vct)|0;
		}

		typecheck __VECTOR_TAG__ => isVector	

		/* ---- SEQUENCE ---- */

		function makeSequence(siz) {
			siz = siz|0;
			return makeChunk(__SEQUENCE_TAG__, siz)|0;
		}

		function sequenceAt(seq, idx) {
			seq = seq|0;
			idx = idx|0;
			return chunkGet(seq, idx<<2)|0;
		}

		function sequenceSet(seq, idx, val) {
			seq = seq|0;
			idx = idx|0;
			val = val|0;
			chunkSet(seq, idx<<2, val);
		}

		function sequenceLength(seq) {
			seq = seq|0;
			return chunkSize(seq)|0;
		}

		typecheck __SEQUENCE_TAG__ => isSequence

		/* ---- IFS ---- */

		define __IFS_SIZ__ 2
		define __IFS_PRE__ 4
		define __IFS_CON__ 8

		function makeIfs(pred, conseq) {
			pred = pred|0;
			conseq = conseq|0;
			var ifs = 0;
			ifs = makeChunk(__IFS_TAG__, __IFS_SIZ__)|0;
			chunkSet(ifs, __IFS_PRE__, pred);
			chunkSet(ifs, __IFS_CON__, conseq);
			return ifs|0;
		}

		function ifsPredicate(ifs) {
			ifs = ifs|0;
			return chunkGet(ifs, __IFS_PRE__)|0;
		}

		function ifsConsequence(ifs) {
			ifs = ifs|0;
			return chunkGet(ifs, __IFS_CON__)|0;
		}

		typecheck __IFS_TAG__ => isIfs

		/* ---- IFF ---- */

		define __IFF_SIZ__ 3
		define __IFF_PRE__ 4
		define __IFF_CON__ 8
		define __IFF_ALT__ 12

		function makeIff(pred, conseq, alter) {
			pred = pred|0;
			conseq = conseq|0;
			alter = alter|0;
			var iff = 0;
			iff = makeChunk(__IFF_TAG__, __IFF_SIZ__)|0;
			chunkSet(iff, __IFF_PRE__, pred);
			chunkSet(iff, __IFF_CON__, conseq);
			chunkSet(iff, __IFF_ALT__, alter);
			return iff|0;
		}

		function iffPredicate(iff) {
			iff = iff|0;
			return chunkGet(iff, __IFF_PRE__)|0;
		}

		function iffConsequence(iff) {
			iff = iff|0;
			return chunkGet(iff, __IFF_CON__)|0;
		}

		function iffAlternative(iff) {
			iff = iff|0;
			return chunkGet(iff, __IFF_ALT__)|0;
		}

		typecheck __IFF_TAG__ => isIff

		/* ---- QUO ---- */

		define __QUO_SIZ__ 1
		define __QUO_EXP__ 4

		function makeQuo(exp) {
			exp = exp|0;
			var quo = 0;
			quo = makeChunk(__QUO_TAG__, __QUO_SIZ__)|0;
			chunkSet(quo, __QUO_EXP__, exp);
			return quo|0;
		}

		function quoExpression(quo) {
			quo = quo|0;
			return chunkGet(quo, __QUO_EXP__)|0;
		}

		typecheck __QUO_TAG__ => isQuo

		/* ---- LAMBDA ---- */

		define __LAMBDA_SIZ__ 2
		define __LAMBDA_ARG__ 4
		define __LAMBDA_BDY__ 8

		function makeLambda(arg, bdy) {
			arg = arg|0;
			bdy = bdy|0;
			var lmb = 0;
			lmb = makeChunk(__LAMBDA_TAG__, __LAMBDA_SIZ__)|0;
			chunkSet(lmb, __LAMBDA_ARG__, arg);
			chunkSet(lmb, __LAMBDA_BDY__, bdy);
			return lmb|0;
		}

		function lambdaArg(lmb) {
			lmb = lmb|0;
			return chunkGet(lmb, __LAMBDA_ARG__)|0;
		}

		function lambdaBdy(lmb) {
			lmb = lmb|0;
			return chunkGet(lmb, __LAMBDA_BDY__)|0;
		}

		typecheck __LAMBDA_TAG__ => isLambda

		/* ---- DEFINE VARIABLE ---- */

		define __DFV_SIZ__ 2
		define __DFV_VAR__ 4
		define __DFV_VAL__ 8

		function makeDfv(vrb, val) {
			vrb = vrb|0;
			val = val|0;
			var dfv = 0;
			dfv = makeChunk(__DFV_TAG__, __DFV_SIZ__)|0;
			chunkSet(dfv, __DFV_VAR__, vrb);
			chunkSet(dfv, __DFV_VAL__, val);
			return dfv|0;
		}

		function dfvVariable(dfv) {
			dfv = dfv|0;
			return chunkGet(dfv, __DFV_VAR__)|0;
		}

		function dfvValue(dfv) {
			dfv = dfv|0;
			return chunkGet(dfv, __DFV_VAL__)|0;
		}

		typecheck __DFV_TAG__ => isDfv

		/* ---- DEFINE FUNCTION ---- */

		define __DFF_SIZ__ 3
		define __DFF_VAR__ 4
		define __DFF_ARG__ 8
		define __DFF_BDY__ 12

		function makeDff(vrb, arg, bdy) {
			vrb = vrb|0;
			arg = arg|0;
			bdy = bdy|0;
			var dff = 0;
			dff = makeChunk(__DFF_TAG__, __DFF_SIZ__)|0;
			chunkSet(dff, __DFF_VAR__, vrb);
			chunkSet(dff, __DFF_ARG__, arg);
			chunkSet(dff, __DFF_BDY__, bdy);
			return dff|0;
		}

		function dffVariable(dff) {
			dff = dff|0;
			return chunkGet(dff, __DFF_VAR__)|0;
		}

		function dffArguments(dff) {
			dff = dff|0;
			return chunkGet(dff, __DFF_ARG__)|0;
		}

		function dffBody(dff) {
			dff = dff|0;
			return chunkGet(dff, __DFF_BDY__)|0;
		}

		typecheck __DFF_TAG__ => isDff

		/* ---- SET ---- */

		define __SET_SIZ__ 2
		define __SET_VAR__ 4
		define __SET_VAL__ 8

		function makeSet(vrb, val) {
			vrb = vrb|0;
			val = val|0;
			var set = 0;
			set = makeChunk(__SET_TAG__, __SET_SIZ__)|0;
			chunkSet(set, __SET_VAR__, vrb);
			chunkSet(set, __SET_VAL__, val);
			return set|0;
		}

		function setVariable(set) {
			set = set|0;
			return chunkGet(set, __SET_VAR__)|0;
		}

		function setValue(set) {
			set = set|0;
			return chunkGet(set, __SET_VAL__)|0;
		}

		typecheck __SET_TAG__ => isSet

		/* ---- APPLICATION ---- */

		define __APPLICATION_SIZ__ 2
		define __APPLICATION_OPR__ 4
		define __APPLICATION_OPD__ 8

		function makeApplication(opr, opd) {
			opr = opr|0;
			opd = opd|0;
			var apl = 0;
			apl = makeChunk(__APPLICATION_TAG__, __APPLICATION_SIZ__)|0;
			chunkSet(apl, __APPLICATION_OPR__, opr);
			chunkSet(apl, __APPLICATION_OPD__, opd);
			return apl|0;
		}

		function aplOperator(apl) {
			apl = apl|0;
			return chunkGet(apl, __APPLICATION_OPR__)|0;
		}

		function aplOperands(apl) {
			apl = apl|0;
			return chunkGet(apl, __APPLICATION_OPD__)|0;
		}

		typecheck __APPLICATION_TAG__ => isApplication

		/*================*/
		/* ---- RAWS ---- */
		/*================*/

		/* --- FLOATS --- */

		define __FLOAT_SIZ__ 1
		define __FLOAT_NBR__ 4

		function makeFloat(nbr) {
			nbr = fround(nbr);
			var flt = 0;
			flt = makeChunk(__FLOAT_TAG__, __FLOAT_SIZ__)|0;
			chunkSetFloat(flt, __FLOAT_NBR__, nbr);
			return flt|0;
		}


		function floatNumber(flt) {
			flt = flt|0;
			return fround(chunkGetFloat(flt, __FLOAT_NBR__));
		}

		typecheck __FLOAT_TAG__ => isFloat

		/* --- TEXT --- */

		function makeText(tag, len) {
			tag = tag|0;
			len = len|0;
			var chk = 0;
			var siz = 0;
			for(siz = len; siz&0x3; siz=(siz+1)|0); 
			chk = (makeChunk(tag, siz>>2)|0);
			for(len = (len+4)|0, siz = (siz+4)|0;
				(len|0) < (siz|0);
				len = (len + 1)|0)
				chunkSetByte(chk, len, 0);
			return chk|0;
		}

		function textSetChar(txt, idx, chr) {
			txt = txt|0;
			idx = idx|0;
			chr = chr|0;
			chunkSetByte(txt, (idx+4)|0, chr);
		}

		function textGetChar(txt, idx) {
			txt = txt|0;
			idx = idx|0;
			return chunkGetByte(txt, (idx+4)|0)|0;
		}

		function textLength(txt) {
			txt = txt|0;
			var len = 0;
			len = (chunkSize(txt)|0) << 2;
			if (len)
				for(;!(chunkGetByte(txt, (len+3)|0)|0);len=(len-1)|0);
			return len|0;
		}

		/* --- STRINGS --- */

		function makeString(len) {
			len = len|0;
			return makeText(__STRING_TAG__, len)|0;
		}

		//stringAt === textGetChar
		//stringSet === textSetChar
		//stringLength === textLength
		//stringText === decodeText

		typecheck __STRING_TAG__ => isString

		/* --- SYMBOLS --- */

		function makeSymbol(len) {
			len = len|0;
			return makeText(__SYMBOL_TAG__, len)|0;
		}

		//symbolText === decodeText

		typecheck __SYMBOL_TAG__ => isSymbol


	/* -- EXPORTS -- */

		return { 

			/**************/
			/*** MEMORY ***/
			/**************/

			available: available,
			collectGarbage: collectGarbage,
			emptyStk: emptyStk,
			push: push,
			peek: peek,
			poke: poke,
			pop: pop,
			zap: zap,

			/************************/
			/*** ABSTRACT GRAMMAR ***/
			/************************/

			//tag
			tag: tag,
			//specials
			isTrue: isTrue,
			isFalse: isFalse,
			isNull: isNull,
			isVoid: isVoid,
			//numbers
			makeNumber: makeNumber,
			numberVal: numberVal,
			isNumber: isNumber,
			//characters
			makeChar: makeChar,
			charCode: charCode,
			isChar: isChar,
			//pairs
			makePair: makePair,
			pairCar: pairCar,
			pairCdr: pairCdr,
			pairSetCar: pairSetCar,
			pairSetCdr: pairSetCdr,
			isPair: isPair,
			//procedures
			makeProcedure: makeProcedure,
			procedurePar: procedurePar,
			procedureBdy: procedureBdy,
			procedureEnv: procedureEnv,
			isProcedure: isProcedure,
			//vectors
			makeVector: makeVector,
			fillVector: fillVector,
			vectorRef: vectorRef,
			vectorSet: vectorSet,
			vectorLength: vectorLength,
			isVector: isVector,
			//floats
			makeFloat: makeFloat,
			floatNumber: floatNumber,
			isFloat: isFloat,
			//texts
			makeString: makeString,
			makeSymbol: makeSymbol,
			textGetChar: textGetChar,
			textSetChar: textSetChar,
			textLength: textLength,
			isString: isString,
			isSymbol: isSymbol,
			//natives
			makeNative: makeNative,
			nativePtr: nativePtr,
			isNative: isNative,
			//sequences
			makeSequence: makeSequence,
			sequenceAt: sequenceAt,
			sequenceSet: sequenceSet,
			sequenceLength: sequenceLength,
			isSequence: isSequence,
			//single if-statements
			makeIfs: makeIfs,
			ifsPredicate: ifsPredicate,
			ifsConsequence: ifsConsequence,
			isIfs: isIfs,
			//full if-statements
			makeIff: makeIff,
			iffPredicate: iffPredicate,
			iffConsequence: iffConsequence,
			iffAlternative: iffAlternative,
			isIff: isIff,
			//quotes
			makeQuo: makeQuo,
			quoExpression: quoExpression,
			isQuo: isQuo,
			//lambdas
			makeLambda: makeLambda,
			lambdaArg: lambdaArg,
			lambdaBdy: lambdaBdy,
			isLambda: isLambda,
			//variable definitions
			makeDfv: makeDfv,
			dfvVariable: dfvVariable,
			dfvValue: dfvValue,
			isDfv: isDfv,
			//function definitions
			makeDff: makeDff,
			dffVariable: dffVariable,
			dffBody: dffBody,
			dffArguments: dffArguments,
			isDff: isDff,
			//assignments
			makeSet: makeSet,
			setVariable: setVariable,
			setValue: setValue,
			isSet: isSet,
			//applications
			makeApplication: makeApplication,
			aplOperator: aplOperator,
			aplOperands: aplOperands,
			isApplication: isApplication
		};
	}

	/* --- INITIALISATION --- */

	define __DEFAULT_MEM__ 24

	var memSiz = 0x1 << __DEFAULT_MEM__;
	var buffer = new ArrayBuffer(memSiz);
	var foreign = { heapSize: memSiz };
	var grammar = ASM_MEMORY(window, foreign, buffer);

	/* --- CONVENIENT STRING OPERATIONS --- */

	var makeString = grammar.makeString;
	var makeSymbol = grammar.makeSymbol;
	var textGetChar = grammar.textGetChar;
	var textSetChar = grammar.textSetChar;
	var textLength = grammar.textLength;

	function buildString(txt) {
		var len = txt.length;
		var str = makeString(len);
		for(var i = 0; i < len; ++i)
			textSetChar(str, i, txt.charCodeAt(i));
		return str;
	}

	function buildSymbol(txt) {
		var len = txt.length;
		var sym = makeSymbol(len);
		for(var i = 0; i < len; ++i)
			textSetChar(sym, i, txt.charCodeAt(i));
		return sym;
	}

	function decodeText(chk) {
		var len = textLength(chk);
		var arr = new Array(len);
		for(var i = 0; i < len; ++i)
			arr[i] = textGetChar(chk, i);
		return String.fromCharCode.apply(null, arr);
	}

	grammar.buildString = buildString;
	grammar.stringAt = textGetChar;
	grammar.stringSet = textSetChar;
	grammar.stringLength = textLength;
	grammar.stringText = decodeText;

	grammar.buildSymbol = buildSymbol;
	grammar.symbolText = decodeText;

  	/* --- TEMPORARY FIX FOR BACKWARDS COMPATIBILITY --- */

	grammar.__EMPTY_VEC__ = grammar.makeVector(0);

	/* ---- EXPORTS ---- */

	return grammar;
}