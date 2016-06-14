function SYMBOLS() {
	"use strict";

	var pool = Object.create(null);
	var asm;

	function link(asmModule) {
		asm = asmModule;
	}

	function buildSymbol(txt) {
		var len = txt.length;
		var sym = asm.fmakeText(__SYM_TAG__,len);
		for(var i = 0; i < len; ++i)
			asm.ftextSetChar(sym,i,txt.charCodeAt(i));
		return sym;
	}

	function enterPool(str) {
		var sym = pool[str];
		if (!sym) {  // new symbol
			sym = buildSymbol(str)
			pool[str] = asm.protect(sym)
		} else {
			sym = asm.fcopy(sym);
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
	define __DFI_STR__ 'define-inline'
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
		loadDfi: symbol(__DFI_STR__),
		link: link
	}
}