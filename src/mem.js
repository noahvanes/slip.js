/* ---- MEMORY MANAGEMENT ---- */

var __MEM__;
var __MEM_TOP__;
var __MEM_SIZ__;

function memoryInit(size) {

	__MEM_SIZ__ = size;
	__MEM__ = new Array(__MEM_SIZ__);
	__MEM_TOP__ = 0;
}

function available() {
	return (__MEM_SIZ__ - __MEM_TOP__);
}

function collectGarbage() {
	//NYI
}

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

	var adr = __MEM_TOP__;		//allocate memory
	__MEM_TOP__ += siz + 1;		//move top pointer
	__MEM__[adr] = makeHeader(siz, tag, raw);
	return makePointer(adr);	//return pointer	
}

function chunkSet(ptr, idx, val) {
	__MEM__[ptr.ofs + idx] = val; 
}

function chunkGet(ptr, idx) {
	return __MEM__[ptr.ofs + idx];
}

function chunkTag(ptr) {
	return __MEM__[ptr.ofs].tag;
}

function chunkSize(ptr) {
	return __MEM__[ptr.ofs].siz;
}

/* ---- EXPORTS ----- */
memoryInit();

exports.makeImmediate = makeImmediate;
exports.isImmediate = isImmediate;
exports.immediateVal = immediateVal;
exports.makeChunk = makeChunk;
exports.chunkSet = chunkSet;
exports.chunkGet = chunkGet;
exports.chunkTag = chunkTag;
exports.chunkSize = chunkSize;
exports.available = available;
exports.memoryInit = memoryInit;
exports.collectGarbage = collectGarbage;