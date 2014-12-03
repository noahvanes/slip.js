
/* IMPORTS */

const ag = require('./ag.js');
const parser = require('./parser.js').makeParser();
const IO = require('./IO.js');
const symbols = require('./pool.js');
const stk = require('./stack.js');
const printer = require('./printer.js');

const car = ag.pairCar;
const cdr = ag.pairCdr;
const ref = ag.vectorRef;
const set = ag.vectorSet;

/* VM ARCHITECTURE */
const init = ag.__NULL__;

var regs = {
	ARG: init,
	BND: init,
	DCT: init,
	ENV: init,
	EXP: init,
	FRM: init,
	GLB: init,
	IDX: init,
	KON: init,
	LEN: init,
	LST: init,
	PAR: init,
	PAT: init,
	PRC: init,
	SEQ: init,
	TAG: init,
	VAL: init
}

/* Trampoline for TCO */
function startTrampoline(fun) {
	while(fun = fun());
}

/* ERRORS */

function error(msg, reg) {
	IO.printOut(msg);
	regs.VAL = reg;
	regs.ENV = ag.__NULL__;
	regs.FRM = regs.GLB;
	regs.KON = c_REP;
	return c_REP;
}

/* ---- EVAL ---- */

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
		case ag.__BEGIN_TAG__:
		 	return evalBegin;
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

/* EVAL SELF EVALUATING */

function evalSelf() {

	regs.VAL = regs.EXP;
	return regs.KON;
}

/* EVAL VARIABLES */

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
		return error("Undefined local variable", regs.EXP);
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
		regs.LST = regs.LST.cdr;
	} while (ag.isPair(regs.LST));

	return error("Undefined non-local variable: ", regs.EXP);
}

/* EVAL DEFINE */

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

/* EVAL ASSIGNMENT */

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
		return error("Undefined local variable", regs.EXP);
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
		regs.LST = regs.LST.cdr;

	} while (ag.isPair(regs.LST));

	return error("Undefined non-local variable: ", regs.EXP);
}

function c_set() {

	regs.BND = stk.restore();
	regs.KON = stk.restore();
	ag.pairSetCdr(regs.BND, regs.VAL);
	return regs.KON;
}

/* EVAL QUOTING */

function evalQuote() {

	regs.VAL = ag.quoExpression(regs.EXP);
	return regs.KON;
}

/* EVAL BEGIN */

function evalBegin() {

	regs.SEQ = ag.beginSequence(regs.EXP);
	return sequence;
}

/* EVAL SEQUENCE */

//note: sequences always have length > 0;
function sequence() {

	regs.LEN = ag.vectorLength(regs.SEQ);
	regs.EXP = ref(regs.SEQ, 1);

	if (regs.LEN === 1) {
		return eval;
	}

	stk.save(regs.KON);
	stk.save(regs.SEQ);
	stk.save(1);

	regs.KON = c_sequence;
	return eval;
}

function c_sequence() {

	regs.IDX = stk.restore();
	regs.SEQ = stk.peek();
	regs.LEN = ag.vectorLength(regs.SEQ);
	regs.EXP = ref(regs.SEQ, ++regs.IDX);

	if (regs.IDX === regs.LEN) {
		stk.zap(); //skip sequence vector
		regs.KON = stk.restore();
	} else {
		stk.save(regs.IDX);
	}

	return eval;
}

/* EVAL IFS */

function evalIfs() {

	stk.save(ag.ifsConsequence(regs.EXP));
	regs.EXP = ag.ifsPredicate(regs.EXP);
	stk.save(regs.KON);
	regs.KON = c_ifs;
	return eval;
}

function c_ifs() {

	regs.KON = stk.restore();
	regs.EXP = stk.restore();

	if(ag.isTrue(regs.VAL)) {
		return eval;
	}
	regs.VAL = ag.__VOID__;
	return regs.KON;
}

/* EVAL IFF */

function evalIff() {

	stk.save(regs.EXP);
	stk.save(regs.KON);

	regs.EXP = ag.iffPredicate(regs.EXP);
	regs.KON = c_iff;
	return eval;
}

function c_iff() {

	regs.KON = stk.restore();
	regs.EXP = stk.restore();

	if (ag.isTrue(regs.VAL)) {
		regs.EXP = ag.iffConsequence(regs.EXP);
	} else {
		regs.EXP = ag.iffAlternative(regs.EXP);
	}

	return eval;
}

/* EVAL LAMBDA */

function evalLambda() {

	regs.PAR = ag.lambdaArg(regs.EXP);
	regs.SEQ = ag.lambdaBdy(regs.EXP);
	regs.ENV = ag.makePair(regs.FRM, regs.ENV);
	regs.VAL = ag.makeProcedure(regs.PAR, regs.SEQ, regs.ENV);
	regs.ENV = cdr(regs.ENV);
	return regs.KON;
}

/* EVAL APPLICATION */

function evalApplication() {

	stk.save(regs.KON);
	stk.save(ag.aplOperands(regs.EXP));
	regs.EXP = ag.aplOperator(regs.EXP);
	regs.KON = c1_Application;
	return eval;
}

function c1_Application() {

	regs.PAR = stk.restore();
	regs.ARG = ag.__NULL__;

	if (ag.isNull(regs.PAR)) {
		regs.PRC = regs.VAL;
		regs.KON = stk.restore();
		return apply;
	}

	stk.save(regs.VAL);
	stk.save(regs.ARG);
	regs.EXP = car(regs.PAR);
	regs.PAR = cdr(regs.PAR);

	if (ag.isNull(regs.PAR)) { // last argument
		regs.KON = c3_Application;
	} else {
		regs.KON = c2_Application;
		stk.save(regs.PAR);
	}

	return eval;
}

function c2_Application() {

	regs.PAR = stk.restore();
	regs.ARG = stk.restore();
	regs.ARG = ag.makePair(regs.VAL, regs.ARG);
	stk.save(regs.ARG);

	regs.EXP = car(regs.PAR);
	regs.PAR = cdr(regs.PAR);
	
	if (ag.isNull(regs.PAR)) { // last argument
		regs.KON = c3_Application;
	} else {
		regs.KON = c2_Application;
		stk.save(regs.PAR);
	}

	return eval;
}

function c3_Application() {
	
	regs.ARG = stk.restore();
	regs.ARG = ag.makePair(regs.VAL, regs.ARG);
	regs.ARG = reverseLst(regs.ARG);
	regs.PRC = stk.restore();
	regs.KON = stk.restore();
	return apply;
}

function reverseLst(lst) {

	var newList = ag.__NULL__;
	var current = lst;

	while(ag.isPair(current)) {
		newList = ag.makePair(car(current), newList);
		current = cdr(current);
	}

	return newList;
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

	if (regs.LST == null) {
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

function apply() {

	regs.TAG = ag.tag(regs.PRC);

	if (regs.TAG === ag.__PROCEDURE_TAG__) {
		
		stk.save(regs.KON);
		stk.save(regs.ENV);
		stk.save(regs.FRM);

		regs.SEQ = ag.procedureBdy(regs.PRC);
		regs.PAR = ag.procedurePar(regs.PRC);
		regs.ENV = ag.procedureEnv(regs.PRC);
		regs.FRM = ag.__NULL__;

		return bind;
	}

	if (regs.TAG === ag.__NATIVE_TAG__) {

		return nativeTab[ag.nativePtr(regs.PRC)];
	}

	return error("Expected procedure to apply: ", regs.PRC);
}

function bind() {

	if (ag.isNull(regs.PAR)) {
		if(ag.isNull(regs.ARG)) {
			regs.KON = c_bind;
			return sequence;
		}
		return error("Excess arguments: ", regs.ARG);
	}

	if (ag.isPair(regs.PAR)) {
		
		if(ag.isNull(regs.ARG)) {
			return error("Not enough arguments: ", regs.ARG);
		}

		regs.PAT = car(regs.PAR); // parameter symbol
		regs.BND = ag.makePair(regs.PAT, car(regs.ARG));
		regs.FRM = ag.makePair(regs.BND, regs.FRM);
		regs.ARG = cdr(regs.ARG);
		regs.PAR = cdr(regs.PAR);
		return bind;
	}

	if (ag.isSymbol(regs.PAR)) {

		regs.BND = ag.makePair(regs.PAR, regs.ARG);
		regs.FRM = ag.makePair(regs.BND, regs.FRM);
		regs.KON = c_bind;
		return sequence;
	}

	return error("Invalid parameter pattern: ", regs.PAT);
}

function c_bind() {

	regs.FRM = stk.restore();
	regs.ENV = stk.restore();
	regs.KON = stk.restore();
	return regs.KON;
}

/* NATIVES */

//FIX NATIVES
//FIX READER/COMPILER
//WRITE ROADMAP

function add() {

	regs.VAL = 0;
	while(ag.isPair(regs.ARG)) {
		regs.VAL += ag.numberVal(car(regs.ARG));
		regs.ARG = cdr(regs.ARG);
	}
	regs.VAL = ag.makeNumber(regs.VAL);
	return regs.KON;
}

nativeTab = [add];
regs.BND = ag.makePair(symbols.enterPool('+'), ag.makeNative(0));
regs.FRM = ag.makePair(regs.BND, regs.FRM);

function sub() {

	regs.VAL = car(regs.ARG);
	while((regs.ARG = regs.ARG.cdr) != null) {
		regs.VAL -= regs.ARG.car;
	}
	return regs.KON;
}

function mul() {

	regs.VAL = 1;
	while(regs.ARG != null) {
		regs.VAL *= regs.ARG.car;
		regs.ARG = regs.ARG.cdr;
	}
	return regs.KON;
}

function div() {

	regs.VAL = regs.ARG.car;
	while((regs.ARG = regs.ARG.cdr) != null) {
		regs.VAL /= regs.ARG.car;
	}
	return regs.KON;  
}

/* MAIN */

function c_REP() {

	IO.printOut(printer.printExp(regs.VAL));
	IO.write('> ');
	parser.setup(IO.read());
	regs.EXP = parser.parse();
	regs.GLB = regs.FRM;
	return eval;
}

regs.VAL = ag.makeString('Welcome to JScheme:');
regs.KON = c_REP;
startTrampoline(c_REP);