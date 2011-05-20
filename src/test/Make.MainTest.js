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
		spyOn(target, 'task');

		target.initGlobalScope(scope);
		scope.project(1, 2, 3);
		scope.task(4, 5, 6);

		expect(target.project).toHaveBeenCalledWith(1, 2, 3);
		expect(target.project.mostRecentCall.object).toBe(target);
		expect(target.task).toHaveBeenCalledWith(4, 5, 6);
		expect(target.task.mostRecentCall.object).toBe(target);
	});

	it('should throw error when no project defined', function () {
		expect(function () {
			target.run([]);
		}).toThrow('No project defined');
	});

	it("should define project", function () {
		target.project('name', 'defaultTaskName', function () {
			expect(target._currentProject.getName()).toEqual('name');
		});

		expect(target._definedProject.getName()).toEqual('name');
		expect(target._currentProject).toBeNull();
	});

	it('project body should run in neutral scope', function () {
		var body = jasmine.createSpy();

		target.project('name', 'defaultTaskName', body);

		expect(body.mostRecentCall.object).toEqual({});
	});

	it("should allow only one project", function () {
		target.project('prj1', 'defaultTaskName', jasmine.createSpy());
		expect(function () {
			target.project('prj2', 'defaultTaskName', jasmine.createSpy());
		}).toThrow('project already defined');
	});

	it("should allow task to be defined only inside project", function () {
		expect(function () {
			target.task('task', [], jasmine.createSpy());
		}).toThrow('Tasks must be defined only into projects');
		target.project('prj1', 'defaultTaskName', function () {
			target.task('task', [], jasmine.createSpy());
		});
		expect(target._definedProject.getTask('task')).not.toBeNull();
	});

	it('should throw error when nesting task inside task', function () {
		target.project('prj1', 'task', function () {
			target.task('task', [], function () {
				target.task('nested task', [], jasmine.createSpy());
			});
		});

		expect(function () {
			target.run([]);
		}).toThrow('Tasks must be defined only into projects');
	});
});