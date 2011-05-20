/*global Make, describe, beforeEach, expect, it */

describe("Make.RecursionChecker", function () {
	var target;
	beforeEach(function () {
		target = new Make.RecursionChecker('Recursion detected');
	});

	it("should succeed", function () {
		target.enter('a');
		target.enter('b');
		expect(function () {
			target.enter('a');
		}).toThrow('Recursion detected: a => b => a');
	});
});