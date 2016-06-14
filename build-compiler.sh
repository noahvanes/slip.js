#!/bin/bash

sjs --readable-names --module ./macros.sjs ./src/dictionary.js -o ./compiled/dictionary.js
sjs --readable-names --module ./macros.sjs ./src/compiler.js -o ./compiled/compiler.js
