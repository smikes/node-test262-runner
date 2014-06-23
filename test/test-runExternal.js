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

});
