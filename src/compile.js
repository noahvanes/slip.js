/*
   <NOTE>
	Right now, variables and parameters are still just looked up
	into a linked list of frames and environments.
	This can be improved at compile-time by giving variables
	addresses w.r.t. current frame/scope...
	However, since this still needs to be implemented, I did not
	take any effort in optimizing/checking the linked lists currently
	still in use by the lambda/procedures for parameter lists etc..., 
	nor do I compile any symbols at this moment...
	(since all of these things will be replaced later on anyway)
   </NOTE> 
*/

/* --- IMPORTS --- */

const ag = require('./ag.js');
const symbols = require('./pool.js');
const stk = require('./stack');
const exec = require('./exec.js');
const regs = exec.regs;

var error;
function setErr(handler) {
	error = handler;
}

/* --- CONSTANTS --- */

const __QUO_SYM__ = symbols.enterPool('quote');
const __BEG_SYM__ = symbols.enterPool('begin');
const __LET_SYM__ = symbols.enterPool('let');
const __DEF_SYM__ = symbols.enterPool('define');
const __LAM_SYM__ = symbols.enterPool('lambda');
const __SET_SYM__ = symbols.enterPool('set!');
const __IFF_SYM__ = symbols.enterPool('if');
const __VEC_SYM__ = symbols.enterPool('vector');

const car = ag.pairCar;
const cdr = ag.pairCdr;

/* --- COMPILE --- */

function compile() {

	if (ag.isPair(regs.EXP)) {

		regs.LST = cdr(regs.EXP);
		regs.EXP = car(regs.EXP);

		switch (regs.EXP) {
			case __QUO_SYM__: return compileQuote;
			case __BEG_SYM__: return compileSequence;
			//case __LET_SYM__: return compileLet;
			case __DEF_SYM__: return compileDefine;
			case __LAM_SYM__: return compileLambda;
			case __SET_SYM__: return compileSet;
			case __IFF_SYM__: return compileIf;
			default: return compileApplication;
		}
	}

	if (ag.isVector(regs.EXP)) 
		return compileVector;

	regs.VAL = regs.EXP;
	return regs.KON; 
}

/* --- COMPILE SEQUENCE --- */

function compileSequence() {

	//empty sequence
	if (ag.isNull(regs.LST)) {
		regs.VAL = ag.__VOID__;
		return regs.KON;
	}

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid sequence';
		return error;
	}

	regs.EXP = car(regs.LST);
	regs.LST = cdr(regs.LST);

	if (!ag.isNull(regs.LST)) {
		stk.save(regs.KON);
		stk.save(0);
		stk.save(regs.LST);
		regs.KON = c1_sequence;
	}

	return compile;
}

function c1_sequence() {

	regs.LST = stk.restore();
	regs.LEN = stk.peek();
	stk.poke(regs.VAL);
	stk.save(++regs.LEN);

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid sequence';
		return error;
	}

	regs.EXP = car(regs.LST);
	regs.LST = cdr(regs.LST);

	if (ag.isNull(regs.LST)) {
		regs.KON = c2_sequence;
	} else {
		stk.save(regs.LST);
	}

	return compile;
}

function c2_sequence() {

	regs.LEN = stk.restore();
	regs.EXP = ag.makeSequence(regs.LEN + 1);
	ag.sequenceSet(regs.EXP, regs.LEN + 1, regs.VAL);
	do 	// fill sequence with compiled expressions
		ag.sequenceSet(regs.EXP, regs.LEN, stk.restore());
	while (--regs.LEN);

	regs.VAL = regs.EXP;
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- COMPILE QUOTE --- */

function compileQuote() {

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid quote expression';
		return error;
	}

	regs.EXP = car(regs.LST);
	if (ag.isNull(cdr(regs.LST))) {
		regs.VAL = ag.makeQuo(regs.EXP);
		return regs.KON;
	} else {
		regs.TXT = 'quote only takes one argument';
		return error;
	}
}

/* --- COMPILE IF --- */

function compileIf() {

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid if expression';
		return error;
	}

	regs.EXP = car(regs.LST);
	regs.LST = cdr(regs.LST);

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid if consequence';
		return error;
	}

	stk.save(regs.KON);
	regs.KON = c1_if;
	stk.save(regs.LST);
	return compile;
}

function c1_if() {

	regs.LST = stk.peek();
	regs.EXP = car(regs.LST);
	regs.LST = cdr(regs.LST);
	stk.poke(regs.VAL);

	if (ag.isNull(regs.LST)) {
		regs.KON = c2_if;
		return compile;
	}

	if (ag.isPair(regs.LST)) {
		stk.save(regs.LST);
		regs.KON = c3_if;
		return compile;
	}

	regs.TXT = 'invalid if alternative';
	return error;
}

function c2_if() {

	regs.EXP = stk.restore();
	regs.VAL = ag.makeIfs(regs.EXP, regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

function c3_if() {

	regs.LST = stk.peek();
	regs.EXP = car(regs.LST);
	regs.LST = cdr(regs.LST);
	stk.poke(regs.VAL);

	if (!ag.isNull(regs.LST)) {
		regs.TXT = 'if statement too long';
		return error;
	}

	regs.KON = c4_if;
	return compile;
}

function c4_if() {

	regs.EXP = stk.restore();
	regs.VAL = ag.makeIff(stk.restore(), regs.EXP, regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- COMPILE PARAMETERS --- 

function compileParameters() {

	regs.LEN = 0;

	while (ag.isPair(regs.PAR)) {

		regs.PAT = car(regs.PAR);
		regs.PAR = cdr(regs.PAR);

		if (!ag.isSymbol(regs.PAT)) {
			regs.TXT = 'invalid parameter';
			return error;
		}

		stk.save(regs.PAT);
		++regs.LEN;
	}

	if (regs.LEN) {
		regs.VAL = ag.makeVector(regs.LEN);
		do 
			ag.vectorSet(regs.VAL, regs.LEN, stk.restore());
		while (--regs.LEN);
	} else {
		regs.VAL = ag.__EMPTY_VEC__;
	}

	return regs.KON;
}
*/

/* --- COMPILE DEFINE --- */

function compileDefine() {

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid definition';
		return error;
	}

	regs.PAT = car(regs.LST);
	regs.LST = cdr(regs.LST);
	regs.TAG = ag.tag(regs.PAT);

	switch (regs.TAG) {

		/* VARIABLE DEFINITION */
		case ag.__SYMBOL_TAG__:

			if(!ag.isPair(regs.LST)) {
				regs.TXT = 'invalid variable definition';
				return error;
			}

			regs.EXP = car(regs.LST);
			regs.LST = cdr(regs.LST);
			if (!ag.isNull(regs.LST)) {
				regs.TXT = 'variable definition takes only one argument';
				return error;
			}

			stk.save(regs.KON);
			stk.save(regs.PAT);
			regs.KON = c1_define;
			return compile;

		/* PROCEDURE DEFINITION */
		case ag.__PAIR_TAG__:

			regs.PAR = cdr(regs.PAT);
			regs.PAT = car(regs.PAT);
			if (!ag.isSymbol(regs.PAT)) {
				regs.TXT = 'procedure definition has invalid name'
				return error;
			}

			stk.save(regs.KON);
			stk.save(regs.PAT);
			stk.save(regs.PAR);
			regs.KON = c2_define;
			return compileSequence;

		/* INVALID DEFINE */
		default:
			regs.TXT = 'invalid defintion syntax';
			return error;
	}
}

function c1_define() {

	regs.PAT = stk.restore();
	regs.KON = stk.restore();
	regs.VAL = ag.makeDfv(regs.PAT, regs.VAL);
	return regs.KON;
}

function c2_define() {

	regs.PAR = stk.restore();
	regs.PAT = stk.restore();
	regs.KON = stk.restore();
	regs.VAL = ag.makeDff(regs.PAT, regs.PAR, regs.VAL);
	return regs.KON;
}

/* --- COMPILE SET! --- */

function compileSet() {

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid assignment variable';
		return error;
	}

	regs.PAT = car(regs.LST);
	regs.LST = cdr(regs.LST);

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid assignment value';
		return error;
	}

	regs.EXP = car(regs.LST);
	regs.LST = cdr(regs.LST);

	if (!ag.isNull(regs.LST)) {
		regs.TXT = 'assignment requires only one argument';
		return error;
	}

	stk.save(regs.KON);
	stk.save(regs.PAT);
	regs.KON = c_set;
	return compile;
}

function c_set() {

	regs.PAT = stk.restore();
	regs.KON = stk.restore();
	regs.VAL = ag.makeSet(regs.PAT, regs.VAL);
	return regs.KON;
}

/* --- COMPILE LAMBDA --- */

function compileLambda() {

	if (!ag.isPair(regs.LST)) {
		regs.TXT = 'invalid lambda expression';
		return error;
	}

	regs.PAR = car(regs.LST);
	regs.LST = cdr(regs.LST);

	stk.save(regs.KON);
	stk.save(regs.PAR);
	regs.KON = c_lambda;
	return compileSequence;
}

function c_lambda() {

	regs.PAR = stk.restore();
	regs.KON = stk.restore();
	regs.VAL = ag.makeLambda(regs.PAR, regs.VAL);
	return regs.KON;
}

/* ---  COMPILE APPLICATION --- */

function compileApplication() {

	stk.save(regs.KON);

	if (ag.isNull(regs.LST)) {
		regs.KON = c1_application;
	} else {
		stk.save(0);
		stk.save(regs.LST);
		regs.KON = c2_application;
	}

	return compile;
}

function c1_application() {

	regs.VAL = ag.makeApplication(regs.VAL, ag.__EMPTY_VEC__);
	regs.KON = stk.restore();
	return regs.KON;
}

function c2_application() {

	regs.ARG = stk.restore();
	regs.LEN = stk.peek();
	stk.poke(regs.VAL);
	stk.save(++regs.LEN);

	if (!ag.isPair(regs.ARG)) {
		regs.TXT = 'invalid application argument';
		return error;
	}

	regs.EXP = car(regs.ARG);
	regs.ARG = cdr(regs.ARG);

	if (ag.isNull(regs.ARG)) {
		regs.KON = c3_application;
	} else {
		stk.save(regs.ARG);
	}

	return compile;
}

function c3_application() {

	regs.IDX = stk.restore();
	regs.EXP = ag.makeVector(regs.IDX);
	ag.vectorSet(regs.EXP, regs.IDX, regs.VAL);
	while(--regs.IDX)
		ag.vectorSet(regs.EXP, regs.IDX, stk.restore());
	regs.VAL = ag.makeApplication(stk.restore(), regs.EXP);
	
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- COMPILE VECTOR --- */

function compileVector() {

	regs.LEN = ag.vectorLength(regs.EXP);

	if (regs.LEN === 0) { 
		regs.VAL = ag.__EMPTY_VEC__;
		return regs.KON;
	}

	stk.save(regs.KON);
	stk.save(ag.makeVector(regs.LEN));
	
	if (regs.LEN === 1) {
		regs.KON = c2_vector;
	} else {
		regs.KON = c1_vector;
		stk.save(regs.EXP);
		stk.save(1);
	}

	regs.EXP = ag.vectorRef(regs.EXP, 1);
	return compile;
}

function c1_vector() {

	regs.IDX = stk.restore();
	regs.EXP = stk.restore();
	regs.PAR = stk.peek();
	ag.vectorSet(regs.PAR, regs.IDX++, regs.VAL);
	regs.LEN = ag.vectorLength(regs.PAR);

	if (regs.LEN === regs.IDX) {
		regs.KON = c2_vector;
	} else {
		stk.save(regs.EXP);
		stk.save(regs.IDX);
	}

	regs.EXP = ag.vectorRef(regs.EXP, regs.IDX);
	return compile;
}

function c2_vector() {

	regs.EXP = stk.restore();
	regs.LEN = ag.vectorLength(regs.EXP);
	ag.vectorSet(regs.EXP, regs.LEN, regs.VAL);
	regs.VAL = ag.makeApplication(__VEC_SYM__, regs.EXP);
	regs.KON = stk.restore();
	return regs.KON;
}

exports.compile = compile;
exports.setErr = setErr;

/* --- TESTING ---
const reader = require('./reader.js');
const printer = require('./printer.js');
exports.test = function(str) {
	regs.TXT = str;
	reader.load();
	regs.KON = false;
	exec.run(reader.read);
	regs.EXP = regs.VAL;
	exec.run(compile);
	console.log(printer.printExp(regs.VAL));
}
*/