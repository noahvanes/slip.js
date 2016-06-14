function SYMBOLS() {
    'use strict';
    var pool = Object.create(null);
    var asm;
    function link(asmModule) {
        asm = asmModule;
    }
    function buildSymbol(txt) {
        var len = txt.length;
        var sym = asm.fmakeText(3, len);
        for (var i = 0; i < len; ++i)
            asm.ftextSetChar(sym, i, txt.charCodeAt(i));
        return sym;
    }
    function enterPool(str) {
        var sym = pool[str];
        if (!sym) {
            // new symbol
            sym = buildSymbol(str);
            pool[str] = asm.protect(sym);
        } else {
            sym = asm.fcopy(sym);
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
        loadDfi: symbol('define-inline'),
        link: link
    };
}