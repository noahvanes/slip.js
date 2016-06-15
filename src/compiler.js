function COMPILER() {
	"use strict";

	var INLINING_DEPTH = 1;
	var INLINE_LOGGING = false;  // for debugging, turn on

	var asm, dct, sym, err;		
	var isPair, isNull;
	var car, cdr;
	var printOut;

	function link(asmModule, dctModule, symModule, errModule, prtModule) {
		asm = asmModule;
		dct = dctModule;
		sym = symModule;
		err = errModule;
		car = asm.fpairCar;
		cdr = asm.fpairCdr;
		isPair = asm.fisPair;
		isNull = asm.fisNull;
		printOut = prtModule.printExp;
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
		this.clean = [];
		var sum = 0;
		while(isPair(lst)) {
			++sum;
			lst = cdr(lst);
			this.clean.push(lst);
		}
		if (isNull(lst))
			return sum;
		else
			compilationError(err,lst);
	}

	function listToArray(lst) {
		this.clean = [];
		this.arr = [];
		while(isPair(lst)) {
			this.arr.push(car(lst));
			lst = cdr(lst);
			this.clean.push(lst);
		}
		return this.arr;
	}

	function makeSeq(items) {

		this.clean = [];
		var len = items.length;
		if (len===0) {
			return asm.slipVoid();
		} else if (len===1) { 
			return items[0];
		} else {
			var seq = [__SEQ_TAG__];
			for(var i = 0; i < len; ++i) {
				var item = items[i];
				// flatten sequences
				if(asm.ftag(item)===__SEQ_TAG__) {
					var seqlen = asm.fsize(item);
					for(var j = 1; j < seqlen; ++j) {
						var exp = asm.fget(item,j);
						this.clean.push(exp);
						seq.push(exp);
					}
					var last = asm.fget(item,seqlen);
					this.clean.push(last);
					last = asm.fstlExp(last);
					this.clean.push(last);
					seq.push(last);
				} else {
					seq.push(item);
				}
			}
			this.tail = make(__STL_TAG__,seq.pop());
			seq.push(this.tail);
			return make.apply(null,seq);
		}
	}

	function log_inline(msg) {
		if(INLINE_LOGGING)
			console.log(msg);
	}

	function compilationError(err) {
		err(arguments[1]);
		throw err;
	}

	function compile_exp(exp,tail) {
		try {
			dct.checkpoint();
			return compile.c(exp,tail>0,false);
		} catch(exception) {
			console.log(exception);
			dct.rollback();
			return asm.slipVoid();
		}
	} 

	function compile(exp,tailc,inline) {

		//compound expression
		if(isPair(exp)) {
			this.opr = car(exp);
			this.opd = cdr(exp);
			//check for special form
			if(asm.fisSymbol(this.opr)) {  
				if(asm.feq(this.opr,sym.loadIff()))
					return compileIf.c(this.opd,tailc,inline);
				else if (asm.feq(this.opr,sym.loadDef()))
					return compileDefine.c(this.opd,false,inline);
				else if (asm.feq(this.opr,sym.loadDfi()))
					return compileDefine.c(this.opd,true,inline);
				else if (asm.feq(this.opr,sym.loadBeg()))
					return compileSequence.c(this.opd,tailc,inline);
				else if (asm.feq(this.opr,sym.loadLmb()))
					return compileLambda.c(this.opd,inline);
				else if (asm.feq(this.opr,sym.loadSet()))
					return compileAssignment.c(this.opd,inline);
				else if (asm.feq(this.opr,sym.loadQuo()))
					return compileQuote.c(this.opd);
			}
			return compileApplication.c(this.opr,this.opd,tailc,inline);
		}
		//simple expression
		if(asm.fisSymbol(exp))
			return compileVariable.c(exp,inline);
		else
			return exp;
	}

	function compileIf(exp,tailc,inline) {

		if(!isPair(exp))
			compilationError(err.invalidIf);

		this.predicate = car(exp);
		this.branches = cdr(exp);

		if(!isPair(this.branches))
			compilationError(err.invalidIf);

		this.consequent = car(this.branches);
		this.alternative = cdr(this.branches);
		this.c_predicate = compile.c(this.predicate,false,inline);
		this.c_consequent = compileInline.c(this.consequent,tailc,inline);

		if(asm.fisNull(this.alternative))
			return make(__IFS_TAG__,this.c_predicate,this.c_consequent);
		else if (asm.fisPair(this.alternative)) {
			this.alt = car(this.alternative);
			this.rest = cdr(this.alternative);
			if(!isNull(this.rest)) { compilationError(err.invalidIf) }
			this.c_alternative = compileInline.c(this.alt,tailc,inline);
			return make(__IFF_TAG__,this.c_predicate,this.c_consequent,this.c_alternative);
		} else
			compilationError(err.invalidIf);
	}

	function compileInline(exp,tailc,inline) {

		//inlining definition are allowed
		if(inline) {
			var defCount = inline.offset;
			this.c_exp = compile.c(exp,tailc,inline);
			if(inline.offset > defCount)
				throw false;
			return this.c_exp;
		}

		dct.enterScope();
		this.c_exp = compile.c(exp,true,false);
		var defSize = dct.frameSize();
		var actualSize = dct.exitScope();

		if(defSize === 0) //no thunking needed
			return compile.c(exp,tailc,false);

		this.siz = asm.fmakeNumber(actualSize);
		var tag = (tailc?__TTK_TAG__:__THK_TAG__);
		return make(tag,this.c_exp,this.siz);
	}

	function compileSequence(seq,tailc,inline) {

		this.clean = [];
		this.items = [];
		var len = listLength.c(seq,err.invalidSequence);

		for(var idx = 1; idx < len; ++idx) {
			var exp = car(seq);
			seq = cdr(seq);
			var c_exp = compile.c(exp,false,inline);
			this.items.push(c_exp);
			this.clean.push(exp);
			this.clean.push(seq);
		}

		if(len > 0) {
			var exp = car(seq);
			var c_exp = compile.c(exp,tailc,inline);
			this.items.push(c_exp);
			this.clean.push(exp);
		}

		return makeSeq.c(this.items);
	}

	function compileDefine(opd,constant,inline) {

		if(!isPair(opd))
			compilationError(err.invalidDefine);
		
		this.identifier = car(opd);
		this.definition = cdr(opd);

		if(asm.fisSymbol(this.identifier))
			return compileVarDefinition.c(this.identifier,this.definition,constant,inline);
	 	else if(isPair(this.identifier))
			return compileFunDefinition.c(this.identifier,this.definition,constant,inline);
	}

	function compileVarDefinition(identifier,definition,constant,inline) {

		if(!isPair(definition))
			compilationError(err.invalidDefine);

		this.exp = car(definition);
		this.rest = cdr(definition);

		if(!asm.fisNull(this.rest))
			compilationError(err.invalidDefine);

		var pos;
		if(inline) {
			pos = ++inline.offset;
			inline.defs.push({name: asm.fcopy(identifier), offset: pos});
		} else {
			pos = dct.defineVar(identifier,constant);
		}
		this.ofs = asm.fmakeNumber(pos);
		this.c_exp = compile.c(this.exp,false,inline);
		return make(__DFV_TAG__,this.ofs,this.c_exp);
	}

	function compileFunDefinition(identifier,body,constant,inline) {

		if(inline) throw false;

		this.fname = car(identifier);
		this.parameters = cdr(identifier);

		if(!asm.fisSymbol(this.fname))
			compilationError(err.invalidDefine);
		this.ofs = asm.fmakeNumber(dct.defineVar(this.fname,constant));

		dct.enterScope();
		this.rest = compileParameters.c(this.parameters);
		this.argc = asm.fmakeNumber(dct.frameSize());			

		if(isNull(this.rest) && constant) {  // inlining possible
			var fun = dct.registerFunction(body,this.parameters,asm.fnumberVal(this.argc));
			this.c_body = compileSequence.c(body,true,false);
			this.frmSiz = asm.fmakeNumber(dct.exitScope());
			if(fun.inlined) { dct.unregisterFunction(fun) }; 
			return make(__DFF_TAG__,this.ofs,this.argc,this.frmSiz,this.c_body);
		} else if(isNull(this.rest)) {
			this.c_body = compileSequence.c(body,true,false);
			this.frmSiz = asm.fmakeNumber(dct.exitScope());
			return make(__DFF_TAG__,this.ofs,this.argc,this.frmSiz,this.c_body);
		} else if(asm.fisSymbol(this.rest)) {
			dct.defineVar(this.rest,false);
			this.c_body = compileSequence.c(body,true,false);
			this.frmSiz = asm.fmakeNumber(dct.exitScope());
			return make(__DFZ_TAG__,this.ofs,this.argc,this.frmSiz,this.c_body);
		} else
			compilationError(err.invalidDefine);
	}

	function compileParameters(lst) {

		this.clean = [];
		while(isPair(lst)) {
			var par = car(lst);
			if(!asm.fisSymbol(par))
				compilationError(err.invalidParameter,par);
			dct.defineVar(par,false);
			lst = cdr(lst);
			this.clean.push(par);
			this.clean.push(lst);
		}
		return lst;
	}

	function compileLambda(exp,inline) {

		if(inline) throw false;

		if(!isPair(exp))
			compilationError(err.invalidLambda)

		this.parameters = car(exp);
		this.body = cdr(exp);

		dct.enterScope();
		this.rest = compileParameters.c(this.parameters);
		this.argc = asm.fmakeNumber(dct.frameSize());

		if(isNull(this.rest)) {
			this.c_body = compileSequence.c(this.body,true,false);
			this.frmSiz = asm.fmakeNumber(dct.exitScope());
			return make(__LMB_TAG__,this.argc,this.frmSiz,this.c_body);
		} else if(asm.fisSymbol(this.rest)) {
			dct.defineVar(this.rest,false);
			this.c_body = compileSequence.c(this.body,true,false);
			this.frmSiz = asm.fmakeNumber(dct.exitScope());
			return make(__LMZ_TAG__,this.argc,this.frmSiz,this.c_body);
		} else
			compilationError(err.invalidParameter);
	}

	function lookupInline(identifier,inline) {

		var locals = inline.locals;
		var len = locals.length;
		for(var i = len-1; i >= 0; --i) {
			var local = locals[i];
			if(asm.feq(local.name,identifier))
				return local.value;
		}

		return false;
	}

	function lookupDefs(identifier,inline) {

		var defs = inline.defs;
		var len = defs.length;
		for(var i = len-1; i >= 0; --i) {
			var def = defs[i];
			if(asm.feq(def.name,identifier))
				return def.offset;
		}

		return false;
	}

	function compileAssignment(exp,inline) {

		if(!isPair(exp))
			compilationError(err.invalidAssignment);

		this.identifier = car(exp);
		this.definition = cdr(exp);

		if(!asm.fisSymbol(this.identifier) || !isPair(this.definition))
			compilationError(err.invalidAssignment);

		this.expression = car(this.definition);
		this.c_exp = compile.c(this.expression,false,inline);

		var adr;
		if(inline) {
			var ofs = lookupDefs(this.identifier,inline);
			if(ofs)
				adr = {scope: 0, offset: ofs}
			else if (lookupInline(this.identifier,inline))
				throw false;  // cannot assign inlined argument
			else
				adr = dct.lookupEnvironment(this.identifier,inline.env);
		} else {
			adr = dct.lexicalAdr(this.identifier);
		}

		if(adr) {

			var scope = adr.scope;
			var offset = adr.offset;
			var vrb = dct.lookup(scope,offset);

			if(vrb.constant)
				compilationError(err.constantViolation,identifier);

			this.ofs = asm.fmakeNumber(offset);
			if(scope == 0) {
				return make(__SLC_TAG__,this.ofs,this.c_exp);
			} else {
				this.scp = asm.fmakeNumber(scope);
				return make(__SGL_TAG__,this.scp,this.ofs,this.c_exp);
			}
		}

		compilationError(err.undefinedVariable,identifier);
	}

	function compileVariable(sym,inline) {

		var adr;
		if(inline) {
			var ofs = lookupDefs(sym,inline);
			if(ofs) {
				adr = {scope: 0, offset: ofs}
			} else {
				var val = lookupInline(sym,inline);
				if(val) 
					return asm.fcopy(val);
				else
					adr = dct.lookupEnvironment(sym,inline.env);
			}
		} else {
			adr = dct.lexicalAdr(sym);
		}

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

	function compileQuote(exp) {

		if(!isPair(exp))
			compilationError(err.invalidQuote);

		this.quoted = car(exp);
		this.rest = cdr(exp);

		if(!asm.fisNull(this.rest))
			compilationError(err.invalidQuote);

		return make(__QUO_TAG__,this.quoted);
	}

	function compileArguments(opd,argc,tailc,inline) {

		this.clean = [];
		var args = [__VCT_TAG__];
		for(var i = 1; i < argc; ++i) {
			var exp = car(opd);
			var c_exp = compile.c(exp,false,inline);
			args.push(c_exp);
			opd = cdr(opd);
			this.clean.push(exp);
			this.clean.push(c_exp);
			this.clean.push(opd);
		}

		this.exp = car(opd);
		this.c_exp = compile.c(this.exp,tailc,inline);
		args.push(this.c_exp);

		return [ make.apply(null,args), compile.c(this.exp,false,inline) ];
	}

	function compileApplication(opr,opd,tailc,inline) {

		var argc = listLength.c(opd,err.invalidParameter);
		if (argc === 0) {
			this.c_opr = compile.c(opr,tailc,inline);
			return specializeApz.c(this.c_opr,tailc,inline);
		} else {
			this.c_opr = compile.c(opr,false,inline);
			this.c_args = compileArguments.c(opd,argc,tailc,inline);
			return specializeApl.c(this.c_opr,this.c_args,tailc,inline);
		}
	}

	function specializeApz(c_opr,tailc,inline) {

		this.empty_vec = make(__VCT_TAG__);

		switch(asm.ftag(c_opr)) {

			case __LCL_TAG__:
				var ofs = asm.flocalOfs(c_opr);
				try {
					return inlineApplication.c(0,ofs,this.empty_vec,tailc,inline);
				} catch(e) {
					if(e) throw e;
					return (tailc?
							 makeRaw(__TLZ_TAG__,ofs):
							 makeRaw(__ALZ_TAG__,ofs));
				}

			case __GLB_TAG__:
				var ofs = asm.fglobalOfs(c_opr);
				try {
					return inlineApplication.c(1,ofs,this.empty_vec,tailc,inline);
				} catch(e) {
					if(e) throw e;
					return (tailc?
							makeRaw(__TGZ_TAG__,ofs):
							makeRaw(__AGZ_TAG__,ofs));
				}

			case __NLC_TAG__:
				var scp = asm.fnlcScp(c_opr);
				var ofs = asm.fnlcOfs(c_opr);
				try {
					return inlineApplication.c(scp,ofs,this.empty_vec,tailc,inline);
				} catch(e) {					
					if(e) throw e;
	 				return (tailc?
							makeRaw(__TNZ_TAG__,scp,ofs):
							makeRaw(__ANZ_TAG__,scp,ofs));
				}

			default:
				return (tailc?
						make(__TPZ_TAG__,c_opr):
						make(__APZ_TAG__,c_opr));
		}
	}

	function specializeApl(c_opr,args,tailc,inline) {

		switch(asm.ftag(c_opr)) {

			case __LCL_TAG__:
				var ofs = asm.flocalOfs(c_opr);
				try {
					return inlineApplication.c(0,ofs,args,tailc,inline);
				} catch(e) {
					if(e) throw e;
					this.ofs = asm.fmakeNumber(ofs);
					var tag = (tailc?__TLL_TAG__:__ALL_TAG__);
					return make(tag,this.ofs,args[0]);
				}

			case __GLB_TAG__:
				var ofs = asm.fglobalOfs(c_opr);
				try {	
					return inlineApplication.c(1,ofs,args,tailc,inline);
				} catch(e) {
					if(e) throw e;
					this.ofs = asm.fmakeNumber(ofs);
					var tag = (tailc?__TGL_TAG__:__AGL_TAG__);
					return make(tag,this.ofs,args[0]);
				}

			case __NLC_TAG__:
				var scp = asm.fnlcScp(c_opr);
				var ofs = asm.fnlcOfs(c_opr);
				try {
					return inlineApplication.c(scp,ofs,args,tailc,inline);
				} catch(e) {
					if(e) throw e;
					this.scp = asm.fmakeNumber(scp);
					this.ofs = asm.fmakeNumber(ofs);
					var tag = (tailc?__TNL_TAG__:__ANL_TAG__);
					return make(tag,this.scp,this.ofs,args[0]);
				}

			default:
				var tag = (tailc? __TPL_TAG__:__APL_TAG__);
				return make(tag,c_opr,args[0]);
		}
	}

	function inlineApplication(scp,ofs,args,tailc,inl) {

		var fun = dct.lookup(scp,ofs);
		if (!fun.inline || fun.inlining >= INLINING_DEPTH) 
			{ throw false; }

		log_inline('inlining ' + asm.stringText(fun.name) + '(' + fun.inlining + ')');

		var frmMinSiz = dct.getMinimumFrameSize();
		var defOffset = (inl? inl.offset:dct.frameSize());

		if (fun.argc !== asm.fvectorLength(args[0]))
				compilationError(err.invalidParamCount);

		try {

			++fun.inlining;  //increase counter

			var inline = Object.create(null);
			this.expressions = bindInline.c(args,fun.params,inline,defOffset);
			inline.env = fun.env;  // set lexical environment
			this.body = compileSequence.c(fun.body,tailc,inline);			
			dct.setMinimumFrameSize(inline.offset);
			
			fun.inlined = true;
			log_inline('successfully inlined ' + asm.stringText(fun.name) + '(' + fun.inlining + ')')

			return makeInlineBody.c(this.expressions,this.body,defOffset);
		
		} catch(e) {

			fun.inlined = false;
			log_inline('failed to inline ' + asm.stringText(fun.name) + '(' + fun.inlining + ')');
			dct.resetMinimumFrameSize(frmMinSiz);
			dct.unregisterFunction(fun);
			throw e;

		} finally {

			--fun.inlining;			
			//manage references for proper clean-up
			this.inlinedNames = inline.locals.map(x => x.name);
			this.inlinedValues = inline.locals.map(x => x.value);
			this.localDefs = inline.defs.map(x => x.name);
		}
	}

	function bindInline(args,params,inline,ofs) {

		this.clean = [];
		this.expressions = [];
		var inlinedLocals = [];
		var argDefinitions = [];
		var c_args = args[0];
		var len = asm.fvectorLength(c_args);

		for(var i = 1; i <= len; ++i) {
			var param = car(params);
			var arg = asm.vectorAt(c_args,i);
			var tag = asm.ftag(arg);
			switch(tag) {
				case __NUL_TAG__: case __VOI_TAG__: case __TRU_TAG__: case __FLS_TAG__:
				case __NBR_TAG__: case __CHR_TAG__: case __STR_TAG__: case __FLT_TAG__: 
				case __QUO_TAG__: case __GLB_TAG__: case __NLC_TAG__: case __LCL_TAG__:
					inlinedLocals.push({name: param, value: arg});
					break;
				default:
					this.clean.push(arg);
					arg = (i===len? asm.fcopy(args[1]) : arg);
					argDefinitions.push({name: param, offset: ++ofs});
					this.expressions.push(arg);
			}
			params = cdr(params);
			this.clean.push(params);
		}

		inline.offset = ofs;
		inline.defs = argDefinitions;
		inline.locals = inlinedLocals;		
		return this.expressions;
	}

	function makeInlineBody(expressions,body,offset) {

		this.clean = [];
		var len = expressions.length;
		var bdy = body;
		while(len) {
			var idx = asm.fmakeNumber(offset+len);
			var exp = expressions[--len];
			bdy = make(__BND_TAG__,idx,exp,bdy);
			this.clean.push(bdy);
		}
		return bdy;
	}

	return {
		link: link,
		compile: compile_exp
	}
}