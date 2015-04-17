function NATIVES() {
	"use strict";

	const car = ag.pairCar;
	const cdr = ag.pairCdr;

	const __START__ = new Date().getTime();

	/* --- NATIVE --- */

	function native() {

		regs.ADR = ag.nativePtr(regs.VAL);
		/* DISPATCH */
		switch (regs.ADR) {
			/* ARITHMETIC */
			case __ADD_PTR__: return add;
			case __SUB_PTR__: return sub;
			case __MUL_PTR__: return mul;
			case __DIV_PTR__: return div;
			/* PAIRS/LISTS */
			case __CONS_PTR__: return mcons;
			case __CAR_PTR__: return mcar;
			case __CDR_PTR__: return mcdr;
			case __SET_CAR_PTR__: return scar;
			case __SET_CDR_PTR__: return scdr;
			case __LIST_PTR__: return list;
			case __ASSOC_PTR__: return assoc;
			case __MAP_PTR__: return map;
			/* VECTORS */
			case __VMAKE_PTR__: return makeVector;
			case __VREF_PTR__: return vectorRef;
			case __VSET_PTR__: return vectorSet;
			case __VLEN_PTR__: return vectorLength;
			case __VECTOR_PTR__: return vector;
			/* COMPARISONS */
			case __EQ_PTR__: return eq;
			case __EQUAL_PTR__: return equal;
			case __NBR_EQ_PTR__: return nbr_eq;
			case __SMA_PTR__: return sma;
			case __LRG_PTR__: return lrg;
			case __LEQ_PTR__: return leq;
			case __SEQ_PTR__: return seq;
			/* META */
			case __EVAL_PTR__: return _eval;
			case __APPLY_PTR__: return _apply;
			case __READ_PTR__: return read;
			case __LOAD_PTR__: return load;
			/* DISPLAY */
			case __DISP_PTR__: return display;
			case __NEWLINE_PTR__: return newline;
			/* TYPE CHECKS */
			case __IS_PAIR_PTR__: return isPair;
			case __IS_NULL_PTR__: return isNull;
			case __IS_SYMBOL_PTR__: return isSymbol;
			case __IS_VECTOR_PTR__: return isVector;
			case __IS_STRING_PTR__: return isString;
			/* STRINGS */
			case __STRING_GET_PTR__: return stringGet;
			case __STRING_SET_PTR__: return stringSet;
			case __STRING_LENGTH_PTR__: return stringLength;
			/* MEMORY */
			case __AVAIL_PTR__: return available;
			case __COLLECT_PTR__: return collect;
			/* TIMING */
			case __TIME_PTR__: return clock;
			case __SLEEP_PTR__: return sleep;
			/* RANDOM */
			case __RANDOM_PTR__: return random;
			/* JS FFI */
			case __JS_PTR__: return js_exec;
		}
	}

	/* --- ARITHMETIC --- */

	const __ADD_PTR__ = 0;

	function add() {

		regs.VAL = 0;
		while(regs.LEN--) {
			regs.EXP = car(regs.ARG);
			regs.ARG = cdr(regs.ARG);
			switch(ag.tag(regs.EXP)) {
				case __NUMBER_TAG__:
					regs.VAL += ag.numberVal(regs.EXP);
					break;
				case __FLOAT_TAG__:
					regs.VAL += ag.floatNumber(regs.EXP);
					return addFloats;
				default:
					regs.TXT = 'expected numerical type';
					return error;
			}			
		}

		regs.VAL = ag.makeNumber(regs.VAL);
		return regs.KON;
	}

	function addFloats() {

		while(regs.LEN--) {
			regs.EXP = car(regs.ARG);
			regs.ARG = cdr(regs.ARG);
			switch(ag.tag(regs.EXP)) {
				case __NUMBER_TAG__:
					regs.VAL += ag.numberVal(regs.EXP);
					break;
				case __FLOAT_TAG__:
					regs.VAL += ag.floatNumber(regs.EXP);
					break;
				default:
					regs.TXT = 'expected numerical type';
					return error;
			}			
		}

		claim();
		regs.VAL = ag.makeFloat(regs.VAL);
		return regs.KON;
	}

	const __SUB_PTR__ = 1;

	function sub() {

		if (regs.LEN === 0) {
			regs.TXT = 'insufficient arguments';
			return error;
		}

		/* UNARY => NEGATION */
		if (regs.LEN === 1) {
			regs.ARG = car(regs.ARG);
			switch(ag.tag(regs.ARG)) {
				case __NUMBER_TAG__:
					regs.VAL = ag.makeNumber(-ag.numberVal(regs.ARG));
					return regs.KON;
				case __FLOAT_TAG__:
					regs.VAL = ag.makeFloat(-ag.floatNumber(regs.ARG));
					return regs.KON;
				default:
					regs.TXT = 'expected numerical type';
					return error;
			}
		}

		/* N-ARY => SUBSTRACTION */
		regs.VAL = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);
		
		switch(ag.tag(regs.VAL)) {
			case __NUMBER_TAG__:
				regs.VAL = ag.numberVal(regs.VAL);
				break;
			case __FLOAT_TAG__:
				regs.VAL = ag.floatNumber(regs.VAL);
				return substractFloats;
			default:
				regs.TXT = 'expected numerical type';
				return error;
		}

		while(--regs.LEN) {
			regs.EXP = car(regs.ARG);
			regs.ARG = cdr(regs.ARG);
			switch (ag.tag(regs.EXP)) {
				case __NUMBER_TAG__:
					regs.VAL -= ag.numberVal(regs.EXP);
					break;
				case __FLOAT_TAG__:
					regs.VAL -= ag.floatNumber(regs.EXP);
					return substractFloats;
				default:
					regs.TXT = 'expected numerical type';
					return error;
			}
		}

		regs.VAL = ag.makeNumber(regs.VAL);
		return regs.KON;
	}

	function substractFloats() {

		while(--regs.LEN) {
			regs.EXP = car(regs.ARG);
			regs.ARG = cdr(regs.ARG);
			switch (ag.tag(regs.EXP)) {
				case __NUMBER_TAG__:
					regs.VAL -= ag.numberVal(regs.EXP);
					break;
				case __FLOAT_TAG__:
					regs.VAL -= ag.floatNumber(regs.EXP);
					break;
				default:
					regs.TXT = 'invalid argument type';
					return error;
			}
		}

		claim();
		regs.VAL = ag.makeFloat(regs.VAL);
		return regs.KON;
	}

	const __MUL_PTR__ = 2;

	function mul() {

		regs.VAL = 1;
		while(regs.LEN--) {
			regs.EXP = car(regs.ARG);
			regs.ARG = cdr(regs.ARG);
			switch (ag.tag(regs.EXP)) {
				case __NUMBER_TAG__:
					regs.VAL *= ag.numberVal(regs.EXP);
					break;
				case __FLOAT_TAG__:
					regs.VAL *= ag.floatNumber(regs.EXP);
					return multiplyFloats;
				default:
					regs.TXT = 'invalid argument type';
					return error;
			}
		}

		regs.VAL = ag.makeNumber(regs.VAL);
		return regs.KON;
	}

	function multiplyFloats() {

		while(regs.LEN--) {
			regs.EXP = car(regs.ARG);
			regs.ARG = cdr(regs.ARG);
			switch (ag.tag(regs.EXP)) {
				case __NUMBER_TAG__:
					regs.VAL *= ag.numberVal(regs.EXP);
					break;
				case __FLOAT_TAG__:
					regs.VAL *= ag.floatNumber(regs.EXP);
					break;
				default:
					regs.TXT = 'invalid argument type';
					return error;
			}
		}

		claim();
		regs.VAL = ag.makeFloat(regs.VAL);
		return regs.KON;
	}

	const __DIV_PTR__ = 3;

	function div() {

		if (regs.LEN === 0) {
			regs.TXT = 'insufficient arguments';
			return error;
		}

		/* UNARY => RECIPROCAL */
		if (regs.LEN === 1) {
			regs.ARG = car(regs.ARG);
			switch(ag.tag(regs.ARG)) {
				case __NUMBER_TAG__:
					regs.VAL = ag.makeFloat(1/ag.numberVal(regs.ARG));
					return regs.KON;
				case __FLOAT_TAG__:
					regs.VAL = ag.makeFloat(1/ag.floatNumber(regs.ARG));
					return regs.KON;
				default:
					regs.TXT = 'expected numerical type';
					return error;
			}
		}

		/* N-ARY */
		regs.VAL = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);

		switch(ag.tag(regs.VAL)) {
			case __NUMBER_TAG__:
				regs.VAL = ag.numberVal(regs.VAL);
				break;
			case __FLOAT_TAG__:
				regs.VAL = ag.floatNumber(regs.VAL);
				break;
			default:
				regs.TXT = 'expected numerical type';
				return error;
		}

		while(--regs.LEN) {
			regs.EXP = car(regs.ARG);
			regs.ARG = cdr(regs.ARG);
			switch (ag.tag(regs.EXP)) {
				case __NUMBER_TAG__:
					regs.VAL /= ag.numberVal(regs.EXP);
					break;
				case __FLOAT_TAG__:
					regs.VAL /= ag.floatNumber(regs.EXP);
					break;
				default:
					regs.TXT = 'invalid argument type';
					return error;
			}
		}

		claim();
		regs.VAL = ag.makeFloat(regs.VAL);
		return regs.KON;
	}

	/* --- PAIRS --- */

	const __CONS_PTR__ = 4;

	function mcons() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		claim();
		regs.VAL = ag.makePair(car(regs.ARG), car(cdr(regs.ARG)));
		return regs.KON;
	}

	const __CAR_PTR__ = 5;

	function mcar() {

		if (regs.LEN !== 1) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.ARG = car(regs.ARG);
		if (!ag.isPair(regs.ARG)) {
			regs.TXT = 'expected pair';
			return error;
		}

		regs.VAL = car(regs.ARG);
		return regs.KON;
	}

	const __CDR_PTR__ = 6;

	function mcdr() {

		if (regs.LEN !== 1) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.ARG = car(regs.ARG);
		if (!ag.isPair(regs.ARG)) {
			regs.TXT = 'expected pair';
			return error;
		}

		regs.VAL = cdr(regs.ARG);
		return regs.KON;
	}

	const __SET_CAR_PTR__ = 23;

	function scar() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.VAL = car(cdr(regs.ARG));
		regs.ARG = car(regs.ARG);

		if (!ag.isPair(regs.ARG)) {
			regs.TXT = 'expected pair';
			return error;
		}

		ag.pairSetCar(regs.ARG, regs.VAL);
		return regs.KON;
	}

	const __SET_CDR_PTR__ = 24;

	function scdr() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.VAL = car(cdr(regs.ARG));
		regs.ARG = car(regs.ARG);

		if (!ag.isPair(regs.ARG)) {
			regs.TXT = 'expected pair';
			return error;
		}

		ag.pairSetCdr(regs.ARG, regs.VAL);
		return regs.KON;
	}

	const __LIST_PTR__ = 7;

	function list() {

		regs.VAL = regs.ARG;
		return regs.KON;
	}

	/* --- COMPARISONS --- */

	const __NBR_EQ_PTR__ = 9;

	function nbr_eq() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.VAL = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);

		switch(ag.tag(regs.VAL)) {
			case __NUMBER_TAG__:
				regs.VAL = ag.numberVal(regs.VAL);
				break;
			case __FLOAT_TAG__:
				regs.VAL = ag.floatNumber(regs.VAL);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.ARG = car(regs.ARG);
		switch(ag.tag(regs.ARG)) {
			case __NUMBER_TAG__:
				regs.ARG = ag.numberVal(regs.ARG);
				break;
			case __FLOAT_TAG__:
				regs.ARG = ag.floatNumber(regs.ARG);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.VAL = (regs.VAL === regs.ARG ? ag.__TRUE__ : ag.__FALSE__);
		return regs.KON;
	}

	const __SMA_PTR__ = 10;

	function sma() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.VAL = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);

		switch(ag.tag(regs.VAL)) {
			case __NUMBER_TAG__:
				regs.VAL = ag.numberVal(regs.VAL);
				break;
			case __FLOAT_TAG__:
				regs.VAL = ag.floatNumber(regs.VAL);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.ARG = car(regs.ARG);
		switch(ag.tag(regs.ARG)) {
			case __NUMBER_TAG__:
				regs.ARG = ag.numberVal(regs.ARG);
				break;
			case __FLOAT_TAG__:
				regs.ARG = ag.floatNumber(regs.ARG);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.VAL = (regs.VAL < regs.ARG ? ag.__TRUE__ : ag.__FALSE__);
		return regs.KON;
	}

	const __LRG_PTR__ = 11;

	function lrg() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.VAL = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);

		switch(ag.tag(regs.VAL)) {
			case __NUMBER_TAG__:
				regs.VAL = ag.numberVal(regs.VAL);
				break;
			case __FLOAT_TAG__:
				regs.VAL = ag.floatNumber(regs.VAL);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.ARG = car(regs.ARG);
		switch(ag.tag(regs.ARG)) {
			case __NUMBER_TAG__:
				regs.ARG = ag.numberVal(regs.ARG);
				break;
			case __FLOAT_TAG__:
				regs.ARG = ag.floatNumber(regs.ARG);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.VAL = (regs.VAL > regs.ARG ? ag.__TRUE__ : ag.__FALSE__);
		return regs.KON;
	}

	const __SEQ_PTR__ = 12;

	function seq() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.VAL = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);

		switch(ag.tag(regs.VAL)) {
			case __NUMBER_TAG__:
				regs.VAL = ag.numberVal(regs.VAL);
				break;
			case __FLOAT_TAG__:
				regs.VAL = ag.floatNumber(regs.VAL);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.ARG = car(regs.ARG);
		switch(ag.tag(regs.ARG)) {
			case __NUMBER_TAG__:
				regs.ARG = ag.numberVal(regs.ARG);
				break;
			case __FLOAT_TAG__:
				regs.ARG = ag.floatNumber(regs.ARG);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.VAL = (regs.VAL <= regs.ARG ? ag.__TRUE__ : ag.__FALSE__);
		return regs.KON;
	}

	const __LEQ_PTR__ = 13;

	function leq() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.VAL = car(regs.ARG);
		regs.ARG = cdr(regs.ARG);

		switch(ag.tag(regs.VAL)) {
			case __NUMBER_TAG__:
				regs.VAL = ag.numberVal(regs.VAL);
				break;
			case __FLOAT_TAG__:
				regs.VAL = ag.floatNumber(regs.VAL);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.ARG = car(regs.ARG);
		switch(ag.tag(regs.ARG)) {
			case __NUMBER_TAG__:
				regs.ARG = ag.numberVal(regs.ARG);
				break;
			case __FLOAT_TAG__:
				regs.ARG = ag.floatNumber(regs.ARG);
				break;
			default:
				regs.TXT = 'expected numerical types';
				return error;
		}

		regs.VAL = (regs.VAL >= regs.ARG ? ag.__TRUE__ : ag.__FALSE__);
		return regs.KON;
	}

	/* --- ASSOC --- */

	const __ASSOC_PTR__ = 25;

	function assoc() {

		if (regs.LEN !== 2) {
			regs.TXT = 'assoc requires exactly two arguments';
			return error;
		}

		regs.VAL = car(regs.ARG);
		regs.LST = car(cdr(regs.ARG));

		while (ag.isPair(regs.LST)) {
			regs.BND = car(regs.LST);
			regs.PAT = car(regs.BND);
			if (regs.PAT === regs.VAL) {
				regs.VAL = regs.BND;
				return regs.KON;
			}
			regs.LST = cdr(regs.LST);
		}

		regs.VAL = ag.__FALSE__;
		return regs.KON;
	}

	/* --- MAP --- */
	// unary map, takes only two arguments

	const __MAP_PTR__ = 14;

	function map() {

		if (regs.LEN !== 2) {
			regs.TXT = 'map requires exactly two arguments';
			return error;
		}

		regs.LEN = 1;
		regs.VAL = car(regs.ARG);
		regs.LST = car(cdr(regs.ARG));

		if (ag.isNull(regs.LST)) {
			regs.VAL = ag.__NULL__;
			return regs.KON;
		}

		vm.claim();
		regs.ARG = ag.makePair(car(regs.LST), ag.__NULL__);
		regs.LST = cdr(regs.LST);
		stk.save(regs.KON);
		stk.save(0);

		if (ag.isNull(regs.LST)) {
			regs.KON = c1_map;
		} else {
			mem.push(regs.VAL);
			mem.push(regs.LST);
			regs.KON = c2_map;
		}

		return evaluator.apply;
	}

	function c1_map() {

		regs.LEN = stk.restore();
		claimSiz(8*regs.LEN);
		regs.VAL = ag.makePair(regs.VAL, ag.__NULL__);
		while(regs.LEN--)
				regs.VAL = ag.makePair(mem.pop(), regs.VAL);
		regs.KON = stk.restore();
		return regs.KON;
	}

	function c2_map() {

		regs.LST = mem.pop();
		regs.EXP = mem.peek();
		mem.poke(regs.VAL);

		regs.LEN = stk.peek();
		stk.poke(++regs.LEN);

		claim();
		regs.VAL = regs.EXP; //regs.PRC
		regs.ARG = ag.makePair(car(regs.LST), ag.__NULL__);
		regs.LST = cdr(regs.LST);
		regs.LEN = 1;

		if (ag.isNull(regs.LST)) {
			regs.KON = c1_map;
		} else {
			mem.push(regs.VAL);
			mem.push(regs.LST);
			regs.KON = c2_map;
		}

		return evaluator.apply;
	}

	/* --- META --- */

	const __EVAL_PTR__ = 15;

	function _eval() {

		if (regs.LEN !== 1) {
			regs.TXT = 'incorrect parameter count';
			return error;
		}

		regs.EXP = car(regs.ARG);
		stk.save(regs.KON);
		regs.KON = c_eval;
		return compiler.compile;
	}

	function c_eval() {

		regs.EXP = regs.VAL;
		regs.KON = stk.restore();
		return evaluator.eval;
	}

	const __APPLY_PTR__ = 16;

	function _apply() {

		if (regs.LEN !== 2) {
			regs.TXT = 'incorrect parameter count';
			return error;
		}

		regs.VAL = car(regs.ARG);
		regs.ARG = car(cdr(regs.ARG));
		regs.LST = regs.ARG;

		// check + calculate list length in regs.LEN
		for(regs.LEN = 0; ag.isPair(regs.LST); ++regs.LEN)
			regs.LST = cdr(regs.LST);
		if (!ag.isNull(regs.LST)) {
			regs.TXT = 'second argument must be a list';
			return error;
		}

		return evaluator.apply;
	}

	const __READ_PTR__ = 18;

	function read() {

		config.print(":: ");
		regs.TXT = config.readExpression(waitForInput);
		return false;
	}

	const __LOAD_PTR__ = 19;

	function onFileLoad(data) {

		reader.load(data);
		stk.save(regs.KON);
		regs.KON = c1_load;
		run(reader.read);
	}

	function fileLoadError(err) {
		regs.TXT = 'failed to load file';
		run(error);
	}

	function load() {

		if (regs.LEN !== 1) {
			regs.TXT = 'load requires exactly one argument';
			return error;
		}

		regs.ARG = car(regs.ARG);
		if (!ag.isString(regs.ARG)) {
			regs.TXT = 'filepath must be a string';
			return error;
		}

		regs.TXT = ag.stringText(regs.ARG);
		config.load(regs.TXT, onFileLoad, fileLoadError);
		return false;
	}

	function c1_load() {

		regs.EXP = regs.VAL;
		regs.KON = c2_load;
		return compiler.compile;
	}

	function c2_load() {

		regs.EXP = regs.VAL;
		regs.KON = stk.restore();
		return evaluator.eval;
	}

	/* --- DISPLAYS --- */

	const __DISP_PTR__ = 17;

	function display() {

		if (regs.LEN !== 1) {
			regs.TXT = 'display requires exactly one argument';
			return error;
		}
		regs.TXT = printExp(car(regs.ARG));
		config.printlog(regs.TXT);
		regs.VAL = ag.__VOID__;
		return regs.KON;
	}

	const __NEWLINE_PTR__ = 26;

	function newline() {

		config.printline('');
		regs.VAL = ag.__VOID__;
		return regs.KON;
	}

	/* --- VECTORS --- */

	const __VMAKE_PTR__ = 27;

	function makeVector() {

		if (!regs.LEN) {
			regs.TXT = 'insufficient arguments';
			return error;
		}

		regs.LST = cdr(regs.ARG);
		regs.ARG = car(regs.ARG);

		if (!ag.isNumber(regs.ARG)) {
			regs.TXT = 'vector length must be a number';
			return error;
		}

		regs.LEN = ag.numberVal(regs.ARG);
		if (regs.LEN < 0) {
			regs.TXT = 'vector length must be positive';
			return error;
		}

		claimSiz(regs.LEN);
		if (ag.isNull(regs.LST)) {
			regs.VAL = ag.makeVector(regs.LEN);
		} else {
			regs.VAL = car(regs.LST);
			regs.VAL = ag.makeVector(regs.LEN, regs.VAL);
		}

		return regs.KON;
	}

	const __VREF_PTR__ = 28;

	function vectorRef() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.EXP = car(cdr(regs.ARG));
		regs.ARG = car(regs.ARG);

		if (!(ag.isVector(regs.ARG) && ag.isNumber(regs.EXP))) {
			regs.TXT = 'invalid parameter types';
			return error;
		}

		regs.IDX = ag.numberVal(regs.EXP);
		if (0 <= regs.IDX && regs.IDX < ag.vectorLength(regs.ARG)) {
			regs.VAL = ag.vectorRef(regs.ARG, regs.IDX+1);
			return regs.KON;
		}

		regs.TXT = 'index out of bounds';
		return error;
	}

	const __VSET_PTR__ = 29;

	function vectorSet() {

		if (regs.LEN !== 3) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.LST = cdr(regs.ARG);
		regs.ARG = car(regs.ARG);
		regs.EXP = car(regs.LST);
		regs.VAL = car(cdr(regs.LST));

		if (!(ag.isVector(regs.ARG) && ag.isNumber(regs.EXP))) {
			regs.TXT = 'invalid parameter types';
			return error;
		}

		regs.IDX = ag.numberVal(regs.EXP);
		if (0 <= regs.IDX && regs.IDX < ag.vectorLength(regs.ARG)) {
			ag.vectorSet(regs.ARG, regs.IDX+1, regs.VAL);
			return regs.KON;
		}

		regs.TXT = 'index out of bounds';
		return error;
	}

	const __VLEN_PTR__ = 30;

	function vectorLength() {

		if (regs.LEN !== 1) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.ARG = car(regs.ARG);
		if (!ag.isVector(regs.ARG)) {
			regs.TXT = 'expected vector';
			return error;
		}

		regs.LEN = ag.vectorLength(regs.ARG);
		regs.VAL = ag.makeNumber(regs.LEN);
		return regs.KON;
	}

	const __VECTOR_PTR__ = 31;

	function vector() {

		regs.IDX = 0;
		claimSiz(regs.LEN);
		regs.VAL = ag.makeVector(regs.LEN);
		while (regs.IDX < regs.LEN) {
			ag.vectorSet(regs.VAL, ++regs.IDX, car(regs.ARG));
			regs.ARG = cdr(regs.ARG);
		}

		return regs.KON;
	}

	/* --- EQUALITY --- */

	const __EQ_PTR__ = 8;

	function eq() {

		if (regs.LEN != 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.VAL = (car(regs.ARG) === car(cdr(regs.ARG)) ?
					 ag.__TRUE__ : ag.__FALSE__);
		return regs.KON;
	}

	const __EQUAL_PTR__ = 39;

	function equal() {

		if (regs.LEN != 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.EXP = car(regs.ARG);
		regs.ARG = car(cdr(regs.ARG));
		return compare;
	}

	function compare() {

		//different types => #f
		regs.TAG = ag.tag(regs.EXP);
		if(regs.TAG !== ag.tag(regs.ARG)) {
			regs.VAL = ag.__FALSE__;
			return regs.KON;
		}

		switch(regs.TAG) {
			case __FLOAT_TAG__: return compareFloat;
			case __STRING_TAG__: return compareString;
			case __PAIR_TAG__: return comparePair;
			case __VECTOR_TAG__: return compareVector;
			default:
				regs.VAL = (regs.ARG === regs.EXP ? ag.__TRUE__ : ag.__FALSE__);
				return regs.KON;
		}
	}

	function compareFloat() {

		regs.ARG = ag.floatNumber(regs.ARG);
		regs.EXP = ag.floatNumber(regs.EXP);
		regs.VAL = (regs.ARG === regs.EXP ? ag.__TRUE__ : ag.__FALSE__);
		return regs.KON;
	}

	function compareString() {

		regs.LEN = ag.stringLength(regs.ARG);
		if(ag.stringLength(regs.EXP) !== regs.LEN) {
			regs.VAL = ag.__FALSE__;
			return regs.KON;
		}

		while(regs.LEN--) {
			if(ag.stringAt(regs.ARG, regs.LEN) !== ag.stringAt(regs.EXP, regs.LEN)) {
				regs.VAL = ag.__FALSE__;
				return regs.KON;
			}
		}

		regs.VAL = ag.__TRUE__;
		return regs.KON;
	}

	function comparePair() {

		mem.push(cdr(regs.EXP));
		mem.push(cdr(regs.ARG));
		regs.EXP = car(regs.EXP);
		regs.ARG = car(regs.ARG);

		stk.save(regs.KON);
		regs.KON = c_comparePair;
		return compare;
	}

	function c_comparePair() {

		regs.KON = stk.restore();

		if (regs.VAL === ag.__FALSE__) {
			mem.zap(); //zap cdr(ARG)
			mem.zap(); //zap cdr(EXP)
			return regs.KON;
		}

		regs.ARG = mem.pop();
		regs.EXP = mem.pop();
		return compare;
	}

	function compareVector() {

		regs.LEN = ag.vectorLength(regs.ARG);
		if(ag.vectorLength(regs.EXP) !== regs.LEN) {
			regs.VAL = ag.__FALSE__;
			return regs.KON;
		}

		if(regs.LEN === 0) {
			regs.VAL = ag.__TRUE__;
			return regs.KON;
		}

		if(regs.LEN > 1) {
			mem.push(regs.EXP);
			mem.push(regs.ARG);
			stk.save(regs.KON);
			stk.save(2);
			regs.KON = c_compareVector;
		}

		regs.ARG = ag.vectorRef(regs.ARG, 1);
		regs.EXP = ag.vectorRef(regs.EXP, 1);
		return compare;
	}

	function c_compareVector() {

		if (regs.VAL === ag.__FALSE__) {
			mem.zap(); //zap vector ARG
			mem.zap(); //zap vector EXP
			stk.zap(); //discard count
			regs.KON = stk.restore();
			return regs.KON;
		}

		regs.ARG = mem.pop();
		regs.EXP = mem.peek();
		regs.IDX = stk.peek();

		if(regs.IDX === ag.vectorLength(regs.ARG)) {
			mem.zap(); //zap vector EXP
			stk.zap(); //discard count
			regs.KON = stk.restore();
		} else {
			stk.poke(regs.IDX+1);
			mem.push(regs.ARG);
			regs.KON = c_compareVector;
		}

		regs.ARG = ag.vectorRef(regs.ARG, regs.IDX);
		regs.EXP = ag.vectorRef(regs.EXP, regs.IDX);
		return compare;
	}

	/* --- TYPE CHECKS --- */

	function makeTypeCheck(tag) {

		return function() {

			if (regs.LEN !== 1) {
				regs.TXT = 'invalid argument count';
				return error;
			}
			regs.TAG = ag.tag(car(regs.ARG));
			regs.VAL = (regs.TAG === tag ? ag.__TRUE__ : ag.__FALSE__);
			return regs.KON;
		}
	}

	const __IS_PAIR_PTR__ = 20;
	const isPair = makeTypeCheck(ag.__PAIR_TAG__);

	const __IS_NULL_PTR__ = 21;
	const isNull = makeTypeCheck(ag.__NULL_TAG__);

	const __IS_SYMBOL_PTR__ = 22;
	const isSymbol = makeTypeCheck(ag.__SYMBOL_TAG__);

	const __IS_VECTOR_PTR__ = 32;
	const isVector = makeTypeCheck(ag.__VECTOR_TAG__);

	const __IS_STRING_PTR__ = 35;
	const isString = makeTypeCheck(ag.__STRING_TAG__);

	/* --- STRINGS --- */

	const __STRING_GET_PTR__ = 36;

	function stringGet() {

		if (regs.LEN !== 2) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.EXP = car(cdr(regs.ARG));
		regs.ARG = car(regs.ARG);

		if (!(ag.isString(regs.ARG) && ag.isNumber(regs.EXP))) {
			regs.TXT = 'invalid parameter types';
			return error;
		}

		regs.IDX = ag.numberVal(regs.EXP);
		if (0 <= regs.IDX && regs.IDX < ag.stringLength(regs.ARG)) {
			regs.VAL = ag.makeChar(ag.stringAt(regs.ARG, regs.IDX));
			return regs.KON;
		}

		regs.TXT = 'index out of bounds';
		return error;
	}

	const __STRING_SET_PTR__ = 37;

	function stringSet() {

		if (regs.LEN !== 3) {
			regs.TXT = 'invalid parameter count';
			return error;
		}

		regs.LST = cdr(regs.ARG);
		regs.ARG = car(regs.ARG);
		regs.EXP = car(regs.LST);
		regs.VAL = car(cdr(regs.LST));

		if (!(ag.isString(regs.ARG) && ag.isNumber(regs.EXP) && ag.isChar(regs.VAL))) {
			regs.TXT = 'invalid parameter types';
			return error;
		}

		regs.IDX = ag.numberVal(regs.EXP);
		if (0 <= regs.IDX && regs.IDX < ag.stringLength(regs.ARG)) {
			regs.VAL = ag.charCode(regs.VAL);
			ag.stringSet(regs.ARG, regs.IDX, regs.VAL);
			return regs.KON;
		}

		regs.TXT = 'index out of bounds';
		return error;
	}

	const __STRING_LENGTH_PTR__ = 38;

	function stringLength() {

		if (regs.LEN !== 1) {
			regs.TXT = 'expected single argument';
			return error;
		}

		regs.ARG = car(regs.ARG);
		if(!ag.isString(regs.ARG)) {
			regs.TXT = 'invalid parameter type';
			return error;
		}

		regs.VAL = ag.makeNumber(ag.stringLength(regs.ARG));
		return regs.KON;
	}

	/* --- MEMORY --- */

	const __COLLECT_PTR__ = 33;

	function collect() {

		regs.NBR = mem.available();
		
		claim();
		if(regs.NBR === mem.available())
			vm.reclaim();

		regs.NBR = mem.available();
		regs.VAL = ag.makeNumber(regs.NBR);
		return regs.KON;
	}

	const __AVAIL_PTR__ = 34;

	function available() {

		regs.VAL = ag.makeNumber(mem.available());
		return regs.KON;
	}

	const __JS_PTR__ = 40;

	/* --- JS FFI --- */

	function js_exec() {

		if (regs.LEN !== 1) {
			regs.TXT = 'expected exactly one argument';
			return error;
		}

		regs.ARG = car(regs.ARG);
		if (!ag.isString(regs.ARG)) {
			regs.TXT = 'expected string';
			return error;
		}

		eval(ag.stringText(regs.ARG));
		regs.VAL = ag.__VOID__;
		return regs.KON;
	}

	/* --- TIMING --- */

	const __TIME_PTR__ = 41;

	function clock() {

		if(regs.LEN !== 0) {
			regs.TXT = 'invalid argument count';
			return error;
		}

		claim();
		regs.VAL = new Date().getTime();
		regs.VAL = ag.makeNumber(regs.VAL - __START__);
		return regs.KON;
	}

	const __SLEEP_PTR__ = 42;

	function sleep() {

		if(regs.LEN !== 1) {
			regs.TXT = 'argument count mismatch';
			return error;
		}

		regs.ARG = car(regs.ARG);
		regs.TAG = ag.tag(regs.ARG);
		switch(regs.TAG) {
			case __NUMBER_TAG__:
				regs.VAL = ag.numberVal(regs.ARG);
				break;
			case __FLOAT_TAG__:
				regs.VAL = ag.floatNumber(regs.ARG);
				break;
			default:
				regs.TXT = 'expected numerical type';
				return error;
		}

		setTimeout(c_sleep, regs.VAL);
		return false;
	}

	function c_sleep() {

		regs.VAL = ag.__VOID__;
		run(regs.KON);
	}

	/* --- RANDOM --- */

	const __RANDOM_PTR__ = 43;

	function random() {

		if (regs.LEN !== 0) {
			regs.TXT = 'invalid argument count';
			return error;
		}

		regs.VAL = ag.makeFloat(Math.random());
		return regs.KON;
	}

	/* --- INITIALISATION --- */

	function init() {

		function addNative(nam, ptr) {
			regs.VAL = ag.makeNative(ptr);
			regs.PAT = pool.enterPool(nam);
			regs.BND = ag.makePair(regs.PAT, regs.VAL);
			regs.FRM = ag.makePair(regs.BND, regs.FRM);
		}

		addNative('eval/js', __JS_PTR__);
		addNative('random', __RANDOM_PTR__);
		addNative('clock', __TIME_PTR__);
		addNative('sleep', __SLEEP_PTR__);
		addNative('string-length', __STRING_LENGTH_PTR__);
		addNative('string-ref', __STRING_GET_PTR__);
		addNative('string-set!', __STRING_SET_PTR__);
		addNative('collect', __COLLECT_PTR__);
		addNative('available', __AVAIL_PTR__);
		addNative('load', __LOAD_PTR__);
		addNative('equal?', __EQUAL_PTR__);
		addNative('eq?', __EQ_PTR__);
		addNative('map', __MAP_PTR__);
		addNative('assoc', __ASSOC_PTR__);
		addNative('eval', __EVAL_PTR__);
		addNative('apply', __APPLY_PTR__);
		addNative('display', __DISP_PTR__);
		addNative('newline', __NEWLINE_PTR__);
		addNative('read', __READ_PTR__);
		addNative('null?', __IS_NULL_PTR__);
		addNative('string?', __IS_STRING_PTR__);
		addNative('pair?', __IS_PAIR_PTR__);
		addNative('symbol?', __IS_SYMBOL_PTR__);
		addNative('vector?', __IS_VECTOR_PTR__);
		addNative('make-vector', __VMAKE_PTR__);
		addNative('vector-ref', __VREF_PTR__);
		addNative('vector-set!', __VSET_PTR__);
		addNative('vector-length', __VLEN_PTR__);
		addNative('vector', __VECTOR_PTR__);
		addNative('set-car!', __SET_CAR_PTR__);
		addNative('set-cdr!', __SET_CDR_PTR__);
		addNative('=', __NBR_EQ_PTR__);
		addNative('<', __SMA_PTR__);
		addNative('<=', __SEQ_PTR__);
		addNative('>', __LRG_PTR__);
		addNative('>=', __LEQ_PTR__);
		addNative('cons', __CONS_PTR__);
		addNative('car', __CAR_PTR__);
		addNative('cdr', __CDR_PTR__);
		addNative('list', __LIST_PTR__);
		addNative('+', __ADD_PTR__);
		addNative('-', __SUB_PTR__);
		addNative('*', __MUL_PTR__);
		addNative('/', __DIV_PTR__);
	}

	init();

	return {
		native: native
	}
}