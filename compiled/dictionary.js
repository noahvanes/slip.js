function DICTIONARY() {
    'use strict';
    var asm, err;
    var savedOffset = 0;
    var environment = [];
    var frame = [];
    function dctError(err$2) {
        err$2();
        throw err$2;
    }
    function link(asmModule, errModule) {
        asm = asmModule;
        err = errModule;
    }
    function defineVar(vrb) {
        if (environment.length == 0 && frame.length == 256)
            dctError(err.globalOverflow);
        if (environment.length == 0)
            asm.protect(vrb);
        //we don't want globals gone
        frame.push(vrb);
        return frame.length;
    }
    function frameSize() {
        return frame.length;
    }
    function enterScope() {
        environment.push(frame);
        frame = [];
    }
    function exitScope() {
        var frameSize$2 = frame.length;
        frame = environment.pop();
        return frameSize$2;
    }
    function offset(sym, frame$2) {
        var len = frame$2.length;
        while (len-- > 0)
            if (asm.feq(frame$2[len], sym))
                return len + 1;
        return false;
    }
    function lexicalAdr(sym) {
        var localOffset = offset(sym, frame);
        if (localOffset) {
            return {
                //local variable found!
                scope: 0,
                offset: localOffset
            };
        }
        for (var scopeLvl = environment.length; scopeLvl > 0; --scopeLvl) {
            var frm = environment[scopeLvl - 1];
            var ofs = offset(sym, frm);
            if (ofs)
                return {
                    scope: scopeLvl,
                    offset: ofs
                };
        }
        return false;
    }
    function checkpoint() {
        savedOffset = frame.length;
    }
    function rollback() {
        frame.length = savedOffset;
        environment = [];
    }
    return {
        link: link,
        defineVar: defineVar,
        lexicalAdr: lexicalAdr,
        enterScope: enterScope,
        exitScope: exitScope,
        frameSize: frameSize,
        checkpoint: checkpoint,
        rollback: rollback
    };
}