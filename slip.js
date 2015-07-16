function SLIP(callbacks, size) {
    'use strict';
    function SLIP_ASM(stdlib, foreign$2, heap) {
        'use asm';
        var /* -- IMPORTS & VARIABLES -- */
        //memory
        MEM8 = new stdlib.Uint8Array(heap);
        var MEM32 = new stdlib.Uint32Array(heap);
        var FLT32 = new stdlib.Float32Array(heap);
        var STKTOP = foreign$2.heapSize | 0;
        var MEMSIZ = foreign$2.heapSize | 0;
        var MEMTOP = 0;
        var //math
        fround = stdlib.Math.fround;
        var imul = stdlib.Math.imul;
        //TODO: clean TMP etc...
        //registers
        var ARG = 0;
        //arguments
        var DCT = 0;
        //lexical scope
        var DFR = 0;
        //dictionary frame
        var DEN = 0;
        //dictionary environment
        var DGL = 0;
        //dictionary globals
        var ENV = 0;
        //environemnt
        var EXP = 0;
        //expression
        var FRM = 0;
        var //frame 
        FLT = fround(0);
        //float
        var GLB = 0;
        //globals
        var IDX = 0;
        //index
        var KON = 0;
        //continuation
        var LEN = 0;
        //length
        var LST = 0;
        //list 
        var OFS = 0;
        //lexical offset
        var PAR = 0;
        //parameters
        var PAT = 0;
        //pattern
        var SCP = 0;
        //lexical scope level
        var SIZ = 0;
        //size
        var SYM = 0;
        //symbol pool
        var TMP = 0;
        //temporary
        var VAL = 0;
        var //value
        //reader
        look = foreign$2.look;
        var skip = foreign$2.skip;
        var read = foreign$2.read;
        var readSymbol = foreign$2.readSymbol;
        var readString = foreign$2.readString;
        var readNumber = foreign$2.readNumber;
        //dictionary
        var currentScpLvl = 0;
        var currentFrmSiz = 0;
        var globalFrmSiz = 0;
        var //errors
        err_expectedRBR = foreign$2.expectedRBR;
        var err_invalidSyntax = foreign$2.invalidSyntax;
        var err_invalidIf = foreign$2.invalidIf;
        var err_invalidSequence = foreign$2.invalidSequence;
        var err_invalidQuote = foreign$2.invalidQuote;
        var err_invalidDefine = foreign$2.invalidDefine;
        var err_invalidAssignment = foreign$2.invalidAssignment;
        var err_invalidLambda = foreign$2.invalidLambda;
        var err_invalidApplication = foreign$2.invalidApplication;
        var err_undefinedVariable = foreign$2.undefinedVariable;
        var err_invalidParamCount = foreign$2.invalidParamCount;
        var err_invalidParameter = foreign$2.invalidParameter;
        var err_invalidOperator = foreign$2.invalidOperator;
        var err_invalidExpression = foreign$2.invalidExpression;
        var err_invalidArgument = foreign$2.invalidArgument;
        var err_invalidLength = foreign$2.invalidLength;
        var err_invalidRange = foreign$2.invalidRange;
        var err_fatalMemory = foreign$2.fatalMemory;
        var err_globalOverflow = foreign$2.globalOverflow;
        //pool
        var __POOL_TOP__ = 0;
        var __POOL_SIZ__ = 0;
        var //timer
        clock = foreign$2.clock;
        var reset = foreign$2.reset;
        //symbols
        var __QUO_SYM__ = 0;
        var __VEC_SYM__ = 0;
        var __DEF_SYM__ = 0;
        var __LMB_SYM__ = 0;
        var __IFF_SYM__ = 0;
        var __BEG_SYM__ = 0;
        var __SET_SYM__ = 0;
        var loadQuo = foreign$2.loadQuo;
        var loadVec = foreign$2.loadVec;
        var loadDef = foreign$2.loadDef;
        var loadLmb = foreign$2.loadLmb;
        var loadIff = foreign$2.loadIff;
        var loadBeg = foreign$2.loadBeg;
        var loadSet = foreign$2.loadSet;
        var loadPls = foreign$2.loadPls;
        var loadMns = foreign$2.loadMns;
        var loadMul = foreign$2.loadMul;
        var loadDiv = foreign$2.loadDiv;
        var loadCns = foreign$2.loadCns;
        var loadCar = foreign$2.loadCar;
        var loadCdr = foreign$2.loadCdr;
        var loadSca = foreign$2.loadSca;
        var loadScd = foreign$2.loadScd;
        var loadLst = foreign$2.loadLst;
        var loadNeq = foreign$2.loadNeq;
        var loadSma = foreign$2.loadSma;
        var loadLrg = foreign$2.loadLrg;
        var loadLeq = foreign$2.loadLeq;
        var loadSeq = foreign$2.loadSeq;
        var loadAss = foreign$2.loadAss;
        var loadMap = foreign$2.loadMap;
        var loadVcm = foreign$2.loadVcm;
        var loadVcr = foreign$2.loadVcr;
        var loadVcs = foreign$2.loadVcs;
        var loadVcl = foreign$2.loadVcl;
        var loadEqu = foreign$2.loadEqu;
        var loadEql = foreign$2.loadEql;
        var loadEva = foreign$2.loadEva;
        var loadApl = foreign$2.loadApl;
        var loadRea = foreign$2.loadRea;
        var loadLoa = foreign$2.loadLoa;
        var loadIpa = foreign$2.loadIpa;
        var loadInu = foreign$2.loadInu;
        var loadIsy = foreign$2.loadIsy;
        var loadIve = foreign$2.loadIve;
        var loadIst = foreign$2.loadIst;
        var loadDis = foreign$2.loadDis;
        var loadNew = foreign$2.loadNew;
        var loadSre = foreign$2.loadSre;
        var loadSse = foreign$2.loadSse;
        var loadSle = foreign$2.loadSle;
        var loadAvl = foreign$2.loadAvl;
        var loadCol = foreign$2.loadCol;
        var loadClk = foreign$2.loadClk;
        var loadSlp = foreign$2.loadSlp;
        var loadRnd = foreign$2.loadRnd;
        var loadErr = foreign$2.loadErr;
        var loadRst = foreign$2.loadRst;
        var loadCcc = foreign$2.loadCcc;
        var //IO
        promptUserInput = foreign$2.promptUserInput;
        var printNewline = foreign$2.printNewline;
        var promptInput = foreign$2.promptInput;
        var printOutput = foreign$2.printOutput;
        var printLog = foreign$2.printLog;
        var loadFile = foreign$2.loadFile;
        var initREPL = foreign$2.initREPL;
        var //custom
        random = foreign$2.random;
        //other
        var __EMPTY_VEC__ = 0;
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
        function stkSize() {
            return (MEMSIZ - STKTOP | 0) >> 2;
        }
        function stackAt(idx) {
            idx = idx | 0;
            return MEM32[STKTOP + idx >> 2] | 0;
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
        function reverse(lst) {
            lst = lst | 0;
            var prv = 0;
            var nxt = 0;
            prv = 2147483645;
            while (isPair(lst) | 0) {
                nxt = pairCdr(lst) | 0;
                pairSetCdr(lst, prv);
                prv = lst;
                lst = nxt;
            }
            return prv | 0;
        }
        function isPair(x) {
            x = x | 0;
            return (tag(x) | 0) == 0 | 0;
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
        function currentStack() {
            var len = 0;
            var idx = 0;
            var vct = 0;
            var cur = 0;
            len = stkSize() | 0;
            vct = makeVector(len) | 0;
            while ((idx | 0) < (len | 0)) {
                cur = stackAt(idx << 2) | 0;
                idx = idx + 1 | 0;
                vectorSet(vct, idx, cur);
            }
            return vct | 0;
        }
        function restoreStack(vct) {
            vct = vct | 0;
            var len = 0;
            emptyStk();
            for (len = vectorLength(vct) | 0; len; len = len - 1 | 0)
                push(vectorRef(vct, len) | 0);
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
        function makeDfv(ofs, val) {
            ofs = ofs | 0;
            val = val | 0;
            var dfv = 0;
            dfv = makeChunk(12, 2) | 0;
            chunkSet(dfv, 4, ofs);
            chunkSet(dfv, 8, val);
            return dfv | 0;
        }
        function dfvOfs(dfv) {
            dfv = dfv | 0;
            return chunkGet(dfv, 4) | 0;
        }
        function dfvVal(dfv) {
            dfv = dfv | 0;
            return chunkGet(dfv, 8) | 0;
        }
        function isDfv(x) {
            x = x | 0;
            return (tag(x) | 0) == 12 | 0;
        }
        function makeDff(ofs, arc, frc, bdy) {
            ofs = ofs | 0;
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var dff = 0;
            dff = makeChunk(14, 4) | 0;
            chunkSet(dff, 4, ofs);
            chunkSet(dff, 8, arc);
            chunkSet(dff, 12, frc);
            chunkSet(dff, 16, bdy);
            return dff | 0;
        }
        function dffOfs(dff) {
            dff = dff | 0;
            return chunkGet(dff, 4) | 0;
        }
        function dffArgc(dff) {
            dff = dff | 0;
            return chunkGet(dff, 8) | 0;
        }
        function dffFrmSiz(dff) {
            dff = dff | 0;
            return chunkGet(dff, 12) | 0;
        }
        function dffBdy(dff) {
            dff = dff | 0;
            return chunkGet(dff, 16) | 0;
        }
        function isDff(x) {
            x = x | 0;
            return (tag(x) | 0) == 14 | 0;
        }
        function makeDfz(ofs, arc, frc, bdy) {
            ofs = ofs | 0;
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var dfz = 0;
            dfz = makeChunk(30, 4) | 0;
            chunkSet(dfz, 4, ofs);
            chunkSet(dfz, 8, arc);
            chunkSet(dfz, 12, frc);
            chunkSet(dfz, 16, bdy);
            return dfz | 0;
        }
        function dfzOfs(dfz) {
            dfz = dfz | 0;
            return chunkGet(dfz, 4) | 0;
        }
        function dfzArgc(dfz) {
            dfz = dfz | 0;
            return chunkGet(dfz, 8) | 0;
        }
        function dfzFrmSiz(dfz) {
            dfz = dfz | 0;
            return chunkGet(dfz, 12) | 0;
        }
        function dfzBdy(dfz) {
            dfz = dfz | 0;
            return chunkGet(dfz, 16) | 0;
        }
        function isDfz(x) {
            x = x | 0;
            return (tag(x) | 0) == 30 | 0;
        }
        function makeSlc(ofs, val) {
            ofs = ofs | 0;
            val = val | 0;
            var slc = 0;
            slc = makeChunk(40, 2) | 0;
            chunkSet(slc, 4, ofs);
            chunkSet(slc, 8, val);
            return slc | 0;
        }
        function slcOfs(slc) {
            slc = slc | 0;
            return chunkGet(slc, 4) | 0;
        }
        function slcVal(slc) {
            slc = slc | 0;
            return chunkGet(slc, 8) | 0;
        }
        function isSlc(x) {
            x = x | 0;
            return (tag(x) | 0) == 40 | 0;
        }
        function makeSgl(scp, ofs, val) {
            scp = scp | 0;
            ofs = ofs | 0;
            val = val | 0;
            var sgl = 0;
            sgl = makeChunk(20, 3) | 0;
            chunkSet(sgl, 4, scp);
            chunkSet(sgl, 8, ofs);
            chunkSet(sgl, 12, val);
            return sgl | 0;
        }
        function sglScp(sgl) {
            sgl = sgl | 0;
            return chunkGet(sgl, 4) | 0;
        }
        function sglOfs(sgl) {
            sgl = sgl | 0;
            return chunkGet(sgl, 8) | 0;
        }
        function sglVal(sgl) {
            sgl = sgl | 0;
            return chunkGet(sgl, 12) | 0;
        }
        function isSgl(x) {
            x = x | 0;
            return (tag(x) | 0) == 20 | 0;
        }
        function makeApz(opr) {
            opr = opr | 0;
            var apz = 0;
            apz = makeChunk(44, 1) | 0;
            chunkSet(apz, 4, opr);
            return apz | 0;
        }
        function apzOpr(apz) {
            apz = apz | 0;
            return chunkGet(apz, 4) | 0;
        }
        function isApz(x) {
            x = x | 0;
            return (tag(x) | 0) == 44 | 0;
        }
        function makeApl(opr, opd) {
            opr = opr | 0;
            opd = opd | 0;
            var apl = 0;
            apl = makeChunk(16, 2) | 0;
            chunkSet(apl, 4, opr);
            chunkSet(apl, 8, opd);
            return apl | 0;
        }
        function aplOpr(apl) {
            apl = apl | 0;
            return chunkGet(apl, 4) | 0;
        }
        function aplOpd(apl) {
            apl = apl | 0;
            return chunkGet(apl, 8) | 0;
        }
        function isApl(x) {
            x = x | 0;
            return (tag(x) | 0) == 16 | 0;
        }
        function makeContinuation(kon, frm, env, stk) {
            kon = kon | 0;
            frm = frm | 0;
            env = env | 0;
            stk = stk | 0;
            var cnt = 0;
            cnt = makeChunk(24, 4) | 0;
            chunkSet(cnt, 4, kon);
            chunkSet(cnt, 8, frm);
            chunkSet(cnt, 12, env);
            chunkSet(cnt, 16, stk);
            return cnt | 0;
        }
        function continuationKon(cnt) {
            cnt = cnt | 0;
            return chunkGet(cnt, 4) | 0;
        }
        function continuationFrm(cnt) {
            cnt = cnt | 0;
            return chunkGet(cnt, 8) | 0;
        }
        function continuationEnv(cnt) {
            cnt = cnt | 0;
            return chunkGet(cnt, 12) | 0;
        }
        function continuationStk(cnt) {
            cnt = cnt | 0;
            return chunkGet(cnt, 16) | 0;
        }
        function isContinuation(x) {
            x = x | 0;
            return (tag(x) | 0) == 24 | 0;
        }
        function makeFrm(vrb, nxt) {
            vrb = vrb | 0;
            nxt = nxt | 0;
            var frm = 0;
            frm = makeChunk(26, 2) | 0;
            chunkSet(frm, 4, vrb);
            chunkSet(frm, 8, nxt);
            return frm | 0;
        }
        function frameVrb(frm) {
            frm = frm | 0;
            return chunkGet(frm, 4) | 0;
        }
        function frameNxt(frm) {
            frm = frm | 0;
            return chunkGet(frm, 8) | 0;
        }
        function isFrame(x) {
            x = x | 0;
            return (tag(x) | 0) == 26 | 0;
        }
        function makeEnv(frm, siz, nxt) {
            frm = frm | 0;
            siz = siz | 0;
            nxt = nxt | 0;
            var env = 0;
            env = makeChunk(28, 3) | 0;
            chunkSet(env, 4, frm);
            chunkSet(env, 8, siz);
            chunkSet(env, 12, nxt);
            return env | 0;
        }
        function envFrm(env) {
            env = env | 0;
            return chunkGet(env, 4) | 0;
        }
        function envSiz(env) {
            env = env | 0;
            return chunkGet(env, 8) | 0;
        }
        function envNxt(env) {
            env = env | 0;
            return chunkGet(env, 12) | 0;
        }
        function isEnvironment(x) {
            x = x | 0;
            return (tag(x) | 0) == 28 | 0;
        }
        function makeThunk(exp, siz) {
            exp = exp | 0;
            siz = siz | 0;
            var thk = 0;
            thk = makeChunk(32, 2) | 0;
            chunkSet(thk, 4, exp);
            chunkSet(thk, 8, siz);
            return thk | 0;
        }
        function thunkExp(thk) {
            thk = thk | 0;
            return chunkGet(thk, 4) | 0;
        }
        function thunkSiz(thk) {
            thk = thk | 0;
            return chunkGet(thk, 8) | 0;
        }
        function isThunk(x) {
            x = x | 0;
            return (tag(x) | 0) == 32 | 0;
        }
        function makeLmb(arc, frc, bdy) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var lmb = 0;
            lmb = makeChunk(18, 3) | 0;
            chunkSet(lmb, 4, arc);
            chunkSet(lmb, 8, frc);
            chunkSet(lmb, 12, bdy);
            return lmb | 0;
        }
        function lmbArgc(lmb) {
            lmb = lmb | 0;
            return chunkGet(lmb, 4) | 0;
        }
        function lmbFrmSiz(lmb) {
            lmb = lmb | 0;
            return chunkGet(lmb, 8) | 0;
        }
        function lmbBdy(lmb) {
            lmb = lmb | 0;
            return chunkGet(lmb, 12) | 0;
        }
        function isLmb(x) {
            x = x | 0;
            return (tag(x) | 0) == 18 | 0;
        }
        function makeLmz(arc, frc, bdy) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var lmz = 0;
            lmz = makeChunk(34, 3) | 0;
            chunkSet(lmz, 4, arc);
            chunkSet(lmz, 8, frc);
            chunkSet(lmz, 12, bdy);
            return lmz | 0;
        }
        function lmzArgc(lmz) {
            lmz = lmz | 0;
            return chunkGet(lmz, 4) | 0;
        }
        function lmzFrmSiz(lmz) {
            lmz = lmz | 0;
            return chunkGet(lmz, 8) | 0;
        }
        function lmzBdy(lmz) {
            lmz = lmz | 0;
            return chunkGet(lmz, 12) | 0;
        }
        function isLmz(x) {
            x = x | 0;
            return (tag(x) | 0) == 34 | 0;
        }
        function makeLocal(ofs) {
            ofs = ofs | 0;
            var lcl = 0;
            lcl = makeChunk(36, 1) | 0;
            chunkSet(lcl, 4, ofs);
            return lcl | 0;
        }
        function localOfs(lcl) {
            lcl = lcl | 0;
            return chunkGet(lcl, 4) | 0;
        }
        function isLocal(x) {
            x = x | 0;
            return (tag(x) | 0) == 36 | 0;
        }
        function makeGlobal(scp, ofs) {
            scp = scp | 0;
            ofs = ofs | 0;
            var glb = 0;
            glb = makeChunk(38, 2) | 0;
            chunkSet(glb, 4, scp);
            chunkSet(glb, 8, ofs);
            return glb | 0;
        }
        function globalScp(glb) {
            glb = glb | 0;
            return chunkGet(glb, 4) | 0;
        }
        function globalOfs(glb) {
            glb = glb | 0;
            return chunkGet(glb, 8) | 0;
        }
        function isGlobal(x) {
            x = x | 0;
            return (tag(x) | 0) == 38 | 0;
        }
        function makePrc(arc, frc, bdy, env) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            env = env | 0;
            var prc = 0;
            prc = makeChunk(4, 4) | 0;
            chunkSet(prc, 4, arc);
            chunkSet(prc, 8, frc);
            chunkSet(prc, 12, bdy);
            chunkSet(prc, 16, env);
            return prc | 0;
        }
        function prcArgc(prc) {
            prc = prc | 0;
            return chunkGet(prc, 4) | 0;
        }
        function prcFrmSiz(prc) {
            prc = prc | 0;
            return chunkGet(prc, 8) | 0;
        }
        function prcBdy(prc) {
            prc = prc | 0;
            return chunkGet(prc, 12) | 0;
        }
        function prcEnv(prc) {
            prc = prc | 0;
            return chunkGet(prc, 16) | 0;
        }
        function isPrc(x) {
            x = x | 0;
            return (tag(x) | 0) == 4 | 0;
        }
        function makePrz(arc, frc, bdy, env) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            env = env | 0;
            var prz = 0;
            prz = makeChunk(42, 4) | 0;
            chunkSet(prz, 4, arc);
            chunkSet(prz, 8, frc);
            chunkSet(prz, 12, bdy);
            chunkSet(prz, 16, env);
            return prz | 0;
        }
        function przArgc(prz) {
            prz = prz | 0;
            return chunkGet(prz, 4) | 0;
        }
        function przFrmSiz(prz) {
            prz = prz | 0;
            return chunkGet(prz, 8) | 0;
        }
        function przBdy(prz) {
            prz = prz | 0;
            return chunkGet(prz, 12) | 0;
        }
        function przEnv(prz) {
            prz = prz | 0;
            return chunkGet(prz, 16) | 0;
        }
        function isPrz(x) {
            x = x | 0;
            return (tag(x) | 0) == 42 | 0;
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
        function textSetChar(txt, idx, chr) {
            txt = txt | 0;
            idx = idx | 0;
            chr = chr | 0;
            chunkSetByte(txt, idx + 4 | 0, chr);
        }
        function textGetChar(txt, idx) {
            txt = txt | 0;
            idx = idx | 0;
            return chunkGetByte(txt, idx + 4 | 0) | 0;
        }
        function textLength(txt) {
            txt = txt | 0;
            var len = 0;
            len = (chunkSize(txt) | 0) << 2;
            if (len)
                for (; !(chunkGetByte(txt, len + 3 | 0) | 0); len = len - 1 | 0);
            return len | 0;
        }
        function makeString(len) {
            len = len | 0;
            return makeText(5, len) | 0;
        }
        function isString(x) {
            x = x | 0;
            return (tag(x) | 0) == 5 | 0;
        }
        function makeSymbol(len) {
            len = len | 0;
            return makeText(3, len) | 0;
        }
        function isSymbol(x) {
            x = x | 0;
            return (tag(x) | 0) == 3 | 0;
        }
        function initPool() {
            __POOL_TOP__ = 0;
            __POOL_SIZ__ = 64;
            SYM = fillVector(__POOL_SIZ__, 2147483647) | 0;
        }
        function growPool() {
            var idx = 0;
            var sym = 0;
            __POOL_SIZ__ = imul(__POOL_SIZ__, 2) | 0;
            claimSiz(__POOL_SIZ__);
            TMP = fillVector(__POOL_SIZ__, 2147483647) | 0;
            while ((idx | 0) < (__POOL_TOP__ | 0)) {
                idx = idx + 1 | 0;
                sym = vectorRef(SYM, idx) | 0;
                vectorSet(TMP, idx, sym);
            }
            SYM = TMP;
        }
        function poolAt(idx) {
            idx = idx | 0;
            return vectorRef(SYM, idx) | 0;
        }
        function enterPool(sym) {
            sym = sym | 0;
            if ((__POOL_TOP__ | 0) == (__POOL_SIZ__ | 0))
                growPool();
            __POOL_TOP__ = __POOL_TOP__ + 1 | 0;
            vectorSet(SYM, __POOL_TOP__, sym);
            return __POOL_TOP__ | 0;
        }
        function loadSymbols() {
            __QUO_SYM__ = loadQuo() | 0;
            __VEC_SYM__ = loadVec() | 0;
            __DEF_SYM__ = loadDef() | 0;
            __LMB_SYM__ = loadLmb() | 0;
            __IFF_SYM__ = loadIff() | 0;
            __BEG_SYM__ = loadBeg() | 0;
            __SET_SYM__ = loadSet() | 0;
        }
        function initDictionary() {
            DEN = 2147483645;
            DFR = 2147483645;
            DGL = 2147483645;
        }
        function defineVar() {
            if ((currentScpLvl | 0) == 0 & (currentFrmSiz | 0) == 128)
                err_globalOverflow();
            DFR = makeFrm(PAT, DFR) | 0;
            currentFrmSiz = currentFrmSiz + 1 | 0;
            return currentFrmSiz | 0;
        }
        function enterScope() {
            DEN = makeEnv(DFR, makeImmediate(currentFrmSiz) | 0, DEN) | 0;
            currentScpLvl = currentScpLvl + 1 | 0;
            DFR = 2147483645;
            currentFrmSiz = 0;
        }
        function exitScope() {
            var frameSize = 0;
            frameSize = currentFrmSiz;
            DFR = envFrm(DEN) | 0;
            currentFrmSiz = immediateVal(envSiz(DEN) | 0) | 0;
            DEN = envNxt(DEN) | 0;
            currentScpLvl = currentScpLvl - 1 | 0;
            return frameSize | 0;
        }
        function offset(frm) {
            frm = frm | 0;
            for (; OFS; OFS = OFS - 1 | 0, frm = frameNxt(frm) | 0)
                if ((frameVrb(frm) | 0) == (PAT | 0) | 0)
                    return;
        }
        function lexicalAdr() {
            var env = 0;
            OFS = currentFrmSiz;
            offset(DFR);
            if (OFS) {
                //local variable found!
                SCP = 0;
                return;
            }
            if (currentScpLvl) {
                for (//maybe higher in environment?
                    SCP = currentScpLvl, env = DEN; SCP; SCP = SCP - 1 | 0, env = envNxt(env) | 0) {
                    OFS = immediateVal(envSiz(env) | 0) | 0;
                    offset(envFrm(env) | 0);
                    if (OFS)
                        return;
                }
            }
        }
        function dctCheckpoint() {
            DGL = DFR;
            globalFrmSiz = currentFrmSiz;
        }
        function dctRollback() {
            //TODO: check with C implementation
            DFR = DGL;
            DEN = 2147483645;
            currentFrmSiz = globalFrmSiz;
            currentScpLvl = 0;
        }
        function initEnvironment() {
            GLB = fillVector(128, 2147483647) | 0;
            FRM = GLB;
            ENV = 2147483645;
        }
        function extendEnv() {
            var env = 0;
            var len = 0;
            var idx = 0;
            len = (vectorLength(ENV) | 0) + 1 | 0;
            claimSiz(len);
            env = makeVector(len) | 0;
            for (idx = 1; (idx | 0) < (len | 0); idx = idx + 1 | 0)
                vectorSet(env, idx, vectorRef(ENV, idx) | 0);
            vectorSet(env, len, FRM);
            return env | 0;
        }
        function preserveEnv() {
            if ((KON | 0) != 120) {
                push(makeImmediate(KON) | 0);
                push(ENV);
                push(FRM);
                KON = 120;
            }
        }
        function preserveEnv_peek() {
            KON = immediateVal(peek() | 0) | 0;
            if ((KON | 0) != 120) {
                push(ENV);
                push(FRM);
                KON = 120;
            } else {
                zap();
            }
        }
        function lookupLocal(lcl) {
            lcl = lcl | 0;
            OFS = immediateVal(localOfs(lcl) | 0) | 0;
            return vectorRef(FRM, OFS) | 0;
        }
        function lookupGlobal(glb) {
            glb = glb | 0;
            SCP = immediateVal(globalScp(glb) | 0) | 0;
            OFS = immediateVal(globalOfs(glb) | 0) | 0;
            return vectorRef(vectorRef(ENV, SCP) | 0, OFS) | 0;
        }
        function capturePrc(exp) {
            exp = exp | 0;
            claim();
            return makePrc(lmbArgc(exp) | 0, lmbFrmSiz(exp) | 0, lmbBdy(exp) | 0, extendEnv() | 0) | 0;
        }
        function capturePrz(exp) {
            exp = exp | 0;
            claim();
            return makePrz(lmzArgc(exp) | 0, lmzFrmSiz(exp) | 0, lmzBdy(exp) | 0, extendEnv() | 0) | 0;
        }
        function initNatives() {
            addNative(loadLoa() | 0, 43);
            addNative(loadRnd() | 0, 42);
            addNative(loadSle() | 0, 41);
            addNative(loadSse() | 0, 40);
            addNative(loadSre() | 0, 39);
            addNative(loadCcc() | 0, 38);
            addNative(loadAvl() | 0, 37);
            addNative(loadCol() | 0, 36);
            addNative(loadRst() | 0, 33);
            addNative(loadClk() | 0, 32);
            addNative(loadIst() | 0, 26);
            addNative(loadIve() | 0, 25);
            addNative(loadIsy() | 0, 24);
            addNative(loadInu() | 0, 23);
            addNative(loadIpa() | 0, 22);
            addNative(loadRea() | 0, 21);
            addNative(loadNew() | 0, 20);
            addNative(loadDis() | 0, 19);
            addNative(loadEva() | 0, 17);
            addNative(loadApl() | 0, 18);
            addNative(loadMap() | 0, 16);
            addNative(loadAss() | 0, 15);
            addNative(loadVec() | 0, 31);
            addNative(loadVcl() | 0, 30);
            addNative(loadVcs() | 0, 29);
            addNative(loadVcr() | 0, 28);
            addNative(loadVcm() | 0, 27);
            addNative(loadEql() | 0, 35);
            addNative(loadEqu() | 0, 34);
            addNative(loadNeq() | 0, 10);
            addNative(loadLeq() | 0, 12);
            addNative(loadSeq() | 0, 11);
            addNative(loadSma() | 0, 13);
            addNative(loadLrg() | 0, 14);
            addNative(loadLst() | 0, 9);
            addNative(loadScd() | 0, 8);
            addNative(loadSca() | 0, 7);
            addNative(loadCdr() | 0, 6);
            addNative(loadCar() | 0, 5);
            addNative(loadCns() | 0, 4);
            addNative(loadDiv() | 0, 3);
            addNative(loadMul() | 0, 2);
            addNative(loadPls() | 0, 0);
            addNative(loadMns() | 0, 1);
        }
        function addNative(nam, ptr) {
            nam = nam | 0;
            ptr = ptr | 0;
            PAT = nam;
            OFS = defineVar() | 0;
            VAL = makeNative(ptr) | 0;
            vectorSet(FRM, OFS, VAL);
        }
        function init() {
            initPool();
            loadSymbols();
            initDictionary();
            initEnvironment();
            EXP = 2147483645;
            VAL = 2147483645;
            LST = 2147483645;
            __EMPTY_VEC__ = makeVector(0) | 0;
            initNatives();
        }
        function Slip_REPL() {
            initREPL();
            run(137);
        }
        function inputReady() {
            run(44);
        }
        function claim() {
            if ((available() | 0) < 128) {
                reclaim();
                if ((available() | 0) < 128)
                    err_fatalMemory();
            }
        }
        function claimSiz(amount) {
            amount = amount | 0;
            amount = (imul(amount, 4) | 0) + 128 | 0;
            if ((available() | 0) < (amount | 0)) {
                reclaim();
                if ((available() | 0) < (amount | 0))
                    err_fatalMemory();
            }
        }
        function reclaim() {
            push(SYM);
            push(PAT);
            push(GLB);
            push(FRM);
            push(ENV);
            push(DGL);
            push(DFR);
            push(DEN);
            push(LST);
            push(ARG);
            push(PAR);
            push(VAL);
            push(EXP);
            push(__EMPTY_VEC__);
            collectGarbage();
            __EMPTY_VEC__ = pop() | 0;
            EXP = pop() | 0;
            VAL = pop() | 0;
            PAR = pop() | 0;
            ARG = pop() | 0;
            LST = pop() | 0;
            DEN = pop() | 0;
            DFR = pop() | 0;
            DGL = pop() | 0;
            ENV = pop() | 0;
            FRM = pop() | 0;
            GLB = pop() | 0;
            PAT = pop() | 0;
            SYM = pop() | 0;
            loadSymbols();
        }
        function run(opc) {
            opc = opc | 0;
            dispatch:
                while (1) {
                    switch (opc | 0) {
                    case 0    // **********************************************************************
                             // *************************** NATIVES PT1 ******************************
                             // **********************************************************************
:
                        for (// **********************************************************************
                            // *************************** NATIVES PT1 ******************************
                            // **********************************************************************
                            VAL = 0, IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                            EXP = vectorRef(PAR, IDX) | 0;
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = VAL + (immediateVal(EXP) | 0) | 0;
                                break;
                            case 1:
                                FLT = fround(fround(VAL | 0) + fround(floatNumber(EXP)));
                                opc = 121;
                                continue dispatch;
                            default:
                                err_invalidArgument(EXP | 0);
                                opc = 141;
                                continue dispatch;
                            }
                        }
                        VAL = makeImmediate(VAL) | 0;
                        opc = KON;
                        continue dispatch;
                    case 1:
                        if (!LEN) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = vectorRef(PAR, 1) | 0;
                        if ((LEN | 0) == 1) {
                            switch (tag(VAL) | 0) {
                            case 69:
                                VAL = makeImmediate(-(immediateVal(VAL) | 0) | 0) | 0;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                claim();
                                VAL = makeFloat(fround(-fround(floatNumber(VAL)))) | 0;
                                opc = KON;
                                continue dispatch;
                            default:
                                err_invalidArgument(VAL | 0);
                                opc = 141;
                                continue dispatch;
                            }
                        }
                        IDX = 1;
                        switch (tag(VAL) | 0) {
                        case 69:
                            VAL = immediateVal(VAL) | 0;
                            while ((IDX | 0) < (LEN | 0)) {
                                IDX = IDX + 1 | 0;
                                EXP = vectorRef(PAR, IDX) | 0;
                                switch (tag(EXP) | 0) {
                                case 69:
                                    VAL = VAL - (immediateVal(EXP) | 0) | 0;
                                    break;
                                case 1:
                                    FLT = fround(fround(VAL | 0) - fround(floatNumber(EXP)));
                                    opc = 122;
                                    continue dispatch;
                                default:
                                    err_invalidArgument(EXP | 0);
                                    opc = 141;
                                    continue dispatch;
                                }
                            }
                            VAL = makeImmediate(VAL) | 0;
                            opc = KON;
                            continue dispatch;
                        case 1:
                            FLT = fround(floatNumber(VAL));
                            opc = 122;
                            continue dispatch;
                        }
                        err_invalidArgument(VAL | 0);
                        opc = 141;
                        continue dispatch;
                    case 2:
                        VAL = 1;
                        IDX = 0;
                        while ((IDX | 0) < (LEN | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(PAR, IDX) | 0;
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = imul(VAL, immediateVal(EXP) | 0) | 0;
                                break;
                            case 1:
                                FLT = fround(fround(VAL | 0) * fround(floatNumber(EXP)));
                                opc = 123;
                                continue dispatch;
                            default:
                                err_invalidArgument(EXP | 0);
                                opc = 141;
                                continue dispatch;
                            }
                        }
                        VAL = makeImmediate(VAL) | 0;
                        opc = KON;
                        continue dispatch;
                    case 3:
                        if (!LEN) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        claim();
                        VAL = vectorRef(PAR, 1) | 0;
                        if ((LEN | 0) == 1) {
                            switch (tag(VAL) | 0) {
                            case 69:
                                VAL = makeFloat(fround(fround(1) / fround(immediateVal(VAL) | 0))) | 0;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = makeFloat(fround(fround(1) / fround(floatNumber(VAL)))) | 0;
                                opc = KON;
                                continue dispatch;
                            default:
                                err_invalidArgument(VAL | 0);
                                opc = 141;
                                continue dispatch;
                            }
                        }
                        switch (tag(VAL) | 0) {
                        case 69:
                            FLT = fround(immediateVal(VAL) | 0);
                            break;
                        case 1:
                            FLT = fround(floatNumber(VAL));
                            break;
                        default:
                            err_invalidArgument(VAL | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        for (IDX = 2; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                            EXP = vectorRef(PAR, IDX) | 0;
                            switch (tag(EXP) | 0) {
                            case 69:
                                FLT = fround(FLT / fround(immediateVal(EXP) | 0));
                                break;
                            case 1:
                                FLT = fround(FLT / fround(floatNumber(EXP)));
                                break;
                            default:
                                err_invalidArgument(EXP | 0);
                                opc = 141;
                                continue dispatch;
                            }
                        }
                        VAL = makeFloat(FLT) | 0;
                        opc = KON;
                        continue dispatch;
                    case 4:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        claim();
                        VAL = makePair(vectorRef(PAR, 1) | 0, vectorRef(PAR, 2) | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 5:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        if (isPair(ARG) | 0) {
                            VAL = pairCar(ARG) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 6:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        if (isPair(ARG) | 0) {
                            VAL = pairCdr(ARG) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 7:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        VAL = vectorRef(PAR, 2) | 0;
                        if (isPair(ARG) | 0) {
                            pairSetCar(ARG, VAL);
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 8:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        VAL = vectorRef(PAR, 2) | 0;
                        if (isPair(ARG) | 0) {
                            pairSetCdr(ARG, VAL);
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 9:
                        claimSiz(imul(3, LEN) | 0);
                        for (VAL = 2147483645; LEN; LEN = LEN - 1 | 0)
                            VAL = makePair(vectorRef(PAR, LEN) | 0, VAL) | 0;
                        opc = KON;
                        continue dispatch;
                    case 10:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        switch (tag(ARG) | 0) {
                        case 69:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = (immediateVal(ARG) | 0) == (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(immediateVal(ARG) | 0) == fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        case 1:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = fround(floatNumber(ARG)) == fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(floatNumber(ARG)) == fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 11:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        switch (tag(ARG) | 0) {
                        case 69:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = (immediateVal(ARG) | 0) <= (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(immediateVal(ARG) | 0) <= fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        case 1:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = fround(floatNumber(ARG)) <= fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(floatNumber(ARG)) <= fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 12:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        switch (tag(ARG) | 0) {
                        case 69:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = (immediateVal(ARG) | 0) >= (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(immediateVal(ARG) | 0) >= fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        case 1:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = fround(floatNumber(ARG)) >= fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(floatNumber(ARG)) >= fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 13:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        switch (tag(ARG) | 0) {
                        case 69:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = (immediateVal(ARG) | 0) < (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(immediateVal(ARG) | 0) < fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        case 1:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = fround(floatNumber(ARG)) < fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(floatNumber(ARG)) < fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 14:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        switch (tag(ARG) | 0) {
                        case 69:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = (immediateVal(ARG) | 0) > (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(immediateVal(ARG) | 0) > fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        case 1:
                            switch (tag(EXP) | 0) {
                            case 69:
                                VAL = fround(floatNumber(ARG)) > fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            case 1:
                                VAL = fround(floatNumber(ARG)) > fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        err_invalidArgument(ARG | 0);
                        opc = 141;
                        continue dispatch;
                    case 15:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        PAT = vectorRef(PAR, 1) | 0;
                        LST = vectorRef(PAR, 2) | 0;
                        while (isPair(LST) | 0) {
                            VAL = pairCar(LST) | 0;
                            if (!(isPair(VAL) | 0)) {
                                err_invalidArgument(LST | 0);
                                opc = 141;
                                continue dispatch;
                            }
                            if ((pairCar(VAL) | 0) == (PAT | 0))
                                opc = KON;
                            continue dispatch;
                            LST = pairCdr(LST) | 0;
                        }
                        VAL = 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 16:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = vectorRef(PAR, 1) | 0;
                        LST = vectorRef(PAR, 2) | 0;
                        if (isNull(LST) | 0) {
                            VAL = 2147483645;
                            opc = KON;
                            continue dispatch;
                        }
                        claim();
                        ARG = makePair(pairCar(LST) | 0, 2147483645) | 0;
                        LST = pairCdr(LST) | 0;
                        push(makeImmediate(KON) | 0);
                        push(1);
                        if (isNull(LST) | 0) {
                            KON = 124;
                        } else {
                            push(VAL);
                            push(LST);
                            KON = 125;
                        }
                        opc = 126;
                        continue dispatch;
                    case 17:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        claim();
                        EXP = vectorRef(PAR, 1) | 0;
                        push(makeImmediate(KON) | 0);
                        KON = 127;
                        opc = 53;
                        continue dispatch;
                    case 18:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = vectorRef(PAR, 1) | 0;
                        ARG = vectorRef(PAR, 2) | 0;
                        opc = 126;
                        continue dispatch;
                    case 19:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        printLog(vectorRef(PAR, 1) | 0);
                        VAL = 2147483647;
                        opc = KON;
                        continue dispatch;
                    case 20:
                        printNewline();
                        VAL = 2147483647;
                        opc = KON;
                        continue dispatch;
                    case 21:
                        promptUserInput();
                        break dispatch;
                    case 22:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 0 ? 2147483643 : 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 23:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 68 ? 2147483643 : 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 24:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 3 ? 2147483643 : 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 25:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 2 ? 2147483643 : 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 26:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 5 ? 2147483643 : 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 27:
                        if (!LEN) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        if (!(isNumber(ARG) | 0)) {
                            err_invalidArgument(ARG | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        LEN = immediateVal(ARG) | 0;
                        if ((LEN | 0) < 0) {
                            err_invalidLength(LEN | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        claimSiz(LEN);
                        VAL = LEN ? 1 : vectorRef(PAR, 2) | 0;
                        VAL = fillVector(LEN, VAL) | 0;
                        opc = KON;
                        continue dispatch;
                    case 28:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        if (!(isVector(ARG) | 0)) {
                            err_invalidArgument(ARG | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        if (!(isNumber(EXP) | 0)) {
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        IDX = immediateVal(EXP) | 0;
                        LEN = vectorLength(ARG) | 0;
                        if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                            VAL = vectorRef(ARG, IDX + 1 | 0) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
                        opc = 141;
                        continue dispatch;
                    case 29:
                        if ((LEN | 0) != 3) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        VAL = vectorRef(PAR, 3) | 0;
                        if (!(isVector(ARG) | 0)) {
                            err_invalidArgument(ARG | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        if (!(isNumber(EXP) | 0)) {
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        IDX = immediateVal(EXP) | 0;
                        LEN = vectorLength(ARG) | 0;
                        if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                            vectorSet(ARG, IDX + 1 | 0, VAL);
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
                        opc = 141;
                        continue dispatch;
                    case 30:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        if (!(isVector(ARG) | 0)) {
                            err_invalidArgument(ARG | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        LEN = vectorLength(ARG) | 0;
                        VAL = makeImmediate(LEN) | 0;
                        opc = KON;
                        continue dispatch;
                    case 31:
                        VAL = PAR;
                        opc = KON;
                        continue dispatch;
                    case 32:
                        if (LEN) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = makeImmediate(clock() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 33:
                        if (LEN) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        reset();
                        VAL = 2147483647;
                        opc = KON;
                        continue dispatch;
                    case 34:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = (vectorRef(PAR, 1) | 0) == (vectorRef(PAR, 2) | 0) ? 2147483643 : 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 35:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        EXP = vectorRef(PAR, 1) | 0;
                        ARG = vectorRef(PAR, 2) | 0;
                        opc = 130;
                        continue dispatch;
                    case 36:
                        reclaim();
                        VAL = makeImmediate(available() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 37:
                        VAL = makeImmediate(available() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 38:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = vectorRef(PAR, 1) | 0;
                        switch (tag(VAL) | 0) {
                        case 4:
                        case 42:
                        case 70:
                        case 24:
                            ARG = currentStack() | 0;
                            ARG = makeContinuation(makeImmediate(KON) | 0, FRM, ENV, ARG) | 0;
                            ARG = makePair(ARG, 2147483645) | 0;
                            opc = 126;
                            continue dispatch;
                        }
                        err_invalidArgument(VAL | 0);
                        opc = 141;
                        continue dispatch;
                    case 39:
                        if ((LEN | 0) != 2) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        if (!(isString(ARG) | 0)) {
                            err_invalidArgument(ARG | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        if (!(isNumber(EXP) | 0)) {
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        IDX = immediateVal(EXP) | 0;
                        LEN = textLength(ARG) | 0;
                        if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                            VAL = makeChar(textGetChar(ARG, IDX) | 0) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
                        opc = 141;
                        continue dispatch;
                    case 40:
                        if ((LEN | 0) != 3) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        EXP = vectorRef(PAR, 2) | 0;
                        VAL = vectorRef(PAR, 3) | 0;
                        if (!(isString(ARG) | 0)) {
                            err_invalidArgument(ARG | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        if (!(isNumber(EXP) | 0)) {
                            err_invalidArgument(EXP | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        if (!(isChar(VAL) | 0)) {
                            err_invalidArgument(VAL | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        IDX = immediateVal(EXP) | 0;
                        LEN = textLength(ARG) | 0;
                        if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                            textSetChar(ARG, IDX, charCode(VAL) | 0);
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
                        opc = 141;
                        continue dispatch;
                    case 41:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        if (!(isString(ARG) | 0)) {
                            err_invalidArgument(ARG | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        VAL = makeImmediate(textLength(ARG) | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 42:
                        if (LEN | 0) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        claim();
                        VAL = makeFloat(fround(+random())) | 0;
                        opc = KON;
                        continue dispatch;
                    case 43:
                        if ((LEN | 0) != 1) {
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        ARG = vectorRef(PAR, 1) | 0;
                        if (!(isString(ARG) | 0)) {
                            err_invalidArgument(ARG | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        claim();
                        push(makeImmediate(KON) | 0);
                        KON = 128;
                        loadFile(ARG | 0);
                        break dispatch;
                    case 44    // **********************************************************************
                              // ***************************** READER *********************************
                              // **********************************************************************
:
                        switch (// **********************************************************************
                            // ***************************** READER *********************************
                            // **********************************************************************
                            look() | 0) {
                        case 40:
                            opc = 45;
                            continue dispatch;
                        case 35:
                            opc = 51;
                            continue dispatch;
                        case 39:
                            opc = 49;
                            continue dispatch;
                        case 34:
                            VAL = readString() | 0;
                            opc = KON;
                            continue dispatch;
                        case 43:
                        case 45:
                        case 48:
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                        case 56:
                        case 57:
                            VAL = readNumber() | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        VAL = readSymbol() | 0;
                        opc = KON;
                        continue dispatch;
                    case 45:
                        skip();
                        if ((look() | 0) == 41) {
                            skip();
                            VAL = 2147483645;
                            opc = KON;
                            continue dispatch;
                        }
                        push(makeImmediate(KON) | 0);
                        push(1);
                        KON = 46;
                        opc = 44;
                        continue dispatch;
                    case 46:
                        claim();
                        if ((look() | 0) == 41) {
                            skip();
                            VAL = makePair(VAL, 2147483645) | 0;
                            opc = 48;
                            continue dispatch;
                        }
                        IDX = immediateVal(peek() | 0) | 0;
                        poke(VAL);
                        push(makeImmediate(IDX + 1 | 0) | 0);
                        if ((look() | 0) == 46) {
                            skip();
                            KON = 47;
                        }
                        opc = 44;
                        continue dispatch;
                    case 47:
                        if ((look() | 0) != 41) {
                            err_expectedRBR(look() | 0);
                            opc = 141;
                            continue dispatch;
                        }
                        skip();
                        opc = 48;
                        continue dispatch;
                    case 48:
                        IDX = immediateVal(pop() | 0) | 0;
                        for (; IDX; IDX = IDX - 1 | 0)
                            VAL = makePair(pop() | 0, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 49:
                        skip() | 0;
                        push(makeImmediate(KON) | 0);
                        KON = 50;
                        opc = 44;
                        continue dispatch;
                    case 50:
                        claim();
                        VAL = makePair(VAL, 2147483645) | 0;
                        VAL = makePair(__QUO_SYM__, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 51:
                        skip();
                        switch (read() | 0) {
                        case 116:
                            VAL = 2147483643;
                            opc = KON;
                            continue dispatch;
                        case 102:
                            VAL = 2147483641;
                            opc = KON;
                            continue dispatch;
                        case 92:
                            VAL = makeChar(read() | 0) | 0;
                            opc = KON;
                            continue dispatch;
                        case 40:
                            if ((look() | 0) == 41) {
                                skip();
                                VAL = makePair(__VEC_SYM__, 2147483645) | 0;
                                opc = KON;
                                continue dispatch;
                            }
                            push(makeImmediate(KON) | 0);
                            KON = 52;
                            push(3);
                            opc = 44;
                            continue dispatch;
                        }
                        err_invalidSyntax();
                        opc = 141;
                        continue dispatch;
                    case 52:
                        if ((look() | 0) == 41) {
                            skip();
                            LEN = immediateVal(pop() | 0) | 0;
                            claimSiz(LEN);
                            VAL = makePair(VAL, 2147483645) | 0;
                            for (LEN = LEN - 1 | 0; LEN; LEN = LEN - 1 | 0)
                                VAL = makePair(pop() | 0, VAL) | 0;
                            VAL = makePair(__VEC_SYM__, VAL) | 0;
                            KON = immediateVal(pop() | 0) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        claim();
                        IDX = immediateVal(peek() | 0) | 0;
                        poke(VAL);
                        push(makeImmediate(IDX + 1 | 0) | 0);
                        opc = 44;
                        continue dispatch;
                    case 53    // **********************************************************************
                              // **************************** COMPILER ********************************
                              // **********************************************************************
:
                        if (// **********************************************************************
                            // **************************** COMPILER ********************************
                            // **********************************************************************
                            isPair(EXP) | 0) {
                            LST = pairCdr(EXP) | 0;
                            EXP = pairCar(EXP) | 0;
                            if (isSymbol(EXP) | 0) {
                                if ((EXP | 0) == (__IFF_SYM__ | 0)) {
                                    opc = 61;
                                    continue dispatch;
                                } else if ((EXP | 0) == (__DEF_SYM__ | 0)) {
                                    opc = 67;
                                    continue dispatch;
                                } else if ((EXP | 0) == (__BEG_SYM__ | 0)) {
                                    opc = 55;
                                    continue dispatch;
                                } else if ((EXP | 0) == (__LMB_SYM__ | 0)) {
                                    opc = 74;
                                    continue dispatch;
                                } else if ((EXP | 0) == (__SET_SYM__ | 0)) {
                                    opc = 72;
                                    continue dispatch;
                                } else if ((EXP | 0) == (__QUO_SYM__ | 0)) {
                                    opc = 58;
                                    continue dispatch;
                                }
                            }
                            opc = 78;
                            continue dispatch;
                        }
                        if (isSymbol(EXP) | 0) {
                            opc = 54;
                            continue dispatch;
                        }
                        VAL = EXP;
                        opc = KON;
                        continue dispatch;
                    case 54:
                        claim();
                        PAT = EXP;
                        lexicalAdr();
                        if (OFS) {
                            OFS = makeImmediate(OFS) | 0;
                            if (SCP) {
                                SCP = makeImmediate(SCP) | 0;
                                VAL = makeGlobal(SCP, OFS) | 0;
                            } else {
                                VAL = makeLocal(OFS) | 0;
                            }
                            opc = KON;
                            continue dispatch;
                        }
                        err_undefinedVariable(PAT | 0);
                        opc = 141;
                        continue dispatch;
                    case 55:
                        if (isNull(LST) | 0) {
                            VAL = 2147483647;
                            opc = KON;
                            continue dispatch;
                        }
                        if (!(isPair(LST) | 0)) {
                            err_invalidSequence();
                            opc = 141;
                            continue dispatch;
                        }
                        EXP = pairCar(LST) | 0;
                        LST = pairCdr(LST) | 0;
                        if (!(isNull(LST) | 0)) {
                            claim();
                            push(makeImmediate(KON) | 0);
                            push(3);
                            push(LST);
                            KON = 56;
                        }
                        opc = 53;
                        continue dispatch;
                    case 56:
                        LST = pop() | 0;
                        LEN = immediateVal(peek() | 0) | 0;
                        poke(VAL);
                        push(makeImmediate(LEN + 1 | 0) | 0);
                        if (!(isPair(LST) | 0)) {
                            err_invalidSequence();
                            opc = 141;
                            continue dispatch;
                        }
                        EXP = pairCar(LST) | 0;
                        LST = pairCdr(LST) | 0;
                        if (isNull(LST) | 0) {
                            KON = 57;
                        } else {
                            claim();
                            push(LST);
                        }
                        opc = 53;
                        continue dispatch;
                    case 57:
                        LEN = immediateVal(pop() | 0) | 0;
                        claimSiz(LEN);
                        EXP = makeSequence(LEN) | 0;
                        sequenceSet(EXP, LEN, VAL);
                        do {
                            LEN = LEN - 1 | 0;
                            sequenceSet(EXP, LEN, pop() | 0);
                        } while ((LEN | 0) > 1);
                        VAL = EXP;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 58:
                        if (!(isPair(LST) | 0)) {
                            err_invalidQuote();
                            opc = 141;
                            continue dispatch;
                        }
                        EXP = pairCar(LST) | 0;
                        LST = pairCdr(LST) | 0;
                        if (isNull(LST) | 0) {
                            claim();
                            VAL = makeQuo(EXP) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidQuote();
                        opc = 141;
                        continue dispatch;
                    case 59:
                        claim();
                        enterScope();
                        push(EXP);
                        push(makeImmediate(KON) | 0);
                        KON = 60;
                        opc = 53;
                        continue dispatch;
                    case 60:
                        SIZ = exitScope() | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        if (SIZ) {
                            zap();
                            claim();
                            SIZ = makeImmediate(SIZ) | 0;
                            VAL = makeThunk(VAL, SIZ) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        //default to normal compilation if no locals are used
                        EXP = pop() | 0;
                        opc = 53;
                        continue dispatch;
                    case 61:
                        if (!(isPair(LST) | 0)) {
                            err_invalidIf();
                            opc = 141;
                            continue dispatch;
                        }
                        EXP = pairCar(LST) | 0;
                        LST = pairCdr(LST) | 0;
                        if (!(isPair(LST) | 0)) {
                            err_invalidIf();
                            opc = 141;
                            continue dispatch;
                        }
                        claim();
                        push(makeImmediate(KON) | 0);
                        push(LST);
                        KON = 62;
                        opc = 53;
                        continue dispatch;
                    case 62:
                        LST = peek() | 0;
                        EXP = pairCar(LST) | 0;
                        LST = pairCdr(LST) | 0;
                        poke(VAL);
                        if (isNull(LST) | 0) {
                            KON = 63;
                            opc = 59;
                            continue dispatch;
                        }
                        if (isPair(LST) | 0) {
                            claim();
                            push(LST);
                            KON = 64;
                            opc = 59;
                            continue dispatch;
                        }
                        err_invalidIf();
                        opc = 141;
                        continue dispatch;
                    case 63:
                        claim();
                        VAL = makeIfs(pop() | 0, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 64:
                        LST = peek() | 0;
                        EXP = pairCar(LST) | 0;
                        LST = pairCdr(LST) | 0;
                        poke(VAL);
                        if (!(isNull(LST) | 0)) {
                            err_invalidIf();
                            opc = 141;
                            continue dispatch;
                        }
                        KON = 65;
                        opc = 59;
                        continue dispatch;
                    case 65:
                        claim();
                        EXP = pop() | 0;
                        VAL = makeIff(pop() | 0, EXP, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 66:
                        for (LST = PAR; isPair(LST) | 0; LST = pairCdr(LST) | 0) {
                            PAT = pairCar(LST) | 0;
                            if (!(isSymbol(PAT) | 0)) {
                                err_invalidParameter();
                                opc = 141;
                                continue dispatch;
                            }
                            claim();
                            defineVar() | 0;
                        }
                        opc = KON;
                        continue dispatch;
                    case 67:
                        claim();
                        if (!(isPair(LST) | 0)) {
                            err_invalidDefine();
                            opc = 141;
                            continue dispatch;
                        }
                        PAT = pairCar(LST) | 0;
                        LST = pairCdr(LST) | 0;
                        push(makeImmediate(KON) | 0);
                        switch (tag(PAT) | 0) {
                        case 3:
                            if (!(isPair(LST) | 0)) {
                                err_invalidDefine();
                                opc = 141;
                                continue dispatch;
                            }
                            EXP = pairCar(LST) | 0;
                            LST = pairCdr(LST) | 0;
                            if (!(isNull(LST) | 0)) {
                                err_invalidDefine();
                                opc = 141;
                                continue dispatch;
                            }
                            OFS = defineVar() | 0;
                            push(makeImmediate(OFS) | 0);
                            KON = 68;
                            opc = 53;
                            continue dispatch;
                        case 0:
                            PAR = pairCdr(PAT) | 0;
                            PAT = pairCar(PAT) | 0;
                            if (!(isSymbol(PAT) | 0)) {
                                err_invalidDefine();
                                opc = 141;
                                continue dispatch;
                            }
                            OFS = defineVar() | 0;
                            push(makeImmediate(OFS) | 0);
                            push(LST);
                            enterScope();
                            KON = 69;
                            opc = 66;
                            continue dispatch;
                        }
                        err_invalidDefine();
                        opc = 141;
                        continue dispatch;
                    case 68:
                        claim();
                        OFS = pop() | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        VAL = makeDfv(OFS, VAL) | 0;
                        opc = KON;
                        continue dispatch;
                    case 69:
                        SIZ = makeImmediate(currentFrmSiz) | 0;
                        switch (tag(LST) | 0) {
                        case 68:
                            LST = peek() | 0;
                            poke(SIZ);
                            KON = 70;
                            opc = 55;
                            continue dispatch;
                        case 3:
                            claim();
                            PAT = LST;
                            defineVar() | 0;
                            LST = peek() | 0;
                            poke(SIZ);
                            KON = 71;
                            opc = 55;
                            continue dispatch;
                        }
                        err_invalidDefine();
                        opc = 141;
                        continue dispatch;
                    case 70:
                        claim();
                        SIZ = makeImmediate(exitScope() | 0) | 0;
                        //total frame size
                        TMP = pop() | 0;
                        //argument count
                        OFS = pop() | 0;
                        //offset
                        VAL = makeDff(OFS, TMP, SIZ, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 71:
                        claim();
                        SIZ = makeImmediate(exitScope() | 0) | 0;
                        //total frame size
                        TMP = pop() | 0;
                        //argument count
                        OFS = pop() | 0;
                        //offset
                        VAL = makeDfz(OFS, TMP, SIZ, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 72:
                        claim();
                        if (!(isPair(LST) | 0)) {
                            err_invalidAssignment();
                            opc = 141;
                            continue dispatch;
                        }
                        PAT = pairCar(LST) | 0;
                        if (!(isSymbol(PAT) | 0)) {
                            err_invalidAssignment();
                            opc = 141;
                            continue dispatch;
                        }
                        LST = pairCdr(LST) | 0;
                        if (!(isPair(LST) | 0)) {
                            err_invalidAssignment();
                            opc = 141;
                            continue dispatch;
                        }
                        EXP = pairCar(LST) | 0;
                        LST = pairCdr(LST) | 0;
                        if (!(isNull(LST) | 0)) {
                            err_invalidAssignment();
                            opc = 141;
                            continue dispatch;
                        }
                        //NOTE: original C implementation first compiles expression...
                        //... then looks up the pattern, so that statements such as:
                        //(set! x (begin (define x 2) 'foo)) are valid.
                        push(makeImmediate(KON) | 0);
                        push(PAT);
                        KON = 73;
                        opc = 53;
                        continue dispatch;
                    case 73:
                        claim();
                        PAT = pop() | 0;
                        lexicalAdr();
                        if (OFS) {
                            OFS = makeImmediate(OFS) | 0;
                            if (SCP) {
                                SCP = makeImmediate(SCP) | 0;
                                VAL = makeSgl(SCP, OFS, VAL) | 0;
                            } else {
                                VAL = makeSlc(OFS, VAL) | 0;
                            }
                            KON = immediateVal(pop() | 0) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        err_undefinedVariable(PAT | 0);
                        opc = 141;
                        continue dispatch;
                    case 74:
                        if (!(isPair(LST) | 0)) {
                            err_invalidLambda();
                            opc = 141;
                            continue dispatch;
                        }
                        claim();
                        enterScope();
                        PAR = pairCar(LST) | 0;
                        push(makeImmediate(KON) | 0);
                        push(pairCdr(LST) | 0);
                        KON = 75;
                        opc = 66;
                        continue dispatch;
                    case 75:
                        SIZ = makeImmediate(currentFrmSiz) | 0;
                        switch (tag(LST) | 0) {
                        case 68:
                            LST = peek() | 0;
                            poke(SIZ);
                            KON = 76;
                            opc = 55;
                            continue dispatch;
                        case 3:
                            claim();
                            PAT = LST;
                            defineVar() | 0;
                            LST = peek() | 0;
                            poke(SIZ);
                            KON = 77;
                            opc = 55;
                            continue dispatch;
                        }
                        err_invalidLambda();
                        opc = 141;
                        continue dispatch;
                    case 76:
                        claim();
                        SIZ = makeImmediate(exitScope() | 0) | 0;
                        TMP = pop() | 0;
                        VAL = makeLmb(TMP, SIZ, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 77:
                        claim();
                        SIZ = makeImmediate(exitScope() | 0) | 0;
                        TMP = pop() | 0;
                        VAL = makeLmz(TMP, SIZ, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 78:
                        claim();
                        push(makeImmediate(KON) | 0);
                        if (isNull(LST) | 0) {
                            KON = 79;
                        } else {
                            push(LST);
                            push(1);
                            KON = 80;
                        }
                        opc = 53;
                        continue dispatch;
                    case 79:
                        claim();
                        VAL = makeApz(VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 80:
                        LEN = immediateVal(pop() | 0) | 0;
                        ARG = peek() | 0;
                        poke(VAL);
                        if (!(isPair(ARG) | 0)) {
                            err_invalidApplication();
                            opc = 141;
                            continue dispatch;
                        }
                        EXP = pairCar(ARG) | 0;
                        ARG = pairCdr(ARG) | 0;
                        if (isNull(ARG) | 0) {
                            KON = 81;
                        } else {
                            claim();
                            push(ARG);
                        }
                        push(makeImmediate(LEN + 1 | 0) | 0);
                        opc = 53;
                        continue dispatch;
                    case 81:
                        LEN = immediateVal(pop() | 0) | 0;
                        claimSiz(LEN);
                        EXP = makeVector(LEN) | 0;
                        vectorSet(EXP, LEN, VAL);
                        for (LEN = LEN - 1 | 0; LEN; LEN = LEN - 1 | 0)
                            vectorSet(EXP, LEN, pop() | 0);
                        VAL = makeApl(pop() | 0, EXP) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 82    // **********************************************************************
                              // *************************** EVALUATOR ********************************
                              // **********************************************************************
:
                        switch (// **********************************************************************
                            // *************************** EVALUATOR ********************************
                            // **********************************************************************
                            tag(EXP) | 0) {
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
                        case 24:
                            VAL = EXP;
                            opc = KON;
                            continue dispatch;
                        case 22:
                            VAL = quoExpression(EXP) | 0;
                            opc = KON;
                            continue dispatch;
                        case 36:
                            VAL = lookupLocal(EXP) | 0;
                            opc = KON;
                            continue dispatch;
                        case 38:
                            VAL = lookupGlobal(EXP) | 0;
                            opc = KON;
                            continue dispatch;
                        case 18:
                            VAL = capturePrc(EXP) | 0;
                            opc = KON;
                            continue dispatch;
                        case 34:
                            VAL = capturePrz(EXP) | 0;
                            opc = KON;
                            continue dispatch;
                        case 40:
                            opc = 83;
                            continue dispatch;
                        case 20:
                            opc = 85;
                            continue dispatch;
                        case 12:
                            opc = 87;
                            continue dispatch;
                        case 14:
                            opc = 89;
                            continue dispatch;
                        case 30:
                            opc = 90;
                            continue dispatch;
                        case 6:
                            opc = 91;
                            continue dispatch;
                        case 8:
                            opc = 93;
                            continue dispatch;
                        case 10:
                            opc = 95;
                            continue dispatch;
                        case 32:
                            opc = 97;
                            continue dispatch;
                        case 44:
                            opc = 98;
                            continue dispatch;
                        case 16:
                            opc = 101;
                            continue dispatch;
                        }
                        err_invalidExpression(EXP | 0);
                        opc = 141;
                        continue dispatch;
                    case 83:
                        claim();
                        push(makeImmediate(KON) | 0);
                        push(slcOfs(EXP) | 0);
                        EXP = slcVal(EXP) | 0;
                        KON = 84;
                        opc = 82;
                        continue dispatch;
                    case 84:
                        OFS = immediateVal(pop() | 0) | 0;
                        vectorSet(FRM, OFS, VAL);
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 85:
                        claim();
                        push(makeImmediate(KON) | 0);
                        push(sglScp(EXP) | 0);
                        push(sglOfs(EXP) | 0);
                        EXP = sglVal(EXP) | 0;
                        KON = 86;
                        opc = 82;
                        continue dispatch;
                    case 86:
                        OFS = immediateVal(pop() | 0) | 0;
                        SCP = immediateVal(pop() | 0) | 0;
                        vectorSet(vectorRef(ENV, SCP) | 0, OFS, VAL);
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 87:
                        claim();
                        push(makeImmediate(KON) | 0);
                        push(dfvOfs(EXP) | 0);
                        EXP = dfvVal(EXP) | 0;
                        KON = 88;
                        opc = 82;
                        continue dispatch;
                    case 88:
                        OFS = immediateVal(pop() | 0) | 0;
                        vectorSet(FRM, OFS, VAL);
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 89:
                        claim();
                        VAL = makePrc(dffArgc(EXP) | 0, dffFrmSiz(EXP) | 0, dffBdy(EXP) | 0, extendEnv() | 0) | 0;
                        OFS = immediateVal(dffOfs(EXP) | 0) | 0;
                        vectorSet(FRM, OFS, VAL);
                        opc = KON;
                        continue dispatch;
                    case 90:
                        claim();
                        VAL = makePrz(dfzArgc(EXP) | 0, dfzFrmSiz(EXP) | 0, dfzBdy(EXP) | 0, extendEnv() | 0) | 0;
                        OFS = immediateVal(dfzOfs(EXP) | 0) | 0;
                        vectorSet(FRM, OFS, VAL);
                        opc = KON;
                        continue dispatch;
                    case 91:
                        claim();
                        push(makeImmediate(KON) | 0);
                        push(EXP);
                        push(3);
                        EXP = sequenceAt(EXP, 1) | 0;
                        KON = 92;
                        opc = 82;
                        continue dispatch;
                    case 92:
                        IDX = (immediateVal(pop() | 0) | 0) + 1 | 0;
                        EXP = peek() | 0;
                        LEN = sequenceLength(EXP) | 0;
                        EXP = sequenceAt(EXP, IDX) | 0;
                        if ((IDX | 0) == (LEN | 0)) {
                            zap();
                            KON = immediateVal(pop() | 0) | 0;
                        } else {
                            push(makeImmediate(IDX) | 0);
                        }
                        opc = 82;
                        continue dispatch;
                    case 93:
                        claim();
                        push(makeImmediate(KON) | 0);
                        push(ifsConsequence(EXP) | 0);
                        EXP = ifsPredicate(EXP) | 0;
                        KON = 94;
                        opc = 82;
                        continue dispatch;
                    case 94:
                        if (!(isFalse(VAL) | 0)) {
                            EXP = pop() | 0;
                            KON = immediateVal(pop() | 0) | 0;
                            opc = 82;
                            continue dispatch;
                        }
                        zap();
                        VAL = 2147483647;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 95:
                        claim();
                        push(makeImmediate(KON) | 0);
                        push(EXP);
                        EXP = iffPredicate(EXP) | 0;
                        KON = 96;
                        opc = 82;
                        continue dispatch;
                    case 96:
                        EXP = pop() | 0;
                        EXP = isFalse(VAL) | 0 ? iffAlternative(EXP) | 0 : iffConsequence(EXP) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = 82;
                        continue dispatch;
                    case 97:
                        SIZ = immediateVal(thunkSiz(EXP) | 0) | 0;
                        claimSiz(SIZ);
                        preserveEnv();
                        ENV = extendEnv() | 0;
                        FRM = fillVector(SIZ, 2147483647) | 0;
                        EXP = thunkExp(EXP) | 0;
                        opc = 82;
                        continue dispatch;
                    case 98:
                        EXP = apzOpr(EXP) | 0;
                        switch (tag(EXP) | 0) {
                        case 36:
                            VAL = lookupLocal(EXP) | 0;
                            opc = 100;
                            continue dispatch;
                        case 38:
                            VAL = lookupGlobal(EXP) | 0;
                            opc = 100;
                            continue dispatch;
                        case 18:
                            VAL = capturePrc(EXP) | 0;
                            LEN = immediateVal(prcArgc(VAL) | 0) | 0;
                            if (LEN) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                            claimSiz(SIZ);
                            preserveEnv();
                            FRM = fillVector(SIZ, 2147483647) | 0;
                            ENV = prcEnv(VAL) | 0;
                            EXP = prcBdy(VAL) | 0;
                            opc = 82;
                            continue dispatch;
                        case 34:
                            VAL = capturePrz(EXP) | 0;
                            LEN = immediateVal(przArgc(VAL) | 0) | 0;
                            if (LEN) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                            claimSiz(SIZ);
                            preserveEnv();
                            FRM = fillVector(SIZ, 2147483645) | 0;
                            ENV = przEnv(VAL) | 0;
                            EXP = przBdy(VAL) | 0;
                            opc = 82;
                            continue dispatch;
                        }
                        claim();
                        push(makeImmediate(KON) | 0);
                        KON = 99;
                        opc = 82;
                        continue dispatch;
                    case 99:
                        KON = immediateVal(pop() | 0) | 0;
                        opc = 100;
                        continue dispatch;
                    case 100:
                        switch (tag(VAL) | 0) {
                        case 4:
                            LEN = immediateVal(prcArgc(VAL) | 0) | 0;
                            SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                            if (LEN) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            claimSiz(SIZ);
                            preserveEnv();
                            FRM = fillVector(SIZ, 2147483647) | 0;
                            ENV = prcEnv(VAL) | 0;
                            EXP = prcBdy(VAL) | 0;
                            opc = 82;
                            continue dispatch;
                        case 42:
                            LEN = immediateVal(przArgc(VAL) | 0) | 0;
                            SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                            if (LEN) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            claimSiz(SIZ);
                            preserveEnv();
                            FRM = fillVector(SIZ, 2147483645) | 0;
                            ENV = przEnv(VAL) | 0;
                            EXP = przBdy(VAL) | 0;
                            opc = 82;
                            continue dispatch;
                        case 70:
                            LEN = 0;
                            PAR = __EMPTY_VEC__;
                            opc = nativePtr(VAL) | 0;
                            continue dispatch;
                        case 24:
                            err_invalidParamCount();
                            opc = 141;
                            continue dispatch;
                        }
                        err_invalidOperator(VAL | 0);
                        opc = 141;
                        continue dispatch;
                    case 101    /* --- APPLICATION MULTIPLE ARGUMENTS --- */
                               // OPERATOR
:
                        /* --- APPLICATION MULTIPLE ARGUMENTS --- */
                        // OPERATOR
                        VAL = aplOpr(EXP) | 0;
                        ARG = aplOpd(EXP) | 0;
                        switch (tag(VAL) | 0) {
                        case 36:
                            VAL = lookupLocal(VAL) | 0;
                            opc = 103;
                            continue dispatch;
                        case 38:
                            VAL = lookupGlobal(VAL) | 0;
                            opc = 103;
                            continue dispatch;
                        case 18:
                            VAL = capturePrc(VAL) | 0;
                            LEN = immediateVal(prcArgc(VAL) | 0) | 0;
                            SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                            if ((LEN | 0) != (vectorLength(ARG) | 0)) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            claimSiz(SIZ);
                            PAR = fillVector(SIZ, 2147483647) | 0;
                            opc = 109;
                            continue dispatch;
                        case 34:
                            VAL = capturePrz(VAL) | 0;
                            LEN = immediateVal(przArgc(VAL) | 0) | 0;
                            SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                            if ((LEN | 0) > (vectorLength(ARG) | 0)) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            claimSiz(SIZ);
                            PAR = fillVector(SIZ, 2147483645) | 0;
                            if (LEN) {
                                opc = 112;
                                continue dispatch;
                            }
                            IDX = 0;
                            LEN = 1;
                            opc = 115;
                            continue dispatch;
                        }
                        claim();
                        push(makeImmediate(KON) | 0);
                        push(ARG);
                        EXP = VAL;
                        KON = 102;
                        opc = 82;
                        continue dispatch;
                    case 102:
                        ARG = pop() | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = 103;
                        continue dispatch;
                    case 103:
                        switch (tag(VAL) | 0) {
                        case 4:
                            LEN = immediateVal(prcArgc(VAL) | 0) | 0;
                            SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                            if ((LEN | 0) != (vectorLength(ARG) | 0)) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            claimSiz(SIZ);
                            PAR = fillVector(SIZ, 2147483647) | 0;
                            opc = 109;
                            continue dispatch;
                        case 42:
                            LEN = immediateVal(przArgc(VAL) | 0) | 0;
                            SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                            if ((LEN | 0) > (vectorLength(ARG) | 0)) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            claimSiz(SIZ);
                            PAR = fillVector(SIZ, 2147483645) | 0;
                            if (LEN) {
                                opc = 112;
                                continue dispatch;
                            }
                            IDX = 0;
                            LEN = 1;
                            opc = 115;
                            continue dispatch;
                        case 70:
                            LEN = vectorLength(ARG) | 0;
                            claimSiz(LEN);
                            PAR = fillVector(LEN, 2147483647) | 0;
                            opc = 106;
                            continue dispatch;
                        case 24:
                            LEN = vectorLength(ARG) | 0;
                            if ((LEN | 0) != 1) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            EXP = vectorRef(ARG, 1) | 0;
                            opc = 104;
                            continue dispatch;
                        }
                        err_invalidOperator(VAL | 0);
                        opc = 141;
                        continue dispatch;
                    case 104    // ARGUMENT (CNT)
:
                        switch (// ARGUMENT (CNT)
                            tag(EXP) | 0) {
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
                        case 24:
                        case 42:
                            break;
                        case 22:
                            EXP = quoExpression(EXP) | 0;
                            break;
                        case 36:
                            EXP = lookupLocal(EXP) | 0;
                            break;
                        case 38:
                            EXP = lookupGlobal(EXP) | 0;
                            break;
                        case 18:
                            EXP = capturePrc(EXP) | 0;
                            break;
                        case 34:
                            EXP = capturePrz(EXP) | 0;
                            break;
                        default:
                            claim();
                            push(VAL);
                            KON = 105;
                            opc = 82;
                            continue dispatch;
                        }
                        KON = immediateVal(continuationKon(VAL) | 0) | 0;
                        restoreStack(continuationStk(VAL) | 0);
                        FRM = continuationFrm(VAL) | 0;
                        ENV = continuationEnv(VAL) | 0;
                        VAL = EXP;
                        opc = KON;
                        continue dispatch;
                    case 105:
                        EXP = pop() | 0;
                        KON = immediateVal(continuationKon(EXP) | 0) | 0;
                        restoreStack(continuationStk(EXP) | 0);
                        FRM = continuationFrm(EXP) | 0;
                        ENV = continuationEnv(EXP) | 0;
                        opc = KON;
                        continue dispatch;
                    case 106    // ARGUMENTS (NAT)
:
                        for (// ARGUMENTS (NAT)
                            IDX = 0; (IDX | 0) < (LEN | 0);) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(ARG, IDX) | 0;
                            switch (tag(EXP) | 0) {
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
                            case 24:
                            case 42:
                                break;
                            case 22:
                                EXP = quoExpression(EXP) | 0;
                                break;
                            case 36:
                                EXP = lookupLocal(EXP) | 0;
                                break;
                            case 38:
                                EXP = lookupGlobal(EXP) | 0;
                                break;
                            case 18:
                                EXP = capturePrc(EXP) | 0;
                                break;
                            case 34:
                                EXP = capturePrz(EXP) | 0;
                                break;
                            default:
                                claim();
                                push(makeImmediate(KON) | 0);
                                push(VAL);
                                push(PAR);
                                if ((IDX | 0) == (LEN | 0)) {
                                    //last argument
                                    KON = 108;
                                } else {
                                    push(ARG);
                                    push(makeImmediate(IDX) | 0);
                                    KON = 107;
                                }
                                opc = 82;
                                continue dispatch;
                            }
                            vectorSet(PAR, IDX, EXP);
                        }
                        opc = nativePtr(VAL) | 0;
                        continue dispatch;
                    case 107:
                        IDX = immediateVal(pop() | 0) | 0;
                        ARG = pop() | 0;
                        LEN = vectorLength(ARG) | 0;
                        PAR = pop() | 0;
                        vectorSet(PAR, IDX, VAL);
                        while ((IDX | 0) < (LEN | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(ARG, IDX) | 0;
                            switch (tag(EXP) | 0) {
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
                            case 24:
                            case 42:
                                break;
                            case 22:
                                EXP = quoExpression(EXP) | 0;
                                break;
                            case 36:
                                EXP = lookupLocal(EXP) | 0;
                                break;
                            case 38:
                                EXP = lookupGlobal(EXP) | 0;
                                break;
                            case 18:
                                EXP = capturePrc(EXP) | 0;
                                break;
                            case 34:
                                EXP = capturePrz(EXP) | 0;
                                break;
                            default:
                                push(PAR);
                                if ((IDX | 0) == (LEN | 0)) {
                                    //last argument
                                    KON = 108;
                                } else {
                                    push(ARG);
                                    push(makeImmediate(IDX) | 0);
                                    KON = 107;
                                }
                                opc = 82;
                                continue dispatch;
                            }
                            vectorSet(PAR, IDX, EXP);
                        }
                        VAL = pop() | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = nativePtr(VAL) | 0;
                        continue dispatch;
                    case 108:
                        PAR = pop() | 0;
                        LEN = vectorLength(PAR) | 0;
                        vectorSet(PAR, LEN, VAL);
                        VAL = pop() | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = nativePtr(VAL) | 0;
                        continue dispatch;
                    case 109    // ARGUMENTS (PRC)
:
                        for (// ARGUMENTS (PRC)
                            IDX = 0; (IDX | 0) < (LEN | 0);) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(ARG, IDX) | 0;
                            switch (tag(EXP) | 0) {
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
                            case 24:
                            case 42:
                                break;
                            case 22:
                                EXP = quoExpression(EXP) | 0;
                                break;
                            case 36:
                                EXP = lookupLocal(EXP) | 0;
                                break;
                            case 38:
                                EXP = lookupGlobal(EXP) | 0;
                                break;
                            case 18:
                                EXP = capturePrc(EXP) | 0;
                                break;
                            case 34:
                                EXP = capturePrz(EXP) | 0;
                                break;
                            default:
                                claim();
                                push(makeImmediate(KON) | 0);
                                push(VAL);
                                push(PAR);
                                push(makeImmediate(IDX) | 0);
                                if ((IDX | 0) == (LEN | 0)) {
                                    //last argument
                                    KON = 111;
                                } else {
                                    push(ARG);
                                    KON = 110;
                                }
                                opc = 82;
                                continue dispatch;
                            }
                            vectorSet(PAR, IDX, EXP);
                        }
                        claim();
                        preserveEnv();
                        FRM = PAR;
                        ENV = prcEnv(VAL) | 0;
                        EXP = prcBdy(VAL) | 0;
                        opc = 82;
                        continue dispatch;
                    case 110:
                        ARG = pop() | 0;
                        LEN = vectorLength(ARG) | 0;
                        IDX = immediateVal(pop() | 0) | 0;
                        PAR = pop() | 0;
                        vectorSet(PAR, IDX, VAL);
                        while ((IDX | 0) < (LEN | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(ARG, IDX) | 0;
                            switch (tag(EXP) | 0) {
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
                            case 24:
                            case 42:
                                break;
                            case 22:
                                EXP = quoExpression(EXP) | 0;
                                break;
                            case 36:
                                EXP = lookupLocal(EXP) | 0;
                                break;
                            case 38:
                                EXP = lookupGlobal(EXP) | 0;
                                break;
                            case 18:
                                EXP = capturePrc(EXP) | 0;
                                break;
                            case 34:
                                EXP = capturePrz(EXP) | 0;
                                break;
                            default:
                                push(PAR);
                                push(makeImmediate(IDX) | 0);
                                if ((IDX | 0) == (LEN | 0)) {
                                    //last argument
                                    KON = 111;
                                } else {
                                    push(ARG);
                                    KON = 110;
                                }
                                opc = 82;
                                continue dispatch;
                            }
                            vectorSet(PAR, IDX, EXP);
                        }
                        VAL = pop() | 0;
                        preserveEnv_peek();
                        FRM = PAR;
                        ENV = prcEnv(VAL) | 0;
                        EXP = prcBdy(VAL) | 0;
                        opc = 82;
                        continue dispatch;
                    case 111:
                        IDX = immediateVal(pop() | 0) | 0;
                        PAR = pop() | 0;
                        EXP = pop() | 0;
                        vectorSet(PAR, IDX, VAL);
                        preserveEnv_peek();
                        FRM = PAR;
                        ENV = prcEnv(EXP) | 0;
                        EXP = prcBdy(EXP) | 0;
                        opc = 82;
                        continue dispatch;
                    case 112    // ARGUMENTS (PRZ)
:
                        for (// ARGUMENTS (PRZ)
                            IDX = 0; (IDX | 0) < (LEN | 0);) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(ARG, IDX) | 0;
                            switch (tag(EXP) | 0) {
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
                            case 24:
                            case 42:
                                break;
                            case 22:
                                EXP = quoExpression(EXP) | 0;
                                break;
                            case 36:
                                EXP = lookupLocal(EXP) | 0;
                                break;
                            case 38:
                                EXP = lookupGlobal(EXP) | 0;
                                break;
                            case 18:
                                EXP = capturePrc(EXP) | 0;
                                break;
                            case 34:
                                EXP = capturePrz(EXP) | 0;
                                break;
                            default:
                                claim();
                                push(makeImmediate(KON) | 0);
                                push(VAL);
                                push(PAR);
                                push(makeImmediate(IDX) | 0);
                                if ((IDX | 0) == (LEN | 0)) {
                                    if (//last mandatory argument
                                        (IDX | 0) == (vectorLength(ARG) | 0))
                                        //last argument
                                        KON = 119;
                                    else {
                                        push(ARG);
                                        KON = 114;
                                    }
                                } else {
                                    push(makeImmediate(LEN) | 0);
                                    push(ARG);
                                    KON = 113;
                                }
                                opc = 82;
                                continue dispatch;
                            }
                            vectorSet(PAR, IDX, EXP);
                        }
                        if ((IDX | 0) == (vectorLength(ARG) | 0)) {
                            //no more arguments
                            claim();
                            preserveEnv();
                            FRM = PAR;
                            ENV = przEnv(VAL) | 0;
                            EXP = przBdy(VAL) | 0;
                            opc = 82;
                            continue dispatch;
                        }
                        LEN = IDX + 1 | 0;
                        opc = 115;
                        continue dispatch;
                    case 113:
                        ARG = pop() | 0;
                        LEN = immediateVal(pop() | 0) | 0;
                        IDX = immediateVal(pop() | 0) | 0;
                        PAR = pop() | 0;
                        vectorSet(PAR, IDX, VAL);
                        while ((IDX | 0) < (LEN | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(ARG, IDX) | 0;
                            switch (tag(EXP) | 0) {
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
                            case 24:
                            case 42:
                                break;
                            case 22:
                                EXP = quoExpression(EXP) | 0;
                                break;
                            case 36:
                                EXP = lookupLocal(EXP) | 0;
                                break;
                            case 38:
                                EXP = lookupGlobal(EXP) | 0;
                                break;
                            case 18:
                                EXP = capturePrc(EXP) | 0;
                                break;
                            case 34:
                                EXP = capturePrz(EXP) | 0;
                                break;
                            default:
                                push(PAR);
                                push(makeImmediate(IDX) | 0);
                                if ((IDX | 0) == (LEN | 0)) {
                                    if (//last mandatory argument
                                        (IDX | 0) == (vectorLength(ARG) | 0))
                                        //last argument
                                        KON = 119;
                                    else {
                                        push(ARG);
                                        KON = 114;
                                    }
                                } else {
                                    push(makeImmediate(LEN) | 0);
                                    push(ARG);
                                    KON = 113;
                                }
                                opc = 82;
                                continue dispatch;
                            }
                            vectorSet(PAR, IDX, EXP);
                        }
                        if ((IDX | 0) == (vectorLength(ARG) | 0)) {
                            //no more arguments
                            VAL = pop() | 0;
                            preserveEnv_peek();
                            FRM = PAR;
                            ENV = przEnv(VAL) | 0;
                            EXP = przBdy(VAL) | 0;
                            opc = 82;
                            continue dispatch;
                        }
                        LEN = IDX + 1 | 0;
                        opc = 116;
                        continue dispatch;
                    case 114:
                        ARG = pop() | 0;
                        IDX = immediateVal(pop() | 0) | 0;
                        PAR = pop() | 0;
                        vectorSet(PAR, IDX, VAL);
                        LEN = IDX + 1 | 0;
                        opc = 116;
                        continue dispatch;
                    case 115:
                        SIZ = vectorLength(ARG) | 0;
                        while ((IDX | 0) < (SIZ | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(ARG, IDX) | 0;
                            claim();
                            switch (tag(EXP) | 0) {
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
                            case 24:
                            case 42:
                                break;
                            case 22:
                                EXP = quoExpression(EXP) | 0;
                                break;
                            case 36:
                                EXP = lookupLocal(EXP) | 0;
                                break;
                            case 38:
                                EXP = lookupGlobal(EXP) | 0;
                                break;
                            case 18:
                                EXP = capturePrc(EXP) | 0;
                                break;
                            case 34:
                                EXP = capturePrz(EXP) | 0;
                                break;
                            default:
                                push(makeImmediate(KON) | 0);
                                push(VAL);
                                push(PAR);
                                push(makeImmediate(LEN) | 0);
                                if ((IDX | 0) == (SIZ | 0)) {
                                    KON = 118;
                                } else {
                                    push(makeImmediate(IDX) | 0);
                                    push(ARG);
                                    KON = 117;
                                }
                                opc = 82;
                                continue dispatch;
                            }
                            TMP = vectorRef(PAR, LEN) | 0;
                            vectorSet(PAR, LEN, makePair(EXP, TMP) | 0);
                        }
                        TMP = vectorRef(PAR, LEN) | 0;
                        vectorSet(PAR, LEN, reverse(TMP) | 0);
                        claim();
                        preserveEnv();
                        FRM = PAR;
                        ENV = przEnv(VAL) | 0;
                        EXP = przBdy(VAL) | 0;
                        opc = 82;
                        continue dispatch;
                    case 116:
                        SIZ = vectorLength(ARG) | 0;
                        while ((IDX | 0) < (SIZ | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(ARG, IDX) | 0;
                            claim();
                            switch (tag(EXP) | 0) {
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
                            case 24:
                            case 42:
                                break;
                            case 22:
                                EXP = quoExpression(EXP) | 0;
                                break;
                            case 36:
                                EXP = lookupLocal(EXP) | 0;
                                break;
                            case 38:
                                EXP = lookupGlobal(EXP) | 0;
                                break;
                            case 18:
                                EXP = capturePrc(EXP) | 0;
                                break;
                            case 34:
                                EXP = capturePrz(EXP) | 0;
                                break;
                            default:
                                push(PAR);
                                push(makeImmediate(LEN) | 0);
                                if ((IDX | 0) == (SIZ | 0)) {
                                    KON = 118;
                                } else {
                                    push(makeImmediate(IDX) | 0);
                                    push(ARG);
                                    KON = 117;
                                }
                                opc = 82;
                                continue dispatch;
                            }
                            TMP = vectorRef(PAR, LEN) | 0;
                            vectorSet(PAR, LEN, makePair(EXP, TMP) | 0);
                        }
                        TMP = vectorRef(PAR, LEN) | 0;
                        vectorSet(PAR, LEN, reverse(TMP) | 0);
                        VAL = pop() | 0;
                        preserveEnv_peek();
                        FRM = PAR;
                        ENV = przEnv(VAL) | 0;
                        EXP = przBdy(VAL) | 0;
                        opc = 82;
                        continue dispatch;
                    case 117:
                        ARG = pop() | 0;
                        IDX = immediateVal(pop() | 0) | 0;
                        LEN = immediateVal(pop() | 0) | 0;
                        PAR = pop() | 0;
                        VAL = makePair(VAL, vectorRef(PAR, LEN) | 0) | 0;
                        vectorSet(PAR, LEN, VAL);
                        opc = 116;
                        continue dispatch;
                    case 118:
                        IDX = immediateVal(pop() | 0) | 0;
                        PAR = pop() | 0;
                        EXP = pop() | 0;
                        VAL = makePair(VAL, vectorRef(PAR, IDX) | 0) | 0;
                        vectorSet(PAR, IDX, reverse(VAL) | 0);
                        preserveEnv_peek();
                        FRM = PAR;
                        ENV = przEnv(EXP) | 0;
                        EXP = przBdy(EXP) | 0;
                        opc = 82;
                        continue dispatch;
                    case 119:
                        IDX = immediateVal(pop() | 0) | 0;
                        PAR = pop() | 0;
                        EXP = pop() | 0;
                        vectorSet(PAR, IDX, VAL);
                        preserveEnv_peek();
                        FRM = PAR;
                        ENV = przEnv(EXP) | 0;
                        EXP = przBdy(EXP) | 0;
                        opc = 82;
                        continue dispatch;
                    case 120:
                        FRM = pop() | 0;
                        ENV = pop() | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 121    // **********************************************************************
                               // *************************** NATIVES PT2 ******************************
                               // **********************************************************************
:
                        while (// **********************************************************************
                            // *************************** NATIVES PT2 ******************************
                            // **********************************************************************
                            (IDX | 0) < (LEN | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(PAR, IDX) | 0;
                            switch (tag(EXP) | 0) {
                            case 69:
                                FLT = fround(FLT + fround(immediateVal(EXP) | 0));
                                break;
                            case 1:
                                FLT = fround(FLT + fround(floatNumber(EXP)));
                                break;
                            default:
                                err_invalidArgument(EXP | 0);
                                opc = 141;
                                continue dispatch;
                            }
                        }
                        claim();
                        VAL = makeFloat(FLT) | 0;
                        opc = KON;
                        continue dispatch;
                    case 122:
                        while ((IDX | 0) < (LEN | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(PAR, IDX) | 0;
                            switch (tag(EXP) | 0) {
                            case 69:
                                FLT = fround(FLT - fround(immediateVal(EXP) | 0));
                                break;
                            case 1:
                                FLT = fround(FLT - fround(floatNumber(EXP)));
                                break;
                            default:
                                err_invalidArgument(EXP | 0);
                                opc = 141;
                                continue dispatch;
                            }
                        }
                        claim();
                        VAL = makeFloat(FLT) | 0;
                        opc = KON;
                        continue dispatch;
                    case 123:
                        while ((IDX | 0) < (LEN | 0)) {
                            IDX = IDX + 1 | 0;
                            EXP = vectorRef(PAR, IDX) | 0;
                            switch (tag(EXP) | 0) {
                            case 69:
                                FLT = fround(FLT * fround(immediateVal(EXP) | 0));
                                break;
                            case 1:
                                FLT = fround(FLT * fround(floatNumber(EXP)));
                                break;
                            default:
                                err_invalidArgument(EXP | 0);
                                opc = 141;
                                continue dispatch;
                            }
                        }
                        claim();
                        VAL = makeFloat(FLT) | 0;
                        opc = KON;
                        continue dispatch;
                    case 124:
                        LEN = immediateVal(pop() | 0) | 0;
                        claimSiz(imul(3, LEN) | 0);
                        VAL = makePair(VAL, 2147483645) | 0;
                        for (; LEN; LEN = LEN - 1 | 0)
                            VAL = makePair(pop() | 0, VAL) | 0;
                        KON = immediateVal(pop() | 0) | 0;
                        opc = KON;
                        continue dispatch;
                    case 125:
                        LST = pop() | 0;
                        EXP = pop() | 0;
                        LEN = immediateVal(peek() | 0) | 0;
                        LEN = LEN + 1 | 0;
                        poke(VAL);
                        push(makeImmediate(LEN) | 0);
                        claim();
                        VAL = EXP;
                        ARG = makePair(pairCar(LST) | 0, 2147483645) | 0;
                        LST = pairCdr(LST) | 0;
                        if (isNull(LST) | 0) {
                            KON = 124;
                        } else {
                            push(VAL);
                            push(LST);
                            KON = 125;
                        }
                        opc = 126;
                        continue dispatch;
                    case 126:
                        switch (tag(VAL) | 0) {
                        case 4:
                            LEN = immediateVal(prcArgc(VAL) | 0) | 0;
                            SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                            claimSiz(SIZ);
                            preserveEnv();
                            FRM = fillVector(SIZ, 2147483647) | 0;
                            for (IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                                if (!(isPair(ARG) | 0)) {
                                    err_invalidParamCount();
                                    opc = 141;
                                    continue dispatch;
                                }
                                TMP = pairCar(ARG) | 0;
                                ARG = pairCdr(ARG) | 0;
                                vectorSet(FRM, IDX, TMP);
                            }
                            if (!(isNull(ARG) | 0)) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            ENV = prcEnv(VAL) | 0;
                            EXP = prcBdy(VAL) | 0;
                            opc = 82;
                            continue dispatch;
                        case 42:
                            LEN = immediateVal(przArgc(VAL) | 0) | 0;
                            SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                            claimSiz(SIZ);
                            preserveEnv();
                            FRM = fillVector(SIZ, 2147483647) | 0;
                            for (IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                                if (!(isPair(ARG) | 0)) {
                                    err_invalidParamCount();
                                    opc = 141;
                                    continue dispatch;
                                }
                                TMP = pairCar(ARG) | 0;
                                ARG = pairCdr(ARG) | 0;
                                vectorSet(FRM, IDX, TMP);
                            }
                            vectorSet(FRM, IDX, ARG);
                            ENV = przEnv(VAL) | 0;
                            EXP = przBdy(VAL) | 0;
                            opc = 82;
                            continue dispatch;
                        case 70:
                            for (LEN = 0, LST = ARG; isPair(LST) | 0; LEN = LEN + 1 | 0)
                                LST = pairCdr(LST) | 0;
                            if (!(isNull(LST) | 0)) {
                                err_invalidArgument(ARG | 0);
                                opc = 141;
                                continue dispatch;
                            }
                            claimSiz(LEN);
                            PAR = makeVector(LEN) | 0;
                            for (IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                                TMP = pairCar(ARG) | 0;
                                ARG = pairCdr(ARG) | 0;
                                vectorSet(PAR, IDX, TMP);
                            }
                            opc = nativePtr(VAL) | 0;
                            continue dispatch;
                        case 24:
                            if (!(isPair(ARG) | 0)) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            if (!(isNull(pairCdr(ARG) | 0) | 0)) {
                                err_invalidParamCount();
                                opc = 141;
                                continue dispatch;
                            }
                            KON = immediateVal(continuationKon(VAL) | 0) | 0;
                            restoreStack(continuationStk(VAL) | 0);
                            FRM = continuationFrm(VAL) | 0;
                            ENV = continuationStk(VAL) | 0;
                            VAL = pairCar(ARG) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        err_invalidOperator(VAL | 0);
                        opc = 141;
                        continue dispatch;
                    case 127:
                        EXP = VAL;
                        push(ENV);
                        push(FRM);
                        FRM = GLB;
                        ENV = __EMPTY_VEC__;
                        KON = 120;
                        opc = 82;
                        continue dispatch;
                    case 128:
                        EXP = VAL;
                        KON = 129;
                        opc = 53;
                        continue dispatch;
                    case 129:
                        EXP = VAL;
                        push(ENV);
                        push(FRM);
                        FRM = GLB;
                        ENV = __EMPTY_VEC__;
                        KON = 120;
                        opc = 82;
                        continue dispatch;
                    case 130:
                        TMP = tag(EXP) | 0;
                        if ((TMP | 0) != (tag(ARG) | 0)) {
                            VAL = 2147483641;
                            opc = KON;
                            continue dispatch;
                        }
                        switch (TMP | 0) {
                        case 1:
                            opc = 131;
                            continue dispatch;
                        case 5:
                            opc = 132;
                            continue dispatch;
                        case 0:
                            opc = 133;
                            continue dispatch;
                        case 2:
                            opc = 135;
                            continue dispatch;
                        }
                        VAL = (ARG | 0) == (EXP | 0) ? 2147483643 : 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 131:
                        VAL = fround(floatNumber(EXP)) == fround(floatNumber(ARG)) ? 2147483643 : 2147483641;
                        opc = KON;
                        continue dispatch;
                    case 132:
                        LEN = textLength(ARG) | 0;
                        if ((textLength(EXP) | 0) != (LEN | 0)) {
                            VAL = 2147483641;
                            opc = KON;
                            continue dispatch;
                        }
                        while (LEN) {
                            LEN = LEN - 1 | 0;
                            if ((textGetChar(ARG, LEN) | 0) != (textGetChar(EXP, LEN) | 0)) {
                                VAL = 2147483641;
                                opc = KON;
                                continue dispatch;
                            }
                        }
                        VAL = 2147483643;
                        opc = KON;
                        continue dispatch;
                    case 133:
                        claim();
                        push(pairCdr(EXP) | 0);
                        push(pairCdr(ARG) | 0);
                        EXP = pairCar(EXP) | 0;
                        ARG = pairCar(ARG) | 0;
                        push(makeImmediate(KON) | 0);
                        KON = 134;
                        opc = 130;
                        continue dispatch;
                    case 134:
                        KON = immediateVal(pop() | 0) | 0;
                        if ((VAL | 0) == 2147483641) {
                            zap();
                            zap();
                            opc = KON;
                            continue dispatch;
                        }
                        ARG = pop() | 0;
                        EXP = pop() | 0;
                        opc = 130;
                        continue dispatch;
                    case 135:
                        LEN = vectorLength(ARG) | 0;
                        if ((vectorLength(EXP) | 0) != (LEN | 0)) {
                            VAL = 2147483641;
                            opc = KON;
                            continue dispatch;
                        }
                        if (!LEN) {
                            VAL = 2147483643;
                            opc = KON;
                            continue dispatch;
                        }
                        if ((LEN | 0) > 1) {
                            claim();
                            push(makeImmediate(KON) | 0);
                            push(EXP);
                            push(ARG);
                            push(3);
                            KON = 136;
                        }
                        ARG = vectorRef(ARG, 1) | 0;
                        EXP = vectorRef(EXP, 1) | 0;
                        opc = 130;
                        continue dispatch;
                    case 136:
                        if ((VAL | 0) == 2147483641) {
                            zap();
                            zap();
                            zap();
                            KON = immediateVal(pop() | 0) | 0;
                            opc = KON;
                            continue dispatch;
                        }
                        IDX = immediateVal(pop() | 0) | 0;
                        ARG = pop() | 0;
                        EXP = peek() | 0;
                        IDX = IDX + 1 | 0;
                        if ((IDX | 0) == (vectorLength(ARG) | 0)) {
                            zap();
                            KON = immediateVal(pop() | 0) | 0;
                        } else {
                            push(ARG);
                            push(makeImmediate(IDX) | 0);
                            KON = 136;
                        }
                        ARG = vectorRef(ARG, IDX) | 0;
                        EXP = vectorRef(EXP, IDX) | 0;
                        opc = 130;
                        continue dispatch;
                    case 137    // **********************************************************************
                               // ****************************** REPL **********************************
                               // **********************************************************************
:
                        // **********************************************************************
                        // ****************************** REPL **********************************
                        // **********************************************************************
                        dctCheckpoint();
                        KON = 138;
                        promptInput();
                        break dispatch;
                    case 138:
                        EXP = VAL;
                        KON = 139;
                        opc = 53;
                        continue dispatch;
                    case 139:
                        EXP = VAL;
                        KON = 140;
                        opc = 82;
                        continue dispatch;
                    case 140:
                        printOutput(VAL | 0);
                        opc = 137;
                        continue dispatch;
                    case 141:
                        FRM = GLB;
                        ENV = 2147483645;
                        dctRollback();
                        emptyStk();
                        opc = 137;
                        continue dispatch;
                    }
                }
        }
        return {
            /* -- EXPORTS -- */
            /**************/
            /**** MAIN ****/
            /**************/
            init: init,
            claim: claim,
            claimSiz: claimSiz,
            Slip_REPL: Slip_REPL,
            inputReady: inputReady,
            /**************/
            /*** MEMORY ***/
            /**************/
            available: available,
            collectGarbage: collectGarbage,
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
            makeImmediate: makeImmediate,
            immediateVal: immediateVal,
            isNumber: isNumber,
            //characters
            makeChar: makeChar,
            charCode: charCode,
            isChar: isChar,
            //pairs
            pairCar: pairCar,
            pairCdr: pairCdr,
            pairSetCar: pairSetCar,
            pairSetCdr: pairSetCdr,
            isPair: isPair,
            //procedures
            prcArgc: prcArgc,
            prcFrmSiz: prcFrmSiz,
            prcBdy: prcBdy,
            prcEnv: prcEnv,
            przArgc: przArgc,
            przFrmSiz: przFrmSiz,
            przBdy: przBdy,
            przEnv: przEnv,
            isPrc: isPrc,
            isPrz: isPrz,
            //vectors
            fillVector: fillVector,
            vectorRef: vectorRef,
            vectorSet: vectorSet,
            vectorLength: vectorLength,
            isVector: isVector,
            //floats
            makeFloat: makeFloat,
            floatNumber: floatNumber,
            isFloat: isFloat,
            //string
            makeString: makeString,
            stringAt: textGetChar,
            stringSet: textSetChar,
            stringLength: textLength,
            isString: isString,
            //symbols
            makeSymbol: makeSymbol,
            symbolAt: textGetChar,
            symbolSet: textSetChar,
            symbolLength: textLength,
            isSymbol: isSymbol,
            //natives
            nativePtr: nativePtr,
            isNative: isNative,
            //sequences
            sequenceAt: sequenceAt,
            sequenceSet: sequenceSet,
            sequenceLength: sequenceLength,
            isSequence: isSequence,
            //single if-statements
            ifsPredicate: ifsPredicate,
            ifsConsequence: ifsConsequence,
            isIfs: isIfs,
            //full if-statements
            iffPredicate: iffPredicate,
            iffConsequence: iffConsequence,
            iffAlternative: iffAlternative,
            isIff: isIff,
            //quotes
            quoExpression: quoExpression,
            isQuo: isQuo,
            //thunks
            thunkExp: thunkExp,
            thunkSiz: thunkSiz,
            isThunk: isThunk,
            //lambdas
            lmbFrmSiz: lmbFrmSiz,
            lmbArgc: lmbArgc,
            lmbBdy: lmbBdy,
            isLmb: isLmb,
            lmzFrmSiz: lmzFrmSiz,
            lmzArgc: lmzArgc,
            lmzBdy: lmzBdy,
            isLmz: isLmz,
            //variable definitions
            dfvOfs: dfvOfs,
            dfvVal: dfvVal,
            isDfv: isDfv,
            //function definitions
            dffBdy: dffBdy,
            dffArgc: dffArgc,
            dffFrmSiz: dffFrmSiz,
            dffOfs: dffOfs,
            dfzBdy: dfzBdy,
            dfzArgc: dfzArgc,
            dfzFrmSiz: dfzFrmSiz,
            dfzOfs: dfzOfs,
            isDff: isDff,
            isDfz: isDfz,
            //assignments
            sglScp: sglScp,
            sglOfs: sglOfs,
            sglVal: sglVal,
            slcOfs: slcOfs,
            slcVal: slcVal,
            isSgl: isSgl,
            isSlc: isSlc,
            //variables
            localOfs: localOfs,
            globalScp: globalScp,
            globalOfs: globalOfs,
            isLocal: isLocal,
            isGlobal: isGlobal,
            //applications
            apzOpr: apzOpr,
            isApz: isApz,
            aplOpr: aplOpr,
            aplOpd: aplOpd,
            isApl: isApl,
            /**************/
            /**** POOL ****/
            /**************/
            enterPool: enterPool,
            poolAt: poolAt
        };
    }
    function READER() {
        'use strict';
        var program, position, hold;
        var makeString, stringSet, makeNumber, makeFloat, enterPool, claimSiz, claim;
        function load(str) {
            program = str;
            position = 0;
        }
        function link(asm$2, pool$2) {
            makeString = asm$2.makeString;
            stringSet = asm$2.stringSet;
            makeNumber = asm$2.makeNumber;
            makeFloat = asm$2.makeFloat;
            claimSiz = asm$2.claimSiz;
            claim = asm$2.claim;
            enterPool = pool$2.enterPool;
        }
        function isTerminator(c) {
            switch (c) {
            case ' ':
            case '':
            case '\n':
            case '\t':
            case '\'':
            case '"':
            case ')':
            case '(':
            case ';':
            case '.':
            case '\r':
                return true;
            default:
                return false;
            }
        }
        function isNumber(c) {
            return !(c < '0' || c > '9');
        }
        function skipWhiteSpace() {
            while (true) {
                switch (program.charAt(position)) {
                case ';':
                    var current;
                    while ((current = program.charAt(++position)) != '\n' && current != '\r' && current != '');
                case '\n':
                case '\r':
                case '\t':
                case ' ':
                    ++position;
                    break;
                default:
                    return;
                }
            }
        }
        function skip() {
            skipWhiteSpace();
            ++position;
        }
        function peek() {
            skipWhiteSpace();
            return program.charCodeAt(position);
        }
        function read() {
            skipWhiteSpace();
            return program.charCodeAt(position++);
        }
        function readSymbol() {
            hold = position;
            while (!isTerminator(program.charAt(++position)));
            return enterPool(program.substring(hold, position));
        }
        function extractString(from, to) {
            var len = to - from;
            claimSiz(len);
            var str = makeString(len);
            for (var i = 0; i < len; ++i)
                stringSet(str, i, program.charCodeAt(from + i));
            return str;
        }
        function readString() {
            hold = position;
            while (program.charAt(++position) != '"');
            return extractString(hold + 1, position++);
        }
        function readNumber() {
            hold = position;
            switch (//step 1: check for sign
                program.charAt(position)) {
            case '+':
            case '-':
                if (!isNumber(program.charAt(++position))) {
                    --position;
                    //oops, go back
                    return readSymbol();
                }
            }
            while (//step 2: parse number in front of .
                isNumber(program.charAt(++position)));
            if (//step 3: parse number after .
                program.charAt(position) === '.') {
                while (isNumber(program.charAt(++position)));
                claim();
                return makeFloat(parseFloat(program.substring(hold, position)));
            }
            return makeNumber(parseInt(program.substring(hold, position)));
        }
        return {
            load: load,
            skip: skip,
            peek: peek,
            read: read,
            readSymbol: readSymbol,
            readString: readString,
            readNumber: readNumber,
            link: link
        };
    }
    function SYMBOLS() {
        'use strict';
        var __POOL__ = Object.create(null);
        var makeSymbol, symbolSet, symbolAt, symbolLength, addToPool, poolAt;
        function link(asm$2) {
            makeSymbol = asm$2.makeSymbol;
            symbolSet = asm$2.symbolSet;
            symbolAt = asm$2.symbolAt;
            symbolLength = asm$2.symbolLength;
            addToPool = asm$2.enterPool;
            poolAt = asm$2.poolAt;
        }
        function buildSymbol(txt) {
            var len = txt.length;
            var sym = makeSymbol(len);
            for (var i = 0; i < len; ++i)
                symbolSet(sym, i, txt.charCodeAt(i));
            return sym;
        }
        function symbolText(chk) {
            var len = symbolLength(chk);
            var arr = new Array(len);
            for (var i = 0; i < len; ++i)
                arr[i] = symbolAt(chk, i);
            return String.fromCharCode.apply(null, arr);
        }
        function enterPool(str) {
            var idx;
            if (//already in pool
                idx = __POOL__[str])
                return poolAt(idx);
            var //not in pool yet
            sym = buildSymbol(str);
            idx = addToPool(sym);
            __POOL__[str] = idx;
            return sym;
        }
        function symbol(str) {
            return function () {
                return enterPool(str);
            };
        }
        return {
            enterPool: enterPool,
            loadCcc: symbol('call/cc'),
            loadAvl: symbol('available'),
            loadCol: symbol('collect'),
            loadClk: symbol('clock'),
            loadSlp: symbol('sleep'),
            loadRnd: symbol('random'),
            loadErr: symbol('error'),
            loadSre: symbol('string-ref'),
            loadSse: symbol('string-set!'),
            loadSle: symbol('string-length'),
            loadIpa: symbol('pair?'),
            loadInu: symbol('null?'),
            loadIsy: symbol('symbol?'),
            loadIve: symbol('vector?'),
            loadIst: symbol('string?'),
            loadQuo: symbol('quote'),
            loadIff: symbol('if'),
            loadDef: symbol('define'),
            loadLmb: symbol('lambda'),
            loadSet: symbol('set!'),
            loadBeg: symbol('begin'),
            loadPls: symbol('+'),
            loadMns: symbol('-'),
            loadMul: symbol('*'),
            loadDiv: symbol('/'),
            loadCns: symbol('cons'),
            loadCar: symbol('car'),
            loadCdr: symbol('cdr'),
            loadSca: symbol('set-car!'),
            loadScd: symbol('set-cdr!'),
            loadLst: symbol('list'),
            loadSma: symbol('<'),
            loadLrg: symbol('>'),
            loadLeq: symbol('>='),
            loadSeq: symbol('<='),
            loadNeq: symbol('='),
            loadAss: symbol('assoc'),
            loadMap: symbol('map'),
            loadVec: symbol('vector'),
            loadVcm: symbol('make-vector'),
            loadVcr: symbol('vector-ref'),
            loadVcs: symbol('vector-set!'),
            loadVcl: symbol('vector-length'),
            loadEql: symbol('equal?'),
            loadEqu: symbol('eq?'),
            loadEva: symbol('eval'),
            loadRea: symbol('read'),
            loadLoa: symbol('load'),
            loadApl: symbol('apply'),
            loadDis: symbol('display'),
            loadNew: symbol('newline'),
            loadRst: symbol('reset'),
            link: link
        };
    }
    function TIMER() {
        'use strict';
        var __START__;
        function reset() {
            __START__ = new Date().getTime();
        }
        function getTime() {
            var current = new Date().getTime();
            return current - __START__;
        }
        return {
            getTime: getTime,
            reset: reset
        };
    }
    function PRINTER() {
        'use strict';
        var getTag, numberVal, floatNumber, charCode, stringText, symbolLength, symbolAt, pairCar, pairCdr, isPair, isNull, vectorRef, vectorLength, ag;
        function link(asm$2) {
            getTag = asm$2.tag;
            numberVal = asm$2.numberVal;
            floatNumber = asm$2.floatNumber;
            charCode = asm$2.charCode;
            stringText = asm$2.stringText;
            symbolLength = asm$2.symbolLength;
            symbolAt = asm$2.symbolAt;
            pairCar = asm$2.pairCar;
            pairCdr = asm$2.pairCdr;
            isPair = asm$2.isPair;
            isNull = asm$2.isNull;
            vectorRef = asm$2.vectorRef;
            vectorLength = asm$2.vectorLength;
            ag = asm$2;
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
                return '"' + stringText(exp) + '"';
            case 1:
                return floatNumber(exp).toString();
            case 70:
                return '#<native procedure>';
            case 24:
                return '#<continuation>';
            case 3:
                return symbolText(exp);
            case 4:
            case 42:
                return '#<procedure>';
            case 36:
                return '#<local variable @ offset ' + printExp(ag.localOfs(exp)) + '>';
            case 38:
                return '#<variable @ scope-level/offset: ' + printExp(ag.globalScp(exp)) + '/' + printExp(ag.globalOfs(exp)) + '>';
            case 6:
                return '#<sequence ' + printSequence(exp) + '>';
            case 8:
                return '#<simple-if ' + printExp(ag.ifsPredicate(exp)) + ' ' + printExp(ag.ifsConsequence(exp)) + '>';
            case 10:
                return '#<full-if ' + printExp(ag.iffPredicate(exp)) + ' ' + printExp(ag.iffConsequence(exp)) + ' ' + printExp(ag.iffAlternative(exp)) + '>';
            case 32:
                return '#<thunk (size: ' + printExp(ag.thunkSiz(exp)) + '; body: ' + printExp(ag.thunkExp(exp)) + ')>';
            case 22:
                return '#<quote ' + printExp(ag.quoExpression(exp)) + '>';
            case 18:
                return '#<lambda (argument count: ' + printExp(ag.lmbArgc(exp)) + '; frame size: ' + printExp(ag.lmbFrmSiz(exp)) + '; body: ' + printExp(ag.lmbBdy(exp)) + ')>';
            case 34:
                return '#<lambda (argument* count: ' + printExp(ag.lmzArgc(exp)) + '; frame size: ' + printExp(ag.lmzFrmSiz(exp)) + '; body: ' + printExp(ag.lmzBdy(exp)) + ')>';
            case 12:
                return '#<variable definition @ offset ' + printExp(ag.dfvOfs(exp)) + ' (value: ' + printExp(ag.dfvVal(exp)) + ')>';
            case 14:
                return '#<function definition @ offset ' + printExp(ag.dffOfs(exp)) + ' (argument count: ' + printExp(ag.dffArgc(exp)) + '; frame size:  ' + printExp(ag.dffFrmSiz(exp)) + '; body:  ' + printExp(ag.dffBdy(exp)) + ')>';
            case 30:
                return '#<function definition @ offset ' + printExp(ag.dfzOfs(exp)) + ' (argument* count: ' + printExp(ag.dfzArgc(exp)) + '; frame size:  ' + printExp(ag.dfzFrmSiz(exp)) + '; body:  ' + printExp(ag.dfzBdy(exp)) + ')>';
            case 20:
                return '#<assignment @ scope-level/offset: ' + printExp(ag.sglScp(exp)) + '/' + printExp(ag.sglOfs(exp)) + ' (value: ' + printExp(ag.sglVal(exp)) + ')>';
            case 40:
                return '#<local assignment @ offset: ' + printExp(ag.slcOfs(exp)) + ' (value: ' + printExp(ag.slcVal(exp)) + ')>';
            case 44:
                return '#<application (zero argument): ' + printExp(ag.apzOpr(exp)) + '>';
            case 16:
                return '#<application ' + printExp(ag.aplOpr(exp)) + ' @ ' + printExp(ag.aplOpd(exp)) + '>';
            default:
                return '<expression (tag: ' + tag + ')>';
            }
        }
        var printSequence = function (exp) {
            var str = '', idx = 1;
            var len = ag.sequenceLength(exp);
            while (idx < len)
                str += printExp(ag.sequenceAt(exp, idx++)) + ' ';
            str += printExp(ag.sequenceAt(exp, idx));
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
                str += printExp(vectorRef(exp, idx)) + ' ';
            }
            str += printExp(vectorRef(exp, len)) + ')';
            return str;
        }
        return {
            printExp: printExp,
            link: link
        };
    }
    function ERRORS() {
        'use strict';
        var report, printExp;
        function link(io$2, printer$2) {
            report = io$2.printError;
            printExp = printer$2.printExp;
        }
        function invalidLength(len) {
            report('invalid length: ' + len);
        }
        function invalidRange(idx, from, to) {
            report('expected index in range [' + from + ', ' + to + '], given ' + idx);
        }
        function expectedRBR(code) {
            report('expected ), given ' + String.fromCharCode(code));
        }
        function invalidSyntax() {
            report('invalid syntax');
        }
        function invalidParameter() {
            report('invalid parameter');
        }
        function invalidSequence() {
            report('invalid sequence');
        }
        function invalidQuote() {
            report('invalid quote');
        }
        function invalidIf() {
            report('invalid if');
        }
        function invalidDefine() {
            report('invalid definition');
        }
        function invalidAssignment() {
            report('invalid assignment');
        }
        function invalidLambda() {
            report('invalid lambda');
        }
        function invalidApplication() {
            report('invalid application');
        }
        function globalOverflow() {
            report('too many global variables');
        }
        function undefinedVariable(exp) {
            report('undefined variable: ' + printExp(exp));
        }
        function invalidExpression(exp) {
            report('invalid expression:' + printExp(exp));
        }
        function invalidOperator() {
            report('invalid operator');
        }
        function invalidParamCount() {
            report('invalid parameter count');
        }
        function invalidArgument(exp) {
            report('invalid argument: ' + printExp(exp));
        }
        function fatalMemory() {
            report('insufficient memory!');
            throw 'SLIP ERROR:: out of memory';
        }
        return {
            expectedRBR: expectedRBR,
            invalidSyntax: invalidSyntax,
            invalidSequence: invalidSequence,
            invalidQuote: invalidQuote,
            invalidIf: invalidIf,
            invalidDefine: invalidDefine,
            invalidAssignment: invalidAssignment,
            invalidLambda: invalidLambda,
            invalidApplication: invalidApplication,
            undefinedVariable: undefinedVariable,
            invalidOperator: invalidOperator,
            invalidParamCount: invalidParamCount,
            invalidParameter: invalidParameter,
            invalidArgument: invalidArgument,
            invalidExpression: invalidExpression,
            invalidLength: invalidLength,
            invalidRange: invalidRange,
            globalOverflow: globalOverflow,
            fatalMemory: fatalMemory,
            link: link
        };
    }
    function IO() {
        'use strict';
        var readExpression, printline, printOut, plog, ld, inputReady, loadInput, printExp, printErr, text;
        function link(asm$2, clbs, reader$2, printer$2) {
            readExpression = clbs.readExpression;
            printline = clbs.printline;
            printOut = clbs.print;
            printErr = clbs.printerror;
            plog = clbs.printlog;
            ld = clbs.load;
            inputReady = asm$2.inputReady;
            text = asm$2.stringText;
            loadInput = reader$2.load;
            printExp = printer$2.printExp;
        }
        function onInput(txt) {
            reader.load(txt);
            inputReady();
        }
        function promptInput() {
            printOut('> ');
            readExpression(onInput);
        }
        function promptUserInput() {
            printOut(':: ');
            readExpression(onInput);
        }
        function onError() {
            //TODO: temporary fix...
            reader.load('#f');
            inputReady();
        }
        function loadFile(str) {
            ld(text(str), onInput, onError);
        }
        function printLog(exp) {
            plog(printExp(exp));
        }
        function printNewline() {
            printline('');
        }
        function printOutput(exp) {
            printline(printExp(exp));
        }
        function printError(txt) {
            printErr('ERROR: ' + txt);
        }
        function initREPL() {
            printline('Welcome to the slip.js REPL');
            printline('');
        }
        return {
            promptUserInput: promptUserInput,
            printNewline: printNewline,
            promptInput: promptInput,
            printOutput: printOutput,
            printError: printError,
            printLog: printLog,
            initREPL: initREPL,
            loadFile: loadFile,
            link: link
        };
    }
    var memSiz = 1 << (size || 24);
    var buffer = new ArrayBuffer(memSiz);
    var //foreign modules
    reader = READER();
    var printer = PRINTER();
    var errors = ERRORS();
    var pool = SYMBOLS();
    var timer = TIMER();
    var io = IO();
    var foreign = {
        heapSize: memSiz,
        skip: reader.skip,
        look: reader.peek,
        read: reader.read,
        readSymbol: reader.readSymbol,
        readString: reader.readString,
        readNumber: reader.readNumber,
        loadQuo: pool.loadQuo,
        loadIff: pool.loadIff,
        loadDef: pool.loadDef,
        loadBeg: pool.loadBeg,
        loadVec: pool.loadVec,
        loadSet: pool.loadSet,
        loadLmb: pool.loadLmb,
        loadPls: pool.loadPls,
        loadMns: pool.loadMns,
        loadMul: pool.loadMul,
        loadDiv: pool.loadDiv,
        loadCns: pool.loadCns,
        loadCar: pool.loadCar,
        loadCdr: pool.loadCdr,
        loadSca: pool.loadSca,
        loadScd: pool.loadScd,
        loadLst: pool.loadLst,
        loadNeq: pool.loadNeq,
        loadSeq: pool.loadSeq,
        loadLeq: pool.loadLeq,
        loadLrg: pool.loadLrg,
        loadSma: pool.loadSma,
        loadAss: pool.loadAss,
        loadMap: pool.loadMap,
        loadAvl: pool.loadAvl,
        loadCol: pool.loadCol,
        loadClk: pool.loadClk,
        loadSlp: pool.loadSlp,
        loadErr: pool.loadErr,
        loadSre: pool.loadSre,
        loadSse: pool.loadSse,
        loadSle: pool.loadSle,
        loadIpa: pool.loadIpa,
        loadInu: pool.loadInu,
        loadIsy: pool.loadIsy,
        loadIve: pool.loadIve,
        loadIst: pool.loadIst,
        loadVcm: pool.loadVcm,
        loadVcr: pool.loadVcr,
        loadVcs: pool.loadVcs,
        loadVcl: pool.loadVcl,
        loadEqu: pool.loadEqu,
        loadEql: pool.loadEql,
        loadEva: pool.loadEva,
        loadRea: pool.loadRea,
        loadLoa: pool.loadLoa,
        loadApl: pool.loadApl,
        loadDis: pool.loadDis,
        loadNew: pool.loadNew,
        loadRst: pool.loadRst,
        loadCcc: pool.loadCcc,
        loadRnd: pool.loadRnd,
        clock: timer.getTime,
        reset: timer.reset,
        expectedRBR: errors.expectedRBR,
        invalidSyntax: errors.invalidSyntax,
        invalidSequence: errors.invalidSequence,
        invalidQuote: errors.invalidQuote,
        invalidIf: errors.invalidIf,
        invalidDefine: errors.invalidDefine,
        invalidAssignment: errors.invalidAssignment,
        invalidParameter: errors.invalidParameter,
        invalidLambda: errors.invalidLambda,
        invalidApplication: errors.invalidApplication,
        invalidExpression: errors.invalidExpression,
        undefinedVariable: errors.undefinedVariable,
        invalidOperator: errors.invalidOperator,
        invalidParamCount: errors.invalidParamCount,
        invalidArgument: errors.invalidArgument,
        globalOverflow: errors.globalOverflow,
        invalidRange: errors.invalidRange,
        invalidLength: errors.invalidLength,
        fatalMemory: errors.fatalMemory,
        promptUserInput: io.promptUserInput,
        printNewline: io.printNewline,
        printOutput: io.printOutput,
        promptInput: io.promptInput,
        printLog: io.printLog,
        loadFile: io.loadFile,
        initREPL: io.initREPL,
        random: Math.random
    };
    var //asm module
    asm = SLIP_ASM(callbacks.stdlib, foreign, buffer);
    asm.makeNumber = asm.makeImmediate;
    asm.numberVal = asm.immediateVal;
    asm.stringText = function (chk) {
        var len = asm.stringLength(chk);
        var arr = new Array(len);
        for (var i = 0; i < len; ++i)
            arr[i] = asm.stringAt(chk, i);
        return String.fromCharCode.apply(null, arr);
    };
    //linking
    pool.link(asm);
    reader.link(asm, pool);
    printer.link(asm);
    io.link(asm, callbacks, reader, printer);
    errors.link(io, printer);
    timer.reset();
    //init
    asm.init();
    return {
        /* ---- EXPORTS ---- */
        Slip_REPL: asm.Slip_REPL
    };
}
