'use strict';

var assert = require('assert'),
    NameStream = require('../lib/nameStream');

describe("nameStream", function () {
    it("should produce a stream", function (done) {
        var s = new NameStream("test");

        s.on('data', function (files) {
            // ignore
        }).on('end', function () {
            done();
        });
    });

    it("should throw if initial directory does not exist", function (done) {

        var s = new NameStream("./nonexistent-dir");

        s.on('error', function(err) {
            assert.ok(err.message.match(/test262 path does not exist/));
            done();
        });
    });

    it("should throw if initial directory arg is not a directory", function (done) {

        var s = new NameStream("./README.md");

        s.on('error', function(err) {
            assert.ok(err.message.match(/test262 path is not a directory/));
            done();
        });
    });
});
