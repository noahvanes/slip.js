function PRINTER() {
    'use strict';
    function printExp(exp) {
        var tag = ag.tag(exp);
        switch (tag) {
        case 68:
            return '()';
        case 67:
            return '#<void>';
        case 65:
            return '#t';
        case 66:
            return '#f';
        case 69:
            return ag.numberVal(exp).toString();
        case 64:
            return '#\\' + String.fromCharCode(ag.charCode(exp).toString());
        case 0:
            return printPair(exp);
        case 4:
            return '#<procedure>';
        case 2:
            return printVector(exp);
        case 5:
            return '"' + ag.stringText(exp) + '"';
        case 1:
            return ag.floatNumber(exp).toString();
        case 70:
            return '#<native procedure>';
        case 3:
            return ag.symbolText(exp);
        case 6:
            return '(<sequence> ' + printSequence(exp) + ')';
        case 8:
            return '(<if> ' + printExp(ag.ifsPredicate(exp)) + ' ' + printExp(ag.ifsConsequence(exp)) + ')';
        case 10:
            return '(<if> ' + printExp(ag.iffPredicate(exp)) + ' ' + printExp(ag.iffConsequence(exp)) + ' ' + printExp(ag.iffAlternative(exp)) + ')';
        case 22:
            return '(<quote> ' + printExp(ag.quoExpression(exp)) + ')';
        case 18:
            return '(<lambda> ' + printExp(ag.lambdaArg(exp)) + ' ' + printExp(ag.lambdaBdy(exp)) + ')';
        case 12:
            return '(<define> ' + printExp(ag.dfvVariable(exp)) + ' ' + printExp(ag.dfvValue(exp)) + ')';
        case 14:
            return '(<define> (' + printExp(ag.dffVariable(exp)) + ' ' + printExp(ag.dffArguments(exp)) + ') ' + printExp(ag.dffBody(exp)) + ')';
        case 20:
            return '(<set> ' + printExp(ag.setVariable(exp)) + ' ' + printExp(ag.setValue(exp)) + ')';
        case 16:
            return '(<application> ' + printExp(ag.aplOperator(exp)) + ' @ ' + printExp(ag.aplOperands(exp)) + ')';
        default:
            return '<expression>';
        }
    }
    var // TODO: make these prettier
    printSequence = function (exp) {
        var str = '', idx = 1;
        var len = ag.sequenceLength(exp);
        while (idx < len)
            str += printExp(ag.sequenceAt(exp, idx++)) + ' ';
        str += printExp(ag.sequenceAt(exp, idx));
        return str;
    };
    var printBindings = printExp;
    function printPair(exp) {
        var str = '(' + printExp(ag.pairCar(exp));
        var cdr = ag.pairCdr(exp);
        var cdrStr = printExp(cdr);
        if (ag.isPair(cdr)) {
            // prettier!	
            cdrStr = cdrStr.substring(1, cdrStr.length - 1);
            return str + ' ' + cdrStr + ')';
        }
        if (ag.isNull(cdr))
            return str + ')';
        return str + ' . ' + cdrStr + ')';
    }
    function printVector(exp) {
        var len = ag.vectorLength(exp);
        if (len === 0)
            return '#()';
        var str = '#(';
        for (var idx = 1; idx < len; ++idx) {
            str += printExp(ag.vectorRef(exp, idx)) + ' ';
        }
        str += printExp(ag.vectorRef(exp, len)) + ')';
        return str;
    }
    return { printExp: printExp };
}