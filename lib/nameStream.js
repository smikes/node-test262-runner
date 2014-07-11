/*global module, require*/
(function () {
    'use strict';

    var stream = require('stream'),
        util = require('util'),
        path = require('path'),
        fs = require('fs');

    function NameStream(options, path) {
        var ns = this;
        stream.Readable.call(ns, options);

        fs.readdir(path, function (err, files) {
            files.forEach(function(file) {
                ns.push(file);
            });
            ns.emit('end');
        });
    }
    util.inherits(NameStream, stream.Readable);

    NameStream.prototype._read = function NameStream_read(size) {
    };

    module.exports = NameStream;
}());
