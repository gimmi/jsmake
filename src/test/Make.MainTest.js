/*global Make, jasmine, describe, beforeEach, expect, it, spyOn */

describe("Make.Main", function () {
	var target;

	beforeEach(function () {
		target = new Make.Main();
		target._logger = jasmine.createSpyObj('logger', [ 'log' ]);
	});

	it('should add function to the global scope', function () {
		var scope = {};
		spyOn(target, 'project');

		target.initGlobalScope(scope);
		scope.project(1, 2, 3);

		expect(target.project).toHaveBeenCalledWith(1, 2, 3);
		expect(target.project.mostRecentCall.object).toBe(target);
	});

	it('should throw error when no project defined', function () {
		expect(function () {
			target.getProject();
		}).toThrow('No project defined');
	});

	it("should define project", function () {
		target.project('name', 'defaultTaskName', function () {
		});

		expect(target.getProject().getName()).toEqual('name');
	});

	it("should allow only one project", function () {
		target.project('prj1', 'defaultTaskName', jasmine.createSpy());
		expect(function () {
			target.project('prj2', 'defaultTaskName', jasmine.createSpy());
		}).toThrow('project already defined');
	});
});