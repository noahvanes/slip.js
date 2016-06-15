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
        //compiler & dictionary
        fcompile = foreign$2.compile;
        var dctDefine = foreign$2.dctDefine;
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
        var //timer
        clock = foreign$2.clock;
        var reset = foreign$2.reset;
        var //symbols
        loadQuo = foreign$2.loadQuo;
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
        var floadFile = foreign$2.loadFile;
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
        var __REFS_USED__ = 0;
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
        function loadFile(arg) {
            arg = arg | 0;
            floadFile(ref(arg) | 0);
        }
        function compile(exp, tailc) {
            exp = exp | 0;
            tailc = tailc | 0;
            var val = 0;
            val = deref(fcompile(ref(exp) | 0, tailc | 0) | 0) | 0;
            return val | 0;
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
        function fget(chk, idx) {
            chk = chk | 0;
            idx = idx | 0;
            return ref(MEM32[(deref(chk) | 0) + (idx << 2) >> 2] | 0) | 0;
        }
        function fsize(chk) {
            chk = chk | 0;
            return (MEM32[(deref(chk) | 0) >> 2] | 0) >>> 8 | 0;
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
        function fcopy(x) {
            x = x | 0;
            return ref(deref(x) | 0) | 0;
        }
        function slipVoid() {
            return ref(2147483629) | 0;
        }
        function slipNull() {
            return ref(2147483625) | 0;
        }
        function slipTrue() {
            return ref(2147483617) | 0;
        }
        function slipFalse() {
            return ref(2147483621) | 0;
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
        function makeBnd(ofs, val, bdy) {
            ofs = ofs | 0;
            val = val | 0;
            bdy = bdy | 0;
            var chk = 0;
            chk = MEMTOP;
            MEMTOP = MEMTOP + 16 | 0;
            MEM32[chk >> 2] = (3 << 6 | 26) << 2;
            MEM32[chk + 4 >> 2] = ofs;
            MEM32[chk + 8 >> 2] = val;
            MEM32[chk + 12 >> 2] = bdy;
            return chk | 0;
        }
        function fbndOfs(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 4 >> 2] | 0) | 0;
        }
        function fbndVal(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 8 >> 2] | 0) | 0;
        }
        function fbndBdy(chk) {
            chk = chk | 0;
            return ref(MEM32[(deref(chk) | 0) + 12 >> 2] | 0) | 0;
        }
        function fisBnd(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 26 | 0;
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
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            ;
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
        function fmakeText(tag, len) {
            tag = tag | 0;
            len = len | 0;
            return ref(makeText(tag, len) | 0) | 0;
        }
        function ftextSetChar(txt, idx, chr) {
            txt = txt | 0;
            idx = idx | 0;
            chr = chr | 0;
            textSetChar(deref(txt) | 0, idx, chr);
        }
        function ftextGetChar(txt, idx) {
            txt = txt | 0;
            idx = idx | 0;
            return textGetChar(deref(txt) | 0, idx) | 0;
        }
        function ftextLength(txt) {
            txt = txt | 0;
            return textLength(deref(txt) | 0) | 0;
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
            return chk | 0;
        }
        function textSetChar(txt, idx, chr) {
            txt = txt | 0;
            idx = idx | 0;
            chr = chr | 0;
            MEM8[txt + (idx + 4 | 0) | 0] = chr;
        }
        function textGetChar(txt, idx) {
            txt = txt | 0;
            idx = idx | 0;
            return MEM8[txt + (idx + 4 | 0) | 0] | 0;
        }
        function textLength(txt) {
            txt = txt | 0;
            var len = 0;
            len = ((MEM32[txt >> 2] | 0) >>> 8 | 0) << 2;
            if (len)
                for (; !(MEM8[txt + (len + 3 | 0) | 0] | 0); len = len - 1 | 0);
            return len | 0;
        }
        function fisString(x) {
            x = x | 0;
            return (((deref(x) | 0) & 1 ? MEM8[(deref(x) | 0) & 31] | 0 : (MEM32[(deref(x) | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0;
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
            if (val & 1) {
                return val | 0;
            }
            VAL = val;
            if ((__EXT_FREE__ | 0) > (__EXT_SIZ__ | 0)) {
                growExt();
            }
            IDX = __EXT_FREE__;
            __EXT_FREE__ = MEM32[EXT + (__EXT_FREE__ << 2) >> 2] | 0;
            __EXT_FREE__ = __EXT_FREE__ >> 2 | 0;
            MEM32[EXT + (IDX << 2) >> 2] = VAL;
            __REFS_USED__ = __REFS_USED__ + 1 | 0;
            return IDX << 1 | 0;
        }
        function free(idx) {
            idx = idx | 0;
            if (idx & 1) {
                return idx | 0;
            } else {
                idx = idx >>> 1;
            }
            VAL = MEM32[EXT + (idx << 2) >> 2] | 0;
            IDX = __EXT_FREE__ << 2 | 3 | 0;
            __EXT_FREE__ = idx | 0;
            MEM32[EXT + (idx << 2) >> 2] = IDX;
            __REFS_USED__ = __REFS_USED__ - 1 | 0;
            return unpack(VAL) | 0;
        }
        function clearRefs() {
            var i = 0;
            var tmp = 0;
            __EXT_FREE__ = __EXT_SIZ__ + 1 | 0;
            __REFS_USED__ = 0;
            for (i = 1; (i | 0) <= (__EXT_SIZ__ | 0); i = i + 1 | 0) {
                __REFS_USED__ = __REFS_USED__ + 1 | 0;
                if (!((((MEM32[EXT + (i << 2) >> 2] | 0) & 1 ? MEM8[(MEM32[EXT + (i << 2) >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[EXT + (i << 2) >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 62 | 0) | 0)
                    free(i << 1) | 0;
            }
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
            if (idx & 1) {
                return idx | 0;
            } else {
                idx = idx >>> 1;
            }
            exp = MEM32[EXT + (idx << 2) >> 2] | 0;
            return unpack(exp) | 0;
        }
        function protect(idx) {
            idx = idx | 0;
            if (idx & 1) {
                return idx | 0;
            } else {
                idx = idx >>> 1;
            }
            VAL = MEM32[EXT + (idx << 2) >> 2] | 0;
            if (!(((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) == 62 | 0 | 0)) {
                if ((STKTOP - MEMTOP | 0) < 128) {
                    claimCollect();
                }
                ;
                VAL = makePrt(VAL) | 0;
            }
            return ref(VAL) | 0;
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
            if ((KON | 0) != 225) {
                STKTOP = STKTOP - 12 | 0;
                MEM32[STKTOP + 8 >> 2] = KON;
                MEM32[STKTOP + 4 >> 2] = ENV;
                MEM32[STKTOP >> 2] = FRM;
                KON = 225;
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
            run(255);
        }
        function inputReady(exp) {
            exp = exp | 0;
            VAL = deref(exp) | 0;
            run(KON);
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
                    return 261;
                }
            }
            VAL = TMP << 2 | 3 | 0;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_sub() {
            if (!LEN) {
                err_invalidParamCount();
                return 261;
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
                    return 261;
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
                        return 261;
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
            return 261;
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
                    return 261;
                }
            }
            VAL = TMP << 2 | 3 | 0;
            STKTOP = STKTOP + (LEN << 2) | 0;
            return KON | 0;
        }
        function _N_div() {
            if (!LEN) {
                err_invalidParamCount();
                return 261;
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
                    return 261;
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
                return 261;
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
                    return 261;
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
                return 261;
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
                return 261;
            }
            VAL = free((MEM32[STKTOP >> 2] | 0) >> 2 | 0) | 0;
            printLog(EXT | 0);
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_ref() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            VAL = (ref(MEM32[STKTOP >> 2] | 0) | 0) << 2 | 3 | 0;
            printLog(EXT | 0);
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_car() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                VAL = MEM32[ARG + 4 >> 2] | 0;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_cdr() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                VAL = MEM32[ARG + 8 >> 2] | 0;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_sca() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                MEM32[ARG + 4 >> 2] = VAL;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_scd() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if (((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                MEM32[ARG + 8 >> 2] = VAL;
                return KON | 0;
            }
            err_invalidArgument(ARG | 0);
            return 261;
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
                return 261;
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
                return 261;
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
                return 261;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_seq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
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
                return 261;
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
                return 261;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_leq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
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
                return 261;
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
                return 261;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_sma() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
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
                return 261;
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
                return 261;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_lrg() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
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
                return 261;
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
                return 261;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_assoc() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
            }
            PAT = MEM32[STKTOP >> 2] | 0;
            LST = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            while (((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0) {
                VAL = MEM32[LST + 4 >> 2] | 0;
                if (!(((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0)) {
                    err_invalidArgument(LST | 0);
                    return 261;
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
                return 261;
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
                return 261;
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
                KON = 233;
            } else {
                STKTOP = STKTOP - 16 | 0;
                MEM32[STKTOP + 12 >> 2] = KON;
                MEM32[STKTOP + 8 >> 2] = 2147483625;
                MEM32[STKTOP + 4 >> 2] = VAL;
                MEM32[STKTOP >> 2] = LST;
                KON = 235;
            }
            return 237;
        }
        function _N_eval() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            EXP = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 8 >> 2] = KON;
            MEM32[STKTOP + 4 >> 2] = ENV;
            MEM32[STKTOP >> 2] = FRM;
            EXP = compile(EXP, 1) | 0;
            FRM = GLB;
            ENV = __EMPTY_VEC__;
            KON = 225;
            return 105;
        }
        function _N_applyNat() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
            }
            VAL = MEM32[STKTOP >> 2] | 0;
            ARG = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return _N_apply() | 0;
        }
        function _N_display() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
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
            return 261;
        }
        function _N_isPair() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_isNull() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_isSymbol() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 3 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_isVector() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_isString() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            VAL = (((MEM32[STKTOP >> 2] | 0) & 1 ? MEM8[(MEM32[STKTOP >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[STKTOP >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 4 | 0;
            return KON | 0;
        }
        function _N_makeVector() {
            if (!LEN) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 261;
            }
            LEN = ARG >> 2 | 0;
            if ((LEN | 0) < 0) {
                err_invalidLength(LEN | 0);
                return 261;
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
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 261;
            }
            if (!(((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(EXP | 0);
                return 261;
            }
            IDX = EXP >> 2 | 0;
            LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                VAL = MEM32[ARG + ((IDX + 1 | 0) << 2) >> 2] | 0;
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 261;
        }
        function _N_vectorSet() {
            if ((LEN | 0) != 3) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            VAL = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 261;
            }
            if (!(((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(EXP | 0);
                return 261;
            }
            IDX = EXP >> 2 | 0;
            LEN = (MEM32[ARG >> 2] | 0) >>> 8 | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                MEM32[ARG + ((IDX + 1 | 0) << 2) >> 2] = VAL;
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 261;
        }
        function _N_vectorLength() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 2 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 261;
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
                return 261;
            }
            VAL = (clock() | 0) << 2 | 3 | 0;
            return KON | 0;
        }
        function _N_reset() {
            if (LEN) {
                err_invalidParamCount();
                return 261;
            }
            reset();
            VAL = 2147483629;
            return KON | 0;
        }
        function _N_eq() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
            }
            VAL = (MEM32[STKTOP >> 2] | 0) == (MEM32[STKTOP + 4 >> 2] | 0) ? 2147483617 : 2147483621;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _N_equal() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
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
                return 261;
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
            return 261;
        }
        function _N_stringRef() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 261;
            }
            if (!(((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(EXP | 0);
                return 261;
            }
            IDX = EXP >> 2 | 0;
            LEN = textLength(ARG) | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                VAL = makeChar(textGetChar(ARG, IDX) | 0) | 0;
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 261;
        }
        function _N_stringSet() {
            if ((LEN | 0) != 3) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            EXP = MEM32[STKTOP + 4 >> 2] | 0;
            VAL = MEM32[STKTOP + 8 >> 2] | 0;
            STKTOP = STKTOP + 12 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 261;
            }
            if (!(((EXP & 1 ? MEM8[EXP & 31] | 0 : (MEM32[EXP >> 2] | 0) >>> 2 & 63 | 0) | 0) == 69 | 0 | 0)) {
                err_invalidArgument(EXP | 0);
                return 261;
            }
            if (!(((VAL & 1 ? MEM8[VAL & 31] | 0 : (MEM32[VAL >> 2] | 0) >>> 2 & 63 | 0) | 0) == 64 | 0 | 0)) {
                err_invalidArgument(VAL | 0);
                return 261;
            }
            IDX = EXP >> 2 | 0;
            LEN = textLength(ARG) | 0;
            if (0 <= (IDX | 0) & (IDX | 0) < (LEN | 0)) {
                textSetChar(ARG, IDX, charCode(VAL) | 0);
                return KON | 0;
            }
            err_invalidRange(IDX | 0, 0, LEN - 1 | 0);
            return 261;
        }
        function _N_stringLength() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 261;
            }
            VAL = (textLength(ARG) | 0) << 2 | 3 | 0;
            return KON | 0;
        }
        function _N_random() {
            if (LEN) {
                err_invalidParamCount();
                return 261;
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
                return 261;
            }
            ARG = MEM32[STKTOP >> 2] | 0;
            if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 5 | 0 | 0)) {
                err_invalidArgument(ARG | 0);
                return 261;
            }
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 8 >> 2] = KON;
            MEM32[STKTOP + 4 >> 2] = ENV;
            MEM32[STKTOP >> 2] = FRM;
            KON = 239;
            loadFile(ARG | 0);
            return 0;
        }
        function _N_quotient() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
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
                return 261;
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
                return 261;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_remainder() {
            if ((LEN | 0) != 2) {
                err_invalidParamCount();
                return 261;
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
                return 261;
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
                return 261;
            }
            err_invalidArgument(ARG | 0);
            return 261;
        }
        function _N_error() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
            }
            ARG = MEM32[PAR + 4 >> 2] | 0;
            STKTOP = STKTOP + 4 | 0;
            printError(ARG | 0);
            return 261;
        }
        function _N_length() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
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
                return 261;
            }
            VAL = LEN << 2 | 3 | 0;
            return KON | 0;
        }
        function _N_sin() {
            if ((LEN | 0) != 1) {
                err_invalidParamCount();
                return 261;
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
            return 261;
        }
        function _N_exit() {
            return 0;
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
            case 26:
                return _E_evalBnd() | 0;
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
            return 261;
        }
        function _E_setLocal() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = KON;
            MEM32[STKTOP >> 2] = MEM32[EXP + 4 >> 2] | 0;
            EXP = MEM32[EXP + 8 >> 2] | 0;
            KON = 109;
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
            KON = 113;
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
            KON = 117;
            return _E_eval() | 0;
        }
        function _E_c_evalDfv() {
            OFS = (MEM32[STKTOP >> 2] | 0) >> 2 | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            MEM32[FRM + (OFS << 2) >> 2] = VAL;
            STKTOP = STKTOP + 8 | 0;
            return KON | 0;
        }
        function _E_evalBnd() {
            if ((STKTOP - MEMTOP | 0) < 128) {
                claimCollect();
            }
            ;
            STKTOP = STKTOP - 8 | 0;
            MEM32[STKTOP + 4 >> 2] = KON;
            MEM32[STKTOP >> 2] = EXP;
            EXP = MEM32[EXP + 8 >> 2] | 0;
            KON = 121;
            return _E_eval() | 0;
        }
        function _E_c_evalBnd() {
            EXP = MEM32[STKTOP >> 2] | 0;
            OFS = (MEM32[EXP + 4 >> 2] | 0) >> 2 | 0;
            MEM32[FRM + (OFS << 2) >> 2] = VAL;
            EXP = MEM32[EXP + 12 >> 2] | 0;
            KON = MEM32[STKTOP + 4 >> 2] | 0;
            STKTOP = STKTOP + 8 | 0;
            return _E_eval() | 0;
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
            KON = 129;
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
            KON = 135;
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
            KON = 139;
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
            KON = 225;
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
            KON = 153;
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
                    return 261;
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
                KON = 225;
                return 105;
            case 36:
                if ((MEM32[VAL + 4 >> 2] | 0) >> 2 | 0) {
                    err_invalidParamCount();
                    return 261;
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
                KON = 225;
                return 105;
            case 70:
                LEN = 0;
                return VAL >>> 5 | 0;
            case 24:
                err_invalidParamCount();
                return 261;
            }
            err_invalidOperator(VAL | 0);
            return 261;
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
            KON = 165;
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
                    return 261;
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
                return 105;
            case 36:
                if ((MEM32[VAL + 4 >> 2] | 0) >> 2 | 0) {
                    err_invalidParamCount();
                    return 261;
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
                return 105;
            case 70:
                LEN = 0;
                return VAL >>> 5 | 0;
            case 24:
                err_invalidParamCount();
                return 261;
            }
            err_invalidOperator(VAL | 0);
            return 261;
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
            KON = 177;
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
                    return 261;
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
                KON = 225;
                return _E_prcEvalArgs() | 0;
            case 36:
                LEN = (MEM32[VAL + 4 >> 2] | 0) >> 2 | 0;
                SIZ = (MEM32[VAL + 8 >> 2] | 0) >> 2 | 0;
                if ((LEN | 0) > ((MEM32[ARG >> 2] | 0) >>> 8 | 0)) {
                    err_invalidParamCount();
                    return 261;
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
                KON = 225;
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
                    return 261;
                }
                return _E_continuationArg() | 0;
            }
            err_invalidOperator(VAL | 0);
            return 261;
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
            KON = 189;
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
                    return 261;
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
                    return 261;
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
                    return 261;
                }
                return _E_continuationArg() | 0;
            }
            err_invalidOperator(VAL | 0);
            return 261;
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
                KON = 195;
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
                        KON = 201;
                    } else {
                        for (; (IDX | 0) < (LEN | 0); IDX = IDX + 1 | 0)
                            MEM32[STKTOP + (IDX << 2) >> 2] = 2147483629;
                        STKTOP = STKTOP - 16 | 0;
                        MEM32[STKTOP + 12 >> 2] = KON;
                        MEM32[STKTOP + 8 >> 2] = VAL;
                        MEM32[STKTOP + 4 >> 2] = TMP << 2 | 3 | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 199;
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
                        KON = 201;
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
                        KON = 207;
                    } else {
                        STKTOP = STKTOP - 20 | 0;
                        MEM32[STKTOP + 16 >> 2] = KON;
                        MEM32[STKTOP + 12 >> 2] = VAL;
                        MEM32[STKTOP + 8 >> 2] = PAR;
                        MEM32[STKTOP + 4 >> 2] = TMP;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 205;
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
            return 105;
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
                        KON = 207;
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
                            KON = 223;
                        } else {
                            STKTOP = STKTOP - 20 | 0;
                            MEM32[STKTOP + 16 >> 2] = KON;
                            MEM32[STKTOP + 12 >> 2] = VAL;
                            MEM32[STKTOP + 8 >> 2] = PAR;
                            MEM32[STKTOP + 4 >> 2] = IDX << 2 | 3 | 0;
                            MEM32[STKTOP >> 2] = ARG;
                            KON = 213;
                        }
                    } else {
                        STKTOP = STKTOP - 24 | 0;
                        MEM32[STKTOP + 20 >> 2] = KON;
                        MEM32[STKTOP + 16 >> 2] = VAL;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = IDX << 2 | 3 | 0;
                        MEM32[STKTOP + 4 >> 2] = ARG;
                        MEM32[STKTOP >> 2] = LEN << 2 | 3 | 0;
                        KON = 211;
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
                return 105;
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
                            KON = 223;
                            STKTOP = STKTOP + 8 | 0;
                        } else {
                            KON = 213;
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
                        KON = 221;
                    } else {
                        STKTOP = STKTOP - 24 | 0;
                        MEM32[STKTOP + 20 >> 2] = KON;
                        MEM32[STKTOP + 16 >> 2] = VAL;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = LEN << 2 | 3 | 0;
                        MEM32[STKTOP + 4 >> 2] = IDX << 2 | 3 | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 219;
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
            return 105;
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
                        KON = 221;
                    } else {
                        STKTOP = STKTOP - 16 | 0;
                        MEM32[STKTOP + 12 >> 2] = PAR;
                        MEM32[STKTOP + 8 >> 2] = LEN << 2 | 3 | 0;
                        MEM32[STKTOP + 4 >> 2] = IDX << 2 | 3 | 0;
                        MEM32[STKTOP >> 2] = ARG;
                        KON = 219;
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
                    return 261;
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
                    return 261;
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
                    return 261;
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
                return 261;
            }
            VAL = MEM32[STKTOP + 4 >> 2] | 0;
            ARG = makePair(MEM32[LST + 4 >> 2] | 0, 2147483625) | 0;
            LST = MEM32[LST + 8 >> 2] | 0;
            if (((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0) {
                KON = 233;
                STKTOP = STKTOP + 8 | 0;
            } else {
                MEM32[STKTOP >> 2] = LST;
            }
            return 237;
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
                        return 261;
                    }
                    TMP = MEM32[ARG + 4 >> 2] | 0;
                    ARG = MEM32[ARG + 8 >> 2] | 0;
                    MEM32[FRM + (IDX << 2) >> 2] = TMP;
                }
                if (!(((ARG & 1 ? MEM8[ARG & 31] | 0 : (MEM32[ARG >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0)) {
                    err_invalidParamCount();
                    return 261;
                }
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                return 105;
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
                        return 261;
                    }
                    TMP = MEM32[ARG + 4 >> 2] | 0;
                    ARG = MEM32[ARG + 8 >> 2] | 0;
                    MEM32[FRM + (IDX << 2) >> 2] = TMP;
                }
                MEM32[FRM + (IDX << 2) >> 2] = ARG;
                ENV = MEM32[VAL + 16 >> 2] | 0;
                EXP = MEM32[VAL + 12 >> 2] | 0;
                return 105;
            case 70:
                for (LEN = 0, LST = ARG; ((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 0 | 0 | 0; LEN = LEN + 1 | 0)
                    LST = MEM32[LST + 8 >> 2] | 0;
                if (!(((LST & 1 ? MEM8[LST & 31] | 0 : (MEM32[LST >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0)) {
                    err_invalidArgument(ARG | 0);
                    return 261;
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
                    return 261;
                }
                if (!((((MEM32[ARG + 8 >> 2] | 0) & 1 ? MEM8[(MEM32[ARG + 8 >> 2] | 0) & 31] | 0 : (MEM32[(MEM32[ARG + 8 >> 2] | 0) >> 2] | 0) >>> 2 & 63 | 0) | 0) == 68 | 0 | 0)) {
                    err_invalidParamCount();
                    return 261;
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
            return 261;
        }
        function _N_c1_load() {
            EXP = compile(VAL, 1) | 0;
            FRM = GLB;
            ENV = __EMPTY_VEC__;
            KON = 225;
            return 105;
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
            KON = 249;
            return 241;
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
            return 241;
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
                KON = 253;
            }
            ARG = MEM32[ARG + 4 >> 2] | 0;
            EXP = MEM32[EXP + 4 >> 2] | 0;
            return 241;
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
                KON = 253;
            }
            ARG = MEM32[ARG + (IDX << 2) >> 2] | 0;
            EXP = MEM32[EXP + (IDX << 2) >> 2] | 0;
            return 241;
        }
        function _REPL() {
            clearRefs();
            printOutput(__REFS_USED__ << 2 | 3 | 0);
            KON = 257;
            promptInput();
            return 0;
        }
        function _c1_repl() {
            EXP = compile(VAL, 0) | 0;
            //printOutput(EXP|0);
            //return 255;
            KON = 259;
            return 105;
        }
        function _c2_repl() {
            printOutput(VAL | 0);
            return 255;
        }
        function _error() {
            FRM = GLB;
            ENV = __EMPTY_VEC__;
            emptyStk();
            return 255;
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
            _E_evalBnd,
            nop,
            _E_c_evalBnd,
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
            nop,
            nop,
            nop,
            nop,
            nop,
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
            Slip_REPL: Slip_REPL,
            inputReady: inputReady,
            /************************/
            /*** ABSTRACT GRAMMAR ***/
            /************************/
            //generic
            ftag: ftag,
            fmake: fmake,
            fget: fget,
            fsize: fsize,
            fset: fset,
            fsetRaw: fsetRaw,
            //text 
            fmakeText: fmakeText,
            ftextGetChar: ftextGetChar,
            ftextSetChar: ftextSetChar,
            ftextLength: ftextLength,
            fisString: fisString,
            fisSymbol: fisSymbol,
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
            //binding
            fbndOfs: fbndOfs,
            fbndVal: fbndVal,
            fbndBdy: fbndBdy,
            fisBnd: fisBnd,
            //sequence tail
            fstlExp: fstlExp,
            fisStl: fisStl,
            //other
            slipVoid: slipVoid,
            slipNull: slipNull,
            slipTrue: slipTrue,
            slipFalse: slipFalse,
            protect: protect,
            fcopy: fcopy,
            free: free,
            feq: feq
        };
    }
    /* --- INITIALISATION --- */
    //memory
    var __DEFAULT_MEM__ = 24;
    var memSiz = 1 << (size || __DEFAULT_MEM__);
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
        dctDefine: function (s) {
            return dictionary.defineVar(s, false, false);
        },
        compile: compiler.compile
    };
    Function.prototype.c = function () {
        var printOut = printer.printExp;
        var locals = Object.create(null);
        var protectedRefs = new Set();
        function clearRef(ref) {
            if (!protectedRefs.has(ref)) {
                //console.log('[' + ref + '] ' + printOut(ref));
                protectedRefs.add(ref);
                asm.free(ref);
            }
        }
        try {
            var //console.log("ENTER " + this.name);
            returned = this.apply(locals, arguments);
            if (returned instanceof Array) {
                var len = returned.length;
                for (var i = 0; i < len; ++i) {
                    protectedRefs.add(returned[i]);
                }
            } else {
                protectedRefs.add(returned);
            }
            return returned;
        } finally {
            for (var k in locals) {
                var local = locals[k];
                if (local instanceof Array) {
                    var len = local.length;
                    for (//console.log('this.' + k + ': ')
                        var i = 0; i < len; ++i) {
                        clearRef(local[i]);
                    }
                } else {
                    //console.log('this.' + k + ': ');
                    clearRef(local);
                }
            }
        }
    };
    var //asm module
    asm = SLIP_ASM(callbacks.stdlib, foreign, buffer);
    asm.stringText = function (chk) {
        var len = asm.ftextLength(chk);
        var arr = new Array(len);
        for (var i = 0; i < len; ++i)
            arr[i] = asm.ftextGetChar(chk, i);
        return String.fromCharCode.apply(null, arr);
    };
    //linking
    pool.link(asm);
    reader.link(asm, errors, pool);
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