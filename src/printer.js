function PRINTER() {
	"use strict";

	var getTag, numberVal, floatNumber, charCode,
	stringText, symbolLength, symbolAt,
	pairCar, pairCdr, isPair, isNull,
	vectorAt, vectorLength, ag;

	function link(asm) {
		getTag = asm.ftag;
		numberVal = asm.fnumberVal;
		floatNumber = asm.ffloatNumber;
		charCode = asm.fcharCode;
		stringText = asm.stringText;
		symbolLength = asm.ftextLength;
		symbolAt = asm.ftextGetChar;
		pairCar = asm.fpairCar;
		pairCdr = asm.fpairCdr;
		isPair = asm.fisPair;
		isNull = asm.fisNull;
		vectorAt = asm.vectorAt;
		vectorLength = asm.fvectorLength;
		ag = asm;
	}

	function printExp(exp) {

		var tag = getTag(exp);

		switch(tag) {

			case __NUL_TAG__: return '()';
			case __VOI_TAG__: return '#<void>';
			case __TRU_TAG__: return '#t';
			case __FLS_TAG__: return '#f';
			case __NBR_TAG__: return numberVal(exp).toString();
			case __CHR_TAG__:
				return '#\\'+String.fromCharCode(charCode(exp).toString());
			case __PAI_TAG__: return printPair(exp);
			case __VCT_TAG__: return printVector(exp);
			case __STR_TAG__: return stringText(exp);
			case __FLT_TAG__: return floatNumber(exp).toString();
			case __NAT_TAG__: return '#<native procedure>';
			case __CNT_TAG__: return '#<continuation>';
			case __SYM_TAG__: return symbolText(exp);
			case __PRC_TAG__:
			case __PRZ_TAG__: 
				return '#<procedure>'
			case __LCL_TAG__:
				return '#<local variable @ offset '
							+ ag.flocalOfs(exp) + '>';
			case __GLB_TAG__:
				return '#<global variable @ offset: '
							+ ag.fglobalOfs(exp) + '>';
			case __NLC_TAG__:
				return '#<non-local variable @ scope-level/offset: '
							+ ag.fnlcScp(exp) + '/'
							+ ag.fnlcOfs(exp) + '>';
			case __SEQ_TAG__:
				return '#<sequence '
							+ printSequence(exp) + '>';
			case __IFS_TAG__:
				return '#<simple-if '
							+ printExp(ag.fifsPredicate(exp)) + ' '
							+ printExp(ag.fifsConsequence(exp)) + '>';
			case __IFF_TAG__:
				return '#<full-if '
							+ printExp(ag.fiffPredicate(exp)) + ' '
							+ printExp(ag.fiffConsequence(exp)) + ' '
							+ printExp(ag.fiffAlternative(exp)) + '>';
			case __THK_TAG__:
				return '#<thunk (size: '
							+ printExp(ag.fthunkSiz(exp)) + '; body: '
							+ printExp(ag.fthunkExp(exp)) + ')>';
			case __TTK_TAG__:
				return '#<thunk* (size: '
							+ printExp(ag.fttkSiz(exp)) + '; body: '
							+ printExp(ag.fttkExp(exp)) + ')>';
			case __BND_TAG__:
				return '#<binding (ofs: '
							+ printExp(ag.fbndOfs(exp)) + '; value: '
							+ printExp(ag.fbndVal(exp)) + '; body: '
							+ printExp(ag.fbndBdy(exp)) + ')>';
			case __QUO_TAG__:
				return '#<quote '
							+ printExp(ag.fquoExpression(exp)) + '>';
			case __LMB_TAG__:
				return '#<lambda (argument count: '
							+ printExp(ag.flmbArgc(exp)) + '; frame size: '
							+ printExp(ag.flmbFrmSiz(exp)) + '; body: '
							+ printExp(ag.flmbBdy(exp)) + ')>';
			case __LMZ_TAG__:
				return '#<lambda (argument* count: '
							+ printExp(ag.flmzArgc(exp)) + '; frame size: '
							+ printExp(ag.flmzFrmSiz(exp)) + '; body: '
							+ printExp(ag.flmzBdy(exp)) + ')>';
			case __DFV_TAG__:
				return '#<variable definition @ offset '
							+ printExp(ag.fdfvOfs(exp)) + ' (value: '
							+ printExp(ag.fdfvVal(exp)) + ')>';
			case __DFF_TAG__:
				return '#<function definition @ offset '
							+ printExp(ag.fdffOfs(exp)) + ' (argument count: '
							+ printExp(ag.fdffArgc(exp)) + '; frame size:  '
							+ printExp(ag.fdffFrmSiz(exp)) + '; body:  '
							+ printExp(ag.fdffBdy(exp)) + ')>';
			case __DFZ_TAG__:
				return '#<function definition @ offset '
						 + printExp(ag.fdfzOfs(exp)) + ' (argument* count: '
						 + printExp(ag.fdfzArgc(exp)) + '; frame size:  '
						 + printExp(ag.fdfzFrmSiz(exp)) + '; body:  '
						 + printExp(ag.fdfzBdy(exp)) + ')>';
			case __SGL_TAG__:
				return '#<assignment @ scope-level/offset: '
							+ printExp(ag.fsglScp(exp)) + '/'
							+ printExp(ag.fsglOfs(exp)) + ' (value: '
							+ printExp(ag.fsglVal(exp)) + ')>';
			case __SLC_TAG__:
				return '#<local assignment @ offset: '
							+ printExp(ag.fslcOfs(exp)) + ' (value: '
							+ printExp(ag.fslcVal(exp)) + ')>';
			case __APZ_TAG__:
				return '#<application (zero argument): '
							+ printExp(ag.fapzOpr(exp)) + '>';
			case __ALZ_TAG__:
				return '#<local application (zero argument) @ offset '
							+ ag.falzOfs(exp) + '>';
			case __ANZ_TAG__:
				return '#<non-local application (zero argument) @ scope/offset: '
							+ ag.fanzScp(exp) + '/'
							+ ag.fanzOfs(exp) + '>'
			case __AGZ_TAG__:
				return '#<global application (zero argument) @ offset '
							+ ag.fagzOfs(exp) + '>';
			case __TPZ_TAG__:
				return '#<tail call (zero argument): '
							+ printExp(ag.ftpzOpr(exp)) + '>';
			case __TLZ_TAG__:
				return '#<local tail call (zero argument) @ offset '
							+ ag.ftlzOfs(exp) + '>';
			case __TNZ_TAG__:
				return '#<non-local tail call (zero argument) @ scope/offset: '
							+ ag.ftnzScp(exp) + '/'
							+ ag.ftnzOfs(exp) + '>'
			case __TGZ_TAG__:
				return '#<global tail call (zero argument) @ offset '
							+ ag.ftgzOfs(exp) + '>';
			case __APL_TAG__:
				return '#<application '
							+ printExp(ag.faplOpr(exp)) + ' @ '
							+ printExp(ag.faplOpd(exp)) + '>';				
			case __ALL_TAG__:
				return '#<local application (offset: '
							+ printExp(ag.fallOfs(exp)) + ') @ '
							+ printExp(ag.fallOpd(exp)) + '>';
			case __ANL_TAG__:
				return '#<non-local application (scope/offset: '
							+ printExp(ag.fanlScp(exp)) + '/'
							+ printExp(ag.fanlOfs(exp)) + ') @ '
							+ printExp(ag.fanlOpd(exp)) + '>';
			case __AGL_TAG__:
				return '#<global application (offset: '
							+ printExp(ag.faglOfs(exp)) + ') @'
							+ printExp(ag.faglOpd(exp)) + '>';
			case __TPL_TAG__:
				return '#<tail call '
							+ printExp(ag.ftplOpr(exp)) + ' @ '
							+ printExp(ag.ftplOpd(exp)) + '>';
			case __TLL_TAG__:
				return '#<local tail call (offset '
							+ printExp(ag.ftllOfs(exp)) + ') @ '
							+ printExp(ag.ftllOpd(exp)) + '>';				
			case __TNL_TAG__:
				return '#<non-local tail call (scope/offset: '
							+ printExp(ag.ftnlScp(exp)) + '/'
							+ printExp(ag.ftnlOfs(exp)) + ') @ '
							+ printExp(ag.ftnlOpd(exp)) + '>';
			case __TGL_TAG__:
				return '#<global tail call (offset: '
							+ printExp(ag.ftglOfs(exp)) + ') @'
							+ printExp(ag.ftglOpd(exp)) + '>';
			case __STL_TAG__:
				return '#<sequence tail (body: '
							+ printExp(ag.fstlExp(exp)) + ')>';
			default:
				return '<unknown expression (tag: ' + tag + ')>';
		}
	}

	var printSequence = function(exp) {
		var str = '', idx = 1;
		var len = ag.sequenceLength(exp);
		while(idx < len)
			str += printExp(ag.sequenceAt(exp, idx++)) + ' '
		str += printExp(ag.fstlExp(ag.sequenceAt(exp, idx)));
		return str;
	}

	function symbolText(chk) {
		var len = symbolLength(chk);
		var arr = new Array(len);
		for(var i = 0; i < len; ++i)
			arr[i] = symbolAt(chk, i);
		return String.fromCharCode.apply(null, arr);
	}

	function printPair(exp) {
		var str = '(' + printExp(pairCar(exp));
		var cdr = pairCdr(exp)
		var cdrStr = printExp(cdr);
		if(isPair(cdr)) { // prettier!
			cdrStr = cdrStr.substring(1, cdrStr.length-1);
			return str + ' ' + cdrStr + ')';
		}
		if (isNull(cdr))
			return str + ')';
		return str + " . " + cdrStr + ')';
	}

	function printVector(exp) {
		var len = vectorLength(exp);
		if (len === 0)
			return "#()";
		var str = "#(";
		for(var idx = 1; idx < len; ++idx) {
			str += printExp(vectorAt(exp, idx)) + ' ';
		}
		str += printExp(vectorAt(exp, len)) + ')';
		return str;
	}

	return {
		printExp: printExp,
		link: link
	}
}