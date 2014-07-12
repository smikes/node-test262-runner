'use strict';

var assert = require('assert'),
    NameStream = require('../lib/nameStream');

describe("nameStream", function () {
    it("should produce a stream", function (done) {
        var s = new NameStream({}, "test");

        s.on('data', function (file) {
            // ignore
        }).on('end', function () {
            done();
        });
    });

    it("should throw if initial directory does not exist", function (done) {

        assert.throws(function () {
            var s = new NameStream({}, "./nonexistent-dir");
        }, /test262 path does not exist/);

        done();
    });

    it("should throw if initial directory arg is not a directory", function (done) {

        assert.throws(function () {
            var s = new NameStream({}, "./README.md");
        }, /test262 path is not a directory/);

        done();
    });
});
