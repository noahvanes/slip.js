/* ---- IMPORTS ---- */

var VM = require('./vm.js');
var regs = VM.regs;

/* ---- THE STACK ---- */

var stk = {
	save: function(el) { regs.STK[regs.STP++] = el; },
	restore: function() { return regs.STK[--regs.STP]; }
}

/* ---- THE TRAMPOLINE ---- */

function startTrampoline(fun) {
	while(fun = fun());
}

/* ---- EXPORTS ---- */

exports.stk = stk;
exports.startTrampoline = startTrampoline;