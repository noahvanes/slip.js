function COMPILER() {
    'use strict';
    var asm, dct, sym, err;
    var isPair, isNull;
    var car, cdr;
    function link(asmModule, dctModule, symModule, errModule) {
        asm = asmModule;
        dct = dctModule;
        sym = symModule;
        err = errModule;
        car = asm.fpairCar;
        cdr = asm.fpairCdr;
        isPair = asm.fisPair;
        isNull = asm.fisNull;
    }
    function make() {
        var tag = arguments[0];
        var len = arguments.length;
        var chk = asm.fmake(tag, len - 1);
        for (var i = 1; i < len; ++i)
            asm.fset(chk, i, arguments[i]);
        return chk;
    }
    function makeRaw() {
        var tag = arguments[0];
        var len = arguments.length;
        var chk = asm.fmake(tag, len - 1);
        for (var i = 1; i < len; ++i)
            asm.fsetRaw(chk, i, arguments[i]);
        return chk;
    }
    function listLength(lst, err$2) {
        var sum = 0;
        while (isPair(lst)) {
            lst = cdr(lst);
            ++sum;
        }
        if (isNull(lst))
            return sum;
        else
            compilationError(err$2, lst);
    }
    function compilationError(err$2) {
        err$2(arguments[1]);
        throw err$2;
    }
    function compile_exp(exp, tail) {
        try {
            dct.checkpoint();
            return compile(exp, tail > 0);
        } catch (exception) {
            dct.rollback();
            return asm.slipVoid();
        }
    }
    function compile(exp, tailc) {
        if (//compound expression
            isPair(exp)) {
            var opr = car(exp);
            var opd = cdr(exp);
            if (//check for special form
                asm.fisSymbol(opr)) {
                if (asm.feq(opr, sym.loadIff()))
                    return compileIf(opd, tailc);
                else if (asm.feq(opr, sym.loadDef()))
                    return compileDefine(opd);
                else if (asm.feq(opr, sym.loadBeg()))
                    return compileSequence(opd, tailc);
                else if (asm.feq(opr, sym.loadLmb()))
                    return compileLambda(opd);
                else if (asm.feq(opr, sym.loadSet()))
                    return compileAssignment(opd);
                else if (asm.feq(opr, sym.loadQuo()))
                    return compileQuote(opd);
            }
            //otherwise, assume application
            return compileApplication(opr, opd, tailc);
        }
        if (//simple expression
            asm.fisSymbol(exp))
            return compileVariable(exp);
        else
            return exp;
    }
    function compileIf(exp, tailc) {
        if (!isPair(exp))
            compilationError(err.invalidIf);
        var predicate = car(exp);
        var branches = cdr(exp);
        if (!isPair(branches))
            compilationError(err.invalidIf);
        var consequent = car(branches);
        var alternative = cdr(branches);
        var c_predicate = compile(predicate, false);
        var c_consequent = compileInline(consequent, tailc);
        if (asm.fisNull(alternative))
            return make(8, c_predicate, c_consequent);
        else if (asm.fisPair(alternative)) {
            var c_alternative = compile(car(alternative), tailc);
            return make(10, c_predicate, c_consequent, c_alternative);
        } else
            compilationError(err.invalidIf);
    }
    function compileInline(exp, tailc) {
        dct.enterScope();
        var c_exp = compile(exp, true);
        var size = dct.exitScope();
        if (size == 0)
            //no thunking needed
            return compile(exp, tailc);
        size = asm.fmakeNumber(size);
        if (tailc)
            return make(38, c_exp, size);
        else
            return make(32, c_exp, size);
    }
    function compileSequence(exp, tailc) {
        var len = listLength(exp, err.invalidSequence);
        if (len === 0)
            return asm.slipVoid();
        else if (len === 1)
            return compile(car(exp), tailc);
        else {
            var sequence = [6];
            for (var idx = 1; idx < len; ++idx) {
                sequence.push(compile(car(exp), false));
                exp = cdr(exp);
            }
            var last_exp = compile(car(exp), tailc);
            var last_entry = make(56, last_exp);
            sequence.push(last_entry);
            return make.apply(null, sequence);
        }
    }
    function compileDefine(opd) {
        if (!isPair(opd))
            compilationError(err.invalidDefine);
        var identifier = car(opd);
        var definition = cdr(opd);
        if (asm.fisSymbol(identifier))
            return compileVarDefinition(identifier, definition);
        else if (isPair(identifier))
            return compileFunDefinition(identifier, definition);
    }
    function compileVarDefinition(identifier, definition) {
        if (!isPair(definition))
            compilationError(err.invalidDefine);
        var exp = car(definition);
        var rest = cdr(definition);
        if (!asm.fisNull(rest))
            compilationError(err.invalidDefine);
        var pos = dct.defineVar(identifier);
        var ofs = asm.fmakeNumber(pos);
        var c_exp = compile(exp, false);
        return make(12, ofs, c_exp);
    }
    function compileFunDefinition(identifier, body) {
        var fname = car(identifier);
        var parameters = cdr(identifier);
        if (!asm.fisSymbol(fname))
            compilationError(err.invalidDefine);
        var ofs = asm.fmakeNumber(dct.defineVar(fname));
        dct.enterScope();
        var rest = compileParameters(parameters);
        var argc = asm.fmakeNumber(dct.frameSize());
        if (isNull(rest)) {
            var c_body = compileSequence(body, true);
            var frmSiz = asm.fmakeNumber(dct.exitScope());
            return make(14, ofs, argc, frmSiz, c_body);
        } else if (asm.fisSymbol(rest)) {
            dct.defineVar(rest);
            var c_body = compileSequence(body, true);
            var frmSiz = asm.fmakeNumber(dct.exitScope());
            return make(30, ofs, argc, frmSiz, c_body);
        } else
            compilationError(err.invalidDefine);
    }
    function compileParameters(lst) {
        while (isPair(lst)) {
            var par = car(lst);
            if (!asm.fisSymbol(par))
                compilationError(err.invalidParameter, par);
            dct.defineVar(par);
            lst = cdr(lst);
        }
        return lst;
    }
    function compileLambda(exp) {
        if (!isPair(exp))
            compilationError(err.invalidLambda);
        var parameters = car(exp);
        var body = cdr(exp);
        dct.enterScope();
        var rest = compileParameters(parameters);
        var argc = asm.fmakeNumber(dct.frameSize());
        if (isNull(rest)) {
            var c_body = compileSequence(body, true);
            var frmSiz = asm.fmakeNumber(dct.exitScope());
            return make(18, argc, frmSiz, c_body);
        } else if (asm.fisSymbol(rest)) {
            dct.defineVar(rest);
            var c_body = compileSequence(body, true);
            var frmSiz = asm.fmakeNumber(dct.exitScope());
            return make(34, argc, frmSiz, c_body);
        } else
            compilationError(err.invalidParameter);
    }
    function compileAssignment(exp) {
        if (!isPair(exp))
            compilationError(err.invalidAssignment);
        var identifier = car(exp);
        var definition = cdr(exp);
        if (!asm.fisSymbol(identifier) || !isPair(definition) || !isNull(cdr(definition)))
            compilationError(err.invalidAssignment);
        var expression = car(definition);
        var c_exp = compile(expression, false);
        var adr = dct.lexicalAdr(identifier);
        if (adr) {
            var scope = adr.scope;
            var offset = adr.offset;
            var ofs = asm.fmakeNumber(offset);
            if (scope == 0) {
                return make(16, ofs, c_exp);
            } else {
                var scp = asm.fmakeNumber(scope);
                return make(20, scp, ofs, c_exp);
            }
        }
        compilationError(err.undefinedVariable, identifier);
    }
    function compileArguments(opd, argc, tailc) {
        var args = [2];
        for (var i = 1; i < argc; ++i) {
            var exp = car(opd);
            var c_exp = compile(exp, false);
            args.push(c_exp);
            opd = cdr(opd);
        }
        var exp = car(opd);
        var c_exp = compile(exp, tailc);
        args.push(c_exp);
        return make.apply(null, args);
    }
    function compileApplication(opr, opd, tailc) {
        var argc = listLength(opd, err.invalidParameter);
        if (argc === 0) {
            var c_opr = compile(opr, tailc);
            return specializeApz(c_opr, tailc);
        } else {
            var c_opr = compile(opr, false);
            var c_args = compileArguments(opd, argc, tailc);
            return specializeApl(c_opr, c_args, tailc);
        }
    }
    function specializeApz(c_opr, tailc) {
        switch (asm.ftag(c_opr)) {
        case 71:
            var ofs = asm.flocalOfs(c_opr);
            return tailc ? makeRaw(13, ofs) : makeRaw(11, ofs);
        case 72:
            var ofs = asm.fglobalOfs(c_opr);
            return tailc ? makeRaw(7, ofs) : makeRaw(9, ofs);
        case 15:
            var scp = asm.fnlcScp(c_opr);
            var ofs = asm.fnlcOfs(c_opr);
            return tailc ? makeRaw(19, scp, ofs) : makeRaw(17, scp, ofs);
        default:
            return tailc ? make(44, c_opr) : make(46, c_opr);
        }
    }
    function specializeApl(c_opr, c_args, tailc) {
        switch (asm.ftag(c_opr)) {
        case 71:
            var ofs = asm.flocalOfs(c_opr);
            ofs = asm.fmakeNumber(ofs);
            return tailc ? make(50, ofs, c_args) : make(48, ofs, c_args);
        case 72:
            var ofs = asm.fglobalOfs(c_opr);
            ofs = asm.fmakeNumber(ofs);
            return tailc ? make(54, ofs, c_args) : make(52, ofs, c_args);
        case 15:
            var scp = asm.fnlcScp(c_opr);
            var ofs = asm.fnlcOfs(c_opr);
            scp = asm.fmakeNumber(scp);
            ofs = asm.fmakeNumber(ofs);
            return tailc ? make(60, scp, ofs, c_args) : make(58, scp, ofs, c_args);
        default:
            return tailc ? make(42, c_opr, c_args) : make(40, c_opr, c_args);
        }
    }
    function compileQuote(exp) {
        if (!isPair(exp))
            compilationError(err.invalidQuote);
        var quoted = car(exp);
        var rest = cdr(exp);
        if (!asm.fisNull(rest))
            compilationError(err.invalidQuote);
        return make(22, quoted);
    }
    function compileVariable(sym$2) {
        var adr = dct.lexicalAdr(sym$2);
        if (adr) {
            var scope = adr.scope;
            var offset = adr.offset;
            if (scope === 0)
                return asm.fmakeLocal(offset);
            else if (scope === 1)
                return asm.fmakeGlobal(offset);
            else
                return makeRaw(15, scope, offset);
        }
        compilationError(err.undefinedVariable, sym$2);
    }
    return {
        link: link,
        compile: compile_exp
    };
}