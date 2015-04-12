const maxTag = 0x3f;
/* -- POINTER STRUCTURES -- */
const __PAIR_TAG__ 			= 0x00 << 1 | 0;
const __VECTOR_TAG__ 		= 0x01 << 1 | 0;
const __PROCEDURE_TAG__ 	= 0x02 << 1 | 0;
const __SEQUENCE_TAG__ 		= 0x03 << 1 | 0;
const __IFS_TAG__ 			= 0x04 << 1 | 0;
const __IFF_TAG__ 			= 0x05 << 1 | 0;
const __DFV_TAG__ 			= 0x06 << 1 | 0;
const __DFF_TAG__ 			= 0x07 << 1 | 0;
const __APPLICATION_TAG__ 	= 0x08 << 1 | 0;
const __LAMBDA_TAG__ 		= 0x09 << 1 | 0;
const __SET_TAG__ 			= 0x0a << 1 | 0;
const __QUO_TAG__			= 0x0b << 1 | 0;

/* -- RAW CHUNKS -- */
const __FLOAT_TAG__			= 0x00 << 1 | 1;
const __SYMBOL_TAG__		= 0x01 << 1 | 1;
const __STRING_TAG__		= 0x02 << 1 | 1;

/* -- IMMEDIATES -- */
const __CHAR_TAG__ = maxTag+1;
const __TRUE_TAG__ = maxTag+2;
const __FALSE_TAG__ = maxTag+3;
const __VOID_TAG__ = maxTag+4;
const __NULL_TAG__ = maxTag+5;
const __NUMBER_TAG__ = maxTag+6;
const __NATIVE_TAG__ = maxTag+7;

function GRAMMAR() {

	/* -- CONSTANTS -- */
	const byteMask = 0xff;
	const maxImm = 0x3fffffff;
	const maxNum = 0x3ffffe00;
	const maxChr = 0x3fffff00;
	const maxNat = 0x3ffffffc;
	const falseVal = 0;
	const trueVal = 1;
	const nullVal = 2;
	const voidVal = 3;
	const specialMask = 0x3;
	const specialTab = new Array(4);

	/*===============*/
	/* ---- TAG ---- */
	/*===============*/

	/*	31 BITS FOR IMMEDIATE VALUES 
	[0x00000000 - 0x3ffffe00[ :: SIGNED SMALLINT
	[0x3ffffe00 - 0x3fffff00[ :: ASCII CHARACTER
	[0x3fffff00 - 0x3ffffffc[ :: NATIVE POINTER
	[0x3ffffffc - 0x3fffffff] :: SPECIAL VALUE */

	function tag(exp) {

		if(mem.isImmediate(exp)) {

			var val = mem.immediateVal(exp);

			/* SIGNED SMALLINT */
			if (val < maxNum) {
				return __NUMBER_TAG__;
			/* ASCII CHARACTER */
			} else if (val < maxChr) {
				return __CHAR_TAG__;
			/* NATIVES */
			} else if (val < maxNat) {
				return __NATIVE_TAG__;
			/* SPECIAL VALUE */
			} else {
				return specialTab[val & specialMask];
			}

	 	} else {
			return mem.chunkTag(exp);
	 	}
	}

	function check(expectedTag) {
		return function (exp) {
			return (tag(exp) === expectedTag);
		}
	}

	/*==================*/
	/* -- IMMEDIATES -- */
	/*==================*/

	/* ---- CHARS ---- */

	function makeChar(charCode) {
		return mem.makeImmediate(maxNum | charCode);
	}

	function charCode(ch) {
		return mem.immediateVal(ch) & byteMask; 
	}

	const isChar = check(__CHAR_TAG__);

	/* ---- TRUE ---- */

	const __TRUE__ = mem.makeImmediate(maxNat | trueVal); 
	const isTrue = check(__TRUE_TAG__);

	/* ---- FALSE ---- */

	const __FALSE__ = mem.makeImmediate(maxNat | falseVal);
	const isFalse = check(__FALSE_TAG__);

	/* ---- VOID ---- */

	const __VOID__ = mem.makeImmediate(maxNat | voidVal);
	const isVoid = check(__VOID_TAG__);

	/* ---- NULL ---- */

	const __NULL__ = mem.makeImmediate(maxNat | nullVal);
	const isNull = check(__NULL_TAG__);

	/* ---- NUMBER ---- */

	function makeNumber(nbr) {
		return mem.makeImmediate(nbr);
	}

	function numberVal(exp) {
		return mem.immediateVal(exp);
	}

	const isNumber = check(__NUMBER_TAG__);

	/* ---- NATIVES ----- */

	function makeNative(nat) {
		return mem.makeImmediate(maxChr | nat);
	}

	function nativePtr(nat) {
		var val = mem.immediateVal(nat);
		return val & byteMask;
	}

	const isNative = check(__NATIVE_TAG__);

	// setup jump table
	specialTab[falseVal] = __FALSE_TAG__;
	specialTab[trueVal] = __TRUE_TAG__;
	specialTab[nullVal] = __NULL_TAG__;
	specialTab[voidVal] = __VOID_TAG__;

	/*==================*/
	/* ---- CHUNKS ---- */
	/*==================*/

	/* ---- PAIR ---- */

	const __PAIR_SIZ__ = 2;
	const __PAIR_CAR__ = 1<<2;
	const __PAIR_CDR__ = 2<<2;

	function makePair(car, cdr) {
		var pair = mem.makeChunk(__PAIR_TAG__, __PAIR_SIZ__);
		mem.chunkSet(pair, __PAIR_CAR__, car);
		mem.chunkSet(pair, __PAIR_CDR__, cdr);
		return pair;
	}

	function pairCar(ptr) {
		return mem.chunkGet(ptr, __PAIR_CAR__);
	}

	function pairCdr(ptr) {
		return mem.chunkGet(ptr, __PAIR_CDR__);
	}

	function pairSetCar(ptr, exp) {
		return mem.chunkSet(ptr, __PAIR_CAR__, exp)
	}

	function pairSetCdr(ptr, exp) {
		return mem.chunkSet(ptr, __PAIR_CDR__, exp);
	}

	const isPair = check(__PAIR_TAG__);

	/* ---- PROCEDURE ---- */

	const __PROCEDURE_SIZ__ = 3;
	const __PROCEDURE_PAR__ = 1<<2;
	const __PROCEDURE_BDY__ = 2<<2;
	const __PROCEDURE_ENV__ = 3<<2;

	function makeProcedure(par, bdy, env) {

		var fun = mem.makeChunk(__PROCEDURE_TAG__, __PROCEDURE_SIZ__);
		mem.chunkSet(fun, __PROCEDURE_PAR__, par);
		mem.chunkSet(fun, __PROCEDURE_BDY__, bdy);
		mem.chunkSet(fun, __PROCEDURE_ENV__, env);
		return fun;
	}

	function procedurePar(exp) {
		return mem.chunkGet(exp, __PROCEDURE_PAR__);
	}

	function procedureBdy(exp) {
		return mem.chunkGet(exp, __PROCEDURE_BDY__);
	}

	function procedureEnv(exp) {
		return mem.chunkGet(exp, __PROCEDURE_ENV__);
	}

	const isProcedure = check(__PROCEDURE_TAG__);

	/* ---- VECTOR ---- */

	function makeVector(siz, exp) {
		var vct = mem.makeChunk(__VECTOR_TAG__, siz);
		var val = exp || __VOID__; //fill vector
		for(var idx = 1; idx <= siz; ++idx)
			mem.chunkSet(vct, idx<<2, val);
		return vct;
	}

	function vectorRef(vct, idx) {
		return mem.chunkGet(vct, idx<<2);
	}

	function vectorSet(vct, idx, val) {
		mem.chunkSet(vct, idx<<2, val);
	}

	function vectorLength(vct) {
		return mem.chunkSize(vct);
	}

	const isVector = check(__VECTOR_TAG__);
	const __EMPTY_VEC__ = makeVector(0, __VOID__);

	/* ---- SEQUENCE ---- */

	function makeSequence(siz) {
		return mem.makeChunk(__SEQUENCE_TAG__, siz);
	}

	function sequenceAt(seq, idx) {
		return mem.chunkGet(seq, idx<<2);
	}

	function sequenceSet(seq, idx, val) {
		mem.chunkSet(seq, idx<<2, val);
	}

	function sequenceLength(seq) {
		return mem.chunkSize(seq);
	}

	const isSequence = check(__SEQUENCE_TAG__);

	/* ---- IFS ---- */

	const __IFS_SIZ__ = 2;
	const __IFS_PRE__ = 1<<2;
	const __IFS_CON__ = 2<<2;

	function makeIfs(pred, conseq) {
		var ifs = mem.makeChunk(__IFS_TAG__, __IFS_SIZ__);
		mem.chunkSet(ifs, __IFS_PRE__, pred);
		mem.chunkSet(ifs, __IFS_CON__, conseq);
		return ifs;
	}

	function ifsPredicate(ifs) {
		return mem.chunkGet(ifs, __IFS_PRE__);
	}

	function ifsConsequence(ifs) {
		return mem.chunkGet(ifs, __IFS_CON__);
	}

	const isIfs = check(__IFS_TAG__);

	/* ---- IFF ---- */

	const __IFF_SIZ__ = 3;
	const __IFF_PRE__ = 1<<2;
	const __IFF_CON__ = 2<<2;
	const __IFF_ALT__ = 3<<2;

	function makeIff(pred, conseq, alter) {
		var iff = mem.makeChunk(__IFF_TAG__, __IFF_SIZ__);
		mem.chunkSet(iff, __IFF_PRE__, pred);
		mem.chunkSet(iff, __IFF_CON__, conseq);
		mem.chunkSet(iff, __IFF_ALT__, alter);
		return iff;
	}

	function iffPredicate(iff) {
		return mem.chunkGet(iff, __IFF_PRE__);
	}

	function iffConsequence(iff) {
		return mem.chunkGet(iff, __IFF_CON__);
	}

	function iffAlternative(iff) {
		return mem.chunkGet(iff, __IFF_ALT__);
	}

	const isIff = check(__IFF_TAG__);

	/* ---- QUO ---- */

	const __QUO_SIZ__ = 1;
	const __QUO_EXP__ = 1<<2;

	function makeQuo(exp) {
		var quo = mem.makeChunk(__QUO_TAG__, __QUO_SIZ__);
		mem.chunkSet(quo, __QUO_EXP__, exp);
		return quo;
	}

	function quoExpression(quo) {
		return mem.chunkGet(quo, __QUO_EXP__);
	}

	const isQuo = check(__QUO_TAG__);

	/* ---- LAMBDA ---- */

	const __LAMBDA_SIZ__ = 2;
	const __LAMBDA_ARG__ = 1<<2;
	const __LAMBDA_BDY__ = 2<<2;

	function makeLambda(arg, bdy) {
		var lmb = mem.makeChunk(__LAMBDA_TAG__, __LAMBDA_SIZ__);
		mem.chunkSet(lmb, __LAMBDA_ARG__, arg);
		mem.chunkSet(lmb, __LAMBDA_BDY__, bdy);
		return lmb;
	}

	function lambdaArg(lmb) {
		return mem.chunkGet(lmb, __LAMBDA_ARG__);
	}

	function lambdaBdy(lmb) {
		return mem.chunkGet(lmb, __LAMBDA_BDY__);
	}

	const isLambda = check(__LAMBDA_TAG__);

	/* ---- DEFINE VARIABLE ---- */

	const __DFV_SIZ__ = 2;
	const __DFV_VAR__ = 1<<2;
	const __DFV_VAL__ = 2<<2;

	function makeDfv(vrb, val) {
		var dfv = mem.makeChunk(__DFV_TAG__, __DFV_SIZ__);
		mem.chunkSet(dfv, __DFV_VAR__, vrb);
		mem.chunkSet(dfv, __DFV_VAL__, val);
		return dfv;
	}

	function dfvVariable(dfv) {
		return mem.chunkGet(dfv, __DFV_VAR__);
	}

	function dfvValue(dfv) {
		return mem.chunkGet(dfv, __DFV_VAL__);
	}

	const isDfv = check(__DFV_TAG__);

	/* ---- DEFINE FUNCTION ---- */

	const __DFF_SIZ__ = 3;
	const __DFF_VAR__ = 1<<2;
	const __DFF_ARG__ = 2<<2;
	const __DFF_BDY__ = 3<<2;

	function makeDff(vrb, arg, bdy) {
		var dff = mem.makeChunk(__DFF_TAG__, __DFF_SIZ__);
		mem.chunkSet(dff, __DFF_VAR__, vrb);
		mem.chunkSet(dff, __DFF_ARG__, arg);
		mem.chunkSet(dff, __DFF_BDY__, bdy);
		return dff;
	}

	function dffVariable(dff) {
		return mem.chunkGet(dff, __DFF_VAR__);
	}

	function dffArguments(dff) {
		return mem.chunkGet(dff, __DFF_ARG__);
	}

	function dffBody(dff) {
		return mem.chunkGet(dff, __DFF_BDY__);
	}

	const isDff = check(__DFF_TAG__);

	/* ---- SET ---- */

	const __SET_SIZ__ = 2;
	const __SET_VAR__ = 1<<2;
	const __SET_VAL__ = 2<<2;

	function makeSet(vrb, val) {
		var set = mem.makeChunk(__SET_TAG__, __SET_SIZ__);
		mem.chunkSet(set, __SET_VAR__, vrb);
		mem.chunkSet(set, __SET_VAL__, val);
		return set;
	}

	function setVariable(set) {
		return mem.chunkGet(set, __SET_VAR__);
	}

	function setValue(set) {
		return mem.chunkGet(set, __SET_VAL__);
	}

	const isSet = check(__SET_TAG__);

	/* ---- APPLICATION ---- */

	const __APPLICATION_SIZ__ = 2;
	const __APPLICATION_OPR__ = 1<<2;
	const __APPLICATION_OPD__ = 2<<2;

	function makeApplication(opr, opd) {
		var apl = mem.makeChunk(__APPLICATION_TAG__, __APPLICATION_SIZ__);
		mem.chunkSet(apl, __APPLICATION_OPR__, opr);
		mem.chunkSet(apl, __APPLICATION_OPD__, opd);
		return apl;
	}

	function aplOperator(apl) {
		return mem.chunkGet(apl, __APPLICATION_OPR__);
	}

	function aplOperands(apl) {
		return mem.chunkGet(apl, __APPLICATION_OPD__);
	}

	const isApplication = check(__APPLICATION_TAG__);

	/*================*/
	/* ---- RAWS ---- */
	/*================*/

	/* --- FLOATS --- */

	const __FLOAT_SIZ__ = 1;
	const __FLOAT_NBR__ = 1<<2;

	function makeFloat(nbr) {
		var flt = mem.makeChunk(__FLOAT_TAG__, __FLOAT_SIZ__);
		mem.chunkSetFloat(flt, __FLOAT_NBR__, nbr);
		return flt;
	}

	function floatNumber(flt) {
		return mem.chunkGetFloat(flt, __FLOAT_NBR__);
	}

	const isFloat = check(__FLOAT_TAG__);

	/* --- TEXT --- */

	function encodeText(tag, txt) {

		var len = txt.length;
		while(len&0x3) ++len;
		var chk = mem.makeChunk(tag, len>>2);

		var ch; //current character
		for(var i = 0; i < len; ++i) {
			ch = txt.charCodeAt(i) || 0;
			mem.chunkSetByte(chk, i+4, ch);
		}

		return chk;
	}

	const __empty_str__ = '';

	function decodeText(chk) {

		var siz = mem.chunkSize(chk);

		if(siz) {

			var len = (siz - 1) << 2;
			var arr = new Array(len);

			//main string
			for(var i = 0; i < len; ++i)
				arr[i] = mem.chunkGetByte(chk, i+4);

			//last characters
			i += 4; //skip header
			var ch, end = i+4;
			while(i < end) {
				ch = mem.chunkGetByte(chk, i++);
				if(ch)
					arr.push(ch)
				else
					break;
			}
			return String.fromCharCode.apply(null, arr);

		} else {
			return __empty_str__;
		}
	}

	/* --- STRINGS --- */

	function makeString(txt) {
		return encodeText(__STRING_TAG__, txt);
	}

	function stringLength(str) {
		
		var len = mem.chunkSize(str) << 2;
		if (len)
			while(!mem.chunkGetByte(str, len+3))
				--len;
		return len;
	}

	const stringText = decodeText;
	const isString = check(__STRING_TAG__);

	/* --- SYMBOLS --- */

	function makeSymbol(txt) {
		return encodeText(__SYMBOL_TAG__, txt);
	}

	const symbolText = decodeText;
	const isSymbol = check(__SYMBOL_TAG__);


	/* ---- EXPORTS ---- */

	var exports = {};
	
	/* TAG */
	exports.tag = tag;
	/* TRUE */
	exports.__TRUE__ = __TRUE__;
	exports.__TRUE_TAG__ = __TRUE_TAG__;
	exports.isTrue = isTrue;
	/* FALSE */
	exports.__FALSE__ = __FALSE__;
	exports.__FALSE_TAG__ = __FALSE_TAG__;
	exports.isFalse = isFalse;
	/* NULL */
	exports.__NULL__ = __NULL__;
	exports.__NULL_TAG__ = __NULL_TAG__;
	exports.isNull = isNull;
	/* VOID */
	exports.__VOID__ = __VOID__;
	exports.__VOID_TAG__ = __VOID_TAG__;
	exports.isVoid = isVoid;
	/* NUMBER */
	exports.__NUMBER_TAG__ = __NUMBER_TAG__;
	exports.makeNumber = makeNumber;
	exports.numberVal = numberVal;
	exports.isNumber = isNumber;
	/* CHARACTER */
	exports.__CHAR_TAG__ = __CHAR_TAG__;
	exports.makeChar = makeChar;
	exports.charCode = charCode;
	exports.isChar = isChar;
	/* PAIR */
	exports.__PAIR_TAG__ = __PAIR_TAG__;
	exports.isPair = isPair;
	exports.makePair = makePair;
	exports.pairCar = pairCar;
	exports.pairCdr = pairCdr;
	exports.pairSetCar = pairSetCar;
	exports.pairSetCdr = pairSetCdr;
	/* PROCEDURE */
	exports.__PROCEDURE_TAG__ = __PROCEDURE_TAG__;
	exports.makeProcedure = makeProcedure;
	exports.isProcedure = isProcedure;
	exports.procedureEnv = procedureEnv;
	exports.procedureBdy = procedureBdy;
	exports.procedurePar = procedurePar;
	/* VECTOR */
	exports.__VECTOR_TAG__ = __VECTOR_TAG__;
	exports.makeVector = makeVector;
	exports.isVector = isVector;
	exports.vectorRef = vectorRef;
	exports.vectorSet = vectorSet;
	exports.vectorLength = vectorLength;
	exports.__EMPTY_VEC__ = __EMPTY_VEC__;
	/* FLOATS */
	exports.__FLOAT_TAG__ = __FLOAT_TAG__;
	exports.makeFloat = makeFloat;
	exports.floatNumber = floatNumber;
	exports.isFloat = isFloat;
	/* STRINGS */
	exports.__STRING_TAG__ = __STRING_TAG__;
	exports.makeString = makeString;
	exports.stringText = stringText;
	exports.stringLength = stringLength;
	exports.isString = isString;
	/* SYMBOLS */
	exports.__SYMBOL_TAG__ = __SYMBOL_TAG__;
	exports.makeSymbol = makeSymbol;
	exports.symbolText = symbolText;
	exports.isSymbol = isSymbol;
	/* NATIVE */
	exports.__NATIVE_TAG__ = __NATIVE_TAG__;
	exports.isNative = isNative;
	exports.makeNative = makeNative;
	exports.nativePtr = nativePtr;
	/* BEGIN */
	exports.__SEQUENCE_TAG__ = __SEQUENCE_TAG__;
	exports.makeSequence = makeSequence;
	exports.isSequence = isSequence;
	exports.sequenceSet = sequenceSet;
	exports.sequenceAt = sequenceAt;
	exports.sequenceLength =sequenceLength;
	/* IFS */
	exports.__IFS_TAG__ = __IFS_TAG__;
	exports.isIfs = isIfs;
	exports.makeIfs = makeIfs;
	exports.ifsPredicate = ifsPredicate;
	exports.ifsConsequence = ifsConsequence;
	/* IFF */
	exports.__IFF_TAG__ = __IFF_TAG__;
	exports.isIff = isIff;
	exports.makeIff = makeIff;
	exports.iffPredicate = iffPredicate;
	exports.iffConsequence = iffConsequence;
	exports.iffAlternative = iffAlternative;
	/* QUOTE */
	exports.__QUO_TAG__ = __QUO_TAG__;
	exports.isQuo = isQuo;
	exports.makeQuo = makeQuo;
	exports.quoExpression = quoExpression;
	/* LAMBDA */
	exports.__LAMBDA_TAG__ = __LAMBDA_TAG__;
	exports.isLambda = isLambda;
	exports.makeLambda = makeLambda;
	exports.lambdaArg = lambdaArg;
	exports.lambdaBdy = lambdaBdy;
	/* DFV */
	exports.__DFV_TAG__ = __DFV_TAG__;
	exports.makeDfv = makeDfv;
	exports.isDfv = isDfv;
	exports.dfvVariable = dfvVariable;
	exports.dfvValue = dfvValue;
	/* DFF */
	exports.__DFF_TAG__ = __DFF_TAG__;
	exports.makeDff = makeDff;
	exports.isDff = isDff;
	exports.dffVariable = dffVariable;
	exports.dffBody = dffBody;
	exports.dffArguments = dffArguments;
	/* SET */
	exports.__SET_TAG__ = __SET_TAG__;
	exports.makeSet = makeSet;
	exports.isSet = isSet;
	exports.setVariable = setVariable;
	exports.setValue = setValue;
	/* APL */
	exports.__APPLICATION_TAG__ = __APPLICATION_TAG__;
	exports.makeApplication = makeApplication;
	exports.isApplication = isApplication;
	exports.aplOperator = aplOperator;
	exports.aplOperands = aplOperands;

	return exports;
}