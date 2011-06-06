/*global Make, jasmine, describe, beforeEach, expect, it, spyOn */

describe("jsmake.Main", function () {
	var target;

	beforeEach(function () {
		target = new jsmake.Main();
		target._logger = jasmine.createSpyObj('logger', [ 'log' ]);
	});

	it('should add function to the global scope', function () {
		var scope = {};
		spyOn(target, 'task');

		target.init(scope);
		scope.task(1, 2, 3);

		expect(target.task).toHaveBeenCalledWith(1, 2, 3);
		expect(target.task.mostRecentCall.object).toBe(target);
	});

	it('should throw error when no project defined', function () {
		expect(function () {
			target.getProject();
		}).toThrow('No project defined');
	});

	it("should define project", function () {
		target.init({});

		expect(target.getProject().getName()).toEqual('a project');
	});
});