/* IMPORT UTILS */

const ag = require('./ag.js');
const symbols = require('./pool.js');
const stk = require('./stack');
const exec = require('./exec.js');
const regs = exec.regs;

/* SCHEME READER */

const __QUO_SYM__ = symbols.enterPool('quote');

function SchemeReader() {

	var program, position, hold;

	function load() {
		program = regs.TXT;
		position = 0;
	}

	function isTerminator(c) {

		switch (c) {
			case ' ': case '': case '\n': case '\t':
			case '\'': case '\"': case ')': case '(':
			case ';': case '.': case '\r':
				return true;
			default:
				return false;
		}
	}

	function isNumber(c) {
		return !(c < '0' || c > '9');
	}

	function skipWhiteSpace() {

		while(true) {

			switch (program.charAt(position)) {

				case '\n': case '\r': 
				case '\t': case ' ':
					++position;
					break;
				case ';': 
					var current;
					while((current = program.charAt(++position)) != '\n'
					    	&& current != '\r' && current != '');
					break;
				default:
					return;
			}
		}
	}

	function skip() {

		skipWhiteSpace();
		++position;
	}

	function peek() { 

		skipWhiteSpace();
		return program.charAt(position);
	}

	function read() {

		skipWhiteSpace();
		return program.charAt(position++);
	}

	function readSymbol() {

		hold = position; 									//remember start position
		while(!isTerminator(program.charAt(++position))); 	//skip until end of word
		return symbols.enterPool(program.substring(hold, position));
	}

	function readString() {

		hold = position
		while(program.charAt(++position) != '\"');
		return ag.makeString(program.substring(hold+1, position++));
	}

	function readNumber() {

		hold = position;

		//step 1: check for sign
		switch(program.charAt(position)) {
			case '+':
			case '-':
				if(!isNumber(program.charAt(++position))) {
					--position; //oops, go back
					return readSymbol();
				}
		}
		//step 2: parse number in front of .
		while(isNumber(program.charAt(++position)));
		//step 3: parse number after .
		if(program.charAt(position) == '.') {
			while(isNumber(program.charAt(++position)));
			return ag.makeDouble(parseFloat(program.substring(hold, position)));
		}

		return ag.makeNumber(parseInt(program.substring(hold, position)));
	}

	return { 
		load: load,
		skip: skip,
		peek: peek,
		read: read,
		readSymbol: readSymbol,
		readString: readString,
		readNumber: readNumber
	}
}

const reader = SchemeReader();

/* --- ERROR --- */

var error;
function setErr(handler) {
	error = handler;
}

/* --- READ --- */

function read() {

	switch (reader.peek()) {

		case '(': return readLBR;
		case '#': return readSHR;
		case '\'': return readQUO;
		case '\"': 
			regs.VAL = reader.readString();
			return regs.KON;
		case '+': case '-': case '0':
		case '1': case '2': case '3':
		case '4': case '5': case '6':
		case '7': case '8': case '9':
			regs.VAL = reader.readNumber();
			return regs.KON;
		default:
			regs.VAL = reader.readSymbol();
			return regs.KON;
	}
}

/* --- READ LBR --- */

function readLBR() {

	reader.skip(); //skip LBR

	if (reader.peek() === ')') {
		reader.skip();
		regs.VAL = ag.__NULL__;
		return regs.KON;
	}

	stk.save(regs.KON);
	regs.KON = c1_LBR;
	stk.save(0);
	return read;
}

function c1_LBR() {

	if (reader.peek() === ')') {
		reader.skip();
		regs.VAL = ag.makePair(regs.VAL, ag.__NULL__);
		return c3_LBR;
	}

	regs.IDX = stk.peek();
	stk.poke(regs.VAL);
	stk.save(++regs.IDX);

	if (reader.peek() === '.') {
		regs.KON = c2_LBR;
		reader.skip();
	} 

	return read;
}

function c2_LBR() {

	if (reader.peek() !== ')') {
		regs.TXT = 'Expected )';
		return error;
	}

	reader.skip();
	return c3_LBR;
}

function c3_LBR() {

	regs.IDX = stk.restore();
	while(regs.IDX--)
		regs.VAL = ag.makePair(stk.restore(), regs.VAL);

	regs.KON = stk.restore();
	return regs.KON;
}

/* --- READ QUOTE --- */

function readQUO() {

	reader.skip(); //skip '
	stk.save(regs.KON);
	regs.KON = c_QUO;
	return read;
}

function c_QUO() {

	regs.VAL = ag.makePair(regs.VAL, ag.__NULL__);
	regs.VAL = ag.makePair(__QUO_SYM__, regs.VAL);
	regs.KON = stk.restore();
	return regs.KON;
}

/* --- READ SHR --- */

function readSHR() {

	reader.skip(); //skip #

	switch(reader.read()) {

		case 't': 
			/* READ TRUE */
			regs.VAL = ag.__TRUE__;
			return regs.KON;
		case 'f': 
			/* READ FALSE */
			regs.VAL = ag.__FALSE__;
			return regs.KON;
		case '\\': 
			/* READ CHARACTER */
			regs.TXT = reader.read();
			regs.TXT = regs.TXT.charCodeAt(0);
			regs.VAL = ag.makeChar(regs.TXT);
			return regs.KON;
		case '(':
			/* READ VECTOR */
			if (reader.peek() === ')') {
				reader.skip();
				regs.VAL = ag.__EMPTY_VEC__;
				return regs.KON;
			}
			stk.save(regs.KON);
			regs.KON = c_vector;
			stk.save(0);
			return read;
	}
}

function c_vector() {

	if (reader.peek() === ')') {
		reader.skip();
		regs.IDX = stk.restore();
		regs.EXP = ag.makeVector(regs.IDX + 1);
		ag.vectorSet(regs.EXP, regs.IDX + 1, regs.VAL);
		while (regs.IDX)
			ag.vectorSet(regs.EXP, regs.IDX--, stk.restore());
		regs.VAL = regs.EXP;
		regs.KON = stk.restore();
		return regs.KON;
	}

	regs.IDX = stk.peek();
	stk.poke(regs.VAL);
	stk.save(++regs.IDX);
	return read;
}

exports.read = read;
exports.load = reader.load;
exports.setErr = setErr;


/* --- TESTING --- 
const printer = require('./printer.js');
exports.test = function(str) {
	regs.TXT = str;
	reader.load();
	regs.KON = false;
	exec.run(read);
	console.log(printer.printExp(regs.VAL));
}
*/