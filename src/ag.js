/* ---- IMPORTS ---- */

var mem = require('./mem.js');

/*===============*/
/* ---- TAG ---- */
/*===============*/

/*	
	31 BITS FOR IMMEDIATE VALUES 
	----------------------------

	[0x00000000 - 0x7ffffe00[ :: SIGNED SMALLINT
	[0x7ffffe00 - 0x7fffff00[ :: ASCII CHARACTER
	[0x7fffff00 - 0x7ffffffc[ :: NATIVE POINTER
	[0x7ffffffc - 0x7fffffff] :: SPECIAL VALUE
*/

const byteMask = 0xff;

const maxImm = (Math.pow(2,31)-1) >>> 0;
const maxNum = maxImm & 0xffffffe00;
const maxChr = maxImm & 0xfffffff00;
const maxNat = maxImm & 0xffffffffc;

const falseVal = 0;
const trueVal = 1;
const nullVal = 2;
const voidVal = 3;
const specialMask = 0x3;
const specialTab = new Array(4);

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

function eq(a, b) {

	if (mem.isImmediate(a) && mem.isImmediate(b)) {
		return (mem.immediateVal(a) === mem.immediateVal(b))	
	}

	if (!mem.isImmediate(a) && !mem.isImmediate(b)) {
		return mem.chunkEq(a, b);
	}

	return false;
}

/*======================*/
/* ---- IMMEDIATES ---- */
/*======================*/

/* ---- CHARS ---- */

const __CHAR_TAG__ = 0;

function makeChar(charCode) {
	return mem.makeImmediate(maxNum | charCode);
}

function charCode(ch) {
	var val = mem.immediateVal(ch);
	return val & byteMask; 
}

const isChar = check(__CHAR_TAG__);

/* ---- TRUE ---- */

const __TRUE_TAG__ = 1;

const __TRUE__ = mem.makeImmediate(maxNat | trueVal); 
const isTrue = check(__TRUE_TAG__);

/* ---- FALSE ---- */

const __FALSE_TAG__ = 2;

const __FALSE__ = mem.makeImmediate(maxNat | falseVal);
const isFalse = check(__FALSE_TAG__);

/* ---- VOID ---- */

const __VOID_TAG__ = 3;

const __VOID__ = mem.makeImmediate(maxNat | voidVal);
const isVoid = check(__VOID_TAG__);

/* ---- NULL ---- */

const __NULL_TAG__ = 4;

const __NULL__ = mem.makeImmediate(maxNat | nullVal);
const isNull = check(__NULL_TAG__);

/* ---- NUMBER ---- */

const __NUMBER_TAG__ = 5;

function makeNumber(nbr) {
	return mem.makeImmediate(nbr);
}

function numberVal(exp) {
	return mem.immediateVal(exp);
}

const isNumber = check(__NUMBER_TAG__);

/* ---- NATIVES ----- */

const __NATIVE_TAG__ = 11;

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

const __PAIR_RAW__ = 0;
const __PAIR_TAG__ = 6;
const __PAIR_SIZ__ = 2;

const __PAIR_CAR__ = 1;
const __PAIR_CDR__ = 2;

function makePair(car, cdr) {

	var pair = mem.makeChunk(__PAIR_RAW__,
							 __PAIR_TAG__,
							 __PAIR_SIZ__);

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

const __PROCEDURE_RAW__ = 0;
const __PROCEDURE_TAG__ = 7;
const __PROCEDURE_SIZ__ = 3;

const __PROCEDURE_PAR__ = 1;
const __PROCEDURE_BDY__ = 2;
const __PROCEDURE_ENV__ = 3;

function makeProcedure(par, bdy, env) {

	var fun = mem.makeChunk(__PROCEDURE_RAW__,
							__PROCEDURE_TAG__,
							__PROCEDURE_SIZ__);

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

const __VECTOR_RAW__ = 0;
const __VECTOR_TAG__ = 8;

function makeVector(siz, exp) {

	var vct = mem.makeChunk(__VECTOR_RAW__,
							__VECTOR_TAG__,
							siz);

	//fill vector
	var idx = 0, val = exp || __VOID__;
	while(idx < siz) {
		mem.chunkSet(vct, ++idx, val);
	}

	return vct;
}

function vectorRef(vct, idx) {
	return mem.chunkGet(vct, idx);
}

function vectorSet(vct, idx, val) {
	mem.chunkSet(vct, idx, val);
}

function vectorLength(vct) {
	return mem.chunkSize(vct);
}

const isVector = check(__VECTOR_TAG__);
const __EMPTY_VEC__ = makeVector(0);

/* ---- SEQUENCE ---- */

const __SEQUENCE_RAW__ = 0;
const __SEQUENCE_TAG__ = 13;

function makeSequence(siz) {

	var seq = mem.makeChunk(__SEQUENCE_RAW__,
							__SEQUENCE_TAG__,
							siz);
	return seq;
}

function sequenceAt(seq, idx) {
	return mem.chunkGet(seq, idx);
}

function sequenceSet(seq, idx, val) {
	mem.chunkSet(seq, idx, val);
}

function sequenceLength(seq) {
	return mem.chunkSize(seq);
}

const isSequence = check(__SEQUENCE_TAG__);

/* ---- IFS ---- */

const __IFS_RAW__ = 0;
const __IFS_TAG__ = 14;
const __IFS_SIZ__ = 2;

const __IFS_PRE__ = 1;
const __IFS_CON__ = 2;

function makeIfs(pred, conseq) {

	var ifs = mem.makeChunk(__IFS_RAW__,
							__IFS_TAG__,
							__IFS_SIZ__);

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

const __IFF_RAW__ = 0;
const __IFF_TAG__ = 15;
const __IFF_SIZ__ = 3;

const __IFF_PRE__ = 1;
const __IFF_CON__ = 2;
const __IFF_ALT__ = 3;

function makeIff(pred, conseq, alter) {

	var iff = mem.makeChunk(__IFF_RAW__,
							__IFF_TAG__,
							__IFF_SIZ__);

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

const __QUO_RAW__ = 0;
const __QUO_TAG__ = 16;
const __QUO_SIZ__ = 1;

const __QUO_EXP__ = 1;

function makeQuo(exp) {
	
	var quo = mem.makeChunk(__QUO_RAW__,
							__QUO_TAG__,
							__QUO_SIZ__);

	mem.chunkSet(quo, __QUO_EXP__, exp);
	return quo;
}

function quoExpression(quo) {
	return mem.chunkGet(quo, __QUO_EXP__);
}

const isQuo = check(__QUO_TAG__);

/* ---- LAMBDA ---- */

const __LAMBDA_RAW__ = 0;
const __LAMBDA_TAG__ = 17;
const __LAMBDA_SIZ__ = 2;

const __LAMBDA_ARG__ = 1;
const __LAMBDA_BDY__ = 2;

function makeLambda(arg, bdy) {

	var lmb = mem.makeChunk(__LAMBDA_RAW__,
							__LAMBDA_TAG__,
							__LAMBDA_BDY__);

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

const __DFV_RAW__ = 0;
const __DFV_TAG__ = 18;
const __DFV_SIZ__ = 2;

const __DFV_VAR__ = 1;
const __DFV_VAL__ = 2;

function makeDfv(vrb, val) {

	var dfv = mem.makeChunk(__DFV_RAW__,
							__DFV_TAG__,
							__DFV_SIZ__);

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

const __DFF_RAW__ = 0;
const __DFF_TAG__ = 19;
const __DFF_SIZ__ = 3;

const __DFF_VAR__ = 1;
const __DFF_ARG__ = 2;
const __DFF_BDY__ = 3;

function makeDff(vrb, arg, bdy) {

	var dff = mem.makeChunk(__DFF_RAW__,
							__DFF_TAG__,
							__DFF_SIZ__);

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

/* ---- LET ---- */

const __LET_RAW__ = 0;
const __LET_TAG__ = 20;
const __LET_SIZ__ = 2;

const __LET_BND__ = 1;
const __LET_BDY__ = 2;

function makeLet(bnd, bdy) {

	var let = mem.makeChunk(__LET_RAW__,
							__LET_TAG__,
							__LET_SIZ__);

	mem.chunkSet(let, __LET_BND__, bnd);
	mem.chunkSet(let, __LET_BDY__, bdy);
	return let;
}

function letBindings(let) {
	return mem.chunkGet(let, __LET_BND__);
}

function letBody(let) {
	return mem.chunkGet(let, __LET_BDY__);
}

const isLet = check(__LET_TAG__);

/* ---- SET ---- */

const __SET_RAW__ = 0;
const __SET_TAG__ = 21;
const __SET_SIZ__ = 2;

const __SET_VAR__ = 1;
const __SET_VAL__ = 2;

function makeSet(vrb, val) {

	var set = mem.makeChunk(__SET_RAW__,
							__SET_TAG__,
							__SET_SIZ__);

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

const __APPLICATION_RAW__ = 0;
const __APPLICATION_TAG__ = 22;
const __APPLICATION_SIZ__ = 2;

const __APPLICATION_OPR__ = 1;
const __APPLICATION_OPD__ = 2;

function makeApplication(opr, opd) {

	var apl = mem.makeChunk(__APPLICATION_RAW__,
							__APPLICATION_TAG__,
							__APPLICATION_SIZ__);

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

/* ---- STRING ---- */

// for now, we just use javascript strings ...
// ... later we'll have to encode everything in chunks

const __STRING_RAW__ = 1;
const __STRING_TAG__ = 9;
const __STRING_SIZ__ = 1;

const __STRING_TXT__ = 1;

function makeString(txt) {

	var str = mem.makeChunk(__STRING_RAW__,
							__STRING_TAG__,
							__STRING_SIZ__);

	mem.chunkSet(str, __STRING_TXT__, txt);
	return str;
}

function stringText(str) {
	return mem.chunkGet(str, __STRING_TXT__);
}

const isString = check(__STRING_TAG__);

/* ---- DOUBLE PRECISION FLOATS ---- */

// for now, we just use javascript numbers ...
// ... later we'll have to encode everything in chunks

const __DOUBLE_RAW__ = 1;
const __DOUBLE_TAG__ = 10;
const __DOUBLE_SIZ__ = 1;

const __DOUBLE_NBR__ = 1;

function makeDouble(nbr) {

	var dbl = mem.makeChunk(__DOUBLE_RAW__,
							__DOUBLE_TAG__,
							__DOUBLE_SIZ__);

	mem.chunkSet(dbl, __DOUBLE_NBR__, nbr);
	return dbl;
}

function doubleVal(dbl) {
	return mem.chunkGet(dbl, __DOUBLE_NBR__);
}

const isDouble = check(__DOUBLE_TAG__);

/* ---- SYMBOLS ---- */

// for now, we just use javascript strings ...
// ... later we'll have to encode everything in chunks

const __SYMBOL_RAW__ = 1;
const __SYMBOL_TAG__ = 12;
const __SYMBOL_SIZ__ = 1;

const __SYMBOL_TXT__ = 1;

function makeSymbol(txt) {

	var sym = mem.makeChunk(__SYMBOL_RAW__,
							__SYMBOL_TAG__,
							__SYMBOL_SIZ__);

	mem.chunkSet(sym, __SYMBOL_TXT__, txt);
	return sym;
}

function symbolText(sym) {
	return mem.chunkGet(sym, __SYMBOL_TXT__);
}

const isSymbol = check(__SYMBOL_TAG__);

/* ---- EXPORTS ---- */

/* TAG */
exports.tag = tag;
/* EQ */
exports.eq = eq;
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
/* STRING */
exports.__STRING_TAG__ = __STRING_TAG__;
exports.isString = isString;
exports.makeString = makeString;
exports.stringText = stringText;
/* DOUBLE */
exports.__DOUBLE_TAG__ = __DOUBLE_TAG__;
exports.isDouble = isDouble;
exports.makeDouble = makeDouble;
exports.doubleVal = doubleVal;
/* NATIVE */
exports.__NATIVE_TAG__ = __NATIVE_TAG__;
exports.isNative = isNative;
exports.makeNative = makeNative;
exports.nativePtr = nativePtr;
/* SYMBOL */
exports.__SYMBOL_TAG__ = __SYMBOL_TAG__;
exports.isSymbol = isSymbol;
exports.makeSymbol = makeSymbol;
exports.symbolText = symbolText;
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
/* LET */
exports.__LET_TAG__ = __LET_TAG__;
exports.makeLet = makeLet;
exports.isLet = isLet;
exports.letBindings = letBindings;
exports.letBody = letBody;
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