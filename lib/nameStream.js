/*global module, require*/
(function () {
    'use strict';

    var Transform = require('stream').Transform,
        util = require('util'),
        fs = require('fs');

    function NameStream(dir) {
        var ns = this,
            spawn = require('child_process').spawn;

        Transform.call(this, {
            objectMode: true
        });

        this.savedLine = "";

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

// when 'find' is not available...
//            var readdir = new ReadDir(dir);
//            readdir.pipe(ns);
            var child = spawn('find', [dir, "-type", "f"]);

            child.stdout.pipe(ns);
            child.on('close', function () {
                ns.push(null);
            });
        });
    }
    util.inherits(NameStream, Transform);

    /*jslint nomen: true*/
    NameStream.prototype._transform = function (chunk, encoding, done) {
        // decode binary chunks as UTF-8
        chunk = chunk.toString();

        var lines = chunk.split(/\r\n|\r|\n/g);

        lines[0] = this.savedLine + lines[0];
        this.savedLine = lines.pop();

        this.push(lines);

        done();
    };

    NameStream.prototype._flush = function (done) {
        if (this.savedLine !== "") {
            this.push([this.savedLine]);
        }
        done();
    };

    module.exports = NameStream;
}());
