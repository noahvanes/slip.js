/* IMPORTS */

const ag = require('./ag.js');

/* STACK */

var __STK_SIZ__ = 64;
var __STK_VEC__ = ag.makeVector(__STK_SIZ__);
var __STK_TOP__ = 1;
var __STK_MUL__ = 2;

/* STK PUSH */

function push(exp) {


	if (__STK_TOP__ > __STK_SIZ__) {

		var idx, exp, newStack;
		__STK_SIZ__ *= __STK_MUL__;
		newStack = ag.makeVector(__STK_SIZ__);
		for(idx = 1; idx < __STK_TOP__; ++idx) {
			exp = ag.vectorRef(__STK_VEC__, idx);
			ag.vectorSet(newStack, idx, exp);
		}
		__STK_VEC__ = newStack;
	}

	ag.vectorSet(__STK_VEC__, __STK_TOP__++, exp);
}

function pop() {

	return ag.vectorRef(__STK_VEC__, --__STK_TOP__);
}

function peek() {
	return ag.vectorRef(__STK_VEC__, __STK_TOP__-1);
}

function zap() {
	--__STK_TOP__;
}

exports.save = push;
exports.restore = pop;
exports.peek = peek;
exports.zap = zap;