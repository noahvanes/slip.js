/* --- IMPORTS --- */

const stk = require('./stack.js');
const evaluator = require('./eval.js');
const reader = require('./reader.js');
const compiler = require('./compile.js');
const printer = require('./printer.js');
const natives = require('./natives.js');
const exec = require('./exec.js');
const IO = require('./IO.js');
const __NULL__ = require('./ag.js').__NULL__;

const read = reader.read;
const eval = evaluator.eval;
const compile = compiler.compile;

const regs = exec.regs;

/* --- OUTPUT TEXT --- */

const __WELCOME_TEXT__ = "Welcome to JScheme";
const __PROMPT_TEXT__ = "> ";

/* --- ERRORS --- */

function makeError(prefixTxt) {

	return function() {
		IO.write(prefixTxt);
		IO.printOut(regs.TXT);
		regs.FRM = regs.GLB;
		regs.ENV = __NULL__;
		stk.empty();
		return REPL;
	}
}

const syntaxError = makeError("SYNTAX ERROR: ");
const compileError = makeError("INVALID : ");
const evalError = makeError("ERROR: ");

/* --- REPL --- */

function REPL() {

	IO.write(__PROMPT_TEXT__);
	regs.GLB = regs.FRM;
	regs.TXT = IO.read();
	reader.load();
	regs.KON = c1_repl;
	return read;
}

function c1_repl() {

	regs.EXP = regs.VAL;
	regs.KON = c2_repl;
	return compile;
}

function c2_repl() {

	regs.EXP = regs.VAL;
	regs.KON = c3_repl;
	return eval;
}

function c3_repl() {

	regs.TXT = printer.printExp(regs.VAL);
	IO.printOut(regs.TXT);
	return REPL;
}

/* --- REPL INITIALISATION --- */

function startREPL() {

	reader.setErr(syntaxError);
	compiler.setErr(compileError);
	evaluator.setErr(evalError);
	natives.setErr(evalError);
	natives.initNatives();
	IO.printOut(__WELCOME_TEXT__);
	exec.run(REPL);
}

startREPL();