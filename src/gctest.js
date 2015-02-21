var mem = m = require('./mem.js');

mem.memoryInit(100);

//the stack
var r1 = m.makeChunk(0,0,4);
mem.push(r1);
mem.push(m.makeImmediate(2));
mem.push(m.makeImmediate(0));

m.chunkSet(r1, 1, m.makeChunk(0,0,0));
m.chunkSet(r1, 2, m.makeImmediate(8));
m.makeChunk(1,1,5);
m.chunkSet(r1, 3, m.makeChunk(1,1,5));
m.makeChunk(0,0,5);
m.makeChunk(0,0,6);
var c1 = m.makeChunk(0,0,2);
var r2 = m.makeChunk(1,1,3);
m.chunkSet(r1, 4, c1);
m.chunkSet(c1, 2, r2);
m.chunkSet(c1, 1, c1);
mem.push(r2);

console.log("Available (before GC): " + m.available());
m.collectGarbage();
console.log("Available (after GC): " + m.available());