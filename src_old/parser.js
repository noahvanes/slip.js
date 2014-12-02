/* IMPORT UTILS */

var utils = require('./utils.js');
var symbols = require('./pool.js');
var ag = require('./ag.js');

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
		return toSymbol(program.substring(hold, position));
	}

	function readString() {

		hold = position
		while(program.charAt(++position) != '\"');
		return program.substring(hold + 1, position++);
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
		}

		return parseFloat(program.substring(hold, position));
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
	var character, fun;

	const __QUO_SYM__ = symbols.enterPool('quote');
	const __VCT_SYM__ = symbols.enterPool('vector');

	function parse() {

		character = reader.peek();
		
		switch (character) {

			case '(': 
				reader.skip();
				return parseLBR();
			case '#': 
				reader.skip();
				return parseSHR();
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

	function parseList() {

		character = reader.peek();

		if (character === ')') {
			reader.skip();
			return ag.__NULL__;
		}

		if (character === '.') {
			reader.skip();
			return parse();
		}

		return ag.makePair(parse(), parseList());
	}

	function parseLBR() {

		reader.skip(); //skip left bracket

		if ((character = reader.peek()) === ')') {
			reader.skip(); 		// skip right bracket
			return ag.__NULL__;	// return empty list
		}

		return ag.makePair(parse(), parseList());
	}

		var elm = [];

		reader.skip(); 	// skip left bracket
		while ((character = reader.peek()) != ')') { 
			if(character == '.') {
				reader.skip(); // skip period
				var lst = buildListWithCdr(elm, parse());
				reader.skip();
				return lst;
			}
			elm.push(parse());
		};
		reader.skip(); 	// skip right bracket

		return buildList(elm);
	}

	function parseSHR() {

		reader.skip(); 	// skip #
		character = reader.read();

		switch(character) {

			case 't': 
				return true;
			case 'f':
			 	return false;
			case '(':
				var elm = [];
				while(reader.peek() != ')') { 
					elm.push(parse()); 
				}
				reader.skip(); // skip right bracket
				return elm;
		}
	}

	function parseQUO() {

		reader.skip(); // skip '
		var pair = new Pair(parse(), null);
		pair = new Pair(__QUO_SYM__, pair);
		
		return pair;
	}

	return { parse: parse, 
		     setup: reader.setup };
}

/* EXPORT PARSER */
exports.makeParser = SchemeParser; 