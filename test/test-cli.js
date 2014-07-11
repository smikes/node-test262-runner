'use strict';

var assert = require('assert'),
    cli = require('../lib/cli'),
    EventEmitter = require('events').EventEmitter;

describe('cli_parseArgs', function () {
    it('should be a function', function () {
        assert.ok(cli.parseArgs instanceof Function);
    });

    it('should accept passed args', function () {
        var parsed = cli.parseArgs(['--help']);

        assert(parsed instanceof Object);
    });

    it('should recognize a --help arg', function () {
        var parsed = cli.parseArgs(['node', 'cli.js', '--help']);

        assert(parsed.help == true);
    });

    it('should recognize a --test arg', function () {
        var parsed = cli.parseArgs(['node', 'cli.js', '--path', './test262']);

        assert.ok(parsed.path.indexOf('/test262') > 0);
    });

    it('should not resolve when --test arg is absolute path', function () {
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
                argv: {
                    remain: [ "help" ]
                }
            };

        cli.runCli(proc, con, parsed);

        assert.ok(con.out.length >= 1);
        assert.equal(0, proc.exitCode);
    });
});

describe("cli_parseArgs", function () {
    it("should accept --list <arg> and --test <arg>", function () {
        var parsed = cli.parseArgs(["node", "node-test262-runner", "--list", "--pattern", "js", "--path", "foo"]);

        assert.equal(parsed.list, true);
        assert.equal(parsed.pattern, "js");
        assert.ok(parsed.path.match(/foo$/));
    });

    it("should accept --list and --test <arg>", function () {
        var parsed = cli.parseArgs(["node", "node-test262-runner", "--path", "foo", "--list"]);

        assert.equal(parsed.list, true);
        assert.ok(parsed.path.match(/foo$/));
    });
});

describe("cli_list", function () {
    it("should list all tests", function (done) {
        var proc = mockProcess(),
            con = mockConsole();

        cli.showList(proc, con, {
            list: true,
            path: "test/fixtures"
        }, function () {
            assert.equal(con.out[0], "S7.2_A1.1_T1.js");
            done();
        });

    });

    it("should list some tests", function (done) {
        var proc = mockProcess(),
            con = mockConsole();

        cli.showList(proc, con, {
            path: "test/fixtures",
            list: true,
            pattern: "pass"
        }, function () {
            assert.equal(con.out.length, 1);
            done();
        });
    });

});
