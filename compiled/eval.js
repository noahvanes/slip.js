function EVALUATOR() {
    'use strict';
    var car = ag.pairCar;
    var cdr = ag.pairCdr;
    var ref = ag.vectorRef;
    var set = ag.vectorSet;
    function _eval() {
        regs.TAG = ag.tag(regs.EXP);
        switch (regs.TAG) {
        case 68:
        case 67:
        case 65:
        case 66:
        case 69:
        case 64:
        case 0:
        case 4:
        case 2:
        case 5:
        case 1:
        case 70:
            return evalSelf;
        case 3:
            return evalVariable;
        case 6:
            return evalSequence;
        case 8:
            return evalIfs;
        case 10:
            return evalIff;
        case 22:
            return evalQuote;
        case 18:
            return evalLambda;
        case 12:
            return evalDfv;
        case 14:
            return evalDff;
        case 20:
            return evalSet;
        case 16:
            return evalApplication;
        default:
            regs.TXT = 'Invalid expression';
            return error;
        }
    }
    function evalSelf() {
        regs.VAL = regs.EXP;
        return regs.KON;
    }
    function evalVariable() {
        regs.LST = regs.FRM;
        while (/* SEARCH IN LOCAL SCOPE */
            ag.isPair(regs.LST)) {
            regs.BND = car(regs.LST);
            regs.PAT = car(regs.BND);
            if (regs.PAT === regs.EXP) {
                regs.VAL = cdr(regs.BND);
                return regs.KON;
            }
            regs.LST = cdr(regs.LST);
        }
        if (ag.isNull(regs.ENV)) {
            regs.TXT = 'undefined local variable: ';
            regs.TXT += printExp(regs.EXP);
            return error;
        }
        /* SEARCH IN NON-LOCAL SCOPE */
        regs.LST = regs.ENV;
        do {
            regs.DCT = car(regs.LST);
            while (ag.isPair(regs.DCT)) {
                regs.BND = car(regs.DCT);
                regs.PAT = car(regs.BND);
                if (regs.PAT === regs.EXP) {
                    regs.VAL = cdr(regs.BND);
                    return regs.KON;
                }
                regs.DCT = cdr(regs.DCT);
            }
            regs.LST = cdr(regs.LST);
        } while (ag.isPair(regs.LST));
        regs.TXT = 'undefined non-local variable';
        regs.TXT += printExp(regs.EXP);
        return error;
    }
    function evalDfv() {
        vm.claim();
        regs.PAT = ag.dfvVariable(regs.EXP);
        regs.EXP = ag.dfvValue(regs.EXP);
        stk.save(regs.KON);
        mem.push(regs.PAT);
        regs.KON = c_define;
        return _eval;
    }
    function evalDff() {
        vm.claimSiz(64);
        //claim some extra size 
        regs.PAT = ag.dffVariable(regs.EXP);
        regs.PAR = ag.dffArguments(regs.EXP);
        regs.SEQ = ag.dffBody(regs.EXP);
        regs.BND = ag.makePair(regs.PAT, 2147483645);
        regs.FRM = ag.makePair(regs.BND, regs.FRM);
        regs.ENV = ag.makePair(regs.FRM, regs.ENV);
        regs.VAL = ag.makeProcedure(regs.PAR, regs.SEQ, regs.ENV);
        ag.pairSetCdr(regs.BND, regs.VAL);
        regs.ENV = cdr(regs.ENV);
        return regs.KON;
    }
    function c_define() {
        vm.claim();
        regs.PAT = mem.pop();
        regs.KON = stk.restore();
        regs.BND = ag.makePair(regs.PAT, regs.VAL);
        regs.FRM = ag.makePair(regs.BND, regs.FRM);
        return regs.KON;
    }
    function evalSet() {
        vm.claim();
        regs.PAT = ag.setVariable(regs.EXP);
        regs.EXP = ag.setValue(regs.EXP);
        /* SEARCH IN LOCAL SCOPE */
        regs.LST = regs.FRM;
        while (ag.isPair(regs.LST)) {
            regs.BND = car(regs.LST);
            if (car(regs.BND) === regs.PAT) {
                mem.push(regs.BND);
                stk.save(regs.KON);
                regs.KON = c_set;
                return _eval;
            }
            regs.LST = cdr(regs.LST);
        }
        if (ag.isNull(regs.ENV)) {
            regs.TXT = 'Undefined local variable';
            return error;
        }
        /* SEARCH IN NON-LOCAL SCOPE */
        regs.LST = regs.ENV;
        do {
            regs.DCT = car(regs.LST);
            while (ag.isPair(regs.DCT)) {
                regs.BND = car(regs.DCT);
                if (car(regs.BND) === regs.PAT) {
                    mem.push(regs.BND);
                    stk.save(regs.KON);
                    regs.KON = c_set;
                    return _eval;
                }
                regs.DCT = cdr(regs.DCT);
            }
            regs.LST = cdr(regs.LST);
        } while (ag.isPair(regs.LST));
        regs.TXT = 'Undefined non-local variable';
        return error;
    }
    function c_set() {
        regs.BND = mem.pop();
        regs.KON = stk.restore();
        ag.pairSetCdr(regs.BND, regs.VAL);
        return regs.KON;
    }
    function evalQuote() {
        regs.VAL = ag.quoExpression(regs.EXP);
        return regs.KON;
    }
    function evalSequence() {
        vm.claim();
        mem.push(regs.EXP);
        regs.EXP = ag.sequenceAt(regs.EXP, 1);
        stk.save(regs.KON);
        regs.KON = c_sequence;
        stk.save(1);
        return _eval;
    }
    function c_sequence() {
        regs.SEQ = mem.peek();
        regs.IDX = stk.peek();
        regs.LEN = ag.sequenceLength(regs.SEQ);
        regs.EXP = ag.sequenceAt(regs.SEQ, ++regs.IDX);
        if (regs.IDX === regs.LEN) {
            mem.zap();
            //skip sequence vector
            stk.zap();
            //skip counter
            regs.KON = stk.restore();
        } else {
            stk.poke(regs.IDX);
        }
        return _eval;
    }
    function evalIfs() {
        vm.claim();
        mem.push(ag.ifsConsequence(regs.EXP));
        regs.EXP = ag.ifsPredicate(regs.EXP);
        stk.save(regs.KON);
        regs.KON = c_ifs;
        return _eval;
    }
    function c_ifs() {
        regs.EXP = mem.pop();
        if (!ag.isFalse(regs.VAL)) {
            vm.claim();
            regs.KON = stk.peek();
            if (regs.KON === c_return) {
                stk.zap();
            } else {
                mem.push(regs.FRM);
                mem.push(regs.ENV);
                regs.KON = c_return;
            }
            regs.ENV = ag.makePair(regs.FRM, regs.ENV);
            regs.FRM = 2147483645;
            return _eval;
        }
        regs.VAL = 2147483647;
        regs.KON = stk.restore();
        return regs.KON;
    }
    function evalIff() {
        vm.claim();
        mem.push(regs.EXP);
        regs.EXP = ag.iffPredicate(regs.EXP);
        stk.save(regs.KON);
        regs.KON = c_iff;
        return _eval;
    }
    function c_iff() {
        vm.claim();
        regs.EXP = mem.pop();
        regs.KON = stk.peek();
        if (regs.KON === c_return) {
            stk.zap();
        } else {
            mem.push(regs.FRM);
            mem.push(regs.ENV);
            regs.KON = c_return;
        }
        regs.ENV = ag.makePair(regs.FRM, regs.ENV);
        regs.FRM = 2147483645;
        if (ag.isFalse(regs.VAL))
            regs.EXP = ag.iffAlternative(regs.EXP);
        else
            regs.EXP = ag.iffConsequence(regs.EXP);
        return _eval;
    }
    function evalLambda() {
        vm.claim();
        regs.PAR = ag.lambdaArg(regs.EXP);
        regs.SEQ = ag.lambdaBdy(regs.EXP);
        regs.DCT = ag.makePair(regs.FRM, regs.ENV);
        regs.VAL = ag.makeProcedure(regs.PAR, regs.SEQ, regs.DCT);
        return regs.KON;
    }
    function evalApplication() {
        vm.claim();
        mem.push(ag.aplOperands(regs.EXP));
        regs.EXP = ag.aplOperator(regs.EXP);
        stk.save(regs.KON);
        regs.KON = c1_application;
        return _eval;
    }
    function c1_application() {
        regs.ARG = mem.peek();
        regs.LEN = ag.vectorLength(regs.ARG);
        if (regs.LEN === 0) {
            mem.zap();
            //skips empty vec
            regs.ARG = 2147483645;
            regs.LEN = 0;
            regs.KON = stk.restore();
            return apply;
        }
        vm.claim();
        mem.poke(regs.VAL);
        regs.EXP = ag.vectorRef(regs.ARG, 1);
        stk.save(1);
        if (regs.LEN === 1) {
            regs.KON = c3_application;
        } else {
            regs.KON = c2_application;
            mem.push(regs.ARG);
        }
        return _eval;
    }
    function c2_application() {
        regs.ARG = mem.peek();
        regs.IDX = stk.peek();
        mem.poke(regs.VAL);
        stk.poke(++regs.IDX);
        regs.EXP = ag.vectorRef(regs.ARG, regs.IDX);
        if (regs.IDX === ag.vectorLength(regs.ARG)) {
            regs.KON = c3_application;
        } else {
            vm.claim();
            mem.push(regs.ARG);
        }
        return _eval;
    }
    function c3_application() {
        regs.LEN = regs.IDX = stk.restore();
        vm.claimSiz(3 * regs.LEN);
        //sizeof(pair) = 3
        regs.ARG = ag.makePair(regs.VAL, 2147483645);
        while (--regs.IDX)
            regs.ARG = ag.makePair(mem.pop(), regs.ARG);
        regs.VAL = mem.pop();
        regs.KON = stk.restore();
        return apply;
    }
    function apply() {
        regs.TAG = ag.tag(regs.VAL);
        if (regs.TAG === 4) {
            vm.claimSiz(8 * regs.LEN);
            if (//cf. inf.
                regs.KON !== c_return) {
                mem.push(regs.FRM);
                mem.push(regs.ENV);
                stk.save(regs.KON);
                regs.KON = c_return;
            }
            regs.EXP = ag.procedureBdy(regs.VAL);
            regs.PAR = ag.procedurePar(regs.VAL);
            regs.ENV = ag.procedureEnv(regs.VAL);
            regs.FRM = 2147483645;
            return bind;
        }
        if (regs.TAG === 70) {
            return natives.native;
        }
        regs.TXT = 'Expected procedure to apply';
        return error;
    }
    function bind() {
        if (ag.isNull(regs.PAR)) {
            if (ag.isNull(regs.ARG))
                return _eval;
            regs.TXT = 'excess arguments';
            return error;
        }
        if (ag.isPair(regs.PAR)) {
            if (ag.isNull(regs.ARG)) {
                regs.TXT = 'insufficient arguments';
                return error;
            }
            regs.BND = ag.makePair(car(regs.PAR), car(regs.ARG));
            regs.FRM = ag.makePair(regs.BND, regs.FRM);
            regs.ARG = cdr(regs.ARG);
            regs.PAR = cdr(regs.PAR);
            return bind;
        }
        if (ag.isSymbol(regs.PAR)) {
            regs.BND = ag.makePair(regs.PAR, regs.ARG);
            regs.FRM = ag.makePair(regs.BND, regs.FRM);
            return _eval;
        }
        regs.TXT = 'Invalid parameter pattern';
        return error;
    }
    function c_return() {
        regs.ENV = mem.pop();
        regs.FRM = mem.pop();
        regs.KON = stk.restore();
        return regs.KON;
    }
    return {
        eval: _eval,
        apply: apply
    };
}