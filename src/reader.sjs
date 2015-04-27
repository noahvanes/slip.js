function READER() {
	"use strict";
	
	var __QUO_SYM__;
	function loadSymbols() {
		 __QUO_SYM__ = pool.enterPool('quote');
	}

	function SchemeReader() {

		var program, position, hold;

		function load(str) {
			program = str;
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

			hold = position;
			while(!isTerminator(program.charAt(++position)));
			return pool.enterPool(program.substring(hold, position));
		}

		function extractString(from, to) {
			var len = to - from;
			var str = ag.makeString(len);
			for(var i = 0; i < len; ++i)
				ag.stringSet(str, i, program.charCodeAt(from+i));
			return str;
		}

		function readString() {

			claim();
			hold = position;
			while(program.charAt(++position) != '\"');
			return extractString(hold+1, position++);
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
				claim();
				return ag.makeFloat(parseFloat(program.substring(hold, position)));
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

	var reader = SchemeReader();

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
			regs.VAL = __NULL__;
			return regs.KON;
		}

		stk.save(regs.KON);
		regs.KON = c1_LBR;
		stk.save(0);
		return read;
	}

	function c1_LBR() {

		claim();

		if (reader.peek() === ')') {
			reader.skip();
			regs.VAL = ag.makePair(regs.VAL, __NULL__);
			return c3_LBR;
		}

		regs.IDX = stk.peek();
		stk.poke(++regs.IDX);
		mem.push(regs.VAL);

		if (reader.peek() === '.') {
			reader.skip();
			regs.KON = c2_LBR;
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
			regs.VAL = ag.makePair(mem.pop(), regs.VAL);
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

		claim();
		regs.VAL = ag.makePair(regs.VAL, __NULL__);
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
				regs.VAL = __TRUE__;
				return regs.KON;
			case 'f': 
				/* READ FALSE */
				regs.VAL = __FALSE__;
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
				stk.save(1);
				return read;
		}
	}

	function c_vector() {

		if (reader.peek() === ')') {
			reader.skip();
			regs.LEN = stk.restore();
			claimSiz(regs.LEN);
			regs.EXP = ag.makeVector(regs.LEN);
			ag.vectorSet(regs.EXP, regs.LEN, regs.VAL);
			while (--regs.LEN) 
				ag.vectorSet(regs.EXP, regs.LEN, mem.pop());
			regs.VAL = regs.EXP;
			regs.KON = stk.restore();
			return regs.KON;
		}

		claim();
		regs.IDX = stk.peek();
		stk.poke(++regs.IDX);
		mem.push(regs.VAL);
		return read;
	}

	return {
		read: read,
		load: reader.load,
		loadSymbols: loadSymbols
	}
}