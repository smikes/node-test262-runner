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
        con.log(' --test <path>             path to test262-format tests');
        con.log(' --list [<pattern>]        list tests matching *pattern*');
        proc.exit(0);
    };

    exports.runCli = function cli_runCli(proc, con, parsedArgs) {
        if (parsedArgs.list) {
            exports.showList(proc, con, parsedArgs);

            return;
        }

        cli.printUsage(proc, con);
    };

    exports.showList = function cli_showList(proc, con, parsedArgs) {
        var tests = new NameStream({}, parsedArgs.test),
            pattern = new RegExp(parsedArgs.list);

        tests.on('data', function (fileBuf) {
            var file = String(fileBuf);

            if(pattern.test(file)) {
                con.log(file);
            }
        });
        tests.on('end', function () {
            proc.exit(0);
            con.end();
        });
    };
}());
