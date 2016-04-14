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
