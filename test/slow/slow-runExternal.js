var assert = require('assert');

var runExternal = require('../../lib/runExternal.js');

describe('slow', function () {
    describe('runExternal_run', function () {
        // slow test
        it("runs node", function (done) {
            runExternal.run('node', ['var x=3;\n', 'console.log(x);\n'], function (err, result) {
                assert.equal(null, err);
                assert.equal('3\n', result.out);
                done();
            });
        });

        // slow test
        it("runs js24", function (done) {
            runExternal.run('js24', [], function (err, result) {
                assert.equal(null, err);
                assert.equal('js> \n', result.out);
                done();
            });
        });
    });
});
