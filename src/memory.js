/** MEMORY ALLOCATION
 * stdlib: standard library (eg.: window)
 * foreign: foreign imports form plain JS
 * heap: arrayBuffer for storage
 */
function MEMORY(stdlib, foreign, heap) {
	"use asm";

	/* -- IMPORTS & VARIABLES -- */

	var MEM8 = new stdlib.Uint8Array(heap);
	var MEM32 = new stdlib.Uint32Array(heap);
	var FLT32 = new stdlib.Float32Array(heap);
	var fround = stdlib.Math.fround;
	var STKTOP = foreign.heapSize|0;
	var MEMSIZ = foreign.heapSize|0;
	var MEMTOP = 0;

	/* -- FUNCTIONS -- */

	/* MEMORY MANAGEMENT & GARBAGE COLLECTION */

	function available() {
		return (STKTOP - MEMTOP)|0;
	}

	function collectGarbage() {
		STKTOP = (STKTOP - 4)|0;
		MEM32[STKTOP >> 2] = makeBusy(STKTOP)|0;
		mark((MEMSIZ - 4)|0);
		update();
		crunch();
		zap();
	}

	function mark(pos) {
		pos = pos|0;
		var cel = 0;
		var ptr = 0;
		var len = 0;
		for(;;) {
			cel = MEM32[pos >> 2]|0;
			switch(cel & 0x3) { //last 2 bits
				case 0x0: //bp
					ptr = cel;
					cel = MEM32[ptr >> 2]|0;
					switch (cel & 0x7) { //last 3 bits
						case 0x0: //rbp
							MEM32[ptr >> 2] = makeBusy(pos)|0;
							MEM32[pos >> 2] = cel;
							len = headerSize(cel)|0;
							pos = (len ? (ptr + (len<<2))|0 : (pos - 4)|0);
							continue;
						case 0x2: //rBp
						case 0x6: //RBp
							ptr = makeFree(cel)|0;
							cel = MEM32[ptr >> 2]|0;
						case 0x4: //Rbp
							MEM32[ptr >> 2] = makeBusy(pos)|0;
							MEM32[pos >> 2] = cel;
							pos = (pos - 4)|0;
					}
					continue; 
				case 0x2: //Bp
					pos = makeFree(cel)|0;
					if((pos|0) == (STKTOP|0))
						return;
				case 0x1: //bP
				case 0x3: //BP
					pos = (pos - 4)|0;
			}
		}
	}

	function update() {
		var src = 0;
		var dst = 0;
		var cel = 0;
		var ptr = 0;
		var len = 0;
		var siz = 0;
		var cur = 0;
		while((src|0) < (MEMTOP|0)) {
			cel = MEM32[src >> 2]|0;
			if(cel & 0x2) { //marked chunk
				do {				
					ptr = cel;
					cel = MEM32[ptr >> 2]|0;
					MEM32[ptr >> 2] = dst;
				} while(cel & 0x2);
				MEM32[src >> 2] = makeBusy(cel)|0;
				len = ((headerSize(cel)|0)+1) << 2;				
				src = (src + len)|0;
				dst = (dst + len)|0;
			} else { //unmarked chunk
				siz = ((headerSize(cel)|0)+1) << 2;
				for(cur = (src+siz)|0; 
					(cur|0) < (MEMTOP|0);
					cur = (cur+len)|0, siz = (siz+len)|0) {
					cel = MEM32[cur >> 2]|0;
					if(cel & 0x2) break; //busy
					len = ((headerSize(cel)|0)+1) << 2;
					if(((siz+len)|0) > 0x3FFFFFC) break; //size overflow
				}
				MEM32[src >> 2] = makeHeader(0,((siz>>2)-1)|0)|0;
				src = (src + siz)|0;
			}
		}
	}

	function crunch() {
		var src = 0;
		var dst = 0;
		var len = 0;
		var cel = 0;
		while((src|0) < (MEMTOP|0)) {
			cel = MEM32[src>>2]|0;
			len = headerSize(cel)|0;
			if(cel & 0x2) { //busy
				MEM32[dst>>2] = makeFree(cel)|0;
				src=(src+4)|0;
				dst=(dst+4)|0;
				for(;(len|0)>0;len=(len-1)|0) {
					MEM32[dst>>2] = MEM32[src>>2];
					src=(src+4)|0;					
					dst=(dst+4)|0;
				}
			} else {
				len = (len + 1) << 2;
				src = (src + len)|0;
			}
		}
		MEMTOP = dst;
	}


	/* CELLS */

	function makeHeader(tag, siz) {
		tag = tag|0;
		siz = siz|0;
		var hdr = 0;
		hdr = (siz << 6)|tag;
		return (hdr << 2)|0; 
	}

	function headerSize(hdr) {
		hdr = hdr|0;
		return (hdr >>> 8)|0;
	}

	function makeFree(ofs) {
		ofs = ofs|0;
		return (ofs & 0xFFFFFFFD)|0;
	}

	function makeBusy(ofs) {
		ofs = ofs|0;
		return (ofs | 0x2)|0;
	}

	function makeAtom(val) {
		val = val|0;
		return ((val<<1)|0x1)|0; 
	}

	/* IMMEDIATES */

	function isImmediate(exp) {
		exp = exp|0;
		return (exp & 0x1)|0;
	}

	function immediateVal(exp) {
		exp = exp|0;
		return (exp >> 1)|0;
	}

	/* CHUNKS */

	function makeChunk(tag, siz) {
		tag = tag|0;
		siz = siz|0;
		var adr = 0;
		adr = MEMTOP;
		MEMTOP = (MEMTOP + ((siz+1) << 2))|0;
		MEM32[adr >> 2] = makeHeader(tag, siz)|0;
		return adr|0;
	}
	
	function chunkTag(ptr) {
		ptr = ptr|0;
		var hdr = 0;
		hdr = MEM32[ptr >> 2]|0;
		return ((hdr >>> 2) & 0x3F)|0;
	}

	function chunkSize(ptr) {
		ptr = ptr|0;
		var hdr = 0;
		hdr = MEM32[ptr >> 2]|0;
		return headerSize(hdr)|0;
	}

	function chunkGet(ptr, idx) {
		ptr = ptr|0;
		idx = idx|0;
		return MEM32[(ptr + idx) >> 2]|0;
	}

	function chunkGetByte(ptr, idx) {
		ptr = ptr|0;
		idx = idx|0;
		return MEM8[(ptr + idx)|0]|0;
	}
	
	function chunkGetFloat(ptr, idx) {
		ptr = ptr|0;
		idx = idx|0;
		return fround(FLT32[(ptr + idx) >> 2]);
	}

	function chunkSet(ptr, idx, val) {
		ptr = ptr|0;
		idx = idx|0;
		val = val|0;
		MEM32[(ptr + idx) >> 2] = val|0;
	}	

	function chunkSetByte(ptr, idx, byt) {
		ptr = ptr|0;
		idx = idx|0;
		byt = byt|0;
		MEM8[(ptr + idx)|0] = byt;
	}

	function chunkSetFloat(ptr, idx, flt) {
		ptr = ptr|0;
		idx = idx|0;
		flt = fround(flt);
		FLT32[(ptr + idx) >> 2] = flt;
	}

	/* STACK */

	function push(el) {
		el = el|0;
		STKTOP = (STKTOP - 4)|0;
		MEM32[STKTOP >> 2] = el;
	}

	function pop() {
		var tmp = 0;
		tmp = MEM32[STKTOP >> 2]|0;
		STKTOP = (STKTOP + 4)|0;
		return tmp|0;
	}

	function peek() {
		return MEM32[STKTOP >> 2]|0;
	}

	function poke(el) {
		el = el|0;
		MEM32[STKTOP >> 2] = el;
	}

	function zap() {
		STKTOP = (STKTOP + 4)|0;
	}

	function emptyStk() {
		STKTOP = MEMSIZ;
	}

	/* -- EXPORTS -- */
	return { 
		available: available,
		collectGarbage: collectGarbage,
		makeImmediate: makeAtom,
		isImmediate: isImmediate,
		immediateVal: immediateVal,
		makeChunk: makeChunk,
		chunkGet: chunkGet,
		chunkGetByte: chunkGetByte,
		chunkGetFloat: chunkGetFloat,
		chunkSet: chunkSet,
		chunkSetByte: chunkSetByte,
		chunkSetFloat: chunkSetFloat,
		chunkSize: chunkSize,
		chunkTag: chunkTag,
		emptyStk: emptyStk,
		push: push,
		peek: peek,
		poke: poke,
		pop: pop,
		zap: zap
	};
}