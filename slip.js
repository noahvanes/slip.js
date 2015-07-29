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
        var sin = stdlib.Math.sin;
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
        var REA = 0.1;
        //double
        var SCP = 0;
        //lexical scope level
        var SIZ = 0;
        //size
        var SYM = 0;
        //symbol pool
        var TLC = 0;
        //tail call
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
        var loadQtt = foreign$2.loadQtt;
        var loadRem = foreign$2.loadRem;
        var loadLen = foreign$2.loadLen;
        var loadSin = foreign$2.loadSin;
        var loadExi = foreign$2.loadExi;
        var //IO
        promptUserInput = foreign$2.promptUserInput;
        var printNewline = foreign$2.printNewline;
        var promptInput = foreign$2.promptInput;
        var printOutput = foreign$2.printOutput;
        var printError = foreign$2.printError;
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
            var chk = 0;
            chk = makeChunk(0, 2) | 0;
            chunkSet(chk, 4, car);
            chunkSet(chk, 8, cdr);
            return chk | 0;
        }
        function pairCar(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function pairSetCar(chk, val) {
            chk = chk | 0;
            val = val | 0;
            chunkSet(chk, 4, val);
        }
        function pairCdr(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function pairSetCdr(chk, val) {
            chk = chk | 0;
            val = val | 0;
            chunkSet(chk, 8, val);
        }
        function isPair(x) {
            x = x | 0;
            return (tag(x) | 0) == 0 | 0;
        }
        ;
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
            claimSiz(len);
            vct = makeVector(len) | 0;
            while ((idx | 0) < (len | 0)) {
                cur = MEM32[STKTOP + (idx << 2) >> 2] | 0;
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
        function makeIfs(pre, csq) {
            pre = pre | 0;
            csq = csq | 0;
            var chk = 0;
            chk = makeChunk(8, 2) | 0;
            chunkSet(chk, 4, pre);
            chunkSet(chk, 8, csq);
            return chk | 0;
        }
        function ifsPredicate(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function ifsConsequence(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isIfs(x) {
            x = x | 0;
            return (tag(x) | 0) == 8 | 0;
        }
        function makeIff(pre, csq, alt) {
            pre = pre | 0;
            csq = csq | 0;
            alt = alt | 0;
            var chk = 0;
            chk = makeChunk(10, 3) | 0;
            chunkSet(chk, 4, pre);
            chunkSet(chk, 8, csq);
            chunkSet(chk, 12, alt);
            return chk | 0;
        }
        function iffPredicate(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function iffConsequence(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function iffAlternative(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function isIff(x) {
            x = x | 0;
            return (tag(x) | 0) == 10 | 0;
        }
        function makeQuo(quo) {
            quo = quo | 0;
            var chk = 0;
            chk = makeChunk(22, 1) | 0;
            chunkSet(chk, 4, quo);
            return chk | 0;
        }
        function quoExpression(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        ;
        function isQuo(x) {
            x = x | 0;
            return (tag(x) | 0) == 22 | 0;
        }
        function makeDfv(ofs, val) {
            ofs = ofs | 0;
            val = val | 0;
            var chk = 0;
            chk = makeChunk(12, 2) | 0;
            chunkSet(chk, 4, ofs);
            chunkSet(chk, 8, val);
            return chk | 0;
        }
        function dfvOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function dfvVal(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
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
            var chk = 0;
            chk = makeChunk(14, 4) | 0;
            chunkSet(chk, 4, ofs);
            chunkSet(chk, 8, arc);
            chunkSet(chk, 12, frc);
            chunkSet(chk, 16, bdy);
            return chk | 0;
        }
        function dffOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function dffArgc(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function dffFrmSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function dffBdy(chk) {
            chk = chk | 0;
            return chunkGet(chk, 16) | 0;
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
            var chk = 0;
            chk = makeChunk(30, 4) | 0;
            chunkSet(chk, 4, ofs);
            chunkSet(chk, 8, arc);
            chunkSet(chk, 12, frc);
            chunkSet(chk, 16, bdy);
            return chk | 0;
        }
        function dfzOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function dfzArgc(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function dfzFrmSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function dfzBdy(chk) {
            chk = chk | 0;
            return chunkGet(chk, 16) | 0;
        }
        function isDfz(x) {
            x = x | 0;
            return (tag(x) | 0) == 30 | 0;
        }
        function makeSlc(ofs, val) {
            ofs = ofs | 0;
            val = val | 0;
            var chk = 0;
            chk = makeChunk(16, 2) | 0;
            chunkSet(chk, 4, ofs);
            chunkSet(chk, 8, val);
            return chk | 0;
        }
        function slcOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function slcVal(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isSlc(x) {
            x = x | 0;
            return (tag(x) | 0) == 16 | 0;
        }
        function makeSgl(scp, ofs, val) {
            scp = scp | 0;
            ofs = ofs | 0;
            val = val | 0;
            var chk = 0;
            chk = makeChunk(20, 3) | 0;
            chunkSet(chk, 4, scp);
            chunkSet(chk, 8, ofs);
            chunkSet(chk, 12, val);
            return chk | 0;
        }
        function sglScp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function sglOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function sglVal(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function isSgl(x) {
            x = x | 0;
            return (tag(x) | 0) == 20 | 0;
        }
        function makeContinuation(kon, frm, env, stk) {
            kon = kon | 0;
            frm = frm | 0;
            env = env | 0;
            stk = stk | 0;
            var chk = 0;
            chk = makeChunk(24, 4) | 0;
            chunkSet(chk, 4, kon);
            chunkSet(chk, 8, frm);
            chunkSet(chk, 12, env);
            chunkSet(chk, 16, stk);
            return chk | 0;
        }
        function continuationKon(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function continuationFrm(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function continuationEnv(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function continuationStk(chk) {
            chk = chk | 0;
            return chunkGet(chk, 16) | 0;
        }
        function isContinuation(x) {
            x = x | 0;
            return (tag(x) | 0) == 24 | 0;
        }
        function makeFrm(vrb, nxt) {
            vrb = vrb | 0;
            nxt = nxt | 0;
            var chk = 0;
            chk = makeChunk(26, 2) | 0;
            chunkSet(chk, 4, vrb);
            chunkSet(chk, 8, nxt);
            return chk | 0;
        }
        function frameVrb(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function frameNxt(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isFrame(x) {
            x = x | 0;
            return (tag(x) | 0) == 26 | 0;
        }
        function makeEnv(frm, siz, nxt) {
            frm = frm | 0;
            siz = siz | 0;
            nxt = nxt | 0;
            var chk = 0;
            chk = makeChunk(28, 3) | 0;
            chunkSet(chk, 4, frm);
            chunkSet(chk, 8, siz);
            chunkSet(chk, 12, nxt);
            return chk | 0;
        }
        function envFrm(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function envSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function envNxt(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function isEnvironment(x) {
            x = x | 0;
            return (tag(x) | 0) == 28 | 0;
        }
        function makeThk(exp, siz) {
            exp = exp | 0;
            siz = siz | 0;
            var chk = 0;
            chk = makeChunk(32, 2) | 0;
            chunkSet(chk, 4, exp);
            chunkSet(chk, 8, siz);
            return chk | 0;
        }
        function thunkExp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function thunkSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isThunk(x) {
            x = x | 0;
            return (tag(x) | 0) == 32 | 0;
        }
        function makeTtk(exp, siz) {
            exp = exp | 0;
            siz = siz | 0;
            var chk = 0;
            chk = makeChunk(38, 2) | 0;
            chunkSet(chk, 4, exp);
            chunkSet(chk, 8, siz);
            return chk | 0;
        }
        function ttkExp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function ttkSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isTtk(x) {
            x = x | 0;
            return (tag(x) | 0) == 38 | 0;
        }
        function makeLmb(arc, frc, bdy) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var chk = 0;
            chk = makeChunk(18, 3) | 0;
            chunkSet(chk, 4, arc);
            chunkSet(chk, 8, frc);
            chunkSet(chk, 12, bdy);
            return chk | 0;
        }
        function lmbArgc(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function lmbFrmSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function lmbBdy(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function isLmb(x) {
            x = x | 0;
            return (tag(x) | 0) == 18 | 0;
        }
        function makeLmz(arc, frc, bdy) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var chk = 0;
            chk = makeChunk(34, 3) | 0;
            chunkSet(chk, 4, arc);
            chunkSet(chk, 8, frc);
            chunkSet(chk, 12, bdy);
            return chk | 0;
        }
        function lmzArgc(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function lmzFrmSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function lmzBdy(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function isLmz(x) {
            x = x | 0;
            return (tag(x) | 0) == 34 | 0;
        }
        function makeLocal(ofs) {
            ofs = ofs | 0;
            var chk = 0;
            chk = makeChunk(7, 1) | 0;
            chunkSet(chk, 4, ofs);
            return chk | 0;
        }
        function localOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function isLocal(x) {
            x = x | 0;
            return (tag(x) | 0) == 7 | 0;
        }
        function makeGlobal(scp, ofs) {
            scp = scp | 0;
            ofs = ofs | 0;
            var chk = 0;
            chk = makeChunk(9, 2) | 0;
            chunkSet(chk, 4, scp);
            chunkSet(chk, 8, ofs);
            return chk | 0;
        }
        function globalScp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function globalOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isGlobal(x) {
            x = x | 0;
            return (tag(x) | 0) == 9 | 0;
        }
        function makePrc(arc, frc, bdy, env) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            env = env | 0;
            var chk = 0;
            chk = makeChunk(4, 4) | 0;
            chunkSet(chk, 4, arc);
            chunkSet(chk, 8, frc);
            chunkSet(chk, 12, bdy);
            chunkSet(chk, 16, env);
            return chk | 0;
        }
        function prcArgc(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function prcFrmSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function prcBdy(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function prcEnv(chk) {
            chk = chk | 0;
            return chunkGet(chk, 16) | 0;
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
            var chk = 0;
            chk = makeChunk(36, 4) | 0;
            chunkSet(chk, 4, arc);
            chunkSet(chk, 8, frc);
            chunkSet(chk, 12, bdy);
            chunkSet(chk, 16, env);
            return chk | 0;
        }
        function przArgc(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function przFrmSiz(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function przBdy(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function przEnv(chk) {
            chk = chk | 0;
            return chunkGet(chk, 16) | 0;
        }
        function isPrz(x) {
            x = x | 0;
            return (tag(x) | 0) == 36 | 0;
        }
        function makeApz(opr) {
            opr = opr | 0;
            var chk = 0;
            chk = makeChunk(46, 1) | 0;
            chunkSet(chk, 4, opr);
            return chk | 0;
        }
        function apzOpr(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function isApz(x) {
            x = x | 0;
            return (tag(x) | 0) == 46 | 0;
        }
        function makeTpz(opr) {
            opr = opr | 0;
            var chk = 0;
            chk = makeChunk(44, 1) | 0;
            chunkSet(chk, 4, opr);
            return chk | 0;
        }
        function tpzOpr(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function isTpz(x) {
            x = x | 0;
            return (tag(x) | 0) == 44 | 0;
        }
        function makeAlz(ofs) {
            ofs = ofs | 0;
            var chk = 0;
            chk = makeChunk(27, 1) | 0;
            chunkSet(chk, 4, ofs);
            return chk | 0;
        }
        function alzOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function isAlz(x) {
            x = x | 0;
            return (tag(x) | 0) == 27 | 0;
        }
        function makeTlz(ofs) {
            ofs = ofs | 0;
            var chk = 0;
            chk = makeChunk(29, 1) | 0;
            chunkSet(chk, 4, ofs);
            return chk | 0;
        }
        function tlzOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function isTlz(x) {
            x = x | 0;
            return (tag(x) | 0) == 29 | 0;
        }
        function makeAgz(scp, ofs) {
            scp = scp | 0;
            ofs = ofs | 0;
            var chk = 0;
            chk = makeChunk(33, 2) | 0;
            chunkSet(chk, 4, scp);
            chunkSet(chk, 8, ofs);
            return chk | 0;
        }
        function agzScp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function agzOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isAgz(x) {
            x = x | 0;
            return (tag(x) | 0) == 33 | 0;
        }
        function makeTgz(scp, ofs) {
            scp = scp | 0;
            ofs = ofs | 0;
            var chk = 0;
            chk = makeChunk(35, 2) | 0;
            chunkSet(chk, 4, scp);
            chunkSet(chk, 8, ofs);
            return chk | 0;
        }
        function tgzScp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function tgzOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isTgz(x) {
            x = x | 0;
            return (tag(x) | 0) == 35 | 0;
        }
        function makeApl(opr, opd) {
            opr = opr | 0;
            opd = opd | 0;
            var chk = 0;
            chk = makeChunk(40, 2) | 0;
            chunkSet(chk, 4, opr);
            chunkSet(chk, 8, opd);
            return chk | 0;
        }
        function aplOpr(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function aplOpd(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isApl(x) {
            x = x | 0;
            return (tag(x) | 0) == 40 | 0;
        }
        function makeTpl(opr, opd) {
            opr = opr | 0;
            opd = opd | 0;
            var chk = 0;
            chk = makeChunk(42, 2) | 0;
            chunkSet(chk, 4, opr);
            chunkSet(chk, 8, opd);
            return chk | 0;
        }
        function tplOpr(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function tplOpd(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isTpl(x) {
            x = x | 0;
            return (tag(x) | 0) == 42 | 0;
        }
        function makeAll(ofs, opd) {
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = makeChunk(48, 2) | 0;
            chunkSet(chk, 4, ofs);
            chunkSet(chk, 8, opd);
            return chk | 0;
        }
        function allOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function allOpd(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isAll(x) {
            x = x | 0;
            return (tag(x) | 0) == 48 | 0;
        }
        function makeTll(ofs, opd) {
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = makeChunk(50, 2) | 0;
            chunkSet(chk, 4, ofs);
            chunkSet(chk, 8, opd);
            return chk | 0;
        }
        function tllOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function tllOpd(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function isTll(x) {
            x = x | 0;
            return (tag(x) | 0) == 50 | 0;
        }
        function makeAgl(scp, ofs, opd) {
            scp = scp | 0;
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = makeChunk(52, 3) | 0;
            chunkSet(chk, 4, scp);
            chunkSet(chk, 8, ofs);
            chunkSet(chk, 12, opd);
            return chk | 0;
        }
        function aglScp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function aglOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function aglOpd(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function isAgl(x) {
            x = x | 0;
            return (tag(x) | 0) == 52 | 0;
        }
        function makeTgl(scp, ofs, opd) {
            scp = scp | 0;
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = makeChunk(54, 3) | 0;
            chunkSet(chk, 4, scp);
            chunkSet(chk, 8, ofs);
            chunkSet(chk, 12, opd);
            return chk | 0;
        }
        function tglScp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function tglOfs(chk) {
            chk = chk | 0;
            return chunkGet(chk, 8) | 0;
        }
        function tglOpd(chk) {
            chk = chk | 0;
            return chunkGet(chk, 12) | 0;
        }
        function isTgl(x) {
            x = x | 0;
            return (tag(x) | 0) == 54 | 0;
        }
        function makeStl(exp) {
            exp = exp | 0;
            var chk = 0;
            chk = makeChunk(56, 1) | 0;
            chunkSet(chk, 4, exp);
            return chk | 0;
        }
        function stlExp(chk) {
            chk = chk | 0;
            return chunkGet(chk, 4) | 0;
        }
        function isStl(x) {
            x = x | 0;
            return (tag(x) | 0) == 56 | 0;
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
            if ((currentScpLvl | 0) == 0 & (currentFrmSiz | 0) == 64)
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
            GLB = fillVector(64, 2147483647) | 0;
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
        function lookupLocal(lcl) {
            lcl = lcl | 0;
            return vectorRef(FRM, localOfs(lcl) | 0) | 0;
        }
        function lookupGlobal(glb) {
            glb = glb | 0;
            return vectorRef(vectorRef(ENV, globalScp(glb) | 0) | 0, globalOfs(glb) | 0) | 0;
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
        function preserveEnv() {
            if ((KON | 0) != 143) {
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                KON = 143;
            }
        }
        function initNatives() {
            addNative(loadExi() | 0, 50);
            addNative(loadSin() | 0, 49);
            addNative(loadLen() | 0, 48);
            addNative(loadRem() | 0, 46);
            addNative(loadQtt() | 0, 45);
            addNative(loadErr() | 0, 47);
            addNative(loadLoa() | 0, 44);
            addNative(loadRnd() | 0, 43);
            addNative(loadSle() | 0, 42);
            addNative(loadSse() | 0, 41);
            addNative(loadSre() | 0, 40);
            addNative(loadCcc() | 0, 39);
            addNative(loadAvl() | 0, 38);
            addNative(loadCol() | 0, 37);
            addNative(loadRst() | 0, 34);
            addNative(loadClk() | 0, 33);
            addNative(loadIst() | 0, 27);
            addNative(loadIve() | 0, 26);
            addNative(loadIsy() | 0, 25);
            addNative(loadInu() | 0, 24);
            addNative(loadIpa() | 0, 23);
            addNative(loadRea() | 0, 22);
            addNative(loadNew() | 0, 21);
            addNative(loadDis() | 0, 20);
            addNative(loadEva() | 0, 18);
            addNative(loadApl() | 0, 19);
            addNative(loadMap() | 0, 17);
            addNative(loadAss() | 0, 16);
            addNative(loadVec() | 0, 32);
            addNative(loadVcl() | 0, 31);
            addNative(loadVcs() | 0, 30);
            addNative(loadVcr() | 0, 29);
            addNative(loadVcm() | 0, 28);
            addNative(loadEql() | 0, 36);
            addNative(loadEqu() | 0, 35);
            addNative(loadNeq() | 0, 11);
            addNative(loadLeq() | 0, 13);
            addNative(loadSeq() | 0, 12);
            addNative(loadSma() | 0, 14);
            addNative(loadLrg() | 0, 15);
            addNative(loadLst() | 0, 10);
            addNative(loadScd() | 0, 9);
            addNative(loadSca() | 0, 8);
            addNative(loadCdr() | 0, 7);
            addNative(loadCar() | 0, 6);
            addNative(loadCns() | 0, 5);
            addNative(loadDiv() | 0, 4);
            addNative(loadMul() | 0, 3);
            addNative(loadPls() | 0, 1);
            addNative(loadMns() | 0, 2);
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
            run(160);
        }
        function inputReady() {
            run(51);
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
            STKTOP = STKTOP - 56 | 0;
            MEM32[STKTOP + 52 >> 2] = __EMPTY_VEC__;
            MEM32[STKTOP + 48 >> 2] = SYM;
            MEM32[STKTOP + 44 >> 2] = PAT;
            MEM32[STKTOP + 40 >> 2] = GLB;
            MEM32[STKTOP + 36 >> 2] = FRM;
            MEM32[STKTOP + 32 >> 2] = ENV;
            MEM32[STKTOP + 28 >> 2] = DGL;
            MEM32[STKTOP + 24 >> 2] = DFR;
            MEM32[STKTOP + 20 >> 2] = DEN;
            MEM32[STKTOP + 16 >> 2] = LST;
            MEM32[STKTOP + 12 >> 2] = ARG;
            MEM32[STKTOP + 8 >> 2] = PAR;
            MEM32[STKTOP + 4 >> 2] = VAL;
            MEM32[STKTOP >> 2] = EXP;
            collectGarbage();
            EXP = MEM32[STKTOP >> 2] | 0;
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            PAR = MEM32[STKTOP + 8 >> 2] | 0;
            ARG = MEM32[STKTOP + 12 >> 2] | 0;
            LST = MEM32[STKTOP + 16 >> 2] | 0;
            DEN = MEM32[STKTOP + 20 >> 2] | 0;
            DFR = MEM32[STKTOP + 24 >> 2] | 0;
            DGL = MEM32[STKTOP + 28 >> 2] | 0;
            ENV = MEM32[STKTOP + 32 >> 2] | 0;
            FRM = MEM32[STKTOP + 36 >> 2] | 0;
            GLB = MEM32[STKTOP + 40 >> 2] | 0;
            PAT = MEM32[STKTOP + 44 >> 2] | 0;
            SYM = MEM32[STKTOP + 48 >> 2] | 0;
            __EMPTY_VEC__ = MEM32[STKTOP + 52 >> 2] | 0;
            STKTOP = STKTOP + 56 | 0;
            loadSymbols();
        }
        function _N_add() {
            for (TMP = 0, IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                EXP = vectorRef(PAR, IDX) | 0;
                switch (tag(EXP) | 0) {
                case 69:
                    TMP = TMP + (immediateVal(EXP) | 0) | 0;
                    break;
                case 1:
                    FLT = fround(fround(TMP | 0) + fround(floatNumber(EXP)));
                    return _N_addFloats() | 0;
                default:
                    err_invalidArgument(EXP | 0);
                    return 164;
                }
            }
            VAL = makeImmediate(TMP) | 0;
            return KON | 0;
        }
        function _N_sub() {
            if (!LEN) {
                err_invalidParamCount();
                return 164;
            }
            VAL = vectorRef(PAR, 1) | 0;
            if ((LEN | 0) == 1) {
                switch (tag(VAL) | 0) {
                case 69:
                    VAL = makeImmediate(-(immediateVal(VAL) | 0) | 0) | 0;
                    return KON | 0;
                case 1:
                    claim();
                    VAL = makeFloat(fround(-fround(floatNumber(VAL)))) | 0;
                    return KON | 0;
                default:
                    err_invalidArgument(VAL | 0);
                    return 164;
                }
            }
            IDX = 1;
            switch (tag(VAL) | 0) {
            case 69:
                TMP = immediateVal(VAL) | 0;
                while ((IDX | 0) < (LEN | 0)) {
                    IDX = IDX + 1 | 0;
                    EXP = vectorRef(PAR, IDX) | 0;
                    switch (tag(EXP) | 0) {
                    case 69:
                        TMP = TMP - (immediateVal(EXP) | 0) | 0;
                        break;
                    case 1:
                        FLT = fround(fround(TMP | 0) - fround(floatNumber(EXP)));
                        return _N_substractFloats() | 0;
                    default:
                        err_invalidArgument(EXP | 0);
                        return 164;
                    }
                }
                VAL = makeImmediate(TMP) | 0;
                return KON | 0;
            case 1:
                FLT = fround(floatNumber(VAL));
                return 145;
            }
            err_invalidArgument(VAL | 0);
            return 164;
        }
        function _N_multiply() {
            TMP = 1;
            IDX = 0;
            while ((IDX | 0) < (LEN | 0)) {
                IDX = IDX + 1 | 0;
                EXP = vectorRef(PAR, IDX) | 0;
                switch (tag(EXP) | 0) {
                case 69:
                    TMP = imul(TMP, immediateVal(EXP) | 0) | 0;
                    break;
                case 1:
                    FLT = fround(fround(TMP | 0) * fround(floatNumber(EXP)));
                    return _N_multiplyFloats() | 0;
                default:
                    err_invalidArgument(EXP | 0);
                    return 164;
                }
            }
            VAL = makeImmediate(TMP) | 0;
            return KON | 0;
        }
        function _N_div() {
            if (!LEN) {
                err_invalidParamCount();
                return 164;
            }
            claim();
            VAL = vectorRef(PAR, 1) | 0;
            if ((LEN | 0) == 1) {
                switch (tag(VAL) | 0) {
                case 69:
                    VAL = makeFloat(fround(fround(1) / fround(immediateVal(VAL) | 0))) | 0;
                    return KON | 0;
                case 1:
                    VAL = makeFloat(fround(fround(1) / fround(floatNumber(VAL)))) | 0;
                    return KON | 0;
                default:
                    err_invalidArgument(VAL | 0);
                    return 164;
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
                return 164;
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
                    return 164;
                }
            }
            VAL = makeFloat(FLT) | 0;
            return KON | 0;
        }
        function _N_cons() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            claim();
            VAL = makePair(vectorRef(PAR, 1) | 0, vectorRef(PAR, 2) | 0) | 0;
            return KON | 0;
        }
        function _N_car() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            if (isPair(ARG) | 0) {
                VAL = pairCar(ARG) | 0;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_cdr() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            if (isPair(ARG) | 0) {
                VAL = pairCdr(ARG) | 0;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_sca() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            VAL = vectorRef(PAR, 2) | 0;
            if (isPair(ARG) | 0) {
                pairSetCar(ARG, VAL);
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_scd() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            VAL = vectorRef(PAR, 2) | 0;
            if (isPair(ARG) | 0) {
                pairSetCdr(ARG, VAL);
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_list() {
            claimSiz(imul(3, LEN) | 0);
            for (VAL = 2147483645; LEN; LEN = LEN - 1 | 0)
                VAL = makePair(vectorRef(PAR, LEN) | 0, VAL) | 0;
            return KON | 0;
        }
        function _N_nbrEq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            switch (tag(ARG) | 0) {
            case 69:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = (immediateVal(ARG) | 0) == (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(immediateVal(ARG) | 0) == fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            case 1:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = fround(floatNumber(ARG)) == fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(floatNumber(ARG)) == fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_seq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            switch (tag(ARG) | 0) {
            case 69:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = (immediateVal(ARG) | 0) <= (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(immediateVal(ARG) | 0) <= fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            case 1:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = fround(floatNumber(ARG)) <= fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(floatNumber(ARG)) <= fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_leq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            switch (tag(ARG) | 0) {
            case 69:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = (immediateVal(ARG) | 0) >= (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(immediateVal(ARG) | 0) >= fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            case 1:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = fround(floatNumber(ARG)) >= fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(floatNumber(ARG)) >= fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_sma() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            switch (tag(ARG) | 0) {
            case 69:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = (immediateVal(ARG) | 0) < (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(immediateVal(ARG) | 0) < fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            case 1:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = fround(floatNumber(ARG)) < fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(floatNumber(ARG)) < fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_lrg() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            switch (tag(ARG) | 0) {
            case 69:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = (immediateVal(ARG) | 0) > (immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(immediateVal(ARG) | 0) > fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            case 1:
                switch (tag(EXP) | 0) {
                case 69:
                    VAL = fround(floatNumber(ARG)) > fround(immediateVal(EXP) | 0) ? 2147483643 : 2147483641;
                    return KON | 0;
                case 1:
                    VAL = fround(floatNumber(ARG)) > fround(floatNumber(EXP)) ? 2147483643 : 2147483641;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_assoc() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            PAT = vectorRef(PAR, 1) | 0;
            LST = vectorRef(PAR, 2) | 0;
            while (isPair(LST) | 0) {
                VAL = pairCar(LST) | 0;
                if (!(isPair(VAL) | 0)) {
                    err_invalidArgument(LST | 0);
                    return 164;
                }
                if ((pairCar(VAL) | 0) == (PAT | 0)) {
                    return KON | 0;
                }
                LST = pairCdr(LST) | 0;
            }
            VAL = 2147483641;
            return KON | 0;
        }
        function _N_map() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            VAL = vectorRef(PAR, 1) | 0;
            LST = vectorRef(PAR, 2) | 0;
            if ((LST | 0) == 2147483645) {
                VAL = 2147483645;
                return KON | 0;
            }
            if (!(isPair(LST) | 0)) {
                err_invalidArgument(LST | 0);
                return 164;
            }
            claim();
            ARG = makePair(pairCar(LST) | 0, 2147483645) | 0;
            LST = pairCdr(LST) | 0;
            if (isNull(LST) | 0) {
                STKTOP = STKTOP - 8 | 0;
                MEM32[STKTOP + 4 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP >> 2] = 2147483645;
                KON = 147;
            } else {
                STKTOP = STKTOP - 16 | 0;
                MEM32[STKTOP + 12 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP + 8 >> 2] = 2147483645;
                MEM32[STKTOP + 4 >> 2] = VAL;
                MEM32[STKTOP >> 2] = LST;
                KON = 148;
            }
            return 149;
        }
        function _N_eval() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            claim();
            EXP = vectorRef(PAR, 1) | 0;
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP + 4 >> 2] = ENV;
            MEM32[STKTOP >> 2] = FRM;
            KON = 150;
            TLC = 2147483643;
            return _C_compile() | 0;
        }
        function _N_applyNat() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            VAL = vectorRef(PAR, 1) | 0;
            ARG = vectorRef(PAR, 2) | 0;
            return _N_apply() | 0;
        }
        function _N_display() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            printLog(vectorRef(PAR, 1) | 0);
            VAL = 2147483647;
            return KON | 0;
        }
        function _N_newline() {
            printNewline();
            VAL = 2147483647;
            return KON | 0;
        }
        function _N_read() {
            switch (LEN | 0) {
            case 0:
                promptUserInput();
                return 0;
            case 1:
                EXP = vectorRef(PAR, 1) | 0;
                loadFile(EXP | 0);
                return 0;
            }
            err_invalidParamCount();
            return 164;
        }
        function _N_isPair() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 0 ? 2147483643 : 2147483641;
            return KON | 0;
        }
        function _N_isNull() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 68 ? 2147483643 : 2147483641;
            return KON | 0;
        }
        function _N_isSymbol() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 3 ? 2147483643 : 2147483641;
            return KON | 0;
        }
        function _N_isVector() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 2 ? 2147483643 : 2147483641;
            return KON | 0;
        }
        function _N_isString() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            VAL = (tag(vectorRef(PAR, 1) | 0) | 0) == 5 ? 2147483643 : 2147483641;
            return KON | 0;
        }
        function _N_makeVector() {
            if (!LEN) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            if (!(isNumber(ARG) | 0)) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            LEN = immediateVal(ARG) | 0;
            if ((LEN | 0) < 0) {
                err_invalidLength(LEN | 0);
                return 164;
            }
            claimSiz(LEN);
            VAL = LEN ? 1 : vectorRef(PAR, 2) | 0;
            VAL = fillVector(LEN, VAL) | 0;
            return KON | 0;
        }
        function _N_vectorRef() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            if (!(isVector(ARG) | 0)) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            if (!(isNumber(EXP) | 0)) {
                err_invalidArgument(EXP | 0);
                return 164;
            }
            IDX = immediateVal(EXP) | 0;
            LEN = vectorLength(ARG) | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                VAL = vectorRef(ARG, IDX + 1 | 0) | 0;
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 164;
        }
        function _N_vectorSet() {
            if ((LEN | 0) != 3) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            VAL = vectorRef(PAR, 3) | 0;
            if (!(isVector(ARG) | 0)) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            if (!(isNumber(EXP) | 0)) {
                err_invalidArgument(EXP | 0);
                return 164;
            }
            IDX = immediateVal(EXP) | 0;
            LEN = vectorLength(ARG) | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                vectorSet(ARG, IDX + 1 | 0, VAL);
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 164;
        }
        function _N_vectorLength() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            if (!(isVector(ARG) | 0)) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            LEN = vectorLength(ARG) | 0;
            VAL = makeImmediate(LEN) | 0;
            return KON | 0;
        }
        function _N_vector() {
            VAL = PAR;
            return KON | 0;
        }
        function _N_clock() {
            if (LEN) {
                err_invalidParamCount();
                return 164;
            }
            VAL = makeImmediate(clock() | 0) | 0;
            return KON | 0;
        }
        function _N_reset() {
            if (LEN) {
                err_invalidParamCount();
                return 164;
            }
            reset();
            VAL = 2147483647;
            return KON | 0;
        }
        function _N_eq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            VAL = (vectorRef(PAR, 1) | 0) == (vectorRef(PAR, 2) | 0) ? 2147483643 : 2147483641;
            return KON | 0;
        }
        function _N_equal() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            EXP = vectorRef(PAR, 1) | 0;
            ARG = vectorRef(PAR, 2) | 0;
            return _N_compare() | 0;
        }
        function _N_collect() {
            reclaim();
            VAL = makeImmediate(available() | 0) | 0;
            return KON | 0;
        }
        function _N_available() {
            VAL = makeImmediate(available() | 0) | 0;
            return KON | 0;
        }
        function _N_callcc() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            VAL = vectorRef(PAR, 1) | 0;
            switch (tag(VAL) | 0) {
            case 4:
            case 36:
            case 70:
            case 24:
                ARG = currentStack() | 0;
                ARG = makeContinuation(makeImmediate(KON) | 0, FRM, ENV, ARG) | 0;
                ARG = makePair(ARG, 2147483645) | 0;
                return _N_apply() | 0;
            }
            err_invalidArgument(VAL | 0);
            return 164;
        }
        function _N_stringRef() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            if (!(isString(ARG) | 0)) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            if (!(isNumber(EXP) | 0)) {
                err_invalidArgument(EXP | 0);
                return 164;
            }
            IDX = immediateVal(EXP) | 0;
            LEN = textLength(ARG) | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                VAL = makeChar(textGetChar(ARG, IDX) | 0) | 0;
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 164;
        }
        function _N_stringSet() {
            if ((LEN | 0) != 3) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            VAL = vectorRef(PAR, 3) | 0;
            if (!(isString(ARG) | 0)) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            if (!(isNumber(EXP) | 0)) {
                err_invalidArgument(EXP | 0);
                return 164;
            }
            if (!(isChar(VAL) | 0)) {
                err_invalidArgument(VAL | 0);
                return 164;
            }
            IDX = immediateVal(EXP) | 0;
            LEN = textLength(ARG) | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                textSetChar(ARG, IDX, charCode(VAL) | 0);
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 164;
        }
        function _N_stringLength() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            if (!(isString(ARG) | 0)) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            VAL = makeImmediate(textLength(ARG) | 0) | 0;
            return KON | 0;
        }
        function _N_random() {
            if (LEN | 0) {
                err_invalidParamCount();
                return 164;
            }
            claim();
            VAL = makeFloat(fround(+random())) | 0;
            return KON | 0;
        }
        function _N_load() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            if (!(isString(ARG) | 0)) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            claim();
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP + 4 >> 2] = ENV;
            MEM32[STKTOP >> 2] = FRM;
            KON = 151;
            loadFile(ARG | 0);
            return 0;
        }
        function _N_quotient() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            switch (tag(ARG) | 0) {
            case 69:
                switch (tag(EXP) | 0) {
                case 69:
                    TMP = (immediateVal(ARG) | 0) / (immediateVal(EXP) | 0) | 0;
                    VAL = makeImmediate(TMP) | 0;
                    return KON | 0;
                case 1:
                    FLT = fround(immediateVal(ARG) | 0);
                    FLT = fround(FLT / fround(floatNumber(EXP)));
                    VAL = makeImmediate(~~FLT) | 0;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            case 1:
                FLT = fround(floatNumber(ARG));
                switch (tag(EXP) | 0) {
                case 69:
                    FLT = fround(FLT / fround(immediateVal(EXP) | 0));
                    VAL = makeImmediate(~~FLT) | 0;
                    return KON | 0;
                case 1:
                    FLT = fround(FLT / fround(floatNumber(EXP)));
                    VAL = makeImmediate(~~FLT) | 0;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_remainder() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            EXP = vectorRef(PAR, 2) | 0;
            switch (tag(ARG) | 0) {
            case 69:
                switch (tag(EXP) | 0) {
                case 69:
                    TMP = (immediateVal(ARG) | 0) % (immediateVal(EXP) | 0) | 0;
                    VAL = makeImmediate(TMP) | 0;
                    return KON | 0;
                case 1:
                    claim();
                    REA = +(+(immediateVal(ARG) | 0) % +fround(floatNumber(EXP)));
                    VAL = makeFloat(fround(REA)) | 0;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            case 1:
                claim();
                REA = +fround(floatNumber(ARG));
                switch (tag(EXP) | 0) {
                case 69:
                    REA = +(REA % +(immediateVal(EXP) | 0));
                    VAL = makeFloat(fround(REA)) | 0;
                    return KON | 0;
                case 1:
                    REA = +(REA % +fround(floatNumber(EXP)));
                    VAL = makeFloat(fround(REA)) | 0;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 164;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_error() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            ARG = vectorRef(PAR, 1) | 0;
            printError(ARG | 0);
            return 164;
        }
        function _N_length() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            LEN = 0;
            ARG = vectorRef(PAR, 1) | 0;
            while (isPair(ARG) | 0) {
                ARG = pairCdr(ARG) | 0;
                LEN = LEN + 1 | 0;
            }
            if ((ARG | 0) != 2147483645) {
                err_invalidArgument(ARG | 0);
                return 164;
            }
            VAL = makeImmediate(LEN) | 0;
            return KON | 0;
        }
        function _N_sin() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 164;
            }
            claim();
            ARG = vectorRef(PAR, 1) | 0;
            switch (tag(ARG) | 0) {
            case 69:
                REA = +sin(+(immediateVal(ARG) | 0));
                VAL = makeFloat(fround(REA)) | 0;
                return KON | 0;
            case 1:
                REA = +sin(+fround(floatNumber(ARG)));
                VAL = makeFloat(fround(REA)) | 0;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 164;
        }
        function _N_exit() {
            return 0;
        }
        function _R_read() {
            switch (look() | 0) {
            case 40:
                return 52;
            case 35:
                return 58;
            case 39:
                return 56;
            case 34:
                VAL = readString() | 0;
                return KON | 0;
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
                return KON | 0;
            }
            VAL = readSymbol() | 0;
            return KON | 0;
        }
        function _R_readLBR() {
            skip();
            if ((look() | 0) == 41) {
                skip();
                VAL = 2147483645;
                return KON | 0;
            }
            claim();
            push(makeImmediate(KON) | 0);
            push(1);
            KON = 53;
            return 51;
        }
        function _R_c1_LBR() {
            claim();
            if ((look() | 0) == 41) {
                skip();
                VAL = makePair(VAL, 2147483645) | 0;
                return 55;
            }
            IDX = immediateVal(peek() | 0) | 0;
            poke(VAL);
            push(makeImmediate(IDX + 1 | 0) | 0);
            if ((look() | 0) == 46) {
                skip();
                KON = 54;
            }
            return 51;
        }
        function _R_c2_LBR() {
            if ((look() | 0) != 41) {
                err_expectedRBR(look() | 0);
                return 164;
            }
            skip();
            return 55;
        }
        function _R_c3_LBR() {
            IDX = immediateVal(pop() | 0) | 0;
            for (; IDX; IDX = IDX - 1 | 0)
                VAL = makePair(pop() | 0, VAL) | 0;
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _R_readQUO() {
            claim();
            skip();
            push(makeImmediate(KON) | 0);
            KON = 57;
            return 51;
        }
        function _R_c_QUO() {
            claim();
            VAL = makePair(VAL, 2147483645) | 0;
            VAL = makePair(__QUO_SYM__, VAL) | 0;
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _R_readSHR() {
            skip();
            switch (read() | 0) {
            case 116:
                VAL = 2147483643;
                return KON | 0;
            case 102:
                VAL = 2147483641;
                return KON | 0;
            case 92:
                VAL = makeChar(read() | 0) | 0;
                return KON | 0;
            case 40:
                claim();
                if ((look() | 0) == 41) {
                    skip();
                    VAL = makePair(__VEC_SYM__, 2147483645) | 0;
                    return KON | 0;
                }
                push(makeImmediate(KON) | 0);
                push(3);
                KON = 59;
                return 51;
            }
            err_invalidSyntax();
            return 164;
        }
        function _R_c_vector() {
            if ((look() | 0) == 41) {
                skip();
                LEN = immediateVal(pop() | 0) | 0;
                claimSiz(imul(3, LEN) | 0);
                VAL = makePair(VAL, 2147483645) | 0;
                for (LEN = LEN - 1 | 0; LEN; LEN = LEN - 1 | 0)
                    VAL = makePair(pop() | 0, VAL) | 0;
                VAL = makePair(__VEC_SYM__, VAL) | 0;
                KON = immediateVal(pop() | 0) | 0;
                return KON | 0;
            }
            claim();
            IDX = immediateVal(peek() | 0) | 0;
            poke(VAL);
            push(makeImmediate(IDX + 1 | 0) | 0);
            return 51;
        }
        function _C_compile() {
            if (isPair(EXP) | 0) {
                LST = pairCdr(EXP) | 0;
                EXP = pairCar(EXP) | 0;
                if (isSymbol(EXP) | 0) {
                    if ((EXP | 0) == (__IFF_SYM__ | 0)) {
                        return _C_compileIf() | 0;
                    } else if ((EXP | 0) == (__DEF_SYM__ | 0)) {
                        return _C_compileDefine() | 0;
                    } else if ((EXP | 0) == (__BEG_SYM__ | 0)) {
                        return _C_compileSequence() | 0;
                    } else if ((EXP | 0) == (__LMB_SYM__ | 0)) {
                        return _C_compileLambda() | 0;
                    } else if ((EXP | 0) == (__SET_SYM__ | 0)) {
                        return _C_compileSet() | 0;
                    } else if ((EXP | 0) == (__QUO_SYM__ | 0)) {
                        return _C_compileQuote() | 0;
                    }
                }
                return _C_compileApplication() | 0;
            }
            if (isSymbol(EXP) | 0) {
                return _C_compileSymbol() | 0;
            }
            VAL = EXP;
            return KON | 0;
        }
        function _C_compileSymbol() {
            claim();
            PAT = EXP;
            lexicalAdr();
            if (OFS) {
                VAL = SCP ? makeGlobal(SCP, OFS) | 0 : makeLocal(OFS) | 0;
                return KON | 0;
            }
            err_undefinedVariable(PAT | 0);
            return 164;
        }
        function _C_compileSequence() {
            if (isNull(LST) | 0) {
                VAL = 2147483647;
                return KON | 0;
            }
            if (!(isPair(LST) | 0)) {
                err_invalidSequence();
                return 164;
            }
            EXP = pairCar(LST) | 0;
            LST = pairCdr(LST) | 0;
            if (!(isNull(LST) | 0)) {
                claim();
                STKTOP = STKTOP - 16 | 0;
                MEM32[STKTOP + 12 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP + 8 >> 2] = 3;
                MEM32[STKTOP + 4 >> 2] = LST;
                MEM32[STKTOP >> 2] = TLC;
                TLC = 2147483641;
                KON = 63;
            }
            return 60;
        }
        function _C_c1_sequence() {
            TLC = pop() | 0;
            LST = pop() | 0;
            LEN = immediateVal(peek() | 0) | 0;
            poke(VAL);
            push(makeImmediate(LEN + 1 | 0) | 0);
            if (!(isPair(LST) | 0)) {
                err_invalidSequence();
                return 164;
            }
            EXP = pairCar(LST) | 0;
            LST = pairCdr(LST) | 0;
            if (isNull(LST) | 0) {
                KON = 64;
            } else {
                claim();
                push(LST);
                push(TLC);
                TLC = 2147483641;
                KON = 63;
            }
            return 60;
        }
        function _C_c2_sequence() {
            LEN = immediateVal(pop() | 0) | 0;
            claimSiz(LEN);
            EXP = makeStl(VAL) | 0;
            VAL = makeSequence(LEN) | 0;
            sequenceSet(VAL, LEN, EXP);
            for (LEN = LEN - 1 | 0; LEN; LEN = LEN - 1 | 0)
                sequenceSet(VAL, LEN, pop() | 0);
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _C_compileQuote() {
            if (!(isPair(LST) | 0)) {
                err_invalidQuote();
                return 164;
            }
            EXP = pairCar(LST) | 0;
            LST = pairCdr(LST) | 0;
            if (isNull(LST) | 0) {
                claim();
                VAL = makeQuo(EXP) | 0;
                return KON | 0;
            }
            err_invalidQuote();
            return 164;
        }
        function _C_compileInline() {
            claim();
            enterScope();
            push(EXP);
            push(TLC);
            push(makeImmediate(KON) | 0);
            TLC = 2147483643;
            KON = 67;
            return 60;
        }
        function _C_c_compileInline() {
            SIZ = exitScope() | 0;
            KON = immediateVal(pop() | 0) | 0;
            TLC = pop() | 0;
            EXP = pop() | 0;
            if (SIZ) {
                //claim();
                SIZ = makeImmediate(SIZ) | 0;
                VAL = (TLC | 0) == 2147483643 ? makeTtk(VAL, SIZ) | 0 : makeThk(VAL, SIZ) | 0;
                return KON | 0;
            }
            return 60;
        }
        function _C_compileIf() {
            if (!(isPair(LST) | 0)) {
                err_invalidIf();
                return 164;
            }
            EXP = pairCar(LST) | 0;
            LST = pairCdr(LST) | 0;
            if (!(isPair(LST) | 0)) {
                err_invalidIf();
                return 164;
            }
            claim();
            push(makeImmediate(KON) | 0);
            push(LST);
            push(TLC);
            TLC = 2147483641;
            KON = 69;
            return 60;
        }
        function _C_c1_if() {
            TLC = pop() | 0;
            LST = peek() | 0;
            EXP = pairCar(LST) | 0;
            LST = pairCdr(LST) | 0;
            poke(VAL);
            if (isNull(LST) | 0) {
                KON = 70;
                return 66;
            }
            if (isPair(LST) | 0) {
                claim();
                push(LST);
                push(TLC);
                KON = 71;
                return 66;
            }
            err_invalidIf();
            return 164;
        }
        function _C_c2_if() {
            claim();
            VAL = makeIfs(pop() | 0, VAL) | 0;
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _C_c3_if() {
            TLC = pop() | 0;
            LST = peek() | 0;
            EXP = pairCar(LST) | 0;
            LST = pairCdr(LST) | 0;
            poke(VAL);
            if (!(isNull(LST) | 0)) {
                err_invalidIf();
                return 164;
            }
            KON = 72;
            return 66;
        }
        function _C_c4_if() {
            claim();
            EXP = pop() | 0;
            VAL = makeIff(pop() | 0, EXP, VAL) | 0;
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _C_compileParameters() {
            for (LST = PAR; isPair(LST) | 0; LST = pairCdr(LST) | 0) {
                PAT = pairCar(LST) | 0;
                if (!(isSymbol(PAT) | 0)) {
                    err_invalidParameter();
                    return 164;
                }
                claim();
                defineVar() | 0;
            }
            return KON | 0;
        }
        function _C_compileDefine() {
            claim();
            if (!(isPair(LST) | 0)) {
                err_invalidDefine();
                return 164;
            }
            PAT = pairCar(LST) | 0;
            LST = pairCdr(LST) | 0;
            push(makeImmediate(KON) | 0);
            switch (tag(PAT) | 0) {
            case 3:
                if (!(isPair(LST) | 0)) {
                    err_invalidDefine();
                    return 164;
                }
                EXP = pairCar(LST) | 0;
                LST = pairCdr(LST) | 0;
                if (!(isNull(LST) | 0)) {
                    err_invalidDefine();
                    return 164;
                }
                OFS = defineVar() | 0;
                push(makeImmediate(OFS) | 0);
                TLC = 2147483641;
                KON = 75;
                return 60;
            case 0:
                PAR = pairCdr(PAT) | 0;
                PAT = pairCar(PAT) | 0;
                if (!(isSymbol(PAT) | 0)) {
                    err_invalidDefine();
                    return 164;
                }
                OFS = defineVar() | 0;
                push(makeImmediate(OFS) | 0);
                push(LST);
                enterScope();
                KON = 76;
                return 73;
            }
            err_invalidDefine();
            return 164;
        }
        function _C_c1_define() {
            claim();
            OFS = pop() | 0;
            KON = immediateVal(pop() | 0) | 0;
            VAL = makeDfv(OFS, VAL) | 0;
            return KON | 0;
        }
        function _C_c2_define() {
            SIZ = makeImmediate(currentFrmSiz) | 0;
            TLC = 2147483643;
            switch (tag(LST) | 0) {
            case 68:
                LST = peek() | 0;
                poke(SIZ);
                KON = 77;
                return 62;
            case 3:
                claim();
                PAT = LST;
                defineVar() | 0;
                LST = peek() | 0;
                poke(SIZ);
                KON = 78;
                return 62;
            }
            err_invalidDefine();
            return 164;
        }
        function _C_c3_define() {
            claim();
            SIZ = makeImmediate(exitScope() | 0) | 0;
            //total frame size
            TMP = pop() | 0;
            //argument count
            OFS = pop() | 0;
            //offset
            VAL = makeDff(OFS, TMP, SIZ, VAL) | 0;
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _C_c4_define() {
            claim();
            SIZ = makeImmediate(exitScope() | 0) | 0;
            //total frame size
            TMP = pop() | 0;
            //argument count
            OFS = pop() | 0;
            //offset
            VAL = makeDfz(OFS, TMP, SIZ, VAL) | 0;
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _C_compileSet() {
            claim();
            if (!(isPair(LST) | 0)) {
                err_invalidAssignment();
                return 164;
            }
            PAT = pairCar(LST) | 0;
            if (!(isSymbol(PAT) | 0)) {
                err_invalidAssignment();
                return 164;
            }
            LST = pairCdr(LST) | 0;
            if (!(isPair(LST) | 0)) {
                err_invalidAssignment();
                return 164;
            }
            EXP = pairCar(LST) | 0;
            LST = pairCdr(LST) | 0;
            if (!(isNull(LST) | 0)) {
                err_invalidAssignment();
                return 164;
            }
            //NOTE: original C implementation first compiles expression...
            //... then looks up the pattern, so that statements such as:
            //(set! x (begin (define x 2) 'foo)) are valid.
            push(makeImmediate(KON) | 0);
            push(PAT);
            TLC = 2147483641;
            KON = 80;
            return 60;
        }
        function _C_c_set() {
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
                return KON | 0;
            }
            err_undefinedVariable(PAT | 0);
            return 164;
        }
        function _C_compileLambda() {
            if (!(isPair(LST) | 0)) {
                err_invalidLambda();
                return 164;
            }
            claim();
            enterScope();
            PAR = pairCar(LST) | 0;
            push(makeImmediate(KON) | 0);
            push(pairCdr(LST) | 0);
            KON = 82;
            return 73;
        }
        function _C_c1_lambda() {
            SIZ = makeImmediate(currentFrmSiz) | 0;
            TLC = 2147483643;
            switch (tag(LST) | 0) {
            case 68:
                LST = peek() | 0;
                poke(SIZ);
                KON = 83;
                return 62;
            case 3:
                claim();
                PAT = LST;
                defineVar() | 0;
                LST = peek() | 0;
                poke(SIZ);
                KON = 84;
                return 62;
            }
            err_invalidLambda();
            return 164;
        }
        function _C_c2_lambda() {
            claim();
            SIZ = makeImmediate(exitScope() | 0) | 0;
            TMP = pop() | 0;
            VAL = makeLmb(TMP, SIZ, VAL) | 0;
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _C_c3_lambda() {
            claim();
            SIZ = makeImmediate(exitScope() | 0) | 0;
            TMP = pop() | 0;
            VAL = makeLmz(TMP, SIZ, VAL) | 0;
            KON = immediateVal(pop() | 0) | 0;
            return KON | 0;
        }
        function _C_compileApplication() {
            claim();
            push(makeImmediate(KON) | 0);
            if (isNull(LST) | 0) {
                KON = 86;
                push(TLC);
            } else {
                push(1);
                push(LST);
                push(TLC);
                TLC = 2147483641;
                KON = 87;
            }
            return 60;
        }
        function _C_c1_application() {
            claim();
            TLC = pop() | 0;
            KON = immediateVal(pop() | 0) | 0;
            switch (tag(VAL) | 0) {
            case 7:
                OFS = localOfs(VAL) | 0;
                VAL = (TLC | 0) == 2147483643 ? makeTlz(OFS) | 0 : makeAlz(OFS) | 0;
                return KON | 0;
            case 9:
                SCP = globalScp(VAL) | 0;
                OFS = globalOfs(VAL) | 0;
                VAL = (TLC | 0) == 2147483643 ? makeTgz(SCP, OFS) | 0 : makeAgz(SCP, OFS) | 0;
                return KON | 0;
            }
            VAL = (TLC | 0) == 2147483643 ? makeTpz(VAL) | 0 : makeApz(VAL) | 0;
            return KON | 0;
        }
        function _C_c2_application() {
            TLC = pop() | 0;
            ARG = pop() | 0;
            LEN = immediateVal(peek() | 0) | 0;
            poke(VAL);
            push(makeImmediate(LEN + 1 | 0) | 0);
            if (!(isPair(ARG) | 0)) {
                err_invalidApplication();
                return 164;
            }
            EXP = pairCar(ARG) | 0;
            ARG = pairCdr(ARG) | 0;
            if (isNull(ARG) | 0) {
                KON = 88;
                push(TLC);
            } else {
                claim();
                push(ARG);
                push(TLC);
                TLC = 2147483641;
            }
            return 60;
        }
        function _C_c3_application() {
            TLC = pop() | 0;
            LEN = immediateVal(pop() | 0) | 0;
            claimSiz(LEN);
            EXP = makeVector(LEN) | 0;
            vectorSet(EXP, LEN, VAL);
            for (LEN = LEN - 1 | 0; LEN; LEN = LEN - 1 | 0)
                vectorSet(EXP, LEN, pop() | 0);
            VAL = pop() | 0;
            KON = immediateVal(pop() | 0) | 0;
            switch (tag(VAL) | 0) {
            case 7:
                OFS = makeImmediate(localOfs(VAL) | 0) | 0;
                VAL = (TLC | 0) == 2147483643 ? makeTll(OFS, EXP) | 0 : makeAll(OFS, EXP) | 0;
                return KON | 0;
            case 9:
                SCP = makeImmediate(globalScp(VAL) | 0) | 0;
                OFS = makeImmediate(globalOfs(VAL) | 0) | 0;
                VAL = (TLC | 0) == 2147483643 ? makeTgl(SCP, OFS, EXP) | 0 : makeAgl(SCP, OFS, EXP) | 0;
                return KON | 0;
            }
            VAL = (TLC | 0) == 2147483643 ? makeTpl(VAL, EXP) | 0 : makeApl(VAL, EXP) | 0;
            return KON | 0;
        }
        function _E_eval() {
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
                VAL = EXP;
                return KON | 0;
            case 22:
                VAL = quoExpression(EXP) | 0;
                return KON | 0;
            case 7:
                VAL = lookupLocal(EXP) | 0;
                return KON | 0;
            case 9:
                VAL = lookupGlobal(EXP) | 0;
                return KON | 0;
            case 18:
                VAL = capturePrc(EXP) | 0;
                return KON | 0;
            case 34:
                VAL = capturePrz(EXP) | 0;
                return KON | 0;
            case 16:
                return _E_setLocal() | 0;
            case 20:
                return _E_setGlobal() | 0;
            case 12:
                return _E_evalDfv() | 0;
            case 14:
                return _E_evalDff() | 0;
            case 30:
                return _E_evalDfz() | 0;
            case 6:
                return _E_evalSeq() | 0;
            case 56:
                return _E_evalStl() | 0;
            case 8:
                return _E_evalIfs() | 0;
            case 10:
                return _E_evalIff() | 0;
            case 38:
                return _E_evalTtk() | 0;
            case 32:
                return _E_evalThk() | 0;
            case 27:
                return _E_evalAlz() | 0;
            case 33:
                return _E_evalAgz() | 0;
            case 46:
                return _E_evalApz() | 0;
            case 40:
                return _E_evalApl() | 0;
            case 48:
                return _E_evalAll() | 0;
            case 52:
                return _E_evalAgl() | 0;
            case 29:
                return _E_evalTlz() | 0;
            case 35:
                return _E_evalTgz() | 0;
            case 44:
                return _E_evalTpz() | 0;
            case 42:
                return _E_evalTpl() | 0;
            case 50:
                return _E_evalTll() | 0;
            case 54:
                return _E_evalTgl() | 0;
            }
            err_invalidExpression(EXP | 0);
            return 164;
        }
        function _E_setLocal() {
            claim();
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP >> 2] = slcOfs(EXP) | 0;
            EXP = slcVal(EXP) | 0;
            KON = 91;
            return _E_eval() | 0;
        }
        function _E_c_setLocal() {
            OFS = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            KON = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            vectorSet(FRM, OFS, VAL);
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _E_setGlobal() {
            claim();
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP + 4 >> 2] = sglScp(EXP) | 0;
            MEM32[STKTOP >> 2] = sglOfs(EXP) | 0;
            EXP = sglVal(EXP) | 0;
            KON = 93;
            return _E_eval() | 0;
        }
        function _E_c_setGlobal() {
            OFS = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            SCP = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            KON = immediateVal(MEM32[STKTOP + 8 >> 2] | 0) | 0;
            vectorSet(vectorRef(ENV, SCP) | 0, OFS, VAL);
            STKTOP = STKTOP + 12 | 0;
            return KON | 0;
        }
        function _E_evalDfv() {
            claim();
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP >> 2] = dfvOfs(EXP) | 0;
            EXP = dfvVal(EXP) | 0;
            KON = 95;
            return _E_eval() | 0;
        }
        function _E_c_evalDfv() {
            OFS = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            KON = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            vectorSet(FRM, OFS, VAL);
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _E_evalDff() {
            claim();
            VAL = makePrc(dffArgc(EXP) | 0, dffFrmSiz(EXP) | 0, dffBdy(EXP) | 0, extendEnv() | 0) | 0;
            OFS = immediateVal(dffOfs(EXP) | 0) | 0;
            vectorSet(FRM, OFS, VAL);
            return KON | 0;
        }
        function _E_evalDfz() {
            claim();
            VAL = makePrz(dfzArgc(EXP) | 0, dfzFrmSiz(EXP) | 0, dfzBdy(EXP) | 0, extendEnv() | 0) | 0;
            OFS = immediateVal(dfzOfs(EXP) | 0) | 0;
            vectorSet(FRM, OFS, VAL);
            return KON | 0;
        }
        function _E_evalSeq() {
            claim();
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP + 4 >> 2] = EXP;
            MEM32[STKTOP >> 2] = 5;
            EXP = sequenceAt(EXP, 1) | 0;
            KON = 99;
            return _E_eval() | 0;
        }
        function _E_c_sequence() {
            IDX = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            EXP = sequenceAt(MEM32[STKTOP + 4 >> 2] | 0, IDX) | 0;
            MEM32[STKTOP >> 2] = makeImmediate(IDX + 1 | 0) | 0;
            return _E_eval() | 0;
        }
        function _E_evalStl() {
            EXP = stlExp(EXP) | 0;
            KON = immediateVal(MEM32[STKTOP + 8 >> 2] | 0) | 0;
            STKTOP = STKTOP + 12 | 0;
            return _E_eval() | 0;
        }
        function _E_evalIfs() {
            claim();
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP >> 2] = ifsConsequence(EXP) | 0;
            EXP = ifsPredicate(EXP) | 0;
            KON = 102;
            return _E_eval() | 0;
        }
        function _E_c_ifs() {
            KON = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            if ((VAL | 0) != 2147483641) {
                EXP = MEM32[STKTOP >> 2] | 0;
                STKTOP = STKTOP + 8 | 0;
                return _E_eval() | 0;
            }
            VAL = 2147483647;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _E_evalIff() {
            claim();
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP >> 2] = EXP;
            EXP = iffPredicate(EXP) | 0;
            KON = 104;
            return _E_eval() | 0;
        }
        function _E_c_iff() {
            EXP = (VAL | 0) == 2147483641 ? iffAlternative(MEM32[STKTOP >> 2] | 0) | 0 : iffConsequence(MEM32[STKTOP >> 2] | 0) | 0;
            KON = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            STKTOP = STKTOP + 8 | 0;
            return _E_eval() | 0;
        }
        function _E_evalTtk() {
            SIZ = immediateVal(ttkSiz(EXP) | 0) | 0;
            claimSiz(SIZ);
            ENV = extendEnv() | 0;
            FRM = fillVector(SIZ, 2147483647) | 0;
            EXP = ttkExp(EXP) | 0;
            return _E_eval() | 0;
        }
        function _E_evalThk() {
            SIZ = immediateVal(thunkSiz(EXP) | 0) | 0;
            claimSiz(SIZ);
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP + 4 >> 2] = ENV;
            MEM32[STKTOP >> 2] = FRM;
            ENV = extendEnv() | 0;
            FRM = fillVector(SIZ, 2147483647) | 0;
            EXP = thunkExp(EXP) | 0;
            KON = 143;
            return _E_eval() | 0;
        }
        function _E_evalAlz() {
            VAL = vectorRef(FRM, alzOfs(EXP) | 0) | 0;
            return _E_evalAZ() | 0;
        }
        function _E_evalAgz() {
            VAL = vectorRef(vectorRef(ENV, agzScp(EXP) | 0) | 0, agzOfs(EXP) | 0) | 0;
            return _E_evalAZ() | 0;
        }
        function _E_evalApz() {
            claim();
            STKTOP = STKTOP - 4 | 0;
            MEM32[STKTOP >> 2] = makeImmediate(KON) | 0;
            EXP = apzOpr(EXP) | 0;
            KON = 110;
            return _E_eval() | 0;
        }
        function _E_c_evalApz() {
            KON = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            STKTOP = STKTOP + 4 | 0;
            return _E_evalAZ() | 0;
        }
        function _E_evalAZ() {
            switch (tag(VAL) | 0) {
            case 4:
                if (immediateVal(prcArgc(VAL) | 0) | 0) {
                    err_invalidParamCount();
                    return 164;
                }
                SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                claimSiz(SIZ);
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                FRM = SIZ ? fillVector(SIZ, 2147483647) | 0 : __EMPTY_VEC__;
                ENV = prcEnv(VAL) | 0;
                EXP = prcBdy(VAL) | 0;
                KON = 143;
                return 89;
            case 36:
                if (immediateVal(przArgc(VAL) | 0) | 0) {
                    err_invalidParamCount();
                    return 164;
                }
                SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                claimSiz(SIZ);
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                FRM = SIZ ? fillVector(SIZ, 2147483645) | 0 : __EMPTY_VEC__;
                ENV = przEnv(VAL) | 0;
                EXP = przBdy(VAL) | 0;
                KON = 143;
                return 89;
            case 70:
                LEN = 0;
                return nativePtr(VAL) | 0;
            case 24:
                err_invalidParamCount();
                return 164;
            }
            err_invalidOperator(VAL | 0);
            return 164;
        }
        function _E_evalTlz() {
            VAL = vectorRef(FRM, tlzOfs(EXP) | 0) | 0;
            return _E_evalTZ() | 0;
        }
        function _E_evalTgz() {
            VAL = vectorRef(vectorRef(ENV, tgzScp(EXP) | 0) | 0, tgzOfs(EXP) | 0) | 0;
            return _E_evalTZ() | 0;
        }
        function _E_evalTpz() {
            claim();
            STKTOP = STKTOP - 4 | 0;
            MEM32[STKTOP >> 2] = makeImmediate(KON) | 0;
            EXP = tpzOpr(EXP) | 0;
            KON = 115;
            return _E_eval() | 0;
        }
        function _E_c_evalTpz() {
            KON = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            STKTOP = STKTOP + 4 | 0;
            return _E_evalTZ() | 0;
        }
        function _E_evalTZ() {
            switch (tag(VAL) | 0) {
            case 4:
                if (immediateVal(prcArgc(VAL) | 0) | 0) {
                    err_invalidParamCount();
                    return 164;
                }
                SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                if (SIZ) {
                    claimSiz(SIZ);
                    FRM = fillVector(SIZ, 2147483647) | 0;
                }
                ENV = prcEnv(VAL) | 0;
                EXP = prcBdy(VAL) | 0;
                return 89;
            case 36:
                if (immediateVal(przArgc(VAL) | 0) | 0) {
                    err_invalidParamCount();
                    return 164;
                }
                SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                if (SIZ) {
                    claimSiz(SIZ);
                    FRM = fillVector(SIZ, 2147483647) | 0;
                }
                ENV = przEnv(VAL) | 0;
                EXP = przBdy(VAL) | 0;
                return 89;
            case 70:
                LEN = 0;
                return nativePtr(VAL) | 0;
            case 24:
                err_invalidParamCount();
                return 164;
            }
            err_invalidOperator(VAL | 0);
            return 164;
        }
        function _E_evalAll() {
            VAL = vectorRef(FRM, immediateVal(allOfs(EXP) | 0) | 0) | 0;
            ARG = allOpd(EXP) | 0;
            return _E_evalAL() | 0;
        }
        function _E_evalAgl() {
            VAL = vectorRef(vectorRef(ENV, immediateVal(aglScp(EXP) | 0) | 0) | 0, immediateVal(aglOfs(EXP) | 0) | 0) | 0;
            ARG = aglOpd(EXP) | 0;
            return _E_evalAL() | 0;
        }
        function _E_evalApl() {
            claim();
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP >> 2] = aplOpd(EXP) | 0;
            EXP = aplOpr(EXP) | 0;
            KON = 120;
            return _E_eval() | 0;
        }
        function _E_c_evalApl() {
            ARG = MEM32[STKTOP >> 2] | 0;
            KON = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            STKTOP = STKTOP + 8 | 0;
            return _E_evalAL() | 0;
        }
        function _E_evalAL() {
            switch (tag(VAL) | 0) {
            case 4:
                LEN = immediateVal(prcArgc(VAL) | 0) | 0;
                SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                if ((LEN | 0) != (vectorLength(ARG) | 0)) {
                    err_invalidParamCount();
                    return 164;
                }
                claimSiz(SIZ);
                PAR = fillVector(SIZ, 2147483647) | 0;
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                KON = 143;
                return _E_prcEvalArgs() | 0;
            case 36:
                LEN = immediateVal(przArgc(VAL) | 0) | 0;
                SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                if ((LEN | 0) > (vectorLength(ARG) | 0)) {
                    err_invalidParamCount();
                    return 164;
                }
                claimSiz(SIZ);
                PAR = fillVector(SIZ, 2147483645) | 0;
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                KON = 143;
                if (LEN) {
                    return _E_przArgs() | 0;
                }
                IDX = 0;
                LEN = 1;
                return _E_przVarArgs() | 0;
            case 70:
                LEN = vectorLength(ARG) | 0;
                claimSiz(LEN);
                PAR = fillVector(LEN, 2147483647) | 0;
                return _E_nativeArgs() | 0;
            case 24:
                LEN = vectorLength(ARG) | 0;
                if ((LEN | 0) != 1) {
                    err_invalidParamCount();
                    return 164;
                }
                return _E_continuationArg() | 0;
            }
            err_invalidOperator(VAL | 0);
            return 164;
        }
        function _E_evalTll() {
            VAL = vectorRef(FRM, immediateVal(tllOfs(EXP) | 0) | 0) | 0;
            ARG = tllOpd(EXP) | 0;
            return _E_evalTL() | 0;
        }
        function _E_evalTgl() {
            VAL = vectorRef(vectorRef(ENV, immediateVal(tglScp(EXP) | 0) | 0) | 0, immediateVal(tglOfs(EXP) | 0) | 0) | 0;
            ARG = tglOpd(EXP) | 0;
            return _E_evalTL() | 0;
        }
        function _E_evalTpl() {
            claim();
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = makeImmediate(KON) | 0;
            MEM32[STKTOP >> 2] = tplOpd(EXP) | 0;
            EXP = tplOpr(EXP) | 0;
            KON = 125;
            return _E_eval() | 0;
        }
        function _E_c_evalTpl() {
            ARG = MEM32[STKTOP >> 2] | 0;
            KON = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            STKTOP = STKTOP + 8 | 0;
            return _E_evalTL() | 0;
        }
        function _E_evalTL() {
            switch (tag(VAL) | 0) {
            case 4:
                LEN = immediateVal(prcArgc(VAL) | 0) | 0;
                SIZ = immediateVal(prcFrmSiz(VAL) | 0) | 0;
                if ((LEN | 0) != (vectorLength(ARG) | 0)) {
                    err_invalidParamCount();
                    return 164;
                }
                claimSiz(SIZ);
                PAR = fillVector(SIZ, 2147483647) | 0;
                return _E_prcEvalArgs() | 0;
            case 36:
                LEN = immediateVal(przArgc(VAL) | 0) | 0;
                SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                if ((LEN | 0) > (vectorLength(ARG) | 0)) {
                    err_invalidParamCount();
                    return 164;
                }
                claimSiz(SIZ);
                PAR = fillVector(SIZ, 2147483645) | 0;
                if (LEN) {
                    return _E_przArgs() | 0;
                }
                IDX = 0;
                LEN = 1;
                return _E_przVarArgs() | 0;
            case 70:
                LEN = vectorLength(ARG) | 0;
                claimSiz(LEN);
                PAR = fillVector(LEN, 2147483647) | 0;
                return _E_nativeArgs() | 0;
            case 24:
                LEN = vectorLength(ARG) | 0;
                if ((LEN | 0) != 1) {
                    err_invalidParamCount();
                    return 164;
                }
                return _E_continuationArg() | 0;
            }
            err_invalidOperator(VAL | 0);
            return 164;
        }
        function _E_continuationArg() {
            EXP = vectorRef(ARG, 1) | 0;
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
            case 36:
                break;
            case 22:
                EXP = quoExpression(EXP) | 0;
                break;
            case 7:
                EXP = lookupLocal(EXP) | 0;
                break;
            case 9:
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
                STKTOP = STKTOP - 4 | 0;
                MEM32[STKTOP >> 2] = VAL;
                KON = 128;
                return _E_eval() | 0;
            }
            KON = immediateVal(continuationKon(VAL) | 0) | 0;
            restoreStack(continuationStk(VAL) | 0);
            FRM = continuationFrm(VAL) | 0;
            ENV = continuationEnv(VAL) | 0;
            VAL = EXP;
            return KON | 0;
        }
        function _E_c_continuationArg() {
            EXP = MEM32[STKTOP >> 2] | 0;
            //no need to unwind
            KON = immediateVal(continuationKon(EXP) | 0) | 0;
            restoreStack(continuationStk(EXP) | 0);
            FRM = continuationFrm(EXP) | 0;
            ENV = continuationEnv(EXP) | 0;
            return KON | 0;
        }
        function _E_nativeArgs() {
            for (IDX = 0; (IDX | 0) < (LEN | 0);) {
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
                case 36:
                    break;
                case 22:
                    EXP = quoExpression(EXP) | 0;
                    break;
                case 7:
                    EXP = lookupLocal(EXP) | 0;
                    break;
                case 9:
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
                    if ((IDX | 0) == (LEN | 0)) {
                        STKTOP = STKTOP - 12 | 0    //last argument
;
                        MEM32[STKTOP + 8 >> 2] = //last argument
                        makeImmediate(KON) | 0;
                        MEM32[STKTOP + 4 >> 2] = VAL;
                        MEM32[STKTOP >> 2] = PAR;
                        KON = 131;
                    } else {
                        STKTOP = STKTOP - 20 | 0;
                        MEM32[STKTOP + 16 >> 2] = makeImmediate(KON) | 0;
                        MEM32[STKTOP + 12 >> 2] = VAL;
                        MEM32[STKTOP + 8 >> 2] = PAR;
                        MEM32[STKTOP + 4 >> 2] = ARG;
                        MEM32[STKTOP >> 2] = makeImmediate(IDX) | 0;
                        KON = 130;
                    }
                    return _E_eval() | 0;
                }
                vectorSet(PAR, IDX, EXP);
            }
            return nativePtr(VAL) | 0;
        }
        function _E_c_nativeArgs() {
            IDX = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            PAR = MEM32[STKTOP + 8 >> 2] | 0;
            LEN = vectorLength(ARG) | 0;
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
                case 36:
                    break;
                case 22:
                    EXP = quoExpression(EXP) | 0;
                    break;
                case 7:
                    EXP = lookupLocal(EXP) | 0;
                    break;
                case 9:
                    EXP = lookupGlobal(EXP) | 0;
                    break;
                case 18:
                    EXP = capturePrc(EXP) | 0;
                    break;
                case 34:
                    EXP = capturePrz(EXP) | 0;
                    break;
                default:
                    if ((IDX | 0) == (LEN | 0)) {
                        //last argument
                        KON = 131;
                        STKTOP = STKTOP + 8 | 0;
                    } else {
                        MEM32[STKTOP >> 2] = makeImmediate(IDX) | 0;
                    }
                    return _E_eval() | 0;
                }
                vectorSet(PAR, IDX, EXP);
            }
            VAL = MEM32[STKTOP + 12 >> 2] | 0;
            KON = immediateVal(MEM32[STKTOP + 16 >> 2] | 0) | 0;
            STKTOP = STKTOP + 20 | 0;
            return nativePtr(VAL) | 0;
        }
        function _E_applyNative() {
            PAR = MEM32[STKTOP >> 2] | 0;
            LEN = vectorLength(PAR) | 0;
            vectorSet(PAR, LEN, VAL);
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            KON = immediateVal(MEM32[STKTOP + 8 >> 2] | 0) | 0;
            STKTOP = STKTOP + 12 | 0;
            return nativePtr(VAL) | 0;
        }
        function _E_prcEvalArgs() {
            for (IDX = 0; (IDX | 0) < (LEN | 0);) {
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
                case 36:
                    break;
                case 22:
                    EXP = quoExpression(EXP) | 0;
                    break;
                case 7:
                    EXP = lookupLocal(EXP) | 0;
                    break;
                case 9:
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
                    if ((IDX | 0) == (LEN | 0)) {
                        STKTOP = STKTOP - 16 | 0    //last argument
;
                        MEM32[STKTOP + 12 >> 2] = //last argument
                        makeImmediate(KON) | 0;
                        MEM32[STKTOP + 8 >> 2] = VAL;
                        MEM32[STKTOP + 4 >> 2] = PAR;
                        MEM32[STKTOP >> 2] = makeImmediate(IDX) | 0;
                        KON = 134;
                    } else {
                        STKTOP = STKTOP - 20 | 0;
                        MEM32[STKTOP + 16 >> 2] = makeImmediate(KON) | 0;
                        MEM32[STKTOP + 12 >> 2] = VAL;
                        MEM32[STKTOP + 8 >> 2] = PAR;
                        MEM32[STKTOP + 4 >> 2] = makeImmediate(IDX) | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 133;
                    }
                    return _E_eval() | 0;
                }
                vectorSet(PAR, IDX, EXP);
            }
            FRM = PAR;
            ENV = prcEnv(VAL) | 0;
            EXP = prcBdy(VAL) | 0;
            return 89;
        }
        function _E_c_prcArgs() {
            ARG = MEM32[STKTOP >> 2] | 0;
            IDX = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            PAR = MEM32[STKTOP + 8 >> 2] | 0;
            LEN = vectorLength(ARG) | 0;
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
                case 36:
                    break;
                case 22:
                    EXP = quoExpression(EXP) | 0;
                    break;
                case 7:
                    EXP = lookupLocal(EXP) | 0;
                    break;
                case 9:
                    EXP = lookupGlobal(EXP) | 0;
                    break;
                case 18:
                    EXP = capturePrc(EXP) | 0;
                    break;
                case 34:
                    EXP = capturePrz(EXP) | 0;
                    break;
                default:
                    MEM32[STKTOP + 4 >> 2] = makeImmediate(IDX) | 0;
                    if ((IDX | 0) == (LEN | 0)) {
                        //last argument
                        KON = 134;
                        STKTOP = STKTOP + 4 | 0;
                    }
                    return _E_eval() | 0;
                }
                vectorSet(PAR, IDX, EXP);
            }
            FRM = PAR;
            VAL = MEM32[STKTOP + 12 >> 2] | 0;
            ENV = prcEnv(VAL) | 0;
            EXP = prcBdy(VAL) | 0;
            KON = immediateVal(MEM32[STKTOP + 16 >> 2] | 0) | 0;
            STKTOP = STKTOP + 20 | 0;
            return 89;
        }
        function _E_prcApply() {
            IDX = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            PAR = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            vectorSet(PAR, IDX, VAL);
            FRM = PAR;
            ENV = prcEnv(EXP) | 0;
            EXP = prcBdy(EXP) | 0;
            KON = immediateVal(MEM32[STKTOP + 12 >> 2] | 0) | 0;
            STKTOP = STKTOP + 16 | 0;
            return 89;
        }
        function _E_przArgs() {
            for (IDX = 0; (IDX | 0) < (LEN | 0);) {
                IDX = IDX + 1 | 0;
                EXP = vectorRef(ARG, IDX) | 0;
                if (evalSimpleExp() | 0) {
                    claim();
                    if ((IDX | 0) == (LEN | 0)) {
                        if (//last mandatory argument
                            (IDX | 0) == (vectorLength(ARG) | 0)) {
                            STKTOP = STKTOP - 16 | 0    //last argument
;
                            MEM32[STKTOP + 12 >> 2] = //last argument
                            makeImmediate(KON) | 0;
                            MEM32[STKTOP + 8 >> 2] = VAL;
                            MEM32[STKTOP + 4 >> 2] = PAR;
                            MEM32[STKTOP >> 2] = makeImmediate(IDX) | 0;
                            KON = 142;
                        } else {
                            STKTOP = STKTOP - 20 | 0;
                            MEM32[STKTOP + 16 >> 2] = makeImmediate(KON) | 0;
                            MEM32[STKTOP + 12 >> 2] = VAL;
                            MEM32[STKTOP + 8 >> 2] = PAR;
                            MEM32[STKTOP + 4 >> 2] = makeImmediate(IDX) | 0;
                            MEM32[STKTOP >> 2] = ARG;
                            KON = 137;
                        }
                    } else {
                        STKTOP = STKTOP - 24 | 0;
                        MEM32[STKTOP + 20 >> 2] = makeImmediate(KON) | 0;
                        MEM32[STKTOP + 16 >> 2] = VAL;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = makeImmediate(IDX) | 0;
                        MEM32[STKTOP + 4 >> 2] = ARG;
                        MEM32[STKTOP >> 2] = makeImmediate(LEN) | 0;
                        KON = 136;
                    }
                    return _E_eval() | 0;
                }
                vectorSet(PAR, IDX, EXP);
            }
            if ((IDX | 0) == (vectorLength(ARG) | 0)) {
                //no more arguments
                FRM = PAR;
                ENV = przEnv(VAL) | 0;
                EXP = przBdy(VAL) | 0;
                return 89;
            }
            LEN = IDX + 1 | 0;
            return _E_przVarArgs() | 0;
        }
        function _E_c1_przArgs() {
            LEN = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            IDX = immediateVal(MEM32[STKTOP + 8 >> 2] | 0) | 0;
            PAR = MEM32[STKTOP + 12 >> 2] | 0;
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
                case 36:
                    break;
                case 22:
                    EXP = quoExpression(EXP) | 0;
                    break;
                case 7:
                    EXP = lookupLocal(EXP) | 0;
                    break;
                case 9:
                    EXP = lookupGlobal(EXP) | 0;
                    break;
                case 18:
                    EXP = capturePrc(EXP) | 0;
                    break;
                case 34:
                    EXP = capturePrz(EXP) | 0;
                    break;
                default:
                    MEM32[STKTOP + 8 >> 2] = makeImmediate(IDX) | 0;
                    if ((IDX | 0) == (LEN | 0)) {
                        if (//last mandatory argument
                            (IDX | 0) == (vectorLength(ARG) | 0)) {
                            //last argument
                            KON = 142;
                            STKTOP = STKTOP + 8 | 0;
                        } else {
                            KON = 137;
                            STKTOP = STKTOP + 4 | 0;
                        }
                    }
                    return _E_eval() | 0;
                }
                vectorSet(PAR, IDX, EXP);
            }
            if ((IDX | 0) == (vectorLength(ARG) | 0)) {
                //no more arguments
                VAL = MEM32[STKTOP + 16 >> 2] | 0;
                FRM = PAR;
                ENV = przEnv(VAL) | 0;
                EXP = przBdy(VAL) | 0;
                KON = immediateVal(MEM32[STKTOP + 20 >> 2] | 0) | 0;
                STKTOP = STKTOP + 24 | 0;
                return 89;
            }
            STKTOP = STKTOP + 16 | 0;
            LEN = IDX + 1 | 0;
            return _E_przVarArgs2() | 0;
        }
        function _E_c2_przArgs() {
            ARG = MEM32[STKTOP >> 2] | 0;
            IDX = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            PAR = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            vectorSet(PAR, IDX, VAL);
            LEN = IDX + 1 | 0;
            return _E_przVarArgs2() | 0;
        }
        function _E_przVarArgs() {
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
                case 36:
                    break;
                case 22:
                    EXP = quoExpression(EXP) | 0;
                    break;
                case 7:
                    EXP = lookupLocal(EXP) | 0;
                    break;
                case 9:
                    EXP = lookupGlobal(EXP) | 0;
                    break;
                case 18:
                    EXP = capturePrc(EXP) | 0;
                    break;
                case 34:
                    EXP = capturePrz(EXP) | 0;
                    break;
                default:
                    if ((IDX | 0) == (SIZ | 0)) {
                        STKTOP = STKTOP - 16 | 0;
                        MEM32[STKTOP + 12 >> 2] = makeImmediate(KON) | 0;
                        MEM32[STKTOP + 8 >> 2] = VAL;
                        MEM32[STKTOP + 4 >> 2] = PAR;
                        MEM32[STKTOP >> 2] = makeImmediate(LEN) | 0;
                        KON = 141;
                    } else {
                        STKTOP = STKTOP - 24 | 0;
                        MEM32[STKTOP + 20 >> 2] = makeImmediate(KON) | 0;
                        MEM32[STKTOP + 16 >> 2] = VAL;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = makeImmediate(LEN) | 0;
                        MEM32[STKTOP + 4 >> 2] = makeImmediate(IDX) | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 140;
                    }
                    return _E_eval() | 0;
                }
                TMP = vectorRef(PAR, LEN) | 0;
                vectorSet(PAR, LEN, makePair(EXP, TMP) | 0);
            }
            TMP = vectorRef(PAR, LEN) | 0;
            vectorSet(PAR, LEN, reverse(TMP) | 0);
            FRM = PAR;
            ENV = przEnv(VAL) | 0;
            EXP = przBdy(VAL) | 0;
            return 89;
        }
        function _E_przVarArgs2() {
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
                case 36:
                    break;
                case 22:
                    EXP = quoExpression(EXP) | 0;
                    break;
                case 7:
                    EXP = lookupLocal(EXP) | 0;
                    break;
                case 9:
                    EXP = lookupGlobal(EXP) | 0;
                    break;
                case 18:
                    EXP = capturePrc(EXP) | 0;
                    break;
                case 34:
                    EXP = capturePrz(EXP) | 0;
                    break;
                default:
                    if ((IDX | 0) == (SIZ | 0)) {
                        STKTOP = STKTOP - 8 | 0;
                        MEM32[STKTOP + 4 >> 2] = PAR;
                        MEM32[STKTOP >> 2] = makeImmediate(LEN) | 0;
                        KON = 141;
                    } else {
                        STKTOP = STKTOP - 16 | 0;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = makeImmediate(LEN) | 0;
                        MEM32[STKTOP + 4 >> 2] = makeImmediate(IDX) | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 140;
                    }
                    return _E_eval() | 0;
                }
                TMP = vectorRef(PAR, LEN) | 0;
                vectorSet(PAR, LEN, makePair(EXP, TMP) | 0);
            }
            TMP = vectorRef(PAR, LEN) | 0;
            vectorSet(PAR, LEN, reverse(TMP) | 0);
            VAL = MEM32[STKTOP >> 2] | 0;
            FRM = PAR;
            ENV = przEnv(VAL) | 0;
            EXP = przBdy(VAL) | 0;
            KON = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            STKTOP = STKTOP + 8 | 0;
            return 89;
        }
        function _E_c_przVarArgs() {
            claim();
            ARG = MEM32[STKTOP >> 2] | 0;
            IDX = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            LEN = immediateVal(MEM32[STKTOP + 8 >> 2] | 0) | 0;
            PAR = MEM32[STKTOP + 12 >> 2] | 0;
            VAL = makePair(VAL, vectorRef(PAR, LEN) | 0) | 0;
            vectorSet(PAR, LEN, VAL);
            STKTOP = STKTOP + 16 | 0;
            return _E_przVarArgs2() | 0;
        }
        function _E_przApplyVarArgs() {
            claim();
            IDX = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            PAR = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            VAL = makePair(VAL, vectorRef(PAR, IDX) | 0) | 0;
            vectorSet(PAR, IDX, reverse(VAL) | 0);
            FRM = PAR;
            ENV = przEnv(EXP) | 0;
            EXP = przBdy(EXP) | 0;
            KON = immediateVal(MEM32[STKTOP + 12 >> 2] | 0) | 0;
            STKTOP = STKTOP + 16 | 0;
            return 89;
        }
        function _E_przApply() {
            IDX = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            PAR = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            vectorSet(PAR, IDX, VAL);
            FRM = PAR;
            ENV = przEnv(EXP) | 0;
            EXP = przBdy(EXP) | 0;
            KON = immediateVal(MEM32[STKTOP + 12 >> 2] | 0) | 0;
            STKTOP = STKTOP + 16 | 0;
            return 89;
        }
        function _E_c_return() {
            FRM = MEM32[STKTOP >> 2] | 0;
            ENV = MEM32[STKTOP + 4 >> 2] | 0;
            KON = immediateVal(MEM32[STKTOP + 8 >> 2] | 0) | 0;
            STKTOP = STKTOP + 12 | 0;
            return KON | 0;
        }
        function _N_addFloats() {
            while ((IDX | 0) < (LEN | 0)) {
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
                    return 164;
                }
            }
            claim();
            VAL = makeFloat(FLT) | 0;
            return KON | 0;
        }
        function _N_substractFloats() {
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
                    return 164;
                }
            }
            claim();
            VAL = makeFloat(FLT) | 0;
            return KON | 0;
        }
        function _N_multiplyFloats() {
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
                    return 164;
                }
            }
            claim();
            VAL = makeFloat(FLT) | 0;
            return KON | 0;
        }
        function _N_c1_map() {
            claim();
            VAL = reverse(makePair(VAL, MEM32[STKTOP >> 2] | 0) | 0) | 0;
            KON = immediateVal(MEM32[STKTOP + 4 >> 2] | 0) | 0;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _N_c2_map() {
            claim();
            MEM32[STKTOP + 8 >> 2] = makePair(VAL, MEM32[STKTOP + 8 >> 2] | 0) | 0;
            LST = MEM32[STKTOP >> 2] | 0;
            if (!(isPair(LST) | 0)) {
                err_invalidArgument(LST | 0);
                return 164;
            }
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            ARG = makePair(pairCar(LST) | 0, 2147483645) | 0;
            LST = pairCdr(LST) | 0;
            if (isNull(LST) | 0) {
                KON = 147;
                STKTOP = STKTOP + 8 | 0;
            } else {
                MEM32[STKTOP >> 2] = LST;
            }
            return 149;
        }
        function _N_apply() {
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
                        return 164;
                    }
                    TMP = pairCar(ARG) | 0;
                    ARG = pairCdr(ARG) | 0;
                    vectorSet(FRM, IDX, TMP);
                }
                if (!(isNull(ARG) | 0)) {
                    err_invalidParamCount();
                    return 164;
                }
                ENV = prcEnv(VAL) | 0;
                EXP = prcBdy(VAL) | 0;
                return 89;
            case 36:
                LEN = immediateVal(przArgc(VAL) | 0) | 0;
                SIZ = immediateVal(przFrmSiz(VAL) | 0) | 0;
                claimSiz(SIZ);
                preserveEnv();
                FRM = fillVector(SIZ, 2147483647) | 0;
                for (IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                    if (!(isPair(ARG) | 0)) {
                        err_invalidParamCount();
                        return 164;
                    }
                    TMP = pairCar(ARG) | 0;
                    ARG = pairCdr(ARG) | 0;
                    vectorSet(FRM, IDX, TMP);
                }
                vectorSet(FRM, IDX, ARG);
                ENV = przEnv(VAL) | 0;
                EXP = przBdy(VAL) | 0;
                return 89;
            case 70:
                for (LEN = 0, LST = ARG; isPair(LST) | 0; LEN = LEN + 1 | 0)
                    LST = pairCdr(LST) | 0;
                if (!(isNull(LST) | 0)) {
                    err_invalidArgument(ARG | 0);
                    return 164;
                }
                claimSiz(LEN);
                PAR = makeVector(LEN) | 0;
                for (IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                    TMP = pairCar(ARG) | 0;
                    ARG = pairCdr(ARG) | 0;
                    vectorSet(PAR, IDX, TMP);
                }
                return nativePtr(VAL) | 0;
            case 24:
                if (!(isPair(ARG) | 0)) {
                    err_invalidParamCount();
                    return 164;
                }
                if (!(isNull(pairCdr(ARG) | 0) | 0)) {
                    err_invalidParamCount();
                    return 164;
                }
                KON = immediateVal(continuationKon(VAL) | 0) | 0;
                restoreStack(continuationStk(VAL) | 0);
                FRM = continuationFrm(VAL) | 0;
                ENV = continuationStk(VAL) | 0;
                VAL = pairCar(ARG) | 0;
                return KON | 0;
            }
            err_invalidOperator(VAL | 0);
            return 164;
        }
        function _N_c_eval() {
            EXP = VAL;
            FRM = GLB;
            ENV = __EMPTY_VEC__;
            KON = 143;
            return 89;
        }
        function _N_c1_load() {
            EXP = VAL;
            KON = 152;
            TLC = 2147483643;
            return 60;
        }
        function _N_c2_load() {
            EXP = VAL;
            FRM = GLB;
            ENV = __EMPTY_VEC__;
            KON = 143;
            return 89;
        }
        function _N_compare() {
            TMP = tag(EXP) | 0;
            if ((TMP | 0) != (tag(ARG) | 0)) {
                VAL = 2147483641;
                return KON | 0;
            }
            switch (TMP | 0) {
            case 1:
                return _N_compareFloat() | 0;
            case 5:
                return _N_compareString() | 0;
            case 0:
                return _N_comparePair() | 0;
            case 2:
                return _N_compareVector() | 0;
            }
            VAL = (ARG | 0) == (EXP | 0) ? 2147483643 : 2147483641;
            return KON | 0;
        }
        function _N_compareFloat() {
            VAL = fround(floatNumber(EXP)) == fround(floatNumber(ARG)) ? 2147483643 : 2147483641;
            return KON | 0;
        }
        function _N_compareString() {
            LEN = textLength(ARG) | 0;
            if ((textLength(EXP) | 0) != (LEN | 0)) {
                VAL = 2147483641;
                return KON | 0;
            }
            while (LEN) {
                LEN = LEN - 1 | 0;
                if ((textGetChar(ARG, LEN) | 0) != (textGetChar(EXP, LEN) | 0)) {
                    VAL = 2147483641;
                    return KON | 0;
                }
            }
            VAL = 2147483643;
            return KON | 0;
        }
        function _N_comparePair() {
            claim();
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = pairCdr(EXP) | 0;
            MEM32[STKTOP + 4 >> 2] = pairCdr(ARG) | 0;
            EXP = pairCar(EXP) | 0;
            ARG = pairCar(ARG) | 0;
            MEM32[STKTOP >> 2] = makeImmediate(KON) | 0;
            KON = 157;
            return 153;
        }
        function _N_c_comparePair() {
            KON = immediateVal(MEM32[STKTOP >> 2] | 0) | 0;
            if ((VAL | 0) == 2147483641) {
                STKTOP = STKTOP + 12 | 0;
                return KON | 0;
            }
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            return 153;
        }
        function _N_compareVector() {
            LEN = vectorLength(ARG) | 0;
            if ((vectorLength(EXP) | 0) != (LEN | 0)) {
                VAL = 2147483641;
                return KON | 0;
            }
            if (!LEN) {
                VAL = 2147483643;
                return KON | 0;
            }
            if ((LEN | 0) > 1) {
                claim();
                STKTOP = STKTOP - 16 | 0;
                MEM32[STKTOP + 12 >> 2] = makeImmediate(KON) | 0;
                MEM32[STKTOP + 8 >> 2] = EXP;
                MEM32[STKTOP + 4 >> 2] = ARG;
                MEM32[STKTOP >> 2] = 3;
                KON = 159;
            }
            ARG = vectorRef(ARG, 1) | 0;
            EXP = vectorRef(EXP, 1) | 0;
            return 153;
        }
        function _N_c_compareVector() {
            if ((VAL | 0) == 2147483641) {
                KON = immediateVal(MEM32[STKTOP + 12 >> 2] | 0) | 0;
                STKTOP = STKTOP + 16 | 0;
                return KON | 0;
            }
            IDX = immediateVal((MEM32[STKTOP >> 2] | 0) + 1 | 0) | 0;
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            if ((IDX | 0) == (vectorLength(ARG) | 0)) {
                KON = immediateVal(MEM32[STKTOP + 12 >> 2] | 0) | 0;
                STKTOP = STKTOP + 16 | 0;
            } else {
                MEM32[STKTOP >> 2] = makeImmediate(IDX) | 0;
                KON = 159;
            }
            ARG = vectorRef(ARG, IDX) | 0;
            EXP = vectorRef(EXP, IDX) | 0;
            return 153;
        }
        function _REPL() {
            dctCheckpoint();
            KON = 161;
            promptInput();
            return 0;
        }
        function _c1_repl() {
            EXP = VAL;
            TLC = 2147483641;
            KON = 162;
            return 60;
        }
        function _c2_repl() {
            EXP = VAL;
            KON = 163;
            return 89;
        }
        function _c3_repl() {
            printOutput(VAL | 0);
            return 160;
        }
        function _error() {
            FRM = GLB;
            ENV = 2147483645;
            dctRollback();
            emptyStk();
            return 160;
        }
        function nop() {
            return 0;
        }
        function run(instr) {
            instr = instr | 0;
            for (; instr; instr = FUNTAB[instr & 255]() | 0);
        }
        var FUNTAB = [
            nop,
            _N_add,
            _N_sub,
            _N_multiply,
            _N_div,
            _N_cons,
            _N_car,
            _N_cdr,
            _N_sca,
            _N_scd,
            _N_list,
            _N_nbrEq,
            _N_seq,
            _N_leq,
            _N_sma,
            _N_lrg,
            _N_assoc,
            _N_map,
            _N_eval,
            _N_applyNat,
            _N_display,
            _N_newline,
            _N_read,
            _N_isPair,
            _N_isNull,
            _N_isSymbol,
            _N_isVector,
            _N_isString,
            _N_makeVector,
            _N_vectorRef,
            _N_vectorSet,
            _N_vectorLength,
            _N_vector,
            _N_clock,
            _N_reset,
            _N_eq,
            _N_equal,
            _N_collect,
            _N_available,
            _N_callcc,
            _N_stringRef,
            _N_stringSet,
            _N_stringLength,
            _N_random,
            _N_load,
            _N_quotient,
            _N_remainder,
            _N_error,
            _N_length,
            _N_sin,
            _N_exit,
            _R_read,
            _R_readLBR,
            _R_c1_LBR,
            _R_c2_LBR,
            _R_c3_LBR,
            _R_readQUO,
            _R_c_QUO,
            _R_readSHR,
            _R_c_vector,
            _C_compile,
            _C_compileSymbol,
            _C_compileSequence,
            _C_c1_sequence,
            _C_c2_sequence,
            _C_compileQuote,
            _C_compileInline,
            _C_c_compileInline,
            _C_compileIf,
            _C_c1_if,
            _C_c2_if,
            _C_c3_if,
            _C_c4_if,
            _C_compileParameters,
            _C_compileDefine,
            _C_c1_define,
            _C_c2_define,
            _C_c3_define,
            _C_c4_define,
            _C_compileSet,
            _C_c_set,
            _C_compileLambda,
            _C_c1_lambda,
            _C_c2_lambda,
            _C_c3_lambda,
            _C_compileApplication,
            _C_c1_application,
            _C_c2_application,
            _C_c3_application,
            _E_eval,
            _E_setLocal,
            _E_c_setLocal,
            _E_setGlobal,
            _E_c_setGlobal,
            _E_evalDfv,
            _E_c_evalDfv,
            _E_evalDff,
            _E_evalDfz,
            _E_evalSeq,
            _E_c_sequence,
            _E_evalStl,
            _E_evalIfs,
            _E_c_ifs,
            _E_evalIff,
            _E_c_iff,
            _E_evalTtk,
            _E_evalThk,
            _E_evalAlz,
            _E_evalAgz,
            _E_evalApz,
            _E_c_evalApz,
            _E_evalAZ,
            _E_evalTlz,
            _E_evalTgz,
            _E_evalTpz,
            _E_c_evalTpz,
            _E_evalTZ,
            _E_evalAll,
            _E_evalAgl,
            _E_evalApl,
            _E_c_evalApl,
            _E_evalAL,
            _E_evalTll,
            _E_evalTgl,
            _E_evalTpl,
            _E_c_evalTpl,
            _E_evalTL,
            _E_continuationArg,
            _E_c_continuationArg,
            _E_nativeArgs,
            _E_c_nativeArgs,
            _E_applyNative,
            _E_prcEvalArgs,
            _E_c_prcArgs,
            _E_prcApply,
            _E_przArgs,
            _E_c1_przArgs,
            _E_c2_przArgs,
            _E_przVarArgs,
            _E_przVarArgs2,
            _E_c_przVarArgs,
            _E_przApplyVarArgs,
            _E_przApply,
            _E_c_return,
            _N_addFloats,
            _N_substractFloats,
            _N_multiplyFloats,
            _N_c1_map,
            _N_c2_map,
            _N_apply,
            _N_c_eval,
            _N_c1_load,
            _N_c2_load,
            _N_compare,
            _N_compareFloat,
            _N_compareString,
            _N_comparePair,
            _N_c_comparePair,
            _N_compareVector,
            _N_c_compareVector,
            _REPL,
            _c1_repl,
            _c2_repl,
            _c3_repl,
            _error,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop,
            nop
        ];
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
            ttkSiz: ttkSiz,
            ttkExp: ttkExp,
            isTtk: isTtk,
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
            //applications (zero arg)
            apzOpr: apzOpr,
            isApz: isApz,
            alzOfs: alzOfs,
            isAlz: isAlz,
            agzScp: agzScp,
            agzOfs: agzOfs,
            isAgz: isAgz,
            //tail calls (zero arg)
            tpzOpr: tplOpr,
            isTpz: isTpz,
            tlzOfs: tlzOfs,
            isTlz: isTlz,
            tgzScp: tgzScp,
            tgzOfs: tgzOfs,
            isTgz: isTgz,
            //applications
            aplOpr: aplOpr,
            aplOpd: aplOpd,
            isApl: isApl,
            allOfs: allOfs,
            allOpd: allOpd,
            isAll: isAll,
            aglScp: aglScp,
            aglOfs: aglOfs,
            aglOpd: aglOpd,
            isAgl: isAgl,
            //tail calls
            tplOpr: tplOpr,
            tplOpd: tplOpd,
            isTpl: isTpl,
            tllOfs: tllOfs,
            tllOpd: tllOpd,
            isTll: isTll,
            tglScp: tglScp,
            tglOfs: tglOfs,
            tglOpd: tglOpd,
            isTgl: isTgl,
            //sequence tail
            stlExp: stlExp,
            isStl: isStl,
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
            loadCcc: symbol('call-with-current-continuation'),
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
            loadQtt: symbol('quotient'),
            loadRem: symbol('remainder'),
            loadLen: symbol('length'),
            loadSin: symbol('sin'),
            loadExi: symbol('exit'),
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
            case 7:
                return '#<local variable @ offset ' + ag.localOfs(exp) + '>';
            case 9:
                return '#<variable @ scope-level/offset: ' + ag.globalScp(exp) + '/' + ag.globalOfs(exp) + '>';
            case 6:
                return '#<sequence ' + printSequence(exp) + '>';
            case 8:
                return '#<simple-if ' + printExp(ag.ifsPredicate(exp)) + ' ' + printExp(ag.ifsConsequence(exp)) + '>';
            case 10:
                return '#<full-if ' + printExp(ag.iffPredicate(exp)) + ' ' + printExp(ag.iffConsequence(exp)) + ' ' + printExp(ag.iffAlternative(exp)) + '>';
            case 32:
                return '#<thunk (size: ' + printExp(ag.thunkSiz(exp)) + '; body: ' + printExp(ag.thunkExp(exp)) + ')>';
            case 38:
                return '#<thunk* (size: ' + printExp(ag.ttkSiz(exp)) + '; body: ' + printExp(ag.ttkExp(exp)) + ')>';
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
            case 16:
                return '#<local assignment @ offset: ' + printExp(ag.slcOfs(exp)) + ' (value: ' + printExp(ag.slcVal(exp)) + ')>';
            case 46:
                return '#<application (zero argument): ' + printExp(ag.apzOpr(exp)) + '>';
            case 27:
                return '#<local application (zero argument) @ offset ' + ag.alzOfs(exp) + '>';
            case 33:
                return '#<application (zero argument) @ scope-level/offset ' + ag.agzScp(exp) + '/' + ag.agzOfs(exp) + '>';
            case 44:
                return '#<application* (zero argument): ' + printExp(ag.tpzOpr(exp)) + '>';
            case 29:
                return '#<local application* (zero argument) @ offset ' + ag.tlzOfs(exp) + '>';
            case 35:
                return '#<application* (zero argument) @ scope-level/offset ' + ag.tgzScp(exp) + '/' + ag.tgzOfs(exp) + '>';
            case 40:
                return '#<application ' + printExp(ag.aplOpr(exp)) + ' @ ' + printExp(ag.aplOpd(exp)) + '>';
            case 48:
                return '#<local application (offset ' + printExp(ag.allOfs(exp)) + ') @ ' + printExp(ag.allOpd(exp)) + '>';
            case 52:
                return '#<application (scope/offset: ' + printExp(ag.aglScp(exp)) + '/' + printExp(ag.aglOfs(exp)) + ') @' + printExp(ag.aglOpd(exp)) + '>';
            case 50:
                return '#<local application* (offset ' + printExp(ag.tllOfs(exp)) + ') @ ' + printExp(ag.tllOpd(exp)) + '>';
            case 54:
                return '#<application* (scope/offset: ' + printExp(ag.tglScp(exp)) + '/' + printExp(ag.tglOfs(exp)) + ') @' + printExp(ag.tglOpd(exp)) + '>';
            case 42:
                return '#<application* ' + printExp(ag.tplOpr(exp)) + ' @ ' + printExp(ag.tplOpd(exp)) + '>';
            case 56:
                return '#<sequence tail (body: ' + printExp(ag.stlExp(exp)) + ')>';
            default:
                return '<unknown expression (tag: ' + tag + ')>';
            }
        }
        var printSequence = function (exp) {
            var str = '', idx = 1;
            var len = ag.sequenceLength(exp);
            while (idx < len)
                str += printExp(ag.sequenceAt(exp, idx++)) + ' ';
            str += printExp(ag.stlExp(ag.sequenceAt(exp, idx)));
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
        function invalidOperator(exp) {
            report('invalid operator:' + printExp(exp));
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
        function printCustomError(exp) {
            printErr('ERROR: ' + printExp(exp));
        }
        function printError(txt) {
            printErr('ERROR: ' + txt);
        }
        function initREPL() {
            printline('Welcome to the slip.js REPL');
            printline('');
        }
        return {
            printCustomError: printCustomError,
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
        loadQtt: pool.loadQtt,
        loadRem: pool.loadRem,
        loadLen: pool.loadLen,
        loadSin: pool.loadSin,
        loadExi: pool.loadExi,
        clock: timer.getTime,
        reset: timer.reset,
        invalidIf: errors.invalidIf,
        expectedRBR: errors.expectedRBR,
        invalidQuote: errors.invalidQuote,
        invalidDefine: errors.invalidDefine,
        invalidLambda: errors.invalidLambda,
        invalidSyntax: errors.invalidSyntax,
        invalidSequence: errors.invalidSequence,
        invalidAssignment: errors.invalidAssignment,
        invalidParameter: errors.invalidParameter,
        invalidApplication: errors.invalidApplication,
        invalidExpression: errors.invalidExpression,
        undefinedVariable: errors.undefinedVariable,
        invalidParamCount: errors.invalidParamCount,
        invalidArgument: errors.invalidArgument,
        invalidOperator: errors.invalidOperator,
        globalOverflow: errors.globalOverflow,
        invalidLength: errors.invalidLength,
        invalidRange: errors.invalidRange,
        fatalMemory: errors.fatalMemory,
        promptUserInput: io.promptUserInput,
        printError: io.printCustomError,
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