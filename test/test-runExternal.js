'use strict';

var assert = require('assert');

var runExternal = require('../lib/runExternal.js');

describe('runExternal_run', function () {
    it("runs an external interpreter", function (done) {
        runExternal.run('cat', ['foo'], function (err, result) {
            assert.equal(null, err);
            assert.equal('foo', result.out);
            done();
        });
    });

    it("handles errors", function (done) {
        var EventEmitter = require('events').EventEmitter;
        var util = require('util');

        var m = new EventEmitter();
        var dummy = {};

        runExternal.addHandlers(m, function (err, result) {
            assert.equal(err, dummy);
            assert.equal(result, undefined);
            done();
        });

        m.emit('error', dummy);
    });
});
