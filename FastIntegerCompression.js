/**
 * FastIntegerCompression.js : a fast integer compression library in JavaScript.
 * (c) the authors
 * Licensed under the Apache License, Version 2.0.
 *
 *FastIntegerCompression
 * Simple usage :
 *  // var FastIntegerCompression = require("fastintcompression");// if you use node
 *  var array = [10,100000,65999,10,10,0,1,1,2000];
 *  var buf = FastIntegerCompression.compress(array);
 *  var back = FastIntegerCompression.uncompress(buf); // gets back [10,100000,65999,10,10,0,1,1,2000]
 *
 *
 * You can install the library under node with the command line
 *   npm install fastintcompression
 */
'use strict';


// You can provide an iterable.
function FastIntegerCompression() {
}

// private function
function bytelog(val) {
  if (val < (1 << 7)) {
    return 1;
  } else if (val < (1 << 14)) {
    return 2;
  } else if (val < (1 << 21)) {
    return 3;
  } else if (val < (1 << 28)) {
    return 4;
  }
  return 5;
}

// private function
function zigzag_encode(val) {
  return (val + val) ^ (val >> 31);;
}

// private function
function zigzag_decode(val) {
  return  (val >> 1) ^ (- (val & 1));
}


// Compute how many bytes an array of integers would use once compressed.
// The input is expected to be an array of non-negative integers.
FastIntegerCompression.computeCompressedSizeInBytes = function(input) {
  var c = input.length;
  var answer = 0;
  for(var i = 0; i < c; i++) {
    answer += bytelog(input[i]);
  }
  return answer;
};


// Compute how many bytes an array of integers would use once compressed.
// The input is expected to be an array of integers, some of them can be negative.
FastIntegerCompression.computeCompressedSizeInBytesSigned = function(input) {
  var c = input.length;
  var answer = 0;
  for(var i = 0; i < c; i++) {
    answer += bytelog(zigzag_encode(input[i]));
  }
  return answer;
};

// Compress an array of integers, return a compressed buffer (as an ArrayBuffer).
// It is expected that the integers are non-negative: the caller is responsible
// for making this check. Floating-point numbers are not supported.
FastIntegerCompression.compress = function(input) {
  var c = input.length;
  var buf = new ArrayBuffer(FastIntegerCompression.computeCompressedSizeInBytes(input));
  var view   = new Int8Array(buf);
  var pos = 0;
  for(var i = 0; i < c; i++) {
    var val = input[i];
    if (val < (1 << 7)) {
      view[pos++] = val ;
    } else if (val < (1 << 14)) {
      view[pos++] = (val & 0x7F) | 0x80;
      view[pos++] = val >>> 7;
    } else if (val < (1 << 21)) {
      view[pos++] = (val & 0x7F) | 0x80;
      view[pos++] = ( (val >>> 7) & 0x7F ) | 0x80;
      view[pos++] = val >>> 14;
    } else if (val < (1 << 28)) {
      view[pos++] = (val & 0x7F ) | 0x80 ;
      view[pos++] = ( (val >>> 7) & 0x7F ) | 0x80;
      view[pos++] = ( (val >>> 14) & 0x7F ) | 0x80;
      view[pos++] = val >>> 21;
    } else {
      view[pos++] = ( val & 0x7F ) | 0x80;
      view[pos++] = ( (val >>> 7) & 0x7F ) | 0x80;
      view[pos++] = ( (val >>> 14) & 0x7F ) | 0x80;
      view[pos++] = ( (val >>> 21) & 0x7F ) | 0x80;
      view[pos++] = val >>> 28;
    }
  }
  return buf;
};

// From a compressed array of integers stored ArrayBuffer,
// compute the number of compressed integers by scanning the input.
FastIntegerCompression.computeHowManyIntegers = function(input) {
  var view   = new Int8Array(input);
  var c = view.length;
  var count = 0;
  for(var i = 0; i < c; i++) {
    count += (input[i]>>>7);
  }
  return c - count;
}
// Uncompress an array of integer from an ArrayBuffer, return the array.
// It is assumed that they were compressed using the compress function, the caller
// is responsible for ensuring that it is the case.
FastIntegerCompression.uncompress = function(input) {
  var array = [] // The size of the output is not yet known.
  var inbyte = new Int8Array(input);
  var end = inbyte.length;
  var pos = 0;
  while (end > pos) {
        var c = inbyte[pos++];
        var v = c & 0x7F;
        if (c >= 0) {
          array.push(v)
          continue;
        }
        c = inbyte[pos++];
        v |= (c & 0x7F) << 7;
        if (c >= 0) {
          array.push(v)
          continue;
        }
        c = inbyte[pos++];
        v |= (c & 0x7F) << 14;
        if (c >= 0) {
          array.push(v)
          continue;
        }
        c = inbyte[pos++];
        v |= (c & 0x7F) << 21;
        if (c >= 0) {
          array.push(v)
          continue;
        }
        c = inbyte[pos++];
        v |= c << 28;
        v >>>= 0; // make positive
        array.push(v)
  }
  return array;
};


// Compress an array of integers, return a compressed buffer (as an ArrayBuffer).
// The integers can be signed (negative), but floating-point values are not supported.
FastIntegerCompression.compressSigned = function(input) {
  var c = input.length;
  var buf = new ArrayBuffer(FastIntegerCompression.computeCompressedSizeInBytesSigned(input));
  var view   = new Int8Array(buf);
  var pos = 0;
  for(var i = 0; i < c; i++) {
    var val = zigzag_encode(input[i]);
    if (val < (1 << 7)) {
      view[pos++] = val ;
    } else if (val < (1 << 14)) {
      view[pos++] = (val & 0x7F) | 0x80;
      view[pos++] = val >>> 7;
    } else if (val < (1 << 21)) {
      view[pos++] = (val & 0x7F) | 0x80;
      view[pos++] = ( (val >>> 7) & 0x7F ) | 0x80;
      view[pos++] = val >>> 14;
    } else if (val < (1 << 28)) {
      view[pos++] = (val & 0x7F ) | 0x80 ;
      view[pos++] = ( (val >>> 7) & 0x7F ) | 0x80;
      view[pos++] = ( (val >>> 14) & 0x7F ) | 0x80;
      view[pos++] = val >>> 21;
    } else {
      view[pos++] = ( val & 0x7F ) | 0x80;
      view[pos++] = ( (val >>> 7) & 0x7F ) | 0x80;
      view[pos++] = ( (val >>> 14) & 0x7F ) | 0x80;
      view[pos++] = ( (val >>> 21) & 0x7F ) | 0x80;
      view[pos++] = val >>> 28;
    }
  }
  return buf;
};

// Uncompress an array of integer from an ArrayBuffer, return the array.
// It is assumed that they were compressed using the compressSigned function, the caller
// is responsible for ensuring that it is the case.
FastIntegerCompression.uncompressSigned = function(input) {
  var array = [] // The size of the output is not yet known.
  var inbyte = new Int8Array(input);
  var end = inbyte.length;
  var pos = 0;
  while (end > pos) {
        var c = inbyte[pos++];
        var v = c & 0x7F;
        if (c >= 0) {
          array.push(zigzag_decode(v))
          continue;
        }
        c = inbyte[pos++];
        v |= (c & 0x7F) << 7;
        if (c >= 0) {
          array.push(zigzag_decode(v))
          continue;
        }
        c = inbyte[pos++];
        v |= (c & 0x7F) << 14;
        if (c >= 0) {
          array.push(zigzag_decode(v))
          continue;
        }
        c = inbyte[pos++];
        v |= (c & 0x7F) << 21;
        if (c >= 0) {
          array.push(zigzag_decode(v))
          continue;
        }
        c = inbyte[pos++];
        v |= c << 28;
        array.push(zigzag_decode(v))
  }
  return array;
};

///////////////

module.exports = FastIntegerCompression;
