function PRINTER() {
    'use strict';
    var getTag, numberVal, floatNumber, charCode, stringText, symbolLength, symbolAt, pairCar, pairCdr, isPair, isNull, vectorAt, vectorLength, ag;
    function link(asm) {
        getTag = asm.ftag;
        numberVal = asm.fnumberVal;
        floatNumber = asm.ffloatNumber;
        charCode = asm.fcharCode;
        stringText = asm.stringText;
        symbolLength = asm.ftextLength;
        symbolAt = asm.ftextGetChar;
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
            return numberVal(exp).toString();
        case 64:
            return '#\\' + String.fromCharCode(charCode(exp).toString());
        case 0:
            return printPair(exp);
        case 2:
            return printVector(exp);
        case 5:
            return stringText(exp);
        case 1:
            return floatNumber(exp).toString();
        case 70:
            return '#<native procedure>';
        case 24:
            return '#<continuation>';
        case 3:
            return symbolText(exp);
        case 4:
        case 36:
            return '#<procedure>';
        case 71:
            return '#<local variable @ offset ' + ag.flocalOfs(exp) + '>';
        case 72:
            return '#<global variable @ offset: ' + ag.fglobalOfs(exp) + '>';
        case 15:
            return '#<non-local variable @ scope-level/offset: ' + ag.fnlcScp(exp) + '/' + ag.fnlcOfs(exp) + '>';
        case 6:
            return '#<sequence ' + printSequence(exp) + '>';
        case 8:
            return '#<simple-if ' + printExp(ag.fifsPredicate(exp)) + ' ' + printExp(ag.fifsConsequence(exp)) + '>';
        case 10:
            return '#<full-if ' + printExp(ag.fiffPredicate(exp)) + ' ' + printExp(ag.fiffConsequence(exp)) + ' ' + printExp(ag.fiffAlternative(exp)) + '>';
        case 32:
            return '#<thunk (size: ' + printExp(ag.fthunkSiz(exp)) + '; body: ' + printExp(ag.fthunkExp(exp)) + ')>';
        case 38:
            return '#<thunk* (size: ' + printExp(ag.fttkSiz(exp)) + '; body: ' + printExp(ag.fttkExp(exp)) + ')>';
        case 26:
            return '#<binding (ofs: ' + printExp(ag.fbndOfs(exp)) + '; value: ' + printExp(ag.fbndVal(exp)) + '; body: ' + printExp(ag.fbndBdy(exp)) + ')>';
        case 22:
            return '#<quote ' + printExp(ag.fquoExpression(exp)) + '>';
        case 18:
            return '#<lambda (argument count: ' + printExp(ag.flmbArgc(exp)) + '; frame size: ' + printExp(ag.flmbFrmSiz(exp)) + '; body: ' + printExp(ag.flmbBdy(exp)) + ')>';
        case 34:
            return '#<lambda (argument* count: ' + printExp(ag.flmzArgc(exp)) + '; frame size: ' + printExp(ag.flmzFrmSiz(exp)) + '; body: ' + printExp(ag.flmzBdy(exp)) + ')>';
        case 12:
            return '#<variable definition @ offset ' + printExp(ag.fdfvOfs(exp)) + ' (value: ' + printExp(ag.fdfvVal(exp)) + ')>';
        case 14:
            return '#<function definition @ offset ' + printExp(ag.fdffOfs(exp)) + ' (argument count: ' + printExp(ag.fdffArgc(exp)) + '; frame size:  ' + printExp(ag.fdffFrmSiz(exp)) + '; body:  ' + printExp(ag.fdffBdy(exp)) + ')>';
        case 30:
            return '#<function definition @ offset ' + printExp(ag.fdfzOfs(exp)) + ' (argument* count: ' + printExp(ag.fdfzArgc(exp)) + '; frame size:  ' + printExp(ag.fdfzFrmSiz(exp)) + '; body:  ' + printExp(ag.fdfzBdy(exp)) + ')>';
        case 20:
            return '#<assignment @ scope-level/offset: ' + printExp(ag.fsglScp(exp)) + '/' + printExp(ag.fsglOfs(exp)) + ' (value: ' + printExp(ag.fsglVal(exp)) + ')>';
        case 16:
            return '#<local assignment @ offset: ' + printExp(ag.fslcOfs(exp)) + ' (value: ' + printExp(ag.fslcVal(exp)) + ')>';
        case 46:
            return '#<application (zero argument): ' + printExp(ag.fapzOpr(exp)) + '>';
        case 11:
            return '#<local application (zero argument) @ offset ' + ag.falzOfs(exp) + '>';
        case 17:
            return '#<non-local application (zero argument) @ scope/offset: ' + ag.fanzScp(exp) + '/' + ag.fanzOfs(exp) + '>';
        case 9:
            return '#<global application (zero argument) @ offset ' + ag.fagzOfs(exp) + '>';
        case 44:
            return '#<tail call (zero argument): ' + printExp(ag.ftpzOpr(exp)) + '>';
        case 13:
            return '#<local tail call (zero argument) @ offset ' + ag.ftlzOfs(exp) + '>';
        case 19:
            return '#<non-local tail call (zero argument) @ scope/offset: ' + ag.ftnzScp(exp) + '/' + ag.ftnzOfs(exp) + '>';
        case 7:
            return '#<global tail call (zero argument) @ offset ' + ag.ftgzOfs(exp) + '>';
        case 40:
            return '#<application ' + printExp(ag.faplOpr(exp)) + ' @ ' + printExp(ag.faplOpd(exp)) + '>';
        case 48:
            return '#<local application (offset: ' + printExp(ag.fallOfs(exp)) + ') @ ' + printExp(ag.fallOpd(exp)) + '>';
        case 58:
            return '#<non-local application (scope/offset: ' + printExp(ag.fanlScp(exp)) + '/' + printExp(ag.fanlOfs(exp)) + ') @ ' + printExp(ag.fanlOpd(exp)) + '>';
        case 52:
            return '#<global application (offset: ' + printExp(ag.faglOfs(exp)) + ') @' + printExp(ag.faglOpd(exp)) + '>';
        case 42:
            return '#<tail call ' + printExp(ag.ftplOpr(exp)) + ' @ ' + printExp(ag.ftplOpd(exp)) + '>';
        case 50:
            return '#<local tail call (offset ' + printExp(ag.ftllOfs(exp)) + ') @ ' + printExp(ag.ftllOpd(exp)) + '>';
        case 60:
            return '#<non-local tail call (scope/offset: ' + printExp(ag.ftnlScp(exp)) + '/' + printExp(ag.ftnlOfs(exp)) + ') @ ' + printExp(ag.ftnlOpd(exp)) + '>';
        case 54:
            return '#<global tail call (offset: ' + printExp(ag.ftglOfs(exp)) + ') @' + printExp(ag.ftglOpd(exp)) + '>';
        case 56:
            return '#<sequence tail (body: ' + printExp(ag.fstlExp(exp)) + ')>';
        default:
            return '<unknown expression (tag: ' + tag + ')>';
        }
    }
    var printSequence = function (exp) {
        var str = '', idx = 1;
        var len = ag.sequenceLength(exp);
        while (idx < len)
            str += printExp(ag.sequenceAt(exp, idx++)) + ' ';
        str += printExp(ag.fstlExp(ag.sequenceAt(exp, idx)));
        return str;
    };
    function symbolText(chk) {
        var len = symbolLength(chk);
        var arr = new Array(len);
        for (var i = 0; i < len; ++i)
            arr[i] = symbolAt(chk, i);
        return String.fromCharCode.apply(null, arr);
    }
    function printPair(exp) {
        var str = '(' + printExp(pairCar(exp));
        var cdr = pairCdr(exp);
        var cdrStr = printExp(cdr);
        if (isPair(cdr)) {
            // prettier!
            cdrStr = cdrStr.substring(1, cdrStr.length - 1);
            return str + ' ' + cdrStr + ')';
        }
        if (isNull(cdr))
            return str + ')';
        return str + ' . ' + cdrStr + ')';
    }
    function printVector(exp) {
        var len = vectorLength(exp);
        if (len === 0)
            return '#()';
        var str = '#(';
        for (var idx = 1; idx < len; ++idx) {
            str += printExp(vectorAt(exp, idx)) + ' ';
        }
        str += printExp(vectorAt(exp, len)) + ')';
        return str;
    }
    return {
        printExp: printExp,
        link: link
    };
}