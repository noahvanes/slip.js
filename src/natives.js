/* --- IMPORTS --- */

//TODO: double stack + roadmap + compile vars/parameters + clean natives + apply/stack + better errors + let + cond
//DONE: compiler + mem immediates + stack 1 + ...

const ag = require('./ag.js');
const IO = require('./IO.js');
const symbols = require('./pool.js');
const stk = require('./stack.js');
const printer = require('./printer.js');
const exec = require('./exec.js');
const reader = require('./reader.js');
const compiler = require('./compile.js'); 

const regs = exec.regs;
const car = ag.pairCar;
const cdr = ag.pairCdr;

/* --- ERRORS --- */

var error;
function setErr(handler) {
	error = handler;
}

/* --- NATIVE --- */

function native() {

	regs.ADR = ag.nativePtr(regs.PRC);
	/* DISPATCH */
	switch (regs.ADR) {
		/* ARITHMETIC */
		case __ADD_PTR__: return add;
		case __SUB_PTR__: return sub;
		case __MUL_PTR__: return mul;
		case __DIV_PTR__: return div;
		/* PAIRS/LISTS */
		case __CONS_PTR__: return mcons;
		case __CAR_PTR__: return mcar;
		case __CDR_PTR__: return mcdr;
		case __SET_CAR_PTR__: return scar;
		case __SET_CDR_PTR__: return scdr;
		case __LIST_PTR__: return list;
		case __ASSOC_PTR__: return assoc;
		case __MAP_PTR__: return map;
		/* VECTORS */
		case __VMAKE_PTR__: return makeVector;
		case __VREF_PTR__: return vectorRef;
		case __VSET_PTR__: return vectorSet;
		case __VLEN_PTR__: return vectorLength;
		case __VECTOR_PTR__: return vector;
		/* COMPARISONS */
		case __EQ_PTR__: return eq;
		case __NBR_EQ_PTR__: return nbr_eq;
		case __SMA_PTR__: return sma;
		case __LRG_PTR__: return lrg;
		case __LEQ_PTR__: return leq;
		case __SEQ_PTR__: return seq;
		/* META */
		case __EVAL_PTR__: return _eval;
		case __APPLY_PTR__: return _apply;
		case __READ_PTR__: return read;
		case __LOAD_PTR__: return load;
		/* DISPLAY */
		case __DISP_PTR__: return display;
		case __NEWLINE_PTR__: return newline;
		/* TYPE CHECKS */
		case __IS_PAIR_PTR__: return isPair;
		case __IS_NULL_PTR__: return isNull;
		case __IS_SYMBOL_PTR__: return isSymbol;
		case __IS_VECTOR_PTR__: return isVector;
	}
}

/* --- ARITHMETIC --- */

const __ADD_PTR__ = 0;

function add() {

	regs.VAL = 0;
	while(regs.LEN--) {
		regs.EXP = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);
		switch (ag.tag(regs.EXP)) {
			case ag.__NUMBER_TAG__:
				regs.VAL += ag.numberVal(regs.EXP);
				break;
			case ag.__DOUBLE_TAG__:
				regs.VAL += ag.doubleVal(regs.EXP);
				break;
			default:
				regs.TXT = 'invalid argument type';
				return error;
		}
	}

	regs.VAL = ag.makeNumber(regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

const __SUB_PTR__ = 1;

function sub() {

	if (regs.LEN === 0) {
		regs.TXT = 'insufficient arguments';
		return error;
	}

	/* UNARY => NEGATION */
	if (regs.LEN === 1) {
		regs.ARG = car(regs.ARG);
		if (ag.isNumber(regs.VAL))
			regs.VAL = ag.makeNumber(-ag.numberVal(regs.ARG));
		else if (ag.isDouble(regs.VAL))
			regs.VAL = ag.makeDouble(-ag.doubleVal(regs.ARG));
		else {
			regs.TXT = 'invalid argument';
			return error;
		}

		regs.KON = stk.restore();
		return regs.KON;
	}

	/* N-ARY => SUBSTRACTION */
	regs.VAL = car(regs.ARG);
	regs.ARG = cdr(regs.ARG);
	
	if (ag.isNumber(regs.VAL))
		regs.VAL = ag.numberVal(regs.VAL);
	else if (ag.isDouble(regs.VAL))
		regs.VAL = ag.doubleVal(regs.VAL);
	else {
		regs.TXT = 'invalid argument';
		return error;
	}

	while(--regs.LEN) {
		regs.EXP = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);
		switch (ag.tag(regs.EXP)) {
			case ag.__NUMBER_TAG__:
				regs.VAL -= ag.numberVal(regs.EXP);
				break;
			case ag.__DOUBLE_TAG__:
				regs.VAL -= ag.doubleVal(regs.EXP);
				break;
			default:
				regs.TXT = 'invalid argument type';
				return error;
		}
	}

	regs.VAL = ag.makeNumber(regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

const __MUL_PTR__ = 2;

function mul() {

	regs.VAL = 1;
	while(regs.LEN--) {
		regs.EXP = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);
		switch (ag.tag(regs.EXP)) {
			case ag.__NUMBER_TAG__:
				regs.VAL *= ag.numberVal(regs.EXP);
				break;
			case ag.__DOUBLE_TAG__:
				regs.VAL *= ag.doubleVal(regs.EXP);
				break;
			default:
				regs.TXT = 'invalid argument type';
				return error;
		}
	}

	regs.VAL = ag.makeNumber(regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

const __DIV_PTR__ = 3;

function div() {

	if (regs.LEN === 0) {
		regs.TXT = 'insufficient arguments';
		return error;
	}

	regs.VAL = car(regs.ARG);
	regs.ARG = cdr(regs.ARG);
	
	if(ag.isNumber(regs.VAL)) {
		regs.VAL = ag.numberVal(regs.VAL);
	} else if (ag.isDouble(regs.VAL)) {
		regs.VAL = ag.doubleVal(regs.VAL);
	} else {
		regs.TXT = 'invalid argument';
		return error;
	}

	while(--regs.LEN) {
		regs.EXP = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);
		switch (ag.tag(regs.EXP)) {
			case ag.__NUMBER_TAG__:
				regs.VAL /= ag.numberVal(regs.EXP);
				break;
			case ag.__DOUBLE_TAG__:
				regs.VAL /= ag.doubleVal(regs.EXP);
				break;
			default:
				regs.TXT = 'invalid argument type';
				return error;
		}
	}

	regs.VAL = ag.makeNumber(regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- PAIRS --- */

const __CONS_PTR__ = 4;

function mcons() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = ag.makePair(car(regs.ARG), car(cdr(regs.ARG)));
	regs.KON = stk.restore();
	return regs.KON;
}

const __CAR_PTR__ = 5;

function mcar() {

	if (regs.LEN !== 1) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.ARG = car(regs.ARG);
	if (!ag.isPair(regs.ARG)) {
		regs.TXT = 'expected pair';
		return error;
	}

	regs.VAL = car(regs.ARG);
	regs.KON = stk.restore();
	return regs.KON;
}

const __CDR_PTR__ = 6;

function mcdr() {

	if (regs.LEN !== 1) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.ARG = car(regs.ARG);
	if (!ag.isPair(regs.ARG)) {
		regs.TXT = 'expected pair';
		return error;
	}

	regs.VAL = cdr(regs.ARG);
	regs.KON = stk.restore();
	return regs.KON;
}

const __SET_CAR_PTR__ = 23;

function scar() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = car(cdr(regs.ARG));
	regs.ARG = car(regs.ARG);

	if (!ag.isPair(regs.ARG)) {
		regs.TXT = 'expected pair';
		return error;
	}

	ag.pairSetCar(regs.ARG, regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

const __SET_CDR_PTR__ = 24;

function scdr() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = car(cdr(regs.ARG));
	regs.ARG = car(regs.ARG);

	if (!ag.isPair(regs.ARG)) {
		regs.TXT = 'expected pair';
		return error;
	}

	ag.pairSetCdr(regs.ARG, regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

const __LIST_PTR__ = 7;

function list() {

	regs.VAL = regs.ARG;
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- COMPARISONS --- */

const __NBR_EQ_PTR__ = 9;

function nbr_eq() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = car(regs.ARG);
	regs.ARG = car(cdr(regs.ARG));

	if (ag.isNumber(regs.VAL) && ag.isNumber(regs.ARG))
		regs.VAL = (ag.numberVal(regs.VAL) === ag.numberVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else if (ag.isDouble(regs.VAL) && ag.isDouble(regs.ARG))
		regs.VAL = (ag.doubleVal(regs.VAL) === ag.doubleVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else {
		regs.TXT = 'expected numeric types';
		return error;
	}

	regs.KON = stk.restore();
	return regs.KON;
}

const __SMA_PTR__ = 10;

function sma() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = car(regs.ARG);
	regs.ARG = car(cdr(regs.ARG));

	if (ag.isNumber(regs.VAL) && ag.isNumber(regs.ARG))
		regs.VAL = (ag.numberVal(regs.VAL) < ag.numberVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else if (ag.isDouble(regs.VAL) && ag.isDouble(regs.ARG))
		regs.VAL = (ag.doubleVal(regs.VAL) < ag.doubleVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else {
		regs.TXT = 'expected numeric types';
		return error;
	}

	regs.KON = stk.restore();
	return regs.KON;
}

const __LRG_PTR__ = 11;

function lrg() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = car(regs.ARG);
	regs.ARG = car(cdr(regs.ARG));

	if (ag.isNumber(regs.VAL) && ag.isNumber(regs.ARG))
		regs.VAL = (ag.numberVal(regs.VAL) > ag.numberVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else if (ag.isDouble(regs.VAL) && ag.isDouble(regs.ARG))
		regs.VAL = (ag.doubleVal(regs.VAL) > ag.doubleVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else {
		regs.TXT = 'expected numeric types';
		return error;
	}

	regs.KON = stk.restore();
	return regs.KON;
}

const __SEQ_PTR__ = 12;

function seq() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = car(regs.ARG);
	regs.ARG = car(cdr(regs.ARG));

	if (ag.isNumber(regs.VAL) && ag.isNumber(regs.ARG))
		regs.VAL = (ag.numberVal(regs.VAL) <= ag.numberVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else if (ag.isDouble(regs.VAL) && ag.isDouble(regs.ARG))
		regs.VAL = (ag.doubleVal(regs.VAL) <= ag.doubleVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else {
		regs.TXT = 'expected numeric types';
		return error;
	}

	regs.KON = stk.restore();
	return regs.KON;
}

const __LEQ_PTR__ = 13;

function leq() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = car(regs.ARG);
	regs.ARG = car(cdr(regs.ARG));

	if (ag.isNumber(regs.VAL) && ag.isNumber(regs.ARG))
		regs.VAL = (ag.numberVal(regs.VAL) >= ag.numberVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else if (ag.isDouble(regs.VAL) && ag.isDouble(regs.ARG))
		regs.VAL = (ag.doubleVal(regs.VAL) >= ag.doubleVal(regs.ARG) ?
					ag.__TRUE__ : ag.__FALSE__);
	else {
		regs.TXT = 'expected numeric types';
		return error;
	}

	regs.KON = stk.restore();
	return regs.KON;
}

/* --- ASSOC --- */

const __ASSOC_PTR__ = 25;

function assoc() {

	if (regs.LEN !== 2) {
		regs.TXT = 'assoc requires exactly two arguments';
		return error;
	}

	regs.KON = stk.restore();

	regs.VAL = car(regs.ARG);
	regs.LST = car(cdr(regs.ARG));

	while (ag.isPair(regs.LST)) {
		regs.BND = car(regs.LST);
		regs.PAT = car(regs.BND);
		if (ag.eq(regs.PAT, regs.VAL)) {
			regs.VAL = regs.BND;
			return regs.KON;
		}
		regs.LST = cdr(regs.LST);
	}

	regs.VAL = ag.__FALSE__;
	return regs.KON;
}

/* --- MAP --- */
// unary map, takes only two arguments

const __MAP_PTR__ = 14;

function map() {

	if (regs.LEN !== 2) {
		regs.TXT = 'map requires exactly two arguments';
		return error;
	}

	regs.LEN = 1;
	regs.PRC = car(regs.ARG);
	regs.LST = car(cdr(regs.ARG));

	if (ag.isNull(regs.LST)) {
		regs.VAL = ag.__NULL__;
		regs.KON = stk.restore();
		return regs.KON;
	}

	regs.ARG = ag.makePair(car(regs.LST), ag.__NULL__);
	regs.LST = cdr(regs.LST);
	stk.save(0);

	if (ag.isNull(regs.LST)) {
		stk.save(c1_map);
	} else {
		stk.save(regs.PRC);
		stk.save(regs.LST);
		stk.save(c2_map);
	}

	return apply;
}

function c1_map() {

	regs.LEN = stk.restore();
	regs.VAL = ag.makePair(regs.VAL, ag.__NULL__);
	while (regs.LEN--)
		regs.VAL = ag.makePair(stk.restore(), regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

function c2_map() {

	regs.LST = stk.restore();
	regs.PRC = stk.restore();
	regs.LEN = stk.peek();
	stk.poke(regs.VAL);
	stk.save(regs.LEN + 1);

	regs.ARG = ag.makePair(car(regs.LST), ag.__NULL__);
	regs.LST = cdr(regs.LST);
	regs.LEN = 1;

	if (ag.isNull(regs.LST)) {
		stk.save(c1_map);
	} else {
		stk.save(regs.PRC);
		stk.save(regs.LST);
		stk.save(c2_map);
	}

	return apply;
}

/* --- META --- */

const __EVAL_PTR__ = 15;

function _eval() {

	if (regs.LEN !== 1) {
		regs.TXT = 'incorrect parameter count';
		return error;
	}

	regs.EXP = car(regs.ARG);
	regs.KON = c_eval;
	return compiler.compile;
}

function c_eval() {

	regs.EXP = regs.VAL;
	regs.KON = stk.restore();
	return eval;
}

const __APPLY_PTR__ = 16;

function _apply() {

	if (regs.LEN !== 2) {
		regs.TXT = 'incorrect parameter count';
		return error;
	}

	regs.PRC = car(regs.ARG);
	regs.ARG = car(cdr(regs.ARG));
	regs.LST = regs.ARG;
	// check + calculate list length
	for(regs.LEN = 0; ag.isPair(regs.LST); ++regs.LEN)
		regs.LST = cdr(regs.LST);
	if (!ag.isNull(regs.LST)) {
		regs.TXT = 'second argument must be a list';
		return error;
	}
	return apply;
}

const __READ_PTR__ = 18;

function read() {

	IO.write(":: ");
	regs.TXT = IO.read();
	reader.load();
	regs.KON = stk.restore();
	return reader.read;
}

const __LOAD_PTR__ = 19;

function load() {

	if (regs.LEN !== 1) {
		regs.TXT = 'load requires exactly one argument';
		return error;
	}

	regs.ARG = car(regs.ARG);
	if (!ag.isString(regs.ARG)) {
		regs.TXT = 'filepath must be a string';
		return error;
	}

	regs.TXT = ag.stringText(regs.ARG);
	regs.TXT = IO.load(regs.TXT);
	reader.load();
	regs.KON = c1_load;
	return reader.read;
}

function c1_load() {

	regs.EXP = regs.VAL;
	regs.KON = c2_load;
	return compiler.compile;
}

function c2_load() {

	regs.EXP = regs.VAL;
	regs.KON = stk.restore();
	return eval;
}

/* --- DISPLAYS --- */

const __DISP_PTR__ = 17;

function display() {

	if (regs.LEN !== 1) {
		regs.TXT = 'display requires exactly one argument';
		return error;
	}
	regs.TXT = printer.printExp(car(regs.ARG));
	IO.printOut(regs.TXT);
	regs.VAL = ag.__VOID__;
	regs.KON = stk.restore();
	return regs.KON;
}

const __NEWLINE_PTR__ = 26;

function newline() {

	IO.printOut('');
	regs.VAL = ag.__VOID__;
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- VECTORS --- */

const __VMAKE_PTR__ = 27;

function makeVector() {

	if (!regs.LEN) {
		regs.TXT = 'insufficient arguments';
		return error;
	}

	regs.LST = cdr(regs.ARG);
	regs.ARG = car(regs.ARG);

	if (!ag.isNumber(regs.ARG)) {
		regs.TXT = 'vector length must be a number';
		return error;
	}

	regs.LEN = ag.numberVal(regs.ARG);
	if (regs.LEN < 0) {
		regs.TXT = 'vector length must be positive';
		return error;
	}

	if (ag.isNull(regs.LST)) {
		regs.VAL = ag.makeVector(regs.LEN);
	} else {
		regs.VAL = car(regs.LST);
		regs.VAL = ag.makeVector(regs.LEN, regs.VAL);
	}

	regs.KON = stk.restore();
	return regs.KON;
}

const __VREF_PTR__ = 28;

function vectorRef() {

	if (regs.LEN !== 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.EXP = car(cdr(regs.ARG));
	regs.ARG = car(regs.ARG);

	if (!(ag.isVector(regs.ARG) && ag.isNumber(regs.EXP))) {
		regs.TXT = 'invalid parameter types';
		return error;
	}

	regs.IDX = ag.numberVal(regs.EXP);
	if (0 <= regs.IDX && regs.IDX < ag.vectorLength(regs.ARG)) {
		regs.VAL = ag.vectorRef(regs.ARG, regs.IDX+1);
		regs.KON = stk.restore();
		return regs.KON;
	}

	regs.TXT = 'index out of bounds';
	return error;
}

const __VSET_PTR__ = 29;

function vectorSet() {

	if (regs.LEN !== 3) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.LST = cdr(regs.ARG);
	regs.ARG = car(regs.ARG);
	regs.EXP = car(regs.LST);
	regs.VAL = car(cdr(regs.LST));

	if (!(ag.isVector(regs.ARG) && ag.isNumber(regs.EXP))) {
		regs.TXT = 'invalid parameter types';
		return error;
	}

	regs.IDX = ag.numberVal(regs.EXP);
	if (0 <= regs.IDX && regs.IDX < ag.vectorLength(regs.ARG)) {
		ag.vectorSet(regs.ARG, regs.IDX+1, regs.VAL);
		regs.KON = stk.restore();
		return regs.KON;
	}

	regs.TXT = 'index out of bounds';
	return error;
}

const __VLEN_PTR__ = 30;

function vectorLength() {

	if (regs.LEN !== 1) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.ARG = car(regs.ARG);
	if (!ag.isVector(regs.ARG)) {
		regs.TXT = 'expected vector';
		return error;
	}

	regs.VAL = ag.makeNumber(ag.vectorLength(regs.ARG));
	regs.KON = stk.restore();
	return regs.KON;
}

const __VECTOR_PTR__ = 31;

function vector() {

	regs.IDX = 0;
	regs.VAL = ag.makeVector(regs.LEN);
	while (regs.IDX < regs.LEN) {
		ag.vectorSet(regs.VAL, ++regs.IDX, car(regs.ARG));
		regs.ARG = cdr(regs.ARG);
	}

	regs.KON = stk.restore();
	return regs.KON;
}

/* --- EQUALITY --- */

const __EQ_PTR__ = 8;

function eq() {

	if (regs.LEN != 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.VAL = (ag.eq(car(regs.ARG), car(cdr(regs.ARG))) ?
				 ag.__TRUE__ : ag.__FALSE__);

	regs.KON = stk.restore();
	return regs.KON;
}

function equal() {

	if (regs.LEN != 2) {
		regs.TXT = 'invalid parameter count';
		return error;
	}

	regs.EXP = car(regs.ARG);
	regs.ARG = car(cdr(regs.ARG));
	regs.KON = stk.restore();
	return c_equal;
}

function c_equal() {

	regs.TAG = ag.tag(regs.ARG);
	if (regs.TAG !== ag.tag(regs.EXP)) {
		regs.KON = stk.restore();
		regs.VAL = ag.__FALSE__;
		return regs.KON;
	}

	switch (regs.TAG) {

		case ag.__PAIR_TAG__:
			stk.save(regs.cdr(regs.EXP));
			stk.save(regs.cdr(regs.ARG));
			regs.EXP = car(regs.EXP);
			regs.ARG = car(regs.ARG);
			regs.KON = undefined; //TODO
			return c_equal;
	}
}

/* --- TYPE CHECKS --- */

function makeTypeCheck(tag) {

	return function() {
		if (regs.LEN !== 1) {
			regs.TXT = 'invalid argument count';
			return error;
		}
		regs.TAG = ag.tag(car(regs.ARG));
		regs.VAL = (regs.TAG === tag ? ag.__TRUE__ : ag.__FALSE__);
		regs.KON = stk.restore();
		return regs.KON;
	}
}

const __IS_PAIR_PTR__ = 20;
const isPair = makeTypeCheck(ag.__PAIR_TAG__);

const __IS_NULL_PTR__ = 21;
const isNull = makeTypeCheck(ag.__NULL_TAG__);

const __IS_SYMBOL_PTR__ = 22;
const isSymbol = makeTypeCheck(ag.__SYMBOL_TAG__);

const __IS_VECTOR_PTR__ = 32;
const isVector = makeTypeCheck(ag.__VECTOR_TAG__);

/* --- INITIALISATION --- */

function init() {

	function loadOperations() {
		var evaluator = require('./eval.js');
		apply = evaluator.apply;
		eval = evaluator.eval;
	}

	function addNative(nam, ptr) {
		regs.PRC = ag.makeNative(ptr);
		regs.PAT = symbols.enterPool(nam);
		regs.BND = ag.makePair(regs.PAT, regs.PRC);
		regs.FRM = ag.makePair(regs.BND, regs.FRM);
	}

	addNative('load', __LOAD_PTR__);
	addNative('eq?', __EQ_PTR__);
	addNative('map', __MAP_PTR__);
	addNative('assoc', __ASSOC_PTR__);
	addNative('eval', __EVAL_PTR__);
	addNative('apply', __APPLY_PTR__);
	addNative('display', __DISP_PTR__);
	addNative('newline', __NEWLINE_PTR__);
	addNative('read', __READ_PTR__);
	addNative('null?', __IS_NULL_PTR__);
	addNative('pair?', __IS_PAIR_PTR__);
	addNative('symbol?', __IS_SYMBOL_PTR__);
	addNative('vector?', __IS_VECTOR_PTR__);
	addNative('make-vector', __VMAKE_PTR__);
	addNative('vector-ref', __VREF_PTR__);
	addNative('vector-set!', __VSET_PTR__);
	addNative('vector-length', __VLEN_PTR__);
	addNative('vector', __VECTOR_PTR__);
	addNative('set-car!', __SET_CAR_PTR__);
	addNative('set-cdr!', __SET_CDR_PTR__);
	addNative('=', __NBR_EQ_PTR__);
	addNative('<', __SMA_PTR__);
	addNative('<=', __SEQ_PTR__);
	addNative('>', __LRG_PTR__);
	addNative('>=', __LEQ_PTR__);
	addNative('cons', __CONS_PTR__);
	addNative('car', __CAR_PTR__);
	addNative('cdr', __CDR_PTR__);
	addNative('list', __LIST_PTR__);
	addNative('+', __ADD_PTR__);
	addNative('-', __SUB_PTR__);
	addNative('*', __MUL_PTR__);
	addNative('/', __DIV_PTR__);

	loadOperations();
}

/* --- EXPORTS --- */
exports.native = native;
exports.setErr = setErr;
exports.initNatives = init;