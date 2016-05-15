function COMPILER() {
	"use strict";

	var asm, dct, sym, err;		
	var isPair, isNull;
	var car, cdr;

	function link(asmModule, dctModule, symModule, errModule) {
		asm = asmModule;
		dct = dctModule;
		sym = symModule;
		err = errModule;
		car = asm.fpairCar;
		cdr = asm.fpairCdr;
		isPair = asm.fisPair;
		isNull = asm.fisNull;
	}

	function make() {
		var tag = arguments[0];
		var len = arguments.length;
		var chk = asm.fmake(tag,len-1);
		for(var i = 1; i < len; ++i)
			asm.fset(chk,i,arguments[i]);
		return chk;
	}

	function makeRaw() {
		var tag = arguments[0];
		var len = arguments.length;
		var chk = asm.fmake(tag,len-1);
		for(var i = 1; i < len; ++i)
			asm.fsetRaw(chk,i,arguments[i]);
		return chk;
	}


	function listLength(lst,err) {
		var sum = 0;
		while(isPair(lst)) {
			lst = cdr(lst);
			++sum;
		}
		if (isNull(lst))
			return sum;
		else
			compilationError(err,lst);
	}

	function compilationError(err) {
		err(arguments[1])
		throw err;
	}

	function compile_exp(exp,tail) {
		try {
			dct.checkpoint();
			return compile(exp,tail>0);
		} catch(exception) {
			dct.rollback();
			return asm.slipVoid();
		}
	}

	function compile(exp,tailc) {

		//compound expression
		if(isPair(exp)) {
			var opr = car(exp);
			var opd = cdr(exp);
			//check for special form
			if(asm.fisSymbol(opr)) {  
				if(asm.feq(opr,sym.loadIff()))
					return compileIf(opd,tailc);
				else if (asm.feq(opr,sym.loadDef()))
					return compileDefine(opd);
				else if (asm.feq(opr,sym.loadBeg()))
					return compileSequence(opd,tailc);
				else if (asm.feq(opr,sym.loadLmb()))
					return compileLambda(opd);
				else if (asm.feq(opr,sym.loadSet()))
					return compileAssignment(opd);
				else if (asm.feq(opr,sym.loadQuo()))
					return compileQuote(opd);
			}
			//otherwise, assume application
			return compileApplication(opr,opd,tailc);
		}
		//simple expression
		if(asm.fisSymbol(exp))
			return compileVariable(exp);
		else
			return exp;
	}

	function compileIf(exp,tailc) {

		if(!isPair(exp))
			compilationError(err.invalidIf);

		var predicate = car(exp);
		var branches = cdr(exp);

		if(!isPair(branches))
			compilationError(err.invalidIf);

		var consequent = car(branches);
		var alternative = cdr(branches);
		var c_predicate = compile(predicate,false);
		var c_consequent = compileInline(consequent,tailc);

		if(asm.fisNull(alternative))
			return make(__IFS_TAG__,c_predicate,c_consequent);
		else if (asm.fisPair(alternative)) {
			var c_alternative = compile(car(alternative),tailc);
			return make(__IFF_TAG__,c_predicate,c_consequent,c_alternative);
		} else
			compilationError(err.invalidIf);
	}

	function compileInline(exp,tailc) {

		dct.enterScope();
		var c_exp = compile(exp,true);
		var size = dct.exitScope();

		if(size == 0) //no thunking needed
			return compile(exp,tailc);

		size = asm.fmakeNumber(size);
		if(tailc)
			return make(__TTK_TAG__,c_exp,size);
		else 
			return make(__THK_TAG__,c_exp,size);
	}

	function compileSequence(exp,tailc) {

		var len = listLength(exp,err.invalidSequence);
		if (len === 0)
			return asm.slipVoid();
		else if (len === 1)
			return compile(car(exp),tailc);
		else {
			var sequence = [__SEQ_TAG__];
			for(var idx = 1; idx < len; ++idx) {
				sequence.push(compile(car(exp),false));
				exp = cdr(exp);
			}
			var last_exp = compile(car(exp),tailc);
			var last_entry = make(__STL_TAG__,last_exp);
			sequence.push(last_entry);
			return make.apply(null,sequence);
		}
	}

	function compileDefine(opd) {

		if(!isPair(opd))
			compilationError(err.invalidDefine);
		
		var identifier = car(opd);
		var definition = cdr(opd);

		if(asm.fisSymbol(identifier))
			return compileVarDefinition(identifier,definition);
	 	else if(isPair(identifier))
			return compileFunDefinition(identifier,definition);
	}

	function compileVarDefinition(identifier,definition) {

		if(!isPair(definition))
			compilationError(err.invalidDefine);

		var exp = car(definition);
		var rest = cdr(definition);

		if(!asm.fisNull(rest))
			compilationError(err.invalidDefine);

		var pos = dct.defineVar(identifier);
		var ofs = asm.fmakeNumber(pos);
		var c_exp = compile(exp,false);
		return make(__DFV_TAG__,ofs,c_exp);
	}

	function compileFunDefinition(identifier,body) {

		var fname = car(identifier);
		var parameters = cdr(identifier);

		if(!asm.fisSymbol(fname))
			compilationError(err.invalidDefine);
		var ofs = asm.fmakeNumber(dct.defineVar(fname));
		
		dct.enterScope();
		var rest = compileParameters(parameters);
		var argc = asm.fmakeNumber(dct.frameSize());			

		if(isNull(rest)) {
			var c_body = compileSequence(body,true);
			var frmSiz = asm.fmakeNumber(dct.exitScope());
			return make(__DFF_TAG__,ofs,argc,frmSiz,c_body);
		} else if(asm.fisSymbol(rest)) {
			dct.defineVar(rest);
			var c_body = compileSequence(body,true);
			var frmSiz = asm.fmakeNumber(dct.exitScope());
			return make(__DFZ_TAG__,ofs,argc,frmSiz,c_body);
		} else
			compilationError(err.invalidDefine);
	}

	function compileParameters(lst) {

		while(isPair(lst)) {
			var par = car(lst);
			if(!asm.fisSymbol(par))
				compilationError(err.invalidParameter,par);
			dct.defineVar(par);
			lst = cdr(lst);
		}
		return lst;
	}

	function compileLambda(exp) {

		if(!isPair(exp))
			compilationError(err.invalidLambda)

		var parameters = car(exp);
		var body = cdr(exp);

		dct.enterScope();
		var rest = compileParameters(parameters);
		var argc = asm.fmakeNumber(dct.frameSize());

		if(isNull(rest)) {
			var c_body = compileSequence(body,true);
			var frmSiz = asm.fmakeNumber(dct.exitScope());
			return make(__LMB_TAG__,argc,frmSiz,c_body);
		} else if(asm.fisSymbol(rest)) {
			dct.defineVar(rest);
			var c_body = compileSequence(body,true);
			var frmSiz = asm.fmakeNumber(dct.exitScope());
			return make(__LMZ_TAG__,argc,frmSiz,c_body);
		} else
			compilationError(err.invalidParameter);
	}

	function compileAssignment(exp) {

		if(!isPair(exp))
			compilationError(err.invalidAssignment);

		var identifier = car(exp);
		var definition = cdr(exp);

		if(!asm.fisSymbol(identifier) 
			|| !isPair(definition) 
			|| !isNull(cdr(definition)))
			compilationError(err.invalidAssignment);

		var expression = car(definition);
		var c_exp = compile(expression,false);

		var adr = dct.lexicalAdr(identifier);
		if(adr) {
			var scope = adr.scope;
			var offset = adr.offset;
			var ofs = asm.fmakeNumber(offset);
			if(scope == 0) {
				return make(__SLC_TAG__,ofs,c_exp);
			} else {
				var scp = asm.fmakeNumber(scope);
				return make(__SGL_TAG__,scp,ofs,c_exp);
			}
		}

		compilationError(err.undefinedVariable,identifier);
	}

	function compileArguments(opd,argc,tailc) {

		var args = [__VCT_TAG__];
		for(var i = 1; i < argc; ++i) {
			var exp = car(opd);
			var c_exp = compile(exp,false);
			args.push(c_exp);
			opd = cdr(opd);
		}
		var exp = car(opd);
		var c_exp = compile(exp,tailc);
		args.push(c_exp);

		return make.apply(null,args);
	}

	function compileApplication(opr,opd,tailc) {

		var argc = listLength(opd,err.invalidParameter);
		if (argc === 0) {
			var c_opr = compile(opr,tailc);
			return specializeApz(c_opr,tailc);
		} else {
			var c_opr = compile(opr,false);
			var c_args = compileArguments(opd,argc,tailc);
			return specializeApl(c_opr,c_args,tailc);
		}
	}

	function specializeApz(c_opr,tailc) {

		switch(asm.ftag(c_opr)) {

			case __LCL_TAG__:
				var ofs = asm.flocalOfs(c_opr);
				return (tailc?
						 makeRaw(__TLZ_TAG__,ofs):
						 makeRaw(__ALZ_TAG__,ofs));

			case __GLB_TAG__:
				var ofs = asm.fglobalOfs(c_opr);
				return (tailc?
						makeRaw(__TGZ_TAG__,ofs):
						makeRaw(__AGZ_TAG__,ofs));

			case __NLC_TAG__:
				var scp = asm.fnlcScp(c_opr);
				var ofs = asm.fnlcOfs(c_opr);
				return (tailc?
						makeRaw(__TNZ_TAG__,scp,ofs):
						makeRaw(__ANZ_TAG__,scp,ofs));

			default:
				return (tailc?
						make(__TPZ_TAG__,c_opr):
						make(__APZ_TAG__,c_opr));
		}
	}

	function specializeApl(c_opr,c_args,tailc) {

		switch(asm.ftag(c_opr)) {

			case __LCL_TAG__:
				var ofs = asm.flocalOfs(c_opr);
				ofs = asm.fmakeNumber(ofs);
				return (tailc?
						 make(__TLL_TAG__,ofs,c_args):
						 make(__ALL_TAG__,ofs,c_args));

			case __GLB_TAG__:
				var ofs = asm.fglobalOfs(c_opr);
				ofs = asm.fmakeNumber(ofs);
				return (tailc?
						make(__TGL_TAG__,ofs,c_args):
						make(__AGL_TAG__,ofs,c_args));

			case __NLC_TAG__:
				var scp = asm.fnlcScp(c_opr);
				var ofs = asm.fnlcOfs(c_opr);
				scp = asm.fmakeNumber(scp);
				ofs = asm.fmakeNumber(ofs);
				return (tailc?
						make(__TNL_TAG__,scp,ofs,c_args):
						make(__ANL_TAG__,scp,ofs,c_args));

			default:
				return (tailc?
						make(__TPL_TAG__,c_opr,c_args):
						make(__APL_TAG__,c_opr,c_args));
		}
	}

	function compileQuote(exp) {

		if(!isPair(exp))
			compilationError(err.invalidQuote);

		var quoted = car(exp);
		var rest = cdr(exp);

		if(!asm.fisNull(rest))
			compilationError(err.invalidQuote);

		return make(__QUO_TAG__,quoted);
	}

	function compileVariable(sym) {

		var adr = dct.lexicalAdr(sym);
		if(adr) {
			var scope = adr.scope;
			var offset = adr.offset;
			if(scope === 0)
				return asm.fmakeLocal(offset);
			else if (scope === 1) 
				return asm.fmakeGlobal(offset);
			else 
				return makeRaw(__NLC_TAG__,scope,offset);
		}

		compilationError(err.undefinedVariable,sym);
	}

	return {
		link: link,
		compile: compile_exp
	}
}