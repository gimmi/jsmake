/*global Make, describe, beforeEach, expect, it */

describe("RecursionChecker", function () {
	var target, RecursionChecker;
	
	beforeEach(function () {
		RecursionChecker = require('jsmake/recursionChecker').RecursionChecker;
		target = new RecursionChecker('Recursion detected');
	});

	it("should succeed", function () {
		target.enter('a');
		target.enter('b');
		expect(function () {
			target.enter('a');
		}).toThrow('Recursion detected: a => b => a');
	});
});