function scanBrackets(txt) {

	var idx = 0;
	var count = 0;	
	var len = txt.length;
	var currentChar;

	while(idx < len) {
		currentChar = txt.charAt(idx++);
		if (currentChar === '(')
			++count;
		else if (currentChar === ')')
			--count;
	}

	return count;
}

function readExp(clb) {

	if (__KEEP__.length) {
		print(__KEEP__);
		__KEEP__ = ''
	}
	clb(readExpression());
}

function readExpression() { 

	var txt = '';
	do
		txt += readline();
	while(scanBrackets(txt) || !txt.trim().length);
	return txt;
}

function readFS(path, clb) {
	var str = readFile(path);
	clb(str);
}

var __KEEP__ = '';

function write(str) {
	/* temporary fix to avoid printing a prompt */
	if(str === '> ') {
		return; 
	}
	var sp = str.split(/\r?\n/);
	var last = sp.length - 1;
	for(var i = 0; i < last; ++i) {
		__KEEP__ += sp[i];
		print(__KEEP__);
		__KEEP__ = '';
	}
	__KEEP__ += sp[last];
}

function writeLine(str) {
	__KEEP__ += str;
	print(__KEEP__);
	__KEEP__ = '';
}

// MAIN

load("./slip.js");

var stdlib = {
	Math: Math, 
	Uint32Array: Uint32Array, 
	Uint8Array: Uint8Array, 
	Float32Array: Float32Array
}

var slip = SLIP({
	stdlib: stdlib,
	readExpression: readExp,
	load: readFS,
	print: write,
	printline: writeLine,
	printerror: writeLine,
	printlog: write
}, 26);

slip.Slip_REPL();
