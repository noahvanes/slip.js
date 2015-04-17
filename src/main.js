/* --- MAIN --- */
"use strict";

/* --- MODULES --- */
var mem, ag, config,
pool, reader, compiler, evaluator,
natives, printExp;

/* --- VM ARCHITECTURE --- */

//stack
const _stk = [];
const stk = {
	save: function(el) { _stk.push(el); },
	restore: function() { return _stk.pop(); },
	peek: function() { return _stk[_stk.length-1]; },
	zap: function() { --_stk.length; },
	poke: function(el) { _stk[_stk.length-1] = el; },
	empty: function() { _stk.length = 0; }
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

//trampoline
function run(f) {
	while(f = f());
}

/* --- INITIALISATION --- */

function Slip_init(clbs, memSiz) {

	//memory
	const __DEFAULT_MEM__ = 24;
	memSiz = 0x1 << (memSiz||__DEFAULT_MEM__);
	var buffer = new ArrayBuffer(memSiz);
	mem = MEMORY(window, {heapSize: memSiz}, buffer);

	//callbacks
	config = clbs;

	//setup other components
	ag = GRAMMAR();
	regs.FRM = ag.__NULL__;
	regs.ENV = ag.__NULL__;
	regs.GLB = ag.__NULL__;
	regs.EXP = ag.__NULL__;
	regs.VAL = ag.__NULL__;
	regs.LST = ag.__NULL__;

	pool = POOL();
	reader = READER();
	compiler = COMPILER();
	evaluator = EVALUATOR();
	natives = NATIVES();
	printExp = PRINTER().printExp;

	reader.loadSymbols();
	compiler.loadSymbols();
}


/* --- REPL --- */

const __WELCOME_TEXT__ = "Welcome to the Slip.js REPL";
const __PROMPT_TEXT__ = "> ";

function Slip_REPL() {
	config.printline(__WELCOME_TEXT__);
	config.printline('');
	run(REPL);
}

function waitForInput(txt) {
	reader.load(txt);
	run(reader.read);
}

function REPL() {

	regs.GLB = regs.FRM;
	regs.KON = c1_repl;
	config.print(__PROMPT_TEXT__);
	config.readExpression(waitForInput);
	return false;
}

function c1_repl() {

	regs.EXP = regs.VAL;
	regs.KON = c2_repl;
	return compiler.compile;
}

function c2_repl() {

	regs.EXP = regs.VAL;
	regs.KON = c3_repl;
	return evaluator.eval;
}

function c3_repl() {

	regs.TXT = printExp(regs.VAL);
	config.printline(regs.TXT);
	return REPL;
}

/* --- MEMORY MANAGEMENT --- */

const __MARGIN__ = 64;

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

function reclaim() {

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
}

/* --- ERROR MANAGEMENT --- */

const __ERROR_PREFIX__ = "** ERROR: ";
const __FATAL_PREFIX__ = "** FATAL ERROR: ";

function error() {

	regs.TXT = __ERROR_PREFIX__ + regs.TXT;
	config.printerror(regs.TXT);
	regs.FRM = regs.GLB;
	regs.ENV = ag.__NULL__;
	mem.emptyStk();
	stk.empty();
	return REPL;
}

function fatalError() {

	regs.TXT = __FATAL_PREFIX__ + regs.TXT;
	config.printerror(regs.TXT);
	regs.KON = false;
}

//fix old dependencies
const vm = window;