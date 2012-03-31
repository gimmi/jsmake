/*global Make, jasmine, describe, beforeEach, expect, it, spyOn */

describe("jsmake.CommandRunner", function () {
	var target;

	beforeEach(function () {
		target = new jsmake.CommandRunner('cmd');
		target._logger = jasmine.createSpyObj('logger', [ 'log' ]);
		spyOn(jsmake.Rhino, 'runCommand');
	});

	it('should add parameters whit a single call', function () {
		target.args('p1', 'p2').args('p3', [ 'p4', 'p5' ]).args('p6');

		expect(target._arguments).toEqual([ 'p1', 'p2', 'p3', 'p4', 'p5', 'p6' ]);
	});

	it('should invoke command with parameters', function () {
		jsmake.Rhino.runCommand.andReturn(0);

		target.args('p1', 'p2').run();

		expect(jsmake.Rhino.runCommand).toHaveBeenCalledWith('cmd', { args: [ 'p1', 'p2' ]});
	});

	it('should throw exception when command fail', function () {
		jsmake.Rhino.runCommand.andReturn(1);

		expect(function () {
			target.args('p1', 'p2').run();
		}).toThrow('Command failed with exit status 1');
	});
});