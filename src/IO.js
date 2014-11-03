var fs = require('fs');
var rl = require('readline-sync');
var readline = rl.prompt;

//configure prompt 
rl.setPrompt('');

function load(path) {
	return fs.readFileSync(path, 'utf-8');
}

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

function write(str) {
	process.stdout.write(str);
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

exports.printOut = console.log;
exports.read = readExpression;
exports.load = load;
exports.write = write;