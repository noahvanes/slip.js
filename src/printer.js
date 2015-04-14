function PRINTER() {
	
	function printExp(exp) {

		var tag = ag.tag(exp);

		switch(tag) {

			case __NULL_TAG__: return '()';
			case __VOID_TAG__: return '<void>';
			case __TRUE_TAG__: return '#t';
			case __FALSE_TAG__: return '#f';
			case __NUMBER_TAG__: return ag.numberVal(exp).toString();
			case __CHAR_TAG__: 
				return '#\\' + String.fromCharCode(ag.charCode(exp).toString());
			case __PAIR_TAG__: return printPair(exp);
			case __PROCEDURE_TAG__: return '<procedure>';
			case __VECTOR_TAG__: return printVector(exp);
			case __STRING_TAG__: return '\"' + ag.stringText(exp) + '\"';
			case __FLOAT_TAG__: return ag.floatNumber(exp).toString();
			case __NATIVE_TAG__: return '<native procedure>';
			case __SYMBOL_TAG__: return ag.symbolText(exp);
			/* ALSO PRINT OTHER ABSTRACT GRAMMAR ITEMS */
			case __SEQUENCE_TAG__:
				return '(<sequence> ' + printSequence(exp) + ')';
			case __IFS_TAG__: 
				return '(<if> ' + printExp(ag.ifsPredicate(exp)) + ' ' 
								+ printExp(ag.ifsConsequence(exp)) + ')';
			case __IFF_TAG__: 
				return '(<if> ' + printExp(ag.iffPredicate(exp)) + ' '
								+ printExp(ag.iffConsequence(exp)) + ' '
								+ printExp(ag.iffAlternative(exp)) + ')';
			case __QUO_TAG__:
				return '(<quote> ' + printExp(ag.quoExpression(exp)) + ')';
			case __LAMBDA_TAG__:
				return '(<lambda> ' + printExp(ag.lambdaArg(exp)) + ' '
									+ printExp(ag.lambdaBdy(exp)) + ')';
			case __DFV_TAG__:
				return '(<define> ' + printExp(ag.dfvVariable(exp)) + ' '
								   	+ printExp(ag.dfvValue(exp)) + ')';
			case __DFF_TAG__:
				return '(<define> (' + printExp(ag.dffVariable(exp)) + ' '
									 + printExp(ag.dffArguments(exp)) + ') '
									 + printExp(ag.dffBody(exp)) + ')';
			case __SET_TAG__:
				return '(<set> ' + printExp(ag.setVariable(exp)) + ' '
								 + printExp(ag.setValue(exp)) + ')';
			case __APPLICATION_TAG__:
				return '(<application> ' + printExp(ag.aplOperator(exp)) + ' @ '
										 + printExp(ag.aplOperands(exp)) + ')';
			default:
				return '<expression>';
		}
	}

	// TODO: make these prettier
	var printSequence = function(exp) {

		var str = '', idx = 1;
		var len = ag.sequenceLength(exp);

		while (idx < len)
			str += printExp(ag.sequenceAt(exp, idx++)) + ' ';
		
		str += printExp(ag.sequenceAt(exp, idx));
		return str;
	}

	var printBindings = printExp;

	function printPair(exp) {

		var str = '(' + printExp(ag.pairCar(exp));
		var cdr = ag.pairCdr(exp)
		var cdrStr = printExp(cdr);

		if(ag.isPair(cdr)) { // prettier!	
			cdrStr = cdrStr.substring(1, cdrStr.length-1);
			return str + ' ' + cdrStr + ')';
		}

		if (ag.isNull(cdr))
			return str + ')';

		return str + " . " + cdrStr + ')';
	}

	function printVector(exp) {

		var len = ag.vectorLength(exp);
		
		if (len === 0)
			return "#()";

		var str = "#(";
		for(var idx = 1; idx < len; ++idx) {
			str += printExp(ag.vectorRef(exp, idx)) + ' ';
		}
		str += printExp(ag.vectorRef(exp, len)) + ')';
		return str;
	}

	return {
		printExp: printExp
	}
}