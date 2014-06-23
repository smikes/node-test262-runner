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
});
