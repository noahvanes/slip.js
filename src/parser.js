/* IMPORT UTILS */

const ag = require('./ag.js');
const symbols = require('./pool.js');

/* SCHEME READER */

function SchemeReader() {

	var program, position, hold;

	function setup(str) {
		program = str;
		position = 0;
	}

	function isTerminator(c) {

		switch (c) {
			case ' ': case '':
			case '\n': case '\t':
			case '\'': case '\"':
			case ')': case '(':
			case ';': case '.':
			case '\r':
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
					position = position - 1; //oops, go back
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
		setup: setup,
		skip: skip,
		peek: peek,
		read: read,
		readSymbol: readSymbol,
		readString: readString,
		readNumber: readNumber
	}
}

/* SCHEME PARSER */ 

function SchemeParser(program) {

	var reader = SchemeReader();
	var character, exp;

	const __QUO_SYM__ = symbols.insertPool('quote');
	const __BEG_SYM__ = symbols.insertPool('begin');
	const __LET_SYM__ = symbols.insertPool('let');
	const __DEF_SYM__ = symbols.insertPool('define');
	const __LAM_SYM__ = symbols.insertPool('lambda');
	const __SET_SYM__ = symbols.insertPool('set!');
	const __IFF_SYM__ = symbols.insertPool('if');

	/* --- READING --- */

	function read() {
	
		switch (reader.peek()) {

			case '(': return readLBR();
			case '#': return readSHR();
			case '\'': return readQUO();
			case '\"': 
				return reader.readString();
			case '+': case '-': case '0':
			case '1': case '2': case '3':
			case '4': case '5': case '6':
			case '7': case '8': case '9':
				return reader.readNumber();
			default:
				return reader.readSymbol();
		}
	}

	function readLBR() {

		reader.skip();
		return readList();
	}

	function readList() {

		character = reader.peek();

		if (character === ')') {
			reader.skip();
			return ag.__NULL__;
		}

		if (character === '.') {
			reader.skip();	// skip period
			var exp = read();
			reader.skip(); 	// skip right bracket
			return exp;
		}

		//JS evaluates arguments left-to-right
		return ag.makePair(read(), readList());
	}

	function readQUO() {

		reader.skip();
		var pai = ag.makePair(read(), null);
		return ag.makePair(__QUO_SYM__, pai);
	}

	function readVector(count) {

		if (reader.peek() === ')') {
			return ag.makeVector(count);
		}

		var exp = read();
		var vct = readVector(count + 1);
		ag.vectorSet(vct, count + 1, exp);
		return vct;
	}

	function readSHR() {

		reader.skip(); 	// skip #

		switch(reader.read()) {

			case 't':
				return ag.__TRUE__;
			case 'f':
			 	return ag.__FALSE__;
			case '\\':
				character = reader.read();
				return ag.makeChar(character.charCodeAt(0));
			case '(':
				return readVector(0);
		}
	}

	/* --- PARSING --- */

	function parse() {
		
		switch (reader.peek()) {

			case '(': return parseLBR();
			case '#': return parseSHR();
			case '\'': return parseQUO();
			case '\"': 
				return reader.readString();
			case '+': case '-': case '0':
			case '1': case '2': case '3':
			case '4': case '5': case '6':
			case '7': case '8': case '9':
				return reader.readNumber();
			default:
				return reader.readSymbol();
		}
	}

	function parseLBR() {

		reader.skip(); // skip whitespace

		// empty list
		if (reader.peek() == ')') {
			reader.skip(); // skip right bracket
			return ag.__NULL__;
		}

		exp = parse();

		switch (exp) {

			case __BEG_SYM__: return parseBegin();
			case __IFF_SYM__: return parseIf();
			case __LET_SYM__: return parseLet();
			case __QUO_SYM__: return parseQuote();
			case __LAM_SYM__: return parseLambda();
			case __DEF_SYM__: return parseDefine();
			case __SET_SYM__: return parseSet();
			default: return parseApplication();
		}
	}

	function parseSequence(count) {

		var vct, exp = parse();

		if (reader.peek() === ')') {
			vct = ag.makeVector(count);
			reader.skip();
		} else {
			vct = parseSequence(count+1);
		}

		ag.vectorSet(vct, count, exp);
		return vct;
	}

	function parseBegin() {

		if (reader.peek() === ')') {
			return new Error('unexpected )');
		}

		return ag.makeBegin(parseSequence(1));
	}

	function parseIf() {

		var condition = parse();	// parse condition
		var consequence = parse();	// parse consequence
		if (reader.peek() === ')') {
			reader.skip(); // skip right bracket
			return ag.makeIfs(condition, consequence);
		} 

		var alternative = parse();	// parse alternative
		if (reader.read() === ')') {
			return ag.makeIff(condition, consequence, alternative);
		}

		return new Error('expected )'); 
	} 

	function parseQuote() {

		var quo = read();
		if (reader.read() === ')') {
			return ag.makeQuo(quo);
		}

		return new Error('expected )');
	}

	function parseLambda() {

		var bdy, args = read();

		if (reader.peek() === ')') {
			bdy = ag.__EMPTY_VEC__;
		} else {
			bdy = parseSequence(1);
		}

		return ag.makeLambda(args, bdy);
	}

	function parseBindings(count) {

		character = reader.read();
		
		if (character === ')') {
			return ag.makeVector(count);
		}

		if (character === '(') {

			var sym = read();
			var val = parse();

			if (reader.read() === ')') {
				var vct = parseBindings(count + 2);
				ag.vectorSet(vct, count + 1, sym);
				ag.vectorSet(vct, count + 2, val);
				return vct;
			}

			return new Error('expected )');
		}

		return new Error('invalid let syntax');
	}

	function parseLet() {

		if(reader.read() === '(') {

			var bnd = parseBindings(0);
			var bdy = parseSequence(1);

			return ag.makeLet(bnd, bdy);
		}

		return new Error('expected (');
	}

	function parseDefine() {

		var pat = read();

		if (ag.isSymbol(pat)) {

			var val = parse();

			if (reader.read() === ')') {
				return ag.makeDfv(pat, val);
			}

			return new Error('expected )');
		} 

		if (ag.isPair(pat)) {

			var sym = ag.pairCar(pat);
			var arg = ag.pairCdr(pat);
			var bdy = parseSequence(1);
			return ag.makeDff(sym, arg, bdy);
		} 

		return new Error('invalid define syntax');
	}

	function parseArguments() {

		if (reader.peek() === ')') {
			reader.skip();
			return ag.__NULL__;
		}

		//JS evaluates function operands left to right
		return ag.makePair(parse(), parseArguments());
	}

	function parseApplication() {

		var nam = exp;
		var arg = parseArguments();
		return ag.makeApplication(nam, arg);
	}

	function parseSet() {

		var sym = read();
		var val = parse();

		if (reader.read() === ')') {
			return ag.makeSet(sym, val);
		}

		return new Error('expected )');
	}

	function parseQUO() {

		reader.skip(); // skip '
		return ag.makeQuo(read());
	}

	return { read: read, 
			 parse: parse,
		     setup: reader.setup };
}

/* EXPORT PARSER */
exports.makeParser = SchemeParser; 

var printer = require('./printer.js');
var parser = SchemeParser();
exports.test = function(str) {
	parser.setup(str);
	console.log(printer.printExp(parser.parse()));
}