(function () {
    'use strict';

    var child_process = require('child_process');

    exports.addHandlers = function runExternal_addHandlers(child, callback, result) {
        child.on('error', function(err) {
            callback(err);
        });

        child.on('close', function (code) {
            callback(null, result);
        });
    }

    exports.run = function run_external_run(interpreter, scripts, callback) {
        var result = {
            out: ""
        };

        var child = child_process.spawn(interpreter, [], {stdio: 'pipe'});

        child.stdout.on('data', function (data) {
            result.out += data;
        });

        exports.addHandlers(child, callback, result);

        scripts.forEach(function (part) {
            child.stdin.write(part);
        });
        child.stdin.end('');
    }

}());
