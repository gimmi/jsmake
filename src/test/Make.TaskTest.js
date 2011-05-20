/*global Make, jasmine, describe, beforeEach, expect, it */

describe("Make.Task", function () {
	var target, body, logger;

	beforeEach(function () {
		logger = jasmine.createSpyObj('logger', [ 'log' ]);
		body = jasmine.createSpy();
		target = new Make.Task('a', [ 'b', 'c' ], body, logger);
	});

	it("should return properties", function () {
		expect(target.getName()).toEqual('a');
		expect(target.getTaskNames()).toEqual([ 'b', 'c' ]);
	});

	it('should run body bound to neutral scope and pass parameters', function () {
		target.run([ 1, 2, 3 ]);

		expect(body).toHaveBeenCalledWith(1, 2, 3);
		expect(body.mostRecentCall.object).toEqual({});
	});

	it("should log when run", function () {
		target.run();

		expect(logger.log).toHaveBeenCalledWith('Executing task a');
	});
});