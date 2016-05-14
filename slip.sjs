function SLIP(callbacks, size) {
	"use strict";

	define __GLOBAL_SIZ__ 256

	/* -- POINTER STRUCTURES -- */
	define __PAI_TAG__ 0x00
	define __VCT_TAG__ 0x02
	define __PRC_TAG__ 0x04
	define __SEQ_TAG__ 0x06
	define __IFS_TAG__ 0x08
	define __IFF_TAG__ 0x0A
	define __DFV_TAG__ 0x0C
	define __DFF_TAG__ 0x0E
	define __SLC_TAG__ 0x10
	define __LMB_TAG__ 0x12
	define __SGL_TAG__ 0x14
	define __QUO_TAG__ 0x16
	define __CNT_TAG__ 0x18
	define __FRM_TAG__ 0x1A
	define __ENV_TAG__ 0x1C
	define __DFZ_TAG__ 0x1E
	define __THK_TAG__ 0x20
	define __LMZ_TAG__ 0x22
	define __PRZ_TAG__ 0x24
	define __TTK_TAG__ 0x26
	define __APL_TAG__ 0x28
	define __TPL_TAG__ 0x2A
	define __TPZ_TAG__ 0x2C
	define __APZ_TAG__ 0x2E
	define __ALL_TAG__ 0x30
	define __TLL_TAG__ 0x32
	define __AGL_TAG__ 0x34
	define __TGL_TAG__ 0x36
	define __STL_TAG__ 0x38
	define __ANL_TAG__ 0x3A
	define __TNL_TAG__ 0x3C
	//available: 
	//			 0x3E

	/* -- RAW CHUNKS -- */
	define __FLT_TAG__ 0x01
	define __SYM_TAG__ 0x03
	define __STR_TAG__ 0x05
	define __TGZ_TAG__ 0x07
	define __AGZ_TAG__ 0x09
	define __ALZ_TAG__ 0x0B
	define __TLZ_TAG__ 0x0D
	define __NLC_TAG__ 0x0F
	define __ANZ_TAG__ 0x11
	define __TNZ_TAG__ 0x13

	/* -- IMMEDIATES -- */
	//(tags > maxTag = 0x3f)
	define __CHR_TAG__ 0x40
	define __TRU_TAG__ 0x41
	define __FLS_TAG__ 0x42
	define __VOI_TAG__ 0x43
	define __NUL_TAG__ 0x44
	define __NBR_TAG__ 0x45
	define __NAT_TAG__ 0x46
	define __LCL_TAG__ 0x47
	define __GLB_TAG__ 0x48

	function SLIP_ASM(stdlib, foreign, heap) {
		"use asm";

		/* -- CONSTANT VALUES -- */
		define __TRUE__ 0x7fffffe1
		define __FALSE__ 0x7fffffe5
		define __NULL__ 0x7fffffe9
		define __VOID__ 0x7fffffed
		define __ZERO__ 0x3
		define __ONE__ 0x7
		define __TWO__ 0xB

		/* -- IMPORTS & VARIABLES -- */

		//memory
		var MEM8 = new stdlib.Uint8Array(heap);
		var MEM32 = new stdlib.Uint32Array(heap);
		var FLT32 = new stdlib.Float32Array(heap);
		var STKTOP = foreign.heapSize|0;
		var MEMSIZ = foreign.heapSize|0;
		var MEMTOP = 0;

		//math
		var fround = stdlib.Math.fround;
		var imul = stdlib.Math.imul;
		var sin = stdlib.Math.sin;

		//registers
		var ARG = 0; //arguments
		var DCT = 0; //lexical scope
		var DFR = 0; //dictionary frame
		var DEN = 0; //dictionary environment
		var DGL = 0; //dictionary globals
		var ENV = 0; //environemnt
		var EXP = 0; //expression
		var EXT = 0; //external pool
		var FRM = 0; //frame 
		var FLT = fround(0.0); //float
		var GLB = 0; //globals
		var IDX = 0; //index
		var KON = 0; //continuation
		var LEN = 0; //length
		var LST = 0; //list 
		var OFS = 0; //lexical offset
		var PAR = 0; //parameters
		var PAT = 0; //pattern
		var REA = 0.1; //double
		var SCP = 0; //lexical scope level
		var SIZ = 0; //size
		var SYM = 0; //symbol pool
		var TLC = 0; //tail call
		var TMP = 0; //temporary
		var VAL = 0; //value

		//reader
		var look = foreign.look;
		var skip = foreign.skip;
		var read = foreign.read;
		var freadSymbol = foreign.readSymbol;
		var freadString = foreign.readString;
		var freadNumber = foreign.readNumber;

		//dictionary
		var dctDefine = foreign.dctDefine;
		var currentFrmSiz = 0;
		var currentScpLvl = 0;
		var globalFrmSiz = 0;

		//errors
		var err_expectedRBR = foreign.expectedRBR;
		var err_invalidSyntax = foreign.invalidSyntax;
		var err_invalidIf = foreign.invalidIf;
		var err_invalidSequence = foreign.invalidSequence;
		var err_invalidQuote = foreign.invalidQuote;
		var err_invalidDefine = foreign.invalidDefine;
		var err_invalidAssignment = foreign.invalidAssignment;
		var err_invalidLambda = foreign.invalidLambda;
		var err_invalidApplication = foreign.invalidApplication;
		var err_undefinedVariable = foreign.undefinedVariable;
		var err_invalidParamCount = foreign.invalidParamCount;
		var err_invalidParameter = foreign.invalidParameter;
		var err_invalidOperator = foreign.invalidOperator;
		var err_invalidExpression = foreign.invalidExpression;
		var err_invalidArgument = foreign.invalidArgument;
		var err_invalidLength = foreign.invalidLength;
		var err_invalidRange = foreign.invalidRange;
		var err_fatalMemory = foreign.fatalMemory;
		var err_globalOverflow = foreign.globalOverflow;

		//compiler
		var compile = foreign.compile;

		//timer
		var clock = foreign.clock;
		var reset = foreign.reset;

		//symbols
		var __QUO_SYM__ = 0;
		var __VEC_SYM__ = 0;
		var __DEF_SYM__ = 0;
		var __LMB_SYM__ = 0;
		var __IFF_SYM__ = 0;
		var __BEG_SYM__ = 0;
		var __SET_SYM__ = 0;
		var loadQuo = foreign.loadQuo;
		var loadVec = foreign.loadVec;
		var loadDef = foreign.loadDef;
		var loadLmb = foreign.loadLmb;
		var loadIff = foreign.loadIff;
		var loadBeg = foreign.loadBeg;
		var loadSet = foreign.loadSet;
		var loadPls = foreign.loadPls;
		var loadMns = foreign.loadMns;
		var loadMul = foreign.loadMul;
		var loadDiv = foreign.loadDiv;
		var loadCns = foreign.loadCns;
		var loadCar = foreign.loadCar;
		var loadCdr = foreign.loadCdr;
		var loadSca = foreign.loadSca;
		var loadScd = foreign.loadScd;
		var loadLst = foreign.loadLst;
		var loadNeq = foreign.loadNeq;
		var loadSma = foreign.loadSma;
		var loadLrg = foreign.loadLrg;
		var loadLeq = foreign.loadLeq;
		var loadSeq = foreign.loadSeq;
		var loadAss = foreign.loadAss;
		var loadMap = foreign.loadMap;
		var loadVcm = foreign.loadVcm;
		var loadVcr = foreign.loadVcr;
		var loadVcs = foreign.loadVcs;
		var loadVcl = foreign.loadVcl;
		var loadEqu = foreign.loadEqu;
		var loadEql = foreign.loadEql;
		var loadEva = foreign.loadEva;
		var loadApl = foreign.loadApl;
		var loadRea = foreign.loadRea;
		var loadLoa = foreign.loadLoa;
		var loadIpa = foreign.loadIpa;
		var loadInu = foreign.loadInu;
		var loadIsy = foreign.loadIsy;
		var loadIve = foreign.loadIve;
		var loadIst = foreign.loadIst;
		var loadDis = foreign.loadDis;
		var loadNew = foreign.loadNew;
		var loadSre = foreign.loadSre;
		var loadSse = foreign.loadSse;
		var loadSle = foreign.loadSle;
		var loadAvl = foreign.loadAvl;
		var loadCol = foreign.loadCol;
		var loadClk = foreign.loadClk;
		var loadSlp = foreign.loadSlp;
		var loadRnd = foreign.loadRnd;
		var loadErr = foreign.loadErr;
		var loadRst = foreign.loadRst;
		var loadCcc = foreign.loadCcc;
		var loadCce = foreign.loadCce;
		var loadQtt = foreign.loadQtt;
		var loadRem = foreign.loadRem;
		var loadLen = foreign.loadLen;
		var loadSin = foreign.loadSin;
		var loadExi = foreign.loadExi;
		var loadFre = foreign.loadFre;
		var loadRef = foreign.loadRef;

		//IO
		var promptUserInput = foreign.promptUserInput;
		var printNewline = foreign.printNewline;
		var promptInput = foreign.promptInput;
		var fprintOutput = foreign.printOutput;
		var fprintError = foreign.printError;
		var fprintLog = foreign.printLog;
		var loadFile = foreign.loadFile;
		var initREPL = foreign.initREPL;

		//custom
		var random = foreign.random;

		//other
		var __EMPTY_VEC__ = 0;
		var __GC_COUNT__ = 0;
		var __EXT_FREE__ = 0;
		var __EXT_SIZ__ = 0;

		//callbacks
		function readSymbol() {
			return deref(freadSymbol()|0)|0;
		}

		function readString() {
			return deref(freadString()|0)|0;
		}

		function readNumber() {
			return deref(freadNumber()|0)|0;
		}

		function printOutput(exp) {
			exp = exp|0;
			fprintOutput(ref(exp)|0); 
		}

		function printLog(exp) {
			exp = exp|0;
			fprintLog(ref(exp)|0);
		}

		function printError(exp) {
			exp = exp|0;
			fprintError(ref(exp)|0);
		}

		/* -- FUNCTIONS -- */

// **********************************************************************
// ***************************** MEMORY *********************************
// **********************************************************************

		/* MEMORY MANAGEMENT & GARBAGE COLLECTION */

		define __MEMBOTTOM__ 0x20

		function initMemory() {
			MEMTOP = __MEMBOTTOM__;
		}

		macro available {
			case {_()} => {
				letstx $STK = [makeIdent('STKTOP', #{here})];
				letstx $MEM = [makeIdent('MEMTOP', #{here})];
				return #{
					($STK - $MEM)
				}
			}
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
			src = __MEMBOTTOM__;
			dst = __MEMBOTTOM__;
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
			src = __MEMBOTTOM__;
			dst = __MEMBOTTOM__;
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

		macro makeHeader {
			case {_($tag:lit,$siz:lit)} => {
				var siz = unwrapSyntax(#{$siz});
				var tag = unwrapSyntax(#{$tag});
				var hdr = (((siz<<6)|tag)<<2);
				letstx $hdr = [makeValue(hdr,#{here})];
				return #{
					$hdr
				}
			}
			rule {($tag,$siz:expr)} => {
				((($siz<<6)|$tag)<<2)
			}
		}

		macro headerSize {
			rule {($hdr:expr)} => {
				($hdr >>> 8)
			}
		}

		macro makeFree {
			rule {($ofs:expr)} => {
				($ofs & 0xFFFFFFFD)
			}
		}

		macro makeBusy {
			rule {($ofs:expr)} => {
				($ofs | 0x2)
			}
		}

		/* CHUNKS */

		macro makeChunk {
			case {_($tag,$siz:lit) => $v:ident;} => {
				var nbr = unwrapSyntax(#{$siz});
				letstx $M32 = [makeIdent('MEM32', #{here})];
				letstx $MTP = [makeIdent('MEMTOP', #{here})];
				letstx $HDR = [makeIdent('makeHeader', #{here})];
				letstx $INC = [makeValue((nbr+1)<<2, #{here})];
				return #{
					$v = $MTP;
					$MTP = ($MTP + $INC)|0;
					$M32[$v>>2] = $HDR($tag,$siz);
				}
			}
			case {_($tag,$siz:expr) => $v:ident;} => {
				letstx $M32 = [makeIdent('MEM32', #{here})];
				letstx $MTP = [makeIdent('MEMTOP', #{here})];
				letstx $HDR = [makeIdent('makeHeader', #{here})];
				return #{
					$v = $MTP;
					$MTP = ($MTP+(($siz+1)<<2))|0;
					$M32[$v>>2] = $HDR($tag,$siz);
				}
			}
		}

		macro chunkTag {
			case {_($ptr:expr)} => {
				letstx $mem = [makeIdent('MEM32', #{here})];
				return #{
					(((MEM32[$ptr>>2]|0)>>>2)&0x3F)
				}
			}
		}

		macro chunkSize {
			case {_($ptr:expr)} => {
				letstx $mem = [makeIdent('MEM32', #{here})];
				letstx $siz = [makeIdent('headerSize', #{here})];
				return #{
					(headerSize(MEM32[$ptr>>2]|0))
				}
			}
		}

		macro chunkGet {
			case {_($ptr:expr, $idx:expr)} => {
				letstx $mem = [makeIdent('MEM32', #{here})];
				return #{
					$mem[($ptr + $idx) >> 2]
				}
			}
		}

		macro chunkGetByte {
			case {_($ptr:expr, $idx:expr)} => {
				letstx $mem = [makeIdent('MEM8', #{here})];
				return #{
					$mem[($ptr + $idx)|0]
				}
			}
		}

		macro chunkGetFloat {
			case {_($ptr:expr, $idx:expr)} => {
				letstx $mem = [makeIdent('FLT32', #{here})];
				return #{
					$mem[($ptr + $idx) >> 2]
				}
			}
		}

		macro chunkSet {
			case {_($ptr:expr, $idx:expr, $val:expr)} => {
				letstx $mem = [makeIdent('MEM32', #{here})];
				return #{
					$mem[($ptr + $idx) >> 2] = $val
				}
			}
		}

		macro chunkSetByte {
			case {_($ptr:expr, $idx:expr, $val:expr)} => {
				letstx $mem = [makeIdent('MEM8', #{here})];
				return #{
					$mem[($ptr + $idx)|0] = $val
				}
			}
		}

		macro chunkSetFloat {
			case {_($ptr:expr, $idx:expr, $val:expr)} => {
				letstx $mem = [makeIdent('FLT32', #{here})];
				return #{
					$mem[($ptr + $idx) >> 2] = $val
				}
			}
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
			return STK[0]|0;
		}

		function poke(el) {
			el = el|0;
			MEM32[STKTOP >> 2] = el;
		}

		function zap() {
			STKUNWIND(1);
		}

		function emptyStk() {
			STKTOP = MEMSIZ;
		}

		function stkSize() {
			return ((MEMSIZ - STKTOP)|0) >> 2;
		}

		macro STK {
			rule {[0]} => {
				(MEM32[STKTOP >> 2])
			}
			case {_[$idx:lit]} => {
			  var i = unwrapSyntax(#{$idx});
			  letstx $i = [makeValue(i<<2,#{h})];
			  return #{
				(MEM32[(STKTOP+($i))>>2])
			  }
			}
			rule{[$idx:expr]} => {
				(MEM32[(STKTOP+($idx<<2))>>2])
			}
		}

		macro STKUNWIND {
			case {_($n:lit)} => {
				var nbr = unwrapSyntax(#{$n});
				var val = makeValue(nbr<<2,#{h});
				letstx $inc = [val];
				return #{
					(STKTOP = (STKTOP + $inc)|0)
				}
			}			
			case {_($n:ident)} => {
				return #{
					(STKTOP = (STKTOP + ($n << 2))|0)
				}
			}
		}

		macro STKALLOC {
			case {_($n:lit)} => {
				var nbr = unwrapSyntax(#{$n});
				var val = makeValue(nbr<<2,#{h});
				letstx $dec = [val];
				return #{
					(STKTOP = (STKTOP - $dec)|0)
				}
			}
			case {_($n:ident)} => {
				return #{
					(STKTOP = (STKTOP - ($n << 2))|0)
				}
			}
		}

// **********************************************************************
// ************************* ABSTRACT GRAMMAR ***************************
// **********************************************************************

		macro tag {
			case {_($v:expr)} => {
				letstx $mem = [makeIdent('MEM8',#{here})];
				return #{
					($v&0x1?$mem[$v&0x1F]|0:chunkTag($v)|0)
				}
			}
		}

		function ftag(exp) {
			exp = exp|0;
			return tag(deref(exp)|0)|0;
		}

		function initTags() {
			MEM8[0x3] = __NBR_TAG__;
			MEM8[0x7] = __NBR_TAG__;
			MEM8[0xB] = __NBR_TAG__;
			MEM8[0xF] = __NBR_TAG__;
			MEM8[0x13] = __NBR_TAG__;
			MEM8[0x17] = __NBR_TAG__;
			MEM8[0x1B] = __NBR_TAG__;
			MEM8[0x1F] = __NBR_TAG__;
			MEM8[0x1] = __TRU_TAG__;
			MEM8[0x5] = __FLS_TAG__;
			MEM8[0x9] = __NUL_TAG__;
			MEM8[0xD] = __VOI_TAG__;
			MEM8[0x11] = __CHR_TAG__;
			MEM8[0x15] = __NAT_TAG__;
			MEM8[0x19] = __LCL_TAG__;
			MEM8[0x1D] = __GLB_TAG__;
		}

		function fmake(tag,siz) {
			tag = tag|0;
			siz = siz|0;
			var chk = 0;
			claimSiz(siz)
			makeChunk(tag,siz) => chk;
			return ref(chk)|0;
		}

		function fset(chk,idx,itm) {
			chk = chk|0;
			idx = idx|0;
			itm = itm|0;
			chunkSet(deref(chk)|0,idx<<2,deref(itm)|0);
		}

		/*==================*/
		/* -- IMMEDIATES -- */
		/*==================*/

		/* ---- CHARS ---- */

		function fmakeChar(code) {
			code = code|0;
			return ref(makeChar(code)|0)|0;
		}

		function fcharCode(ch) {
			ch = ch|0;
			return charCode(deref(ch)|0)|0;
		}

		function makeChar(charCode) {
			charCode = charCode|0;
			return (charCode << 5)|0x11;
		}

		function charCode(ch) {
			ch = ch|0;
			return (ch >>> 5)|0;
		}

		typecheck __CHR_TAG__ => isChar

		/* ---- SPECIAL VALUES ---- */

		//TODO: replace with more efficient typechecks
		typecheck __TRU_TAG__ => isTrue
		typecheck __FLS_TAG__ => isFalse
		typecheck __VOI_TAG__ => isVoid
		typecheck __NUL_TAG__ => isNull

		/* ---- SMALL INTEGERS/NUMBERS ---- */

		macro makeNumber {
			rule {($v:expr)} => {
				(($v<<2)|0x3)
			}
		}

		macro numberVal {
			rule {($v:expr)} => {
				($v>>2)
			}
		}

		function fmakeNumber(val) {
			val = val|0;
			return ref((val << 2)|0x3)|0;
		}

		function fnumberVal(val) {
			val = val|0;
			return ((deref(val)|0) >> 2)|0;
		}

		typecheck __NBR_TAG__ => isNumber

		/* ---- NATIVES ----- */		

		macro nativePtr {
			rule {($v:expr)} => {
				($v>>>5)
			}
		}

		function makeNative(nat) {
			nat = nat|0;
			return (nat << 5)|0x15;
		}

		function fnativePtr(nat) {
			nat = nat|0;
			return ((deref(nat)|0) >>> 5)|0;
		}

		typecheck __NAT_TAG__ => isNative

		/* ---- LOCAL VARIABLE ---- */

		function fmakeLocal(lcl) {
			lcl = lcl|0;
			return ref(makeLocal(lcl)|0)|0;
		}

		function makeLocal(lcl) {
			lcl = lcl|0;
			return (lcl << 5)|0x19;
		}

		function flocalOfs(lcl) {
			lcl = lcl|0;
			return ((deref(lcl)|0) >>> 5)|0;
		}

		macro localOfs {
			rule {$ofs} => {
				($ofs>>>5)
			}
		}

		typecheck __LCL_TAG__ => isLocal

		/* ---- GLOBAL VARIABLE ---- */

		function fmakeGlobal(ofs) {
			ofs = ofs|0;
			return ref(makeLocal(ofs)|0)|0;
		}

		function makeGlobal(ofs) {
			ofs = ofs|0;
			return (ofs << 5)|0x1D;
		}		

		macro globalOfs {
			rule {$ofs} => {
				($ofs>>>5)
			}
		}

		function fglobalOfs(glb) {
			glb = glb|0;
			return ((deref(glb)|0) >>> 5)|0;
		}

		typecheck __GLB_TAG__ => isGlobal

		/*==================*/
		/* ---- CHUNKS ---- */
		/*==================*/

		/* ---- PAIR ---- */

		struct makePair {
			car => pairCar, pairSetCar;
			cdr => pairCdr, pairSetCdr;
		} as __PAI_TAG__

		typecheck __PAI_TAG__ => isPair;

		function reverse(lst) {
			lst = lst|0;
			var prv = 0;
			var nxt = 0;
			prv = __NULL__;
			while(isPair(lst)|0) {
				nxt = pairCdr(lst)|0;
				pairSetCdr(lst, prv);
				prv = lst;
				lst = nxt;
			}
			return prv|0;
		}

		/* ---- VECTOR ---- */

		macro makeVector {
			case {_($siz) => $v:ident;} => {
				letstx $VEC = [makeIdent('makeChunk',#{here})];
				return #{
					$VEC(__VCT_TAG__, $siz) => $v;
				}
			}
		}

		macro fillVector {
			case {_($siz,$exp) => $v:ident;} => {
				letstx $VEC = [makeIdent('makeChunk',#{here})];
				letstx $SET = [makeIdent('chunkSet',#{here})];
				letstx $IDX = [makeIdent('IDX',#{here})];
				return #{
					$VEC(__VCT_TAG__, $siz) => $v;
					for($IDX=1;($IDX|0)<=($siz|0);$IDX=($IDX+1)|0)
						{ $SET($v,$IDX<<2,$exp) }
				}
			}
		}

		macro vectorRef {
			case { _($vct:expr, $idx:lit) } => {
				var idx = unwrapSyntax(#{$idx});
				letstx $nbr = [makeValue(idx<<2, #{here})];
				letstx $get = [makeIdent('chunkGet', #{$vct})];
				return #{
					$get($vct, $nbr)
				}
			}
			case { _($vct:expr, $idx:expr) } => {
				letstx $get = [makeIdent('chunkGet', #{$vct})];
				return #{
					$get($vct, $idx<<2)
				}
			}
		}

		function vectorAt(vct, idx) {
			vct = vct|0;
			idx = idx|0;
			return ref(chunkGet(deref(vct)|0,idx<<2)|0)|0;
		}

		macro vectorSet {
			case { _($vct:expr, $idx:lit, $val:expr) } => {
				var idx = unwrapSyntax(#{$idx});
				letstx $nbr = [makeValue(idx<<2, #{here})];
				letstx $set = [makeIdent('chunkSet', #{$vct})];
				return #{
					$set($vct, $nbr, $val)
				}
			}
			case { _($vct:expr, $idx:expr, $val:expr) } => {
				letstx $set = [makeIdent('chunkSet', #{$vct})];
				return #{
					$set($vct, $idx<<2, $val)
				}
			}
		}

		macro vectorLength {
			case {_($vct:expr)} => {
				letstx $siz = [makeIdent('chunkSize', #{$vct})];
				return #{
					$siz($vct)
				}
			}
		}

		function ffillVector(siz,fill) {
			siz = siz|0;
			fill = fill|0;
			var vct = 0;
			fill = deref(fill)|0;
			fillVector(siz,fill) => vct;
			return vct|0;
		}

		function fvectorLength(vct) {
			vct = vct|0;
			return chunkSize(deref(vct)|0)|0;
		}

		function currentStack() {
			var len = 0;
			var idx = 0;
			var vct = 0;
			var cur = 0;
			len = stkSize()|0;
			claimSiz(len)
			makeVector(len) => vct;
			while((idx|0) < (len|0)) {
				cur = STK[idx]|0;
				idx = (idx+1)|0;
				vectorSet(vct, idx, cur);
			}
			return vct|0;
		}

		function restoreStack() {
			var len = 0;
			var exp = 0;
			emptyStk();
			len = vectorLength(PAR)|0;
			claimSiz(len)
			STKALLOC(len);
			while(len) {
				exp = vectorRef(PAR, len)|0;
				len = (len - 1)|0;
				STK[len] = exp;
			}
		}

		typecheck __VCT_TAG__ => isVector

		/* ---- SEQUENCE ---- */

		function makeSequence(siz) {
			siz = siz|0;
			var seq = 0;
			makeChunk(__SEQ_TAG__, siz) => seq;
			return seq|0;
		}

		macro sequenceRef {
			case { _($seq:expr, $idx:lit) } => {
				var idx = unwrapSyntax(#{$idx});
				letstx $nbr = [makeValue(idx<<2, #{here})];
				letstx $get = [makeIdent('chunkGet', #{$here})];
				return #{
					$get($seq, $nbr)
				}
			}
			case { _($seq:expr, $idx:expr) } => {
				letstx $get = [makeIdent('chunkGet', #{$here})];
				return #{
					$get($seq, $idx<<2)
				}
			}
		}

		function sequenceAt(seq, idx) {
			seq = seq|0;
			idx = idx|0;
			return ref(chunkGet(deref(seq)|0,idx<<2)|0)|0;
		}

		function sequenceSet(seq, idx, val) {
			seq = seq|0;
			idx = idx|0;
			val = val|0;
			chunkSet(deref(seq)|0,idx<<2,deref(val)|0);
		}

		function sequenceLength(seq) {
			seq = seq|0;
			return chunkSize(deref(seq)|0)|0;
		}

		typecheck __SEQ_TAG__ => isSequence

		/* ---- IFS ---- */

		struct makeIfs {
			pre => ifsPredicate;
			csq => ifsConsequence;
		} as __IFS_TAG__

		typecheck __IFS_TAG__ => isIfs

		/* ---- IFF ---- */

		struct makeIff {
			pre => iffPredicate;
			csq => iffConsequence;
			alt => iffAlternative;
		} as __IFF_TAG__

		typecheck __IFF_TAG__ => isIff

		/* ---- QUO ---- */

		struct makeQuo {
			quo => quoExpression;
		} as __QUO_TAG__;

		typecheck __QUO_TAG__ => isQuo

		/* ---- DEFINE VARIABLE ---- */

		struct makeDfv {
			ofs => dfvOfs;
			val => dfvVal;
		} as __DFV_TAG__

		typecheck __DFV_TAG__ => isDfv

		/* ---- DEFINE FUNCTION (FIXED ARGUMENT COUNT) ---- */

		struct makeDff {
			ofs => dffOfs;
			arc => dffArgc;
			frc => dffFrmSiz;
			bdy => dffBdy;
		} as __DFF_TAG__

		typecheck __DFF_TAG__ => isDff

		/* ---- DEFINE FUNCTION (VARIABLE ARGUMENT COUNT) ---- */

		struct makeDfz {
			ofs => dfzOfs;
			arc => dfzArgc;
			frc => dfzFrmSiz;
			bdy => dfzBdy;
		} as __DFZ_TAG__

		typecheck __DFZ_TAG__ => isDfz

		/* ---- ASSIGNMENT (LOCAL) ---- */

		struct makeSlc {
			ofs => slcOfs;
			val => slcVal;
		} as __SLC_TAG__

		typecheck __SLC_TAG__ => isSlc

		/* ---- ASSIGNMENT (NON-LOCAL) ---- */

		struct makeSgl {
			scp => sglScp;
			ofs => sglOfs;
			val => sglVal;
		} as __SGL_TAG__

		typecheck __SGL_TAG__ => isSgl

		/* ---- CONTINUATION ---- */

		struct makeContinuation {
			kon => continuationKon;
			frm => continuationFrm;
			env => continuationEnv;
			stk => continuationStk;
		} as __CNT_TAG__

		typecheck __CNT_TAG__ => isContinuation

		/* ---- ENVIRONMENT  ---- */

		struct makeEnv {
			frm => envFrm;
			siz => envSiz;
			nxt => envNxt;
		} as __ENV_TAG__

		typecheck __ENV_TAG__ => isEnvironment

		/* ---- THUNK ---- */

		struct makeThk {
			exp => thunkExp;
			siz => thunkSiz;
		} as __THK_TAG__

		typecheck __THK_TAG__ => isThunk

		/* ---- TAIL THUNK ---- */

		struct makeTtk {
			exp => ttkExp;
			siz => ttkSiz;
		} as __TTK_TAG__

		typecheck __TTK_TAG__ => isTtk

		/* ---- LAMBDA (FIXED ARGUMENTS) ---- */

		struct makeLmb {
			arc => lmbArgc;
			frc => lmbFrmSiz;
			bdy => lmbBdy;
		} as __LMB_TAG__

		typecheck __LMB_TAG__ => isLmb

		/* ---- LAMBDA (VARIABLE ARGUMENTS) ---- */

		struct makeLmz {
			arc => lmzArgc;
			frc => lmzFrmSiz;
			bdy => lmzBdy;
		} as __LMZ_TAG__

		typecheck __LMZ_TAG__ => isLmz

		/* ---- PROCEDURE (FIXED ARGC) ---- */

		struct makePrc {
			arc => prcArgc;
			frc => prcFrmSiz;
			bdy => prcBdy;
			env => prcEnv;
		} as __PRC_TAG__

		typecheck __PRC_TAG__ => isPrc

		/* ---- PROCEDURE (VARIABLE ARGC) ---- */

		struct makePrz {
			arc => przArgc;
			frc => przFrmSiz;
			bdy => przBdy;
			env => przEnv;
		} as __PRZ_TAG__

		typecheck __PRZ_TAG__ => isPrz

		/* ---- APPLICATION (ZERO ARG) ---- */

		struct makeApz {
			opr => apzOpr;
		} as __APZ_TAG__

		typecheck __APZ_TAG__ => isApz

		/* ---- LOCAL APPLICATION (ZERO ARG) ---- */

		struct makeAlz {
			ofs => alzOfs;
		} as __ALZ_TAG__

		typecheck __ALZ_TAG__ => isAlz

		/* ---- NON-LOCAL APPLICATION (ZERO ARG) ---- */

		struct makeAnz {
			scp => anzScp;
			ofs => anzOfs;
		} as __ANZ_TAG__

		typecheck __ANZ_TAG__ => isAnz

		/* ---- GLOBAL APPLICATION (ZERO ARG) ---- */

		struct makeAgz {
			ofs => agzOfs;
		} as __AGZ_TAG__

		typecheck __AGZ_TAG__ => isAgz

		/* ---- TAIL CALL (ZERO ARG) ---- */

		struct makeTpz {
			opr => tpzOpr;
		} as __TPZ_TAG__

		typecheck __TPZ_TAG__ => isTpz

		/* ---- LOCAL TAIL CALL (ZERO ARG) ---- */

		struct makeTlz {
			ofs => tlzOfs;
		} as __TLZ_TAG__

		typecheck __TLZ_TAG__ => isTlz

		/* ---- NON-LOCAL TAIL CALL (ZERO ARG) ---- */

		struct makeTnz {
			scp => tnzScp;
			ofs => tnzOfs;
		} as __TNZ_TAG__

		typecheck __TNZ_TAG__ => isTnz

		/* ---- GLOBAL TAIL CALL (ZERO ARG) ---- */

		struct makeTgz {
			ofs => tgzOfs;
		} as __TGZ_TAG__

		typecheck __TGZ_TAG__ => isTgz


		/* ---- APPLICATION (WITH ARGUMENTS) ---- */

		struct makeApl {
			opr => aplOpr;
			opd => aplOpd;
		} as __APL_TAG__

		typecheck __APL_TAG__ => isApl

		/* ---- LOCAL APPLICATION (WITH ARGUMENTS) ---- */

		struct makeAll {
			ofs => allOfs;
			opd => allOpd;
		} as __ALL_TAG__

		typecheck __ALL_TAG__ => isAll

		/* ---- NON-LOCAL APPLICATION (WITH ARGUMENTS) ---- */

		struct makeAnl {
			scp => anlScp;
			ofs => anlOfs;
			opd => anlOpd;
		} as __ANL_TAG__

		typecheck __ANL_TAG__ => isAnl	

		/* ---- GLOBAL APPLICATION (WITH ARGUMENTS) ---- */

		struct makeAgl {
			ofs => aglOfs;
			opd => aglOpd;
		} as __AGL_TAG__

		typecheck __AGL_TAG__ => isAgl	
	
		/* ---- TAIL CALL (WITH ARGUMENTS) ---- */

		struct makeTpl {
			opr => tplOpr;
			opd => tplOpd;
		} as __TPL_TAG__

		typecheck __TPL_TAG__ => isTpl

		/* ---- LOCAL TAIL CALL (WITH ARGUMENTS) ---- */

		struct makeTll {
			ofs => tllOfs;
			opd => tllOpd;
		} as __TLL_TAG__

		typecheck __TLL_TAG__ => isTll		

		/* ---- NON-LOCAL TAIL CALL (WITH ARGUMENTS) ---- */

		struct makeTnl {
			scp => tnlScp;
			ofs => tnlOfs;
			opd => tnlOpd;
		} as __TNL_TAG__

		typecheck __TNL_TAG__ => isTnl	

		/* ---- GLOBAL TAIL CALL (WITH ARGUMENTS) ---- */

		struct makeTgl {
			ofs => tglOfs;
			opd => tglOpd;
		} as __TGL_TAG__

		typecheck __TGL_TAG__ => isTgl

		/* ---- SEQUENCE TAIL ---- */

		struct makeStl {
			exp => stlExp;
		} as __STL_TAG__

		typecheck __STL_TAG__ => isStl

		/* ---- NON-LOCAL VARIABLE ---- */

		struct makeNlc {
			scp => nlcScp;
			ofs => nlcOfs;
		} as __NLC_TAG__

		typecheck __NLC_TAG__ => isNlc

		/* --- FLOATS --- */

		define __FLOAT_SIZ__ 1
		define __FLOAT_NBR__ 4

		macro makeFloat {
			case {_($v:expr) => $reg:ident;} => {
				letstx $CHK = [makeIdent('makeChunk',#{here})];
				letstx $SET = [makeIdent('chunkSetFloat',#{here})];
				return #{
					$CHK(__FLT_TAG__, __FLOAT_SIZ__) => $reg;
					$SET($reg, __FLOAT_NBR__, $v);
				}
			}
		}


		macro floatNumber {
			case {_($v:expr)} => {
				letstx $get = [makeIdent('chunkGetFloat',#{here})];
				return #{
					$get($v, __FLOAT_NBR__)
				}
			}
		}		

		function fmakeFloat(nbr) {
			nbr = fround(nbr);
			var flt = 0;
			makeChunk(__FLT_TAG__, __FLOAT_SIZ__) => flt;
			chunkSetFloat(flt, __FLOAT_NBR__, nbr);
			return ref(flt)|0;
		}

		function ffloatNumber(flt) {
			flt = flt|0;
			return fround(chunkGetFloat(deref(flt)|0,__FLOAT_NBR__));
		}

		typecheck __FLT_TAG__ => isFloat

		/* --- TEXT --- */

		function makeText(tag, len) {
			tag = tag|0;
			len = len|0;
			var chk = 0;
			var siz = 0;
			claimSiz(len)  //overestimation
			for(siz = len; siz&0x3; siz=(siz+1)|0);
			makeChunk(tag, siz>>2) => chk;
			for(len = (len+4)|0, siz = (siz+4)|0;
				(len|0) < (siz|0);
				len = (len + 1)|0)
				chunkSetByte(chk, len, 0);
			return ref(chk)|0;
		}

		function textSetChar(txt, idx, chr) {
			txt = txt|0;
			idx = idx|0;
			chr = chr|0;
			chunkSetByte(deref(txt)|0,(idx+4)|0, chr);
		}

		function textGetChar(txt, idx) {
			txt = txt|0;
			idx = idx|0;
			return chunkGetByte(deref(txt)|0,(idx+4)|0)|0;
		}

		function textLength(txt) {
			txt = txt|0;
			var len = 0;
			txt = deref(txt)|0;
			len = (chunkSize(txt)|0) << 2;
			if (len)
				for(;!(chunkGetByte(txt,(len+3)|0)|0);len=(len-1)|0);
			return len|0;
		}

		/* --- STRINGS --- */

		function makeString(len) {
			len = len|0;
			return makeText(__STR_TAG__, len)|0;
		}

		typecheck __STR_TAG__ => isString

		/* --- SYMBOLS --- */

		function makeSymbol(len) {
			len = len|0;
			return makeText(__SYM_TAG__,len)|0;
		}

		typecheck __SYM_TAG__ => isSymbol

<<<<<<< HEAD
=======
// **********************************************************************
// ****************************** POOL **********************************
// **********************************************************************

		function initPool() {
			__POOL_TOP__ = 0;
			__POOL_SIZ__ = 64;
			fillVector(__POOL_SIZ__, __VOID__) => SYM;
		}

		function growPool() {
			var idx = 0;
			var sym = 0;
			__POOL_SIZ__ = imul(__POOL_SIZ__,2)|0;
			claimSiz(__POOL_SIZ__)
			fillVector(__POOL_SIZ__, __VOID__) => TMP;
			while((idx|0) < (__POOL_TOP__|0)) {
				idx = (idx + 1)|0;
				sym = vectorRef(SYM, idx)|0;
				vectorSet(TMP, idx, sym);
			}
			SYM = TMP;
		}

		function poolAt(idx) {
			idx = idx|0;
			return ref(vectorRef(SYM,idx)|0)|0;
		}

		function enterPool(sym) {
			sym = sym|0;
			sym = deref(sym)|0;
			if ((__POOL_TOP__|0) == (__POOL_SIZ__|0)) {
				PAT = sym;
				growPool();
				sym = PAT;
			}
			__POOL_TOP__ = (__POOL_TOP__+1)|0;
			vectorSet(SYM, __POOL_TOP__, sym);
			return __POOL_TOP__|0;
		}

		function loadSymbols() {
			__QUO_SYM__ = deref(loadQuo()|0)|0;
			__VEC_SYM__ = deref(loadVec()|0)|0;
			__DEF_SYM__ = deref(loadDef()|0)|0;
			__LMB_SYM__ = deref(loadLmb()|0)|0;
			__IFF_SYM__ = deref(loadIff()|0)|0;
			__BEG_SYM__ = deref(loadBeg()|0)|0;
			__SET_SYM__ = deref(loadSet()|0)|0;
		}
>>>>>>> parent of 254a30e... updated compiler into JS

// **********************************************************************
// **************************** EXTERNAL ********************************
// **********************************************************************

		function initExt() {
			__EXT_FREE__ = 1;
			__EXT_SIZ__ = 64;
			makeVector(__EXT_SIZ__) => EXT;
			initFreeList();
		}

		function initFreeList() {
			var idx = 0;
			var nbr = 0;
			for(idx = __EXT_FREE__;
			   (idx|0) <= (__EXT_SIZ__|0);
			    idx = (idx+1)|0) 
			{				
				nbr = makeNumber((idx+1)|0)|0;	
				vectorSet(EXT,idx,nbr);	
			}
		}

		function growExt() {
			var idx = 0;
			var val = 0;
			__EXT_SIZ__ = imul(__EXT_SIZ__,2)|0;
			claimSiz(__EXT_SIZ__)
			makeVector(__EXT_SIZ__) => TMP;
			for(idx=1;(idx|0)<(__EXT_FREE__|0);idx=(idx+1)|0) {
				val = vectorRef(EXT,idx)|0;
				vectorSet(TMP, idx, val);
			}
			EXT = TMP;
			initFreeList();
		}

		function ref(val) {
			val = val|0;
			VAL = val;
			if ((__EXT_FREE__|0) > (__EXT_SIZ__|0)) {
				growExt();
			}
			IDX = __EXT_FREE__;
			__EXT_FREE__ = vectorRef(EXT,__EXT_FREE__)|0;
			__EXT_FREE__ = numberVal(__EXT_FREE__)|0;
			vectorSet(EXT,IDX,VAL);
			return IDX|0;
		}

		function free(idx) {
			idx = idx|0;
			VAL = vectorRef(EXT,idx)|0;
			IDX = makeNumber(__EXT_FREE__)|0;
			__EXT_FREE__ = idx|0;
			vectorSet(EXT,idx,IDX);
			return VAL|0;
		}

		function clearRefs() {
			__EXT_FREE__ = 1;
			initFreeList();
		}

		function deref(idx) {
			idx = idx|0;
			return vectorRef(EXT,idx)|0;
		}

// **********************************************************************
// *************************** DICTIONARY *******************************
// **********************************************************************

		function initDictionary() {
			DEN = __NULL__;
			DFR = __NULL__;
			DGL = __NULL__;
		}

		function defineVar() {
			if (((currentScpLvl|0)==0)
				&((currentFrmSiz|0)==__GLOBAL_SIZ__)) {
				err_globalOverflow();
				return error;
			}
			DFR = makePair(PAT, DFR)|0;
			currentFrmSiz = (currentFrmSiz+1)|0;
			return currentFrmSiz|0;
		}

		function enterScope() {
			DEN = makeEnv(DFR, makeNumber(currentFrmSiz)|0, DEN)|0;
			currentScpLvl = (currentScpLvl+1)|0;
			DFR = __NULL__;
			currentFrmSiz = 0;
		}

		function exitScope() {
			var frameSize = 0;
			frameSize = currentFrmSiz;
			DFR = envFrm(DEN)|0;
			currentFrmSiz = numberVal(envSiz(DEN)|0)|0;
			DEN = envNxt(DEN)|0;
			currentScpLvl = (currentScpLvl-1)|0;
			return frameSize|0;
		}

		function offset(frm) {
			frm = frm|0;
			for(;OFS;OFS=(OFS-1)|0,frm=pairCdr(frm)|0)
				if(((pairCar(frm)|0) == (PAT|0))|0)
					return;
		}

		function lexicalAdr() {
			var env = 0;
			OFS = currentFrmSiz;
			offset(DFR);
			if (OFS) { //local variable found!
				SCP = 0;
				return;
			}
			if (currentScpLvl) { //maybe higher in environment?
				for(SCP=currentScpLvl,env=DEN;SCP;SCP=(SCP-1)|0,env=envNxt(env)|0) {
					OFS = numberVal(envSiz(env)|0)|0;
					offset(envFrm(env)|0);
					if (OFS) return;
				}
			}
		}

		function dctCheckpoint() {
			DGL = DFR;
			globalFrmSiz = currentFrmSiz;
		}

		function dctRollback() {
		  	//TODO: check with C implementation
			DFR = DGL;
			DEN = __NULL__;
			currentFrmSiz = globalFrmSiz;
			currentScpLvl = 0;
		}

// **********************************************************************
// *************************** ENVIRONMENT ******************************
// **********************************************************************

		function initEnvironment() {
			fillVector(__GLOBAL_SIZ__, __VOID__) => GLB;
			FRM = GLB;
			ENV = __EMPTY_VEC__;
		}

		function extendEnv() {
			var env = 0;
			var len = 0;
			var idx = 0;
			len = ((vectorLength(ENV)|0)+1)|0;
			claimSiz(len)
			makeVector(len) => env;
			for(idx=1;(idx|0)<(len|0);idx=(idx+1)|0)
				vectorSet(env,idx,vectorRef(ENV,idx)|0);
			vectorSet(env,len,FRM);
			return env|0;
		}

// **********************************************************************
// ********************** EVALUATOR AUXILIARIES *************************
// **********************************************************************

		macro lookupLocal {
			case {_ $R1 => $R2} => {
				letstx $FRM = [makeIdent('FRM', #{$R1})];
				return #{
					$R2 = vectorRef($FRM,localOfs($R1)|0)|0;
				}
			} 
		}

		macro lookupGlobal {
			case {_ $R1 => $R2} => {
				letstx $GLB = [makeIdent('GLB', #{$R1})];
				return #{
					$R2 = vectorRef($GLB,globalOfs($R1)|0)|0;
				}
			} 
		}

		macro lookupNlc {
			case {_ $R1 => $R2} => {
				letstx $ENV = [makeIdent('ENV', #{$R1})];
				return #{
					$R2 = vectorRef(vectorRef($ENV, nlcScp($R1)|0)|0,
							 		nlcOfs($R1)|0)|0;
				}
			} 
		}

		macro capturePrc {
			case {_($exp)} => {
				letstx $lmbArgc = [makeIdent('lmbArgc', #{$exp})];
				letstx $lmbFrmSiz = [makeIdent('lmbFrmSiz', #{$exp})];
				letstx $lmbBdy = [makeIdent('lmbBdy', #{$exp})];
				letstx $extendEnv = [makeIdent('extendEnv', #{$exp})];
				letstx $makePrc = [makeIdent('makePrc', #{$exp})];
				letstx $DCT = [makeIdent('DCT', #{$exp})];
				return #{
					($DCT = $extendEnv()|0,
					$makePrc($lmbArgc($exp)|0,
						   $lmbFrmSiz($exp)|0,
						   $lmbBdy($exp)|0,
						   $DCT)|0)
				}
			}
		}

		macro capturePrz {
			case {_($exp)} => {
				letstx $lmzArgc = [makeIdent('lmzArgc', #{$exp})];
				letstx $lmzFrmSiz = [makeIdent('lmzFrmSiz', #{$exp})];
				letstx $lmzBdy = [makeIdent('lmzBdy', #{$exp})];
				letstx $extendEnv = [makeIdent('extendEnv', #{$exp})];
				letstx $makePrz = [makeIdent('makePrz', #{$exp})];
				letstx $DCT = [makeIdent('DCT', #{$exp})];
				return #{
					($DCT = $extendEnv()|0,
					$makePrz($lmzArgc($exp)|0,
						   $lmzFrmSiz($exp)|0,
						   $lmzBdy($exp)|0,
						   $DCT)|0)
				}
			}
		}

		function preserveEnv() {
			if((KON|0) != E_c_return) {
				STKALLOC(3);
				STK[2] = KON;
				STK[1] = ENV;
				STK[0] = FRM;
				KON = E_c_return;
			}
		}

// **********************************************************************
// ***************************** NATIVES ********************************
// **********************************************************************

		function initNatives() {
			addNative(loadFre()|0, N_free);
			addNative(loadRef()|0, N_ref);
			addNative(loadExi()|0, N_exit);
			addNative(loadSin()|0, N_sin);
			addNative(loadLen()|0, N_length);
			addNative(loadRem()|0, N_remainder);
			addNative(loadQtt()|0, N_quotient);
			addNative(loadErr()|0, N_error);
			addNative(loadLoa()|0, N_load);
			addNative(loadRnd()|0, N_random);
			addNative(loadSle()|0, N_stringLength);
			addNative(loadSse()|0, N_stringSet);
			addNative(loadSre()|0, N_stringRef);
			addNative(loadCcc()|0, N_callcc);
			addNative(loadAvl()|0, N_available);
			addNative(loadCol()|0, N_collect);
			addNative(loadRst()|0, N_reset);
			addNative(loadClk()|0, N_clock);
			addNative(loadIst()|0, N_isString);
			addNative(loadIve()|0, N_isVector);
			addNative(loadIsy()|0, N_isSymbol);
			addNative(loadInu()|0, N_isNull);
			addNative(loadIpa()|0, N_isPair);
			addNative(loadRea()|0, N_read);
			addNative(loadNew()|0, N_newline);
			addNative(loadDis()|0, N_display);
			addNative(loadEva()|0, N_eval);
			addNative(loadApl()|0, N_applyNat);
			addNative(loadCce()|0, N_callcc);	//TODO: optimize implementation of call/ec
			addNative(loadMap()|0, N_map);
			addNative(loadAss()|0, N_assoc);
			addNative(loadVec()|0, N_vector);
			addNative(loadVcl()|0, N_vectorLength);
			addNative(loadVcs()|0, N_vectorSet);
			addNative(loadVcr()|0, N_vectorRef);
			addNative(loadVcm()|0, N_makeVector);
			addNative(loadEql()|0, N_equal);
			addNative(loadEqu()|0, N_eq);
			addNative(loadNeq()|0, N_nbrEq);
			addNative(loadLeq()|0, N_leq);
			addNative(loadSeq()|0, N_seq);
			addNative(loadSma()|0, N_sma);
			addNative(loadLrg()|0, N_lrg);
			addNative(loadLst()|0, N_list);
			addNative(loadScd()|0, N_scd);
			addNative(loadSca()|0, N_sca);
			addNative(loadCdr()|0, N_cdr);
			addNative(loadCar()|0, N_car);
			addNative(loadCns()|0, N_cons);
			addNative(loadDiv()|0, N_div);
			addNative(loadMul()|0, N_multiply);
			addNative(loadPls()|0, N_add);
			addNative(loadMns()|0, N_sub);
		}

		function addNative(nam, ptr) {
			nam = nam|0;
			ptr = ptr|0;
			PAT = deref(nam)|0;
			OFS = defineVar()|0;
			VAL = makeNative(ptr)|0;
			vectorSet(FRM,OFS,VAL);
		}

// **********************************************************************
// ****************************** MAIN **********************************
// **********************************************************************

		function initRegs() {
			EXP = __VOID__;
			VAL = __VOID__;
			PAR = __VOID__;
			ARG = __VOID__;
			LST = __VOID__;
			DEN = __VOID__;
			DFR = __VOID__;
			DGL = __VOID__;
			ENV = __VOID__;
			FRM = __VOID__;
			GLB = __VOID__;
			PAT = __VOID__;
			SYM = __VOID__;
		}

		function init() {
			initMemory();
			initTags();
			initRegs();
			makeVector(0) => __EMPTY_VEC__;
			initExt();
			loadSymbols();
			initDictionary();
			initEnvironment();
			initNatives();
		}

		function Slip_REPL() {
			initREPL();
			run(REPL);
		}

		function inputReady() {
			run(R_read);
		}

		define __MARGIN__ 128
		define __UNIT_SIZ__ 4

		function claimCollect() {
			reclaim()
			if((available()|0) < __MARGIN__) {
				err_fatalMemory();
			}
		}

		function claimSizCollect(siz) {
			siz = siz|0;
			reclaim()
			if((available()|0) < (siz|0)) {
				err_fatalMemory();
			}
		}

		macro claim {
			case {_()} => {
				letstx $avail = [makeIdent('available', #{here})];
				letstx $coll = [makeIdent('claimCollect', #{here})];
				return #{
					if(($avail()|0) < __MARGIN__) { $coll(); }
				}
			}
		}

		macro claimSiz {
			case {_($a:expr)} => {
				letstx $avail = [makeIdent('available', #{here})];
				letstx $coll = [makeIdent('claimSizCollect', #{here})];
				return #{
					if(($avail()|0) < (((imul($a,__UNIT_SIZ__)|0)+__MARGIN__)|0)) 
					  { $coll(((imul($a,__UNIT_SIZ__)|0)+__MARGIN__)|0) }
				} 
			}
		}

		function fclaim() {
			if((available()|0) < __MARGIN__) {
				claimCollect();
			}
		}

		function fclaimSiz(amount) {
			amount = amount|0;
			amount = ((imul(amount, __UNIT_SIZ__)|0) + __MARGIN__)|0;
			if((available()|0) < (amount|0)) {
				claimSizCollect(amount);
			}
		}

		function reclaim() {

			STKALLOC(15);
			STK[14] = __EMPTY_VEC__;
			STK[13] = EXT;
			STK[12] = SYM;
			STK[11] = PAT;
			STK[10] = GLB;
			STK[9] = FRM;
			STK[8] = ENV;
			STK[7] = DGL;
			STK[6] = DFR;
			STK[5] = DEN;
			STK[4] = LST;
			STK[3] = ARG;
			STK[2] = PAR;
			STK[1] = VAL;
			STK[0] = EXP;

			collectGarbage();

			EXP = STK[0]|0;
			VAL = STK[1]|0;
			PAR = STK[2]|0;
			ARG = STK[3]|0;
			LST = STK[4]|0;
			DEN = STK[5]|0;
			DFR = STK[6]|0;
			DGL = STK[7]|0;
			ENV = STK[8]|0;
			FRM = STK[9]|0;
			GLB = STK[10]|0;
			PAT = STK[11]|0;
			SYM = STK[12]|0;
			EXT = STK[13]|0;
			__EMPTY_VEC__ = STK[14]|0;
			STKUNWIND(15);
			loadSymbols();
			__GC_COUNT__ = (__GC_COUNT__+1)|0;
		}

// **********************************************************************
// ************************** INSTRUCTIONS ******************************
// **********************************************************************

		define LBR 40
		define RBR 41
		define SHR 35
		define QUO 39
		define DQU 34
		define PLS 43
		define MIN 45
		define DOT 46
		define SLH 92
		define LTT 116
		define LTF 102

		instructions {

// **********************************************************************
// *************************** NATIVES PT1 ******************************
// **********************************************************************

			N_add {

				for(TMP=0,IDX=0;(IDX|0)<(LEN|0);IDX=(IDX+1)|0) {
					EXP = STK[IDX]|0;
					switch(tag(EXP)|0) {
						case __NBR_TAG__:
							TMP = (TMP + (numberVal(EXP)|0))|0;
							break;
						case __FLT_TAG__:
							FLT = fround(fround(TMP|0)+fround(floatNumber(EXP)));
							goto N_addFloats();
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}

				VAL = makeNumber(TMP)|0;
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_sub {

				if(!LEN) {
					err_invalidParamCount();
					goto error;
				}

				VAL = STK[0]|0;

				if((LEN|0) == 1) {
					STKUNWIND(1);
					switch(tag(VAL)|0) {
						case __NBR_TAG__:
							VAL = makeNumber(-(numberVal(VAL)|0)|0)|0;
							goto KON|0;
						case __FLT_TAG__:
							claim()
							makeFloat(fround(-fround(floatNumber(VAL)))) => VAL;
							goto KON|0;
						default:
							err_invalidArgument(VAL|0);
							goto error;
					}
				}

				switch(tag(VAL)|0) {
					case __NBR_TAG__:
						TMP = numberVal(VAL)|0;
						for(IDX=1;(IDX|0)<(LEN|0);IDX=(IDX+1)|0) {
							EXP = STK[IDX]|0;
							switch(tag(EXP)|0) {
								case __NBR_TAG__:
									TMP = (TMP - (numberVal(EXP)|0))|0;
									break;
								case __FLT_TAG__:
									FLT = fround(fround(TMP|0) - fround(floatNumber(EXP)));
									goto N_substractFloats();
								default:
									err_invalidArgument(EXP|0);
									goto error;
							}
						}
						VAL = makeNumber(TMP)|0;
						STKUNWIND(LEN);
						goto KON|0;

					case __FLT_TAG__:
						FLT = fround(floatNumber(VAL));
						goto N_substractFloats();
				}

				err_invalidArgument(VAL|0);
				goto error;
			}

			N_multiply {

				for(TMP=1,IDX=0;(IDX|0)<(LEN|0);IDX=(IDX+1)|0) {
					EXP = STK[IDX]|0;
					switch(tag(EXP)|0) {
						case __NBR_TAG__:
							TMP = imul(TMP,numberVal(EXP)|0)|0;
							break;
						case __FLT_TAG__:
							FLT = fround(fround(TMP|0)*fround(floatNumber(EXP)));
							goto N_multiplyFloats();
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}

				VAL = makeNumber(TMP)|0;
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_div {

				if(!LEN) {
					err_invalidParamCount();
					goto error;
				}

				claim()
				VAL = STK[0]|0;

				if((LEN|0) == 1) {
					STKUNWIND(1);
					switch(tag(VAL)|0) {
						case __NBR_TAG__:
							makeFloat(fround(fround(1.0)/fround(numberVal(VAL)|0))) => VAL;
							goto KON|0;
						case __FLT_TAG__:
							makeFloat(fround(fround(1.0)/fround(floatNumber(VAL)))) => VAL;
							goto KON|0;
						default:
							err_invalidArgument(VAL|0);
							goto error;
					}
				}

				switch(tag(VAL)|0) {
					case __NBR_TAG__:
						FLT = fround(numberVal(VAL)|0);
						break;
					case __FLT_TAG__:
						FLT = fround(floatNumber(VAL));
						break;
					default:
						err_invalidArgument(VAL|0);
						goto error;
				}

				for(IDX=1;(IDX|0)<(LEN|0);IDX=(IDX+1)|0) {
					EXP = STK[IDX]|0;
					switch(tag(EXP)|0) {
						case __NBR_TAG__:
							FLT = fround(FLT/fround(numberVal(EXP)|0));
							 break;
						case __FLT_TAG__:
							FLT = fround(FLT/fround(floatNumber(EXP)));
							break;
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}

				makeFloat(FLT) => VAL;
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_cons {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				claim()
				VAL = makePair(STK[0]|0,STK[1]|0)|0;
				STKUNWIND(2);
				goto KON|0;
			}

			N_free {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = free(numberVal(STK[0]|0)|0)|0;
				printLog(EXT|0);
				STKUNWIND(1);
				goto KON|0;
			}

			N_ref {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = makeNumber(ref(STK[0]|0)|0)|0;
				printLog(EXT|0);
				STKUNWIND(1);
				goto KON|0;
			}


			N_car {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				STKUNWIND(1);
				if(isPair(ARG)|0) {
					VAL = pairCar(ARG)|0;
					goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_cdr {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				STKUNWIND(1);
				if(isPair(ARG)|0) {
					VAL = pairCdr(ARG)|0;
					goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_sca {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				VAL = STK[1]|0;
				STKUNWIND(2);

				if(isPair(ARG)|0) {
					pairSetCar(ARG, VAL);
					goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_scd {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				VAL = STK[1]|0;
				STKUNWIND(2);

				if(isPair(ARG)|0) {
					pairSetCdr(ARG, VAL);
					goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_list {

				claimSiz(imul(3,LEN)|0)
				VAL = __NULL__;
				for(IDX=(LEN-1)|0;(IDX|0)>=0;IDX=(IDX-1)|0)
					VAL = makePair(STK[IDX]|0, VAL)|0;
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_nbrEq {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				switch(tag(ARG)|0) {

					case __NBR_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (((numberVal(ARG)|0) == (numberVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(numberVal(ARG)|0) == fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLT_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (fround(floatNumber(ARG)) == fround(numberVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(floatNumber(ARG)) == fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_seq {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				switch(tag(ARG)|0) {

					case __NBR_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (((numberVal(ARG)|0) <= (numberVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(numberVal(ARG)|0) <= fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLT_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (fround(floatNumber(ARG)) <= fround(numberVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(floatNumber(ARG)) <= fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_leq {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				switch(tag(ARG)|0) {

					case __NBR_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (((numberVal(ARG)|0) >= (numberVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(numberVal(ARG)|0) >= fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLT_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (fround(floatNumber(ARG)) >= fround(numberVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(floatNumber(ARG)) >= fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_sma {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				switch(tag(ARG)|0) {

					case __NBR_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (((numberVal(ARG)|0) < (numberVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(numberVal(ARG)|0) < fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLT_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (fround(floatNumber(ARG)) < fround(numberVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(floatNumber(ARG)) < fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_lrg {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				switch(tag(ARG)|0) {

					case __NBR_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (((numberVal(ARG)|0) > (numberVal(EXP)|0)) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(numberVal(ARG)|0) > fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLT_TAG__:
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								VAL = (fround(floatNumber(ARG)) > fround(numberVal(EXP)|0) ?
											__TRUE__ : __FALSE__);
								goto KON|0;
							case __FLT_TAG__:
								VAL = (fround(floatNumber(ARG)) > fround(floatNumber(EXP)) ?
									   		__TRUE__ : __FALSE__);
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}
				err_invalidArgument(ARG|0);
				goto error;
			}

			N_assoc {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				PAT = STK[0]|0;
				LST = STK[1]|0;
				STKUNWIND(2);

				while(isPair(LST)|0) {
					VAL = pairCar(LST)|0;
					if(!(isPair(VAL)|0)) {
						err_invalidArgument(LST|0);
						goto error;
					}
					if((pairCar(VAL)|0) == (PAT|0)) {
						goto KON|0;
					}
					LST = pairCdr(LST)|0;
				}

				VAL = __FALSE__;
				goto KON|0;
			}

			N_map {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				VAL = STK[0]|0;
				LST = STK[1]|0;
				STKUNWIND(2);

				if((LST|0) == __NULL__) {
					VAL = __NULL__;
					goto KON|0;
				}

				if(!(isPair(LST)|0)) {
					err_invalidArgument(LST|0);
					goto error;
				}

				claim()
				ARG = makePair(pairCar(LST)|0, __NULL__)|0;
				LST = pairCdr(LST)|0;

				if(isNull(LST)|0) {
					STKALLOC(2);
					STK[1] = KON;
					STK[0] = __NULL__;
					KON = N_c1_map;
				} else {
					STKALLOC(4);
					STK[3] = KON;
					STK[2] = __NULL__;
					STK[1] = VAL;
					STK[0] = LST;
					KON = N_c2_map;
				}

				goto N_apply;
			}

			N_eval {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				claim()
				EXP = STK[0]|0;
				STKALLOC(2);
				STK[2] = KON;
				STK[1] = ENV;
				STK[0] = FRM;
				KON = N_c_eval;
				TLC = __TRUE__;
				goto C_compile();
			}

			N_applyNat {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				VAL = STK[0]|0;
				ARG = STK[1]|0;
				STKUNWIND(2);
				
				goto N_apply();
			}

			N_display {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				printLog(STK[0]|0);
				VAL = __VOID__;
				STKUNWIND(1);
				goto KON|0;
			}

			N_newline {

				printNewline();
				VAL = __VOID__;
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_read {

				switch(LEN|0) {
					case 0:
						promptUserInput();
						halt;
					case 1:
						EXP = STK[0]|0;
						STKUNWIND(1);
						loadFile(EXP|0);
						halt;
				}
				err_invalidParamCount();
				goto error;
			}

			N_isPair {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(STK[0]|0)|0) == __PAI_TAG__? __TRUE__ : __FALSE__ );
				STKUNWIND(1);
				goto KON|0;
			}

			N_isNull {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(STK[0]|0)|0) == __NUL_TAG__ ? __TRUE__ : __FALSE__ );
				STKUNWIND(1);
				goto KON|0;
			}

			N_isSymbol {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(STK[0]|0)|0) == __SYM_TAG__ ? __TRUE__ : __FALSE__ );
				STKUNWIND(1);
				goto KON|0;
			}

			N_isVector {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(STK[0]|0)|0) == __VCT_TAG__ ? __TRUE__ : __FALSE__ );
				STKUNWIND(1);
				goto KON|0;
			}

			N_isString {

				if ((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((tag(STK[0]|0)|0) == __STR_TAG__ ? __TRUE__ : __FALSE__ );
				STKUNWIND(1);
				goto KON|0;
			}

			N_makeVector {

				if(!LEN) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				STKUNWIND(1);

				if(!(isNumber(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				LEN = numberVal(ARG)|0;
				if ((LEN|0) < 0) {
					err_invalidLength(LEN|0);
					goto error;
				}

				if (LEN) {
					claimSiz(LEN)
					TMP = (LEN? __ZERO__:(vectorRef(PAR, 2)|0));
					fillVector(LEN, TMP) => VAL;
				} else {
					VAL = __EMPTY_VEC__;
				}

				goto KON|0;
			}

			N_vectorRef {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				if (!(isVector(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				if(!(isNumber(EXP)|0)) {
					err_invalidArgument(EXP|0);
					goto error;
				}

				IDX = numberVal(EXP)|0;
				LEN = vectorLength(ARG)|0;
				if(0 <= (IDX|0) & (IDX|0) < (LEN|0)) {
					VAL = vectorRef(ARG, (IDX+1)|0)|0;
					goto KON|0;
				}

				err_invalidRange(IDX|0, 0, (LEN-1)|0);
				goto error;
			}

			N_vectorSet {

				if ((LEN|0) != 3) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				VAL = STK[2]|0;
				STKUNWIND(3);

				if (!(isVector(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				if(!(isNumber(EXP)|0)) {
					err_invalidArgument(EXP|0);
					goto error;
				}

				IDX = numberVal(EXP)|0;
				LEN = vectorLength(ARG)|0;
				if(0 <= (IDX|0) & (IDX|0) < (LEN|0)) {
					vectorSet(ARG, (IDX+1)|0, VAL);
					goto KON|0;
				}

				err_invalidRange(IDX|0, 0, (LEN-1)|0);
				goto error;
			}

			N_vectorLength {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				STKUNWIND(1);
				if(!(isVector(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				LEN = vectorLength(ARG)|0;
				VAL = makeNumber(LEN)|0;
				goto KON|0;
			}

			N_vector {

				claimSiz(LEN)
				makeVector(LEN) => VAL;
				for(IDX=0;(IDX|0)<(LEN|0);IDX=TMP) {
					EXP = STK[IDX]|0;
					TMP = (IDX+1)|0;
					vectorSet(VAL,TMP,EXP);
				}
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_clock {

				if(LEN) {
					err_invalidParamCount();
					goto error;
				}

				VAL = makeNumber(clock()|0)|0;
				goto KON|0;
			}

			N_reset {

				if(LEN) {
					err_invalidParamCount();
					goto error;
				}

				reset();
				VAL = __VOID__;
				goto KON|0;
			}

			N_eq {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				VAL = ((STK[0]|0)==(STK[1]|0)? __TRUE__:__FALSE__);
				STKUNWIND(2);
				goto KON|0;
			}

			N_equal {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				EXP = STK[0]|0;
				ARG = STK[1]|0;
				STKUNWIND(2);

				goto N_compare();
			}

			N_collect {

				reclaim()
				VAL = makeNumber(available()|0)|0;
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_available {

				VAL = makeNumber(available()|0)|0;
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_callcc {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				VAL = STK[0]|0;
				STKUNWIND(1);

				switch(tag(VAL)|0) {
					case __PRC_TAG__:
					case __PRZ_TAG__:
					case __NAT_TAG__:
					case __CNT_TAG__:
						ARG = currentStack()|0;
						ARG = makeContinuation(KON, FRM, ENV, ARG)|0;
						ARG = makePair(ARG, __NULL__)|0;
						goto N_apply();
				}

				err_invalidArgument(VAL|0);
				goto error;
			}

			N_stringRef {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				if(!(isString(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				if(!(isNumber(EXP)|0)) {
					err_invalidArgument(EXP|0);
					goto error;
				}

				IDX = numberVal(EXP)|0;
				LEN = textLength(ARG)|0;
				if(0 <= (IDX|0) & (IDX|0) < (LEN|0)) {
					VAL = makeChar(textGetChar(ARG, IDX)|0)|0;
					goto KON|0;
				}

				err_invalidRange(IDX|0, 0, (LEN-1)|0);
				goto error;
			}

			N_stringSet {

				if((LEN|0) != 3) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				VAL = STK[2]|0;
				STKUNWIND(3);

				if (!(isString(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				if(!(isNumber(EXP)|0)) {
					err_invalidArgument(EXP|0);
					goto error;
				}

				if(!(isChar(VAL)|0)) {
					err_invalidArgument(VAL|0);
					goto error;
				}

				IDX = numberVal(EXP)|0;
				LEN = textLength(ARG)|0;
				if(0 <= (IDX|0) & (IDX|0) < (LEN|0)) {
					textSetChar(ARG, IDX, charCode(VAL)|0);
					goto KON|0;
				}

				err_invalidRange(IDX|0, 0, (LEN-1)|0);
				goto error;
			}

			N_stringLength {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				STKUNWIND(1);
				if(!(isString(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				VAL = makeNumber(textLength(ARG)|0)|0;
				goto KON|0;
			}

			N_random {

				if(LEN) {
					err_invalidParamCount();
					goto error;
				}

				claim()
				makeFloat(fround(+random())) => VAL;
				goto KON|0;
			}

			N_load {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				if(!(isString(ARG)|0)) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				claim()
				STKALLOC(2);
				STK[2] = KON;
				STK[1] = ENV;
				STK[0] = FRM;
				KON = N_c1_load;
				loadFile(ARG|0);
				halt;
			}

			N_quotient {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				switch(tag(ARG)|0) {

					case __NBR_TAG__:

						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								TMP = ((numberVal(ARG)|0)/(numberVal(EXP)|0))|0;
								VAL = makeNumber(TMP)|0;
								goto KON|0;
							case __FLT_TAG__:
								FLT = fround(numberVal(ARG)|0);
								FLT = fround(FLT/fround(floatNumber(EXP)));
								VAL = makeNumber(~~FLT)|0;
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLT_TAG__:

						FLT = fround(floatNumber(ARG));
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								FLT = fround(FLT/fround(numberVal(EXP)|0));
								VAL = makeNumber(~~FLT)|0;
								goto KON|0;
							case __FLT_TAG__:
								FLT = fround(FLT/fround(floatNumber(EXP)));
								VAL = makeNumber(~~FLT)|0;
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_remainder {

				if((LEN|0) != 2) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				EXP = STK[1]|0;
				STKUNWIND(2);

				switch(tag(ARG)|0) {

					case __NBR_TAG__:

						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								TMP = ((numberVal(ARG)|0)%(numberVal(EXP)|0))|0;
								VAL = makeNumber(TMP)|0;
								goto KON|0;
							case __FLT_TAG__:
								claim()
								REA = +((+(numberVal(ARG)|0))%(+(fround(floatNumber(EXP)))))
								makeFloat(fround(REA)) => VAL;
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;

					case __FLT_TAG__:

						claim()
						REA = +fround(floatNumber(ARG));
						switch(tag(EXP)|0) {
							case __NBR_TAG__:
								REA = +(REA%(+(numberVal(EXP)|0)));
								makeFloat(fround(REA)) => VAL;
								goto KON|0;
							case __FLT_TAG__:
								REA = +(REA%(+fround(floatNumber(EXP))));
								makeFloat(fround(REA)) => VAL;
								goto KON|0;
						}
						err_invalidArgument(EXP|0);
						goto error;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_error {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = vectorRef(PAR, 1)|0;
				STKUNWIND(1);
				printError(ARG|0);
				goto error;
			}

			N_length {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				LEN = 0;
				ARG = STK[0]|0;
				STKUNWIND(1);
				while(isPair(ARG)|0) {
					ARG = pairCdr(ARG)|0;
					LEN = (LEN + 1)|0;
				}

				if((ARG|0) != __NULL__) {
					err_invalidArgument(ARG|0);
					goto error;
				}

				VAL = makeNumber(LEN)|0;
				goto KON|0;
			}

			N_sin {

				if((LEN|0) != 1) {
					err_invalidParamCount();
					goto error;
				}

				ARG = STK[0]|0;
				STKUNWIND(1);
				claim()

				switch(tag(ARG)|0) {
					case __NBR_TAG__:
						REA = +sin(+(numberVal(ARG)|0));
						makeFloat(fround(REA)) => VAL;
						goto KON|0;
					case __FLT_TAG__:
						REA = +sin(+(fround(floatNumber(ARG))));
						makeFloat(fround(REA)) => VAL;
						goto KON|0;
				}

				err_invalidArgument(ARG|0);
				goto error;
			}

			N_exit {

				halt;
			}

// **********************************************************************
// ***************************** READER *********************************
// **********************************************************************

			R_read {

				switch (look()|0) {

					case LBR: goto R_readLBR;
					case SHR: goto R_readSHR;
					case QUO: goto R_readQUO;
					case DQU:
						VAL = readString()|0;
						goto KON|0;
					case PLS: case MIN: case 48:
					case 49: case 50: case 51:
					case 52: case 53: case 54:
					case 55: case 56: case 57:
						VAL = readNumber()|0;
						goto KON|0;
				}

				VAL = readSymbol()|0;
				goto KON|0;
			}

			R_readLBR {

				skip();
				if ((look()|0) == RBR) {
					skip();
					VAL = __NULL__;
					goto KON|0;
				}
				claim()
				push(KON);
				push(__ZERO__);
				KON = R_c1_LBR;
				goto R_read;
			}

			R_c1_LBR {

				claim()
				if ((look()|0) == RBR) {
					skip();
					VAL = makePair(VAL, __NULL__)|0;
					goto R_c3_LBR;
				}
				IDX = numberVal(peek()|0)|0;
				poke(VAL);
				push((makeNumber((IDX+1)|0))|0);
				if ((look()|0) == DOT) {
					skip();
					KON = R_c2_LBR;
				}
				goto R_read;
			}

			R_c2_LBR {

				if ((look()|0) != RBR) {
					err_expectedRBR(look()|0);
					goto error;
				}

				skip();
				goto R_c3_LBR;
			}

			R_c3_LBR {

				IDX = numberVal(pop()|0)|0;
				for(;IDX;IDX=(IDX-1)|0) {
					claim()
					VAL = makePair(pop()|0, VAL)|0;
				}
				KON = pop()|0;
				goto KON|0;
			}

			R_readQUO {

				claim()
				skip();
				push(KON);
				KON = R_c_QUO;
				goto R_read;
			}

			R_c_QUO {

				claim()
				VAL = makePair(VAL, __NULL__)|0;
				VAL = makePair(__QUO_SYM__, VAL)|0;
				KON = pop()|0;
				goto KON|0;
			}

			R_readSHR {

				skip();
				switch(read()|0) {
					case LTT:
						VAL = __TRUE__;
						goto KON|0;
					case LTF:
						VAL = __FALSE__;
						goto KON|0;
					case SLH:
						VAL = makeChar(read()|0)|0;
						goto KON|0;
					case LBR:
						claim()
						if ((look()|0) == RBR) {
							skip();
							VAL = makePair(__VEC_SYM__, __NULL__)|0;
							goto KON|0;
						}
						push(KON);
						push(__ONE__);
						KON = R_c_vector;
						goto R_read;
				}

				err_invalidSyntax();
				goto error;
			}

			R_c_vector {

				if ((look()|0) == RBR) {
					skip();
					LEN = numberVal(pop()|0)|0;
					claimSiz(imul(3,LEN)|0)
					VAL = makePair(VAL, __NULL__)|0;
					for(LEN=(LEN-1)|0;LEN;LEN=(LEN-1)|0)
						VAL = makePair(pop()|0, VAL)|0;
					VAL = makePair(__VEC_SYM__, VAL)|0;
					KON = pop()|0;
					goto KON|0;
				}

				claim()
				IDX = numberVal(peek()|0)|0;
				poke(VAL);
				push(makeNumber((IDX+1)|0)|0);
				goto R_read;
			}

// **********************************************************************
// **************************** COMPILER ********************************
// **********************************************************************

			//TODO: compiler in plain JS
			C_compile_alt {

				VAL = compile(EXP|0)|0;
				goto KON|0;
			}

			C_compile {

				if(isPair(EXP)|0) {

					LST = pairCdr(EXP)|0;
					EXP = pairCar(EXP)|0;

					if(isSymbol(EXP)|0) {

						if((EXP|0) == (__IFF_SYM__|0)) {
							goto C_compileIf();
						} else if((EXP|0) == (__DEF_SYM__|0)){
							goto C_compileDefine();
						} else if((EXP|0) == (__BEG_SYM__|0)){
							goto C_compileSequence();
						} else if((EXP|0) == (__LMB_SYM__|0)){
							goto C_compileLambda();
						} else if((EXP|0) == (__SET_SYM__|0)){
							goto C_compileSet();
						} else if((EXP|0) == (__QUO_SYM__|0)){
							goto C_compileQuote();
						}
					}

					goto C_compileApplication();
				}

				if(isSymbol(EXP)|0) {
					goto C_compileSymbol();
				}

				VAL = EXP;
				goto KON|0;
			}

			C_compileSymbol {

				claim()
				PAT = EXP;
				lexicalAdr();

				if(OFS) {
					if(SCP) {						
						VAL = ((SCP|0) == 1?
								(makeGlobal(OFS)|0):
								(makeNlc(SCP,OFS)|0));
					} else {
						VAL = makeLocal(OFS)|0;
					}
					goto KON|0;
				}

				err_undefinedVariable(PAT|0);
				goto error;
			}

			C_compileSequence {

				if(isNull(LST)|0) {
					VAL = __VOID__;
					goto KON|0;
				}

				if(!(isPair(LST)|0)) {
					err_invalidSequence();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(!(isNull(LST)|0)) {
					claim()
					STKALLOC(4);
					STK[3] = KON;
					STK[2] = __ONE__;
					STK[1] = LST;
					STK[0] = TLC;
					TLC = __FALSE__;
					KON = C_c1_sequence;
				}

				goto C_compile;
			}

			C_c1_sequence {

				TLC = pop()|0;
				LST = pop()|0;
				LEN = numberVal(peek()|0)|0;
				poke(VAL);
				push(makeNumber((LEN+1)|0)|0);

				if (!(isPair(LST)|0)) {
					err_invalidSequence();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(isNull(LST)|0) {
					KON = C_c2_sequence;
				} else {
					claim()
					push(LST);
					push(TLC);
					TLC = __FALSE__;
					KON = C_c1_sequence;
				}

				goto C_compile;
			}

			C_c2_sequence {

				LEN = numberVal(pop()|0)|0;
				claimSiz(LEN);
				EXP = makeStl(VAL)|0;
				VAL = makeSequence(LEN)|0;
				sequenceSet(VAL,LEN,EXP);
				for(LEN=(LEN-1)|0;LEN;LEN=(LEN-1)|0)
					sequenceSet(VAL,LEN,pop()|0);
				KON = pop()|0;
				goto KON|0;
			}

			C_compileQuote {

				if(!(isPair(LST)|0)) {
					err_invalidQuote();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(isNull(LST)|0) {
					claim()
					VAL = makeQuo(EXP)|0;
					goto KON|0;
				}

				err_invalidQuote();
				goto error;
			}

			C_compileInline {

				claim()
				enterScope();
				push(EXP);
				push(TLC);
				push(KON);
				TLC = __TRUE__;
				KON = C_c_compileInline;
				goto C_compile;
			}

			C_c_compileInline {

				SIZ = exitScope()|0;
				KON = pop()|0;
				TLC = pop()|0;
				EXP = pop()|0;

				if (SIZ) {
					//claim()
					SIZ = makeNumber(SIZ)|0;
					VAL = ((TLC|0) == __TRUE__ ? 
							(makeTtk(VAL,SIZ)|0):
							(makeThk(VAL,SIZ)|0));
					goto KON|0;
				}

				goto C_compile;
			}

			C_compileIf {

				if(!(isPair(LST)|0)) {
					err_invalidIf();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(!(isPair(LST)|0)) {
					err_invalidIf();
					goto error;
				}

				claim()
				push(KON);
				push(LST);
				push(TLC);
				TLC = __FALSE__;
				KON = C_c1_if;
				goto C_compile;
			}

			C_c1_if {

				TLC = pop()|0;
				LST = peek()|0;
				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;
				poke(VAL);

				if(isNull(LST)|0) {
					KON = C_c2_if;
					goto C_compileInline;
				}

				if(isPair(LST)|0) {
					claim()
					push(LST);
					push(TLC);
					KON = C_c3_if;
					goto C_compileInline;
				}

				err_invalidIf();
				goto error;
			}

			C_c2_if {

				claim()
				VAL = makeIfs(pop()|0, VAL)|0;
				KON = pop()|0;
				goto KON|0;
			}

			C_c3_if {

				TLC = pop()|0;
				LST = peek()|0;
				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;
				poke(VAL);

				if(!(isNull(LST)|0)) {
					err_invalidIf();
					goto error;
				}

				KON = C_c4_if;
				goto C_compileInline;
			}

			C_c4_if {

				claim()
				EXP = pop()|0;
				VAL = makeIff(pop()|0, EXP, VAL)|0;
				KON = pop()|0;
				goto KON|0;
			}			

			C_compileParameters {

				for(LST=PAR;isPair(LST)|0;LST=pairCdr(LST)|0) {
						PAT = pairCar(LST)|0;
						if(!(isSymbol(PAT)|0)) {
							err_invalidParameter(PAT|0);
							goto error;
						}
						claim()
						defineVar()|0;
				}
				goto KON|0;
			}


			C_compileDefine {

				claim()
				if (!(isPair(LST)|0)) {
					err_invalidDefine();
					goto error;
				}

				PAT = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				push(KON);

				switch(tag(PAT)|0) {

					case __SYM_TAG__:
						if(!(isPair(LST)|0)) {
							err_invalidDefine();
							goto error;
						}
						EXP = pairCar(LST)|0;
						LST = pairCdr(LST)|0;
						if(!(isNull(LST)|0)) {
							err_invalidDefine();
							goto error;
						}
						OFS = defineVar()|0;
						push(makeNumber(OFS)|0);
						TLC = __FALSE__;
						KON = C_c1_define;
						goto C_compile;

					case __PAI_TAG__:
						PAR = pairCdr(PAT)|0;
						PAT = pairCar(PAT)|0;
						if(!(isSymbol(PAT)|0)) {
							err_invalidDefine();
							goto error;
						}
						OFS = defineVar()|0;
						push(makeNumber(OFS)|0);
						push(LST);
						enterScope();
						KON = C_c2_define;
						goto C_compileParameters;
				}

				err_invalidDefine();
				goto error;
			}

			C_c1_define {

				claim()
				OFS = pop()|0;
				KON = pop()|0;
				VAL = makeDfv(OFS, VAL)|0;
				goto KON|0;
			}

			C_c2_define {

				SIZ = makeNumber(currentFrmSiz)|0;
				TLC = __TRUE__;

				switch(tag(LST)|0) {

					case __NUL_TAG__:
						LST = peek()|0;
						poke(SIZ);
						KON = C_c3_define;
						goto C_compileSequence;

					case __SYM_TAG__:
						claim()
						PAT = LST;
						defineVar()|0;
						LST = peek()|0;
						poke(SIZ);
						KON = C_c4_define;
						goto C_compileSequence;
				}

				err_invalidDefine();
				goto error;
			}

			C_c3_define {

				claim()
				SIZ = makeNumber(exitScope()|0)|0;	//total frame size
				TMP = pop()|0; 							//argument count
				OFS = pop()|0;							//offset
				VAL = makeDff(OFS, TMP, SIZ, VAL)|0;
				KON = pop()|0;
				goto KON|0;
			}

			C_c4_define {

				claim()
				SIZ = makeNumber(exitScope()|0)|0;	//total frame size
				TMP = pop()|0; 							//argument count
				OFS = pop()|0;							//offset
				VAL = makeDfz(OFS, TMP, SIZ, VAL)|0;
				KON = pop()|0;
				goto KON|0;
			}

			C_compileSet {

				claim()

				if(!(isPair(LST)|0)) {
					err_invalidAssignment();
					goto error;
				}

				PAT = pairCar(LST)|0;

				if(!(isSymbol(PAT)|0)) {
					err_invalidAssignment();
					goto error;
				}

				LST = pairCdr(LST)|0;

				if(!(isPair(LST)|0)) {
					err_invalidAssignment();
					goto error;
				}

				EXP = pairCar(LST)|0;
				LST = pairCdr(LST)|0;

				if(!(isNull(LST)|0)) {
					err_invalidAssignment();
					goto error;
				}

				//NOTE: original C implementation first compiles expression...
				//... then looks up the pattern, so that statements such as:
				//(set! x (begin (define x 2) 'foo)) are valid.
				push(KON);
				push(PAT);
				TLC = __FALSE__;
				KON = C_c_set;
				goto C_compile;
			}

			C_c_set {

				claim()
				PAT = pop()|0;
				lexicalAdr();

				if (OFS) {
					OFS = makeNumber(OFS)|0;
					if(SCP) {
						SCP = makeNumber(SCP)|0;
						VAL = makeSgl(SCP, OFS, VAL)|0;
					} else {
						VAL = makeSlc(OFS, VAL)|0;
					}
					KON = pop()|0;
					goto KON|0;
				}

				err_undefinedVariable(PAT|0);
				goto error;
			}			

			C_compileLambda {

				if(!(isPair(LST)|0)) {
					err_invalidLambda();
					goto error;
				}

				claim()
				enterScope();
				PAR = pairCar(LST)|0;
				push(KON);
				push(pairCdr(LST)|0);
				KON = C_c1_lambda;
				goto C_compileParameters;
			}

			C_c1_lambda {

				SIZ = makeNumber(currentFrmSiz)|0;
				TLC = __TRUE__;

				switch(tag(LST)|0) {

					case __NUL_TAG__:
						LST = peek()|0;
						poke(SIZ);
						KON = C_c2_lambda;
						goto C_compileSequence;

					case __SYM_TAG__:
						claim()
						PAT = LST;
						defineVar()|0;
						LST = peek()|0;
						poke(SIZ);
						KON = C_c3_lambda;
						goto C_compileSequence;
				}

				err_invalidLambda();
				goto error;
			}

			C_c2_lambda {

				claim()
				SIZ = makeNumber(exitScope()|0)|0;
				TMP = pop()|0;
				VAL = makeLmb(TMP, SIZ, VAL)|0;
				KON = pop()|0;
				goto KON|0;
			}

			C_c3_lambda {

				claim()
				SIZ = makeNumber(exitScope()|0)|0;
				TMP = pop()|0;
				VAL = makeLmz(TMP, SIZ, VAL)|0;
				KON = pop()|0;
				goto KON|0;
			}

			C_compileApplication {

				claim()
				push(KON);

				if(isNull(LST)|0) {
					KON = C_c1_application;
					push(TLC);
				} else {
					push(__ZERO__);
					push(LST);
					push(TLC);
					TLC = __FALSE__;
					KON = C_c2_application;
				}

				goto C_compile;
			}

			C_c1_application {

				claim()
				TLC = pop()|0;
				KON = pop()|0;

				switch(tag(VAL)|0) {

					case __LCL_TAG__:
						OFS = localOfs(VAL)|0;
						VAL = ((TLC|0) == __TRUE__?
							makeTlz(OFS)|0:
							makeAlz(OFS)|0);
						goto KON|0;

					case __GLB_TAG__:
						OFS = globalOfs(VAL)|0;
						VAL = ((TLC|0) == __TRUE__?
							makeTgz(OFS)|0:
							makeAgz(OFS)|0);
						goto KON|0;

					case __NLC_TAG__:
						SCP = nlcScp(VAL)|0;
						OFS = nlcOfs(VAL)|0;
						VAL = ((TLC|0) == __TRUE__?
							makeTnz(SCP, OFS)|0:
							makeAnz(SCP, OFS)|0);
						goto KON|0;
				}

				VAL = ((TLC|0) == __TRUE__?
					makeTpz(VAL)|0:
					makeApz(VAL)|0);
				goto KON|0;
			}

			C_c2_application {

				TLC = pop()|0;
				ARG = pop()|0;
				LEN = numberVal(peek()|0)|0;
				poke(VAL);
				push(makeNumber((LEN+1)|0)|0);

				if(!(isPair(ARG)|0)) {
					err_invalidApplication();
					goto error;
				}

				EXP = pairCar(ARG)|0;
				ARG = pairCdr(ARG)|0;

				if(isNull(ARG)|0) {
					KON = C_c3_application;
					push(TLC);
				} else {
					claim()
					push(ARG);
					push(TLC);
					TLC = __FALSE__;
				}

				goto C_compile;
			}

		 	C_c3_application {

		 		TLC = pop()|0;
		 		LEN = numberVal(pop()|0)|0;
		 		claimSiz(LEN)
		 		makeVector(LEN) => EXP;
		 		vectorSet(EXP, LEN, VAL);
		 		for(LEN=(LEN-1)|0;LEN;LEN=(LEN-1)|0)
		 			vectorSet(EXP, LEN, pop()|0)
		 		VAL = pop()|0;
		 		KON = pop()|0;

		 		switch(tag(VAL)|0) {

		 			case __LCL_TAG__:
		 				OFS = makeNumber(localOfs(VAL)|0)|0;
		 				VAL = ((TLC|0) == __TRUE__?
		 					makeTll(OFS, EXP)|0:
		 					makeAll(OFS, EXP)|0);
		 				goto KON|0;

		 			case __GLB_TAG__:
		 				OFS = makeNumber(globalOfs(VAL)|0)|0;
		 				VAL = ((TLC|0) == __TRUE__?
		 					makeTgl(OFS, EXP)|0:
		 					makeAgl(OFS, EXP)|0);
		 				goto KON|0;		 				

		 			case __NLC_TAG__:
		 				SCP = makeNumber(nlcScp(VAL)|0)|0;
		 				OFS = makeNumber(nlcOfs(VAL)|0)|0;
		 				VAL = ((TLC|0) == __TRUE__?
		 					makeTnl(SCP, OFS, EXP)|0:
		 					makeAnl(SCP, OFS, EXP)|0);
		 				goto KON|0;
		 		}		

		 		VAL = ((TLC|0) == __TRUE__?
		 				makeTpl(VAL, EXP)|0:
		 				makeApl(VAL, EXP)|0);
		 		goto KON|0;
		 	}

// **********************************************************************
// *************************** EVALUATOR ********************************
// **********************************************************************

			E_eval {

				switch(tag(EXP)|0) {

					case __NUL_TAG__:
					case __VOI_TAG__:
					case __TRU_TAG__:
					case __FLS_TAG__:
					case __NBR_TAG__:
					case __CHR_TAG__:
					case __PAI_TAG__:
					case __PRC_TAG__:
					case __VCT_TAG__:
					case __STR_TAG__:
					case __FLT_TAG__:
					case __NAT_TAG__:
					case __CNT_TAG__:
						VAL = EXP;
						goto KON|0;
					case __QUO_TAG__:
						VAL = quoExpression(EXP)|0;
						goto KON|0;
					case __LCL_TAG__:
						lookupLocal EXP => VAL
						goto KON|0;
					case __GLB_TAG__:
						lookupGlobal EXP => VAL
						goto KON|0;
					case __NLC_TAG__:
						lookupNlc EXP => VAL
						goto KON|0;
					case __LMB_TAG__:
						VAL = capturePrc(EXP);
						goto KON|0;
					case __LMZ_TAG__:
						VAL = capturePrz(EXP);
						goto KON|0;
					case __SLC_TAG__:
						goto E_setLocal();
					case __SGL_TAG__:
						goto E_setGlobal();
					case __DFV_TAG__:
						goto E_evalDfv();
					case __DFF_TAG__:
						goto E_evalDff();
					case __DFZ_TAG__:
						goto E_evalDfz();
					case __SEQ_TAG__:
					 	goto E_evalSeq();
					case __STL_TAG__:
						goto E_evalStl();
					case __IFS_TAG__:
						goto E_evalIfs();
					case __IFF_TAG__:
						goto E_evalIff();
					case __TTK_TAG__:
						goto E_evalTtk();
					case __THK_TAG__:
						goto E_evalThk();
					case __ALZ_TAG__:
						goto E_evalAlz();
					case __ANZ_TAG__:
						goto E_evalAnz();
					case __AGZ_TAG__:
						goto E_evalAgz();
					case __APZ_TAG__: 
						goto E_evalApz();
					case __APL_TAG__:
						goto E_evalApl();
					case __ALL_TAG__:
						goto E_evalAll();
					case __ANL_TAG__:
						goto E_evalAnl();
					case __AGL_TAG__:
						goto E_evalAgl();
					case __TLZ_TAG__:
						goto E_evalTlz();
					case __TNZ_TAG__:
						goto E_evalTnz();
					case __TGZ_TAG__:
						goto E_evalTgz();
					case __TPZ_TAG__:
						goto E_evalTpz();
					case __TPL_TAG__:
						goto E_evalTpl();
					case __TLL_TAG__:
						goto E_evalTll();
					case __TNL_TAG__:
						goto E_evalTnl();
					case __TGL_TAG__:
						goto E_evalTgl();
				}

				err_invalidExpression(EXP|0);
				goto error;
			}

			E_setLocal {
				
				claim()
				STKALLOC(2);
				STK[1] = KON;
				STK[0] = slcOfs(EXP)|0;
				EXP = slcVal(EXP)|0;
				KON = E_c_setLocal;
				goto E_eval();
			}

			E_c_setLocal {

				OFS = numberVal(STK[0]|0)|0;
				KON = STK[1]|0;
				vectorSet(FRM, OFS, VAL);
				STKUNWIND(2);
				goto KON|0;
			}

			E_setGlobal {

				claim()
				STKALLOC(3);
				STK[2] = KON;
				STK[1] = sglScp(EXP)|0;
				STK[0] = sglOfs(EXP)|0;
				EXP = sglVal(EXP)|0;
				KON = E_c_setGlobal;
				goto E_eval();
			}

			E_c_setGlobal {

				OFS = numberVal(STK[0]|0)|0;
				SCP = numberVal(STK[1]|0)|0;
				KON = STK[2]|0;
				vectorSet(vectorRef(ENV,SCP)|0,OFS,VAL);
				STKUNWIND(3);
				goto KON|0;
			}

			E_evalDfv {

				claim()
				STKALLOC(2);
				STK[1] = KON;
				STK[0] = dfvOfs(EXP)|0;
				EXP = dfvVal(EXP)|0;
				KON = E_c_evalDfv;
				goto E_eval();
			}

			E_c_evalDfv {

				OFS = numberVal(STK[0]|0)|0;
				KON = STK[1]|0;
				vectorSet(FRM, OFS, VAL);
				STKUNWIND(2);
				goto KON|0;
			}

			E_evalDff {

				DCT = extendEnv()|0;
				VAL = makePrc(dffArgc(EXP)|0,
							  dffFrmSiz(EXP)|0,
							  dffBdy(EXP)|0,
							  DCT)|0;
				OFS = numberVal(dffOfs(EXP)|0)|0;
				vectorSet(FRM, OFS, VAL);
				goto KON|0;
			}	

			E_evalDfz {

				DCT = extendEnv()|0;
				VAL = makePrz(dfzArgc(EXP)|0,
							  dfzFrmSiz(EXP)|0,
							  dfzBdy(EXP)|0,
							  DCT)|0;
				OFS = numberVal(dfzOfs(EXP)|0)|0;
				vectorSet(FRM, OFS, VAL);
				goto KON|0;
			}		

			E_evalSeq {

				claim()
				STKALLOC(3);
				STK[2] = KON;
				STK[1] = EXP;
				STK[0] = __TWO__;
				EXP = sequenceRef(EXP, 1)|0;
				KON = E_c_sequence;
				goto E_eval();
			}

			E_c_sequence {

				IDX = numberVal(STK[0]|0)|0;
				EXP = sequenceRef(STK[1]|0, IDX)|0;
				STK[0] = makeNumber((IDX+1)|0)|0;
				goto E_eval();
			}

			E_evalStl {

				EXP = stlExp(EXP)|0;
				KON = STK[2]|0;
				STKUNWIND(3);
				goto E_eval();
			}

			E_evalIfs {

				claim()
				STKALLOC(2);
				STK[1] = KON;
				STK[0] = ifsConsequence(EXP)|0;
				EXP = ifsPredicate(EXP)|0;
				KON = E_c_ifs;
				goto E_eval();
			}

			E_c_ifs {

				KON = STK[1]|0;		

				if((VAL|0) != __FALSE__) {
					EXP = STK[0]|0;
					STKUNWIND(2);			
					goto E_eval();
				}

				VAL = __VOID__;
				STKUNWIND(2);
				goto KON|0;
			}

			E_evalIff {

				claim()
				STKALLOC(2);
				STK[1] = KON;
				STK[0] = EXP;
				EXP = iffPredicate(EXP)|0;
				KON = E_c_iff;
				goto E_eval();
			}

			E_c_iff {

				EXP = ((VAL|0) == __FALSE__? 
						iffAlternative(STK[0]|0)|0: 
						iffConsequence(STK[0]|0)|0);
				KON = STK[1]|0;
				STKUNWIND(2);
				goto E_eval();
			}

			E_evalTtk {

				SIZ = numberVal(ttkSiz(EXP)|0)|0;
				claimSiz(SIZ)
				ENV = extendEnv()|0;
				fillVector(SIZ, __VOID__) => FRM;
				EXP = ttkExp(EXP)|0;
				goto E_eval();
			}

			E_evalThk {

				SIZ = numberVal(thunkSiz(EXP)|0)|0;
				claimSiz(SIZ)
				STKALLOC(3);
				STK[2] = KON;
				STK[1] = ENV;
				STK[0] = FRM;
				ENV = extendEnv()|0;
				fillVector(SIZ, __VOID__) => FRM;
				EXP = thunkExp(EXP)|0;
				KON = E_c_return;
				goto E_eval();
			}

			/* --- APPLICATIONS (ZERO ARGUMENT) --- */

			E_evalAlz {

				VAL = vectorRef(FRM, alzOfs(EXP)|0)|0;
				goto E_evalAZ();
			}

			E_evalAnz {

				VAL = vectorRef(vectorRef(ENV,anzScp(EXP)|0)|0,
								anzOfs(EXP)|0)|0;
				goto E_evalAZ();
			}

			E_evalAgz {

				VAL = vectorRef(GLB, agzOfs(EXP)|0)|0;
				goto E_evalAZ();
			}

			E_evalApz {

				claim()
				STKALLOC(1);
				STK[0] = KON;
				EXP = apzOpr(EXP)|0;
				KON = E_c_evalApz;
				goto E_eval();
			}

			E_c_evalApz {

				KON = STK[0]|0;
				STKUNWIND(1);
				goto E_evalAZ();
			}

			E_evalAZ {

				switch(tag(VAL)|0) {

					case __PRC_TAG__: 
						if(numberVal(prcArgc(VAL)|0)|0) {
							err_invalidParamCount();
							goto error;
						}
						SIZ = numberVal(prcFrmSiz(VAL)|0)|0;
						claimSiz(SIZ)
						STKALLOC(3);
						STK[2] = KON;
						STK[1] = ENV;
						STK[0] = FRM;
						if(SIZ)
							{ fillVector(SIZ, __VOID__) => FRM; }
						else
							{ FRM = __EMPTY_VEC__ }
						ENV = prcEnv(VAL)|0;
						EXP = prcBdy(VAL)|0;
						KON = E_c_return;
						goto E_eval;
						
					case __PRZ_TAG__:
						if(numberVal(przArgc(VAL)|0)|0) {
							err_invalidParamCount();
							goto error;
						}
						SIZ = numberVal(przFrmSiz(VAL)|0)|0;
						claimSiz(SIZ)
						STKALLOC(3);
						STK[2] = KON;
						STK[1] = ENV;
						STK[0] = FRM;
						fillVector(SIZ, __NULL__) => FRM;
						ENV = przEnv(VAL)|0;
						EXP = przBdy(VAL)|0;
						KON = E_c_return;
						goto E_eval;

					case __NAT_TAG__:
						LEN = 0;
						goto nativePtr(VAL)|0;

					case __CNT_TAG__:
						err_invalidParamCount();
						goto error;
				}

				err_invalidOperator(VAL|0);
				goto error;
			}

			/* --- TAIL CALLS (ZERO ARGUMENTS) --- */

			E_evalTlz {

				VAL = vectorRef(FRM,tlzOfs(EXP)|0)|0;
				goto E_evalTZ();
			}

			E_evalTnz {

				VAL = vectorRef(vectorRef(ENV,tnzScp(EXP)|0)|0,
								tnzOfs(EXP)|0)|0;
				goto E_evalTZ();
			}

			E_evalTgz {

				VAL = vectorRef(GLB,tgzOfs(EXP)|0)|0;
				goto E_evalTZ();
			}

			E_evalTpz {

				claim()
				STKALLOC(1);
				STK[0] = KON;
				EXP = tpzOpr(EXP)|0;
				KON = E_c_evalTpz;
				goto E_eval();
			}

			E_c_evalTpz {

				KON = STK[0]|0;
				STKUNWIND(1);
				goto E_evalTZ();
			}

			E_evalTZ {

				switch(tag(VAL)|0) {

					case __PRC_TAG__: 
						if(numberVal(prcArgc(VAL)|0)|0) {
							err_invalidParamCount();
							goto error;
						}
						SIZ = numberVal(prcFrmSiz(VAL)|0)|0;
						if(SIZ) {
							claimSiz(SIZ)
							fillVector(SIZ, __VOID__) => FRM;
						} else {
							FRM = __EMPTY_VEC__;
						}
						ENV = prcEnv(VAL)|0;
						EXP = prcBdy(VAL)|0;
						goto E_eval;
						
					case __PRZ_TAG__:
						if(numberVal(przArgc(VAL)|0)|0) {
							err_invalidParamCount();
							goto error;
						}
						SIZ = numberVal(przFrmSiz(VAL)|0)|0;
						claimSiz(SIZ)
						fillVector(SIZ, __NULL__) => FRM;
						ENV = przEnv(VAL)|0;
						EXP = przBdy(VAL)|0;
						goto E_eval;

					case __NAT_TAG__:
						LEN = 0;
						goto nativePtr(VAL)|0;

					case __CNT_TAG__:
						err_invalidParamCount();
						goto error;
				}

				err_invalidOperator(VAL|0);
				goto error;
			}

			/* --- APPLICATIONS (WITH ARGUMENTS) --- */

			E_evalAll {

				VAL = vectorRef(FRM,numberVal(allOfs(EXP)|0)|0)|0;
				ARG = allOpd(EXP)|0;
				goto E_evalAL();
			}

			E_evalAnl {

				VAL = vectorRef(vectorRef(ENV, numberVal(anlScp(EXP)|0)|0)|0,
								numberVal(anlOfs(EXP)|0)|0)|0;
				ARG = anlOpd(EXP)|0;
				goto E_evalAL();
			}

			E_evalAgl {

				VAL = vectorRef(GLB,numberVal(aglOfs(EXP)|0)|0)|0;
				ARG = aglOpd(EXP)|0;
				goto E_evalAL();
			}

			E_evalApl {

				claim()
				STKALLOC(2);
				STK[1] = KON;
				STK[0] = aplOpd(EXP)|0;
				EXP = aplOpr(EXP)|0;
				KON = E_c_evalApl;
				goto E_eval();
			}

			E_c_evalApl {

				ARG = STK[0]|0;
				KON = STK[1]|0;
				STKUNWIND(2);
				goto E_evalAL();
			}

			E_evalAL {

				switch(tag(VAL)|0) {

					case __PRC_TAG__:
						LEN = numberVal(prcArgc(VAL)|0)|0;
						SIZ = numberVal(prcFrmSiz(VAL)|0)|0;
						if((LEN|0) != (vectorLength(ARG)|0)) {
							err_invalidParamCount();
							goto error;
						}
						claimSiz(SIZ)
						makeVector(SIZ) => PAR;
						STKALLOC(3);
						STK[2] = KON;
						STK[1] = ENV;
						STK[0] = FRM;
						KON = E_c_return;
						goto E_prcEvalArgs();

					case __PRZ_TAG__:
						LEN = numberVal(przArgc(VAL)|0)|0;
						SIZ = numberVal(przFrmSiz(VAL)|0)|0;
						if((LEN|0) > (vectorLength(ARG)|0)) {
							err_invalidParamCount();
							goto error;
						}
						claimSiz(SIZ)
						fillVector(SIZ, __NULL__) => PAR;
						STKALLOC(3);
						STK[2] = KON;
						STK[1] = ENV;
						STK[0] = FRM;
						KON = E_c_return;
						if (LEN) { 
							goto E_przArgs(); 
						}
						IDX = 0; LEN = 1;
						goto E_przVarArgs();	

					case __NAT_TAG__:
						LEN = vectorLength(ARG)|0;
						claimSiz(LEN)
						STKALLOC(LEN);
						goto E_nativeArgs();

					case __CNT_TAG__:
						LEN = vectorLength(ARG)|0;
						if((LEN|0)!=1) {
							err_invalidParamCount();
							goto error;
						}
						goto E_continuationArg();
				}

				err_invalidOperator(VAL|0);
				goto error;					
			}

			/* --- TAIL CALLS (WITH ARGUMENTS) --- */

			E_evalTll {

				VAL = vectorRef(FRM,numberVal(tllOfs(EXP)|0)|0)|0;
				ARG = tllOpd(EXP)|0;
				goto E_evalTL();
			}

			E_evalTnl {

				VAL = vectorRef(vectorRef(ENV,numberVal(tnlScp(EXP)|0)|0)|0,
								numberVal(tnlOfs(EXP)|0)|0)|0;
				ARG = tnlOpd(EXP)|0;
				goto E_evalTL();
			}

			E_evalTgl {

				VAL = vectorRef(GLB,numberVal(tglOfs(EXP)|0)|0)|0;
				ARG = tglOpd(EXP)|0;
				goto E_evalTL();
			}

			E_evalTpl {

				claim()
				STKALLOC(2);
				STK[1] = KON;
				STK[0] = tplOpd(EXP)|0;
				EXP = tplOpr(EXP)|0;
				KON = E_c_evalTpl;
				goto E_eval();
			}

			E_c_evalTpl {

				ARG = STK[0]|0;
				KON = STK[1]|0;
				STKUNWIND(2);
				goto E_evalTL();
			}

			E_evalTL {

				switch(tag(VAL)|0) {

					case __PRC_TAG__:
						LEN = numberVal(prcArgc(VAL)|0)|0;
						SIZ = numberVal(prcFrmSiz(VAL)|0)|0;
						if((LEN|0) != (vectorLength(ARG)|0)) {
							err_invalidParamCount();
							goto error;
						}
						claimSiz(SIZ)
						makeVector(SIZ) => PAR;
						goto E_prcEvalArgs();

					case __PRZ_TAG__:
						LEN = numberVal(przArgc(VAL)|0)|0;
						SIZ = numberVal(przFrmSiz(VAL)|0)|0;
						if((LEN|0) > (vectorLength(ARG)|0)) {
							err_invalidParamCount();
							goto error;
						}
						claimSiz(SIZ)
						fillVector(SIZ, __NULL__) => PAR;
						if (LEN) { 
							goto E_przArgs(); 
						}
						IDX = 0; LEN = 1;
						goto E_przVarArgs();	

					case __NAT_TAG__:
						LEN = vectorLength(ARG)|0;
						claimSiz(LEN)
						STKALLOC(LEN);
						goto E_nativeArgs();

					case __CNT_TAG__:
						LEN = vectorLength(ARG)|0;
						if((LEN|0)!=1) {
							err_invalidParamCount();
							goto error;
						}
						goto E_continuationArg();
				}

				err_invalidOperator(VAL|0);
				goto error;					
			}

			/* ---- ARGUMENTS (CONTINUATION) ---- */

			E_continuationArg {

				EXP = vectorRef(ARG,1)|0;

				switch(tag(EXP)|0) {
					case __NUL_TAG__: case __VOI_TAG__:
					case __TRU_TAG__: case __FLS_TAG__:
					case __NBR_TAG__: case __CHR_TAG__:
					case __PAI_TAG__: case __PRC_TAG__:
					case __VCT_TAG__: case __STR_TAG__:
					case __FLT_TAG__: case __NAT_TAG__:
					case __CNT_TAG__: case __PRZ_TAG__:
						break;
					case __QUO_TAG__:
						EXP = quoExpression(EXP)|0;
						break;
					case __LCL_TAG__:
						lookupLocal EXP => EXP
						break;
					case __GLB_TAG__:
						lookupGlobal EXP => EXP
						break;
					case __NLC_TAG__:
						lookupNlc EXP => EXP
						break;
					case __LMB_TAG__:
						EXP = capturePrc(EXP);
						break;
					case __LMZ_TAG__:
						EXP = capturePrz(EXP);
						break;				
					default:
						claim()
						STKALLOC(1);
						STK[0] = VAL;
						KON = E_c_continuationArg;
						goto E_eval();	 
				}

				KON = continuationKon(VAL)|0;
				PAR = continuationStk(VAL)|0;
				FRM = continuationFrm(VAL)|0;
				ENV = continuationEnv(VAL)|0;
				restoreStack();
				VAL = EXP;
				goto KON|0;
			}

			E_c_continuationArg {

				EXP = STK[0]|0; //no need to unwind
				KON = continuationKon(EXP)|0;
				PAR = continuationStk(EXP)|0;
				FRM = continuationFrm(EXP)|0;
				ENV = continuationEnv(EXP)|0;
				restoreStack();
				goto KON|0;
			}

			/* ---- ARGUMENTS (NATIVE) ---- */

			E_nativeArgs {

				for(IDX=0;(IDX|0)<(LEN|0);IDX=TMP) {

					TMP = (IDX + 1)|0;
					EXP = vectorRef(ARG,TMP)|0;

					switch(tag(EXP)|0) {
						case __NUL_TAG__: case __VOI_TAG__:
						case __TRU_TAG__: case __FLS_TAG__:
						case __NBR_TAG__: case __CHR_TAG__:
						case __PAI_TAG__: case __PRC_TAG__:
						case __VCT_TAG__: case __STR_TAG__:
						case __FLT_TAG__: case __NAT_TAG__:
						case __CNT_TAG__: case __PRZ_TAG__:
							break;
						case __QUO_TAG__:
							EXP = quoExpression(EXP)|0;
							break;
						case __LCL_TAG__:
							lookupLocal EXP => EXP
							break;
						case __GLB_TAG__:
							lookupGlobal EXP => EXP
							break;
						case __NLC_TAG__:
							lookupNlc EXP => EXP
							break;
						default:
							if((TMP|0) == (LEN|0)) { //last argument
								STK[IDX] = __VOID__; //for GC
								STKALLOC(3);
								STK[2] = KON;
								STK[1] = VAL;
								STK[0] = makeNumber(TMP)|0;
								KON = E_applyNative;
							} else {
								for(;(IDX|0)<(LEN|0);IDX=(IDX+1)|0)
									STK[IDX] = __VOID__;
								STKALLOC(4);								
								STK[3] = KON;
								STK[2] = VAL;
								STK[1] = makeNumber(TMP)|0;
								STK[0] = ARG;
								KON = E_c_nativeArgs;
							}
							goto E_eval();
					}
					STK[IDX] = EXP;
				}

				goto nativePtr(VAL)|0;
			}

			E_c_nativeArgs {

				ARG = STK[0]|0;
				IDX = numberVal(STK[1]|0)|0;
				LEN = vectorLength(ARG)|0;
				STK[IDX+3] = VAL;

				for(;(IDX|0)<(LEN|0);IDX=TMP) {

					TMP = (IDX + 1)|0;
					EXP = vectorRef(ARG, TMP)|0;

					switch(tag(EXP)|0) {
						case __NUL_TAG__: case __VOI_TAG__:
						case __TRU_TAG__: case __FLS_TAG__:
						case __NBR_TAG__: case __CHR_TAG__:
						case __PAI_TAG__: case __PRC_TAG__:
						case __VCT_TAG__: case __STR_TAG__:
						case __FLT_TAG__: case __NAT_TAG__:
						case __CNT_TAG__: case __PRZ_TAG__:
							break;
						case __QUO_TAG__:
							EXP = quoExpression(EXP)|0;
							break;
						case __LCL_TAG__:
							lookupLocal EXP => EXP
							break;
						case __GLB_TAG__:
							lookupGlobal EXP => EXP
							break;
						case __NLC_TAG__:
							lookupNlc EXP => EXP
							break;
						case __LMB_TAG__:
							EXP = capturePrc(EXP);
							break;
						case __LMZ_TAG__:
							EXP = capturePrz(EXP);
							break;				
						default:
							if((TMP|0) == (LEN|0)) { //last argument
								STKUNWIND(1);
								STK[0] = makeNumber(TMP)|0;
								KON = E_applyNative;
							} else {
								STK[1] = makeNumber(TMP)|0;
							}
							goto E_eval();
					}
					STK[IDX+4] = EXP;
				}
				
				VAL = STK[2]|0;
				KON = STK[3]|0;
				STKUNWIND(4);
				goto nativePtr(VAL)|0;
			}

			E_applyNative {

				LEN = numberVal(STK[0]|0)|0;
				STK[LEN+2] = VAL;
				VAL = STK[1]|0;
				KON = STK[2]|0;
				STKUNWIND(3);
				goto nativePtr(VAL)|0;
			}

			/* ---- ARGUMENTS (PRC) ---- */

			E_prcEvalArgs {

				for(IDX=0;(IDX|0)<(LEN|0);) {

					IDX = (IDX + 1)|0;
					EXP = vectorRef(ARG, IDX)|0;

					switch(tag(EXP)|0) {
						case __NUL_TAG__: case __VOI_TAG__:
						case __TRU_TAG__: case __FLS_TAG__:
						case __NBR_TAG__: case __CHR_TAG__:
						case __PAI_TAG__: case __PRC_TAG__:
						case __VCT_TAG__: case __STR_TAG__:
						case __FLT_TAG__: case __NAT_TAG__:
						case __CNT_TAG__: case __PRZ_TAG__:
							break;
						case __QUO_TAG__:
							EXP = quoExpression(EXP)|0;
							break;
						case __LCL_TAG__:
							lookupLocal EXP => EXP
							break;
						case __GLB_TAG__:
							lookupGlobal EXP => EXP
							break;
						case __NLC_TAG__:
							lookupNlc EXP => EXP
							break;	
						default:
							TMP = makeNumber(IDX)|0;
							for(;(IDX|0)<=(SIZ|0);IDX=(IDX+1)|0)
								{ vectorSet(PAR,IDX,__VOID__); }
							if((IDX|0) == (LEN|0)) { //last argument
								STKALLOC(4);
								STK[3] = KON;
								STK[2] = VAL;
								STK[1] = PAR;
								STK[0] = TMP;
								KON = E_prcApply;
							} else {
								STKALLOC(5);
								STK[4] = KON;
								STK[3] = VAL;
								STK[2] = PAR;
								STK[1] = TMP;
								STK[0] = ARG;
								KON = E_c_prcArgs;
							}
							goto E_eval();
					}
					vectorSet(PAR, IDX, EXP);
				}
				
				while((IDX|0)<(SIZ|0)) { 
					IDX=(IDX+1)|0;
					vectorSet(PAR,IDX,__VOID__); 
				}
				FRM = PAR;
				ENV = prcEnv(VAL)|0;
				EXP = prcBdy(VAL)|0;
				goto E_eval;
			}

			E_c_prcArgs {

				ARG = STK[0]|0;
				IDX = numberVal(STK[1]|0)|0;
				PAR = STK[2]|0;
				LEN = vectorLength(ARG)|0;
				vectorSet(PAR, IDX, VAL);

				while((IDX|0)<(LEN|0)) {

					IDX = (IDX + 1)|0;
					EXP = vectorRef(ARG, IDX)|0;

					switch(tag(EXP)|0) {
						case __NUL_TAG__: case __VOI_TAG__:
						case __TRU_TAG__: case __FLS_TAG__:
						case __NBR_TAG__: case __CHR_TAG__:
						case __PAI_TAG__: case __PRC_TAG__:
						case __VCT_TAG__: case __STR_TAG__:
						case __FLT_TAG__: case __NAT_TAG__:
						case __CNT_TAG__: case __PRZ_TAG__:
							break;
						case __QUO_TAG__:
							EXP = quoExpression(EXP)|0;
							break;
						case __LCL_TAG__:	
							lookupLocal EXP => EXP
							break;
						case __GLB_TAG__:
							lookupGlobal EXP => EXP
							break;
						case __NLC_TAG__:
							lookupNlc EXP => EXP
							break;
						case __LMB_TAG__:
							EXP = capturePrc(EXP);
							break;
						case __LMZ_TAG__:
							EXP = capturePrz(EXP);
							break;				
						default:
							STK[1] = makeNumber(IDX)|0;
							if((IDX|0) == (LEN|0)) { //last argument
								KON = E_prcApply;
								STKUNWIND(1);
							}
							goto E_eval();
					}
					vectorSet(PAR, IDX, EXP);
				}
				
				FRM = PAR;
				VAL = STK[3]|0;
				ENV = prcEnv(VAL)|0;
				EXP = prcBdy(VAL)|0;
				KON = STK[4]|0;
				STKUNWIND(5);
				goto E_eval();
			}

			E_prcApply {

				IDX = numberVal(STK[0]|0)|0;
				PAR = STK[1]|0;
				EXP = STK[2]|0; 
				vectorSet(PAR, IDX, VAL);
				FRM = PAR;
				ENV = prcEnv(EXP)|0;
				EXP = prcBdy(EXP)|0;
				KON = STK[3]|0;
				STKUNWIND(4);
				goto E_eval();
			}

			/* ---- ARGUMENTS (PRZ) ---- */

			E_przArgs {

				for(IDX=0;(IDX|0)<(LEN|0);) {

					IDX = (IDX + 1)|0;
					EXP = vectorRef(ARG, IDX)|0;

					switch(tag(EXP)|0) {
						case __NUL_TAG__: case __VOI_TAG__:
						case __TRU_TAG__: case __FLS_TAG__:
						case __NBR_TAG__: case __CHR_TAG__:
						case __PAI_TAG__: case __PRC_TAG__:
						case __VCT_TAG__: case __STR_TAG__:
						case __FLT_TAG__: case __NAT_TAG__:
						case __CNT_TAG__: case __PRZ_TAG__:
							break;
						case __QUO_TAG__:
							EXP = quoExpression(EXP)|0;
							break;
						case __LCL_TAG__:	
							lookupLocal EXP => EXP
							break;
						case __GLB_TAG__:
							lookupGlobal EXP => EXP
							break;
						case __NLC_TAG__:
							lookupNlc EXP => EXP
							break;
						case __LMB_TAG__:
							EXP = capturePrc(EXP);
							break;
						case __LMZ_TAG__:
							EXP = capturePrz(EXP);
							break;				
						default:
							claim()
							if((IDX|0) == (LEN|0)) { 					//last mandatory argument
								if((IDX|0) == (vectorLength(ARG)|0)) {	//last argument
									STKALLOC(4);
									STK[3] = KON;
									STK[2] = VAL;
									STK[1] = PAR;
									STK[0] = makeNumber(IDX)|0;
									KON = E_przApply;
								} else {									
									STKALLOC(5);
									STK[4] = KON;
									STK[3] = VAL;
									STK[2] = PAR;
									STK[1] = makeNumber(IDX)|0;
									STK[0] = ARG;
									KON = E_c2_przArgs;
								}
							} else {									
								STKALLOC(6);
								STK[5] = KON;
								STK[4] = VAL;
								STK[3] = PAR;
								STK[2] = makeNumber(IDX)|0;
								STK[1] = ARG;
								STK[0] = makeNumber(LEN)|0;
								KON = E_c1_przArgs;
							}
							goto E_eval();
					}
					vectorSet(PAR, IDX, EXP);
				}

				if((IDX|0) == (vectorLength(ARG)|0)) { //no more arguments
					FRM = PAR;
					ENV = przEnv(VAL)|0;
					EXP = przBdy(VAL)|0;
					goto E_eval;
				}

				LEN = (IDX + 1)|0;
				goto E_przVarArgs();
			}

			E_c1_przArgs {

				LEN = numberVal(STK[0]|0)|0;
				ARG = STK[1]|0;
				IDX = numberVal(STK[2]|0)|0;
				PAR = STK[3]|0;
				vectorSet(PAR, IDX, VAL);

				while((IDX|0)<(LEN|0)) {

					IDX = (IDX + 1)|0;
					EXP = vectorRef(ARG, IDX)|0;

					switch(tag(EXP)|0) {
						case __NUL_TAG__: case __VOI_TAG__:
						case __TRU_TAG__: case __FLS_TAG__:
						case __NBR_TAG__: case __CHR_TAG__:
						case __PAI_TAG__: case __PRC_TAG__:
						case __VCT_TAG__: case __STR_TAG__:
						case __FLT_TAG__: case __NAT_TAG__:
						case __CNT_TAG__: case __PRZ_TAG__:
							break;
						case __QUO_TAG__:
							EXP = quoExpression(EXP)|0;
							break;
						case __LCL_TAG__:
							lookupLocal EXP => EXP
							break;
						case __GLB_TAG__:
							lookupGlobal EXP => EXP
							break;
						case __NLC_TAG__:
							lookupNlc EXP => EXP
							break;
						case __LMB_TAG__:
							EXP = capturePrc(EXP);
							break;
						case __LMZ_TAG__:
							EXP = capturePrz(EXP);
							break;				
						default:
							STK[2] = makeNumber(IDX)|0;
							if((IDX|0) == (LEN|0)) { 					//last mandatory argument
								if((IDX|0) == (vectorLength(ARG)|0)) {	//last argument
									KON = E_przApply;
									STKUNWIND(2);
								} else {
									KON = E_c2_przArgs;
									STKUNWIND(1);
								}
							}
							goto E_eval();
					}
					vectorSet(PAR, IDX, EXP);
				}

				if((IDX|0) == (vectorLength(ARG)|0)) { //no more arguments
					VAL = STK[4]|0;
					FRM = PAR;
					ENV = przEnv(VAL)|0;
					EXP = przBdy(VAL)|0;
					KON = STK[5]|0;
					STKUNWIND(6);
					goto E_eval();
				}

				STKUNWIND(4);
				LEN = (IDX + 1)|0;
				goto E_przVarArgs2();
			}

			E_c2_przArgs {

				ARG = STK[0]|0;
				IDX = numberVal(STK[1]|0)|0;
				PAR = STK[2]|0;
				STKUNWIND(3);
				vectorSet(PAR, IDX, VAL);
				LEN = (IDX + 1)|0;
				goto E_przVarArgs2();
			}

			E_przVarArgs {

				SIZ = vectorLength(ARG)|0;

				while((IDX|0) < (SIZ|0)) {

					IDX = (IDX + 1)|0;
					EXP = vectorRef(ARG, IDX)|0;
					claim()

					switch(tag(EXP)|0) {
						case __NUL_TAG__: case __VOI_TAG__:
						case __TRU_TAG__: case __FLS_TAG__:
						case __NBR_TAG__: case __CHR_TAG__:
						case __PAI_TAG__: case __PRC_TAG__:
						case __VCT_TAG__: case __STR_TAG__:
						case __FLT_TAG__: case __NAT_TAG__:
						case __CNT_TAG__: case __PRZ_TAG__:
							break;
						case __QUO_TAG__:
							EXP = quoExpression(EXP)|0;
							break;
						case __LCL_TAG__:
							lookupLocal EXP => EXP
							break;
						case __GLB_TAG__:
							lookupGlobal EXP => EXP
							break;
						case __NLC_TAG__:
							lookupNlc EXP => EXP
							break;
						case __LMB_TAG__:
							EXP = capturePrc(EXP);
							break;
						case __LMZ_TAG__:
							EXP = capturePrz(EXP);
							break;				
						default:
							if((IDX|0) == (SIZ|0)) {
								STKALLOC(4);
								STK[3] = KON;
								STK[2] = VAL;
								STK[1] = PAR;
								STK[0] = makeNumber(LEN)|0; 			
								KON = E_przApplyVarArgs;	
							} else {
								STKALLOC(6);
								STK[5] = KON;
								STK[4] = VAL;
								STK[3] = PAR;
								STK[2] = makeNumber(LEN)|0; 	
								STK[1] = makeNumber(IDX)|0;
								STK[0] = ARG; 
								KON = E_c_przVarArgs;
							}
							goto E_eval();
					}
					TMP = vectorRef(PAR, LEN)|0;
					vectorSet(PAR, LEN, makePair(EXP, TMP)|0);
				}

				TMP = vectorRef(PAR, LEN)|0;
				vectorSet(PAR, LEN, reverse(TMP)|0);
				FRM = PAR;
				ENV = przEnv(VAL)|0;
				EXP = przBdy(VAL)|0;
				goto E_eval;
			}

			E_przVarArgs2 {

				SIZ = vectorLength(ARG)|0;

				while((IDX|0) < (SIZ|0)) {

					IDX = (IDX + 1)|0;
					EXP = vectorRef(ARG, IDX)|0;
					claim()

					switch(tag(EXP)|0) {
						case __NUL_TAG__: case __VOI_TAG__:
						case __TRU_TAG__: case __FLS_TAG__:
						case __NBR_TAG__: case __CHR_TAG__:
						case __PAI_TAG__: case __PRC_TAG__:
						case __VCT_TAG__: case __STR_TAG__:
						case __FLT_TAG__: case __NAT_TAG__:
						case __CNT_TAG__: case __PRZ_TAG__:
							break;
						case __QUO_TAG__:
							EXP = quoExpression(EXP)|0;
							break;
						case __LCL_TAG__:
							lookupLocal EXP => EXP
							break;
						case __GLB_TAG__:
							lookupGlobal EXP => EXP
							break;
						case __NLC_TAG__:
							lookupNlc EXP => EXP
							break;
						case __LMB_TAG__:
							EXP = capturePrc(EXP);
							break;
						case __LMZ_TAG__:
							EXP = capturePrz(EXP);
							break;				
						default:
							if((IDX|0) == (SIZ|0)) { 
								STKALLOC(2);
								STK[1] = PAR;
								STK[0] = makeNumber(LEN)|0;	
								KON = E_przApplyVarArgs;	
							} else {
								STKALLOC(4);
								STK[3] = PAR;
								STK[2] = makeNumber(LEN)|0;
								STK[1] = makeNumber(IDX)|0;
								STK[0] = ARG; 
								KON = E_c_przVarArgs;
							}
							goto E_eval();
					}
					TMP = vectorRef(PAR, LEN)|0;
					vectorSet(PAR, LEN, makePair(EXP, TMP)|0);
				}

				TMP = vectorRef(PAR, LEN)|0;
				vectorSet(PAR, LEN, reverse(TMP)|0);

				VAL = STK[0]|0;
				FRM = PAR;
				ENV = przEnv(VAL)|0;
				EXP = przBdy(VAL)|0;
				KON = STK[1]|0;
				STKUNWIND(2);
				goto E_eval();
			}

			E_c_przVarArgs {

				claim()
				ARG = STK[0]|0;
				IDX = numberVal(STK[1]|0)|0;
				LEN = numberVal(STK[2]|0)|0;
				PAR = STK[3]|0;
				VAL = makePair(VAL,vectorRef(PAR,LEN)|0)|0;
				vectorSet(PAR, LEN, VAL);
				STKUNWIND(4);
				goto E_przVarArgs2();
			}

			E_przApplyVarArgs {

				claim()
				IDX = numberVal(STK[0]|0)|0;
				PAR = STK[1]|0;
				EXP = STK[2]|0;
				VAL = makePair(VAL, vectorRef(PAR, IDX)|0)|0;
				vectorSet(PAR, IDX, reverse(VAL)|0);
				FRM = PAR;
				ENV = przEnv(EXP)|0;
				EXP = przBdy(EXP)|0;
				KON = STK[3]|0;
				STKUNWIND(4);
				goto E_eval();
			}

			E_przApply {

				IDX = numberVal(STK[0]|0)|0;
				PAR = STK[1]|0;
				EXP = STK[2]|0;
				vectorSet(PAR, IDX, VAL);
				FRM = PAR;
				ENV = przEnv(EXP)|0;
				EXP = przBdy(EXP)|0;
				KON = STK[3]|0;
				STKUNWIND(4);
				goto E_eval();
			}

			/* ---- RETURN ---- */

			E_c_return {

				FRM = STK[0]|0;
				ENV = STK[1]|0;
				KON = STK[2]|0;
				STKUNWIND(3);
				goto KON|0;
			}

// **********************************************************************
// *************************** NATIVES PT2 ******************************
// **********************************************************************

			N_addFloats {

				for(IDX=(IDX+1)|0;(IDX|0)<(LEN|0);IDX=(IDX+1)|0) {
					EXP = STK[IDX]|0;
					switch(tag(EXP)|0) {
						case __NBR_TAG__:
							FLT = fround(FLT + fround(numberVal(EXP)|0));
							break;
						case __FLT_TAG__:
							FLT = fround(FLT + fround(floatNumber(EXP)));
							break;
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}
				claim()
				makeFloat(FLT) => VAL;
				STKUNWIND(LEN);
				goto KON|0;
			}

	 		N_substractFloats {

				for(IDX=(IDX+1)|0;(IDX|0)<(LEN|0);IDX=(IDX+1)|0) {
					EXP = STK[IDX]|0;
	 				switch(tag(EXP)|0) {
	 					case __NBR_TAG__:
	 						FLT = fround(FLT - fround(numberVal(EXP)|0));
	 						break;
	 					case __FLT_TAG__:
	 						FLT = fround(FLT - fround(floatNumber(EXP)));
	 						break;
	 					default:
	 						err_invalidArgument(EXP|0);
	 						goto error;
	 				}
	 			}
	 			claim()
	 			makeFloat(FLT) => VAL;
				STKUNWIND(LEN);
	 			goto KON|0;
	 		}

	 		N_multiplyFloats {

				for(IDX=(IDX+1)|0;(IDX|0)<(LEN|0);IDX=(IDX+1)|0) {
					EXP = STK[IDX]|0;
					switch(tag(EXP)|0) {
						case __NBR_TAG__:
							FLT = fround(FLT * fround(numberVal(EXP)|0));
							break;
						case __FLT_TAG__:
							FLT = fround(FLT * fround(floatNumber(EXP)));
							break;
						default:
							err_invalidArgument(EXP|0);
							goto error;
					}
				}
				claim()
				makeFloat(FLT) => VAL;
				STKUNWIND(LEN);
				goto KON|0;
			}

			N_c1_map {

				claim()
				VAL = reverse(makePair(VAL,STK[0]|0)|0)|0;
				KON = STK[1]|0;
				STKUNWIND(2);
				goto KON|0;
			}

			N_c2_map {

				claim()
				STK[2] = makePair(VAL,STK[2]|0)|0;
				LST = STK[0]|0;

				if(!(isPair(LST)|0)) {
					err_invalidArgument(LST|0);
					goto error;
				}
				
				VAL = STK[1]|0;
				ARG = makePair(pairCar(LST)|0, __NULL__)|0;
				LST = pairCdr(LST)|0;

				if(isNull(LST)|0) {
					KON = N_c1_map;
					STKUNWIND(2);
				} else {
					STK[0] = LST;
				}

				goto N_apply;
			}

			N_apply {

				switch(tag(VAL)|0) {

					case __PRC_TAG__:
						LEN = numberVal(prcArgc(VAL)|0)|0; 
						SIZ = numberVal(prcFrmSiz(VAL)|0)|0;
						claimSiz(SIZ)
						preserveEnv();
						fillVector(SIZ, __VOID__) => FRM;
						for(IDX=1;(IDX|0)<=(LEN|0);IDX=(IDX+1)|0) {
							if(!(isPair(ARG)|0)) {
								err_invalidParamCount();
								goto error;
							}
							TMP = pairCar(ARG)|0;
							ARG = pairCdr(ARG)|0;
							vectorSet(FRM, IDX, TMP);
						}
						if(!(isNull(ARG)|0)) {
							err_invalidParamCount();
							goto error;
						}
						ENV = prcEnv(VAL)|0;
						EXP = prcBdy(VAL)|0;
						goto E_eval;

					case __PRZ_TAG__:
						LEN = numberVal(przArgc(VAL)|0)|0; 
						SIZ = numberVal(przFrmSiz(VAL)|0)|0;
						claimSiz(SIZ)
						preserveEnv();
						fillVector(SIZ, __VOID__) => FRM;
						for(IDX=1;(IDX|0)<=(LEN|0);IDX=(IDX+1)|0) {
							if(!(isPair(ARG)|0)) {
								err_invalidParamCount();
								goto error;
							}
							TMP = pairCar(ARG)|0;
							ARG = pairCdr(ARG)|0;
							vectorSet(FRM, IDX, TMP);
						}						
						vectorSet(FRM, IDX, ARG);
						ENV = przEnv(VAL)|0;
						EXP = przBdy(VAL)|0;
						goto E_eval;

					case __NAT_TAG__: 
						for(LEN=0,LST=ARG;isPair(LST)|0;LEN=(LEN+1)|0)
							LST = pairCdr(LST)|0;
						if(!(isNull(LST)|0)) {
							err_invalidArgument(ARG|0);
							goto error;
						}
						claimSiz(LEN)
						STKALLOC(LEN);
						for(IDX=0;(IDX|0)<(LEN|0);IDX=(IDX+1)|0) {
							TMP = pairCar(ARG)|0;
							ARG = pairCdr(ARG)|0;
							STK[IDX] = TMP;
						}
						goto nativePtr(VAL)|0;
				
					case __CNT_TAG__: 
						if(!(isPair(ARG)|0)) {
							err_invalidParamCount();
							goto error;
						}
						if(!(isNull(pairCdr(ARG)|0)|0)) {
							err_invalidParamCount();
							goto error;
						}
						KON = continuationKon(VAL)|0;
						FRM = continuationFrm(VAL)|0;
						PAR = continuationStk(VAL)|0;
						ENV = continuationEnv(VAL)|0; 
						VAL = pairCar(ARG)|0;
						restoreStack();
						goto KON|0;
				}

				err_invalidOperator(VAL|0);
				goto error;
			}

			N_c_eval {

				EXP = VAL;
				FRM = GLB;
				ENV = __EMPTY_VEC__;
				KON = E_c_return;
				goto E_eval;
			}

			N_c1_load {

				EXP = VAL;
				KON = N_c2_load;
				TLC = __TRUE__;
				goto C_compile;
			}

			N_c2_load {

				EXP = VAL;
				FRM = GLB;
				ENV = __EMPTY_VEC__;
				KON = E_c_return;
				goto E_eval;
			}

			N_compare {

				TMP = tag(EXP)|0;
				if((TMP|0) != (tag(ARG)|0)) {
					VAL = __FALSE__;
					goto KON|0;
				}

				switch(TMP|0) {
					case __FLT_TAG__: goto N_compareFloat();
					case __STR_TAG__: goto N_compareString();
					case __PAI_TAG__: goto N_comparePair();
					case __VCT_TAG__: goto N_compareVector();
				}

				VAL = ((ARG|0) == (EXP|0) ? __TRUE__ : __FALSE__);
				goto KON|0;
			}

			N_compareFloat {

				VAL = (fround(floatNumber(EXP)) == fround(floatNumber(ARG)) ?
						__TRUE__ : __FALSE__);
				goto KON|0;
			}

			N_compareString {

				LEN = textLength(ARG)|0;
				if((textLength(EXP)|0) != (LEN|0)) {
					VAL = __FALSE__;
					goto KON|0;
				}

				while(LEN) {
					LEN = (LEN - 1)|0;
					if((textGetChar(ARG, LEN)|0) != (textGetChar(EXP, LEN)|0)) {
						VAL = __FALSE__;
						goto KON|0;
					}
				}

				VAL = __TRUE__;
				goto KON|0;
			}

			N_comparePair {

				claim()
				STKALLOC(3);
				STK[2] = pairCdr(EXP)|0;
				STK[1] = pairCdr(ARG)|0;
				EXP = pairCar(EXP)|0;
				ARG = pairCar(ARG)|0;
				STK[0] = KON;
				KON = N_c_comparePair;
				goto N_compare;
			}

			N_c_comparePair {

				KON = STK[0]|0;

				if((VAL|0) == __FALSE__) {
					STKUNWIND(3);
					goto KON|0;
				}

				ARG = STK[1]|0;
				EXP = STK[2]|0;
				STKUNWIND(3);
				goto N_compare;
			}

			N_compareVector {

				LEN = vectorLength(ARG)|0;
				if((vectorLength(EXP)|0) != (LEN|0)) {
					VAL = __FALSE__;
					goto KON|0;
				}
				if(!LEN) {
					VAL = __TRUE__;
					goto KON|0;
				}

				if((LEN|0) > 1) {
					claim()
					STKALLOC(4);
					STK[3] = KON;
					STK[2] = EXP;
					STK[1] = ARG;
					STK[0] = __ONE__;
					KON = N_c_compareVector;
				}

				ARG = vectorRef(ARG,1)|0;
				EXP = vectorRef(EXP,1)|0;
				goto N_compare;
			}

			N_c_compareVector {

				if((VAL|0) == __FALSE__) {
					KON = STK[3]|0;
					STKUNWIND(4);
					goto KON|0;
				}

				IDX = numberVal(((STK[0]|0)+1)|0)|0;
				ARG = STK[1]|0;
				EXP = STK[2]|0;

				if((IDX|0) == (vectorLength(ARG)|0)) {
					KON = STK[3]|0;
					STKUNWIND(4);
				} else {
					STK[0] = makeNumber(IDX)|0;
					KON = N_c_compareVector;
				}

				ARG = vectorRef(ARG, IDX)|0;
				EXP = vectorRef(EXP, IDX)|0;
				goto N_compare;
			}

// **********************************************************************
// ****************************** REPL **********************************
// **********************************************************************

			REPL {

				clearRefs();
				dctCheckpoint();
				KON = c1_repl;
				promptInput();
				halt;
			}

			c1_repl {

				EXP = VAL;
				TLC = __FALSE__;
				KON = c2_repl;
				goto C_compile;
			}

			c2_repl {

				EXP = VAL;
				KON = c3_repl;
				goto E_eval;
			}

			c3_repl {

				printOutput(VAL|0);
				goto REPL;
			}

			error {

				FRM = GLB;
				ENV = __EMPTY_VEC__;
				dctRollback();
				emptyStk();
				goto REPL;
			}

		} generate run

	/* -- EXPORTS -- */

		return {

			/**************/
			/**** MAIN ****/
			/**************/

			init: init,
			fclaim: fclaim,
			fclaimSiz: fclaimSiz,
			Slip_REPL: Slip_REPL,
			inputReady: inputReady,

			/************************/
			/*** ABSTRACT GRAMMAR ***/
			/************************/

			//generic
			ftag: ftag,
			fmake: fmake,
			fset: fset,
<<<<<<< HEAD
			fsetRaw: fsetRaw,
			//textual information
			makeText: makeText,
			textGetChar: textGetChar,
			textSetChar: textSetChar,
=======
>>>>>>> parent of 254a30e... updated compiler into JS
			//specials
			fisTrue: fisTrue,
			fisFalse: fisFalse,
			fisNull: fisNull,
			fisVoid: fisVoid,
			//numbers
			fmakeNumber: fmakeNumber,
			fnumberVal: fnumberVal,
			fisNumber: fisNumber,
			//characters
			fmakeChar: fmakeChar,
			fcharCode: fcharCode,
			fisChar: fisChar,
			//pairs
			fpairCar: fpairCar,
			fpairCdr: fpairCdr,
			fpairSetCar: fpairSetCar,
			fpairSetCdr: fpairSetCdr,
			fisPair: fisPair,
			//procedures
			fprcArgc: fprcArgc,
			fprcFrmSiz: fprcFrmSiz,
			fprcBdy: fprcBdy,
			fprcEnv: fprcEnv,
			fprzArgc: fprzArgc,
			fprzFrmSiz: fprzFrmSiz,
			fprzBdy: fprzBdy,
			fprzEnv: fprzEnv,
			fisPrc: fisPrc,
			fisPrz: fisPrz,
			//vectors
			vectorAt: vectorAt,
			fvectorLength: fvectorLength,
			ffillVector: ffillVector,
			fisVector: fisVector,
			//floats
			fmakeFloat: fmakeFloat,
			ffloatNumber: ffloatNumber,
			fisFloat: fisFloat,
			//string
			makeString: makeString,
			stringAt: textGetChar,
			stringSet: textSetChar,
			stringLength: textLength,
			fisString: fisString,
			//symbols
			makeSymbol: makeSymbol,
			symbolAt: textGetChar,
			symbolSet: textSetChar,
			symbolLength: textLength,
			fisSymbol: fisSymbol,
			//natives
			fnativePtr: fnativePtr,
			fisNative: fisNative,
			//sequences
			sequenceAt: sequenceAt,
			sequenceSet: sequenceSet,
			sequenceLength: sequenceLength,
			fisSequence: fisSequence,
			//single if-statements
			fifsPredicate: fifsPredicate,
			fifsConsequence: fifsConsequence,
			fisIfs: fisIfs,
			//full if-statements
			fiffPredicate: fiffPredicate,
			fiffConsequence: fiffConsequence,
			fiffAlternative: fiffAlternative,
			fisIff: fisIff,
			//quotes
			fquoExpression: fquoExpression,
			fisQuo: fisQuo,
			//thunks
			fthunkExp: fthunkExp,
			fthunkSiz: fthunkSiz,
			fisThunk: fisThunk,
			fttkSiz: fttkSiz,
			fttkExp: fttkExp,
			fisTtk: fisTtk,
			//lambdas
			flmbFrmSiz: flmbFrmSiz,
			flmbArgc: flmbArgc,
			flmbBdy: flmbBdy,
			fisLmb: fisLmb,
			flmzFrmSiz: flmzFrmSiz,
			flmzArgc: flmzArgc,
			flmzBdy: flmzBdy,
			fisLmz: fisLmz,
			//variable definitions
			fdfvOfs: fdfvOfs,
			fdfvVal: fdfvVal,
			fisDfv: fisDfv,
			//function definitions
			fdffBdy: fdffBdy,
			fdffArgc: fdffArgc,
			fdffFrmSiz: fdffFrmSiz,
			fdffOfs: fdffOfs,
			fdfzBdy: fdfzBdy,
			fdfzArgc: fdfzArgc,
			fdfzFrmSiz: fdfzFrmSiz,
			fdfzOfs: fdfzOfs,
			fisDff: fisDff,
			fisDfz: fisDfz,
			//assignments
			fsglScp: fsglScp,
			fsglOfs: fsglOfs,
			fsglVal: fsglVal,
			fslcOfs: fslcOfs,
			fslcVal: fslcVal,
			fisSgl: fisSgl,
			fisSlc: fisSlc,
			//local & global variables
			flocalOfs: flocalOfs,
			fglobalOfs: fglobalOfs,
			fisLocal: fisLocal,
			fisGlobal: fisGlobal,
			fmakeLocal: fmakeLocal,
			fmakeGlobal: fmakeGlobal,
			//applications (zero arg)
			fapzOpr: fapzOpr,
			fisApz: fisApz,
			falzOfs: falzOfs,
			fisAlz: fisAlz,
			fagzOfs: fagzOfs,
			fisAgz: fisAgz,
			fanzScp: fanzScp,
			fanzOfs: fanzOfs,
			fisAnz: fisAnz,
			//tail calls (zero arg)
			ftpzOpr: ftplOpr,
			fisTpz: fisTpz,
			ftlzOfs: ftlzOfs,
			fisTlz: fisTlz,
			ftgzOfs: ftgzOfs,
			fisTgz: fisTgz,
			ftnzScp: ftnzScp,
			ftnzOfs: ftnzOfs,
			fisTnz: fisTnz,
			//applications
			faplOpr: faplOpr,
			faplOpd: faplOpd,
			fisApl: fisApl,
			fallOfs: fallOfs,
			fallOpd: fallOpd,
			fisAll: fisAll,
			faglOfs: faglOfs,
			faglOpd: faglOpd,
			fisAgl: fisAgl,
			fanlScp: fanlScp,
			fanlOfs: fanlOfs,
			fanlOpd: fanlOpd,
			fisAnl: fisAnl,
			//tail calls
			ftplOpr: ftplOpr,
			ftplOpd: ftplOpd,
			fisTpl: fisTpl,
			ftllOfs: ftllOfs,
			ftllOpd: ftllOpd,
			fisTll: fisTll,
			ftglOfs: ftglOfs,
			ftglOpd: ftglOpd,
			fisTgl: fisTgl,
			ftnlScp: ftnlScp,
			ftnlOfs: ftnlOfs,
			ftnlOpd: ftnlOpd,
			fisTnl: fisTnl,
			//non-locals
			fnlcScp: fnlcScp,
			fnlcOfs: fnlcOfs,
			fisNlc: fisNlc,
			//sequence tail
			fstlExp: fstlExp,
			fisStl: fisStl,
<<<<<<< HEAD
			//void
			slipVoid: slipVoid,
			//other
			feq: feq,
			protect: protect
=======

			/**************/
			/**** POOL ****/
			/**************/

			enterPool: enterPool,
			poolAt: poolAt
>>>>>>> parent of 254a30e... updated compiler into JS
		};
	}


/************** NON-ASM.JS ***************/

	function COMPILER() {
		"use strict";

		var asm, dct, sym, err;
		var ref, deref, free;
		var car, cdr, isPair;
		var makeVector;
		var printer;

		function link(asmModule, dctModule, symModule, errModule, printerModule) {
			asm = asmModule;
			dct = dctModule;
			sym = symModule;
			err = errModule;
			makeVector = asm.ffillVector;
			car = asm.fpairCar;
			cdr = asm.fpairCdr;
			isPair = asm.isPair;
			ref = asm.ref;
			deref = asm.deref;
			free = asm.free;
			printer = printerModule;
		}

		function listLength(lst,err) {
			var sum = 0;
			while(asm.isPair(lst)) {
				lst = cdr(lst);
				++sum;
			}
			if (asm.isNull(lst))
				return sum;
			else
				compilationError(err);
		}

		function compilationError(err) {
			err();
			console.log('error');
			throw err;
		}

		function compile_exp(exp) {
			try {
				return compile(exp,false);
			} catch(exception) {
				return __NULL__;
			}
		}

		function compile(exp,tailc) {

			//allocate some refs
			var e = ref(exp);
			asm.refClaim(8);
			exp = free(e);

			//compound expression
			if(isPair(exp)) {
				var opr = car(exp);
				var opd = cdr(exp);
				//check for special form
				if(asm.isSymbol(opr)) {  
					if(opr === sym.loadIff())
						return compileIf(opd,tailc);
					else if (opr === sym.loadDef())
						return compileDefine(opd);
					else if (opr === sym.loadBeg())
						return compileBegin(opd,tailc);
					else if (opr === sym.loadLmb())
						return compileLambda(opd);
					else if (opr === sym.loadSet())
						return compileAssignment(opd);
					else if (opr === sym.loadQuo())
						return compileQuote(opd);
				}
				//otherwise, assume application
				return compileApplication(opr,opd);
			}
			//simple expression
			if(asm.isSymbol(exp))
				return compileVariable(exp);
			else
				return exp;
		}

		function compileIf(exp,tailc) {

			if(!isPair(exp))
				compilationError(err.invalidIf);

			var predicate = car(exp);
			var branches = cdr(exp);

			if(!isPair(branches))
				compilationError(err.invalidIf);

			var consequent = ref(car(branches));
			var alternative = ref(cdr(branches));
			var c_predicate = ref(compile(predicate,false));
			var c_consequent = ref(compileInline(free(consequent),tailc));

			alternative = free(alternative);
			if(asm.isNull(alternative))
				return compileSingleIf(c_predicate,c_consequent);
			else if (asm.isPair(alternative))
				return compileDoubleIf(c_predicate,c_consequent,alternative,tailc);

			compilationError(err.invalidIf);
		}

		function compileSingleIf(c_predicate,c_consequent) {
			
			var if_exp = asm.fmake(__IFS_TAG__,2);
			asm.fset(if_exp,1,free(c_predicate));
			asm.fset(if_exp,2,free(c_consequent));
			return if_exp;
		}

		function compileDoubleIf(c_predicate,c_consequent,alternative,tailc) {

			if(!asm.isNull(cdr(alternative)))
				compilationError(err.invalidIf);
			alternative = car(alternative);

			var c_alternative = ref(compileInline(alternative,tailc));
			
			var if_exp = asm.fmake(__IFF_TAG__,3);
			asm.fset(if_exp,1,free(c_predicate));
			asm.fset(if_exp,2,free(c_consequent));
			asm.fset(if_exp,3,free(c_alternative));
			return if_exp;
		}

		function compileInline(exp,tailc) {

			dct.enterScope();
			var saved_exp = ref(exp);
			var c_exp = ref(compile(exp,true));
			var size = dct.exitScope();
			exp = free(saved_exp);

			if(size == 0) {
				free(c_exp); //no longer needed
				return compile(exp,tailc);
			}

			if(tailc) {
				var ttk_exp = asm.fmake(__TTK_TAG__,2);
				asm.fset(ttk_exp,1,free(c_exp));
				asm.fset(ttk_exp,2,asm.fmakeNumber(size));
				return ttk_exp;
			} else {
				var thk_exp = asm.fmake(__THK_TAG__,2);
				asm.fset(thk_exp,1,free(c_exp));
				asm.fset(thk_exp,2,asm.fmakeNumber(size));
				return thk_exp;
			}
		}

		function compileBegin(exp,tailc) {

			var len = listLength(exp,err.invalidSequence);
			if (len == 0)
				return __VOID__;
			else if (len == 1)
				return compile(car(exp),tailc);
			else {
				var exp, c_exp;
				var lst = ref(exp);
				var seq_exp = ref(asm.fmake(__SEQ_TAG__,len));
				for(var idx = 1; idx < len; ++idx) {
					lst = free(lst);
					exp = car(lst);
					lst = ref(cdr(lst));
					c_exp = compile(exp,false);
					asm.fset(deref(seq_exp),idx,c_exp);
				}
				exp = car(free(lst));
				c_exp = ref(compile(exp,tailc));
				exp = asm.fmake(__STL_TAG__,1);
				asm.fset(exp,1,free(c_exp));
				seq_exp = free(seq_exp);
				asm.fset(seq_exp,len,exp);
				return seq_exp;
			}
		}

		function compileDefine(opd) {

			if(!isPair(opd))
				compilationError(err.invalidDefine);
			
			var identifier = car(opd);
			var definition = cdr(opd);

			if(asm.isSymbol(identifier)) {
				return compileVarDefinition(identifier,definition);
			} else if(asm.isSymbol(identifier)) {
				return compileFunDefinition(identifier,definition);
			}
		}

		function compileVarDefinition(identifier,definition) {

			if(!isPair(definition))
				compilationError(err.invalidDefine);

			var exp = car(definition);
			var rest = cdr(definition);

			if(!asm.isNull(rest))
				compilationError(err.invalidDefine);

			var ofs = dct.defineVar(identifier);
			var c_exp = ref(compile(exp,false));

			var dfv_exp = asm.fmake(__DFV_TAG__,2);
			asm.fset(dfv_exp,1,asm.fmakeNumber(ofs));
			asm.fset(dfv_exp,2,free(c_exp));
			return dfv_exp;
		}

		function compileFunDefinition(identifier,definition) {

			var fname = car(identifier);
			var parameters = cdr(identifier);
			var body = ref(definition);

			if(!asm.isSymbol(fname))
				compilationError(err.invalidDefine);
			var ofs = dct.defineVar(fname);
			
			dct.enterScope();
			var rest = compileParameters(parameters);			

			if(asm.isSymbol(rest))
				return compileVarArgFun(ofs,rest,body);
			else if(asm.isNull(rest))
				return compileFun(ofs,body);
			else
				compilationError(err.invalidDefine);
		}

		function compileVarArgFun(par,c_body,argc) {


			

		}

		function compileLambda() {}
		function compileAssignment() {}
		function compileApplication() {}

		function compileQuote(exp) {

			if(!isPair(exp))
				compilationError(err.invalidQuote);

			var quoted = ref(car(exp));
			var rest = cdr(exp);

			if(!asm.isNull(rest))
				compilationError(err.invalidQuote);

			var quo_exp = asm.fmake(__QUO_TAG__,1);
			asm.fset(quo_exp,1,free(quoted));
			return quo_exp;
		}

		function compileVariable(sym) {

			var adr = dct.lexicalAdr(sym);
			if(adr) {
				var scope = adr.scope;
				var offset = adr.offset;
				if(scope === 0) {
					return asm.makeLocal(offset);
				} else if (scope === 1)  {
					return asm.makeGlobal(offset);
				} else {
					var nlc_exp = asm.fmake(__NLC_TAG__,2);
					asm.fset(nlc_exp,1,scope);
					asm.fset(nlc_exp,2,offset);
					return nlc_exp;
				}
			}

			compilationError(err.undefinedVariable);
		}

		return {
			link: link,
			init: init,
			compile: compile_exp
		}
	}

	function DICTIONARY() {
		"use strict";

		var asm, err;
		var savedEnv;
		var environment = [];
		var frame = [];

		function dctError(err) {
			err();
			throw err;
		}

		function link(asmModule,errModule) {
			asm = asmModule;
			err = errModule;
		}

		function defineVar(vrb) {

			if((environment.length==0)&&(frame.length==__GLOBAL_SIZ__))
				dctError(err.globalOverflow);

			frame.push(asm.ref(vrb));
			return frame.length;
		}

		function frameSize() {
			return frame.length;
		}

		function enterScope() {

			environment.push(frame);
			frame = [];
		}

		function exitScope() {

			var frameSize = frame.length;
			for(var i = 0; i < frameSize; ++i)
				asm.free(frame[i]);

			frame = environment.pop();
			return frameSize;
		}

		function offset(sym,frame) {
			var len = frame.length;
			for(var i = 0; i < len; ++i)
				if(asm.deref(frame[i])===sym)
					return i+1;
			return false; //variable not found
		}

		function lexicalAdr(sym) {
			var localOffset = offset(sym,frame);
			if(localOffset) {
				//local variable found!
				return { scope: 0, offset: localOffset }
			}
			
			for(var scopeLvl = environment.length;
				scopeLvl > 0; 
				--scopeLvl) 
			{
				var frm = environment[scopeLvl-1];
				var ofs = offset(sym,frm);
				if(ofs)
					return { scope: scopeLvl, offset: ofs }
			}
			return false;
		}

		function dctCheckpoint() {
			savedEnv = frame;
		}

		function dctRollback() {
			frame = savedEnv;
			environment = [];
		}

		return {
			link: link,
			defineVar: defineVar,
			lexicalAdr: lexicalAdr,
			enterScope: enterScope,
			exitScope: exitScope,
			frameSize: frameSize,
			dctCheckpoint: dctCheckpoint,
			dctRollback: dctRollback
		}
	}

	function READER() {
		"use strict";

		var program, position, hold;
		var makeString, stringSet,
			makeNumber, makeFloat,
			enterPool, claimSiz, claim;

		function load(str) {
			program = str;
			position = 0;
		}

		function link(asm, pool) {
			makeString = asm.makeString;
			stringSet = asm.stringSet;
			makeNumber = asm.fmakeNumber;
			makeFloat = asm.fmakeFloat;
			claimSiz = asm.fclaimSiz;
			claim = asm.fclaim;
			enterPool = pool.enterPool;
		}

		function read_exp() {

			try {
				return read()
			} catch(exception) {
				return asm.slipVoid();
			}
		}

		function read() {

			switch(peekC()) {

				case '(': 
					return read_lbr()
				case '#': 
					return read_shr()
				case '\'': 
					return read_quo()
				case '\"': 
					return read_str()
				case '+':
				case '-':
				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					return read_num()
				default:
					return read_sym()
			}
		}

		function read_lbr() {

			skipC();  //skip the '('

			// an empty list
			if(peekC() === ')') {
				skipC()
				return asm.slipNull()
			}

			// a non-empty list
			elements = []
			do {
				elements.push(read())
				if(peekC() === '.') {
					skipC()
					var tail = read()
					expect(')',err.expectedRBR)
					return buildList(elements,tail)
				}
			} while(peekC() !== ')')

			skipC() // slip the final ')'
			return buildList(elements,asm.slipNull())
		}

		function buildList(elements,tail) {
			var len = elements.length;
			var lst = tail;
			while(len) {
				var exp = elements[--len];
				lst = make(__PAI_TAG__,exp,lst)
			}
			return lst;
		}

		function readerError(err) {
			err(arguments[1])
			throw err
		}

		function expect(ch,err) {
			var res = readC()
			if(res !== ch)
				readerError(err,res)
		}

		function isTerminator(c) {
			switch (c) {
				case ' ': case '': case '\n': case '\t':
				case '\'': case '\"': case ')': case '(':
				case ';': case '.': case '\r':
					return true;
				default:
					return false;
			}
		}

		function isNumber(c) {
			return !(c < '0' || c > '9');
		}

		function skipWhiteSpace() {
			while(true) {
				switch (program.charAt(position)) {
					case ';':
						var current;
						while((current = program.charAt(++position)) != '\n'
						    	&& current != '\r' && current != '');
					case '\n': case '\r':
					case '\t': case ' ':
						++position;
						break;
					default:
						return;
				}
			}
		}

		function skipC() {
			skipWhiteSpace();
			++position;
		}

		function peekC() {
			skipWhiteSpace();
			return program.charAt(position);
		}

		function readC() {
			skipWhiteSpace();
			return program.charAt(position++);
		}

		function readSymbol() {
			hold = position;
			while(!isTerminator(program.charAt(++position)));
			return enterPool(program.substring(hold, position));
		}

		function extractString(from, to) {
			var len = to - from;
			claimSiz(len);
			var str = makeString(len);
			for(var i = 0; i < len; ++i)
				stringSet(str, i, program.charCodeAt(from+i));
			return str;
		}

		function readString() {
			hold = position;
			while(program.charAt(++position) != '\"');
			return extractString(hold+1, position++);
		}

		function readNumber() {
			hold = position;
			//step 1: check for sign
			switch(program.charAt(position)) {
				case '+':
				case '-':
					if(!isNumber(program.charAt(++position))) {
						--position; //oops, go back
						return readSymbol();
					}
			}
			//step 2: parse number in front of .
			while(isNumber(program.charAt(++position)));
			//step 3: parse number after .
			if(program.charAt(position) === '.') {
				while(isNumber(program.charAt(++position)));
				claim();
				return makeFloat(parseFloat(program.substring(hold, position)));
			}
			return makeNumber(parseInt(program.substring(hold, position)));
		}

		return {
			load: load,
			skip: skipC,
			peek: peekC,
			read: readC,
			readSymbol: readSymbol,
			readString: readString,
			readNumber: readNumber,
			link: link
		}
	}

	function SYMBOLS() {
		"use strict";

		var pool = Object.create(null);
		var asm;

		function link(asmModule) {
			asm = asmModule;
		}

		function buildSymbol(txt) {
			var len = txt.length;
			var sym = asm.makeText(len);
			for(var i = 0; i < len; ++i)
				asm.textSetChar(sym,i,txt.charCodeAt(i));
			return sym;
		}

		function enterPool(str) {
			var sym = pool[str]
			if (!sym) {// new symbol
				sym = buildSymbol(str)
				asm.protect(sym)
				pool[str] = sym
			}
			return sym;
		}

		function symbol(str) {
			return function() {
				return enterPool(str);
			}
		}

		define __QUO_STR__ 'quote'
		define __VEC_STR__ 'vector'
		define __IFF_STR__ 'if'
		define __DEF_STR__ 'define'
		define __LMB_STR__ 'lambda'
		define __SET_STR__ 'set!'
		define __BEG_STR__ 'begin'

		define __PLS_STR__ '+'
		define __MIN_STR__ '-'
		define __MUL_STR__ '*'
		define __DIV_STR__ '/'
		define __CNS_STR__ 'cons'
		define __CAR_STR__ 'car'
		define __CDR_STR__ 'cdr'
		define __SCA_STR__ 'set-car!'
		define __SCD_STR__ 'set-cdr!'
		define __LST_STR__ 'list'
		define __NEQ_STR__ '='
		define __LEQ_STR__ '>='
		define __SEQ_STR__ '<='
		define __LRG_STR__ '>'
		define __SMA_STR__ '<'
		define __ASS_STR__ 'assoc'
		define __MAP_STR__ 'map'
		define __VEC_STR__ 'vector'
		define __VCM_STR__ 'make-vector'
		define __VCR_STR__ 'vector-ref'
		define __VCS_STR__ 'vector-set!'
		define __VCL_STR__ 'vector-length'
		define __EQU_STR__ 'eq?'
		define __EQL_STR__ 'equal?'
		define __EVA_STR__ 'eval'
		define __REA_STR__ 'read'
		define __LOA_STR__ 'load'
		define __APL_STR__ 'apply'
		define __DIS_STR__ 'display'
		define __NEW_STR__ 'newline'
		define __IPA_STR__ 'pair?'
		define __INU_STR__ 'null?'
		define __ISY_STR__ 'symbol?'
		define __IVE_STR__ 'vector?'
		define __IST_STR__ 'string?'
		define __SRE_STR__ 'string-ref'
		define __SSE_STR__ 'string-set!'
		define __SLE_STR__ 'string-length'
		define __AVL_STR__ 'available'
		define __COL_STR__ 'collect'
		define __CLK_STR__ 'clock'
		define __RST_STR__ 'reset'
		define __SLP_STR__ 'sleep'
		define __RND_STR__ 'random'
		define __ERR_STR__ 'error'
		define __CCC_STR__ 'call-with-current-continuation'
		define __CCE_STR__ 'call-with-escape-continuation'
		define __QTT_STR__ 'quotient'
		define __REM_STR__ 'remainder'
		define __LEN_STR__ 'length'
		define __SIN_STR__ 'sin'
		define __EXI_STR__ 'exit'
		define __REF_STR__ 'ref'
		define __FRE_STR__ 'free'

		return {
			enterPool: enterPool,
			loadCcc: symbol(__CCC_STR__),
			loadAvl: symbol(__AVL_STR__),
			loadCol: symbol(__COL_STR__),
			loadClk: symbol(__CLK_STR__),
			loadSlp: symbol(__SLP_STR__),
			loadRnd: symbol(__RND_STR__),
			loadErr: symbol(__ERR_STR__),
			loadSre: symbol(__SRE_STR__),
			loadSse: symbol(__SSE_STR__),
			loadSle: symbol(__SLE_STR__),
			loadIpa: symbol(__IPA_STR__),
			loadInu: symbol(__INU_STR__),
			loadIsy: symbol(__ISY_STR__),
			loadIve: symbol(__IVE_STR__),
			loadIst: symbol(__IST_STR__),
			loadQuo: symbol(__QUO_STR__),
			loadIff: symbol(__IFF_STR__),
			loadDef: symbol(__DEF_STR__),
			loadLmb: symbol(__LMB_STR__),
			loadSet: symbol(__SET_STR__),
			loadBeg: symbol(__BEG_STR__),
			loadPls: symbol(__PLS_STR__),
			loadMns: symbol(__MIN_STR__),
			loadMul: symbol(__MUL_STR__),
			loadDiv: symbol(__DIV_STR__),
			loadCns: symbol(__CNS_STR__),
			loadCar: symbol(__CAR_STR__),
			loadCdr: symbol(__CDR_STR__),
			loadSca: symbol(__SCA_STR__),
			loadScd: symbol(__SCD_STR__),
			loadLst: symbol(__LST_STR__),
			loadSma: symbol(__SMA_STR__),
			loadLrg: symbol(__LRG_STR__),
			loadLeq: symbol(__LEQ_STR__),
			loadSeq: symbol(__SEQ_STR__),
			loadNeq: symbol(__NEQ_STR__),
			loadAss: symbol(__ASS_STR__),
			loadMap: symbol(__MAP_STR__),
			loadVec: symbol(__VEC_STR__),
			loadVcm: symbol(__VCM_STR__),
			loadVcr: symbol(__VCR_STR__),
			loadVcs: symbol(__VCS_STR__),
			loadVcl: symbol(__VCL_STR__),
			loadEql: symbol(__EQL_STR__),
			loadEqu: symbol(__EQU_STR__),
			loadEva: symbol(__EVA_STR__),
			loadRea: symbol(__REA_STR__),
			loadLoa: symbol(__LOA_STR__),
			loadApl: symbol(__APL_STR__),
			loadDis: symbol(__DIS_STR__),
			loadNew: symbol(__NEW_STR__),
			loadRst: symbol(__RST_STR__),
			loadQtt: symbol(__QTT_STR__),
			loadRem: symbol(__REM_STR__),
			loadLen: symbol(__LEN_STR__),
			loadSin: symbol(__SIN_STR__),
			loadExi: symbol(__EXI_STR__),
			loadCce: symbol(__CCE_STR__),
			loadRef: symbol(__REF_STR__),
			loadFre: symbol(__FRE_STR__),
			link: link
		}
	}

	function TIMER() {
		"use strict";

		var __START__;

		function reset() {
			__START__ = new Date().getTime();
		}

		function getTime() {
			var current = new Date().getTime();
			return current - __START__;
		}

		return {
			getTime: getTime,
			reset: reset
		}
	}

	function PRINTER() {
		"use strict";

		var getTag, numberVal, floatNumber, charCode,
		stringText, symbolLength, symbolAt,
		pairCar, pairCdr, isPair, isNull,
		vectorAt, vectorLength, ag;

		function link(asm) {
			getTag = asm.ftag;
			numberVal = asm.fnumberVal;
			floatNumber = asm.ffloatNumber;
			charCode = asm.charCode;
			stringText = asm.stringText;
			symbolLength = asm.symbolLength;
			symbolAt = asm.symbolAt;
			pairCar = asm.fpairCar;
			pairCdr = asm.fpairCdr;
			isPair = asm.fisPair;
			isNull = asm.fisNull;
			vectorAt = asm.vectorAt;
			vectorLength = asm.fvectorLength;
			ag = asm;
		}

		function printExp(exp) {

			var tag = getTag(exp);

			switch(tag) {

				case __NUL_TAG__: return '()';
				case __VOI_TAG__: return '#<void>';
				case __TRU_TAG__: return '#t';
				case __FLS_TAG__: return '#f';
				case __NBR_TAG__: return numberVal(exp).toString();
				case __CHR_TAG__:
					return '#\\'+String.fromCharCode(charCode(exp).toString());
				case __PAI_TAG__: return printPair(exp);
				case __VCT_TAG__: return printVector(exp);
				case __STR_TAG__: return stringText(exp);
				case __FLT_TAG__: return floatNumber(exp).toString();
				case __NAT_TAG__: return '#<native procedure>';
				case __CNT_TAG__: return '#<continuation>';
				case __SYM_TAG__: return symbolText(exp);
				case __PRC_TAG__:
				case __PRZ_TAG__: 
					return '#<procedure>'
				case __LCL_TAG__:
					return '#<local variable @ offset '
								+ ag.flocalOfs(exp) + '>';
				case __GLB_TAG__:
					return '#<global variable @ offset: '
								+ ag.fglobalOfs(exp) + '>';
				case __NLC_TAG__:
					return '#<non-local variable @ scope-level/offset: '
								+ ag.fnlcScp(exp) + '/'
								+ ag.fnlcOfs(exp) + '>';
				case __SEQ_TAG__:
					return '#<sequence '
								+ printSequence(exp) + '>';
				case __IFS_TAG__:
					return '#<simple-if '
								+ printExp(ag.fifsPredicate(exp)) + ' '
								+ printExp(ag.fifsConsequence(exp)) + '>';
				case __IFF_TAG__:
					return '#<full-if '
								+ printExp(ag.fiffPredicate(exp)) + ' '
								+ printExp(ag.fiffConsequence(exp)) + ' '
								+ printExp(ag.fiffAlternative(exp)) + '>';
				case __THK_TAG__:
					return '#<thunk (size: '
								+ printExp(ag.fthunkSiz(exp)) + '; body: '
								+ printExp(ag.fthunkExp(exp)) + ')>';
				case __TTK_TAG__:
					return '#<thunk* (size: '
								+ printExp(ag.fttkSiz(exp)) + '; body: '
								+ printExp(ag.fttkExp(exp)) + ')>';
				case __QUO_TAG__:
					return '#<quote '
								+ printExp(ag.fquoExpression(exp)) + '>';
				case __LMB_TAG__:
					return '#<lambda (argument count: '
								+ printExp(ag.flmbArgc(exp)) + '; frame size: '
								+ printExp(ag.flmbFrmSiz(exp)) + '; body: '
								+ printExp(ag.flmbBdy(exp)) + ')>';
				case __LMZ_TAG__:
					return '#<lambda (argument* count: '
								+ printExp(ag.flmzArgc(exp)) + '; frame size: '
								+ printExp(ag.flmzFrmSiz(exp)) + '; body: '
								+ printExp(ag.flmzBdy(exp)) + ')>';
				case __DFV_TAG__:
					return '#<variable definition @ offset '
								+ printExp(ag.fdfvOfs(exp)) + ' (value: '
								+ printExp(ag.fdfvVal(exp)) + ')>';
				case __DFF_TAG__:
					return '#<function definition @ offset '
								+ printExp(ag.fdffOfs(exp)) + ' (argument count: '
								+ printExp(ag.fdffArgc(exp)) + '; frame size:  '
								+ printExp(ag.fdffFrmSiz(exp)) + '; body:  '
								+ printExp(ag.fdffBdy(exp)) + ')>';
				case __DFZ_TAG__:
					return '#<function definition @ offset '
							 + printExp(ag.fdfzOfs(exp)) + ' (argument* count: '
							 + printExp(ag.fdfzArgc(exp)) + '; frame size:  '
							 + printExp(ag.fdfzFrmSiz(exp)) + '; body:  '
							 + printExp(ag.fdfzBdy(exp)) + ')>';
				case __SGL_TAG__:
					return '#<assignment @ scope-level/offset: '
								+ printExp(ag.fsglScp(exp)) + '/'
								+ printExp(ag.fsglOfs(exp)) + ' (value: '
								+ printExp(ag.fsglVal(exp)) + ')>';
				case __SLC_TAG__:
					return '#<local assignment @ offset: '
								+ printExp(ag.fslcOfs(exp)) + ' (value: '
								+ printExp(ag.fslcVal(exp)) + ')>';
				case __APZ_TAG__:
					return '#<application (zero argument): '
								+ printExp(ag.fapzOpr(exp)) + '>';
				case __ALZ_TAG__:
					return '#<local application (zero argument) @ offset '
								+ ag.falzOfs(exp) + '>';
				case __ANZ_TAG__:
					return '#<non-local application (zero argument) @ scope/offset: '
								+ ag.fanzScp(exp) + '/'
								+ ag.fanzOfs(exp) + '>'
				case __AGZ_TAG__:
					return '#<global application (zero argument) @ offset '
								+ ag.fagzOfs(exp) + '>';
				case __TPZ_TAG__:
					return '#<tail call (zero argument): '
								+ printExp(ag.ftpzOpr(exp)) + '>';
				case __TLZ_TAG__:
					return '#<local tail call (zero argument) @ offset '
								+ ag.ftlzOfs(exp) + '>';
				case __TNZ_TAG__:
					return '#<non-local tail call (zero argument) @ scope/offset: '
								+ ag.ftnzScp(exp) + '/'
								+ ag.ftnzOfs(exp) + '>'
				case __TGZ_TAG__:
					return '#<global tail call (zero argument) @ offset '
								+ ag.ftgzOfs(exp) + '>';
				case __APL_TAG__:
					return '#<application '
								+ printExp(ag.faplOpr(exp)) + ' @ '
								+ printExp(ag.faplOpd(exp)) + '>';				
				case __ALL_TAG__:
					return '#<local application (offset: '
								+ printExp(ag.fallOfs(exp)) + ') @ '
								+ printExp(ag.fallOpd(exp)) + '>';
				case __ANL_TAG__:
					return '#<non-local application (scope/offset: '
								+ printExp(ag.fanlScp(exp)) + '/'
								+ printExp(ag.fanlOfs(exp)) + ') @ '
								+ printExp(ag.fanlOpd(exp)) + '>';
				case __AGL_TAG__:
					return '#<global application (offset: '
								+ printExp(ag.faglOfs(exp)) + ') @'
								+ printExp(ag.faglOpd(exp)) + '>';
				case __TPL_TAG__:
					return '#<tail call '
								+ printExp(ag.ftplOpr(exp)) + ' @ '
								+ printExp(ag.ftplOpd(exp)) + '>';
				case __TLL_TAG__:
					return '#<local tail call (offset '
								+ printExp(ag.ftllOfs(exp)) + ') @ '
								+ printExp(ag.ftllOpd(exp)) + '>';				
				case __TNL_TAG__:
					return '#<non-local tail call (scope/offset: '
								+ printExp(ag.ftnlScp(exp)) + '/'
								+ printExp(ag.ftnlOfs(exp)) + ') @ '
								+ printExp(ag.ftnlOpd(exp)) + '>';
				case __TGL_TAG__:
					return '#<global tail call (offset: '
								+ printExp(ag.ftglOfs(exp)) + ') @'
								+ printExp(ag.ftglOpd(exp)) + '>';
				case __STL_TAG__:
					return '#<sequence tail (body: '
								+ printExp(ag.fstlExp(exp)) + ')>';
				default:
					return '<unknown expression (tag: ' + tag + ')>';
			}
		}

		var printSequence = function(exp) {
			var str = '', idx = 1;
			var len = ag.sequenceLength(exp);
			while(idx < len)
				str += printExp(ag.sequenceAt(exp, idx++)) + ' '
			str += printExp(ag.fstlExp(ag.sequenceAt(exp, idx)));
			return str;
		}

		function symbolText(chk) {
			var len = symbolLength(chk);
			var arr = new Array(len);
			for(var i = 0; i < len; ++i)
				arr[i] = symbolAt(chk, i);
			return String.fromCharCode.apply(null, arr);
		}

		function printPair(exp) {
			var str = '(' + printExp(pairCar(exp));
			var cdr = pairCdr(exp)
			var cdrStr = printExp(cdr);
			if(isPair(cdr)) { // prettier!
				cdrStr = cdrStr.substring(1, cdrStr.length-1);
				return str + ' ' + cdrStr + ')';
			}
			if (isNull(cdr))
				return str + ')';
			return str + " . " + cdrStr + ')';
		}

		function printVector(exp) {
			var len = vectorLength(exp);
			if (len === 0)
				return "#()";
			var str = "#(";
			for(var idx = 1; idx < len; ++idx) {
				str += printExp(vectorAt(exp, idx)) + ' ';
			}
			str += printExp(vectorAt(exp, len)) + ')';
			return str;
		}

		return {
			printExp: printExp,
			link: link
		}
	}

	function ERRORS() {
		"use strict";

		var report, printExp;

		function link(io, printer) {
			report = io.printError;
			printExp = printer.printExp;
		}

		function invalidLength(len) {
			report('invalid length: ' + len);
		}

		function invalidRange(idx, from, to) {
			report('expected index in range [' + from + ', ' + to + '], given ' + idx);
		}

		function expectedRBR(code) {
			report('expected ), given ' + String.fromCharCode(code));
		}

		function invalidSyntax() {
			report('invalid syntax');
		}

		function invalidParameter(exp) {
			report('invalid parameter: ' + printExp(exp));
		}

		function invalidSequence() {
			report('invalid sequence');
		}

		function invalidQuote() {
			report('invalid quote');
		}

		function invalidIf() {
			report('invalid if');
		}

		function invalidDefine() {
			report('invalid definition');
		}

		function invalidAssignment() {
			report('invalid assignment');
		}

		function invalidLambda() {
			report('invalid lambda');
		}

		function invalidApplication() {
			report('invalid application');
		}

		function globalOverflow() {
			report('too many global variables');
		}

		function undefinedVariable(exp) {
			report('undefined variable: ' + printExp(exp));
		}

		function invalidExpression(exp) {
			report('invalid expression:' + printExp(exp));
		}

		function invalidOperator(exp) {
			report('invalid operator:' + printExp(exp));
		}

		function invalidParamCount() {
			report('invalid parameter count');
		}

		function invalidArgument(exp) {
			report('invalid argument: ' + printExp(exp));
		}

		function fatalMemory() {
			report('insufficient memory!');
			throw 'SLIP ERROR:: out of memory';
		}

		return {
			expectedRBR: expectedRBR,
			invalidSyntax: invalidSyntax,
			invalidSequence: invalidSequence,
			invalidQuote: invalidQuote,
			invalidIf: invalidIf,
			invalidDefine: invalidDefine,
			invalidAssignment: invalidAssignment,
			invalidLambda: invalidLambda,
			invalidApplication: invalidApplication,
			undefinedVariable: undefinedVariable,
			invalidOperator: invalidOperator,
			invalidParamCount: invalidParamCount,
			invalidParameter: invalidParameter,
			invalidArgument: invalidArgument,
			invalidExpression: invalidExpression,
			invalidLength: invalidLength,
			invalidRange: invalidRange,
			globalOverflow: globalOverflow,
			fatalMemory: fatalMemory,
			link: link
		}
	}

	function IO() {
		"use strict";

		define __WELCOME_STR__ 'Welcome to the slip.js REPL'
		define __PROMPT1_STR__ '> '
		define __PROMPT2_STR__ ':: '
		define __ERROR_STR__ 'ERROR: '

		var readExpression, printline, printOut, plog, ld,
		inputReady, loadInput, printExp, printErr, text;

		function link(asm, clbs, reader, printer) {
			readExpression = clbs.readExpression;
			printline = clbs.printline;
			printOut = clbs.print;
			printErr = clbs.printerror;
			plog = clbs.printlog;
			ld = clbs.load;
			inputReady = asm.inputReady;
			text = asm.stringText;
			loadInput = reader.load;
			printExp = printer.printExp;
		}

		function onInput(txt) {
			reader.load(txt);
			inputReady();
		}

		function promptInput() {
			printOut(__PROMPT1_STR__);
			readExpression(onInput);
		}

		function promptUserInput() {
			printOut(__PROMPT2_STR__);
			readExpression(onInput);
		}

		function onError() {
			//TODO: temporary fix...
			reader.load('#f');
			inputReady();
		}

		function loadFile(str) {
			ld(text(str), onInput, onError);
		}

		function printLog(exp) {
			plog(printExp(exp));
		}

		function printNewline() {
			printline('');
		}

		function printOutput(exp) {
			printline(printExp(exp));
		}

		function printCustomError(exp) {
			printErr(__ERROR_STR__ + printExp(exp));
		}

		function printError(txt) {
			printErr(__ERROR_STR__ + txt);
		}

		function initREPL() {
			printline(__WELCOME_STR__);
			printline('');
		}

		return {
			printCustomError: printCustomError,
			promptUserInput: promptUserInput,
			printNewline: printNewline,
			promptInput: promptInput,
			printOutput: printOutput,
			printError: printError,
			printLog: printLog,
			initREPL: initREPL,
			loadFile: loadFile,
			link: link
		}
	}

	/* --- INITIALISATION --- */

	//memory
	define __DEFAULT_MEM__ 24
	var memSiz = 0x1 << (size || __DEFAULT_MEM__);
	var buffer = new ArrayBuffer(memSiz);

	//foreign modules
	var reader = READER();
	var compiler = COMPILER();
	var dictionary = DICTIONARY();
	var printer = PRINTER();
	var errors = ERRORS();
	var pool = SYMBOLS();
	var timer = TIMER();
	var io = IO();

	var foreign = {
		heapSize: memSiz,
		skip: reader.skip,
		look: reader.peek,
		read: reader.read,
		readSymbol: reader.readSymbol,
		readString: reader.readString,
		readNumber: reader.readNumber,
		loadQuo: pool.loadQuo,
		loadIff: pool.loadIff,
		loadDef: pool.loadDef,
		loadBeg: pool.loadBeg,
		loadVec: pool.loadVec,
		loadSet: pool.loadSet,
		loadLmb: pool.loadLmb,
		loadPls: pool.loadPls,
		loadMns: pool.loadMns,
		loadMul: pool.loadMul,
		loadDiv: pool.loadDiv,
		loadCns: pool.loadCns,
		loadCar: pool.loadCar,
		loadCdr: pool.loadCdr,
		loadSca: pool.loadSca,
		loadScd: pool.loadScd,
		loadLst: pool.loadLst,
		loadNeq: pool.loadNeq,
		loadSeq: pool.loadSeq,
		loadLeq: pool.loadLeq,
		loadLrg: pool.loadLrg,
		loadSma: pool.loadSma,
		loadAss: pool.loadAss,
		loadMap: pool.loadMap,
		loadAvl: pool.loadAvl,
		loadCol: pool.loadCol,
		loadClk: pool.loadClk,
		loadSlp: pool.loadSlp,
		loadErr: pool.loadErr,
		loadSre: pool.loadSre,
		loadSse: pool.loadSse,
		loadSle: pool.loadSle,
		loadIpa: pool.loadIpa,
		loadInu: pool.loadInu,
		loadIsy: pool.loadIsy,
		loadIve: pool.loadIve,
		loadIst: pool.loadIst,
		loadVcm: pool.loadVcm,
		loadVcr: pool.loadVcr,
		loadVcs: pool.loadVcs,
		loadVcl: pool.loadVcl,
		loadEqu: pool.loadEqu,
		loadEql: pool.loadEql,
		loadEva: pool.loadEva,
		loadRea: pool.loadRea,
		loadLoa: pool.loadLoa,
		loadApl: pool.loadApl,
		loadDis: pool.loadDis,
		loadNew: pool.loadNew,
		loadRst: pool.loadRst,
		loadCcc: pool.loadCcc,
		loadRnd: pool.loadRnd,
		loadQtt: pool.loadQtt,
		loadRem: pool.loadRem,
		loadLen: pool.loadLen,
		loadSin: pool.loadSin,
		loadExi: pool.loadExi,
		loadCce: pool.loadCce,
		loadRef: pool.loadRef,
		loadFre: pool.loadFre,
		clock: timer.getTime,
		reset: timer.reset,
		invalidIf: errors.invalidIf,
		expectedRBR: errors.expectedRBR,
		invalidQuote: errors.invalidQuote,
		invalidDefine: errors.invalidDefine,
		invalidLambda: errors.invalidLambda,
		invalidSyntax: errors.invalidSyntax,
		invalidSequence: errors.invalidSequence,
		invalidAssignment: errors.invalidAssignment,
		invalidParameter: errors.invalidParameter,
		invalidApplication: errors.invalidApplication,
		invalidExpression: errors.invalidExpression,
		undefinedVariable: errors.undefinedVariable,
		invalidParamCount: errors.invalidParamCount,
		invalidArgument: errors.invalidArgument,
		invalidOperator: errors.invalidOperator,
		globalOverflow: errors.globalOverflow,
		invalidLength: errors.invalidLength,
		invalidRange: errors.invalidRange,
		fatalMemory: errors.fatalMemory,
		promptUserInput: io.promptUserInput,
		printError: io.printCustomError,
		printNewline: io.printNewline,
		printOutput: io.printOutput,
		promptInput: io.promptInput,
		printLog: io.printLog,
		loadFile: io.loadFile,
		initREPL: io.initREPL,
		random: Math.random,
		dctDefine: dictionary.defineVar,
		compile: compiler.compile
	};

	//asm module
	var asm = SLIP_ASM(callbacks.stdlib, foreign, buffer);
	asm.stringText = function(chk) {
		var len = asm.stringLength(chk);
		var arr = new Array(len);
		for(var i = 0; i < len; ++i)
			arr[i] = asm.stringAt(chk, i);
		return String.fromCharCode.apply(null, arr);
	}

	//linking
	pool.link(asm);
	reader.link(asm, pool);
	compiler.link(asm, dictionary, pool, errors, printer);
	dictionary.link(asm, errors);
	printer.link(asm);
	io.link(asm, callbacks, reader, printer);
	errors.link(io, printer);
	timer.reset();

	//initialization
	asm.init();


	/* ---- EXPORTS ---- */

	return {
		Slip_REPL: asm.Slip_REPL
	}
}