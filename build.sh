#!/bin/bash

#invoke macro expander
sjs --readable-names --module ./macros.sjs ./src/asm.js -o ./compiled/asm.js
sjs --readable-names --module ./macros.sjs ./src/compiler.js -o ./compiled/compiler.js
sjs --readable-names --module ./macros.sjs ./src/dictionary.js -o ./compiled/dictionary.js
sjs --readable-names --module ./macros.sjs ./src/errors.js -o ./compiled/errors.js
sjs --readable-names --module ./macros.sjs ./src/io.js -o ./compiled/io.js
sjs --readable-names --module ./macros.sjs ./src/printer.js -o ./compiled/printer.js
sjs --readable-names --module ./macros.sjs ./src/reader.js -o ./compiled/reader.js
sjs --readable-names --module ./macros.sjs ./src/symbols.js -o ./compiled/symbols.js
sjs --readable-names --module ./macros.sjs ./src/timer.js -o ./compiled/timer.js