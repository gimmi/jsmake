/*global Make, jasmine, describe, beforeEach, expect, it, spyOn */

describe("CommandRunner", function () {
	var target, CommandRunner, Sys;

	beforeEach(function () {
		CommandRunner = require('jsmake/commandRunner').CommandRunner;
		Sys = require('jsmake/sys').Sys;
		
		target = new CommandRunner('cmd');
		target._logger = jasmine.createSpyObj('logger', [ 'log' ]);
		spyOn(Sys, 'runCommand');
	});

	it('should add parameters whit a single call', function () {
		target.args('p1', 'p2').args('p3', [ 'p4', 'p5' ]).args('p6');

		expect(target._arguments).toEqual([ 'p1', 'p2', 'p3', 'p4', 'p5', 'p6' ]);
	});

	it('should invoke command with parameters', function () {
		Sys.runCommand.andReturn(0);

		target.args('p1', 'p2').run();

		expect(Sys.runCommand).toHaveBeenCalledWith('cmd', { args: [ 'p1', 'p2' ]});
	});

	it('should throw exception when command fail', function () {
		Sys.runCommand.andReturn(1);

		expect(function () {
			target.args('p1', 'p2').run();
		}).toThrow('Command failed with exit status 1');
	});
});