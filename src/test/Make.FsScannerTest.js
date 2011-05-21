/*global Make, describe, beforeEach, expect, it, spyOn */

describe("Make.FsScanner", function () {
	var files, directories;


	beforeEach(function () {
		files = {
			'base': [
				'readme.txt',
				'build.sh'
			],
			'base/src': [],
			'base/lib': [
				'underscore.js'
			],
			'base/lib/rhino': [
				'js.jar',
				'LICENSE.txt'
			],
			'base/lib/jasmine': [
				'jasmine.css',
				'jasmine.js',
				'jasmine-html.js',
				'MIT-LICENSE'
			],
			'base/src/main': [
				'Main.js',
				'Core.js',
				'Helpers.js'
			],
			'base/src/test': [
				'MainTests.js',
				'CoreTests.js',
				'HelpersTests.js'
			]
		};
		directories = {
			'base': [
				'src',
				'lib'
			],
			'base/src': [
				'main',
				'test'
			],
			'base/lib': [
				'rhino',
				'jasmine'
			]
		};

		function cleanPath(path) {
			return Make.Utils.filter(path.split('/'), function (part) {
				return (part.length > 0) && (part !== '.');
			}).join('/');
		}

		spyOn(Make.Sys, 'getFiles').andCallFake(function (path) {
			return files[cleanPath(path)];
		});
		spyOn(Make.Sys, 'getDirectories').andCallFake(function (path) {
			return directories[cleanPath(path)];
		});
		spyOn(Make.Sys, 'combinePath').andCallFake(function (path1, path2) {
			return [path1, path2].join('/');
		});
	});

	it('should include **/* when no include filter specified', function () {
		var actual = new Make.FsScanner('base/lib/rhino').scan();

		expect(actual).toEqual([
			'./js.jar',
			'./LICENSE.txt'
		]);
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
			'./src/test/HelpersTests.js',
			'./lib/underscore.js',
			'./lib/rhino/js.jar',
			'./lib/rhino/LICENSE.txt',
			'./lib/jasmine/jasmine.css',
			'./lib/jasmine/jasmine.js',
			'./lib/jasmine/jasmine-html.js',
			'./lib/jasmine/MIT-LICENSE'
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
			'./src/test/HelpersTests.js',
			'./lib/underscore.js',
			'./lib/jasmine/jasmine.js',
			'./lib/jasmine/jasmine-html.js'
		]);
	});

	it('should apply exclude filters', function () {
		var actual = new Make.FsScanner('base').include('**/*').exclude('**/*.js').scan();

		expect(actual).toEqual([
			'./readme.txt',
			'./build.sh',
			'./lib/rhino/js.jar',
			'./lib/rhino/LICENSE.txt',
			'./lib/jasmine/jasmine.css',
			'./lib/jasmine/MIT-LICENSE'
		]);
	});

	it('should evaluate inclusion', function () {
		expect(new Make.FsScanner('base')._evaluatePath('anything')).toBeFalsy();
		expect(new Make.FsScanner('base').include('**/*')._evaluatePath('anything')).toBeTruthy();
		expect(new Make.FsScanner('base').include('**/*').exclude('**/*_old.*')._evaluatePath('folder/file_old.txt')).toBeFalsy();
	});
});
