(function () {
    'use strict';

    var nopt = require('nopt'),
        path = require('path'),
        knownOptions = {
            "help": Boolean,
            "list": Boolean,
            "path": path,
            "pattern": String
        },
        NameStream = require('./nameStream'),
        cli = exports;

    exports.parseArgs = function cli_parseArgs(argv) {
        var parsed = nopt(knownOptions, {}, argv);

        parsed.command = parsed.argv.remain[0];

        return parsed;
    };

    exports.printUsage = function cli_printUsage(proc, con, parsedArgs, done) {
        con.log('Commands: ');
        con.log(' help     display help');
        con.log(' list     list tests');
        con.log(' run      run tests');
        con.log('');
        con.log('Options:');
        con.log(' --path <path>          *path* to test262-format tests (default: ../test262/test/suite)');
        con.log(' --pattern <pattern>    limit to tests matching *pattern*');
        con.log(' --engine <name>        run tests in javascript engine *name*');

        done();
    };

    exports.exitWhenDone = function cli_exitWhenDone(proc, con) {
        return function cli_defaultDone() {
            proc.exit(0);
        };
    };

    exports.runCli = function cli_runCli(proc, con, parsedArgs) {
        var command = parsedArgs.command;

        var commandFunc = commands[command];

        if (commandFunc === undefined) {
            // ? note error?
            commandFunc = cli.printUsage;
        }

        commandFunc(proc, con, parsedArgs, cli.exitWhenDone(proc, con));
    };

    exports.showList = function cli_showList(proc, con, parsedArgs, done) {
        var tests = new NameStream({}, parsedArgs.path),
            pattern = /^[^.]/;

        if(parsedArgs.pattern) {
            pattern = new RegExp(parsedArgs.pattern);
        }

        tests.on('data', function (fileBuf) {
            var file = String(fileBuf);

            if(pattern.test(file)) {
                con.log(file);
            }
        });
        tests.on('end', function () {
            if (done) {
                done();
            }
        });
    };

    exports.runTests = function cli_runTests(proc, con, parsedArgs, done) {
        con.log("Run not implemented yet.");

        done();
    };

    var commands = {
        "help": cli.printUsage,
        "list": cli.showList,
        "run": cli.runTests
    };


}());
