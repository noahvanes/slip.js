/* NATIVE JS STACK */

/* 
  NOTES:
	- maybe define with array instead of using push
	- other stack in scheme memory is also available
*/

/* for now, this looks more performant than writing a full implementation with arrays yourself... */

var __STK_SIZ__ = 32;
var __STK_TOP__ = __STK_SIZ__;
var __STK__ = new Array(__STK_SIZ__);

function push(el) {

	if (!__STK_TOP__) {

		var old = __STK__;
		__STK_TOP__ = __STK_SIZ__;
		var idx = __STK_SIZ__ *= 2;
		__STK__ = new Array(__STK_SIZ__);
		while (idx-- > __STK_TOP__)
			__STK__[idx] = old[idx-__STK_TOP__];
	}

	__STK__[--__STK_TOP__] = el;
}

function pop() {
	return __STK__[__STK_TOP__++];
}

function peek() {
	return __STK__[__STK_TOP__];
}

function poke(el) {
	__STK__[__STK_TOP__] = el;
}

function zap() {
	++__STK_TOP__;
}

function empty() {
	__STK_TOP__ = __STK_SIZ__;
}

exports.save = push;
exports.restore = pop;
exports.zap = zap;
exports.peek = peek;
exports.poke = poke;
exports.empty = empty;