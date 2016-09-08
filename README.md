# FastIntegerCompression
[![Build Status](https://travis-ci.org/lemire/FastIntegerCompression.js.png)](https://travis-ci.org/lemire/FastIntegerCompression.js)

This is an integer compression library in JavaScript, useful for work on indexes.
Given an array of integers, it produces an ArrayBuffer that uses far fewer bytes
than the original. You can later recover the original array quickly.


```javascript
   // var FastIntegerCompression = require("fastintcompression");// if you use node
   var array = [10,100000,65999,10,10,0,1,1,2000];
   var buf = FastIntegerCompression.compress(array);
   var back = FastIntegerCompression.uncompress(buf); // gets back [10,100000,65999,10,10,0,1,1,2000]
``` 

You can install the library under node with the command line
```bash
   npm install fastintcompression
```

This code is made available under the Apache License 2.0.

## Performance numbers

Go to benchmark repository (check the README.md file) and run the benchmark:

```bash
$ nodejs test.js
Platform: linux 3.13.0-91-generic x64
Intel(R) Core(TM) i7-4770 CPU @ 3.40GHz
Node version 4.5.0, v8 version 4.5.103.37

input size: 7.813K compressed size: 1000B
FastIntegerCompression.compress x 347,635 ops/sec ±1.06% (93 runs sampled)
Fastest is FastIntegerCompression.compress
FastIntegerCompression.uncompress x 162,411 ops/sec ±0.58% (92 runs sampled)
Fastest is FastIntegerCompression.uncompress
```
