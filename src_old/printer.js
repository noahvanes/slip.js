var ag = require('./ag.js');

function printExp(exp) {

	var tag = ag.tag(exp);

	switch(tag) {

		case ag.__NULL_TAG__: return '()';
		case ag.__VOID_TAG__: return '<void>';
		case ag.__TRUE_TAG__: return '#t';
		case ag.__FALSE_TAG__: return '#f';
		case ag.__NUMBER_TAG__: return ag.numberVal(exp).toString();
		case ag.__CHAR_TAG__: return ag.charCode(exp).toString();
		case ag.__PAIR_TAG__: return printPair(exp);
		case ag.__PROCEDURE_TAG__: return '<procedure>';
		case ag.__VECTOR_TAG__: return printVector(exp);
		case ag.__STRING_TAG__: return '\"' + ag.stringText(exp) + '\"';
		case ag.__DOUBLE_TAG__: return ag.doubleVal(exp).toString();
		case ag.__NATIVE_TAG__: return '<native procedure>';
		case ag.__SYMBOL_TAG__: return ag.symbolText(exp);
		/* ALSO PRINT OTHER ABSTRACT GRAMMAR ITEMS */
		case ag.__BEGIN_TAG__: 
			return '(<begin> ' + printSequence(ag.beginSequence(exp)) + ')';
		case ag.__IFS_TAG__: 
			return '(<if> ' + printExp(ag.ifsPredicate(exp)) + ' ' 
							+ printExp(ag.ifsConsequence(exp)) + ')';
		case ag.__IFF_TAG__: 
			return '(<if> ' + printExp(ag.iffPredicate(exp)) + ' '
							+ printExp(ag.iffConsequence(exp)) + ' '
							+ printExp(ag.iffAlternative(exp)) + ')';
		case ag.__QUO_TAG__:
			return '(<quote> ' + printExp(ag.quoExpression(exp)) + ')';
		case ag.__LAMBDA_TAG__:
			return '(<lambda> ' + printExp(ag.lambdaArg(exp)) + ' '
								+ printExp(ag.lambdaBdy(exp)) + ')';
		case ag.__LET_TAG__:
			return '(<let> ' + printBindings(ag.letBindings(exp)) + ' '
							 + printExp(ag.letBody(exp)) + ')';
		case ag.__DFV_TAG__:
			return '(<define> ' + printExp(ag.dfvVariable(exp)) + ' '
							   	+ printExp(ag.dfvValue(exp)) + ')';
		case ag.__DFF_TAG__:
			return '(<define> (' + printExp(ag.dffVariable(exp)) + ' '
								 + printExp(ag.dffArguments(exp)) + ') '
								 + printExp(ag.dffBody(exp)) + ')';
		case ag.__SET_TAG__:
			return '(<set> ' + printExp(ag.setVariable(exp)) + ' '
							 + printExp(ag.setValue(exp)) + ')';
		case ag.__APL_TAG__:
			return '(<application> ' + printExp(ag.aplOperator(exp)) + ' @ '
									 + printExp(ag.aplOperands(exp)) + ')';
		default:
			return '<expression ' + tag + '>';
	}
}

// TODO: make these prettier
var printSequence = printExp;
var printBindings = printExp;

function printPair(exp) {

	var str = '(' + printExp(ag.pairCar(exp));
	var cdr = ag.pairCdr(exp)
	var cdrStr = printExp(cdr);

	if(ag.isPair(cdr)) { // prettier!	
		cdrStr = cdrStr.substring(1, cdrStr.length - 1);
		return str + ' ' + cdrStr + ')';
	}

	if (ag.isNull(cdr)) {
		return str + ')';
	} 

	return str + " . " + cdrStr + ')';
}

function printVector(exp) {

	var len = ag.vectorLength(exp);
	var str = "#("
	for(var idx = 1; idx < len; ++idx) {
		str += printExp(ag.vectorRef(exp, idx)) + ' ';
	}
	str += printExp(ag.vectorRef(exp, len)) + ')';
	return str;
}

exports.printExp = printExp;