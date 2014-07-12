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
        commands,
        cli = exports;


    exports.getCommand = function cli_getCommand(command) {
        return commands[command];
    };

    exports.parseArgs = function cli_parseArgs(argv) {
        var parsed = nopt(knownOptions, {}, argv);

        if (!parsed.path) {
            parsed.path = "../test262/test/suite";
        }

        parsed.command = parsed.argv.remain[0];
        if (!cli.getCommand(parsed.command)) {
            parsed.command = "help";
        }

        return parsed;
    };

    exports.printUsage = function cli_printUsage(frame) {
        var con = frame.con,
            done = frame.done;

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
        return function cli_defaultDone(err) {
            if (err) {
                con.log("Error: " + err.message);
                proc.exit(-1);
                return;
            }

            proc.exit(0);
        };
    };

    exports.runCli = function cli_runCli(proc, con, parsedArgs) {
        var commandFunc = cli.getCommand(parsedArgs.command),
            frame = {
                proc: proc,
                con: con,
                parsedArgs: parsedArgs,
                done: cli.exitWhenDone(proc, con)
            };

        try {
            commandFunc(frame);
        } catch (e) {
            con.log("Fatal error: " + e.message);
            proc.exit(-1);
        }
    };

    exports.showList = function cli_showList(frame) {
        var con = frame.con,
            parsedArgs = frame.parsedArgs,
            done = frame.done,
            tests = new NameStream({}, parsedArgs.path),
            pattern = '';

        if (parsedArgs.pattern) {
            pattern = new RegExp(parsedArgs.pattern);
        }

        tests.on('data', function list_onNameData(fileBuf) {
            var file = String(fileBuf);

            if (file.match(pattern)) {
                con.log(file);
            }
        }).on('error', done).on('end', done);
    };

    exports.runTests = function cli_runTests(frame) {
        var con = frame.con,
            done = frame.done;

        con.log("Run not implemented yet.");

        done();
    };

    commands = {
        "help": cli.printUsage,
        "list": cli.showList,
        "run" : cli.runTests
    };

}());
