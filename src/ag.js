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
	makeImmediate(nbr);
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
	return mem.chunkGet(vct, idx + 1);
}

function vectorSet(vct, idx, val) {
	mem.chunkSet(vct, idx + 1, val);
}

function vectorLength(vct) {
	return mem.chunkSize(vct);
}

const isVector = check(__VECTOR_TAG__);

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

/* ---- EXPORTS ---- */

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