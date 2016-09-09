/* This script expects node.js  and mocha */

'use strict';

describe('FastIntegerCompression', function() {
  var FastIntegerCompression = require('../FastIntegerCompression.js');

  function arraysEquals(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  it('Testing simple compression', function() {
    var array = [10,100000,65999,10,10,0,1,1,2000];
    var buf = FastIntegerCompression.compress(array);
    if(! FastIntegerCompression.computeHowManyIntegers(buf) == array.length) throw "bad count";
    var back = FastIntegerCompression.uncompress(buf);
    if(!arraysEquals(array,back)) throw "bad";

  });


});
