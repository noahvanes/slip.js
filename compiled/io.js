function IO() {
    'use strict';
    var __WELCOME_STR__ = 'Welcome to the slip.js REPL';
    var __PROMPT1_STR__ = '> ';
    var __PROMPT2_STR__ = ':: ';
    var __ERROR_STR__ = 'ERROR: ';
    var readExpression, printline, printOut, plog, ld, inputReady, loadInput, printExp, printErr, text, reader;
    function link(asm$2, clbs, readerModule, printer) {
        readExpression = clbs.readExpression;
        printline = clbs.printline;
        printOut = clbs.print;
        printErr = clbs.printerror;
        plog = clbs.printlog;
        ld = clbs.load;
        inputReady = asm$2.inputReady;
        text = asm$2.stringText;
        reader = readerModule;
        loadInput = readerModule.load;
        printExp = printer.printExp;
    }
    function onInput(txt) {
        reader.load(txt);
        var exp = reader.read();
        inputReady(exp);
    }
    function promptInput() {
        printOut(__PROMPT1_STR__);
        readExpression(onInput);
    }
    function promptUserInput() {
        printOut(__PROMPT2_STR__);
        readExpression(onInput);
    }
    function onError() {
        inputReady(asm.slipVoid());
    }
    function loadFile(str) {
        ld(text(str), onInput, onError);
    }
    function printLog(exp) {
        plog(printExp(exp));
    }
    function printNewline() {
        printline('');
    }
    function printOutput(exp) {
        printline(printExp(exp));
    }
    function printCustomError(exp) {
        printErr(__ERROR_STR__ + printExp(exp));
    }
    function printError(txt) {
        printErr(__ERROR_STR__ + txt);
    }
    function initREPL() {
        printline(__WELCOME_STR__);
        printline('');
    }
    return {
        printCustomError: printCustomError,
        promptUserInput: promptUserInput,
        printNewline: printNewline,
        promptInput: promptInput,
        printOutput: printOutput,
        printError: printError,
        printLog: printLog,
        initREPL: initREPL,
        loadFile: loadFile,
        link: link
    };
}