/* ---- IMPORTS ---- */

var VM = require('./vm.js');
var regs = VM.regs;

/* ---- CELLS ---- */

function makePointer(ofs) {
	return { ptr: 0, bsy: 0, ofs: ofs };
}

function makeHeader(siz, tag, raw) {
	return { ptr: 0, bsy: 0, raw: raw, tag: tag, siz: siz };
}

function makeAtom(val) {
	return { ptr: 1, val: val }; 
}

/* ---- IMMEDIATES ---- */

const makeImmediate = makeAtom;

function isImmediate(exp) {
	return (exp.ptr === 1);
}

function immediateVal(exp) {
	return exp.val;
}

/* ---- POINTERS/CHUNKS ---- */

function makeChunk(raw, tag, siz) {

	var adr = regs.TOP;			//allocate memory
	regs.TOP += siz + 1;		//move top pointer
	regs.STO[adr] = makeHeader(siz, tag, raw);
	return makePointer(adr);	//return pointer	
}

function chunkSet(ptr, idx, val) {
	regs.STO[ptr.ofs + idx] = val; 
}

function chunkGet(ptr, idx) {
	return regs.STO[ptr.ofs + idx];
}

function chunkTag(ptr) {
	return regs.STO[ptr.ofs].tag;
}

function chunkSize(ptr) {
	return regs.STO[ptr.ofs].siz;
}

/* ---- GARBAGE COLLECTION ---- */

function available() {
	return (regs.STO.length - regs.TOP);
}

function collectGarbage() {
	//NYI
}

/* ---- EXPORTS ----- */
exports.makeImmediate = makeImmediate;
exports.isImmediate = isImmediate;
exports.immediateVal = immediateVal;
exports.makeChunk = makeChunk;
exports.chunkSet = chunkSet;
exports.chunkGet = chunkGet;
exports.chunkTag = chunkTag;
exports.chunkSize = chunkSize;
exports.available = available;
exports.collectGarbage = collectGarbage;