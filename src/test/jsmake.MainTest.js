/*global Make, jasmine, describe, beforeEach, expect, it, spyOn */

describe("jsmake.Main", function () {
	var target;

	beforeEach(function () {
		target = new jsmake.Main();
		target._logger = jasmine.createSpyObj('logger', [ 'log' ]);
	});

	it('should add function to the global scope', function () {
		var scope = {};
		spyOn(target, '_task');

		target.init(scope);
		scope.task(1, 2, 3);

		expect(target._task).toHaveBeenCalledWith(1, 2, 3);
		expect(target._task.mostRecentCall.object).toBe(target);
	});

	it("should define project", function () {
		target.init({});

		expect(target._project).not.toBeNull();
	});

	it('should add all defined tasks', function () {
		var global = {};

		target.init(global);

		global.task('a task', [], jasmine.createSpy());
		global.task('another task', [ 'a task' ], jasmine.createSpy());

		expect(target._project.getTask('a task').getTaskNames()).toEqual([]);
		expect(target._project.getTask('another task').getTaskNames()).toEqual([ 'a task' ]);
	});

	it('should support various parameter combinations for task definition', function () {
		var fn = function () {
		};

		expect(target._getTaskParameters([ 'name' ])).toEqual([ 'name', [], jsmake.Utils.EMPTY_FN ]);
		expect(target._getTaskParameters([ 'name', fn])).toEqual([ 'name', [], fn ]);
		expect(target._getTaskParameters([ 'name', 'a'])).toEqual([ 'name', [ 'a' ], jsmake.Utils.EMPTY_FN ]);
		expect(target._getTaskParameters([ 'name', [ 'a' ]])).toEqual([ 'name', [ 'a' ], jsmake.Utils.EMPTY_FN ]);
		expect(target._getTaskParameters([ 'name', [ 'a' ], fn])).toEqual([ 'name', [ 'a' ], fn ]);
	});
});