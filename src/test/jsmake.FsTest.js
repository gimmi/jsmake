/*global Make, describe, beforeEach, expect, it, spyOn */

describe("jsmake.Fs", function () {
	var target;

	beforeEach(function () {
		target = jsmake.Fs;
	});

	it('should combine paths', function () {
		spyOn(target, '_combine').andCallFake(function (p1, p2) {
			return [ p1, p2 ].join('/');
		});

		expect(target.combinePaths('a', 'b', [ 'c', 'd' ])).toEqual('a/b/c/d');
		expect(target.combinePaths()).toBeNull();
	});


	describe('copyPath', function () {
		beforeEach(function () {
			spyOn(target, '_copyFileToFile');
		});

		it('should throw exception if source does not exists', function () {
			spyOn(target, 'fileExists').andReturn(false);
			spyOn(target, 'directoryExists').andReturn(false);
			expect(function () {
				target.copyPath('a', 'b');
			}).toThrow("Cannot copy source path 'a', it does not exists");
		});
	});
});
