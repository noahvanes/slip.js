/* UTILS.JS
  - mainly auxiliary functions that are native in R5RS 
*/

function assoc(item, lst) {

	while (lst != null) {
		if(lst.car.car == item) {
			return lst.car;
		}
		lst = lst.cdr;
	}

	return false;
}

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

function buildList(arr) { 

	var i = arr.length;
	var currentPair = null;

	while (i-- != 0) { 
		currentPair = new Pair(arr[i], currentPair);
	}
	
	return currentPair;
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

function makeSymbolPool() {

	var symbolTable = {}
	var symbolCount = 0;

	function lookup(nam) {

		var id = symbolTable[nam];
		if (id == undefined) {
			symbolTable[nam] = symbolCount;
			id = symbolCount++;
		}

		return { txt: nam, id: id };
	}

	return lookup;
}

var toSymbol = makeSymbolPool();

function isSymbol(x) {

	return (x.txt != undefined && x.id != undefined);
}

exports.assoc = assoc;
exports.length = length;
exports.reverseLst = reverseLst;
exports.buildList = buildList;
exports.toArray = toArray;
exports.toSymbol = toSymbol;
exports.isSymbol = isSymbol;
exports.Pair = Pair;