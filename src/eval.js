
/* IMPORTS FROM UTILS.JS */

var utils = require('./utils.js');

var Pair = utils.Pair;
var assoc = utils.assoc;
var length = utils.length;
var reverseLst = utils.reverseLst;
var buildList = utils.buildList;
var toArray = utils.toArray;
var isSymbol = utils.isSymbol;
var toSymbol = utils.toSymbol;
var error = utils.error;

/* IMPORT PARSER */

var parser = require('./parser.js').makeParser();

/* VM ARCHITECTURE */

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
	TOP: 0,
	VAL: null
}

var stk = {
	arr: new Array(__STACK_SIZ__),
	sp: 0,
}

stk.save = function(el) { this.arr[this.sp++] = el; },
stk.restore = function() { return this.arr[--this.sp]; }

// trampoline for TCO
function startTrampoline(fun) {
	while(fun = fun());
}

/* ERRORS */

function error(msg, reg) {
	console.log(msg);
	regs.VAL = reg;
	regs.ENV = null;
	regs.FRM = regs.GLB;
	return false;
}

/* MAKE PROCEDURE */

function makeProcedure(par, seq, env) {

	return function() {

		stk.save(regs.KON);
		stk.save(regs.ENV);
		stk.save(regs.FRM);
		regs.PAR = par;
		regs.SEQ = seq;
		regs.ENV = env;
		regs.FRM = null;
		return bind;
	}
}

/* KEYWOARD SYMBOLS */

function buildKeywords() {

	var len = arguments.length;
	var res = {};
	var cur;

	while(len--) {
		cur = arguments[len];
		res[cur] = toSymbol(cur);
	}

	return res;
}

var keywords = buildKeywords('begin', 'define', 'eval', 'if', 'lambda', 'quote', 'set!');

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

	if (isSymbol(regs.EXP)) {
		return evalVariable;
	}

	return clone; //for literals
}

/* EVAL VARIABLES */

function evalVariable() {

	regs.EXP = regs.EXP.txt;
	regs.BND = assoc(regs.EXP, regs.FRM);
	if (regs.BND) {
		regs.ADR = regs.BND.cdr;
		regs.BND = assoc(regs.ADR, regs.STO);
		regs.VAL = regs.BND.cdr;
		return regs.KON;
	}

	if (regs.ENV == null) {
		return error("Cannot find local variable: ", regs.EXP);
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
		return error("Cannot find non-local variable: ", regs.EXP);
	}

	return lookup;
}

/* EVAL COMPOUND */

function evalCompound() {

	regs.LST = regs.EXP.cdr;
	regs.EXP = regs.EXP.car;
	regs.LEN = length(regs.LST);

	switch(regs.EXP.id) {

		case keywords.begin.id: return evalBegin;
		case keywords.define.id: return evalDefine;
		case keywords.eval.id: return evalEval;
		case keywords.if.id: return evalIf;
		case keywords.lambda.id: return evalLambda;
		case keywords.quote.id: return evalQuote;
		case keywords['set!'].id: return evalSet;
		default: return evalApplication;
	}
}

/* EVAL DEFINE */

function evalDefine() {

	if(regs.LEN < 2) {
		return error("At least 2 arguments required: ", regs.LST);
	}	

	regs.PAT = regs.LST.car;

	if (isSymbol(regs.PAT) && regs.LEN == 2) { //normal variable definition

		regs.PAT = regs.PAT.txt;
		stk.save(regs.KON);
		stk.save(regs.PAT);
		regs.EXP = regs.LST.cdr.car;
		regs.KON = c_define;
		return eval;
	}

	if (regs.PAT instanceof Pair) { //syntax for function definition 
		
		regs.PAR = regs.PAT.cdr;
		regs.PAT = regs.PAT.car;
		if(!isSymbol(regs.PAT)) {
			return error("Function name required: ", regs.PAT);
		}

		regs.PAT = regs.PAT.txt;
		regs.SEQ = regs.LST.cdr;
		regs.BND = assoc(regs.PAT, regs.FRM);
		if(regs.BND) {
			regs.ENV = new Pair(regs.FRM, regs.ENV);
			regs.VAL = makeProcedure(regs.PAR, regs.SEQ, regs.ENV);
			regs.ENV = regs.ENV.cdr;
			regs.ADR = regs.BND.cdr;
			regs.BND = new Pair(regs.ADR, regs.VAL);
			regs.STO = new Pair(regs.BND, regs.STO);
			return regs.KON;
		}
		regs.BND = new Pair(regs.PAT, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.ENV = new Pair(regs.FRM, regs.ENV);
		regs.VAL = makeProcedure(regs.PAR, regs.SEQ, regs.ENV);
		regs.ENV = regs.ENV.cdr;
		regs.BND = new Pair(regs.TOP++, regs.VAL);
		regs.STO = new Pair(regs.BND, regs.STO);
		return regs.KON;
	}

	return error("Invalid definition pattern: ", regs.LST);
}

function c_define() {

	regs.PAT = stk.restore();
	regs.KON = stk.restore();
	regs.BND = assoc(regs.PAT, regs.FRM);

	if(regs.BND) {
		regs.ADR = regs.BND.cdr;
		regs.BND = new Pair(regs.ADR, regs.VAL);
	} else {
		regs.BND = new Pair(regs.PAT, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.BND = new Pair(regs.TOP++, regs.VAL);
	}

	regs.STO = new Pair(regs.BND, regs.STO);
	return regs.KON; 
}

/* EVAL ASSIGNMENT */

function evalSet() {

	if(regs.LEN == 2) {

		regs.PAT = regs.LST.car.txt;
		regs.BND = assoc(regs.PAT, regs.FRM);

		if(regs.BND) {

			stk.save(regs.KON);
			stk.save(regs.BND.cdr);
			regs.EXP = regs.LST.cdr.car;
			regs.KON = c_set;
			return eval;
		}

		if(regs.ENV == null) {
			return error("Cannot find non-local variable: ", regs.PAT);
		}		

		stk.save(regs.ENV);
		stk.save(regs.FRM);
		return assign;
	}

	return error("set! requires exactly two arguments: ", regs.LST);
}

function c_set() {

	regs.ADR = stk.restore();
	regs.KON = stk.restore();
	regs.BND = new Pair(regs.ADR, regs.VAL);
	regs.STO = new Pair(regs.BND, regs.STO);
	return regs.KON;
}

function assign() {

	regs.FRM = regs.ENV.car;
	regs.BND = assoc(regs.PAT, regs.FRM);

	if(regs.BND) {
		regs.FRM = stk.restore();
		regs.ENV = stk.restore();
		stk.save(regs.KON);
		stk.save(regs.BND.cdr);
		regs.EXP = regs.LST.cdr.car;
		regs.KON = c_set;
		return eval;
	}

	regs.ENV = regs.ENV.cdr;
	if (regs.ENV == null) {
		return error("Cannot find variable: ", regs.PAT);
	}

	return assign;
}

/* EVAL QUOTING */

function evalQuote() {

	if (regs.LEN == 1) {
		regs.EXP = regs.LST.car;
		return clone;
	}

	return error("Quote requires exactly one argument: ", regs.LST);
}

/* EVAL BEGIN/SEQUENCE */

function evalBegin() {

	if(regs.LEN < 1) {
		return error("Begin requires at least one argument: ", regs.LST);
	}

	regs.SEQ = regs.LST;
	return sequence;
}

function sequence() {

	regs.EXP = regs.SEQ.car;
	regs.SEQ = regs.SEQ.cdr;

	if (regs.SEQ != null) {
		stk.save(regs.KON);
		stk.save(regs.SEQ);
		regs.KON = c_sequence;
	}

	return eval;
}

function c_sequence() {

	regs.SEQ = stk.restore();
	regs.EXP = regs.SEQ.car;
	regs.SEQ = regs.SEQ.cdr;

	if (regs.SEQ == null) {
		regs.KON = stk.restore();
	} else {
		stk.save(regs.SEQ);
	}

	return eval;
}

/* EVAL IF-SEQUENCE */

function evalIf() {

	if (regs.LEN == 2) {

		regs.EXP = regs.LST.car;
		stk.save(regs.KON);
		stk.save(regs.LST);
		regs.KON = c1_if;
		return eval;
	
	} else if (regs.LEN == 3) {

		regs.EXP = regs.LST.car;
		stk.save(regs.KON);
		stk.save(regs.LST);
		regs.KON = c2_if;
		return eval;
	}

	return error("If requires 2 or 3 arguments: ", regs.LST);
}

function c1_if() {

	regs.LST = stk.restore();
	regs.KON = stk.restore();

	if (regs.VAL) {
		regs.EXP = regs.LST.cdr.car;
		return eval;
	}

	regs.VAL = null;
	return regs.KON;
}

function c2_if() {

	regs.LST = stk.restore();
	regs.KON = stk.restore();

	if(regs.VAL) {
		regs.EXP = regs.LST.cdr.car;
	} else {
		regs.EXP = regs.LST.cdr.cdr.car;
	}

	return eval;
}

/* EVAL EVAL */

function evalEval() {

	if (regs.LEN == 1) {
		regs.EXP = regs.LST.car;
		stk.save(regs.KON);
		regs.KON = c_eval;
		return eval;
	}

	return error("Exactly one argument required for eval: ", regs.LST);
}

function c_eval() {

	regs.EXP = regs.VAL;
	regs.KON = stk.restore();
	return eval;
}

/* EVAL LAMBDA */

function evalLambda() {

	if(regs.LEN == 2) {

		regs.PAR = regs.LST.car;
		regs.SEQ = regs.LST.cdr;
		regs.ENV = new Pair(regs.FRM, regs.ENV);
		regs.VAL = makeProcedure(regs.PAR, regs.SEQ, regs.ENV);
		regs.ENV = regs.ENV.cdr;
		return regs.KON;
	}

	return error("Two arugments required for lambda: ", regs.LST);
}

/* EVAL APPLICATION */

function evalApplication() {

	stk.save(regs.KON);
	stk.save(regs.LST);
	regs.KON = c1_Application;
	return eval;
}

function c1_Application() {

	regs.LST = stk.restore();
	regs.ARG = null;

	if (regs.LST == null) {
		regs.PRC = regs.VAL;
		regs.KON = stk.restore();
		return apply;
	}

	stk.save(regs.VAL);
	stk.save(regs.ARG);
	regs.EXP = regs.LST.car;
	regs.LST = regs.LST.cdr;

	if (regs.LST == null) { // last argument
		regs.KON = c3_Application;
	} else {
		regs.KON = c2_Application;
		stk.save(regs.LST);
	}

	return eval;
}

function c2_Application() {

	regs.LST = stk.restore();
	regs.ARG = stk.restore();
	regs.ARG = new Pair(regs.VAL, regs.ARG);
	stk.save(regs.ARG);
	regs.EXP = regs.LST.car;
	regs.LST = regs.LST.cdr;
	
	if (regs.LST == null) { // last argument
		regs.KON = c3_Application;
	} else {
		regs.KON = c2_Application;
		stk.save(regs.LST);
	}

	return eval;
}

function c3_Application() {
	
	regs.ARG = stk.restore();
	regs.ARG = new Pair(regs.VAL, regs.ARG);
	regs.ARG = reverseLst(regs.ARG);
	regs.PRC = stk.restore();
	regs.KON = stk.restore();
	return apply;
}

/* APPLY & BIND */

function apply() {

	if(typeof(regs.PRC) == 'function') {
		return regs.PRC;
	}

	return error("Expected procedure to apply: ", regs.PRC);
}

function bind() {

	// no arguments
	if(regs.PAR == null) {
		if(regs.ARG == null) {
			regs.KON = c_bind;
			return sequence;
		}
		return error("Excess arguments: ", regs.ARG);
	}

	// fixed arguments
	if(regs.PAR instanceof Pair) {
		
		if(regs.ARG == null) {
			return error("Not enough arguments: ", regs.ARG);
		}

		regs.PAT = regs.PAR.car;
		if(!isSymbol(regs.PAT)) {
			return error("Parameter is not a symbol: ", regs.PAT);
		} 

		regs.PAT = regs.PAT.txt;
		regs.BND = new Pair(regs.PAT, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.VAL = regs.ARG.car;
		regs.BND = new Pair(regs.TOP++, regs.VAL);
		regs.STO = new Pair(regs.BND, regs.STO);
		regs.ARG = regs.ARG.cdr;
		regs.PAR = regs.PAR.cdr;
		return bind;
	}

	// variable arguments
	if(isSymbol(regs.PAR)) {

		regs.PAT = regs.PAT.txt;
		regs.BND = new Pair(regs.PAR, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.BND = new Pair(regs.TOP++, regs.ARG);
		regs.STO = new Pair(regs.BND, regs.STO);
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

function makeNative(fun) {

	return function() {

		regs.VAL = fun.apply(null, toArray(regs.ARG));
		return regs.KON;
	}
}

function add() {

	regs.VAL = 0;
	while(regs.ARG != null) {
		regs.VAL += regs.ARG.car;
		regs.ARG = regs.ARG.cdr;
	}
	return regs.KON;
}

function sub() {

	regs.VAL = regs.ARG.car;
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

function equ(x,y) { return (x == y); }
function sma(x,y) { return (x < y); }
function lrg(x,y) { return (x > y); }
function sme(x,y) { return (x <= y); } 
function lre(x,y) { return (x >= y); } 
function cons(a,d) { return new Pair(a,d); }
function car(p) { return p.car; }
function cdr(p) { return p.cdr; }

var natives = buildList([['+', add], ['-', sub], ['*', mul], ['/', div], ['=', makeNative(equ)], 
						['<', makeNative(sma)], ['>', makeNative(lrg)], ['<=', makeNative(sme)],
						['>=', makeNative(lre)], ['cons', makeNative(cons)], ['car', makeNative(car)],
						['cdr', makeNative(cdr)]]);


/* INIT */ 

function initNatives() {

	if (regs.LST == null) {
		return false;
	} else {
		regs.BND = regs.LST.car;
		regs.LST = regs.LST.cdr;
		regs.PAT = regs.BND[0];
		regs.VAL = regs.BND[1];
		regs.BND = new Pair(regs.PAT, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.BND = new Pair(regs.TOP++, regs.VAL);
		regs.STO = new Pair(regs.BND, regs.STO);
		return initNatives;
	}
}

regs.LST = natives;
startTrampoline(initNatives);

regs.KON = function() { 
	return false; 
}

/* MAIN */

function test(str) {

	parser.setup(str);
	regs.GLB = regs.FRM;
	regs.EXP = parser.parse();
	startTrampoline(eval);
	console.log(regs.VAL);
}

test("(define (fac n) (if (< n 1) 0 (* n (fac (- n 1)))))");
test("(begin (define q (fac 10)) q)")