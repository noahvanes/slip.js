/* IMPORT MEMORY */

const mem = require('./mem.js');


/* FOR LATER INITIALISATION */ 

var ag;
var reader;
var compiler;
var eval;
var printExp;


/* CALLBACKS */

const config = Object.create(null);


/* VM ARCHITECTURE */

//stack
const stk = [];

stk.save = stk.push;
stk.restore = stk.pop;

stk.peek = function() {
	return stk[stk.length-1];
}

stk.poke = function(el) {
	stk[stk.length-1] = el;
}
stk.zap = function() {
	--stk.length;
}

//registers
const init = 0;
const regs = {
	ADR: init,
	ARG: init, //do?
	BND: init, //temp
	DCT: init, //temp
	ENV: init, //done
	EXP: init, //done
	FRM: init, //done
	GLB: init, //done
	IDX: init,
	KON: init,
	LEN: init,
	LST: init, //done
	NBR: init,
	PAR: init, //temp
	PAT: init, //temp
	SEQ: init, //spec
	SYM: init, //done
	TAG: init,
	TXT: init,
	VAL: init //done
}

/* REPL */

const __WELCOME_TEXT__ = "Welcome to JScheme";
const __PROMPT_TEXT__ = "> ";

function REPL() {

	config.print(__PROMPT_TEXT__);
	regs.TXT = config.read();
	regs.GLB = regs.FRM;
	regs.KON = c1_repl;
	return reader.read;
}

function c1_repl() {

	regs.EXP = regs.VAL;
	regs.KON = c2_repl;
	return compiler.compile;
}

function c2_repl() {

	regs.EXP = regs.VAL;
	regs.KON = c3_repl;
	return eval;
}

function c3_repl() {

	regs.TXT = printExp(regs.VAL);
	config.printline(regs.TXT);
	return REPL;
}


/* MEMORY MANAGEMENT */

const __MARGIN__ = 15; //margin for registers

function claim() {

	if (mem.available() < __MARGIN__) {
		reclaim();
		if(mem.available() < __MARGIN__) {
			regs.TXT = "Insufficient memory"
			fatalError();
		}
	}
}

function claimSiz(amount) {

	if (mem.available() < amount + __MARGIN__) {
		reclaim();
		if(mem.available() < amount + __MARGIN__) {
			regs.TXT = "Insufficient memory"
			fatalError();
		}
	}
}

//TODO: remove debugging code

function reclaim() {

	/*
	console.log("--- BEFORE ---");
	console.log("SYM: " + printExp(regs.SYM));
	console.log("GLB: " + printExp(regs.GLB));
	console.log("FRM: " + printExp(regs.FRM));
	console.log("ENV: " + printExp(regs.ENV));
	console.log("LST: " + printExp(regs.LST));
	console.log("ARG: " + printExp(regs.ARG));
	console.log("VAL: " + printExp(regs.VAL));
	console.log("EXP: " + printExp(regs.EXP));
	console.log("STACK: ");
	mem.stkforeach(function(el) { console.log(printExp(el)); });
	mem.memprint();
	*/

	//save registers on stack
	mem.push(regs.SYM);
	mem.push(regs.GLB);
	mem.push(regs.FRM);
	mem.push(regs.ENV);
	mem.push(regs.LST);
	mem.push(regs.ARG);
	mem.push(regs.VAL);
	mem.push(regs.EXP);
	mem.push(ag.__EMPTY_VEC__);

	//do garbage collect
	mem.collectGarbage();

	//reload symbol variables
	compiler.loadSymbols();
	reader.loadSymbols();

	//restore registers
	ag.__EMPTY_VEC__ = mem.pop();
	regs.EXP = mem.pop();
	regs.VAL = mem.pop();
	regs.ARG = mem.pop();
	regs.LST = mem.pop();
	regs.ENV = mem.pop();
	regs.FRM = mem.pop();
	regs.GLB = mem.pop();
	regs.SYM = mem.pop();

	/*
	console.log("--- AFTER --- ");
	console.log("SYM: " + printExp(regs.SYM));
	console.log("GLB: " + printExp(regs.GLB));
	console.log("FRM: " + printExp(regs.FRM));
	console.log("ENV: " + printExp(regs.ENV));
	console.log("LST: " + printExp(regs.LST));
	console.log("ARG: " + printExp(regs.ARG));
	console.log("VAL: " + printExp(regs.VAL));
	console.log("EXP: " + printExp(regs.EXP));
	console.log("STACK: ");
	mem.stkforeach(function(el) { console.log(printExp(el)) });
	mem.memprint();
	*/
}


/* ERROR MANAGEMENT */

const __ERROR_PREFIX__ = "** ERROR: ";
const __FATAL_PREFIX__ = "** FATAL ERROR: ";

function error() {

	regs.TXT = __ERROR_PREFIX__ + regs.TXT;
	config.printline(regs.TXT);
	regs.FRM = regs.GLB;
	regs.ENV = ag.__NULL__;
	mem.emptyStk();
	stk.length = 0;
	return REPL;
}

function fatalError() {

	regs.TXT = __FATAL_PREFIX__ + regs.TXT;
	config.printline(regs.TXT);
	config.quit();
}


/* TRAMPOLINE LOOP */

function startTrampoline(fun) {
	for(;;) fun = fun();
}


/* INITIALISATION */

const __DEFAULT_MEM__ = 1000;

function initREPL(pt, ptl, rd, ld, qt, memSize) {

	//set callbacks
	config.print = pt;
	config.printline = ptl;
	config.read = rd;
	config.load = ld;
	config.quit = qt;

	//setup memory
	memSize = memSize || __DEFAULT_MEM__;
	memSize = Math.max(__MARGIN__+1, memSize);
	mem.memoryInit(memSize);

	//initialise registers
	ag = require('./ag.js');
	regs.FRM = ag.__NULL__;
	regs.ENV = ag.__NULL__;
	regs.GLB = ag.__NULL__;
	regs.EXP = ag.__NULL__;
	regs.VAL = ag.__NULL__;
	regs.LST = ag.__NULL__;

	//load other modules
	reader = require('./reader.js');
	compiler = require('./compile.js');
	eval = require('./eval.js').eval;
	printExp = require('./printer.js').printExp;

	reader.loadSymbols();
	compiler.loadSymbols();

	//start REPL
	startTrampoline(REPL);
}


/* EXPORTS */

exports.stk = stk;
exports.regs = regs;
exports.initREPL = initREPL;
exports.claim = claim;
exports.claimSiz = claimSiz;
exports.reclaim = reclaim;
exports.error = error;
exports.fatalError = fatalError;
exports.config = config;