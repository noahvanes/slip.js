function COMPILER() {
    'use strict';
    var INLINING_DEPTH = 1;
    var INLINE_LOGGING = false;
    var
        // for debugging, turn on
        asm, dct, sym, err;
    var isPair, isNull;
    var car, cdr;
    var printOut;
    function link(asmModule, dctModule, symModule, errModule, prtModule) {
        asm = asmModule;
        dct = dctModule;
        sym = symModule;
        err = errModule;
        car = asm.fpairCar;
        cdr = asm.fpairCdr;
        isPair = asm.fisPair;
        isNull = asm.fisNull;
        printOut = prtModule.printExp;
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
        this.clean = [];
        var sum = 0;
        while (isPair(lst)) {
            ++sum;
            lst = cdr(lst);
            this.clean.push(lst);
        }
        if (isNull(lst))
            return sum;
        else
            compilationError(err$2, lst);
    }
    function listToArray(lst) {
        this.clean = [];
        this.arr = [];
        while (isPair(lst)) {
            this.arr.push(car(lst));
            lst = cdr(lst);
            this.clean.push(lst);
        }
        return this.arr;
    }
    function makeSeq(items) {
        this.clean = [];
        var len = items.length;
        if (len === 0) {
            return asm.slipVoid();
        } else if (len === 1) {
            return items[0];
        } else {
            var seq = [6];
            for (var i = 0; i < len; ++i) {
                var item = items[i];
                if (// flatten sequences
                    asm.ftag(item) === 6) {
                    var seqlen = asm.fsize(item);
                    for (var j = 1; j < seqlen; ++j) {
                        var exp = asm.fget(item, j);
                        this.clean.push(exp);
                        seq.push(exp);
                    }
                    var last = asm.fget(item, seqlen);
                    this.clean.push(last);
                    last = asm.fstlExp(last);
                    this.clean.push(last);
                    seq.push(last);
                } else {
                    seq.push(item);
                }
            }
            this.tail = make(56, seq.pop());
            seq.push(this.tail);
            return make.apply(null, seq);
        }
    }
    function log_inline(msg) {
        if (INLINE_LOGGING)
            console.log(msg);
    }
    function compilationError(err$2) {
        err$2(arguments[1]);
        throw err$2;
    }
    function compile_exp(exp, tail) {
        try {
            dct.checkpoint();
            return compile.c(exp, tail > 0, false);
        } catch (exception) {
            console.log(exception);
            dct.rollback();
            return asm.slipVoid();
        }
    }
    function compile(exp, tailc, inline) {
        if (//compound expression
            isPair(exp)) {
            this.opr = car(exp);
            this.opd = cdr(exp);
            if (//check for special form
                asm.fisSymbol(this.opr)) {
                if (asm.feq(this.opr, sym.loadIff()))
                    return compileIf.c(this.opd, tailc, inline);
                else if (asm.feq(this.opr, sym.loadDef()))
                    return compileDefine.c(this.opd, false, inline);
                else if (asm.feq(this.opr, sym.loadDfi()))
                    return compileDefine.c(this.opd, true, inline);
                else if (asm.feq(this.opr, sym.loadBeg()))
                    return compileSequence.c(this.opd, tailc, inline);
                else if (asm.feq(this.opr, sym.loadLmb()))
                    return compileLambda.c(this.opd, inline);
                else if (asm.feq(this.opr, sym.loadSet()))
                    return compileAssignment.c(this.opd, inline);
                else if (asm.feq(this.opr, sym.loadQuo()))
                    return compileQuote.c(this.opd);
            }
            return compileApplication.c(this.opr, this.opd, tailc, inline);
        }
        if (//simple expression
            asm.fisSymbol(exp))
            return compileVariable.c(exp, inline);
        else
            return exp;
    }
    function compileIf(exp, tailc, inline) {
        if (!isPair(exp))
            compilationError(err.invalidIf);
        this.predicate = car(exp);
        this.branches = cdr(exp);
        if (!isPair(this.branches))
            compilationError(err.invalidIf);
        this.consequent = car(this.branches);
        this.alternative = cdr(this.branches);
        this.c_predicate = compile.c(this.predicate, false, inline);
        this.c_consequent = compileInline.c(this.consequent, tailc, inline);
        if (asm.fisNull(this.alternative))
            return make(8, this.c_predicate, this.c_consequent);
        else if (asm.fisPair(this.alternative)) {
            this.alt = car(this.alternative);
            this.rest = cdr(this.alternative);
            if (!isNull(this.rest)) {
                compilationError(err.invalidIf);
            }
            this.c_alternative = compileInline.c(this.alt, tailc, inline);
            return make(10, this.c_predicate, this.c_consequent, this.c_alternative);
        } else
            compilationError(err.invalidIf);
    }
    function compileInline(exp, tailc, inline) {
        if (//inlining definition are allowed
            inline) {
            var defCount = inline.offset;
            this.c_exp = compile.c(exp, tailc, inline);
            if (inline.offset > defCount)
                throw false;
            return this.c_exp;
        }
        dct.enterScope();
        this.c_exp = compile.c(exp, true, false);
        var defSize = dct.frameSize();
        var actualSize = dct.exitScope();
        if (defSize === 0)
            //no thunking needed
            return compile.c(exp, tailc, false);
        this.siz = asm.fmakeNumber(actualSize);
        var tag = tailc ? 38 : 32;
        return make(tag, this.c_exp, this.siz);
    }
    function compileSequence(seq, tailc, inline) {
        this.clean = [];
        this.items = [];
        var len = listLength.c(seq, err.invalidSequence);
        for (var idx = 1; idx < len; ++idx) {
            var exp = car(seq);
            seq = cdr(seq);
            var c_exp = compile.c(exp, false, inline);
            this.items.push(c_exp);
            this.clean.push(exp);
            this.clean.push(seq);
        }
        if (len > 0) {
            var exp = car(seq);
            var c_exp = compile.c(exp, tailc, inline);
            this.items.push(c_exp);
            this.clean.push(exp);
        }
        return makeSeq.c(this.items);
    }
    function compileDefine(opd, constant, inline) {
        if (!isPair(opd))
            compilationError(err.invalidDefine);
        this.identifier = car(opd);
        this.definition = cdr(opd);
        if (asm.fisSymbol(this.identifier))
            return compileVarDefinition.c(this.identifier, this.definition, constant, inline);
        else if (isPair(this.identifier))
            return compileFunDefinition.c(this.identifier, this.definition, constant, inline);
    }
    function compileVarDefinition(identifier$2, definition, constant, inline) {
        if (!isPair(definition))
            compilationError(err.invalidDefine);
        this.exp = car(definition);
        this.rest = cdr(definition);
        if (!asm.fisNull(this.rest))
            compilationError(err.invalidDefine);
        var pos;
        if (inline) {
            pos = ++inline.offset;
            inline.defs.push({
                name: asm.fcopy(identifier$2),
                offset: pos
            });
        } else {
            pos = dct.defineVar(identifier$2, constant);
        }
        this.ofs = asm.fmakeNumber(pos);
        this.c_exp = compile.c(this.exp, false, inline);
        return make(12, this.ofs, this.c_exp);
    }
    function compileFunDefinition(identifier$2, body, constant, inline) {
        if (inline)
            throw false;
        this.fname = car(identifier$2);
        this.parameters = cdr(identifier$2);
        if (!asm.fisSymbol(this.fname))
            compilationError(err.invalidDefine);
        this.ofs = asm.fmakeNumber(dct.defineVar(this.fname, constant));
        dct.enterScope();
        this.rest = compileParameters.c(this.parameters);
        this.argc = asm.fmakeNumber(dct.frameSize());
        if (isNull(this.rest) && constant) {
            var // inlining possible
            fun = dct.registerFunction(body, this.parameters, asm.fnumberVal(this.argc));
            this.c_body = compileSequence.c(body, true, false);
            this.frmSiz = asm.fmakeNumber(dct.exitScope());
            if (fun.inlined) {
                dct.unregisterFunction(fun);
            }
            ;
            return make(14, this.ofs, this.argc, this.frmSiz, this.c_body);
        } else if (isNull(this.rest)) {
            this.c_body = compileSequence.c(body, true, false);
            this.frmSiz = asm.fmakeNumber(dct.exitScope());
            return make(14, this.ofs, this.argc, this.frmSiz, this.c_body);
        } else if (asm.fisSymbol(this.rest)) {
            dct.defineVar(this.rest, false);
            this.c_body = compileSequence.c(body, true, false);
            this.frmSiz = asm.fmakeNumber(dct.exitScope());
            return make(30, this.ofs, this.argc, this.frmSiz, this.c_body);
        } else
            compilationError(err.invalidDefine);
    }
    function compileParameters(lst) {
        this.clean = [];
        while (isPair(lst)) {
            var par = car(lst);
            if (!asm.fisSymbol(par))
                compilationError(err.invalidParameter, par);
            dct.defineVar(par, false);
            lst = cdr(lst);
            this.clean.push(par);
            this.clean.push(lst);
        }
        return lst;
    }
    function compileLambda(exp, inline) {
        if (inline)
            throw false;
        if (!isPair(exp))
            compilationError(err.invalidLambda);
        this.parameters = car(exp);
        this.body = cdr(exp);
        dct.enterScope();
        this.rest = compileParameters.c(this.parameters);
        this.argc = asm.fmakeNumber(dct.frameSize());
        if (isNull(this.rest)) {
            this.c_body = compileSequence.c(this.body, true, false);
            this.frmSiz = asm.fmakeNumber(dct.exitScope());
            return make(18, this.argc, this.frmSiz, this.c_body);
        } else if (asm.fisSymbol(this.rest)) {
            dct.defineVar(this.rest, false);
            this.c_body = compileSequence.c(this.body, true, false);
            this.frmSiz = asm.fmakeNumber(dct.exitScope());
            return make(34, this.argc, this.frmSiz, this.c_body);
        } else
            compilationError(err.invalidParameter);
    }
    function lookupInline(identifier$2, inline) {
        var locals = inline.locals;
        var len = locals.length;
        for (var i = len - 1; i >= 0; --i) {
            var local = locals[i];
            if (asm.feq(local.name, identifier$2))
                return local.value;
        }
        return false;
    }
    function lookupDefs(identifier$2, inline) {
        var defs = inline.defs;
        var len = defs.length;
        for (var i = len - 1; i >= 0; --i) {
            var def = defs[i];
            if (asm.feq(def.name, identifier$2))
                return def.offset;
        }
        return false;
    }
    function compileAssignment(exp, inline) {
        if (!isPair(exp))
            compilationError(err.invalidAssignment);
        this.identifier = car(exp);
        this.definition = cdr(exp);
        if (!asm.fisSymbol(this.identifier) || !isPair(this.definition))
            compilationError(err.invalidAssignment);
        this.expression = car(this.definition);
        this.c_exp = compile.c(this.expression, false, inline);
        var adr;
        if (inline) {
            var ofs = lookupDefs(this.identifier, inline);
            if (ofs)
                adr = {
                    scope: 0,
                    offset: ofs
                };
            else if (lookupInline(this.identifier, inline))
                throw false;
            else
                // cannot assign inlined argument
                adr = dct.lookupEnvironment(this.identifier, inline.env);
        } else {
            adr = dct.lexicalAdr(this.identifier);
        }
        if (adr) {
            var scope = adr.scope;
            var offset = adr.offset;
            var vrb = dct.lookup(scope, offset);
            if (vrb.constant)
                compilationError(err.constantViolation, identifier);
            this.ofs = asm.fmakeNumber(offset);
            if (scope == 0) {
                return make(16, this.ofs, this.c_exp);
            } else {
                this.scp = asm.fmakeNumber(scope);
                return make(20, this.scp, this.ofs, this.c_exp);
            }
        }
        compilationError(err.undefinedVariable, identifier);
    }
    function compileVariable(sym$2, inline) {
        var adr;
        if (inline) {
            var ofs = lookupDefs(sym$2, inline);
            if (ofs) {
                adr = {
                    scope: 0,
                    offset: ofs
                };
            } else {
                var val = lookupInline(sym$2, inline);
                if (val)
                    return asm.fcopy(val);
                else
                    adr = dct.lookupEnvironment(sym$2, inline.env);
            }
        } else {
            adr = dct.lexicalAdr(sym$2);
        }
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
    function compileQuote(exp) {
        if (!isPair(exp))
            compilationError(err.invalidQuote);
        this.quoted = car(exp);
        this.rest = cdr(exp);
        if (!asm.fisNull(this.rest))
            compilationError(err.invalidQuote);
        return make(22, this.quoted);
    }
    function compileArguments(opd, argc, tailc, inline) {
        this.clean = [];
        var args = [2];
        for (var i = 1; i < argc; ++i) {
            var exp = car(opd);
            var c_exp = compile.c(exp, false, inline);
            args.push(c_exp);
            opd = cdr(opd);
            this.clean.push(exp);
            this.clean.push(c_exp);
            this.clean.push(opd);
        }
        this.exp = car(opd);
        this.c_exp = compile.c(this.exp, tailc, inline);
        args.push(this.c_exp);
        return [
            make.apply(null, args),
            compile.c(this.exp, false, inline)
        ];
    }
    function compileApplication(opr, opd, tailc, inline) {
        var argc = listLength.c(opd, err.invalidParameter);
        if (argc === 0) {
            this.c_opr = compile.c(opr, tailc, inline);
            return specializeApz.c(this.c_opr, tailc, inline);
        } else {
            this.c_opr = compile.c(opr, false, inline);
            this.c_args = compileArguments.c(opd, argc, tailc, inline);
            return specializeApl.c(this.c_opr, this.c_args, tailc, inline);
        }
    }
    function specializeApz(c_opr, tailc, inline) {
        this.empty_vec = make(2);
        switch (asm.ftag(c_opr)) {
        case 71:
            var ofs = asm.flocalOfs(c_opr);
            try {
                return inlineApplication.c(0, ofs, this.empty_vec, tailc, inline);
            } catch (e) {
                if (e)
                    throw e;
                return tailc ? makeRaw(13, ofs) : makeRaw(11, ofs);
            }
        case 72:
            var ofs = asm.fglobalOfs(c_opr);
            try {
                return inlineApplication.c(1, ofs, this.empty_vec, tailc, inline);
            } catch (e) {
                if (e)
                    throw e;
                return tailc ? makeRaw(7, ofs) : makeRaw(9, ofs);
            }
        case 15:
            var scp = asm.fnlcScp(c_opr);
            var ofs = asm.fnlcOfs(c_opr);
            try {
                return inlineApplication.c(scp, ofs, this.empty_vec, tailc, inline);
            } catch (e) {
                if (e)
                    throw e;
                return tailc ? makeRaw(19, scp, ofs) : makeRaw(17, scp, ofs);
            }
        default:
            return tailc ? make(44, c_opr) : make(46, c_opr);
        }
    }
    function specializeApl(c_opr, args, tailc, inline) {
        switch (asm.ftag(c_opr)) {
        case 71:
            var ofs = asm.flocalOfs(c_opr);
            try {
                return inlineApplication.c(0, ofs, args, tailc, inline);
            } catch (e) {
                if (e)
                    throw e;
                this.ofs = asm.fmakeNumber(ofs);
                var tag = tailc ? 50 : 48;
                return make(tag, this.ofs, args[0]);
            }
        case 72:
            var ofs = asm.fglobalOfs(c_opr);
            try {
                return inlineApplication.c(1, ofs, args, tailc, inline);
            } catch (e) {
                if (e)
                    throw e;
                this.ofs = asm.fmakeNumber(ofs);
                var tag$2 = tailc ? 54 : 52;
                return make(tag$2, this.ofs, args[0]);
            }
        case 15:
            var scp = asm.fnlcScp(c_opr);
            var ofs = asm.fnlcOfs(c_opr);
            try {
                return inlineApplication.c(scp, ofs, args, tailc, inline);
            } catch (e) {
                if (e)
                    throw e;
                this.scp = asm.fmakeNumber(scp);
                this.ofs = asm.fmakeNumber(ofs);
                var tag$3 = tailc ? 60 : 58;
                return make(tag$3, this.scp, this.ofs, args[0]);
            }
        default:
            var tag$4 = tailc ? 42 : 40;
            return make(tag$4, c_opr, args[0]);
        }
    }
    function inlineApplication(scp, ofs, args, tailc, inl) {
        var fun = dct.lookup(scp, ofs);
        if (!fun.inline || fun.inlining >= INLINING_DEPTH) {
            throw false;
        }
        log_inline('inlining ' + asm.stringText(fun.name) + '(' + fun.inlining + ')');
        var frmMinSiz = dct.getMinimumFrameSize();
        var defOffset = inl ? inl.offset : dct.frameSize();
        if (fun.argc !== asm.fvectorLength(args[0]))
            compilationError(err.invalidParamCount);
        try {
            ++fun.inlining;
            var //increase counter
            inline = Object.create(null);
            this.expressions = bindInline.c(args, fun.params, inline, defOffset);
            inline.env = fun.env;
            // set lexical environment
            this.body = compileSequence.c(fun.body, tailc, inline);
            dct.setMinimumFrameSize(inline.offset);
            fun.inlined = true;
            log_inline('successfully inlined ' + asm.stringText(fun.name) + '(' + fun.inlining + ')');
            return makeInlineBody.c(this.expressions, this.body, defOffset);
        } catch (e) {
            fun.inlined = false;
            log_inline('failed to inline ' + asm.stringText(fun.name) + '(' + fun.inlining + ')');
            dct.resetMinimumFrameSize(frmMinSiz);
            dct.unregisterFunction(fun);
            throw e;
        } finally {
            --fun.inlining;
            //manage references for proper clean-up
            this.inlinedNames = inline.locals.map(x$2263 => x$2263.name);
            this.inlinedValues = inline.locals.map(x$2264 => x$2264.value);
            this.localDefs = inline.defs.map(x$2265 => x$2265.name);
        }
    }
    function bindInline(args, params, inline, ofs) {
        this.clean = [];
        this.expressions = [];
        var inlinedLocals = [];
        var argDefinitions = [];
        var c_args = args[0];
        var len = asm.fvectorLength(c_args);
        for (var i = 1; i <= len; ++i) {
            var param = car(params);
            var arg = asm.vectorAt(c_args, i);
            var tag = asm.ftag(arg);
            switch (tag) {
            case 68:
            case 67:
            case 65:
            case 66:
            case 69:
            case 64:
            case 5:
            case 1:
            case 22:
            case 72:
            case 15:
            case 71:
                inlinedLocals.push({
                    name: param,
                    value: arg
                });
                break;
            default:
                this.clean.push(arg);
                arg = i === len ? asm.fcopy(args[1]) : arg;
                argDefinitions.push({
                    name: param,
                    offset: ++ofs
                });
                this.expressions.push(arg);
            }
            params = cdr(params);
            this.clean.push(params);
        }
        inline.offset = ofs;
        inline.defs = argDefinitions;
        inline.locals = inlinedLocals;
        return this.expressions;
    }
    function makeInlineBody(expressions, body, offset) {
        this.clean = [];
        var len = expressions.length;
        var bdy = body;
        while (len) {
            var idx = asm.fmakeNumber(offset + len);
            var exp = expressions[--len];
            bdy = make(26, idx, exp, bdy);
            this.clean.push(bdy);
        }
        return bdy;
    }
    return {
        link: link,
        compile: compile_exp
    };
}