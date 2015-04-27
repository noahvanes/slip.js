#!/bin/bash
sjs -r --module ./macros/macros.sjs src/main.sjs -o compiled/main.js
sjs -r --module ./macros/macros.sjs src/compile.sjs -o compiled/compile.js
sjs -r --module ./macros/macros.sjs src/eval.sjs -o compiled/eval.js
sjs -r --module ./macros/macros.sjs src/memory.sjs -o compiled/memory.js
sjs -r --module ./macros/macros.sjs src/natives.sjs -o compiled/natives.js
sjs -r --module ./macros/macros.sjs src/pool.sjs -o compiled/pool.js
sjs -r --module ./macros/macros.sjs src/printer.sjs -o compiled/printer.js
sjs -r --module ./macros/macros.sjs src/reader.sjs -o compiled/reader.js