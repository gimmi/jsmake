/*global Make, describe, beforeEach, expect, it */

describe("jsmake.RecursionChecker", function () {
	var target;
	beforeEach(function () {
		target = new jsmake.RecursionChecker('Recursion detected');
	});

	it("should succeed", function () {
		target.enter('a');
		target.enter('b');
		expect(function () {
			target.enter('a');
		}).toThrow('Recursion detected: a => b => a');
	});
});