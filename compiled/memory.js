function MEMORY(size) {
    function ASM_MEMORY(stdlib, foreign$2, heap) {
        'use asm';
        var /* -- IMPORTS & VARIABLES -- */
        //memory
        MEM8 = new stdlib.Uint8Array(heap);
        var MEM32 = new stdlib.Uint32Array(heap);
        var FLT32 = new stdlib.Float32Array(heap);
        var fround = stdlib.Math.fround;
        var STKTOP = foreign$2.heapSize | 0;
        var MEMSIZ = foreign$2.heapSize | 0;
        var MEMTOP = 0;
        function available() {
            return STKTOP - MEMTOP | 0;
        }
        function collectGarbage() {
            STKTOP = STKTOP - 4 | 0;
            MEM32[STKTOP >> 2] = makeBusy(STKTOP) | 0;
            mark(MEMSIZ - 4 | 0);
            update();
            crunch();
            zap();
        }
        function mark(pos) {
            pos = pos | 0;
            var cel = 0;
            var ptr = 0;
            var len = 0;
            for (;;) {
                cel = MEM32[pos >> 2] | 0;
                switch (cel & 3) {
                case //last 2 bits
                    0:
                    //bp
                    ptr = cel;
                    cel = MEM32[ptr >> 2] | 0;
                    switch (cel & 7) {
                    case //last 3 bits
                        0:
                        //rbp
                        MEM32[ptr >> 2] = makeBusy(pos) | 0;
                        MEM32[pos >> 2] = cel;
                        len = headerSize(cel) | 0;
                        pos = len ? ptr + (len << 2) | 0 : pos - 4 | 0;
                        continue;
                    case 2:
                    case //rBp
                        6:
                        //RBp
                        ptr = makeFree(cel) | 0;
                        cel = MEM32[ptr >> 2] | 0;
                    case 4:
                        //Rbp
                        MEM32[ptr >> 2] = makeBusy(pos) | 0;
                        MEM32[pos >> 2] = cel;
                        pos = pos - 4 | 0;
                    }
                    continue;
                case 2:
                    //Bp
                    pos = makeFree(cel) | 0;
                    if ((pos | 0) == (STKTOP | 0))
                        return;
                case 1:
                case //bP
                    3:
                    //BP
                    pos = pos - 4 | 0;
                }
            }
        }
        function update() {
            var src = 0;
            var dst = 0;
            var cel = 0;
            var ptr = 0;
            var len = 0;
            var siz = 0;
            var cur = 0;
            while ((src | 0) < (MEMTOP | 0)) {
                cel = MEM32[src >> 2] | 0;
                if (cel & 2) {
                    do {
                        //marked chunk
                        ptr = cel;
                        cel = MEM32[ptr >> 2] | 0;
                        MEM32[ptr >> 2] = dst;
                    } while (cel & 2);
                    MEM32[src >> 2] = makeBusy(cel) | 0;
                    len = (headerSize(cel) | 0) + 1 << 2;
                    src = src + len | 0;
                    dst = dst + len | 0;
                } else {
                    //unmarked chunk
                    siz = (headerSize(cel) | 0) + 1 << 2;
                    for (cur = src + siz | 0; (cur | 0) < (MEMTOP | 0); cur = cur + len | 0, siz = siz + len | 0) {
                        cel = MEM32[cur >> 2] | 0;
                        if (cel & 2)
                            break;
                        //busy
                        len = (headerSize(cel) | 0) + 1 << 2;
                        if ((siz + len | 0) > 67108860)
                            break;
                    }
                    MEM32[src >> 2] = makeHeader(0, (siz >> 2) - 1 | 0) | 0;
                    src = src + siz | 0;
                }
            }
        }
        function crunch() {
            var src = 0;
            var dst = 0;
            var len = 0;
            var cel = 0;
            while ((src | 0) < (MEMTOP | 0)) {
                cel = MEM32[src >> 2] | 0;
                len = headerSize(cel) | 0;
                if (cel & 2) {
                    //busy
                    MEM32[dst >> 2] = makeFree(cel) | 0;
                    src = src + 4 | 0;
                    dst = dst + 4 | 0;
                    for (; (len | 0) > 0; len = len - 1 | 0) {
                        MEM32[dst >> 2] = MEM32[src >> 2];
                        src = src + 4 | 0;
                        dst = dst + 4 | 0;
                    }
                } else {
                    len = len + 1 << 2;
                    src = src + len | 0;
                }
            }
            MEMTOP = dst;
        }
        function makeHeader(tag$2, siz) {
            tag$2 = tag$2 | 0;
            siz = siz | 0;
            var hdr = 0;
            hdr = siz << 6 | tag$2;
            return hdr << 2 | 0;
        }
        function headerSize(hdr) {
            hdr = hdr | 0;
            return hdr >>> 8 | 0;
        }
        function makeFree(ofs) {
            ofs = ofs | 0;
            return ofs & 4294967293 | 0;
        }
        function makeBusy(ofs) {
            ofs = ofs | 0;
            return ofs | 2 | 0;
        }
        function makeImmediate(val) {
            val = val | 0;
            return val << 1 | 1 | 0;
        }
        function isImmediate(exp) {
            exp = exp | 0;
            return exp & 1 | 0;
        }
        function immediateVal(exp) {
            exp = exp | 0;
            return exp >> 1 | 0;
        }
        function makeChunk(tag$2, siz) {
            tag$2 = tag$2 | 0;
            siz = siz | 0;
            var adr = 0;
            adr = MEMTOP;
            MEMTOP = MEMTOP + (siz + 1 << 2) | 0;
            MEM32[adr >> 2] = makeHeader(tag$2, siz) | 0;
            return adr | 0;
        }
        function chunkTag(ptr) {
            ptr = ptr | 0;
            var hdr = 0;
            hdr = MEM32[ptr >> 2] | 0;
            return hdr >>> 2 & 63 | 0;
        }
        function chunkSize(ptr) {
            ptr = ptr | 0;
            var hdr = 0;
            hdr = MEM32[ptr >> 2] | 0;
            return headerSize(hdr) | 0;
        }
        function chunkGet(ptr, idx) {
            ptr = ptr | 0;
            idx = idx | 0;
            return MEM32[ptr + idx >> 2] | 0;
        }
        function chunkGetByte(ptr, idx) {
            ptr = ptr | 0;
            idx = idx | 0;
            return MEM8[ptr + idx | 0] | 0;
        }
        function chunkGetFloat(ptr, idx) {
            ptr = ptr | 0;
            idx = idx | 0;
            return fround(FLT32[ptr + idx >> 2]);
        }
        function chunkSet(ptr, idx, val) {
            ptr = ptr | 0;
            idx = idx | 0;
            val = val | 0;
            MEM32[ptr + idx >> 2] = val | 0;
        }
        function chunkSetByte(ptr, idx, byt) {
            ptr = ptr | 0;
            idx = idx | 0;
            byt = byt | 0;
            MEM8[ptr + idx | 0] = byt;
        }
        function chunkSetFloat(ptr, idx, flt) {
            ptr = ptr | 0;
            idx = idx | 0;
            flt = fround(flt);
            FLT32[ptr + idx >> 2] = flt;
        }
        function push(el) {
            el = el | 0;
            STKTOP = STKTOP - 4 | 0;
            MEM32[STKTOP >> 2] = el;
        }
        function pop() {
            var tmp = 0;
            tmp = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            return tmp | 0;
        }
        function peek() {
            return MEM32[STKTOP >> 2] | 0;
        }
        function poke(el) {
            el = el | 0;
            MEM32[STKTOP >> 2] = el;
        }
        function zap() {
            STKTOP = STKTOP + 4 | 0;
        }
        function emptyStk() {
            STKTOP = MEMSIZ;
        }
        function tag(exp) {
            exp = exp | 0;
            var val = 0;
            if (isImmediate(exp) | 0) {
                val = immediateVal(exp) | 0;
                if ((val | 0) < 1073741312)
                    //signed smallint
                    return 69;    //signed smallint
                else if ((val | 0) < 1073741568)
                    //character
                    return 64;    //character
                else if ((val | 0) < 1073741820)
                    //native pointer
                    return 70;    //native pointer
                else
                    switch (//special value
                        val & 3) {
                    case 0:
                        return 66;
                    case 1:
                        return 65;
                    case 2:
                        return 68;
                    case 3:
                        return 67;
                    }
            }
            return chunkTag(exp) | 0;
        }
        function makeChar(charCode$2) {
            charCode$2 = charCode$2 | 0;
            return makeImmediate(1073741312 | charCode$2) | 0;
        }
        function charCode(ch) {
            ch = ch | 0;
            return (immediateVal(ch) | 0) & 255;
        }
        function isChar(x) {
            x = x | 0;
            return (tag(x) | 0) == 64 | 0;
        }
        function isTrue(x) {
            x = x | 0;
            return (tag(x) | 0) == 65 | 0;
        }
        function isFalse(x) {
            x = x | 0;
            return (tag(x) | 0) == 66 | 0;
        }
        function isVoid(x) {
            x = x | 0;
            return (tag(x) | 0) == 67 | 0;
        }
        function isNull(x) {
            x = x | 0;
            return (tag(x) | 0) == 68 | 0;
        }
        function makeNumber(nbr) {
            nbr = nbr | 0;
            return makeImmediate(nbr) | 0;
        }
        function numberVal(exp) {
            exp = exp | 0;
            return immediateVal(exp) | 0;
        }
        function isNumber(x) {
            x = x | 0;
            return (tag(x) | 0) == 69 | 0;
        }
        function makeNative(nat) {
            nat = nat | 0;
            return makeImmediate(1073741568 | nat) | 0;
        }
        function nativePtr(nat) {
            nat = nat | 0;
            return (immediateVal(nat) | 0) & 255;
        }
        function isNative(x) {
            x = x | 0;
            return (tag(x) | 0) == 70 | 0;
        }
        function makePair(car, cdr) {
            car = car | 0;
            cdr = cdr | 0;
            var pair = 0;
            pair = makeChunk(0, 2) | 0;
            chunkSet(pair, 4, car);
            chunkSet(pair, 8, cdr);
            return pair | 0;
        }
        function pairCar(ptr) {
            ptr = ptr | 0;
            return chunkGet(ptr, 4) | 0;
        }
        function pairCdr(ptr) {
            ptr = ptr | 0;
            return chunkGet(ptr, 8) | 0;
        }
        function pairSetCar(ptr, exp) {
            ptr = ptr | 0;
            exp = exp | 0;
            chunkSet(ptr, 4, exp);
        }
        function pairSetCdr(ptr, exp) {
            ptr = ptr | 0;
            exp = exp | 0;
            chunkSet(ptr, 8, exp);
        }
        function isPair(x) {
            x = x | 0;
            return (tag(x) | 0) == 0 | 0;
        }
        function makeProcedure(par, bdy, env) {
            par = par | 0;
            bdy = bdy | 0;
            env = env | 0;
            var fun = 0;
            fun = makeChunk(4, 3) | 0;
            chunkSet(fun, 4, par);
            chunkSet(fun, 8, bdy);
            chunkSet(fun, 12, env);
            return fun | 0;
        }
        function procedurePar(exp) {
            exp = exp | 0;
            return chunkGet(exp, 4) | 0;
        }
        function procedureBdy(exp) {
            exp = exp | 0;
            return chunkGet(exp, 8) | 0;
        }
        function procedureEnv(exp) {
            exp = exp | 0;
            return chunkGet(exp, 12) | 0;
        }
        function isProcedure(x) {
            x = x | 0;
            return (tag(x) | 0) == 4 | 0;
        }
        function makeVector(siz) {
            siz = siz | 0;
            return makeChunk(2, siz) | 0;
        }
        function fillVector(siz, exp) {
            siz = siz | 0;
            exp = exp | 0;
            var vct = 0;
            var idx = 0;
            vct = makeChunk(2, siz) | 0;
            for (idx = 1; (idx | 0) <= (siz | 0); idx = idx + 1 | 0)
                chunkSet(vct, idx << 2, exp);
            return vct | 0;
        }
        function vectorRef(vct, idx) {
            vct = vct | 0;
            idx = idx | 0;
            return chunkGet(vct, idx << 2) | 0;
        }
        function vectorSet(vct, idx, val) {
            vct = vct | 0;
            idx = idx | 0;
            val = val | 0;
            chunkSet(vct, idx << 2, val);
        }
        function vectorLength(vct) {
            vct = vct | 0;
            return chunkSize(vct) | 0;
        }
        function isVector(x) {
            x = x | 0;
            return (tag(x) | 0) == 2 | 0;
        }
        function makeSequence(siz) {
            siz = siz | 0;
            return makeChunk(6, siz) | 0;
        }
        function sequenceAt(seq, idx) {
            seq = seq | 0;
            idx = idx | 0;
            return chunkGet(seq, idx << 2) | 0;
        }
        function sequenceSet(seq, idx, val) {
            seq = seq | 0;
            idx = idx | 0;
            val = val | 0;
            chunkSet(seq, idx << 2, val);
        }
        function sequenceLength(seq) {
            seq = seq | 0;
            return chunkSize(seq) | 0;
        }
        function isSequence(x) {
            x = x | 0;
            return (tag(x) | 0) == 6 | 0;
        }
        function makeIfs(pred, conseq) {
            pred = pred | 0;
            conseq = conseq | 0;
            var ifs = 0;
            ifs = makeChunk(8, 2) | 0;
            chunkSet(ifs, 4, pred);
            chunkSet(ifs, 8, conseq);
            return ifs | 0;
        }
        function ifsPredicate(ifs) {
            ifs = ifs | 0;
            return chunkGet(ifs, 4) | 0;
        }
        function ifsConsequence(ifs) {
            ifs = ifs | 0;
            return chunkGet(ifs, 8) | 0;
        }
        function isIfs(x) {
            x = x | 0;
            return (tag(x) | 0) == 8 | 0;
        }
        function makeIff(pred, conseq, alter) {
            pred = pred | 0;
            conseq = conseq | 0;
            alter = alter | 0;
            var iff = 0;
            iff = makeChunk(10, 3) | 0;
            chunkSet(iff, 4, pred);
            chunkSet(iff, 8, conseq);
            chunkSet(iff, 12, alter);
            return iff | 0;
        }
        function iffPredicate(iff) {
            iff = iff | 0;
            return chunkGet(iff, 4) | 0;
        }
        function iffConsequence(iff) {
            iff = iff | 0;
            return chunkGet(iff, 8) | 0;
        }
        function iffAlternative(iff) {
            iff = iff | 0;
            return chunkGet(iff, 12) | 0;
        }
        function isIff(x) {
            x = x | 0;
            return (tag(x) | 0) == 10 | 0;
        }
        function makeQuo(exp) {
            exp = exp | 0;
            var quo = 0;
            quo = makeChunk(22, 1) | 0;
            chunkSet(quo, 4, exp);
            return quo | 0;
        }
        function quoExpression(quo) {
            quo = quo | 0;
            return chunkGet(quo, 4) | 0;
        }
        function isQuo(x) {
            x = x | 0;
            return (tag(x) | 0) == 22 | 0;
        }
        function makeLambda(arg, bdy) {
            arg = arg | 0;
            bdy = bdy | 0;
            var lmb = 0;
            lmb = makeChunk(18, 2) | 0;
            chunkSet(lmb, 4, arg);
            chunkSet(lmb, 8, bdy);
            return lmb | 0;
        }
        function lambdaArg(lmb) {
            lmb = lmb | 0;
            return chunkGet(lmb, 4) | 0;
        }
        function lambdaBdy(lmb) {
            lmb = lmb | 0;
            return chunkGet(lmb, 8) | 0;
        }
        function isLambda(x) {
            x = x | 0;
            return (tag(x) | 0) == 18 | 0;
        }
        function makeDfv(vrb, val) {
            vrb = vrb | 0;
            val = val | 0;
            var dfv = 0;
            dfv = makeChunk(12, 2) | 0;
            chunkSet(dfv, 4, vrb);
            chunkSet(dfv, 8, val);
            return dfv | 0;
        }
        function dfvVariable(dfv) {
            dfv = dfv | 0;
            return chunkGet(dfv, 4) | 0;
        }
        function dfvValue(dfv) {
            dfv = dfv | 0;
            return chunkGet(dfv, 8) | 0;
        }
        function isDfv(x) {
            x = x | 0;
            return (tag(x) | 0) == 12 | 0;
        }
        function makeDff(vrb, arg, bdy) {
            vrb = vrb | 0;
            arg = arg | 0;
            bdy = bdy | 0;
            var dff = 0;
            dff = makeChunk(14, 3) | 0;
            chunkSet(dff, 4, vrb);
            chunkSet(dff, 8, arg);
            chunkSet(dff, 12, bdy);
            return dff | 0;
        }
        function dffVariable(dff) {
            dff = dff | 0;
            return chunkGet(dff, 4) | 0;
        }
        function dffArguments(dff) {
            dff = dff | 0;
            return chunkGet(dff, 8) | 0;
        }
        function dffBody(dff) {
            dff = dff | 0;
            return chunkGet(dff, 12) | 0;
        }
        function isDff(x) {
            x = x | 0;
            return (tag(x) | 0) == 14 | 0;
        }
        function makeSet(vrb, val) {
            vrb = vrb | 0;
            val = val | 0;
            var set = 0;
            set = makeChunk(20, 2) | 0;
            chunkSet(set, 4, vrb);
            chunkSet(set, 8, val);
            return set | 0;
        }
        function setVariable(set) {
            set = set | 0;
            return chunkGet(set, 4) | 0;
        }
        function setValue(set) {
            set = set | 0;
            return chunkGet(set, 8) | 0;
        }
        function isSet(x) {
            x = x | 0;
            return (tag(x) | 0) == 20 | 0;
        }
        function makeApplication(opr, opd) {
            opr = opr | 0;
            opd = opd | 0;
            var apl = 0;
            apl = makeChunk(16, 2) | 0;
            chunkSet(apl, 4, opr);
            chunkSet(apl, 8, opd);
            return apl | 0;
        }
        function aplOperator(apl) {
            apl = apl | 0;
            return chunkGet(apl, 4) | 0;
        }
        function aplOperands(apl) {
            apl = apl | 0;
            return chunkGet(apl, 8) | 0;
        }
        function isApplication(x) {
            x = x | 0;
            return (tag(x) | 0) == 16 | 0;
        }
        function makeFloat(nbr) {
            nbr = fround(nbr);
            var flt = 0;
            flt = makeChunk(1, 1) | 0;
            chunkSetFloat(flt, 4, nbr);
            return flt | 0;
        }
        function floatNumber(flt) {
            flt = flt | 0;
            return fround(chunkGetFloat(flt, 4));
        }
        function isFloat(x) {
            x = x | 0;
            return (tag(x) | 0) == 1 | 0;
        }
        function makeText(tag$2, len) {
            tag$2 = tag$2 | 0;
            len = len | 0;
            var chk = 0;
            var siz = 0;
            for (siz = len; siz & 3; siz = siz + 1 | 0);
            chk = makeChunk(tag$2, siz >> 2) | 0;
            for (len = len + 4 | 0, siz = siz + 4 | 0; (len | 0) < (siz | 0); len = len + 1 | 0)
                chunkSetByte(chk, len, 0);
            return chk | 0;
        }
        function textSetChar$2(txt, idx, chr) {
            txt = txt | 0;
            idx = idx | 0;
            chr = chr | 0;
            chunkSetByte(txt, idx + 4 | 0, chr);
        }
        function textGetChar$2(txt, idx) {
            txt = txt | 0;
            idx = idx | 0;
            return chunkGetByte(txt, idx + 4 | 0) | 0;
        }
        function textLength$2(txt) {
            txt = txt | 0;
            var len = 0;
            len = (chunkSize(txt) | 0) << 2;
            if (len)
                for (; !(chunkGetByte(txt, len + 3 | 0) | 0); len = len - 1 | 0);
            return len | 0;
        }
        function makeString$2(len) {
            len = len | 0;
            return makeText(5, len) | 0;
        }
        function isString(x) {
            x = x | 0;
            return (tag(x) | 0) == 5 | 0;
        }
        function makeSymbol$2(len) {
            len = len | 0;
            return makeText(3, len) | 0;
        }
        function isSymbol(x) {
            x = x | 0;
            return (tag(x) | 0) == 3 | 0;
        }
        return {
            /* -- EXPORTS -- */
            /**************/
            /*** MEMORY ***/
            /**************/
            available: available,
            collectGarbage: collectGarbage,
            emptyStk: emptyStk,
            push: push,
            peek: peek,
            poke: poke,
            pop: pop,
            zap: zap,
            /************************/
            /*** ABSTRACT GRAMMAR ***/
            /************************/
            //tag
            tag: tag,
            //specials
            isTrue: isTrue,
            isFalse: isFalse,
            isNull: isNull,
            isVoid: isVoid,
            //numbers
            makeNumber: makeNumber,
            numberVal: numberVal,
            isNumber: isNumber,
            //characters
            makeChar: makeChar,
            charCode: charCode,
            isChar: isChar,
            //pairs
            makePair: makePair,
            pairCar: pairCar,
            pairCdr: pairCdr,
            pairSetCar: pairSetCar,
            pairSetCdr: pairSetCdr,
            isPair: isPair,
            //procedures
            makeProcedure: makeProcedure,
            procedurePar: procedurePar,
            procedureBdy: procedureBdy,
            procedureEnv: procedureEnv,
            isProcedure: isProcedure,
            //vectors
            makeVector: makeVector,
            fillVector: fillVector,
            vectorRef: vectorRef,
            vectorSet: vectorSet,
            vectorLength: vectorLength,
            isVector: isVector,
            //floats
            makeFloat: makeFloat,
            floatNumber: floatNumber,
            isFloat: isFloat,
            //texts
            makeString: makeString$2,
            makeSymbol: makeSymbol$2,
            textGetChar: textGetChar$2,
            textSetChar: textSetChar$2,
            textLength: textLength$2,
            isString: isString,
            isSymbol: isSymbol,
            //natives
            makeNative: makeNative,
            nativePtr: nativePtr,
            isNative: isNative,
            //sequences
            makeSequence: makeSequence,
            sequenceAt: sequenceAt,
            sequenceSet: sequenceSet,
            sequenceLength: sequenceLength,
            isSequence: isSequence,
            //single if-statements
            makeIfs: makeIfs,
            ifsPredicate: ifsPredicate,
            ifsConsequence: ifsConsequence,
            isIfs: isIfs,
            //full if-statements
            makeIff: makeIff,
            iffPredicate: iffPredicate,
            iffConsequence: iffConsequence,
            iffAlternative: iffAlternative,
            isIff: isIff,
            //quotes
            makeQuo: makeQuo,
            quoExpression: quoExpression,
            isQuo: isQuo,
            //lambdas
            makeLambda: makeLambda,
            lambdaArg: lambdaArg,
            lambdaBdy: lambdaBdy,
            isLambda: isLambda,
            //variable definitions
            makeDfv: makeDfv,
            dfvVariable: dfvVariable,
            dfvValue: dfvValue,
            isDfv: isDfv,
            //function definitions
            makeDff: makeDff,
            dffVariable: dffVariable,
            dffBody: dffBody,
            dffArguments: dffArguments,
            isDff: isDff,
            //assignments
            makeSet: makeSet,
            setVariable: setVariable,
            setValue: setValue,
            isSet: isSet,
            //applications
            makeApplication: makeApplication,
            aplOperator: aplOperator,
            aplOperands: aplOperands,
            isApplication: isApplication
        };
    }
    var memSiz = 1 << 24;
    var buffer = new ArrayBuffer(memSiz);
    var foreign = { heapSize: memSiz };
    var grammar = ASM_MEMORY(window, foreign, buffer);
    var /* --- CONVENIENT STRING OPERATIONS --- */
    makeString = grammar.makeString;
    var makeSymbol = grammar.makeSymbol;
    var textGetChar = grammar.textGetChar;
    var textSetChar = grammar.textSetChar;
    var textLength = grammar.textLength;
    function buildString(txt) {
        var len = txt.length;
        var str = makeString(len);
        for (var i = 0; i < len; ++i)
            textSetChar(str, i, txt.charCodeAt(i));
        return str;
    }
    function buildSymbol(txt) {
        var len = txt.length;
        var sym = makeSymbol(len);
        for (var i = 0; i < len; ++i)
            textSetChar(sym, i, txt.charCodeAt(i));
        return sym;
    }
    function decodeText(chk) {
        var len = textLength(chk);
        var arr = new Array(len);
        for (var i = 0; i < len; ++i)
            arr[i] = textGetChar(chk, i);
        return String.fromCharCode.apply(null, arr);
    }
    grammar.buildString = buildString;
    grammar.stringAt = textGetChar;
    grammar.stringSet = textSetChar;
    grammar.stringLength = textLength;
    grammar.stringText = decodeText;
    grammar.buildSymbol = buildSymbol;
    grammar.symbolText = decodeText;
    /* --- TEMPORARY FIX FOR BACKWARDS COMPATIBILITY --- */
    grammar.__EMPTY_VEC__ = grammar.makeVector(0);
    /* ---- EXPORTS ---- */
    return grammar;
}