function READER() {
	"use strict";

	var program, position, hold;
	var asm, pool, err;

	function load(str) {
		program = str;
		position = 0;
	}

	function link(asmModule, errModule, poolModule) {
		asm = asmModule;
		err = errModule;
		pool = poolModule;
	}

	function make() {
		var tag = arguments[0];
		var len = arguments.length;
		var chk = asm.fmake(tag,len-1);
		for(var i = 1; i < len; ++i)
			asm.fset(chk,i,arguments[i]);
		return chk;
	}

	function readerError(err) {
		err(arguments[1])
		throw err
	}

	function expect(ch,err) {
		var res = readC()
		if(res !== ch)
			readerError(err,res)
	}

	function read_exp() {

		try {
			return read.c()
		} catch(exception) {
			console.log(exception);
			return asm.slipVoid();
		}
	}

	function read() {

		switch(peekC()) {

			case '(': 
				return read_lbr.c()
			case '#': 
				return read_shr.c()
			case '\'': 
				return read_quo.c()
			case '\"': 
				return read_str.c()
			case '+':
			case '-':
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				return read_num.c()
			default:
				return read_sym.c()
		}
	}

	function read_lbr() {

		skipC();  //skip the '('

		// an empty list
		if(peekC() === ')') {
			skipC()
			return asm.slipNull()
		}

		// a non-empty list
		this.elements = []
		do {
			this.elements.push(read.c());
			if(peekC() === '.') {
				skipC()
				this.tail = read.c()
				expect(')',err.expectedRBR);
				return buildList.c(this.elements,this.tail)
			}
		} while(peekC() !== ')')

		skipC();
		return buildList.c(this.elements,asm.slipNull());
	}

	function read_quo() {

		skipC();  // skip '
		this.quoted = read.c();
		this.exp = make(__PAI_TAG__,this.quoted,asm.slipNull());
		return make(__PAI_TAG__,pool.loadQuo(),this.exp);
	}

	function read_shr() {

		skipC();  // skip #

		switch(readC()) {

			case 't':
				return asm.slipTrue();
			case 'f':
				return asm.slipFalse();
			case '\\':
				var code = readC().charCodeAt(0)
				return asm.fmakeChar(code)
			case '(':
				return read_vec.c();
			default:
				readerError(err.invalidSyntax)
		}
	}

	function read_vec() {

		if(peekC() === ')') {
			skipC();
			return make(__PAI_TAG__,
						pool.loadVec(),
						asm.slipNull());
		}

		this.elements = [];
		do {
			this.elements.push(read.c())
		} while(peekC() !== ')')

		this.args = buildList.c(this.elements,asm.slipNull());
		var vctApl = make(__PAI_TAG__,pool.loadVec(),this.args);
		return vctApl;
	}

	function read_str() {
		hold = position;
		while(program.charAt(++position) !== '\"');
		return extractString(hold+1,position++);
	}

	function read_sym() {
		hold = position;
		while(!isTerminator(program.charAt(++position)));
		return pool.enterPool(program.substring(hold,position));
	}

	function read_num() {
		hold = position;
		//step 1: check for sign
		switch(program.charAt(position)) {
			case '+':
			case '-':
				if(!isNumber(program.charAt(++position))) {
					--position; //oops, go back
					return read_sym.c();
				}
		}
		//step 2: parse number in front of .
		while(isNumber(program.charAt(++position)));
		//step 3: parse number after .
		if(program.charAt(position) === '.') {
			while(isNumber(program.charAt(++position)));
			var flt = parseFloat(program.substring(hold, position));
			return asm.fmakeFloat(flt);
		}
		var int = parseInt(program.substring(hold, position));
		return asm.fmakeNumber(int);
	}


	/*  HELPERS  */

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
				case ';':
					var current;
					while((current = program.charAt(++position)) != '\n'
					    	&& current != '\r' && current != '');
				case '\n': case '\r':
				case '\t': case ' ':
					++position;
					break;
				default:
					return;
			}
		}
	}

	function skipC() {
		skipWhiteSpace();
		++position;
	}

	function peekC() {
		skipWhiteSpace();
		return program.charAt(position);
	}

	function readC() {
		skipWhiteSpace();
		return program.charAt(position++);
	}

	function buildList(elements,tail) {
		var len = elements.length;
		var lst = tail;
		this.clean = [];
		while(len) {
			var exp = elements[--len];
			lst = make(__PAI_TAG__,exp,lst)
			this.clean.push(lst);
		}
		return lst;
	}


	function extractString(from, to) {
		var len = to - from;
		var str = asm.fmakeText(__STR_TAG__,len);
		for(var i = 0; i < len; ++i) {
			var chr = program.charCodeAt(from+i);
			asm.ftextSetChar(str,i,chr);
		}
		return str;
	}

	return {
		load: load,
		link: link,
		read: read_exp
	}
}