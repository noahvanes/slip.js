#!/bin/bash

#invoke macro expander
sjs --readable-names --module ./macros.sjs slip.sjs -o slip.js

#temporary fix to force break macro hygiene
sed -i '' 's/opc$2/opc/g' slip.js
