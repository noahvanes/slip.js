
var parser = require('./parser.js');
var Pair = parser.Pair;

/* TRAMPOLINE (for TCO) */

function startTrampoline(fun) {
	while(fun = fun());
}

/* VM DESIGN */

var __STACK_SIZ__ = 1024;

var regs = {
	ADR: null,
	ARG: null,
	BND: null,
	ENV: null,
	EXP: null,
	FRM: null,
	GLB: null,
	IDX: null,
	KON: null,
	LEN: null,
	LST: null,
	PAR: null,
	PAT: null,
	PRC: null,
	SEQ: null,
	STK: null,
	STO: null,
	TOP: null,
	VAL: null
}

var stk = {
	arr: new Array(__STACK_SIZ__),
	sp: 0,
}

stk.save = function(el) { this.arr[this.sp++] = el; },
stk.restore = function() { return this.arr[--this.sp]; }

/* ERRORS */

function error(msg, reg) {
	print(msg);
	regs.VAL = reg;
	regs.ENV = null;
	regs.FRM = regs.GLB;
	return c_REP;
}

/* CLONING */

function clone() {

	if (regs.EXP instanceof String) {
		return cloneString;
	}

	if (regs.EXP instanceof Array) {
		return cloneVector;
	}

	if (regs.EXP instanceof Pair) {
		return clonePair;
	}

	regs.VAL = regs.EXP;
	return regs.KON;
}

function cloneString() {
	regs.VAL = regs.EXP.toString();
	return regs.KON;
}

function clonePair() {
	stk.save(regs.KON);
	stk.save(regs.EXP);
	regs.EXP = regs.EXP.car;
	regs.KON = c1_pair;
	return clone;
}


function c1_pair() {
	regs.EXP = stk.restore();
	regs.EXP = regs.EXP.cdr;
	stk.save(regs.VAL);
	regs.KON = c2_pair;
	return clone;
}

function c2_pair() {
	regs.EXP = stk.restore();
	regs.KON = stk.restore();
	regs.VAL = new Pair(regs.EXP, regs.VAL);
	return regs.KON;
}

function cloneVector() {
	regs.LEN = regs.EXP.length;
	if (regs.LEN == 0) {
		regs.VAL = [];
		return regs.KON;
	}
	regs.VAL = new Array(regs.LEN);
	regs.IDX = 0;
	stk.save(regs.KON);
	stk.save(regs.EXP);
	stk.save(regs.VAL);
	stk.save(regs.IDX);
	regs.EXP = regs.EXP[0];
	regs.KON = c_vector;
	return clone;
}

function c_vector() {
	regs.IDX = stk.restore();
	regs.EXP = stk.restore();
	regs.EXP[regs.IDX] = regs.VAL;
	regs.VAL = regs.EXP;
	regs.EXP = stk.restore();
	regs.LEN = regs.EXP.length;
	if (++regs.IDX == regs.LEN) {
		regs.KON = stk.restore();
		return regs.KON;
	}
	stk.save(regs.EXP);
	stk.save(regs.VAL);
	stk.save(regs.IDX);
	regs.EXP = regs.EXP[regs.IDX];
	return clone;
}

/* EVAL */

function eval() {

	if (regs.EXP instanceof Pair) {
		return evalCompound;
	}

	if (regs.EXP instanceof Symbol) {
		return evalVariable;
	}

	//for literals
	return clone;
}

function evalVariable() {

	regs.BND = assoc(regs.EXP, regs.FRM);
	if (regs.BND) {
		regs.ADR = regs.BND.cdr;
		regs.BND = assoc(regs.ADR, regs.STO);
		regs.VAL = regs.BND.cdr;
		return regs.KON;
	}

	if (regs.ENV == null) {
		error("Cannot find local variable: ", regs.EXP);
	}

	stk.save(regs.ENV);
	stk.save(regs.FRM);

	return lookup;
}

function lookup() {

	regs.FRM = regs.ENV.car;
	regs.BND = assoc(regs.EXP, regs.FRM);
	if(regs.BND) {
		regs.FRM = stk.restore();
		regs.ENV = stk.restore();
		regs.ADR = regs.BND.cdr;
		regs.BND = assoc(regs.ADR, regs.STO);
		regs.VAL = regs.BND.cdr;
		return regs.KON;
	}

	regs.ENV = regs.ENV.cdr;
	if(regs.ENV == null) {
		error("Cannot find non-local variable: ", regs.EXP);
	}
	return lookup;
}

regs.KON = function() { 
	return false;
}

regs.EXP = new Pair(2, new Pair(6, null));
startTrampoline(clone);