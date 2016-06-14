function ERRORS() {
	"use strict";

	var report, printExp;

	function link(io, printer) {
		report = io.printError;
		printExp = printer.printExp;
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
		report('invalid expression: ' + printExp(exp));
	}

	function constantViolation(exp) {
		report('constant cannot be reassigned: ' + printExp(exp));
	}

	function invalidOperator(exp) {
		report('invalid operator: ' + printExp(exp));
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
		constantViolation: constantViolation,
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
	}
}