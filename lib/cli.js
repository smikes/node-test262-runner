(function () {
    'use strict';

    var nopt = require('nopt'),
        knownOptions = {
            "help": Boolean
        };


    exports.parseArgs = function cli_parseArgs(argv) {
        return nopt(knownOptions, {}, argv);
    };

    exports.runCli = function cli_runCli(parsedArgs) {
    };
}());
