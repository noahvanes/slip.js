
/* IMPORTS FROM UTILS.JS */

var utils = require('./utils.js');

var Pair = utils.Pair;
var Symbol = utils.Symbol;
var length = utils.length;
var reverseLst = utils.reverseLst;
var buildList = utils.buildList;
var toArray = utils.toArray;
var isSymbol = utils.isSymbol;
var toSymbol = utils.toSymbol;

/* IMPORT PARSER */

var parser = require('./parser.js').makeParser();

/* IMPORT IO */

var IO = require('./IO.js');

/* VM ARCHITECTURE */

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
	STP: 0,
	STO: null,
	TOP: 0,
	VAL: null
}

regs.STK = new Array(__STACK_SIZ__);
regs.STO = new Array(__HEAP_SIZ__);

var stk = {
	save: function(el) { regs.STK[regs.STP++] = el; },
	restore: function() { return regs.STK[--regs.STP]; }
}
// trampoline for TCO
function startTrampoline(fun) {
	while(fun = fun());
}

/* ERRORS */

function error(msg, reg) {
	IO.printOut(msg);
	regs.VAL = reg;
	regs.ENV = null;
	regs.FRM = regs.GLB;
	regs.KON = c_REP;
	return c_REP;
}

/* ASSOC */

function assoc(item, lst) {

	while (lst != null) {
		if(equ(lst.car.car, item)) {
			return lst.car;
		}
		lst = lst.cdr;
	}

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

/* KEYWORD SYMBOLS */

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

var keywords = buildKeywords('begin', 'define', 'if', 'lambda', 'or', 'and', 'quote', 'let', 'set!');

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

	return clone; //for literals
}

/* EVAL VARIABLES */

function evalVariable() {

	regs.EXP = regs.EXP.txt;
	regs.BND = assoc(regs.EXP, regs.FRM);
	if (regs.BND) {
		regs.ADR = regs.BND.cdr;
		regs.VAL = regs.STO[regs.ADR];
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
		regs.VAL = regs.STO[regs.ADR];
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
		case keywords.if.id: return evalIf;
		case keywords.lambda.id: return evalLambda;
		case keywords.quote.id: return evalQuote;
		case keywords.or.id: return evalOr;
		case keywords.and.id: return evalAnd;
		case keywords.let.id: return evalLet;
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
			regs.STO[regs.ADR] = regs.VAL;
			return regs.KON;
		}
		regs.BND = new Pair(regs.PAT, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.ENV = new Pair(regs.FRM, regs.ENV);
		regs.VAL = makeProcedure(regs.PAR, regs.SEQ, regs.ENV);
		regs.ENV = regs.ENV.cdr;
		regs.STO[regs.TOP++] = regs.VAL;
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
		regs.STO[regs.ADR] = regs.VAL;
	} else {
		regs.BND = new Pair(regs.PAT, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.STO[regs.TOP++] = regs.VAL;
	}

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
	regs.STO[regs.ADR] = regs.VAL;
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

/* EVAL LET */

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

/* EVAL OR */

function evalOr() {

	if (regs.LST == null) {
		regs.VAL = false;
		return regs.KON;
	}

	regs.EXP = regs.LST.car;
	regs.LST = regs.LST.cdr;

	if (regs.LST != null) {
		stk.save(regs.KON);
		stk.save(regs.LST);
		regs.KON = c_or;
	}

	return eval;
}

function c_or() {

	regs.LST = stk.restore();

	if (regs.VAL != false) {
		regs.VAL = true;
		regs.KON = stk.restore();
		return regs.KON;
	}

	regs.EXP = regs.LST.car;
	regs.LST = regs.LST.cdr;

	if (regs.LST == null) {
		regs.KON = stk.restore();
	} else {
		stk.save(regs.LST);
	}

	return eval;
}

/* EVAL AND */

function evalAnd() {

	if (regs.LST == null) {
		regs.VAL = true;
		return regs.KON;
	}

	regs.EXP = regs.LST.car;
	regs.LST = regs.LST.cdr;

	if (regs.LST != null) {
		stk.save(regs.KON);
		stk.save(regs.LST);
		regs.KON = c_and;
	}

	return eval;
}

function c_and() {

	regs.LST = stk.restore();

	if (regs.VAL == false) {
		regs.KON = stk.restore();
		return regs.KON;
	}

	regs.EXP = regs.LST.car;
	regs.LST = regs.LST.cdr;

	if (regs.LST == null) {
		regs.KON = stk.restore();
	} else {
		stk.save(regs.LST);
	}

	return eval;
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
		regs.STO[regs.TOP++] = regs.VAL;
		regs.ARG = regs.ARG.cdr;
		regs.PAR = regs.PAR.cdr;
		return bind;
	}

	// variable arguments
	if(isSymbol(regs.PAR)) {

		regs.PAR = regs.PAR.txt;
		regs.BND = new Pair(regs.PAR, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.STO[regs.TOP++] = regs.ARG;
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

// simple map, only for unary functions
function map() {

	regs.PRC = regs.ARG.car;
	regs.ARG = regs.ARG.cdr.car;

	if (regs.ARG == null) {
		regs.VAL = null;
		return regs.KON;
	}

	stk.save(regs.KON);

	if (regs.ARG.cdr == null) {
		regs.KON = c1_map;
	} else {
		regs.KON = c2_map;
		stk.save(regs.PRC);
		stk.save(regs.ARG.cdr);
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

function makeVector() {

	regs.IDX = regs.ARG.car;
	if (regs.ARG.cdr == null) {
		regs.ARG = 0;
	} else {
		regs.ARG = regs.ARG.cdr.car;
	}

	regs.VAL = new Array(regs.IDX);
	while (regs.IDX) {
		regs.VAL[--regs.IDX] = regs.ARG;
	}
	return regs.KON;
}

function list() {

	regs.VAL = regs.ARG;
	return regs.KON;
}

function display() {

	IO.write(printStr(regs.ARG.car));
	regs.VAL = null;
	return regs.KON;
}

function newline() {

	IO.write('\n');
	regs.VAL = null;
	return regs.KON;
}

function not() {

	regs.ARG = regs.ARG.car;
	regs.VAL = (regs.ARG == false);
	return regs.KON;
}

function schemeApply() {

	regs.PRC = regs.ARG.car;
	regs.ARG = regs.ARG.cdr.car;
	return apply;
}

function schemeRead() {

	IO.write(':: ');
	parser.setup(IO.read());
	regs.VAL = parser.parse();
	return regs.KON;
}

function schemeEval() {

	regs.EXP = regs.ARG.car;
	return eval;
}

function schemeLoad() {

	regs.ARG = regs.ARG.car;
	parser.setup(IO.load(regs.ARG));
	regs.EXP = parser.parse();
	return eval;
}

function equ(x,y) { return (x == y); }
function sma(x,y) { return (x < y); }
function lrg(x,y) { return (x > y); }
function sme(x,y) { return (x <= y); } 
function lre(x,y) { return (x >= y); } 
function cons(a,d) { return new Pair(a,d); }
function car(p) { return p.car; }
function cdr(p) { return p.cdr; }
function isNull(x) { return (x == null); }
function isPair(x) { return (x instanceof Pair); }
function vref(v, i) { return v[i]; }
function vset(v, i, e) { return v[i] = e; }
function scar(p, v) { return (p.car = v); }
function scdr(p, v) { return (p.cdr = v); }

function equ(a, b) { 

	if (a instanceof Pair) {
		return (equ(a.car, b.car) && equ(a.cdr,b.cdr));
	}

	if (a instanceof Array) {
		for(var idx = 0; idx < a.length; ++idx) {
			if(!equ(a[idx], b[idx])) {
				return false;
			}
		}
		return a.length == b.length;
	}

	if (a instanceof Symbol) {
		return (a.id == b.id);
	}

	return a == b;
}

var initialBindings = buildList([['+', add], ['-', sub], ['*', mul], ['/', div], ['=', makeNative(equ)], 
								['<', makeNative(sma)], ['>', makeNative(lrg)], ['<=', makeNative(sme)],
								['>=', makeNative(lre)], ['cons', makeNative(cons)], ['car', makeNative(car)],
								['cdr', makeNative(cdr)], ['nil', null], ['null?', makeNative(isNull)],
								['symbol?', makeNative(isSymbol)], ['pair?', makeNative(isPair)], ['apply', schemeApply],
								['map', map], ['make-vector', makeVector], ['vector-ref', makeNative(vref)],
								['vector-set!', makeNative(vset)], ['list', list], ['set-car!', makeNative(scar)],
								['set-cdr!', makeNative(scdr)], ['display', display], ['equal?', makeNative(equ)],
								['read', schemeRead], ['assoc', makeNative(assoc)], ['load', schemeLoad],
								['newline', newline], ['eval', schemeEval], ['not', not]]);

/* INIT */ 

function initBindings() {

	if (regs.LST == null) {
		return false;
	} else {
		regs.BND = regs.LST.car;
		regs.LST = regs.LST.cdr;
		regs.PAT = regs.BND[0];
		regs.VAL = regs.BND[1];
		regs.BND = new Pair(regs.PAT, regs.TOP);
		regs.FRM = new Pair(regs.BND, regs.FRM);
		regs.STO[regs.TOP++] = regs.VAL;
		return initBindings;
	}
}

/* MAIN */

function c_REP() {

	IO.printOut(printStr(regs.VAL));
	IO.write('> ');
	parser.setup(IO.read());
	regs.EXP = parser.parse();
	regs.GLB = regs.FRM;
	return eval;
}

regs.LST = initialBindings;
startTrampoline(initBindings);
regs.VAL = 'Welcome to JScheme:'
regs.KON = c_REP;
startTrampoline(c_REP);