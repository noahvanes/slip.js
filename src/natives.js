/* --- IMPORTS --- */

const ag = require('./ag.js');
const IO = require('./IO.js');
const symbols = require('./pool.js');
const stk = require('./stack.js');
const printer = require('./printer.js');
const exec = require('./exec.js');

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
		/* PAIRS */
		case __CONS_PTR__: return mcons;
		case __CAR_PTR__: return mcar;
		case __CDR_PTR__: return mcdr;
		case __LIST_PTR__: return list;
		/* COMPARISONS */
		case __EQ_PTR__: return eq;
		case __NBR_EQ_PTR__: return nbr_eq;
		case __SMA_PTR__: return sma;
		case __LRG_PTR__: return lrg;
		case __LEQ_PTR__: return leq;
		case __SEQ_PTR__: return seq;
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

const __LIST_PTR__ = 7;

function list() {

	regs.VAL = regs.ARG;
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- COMPARISONS --- */

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

/* --- MAP --- */
// unary map, takes only two arguments

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
	regs.LST 

	if (ag.isNull(cdr(regs.LST))) {
		stk.save(c1_map);
	} else {
		stk.save(regs.PRC);
		stk.save(cdr(regs.LST));
		stk.save(c2_map);
	}

	stk.save(null);
	regs.ARG = regs.ARG.car;
	regs.ARG = new Pair(regs.ARG, null);
	return apply;
}

function c1_map() {

	regs.LST = stk.restore();
	regs.VAL = new Pair(regs.VAL, regs.LST);
	regs.VAL = reverseLst(regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

function c2_map() {

	regs.LST = stk.restore();
	regs.ARG = stk.restore();
	regs.PRC = stk.restore();

	if (regs.ARG.cdr == null) {
		regs.KON = c1_map;
	} else {
		regs.KON = c2_map;
		stk.save(regs.PRC);
		stk.save(regs.ARG.cdr);
	}

	regs.LST = new Pair(regs.VAL, regs.LST);
	stk.save(regs.LST);
	regs.ARG = regs.ARG.car;
	regs.ARG = new Pair(regs.ARG, null);
	return apply;
}

/* --- INITIALISATION --- */

function initNatives() {

	function addNative(nam, ptr) {
		regs.PRC = ag.makeNative(ptr);
		regs.PAT = symbols.insertPool(nam);
		regs.BND = ag.makePair(regs.PAT, regs.PRC);
		regs.FRM = ag.makePair(regs.BND, regs.FRM);
	}

	addNative('+', __ADD_PTR__);
	addNative('-', __SUB_PTR__);
	addNative('*', __MUL_PTR__);
	addNative('/', __DIV_PTR__);
	addNative('cons', __CONS_PTR__);
	addNative('car', __CAR_PTR__);
	addNative('cdr', __CDR_PTR__);
	addNative('list', __LIST_PTR__);
	addNative('eq?', __EQ_PTR__);
	addNative('=', __NBR_EQ_PTR__);
	addNative('<', __SMA_PTR__);
	addNative('<=', __SEQ_PTR__);
	addNative('>', __LRG_PTR__);
	addNative('>=', __LEQ_PTR__);
}

/* --- EXPORTS --- */
exports.native = native;
exports.setErr = setErr;
exports.initNatives = initNatives;


