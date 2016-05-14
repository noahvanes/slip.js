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
        //registers
        var ARG = 0;
        //arguments
        var DCT = 0;
        //lexical scope
        var ENV = 0;
        //environemnt
        var EXP = 0;
        //expression
        var EXT = 0;
        //external pool
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
        var freadSymbol = foreign$2.readSymbol;
        var freadString = foreign$2.readString;
        var freadNumber = foreign$2.readNumber;
        var //dictionary
        dctDefine = foreign$2.dctDefine;
        var dctCheckpoint = foreign$2.dctCheckpoint;
        var dctRollback = foreign$2.dctRollback;
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
        var //compiler
        compile = foreign$2.compile;
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
        var loadCce = foreign$2.loadCce;
        var loadQtt = foreign$2.loadQtt;
        var loadRem = foreign$2.loadRem;
        var loadLen = foreign$2.loadLen;
        var loadSin = foreign$2.loadSin;
        var loadExi = foreign$2.loadExi;
        var loadFre = foreign$2.loadFre;
        var loadRef = foreign$2.loadRef;
        var //IO
        promptUserInput = foreign$2.promptUserInput;
        var printNewline = foreign$2.printNewline;
        var promptInput = foreign$2.promptInput;
        var fprintOutput = foreign$2.printOutput;
        var fprintError = foreign$2.printError;
        var fprintLog = foreign$2.printLog;
        var loadFile = foreign$2.loadFile;
        var initREPL = foreign$2.initREPL;
        var //custom
        random = foreign$2.random;
        //other
        var __EMPTY_VEC__ = 0;
        var __GC_COUNT__ = 0;
        var __POOL_TOP__ = 0;
        var __POOL_SIZ__ = 0;
        var __EXT_FREE__ = 0;
        var __EXT_SIZ__ = 0;
        function readSymbol() {
            return deref(freadSymbol() | 0) | 0;
        }
        function readString() {
            return deref(freadString() | 0) | 0;
        }
        function readNumber() {
            return deref(freadNumber() | 0) | 0;
        }
        function printOutput(exp) {
            exp = exp | 0;
            fprintOutput(ref(exp) | 0);
        }
        function printLog(exp) {
            exp = exp | 0;
            fprintLog(ref(exp) | 0);
        }
        function printError(exp) {
            exp = exp | 0;
            fprintError(ref(exp) | 0);
        }
        function initMemory() {
            MEMTOP = 32;
        }
        function collectGarbage() {
            STKTOP = STKTOP - 4 | 0;
            MEM32[STKTOP >> 2] = STKTOP | 2 | 0;
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
                        MEM32[ptr >> 2] = pos | 2 | 0;
                        MEM32[pos >> 2] = cel;
                        len = cel >>> 8 | 0;
                        pos = len ? ptr + (len << 2) | 0 : pos - 4 | 0;
                        continue;
                    case 2:
                    case //rBp
                        6:
                        //RBp
                        ptr = cel & 4294967293 | 0;
                        cel = MEM32[ptr >> 2] | 0;
                    case 4:
                        //Rbp
                        MEM32[ptr >> 2] = pos | 2 | 0;
                        MEM32[pos >> 2] = cel;
                        pos = pos - 4 | 0;
                    }
                    continue;
                case 2:
                    //Bp
                    pos = cel & 4294967293 | 0;
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
            src = 32;
            dst = 32;
            while ((src | 0) < (MEMTOP | 0)) {
                cel = MEM32[src >> 2] | 0;
                if (cel & 2) {
                    do {
                        //marked chunk
                        ptr = cel;
                        cel = MEM32[ptr >> 2] | 0;
                        MEM32[ptr >> 2] = dst;
                    } while (cel & 2);
                    MEM32[src >> 2] = cel | 2 | 0;
                    len = (cel >>> 8 | 0) + 1 << 2;
                    src = src + len | 0;
                    dst = dst + len | 0;
                } else {
                    //unmarked chunk
                    siz = (cel >>> 8 | 0) + 1 << 2;
                    for (cur = src + siz | 0; (cur | 0) < (MEMTOP | 0); cur = cur + len | 0, siz = siz + len | 0) {
                        cel = MEM32[cur >> 2] | 0;
                        if (cel & 2)
                            break;
                        //busy
                        len = (cel >>> 8 | 0) + 1 << 2;
                        if ((siz + len | 0) > 67108860)
                            break;
                    }
                    MEM32[src >> 2] = (((siz >> 2) - 1 | 0) << 6 | 0) << 2 | 0;
                    src = src + siz | 0;
                }
            }
        }
        function crunch() {
            var src = 0;
            var dst = 0;
            var len = 0;
            var cel = 0;
            src = 32;
            dst = 32;
            while ((src | 0) < (MEMTOP | 0)) {
                cel = MEM32[src >> 2] | 0;
                len = cel >>> 8 | 0;
                if (cel & 2) {
                    //busy
                    MEM32[dst >> 2] = cel & 4294967293 | 0;
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
        function ftag(exp) {
            exp = exp | 0;
            return ((deref(exp) | 0) & 1 ? MEM8[(deref(exp) | 0) & 31] | 0 : (MEM32[(deref(exp) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0;
        }
        function initTags() {
            MEM8[3] = 69;
            MEM8[7] = 69;
            MEM8[11] = 69;
            MEM8[15] = 69;
            MEM8[19] = 69;
            MEM8[23] = 69;
            MEM8[27] = 69;
            MEM8[31] = 69;
            MEM8[1] = 65;
            MEM8[5] = 66;
            MEM8[9] = 68;
            MEM8[13] = 67;
            MEM8[17] = 64;
            MEM8[21] = 70;
            MEM8[25] = 71;
            MEM8[29] = 72;
        }
        function fmake(tag, siz) {
            tag = tag | 0;
            siz = siz | 0;
            var chk = 0;
            if ((STKTOP - MEMTOP | 0) < ((imul(siz, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(siz, 4) | 0) + 128 | 0);
            }
            chk = MEMTOP;
            MEMTOP = MEMTOP + (siz + 1 << 2) | 0;
            MEM32[chk >> 2] = (siz << 6 | tag) << 2;
            while (siz) {
                MEM32[chk + (siz << 2) >> 2] = 2147483629;
                siz = siz - 1 | 0;
            }
            return ref(chk) | 0;
        }
        function fset(chk, idx, itm) {
            chk = chk | 0;
            idx = idx | 0;
            itm = itm | 0;
            MEM32[(deref(chk) | 0) + (idx << 2) >> 2] = deref(itm) | 0;
        }
        function fsetRaw(chk, idx, itm) {
            chk = chk | 0;
            idx = idx | 0;
            itm = itm | 0;
            MEM32[(deref(chk) | 0) + (idx << 2) >> 2] = itm;
        }
        function feq(x, y) {
            x = x | 0;
            y = y | 0;
            x = deref(x) | 0;
            y = deref(y) | 0;
            return (x | 0) == (y | 0) | 0;
        }
        function slipVoid() {
            return ref(2147483629) | 0;
        }
        function fmakeChar(code) {
            code = code | 0;
            return ref(makeChar(code) | 0) | 0;
        }
        function fcharCode(ch) {
            ch = ch | 0;
            return charCode(deref(ch) | 0) | 0;
        }
        function makeChar(charCode$2) {
            charCode$2 = charCode$2 | 0;
            return charCode$2 << 5 | 17;
        }
        function charCode(ch) {
            ch = ch | 0;
            return ch >>> 5 | 0;
        }
        function fisChar(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 64 | 0;
        }
        function fisTrue(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 65 | 0;
        }
        function fisFalse(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 66 | 0;
        }
        function fisVoid(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 67 | 0;
        }
        function fisNull(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0;
        }
        function fmakeNumber(val) {
            val = val | 0;
            return ref(val << 2 | 3) | 0;
        }
        function fnumberVal(val) {
            val = val | 0;
            return (deref(val) | 0) >> 2 | 0;
        }
        function fisNumber(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0;
        }
        function makeNative(nat) {
            nat = nat | 0;
            return nat << 5 | 21;
        }
        function fnativePtr(nat) {
            nat = nat | 0;
            return (deref(nat) | 0) >>> 5 | 0;
        }
        function fisNative(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 70 | 0;
        }
        function fmakeLocal(lcl) {
            lcl = lcl | 0;
            return ref(makeLocal(lcl) | 0) | 0;
        }
        function makeLocal(lcl) {
            lcl = lcl | 0;
            return lcl << 5 | 25;
        }
        function flocalOfs(lcl) {
            lcl = lcl | 0;
            return (deref(lcl) | 0) >>> 5 | 0;
        }
        function fisLocal(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 71 | 0;
        }
        function fmakeGlobal(ofs) {
            ofs = ofs | 0;
            return ref(makeGlobal(ofs) | 0) | 0;
        }
        function makeGlobal(ofs) {
            ofs = ofs | 0;
            return ofs << 5 | 29;
        }
        function fglobalOfs(glb) {
            glb = glb | 0;
            return (deref(glb) | 0) >>> 5 | 0;
        }
        function fisGlobal(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 72 | 0;
        }
        function makePair(car, cdr) {
            car = car | 0;
            cdr = cdr | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 0) << 2;
            MEM32[chk + 4 >> 2] = car;
            MEM32[chk + 8 >> 2] = cdr;
            return chk | 0;
        }
        function fpairCar(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fpairSetCar(chk, val) {
            chk = chk | 0;
            val = val | 0;
            MEM32[(deref(chk) | 0) + 4 >> 2] = deref(val) | 0;
        }
        function fpairCdr(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fpairSetCdr(chk, val) {
            chk = chk | 0;
            val = val | 0;
            MEM32[(deref(chk) | 0) + 8 >> 2] = deref(val) | 0;
        }
        function fisPair(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0;
        }
        ;
        function reverse(lst) {
            lst = lst | 0;
            var prv = 0;
            var nxt = 0;
            prv = 2147483625;
            while (((lst & 1 ? MEM8[lst & 31] | 0 : (MEM32[lst >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                nxt = MEM32[lst + 8 >> 2] | 0;
                MEM32[lst + 8 >> 2] = prv;
                prv = lst;
                lst = nxt;
            }
            return prv | 0;
        }
        function vectorAt(vct, idx) {
            vct = vct | 0;
            idx = idx | 0;
            return ref(MEM32[(deref(vct) | 0) + (idx << 2) >> 2] | 0) | 0;
        }
        function ffillVector(siz, fill) {
            siz = siz | 0;
            fill = fill | 0;
            var vct = 0;
            fill = deref(fill) | 0;
            vct = MEMTOP;
            MEMTOP = MEMTOP + (siz + 1 << 2) | 0;
            MEM32[vct >> 2] = (siz << 6 | 2) << 2;
            for (IDX = 1; (IDX | 0) <= (siz | 0); IDX = IDX + 1 | 0) {
                MEM32[vct + (IDX << 2) >> 2] = fill;
            }
            return vct | 0;
        }
        function fvectorLength(vct) {
            vct = vct | 0;
            return (MEM32[(deref(vct) | 0) >> 2] | 0) >>> 8 | 0;
        }
        function currentStack() {
            var len = 0;
            var idx = 0;
            var vct = 0;
            var cur = 0;
            len = stkSize() | 0;
            if ((STKTOP - MEMTOP | 0) < ((imul(len, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(len, 4) | 0) + 128 | 0);
            }
            vct = MEMTOP;
            MEMTOP = MEMTOP + (len + 1 << 2) | 0;
            MEM32[vct >> 2] = (len << 6 | 2) << 2;
            while ((idx | 0) < (len | 0)) {
                cur = MEM32[STKTOP + (idx << 2) >> 2] | 0;
                idx = idx + 1 | 0;
                MEM32[vct + (idx << 2) >> 2] = cur;
            }
            return vct | 0;
        }
        function restoreStack() {
            var len = 0;
            var exp = 0;
            emptyStk();
            len = (MEM32[PAR >> 2] | 0) >>> 8 | 0;
            if ((STKTOP - MEMTOP | 0) < ((imul(len, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(len, 4) | 0) + 128 | 0);
            }
            STKTOP = STKTOP - (len << 2) | 0;
            while (len) {
                exp = MEM32[PAR + (len << 2) >> 2] | 0;
                len = len - 1 | 0;
                MEM32[STKTOP + (len << 2) >> 2] = exp;
            }
        }
        function fisVector(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 | 0;
        }
        function makeSequence(siz) {
            siz = siz | 0;
            var seq = 0;
            seq = MEMTOP;
            MEMTOP = MEMTOP + (siz + 1 << 2) | 0;
            MEM32[seq >> 2] = (siz << 6 | 6) << 2;
            return seq | 0;
        }
        function sequenceAt(seq, idx) {
            seq = seq | 0;
            idx = idx | 0;
            return ref(MEM32[(deref(seq) | 0) + (idx << 2) >> 2] | 0) | 0;
        }
        function sequenceSet(seq, idx, val) {
            seq = seq | 0;
            idx = idx | 0;
            val = val | 0;
            MEM32[(deref(seq) | 0) + (idx << 2) >> 2] = deref(val) | 0;
        }
        function sequenceLength(seq) {
            seq = seq | 0;
            return (MEM32[(deref(seq) | 0) >> 2] | 0) >>> 8 | 0;
        }
        function fisSequence(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 6 | 0;
        }
        function makeIfs(pre, csq) {
            pre = pre | 0;
            csq = csq | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 8) << 2;
            MEM32[chk + 4 >> 2] = pre;
            MEM32[chk + 8 >> 2] = csq;
            return chk | 0;
        }
        function fifsPredicate(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fifsConsequence(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisIfs(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 8 | 0;
        }
        function makeIff(pre, csq, alt) {
            pre = pre | 0;
            csq = csq | 0;
            alt = alt | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 16 | 0;
            MEM32[chk >> 2] = (3 << 6 | 10) << 2;
            MEM32[chk + 4 >> 2] = pre;
            MEM32[chk + 8 >> 2] = csq;
            MEM32[chk + 12 >> 2] = alt;
            return chk | 0;
        }
        function fiffPredicate(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fiffConsequence(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fiffAlternative(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fisIff(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 10 | 0;
        }
        function makeQuo(quo) {
            quo = quo | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 22) << 2;
            MEM32[chk + 4 >> 2] = quo;
            return chk | 0;
        }
        function fquoExpression(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        ;
        function fisQuo(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 22 | 0;
        }
        function makeDfv(ofs, val) {
            ofs = ofs | 0;
            val = val | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 12) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = val;
            return chk | 0;
        }
        function fdfvOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fdfvVal(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisDfv(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 12 | 0;
        }
        function makeDff(ofs, arc, frc, bdy) {
            ofs = ofs | 0;
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 20 | 0;
            MEM32[chk >> 2] = (4 << 6 | 14) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = arc;
            MEM32[chk + 12 >> 2] = frc;
            MEM32[chk + 16 >> 2] = bdy;
            return chk | 0;
        }
        function fdffOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fdffArgc(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fdffFrmSiz(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fdffBdy(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 16 >> 2] | 0) | 0;
        }
        function fisDff(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 14 | 0;
        }
        function makeDfz(ofs, arc, frc, bdy) {
            ofs = ofs | 0;
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 20 | 0;
            MEM32[chk >> 2] = (4 << 6 | 30) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = arc;
            MEM32[chk + 12 >> 2] = frc;
            MEM32[chk + 16 >> 2] = bdy;
            return chk | 0;
        }
        function fdfzOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fdfzArgc(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fdfzFrmSiz(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fdfzBdy(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 16 >> 2] | 0) | 0;
        }
        function fisDfz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 30 | 0;
        }
        function makeSlc(ofs, val) {
            ofs = ofs | 0;
            val = val | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 16) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = val;
            return chk | 0;
        }
        function fslcOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fslcVal(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisSlc(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 16 | 0;
        }
        function makeSgl(scp, ofs, val) {
            scp = scp | 0;
            ofs = ofs | 0;
            val = val | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 16 | 0;
            MEM32[chk >> 2] = (3 << 6 | 20) << 2;
            MEM32[chk + 4 >> 2] = scp;
            MEM32[chk + 8 >> 2] = ofs;
            MEM32[chk + 12 >> 2] = val;
            return chk | 0;
        }
        function fsglScp(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fsglOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fsglVal(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fisSgl(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 20 | 0;
        }
        function makeContinuation(kon, frm, env, stk) {
            kon = kon | 0;
            frm = frm | 0;
            env = env | 0;
            stk = stk | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 20 | 0;
            MEM32[chk >> 2] = (4 << 6 | 24) << 2;
            MEM32[chk + 4 >> 2] = kon;
            MEM32[chk + 8 >> 2] = frm;
            MEM32[chk + 12 >> 2] = env;
            MEM32[chk + 16 >> 2] = stk;
            return chk | 0;
        }
        function fcontinuationKon(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fcontinuationFrm(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fcontinuationEnv(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fcontinuationStk(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 16 >> 2] | 0) | 0;
        }
        function fisContinuation(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 24 | 0;
        }
        function makeThk(exp, siz) {
            exp = exp | 0;
            siz = siz | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 32) << 2;
            MEM32[chk + 4 >> 2] = exp;
            MEM32[chk + 8 >> 2] = siz;
            return chk | 0;
        }
        function fthunkExp(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fthunkSiz(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisThunk(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 32 | 0;
        }
        function makeTtk(exp, siz) {
            exp = exp | 0;
            siz = siz | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 38) << 2;
            MEM32[chk + 4 >> 2] = exp;
            MEM32[chk + 8 >> 2] = siz;
            return chk | 0;
        }
        function fttkExp(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fttkSiz(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisTtk(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 38 | 0;
        }
        function makeLmb(arc, frc, bdy) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 16 | 0;
            MEM32[chk >> 2] = (3 << 6 | 18) << 2;
            MEM32[chk + 4 >> 2] = arc;
            MEM32[chk + 8 >> 2] = frc;
            MEM32[chk + 12 >> 2] = bdy;
            return chk | 0;
        }
        function flmbArgc(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function flmbFrmSiz(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function flmbBdy(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fisLmb(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 18 | 0;
        }
        function makeLmz(arc, frc, bdy) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 16 | 0;
            MEM32[chk >> 2] = (3 << 6 | 34) << 2;
            MEM32[chk + 4 >> 2] = arc;
            MEM32[chk + 8 >> 2] = frc;
            MEM32[chk + 12 >> 2] = bdy;
            return chk | 0;
        }
        function flmzArgc(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function flmzFrmSiz(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function flmzBdy(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fisLmz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 34 | 0;
        }
        function makePrc(arc, frc, bdy, env) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            env = env | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 20 | 0;
            MEM32[chk >> 2] = (4 << 6 | 4) << 2;
            MEM32[chk + 4 >> 2] = arc;
            MEM32[chk + 8 >> 2] = frc;
            MEM32[chk + 12 >> 2] = bdy;
            MEM32[chk + 16 >> 2] = env;
            return chk | 0;
        }
        function fprcArgc(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fprcFrmSiz(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fprcBdy(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fprcEnv(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 16 >> 2] | 0) | 0;
        }
        function fisPrc(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 4 | 0;
        }
        function makePrz(arc, frc, bdy, env) {
            arc = arc | 0;
            frc = frc | 0;
            bdy = bdy | 0;
            env = env | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 20 | 0;
            MEM32[chk >> 2] = (4 << 6 | 36) << 2;
            MEM32[chk + 4 >> 2] = arc;
            MEM32[chk + 8 >> 2] = frc;
            MEM32[chk + 12 >> 2] = bdy;
            MEM32[chk + 16 >> 2] = env;
            return chk | 0;
        }
        function fprzArgc(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fprzFrmSiz(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fprzBdy(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fprzEnv(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 16 >> 2] | 0) | 0;
        }
        function fisPrz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 36 | 0;
        }
        function makeApz(opr) {
            opr = opr | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 46) << 2;
            MEM32[chk + 4 >> 2] = opr;
            return chk | 0;
        }
        function fapzOpr(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fisApz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 46 | 0;
        }
        function makeAlz(ofs) {
            ofs = ofs | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 11) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            return chk | 0;
        }
        function falzOfs(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 4 >> 2] | 0;
        }
        function fisAlz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 11 | 0;
        }
        function makeAnz(scp, ofs) {
            scp = scp | 0;
            ofs = ofs | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 17) << 2;
            MEM32[chk + 4 >> 2] = scp;
            MEM32[chk + 8 >> 2] = ofs;
            return chk | 0;
        }
        function fanzScp(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 4 >> 2] | 0;
        }
        function fanzOfs(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 8 >> 2] | 0;
        }
        function fisAnz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 17 | 0;
        }
        function makeAgz(ofs) {
            ofs = ofs | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 9) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            return chk | 0;
        }
        function fagzOfs(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 4 >> 2] | 0;
        }
        function fisAgz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 9 | 0;
        }
        function makeTpz(opr) {
            opr = opr | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 44) << 2;
            MEM32[chk + 4 >> 2] = opr;
            return chk | 0;
        }
        function ftpzOpr(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fisTpz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 44 | 0;
        }
        function makeTlz(ofs) {
            ofs = ofs | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 13) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            return chk | 0;
        }
        function ftlzOfs(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 4 >> 2] | 0;
        }
        function fisTlz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 13 | 0;
        }
        function makeTnz(scp, ofs) {
            scp = scp | 0;
            ofs = ofs | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 19) << 2;
            MEM32[chk + 4 >> 2] = scp;
            MEM32[chk + 8 >> 2] = ofs;
            return chk | 0;
        }
        function ftnzScp(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 4 >> 2] | 0;
        }
        function ftnzOfs(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 8 >> 2] | 0;
        }
        function fisTnz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 19 | 0;
        }
        function makeTgz(ofs) {
            ofs = ofs | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 7) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            return chk | 0;
        }
        function ftgzOfs(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 4 >> 2] | 0;
        }
        function fisTgz(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 7 | 0;
        }
        function makeApl(opr, opd) {
            opr = opr | 0;
            opd = opd | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 40) << 2;
            MEM32[chk + 4 >> 2] = opr;
            MEM32[chk + 8 >> 2] = opd;
            return chk | 0;
        }
        function faplOpr(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function faplOpd(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisApl(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 40 | 0;
        }
        function makeAll(ofs, opd) {
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 48) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = opd;
            return chk | 0;
        }
        function fallOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fallOpd(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisAll(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 48 | 0;
        }
        function makeAnl(scp, ofs, opd) {
            scp = scp | 0;
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 16 | 0;
            MEM32[chk >> 2] = (3 << 6 | 58) << 2;
            MEM32[chk + 4 >> 2] = scp;
            MEM32[chk + 8 >> 2] = ofs;
            MEM32[chk + 12 >> 2] = opd;
            return chk | 0;
        }
        function fanlScp(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fanlOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fanlOpd(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fisAnl(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 58 | 0;
        }
        function makeAgl(ofs, opd) {
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 52) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = opd;
            return chk | 0;
        }
        function faglOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function faglOpd(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisAgl(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 52 | 0;
        }
        function makeTpl(opr, opd) {
            opr = opr | 0;
            opd = opd | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 42) << 2;
            MEM32[chk + 4 >> 2] = opr;
            MEM32[chk + 8 >> 2] = opd;
            return chk | 0;
        }
        function ftplOpr(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function ftplOpd(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisTpl(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 42 | 0;
        }
        function makeTll(ofs, opd) {
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 50) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = opd;
            return chk | 0;
        }
        function ftllOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function ftllOpd(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisTll(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 50 | 0;
        }
        function makeTnl(scp, ofs, opd) {
            scp = scp | 0;
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 16 | 0;
            MEM32[chk >> 2] = (3 << 6 | 60) << 2;
            MEM32[chk + 4 >> 2] = scp;
            MEM32[chk + 8 >> 2] = ofs;
            MEM32[chk + 12 >> 2] = opd;
            return chk | 0;
        }
        function ftnlScp(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function ftnlOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function ftnlOpd(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fisTnl(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 60 | 0;
        }
        function makeTgl(ofs, opd) {
            ofs = ofs | 0;
            opd = opd | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 54) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = opd;
            return chk | 0;
        }
        function ftglOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function ftglOpd(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fisTgl(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 54 | 0;
        }
        function makeStl(exp) {
            exp = exp | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 56) << 2;
            MEM32[chk + 4 >> 2] = exp;
            return chk | 0;
        }
        function fstlExp(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fisStl(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 56 | 0;
        }
        function makePrt(exp) {
            exp = exp | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 8 | 0;
            MEM32[chk >> 2] = (1 << 6 | 62) << 2;
            MEM32[chk + 4 >> 2] = exp;
            return chk | 0;
        }
        function fprtExp(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fisPrt(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 62 | 0;
        }
        function makeNlc(scp, ofs) {
            scp = scp | 0;
            ofs = ofs | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 12 | 0;
            MEM32[chk >> 2] = (2 << 6 | 15) << 2;
            MEM32[chk + 4 >> 2] = scp;
            MEM32[chk + 8 >> 2] = ofs;
            return chk | 0;
        }
        function fnlcScp(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 4 >> 2] | 0;
        }
        function fnlcOfs(chk) {
            chk = chk | 0;
            return MEM32[(deref(chk) | 0) + 8 >> 2] | 0;
        }
        function fisNlc(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 15 | 0;
        }
        function fmakeFloat(nbr) {
            nbr = fround(nbr);
            var flt = 0;
            flt = MEMTOP;
            MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
            MEM32[flt >> 2] = (1 << 6 | 1) << 2;
            FLT32[flt + 4 >> 2] = nbr;
            return ref(flt) | 0;
        }
        function ffloatNumber(flt) {
            flt = flt | 0;
            return fround(FLT32[(deref(flt) | 0) + 4 >> 2]);
        }
        function fisFloat(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 1 | 0;
        }
        function makeText(tag, len) {
            tag = tag | 0;
            len = len | 0;
            var chk = 0;
            var siz = 0;
            if ((STKTOP - MEMTOP | 0) < ((imul(siz >> 2, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(siz >> 2, 4) | 0) + 128 | 0);
            }
            for (siz = len; siz & 3; siz = siz + 1 | 0);
            chk = MEMTOP;
            MEMTOP = MEMTOP + ((siz >> 2) + 1 << 2) | 0;
            MEM32[chk >> 2] = (siz >> 2 << 6 | tag) << 2;
            for (len = len + 4 | 0, siz = siz + 4 | 0; (len | 0) < (siz | 0); len = len + 1 | 0)
                MEM8[chk + len | 0] = 0;
            return ref(chk) | 0;
        }
        function textSetChar(txt, idx, chr) {
            txt = txt | 0;
            idx = idx | 0;
            chr = chr | 0;
            MEM8[(deref(txt) | 0) + (idx + 4 | 0) | 0] = chr;
        }
        function textGetChar(txt, idx) {
            txt = txt | 0;
            idx = idx | 0;
            return MEM8[(deref(txt) | 0) + (idx + 4 | 0) | 0] | 0;
        }
        function textLength(txt) {
            txt = txt | 0;
            var len = 0;
            txt = deref(txt) | 0;
            len = ((MEM32[txt >> 2] | 0) >>> 8 | 0) << 2;
            if (len)
                for (; !(MEM8[txt + (len + 3 | 0) | 0] | 0); len = len - 1 | 0);
            return len | 0;
        }
        function makeString(len) {
            len = len | 0;
            return makeText(5, len) | 0;
        }
        function fisString(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0;
        }
        function makeSymbol(len) {
            len = len | 0;
            return makeText(3, len) | 0;
        }
        function fisSymbol(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 3 | 0;
        }
        function initExt() {
            __EXT_FREE__ = 1;
            __EXT_SIZ__ = 64;
            EXT = MEMTOP;
            MEMTOP = MEMTOP + (__EXT_SIZ__ + 1 << 2) | 0;
            MEM32[EXT >> 2] = (__EXT_SIZ__ << 6 | 2) << 2;
            initFreeList();
        }
        function initFreeList() {
            var idx = 0;
            var nbr = 0;
            for (idx = __EXT_FREE__; (idx | 0) <= (__EXT_SIZ__ | 0); idx = idx + 1 | 0) {
                nbr = (idx + 1 | 0) << 2 | 3 | 0;
                MEM32[EXT + (idx << 2) >> 2] = nbr;
            }
        }
        function growExt() {
            var idx = 0;
            var val = 0;
            __EXT_SIZ__ = imul(__EXT_SIZ__, 2) | 0;
            if ((STKTOP - MEMTOP | 0) < ((imul(__EXT_SIZ__, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(__EXT_SIZ__, 4) | 0) + 128 | 0);
            }
            TMP = MEMTOP;
            MEMTOP = MEMTOP + (__EXT_SIZ__ + 1 << 2) | 0;
            MEM32[TMP >> 2] = (__EXT_SIZ__ << 6 | 2) << 2;
            for (idx = 1; (idx | 0) < (__EXT_FREE__ | 0); idx = idx + 1 | 0) {
                val = MEM32[EXT + (idx << 2) >> 2] | 0;
                MEM32[TMP + (idx << 2) >> 2] = val;
            }
            EXT = TMP;
            initFreeList();
        }
        function ref(val) {
            val = val | 0;
            VAL = val;
            if ((__EXT_FREE__ | 0) > (__EXT_SIZ__ | 0)) {
                growExt();
            }
            IDX = __EXT_FREE__;
            __EXT_FREE__ = MEM32[EXT + (__EXT_FREE__ << 2) >> 2] | 0;
            __EXT_FREE__ = __EXT_FREE__ >> 2 | 0;
            MEM32[EXT + (IDX << 2) >> 2] = VAL;
            return IDX | 0;
        }
        function free(idx) {
            idx = idx | 0;
            VAL = MEM32[EXT + (idx << 2) >> 2] | 0;
            IDX = __EXT_FREE__ << 2 | 3 | 0;
            __EXT_FREE__ = idx | 0;
            MEM32[EXT + (idx << 2) >> 2] = IDX;
            return unpack(VAL) | 0;
        }
        function clearRefs() {
            var i = 0;
            __EXT_FREE__ = __EXT_SIZ__ + 1 | 0;
            for (i = 1; (i | 0) <= (__EXT_SIZ__ | 0); i = i + 1 | 0)
                if (!((((MEM32[EXT + (i << 2) >> 2] | 0) & 1 ? MEM8[(MEM32[EXT + (i << 2) >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[EXT + (i << 2) >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 62 | 0 | 0))
                    free(i) | 0;
        }
        function unpack(exp) {
            exp = exp | 0;
            if (((exp & 1 ? MEM8[exp & 31] | 0 : (MEM32[exp >> 2] | 0) >>> 2 & 63 | 0) | 0) == 62 | 0 | 0 | 0)
                return MEM32[exp + 4 >> 2] | 0;
            return exp | 0;
        }
        function deref(idx) {
            idx = idx | 0;
            var exp = 0;
            exp = MEM32[EXT + (idx << 2) >> 2] | 0;
            return unpack(exp) | 0;
        }
        function protect(idx) {
            idx = idx | 0;
            VAL = MEM32[EXT + (idx << 2) >> 2] | 0;
            if (!(((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) == 62 | 0 | 0)) {
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                ;
                VAL = makePrt(VAL) | 0;
                MEM32[EXT + (idx << 2) >> 2] = VAL;
            }
        }
        function initEnvironment() {
            GLB = MEMTOP;
            MEMTOP = MEMTOP + (256 + 1 << 2) | 0;
            MEM32[GLB >> 2] = (256 << 6 | 2) << 2;
            for (IDX = 1; (IDX | 0) <= (256 | 0); IDX = IDX + 1 | 0) {
                MEM32[GLB + (IDX << 2) >> 2] = 2147483629;
            }
            FRM = GLB;
            ENV = __EMPTY_VEC__;
        }
        function extendEnv() {
            var env = 0;
            var len = 0;
            var idx = 0;
            len = ((MEM32[ENV >> 2] | 0) >>> 8 | 0) + 1 | 0;
            if ((STKTOP - MEMTOP | 0) < ((imul(len, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(len, 4) | 0) + 128 | 0);
            }
            env = MEMTOP;
            MEMTOP = MEMTOP + (len + 1 << 2) | 0;
            MEM32[env >> 2] = (len << 6 | 2) << 2;
            for (idx = 1; (idx | 0) < (len | 0); idx = idx + 1 | 0)
                MEM32[env + (idx << 2) >> 2] = MEM32[ENV + (idx << 2) >> 2] | 0;
            MEM32[env + (len << 2) >> 2] = FRM;
            return env | 0;
        }
        function preserveEnv() {
            if ((KON | 0) != 239) {
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = KON;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                KON = 239;
            }
        }
        function initNatives() {
            addNative(loadFre() | 0, 11);
            addNative(loadRef() | 0, 13);
            addNative(loadExi() | 0, 103);
            addNative(loadSin() | 0, 101);
            addNative(loadLen() | 0, 99);
            addNative(loadRem() | 0, 95);
            addNative(loadQtt() | 0, 93);
            addNative(loadErr() | 0, 97);
            addNative(loadLoa() | 0, 91);
            addNative(loadRnd() | 0, 89);
            addNative(loadSle() | 0, 87);
            addNative(loadSse() | 0, 85);
            addNative(loadSre() | 0, 83);
            addNative(loadCcc() | 0, 81);
            addNative(loadAvl() | 0, 79);
            addNative(loadCol() | 0, 77);
            addNative(loadRst() | 0, 71);
            addNative(loadClk() | 0, 69);
            addNative(loadIst() | 0, 57);
            addNative(loadIve() | 0, 55);
            addNative(loadIsy() | 0, 53);
            addNative(loadInu() | 0, 51);
            addNative(loadIpa() | 0, 49);
            addNative(loadRea() | 0, 47);
            addNative(loadNew() | 0, 45);
            addNative(loadDis() | 0, 43);
            addNative(loadEva() | 0, 39);
            addNative(loadApl() | 0, 41);
            addNative(loadCce() | 0, 81);
            //TODO: optimize implementation of call/ec
            addNative(loadMap() | 0, 37);
            addNative(loadAss() | 0, 35);
            addNative(loadVec() | 0, 67);
            addNative(loadVcl() | 0, 65);
            addNative(loadVcs() | 0, 63);
            addNative(loadVcr() | 0, 61);
            addNative(loadVcm() | 0, 59);
            addNative(loadEql() | 0, 75);
            addNative(loadEqu() | 0, 73);
            addNative(loadNeq() | 0, 25);
            addNative(loadLeq() | 0, 29);
            addNative(loadSeq() | 0, 27);
            addNative(loadSma() | 0, 31);
            addNative(loadLrg() | 0, 33);
            addNative(loadLst() | 0, 23);
            addNative(loadScd() | 0, 21);
            addNative(loadSca() | 0, 19);
            addNative(loadCdr() | 0, 17);
            addNative(loadCar() | 0, 15);
            addNative(loadCns() | 0, 9);
            addNative(loadDiv() | 0, 7);
            addNative(loadMul() | 0, 5);
            addNative(loadPls() | 0, 1);
            addNative(loadMns() | 0, 3);
        }
        function addNative(nam, ptr) {
            nam = nam | 0;
            ptr = ptr | 0;
            OFS = dctDefine(nam | 0) | 0;
            VAL = makeNative(ptr) | 0;
            MEM32[FRM + (OFS << 2) >> 2] = VAL;
        }
        function initRegs() {
            EXP = 2147483629;
            VAL = 2147483629;
            PAR = 2147483629;
            ARG = 2147483629;
            LST = 2147483629;
            ENV = 2147483629;
            FRM = 2147483629;
            GLB = 2147483629;
            PAT = 2147483629;
        }
        function init() {
            initMemory();
            initTags();
            initRegs();
            __EMPTY_VEC__ = MEMTOP;
            MEMTOP = MEMTOP + 4 | 0;
            MEM32[__EMPTY_VEC__ >> 2] = (0 << 6 | 2) << 2;
            initExt();
            initEnvironment();
            initNatives();
        }
        function Slip_REPL() {
            initREPL();
            run(269);
        }
        function inputReady() {
            run(105);
        }
        function claimCollect() {
            reclaim();
            if ((STKTOP - MEMTOP | 0) < 128) {
                err_fatalMemory();
            }
        }
        function claimSizCollect(siz) {
            siz = siz | 0;
            reclaim();
            if ((STKTOP - MEMTOP | 0) < (siz | 0)) {
                err_fatalMemory();
            }
        }
        function fclaim() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
        }
        function fclaimSiz(amount) {
            amount = amount | 0;
            amount = (imul(amount, 4) | 0) + 128 | 0;
            if ((STKTOP - MEMTOP | 0) < (amount | 0)) {
                claimSizCollect(amount);
            }
        }
        function reclaim() {
            STKTOP = STKTOP - 44 | 0;
            MEM32[STKTOP + 40 >> 2] = __EMPTY_VEC__;
            MEM32[STKTOP + 36 >> 2] = EXT;
            MEM32[STKTOP + 32 >> 2] = PAT;
            MEM32[STKTOP + 28 >> 2] = GLB;
            MEM32[STKTOP + 24 >> 2] = FRM;
            MEM32[STKTOP + 20 >> 2] = ENV;
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
            ENV = MEM32[STKTOP + 20 >> 2] | 0;
            FRM = MEM32[STKTOP + 24 >> 2] | 0;
            GLB = MEM32[STKTOP + 28 >> 2] | 0;
            PAT = MEM32[STKTOP + 32 >> 2] | 0;
            EXT = MEM32[STKTOP + 36 >> 2] | 0;
            __EMPTY_VEC__ = MEM32[STKTOP + 40 >> 2] | 0;
            STKTOP = STKTOP + 44 | 0;
            __GC_COUNT__ = __GC_COUNT__ + 1 | 0;
        }
        function _N_add() {
            for (TMP = 0, IDX = 0; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0) {
                EXP = MEM32[STKTOP + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    TMP = TMP + (EXP >> 2 | 0) | 0;
                    break;
                case 1:
                    FLT = fround(fround(TMP | 0) + fround(FLT32[EXP + 4 >> 2]));
                    return _N_addFloats() | 0;
                default:
                    err_invalidArgument(EXP | 0);
                    return 275;
                }
            }
            VAL = TMP << 2 | 3 | 0;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_sub() {
            if (!LEN) {
                err_invalidParamCount();
                return 275;
            }
            VAL = MEM32[STKTOP >> 2] | 0;
            if ((LEN | 0) == 1) {
                STKTOP = STKTOP + 4 | 0;
                switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = (-(VAL >> 2 | 0) | 0) << 2 | 3 | 0;
                    return KON | 0;
                case 1:
                    if ((STKTOP - MEMTOP | 0) < 128) {
                        claimCollect();
                    }
                    VAL = MEMTOP;
                    MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
                    MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
                    FLT32[VAL + 4 >> 2] = fround(-fround(FLT32[VAL + 4 >> 2]));
                    return KON | 0;
                default:
                    err_invalidArgument(VAL | 0);
                    return 275;
                }
            }
            switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                TMP = VAL >> 2 | 0;
                for (IDX = 1; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0) {
                    EXP = MEM32[STKTOP + (IDX << 2) >> 2] | 0;
                    switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                    case 69:
                        TMP = TMP - (EXP >> 2 | 0) | 0;
                        break;
                    case 1:
                        FLT = fround(fround(TMP | 0) - fround(FLT32[EXP + 4 >> 2]));
                        return _N_substractFloats() | 0;
                    default:
                        err_invalidArgument(EXP | 0);
                        return 275;
                    }
                }
                VAL = TMP << 2 | 3 | 0;
                STKTOP = STKTOP + (LEN << 2) | 0;
                return KON | 0;
            case 1:
                FLT = fround(FLT32[VAL + 4 >> 2]);
                return _N_substractFloats() | 0;
            }
            err_invalidArgument(VAL | 0);
            return 275;
        }
        function _N_multiply() {
            for (TMP = 1, IDX = 0; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0) {
                EXP = MEM32[STKTOP + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    TMP = imul(TMP, EXP >> 2 | 0) | 0;
                    break;
                case 1:
                    FLT = fround(fround(TMP | 0) * fround(FLT32[EXP + 4 >> 2]));
                    return _N_multiplyFloats() | 0;
                default:
                    err_invalidArgument(EXP | 0);
                    return 275;
                }
            }
            VAL = TMP << 2 | 3 | 0;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_div() {
            if (!LEN) {
                err_invalidParamCount();
                return 275;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            VAL = MEM32[STKTOP >> 2] | 0;
            if ((LEN | 0) == 1) {
                STKTOP = STKTOP + 4 | 0;
                switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = MEMTOP;
                    MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
                    MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
                    FLT32[VAL + 4 >> 2] = fround(fround(1) / fround(VAL >> 2 | 0));
                    return KON | 0;
                case 1:
                    VAL = MEMTOP;
                    MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
                    MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
                    FLT32[VAL + 4 >> 2] = fround(fround(1) / fround(FLT32[VAL + 4 >> 2]));
                    return KON | 0;
                default:
                    err_invalidArgument(VAL | 0);
                    return 275;
                }
            }
            switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                FLT = fround(VAL >> 2 | 0);
                break;
            case 1:
                FLT = fround(FLT32[VAL + 4 >> 2]);
                break;
            default:
                err_invalidArgument(VAL | 0);
                return 275;
            }
            for (IDX = 1; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0) {
                EXP = MEM32[STKTOP + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    FLT = fround(FLT / fround(EXP >> 2 | 0));
                    break;
                case 1:
                    FLT = fround(FLT / fround(FLT32[EXP + 4 >> 2]));
                    break;
                default:
                    err_invalidArgument(EXP | 0);
                    return 275;
                }
            }
            VAL = MEMTOP;
            MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
            MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
            FLT32[VAL + 4 >> 2] = FLT;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_cons() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            VAL = makePair(MEM32[STKTOP >> 2] | 0, MEM32[STKTOP + 4 >> 2] | 0) | 0;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _N_free() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            VAL = free((MEM32[STKTOP >> 2] | 0) >> 2 | 0) | 0;
            printLog(EXT | 0);
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_ref() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            VAL = (ref(MEM32[STKTOP >> 2] | 0) | 0) << 2 | 3 | 0;
            printLog(EXT | 0);
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_car() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                VAL = MEM32[ARG + 4 >> 2] | 0;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_cdr() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                VAL = MEM32[ARG + 8 >> 2] | 0;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_sca() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                MEM32[ARG + 4 >> 2] = VAL;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_scd() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                MEM32[ARG + 8 >> 2] = VAL;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_list() {
            if ((STKTOP - MEMTOP | 0) < ((imul(imul(3, LEN) | 0, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(imul(3, LEN) | 0, 4) | 0) + 128 | 0);
            }
            VAL = 2147483625;
            for (IDX = LEN - 1 | 0; (IDX | 0) >= 0; IDX = IDX - 1 | 0)
                VAL = makePair(MEM32[STKTOP + (IDX << 2) >> 2] | 0, VAL) | 0;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_nbrEq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            switch ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = (ARG >> 2 | 0) == (EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(ARG >> 2 | 0) == fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            case 1:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = fround(FLT32[ARG + 4 >> 2]) == fround(EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(FLT32[ARG + 4 >> 2]) == fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_seq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            switch ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = (ARG >> 2 | 0) <= (EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(ARG >> 2 | 0) <= fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            case 1:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = fround(FLT32[ARG + 4 >> 2]) <= fround(EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(FLT32[ARG + 4 >> 2]) <= fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_leq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            switch ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = (ARG >> 2 | 0) >= (EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(ARG >> 2 | 0) >= fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            case 1:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = fround(FLT32[ARG + 4 >> 2]) >= fround(EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(FLT32[ARG + 4 >> 2]) >= fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_sma() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            switch ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = (ARG >> 2 | 0) < (EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(ARG >> 2 | 0) < fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            case 1:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = fround(FLT32[ARG + 4 >> 2]) < fround(EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(FLT32[ARG + 4 >> 2]) < fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_lrg() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            switch ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = (ARG >> 2 | 0) > (EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(ARG >> 2 | 0) > fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            case 1:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    VAL = fround(FLT32[ARG + 4 >> 2]) > fround(EXP >> 2 | 0) ? 2147483617 : 2147483621;
                    return KON | 0;
                case 1:
                    VAL = fround(FLT32[ARG + 4 >> 2]) > fround(FLT32[EXP + 4 >> 2]) ? 2147483617 : 2147483621;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_assoc() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            PAT = MEM32[STKTOP >> 2] | 0;
            LST = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            while (((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                VAL = MEM32[LST + 4 >> 2] | 0;
                if (!(((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0)) {
                    err_invalidArgument(LST | 0);
                    return 275;
                }
                if ((MEM32[VAL + 4 >> 2] | 0) == (PAT | 0)) {
                    return KON | 0;
                }
                LST = MEM32[LST + 8 >> 2] | 0;
            }
            VAL = 2147483621;
            return KON | 0;
        }
        function _N_map() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            VAL = MEM32[STKTOP >> 2] | 0;
            LST = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if ((LST | 0) == 2147483625) {
                VAL = 2147483625;
                return KON | 0;
            }
            if (!(((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0)) {
                err_invalidArgument(LST | 0);
                return 275;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            ARG = makePair(MEM32[LST + 4 >> 2] | 0, 2147483625) | 0;
            LST = MEM32[LST + 8 >> 2] | 0;
            if (((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0) {
                STKTOP = STKTOP - 8 | 0;
                MEM32[STKTOP + 4 >> 2] = KON;
                MEM32[STKTOP >> 2] = 2147483625;
                KON = 247;
            } else {
                STKTOP = STKTOP - 16 | 0;
                MEM32[STKTOP + 12 >> 2] = KON;
                MEM32[STKTOP + 8 >> 2] = 2147483625;
                MEM32[STKTOP + 4 >> 2] = VAL;
                MEM32[STKTOP >> 2] = LST;
                KON = 249;
            }
            return 251;
        }
        function _N_eval() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            EXP = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 8 >> 2] = KON;
            MEM32[STKTOP + 4 >> 2] = ENV;
            MEM32[STKTOP >> 2] = FRM;
            EXP = deref(compile(ref(EXP) | 0, 1) | 0) | 0;
            FRM = GLB;
            ENV = __EMPTY_VEC__;
            KON = 239;
            return 123;
        }
        function _N_applyNat() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            VAL = MEM32[STKTOP >> 2] | 0;
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return _N_apply() | 0;
        }
        function _N_display() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            printLog(MEM32[STKTOP >> 2] | 0);
            VAL = 2147483629;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_newline() {
            printNewline();
            VAL = 2147483629;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_read() {
            switch (LEN | 0) {
            case 0:
                promptUserInput();
                return 0;
            case 1:
                EXP = MEM32[STKTOP >> 2] | 0;
                STKTOP = STKTOP + 4 | 0;
                loadFile(EXP | 0);
                return 0;
            }
            err_invalidParamCount();
            return 275;
        }
        function _N_isPair() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_isNull() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_isSymbol() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 3 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_isVector() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_isString() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_makeVector() {
            if (!LEN) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            LEN = ARG >> 2 | 0;
            if ((LEN | 0) < 0) {
                err_invalidLength(LEN | 0);
                return 275;
            }
            if (LEN) {
                if ((STKTOP - MEMTOP | 0) < ((imul(LEN, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(LEN, 4) | 0) + 128 | 0);
                }
                TMP = LEN ? 3 : MEM32[PAR + 8 >> 2] | 0;
                VAL = MEMTOP;
                MEMTOP = MEMTOP + (LEN + 1 << 2) | 0;
                MEM32[VAL >> 2] = (LEN << 6 | 2) << 2;
                for (IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                    MEM32[VAL + (IDX << 2) >> 2] = TMP;
                }
            } else {
                VAL = __EMPTY_VEC__;
            }
            return KON | 0;
        }
        function _N_vectorRef() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            if (!(((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(EXP | 0);
                return 275;
            }
            IDX = EXP >> 2 | 0;
            LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                VAL = MEM32[ARG + ((IDX + 1 | 0) << 2) >> 2] | 0;
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 275;
        }
        function _N_vectorSet() {
            if ((LEN | 0) != 3) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            VAL = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            if (!(((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(EXP | 0);
                return 275;
            }
            IDX = EXP >> 2 | 0;
            LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                MEM32[ARG + ((IDX + 1 | 0) << 2) >> 2] = VAL;
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 275;
        }
        function _N_vectorLength() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            VAL = LEN << 2 | 3 | 0;
            return KON | 0;
        }
        function _N_vector() {
            if ((STKTOP - MEMTOP | 0) < ((imul(LEN, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(LEN, 4) | 0) + 128 | 0);
            }
            VAL = MEMTOP;
            MEMTOP = MEMTOP + (LEN + 1 << 2) | 0;
            MEM32[VAL >> 2] = (LEN << 6 | 2) << 2;
            for (IDX = 0; (IDX | 0) < (LEN | 0); IDX = TMP) {
                EXP = MEM32[STKTOP + (IDX << 2) >> 2] | 0;
                TMP = IDX + 1 | 0;
                MEM32[VAL + (TMP << 2) >> 2] = EXP;
            }
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_clock() {
            if (LEN) {
                err_invalidParamCount();
                return 275;
            }
            VAL = (clock() | 0) << 2 | 3 | 0;
            return KON | 0;
        }
        function _N_reset() {
            if (LEN) {
                err_invalidParamCount();
                return 275;
            }
            reset();
            VAL = 2147483629;
            return KON | 0;
        }
        function _N_eq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            VAL = (MEM32[STKTOP >> 2] | 0) == (MEM32[STKTOP + 4 >> 2] | 0) ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _N_equal() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            EXP = MEM32[STKTOP >> 2] | 0;
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return _N_compare() | 0;
        }
        function _N_collect() {
            reclaim();
            VAL = (STKTOP - MEMTOP | 0) << 2 | 3 | 0;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_available() {
            VAL = (STKTOP - MEMTOP | 0) << 2 | 3 | 0;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_callcc() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            VAL = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 4:
            case 36:
            case 70:
            case 24:
                ARG = currentStack() | 0;
                ARG = makeContinuation(KON, FRM, ENV, ARG) | 0;
                ARG = makePair(ARG, 2147483625) | 0;
                return _N_apply() | 0;
            }
            err_invalidArgument(VAL | 0);
            return 275;
        }
        function _N_stringRef() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            if (!(((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(EXP | 0);
                return 275;
            }
            IDX = EXP >> 2 | 0;
            LEN = textLength(ARG) | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                VAL = makeChar(textGetChar(ARG, IDX) | 0) | 0;
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 275;
        }
        function _N_stringSet() {
            if ((LEN | 0) != 3) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            VAL = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            if (!(((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(EXP | 0);
                return 275;
            }
            if (!(((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) == 64 | 0 | 0)) {
                err_invalidArgument(VAL | 0);
                return 275;
            }
            IDX = EXP >> 2 | 0;
            LEN = textLength(ARG) | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                textSetChar(ARG, IDX, charCode(VAL) | 0);
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 275;
        }
        function _N_stringLength() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            VAL = (textLength(ARG) | 0) << 2 | 3 | 0;
            return KON | 0;
        }
        function _N_random() {
            if (LEN) {
                err_invalidParamCount();
                return 275;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            VAL = MEMTOP;
            MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
            MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
            FLT32[VAL + 4 >> 2] = fround(+random());
            return KON | 0;
        }
        function _N_load() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 8 >> 2] = KON;
            MEM32[STKTOP + 4 >> 2] = ENV;
            MEM32[STKTOP >> 2] = FRM;
            KON = 253;
            loadFile(ARG | 0);
            return 0;
        }
        function _N_quotient() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            switch ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    TMP = (ARG >> 2 | 0) / (EXP >> 2 | 0) | 0;
                    VAL = TMP << 2 | 3 | 0;
                    return KON | 0;
                case 1:
                    FLT = fround(ARG >> 2 | 0);
                    FLT = fround(FLT / fround(FLT32[EXP + 4 >> 2]));
                    VAL = ~~FLT << 2 | 3 | 0;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            case 1:
                FLT = fround(FLT32[ARG + 4 >> 2]);
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    FLT = fround(FLT / fround(EXP >> 2 | 0));
                    VAL = ~~FLT << 2 | 3 | 0;
                    return KON | 0;
                case 1:
                    FLT = fround(FLT / fround(FLT32[EXP + 4 >> 2]));
                    VAL = ~~FLT << 2 | 3 | 0;
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_remainder() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            switch ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    TMP = (ARG >> 2 | 0) % (EXP >> 2 | 0) | 0;
                    VAL = TMP << 2 | 3 | 0;
                    return KON | 0;
                case 1:
                    if ((STKTOP - MEMTOP | 0) < 128) {
                        claimCollect();
                    }
                    REA = +(+(ARG >> 2 | 0) % +fround(FLT32[EXP + 4 >> 2]));
                    VAL = MEMTOP;
                    MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
                    MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
                    FLT32[VAL + 4 >> 2] = fround(REA);
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            case 1:
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                REA = +fround(FLT32[ARG + 4 >> 2]);
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    REA = +(REA % +(EXP >> 2 | 0));
                    VAL = MEMTOP;
                    MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
                    MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
                    FLT32[VAL + 4 >> 2] = fround(REA);
                    return KON | 0;
                case 1:
                    REA = +(REA % +fround(FLT32[EXP + 4 >> 2]));
                    VAL = MEMTOP;
                    MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
                    MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
                    FLT32[VAL + 4 >> 2] = fround(REA);
                    return KON | 0;
                }
                err_invalidArgument(EXP | 0);
                return 275;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_error() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[PAR + 4 >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            printError(ARG | 0);
            return 275;
        }
        function _N_length() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            LEN = 0;
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            while (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                ARG = MEM32[ARG + 8 >> 2] | 0;
                LEN = LEN + 1 | 0;
            }
            if ((ARG | 0) != 2147483625) {
                err_invalidArgument(ARG | 0);
                return 275;
            }
            VAL = LEN << 2 | 3 | 0;
            return KON | 0;
        }
        function _N_sin() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 275;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            switch ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 69:
                REA = +sin(+(ARG >> 2 | 0));
                VAL = MEMTOP;
                MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
                MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
                FLT32[VAL + 4 >> 2] = fround(REA);
                return KON | 0;
            case 1:
                REA = +sin(+fround(FLT32[ARG + 4 >> 2]));
                VAL = MEMTOP;
                MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
                MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
                FLT32[VAL + 4 >> 2] = fround(REA);
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 275;
        }
        function _N_exit() {
            return 0;
        }
        function _R_read() {
            switch (look() | 0) {
            case 40:
                return 107;
            case 35:
                return 119;
            case 39:
                return 115;
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
                VAL = 2147483625;
                return KON | 0;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            push(KON);
            push(3);
            KON = 109;
            return 105;
        }
        function _R_c1_LBR() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            if ((look() | 0) == 41) {
                skip();
                VAL = makePair(VAL, 2147483625) | 0;
                return 113;
            }
            IDX = (peek() | 0) >> 2 | 0;
            poke(VAL);
            push((IDX + 1 | 0) << 2 | 3 | 0);
            if ((look() | 0) == 46) {
                skip();
                KON = 111;
            }
            return 105;
        }
        function _R_c2_LBR() {
            if ((look() | 0) != 41) {
                err_expectedRBR(look() | 0);
                return 275;
            }
            skip();
            return 113;
        }
        function _R_c3_LBR() {
            IDX = (pop() | 0) >> 2 | 0;
            for (; IDX; IDX = IDX - 1 | 0) {
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                VAL = makePair(pop() | 0, VAL) | 0;
            }
            KON = pop() | 0;
            return KON | 0;
        }
        function _R_readQUO() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            skip();
            push(KON);
            KON = 117;
            return 105;
        }
        function _R_c_QUO() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            VAL = makePair(VAL, 2147483625) | 0;
            VAL = makePair(__QUO_SYM__, VAL) | 0;
            KON = pop() | 0;
            return KON | 0;
        }
        function _R_readSHR() {
            skip();
            switch (read() | 0) {
            case 116:
                VAL = 2147483617;
                return KON | 0;
            case 102:
                VAL = 2147483621;
                return KON | 0;
            case 92:
                VAL = makeChar(read() | 0) | 0;
                return KON | 0;
            case 40:
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                if ((look() | 0) == 41) {
                    skip();
                    VAL = makePair(__VEC_SYM__, 2147483625) | 0;
                    return KON | 0;
                }
                push(KON);
                push(7);
                KON = 121;
                return 105;
            }
            err_invalidSyntax();
            return 275;
        }
        function _R_c_vector() {
            if ((look() | 0) == 41) {
                skip();
                LEN = (pop() | 0) >> 2 | 0;
                if ((STKTOP - MEMTOP | 0) < ((imul(imul(3, LEN) | 0, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(imul(3, LEN) | 0, 4) | 0) + 128 | 0);
                }
                VAL = makePair(VAL, 2147483625) | 0;
                for (LEN = LEN - 1 | 0; LEN; LEN = LEN - 1 | 0)
                    VAL = makePair(pop() | 0, VAL) | 0;
                VAL = makePair(__VEC_SYM__, VAL) | 0;
                KON = pop() | 0;
                return KON | 0;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            IDX = (peek() | 0) >> 2 | 0;
            poke(VAL);
            push((IDX + 1 | 0) << 2 | 3 | 0);
            return 105;
        }
        function _E_eval() {
            switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                VAL = MEM32[EXP + 4 >> 2] | 0;
                return KON | 0;
            case 71:
                VAL = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                return KON | 0;
            case 72:
                VAL = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                return KON | 0;
            case 15:
                VAL = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                return KON | 0;
            case 18:
                VAL = (DCT = extendEnv() | 0, makePrc(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                return KON | 0;
            case 34:
                VAL = (DCT = extendEnv() | 0, makePrz(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
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
            case 11:
                return _E_evalAlz() | 0;
            case 17:
                return _E_evalAnz() | 0;
            case 9:
                return _E_evalAgz() | 0;
            case 46:
                return _E_evalApz() | 0;
            case 40:
                return _E_evalApl() | 0;
            case 48:
                return _E_evalAll() | 0;
            case 58:
                return _E_evalAnl() | 0;
            case 52:
                return _E_evalAgl() | 0;
            case 13:
                return _E_evalTlz() | 0;
            case 19:
                return _E_evalTnz() | 0;
            case 7:
                return _E_evalTgz() | 0;
            case 44:
                return _E_evalTpz() | 0;
            case 42:
                return _E_evalTpl() | 0;
            case 50:
                return _E_evalTll() | 0;
            case 60:
                return _E_evalTnl() | 0;
            case 54:
                return _E_evalTgl() | 0;
            }
            err_invalidExpression(EXP | 0);
            return 275;
        }
        function _E_setLocal() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = KON;
            MEM32[STKTOP >> 2] = MEM32[EXP + 4 >> 2] | 0;
            EXP = MEM32[EXP + 8 >> 2] | 0;
            KON = 127;
            return _E_eval() | 0;
        }
        function _E_c_setLocal() {
            OFS = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            MEM32[FRM + (OFS << 2) >> 2] = VAL;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _E_setGlobal() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = KON;
            MEM32[STKTOP + 4 >> 2] = MEM32[EXP + 4 >> 2] | 0;
            MEM32[STKTOP >> 2] = MEM32[EXP + 8 >> 2] | 0;
            EXP = MEM32[EXP + 12 >> 2] | 0;
            KON = 131;
            return _E_eval() | 0;
        }
        function _E_c_setGlobal() {
            OFS = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            SCP = (MEM32[STKTOP + 4 >> 2] | 0) >> 2 | 0;
            KON = MEM32[STKTOP + 8 >> 2] | 0;
            MEM32[(MEM32[ENV + (SCP << 2) >> 2] | 0) + (OFS << 2) >> 2] = VAL;
            STKTOP = STKTOP + 12 | 0;
            return KON | 0;
        }
        function _E_evalDfv() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = KON;
            MEM32[STKTOP >> 2] = MEM32[EXP + 4 >> 2] | 0;
            EXP = MEM32[EXP + 8 >> 2] | 0;
            KON = 135;
            return _E_eval() | 0;
        }
        function _E_c_evalDfv() {
            OFS = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            MEM32[FRM + (OFS << 2) >> 2] = VAL;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _E_evalDff() {
            DCT = extendEnv() | 0;
            VAL = makePrc(MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, MEM32[EXP + 16 >> 2] | 0, DCT) | 0;
            OFS = (MEM32[EXP + 4 >> 2] | 0) >> 2 | 0;
            MEM32[FRM + (OFS << 2) >> 2] = VAL;
            return KON | 0;
        }
        function _E_evalDfz() {
            DCT = extendEnv() | 0;
            VAL = makePrz(MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, MEM32[EXP + 16 >> 2] | 0, DCT) | 0;
            OFS = (MEM32[EXP + 4 >> 2] | 0) >> 2 | 0;
            MEM32[FRM + (OFS << 2) >> 2] = VAL;
            return KON | 0;
        }
        function _E_evalSeq() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = KON;
            MEM32[STKTOP + 4 >> 2] = EXP;
            MEM32[STKTOP >> 2] = 11;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = 143;
            return _E_eval() | 0;
        }
        function _E_c_sequence() {
            IDX = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            EXP = MEM32[(MEM32[STKTOP + 4 >> 2] | 0) + (IDX << 2) >> 2] | 0;
            MEM32[STKTOP >> 2] = (IDX + 1 | 0) << 2 | 3 | 0;
            return _E_eval() | 0;
        }
        function _E_evalStl() {
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            return _E_eval() | 0;
        }
        function _E_evalIfs() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = KON;
            MEM32[STKTOP >> 2] = MEM32[EXP + 8 >> 2] | 0;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = 149;
            return _E_eval() | 0;
        }
        function _E_c_ifs() {
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            if ((VAL | 0) != 2147483621) {
                EXP = MEM32[STKTOP >> 2] | 0;
                STKTOP = STKTOP + 8 | 0;
                return _E_eval() | 0;
            }
            VAL = 2147483629;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _E_evalIff() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = KON;
            MEM32[STKTOP >> 2] = EXP;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = 153;
            return _E_eval() | 0;
        }
        function _E_c_iff() {
            EXP = (VAL | 0) == 2147483621 ? MEM32[(MEM32[STKTOP >> 2] | 0) + 12 >> 2] | 0 : MEM32[(MEM32[STKTOP >> 2] | 0) + 8 >> 2] | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return _E_eval() | 0;
        }
        function _E_evalTtk() {
            SIZ = (MEM32[EXP + 8 >> 2] | 0) >> 2 | 0;
            if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
            }
            ENV = extendEnv() | 0;
            FRM = MEMTOP;
            MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
            MEM32[FRM >> 2] = (SIZ << 6 | 2) << 2;
            for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                MEM32[FRM + (IDX << 2) >> 2] = 2147483629;
            }
            EXP = MEM32[EXP + 4 >> 2] | 0;
            return _E_eval() | 0;
        }
        function _E_evalThk() {
            SIZ = (MEM32[EXP + 8 >> 2] | 0) >> 2 | 0;
            if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
            }
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = KON;
            MEM32[STKTOP + 4 >> 2] = ENV;
            MEM32[STKTOP >> 2] = FRM;
            ENV = extendEnv() | 0;
            FRM = MEMTOP;
            MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
            MEM32[FRM >> 2] = (SIZ << 6 | 2) << 2;
            for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                MEM32[FRM + (IDX << 2) >> 2] = 2147483629;
            }
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = 239;
            return _E_eval() | 0;
        }
        function _E_evalAlz() {
            VAL = MEM32[FRM + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0;
            return _E_evalAZ() | 0;
        }
        function _E_evalAnz() {
            VAL = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
            return _E_evalAZ() | 0;
        }
        function _E_evalAgz() {
            VAL = MEM32[GLB + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0;
            return _E_evalAZ() | 0;
        }
        function _E_evalApz() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 4 | 0;
            MEM32[STKTOP >> 2] = KON;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = 167;
            return _E_eval() | 0;
        }
        function _E_c_evalApz() {
            KON = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            return _E_evalAZ() | 0;
        }
        function _E_evalAZ() {
            switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 4:
                if ((MEM32[VAL + 4 >> 2] | 0) >> 2 | 0) {
                    err_invalidParamCount();
                    return 275;
                }
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = KON;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                if (SIZ) {
                    FRM = MEMTOP;
                    MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                    MEM32[FRM >> 2] = (SIZ << 6 | 2) << 2;
                    for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                        MEM32[FRM + (IDX << 2) >> 2] = 2147483629;
                    }
                } else {
                    FRM = __EMPTY_VEC__;
                }
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                KON = 239;
                return 123;
            case 36:
                if ((MEM32[VAL + 4 >> 2] | 0) >> 2 | 0) {
                    err_invalidParamCount();
                    return 275;
                }
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = KON;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                FRM = MEMTOP;
                MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                MEM32[FRM >> 2] = (SIZ << 6 | 2) << 2;
                for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                    MEM32[FRM + (IDX << 2) >> 2] = 2147483625;
                }
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                KON = 239;
                return 123;
            case 70:
                LEN = 0;
                return VAL >>> 5 | 0;
            case 24:
                err_invalidParamCount();
                return 275;
            }
            err_invalidOperator(VAL | 0);
            return 275;
        }
        function _E_evalTlz() {
            VAL = MEM32[FRM + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0;
            return _E_evalTZ() | 0;
        }
        function _E_evalTnz() {
            VAL = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
            return _E_evalTZ() | 0;
        }
        function _E_evalTgz() {
            VAL = MEM32[GLB + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0;
            return _E_evalTZ() | 0;
        }
        function _E_evalTpz() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 4 | 0;
            MEM32[STKTOP >> 2] = KON;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = 179;
            return _E_eval() | 0;
        }
        function _E_c_evalTpz() {
            KON = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            return _E_evalTZ() | 0;
        }
        function _E_evalTZ() {
            switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 4:
                if ((MEM32[VAL + 4 >> 2] | 0) >> 2 | 0) {
                    err_invalidParamCount();
                    return 275;
                }
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if (SIZ) {
                    if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                        claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                    }
                    FRM = MEMTOP;
                    MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                    MEM32[FRM >> 2] = (SIZ << 6 | 2) << 2;
                    for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                        MEM32[FRM + (IDX << 2) >> 2] = 2147483629;
                    }
                } else {
                    FRM = __EMPTY_VEC__;
                }
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                return 123;
            case 36:
                if ((MEM32[VAL + 4 >> 2] | 0) >> 2 | 0) {
                    err_invalidParamCount();
                    return 275;
                }
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                FRM = MEMTOP;
                MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                MEM32[FRM >> 2] = (SIZ << 6 | 2) << 2;
                for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                    MEM32[FRM + (IDX << 2) >> 2] = 2147483625;
                }
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                return 123;
            case 70:
                LEN = 0;
                return VAL >>> 5 | 0;
            case 24:
                err_invalidParamCount();
                return 275;
            }
            err_invalidOperator(VAL | 0);
            return 275;
        }
        function _E_evalAll() {
            VAL = MEM32[FRM + (((MEM32[EXP + 4 >> 2] | 0) >> 2 | 0) << 2) >> 2] | 0;
            ARG = MEM32[EXP + 8 >> 2] | 0;
            return _E_evalAL() | 0;
        }
        function _E_evalAnl() {
            VAL = MEM32[(MEM32[ENV + (((MEM32[EXP + 4 >> 2] | 0) >> 2 | 0) << 2) >> 2] | 0) + (((MEM32[EXP + 8 >> 2] | 0) >> 2 | 0) << 2) >> 2] | 0;
            ARG = MEM32[EXP + 12 >> 2] | 0;
            return _E_evalAL() | 0;
        }
        function _E_evalAgl() {
            VAL = MEM32[GLB + (((MEM32[EXP + 4 >> 2] | 0) >> 2 | 0) << 2) >> 2] | 0;
            ARG = MEM32[EXP + 8 >> 2] | 0;
            return _E_evalAL() | 0;
        }
        function _E_evalApl() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = KON;
            MEM32[STKTOP >> 2] = MEM32[EXP + 8 >> 2] | 0;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = 191;
            return _E_eval() | 0;
        }
        function _E_c_evalApl() {
            ARG = MEM32[STKTOP >> 2] | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return _E_evalAL() | 0;
        }
        function _E_evalAL() {
            switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 4:
                LEN = (MEM32[VAL + 4 >> 2] | 0) >> 2 | 0;
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((LEN | 0) != ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                    err_invalidParamCount();
                    return 275;
                }
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                PAR = MEMTOP;
                MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                MEM32[PAR >> 2] = (SIZ << 6 | 2) << 2;
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = KON;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                KON = 239;
                return _E_prcEvalArgs() | 0;
            case 36:
                LEN = (MEM32[VAL + 4 >> 2] | 0) >> 2 | 0;
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((LEN | 0) > ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                    err_invalidParamCount();
                    return 275;
                }
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                PAR = MEMTOP;
                MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                MEM32[PAR >> 2] = (SIZ << 6 | 2) << 2;
                for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                    MEM32[PAR + (IDX << 2) >> 2] = 2147483625;
                }
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = KON;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                KON = 239;
                if (LEN) {
                    return _E_przArgs() | 0;
                }
                IDX = 0;
                LEN = 1;
                return _E_przVarArgs() | 0;
            case 70:
                LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
                if ((STKTOP - MEMTOP | 0) < ((imul(LEN, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(LEN, 4) | 0) + 128 | 0);
                }
                STKTOP = STKTOP - (LEN << 2) | 0;
                return _E_nativeArgs() | 0;
            case 24:
                LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
                if ((LEN | 0) != 1) {
                    err_invalidParamCount();
                    return 275;
                }
                return _E_continuationArg() | 0;
            }
            err_invalidOperator(VAL | 0);
            return 275;
        }
        function _E_evalTll() {
            VAL = MEM32[FRM + (((MEM32[EXP + 4 >> 2] | 0) >> 2 | 0) << 2) >> 2] | 0;
            ARG = MEM32[EXP + 8 >> 2] | 0;
            return _E_evalTL() | 0;
        }
        function _E_evalTnl() {
            VAL = MEM32[(MEM32[ENV + (((MEM32[EXP + 4 >> 2] | 0) >> 2 | 0) << 2) >> 2] | 0) + (((MEM32[EXP + 8 >> 2] | 0) >> 2 | 0) << 2) >> 2] | 0;
            ARG = MEM32[EXP + 12 >> 2] | 0;
            return _E_evalTL() | 0;
        }
        function _E_evalTgl() {
            VAL = MEM32[GLB + (((MEM32[EXP + 4 >> 2] | 0) >> 2 | 0) << 2) >> 2] | 0;
            ARG = MEM32[EXP + 8 >> 2] | 0;
            return _E_evalTL() | 0;
        }
        function _E_evalTpl() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = KON;
            MEM32[STKTOP >> 2] = MEM32[EXP + 8 >> 2] | 0;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            KON = 203;
            return _E_eval() | 0;
        }
        function _E_c_evalTpl() {
            ARG = MEM32[STKTOP >> 2] | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return _E_evalTL() | 0;
        }
        function _E_evalTL() {
            switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 4:
                LEN = (MEM32[VAL + 4 >> 2] | 0) >> 2 | 0;
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((LEN | 0) != ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                    err_invalidParamCount();
                    return 275;
                }
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                PAR = MEMTOP;
                MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                MEM32[PAR >> 2] = (SIZ << 6 | 2) << 2;
                return _E_prcEvalArgs() | 0;
            case 36:
                LEN = (MEM32[VAL + 4 >> 2] | 0) >> 2 | 0;
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((LEN | 0) > ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                    err_invalidParamCount();
                    return 275;
                }
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                PAR = MEMTOP;
                MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                MEM32[PAR >> 2] = (SIZ << 6 | 2) << 2;
                for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                    MEM32[PAR + (IDX << 2) >> 2] = 2147483625;
                }
                if (LEN) {
                    return _E_przArgs() | 0;
                }
                IDX = 0;
                LEN = 1;
                return _E_przVarArgs() | 0;
            case 70:
                LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
                if ((STKTOP - MEMTOP | 0) < ((imul(LEN, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(LEN, 4) | 0) + 128 | 0);
                }
                STKTOP = STKTOP - (LEN << 2) | 0;
                return _E_nativeArgs() | 0;
            case 24:
                LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
                if ((LEN | 0) != 1) {
                    err_invalidParamCount();
                    return 275;
                }
                return _E_continuationArg() | 0;
            }
            err_invalidOperator(VAL | 0);
            return 275;
        }
        function _E_continuationArg() {
            EXP = MEM32[ARG + 4 >> 2] | 0;
            switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                EXP = MEM32[EXP + 4 >> 2] | 0;
                break;
            case 71:
                EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                break;
            case 72:
                EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                break;
            case 15:
                EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                break;
            case 18:
                EXP = (DCT = extendEnv() | 0, makePrc(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                break;
            case 34:
                EXP = (DCT = extendEnv() | 0, makePrz(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                break;
            default:
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                STKTOP = STKTOP - 4 | 0;
                MEM32[STKTOP >> 2] = VAL;
                KON = 209;
                return _E_eval() | 0;
            }
            KON = MEM32[VAL + 4 >> 2] | 0;
            PAR = MEM32[VAL + 16 >> 2] | 0;
            FRM = MEM32[VAL + 8 >> 2] | 0;
            ENV = MEM32[VAL + 12 >> 2] | 0;
            restoreStack();
            VAL = EXP;
            return KON | 0;
        }
        function _E_c_continuationArg() {
            EXP = MEM32[STKTOP >> 2] | 0;
            //no need to unwind
            KON = MEM32[EXP + 4 >> 2] | 0;
            PAR = MEM32[EXP + 16 >> 2] | 0;
            FRM = MEM32[EXP + 8 >> 2] | 0;
            ENV = MEM32[EXP + 12 >> 2] | 0;
            restoreStack();
            return KON | 0;
        }
        function _E_nativeArgs() {
            for (IDX = 0; (IDX | 0) < (LEN | 0); IDX = TMP) {
                TMP = IDX + 1 | 0;
                EXP = MEM32[ARG + (TMP << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                    EXP = MEM32[EXP + 4 >> 2] | 0;
                    break;
                case 71:
                    EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 72:
                    EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 15:
                    EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                    break;
                default:
                    if ((TMP | 0) == (LEN | 0)) {
                        MEM32[STKTOP    //last argument
+ (//last argument
                        IDX << 2) >> 2] = 2147483629;
                        STKTOP = STKTOP - 12 | 0    //for GC
;
                        MEM32[STKTOP + 8 >> 2] = //for GC
                        KON;
                        MEM32[STKTOP + 4 >> 2] = VAL;
                        MEM32[STKTOP >> 2] = TMP << 2 | 3 | 0;
                        KON = 215;
                    } else {
                        for (; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0)
                            MEM32[STKTOP + (IDX << 2) >> 2] = 2147483629;
                        STKTOP = STKTOP - 16 | 0;
                        MEM32[STKTOP + 12 >> 2] = KON;
                        MEM32[STKTOP + 8 >> 2] = VAL;
                        MEM32[STKTOP + 4 >> 2] = TMP << 2 | 3 | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 213;
                    }
                    return _E_eval() | 0;
                }
                MEM32[STKTOP + (IDX << 2) >> 2] = EXP;
            }
            return VAL >>> 5 | 0;
        }
        function _E_c_nativeArgs() {
            ARG = MEM32[STKTOP >> 2] | 0;
            IDX = (MEM32[STKTOP + 4 >> 2] | 0) >> 2 | 0;
            LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            MEM32[STKTOP + (IDX + 3 << 2) >> 2] = VAL;
            for (; (IDX | 0) < (LEN | 0); IDX = TMP) {
                TMP = IDX + 1 | 0;
                EXP = MEM32[ARG + (TMP << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                    EXP = MEM32[EXP + 4 >> 2] | 0;
                    break;
                case 71:
                    EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 72:
                    EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 15:
                    EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                    break;
                case 18:
                    EXP = (DCT = extendEnv() | 0, makePrc(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                case 34:
                    EXP = (DCT = extendEnv() | 0, makePrz(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                default:
                    if ((TMP | 0) == (LEN | 0)) {
                        STKTOP = STKTOP + 4 | 0    //last argument
;
                        MEM32[STKTOP >> 2] = //last argument
                        TMP << 2 | 3 | 0;
                        KON = 215;
                    } else {
                        MEM32[STKTOP + 4 >> 2] = TMP << 2 | 3 | 0;
                    }
                    return _E_eval() | 0;
                }
                MEM32[STKTOP + (IDX + 4 << 2) >> 2] = EXP;
            }
            VAL = MEM32[STKTOP + 8 >> 2] | 0;
            KON = MEM32[STKTOP + 12 >> 2] | 0;
            STKTOP = STKTOP + 16 | 0;
            return VAL >>> 5 | 0;
        }
        function _E_applyNative() {
            LEN = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            MEM32[STKTOP + (LEN + 2 << 2) >> 2] = VAL;
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            KON = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            return VAL >>> 5 | 0;
        }
        function _E_prcEvalArgs() {
            for (IDX = 0; (IDX | 0) < (LEN | 0);) {
                IDX = IDX + 1 | 0;
                EXP = MEM32[ARG + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                    EXP = MEM32[EXP + 4 >> 2] | 0;
                    break;
                case 71:
                    EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 72:
                    EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 15:
                    EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                    break;
                default:
                    TMP = IDX << 2 | 3 | 0;
                    for (; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                        MEM32[PAR + (IDX << 2) >> 2] = 2147483629;
                    }
                    if ((IDX | 0) == (LEN | 0)) {
                        STKTOP = STKTOP - 16 | 0    //last argument
;
                        MEM32[STKTOP + 12 >> 2] = //last argument
                        KON;
                        MEM32[STKTOP + 8 >> 2] = VAL;
                        MEM32[STKTOP + 4 >> 2] = PAR;
                        MEM32[STKTOP >> 2] = TMP;
                        KON = 221;
                    } else {
                        STKTOP = STKTOP - 20 | 0;
                        MEM32[STKTOP + 16 >> 2] = KON;
                        MEM32[STKTOP + 12 >> 2] = VAL;
                        MEM32[STKTOP + 8 >> 2] = PAR;
                        MEM32[STKTOP + 4 >> 2] = TMP;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 219;
                    }
                    return _E_eval() | 0;
                }
                MEM32[PAR + (IDX << 2) >> 2] = EXP;
            }
            while ((IDX | 0) < (SIZ | 0)) {
                IDX = IDX + 1 | 0;
                MEM32[PAR + (IDX << 2) >> 2] = 2147483629;
            }
            FRM = PAR;
            ENV = MEM32[VAL + 16 >> 2] | 0;
            EXP = MEM32[VAL + 12 >> 2] | 0;
            return 123;
        }
        function _E_c_prcArgs() {
            ARG = MEM32[STKTOP >> 2] | 0;
            IDX = (MEM32[STKTOP + 4 >> 2] | 0) >> 2 | 0;
            PAR = MEM32[STKTOP + 8 >> 2] | 0;
            LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            MEM32[PAR + (IDX << 2) >> 2] = VAL;
            while ((IDX | 0) < (LEN | 0)) {
                IDX = IDX + 1 | 0;
                EXP = MEM32[ARG + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                    EXP = MEM32[EXP + 4 >> 2] | 0;
                    break;
                case 71:
                    EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 72:
                    EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 15:
                    EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                    break;
                case 18:
                    EXP = (DCT = extendEnv() | 0, makePrc(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                case 34:
                    EXP = (DCT = extendEnv() | 0, makePrz(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                default:
                    MEM32[STKTOP + 4 >> 2] = IDX << 2 | 3 | 0;
                    if ((IDX | 0) == (LEN | 0)) {
                        //last argument
                        KON = 221;
                        STKTOP = STKTOP + 4 | 0;
                    }
                    return _E_eval() | 0;
                }
                MEM32[PAR + (IDX << 2) >> 2] = EXP;
            }
            FRM = PAR;
            VAL = MEM32[STKTOP + 12 >> 2] | 0;
            ENV = MEM32[VAL + 16 >> 2] | 0;
            EXP = MEM32[VAL + 12 >> 2] | 0;
            KON = MEM32[STKTOP + 16 >> 2] | 0;
            STKTOP = STKTOP + 20 | 0;
            return _E_eval() | 0;
        }
        function _E_prcApply() {
            IDX = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            PAR = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            MEM32[PAR + (IDX << 2) >> 2] = VAL;
            FRM = PAR;
            ENV = MEM32[EXP + 16 >> 2] | 0;
            EXP = MEM32[EXP + 12 >> 2] | 0;
            KON = MEM32[STKTOP + 12 >> 2] | 0;
            STKTOP = STKTOP + 16 | 0;
            return _E_eval() | 0;
        }
        function _E_przArgs() {
            for (IDX = 0; (IDX | 0) < (LEN | 0);) {
                IDX = IDX + 1 | 0;
                EXP = MEM32[ARG + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                    EXP = MEM32[EXP + 4 >> 2] | 0;
                    break;
                case 71:
                    EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 72:
                    EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 15:
                    EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                    break;
                case 18:
                    EXP = (DCT = extendEnv() | 0, makePrc(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                case 34:
                    EXP = (DCT = extendEnv() | 0, makePrz(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                default:
                    if ((STKTOP - MEMTOP | 0) < 128) {
                        claimCollect();
                    }
                    if ((IDX | 0) == (LEN | 0)) {
                        if (//last mandatory argument
                            (IDX | 0) == ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                            STKTOP = STKTOP - 16 | 0    //last argument
;
                            MEM32[STKTOP + 12 >> 2] = //last argument
                            KON;
                            MEM32[STKTOP + 8 >> 2] = VAL;
                            MEM32[STKTOP + 4 >> 2] = PAR;
                            MEM32[STKTOP >> 2] = IDX << 2 | 3 | 0;
                            KON = 237;
                        } else {
                            STKTOP = STKTOP - 20 | 0;
                            MEM32[STKTOP + 16 >> 2] = KON;
                            MEM32[STKTOP + 12 >> 2] = VAL;
                            MEM32[STKTOP + 8 >> 2] = PAR;
                            MEM32[STKTOP + 4 >> 2] = IDX << 2 | 3 | 0;
                            MEM32[STKTOP >> 2] = ARG;
                            KON = 227;
                        }
                    } else {
                        STKTOP = STKTOP - 24 | 0;
                        MEM32[STKTOP + 20 >> 2] = KON;
                        MEM32[STKTOP + 16 >> 2] = VAL;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = IDX << 2 | 3 | 0;
                        MEM32[STKTOP + 4 >> 2] = ARG;
                        MEM32[STKTOP >> 2] = LEN << 2 | 3 | 0;
                        KON = 225;
                    }
                    return _E_eval() | 0;
                }
                MEM32[PAR + (IDX << 2) >> 2] = EXP;
            }
            if ((IDX | 0) == ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                //no more arguments
                FRM = PAR;
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                return 123;
            }
            LEN = IDX + 1 | 0;
            return _E_przVarArgs() | 0;
        }
        function _E_c1_przArgs() {
            LEN = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            IDX = (MEM32[STKTOP + 8 >> 2] | 0) >> 2 | 0;
            PAR = MEM32[STKTOP + 12 >> 2] | 0;
            MEM32[PAR + (IDX << 2) >> 2] = VAL;
            while ((IDX | 0) < (LEN | 0)) {
                IDX = IDX + 1 | 0;
                EXP = MEM32[ARG + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                    EXP = MEM32[EXP + 4 >> 2] | 0;
                    break;
                case 71:
                    EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 72:
                    EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 15:
                    EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                    break;
                case 18:
                    EXP = (DCT = extendEnv() | 0, makePrc(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                case 34:
                    EXP = (DCT = extendEnv() | 0, makePrz(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                default:
                    MEM32[STKTOP + 8 >> 2] = IDX << 2 | 3 | 0;
                    if ((IDX | 0) == (LEN | 0)) {
                        if (//last mandatory argument
                            (IDX | 0) == ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                            //last argument
                            KON = 237;
                            STKTOP = STKTOP + 8 | 0;
                        } else {
                            KON = 227;
                            STKTOP = STKTOP + 4 | 0;
                        }
                    }
                    return _E_eval() | 0;
                }
                MEM32[PAR + (IDX << 2) >> 2] = EXP;
            }
            if ((IDX | 0) == ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                //no more arguments
                VAL = MEM32[STKTOP + 16 >> 2] | 0;
                FRM = PAR;
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                KON = MEM32[STKTOP + 20 >> 2] | 0;
                STKTOP = STKTOP + 24 | 0;
                return _E_eval() | 0;
            }
            STKTOP = STKTOP + 16 | 0;
            LEN = IDX + 1 | 0;
            return _E_przVarArgs2() | 0;
        }
        function _E_c2_przArgs() {
            ARG = MEM32[STKTOP >> 2] | 0;
            IDX = (MEM32[STKTOP + 4 >> 2] | 0) >> 2 | 0;
            PAR = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            MEM32[PAR + (IDX << 2) >> 2] = VAL;
            LEN = IDX + 1 | 0;
            return _E_przVarArgs2() | 0;
        }
        function _E_przVarArgs() {
            SIZ = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            while ((IDX | 0) < (SIZ | 0)) {
                IDX = IDX + 1 | 0;
                EXP = MEM32[ARG + (IDX << 2) >> 2] | 0;
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                    EXP = MEM32[EXP + 4 >> 2] | 0;
                    break;
                case 71:
                    EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 72:
                    EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 15:
                    EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                    break;
                case 18:
                    EXP = (DCT = extendEnv() | 0, makePrc(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                case 34:
                    EXP = (DCT = extendEnv() | 0, makePrz(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                default:
                    if ((IDX | 0) == (SIZ | 0)) {
                        STKTOP = STKTOP - 16 | 0;
                        MEM32[STKTOP + 12 >> 2] = KON;
                        MEM32[STKTOP + 8 >> 2] = VAL;
                        MEM32[STKTOP + 4 >> 2] = PAR;
                        MEM32[STKTOP >> 2] = LEN << 2 | 3 | 0;
                        KON = 235;
                    } else {
                        STKTOP = STKTOP - 24 | 0;
                        MEM32[STKTOP + 20 >> 2] = KON;
                        MEM32[STKTOP + 16 >> 2] = VAL;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = LEN << 2 | 3 | 0;
                        MEM32[STKTOP + 4 >> 2] = IDX << 2 | 3 | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 233;
                    }
                    return _E_eval() | 0;
                }
                TMP = MEM32[PAR + (LEN << 2) >> 2] | 0;
                MEM32[PAR + (LEN << 2) >> 2] = makePair(EXP, TMP) | 0;
            }
            TMP = MEM32[PAR + (LEN << 2) >> 2] | 0;
            MEM32[PAR + (LEN << 2) >> 2] = reverse(TMP) | 0;
            FRM = PAR;
            ENV = MEM32[VAL + 16 >> 2] | 0;
            EXP = MEM32[VAL + 12 >> 2] | 0;
            return 123;
        }
        function _E_przVarArgs2() {
            SIZ = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            while ((IDX | 0) < (SIZ | 0)) {
                IDX = IDX + 1 | 0;
                EXP = MEM32[ARG + (IDX << 2) >> 2] | 0;
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
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
                    EXP = MEM32[EXP + 4 >> 2] | 0;
                    break;
                case 71:
                    EXP = MEM32[FRM + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 72:
                    EXP = MEM32[GLB + ((EXP >>> 5 | 0) << 2) >> 2] | 0;
                    break;
                case 15:
                    EXP = MEM32[(MEM32[ENV + ((MEM32[EXP + 4 >> 2] | 0) << 2) >> 2] | 0) + ((MEM32[EXP + 8 >> 2] | 0) << 2) >> 2] | 0;
                    break;
                case 18:
                    EXP = (DCT = extendEnv() | 0, makePrc(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                case 34:
                    EXP = (DCT = extendEnv() | 0, makePrz(MEM32[EXP + 4 >> 2] | 0, MEM32[EXP + 8 >> 2] | 0, MEM32[EXP + 12 >> 2] | 0, DCT) | 0);
                    break;
                default:
                    if ((IDX | 0) == (SIZ | 0)) {
                        STKTOP = STKTOP - 8 | 0;
                        MEM32[STKTOP + 4 >> 2] = PAR;
                        MEM32[STKTOP >> 2] = LEN << 2 | 3 | 0;
                        KON = 235;
                    } else {
                        STKTOP = STKTOP - 16 | 0;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = LEN << 2 | 3 | 0;
                        MEM32[STKTOP + 4 >> 2] = IDX << 2 | 3 | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 233;
                    }
                    return _E_eval() | 0;
                }
                TMP = MEM32[PAR + (LEN << 2) >> 2] | 0;
                MEM32[PAR + (LEN << 2) >> 2] = makePair(EXP, TMP) | 0;
            }
            TMP = MEM32[PAR + (LEN << 2) >> 2] | 0;
            MEM32[PAR + (LEN << 2) >> 2] = reverse(TMP) | 0;
            VAL = MEM32[STKTOP >> 2] | 0;
            FRM = PAR;
            ENV = MEM32[VAL + 16 >> 2] | 0;
            EXP = MEM32[VAL + 12 >> 2] | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return _E_eval() | 0;
        }
        function _E_c_przVarArgs() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            IDX = (MEM32[STKTOP + 4 >> 2] | 0) >> 2 | 0;
            LEN = (MEM32[STKTOP + 8 >> 2] | 0) >> 2 | 0;
            PAR = MEM32[STKTOP + 12 >> 2] | 0;
            VAL = makePair(VAL, MEM32[PAR + (LEN << 2) >> 2] | 0) | 0;
            MEM32[PAR + (LEN << 2) >> 2] = VAL;
            STKTOP = STKTOP + 16 | 0;
            return _E_przVarArgs2() | 0;
        }
        function _E_przApplyVarArgs() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            IDX = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            PAR = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            VAL = makePair(VAL, MEM32[PAR + (IDX << 2) >> 2] | 0) | 0;
            MEM32[PAR + (IDX << 2) >> 2] = reverse(VAL) | 0;
            FRM = PAR;
            ENV = MEM32[EXP + 16 >> 2] | 0;
            EXP = MEM32[EXP + 12 >> 2] | 0;
            KON = MEM32[STKTOP + 12 >> 2] | 0;
            STKTOP = STKTOP + 16 | 0;
            return _E_eval() | 0;
        }
        function _E_przApply() {
            IDX = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            PAR = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            MEM32[PAR + (IDX << 2) >> 2] = VAL;
            FRM = PAR;
            ENV = MEM32[EXP + 16 >> 2] | 0;
            EXP = MEM32[EXP + 12 >> 2] | 0;
            KON = MEM32[STKTOP + 12 >> 2] | 0;
            STKTOP = STKTOP + 16 | 0;
            return _E_eval() | 0;
        }
        function _E_c_return() {
            FRM = MEM32[STKTOP >> 2] | 0;
            ENV = MEM32[STKTOP + 4 >> 2] | 0;
            KON = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            return KON | 0;
        }
        function _N_addFloats() {
            for (IDX = IDX + 1 | 0; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0) {
                EXP = MEM32[STKTOP + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    FLT = fround(FLT + fround(EXP >> 2 | 0));
                    break;
                case 1:
                    FLT = fround(FLT + fround(FLT32[EXP + 4 >> 2]));
                    break;
                default:
                    err_invalidArgument(EXP | 0);
                    return 275;
                }
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            VAL = MEMTOP;
            MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
            MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
            FLT32[VAL + 4 >> 2] = FLT;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_substractFloats() {
            for (IDX = IDX + 1 | 0; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0) {
                EXP = MEM32[STKTOP + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    FLT = fround(FLT - fround(EXP >> 2 | 0));
                    break;
                case 1:
                    FLT = fround(FLT - fround(FLT32[EXP + 4 >> 2]));
                    break;
                default:
                    err_invalidArgument(EXP | 0);
                    return 275;
                }
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            VAL = MEMTOP;
            MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
            MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
            FLT32[VAL + 4 >> 2] = FLT;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_multiplyFloats() {
            for (IDX = IDX + 1 | 0; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0) {
                EXP = MEM32[STKTOP + (IDX << 2) >> 2] | 0;
                switch ((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) {
                case 69:
                    FLT = fround(FLT * fround(EXP >> 2 | 0));
                    break;
                case 1:
                    FLT = fround(FLT * fround(FLT32[EXP + 4 >> 2]));
                    break;
                default:
                    err_invalidArgument(EXP | 0);
                    return 275;
                }
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            VAL = MEMTOP;
            MEMTOP = MEMTOP + (1 + 1 << 2) | 0;
            MEM32[VAL >> 2] = (1 << 6 | 1) << 2;
            FLT32[VAL + 4 >> 2] = FLT;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_c1_map() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            VAL = reverse(makePair(VAL, MEM32[STKTOP >> 2] | 0) | 0) | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _N_c2_map() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            MEM32[STKTOP + 8 >> 2] = makePair(VAL, MEM32[STKTOP + 8 >> 2] | 0) | 0;
            LST = MEM32[STKTOP >> 2] | 0;
            if (!(((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0)) {
                err_invalidArgument(LST | 0);
                return 275;
            }
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            ARG = makePair(MEM32[LST + 4 >> 2] | 0, 2147483625) | 0;
            LST = MEM32[LST + 8 >> 2] | 0;
            if (((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0) {
                KON = 247;
                STKTOP = STKTOP + 8 | 0;
            } else {
                MEM32[STKTOP >> 2] = LST;
            }
            return 251;
        }
        function _N_apply() {
            switch ((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) {
            case 4:
                LEN = (MEM32[VAL + 4 >> 2] | 0) >> 2 | 0;
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                preserveEnv();
                FRM = MEMTOP;
                MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                MEM32[FRM >> 2] = (SIZ << 6 | 2) << 2;
                for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                    MEM32[FRM + (IDX << 2) >> 2] = 2147483629;
                }
                for (IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                    if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0)) {
                        err_invalidParamCount();
                        return 275;
                    }
                    TMP = MEM32[ARG + 4 >> 2] | 0;
                    ARG = MEM32[ARG + 8 >> 2] | 0;
                    MEM32[FRM + (IDX << 2) >> 2] = TMP;
                }
                if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0)) {
                    err_invalidParamCount();
                    return 275;
                }
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                return 123;
            case 36:
                LEN = (MEM32[VAL + 4 >> 2] | 0) >> 2 | 0;
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((STKTOP - MEMTOP | 0) < ((imul(SIZ, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(SIZ, 4) | 0) + 128 | 0);
                }
                preserveEnv();
                FRM = MEMTOP;
                MEMTOP = MEMTOP + (SIZ + 1 << 2) | 0;
                MEM32[FRM >> 2] = (SIZ << 6 | 2) << 2;
                for (IDX = 1; (IDX | 0) <= (SIZ | 0); IDX = IDX + 1 | 0) {
                    MEM32[FRM + (IDX << 2) >> 2] = 2147483629;
                }
                for (IDX = 1; (IDX | 0) <= (LEN | 0); IDX = IDX + 1 | 0) {
                    if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0)) {
                        err_invalidParamCount();
                        return 275;
                    }
                    TMP = MEM32[ARG + 4 >> 2] | 0;
                    ARG = MEM32[ARG + 8 >> 2] | 0;
                    MEM32[FRM + (IDX << 2) >> 2] = TMP;
                }
                MEM32[FRM + (IDX << 2) >> 2] = ARG;
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                return 123;
            case 70:
                for (LEN = 0, LST = ARG; ((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0; LEN = LEN + 1 | 0)
                    LST = MEM32[LST + 8 >> 2] | 0;
                if (!(((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0)) {
                    err_invalidArgument(ARG | 0);
                    return 275;
                }
                if ((STKTOP - MEMTOP | 0) < ((imul(LEN, 4) | 0) + 128 | 0)) {
                    claimSizCollect((imul(LEN, 4) | 0) + 128 | 0);
                }
                STKTOP = STKTOP - (LEN << 2) | 0;
                for (IDX = 0; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0) {
                    TMP = MEM32[ARG + 4 >> 2] | 0;
                    ARG = MEM32[ARG + 8 >> 2] | 0;
                    MEM32[STKTOP + (IDX << 2) >> 2] = TMP;
                }
                return VAL >>> 5 | 0;
            case 24:
                if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0)) {
                    err_invalidParamCount();
                    return 275;
                }
                if (!((((MEM32[ARG + 8 >> 2] | 0) & 1 ? MEM8[(MEM32[ARG + 8 >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[ARG + 8 >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0)) {
                    err_invalidParamCount();
                    return 275;
                }
                KON = MEM32[VAL + 4 >> 2] | 0;
                FRM = MEM32[VAL + 8 >> 2] | 0;
                PAR = MEM32[VAL + 16 >> 2] | 0;
                ENV = MEM32[VAL + 12 >> 2] | 0;
                VAL = MEM32[ARG + 4 >> 2] | 0;
                restoreStack();
                return KON | 0;
            }
            err_invalidOperator(VAL | 0);
            return 275;
        }
        function _N_c1_load() {
            EXP = deref(compile(ref(VAL) | 0, 1) | 0) | 0;
            FRM = GLB;
            ENV = __EMPTY_VEC__;
            KON = 239;
            return 123;
        }
        function _N_compare() {
            TMP = (EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0;
            if ((TMP | 0) != ((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0)) {
                VAL = 2147483621;
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
            VAL = (ARG | 0) == (EXP | 0) ? 2147483617 : 2147483621;
            return KON | 0;
        }
        function _N_compareFloat() {
            VAL = fround(FLT32[EXP + 4 >> 2]) == fround(FLT32[ARG + 4 >> 2]) ? 2147483617 : 2147483621;
            return KON | 0;
        }
        function _N_compareString() {
            LEN = textLength(ARG) | 0;
            if ((textLength(EXP) | 0) != (LEN | 0)) {
                VAL = 2147483621;
                return KON | 0;
            }
            while (LEN) {
                LEN = LEN - 1 | 0;
                if ((textGetChar(ARG, LEN) | 0) != (textGetChar(EXP, LEN) | 0)) {
                    VAL = 2147483621;
                    return KON | 0;
                }
            }
            VAL = 2147483617;
            return KON | 0;
        }
        function _N_comparePair() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 12 | 0;
            MEM32[STKTOP + 8 >> 2] = MEM32[EXP + 8 >> 2] | 0;
            MEM32[STKTOP + 4 >> 2] = MEM32[ARG + 8 >> 2] | 0;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            ARG = MEM32[ARG + 4 >> 2] | 0;
            MEM32[STKTOP >> 2] = KON;
            KON = 263;
            return 255;
        }
        function _N_c_comparePair() {
            KON = MEM32[STKTOP >> 2] | 0;
            if ((VAL | 0) == 2147483621) {
                STKTOP = STKTOP + 12 | 0;
                return KON | 0;
            }
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            return 255;
        }
        function _N_compareVector() {
            LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            if (((MEM32[EXP >> 2] | 0) >>> 8 | 0) != (LEN | 0)) {
                VAL = 2147483621;
                return KON | 0;
            }
            if (!LEN) {
                VAL = 2147483617;
                return KON | 0;
            }
            if ((LEN | 0) > 1) {
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                STKTOP = STKTOP - 16 | 0;
                MEM32[STKTOP + 12 >> 2] = KON;
                MEM32[STKTOP + 8 >> 2] = EXP;
                MEM32[STKTOP + 4 >> 2] = ARG;
                MEM32[STKTOP >> 2] = 7;
                KON = 267;
            }
            ARG = MEM32[ARG + 4 >> 2] | 0;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            return 255;
        }
        function _N_c_compareVector() {
            if ((VAL | 0) == 2147483621) {
                KON = MEM32[STKTOP + 12 >> 2] | 0;
                STKTOP = STKTOP + 16 | 0;
                return KON | 0;
            }
            IDX = ((MEM32[STKTOP >> 2] | 0) + 1 | 0) >> 2 | 0;
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            EXP = MEM32[STKTOP + 8 >> 2] | 0;
            if ((IDX | 0) == ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                KON = MEM32[STKTOP + 12 >> 2] | 0;
                STKTOP = STKTOP + 16 | 0;
            } else {
                MEM32[STKTOP >> 2] = IDX << 2 | 3 | 0;
                KON = 267;
            }
            ARG = MEM32[ARG + (IDX << 2) >> 2] | 0;
            EXP = MEM32[EXP + (IDX << 2) >> 2] | 0;
            return 255;
        }
        function _REPL() {
            clearRefs();
            dctCheckpoint();
            KON = 271;
            promptInput();
            return 0;
        }
        function _c1_repl() {
            EXP = deref(compile(ref(VAL) | 0, 0) | 0) | 0;
            KON = 273;
            return 123;
        }
        function _c2_repl() {
            printOutput(VAL | 0);
            return 269;
        }
        function _error() {
            FRM = GLB;
            ENV = __EMPTY_VEC__;
            dctRollback();
            emptyStk();
            return 269;
        }
        function nop() {
            return 0;
        }
        function run(instr) {
            instr = instr | 0;
            for (; instr; instr = FUNTAB[instr & 511]() | 0);
        }
        var FUNTAB = [
            nop,
            _N_add,
            nop,
            _N_sub,
            nop,
            _N_multiply,
            nop,
            _N_div,
            nop,
            _N_cons,
            nop,
            _N_free,
            nop,
            _N_ref,
            nop,
            _N_car,
            nop,
            _N_cdr,
            nop,
            _N_sca,
            nop,
            _N_scd,
            nop,
            _N_list,
            nop,
            _N_nbrEq,
            nop,
            _N_seq,
            nop,
            _N_leq,
            nop,
            _N_sma,
            nop,
            _N_lrg,
            nop,
            _N_assoc,
            nop,
            _N_map,
            nop,
            _N_eval,
            nop,
            _N_applyNat,
            nop,
            _N_display,
            nop,
            _N_newline,
            nop,
            _N_read,
            nop,
            _N_isPair,
            nop,
            _N_isNull,
            nop,
            _N_isSymbol,
            nop,
            _N_isVector,
            nop,
            _N_isString,
            nop,
            _N_makeVector,
            nop,
            _N_vectorRef,
            nop,
            _N_vectorSet,
            nop,
            _N_vectorLength,
            nop,
            _N_vector,
            nop,
            _N_clock,
            nop,
            _N_reset,
            nop,
            _N_eq,
            nop,
            _N_equal,
            nop,
            _N_collect,
            nop,
            _N_available,
            nop,
            _N_callcc,
            nop,
            _N_stringRef,
            nop,
            _N_stringSet,
            nop,
            _N_stringLength,
            nop,
            _N_random,
            nop,
            _N_load,
            nop,
            _N_quotient,
            nop,
            _N_remainder,
            nop,
            _N_error,
            nop,
            _N_length,
            nop,
            _N_sin,
            nop,
            _N_exit,
            nop,
            _R_read,
            nop,
            _R_readLBR,
            nop,
            _R_c1_LBR,
            nop,
            _R_c2_LBR,
            nop,
            _R_c3_LBR,
            nop,
            _R_readQUO,
            nop,
            _R_c_QUO,
            nop,
            _R_readSHR,
            nop,
            _R_c_vector,
            nop,
            _E_eval,
            nop,
            _E_setLocal,
            nop,
            _E_c_setLocal,
            nop,
            _E_setGlobal,
            nop,
            _E_c_setGlobal,
            nop,
            _E_evalDfv,
            nop,
            _E_c_evalDfv,
            nop,
            _E_evalDff,
            nop,
            _E_evalDfz,
            nop,
            _E_evalSeq,
            nop,
            _E_c_sequence,
            nop,
            _E_evalStl,
            nop,
            _E_evalIfs,
            nop,
            _E_c_ifs,
            nop,
            _E_evalIff,
            nop,
            _E_c_iff,
            nop,
            _E_evalTtk,
            nop,
            _E_evalThk,
            nop,
            _E_evalAlz,
            nop,
            _E_evalAnz,
            nop,
            _E_evalAgz,
            nop,
            _E_evalApz,
            nop,
            _E_c_evalApz,
            nop,
            _E_evalAZ,
            nop,
            _E_evalTlz,
            nop,
            _E_evalTnz,
            nop,
            _E_evalTgz,
            nop,
            _E_evalTpz,
            nop,
            _E_c_evalTpz,
            nop,
            _E_evalTZ,
            nop,
            _E_evalAll,
            nop,
            _E_evalAnl,
            nop,
            _E_evalAgl,
            nop,
            _E_evalApl,
            nop,
            _E_c_evalApl,
            nop,
            _E_evalAL,
            nop,
            _E_evalTll,
            nop,
            _E_evalTnl,
            nop,
            _E_evalTgl,
            nop,
            _E_evalTpl,
            nop,
            _E_c_evalTpl,
            nop,
            _E_evalTL,
            nop,
            _E_continuationArg,
            nop,
            _E_c_continuationArg,
            nop,
            _E_nativeArgs,
            nop,
            _E_c_nativeArgs,
            nop,
            _E_applyNative,
            nop,
            _E_prcEvalArgs,
            nop,
            _E_c_prcArgs,
            nop,
            _E_prcApply,
            nop,
            _E_przArgs,
            nop,
            _E_c1_przArgs,
            nop,
            _E_c2_przArgs,
            nop,
            _E_przVarArgs,
            nop,
            _E_przVarArgs2,
            nop,
            _E_c_przVarArgs,
            nop,
            _E_przApplyVarArgs,
            nop,
            _E_przApply,
            nop,
            _E_c_return,
            nop,
            _N_addFloats,
            nop,
            _N_substractFloats,
            nop,
            _N_multiplyFloats,
            nop,
            _N_c1_map,
            nop,
            _N_c2_map,
            nop,
            _N_apply,
            nop,
            _N_c1_load,
            nop,
            _N_compare,
            nop,
            _N_compareFloat,
            nop,
            _N_compareString,
            nop,
            _N_comparePair,
            nop,
            _N_c_comparePair,
            nop,
            _N_compareVector,
            nop,
            _N_c_compareVector,
            nop,
            _REPL,
            nop,
            _c1_repl,
            nop,
            _c2_repl,
            nop,
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
            fclaim: fclaim,
            fclaimSiz: fclaimSiz,
            Slip_REPL: Slip_REPL,
            inputReady: inputReady,
            /************************/
            /*** ABSTRACT GRAMMAR ***/
            /************************/
            //generic
            ftag: ftag,
            fmake: fmake,
            fset: fset,
            fsetRaw: fsetRaw,
            //text 
            makeText: makeText,
            textGetChar: textGetChar,
            textSetChar: textSetChar,
            //specials
            fisTrue: fisTrue,
            fisFalse: fisFalse,
            fisNull: fisNull,
            fisVoid: fisVoid,
            //numbers
            fmakeNumber: fmakeNumber,
            fnumberVal: fnumberVal,
            fisNumber: fisNumber,
            //characters
            fmakeChar: fmakeChar,
            fcharCode: fcharCode,
            fisChar: fisChar,
            //pairs
            fpairCar: fpairCar,
            fpairCdr: fpairCdr,
            fpairSetCar: fpairSetCar,
            fpairSetCdr: fpairSetCdr,
            fisPair: fisPair,
            //procedures
            fprcArgc: fprcArgc,
            fprcFrmSiz: fprcFrmSiz,
            fprcBdy: fprcBdy,
            fprcEnv: fprcEnv,
            fprzArgc: fprzArgc,
            fprzFrmSiz: fprzFrmSiz,
            fprzBdy: fprzBdy,
            fprzEnv: fprzEnv,
            fisPrc: fisPrc,
            fisPrz: fisPrz,
            //vectors
            vectorAt: vectorAt,
            fvectorLength: fvectorLength,
            ffillVector: ffillVector,
            fisVector: fisVector,
            //floats
            fmakeFloat: fmakeFloat,
            ffloatNumber: ffloatNumber,
            fisFloat: fisFloat,
            //string
            makeString: makeString,
            stringAt: textGetChar,
            stringSet: textSetChar,
            stringLength: textLength,
            fisString: fisString,
            //symbols
            makeSymbol: makeSymbol,
            symbolAt: textGetChar,
            symbolSet: textSetChar,
            symbolLength: textLength,
            fisSymbol: fisSymbol,
            //natives
            fnativePtr: fnativePtr,
            fisNative: fisNative,
            //sequences
            sequenceAt: sequenceAt,
            sequenceSet: sequenceSet,
            sequenceLength: sequenceLength,
            fisSequence: fisSequence,
            //single if-statements
            fifsPredicate: fifsPredicate,
            fifsConsequence: fifsConsequence,
            fisIfs: fisIfs,
            //full if-statements
            fiffPredicate: fiffPredicate,
            fiffConsequence: fiffConsequence,
            fiffAlternative: fiffAlternative,
            fisIff: fisIff,
            //quotes
            fquoExpression: fquoExpression,
            fisQuo: fisQuo,
            //thunks
            fthunkExp: fthunkExp,
            fthunkSiz: fthunkSiz,
            fisThunk: fisThunk,
            fttkSiz: fttkSiz,
            fttkExp: fttkExp,
            fisTtk: fisTtk,
            //lambdas
            flmbFrmSiz: flmbFrmSiz,
            flmbArgc: flmbArgc,
            flmbBdy: flmbBdy,
            fisLmb: fisLmb,
            flmzFrmSiz: flmzFrmSiz,
            flmzArgc: flmzArgc,
            flmzBdy: flmzBdy,
            fisLmz: fisLmz,
            //variable definitions
            fdfvOfs: fdfvOfs,
            fdfvVal: fdfvVal,
            fisDfv: fisDfv,
            //function definitions
            fdffBdy: fdffBdy,
            fdffArgc: fdffArgc,
            fdffFrmSiz: fdffFrmSiz,
            fdffOfs: fdffOfs,
            fdfzBdy: fdfzBdy,
            fdfzArgc: fdfzArgc,
            fdfzFrmSiz: fdfzFrmSiz,
            fdfzOfs: fdfzOfs,
            fisDff: fisDff,
            fisDfz: fisDfz,
            //assignments
            fsglScp: fsglScp,
            fsglOfs: fsglOfs,
            fsglVal: fsglVal,
            fslcOfs: fslcOfs,
            fslcVal: fslcVal,
            fisSgl: fisSgl,
            fisSlc: fisSlc,
            //local & global variables
            flocalOfs: flocalOfs,
            fglobalOfs: fglobalOfs,
            fisLocal: fisLocal,
            fisGlobal: fisGlobal,
            fmakeLocal: fmakeLocal,
            fmakeGlobal: fmakeGlobal,
            //applications (zero arg)
            fapzOpr: fapzOpr,
            fisApz: fisApz,
            falzOfs: falzOfs,
            fisAlz: fisAlz,
            fagzOfs: fagzOfs,
            fisAgz: fisAgz,
            fanzScp: fanzScp,
            fanzOfs: fanzOfs,
            fisAnz: fisAnz,
            //tail calls (zero arg)
            ftpzOpr: ftplOpr,
            fisTpz: fisTpz,
            ftlzOfs: ftlzOfs,
            fisTlz: fisTlz,
            ftgzOfs: ftgzOfs,
            fisTgz: fisTgz,
            ftnzScp: ftnzScp,
            ftnzOfs: ftnzOfs,
            fisTnz: fisTnz,
            //applications
            faplOpr: faplOpr,
            faplOpd: faplOpd,
            fisApl: fisApl,
            fallOfs: fallOfs,
            fallOpd: fallOpd,
            fisAll: fisAll,
            faglOfs: faglOfs,
            faglOpd: faglOpd,
            fisAgl: fisAgl,
            fanlScp: fanlScp,
            fanlOfs: fanlOfs,
            fanlOpd: fanlOpd,
            fisAnl: fisAnl,
            //tail calls
            ftplOpr: ftplOpr,
            ftplOpd: ftplOpd,
            fisTpl: fisTpl,
            ftllOfs: ftllOfs,
            ftllOpd: ftllOpd,
            fisTll: fisTll,
            ftglOfs: ftglOfs,
            ftglOpd: ftglOpd,
            fisTgl: fisTgl,
            ftnlScp: ftnlScp,
            ftnlOfs: ftnlOfs,
            ftnlOpd: ftnlOpd,
            fisTnl: fisTnl,
            //non-locals
            fnlcScp: fnlcScp,
            fnlcOfs: fnlcOfs,
            fisNlc: fisNlc,
            //sequence tail
            fstlExp: fstlExp,
            fisStl: fisStl,
            //void
            slipVoid: slipVoid,
            //other
            feq: feq,
            protect: protect
        };
    }
    function COMPILER() {
        'use strict';
        var asm$2, dct, sym, err;
        var isPair, isNull;
        var car, cdr;
        function link(asmModule, dctModule, symModule, errModule) {
            asm$2 = asmModule;
            dct = dctModule;
            sym = symModule;
            err = errModule;
            car = asm$2.fpairCar;
            cdr = asm$2.fpairCdr;
            isPair = asm$2.fisPair;
            isNull = asm$2.fisNull;
        }
        function make() {
            var tag = arguments[0];
            var len = arguments.length;
            var chk = asm$2.fmake(tag, len - 1);
            for (var i = 1; i < len; ++i)
                asm$2.fset(chk, i, arguments[i]);
            return chk;
        }
        function makeRaw() {
            var tag = arguments[0];
            var len = arguments.length;
            var chk = asm$2.fmake(tag, len - 1);
            for (var i = 1; i < len; ++i)
                asm$2.fsetRaw(chk, i, arguments[i]);
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
                return compile(exp, tail > 0);
            } catch (exception) {
                console.log(exception);
                return asm$2.slipVoid();
            }
        }
        function compile(exp, tailc) {
            if (//compound expression
                isPair(exp)) {
                var opr = car(exp);
                var opd = cdr(exp);
                if (//check for special form
                    asm$2.fisSymbol(opr)) {
                    if (asm$2.feq(opr, sym.loadIff()))
                        return compileIf(opd, tailc);
                    else if (asm$2.feq(opr, sym.loadDef()))
                        return compileDefine(opd);
                    else if (asm$2.feq(opr, sym.loadBeg()))
                        return compileSequence(opd, tailc);
                    else if (asm$2.feq(opr, sym.loadLmb()))
                        return compileLambda(opd);
                    else if (asm$2.feq(opr, sym.loadSet()))
                        return compileAssignment(opd);
                    else if (asm$2.feq(opr, sym.loadQuo()))
                        return compileQuote(opd);
                }
                //otherwise, assume application
                return compileApplication(opr, opd, tailc);
            }
            if (//simple expression
                asm$2.fisSymbol(exp))
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
            if (asm$2.fisNull(alternative))
                return make(8, c_predicate, c_consequent);
            else if (asm$2.fisPair(alternative)) {
                var c_alternative = compile(car(alternative), tailc);
                return make(10, c_predicate, c_consequent, c_alternative);
            } else
                compilationError(err.invalidIf);
        }
        function compileInline(exp, tailc) {
            dct.enterScope();
            var c_exp = compile(exp, true);
            var size$2 = dct.exitScope();
            if (size$2 == 0)
                //no thunking needed
                return compile(exp, tailc);
            size$2 = asm$2.fmakeNumber(size$2);
            if (tailc)
                return make(38, c_exp, size$2);
            else
                return make(32, c_exp, size$2);
        }
        function compileSequence(exp, tailc) {
            var len = listLength(exp, err.invalidSequence);
            if (len === 0)
                return asm$2.slipVoid();
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
            if (asm$2.fisSymbol(identifier))
                return compileVarDefinition(identifier, definition);
            else if (isPair(identifier))
                return compileFunDefinition(identifier, definition);
        }
        function compileVarDefinition(identifier, definition) {
            if (!isPair(definition))
                compilationError(err.invalidDefine);
            var exp = car(definition);
            var rest = cdr(definition);
            if (!asm$2.fisNull(rest))
                compilationError(err.invalidDefine);
            var pos = dct.defineVar(identifier);
            var ofs = asm$2.fmakeNumber(pos);
            var c_exp = compile(exp, false);
            return make(12, ofs, c_exp);
        }
        function compileFunDefinition(identifier, body) {
            var fname = car(identifier);
            var parameters = cdr(identifier);
            if (!asm$2.fisSymbol(fname))
                compilationError(err.invalidDefine);
            var ofs = asm$2.fmakeNumber(dct.defineVar(fname));
            dct.enterScope();
            var rest = compileParameters(parameters);
            var argc = asm$2.fmakeNumber(dct.frameSize());
            if (isNull(rest)) {
                var c_body = compileSequence(body, true);
                var frmSiz = asm$2.fmakeNumber(dct.exitScope());
                return make(14, ofs, argc, frmSiz, c_body);
            } else if (asm$2.fisSymbol(rest)) {
                dct.defineVar(rest);
                var c_body = compileSequence(body, true);
                var frmSiz = asm$2.fmakeNumber(dct.exitScope());
                return make(30, ofs, argc, frmSiz, c_body);
            } else
                compilationError(err.invalidDefine);
        }
        function compileParameters(lst) {
            while (isPair(lst)) {
                var par = car(lst);
                if (!asm$2.fisSymbol(par))
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
            var argc = asm$2.fmakeNumber(dct.frameSize());
            if (isNull(rest)) {
                var c_body = compileSequence(body, true);
                var frmSiz = asm$2.fmakeNumber(dct.exitScope());
                return make(18, argc, frmSiz, c_body);
            } else if (asm$2.fisSymbol(rest)) {
                dct.defineVar(rest);
                var c_body = compileSequence(body, true);
                var frmSiz = asm$2.fmakeNumber(dct.exitScope());
                return make(34, argc, frmSiz, c_body);
            } else
                compilationError(err.invalidParameter);
        }
        function compileAssignment(exp) {
            if (!isPair(exp))
                compilationError(err.invalidAssignment);
            var identifier = car(exp);
            var definition = cdr(exp);
            if (!asm$2.fisSymbol(identifier) || !isPair(definition) || !isNull(cdr(definition)))
                compilationError(err.invalidAssignment);
            var expression = car(definition);
            var c_exp = compile(expression, false);
            var adr = dct.lexicalAdr(identifier);
            if (adr) {
                var scope = adr.scope;
                var offset = adr.offset;
                var ofs = asm$2.fmakeNumber(offset);
                if (scope == 0) {
                    return make(16, ofs, c_exp);
                } else {
                    var scp = asm$2.fmakeNumber(scope);
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
            switch (asm$2.ftag(c_opr)) {
            case 71:
                var ofs = asm$2.flocalOfs(c_opr);
                return tailc ? makeRaw(13, ofs) : makeRaw(11, ofs);
            case 72:
                var ofs = asm$2.fglobalOfs(c_opr);
                return tailc ? makeRaw(7, ofs) : makeRaw(9, ofs);
            case 15:
                var scp = asm$2.fnlcScp(c_opr);
                var ofs = asm$2.fnlcOfs(c_opr);
                return tailc ? makeRaw(19, scp, ofs) : makeRaw(17, scp, ofs);
            default:
                return tailc ? make(44, c_opr) : make(46, c_opr);
            }
        }
        function specializeApl(c_opr, c_args, tailc) {
            switch (asm$2.ftag(c_opr)) {
            case 71:
                var ofs = asm$2.flocalOfs(c_opr);
                ofs = asm$2.fmakeNumber(ofs);
                return tailc ? make(50, ofs, c_args) : make(48, ofs, c_args);
            case 72:
                var ofs = asm$2.fglobalOfs(c_opr);
                ofs = asm$2.fmakeNumber(ofs);
                return tailc ? make(54, ofs, c_args) : make(52, ofs, c_args);
            case 15:
                var scp = asm$2.fnlcScp(c_opr);
                var ofs = asm$2.fnlcOfs(c_opr);
                scp = asm$2.fmakeNumber(scp);
                ofs = asm$2.fmakeNumber(ofs);
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
            if (!asm$2.fisNull(rest))
                compilationError(err.invalidQuote);
            return make(22, quoted);
        }
        function compileVariable(sym$2) {
            var adr = dct.lexicalAdr(sym$2);
            if (adr) {
                var scope = adr.scope;
                var offset = adr.offset;
                if (scope === 0)
                    return asm$2.fmakeLocal(offset);
                else if (scope === 1)
                    return asm$2.fmakeGlobal(offset);
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
    function DICTIONARY() {
        'use strict';
        var asm$2, err;
        var savedEnv;
        var environment = [];
        var frame = [];
        function dctError(err$2) {
            err$2();
            throw err$2;
        }
        function link(asmModule, errModule) {
            asm$2 = asmModule;
            err = errModule;
        }
        function defineVar(vrb) {
            if (environment.length == 0 && frame.length == 256)
                dctError(err.globalOverflow);
            if (environment.length == 0)
                asm$2.protect(vrb);
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
            for (var i = 0; i < len; ++i)
                if (asm$2.feq(frame$2[i], sym))
                    return i + 1;
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
            savedEnv = frame;
        }
        function rollback() {
            frame = savedEnv;
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
            makeNumber = asm$2.fmakeNumber;
            makeFloat = asm$2.fmakeFloat;
            claimSiz = asm$2.fclaimSiz;
            claim = asm$2.fclaim;
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
        var pool$2 = Object.create(null);
        var asm$2;
        function link(asmModule) {
            asm$2 = asmModule;
        }
        function buildSymbol(txt) {
            var len = txt.length;
            var sym = asm$2.makeText(3, len);
            for (var i = 0; i < len; ++i)
                asm$2.textSetChar(sym, i, txt.charCodeAt(i));
            return sym;
        }
        function enterPool(str) {
            var sym = pool$2[str];
            if (!sym) {
                // new symbol
                sym = buildSymbol(str);
                asm$2.protect(sym);
                pool$2[str] = sym;
            }
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
            loadCce: symbol('call-with-escape-continuation'),
            loadRef: symbol('ref'),
            loadFre: symbol('free'),
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
        var getTag, numberVal, floatNumber, charCode, stringText, symbolLength, symbolAt, pairCar, pairCdr, isPair, isNull, vectorAt, vectorLength, ag;
        function link(asm$2) {
            getTag = asm$2.ftag;
            numberVal = asm$2.fnumberVal;
            floatNumber = asm$2.ffloatNumber;
            charCode = asm$2.charCode;
            stringText = asm$2.stringText;
            symbolLength = asm$2.symbolLength;
            symbolAt = asm$2.symbolAt;
            pairCar = asm$2.fpairCar;
            pairCdr = asm$2.fpairCdr;
            isPair = asm$2.fisPair;
            isNull = asm$2.fisNull;
            vectorAt = asm$2.vectorAt;
            vectorLength = asm$2.fvectorLength;
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
        function invalidParameter(exp) {
            report('invalid parameter: ' + printExp(exp));
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
    var compiler = COMPILER();
    var dictionary = DICTIONARY();
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
        loadCce: pool.loadCce,
        loadRef: pool.loadRef,
        loadFre: pool.loadFre,
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
        random: Math.random,
        dctDefine: dictionary.defineVar,
        dctCheckpoint: dictionary.checkpoint,
        dctRollback: dictionary.rollback,
        compile: compiler.compile
    };
    var //asm module
    asm = SLIP_ASM(callbacks.stdlib, foreign, buffer);
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
    compiler.link(asm, dictionary, pool, errors, printer);
    dictionary.link(asm, errors);
    printer.link(asm);
    io.link(asm, callbacks, reader, printer);
    errors.link(io, printer);
    timer.reset();
    //initialization
    asm.init();
    return {
        /* ---- EXPORTS ---- */
        Slip_REPL: asm.Slip_REPL
    };
}