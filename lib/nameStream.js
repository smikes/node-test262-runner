/*global module, require*/
(function () {
    'use strict';

    var Transform = require('stream').Transform,
        util = require('util'),
        fs = require('fs'),
        ReadDir = require('readdir-stream');

    function NameStream(dir) {
        var ns = this;
        Transform.call(this, {
            highWaterMark: 1,
            objectMode: true
        });

        fs.stat(dir, function nameStream_onInitialStat(err, stat) {
            if (err) {
                ns.emit('error', new Error("test262 path does not exist: " + dir));
                ns.push(null);
                return;
            }

            if (!stat.isDirectory()) {
                ns.emit('error', new Error("test262 path is not a directory: " + dir));
                ns.push(null);
                return;
            }

            var readdir = new ReadDir(dir);
            readdir.pipe(ns);
        });
    }
    util.inherits(NameStream, Transform);

    /*jslint nomen: true*/
    NameStream.prototype._transform = function NameStream_read(obj, encoding, done) {
        if (obj.stat.isFile()) {
            this.push(obj.path);
        }

        done();
    };

    module.exports = NameStream;
}());
