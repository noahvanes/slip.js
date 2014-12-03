/* IMPORTS */
var ag = require('./ag.js');

/* ALTERNATIVE */

const __POOL__ = Object.create(null);

var __POOL_TOP__ = 1;
var __POOL_SIZ__ = 64;
var __POOL_INC__ = 32;
var __POOL_VCT__ = ag.makeVector(__POOL_SIZ__);

function insertPool(str) {

	var sym = ag.makeSymbol(str);
	__POOL__[str] = __POOL_TOP__;
	ag.vectorSet(__POOL_VCT__, __POOL_TOP__++, sym);
	return sym;
} 

function enterPool(str) {

	var sym, idx;
	//search for symbol
	if ((idx = __POOL__[str])) {
		sym = ag.vectorRef(__POOL_VCT__, idx);
		return sym;
	}
	//not found: add to pool
	//might have to increase pool first
	if (__POOL_TOP__ > __POOL_SIZ__) {
		//TODO: mem claim
		__POOL_SIZ__ += __POOL_INC__;
		var newPool = ag.makeVector(__POOL_SIZ__);
		//copy symbols to new table
		for(idx = 1; idx < __POOL_TOP__; ++idx) {
			sym = ag.vectorRef(__POOL_VCT__, idx);
			ag.vectorSet(newPool, idx, sym);
		}
		__POOL__ = newPool;
	}
	//add the symbol
	sym = ag.makeSymbol(str);
	__POOL__[str] = __POOL_TOP__;
	ag.vectorSet(__POOL_VCT__, __POOL_TOP__++, sym);
	return sym;
}

exports.insertPool = insertPool;
exports.enterPool = enterPool;