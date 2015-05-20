/* --- MEMORY & ABSTRACT GRAMMAR --- */

function SLIP(callbacks, size) {
	"use strict";

	/* -- POINTER STRUCTURES -- */
	define __PAIR_TAG__ 0x00
	define __VECTOR_TAG__ 0x02
	define __PROCEDURE_TAG__ 0x04
	define __SEQUENCE_TAG__ 0x06
	define __IFS_TAG__ 0x08
	define __IFF_TAG__ 0x0A
	define __DFV_TAG__ 0x0C
	define __DFF_TAG__ 0x0E
	define __APPLICATION_TAG__ 0x10
	define __LAMBDA_TAG__ 0x12
	define __SET_TAG__ 0x14
	define __QUO_TAG__ 0x16
	define __CONTINUATION_TAG__ 0x18

	/* -- RAW CHUNKS -- */
	define __FLOAT_TAG__ 0x01
	define __SYMBOL_TAG__ 0x03
	define __STRING_TAG__ 0x05

	/* -- IMMEDIATES -- */
	//(tags > maxTag = 0x3f)
	define __CHAR_TAG__ 0x40
	define __TRUE_TAG__ 0x41
	define __FALSE_TAG__ 0x42
	define __VOID_TAG__ 0x43
	define __NULL_TAG__ 0x44
	define __NUMBER_TAG__ 0x45
	define __NATIVE_TAG__ 0x46

	/* -- CONSTANT VALUES -- */
	define __FALSE__ 0x7ffffff9
	define __TRUE__ 0x7ffffffb
	define __NULL__ 0x7ffffffd
	define __VOID__ 0x7fffffff
	define __ZERO__ 0x1
	define __ONE__ 0x3

	function SLIP_ASM(stdlib, foreign, heap) {
		"use asm"

		/* -- IMPORTS & VARIABLES -- */

		//memory
		var MEM8 = new stdlib.Uint8Array(heap);
		var MEM32 = new stdlib.Uint32Array(heap);
		var FLT32 = new stdlib.Float32Array(heap);
		var STKTOP = foreign.heapSize|0;
		var MEMSIZ = foreign.heapSize|0;
		var MEMTOP = 0;

		//math
		var fround = stdlib.Math.fround;
		var imul = stdlib.Math.imul;

		//registers
		var ADR = 0;
		var ARG = 0;
		var BND = 0;
		var DCT = 0;
		var ENV = 0;
		var EXP = 0;
		var FRM = 0;
		var FLT = fround(0.0);
		var GLB = 0;
		var IDX = 0;
		var KON = 0;
		var LEN = 0;
		var LST = 0;
		var PAR = 0;
		var PAT = 0;
		var SEQ = 0;
		var SYM = 0;
		var TMP = 0;
		var VAL = 0;

		//reader
		var look = foreign.look;
		var skip = foreign.skip;
		var read = foreign.read;
		var readSymbol = foreign.readSymbol;
		var readString = foreign.readString;
		var readNumber = foreign.readNumber;

		//errors
		var err_expectedRBR = foreign.expectedRBR;
		var err_invalidSyntax = foreign.invalidSyntax;
		var err_invalidIf = foreign.invalidIf;
		var err_invalidSequence = foreign.invalidSequence;
		var err_invalidQuote = foreign.invalidQuote;
		var err_invalidDefine = foreign.invalidDefine;
		var err_invalidAssignment = foreign.invalidAssignment;
		var err_invalidLambda = foreign.invalidLambda;
		var err_invalidApplication = foreign.invalidApplication;
		var err_undefinedVariable = foreign.undefinedVariable;
		var err_invalidParamCount = foreign.invalidParamCount;
		var err_invalidOperator = foreign.invalidOperator;
		var err_invalidExpression = foreign.invalidExpression;
		var err_invalidArgument = foreign.invalidArgument;
		var err_invalidLength = foreign.invalidLength;
		var err_invalidRange = foreign.invalidRange;
		var err_fatalMemory = foreign.fatalMemory;

		//pool
		define __POOL_INC__ 64
		var __POOL_TOP__ = 0;
		var __POOL_SIZ__ = 0;

		//timer
		var clock = foreign.clock;
		var reset = foreign.reset;

		//symbols
		var __QUO_SYM__ = 0;
		var __VEC_SYM__ = 0;
		var __DEF_SYM__ = 0;
		var __LMB_SYM__ = 0;
		var __IFF_SYM__ = 0;
		var __BEG_SYM__ = 0;
		var __SET_SYM__ = 0;
		var loadQuo = foreign.loadQuo;
		var loadVec = foreign.loadVec;
		var loadDef = foreign.loadDef;
		var loadLmb = foreign.loadLmb;
		var loadIff = foreign.loadIff;
		var loadBeg = foreign.loadBeg;
		var loadSet = foreign.loadSet;
		var loadPls = foreign.loadPls;
		var loadMns = foreign.loadMns;
		var loadMul = foreign.loadMul;
		var loadDiv = foreign.loadDiv;
		var loadCns = foreign.loadCns;
		var loadCar = foreign.loadCar;
		var loadCdr = foreign.loadCdr;
		var loadSca = foreign.loadSca;
		var loadScd = foreign.loadScd;
		var loadLst = foreign.loadLst;
		var loadNeq = foreign.loadNeq;
		var loadSma = foreign.loadSma;
		var loadLrg = foreign.loadLrg;
		var loadLeq = foreign.loadLeq;
		var loadSeq = foreign.loadSeq;
		var loadAss = foreign.loadAss;
		var loadMap = foreign.loadMap;
		var loadVcm = foreign.loadVcm;
		var loadVcr = foreign.loadVcr;
		var loadVcs = foreign.loadVcs;
		var loadVcl = foreign.loadVcl;
		var loadEqu = foreign.loadEqu;
		var loadEql = foreign.loadEql;
		var loadEva = foreign.loadEva;
		var loadApl = foreign.loadApl;
		var loadRea = foreign.loadRea;
		var loadLoa = foreign.loadLoa;
		var loadIpa = foreign.loadIpa;
		var loadInu = foreign.loadInu;
		var loadIsy = foreign.loadIsy;
		var loadIve = foreign.loadIve;
		var loadIst = foreign.loadIst;
		var loadDis = foreign.loadDis;
		var loadNew = foreign.loadNew;
		var loadSre = foreign.loadSre;
		var loadSse = foreign.loadSse;
		var loadSle = foreign.loadSle;
		var loadAvl = foreign.loadAvl;
		var loadCol = foreign.loadCol;
		var loadClk = foreign.loadClk;
		var loadSlp = foreign.loadSlp;
		var loadRnd = foreign.loadRnd;
		var loadErr = foreign.loadErr;
		var loadRst = foreign.loadRst;
		var loadCcc = foreign.loadCcc;

		//IO
		var promptUserInput = foreign.promptUserInput;
		var printNewline = foreign.printNewline;
		var promptInput = foreign.promptInput;
		var printOutput = foreign.printOutput;
		var printLog = foreign.printLog;
		var loadFile = foreign.loadFile;
		var initREPL = foreign.initREPL;

		//custom
		var random = foreign.random;

		//other
		var __EMPTY_VEC__ = 0;

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

		function stkSize() {
			return ((MEMSIZ - STKTOP)|0) >> 2;
		}

		function stackAt(idx) {
			idx = idx|0;
			return MEM32[(STKTOP + idx) >> 2]|0;
		}

// **********************************************************************
// ************************* ABSTRACT GRAMMAR ***************************
// **********************************************************************

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

		//makeNumber === makeImmediate
		//numberVal === immediateVal

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

		function currentStack() {
			var len = 0;
			var idx = 0;
			var vct = 0;
			var cur = 0;
			len = stkSize()|0;
			vct = makeVector(len)|0;
			while((idx|0) < (len|0)) {
				cur = stackAt(idx<<2)|0;
				idx = (idx+1)|0;
				vectorSet(vct, idx, cur);	
			}
			return vct|0;
		}

		function restoreStack(vct) {
			vct = vct|0;
			var len = 0;
			emptyStk();
			for(len=vectorLength(vct)|0;len;len=(len-1)|0)
				push(vectorRef(vct, len)|0)
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

		/* ---- CONTINUATION ---- */

		define __CONTINUATION_KON__ 4
		define __CONTINUATION_FRM__ 8
		define __CONTINUATION_ENV__ 12
		define __CONTINUATION_STK__ 16
 		define __CONTINUATION_SIZ__ 4

		function makeContinuation(kon, frm, env, stk) {
			kon = kon|0;
			frm = frm|0;
			env = env|0;
			stk = stk|0;
			var cnt = 0;
			cnt = makeChunk(__CONTINUATION_TAG__, __CONTINUATION_SIZ__)|0;
			chunkSet(cnt, __CONTINUATION_KON__, kon);
			chunkSet(cnt, __CONTINUATION_FRM__, frm);
			chunkSet(cnt, __CONTINUATION_ENV__, env);
			chunkSet(cnt, __CONTINUATION_STK__, stk);
			return cnt|0;
		}

		function continuationKon(cnt) {
			cnt = cnt|0;
			return chunkGet(cnt, __CONTINUATION_KON__)|0;
		}

		function continuationFrm(cnt) {
			cnt = cnt|0;
			return chunkGet(cnt, __CONTINUATION_FRM__)|0;
		}

		function continuationEnv(cnt) {
			cnt = cnt|0;
			return chunkGet(cnt, __CONTINUATION_ENV__)|0;
		}

		function continuationStk(cnt) {
			cnt = cnt|0;
			return chunkGet(cnt, __CONTINUATION_STK__)|0;
		}

		typecheck __CONTINUATION_TAG__ => isContinuation

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

// **********************************************************************
// ****************************** POOL **********************************
// **********************************************************************

		function initPool() {
			__POOL_TOP__ = 0;
			__POOL_SIZ__ = 64;
			SYM = fillVector(__POOL_SIZ__, __VOID__)|0;
		}

		function growPool() {
			var idx = 0;
			var sym = 0;
			__POOL_SIZ__ = (__POOL_SIZ__ + __POOL_INC__)|0;
			claimSiz(__POOL_SIZ__);
			TMP = fillVector(__POOL_SIZ__, __VOID__)|0;
			while((idx|0) < (__POOL_TOP__|0)) {
				idx = (idx + 1)|0;
				sym = vectorRef(SYM, idx)|0;
				vectorSet(TMP, idx, sym);
			}
			SYM = TMP;
		}

		function poolAt(idx) {
			idx = idx|0;
			return vectorRef(SYM, idx)|0;
		}

		function enterPool(sym) {
			sym = sym|0;
			if ((__POOL_TOP__|0) == (__POOL_SIZ__|0))
				growPool();
			__POOL_TOP__ = (__POOL_TOP__+1)|0;
			vectorSet(SYM, __POOL_TOP__, sym);
			return __POOL_TOP__|0;
		}

		function loadSymbols() {
			__QUO_SYM__ = loadQuo()|0;
			__VEC_SYM__ = loadVec()|0;
			__DEF_SYM__ = loadDef()|0;
			__LMB_SYM__ = loadLmb()|0;
			__IFF_SYM__ = loadIff()|0;
			__BEG_SYM__ = loadBeg()|0;
			__SET_SYM__ = loadSet()|0;
		}

// **********************************************************************
// ***************************** NATIVES ********************************
// **********************************************************************

		function initNatives() {
			addNative(loadLoa()|0, N_load);
			addNative(loadRnd()|0, N_random);
			addNative(loadSle()|0, N_stringLength);
			addNative(loadSse()|0, N_stringSet);
			addNative(loadSre()|0, N_stringRef);
			addNative(loadCcc()|0, N_callcc);
			addNative(loadAvl()|0, N_available);
			addNative(loadCol()|0, N_collect);
			addNative(loadRst()|0, N_reset);
			addNative(loadClk()|0, N_clock);
			addNative(loadIst()|0, N_isString);
			addNative(loadIve()|0, N_isVector);
			addNative(loadIsy()|0, N_isSymbol);
			addNative(loadInu()|0, N_isNull);
			addNative(loadIpa()|0, N_isPair);
			addNative(loadRea()|0, N_read);
			addNative(loadNew()|0, N_newline);
			addNative(loadDis()|0, N_display);
			addNative(loadEva()|0, N_eval);
			addNative(loadApl()|0, N_apply);
			addNative(loadMap()|0, N_map);
			addNative(loadAss()|0, N_assoc);
			addNative(loadVec()|0, N_vector);
			addNative(loadVcl()|0, N_vectorLength);
			addNative(loadVcs()|0, N_vectorSet);
			addNative(loadVcr()|0, N_vectorRef);
			addNative(loadVcm()|0, N_makeVector);
			addNative(loadEql()|0, N_equal);
			addNative(loadEqu()|0, N_eq);
			addNative(loadNeq()|0, N_nbrEq);
			addNative(loadLeq()|0, N_leq);
			addNative(loadSeq()|0, N_seq);
			addNative(loadSma()|0, N_sma);
			addNative(loadLrg()|0, N_lrg);
			addNative(loadLst()|0, N_list);
			addNative(loadScd()|0, N_scd);
			addNative(loadSca()|0, N_sca);
			addNative(loadCdr()|0, N_cdr);
			addNative(loadCar()|0, N_car);
			addNative(loadCns()|0, N_cons);
			addNative(loadDiv()|0, N_div);
			addNative(loadMul()|0, N_multiply);
			addNative(loadPls()|0, N_add);
			addNative(loadMns()|0, N_sub);
		}

		function addNative(nam, ptr) {
			nam = nam|0;
			ptr = ptr|0;
			var nat = 0;
			var bnd = 0;
			nat = makeNative(ptr)|0;
			bnd = makePair(nam, nat)|0;
			FRM = makePair(bnd, FRM)|0;
		}

// **********************************************************************
// ****************************** MAIN **********************************
// **********************************************************************

		function init() {
			initPool();
			loadSymbols();
			FRM = __NULL__;
			ENV = __NULL__;
			GLB = __NULL__;
			EXP = __NULL__;
			VAL = __NULL__;
			LST = __NULL__;
			__EMPTY_VEC__ = makeVector(0)|0;
			initNatives();
		}

		function Slip_REPL() {
			initREPL();
			run(REPL);
		}

		function inputReady() {
			run(R_read);
		}

		define __MARGIN__ 128
		define __UNIT_SIZ__ 4

		function claim() {
			if((available()|0) < __MARGIN__) {
				reclaim();
				if((available()|0) < __MARGIN__)
					err_fatalMemory();
			}
		}

		function claimSiz(amount) {
			amount = amount|0;
			amount = ((imul(amount, __UNIT_SIZ__)|0) + __MARGIN__)|0; 
			if((available()|0) < (amount|0)) {
				reclaim();
				if((available()|0) < (amount|0))
					err_fatalMemory();
			}
		}

		function reclaim() {

			push(SYM);
			push(GLB);
			push(FRM);
			push(ENV);
			push(LST);
			push(ARG);
			push(VAL);
			push(EXP);
			push(__EMPTY_VEC__);

			collectGarbage();

			loadSymbols();
			__EMPTY_VEC__ = pop()|0;
			EXP = pop()|0;
			VAL = pop()|0;
			ARG = pop()|0;
			LST = pop()|0;
			ENV = pop()|0;
			FRM = pop()|0;
			GLB = pop()|0;
			SYM = pop()|0;
		}

// **********************************************************************
// ************************** INSTRUCTIONS ******************************
// **********************************************************************

		define LBR 40
		define RBR 41
		define SHR 35
		define QUO 39
		define DQU 34
		define PLS 43
		define MIN 45
		define DOT 46
		define SLH 92
		define LTT 116 
		define LTF 102

		instructions {

// **********************************************************************
// *************************** NATIVES PT1 ******************************
// **********************************************************************

			N_add {

				VAL = 0;
				while(LEN) {
					LEN = (LEN-1)|0;
					EXP = pairCar(ARG)|0;
					ARG = pairCdr(ARG)|0;
					switch(tag(EXP)|0) {
						case __NUMBER_TAG__:
							VAL = (VAL + (immediateVal(EXP)|0))|0;
							break;
						case __FLOAT_TAG__:
							FLT = fround(fround(VAL|0)+fround(floatNumber(EXP)));
							goto N_addFloats;
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}

				VAL = makeImmediate(VAL)|0;
				goto KON|0;
			}

			N_sub {

				if((LEN|0) == 0) {
					err_invalidParamCount();
					goto error;
				}

				if((LEN|0) == 1) {
					ARG = pairCar(ARG)|0;
					switch(tag(ARG)|0) {
						case __NUMBER_TAG__:
							VAL = makeImmediate(-(immediateVal(ARG)|0)|0)|0;
							goto KON|0;
						case __FLOAT_TAG__:
							claim();
							VAL = makeFloat(fround(-fround(floatNumber(ARG))))|0;
							goto KON|0;
						default:
							err_invalidArgument(ARG|0);
							goto error;
					}	
				}

				VAL = pairCar(ARG)|0;
				ARG = pairCdr(ARG)|0;
				LEN = (LEN - 1)|0;
				switch(tag(VAL)|0) {
					case __NUMBER_TAG__:
						VAL = immediateVal(VAL)|0;
						while(LEN) {
							LEN = (LEN - 1)|0;
							EXP = pairCar(ARG)|0;
							ARG = pairCdr(ARG)|0;
							switch(tag(EXP)|0) {
								case __NUMBER_TAG__:
									VAL = (VAL - (immediateVal(EXP)|0))|0;
									break;
								case __FLOAT_TAG__:
									FLT = fround(fround(VAL|0) - fround(floatNumber(EXP)));
									goto N_substractFloats;
								default:
									err_invalidArgument(EXP|0);
									goto error;
							}
						}
						VAL = makeImmediate(VAL)|0;
						goto KON|0;

					case __FLOAT_TAG__:
						FLT = fround(floatNumber(VAL));
						goto N_substractFloats;
				}

				err_invalidArgument(VAL|0);
				goto error;
			}

			N_multiply {

				VAL = 1;
				while(LEN) {
					LEN = (LEN-1)|0;
					EXP = pairCar(ARG)|0;
					ARG = pairCdr(ARG)|0;
					switch(tag(EXP)|0) {
						case __NUMBER_TAG__:
							VAL = imul(VAL, immediateVal(EXP)|0)|0;
							break;
						case __FLOAT_TAG__:
							FLT = fround(fround(VAL|0)*fround(floatNumber(EXP)));
							goto N_multiplyFloats;
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}

				VAL = makeImmediate(VAL)|0;
				goto KON|0;
			}

			N_div {

				if((LEN|0) == 0) {
					err_invalidParamCount();
					goto error;
				}

				claim();

				if((LEN|0) == 1) {
					ARG = pairCar(ARG)|0;
					switch(tag(ARG)|0) {
						case __NUMBER_TAG__:
							VAL = makeFloat(fround(fround(1.0)/fround(immediateVal(ARG)|0)))|0;
							goto KON|0;
						case __FLOAT_TAG__:
							VAL = makeFloat(fround(fround(1.0)/fround(floatNumber(ARG))))|0;
							goto KON|0;
						default:
							err_invalidArgument(ARG|0);
							goto error;
					}
				}

				VAL = pairCar(ARG)|0;
				ARG = pairCdr(ARG)|0;
				LEN = (LEN - 1)|0;
				switch(tag(VAL)|0) {
					case __NUMBER_TAG__:
						FLT = fround(immediateVal(VAL)|0);
						break;
					case __FLOAT_TAG__:
						FLT = fround(floatNumber(VAL));
						break;
					default:
						err_invalidArgument(VAL|0);
						goto error;
				}

				while(LEN) {
					LEN = (LEN-1)|0;
					EXP = pairCar(ARG)|0;
					ARG = pairCdr(ARG)|0;
					switch(tag(EXP)|0) {
						case __NUMBER_TAG__:
							FLT = fround(FLT/fround(immediateVal(EXP)|0));
							 break;
						case __FLOAT_TAG__:
							FLT = fround(FLT/fround(floatNumber(EXP)));
							break;
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}

				VAL = makeFloat(FLT)|0;
				goto KON|0;
			}

			N_cons {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				pairSetCdr(ARG, pairCar(pairCdr(ARG)|0)|0);
				VAL = ARG;
				goto KON|0;
			}

			N_car {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = pairCar(ARG)|0;
				if(isPair(ARG)|0) {
					VAL = pairCar(ARG)|0;
					goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_cdr {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = pairCar(ARG)|0;
				if(isPair(ARG)|0) {
					VAL = pairCdr(ARG)|0;
					goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_sca {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				VAL = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				if(isPair(ARG)|0) {
					pairSetCar(ARG, VAL);
					goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_scd {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				VAL = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				if(isPair(ARG)|0) {
					pairSetCdr(ARG, VAL);
					goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_list {

				VAL = ARG;
				goto KON|0;
			}

			N_nbrEq {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				switch(tag(ARG)|0) {

					case __NUMBER_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (((immediateVal(ARG)|0) == (immediateVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(immediateVal(ARG)|0) == fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLOAT_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (fround(floatNumber(ARG)) == fround(immediateVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(floatNumber(ARG)) == fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_seq {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				switch(tag(ARG)|0) {

					case __NUMBER_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (((immediateVal(ARG)|0) <= (immediateVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(immediateVal(ARG)|0) <= fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLOAT_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (fround(floatNumber(ARG)) <= fround(immediateVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(floatNumber(ARG)) <= fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_leq {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				switch(tag(ARG)|0) {

					case __NUMBER_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (((immediateVal(ARG)|0) >= (immediateVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(immediateVal(ARG)|0) >= fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLOAT_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (fround(floatNumber(ARG)) >= fround(immediateVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(floatNumber(ARG)) >= fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_sma {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				switch(tag(ARG)|0) {

					case __NUMBER_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (((immediateVal(ARG)|0) < (immediateVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(immediateVal(ARG)|0) < fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLOAT_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (fround(floatNumber(ARG)) < fround(immediateVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(floatNumber(ARG)) < fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_lrg {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				switch(tag(ARG)|0) {

					case __NUMBER_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (((immediateVal(ARG)|0) > (immediateVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(immediateVal(ARG)|0) > fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLOAT_TAG__:
						switch(tag(EXP)|0) {
							case __NUMBER_TAG__:
								VAL = (fround(floatNumber(ARG)) > fround(immediateVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLOAT_TAG__:
								VAL = (fround(floatNumber(ARG)) > fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}
				err_invalidArgument(ARG|0);
				goto error;
			}

			N_assoc {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				VAL = pairCar(ARG)|0;
				LST = pairCar(pairCdr(ARG)|0)|0;

				while(isPair(LST)|0) {
					BND = pairCar(LST)|0;
					if(!(isPair(BND)|0)) {
						err_invalidArgument(BND|0);
						goto error;
					}
					if((pairCar(BND)|0) == (VAL|0)) {
						VAL = BND;
						goto KON|0;
					}
					LST = pairCdr(LST)|0;
				}

				VAL = __FALSE__;
				goto KON|0;
			}

			N_map {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				LEN = 1;
				VAL = pairCar(ARG)|0;
				LST = pairCar(pairCdr(ARG)|0)|0;

				if(isNull(LST)|0) {
					VAL = __NULL__;
					goto KON|0;
				}

				claim();
				ARG = makePair(pairCar(LST)|0, __NULL__)|0;
				LST = pairCdr(LST)|0;
				push(makeImmediate(KON)|0);
				push(__ZERO__);

				if(isNull(LST)|0) {
					KON = N_c1_map;
				} else {
					push(VAL);
					push(LST);
					KON = N_c2_map;
				}

				goto E_apply;
			}

			N_eval {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(ARG)|0;
				push(makeImmediate(KON)|0);
				KON = N_c_eval;
				goto C_compile;
			}

			N_apply {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				VAL = pairCar(ARG)|0;
				ARG = pairCar(pairCdr(ARG)|0)|0;

				for(LST=ARG, LEN=0; isPair(LST)|0; LEN=(LEN+1)|0)
					LST = pairCdr(LST)|0;
				if(!(isNull(LST)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				goto E_apply;
			}

			N_display {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				printLog(pairCar(ARG)|0);
				VAL = __VOID__;
				goto KON|0;
			}

			N_newline {

				printNewline();
				VAL = __VOID__;
				goto KON|0;
			}

			N_read {

				promptUserInput();
				halt;
			}

			N_isPair {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(pairCar(ARG)|0)|0) == __PAIR_TAG__ ? __TRUE__ : __FALSE__ );
				goto KON|0;
			}

			N_isNull {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(pairCar(ARG)|0)|0) == __NULL_TAG__ ? __TRUE__ : __FALSE__ );
				goto KON|0;
			}

			N_isSymbol {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(pairCar(ARG)|0)|0) == __SYMBOL_TAG__ ? __TRUE__ : __FALSE__ );
				goto KON|0;
			}

			N_isVector {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(pairCar(ARG)|0)|0) == __VECTOR_TAG__ ? __TRUE__ : __FALSE__ );
				goto KON|0;
			}

			N_isString {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(pairCar(ARG)|0)|0) == __STRING_TAG__ ? __TRUE__ : __FALSE__ );
				goto KON|0;
			}

			N_makeVector {

				if(!LEN) {
					err_invalidParamCount();
					goto error;
				}

				LST = pairCdr(ARG)|0;
				ARG = pairCar(ARG)|0;

				if(!(isNumber(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				LEN = immediateVal(ARG)|0;
				if ((LEN|0) < 0) {
					err_invalidLength(LEN|0);
					goto error;
				}

				claimSiz(LEN);
				VAL = fillVector(LEN, ((isNull(LST)|0) ? __VOID__ : pairCar(LST)|0))|0;
				goto KON|0;
			}

			N_vectorRef {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				if (!(isVector(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				if(!(isNumber(EXP)|0)) {
					err_invalidArgument(EXP|0);
					goto error;
				}

				IDX = immediateVal(EXP)|0;
				LEN = vectorLength(ARG)|0;
				if(0 <= (IDX|0) & (IDX|0) < (LEN|0)) {
					VAL = vectorRef(ARG, (IDX+1)|0)|0;
					goto KON|0;
				}

				err_invalidRange(IDX|0, 0, (LEN-1)|0);
				goto error;
			}

			N_vectorSet {

				if ((LEN|0) != 3) {
					err_invalidParamCount();
					goto error;
				}

				LST = pairCdr(ARG)|0;
				ARG = pairCar(ARG)|0;
				EXP = pairCar(LST)|0;
				VAL = pairCar(pairCdr(LST)|0)|0;

				if (!(isVector(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				if(!(isNumber(EXP)|0)) {
					err_invalidArgument(EXP|0);
					goto error;
				}

				IDX = immediateVal(EXP)|0;
				LEN = vectorLength(ARG)|0;
				if(0 <= (IDX|0) & (IDX|0) < (LEN|0)) {
					vectorSet(ARG, (IDX+1)|0, VAL);
					goto KON|0;
				}

				err_invalidRange(IDX|0, 0, (LEN-1)|0);
				goto error;
			}

			N_vectorLength {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = pairCar(ARG)|0;
				if(!(isVector(ARG)|0)) {
					err_invalidArgument(ARG|0);
				}

				VAL = makeImmediate(vectorLength(ARG)|0)|0;
				goto KON|0;
			}

			N_vector {

				claimSiz(LEN);
				VAL = makeVector(LEN)|0;
				for(IDX=1; (IDX|0) <= (LEN|0); IDX=(IDX+1)|0, ARG=pairCdr(ARG)|0)
					vectorSet(VAL, IDX, pairCar(ARG)|0);
				goto KON|0;
			}

			N_clock {

				if(LEN) {
					err_invalidParamCount();
					goto error;
				}

				VAL = makeImmediate(clock()|0)|0;
				goto KON|0;
			}

			N_reset {

				if(LEN) {
					err_invalidParamCount();
					goto error;
				}

				reset();
				VAL = __VOID__;
				goto KON|0;
			}

			N_eq {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				VAL = (((pairCar(ARG)|0) == (pairCar(pairCdr(ARG)|0)|0)) ? __TRUE__ : __FALSE__);
				goto KON|0;
			}

			N_equal {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(ARG)|0;
				ARG = pairCar(pairCdr(ARG)|0)|0;
				goto N_compare;
			}

			N_collect {

				reclaim();
				VAL = makeImmediate(available()|0)|0;
				goto KON|0;
			}

			N_available {

				VAL = makeImmediate(available()|0)|0;
				goto KON|0;
			}

			N_callcc {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = pairCar(ARG)|0;
				if(!(isProcedure(VAL)|0)) {
					err_invalidArgument(VAL|0);
					goto error;
				}

				ARG = currentStack()|0;
				ARG = makeContinuation(makeImmediate(KON)|0, FRM, ENV, ARG)|0;
				ARG = makePair(ARG, __NULL__)|0;
				LEN = 1;

				goto E_apply;
			}

			N_stringRef {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = pairCar(pairCdr(ARG)|0)|0;
				ARG = pairCar(ARG)|0;

				if(!(isString(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				if(!(isNumber(EXP)|0)) {
					err_invalidArgument(EXP|0);
					goto error;
				}

				IDX = immediateVal(EXP)|0;
				LEN = textLength(ARG)|0;
				if(0 <= (IDX|0) & (IDX|0) < (LEN|0)) {
					VAL = makeChar(textGetChar(ARG, IDX)|0)|0;
					goto KON|0;
				}

				err_invalidRange(IDX|0, 0, (LEN-1)|0);
				goto error;
			}

			N_stringSet {

				if((LEN|0) != 3) {
					err_invalidParamCount();
					goto error;
				}

				LST = pairCdr(ARG)|0;
				ARG = pairCar(ARG)|0;
				EXP = pairCar(LST)|0;
				VAL = pairCar(pairCdr(LST)|0)|0;

				if (!(isString(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				if(!(isNumber(EXP)|0)) {
					err_invalidArgument(EXP|0);
					goto error;
				}

				if(!(isChar(VAL)|0)) {
					err_invalidArgument(VAL|0);
					goto error;
				}

				IDX = immediateVal(EXP)|0;
				LEN = textLength(ARG)|0;
				if(0 <= (IDX|0) & (IDX|0) < (LEN|0)) {
					textSetChar(ARG, IDX, charCode(VAL)|0);
					goto KON|0;
				}

				err_invalidRange(IDX|0, 0, (LEN-1)|0);
				goto error;
			}

			N_stringLength {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = pairCar(ARG)|0;
				if(!(isString(ARG)|0)) {
					err_invalidArgument(ARG|0);
				}

				VAL = makeImmediate(textLength(ARG)|0)|0;
				goto KON|0;

			}

			N_random {

				if(LEN|0) {
					err_invalidParamCount();
					goto error;
				}

				claim();
				VAL = makeFloat(fround(+random()))|0;
				goto KON|0;
			}

			N_load {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = pairCar(ARG)|0;
				if(!(isString(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				push(makeImmediate(KON)|0);
				KON = N_c1_load;
				loadFile(ARG|0);
				halt;
			}

// **********************************************************************
// ***************************** READER *********************************
// **********************************************************************

			R_read {

				switch (look()|0) {

					case LBR: goto R_readLBR;
					case SHR: goto R_readSHR;
					case QUO: goto R_readQUO;
					case DQU: 
						VAL = readString()|0;
						goto KON|0;
					case PLS: case MIN: case 48:
					case 49: case 50: case 51:
					case 52: case 53: case 54:
					case 55: case 56: case 57:
						VAL = readNumber()|0;
						goto KON|0;
				}

				VAL = readSymbol()|0;
				goto KON|0;
			}

			R_readLBR {

				skip();
				if ((look()|0) == RBR) {
					skip();
					VAL = __NULL__;
					goto KON|0;
				}
				push(makeImmediate(KON)|0);
				push(__ZERO__);
				KON = R_c1_LBR;
				goto R_read;
			}

			R_c1_LBR {

				claim();
				if ((look()|0) == RBR) {
					skip();
					VAL = makePair(VAL, __NULL__)|0;
					goto R_c3_LBR;
				}
				IDX = immediateVal(peek()|0)|0;
				poke(VAL);
				push((makeImmediate((IDX+1)|0))|0);
				if ((look()|0) == DOT) {
					skip();
					KON = R_c2_LBR;
				} 
				goto R_read;
			}

			R_c2_LBR {

				if ((look()|0) != RBR) {
					err_expectedRBR(look()|0);
					goto error|0;
				}

				skip();
				goto R_c3_LBR;
			}

			R_c3_LBR {

				IDX = immediateVal(pop()|0)|0;
				for(;IDX; IDX=(IDX-1)|0)
					VAL = makePair(pop()|0, VAL)|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			R_readQUO {

				skip()|0;
				push(makeImmediate(KON)|0);
				KON = R_c_QUO;
				goto R_read;
			}

			R_c_QUO {

				claim();
				VAL = makePair(VAL, __NULL__)|0;
				VAL = makePair(__QUO_SYM__, VAL)|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			R_readSHR {

				skip();
				switch(read()|0) {
					case LTT: 
						VAL = __TRUE__;
						goto KON|0;
					case LTF: 
						VAL = __FALSE__;
						goto KON|0;
					case SLH: 
						VAL = makeChar(read()|0)|0;
						goto KON|0;
					case LBR:
						if ((look()|0) == RBR) {
							skip();
							VAL = __EMPTY_VEC__;
							goto KON|0;
						}
						push(makeImmediate(KON)|0);
						KON = R_c_vector;
						push(__ONE__);
						goto R_read;
				}

				err_invalidSyntax();
				goto error;
			}

			R_c_vector {

				if ((look()|0) == RBR) {
					skip();
					LEN = immediateVal(pop()|0)|0;
					claimSiz(LEN);
					EXP = makeVector(LEN)|0;
					vectorSet(EXP, LEN, VAL);
					for(LEN=(LEN-1)|0;LEN;LEN=(LEN-1)|0) 
						vectorSet(EXP, LEN, pop()|0);
					VAL = EXP;
					KON = immediateVal(pop()|0)|0;
					goto KON|0;
				}

				claim();
				IDX = immediateVal(peek()|0)|0;
				poke(VAL);
				push(makeImmediate((IDX+1)|0)|0);
				goto R_read;
			}

// **********************************************************************
// **************************** COMPILER ********************************
// **********************************************************************

			C_compile {

				if(isPair(EXP)|0) {

					LST = pairCdr(EXP)|0;
					EXP = pairCar(EXP)|0;

					if(isSymbol(EXP)|0) {

						if((EXP|0) == (__IFF_SYM__|0))
							goto C_compileIf;
						else if((EXP|0) == (__DEF_SYM__|0))
							goto C_compileDefine;
						else if((EXP|0) == (__BEG_SYM__|0))
							goto C_compileSequence;
						else if((EXP|0) == (__LMB_SYM__|0))
							goto C_compileLambda;
						else if((EXP|0) == (__SET_SYM__|0))
							goto C_compileSet;
						else if((EXP|0) == (__QUO_SYM__|0))
							goto C_compileQuote;
					}

					goto C_compileApplication;
				}

				if(isVector(EXP)|0)
					goto C_compileVector;

				VAL = EXP;
				goto KON|0;
			}

			C_compileSequence {

				if(isNull(LST)|0) {
					VAL = __VOID__;
					goto KON|0;
				}

				if(!(isPair(LST)|0)) {
					err_invalidSequence();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(!(isNull(LST)|0)) {
					claim();
					push(makeImmediate(KON)|0);
					push(__ONE__);
					push(LST);
					KON = C_c1_sequence;
				}

				goto C_compile;
			}

			C_c1_sequence {

				LST = pop()|0;
				LEN = immediateVal(peek()|0)|0;
				poke(VAL);
				push(makeImmediate((LEN+1)|0)|0);

				if (!(isPair(LST)|0)) {
					err_invalidSequence();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(isNull(LST)|0) {
					KON = C_c2_sequence;
				} else {
					claim();
					push(LST);
				}

				goto C_compile;
			}

			C_c2_sequence {

				LEN = immediateVal(pop()|0)|0;
				claimSiz(LEN);
				EXP = makeSequence(LEN)|0;
				sequenceSet(EXP, LEN, VAL);
				do {
					LEN = (LEN - 1)|0;
					sequenceSet(EXP, LEN, pop()|0);
				} while ((LEN|0) > 1);
				VAL = EXP;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			C_compileQuote {

				if(!(isPair(LST)|0)) {
					err_invalidQuote();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(isNull(LST)|0) {
					claim();
					VAL = makeQuo(EXP)|0;
					goto KON|0;
				} 

				err_invalidQuote();
				goto error;
			}

			C_compileIf {

				if(!(isPair(LST)|0)) {
					err_invalidIf();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(!(isPair(LST)|0)) {
					err_invalidIf();
					goto error;
				}

				claim();
				push(makeImmediate(KON)|0);
				push(LST);
				KON = C_c1_if;
				goto C_compile;
			}

			C_c1_if {

				LST = peek()|0;
				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;
				poke(VAL);

				if(isNull(LST)|0) {
					KON = C_c2_if;
					goto C_compile;
				}

				if(isPair(LST)|0) {
					claim();
					push(LST);
					KON = C_c3_if;
					goto C_compile;
				}

				err_invalidIf();
				goto error;
			}

			C_c2_if {

				claim();
				VAL = makeIfs(pop()|0, VAL)|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			C_c3_if {

				LST = peek()|0;
				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;
				poke(VAL);

				if(!(isNull(LST)|0)) {
					err_invalidIf();
					goto error;
				}

				KON = C_c4_if;
				goto C_compile;
			}

			C_c4_if {

				claim();
				EXP = pop()|0;
				VAL = makeIff(pop()|0, EXP, VAL)|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			C_compileDefine {

				claim();
				if (!(isPair(LST)|0)) {
					err_invalidDefine();
					goto error;
				}

				PAT = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				push(makeImmediate(KON)|0);

				switch(tag(PAT)|0) {

					case __SYMBOL_TAG__:
						if(!(isPair(LST)|0)) {
							err_invalidDefine();
							goto error;
						}
						EXP = pairCar(LST)|0;
						LST = pairCdr(LST)|0;
						if(!(isNull(LST)|0)) {
							err_invalidDefine();
							goto error;
						}
						push(PAT);
						KON = C_c1_define;
						goto C_compile;

					case __PAIR_TAG__:
						PAR = pairCdr(PAT)|0;
						PAT = pairCar(PAT)|0;
						if(!(isSymbol(PAT)|0)) {
							err_invalidDefine();
							goto error;
						}
						push(PAT);
						push(PAR);
						KON = C_c2_define;
						goto C_compileSequence;
				}

				err_invalidDefine();
				goto error;
			}

			C_c1_define {

				claim();
				PAT = pop()|0;
				KON = immediateVal(pop()|0)|0;
				VAL = makeDfv(PAT, VAL)|0;
				goto KON|0;
			}

			C_c2_define {

				claim();
				PAR = pop()|0;
				PAT = pop()|0;
				KON = immediateVal(pop()|0)|0;
				VAL = makeDff(PAT, PAR, VAL)|0;
				goto KON|0;
			}

			C_compileSet {

				claim();

				if(!(isPair(LST)|0)) {
					err_invalidAssignment();
					goto error;
				}

				PAT = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(!(isPair(LST)|0)) {
					err_invalidAssignment();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(!(isNull(LST)|0)) {
					err_invalidAssignment();
					goto error;
				}

				push(makeImmediate(KON)|0);
				push(PAT);
				KON = C_c_set;
				goto C_compile;
			}

			C_c_set {

				claim();
				PAT = pop()|0;
				VAL = makeSet(PAT, VAL)|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			C_compileLambda {

				if(!(isPair(LST)|0)) {
					err_invalidLambda();
					goto error;
				}

				claim();
				PAR = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				push(makeImmediate(KON)|0);
				push(PAR);
				KON = C_c_lambda;
				goto C_compileSequence;
			}

			C_c_lambda {

				claim();
				PAR = pop()|0;
				VAL = makeLambda(PAR, VAL)|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			C_compileApplication {

				claim();
				push(makeImmediate(KON)|0);
				if(isNull(LST)|0) {
					KON = C_c1_application;
				} else {
					push(__ZERO__);
					push(LST);
					KON = C_c2_application;
				}
				goto C_compile;
			}

			C_c1_application {

				claim();
				VAL = makeApplication(VAL, __EMPTY_VEC__)|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			C_c2_application {

				ARG = pop()|0;
				LEN = immediateVal(peek()|0)|0;
				poke(VAL);
				push(makeImmediate((LEN+1)|0)|0);

				if(!(isPair(ARG)|0)) {
					err_invalidApplication();
					goto error;
				}

				EXP = pairCar(ARG)|0;
				ARG = pairCdr(ARG)|0;

				if(isNull(ARG)|0) {
					KON = C_c3_application;
				} else {
					claim();
					push(ARG);
				}

				goto C_compile;
			}

		 	C_c3_application {

		 		LEN = immediateVal(pop()|0)|0;
		 		claimSiz(LEN);
		 		EXP = makeVector(LEN)|0;
		 		vectorSet(EXP, LEN, VAL);
		 		for(LEN=(LEN-1)|0;LEN;LEN=(LEN-1)|0)
		 			vectorSet(EXP, LEN, pop()|0)
		 		VAL = makeApplication(pop()|0, EXP)|0;
		 		KON = immediateVal(pop()|0)|0;
		 		goto KON|0;
		 	}

		 	C_compileVector {

		 		LEN = vectorLength(EXP)|0;
		 		if((LEN|0) == 0) {
		 			VAL = __EMPTY_VEC__;
		 			goto KON|0;
		 		}
		 		claimSiz(LEN);

		 		push(makeImmediate(KON)|0);
		 		push(makeVector(LEN)|0);
		 		if ((LEN|0) == 1) {
		 			KON = C_c2_vector;
		 		} else {
		 			KON = C_c1_vector;
		 			push(EXP);
		 			push(__ONE__);
		 		}

		 		EXP = vectorRef(EXP, 1)|0;
		 		goto C_compile;
		 	}

			C_c1_vector {

				IDX = immediateVal(pop()|0)|0;
				EXP = pop()|0;
				PAR = peek()|0;
				vectorSet(PAR, IDX, VAL);

				LEN = vectorLength(PAR)|0;
				IDX = (IDX + 1)|0;

				if((IDX|0) == (LEN|0)) {
					KON = C_c2_vector;
				} else {
					push(EXP);
					push(makeImmediate(IDX)|0);
				}

				EXP = vectorRef(EXP, IDX)|0;
				goto C_compile;
			}

			C_c2_vector {

				claim();
				EXP = pop()|0;
				LEN = vectorLength(EXP)|0;
				vectorSet(EXP, LEN, VAL);
				VAL = makeApplication(__VEC_SYM__, EXP)|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

// **********************************************************************
// *************************** EVALUATOR ********************************
// **********************************************************************

			E_eval {

				switch(tag(EXP)|0) {

					case __NULL_TAG__:
					case __VOID_TAG__: 
					case __TRUE_TAG__: 
					case __FALSE_TAG__: 
					case __NUMBER_TAG__: 
					case __CHAR_TAG__:
					case __PAIR_TAG__:
					case __PROCEDURE_TAG__:
					case __VECTOR_TAG__:
					case __STRING_TAG__:
					case __FLOAT_TAG__:
					case __NATIVE_TAG__:
					case __CONTINUATION_TAG__:
						goto E_evalSelf;
					case __SYMBOL_TAG__: 
						goto E_evalVariable;
					case __SEQUENCE_TAG__:
					 	goto E_evalSequence;
					case __IFS_TAG__: 
						goto E_evalIfs;
					case __IFF_TAG__: 
						goto E_evalIff;
					case __QUO_TAG__: 
						goto E_evalQuote;
					case __LAMBDA_TAG__: 
						goto E_evalLambda;
					case __DFV_TAG__: 
						goto E_evalDfv;
					case __DFF_TAG__: 
						goto E_evalDff;
					case __SET_TAG__: 
						goto E_evalSet;
					case __APPLICATION_TAG__: 
						goto E_evalApplication;
				}

				err_invalidExpression(EXP|0);
				goto error;
			}

			E_evalSelf {

				VAL = EXP;
				goto KON|0;
			}

			//TODO: replace with lexical addressing

			E_evalVariable {

				for(DCT=FRM,LST=ENV;;DCT=pairCar(LST)|0,LST=pairCdr(LST)|0) {
					while(isPair(DCT)|0) {
						BND = pairCar(DCT)|0;
						if((pairCar(BND)|0) == (EXP|0)) {
							VAL = pairCdr(BND)|0;
							goto KON|0;
						}
						DCT = pairCdr(DCT)|0;
					}
					if(!(isPair(LST)|0))
						break;
				}
				err_undefinedVariable(EXP|0);
				goto error;
			}

			E_evalDfv {

				claim();
				PAT = dfvVariable(EXP)|0;
				EXP = dfvValue(EXP)|0;
				push(makeImmediate(KON)|0);
				push(PAT);
				KON = E_c_define;
				goto E_eval;
			}

			E_evalDff {

				claim();
				PAT = dffVariable(EXP)|0;
				PAR = dffArguments(EXP)|0;
				SEQ = dffBody(EXP)|0;

				BND = makePair(PAT, __NULL__)|0;
				FRM = makePair(BND, FRM)|0;
				ENV = makePair(FRM, ENV)|0;
				VAL = makeProcedure(PAR, SEQ, ENV)|0;
				pairSetCdr(BND, VAL);
				ENV = pairCdr(ENV)|0;
				goto KON|0;
			}

			E_c_define {

				claim();
				PAT = pop()|0;
				KON = immediateVal(pop()|0)|0;
				BND = makePair(PAT, VAL)|0;
				FRM = makePair(BND, FRM)|0;
				goto KON|0;
			}

			E_evalSet {

				claim();
				PAT = setVariable(EXP)|0;
				EXP = setValue(EXP)|0;

				for(DCT=FRM,LST=ENV;;DCT=pairCar(LST)|0,LST=pairCdr(LST)|0) {

					while(isPair(DCT)|0) {
						BND = pairCar(DCT)|0;
						if((pairCar(BND)|0) == (PAT|0)) {
							push(makeImmediate(KON)|0);
							push(BND);
							KON = E_c_set;
							goto E_eval;
						}
						DCT = pairCdr(DCT)|0;
					}
					if(!(isPair(LST)|0))
						break;
				}
				err_undefinedVariable(PAT|0);
				goto error;
			}

			E_c_set {

				BND = pop()|0;
				KON = immediateVal(pop()|0)|0;
				pairSetCdr(BND, VAL);
				goto KON|0;
			}

			E_evalQuote {

				VAL = quoExpression(EXP)|0;
				goto KON|0;
			}

			E_evalSequence {

				claim();
				push(makeImmediate(KON)|0);
				push(EXP);
				push(__ONE__);
				EXP = sequenceAt(EXP, 1)|0;
				KON = E_c_sequence;
				goto E_eval;
			}

			E_c_sequence {

				IDX = immediateVal(pop()|0)|0;
				IDX = (IDX + 1)|0;
				SEQ = peek()|0;
				LEN = sequenceLength(SEQ)|0;
				EXP = sequenceAt(SEQ, IDX)|0;

				if((IDX|0) == (LEN|0)) {
					zap();
					KON = immediateVal(pop()|0)|0;
				} else {
					push(makeImmediate(IDX)|0);
				}

				goto E_eval;
			}

			E_evalIfs {

				claim();
				push(makeImmediate(KON)|0);
				push(ifsConsequence(EXP)|0);
				EXP = ifsPredicate(EXP)|0;
				KON = E_c_ifs;
				goto E_eval;
			}

			E_c_ifs {

				EXP = pop()|0;
				if(!(isFalse(VAL)|0)) {
					claim();
					KON = immediateVal(peek()|0)|0;
					if((KON|0) == E_c_return) {
						zap();
					} else {
						push(FRM);
						push(ENV);
						KON = E_c_return;
					}
					ENV = makePair(FRM, ENV)|0;
					FRM = __NULL__;
					goto E_eval;
				}

				VAL = __VOID__;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			E_evalIff {

				claim();
				push(makeImmediate(KON)|0);
				push(EXP);
				EXP = iffPredicate(EXP)|0;
				KON = E_c_iff;
				goto E_eval;
			}

			E_c_iff {

				claim();
				EXP = pop()|0;
				KON = immediateVal(peek()|0)|0;
				if((KON|0) == E_c_return) {
					zap();
				} else {
					push(FRM);
					push(ENV);
					KON = E_c_return;
				}
				ENV = makePair(FRM, ENV)|0;
				FRM = __NULL__;
				EXP = (isFalse(VAL)|0? iffAlternative(EXP)|0 : iffConsequence(EXP)|0);
				goto E_eval;
			}

			E_evalLambda {

				claim();
				PAR = lambdaArg(EXP)|0;
				SEQ = lambdaBdy(EXP)|0;
				DCT = makePair(FRM, ENV)|0;
				VAL = makeProcedure(PAR, SEQ, DCT)|0;
				goto KON|0;
			}

			E_evalApplication {

				claim();
				push(makeImmediate(KON)|0);
				push(aplOperands(EXP)|0);
				EXP = aplOperator(EXP)|0;
				KON = E_c1_application;
				goto E_eval;
			}

			E_c1_application {

				ARG = peek()|0;
				LEN = vectorLength(ARG)|0;

				if ((LEN|0) == 0) {
					zap();
					ARG = __NULL__;
					LEN = 0;
					KON = immediateVal(pop()|0)|0;
					goto E_apply;
				}

				claim();
				poke(VAL);
				push(__ONE__);

				if((LEN|0) == 1) {
					KON = E_c3_application;
				} else {
					KON = E_c2_application;
					push(ARG);
				}

				EXP = vectorRef(ARG, 1)|0;
				goto E_eval;
			}

			E_c2_application {

				ARG = pop()|0;
				IDX = immediateVal(peek()|0)|0;
				IDX = (IDX + 1)|0;
				poke(VAL);
				push(makeImmediate(IDX)|0);
				EXP = vectorRef(ARG, IDX)|0;

				if ((IDX|0) == (vectorLength(ARG)|0)) {
					KON = E_c3_application;
				} else {
					claim();
					push(ARG);
				}

				goto E_eval;
			}

			E_c3_application {

				LEN = IDX = immediateVal(pop()|0)|0;
				claimSiz(imul(3,LEN)|0);
				ARG = makePair(VAL, __NULL__)|0;
				for(IDX=(IDX-1)|0;IDX;IDX=(IDX-1)|0)
					ARG = makePair(pop()|0, ARG)|0;
				VAL = pop()|0;
				KON = immediateVal(pop()|0)|0;
				goto E_apply;
			}

			E_apply {

				switch(tag(VAL)|0) {
					
					case __PROCEDURE_TAG__:
						claimSiz(imul(3,LEN)|0);
						if((KON|0) != E_c_return) {
							push(makeImmediate(KON)|0);
							push(FRM);
							push(ENV);
							KON = E_c_return;
						}
						EXP = procedureBdy(VAL)|0;
						PAR = procedurePar(VAL)|0;
						ENV = procedureEnv(VAL)|0;
						FRM = __NULL__;
						goto E_bind;

					case __NATIVE_TAG__:
						goto nativePtr(VAL)|0;

					case __CONTINUATION_TAG__:
						if((LEN|0) != 1) {
							err_invalidParamCount();
							goto error;
						}
						KON = immediateVal(continuationKon(VAL)|0)|0;
						restoreStack(continuationStk(VAL)|0);
						FRM = continuationFrm(VAL)|0;
						ENV = continuationEnv(VAL)|0;
						VAL = pairCar(ARG)|0;
						goto KON|0;
				}	

				err_invalidOperator();
				goto error;
			}

			E_bind {

				switch(tag(PAR)|0) {

					case __NULL_TAG__:
						if(isNull(ARG)|0)
							goto E_eval;
						break;

					case __PAIR_TAG__:
						if(isPair(ARG)|0) {
							BND = makePair(pairCar(PAR)|0, pairCar(ARG)|0)|0;
							FRM = makePair(BND, FRM)|0;
							ARG = pairCdr(ARG)|0;
							PAR = pairCdr(PAR)|0;
							goto E_bind;
						}
						break;

					case __SYMBOL_TAG__:
						BND = makePair(PAR, ARG)|0;
						FRM = makePair(BND, FRM)|0;
						goto E_eval;
				}

				err_invalidParamCount();
				goto error;
			}

			E_c_return {

				ENV = pop()|0;
				FRM = pop()|0;
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

// **********************************************************************
// *************************** NATIVES PT2 ******************************
// **********************************************************************
			
			N_addFloats {

				while(LEN) {
					LEN = (LEN-1)|0;
					EXP = pairCar(ARG)|0;
					ARG = pairCdr(ARG)|0;
					switch(tag(EXP)|0) {
						case __NUMBER_TAG__:
							FLT = fround(FLT + fround(immediateVal(EXP)|0));
							break;
						case __FLOAT_TAG__:
							FLT = fround(FLT + fround(floatNumber(EXP)));
							break;
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}
				claim();
				VAL = makeFloat(FLT)|0;
				goto KON|0;
			}

	 		N_substractFloats {

	 			while(LEN) {
	 				LEN = (LEN - 1)|0;
	 				EXP = pairCar(ARG)|0;
	 				ARG = pairCdr(ARG)|0;
	 				switch(tag(EXP)|0) {
	 					case __NUMBER_TAG__:
	 						FLT = fround(FLT - fround(immediateVal(EXP)|0));
	 						break;
	 					case __FLOAT_TAG__:
	 						FLT = fround(FLT - fround(floatNumber(EXP)));
	 						break;
	 					default:
	 						err_invalidArgument(EXP|0);
	 						goto error;
	 				}	 			
	 			}
	 			claim();
	 			VAL = makeFloat(FLT)|0;
	 			goto KON|0;
	 		}

	 		N_multiplyFloats {

				while(LEN) {
					LEN = (LEN-1)|0;
					EXP = pairCar(ARG)|0;
					ARG = pairCdr(ARG)|0;
					switch(tag(EXP)|0) {
						case __NUMBER_TAG__:
							FLT = fround(FLT * fround(immediateVal(EXP)|0));
							break;
						case __FLOAT_TAG__:
							FLT = fround(FLT * fround(floatNumber(EXP)));
							break;
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}
				claim();
				VAL = makeFloat(FLT)|0;
				goto KON|0;
			}

			N_c1_map {

				LEN = immediateVal(pop()|0)|0;
				claimSiz(imul(3,LEN)|0);
				VAL = makePair(VAL, __NULL__)|0;
				for(;LEN;LEN=(LEN-1)|0) {
					VAL = makePair(pop()|0, VAL)|0;
				}
				KON = immediateVal(pop()|0)|0;
				goto KON|0;
			}

			N_c2_map {

				LST = pop()|0;
				EXP = pop()|0;
				LEN = immediateVal(peek()|0)|0;
				LEN = (LEN + 1)|0;
				poke(VAL);
				push(makeImmediate(LEN)|0);

				claim();
				VAL = EXP;
				ARG = makePair(pairCar(LST)|0, __NULL__)|0;
				LST = pairCdr(LST)|0;
				LEN = 1;

				if(isNull(LST)|0) {
					KON = N_c1_map;
				} else {
					push(VAL);
					push(LST);
					KON = N_c2_map;
				}

				goto E_apply;
			}			

			N_c_eval {

				EXP = VAL;
				KON = immediateVal(pop()|0)|0;
				goto E_eval;
			}

			N_c1_load {

				EXP = VAL;
				KON = N_c2_load;
				goto C_compile;
			}

			N_c2_load {

				EXP = VAL;
				KON = immediateVal(pop()|0)|0;
				goto E_eval;
			}

			N_compare {

				TMP = tag(EXP)|0;
				if((TMP|0) != (tag(ARG)|0)) {
					VAL = __FALSE__;
					goto KON|0;
				}

				switch(TMP|0) {
					case __FLOAT_TAG__: goto N_compareFloat;
					case __STRING_TAG__: goto N_compareString;
					case __PAIR_TAG__: goto N_comparePair;
					case __VECTOR_TAG__: goto N_compareVector;
				}

				VAL = ((ARG|0) == (EXP|0) ? __TRUE__ : __FALSE__);
				goto KON|0;
			}

			N_compareFloat {

				VAL = (fround(floatNumber(EXP)) == fround(floatNumber(ARG)) ?
						__TRUE__ : __FALSE__);
				goto KON|0;
			}

			N_compareString {

				LEN = textLength(ARG)|0;
				if((textLength(EXP)|0) != (LEN|0)) {
					VAL = __FALSE__;
					goto KON|0;
				}

				while(LEN) {
					LEN = (LEN - 1)|0;
					if((textGetChar(ARG, LEN)|0) != (textGetChar(EXP, LEN)|0)) {
						VAL = __FALSE__;
						goto KON|0;
					}
				}

				VAL = __TRUE__;
				goto KON|0;
			}

			N_comparePair {

				push(pairCdr(EXP)|0);
				push(pairCdr(ARG)|0);
				EXP = pairCar(EXP)|0;
				ARG = pairCar(ARG)|0;
				push(makeImmediate(KON)|0);
				KON = N_c_comparePair;
				goto N_compare;
			}

			N_c_comparePair {

				KON = immediateVal(pop()|0)|0;

				if((VAL|0) == __FALSE__) {
					zap();
					zap();
					goto KON|0;
				}

				ARG = pop()|0;
				EXP = pop()|0;
				goto N_compare;
			}

			N_compareVector {

				LEN = vectorLength(ARG)|0;
				if((vectorLength(EXP)|0) != (LEN|0)) {
					VAL = __FALSE__;
					goto KON|0;
				}
				if(!LEN) {
					VAL = __TRUE__;
					goto KON|0;
				}

				if((LEN|0) > 1) {
					push(makeImmediate(KON)|0);
					push(EXP);
					push(ARG);
					push(__ONE__);
					KON = N_c_compareVector;
				}

				ARG = vectorRef(ARG, 1)|0;
				EXP = vectorRef(EXP, 1)|0;
				goto N_compare;
			}

			N_c_compareVector {

				if((VAL|0) == __FALSE__) {
					zap();
					zap();
					zap();
					KON = immediateVal(pop()|0)|0;
					goto KON|0;
				}

				IDX = immediateVal(pop()|0)|0;
				ARG = pop()|0;
				EXP = peek()|0;

				IDX = (IDX + 1)|0;
				if((IDX|0) == (vectorLength(ARG)|0)) {
					zap();
					KON = immediateVal(pop()|0)|0;
				} else {
					push(ARG);
					push(makeImmediate(IDX)|0);
					KON = N_c_compareVector;
				}

				ARG = vectorRef(ARG, IDX)|0;
				EXP = vectorRef(EXP, IDX)|0;
				goto N_compare;
			}

// **********************************************************************
// ****************************** REPL **********************************
// **********************************************************************

			REPL {

				GLB = FRM;
				KON = c1_repl;
				promptInput();
				halt;
			}

			c1_repl {

				EXP = VAL;
				KON = c2_repl;
				goto C_compile;
			}

			c2_repl {

				EXP = VAL;
				KON = c3_repl;
				goto E_eval;
			}

			c3_repl {

				printOutput(VAL|0);
				goto REPL;
			}

			error {
				
				FRM = GLB;
				ENV = __NULL__;
				emptyStk();
				goto REPL;
			}

		} generate run

	/* -- EXPORTS -- */

		return { 

			/**************/
			/**** MAIN ****/
			/**************/

			init: init,
			claim: claim,
			claimSiz: claimSiz,
			Slip_REPL: Slip_REPL,
			inputReady: inputReady,

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
			makeImmediate: makeImmediate,
			immediateVal: immediateVal,
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
			//string
			makeString: makeString,
			stringAt: textGetChar,
			stringSet: textSetChar,
			stringLength: textLength,
			isString: isString,
			//symbols
			makeSymbol: makeSymbol,
			symbolAt: textGetChar,
			symbolSet: textSetChar,
			symbolLength: textLength,
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
			isApplication: isApplication,

			/**************/
			/**** POOL ****/
			/**************/

			enterPool: enterPool,
			poolAt: poolAt
		};
	}


/************** NON-ASM.JS ***************/

	function READER() {
		"use strict";

		var program, position, hold;
		var makeString, stringSet,
			makeNumber, makeFloat,
			enterPool, claimSiz, claim;

		function load(str) {
			program = str;
			position = 0;
		}

		function link(asm, pool) {
			makeString = asm.makeString;
			stringSet = asm.stringSet;
			makeNumber = asm.makeNumber;
			makeFloat = asm.makeFloat;
			claimSiz = asm.claimSiz;
			claim = asm.claim;
			enterPool = pool.enterPool;
		}

		function isTerminator(c) {
			switch (c) {
				case ' ': case '': case '\n': case '\t':
				case '\'': case '\"': case ')': case '(':
				case ';': case '.': case '\r':
					return true;
				default:
					return false;
			}
		}

		function isNumber(c) {
			return !(c < '0' || c > '9');
		}

		function skipWhiteSpace() {
			while(true) {
				switch (program.charAt(position)) {
					case ';': 
						var current;
						while((current = program.charAt(++position)) != '\n'
						    	&& current != '\r' && current != '');
					case '\n': case '\r': 
					case '\t': case ' ':
						++position;
						break;
					default:
						return;
				}
			}
		}

		function skip() {
			skipWhiteSpace();
			++position;
		}

		function peek() { 
			skipWhiteSpace();
			return program.charCodeAt(position);
		}

		function read() {
			skipWhiteSpace();
			return program.charCodeAt(position++);
		}

		function readSymbol() {
			hold = position;
			while(!isTerminator(program.charAt(++position)));
			return enterPool(program.substring(hold, position));
		}

		function extractString(from, to) {
			var len = to - from;
			claimSiz(len);
			var str = makeString(len);
			for(var i = 0; i < len; ++i)
				stringSet(str, i, program.charCodeAt(from+i));
			return str;
		}

		function readString() {
			hold = position;
			while(program.charAt(++position) != '\"');
			return extractString(hold+1, position++);
		}

		function readNumber() {
			hold = position;
			//step 1: check for sign
			switch(program.charAt(position)) {
				case '+':
				case '-':
					if(!isNumber(program.charAt(++position))) {
						--position; //oops, go back
						return readSymbol();
					}
			}
			//step 2: parse number in front of .
			while(isNumber(program.charAt(++position)));
			//step 3: parse number after .
			if(program.charAt(position) === '.') {
				while(isNumber(program.charAt(++position)));
				claim();
				return makeFloat(parseFloat(program.substring(hold, position)));
			}
			return makeNumber(parseInt(program.substring(hold, position)));
		}

		return { 
			load: load,
			skip: skip,
			peek: peek,
			read: read,
			readSymbol: readSymbol,
			readString: readString,
			readNumber: readNumber,
			link: link
		}
	}

	function SYMBOLS() {
		"use strict";

		var __POOL__ = Object.create(null);
		var makeSymbol, symbolSet, symbolAt,
		symbolLength, addToPool, poolAt;

		function link(asm) {
			makeSymbol = asm.makeSymbol;
			symbolSet = asm.symbolSet;
			symbolAt = asm.symbolAt;
			symbolLength = asm.symbolLength;
			addToPool = asm.enterPool;
			poolAt = asm.poolAt;
		}

		function buildSymbol(txt) {
			var len = txt.length;
			var sym = makeSymbol(len);
			for(var i = 0; i < len; ++i)
				symbolSet(sym, i, txt.charCodeAt(i));
			return sym;
		}

		function symbolText(chk) {
			var len = symbolLength(chk);
			var arr = new Array(len);
			for(var i = 0; i < len; ++i)
				arr[i] = symbolAt(chk, i);
			return String.fromCharCode.apply(null, arr);
		}

		function enterPool(str) {
			var idx;
			//already in pool
			if ((idx = __POOL__[str]))
				return poolAt(idx);
			//not in pool yet
			var sym = buildSymbol(str);
			idx = addToPool(sym);
			__POOL__[str] = idx;
			return  sym;
		}

		function symbol(str) {
			return function() {
				return enterPool(str);
			}
		}

		define __QUO_STR__ 'quote'
		define __VEC_STR__ 'vector'
		define __IFF_STR__ 'if'
		define __DEF_STR__ 'define'
		define __LMB_STR__ 'lambda'
		define __SET_STR__ 'set!'
		define __BEG_STR__ 'begin'

		define __PLS_STR__ '+'
		define __MIN_STR__ '-'
		define __MUL_STR__ '*'
		define __DIV_STR__ '/'
		define __CNS_STR__ 'cons'
		define __CAR_STR__ 'car'
		define __CDR_STR__ 'cdr'
		define __SCA_STR__ 'set-car!'
		define __SCD_STR__ 'set-cdr!'
		define __LST_STR__ 'list'
		define __NEQ_STR__ '='
		define __LEQ_STR__ '>='
		define __SEQ_STR__ '<='
		define __LRG_STR__ '>'
		define __SMA_STR__ '<'
		define __ASS_STR__ 'assoc'
		define __MAP_STR__ 'map'
		define __VEC_STR__ 'vector'
		define __VCM_STR__ 'make-vector'
		define __VCR_STR__ 'vector-ref'
		define __VCS_STR__ 'vector-set!'
		define __VCL_STR__ 'vector-length'
		define __EQU_STR__ 'eq?'
		define __EQL_STR__ 'equal?'
		define __EVA_STR__ 'eval'
		define __REA_STR__ 'read'
		define __LOA_STR__ 'load'
		define __APL_STR__ 'apply'
		define __DIS_STR__ 'display'
		define __NEW_STR__ 'newline'
		define __IPA_STR__ 'pair?'
		define __INU_STR__ 'null?'
		define __ISY_STR__ 'symbol?'
		define __IVE_STR__ 'vector?'
		define __IST_STR__ 'string?'
		define __SRE_STR__ 'string-ref'
		define __SSE_STR__ 'string-set!'
		define __SLE_STR__ 'string-length'
		define __AVL_STR__ 'available'
		define __COL_STR__ 'collect'
		define __CLK_STR__ 'clock'
		define __RST_STR__ 'reset'
		define __SLP_STR__ 'sleep'
		define __RND_STR__ 'random'
		define __ERR_STR__ 'error'
		define __CCC_STR__ 'call/cc'

		return {
			enterPool: enterPool,
			loadCcc: symbol(__CCC_STR__),
			loadAvl: symbol(__AVL_STR__),
			loadCol: symbol(__COL_STR__),
			loadClk: symbol(__CLK_STR__),
			loadSlp: symbol(__SLP_STR__),
			loadRnd: symbol(__RND_STR__),
			loadErr: symbol(__ERR_STR__),
			loadSre: symbol(__SRE_STR__),
			loadSse: symbol(__SSE_STR__),
			loadSle: symbol(__SLE_STR__),
			loadIpa: symbol(__IPA_STR__),
			loadInu: symbol(__INU_STR__),
			loadIsy: symbol(__ISY_STR__),
			loadIve: symbol(__IVE_STR__),
			loadIst: symbol(__IST_STR__),
			loadQuo: symbol(__QUO_STR__),
			loadIff: symbol(__IFF_STR__),
			loadDef: symbol(__DEF_STR__),
			loadLmb: symbol(__LMB_STR__),
			loadSet: symbol(__SET_STR__),
			loadBeg: symbol(__BEG_STR__),
			loadPls: symbol(__PLS_STR__),
			loadMns: symbol(__MIN_STR__),
			loadMul: symbol(__MUL_STR__),
			loadDiv: symbol(__DIV_STR__),
			loadCns: symbol(__CNS_STR__),
			loadCar: symbol(__CAR_STR__),
			loadCdr: symbol(__CDR_STR__),
			loadSca: symbol(__SCA_STR__),
			loadScd: symbol(__SCD_STR__),
			loadLst: symbol(__LST_STR__),
			loadSma: symbol(__SMA_STR__),
			loadLrg: symbol(__LRG_STR__),
			loadLeq: symbol(__LEQ_STR__),
			loadSeq: symbol(__SEQ_STR__),
			loadNeq: symbol(__NEQ_STR__),
			loadAss: symbol(__ASS_STR__),
			loadMap: symbol(__MAP_STR__),
			loadVec: symbol(__VEC_STR__),
			loadVcm: symbol(__VCM_STR__),
			loadVcr: symbol(__VCR_STR__),
			loadVcs: symbol(__VCS_STR__),
			loadVcl: symbol(__VCL_STR__),
			loadEql: symbol(__EQL_STR__),
			loadEqu: symbol(__EQU_STR__),
			loadEva: symbol(__EVA_STR__),
			loadRea: symbol(__REA_STR__),
			loadLoa: symbol(__LOA_STR__),
			loadApl: symbol(__APL_STR__),
			loadDis: symbol(__DIS_STR__),
			loadNew: symbol(__NEW_STR__),
			loadRst: symbol(__RST_STR__),
			link: link
		}
	}

	function TIMER() {
		"use strict";

		var __START__;

		function reset() {
			__START__ = new Date().getTime();
		}

		function getTime() {
			var current = new Date().getTime();
			return current - __START__;
		}

		return {
			getTime: getTime,
			reset: reset
		}
	}

	function PRINTER() {
		"use strict";

		var getTag, numberVal, floatNumber, charCode,
		stringText, symbolLength, symbolAt,
		pairCar, pairCdr, isPair, isNull,
		vectorRef, vectorLength, ag;

		function link(asm) {
			getTag = asm.tag;
			numberVal = asm.numberVal;
			floatNumber = asm.floatNumber;
			charCode = asm.charCode;
			stringText = asm.stringText;
			symbolLength = asm.symbolLength;
			symbolAt = asm.symbolAt;
			pairCar = asm.pairCar;
			pairCdr = asm.pairCdr;
			isPair = asm.isPair;
			isNull = asm.isNull;
			vectorRef = asm.vectorRef;
			vectorLength = asm.vectorLength;
			ag = asm;
		}
	
		function printExp(exp) {

			var tag = getTag(exp);

			switch(tag) {

				case __NULL_TAG__: return '()';
				case __VOID_TAG__: return '#<void>';
				case __TRUE_TAG__: return '#t';
				case __FALSE_TAG__: return '#f';
				case __NUMBER_TAG__: return numberVal(exp).toString();
				case __CHAR_TAG__: 
					return '#\\'+String.fromCharCode(charCode(exp).toString());
				case __PAIR_TAG__: return printPair(exp);
				case __PROCEDURE_TAG__: return '#<procedure>';
				case __VECTOR_TAG__: return printVector(exp);
				case __STRING_TAG__: return '\"' + stringText(exp) + '\"';
				case __FLOAT_TAG__: return floatNumber(exp).toString();
				case __NATIVE_TAG__: return '#<native procedure>';
				case __CONTINUATION_TAG__: return '#<continuation>';
				case __SYMBOL_TAG__: return symbolText(exp);
				case __SEQUENCE_TAG__:
					return '(<sequence> ' + printSequence(exp) + ')';
				case __IFS_TAG__: 
					return '(<ifs> ' + printExp(ag.ifsPredicate(exp)) + ' ' 
									+ printExp(ag.ifsConsequence(exp)) + ')';
				case __IFF_TAG__: 
					return '(<iff> ' + printExp(ag.iffPredicate(exp)) + ' '
									+ printExp(ag.iffConsequence(exp)) + ' '
									+ printExp(ag.iffAlternative(exp)) + ')';
				case __QUO_TAG__:
					return '(<quote> ' + printExp(ag.quoExpression(exp)) + ')';
				case __LAMBDA_TAG__:
					return '(<lambda> ' + printExp(ag.lambdaArg(exp)) + ' '
										+ printExp(ag.lambdaBdy(exp)) + ')';
				case __DFV_TAG__:
					return '(<dfv> ' + printExp(ag.dfvVariable(exp)) + ' '
									   	+ printExp(ag.dfvValue(exp)) + ')';
				case __DFF_TAG__:
					return '(<dff> (' + printExp(ag.dffVariable(exp)) + ' '
										 + printExp(ag.dffArguments(exp)) + ') '
										 + printExp(ag.dffBody(exp)) + ')';
				case __SET_TAG__:
					return '(<set> ' + printExp(ag.setVariable(exp)) + ' '
									 + printExp(ag.setValue(exp)) + ')';
				case __APPLICATION_TAG__:
					return '(<application> ' + printExp(ag.aplOperator(exp)) + ' @ '
											 + printExp(ag.aplOperands(exp)) + ')';
				default:
					return '<expression>';
			}
		}

		var printSequence = function(exp) {
			var str = '', idx = 1;
			var len = ag.sequenceLength(exp);

			while (idx < len)
				str += printExp(ag.sequenceAt(exp, idx++)) + ' ';
			
			str += printExp(ag.sequenceAt(exp, idx));
			return str;
		}

		var printBindings = printExp;

		function symbolText(chk) {
			var len = symbolLength(chk);
			var arr = new Array(len);
			for(var i = 0; i < len; ++i)
				arr[i] = symbolAt(chk, i);
			return String.fromCharCode.apply(null, arr);
		}

		function printPair(exp) {
			var str = '(' + printExp(pairCar(exp));
			var cdr = pairCdr(exp)
			var cdrStr = printExp(cdr);
			if(isPair(cdr)) { // prettier!	
				cdrStr = cdrStr.substring(1, cdrStr.length-1);
				return str + ' ' + cdrStr + ')';
			}
			if (isNull(cdr))
				return str + ')';
			return str + " . " + cdrStr + ')';
		}

		function printVector(exp) {
			var len = vectorLength(exp);
			if (len === 0)
				return "#()";
			var str = "#(";
			for(var idx = 1; idx < len; ++idx) {
				str += printExp(vectorRef(exp, idx)) + ' ';
			}
			str += printExp(vectorRef(exp, len)) + ')';
			return str;
		}

		return {
			printExp: printExp,
			link: link
		}
	}

	function ERRORS() {
		"use strict";

		var report, printExp;

		function link(io, printer) {
			report = io.printError;
			printExp = printer.printExp;
		}

		function invalidLength(len) {
			report('invalid length: ' + len);
		}

		function invalidRange(idx, from, to) {
			report('expected index in range [' + from + ', ' + to + '], given ' + idx);
		}

		function expectedRBR(code) {
			report('expected ), given ' + String.fromCharCode(code));
		}

		function invalidSyntax() {
			report('invalid syntax');
		}

		function invalidSequence() {
			report('invalid sequence');
		}

		function invalidQuote() {
			report('invalid quote');
		}

		function invalidIf() {
			report('invalid if');
		}

		function invalidDefine() {
			report('invalid definition');
		}

		function invalidAssignment() {
			report('invalid assignment');
		}

		function invalidLambda() {
			report('invalid lambda');
		}

		function invalidApplication() {
			report('invalid application');
		}

		function undefinedVariable(exp) {
			report('undefined variable: ' + printExp(exp));
		}

		function invalidExpression(exp) {
			report('invalid expression:' + printExp(exp));
		}

		function invalidOperator() {
			report('invalid operator');
		}

		function invalidParamCount() {
			report('invalid parameter count');
		}

		function invalidArgument(exp) {
			report('invalid argument: ' + printExp(exp));
		}

		function fatalMemory() {
			report('insufficient memory!');
			throw 'out of memory';
		}

		return {
			expectedRBR: expectedRBR,
			invalidSyntax: invalidSyntax,
			invalidSequence: invalidSequence,
			invalidQuote: invalidQuote,
			invalidIf: invalidIf,
			invalidDefine: invalidDefine,
			invalidAssignment: invalidAssignment,
			invalidLambda: invalidLambda,
			invalidApplication: invalidApplication,
			undefinedVariable: undefinedVariable,
			invalidOperator: invalidOperator,
			invalidParamCount: invalidParamCount,
			invalidArgument: invalidArgument,
			invalidExpression: invalidExpression,
			invalidLength: invalidLength,
			invalidRange: invalidRange,
			fatalMemory: fatalMemory,
			link: link
		}
	}

	function IO() {
		"use strict";
	
		define __WELCOME_STR__ 'Welcome to the slip.js REPL'
		define __PROMPT1_STR__ '> '
		define __PROMPT2_STR__ ':: '
		define __ERROR_STR__ 'ERROR: '

		var readExpression, printline, printOut, plog, ld,
		inputReady, loadInput, printExp, printErr, text;

		function link(asm, clbs, reader, printer) {
			readExpression = clbs.readExpression;
			printline = clbs.printline;
			printOut = clbs.print;
			printErr = clbs.printerror;
			plog = clbs.printlog;
			ld = clbs.load;
			inputReady = asm.inputReady;
			text = asm.stringText;
			loadInput = reader.load;
			printExp = printer.printExp;
		}

		function onInput(txt) {
			reader.load(txt);
			inputReady();
		}

		function promptInput() {
			printOut(__PROMPT1_STR__);
			readExpression(onInput);
		}

		function promptUserInput() {
			printOut(__PROMPT2_STR__);
			readExpression(onInput);
		}

		function onError() {
			//temporary fix...
			reader.load('#f');
			inputReady();
		}

		function loadFile(str) {
			ld(text(str), onInput, onError);
		}

		function printLog(exp) {
			plog(printExp(exp));
		}

		function printNewline() {
			printline('');
		}

		function printOutput(exp) {
			printline(printExp(exp));
		}

		function printError(txt) {
			printErr(__ERROR_STR__ + txt);
		}

		function initREPL() {
			printline(__WELCOME_STR__);
			printline('');
		}

		return {
			promptUserInput: promptUserInput,
			printNewline: printNewline,
			promptInput: promptInput,
			printOutput: printOutput,
			printError: printError,
			printLog: printLog,
			initREPL: initREPL,
			loadFile: loadFile,
			link: link
		}
	}

	/* --- INITIALISATION --- */
	
	//memory
	define __DEFAULT_MEM__ 24
	var memSiz = 0x1 << (size || __DEFAULT_MEM__);
	var buffer = new ArrayBuffer(memSiz);

	//foreign modules
	var reader = READER();
	var printer = PRINTER();
	var errors = ERRORS();
	var pool = SYMBOLS();
	var timer = TIMER();
	var io = IO();

	var foreign = { 
		heapSize: memSiz,
		skip: reader.skip,
		look: reader.peek,
		read: reader.read,
		readSymbol: reader.readSymbol,
		readString: reader.readString,
		readNumber: reader.readNumber,
		loadQuo: pool.loadQuo,
		loadIff: pool.loadIff,
		loadDef: pool.loadDef,
		loadBeg: pool.loadBeg,
		loadVec: pool.loadVec,
		loadSet: pool.loadSet,
		loadLmb: pool.loadLmb,
		loadPls: pool.loadPls,
		loadMns: pool.loadMns,
		loadMul: pool.loadMul,
		loadDiv: pool.loadDiv,
		loadCns: pool.loadCns,
		loadCar: pool.loadCar,
		loadCdr: pool.loadCdr,
		loadSca: pool.loadSca,
		loadScd: pool.loadScd,
		loadLst: pool.loadLst,
		loadNeq: pool.loadNeq,
		loadSeq: pool.loadSeq,
		loadLeq: pool.loadLeq,
		loadLrg: pool.loadLrg,
		loadSma: pool.loadSma,
		loadAss: pool.loadAss,
		loadMap: pool.loadMap,
		loadAvl: pool.loadAvl,
		loadCol: pool.loadCol,
		loadClk: pool.loadClk,
		loadSlp: pool.loadSlp,
		loadErr: pool.loadErr,
		loadSre: pool.loadSre,
		loadSse: pool.loadSse,
		loadSle: pool.loadSle,
		loadIpa: pool.loadIpa,
		loadInu: pool.loadInu,
		loadIsy: pool.loadIsy,
		loadIve: pool.loadIve,
		loadIst: pool.loadIst,
		loadVcm: pool.loadVcm,
		loadVcr: pool.loadVcr,
		loadVcs: pool.loadVcs,
		loadVcl: pool.loadVcl,
		loadEqu: pool.loadEqu,
		loadEql: pool.loadEql,
		loadEva: pool.loadEva,
		loadRea: pool.loadRea,
		loadLoa: pool.loadLoa,
		loadApl: pool.loadApl,
		loadDis: pool.loadDis,
		loadNew: pool.loadNew,
		loadRst: pool.loadRst,
		loadCcc: pool.loadCcc,
		loadRnd: pool.loadRnd,
		clock: timer.getTime,
		reset: timer.reset,
		expectedRBR: errors.expectedRBR,
		invalidSyntax: errors.invalidSyntax,
		invalidSequence: errors.invalidSequence,
		invalidQuote: errors.invalidQuote,
		invalidIf: errors.invalidIf,
		invalidDefine: errors.invalidDefine,
		invalidAssignment: errors.invalidAssignment,
		invalidLambda: errors.invalidLambda,
		invalidApplication: errors.invalidApplication,
		invalidExpression: errors.invalidExpression,
		undefinedVariable: errors.undefinedVariable,
		invalidOperator: errors.invalidOperator,
		invalidParamCount: errors.invalidParamCount,
		invalidArgument: errors.invalidArgument,
		invalidRange: errors.invalidRange,
		invalidLength: errors.invalidLength,
		fatalMemory: errors.fatalMemory,
		promptUserInput: io.promptUserInput,
		printNewline: io.printNewline,
		printOutput: io.printOutput,
		promptInput: io.promptInput,
		printLog: io.printLog,
		loadFile: io.loadFile,
		initREPL: io.initREPL,
		random: Math.random
	};

	//asm module
	var asm = SLIP_ASM(callbacks.stdlib, foreign, buffer);
	asm.makeNumber = asm.makeImmediate;
	asm.numberVal = asm.immediateVal;
	asm.stringText = function(chk) {
		var len = asm.stringLength(chk);
		var arr = new Array(len);
		for(var i = 0; i < len; ++i)
			arr[i] = asm.stringAt(chk, i);
		return String.fromCharCode.apply(null, arr);
	}

	//linking
	pool.link(asm);
	reader.link(asm, pool);
	printer.link(asm);
	io.link(asm, callbacks, reader, printer);
	errors.link(io, printer);
	timer.reset();

	//init
	asm.init();

	/* ---- EXPORTS ---- */

	return {
		Slip_REPL: asm.Slip_REPL
	}
}