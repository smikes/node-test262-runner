/*global module*/
(function () {
    'use strict';

    var stream = require('stream'),
        util = require('util'),
        path = require('path');

    function NameStream(options) {
        stream.Readable.call(this, options);
    }
    util.inherits(NameStream, stream.Readable);

    NameStream.prototype._read = function NameStream_read() {
    };

    module.exports = NameStream;
}());