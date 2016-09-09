/* performance benchmark */
/* This script expects node.js */

'use strict';
var FastIntegerCompression = require('../FastIntegerCompression.js');
var os = require('os');
var Benchmark = require('benchmark');
var sizeof=require("sizeof");

function BasicBench() {
    var array = [];
    var howmany = 1000;
    for (var i = 0, t = 40; i < howmany; i++) {
        array.push(Math.round(Math.random() * t))
    }
    var buf = FastIntegerCompression.compress(array);
    FastIntegerCompression.uncompress(buf);
    console.log('input size: '+sizeof.format(sizeof.sizeof(array))+' compressed size: '+sizeof.format(buf.byteLength));

    var suite = new Benchmark.Suite();
    var ms = suite.add('FastIntegerCompression.compress', function() {
        return FastIntegerCompression.compress(array);
    })
    // add listeners
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    // run async
    .run({
'async': false
    });
    suite = new Benchmark.Suite();
    var ms = suite.add('FastIntegerCompression.uncompress', function() {
        return FastIntegerCompression.uncompress(buf);
    })
    // add listeners
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    // run async
    .run({
'async': false
    });
}

var main = function() {
    console.log('Platform: ' + process.platform + ' ' + os.release() + ' ' + process.arch);
    console.log(os.cpus()[0]['model']);
    console.log('Node version ' + process.versions.node + ', v8 version ' + process.versions.v8);
    console.log();
    BasicBench();
    console.log('');
};

if (require.main === module) {
    main();
}
