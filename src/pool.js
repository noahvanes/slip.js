function POOL() {
	"use strict";

	var __POOL__ = Object.create(null);
	var __POOL_TOP__ = 1;
	var __POOL_SIZ__ = 64;
	var __POOL_INC__ = 32;
	regs.SYM = ag.makeVector(__POOL_SIZ__);

	function insertPool(str) {

		var sym = ag.makeSymbol(str);
		__POOL__[str] = __POOL_TOP__;
		ag.vectorSet(regs.SYM, __POOL_TOP__++, sym);
		return sym;
	} 

	function enterPool(str) {

		var sym, idx;
		//search for symbol
		if ((idx = __POOL__[str])) {
			sym = ag.vectorRef(regs.SYM, idx);
			return sym;
		}
		//not found: add to pool
		//might have to increase pool first
		if (__POOL_TOP__ > __POOL_SIZ__) {
			__POOL_SIZ__ += __POOL_INC__;
			vm.claimSiz(__POOL_SIZ__);
			var newPool = ag.makeVector(__POOL_SIZ__);
			//copy symbols to new table
			for(idx = 1; idx < __POOL_TOP__; ++idx) {
				sym = ag.vectorRef(regs.SYM, idx);
				ag.vectorSet(newPool, idx, sym);
			}
			regs.SYM = newPool;
		}
		//add the symbol
		sym = ag.makeSymbol(str);
		__POOL__[str] = __POOL_TOP__;
		ag.vectorSet(regs.SYM, __POOL_TOP__++, sym);
		return sym;
	}

	return {
		insertPool: insertPool,
		enterPool: enterPool
	}
}