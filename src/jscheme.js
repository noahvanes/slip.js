/* IMPORTS */

var main = require('./main.js');

var fs = require('fs');
var rl = require('readline-sync');


/* CONFIGURATION */

const __MEM_SIZ__ = 10000;


/* READ EXPRESSION */

var readline = rl.prompt;
rl.setPrompt('');

function readExpression() {

	var line, str = '';
	var brackets = 0;

	do {

		line = readline();
		brackets += scanBrackets(line);
		str += line + ' ';

	} while (brackets > 0);

	return str;
}

function scanBrackets(txt) {

	var idx = 0;
	var count = 0;
	var len = txt.length;
	var currentChar;

	while(idx < len) {
		currentChar = txt.charAt(idx++);
		if (currentChar == '(') {
			++count;
		} else if (currentChar == ')') {
			--count;
		}
	}

	return count;
}


/* WRITE TEXT */

function print(str) {
	process.stdout.write(str);
}

const printline = console.log;


/* LOAD FILE */ 

function load(path) {
	return fs.readFileSync(path, 'utf-8');
}


/* QUIT PROCESS */

function quit() {
	process.exit(1);
}


/* START REPL */
main.initREPL(print, printline, readExpression, load, quit, __MEM_SIZ__);