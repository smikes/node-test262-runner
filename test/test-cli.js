'use strict';

var assert = require('assert');

var cli = require('../lib/cli');

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
        var parsed = cli.parseArgs(['node', 'cli.js', '--test', './test262']);

        assert.ok(parsed.test.indexOf('/test262') > 0);
    });

    it('should not resolve when --test arg is absolute path', function () {
        var parsed = cli.parseArgs(['node', 'cli.js', '--test', '/nonexistent']);

        assert.equal("/nonexistent", parsed.test);
    });
});

function mockConsole() {
    return {
        out: [],
        err: [],
        log: function (s) { this.out.push(s); }
    };
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
            parsed = { help: true };

        cli.runCli(proc, con, parsed);

        assert.ok(con.out.length >= 1);
        assert.equal(0, proc.exitCode);
    });
});

describe("cli_list", function () {
    it("should list all tests", function () {
        var proc = mockProcess(),
            con = mockConsole();

        cli.showList(proc, con);

        assert.ok(con.out.length >= 1);
        assert.equal(0, proc.exitCode);
    });
});
