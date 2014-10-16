// TODO: better constructors for AG's
// TODO: more error detection
// TODO: allow commenting
// TODO: quote

function Pair(a,d) {

	this.car = a;
	this.cdr = d;
}

function buildList(arr) { 

	var i = arr.length;
	var currentPair = null;

	while (i-- != 0) { 
		currentPair = new Pair(arr[i], currentPair);
	}
	
	return currentPair;
}

function makeSymbol(s) {

	var symbolTable = {}
	var symbolCount = -1;

	makeSymbol = function(nam) {

		var id = symbolTable[nam];
		if (id == undefined) {
			symbolTable[nam] == ++symbolCount;
			id = symbolCount;
		}

		return { txt: nam, id: id }
	}
	return makeSymbol(s);
}

function SchemeReader(str) {

	var program = str;
	var position = 0;
	var hold = 0;

	function isWhiteSpace(c) {

		switch(c) {

			case ' ':
			case '\t':
			case '\n':
				return true;
			default:
				return false;
		}
	}

	function isValid(c) {

		//TODO: inline in one big switch?
		return !(isWhiteSpace(c) && c != '\"');
	}

	function isNumber(c) {

		return !(c < '0' || c > '9');
	}

	function skipWhiteSpace() {

		while(isWhiteSpace(program.charAt(position))) {
			++position;
		}
	}

	function skip() {

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

	function readWord() {

		skipWhiteSpace();
		hold = position; 								//remember start position
		while(isValid(program.charAt(++position))); 	//skip until end of word
		return program.substring(hold, position);
	}

	function readNumber() {

		skipWhiteSpace();
		hold = position;

		//step 1: check for sign
		switch(program.charAt(position)) {
			case '+':
			case '-':
				++position;
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
		skip: skip,
		peek: peek,
		read: read,
		readWord: readWord,
		readNumber: readNumber
	}
}


function SchemeParser(program) {

	var reader = SchemeReader(program);
	var character;

	function parse() {

		character = reader.peek();

		switch(character) {

			case '(': 
				return parseLBR();
			case '#': 
				return parseSHR();
			case '-': case '+': case '0':
			case '1': case '2': case '3': 
			case '4': case '5': case '6': 
			case '7': case '8': case '9':
				return parseNBR();
			case '\"':
				return parseSTR();
			default:
				return parseVAR();
		}
	}

	function parseLBR() {

		var elm = [];

		reader.skip(); 	// skip left bracket
		while (reader.peek() != ')') { elm.push(parse()); }
		reader.skip(); 	// skip right bracket

		return buildList(elm);
	}

	function parseSHR() {

		reader.skip(); 	// skip #
		character = reader.read();

		if (character == 't' || character == 'f') {
			return new Boolean(character == 't');
		}

		if(character == '(') {

			var elm = [];
			while(reader.peek() != ')') { elm.push(parse()); }
			reader.skip(); // skip right bracket

			return elm;
		}
	}

	function parseNBR() {

		return reader.readNumber();

	}

	function parseSTR() {

		reader.skip(); 	// skip opening "
		var result = reader.readWord();
		reader.skip();	// skip closing "

		return result;

	}

	function parseVAR() {

		return makeSymbol(reader.readWord());
	}

	return { parse: parse };

}

var p = SchemeParser("(define x -2.56)");
var x = p.parse();
var test = x.cdr.cdr.car;
print(test);