(function () {
    'use strict';

    var nopt = require('nopt'),
        path = require('path'),
        knownOptions = {
            "help": Boolean,
            "test": path
        };


    exports.parseArgs = function cli_parseArgs(argv) {
        return nopt(knownOptions, {}, argv);
    };

    exports.runCli = function cli_runCli(proc, con, parsedArgs) {
        con.log('Usage: ');
        proc.exit(0);
    };
}());
