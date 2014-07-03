(function () {
    'use strict';

    var nopt = require('nopt'),
        path = require('path'),
        knownOptions = {
            "help": Boolean,
            "test": path
        },
        NameStream = require('./nameStream'),
        cli = exports;


    exports.parseArgs = function cli_parseArgs(argv) {
        return nopt(knownOptions, {}, argv);
    };

    exports.printUsage = function cli_printUsage(proc, con) {
        con.log('Usage: ');
        con.log(' --help                    this message');
        con.log(' --list [<pattern>]        list tests matching *pattern*');
        proc.exit(0);
    }

    exports.runCli = function cli_runCli(proc, con, parsedArgs) {
        cli.printUsage(proc, con);
    };

    exports.showList = function cli_showList(proc, con) {
        var tests = new NameStream();

        tests.on('data', function (file) {
            con.log(file);
        });
    };
}());
