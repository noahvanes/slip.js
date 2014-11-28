/* ---- VM ARCHITECTURE ---- */

var __STACK_SIZ__ = 1024;
var __HEAP_SIZ__ = 1024;

var regs = {
	ADR: null,
	ARG: null,
	BND: null,
	ENV: null,
	EXP: null,
	FRM: null,
	GLB: null,
	IDX: null,
	KON: null,
	LEN: null,
	LST: null,
	PAR: null,
	PAT: null,
	PRC: null,
	SEQ: null,
	STK: null,
	STP: 0,
	STO: null,
	TOP: 0,
	VAL: null
}

regs.STK = new Array(__STACK_SIZ__);
regs.STO = new Array(__HEAP_SIZ__);

exports.regs = regs;