/* UTILS.JS
  - mainly auxiliary functions that are native in R5RS 
*/

function length(lst) {

	var len = 0;
	while(lst != null) {
		lst = lst.cdr;
		++len;
	}

	return len;
}

function reverseLst(lst) {

	var current = null;
	while(lst != null) {
		current = new Pair(lst.car, current);
		lst = lst.cdr;
	}
	return current;
}

function buildListWithCdr(arr, cdr) { 

	var i = arr.length;
	var currentPair = cdr;

	while (i-- != 0) { 
		currentPair = new Pair(arr[i], currentPair);
	}
	
	return currentPair;
}

function buildList(arr) {

	return buildListWithCdr(arr, null);
}

function toArray(lst) {

	var res = [];
	while(lst != null) {
		res.push(lst.car);
		lst = lst.cdr;
	}
	return res;
}

function Pair(a,d) {

	this.car = a;
	this.cdr = d;
}

function Symbol(nam, id) {
	this.txt = nam;
	this.id = id;
}

function makeSymbolPool() {

	var symbolTable = {}
	var symbolCount = 0;

	function lookup(nam) {

		var id = symbolTable[nam];
		if (id == undefined) {
			symbolTable[nam] = symbolCount;
			id = symbolCount++;
		}

		return new Symbol(nam, id);
	}

	return lookup;
}

var toSymbol = makeSymbolPool();

function isSymbol(x) {

	return (x instanceof Symbol);
}

exports.length = length;
exports.reverseLst = reverseLst;
exports.buildList = buildList;
exports.buildListWithCdr = buildListWithCdr;
exports.toArray = toArray;
exports.toSymbol = toSymbol;
exports.isSymbol = isSymbol;
exports.Symbol = Symbol;
exports.Pair = Pair;