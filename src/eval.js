/* --- IMPORTS --- */

const ag = require('./ag.js');
const stk = require('./stack.js');
const exec = require('./exec.js');
const natives = require('./natives.js');

const regs = exec.regs;
const car = ag.pairCar;
const cdr = ag.pairCdr;
const ref = ag.vectorRef;
const set = ag.vectorSet;
const native = natives.native;

/* --- FOR TESTING --- */

//const print = require('./printer.js').printExp;

/* --- ERRORS --- */

var error;
function setErr(handler) {
	error = handler;
}

/* --- EVAL --- */

function eval() {

	regs.TAG = ag.tag(regs.EXP);

	switch(regs.TAG) {

		case ag.__NULL_TAG__:
		case ag.__VOID_TAG__: 
		case ag.__TRUE_TAG__: 
		case ag.__FALSE_TAG__: 
		case ag.__NUMBER_TAG__: 
		case ag.__CHAR_TAG__:
		case ag.__PAIR_TAG__:
		case ag.__PROCEDURE_TAG__:
		case ag.__VECTOR_TAG__:
		case ag.__STRING_TAG__:
		case ag.__DOUBLE_TAG__:
		case ag.__NATIVE_TAG__:
			return evalSelf;
		case ag.__SYMBOL_TAG__: 
			return evalVariable;
		case ag.__SEQUENCE_TAG__:
		 	return evalSequence;
		case ag.__IFS_TAG__: 
			return evalIfs;
		case ag.__IFF_TAG__: 
			return evalIff;
		case ag.__QUO_TAG__: 
			return evalQuote;
		case ag.__LAMBDA_TAG__: 
			return evalLambda;
		/* TODO:
		case ag.__LET_TAG__: 
			return evalLet;
		*/
		case ag.__DFV_TAG__: 
			return evalDfv;
		case ag.__DFF_TAG__: 
			return evalDff;
		case ag.__SET_TAG__: 
			return evalSet;
		case ag.__APPLICATION_TAG__: 
			return evalApplication;
		default: 
			return error("Invalid expression", regs.EXP);
	}
}

/* --- EVAL SELF EVALUATING --- */

function evalSelf() {

	regs.VAL = regs.EXP;
	return regs.KON;
}

/* --- EVAL VARIABLES --- */

function evalVariable() {

	regs.LST = regs.FRM;

 	/* SEARCH IN LOCAL SCOPE */
	while(ag.isPair(regs.LST)) {
		regs.BND = car(regs.LST);
		regs.PAT = car(regs.BND);
		if (ag.eq(regs.PAT, regs.EXP)) {
			regs.VAL = cdr(regs.BND);
			return regs.KON;
 		}
 		regs.LST = cdr(regs.LST);
	}

	if (ag.isNull(regs.ENV)) {
		regs.TXT = 'undefined local variable';
		return error;
	}

	/* SEARCH IN NON-LOCAL SCOPE */
	regs.LST = regs.ENV;
	do {
		regs.DCT = car(regs.LST);
		while(ag.isPair(regs.DCT)) {
			regs.BND = car(regs.DCT);
			regs.PAT = car(regs.BND);
			if (ag.eq(regs.PAT, regs.EXP)) {
				regs.VAL = cdr(regs.BND);
				return regs.KON;
			}
			regs.DCT = cdr(regs.DCT);
		}
		regs.LST = cdr(regs.LST);
	} while (ag.isPair(regs.LST));

	regs.TXT = 'undefined non-local variable';
	return error;
}

/* --- EVAL DEFINE --- */

function evalDfv() {

	regs.PAT = ag.dfvVariable(regs.EXP);
	regs.EXP = ag.dfvValue(regs.EXP);
	stk.save(regs.KON);
	stk.save(regs.PAT);
	regs.KON = c_define;
	return eval;
}

function evalDff() {

	regs.PAT = ag.dffVariable(regs.EXP);
	regs.PAR = ag.dffArguments(regs.EXP);
	regs.SEQ = ag.dffBody(regs.EXP);

	regs.BND = ag.makePair(regs.PAT, ag.__NULL__);
	regs.FRM = ag.makePair(regs.BND, regs.FRM);
	regs.ENV = ag.makePair(regs.FRM, regs.ENV);
	regs.VAL = ag.makeProcedure(regs.PAR, regs.SEQ, regs.ENV);
	ag.pairSetCdr(regs.BND, regs.VAL);
	regs.ENV = cdr(regs.ENV);
	return regs.KON;
}

function c_define() {

	regs.PAT = stk.restore();
	regs.KON = stk.restore();
	regs.BND = ag.makePair(regs.PAT, regs.VAL);
	regs.FRM = ag.makePair(regs.BND, regs.FRM);
	return regs.KON;
}

/* --- EVAL ASSIGNMENT --- */

function evalSet() {

	regs.PAT = ag.setVariable(regs.EXP);
	regs.EXP = ag.setValue(regs.EXP);

 	/* SEARCH IN LOCAL SCOPE */
 	regs.LST = regs.FRM;
	while(ag.isPair(regs.LST)) {
		regs.BND = car(regs.LST);
		if (ag.eq(car(regs.BND), regs.PAT)) {
			stk.save(regs.KON);
			stk.save(regs.BND);
			regs.KON = c_set;
			return eval;
 		}
 		regs.LST = cdr(regs.LST);
	}

	if (ag.isNull(regs.ENV)) {
		regs.TXT = 'Undefined local variable';
		return error;
	}

	/* SEARCH IN NON-LOCAL SCOPE */
	regs.LST = regs.ENV;
	do {
		regs.DCT = car(regs.LST);
		while(ag.isPair(regs.DCT)) {
			regs.BND = car(regs.DCT);
			if (ag.eq(car(regs.BND), regs.PAT)) {
				stk.save(regs.KON);
				stk.save(regs.BND);
				regs.KON = c_set;
				return eval;
			}
			regs.DCT = cdr(regs.DCT);
		}
		regs.LST = cdr(regs.LST);
	} while (ag.isPair(regs.LST));

	regs.TXT = 'Undefined non-local variable'
	return error;
}

function c_set() {

	regs.BND = stk.restore();
	regs.KON = stk.restore();
	ag.pairSetCdr(regs.BND, regs.VAL);
	return regs.KON;
}

/* --- EVAL QUOTING --- */

function evalQuote() {

	regs.VAL = ag.quoExpression(regs.EXP);
	return regs.KON;
}

/* --- EVAL SEQUENCE --- */

function evalSequence() {

	stk.save(regs.KON);
	stk.save(regs.EXP);
	stk.save(1);

	regs.EXP = ag.sequenceAt(regs.EXP, 1);
	regs.KON = c_sequence;
	return eval;
}

function c_sequence() {

	regs.IDX = stk.restore();
	regs.SEQ = stk.peek();
	regs.LEN = ag.sequenceLength(regs.SEQ);
	regs.EXP = ag.sequenceAt(regs.SEQ, ++regs.IDX);

	if (regs.IDX === regs.LEN) {
		stk.zap(); //skip sequence vector
		regs.KON = stk.restore();
	} else {
		stk.save(regs.IDX);
	}

	return eval;
}

/* --- EVAL IFS/IFF --- */

function evalIfs() {

	stk.save(regs.KON);
	stk.save(ag.ifsConsequence(regs.EXP));
	regs.EXP = ag.ifsPredicate(regs.EXP);
	regs.KON = c_ifs;
	return eval;
}

function c_ifs() {

	regs.EXP = stk.restore();

	if(!ag.isFalse(regs.VAL)) {
		regs.ENV = ag.makePair(regs.FRM, regs.ENV);
		regs.FRM = ag.__NULL__;
		regs.KON = c_if;
		return eval;
	}

	regs.VAL = ag.__VOID__;
	regs.KON = stk.restore();
	return regs.KON;
}

function evalIff() {

	stk.save(regs.KON);
	stk.save(regs.EXP);
	regs.EXP = ag.iffPredicate(regs.EXP);
	regs.KON = c_iff;
	return eval;
}

function c_iff() {

	regs.EXP = stk.restore();
	regs.ENV = ag.makePair(regs.FRM, regs.ENV);
	regs.FRM = ag.__NULL__;
	regs.KON = c_if;

	if (ag.isFalse(regs.VAL))
		regs.EXP = ag.iffAlternative(regs.EXP);
	else
		regs.EXP = ag.iffConsequence(regs.EXP);

	return eval;
}

function c_if() {

	regs.FRM = car(regs.ENV);
	regs.ENV = cdr(regs.ENV);
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- EVAL LAMBDA --- */

function evalLambda() {

	regs.PAR = ag.lambdaArg(regs.EXP);
	regs.SEQ = ag.lambdaBdy(regs.EXP);
	regs.DCT = ag.makePair(regs.FRM, regs.ENV);
	regs.VAL = ag.makeProcedure(regs.PAR, regs.SEQ, regs.DCT);
	return regs.KON;
}

/* --- EVAL APPLICATION --- */

function evalApplication() {

	stk.save(regs.KON);
	stk.save(ag.aplOperands(regs.EXP));
	regs.EXP = ag.aplOperator(regs.EXP);
	regs.KON = c1_application;
	return eval;
}

function c1_application() {

	regs.ARG = stk.peek();
	regs.LEN = ag.vectorLength(regs.ARG);

	if (regs.LEN === 0) {
		stk.zap();
		regs.ARG = ag.__NULL__;
		regs.PRC = regs.VAL;
		regs.LEN = 0;
		return apply;
	}

	stk.poke(regs.VAL);
	regs.EXP = ag.vectorRef(regs.ARG, 1);
	stk.save(1);

	if (regs.LEN === 1) {
		regs.KON = c3_application;
	} else {
		regs.KON = c2_application;
		stk.save(regs.ARG);
	}

	return eval;
}

function c2_application() {

	regs.ARG = stk.restore();
	regs.IDX = stk.peek();
	stk.poke(regs.VAL);
	stk.save(++regs.IDX);

	regs.EXP = ag.vectorRef(regs.ARG, regs.IDX);
	if (regs.IDX === ag.vectorLength(regs.ARG))
		regs.KON = c3_application;
	else
		stk.save(regs.ARG);

	return eval;
}

function c3_application() {

	regs.LEN = regs.IDX = stk.restore();
	regs.ARG = ag.makePair(regs.VAL, ag.__NULL__);
	while (--regs.IDX) 
		regs.ARG = ag.makePair(stk.restore(), regs.ARG);
	regs.PRC = stk.restore();
	return apply;
}

/* EVAL LET 

	TODO

function evalLet() {

	if (regs.LEN < 2) {
		return error('Let reguires at least 2 arguments: ', regs.LST);
	}

	regs.SEQ = regs.LST.cdr;
	regs.LST = regs.LST.car;
	stk.save(regs.KON);
	stk.save(regs.ENV);
	stk.save(regs.FRM);

	if (regs.LST === null) {
		regs.ENV = new Pair(regs.FRM, regs.ENV);
		regs.FRM = null;
		regs.KON = c1_let;
		return sequence;
	}

	regs.BND = regs.LST.car;
	regs.LST = regs.LST.cdr;
	regs.PAT = regs.BND.car;
	regs.EXP = regs.BND.cdr.car;
	if (!isSymbol(regs.PAT)) {
		return error("Invalid variable binding: ", regs.PAT);
	}
	regs.PAT = regs.PAT.txt;
	regs.KON = c2_let;

	stk.save(regs.SEQ);
	stk.save(regs.LST);
	stk.save(regs.PAT);
	return eval;
}

function c1_let() {

	regs.FRM = stk.restore();
	regs.ENV = stk.restore();
	regs.KON = stk.restore();
	return regs.KON;
}

function c2_let() {

	//TODO: add stack-peek
	regs.PAT = stk.restore();
	regs.LST = stk.restore();

	regs.ENV = new Pair(regs.FRM, regs.ENV);
	regs.BND = new Pair(regs.PAT, regs.TOP);
	regs.FRM = new Pair(regs.BND, null);
	regs.STO[regs.TOP++] = regs.VAL;

	if (regs.LST == null) {
		regs.SEQ = stk.restore();
		regs.KON = c1_let;
		return sequence;
	}

	regs.BND = regs.LST.car;
	regs.LST = regs.LST.cdr;
	regs.PAT = regs.BND.car;
	regs.EXP = regs.BND.cdr.car;
	if (!isSymbol(regs.PAT)) {
		return error("Invalid variable binding: ", regs.PAT);
	}
	regs.PAT = regs.PAT.txt;
	regs.KON = c2_let;

	stk.save(regs.LST);
	stk.save(regs.PAT);
	return eval;
}

*/

/* APPLY & BIND */
/* expects continuation on stack */

function apply() {

	regs.TAG = ag.tag(regs.PRC);

	if (regs.TAG === ag.__PROCEDURE_TAG__) {
		
		stk.save(regs.ENV);
		stk.save(regs.FRM);

		regs.EXP = ag.procedureBdy(regs.PRC);
		regs.PAR = ag.procedurePar(regs.PRC);
		regs.ENV = ag.procedureEnv(regs.PRC);
		regs.FRM = ag.__NULL__;

		return bind;
	}

	if (regs.TAG === ag.__NATIVE_TAG__) {

		return native;
	}

	regs.TXT = 'Expected procedure to apply';
	return error;
}

function bind() {

	if (ag.isNull(regs.PAR)) {
		if(ag.isNull(regs.ARG)) {
			regs.KON = c_bind;
			return eval;
		}
		regs.TXT = 'excess arguments';
		return error;
	}

	if (ag.isPair(regs.PAR)) {
		
		if(ag.isNull(regs.ARG)) {
			regs.TXT = 'insufficient arguments';
			return error;
		}

		regs.BND = ag.makePair(car(regs.PAR), car(regs.ARG));
		regs.FRM = ag.makePair(regs.BND, regs.FRM);
		regs.ARG = cdr(regs.ARG);
		regs.PAR = cdr(regs.PAR);
		return bind;
	}

	if (ag.isSymbol(regs.PAR)) {

		regs.BND = ag.makePair(regs.PAR, regs.ARG);
		regs.FRM = ag.makePair(regs.BND, regs.FRM);
		regs.KON = c_bind;
		return eval;
	}

	regs.TXT = "Invalid parameter pattern";
	return error;
} 

function c_bind() {

	regs.FRM = stk.restore();
	regs.ENV = stk.restore();
	regs.KON = stk.restore();
	return regs.KON;
}

/* EXPORTS */
exports.eval = eval;
exports.setErr = setErr; 