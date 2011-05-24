/*global Make, describe, beforeEach, expect, it, spyOn */

describe("Make.Fs", function () {
	var target;

	beforeEach(function () {
		target = Make.Fs;
	});

	it('should combine paths', function () {
		spyOn(target, '_combine').andCallFake(function (p1, p2) {
			return [ p1, p2 ].join('/');
		});

		expect(target.combinePaths('a', 'b', [ 'c', 'd' ])).toEqual('a/b/c/d');
		expect(target.combinePaths()).toBeNull();
	});
});
