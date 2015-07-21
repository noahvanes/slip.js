
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

function readExpression(clb) { 

	var txt = '';
	do
		txt += readline();
	while(scanBrackets(txt));
	clb(txt);
}

function readFile(path, clb) {
	var str = read(path);
	clb(str);
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
	readExpression: readExpression,
	load: readFile,
	print: putstr,
	printline: print,
	printerror: print,
	printlog: putstr
}, 26);

slip.Slip_REPL();
