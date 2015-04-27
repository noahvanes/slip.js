function COMPILER() {
    'use strict';
    /* --- varANT SYMBOLS --- */
    var __QUO_SYM__;
    var __BEG_SYM__;
    var __LET_SYM__;
    var __DEF_SYM__;
    var __LAM_SYM__;
    var __SET_SYM__;
    var __IFF_SYM__;
    var __VEC_SYM__;
    function loadSymbols() {
        __QUO_SYM__ = pool.enterPool('quote');
        __BEG_SYM__ = pool.enterPool('begin');
        __LET_SYM__ = pool.enterPool('let');
        __DEF_SYM__ = pool.enterPool('define');
        __LAM_SYM__ = pool.enterPool('lambda');
        __SET_SYM__ = pool.enterPool('set!');
        __IFF_SYM__ = pool.enterPool('if');
        __VEC_SYM__ = pool.enterPool('vector');
    }
    var car = ag.pairCar;
    var cdr = ag.pairCdr;
    function compile() {
        if (ag.isPair(regs.EXP)) {
            regs.LST = cdr(regs.EXP);
            regs.EXP = car(regs.EXP);
            switch (regs.EXP) {
            case __QUO_SYM__:
                return compileQuote;
            case __BEG_SYM__:
                return compileSequence;
            case __DEF_SYM__:
                return compileDefine;
            case __LAM_SYM__:
                return compileLambda;
            case __SET_SYM__:
                return compileSet;
            case __IFF_SYM__:
                return compileIf;
            default:
                return compileApplication;
            }
        }
        if (ag.isVector(regs.EXP))
            return compileVector;
        regs.VAL = regs.EXP;
        return regs.KON;
    }
    function compileSequence() {
        if (//empty sequence
            ag.isNull(regs.LST)) {
            regs.VAL = 2147483647;
            return regs.KON;
        }
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid sequence';
            return error;
        }
        regs.EXP = car(regs.LST);
        regs.LST = cdr(regs.LST);
        if (!ag.isNull(regs.LST)) {
            claim();
            stk.save(regs.KON);
            mem.push(regs.LST);
            stk.save(1);
            regs.KON = c1_sequence;
        }
        return compile;
    }
    function c1_sequence() {
        regs.LST = mem.peek();
        regs.LEN = stk.peek();
        mem.poke(regs.VAL);
        stk.poke(++regs.LEN);
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid sequence';
            return error;
        }
        regs.EXP = car(regs.LST);
        regs.LST = cdr(regs.LST);
        if (ag.isNull(regs.LST)) {
            regs.KON = c2_sequence;
        } else {
            claim();
            mem.push(regs.LST);
        }
        return compile;
    }
    function c2_sequence() {
        regs.LEN = stk.restore();
        claimSiz(regs.LEN);
        regs.EXP = ag.makeSequence(regs.LEN);
        ag.sequenceSet(regs.EXP, regs.LEN, regs.VAL);
        do
            // fill sequence with compiled expressions
            ag.sequenceSet(regs.EXP, --regs.LEN, mem.pop());
        while (regs.LEN > 1);
        regs.VAL = regs.EXP;
        regs.KON = stk.restore();
        return regs.KON;
    }
    function compileQuote() {
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid quote expression';
            return error;
        }
        regs.EXP = car(regs.LST);
        if (ag.isNull(cdr(regs.LST))) {
            claim();
            regs.VAL = ag.makeQuo(regs.EXP);
            return regs.KON;
        } else {
            regs.TXT = 'quote only takes one argument';
            return error;
        }
    }
    function compileIf() {
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid if expression';
            return error;
        }
        regs.EXP = car(regs.LST);
        regs.LST = cdr(regs.LST);
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid if consequence';
            return error;
        }
        claim();
        stk.save(regs.KON);
        mem.push(regs.LST);
        regs.KON = c1_if;
        return compile;
    }
    function c1_if() {
        regs.LST = mem.peek();
        regs.EXP = car(regs.LST);
        regs.LST = cdr(regs.LST);
        mem.poke(regs.VAL);
        if (ag.isNull(regs.LST)) {
            regs.KON = c2_if;
            return compile;
        }
        if (ag.isPair(regs.LST)) {
            claim();
            mem.push(regs.LST);
            regs.KON = c3_if;
            return compile;
        }
        regs.TXT = 'invalid if alternative';
        return error;
    }
    function c2_if() {
        claim();
        regs.EXP = mem.pop();
        regs.VAL = ag.makeIfs(regs.EXP, regs.VAL);
        regs.KON = stk.restore();
        return regs.KON;
    }
    function c3_if() {
        regs.LST = mem.peek();
        regs.EXP = car(regs.LST);
        regs.LST = cdr(regs.LST);
        mem.poke(regs.VAL);
        if (!ag.isNull(regs.LST)) {
            regs.TXT = 'if statement too long';
            return error;
        }
        regs.KON = c4_if;
        return compile;
    }
    function c4_if() {
        claim();
        regs.EXP = mem.pop();
        regs.VAL = ag.makeIff(mem.pop(), regs.EXP, regs.VAL);
        regs.KON = stk.restore();
        return regs.KON;
    }
    function compileDefine() {
        claim();
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid definition';
            return error;
        }
        regs.PAT = car(regs.LST);
        regs.LST = cdr(regs.LST);
        regs.TAG = ag.tag(regs.PAT);
        switch (regs.TAG) {
        case 3    /* VARIABLE DEFINITION */:
            if (!/* VARIABLE DEFINITION */
                ag.isPair(regs.LST)) {
                regs.TXT = 'invalid variable definition';
                return error;
            }
            regs.EXP = car(regs.LST);
            regs.LST = cdr(regs.LST);
            if (!ag.isNull(regs.LST)) {
                regs.TXT = 'variable definition takes only one argument';
                return error;
            }
            mem.push(regs.PAT);
            stk.save(regs.KON);
            regs.KON = c1_define;
            return compile;
        case 0    /* PROCEDURE DEFINITION */:
            /* PROCEDURE DEFINITION */
            regs.PAR = cdr(regs.PAT);
            regs.PAT = car(regs.PAT);
            if (!ag.isSymbol(regs.PAT)) {
                regs.TXT = 'procedure definition has invalid name';
                return error;
            }
            mem.push(regs.PAT);
            mem.push(regs.PAR);
            stk.save(regs.KON);
            regs.KON = c2_define;
            return compileSequence;
        default:
            /* INVALID DEFINE */
            regs.TXT = 'invalid defintion syntax';
            return error;
        }
    }
    function c1_define() {
        claim();
        regs.PAT = mem.pop();
        regs.KON = stk.restore();
        regs.VAL = ag.makeDfv(regs.PAT, regs.VAL);
        return regs.KON;
    }
    function c2_define() {
        claim();
        regs.PAR = mem.pop();
        regs.PAT = mem.pop();
        regs.KON = stk.restore();
        regs.VAL = ag.makeDff(regs.PAT, regs.PAR, regs.VAL);
        return regs.KON;
    }
    function compileSet() {
        claim();
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid assignment variable';
            return error;
        }
        regs.PAT = car(regs.LST);
        regs.LST = cdr(regs.LST);
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid assignment value';
            return error;
        }
        regs.EXP = car(regs.LST);
        regs.LST = cdr(regs.LST);
        if (!ag.isNull(regs.LST)) {
            regs.TXT = 'invalid assignment syntax';
            return error;
        }
        mem.push(regs.PAT);
        stk.save(regs.KON);
        regs.KON = c_set;
        return compile;
    }
    function c_set() {
        claim();
        regs.PAT = mem.pop();
        regs.VAL = ag.makeSet(regs.PAT, regs.VAL);
        regs.KON = stk.restore();
        return regs.KON;
    }
    function compileLambda() {
        if (!ag.isPair(regs.LST)) {
            regs.TXT = 'invalid lambda expression';
            return error;
        }
        claim();
        regs.PAR = car(regs.LST);
        regs.LST = cdr(regs.LST);
        mem.push(regs.PAR);
        stk.save(regs.KON);
        regs.KON = c_lambda;
        return compileSequence;
    }
    function c_lambda() {
        claim();
        regs.PAR = mem.pop();
        regs.VAL = ag.makeLambda(regs.PAR, regs.VAL);
        regs.KON = stk.restore();
        return regs.KON;
    }
    function compileApplication() {
        claim();
        stk.save(regs.KON);
        if (ag.isNull(regs.LST)) {
            regs.KON = c1_application;
        } else {
            stk.save(0);
            mem.push(regs.LST);
            regs.KON = c2_application;
        }
        return compile;
    }
    function c1_application() {
        claim();
        regs.VAL = ag.makeApplication(regs.VAL, ag.__EMPTY_VEC__);
        regs.KON = stk.restore();
        return regs.KON;
    }
    function c2_application() {
        regs.ARG = mem.peek();
        regs.LEN = stk.peek();
        mem.poke(regs.VAL);
        stk.poke(++regs.LEN);
        if (!ag.isPair(regs.ARG)) {
            regs.TXT = 'invalid application argument';
            return error;
        }
        regs.EXP = car(regs.ARG);
        regs.ARG = cdr(regs.ARG);
        if (ag.isNull(regs.ARG))
            regs.KON = c3_application;
        else {
            claim();
            mem.push(regs.ARG);
        }
        return compile;
    }
    function c3_application() {
        regs.LEN = stk.restore();
        claimSiz(regs.LEN);
        regs.EXP = ag.makeVector(regs.LEN);
        ag.vectorSet(regs.EXP, regs.LEN, regs.VAL);
        while (--regs.LEN)
            ag.vectorSet(regs.EXP, regs.LEN, mem.pop());
        regs.VAL = ag.makeApplication(mem.pop(), regs.EXP);
        regs.KON = stk.restore();
        return regs.KON;
    }
    function compileVector() {
        regs.LEN = ag.vectorLength(regs.EXP);
        vm.claimSiz(regs.LEN);
        if (regs.LEN === 0) {
            regs.VAL = ag.__EMPTY_VEC__;
            return regs.KON;
        }
        stk.save(regs.KON);
        mem.push(ag.makeVector(regs.LEN));
        if (regs.LEN === 1) {
            regs.KON = c2_vector;
        } else {
            regs.KON = c1_vector;
            mem.push(regs.EXP);
            stk.save(1);
        }
        regs.EXP = ag.vectorRef(regs.EXP, 1);
        return compile;
    }
    function c1_vector() {
        regs.IDX = stk.peek();
        regs.EXP = mem.pop();
        regs.PAR = mem.peek();
        ag.vectorSet(regs.PAR, regs.IDX++, regs.VAL);
        regs.LEN = ag.vectorLength(regs.PAR);
        if (regs.LEN === regs.IDX) {
            regs.KON = c2_vector;
            stk.zap();
        } else {
            mem.push(regs.EXP);
            stk.poke(regs.IDX);
        }
        regs.EXP = ag.vectorRef(regs.EXP, regs.IDX);
        return compile;
    }
    function c2_vector() {
        claim();
        regs.EXP = mem.pop();
        regs.LEN = ag.vectorLength(regs.EXP);
        ag.vectorSet(regs.EXP, regs.LEN, regs.VAL);
        regs.VAL = ag.makeApplication(__VEC_SYM__, regs.EXP);
        regs.KON = stk.restore();
        return regs.KON;
    }
    return {
        compile: compile,
        loadSymbols: loadSymbols
    };
}