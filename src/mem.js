/* ---- MEMORY MANAGEMENT ---- */

var __MEM__;
var __MEM_SIZ__;
var __MEM_TOP__;
var __STK_TOP__;

function memoryInit(size) {

	__MEM_SIZ__ = size;
	__MEM__ = new Array(__MEM_SIZ__);
	__MEM_TOP__ = 0;
	__STK_TOP__ = size - 1;
}

function available() {
	return (__STK_TOP__ - __MEM_TOP__);
}

function collectGarbage() {
	__MEM__[__STK_TOP__] = makeBusyPointer(__STK_TOP__);
	mark(__MEM_SIZ__ - 1);
	update();
	crunch();
}

function mark(pos) {

	var ptr, cel, tmp, len;

	while(true) {

		cel = __MEM__[pos];

		//atom
		if(cel.ptr)
			--pos;

		//backtrack 
		else if (cel.bsy) {
			if ((pos = cel.ofs) === __STK_TOP__)
				return;
			--pos;
		}

		//pointer
		else { 
			ptr = cel.ofs;
			tmp = __MEM__[ptr];
			//real unvisited chunk
			if(!(tmp.raw || tmp.bsy)) {
				__MEM__[ptr] = makeBusyPointer(pos);
				__MEM__[pos] = tmp;
				len = tmp.siz;
				if (len)
					pos = ptr + len;
				else
					--pos;
				continue;
			} 
			//visited chunk
			if(tmp.bsy) {
				ptr = tmp.ofs;
				tmp = __MEM__[ptr];
			}
			//pointer inversion
			__MEM__[ptr] = makeBusyPointer(pos);
			__MEM__[pos] = tmp;
			--pos;
		}
	}
}

function update() {

	var src, dst, len, cel, ptr, inc, cur;

	for(src = dst = 0;
		src < __MEM_TOP__;
		src += len) {

		cel = __MEM__[src];

		//marked chunk
		if(cel.bsy) {
			dst = makePointer(dst);
			do {
				ptr = cel.ofs;
				cel = __MEM__[ptr];
				__MEM__[ptr] = dst;
			} while(cel.bsy);
			__MEM__[src] = makeBusy(cel);
			len = cel.siz + 1;
			dst = dst.ofs + len;
			
		//unmarked chunk
		} else {
			for(len = cel.siz + 1, cur = src + len;
				cur < __MEM_TOP__;
				cur += inc, len += inc) {
					//TODO: check size overflow
					cel = __MEM__[cur];
					if(cel.bsy) break; 
					inc = cel.siz + 1;
				}
			__MEM__[src] = makeHeader(len-1, 0, 0);
		}
	}
}

function crunch() {

	var src = 0, dst = 0, len, cel;

	while(src < __MEM_TOP__) {

		cel = __MEM__[src++];
		len = cel.siz; 

		if (cel.bsy) {
			__MEM__[dst++] = makeFree(cel);
			while(len--) //copy chunk 
				__MEM__[dst++] = __MEM__[src++];
		} else
			src += len;
	}
	
	__MEM_TOP__ = dst;
}

/* ---- CELLS ---- */

function makePointer(ofs) {
	return { ptr: 0, bsy: 0, ofs: ofs };
}

function makeBusyPointer(ofs) {
	return { ptr: 0, bsy: 1, ofs: ofs };
}

function makeHeader(siz, tag, raw) {
	return { ptr: 0, bsy: 0, raw: raw, tag: tag, siz: siz };
}

function makeBusy(hdr) {
	hdr.bsy = 1;
	return hdr;
}

function makeFree(hdr) {
	hdr.bsy = 0;
	return hdr;
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

/* ---- MEMORY CHUNKS ---- */

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

function chunkEq(a, b) {
	return (a.ofs === b.ofs);
}

/* ---- MEMORY STACK ---- */

function push(el) {
	__MEM__[__STK_TOP__--] = el;
}

function peek() {
	return __MEM__[__STK_TOP__+1];
}

function pop() {
	return __MEM__[++__STK_TOP__];
}

function poke(el) {
	__MEM__[__STK_TOP__+1] = el;
}

function zap() {
	++__STK_TOP__;
}

/* ---- EXPORTS ----- */

memoryInit();

/* IMMEDATES */
exports.makeImmediate = makeImmediate;
exports.isImmediate = isImmediate;
exports.immediateVal = immediateVal;
/* CHUNKS/POINTERS */
exports.makeChunk = makeChunk;
exports.chunkSet = chunkSet;
exports.chunkGet = chunkGet;
exports.chunkTag = chunkTag;
exports.chunkSize = chunkSize;
exports.chunkEq = chunkEq;
exports.available = available;
exports.memoryInit = memoryInit;
exports.collectGarbage = collectGarbage;
/* STACK */
exports.push = push;
exports.peek = peek;
exports.poke = poke;
exports.pop = pop;
exports.zap = zap;
/* DEBUG */
exports.memprint = function() { console.log(__MEM__) }