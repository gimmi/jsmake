/*global Make, describe, beforeEach, expect, it, spyOn */

describe("Make.FsScanner", function () {
	var files, directories;

	beforeEach(function () {
		files = {
			'base/.': [
				'readme.txt',
				'build.sh'
			],
			'base/./src': [ ],
			'base/./src/main': [
				'Main.js',
				'Core.js',
				'Helpers.js'
			],
			'base/./src/test': [
				'MainTests.js',
				'CoreTests.js',
				'HelpersTests.js'
			]
		};
		directories = {
			'base/.': [
				'src'
			],
			'base/./src': [
				'main',
				'test'
			]
		};
		spyOn(Make.Sys, 'getFiles').andCallFake(function (path) {
			return files[path];
		});
		spyOn(Make.Sys, 'getDirectories').andCallFake(function (path) {
			return directories[path];
		});
		spyOn(Make.Sys, 'combinePath').andCallFake(function (path1, path2) {
			return [path1, path2].join('/');
		});
	});

	it("should traverse directory tree from base path", function () {
		var actual = new Make.FsScanner('base').include('**/*').scan();

		expect(actual).toEqual([
			'./readme.txt',
			'./build.sh',
			'./src/main/Main.js',
			'./src/main/Core.js',
			'./src/main/Helpers.js',
			'./src/test/MainTests.js',
			'./src/test/CoreTests.js',
			'./src/test/HelpersTests.js'
		]);
	});

	it('should apply include filters', function () {
		var actual = new Make.FsScanner('base').include('**/*.js').scan();

		expect(actual).toEqual([
			'./src/main/Main.js',
			'./src/main/Core.js',
			'./src/main/Helpers.js',
			'./src/test/MainTests.js',
			'./src/test/CoreTests.js',
			'./src/test/HelpersTests.js'
		]);
	});

	it('should apply exclude filters', function () {
		var actual = new Make.FsScanner('base').include('**/*').exclude('**/*.js').scan();

		expect(actual).toEqual([
			'./readme.txt',
			'./build.sh'
		]);
	});

	it('should evaluate inclusion', function () {
		expect(new Make.FsScanner('base')._evaluatePath('anything')).toBeFalsy();
		expect(new Make.FsScanner('base').include('**/*')._evaluatePath('anything')).toBeTruthy();
		expect(new Make.FsScanner('base').include('**/*').exclude('**/*_old.*')._evaluatePath('folder/file_old.txt')).toBeFalsy();
	});
});
