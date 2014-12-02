/* UTILS.JS
  - mainly auxiliary functions that are native in R5RS 
*/

const ag = require('./ag.js');

function length(lst) {

	var len = 0;
	while(ag.isPair(lst)) {
		lst = ag.pairCdr(lst);
		++len;
	}

	return len;
}

function reverseLst(lst) {

	var current = ag.__NULL__, car;
	while(ag.isPair(lst)) {
		car = ag.pairCar(lst);
		current = ag.makePair(car, current);
		lst = ag.pairCdr(lst);
	}
	return current;
}

function buildListWithCdr(arr, cdr) { 

	var idx = arr.length;
	var current = cdr, val;

	while (idx) { 
		val = arr[--idx];
		current = ag.makePair(val, current);
	}
	
	return current;
}

function buildList(arr) {

	return buildListWithCdr(arr, ag.__NULL__);
}

function toArray(lst) {

	var res = [];
	while(ag.isPair(lst)) {
		res.push(ag.pairCar(lst));
		lst = ag.pairCdr(lst);
	}
	return res;
}

exports.length = length;
exports.reverseLst = reverseLst;
exports.buildList = buildList;
exports.buildListWithCdr = buildListWithCdr;
exports.toArray = toArray;