/* IMPORTS */
const ag = require('./ag.js');

/* VM ARCHITECTURE */
const init = ag.__NULL__;

var regs = {
	ADR: init,
	ARG: init,
	BND: init,
	DCT: init,
	ENV: init,
	EXP: init,
	FRM: init,
	GLB: init,
	IDX: init,
	KON: init,
	LEN: init,
	LST: init,
	PAR: init,
	PAT: init,
	PRC: init,
	SEQ: init,
	TAG: init,
	TXT: init,
	VAL: init
}

/* Trampoline for TCO */
function startTrampoline(fun) {
	while(fun = fun());
}

exports.regs = regs;
exports.run = startTrampoline;