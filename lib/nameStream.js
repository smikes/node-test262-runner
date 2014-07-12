/*global module, require*/
(function () {
    'use strict';

    var stream = require('stream'),
        util = require('util'),
        path = require('path'),
        fs = require('fs'),
        namestream_walk;

    function NameStream(options, file) {
        var ns = this,
            initialDirStat;
        stream.Readable.call(ns, options);

        try {
            /*jslint stupid: true*/
            initialDirStat = fs.statSync(file);
        } catch (e) {
            throw new Error("test262 path does not exist: " + file);
        }

        if (!initialDirStat.isDirectory()) {
            throw new Error("test262 path is not a directory: " + file);
        }

        namestream_walk(file, ns, function (err) {
            if (err) {
                ns.emit('error', err);
            }

            ns.push(null);
        });
    }
    util.inherits(NameStream, stream.Readable);

    function check_done(o) {
        if (o.pending === 0) {
            o.done(null);
        }
    }

    function decrement_pending(o) {
        o.pending -= 1;
        check_done(o);
    }

    function make_childwalk_done(o) {
        return function childwalk_done(err) {
            if (err) {
                o.done(err);
            }
            decrement_pending(o);
        };
    }

    function make_namestream_eachfile(o) {
        return function namestream_eachfile(file) {
            file = path.join(o.dir, file);
            fs.stat(file, function namestream_onstat(err, stat) {
                if (err) {
                    o.ns.emit('error', err);
                    decrement_pending(o);
                    return;
                }

                if (stat && stat.isDirectory()) {
                    namestream_walk(file, o.ns, make_childwalk_done(o));
                } else {
                    o.ns.push(file);
                    decrement_pending(o);
                }
            });
        };
    }

    namestream_walk = function namestream_walk(dir, ns, done) {
        fs.readdir(dir, function namestream_onreaddir(err, list) {
            if (err) {
                return done(err);
            }

            var o = {
                pending: list.length,
                dir: dir,
                ns: ns,
                done: done
            };

            check_done(o);

            list.forEach(make_namestream_eachfile(o));
        });
    };

    /*jslint nomen: true*/
    NameStream.prototype._read = function NameStream_read() {
        return 0;
    };

    module.exports = NameStream;
}());
