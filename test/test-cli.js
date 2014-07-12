'use strict';

var assert = require('assert'),
    cli = require('../lib/cli'),
    EventEmitter = require('events').EventEmitter;

describe('cli_parseArgs', function () {
    it('should be a function', function () {
        assert.ok(cli.parseArgs instanceof Function);
    });

    it('should accept passed args', function () {
        var parsed = cli.parseArgs(['node', 'cli.js', 'list']);

        assert(parsed instanceof Object);
    });

    it('should recognize a help arg', function () {
        var parsed = cli.parseArgs(['node', 'cli.js', 'help']);

        assert(parsed.command == "help");
    });

    it('should recognize a --path arg', function () {
        var parsed = cli.parseArgs(['node', 'cli.js', '--path', './test262']);

        assert.ok(parsed.path.indexOf('/test262') > 0);
    });

    it('should not resolve when --path arg is absolute path', function () {
        var parsed = cli.parseArgs(['node', 'cli.js', '--path', '/nonexistent']);

        assert.equal("/nonexistent", parsed.path);
    });
});

function mockConsole() {
    var c = new EventEmitter();
    c.out = [];
    c.err = [];
    c.log = function (s) { this.out.push(s); };
    c.end = function () { this.emit('finish'); };

    return c;
}

function mockProcess() {
    return {
        exitCode: undefined,
        exit: function (n) { this.exitCode = n; }
    };
}


describe("cli_runCli", function () {
    it("should take mock arguments", function () {
        var proc = mockProcess(),
            con = mockConsole(),
            parsed = {
                command: "help"
            };

        cli.runCli(proc, con, parsed);

        assert.ok(con.out.length >= 1);
        assert.equal(0, proc.exitCode);
    });

    it("should catch unexpected exceptions", function () {
        var proc = mockProcess(),
            con = mockConsole(),
            parsed = {
                command: "bogus"
            };

        cli.runCli(proc, con, parsed);

        assert.ok(con.out.length == 1);
        assert.ok(con.out[0].match(/Fatal error:/));
        assert.equal(-1, proc.exitCode);
    });
});

describe("cli_parseArgs", function () {
    it("should accept list --pattern <arg> and --test <arg>", function () {
        var parsed = cli.parseArgs(["node", "node-test262-runner", "list", "--pattern", "js", "--path", "foo"]);

        assert.equal(parsed.command, "list");
        assert.equal(parsed.pattern, "js");
        assert.ok(parsed.path.match(/foo$/));
    });

    it("should accept list and --path <arg>", function () {
        var parsed = cli.parseArgs(["node", "node-test262-runner", "--path", "foo", "list"]);

        assert.equal(parsed.command, "list");
        assert.ok(parsed.path.match(/foo$/));
    });

    it("should provide default path", function () {
        var parsed = cli.parseArgs(["node", "node-test262-runner", "list"]);

        assert.equal(parsed.command, "list");
        assert.equal(parsed.path, "../test262/test/suite");
    });
});

describe("cli_list", function () {
    it("should list all tests", function (done) {
        var frame = {
            proc: mockProcess(),
            con: mockConsole(),
            parsedArgs: {
                command: "list",
                path: "test/fixtures"
            },
            done: function () {
                assert.ok(frame.con.out[0].match(/S7.2_A1.1_T1.js$/));
                done();
            }
        };

        cli.showList(frame);

    });

    it("should list some tests", function (done) {
        var frame = {
            proc: mockProcess(),
            con: mockConsole(),
            parsedArgs: {
                command: "list",
                path: "test/fixtures",
                pattern: "pass"
            },
            done: function () {
                assert.equal(frame.con.out.length, 1);
                done();
            }
        };

        cli.showList(frame);
    });
});

describe("cli_runTests", function () {
    it("should not be implemented", function (done) {
        var frame = {
            con: mockConsole(),
            done: function () {
                assert.equal(frame.con.out[0], "Run not implemented yet.");
                done();
            }
        };

        cli.runTests(frame);
    });
});

describe("cli_exitWhenDone", function () {
    it("exits with error code on error", function () {
        var proc = mockProcess(),
            con = mockConsole(),
            done = cli.exitWhenDone(proc,con);

        done(new Error("not a bicycle"));

        assert.ok(con.out[0].match(/bicycle/));
        assert.equal(-1, proc.exitCode);
    });
});
