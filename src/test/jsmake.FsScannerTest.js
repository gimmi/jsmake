/*global Make, describe, beforeEach, expect, it, spyOn */

describe("jsmake.FsScanner", function () {
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
			return jsmake.Utils.filter(path.split('/'), function (part) {
				return (part.length > 0) && (part !== '.');
			}).join('/');
		}

		spyOn(jsmake.Fs, 'getChildFileNames').andCallFake(function (path) {
			return files[cleanPath(path)];
		});
		spyOn(jsmake.Fs, 'getDirectoryNames').andCallFake(function (path) {
			return directories[cleanPath(path)];
		});
		spyOn(jsmake.Fs, 'combinePaths').andCallFake(function (path1, path2) {
			return cleanPath([path1, path2].join('/'));
		});
	});

	it('should include **/* when no include filter specified', function () {
		var actual = new jsmake.FsScanner('base/lib/rhino', true).scan();

		expect(actual).toEqual([
			'base/lib/rhino/js.jar',
			'base/lib/rhino/LICENSE.txt'
		]);
	});

	it("should traverse directory tree from base path", function () {
		var actual = new jsmake.FsScanner('base', true).include('**/*').scan();

		expect(actual).toEqual([
			'base/readme.txt',
			'base/build.sh',
			'base/src/main/Main.js',
			'base/src/main/Core.js',
			'base/src/main/Helpers.js',
			'base/src/test/MainTests.js',
			'base/src/test/CoreTests.js',
			'base/src/test/HelpersTests.js',
			'base/lib/underscore.js',
			'base/lib/rhino/js.jar',
			'base/lib/rhino/LICENSE.txt',
			'base/lib/jasmine/jasmine.css',
			'base/lib/jasmine/jasmine.js',
			'base/lib/jasmine/jasmine-html.js',
			'base/lib/jasmine/MIT-LICENSE'
		]);
	});

	it('should apply include filters', function () {
		var actual = new jsmake.FsScanner('base', true).include('**/*.js').scan();

		expect(actual).toEqual([
			'base/src/main/Main.js',
			'base/src/main/Core.js',
			'base/src/main/Helpers.js',
			'base/src/test/MainTests.js',
			'base/src/test/CoreTests.js',
			'base/src/test/HelpersTests.js',
			'base/lib/underscore.js',
			'base/lib/jasmine/jasmine.js',
			'base/lib/jasmine/jasmine-html.js'
		]);
	});

	it('should apply exclude filters', function () {
		var actual = new jsmake.FsScanner('base', true).include('**/*').exclude('**/*.js').scan();

		expect(actual).toEqual([
			'base/readme.txt',
			'base/build.sh',
			'base/lib/rhino/js.jar',
			'base/lib/rhino/LICENSE.txt',
			'base/lib/jasmine/jasmine.css',
			'base/lib/jasmine/MIT-LICENSE'
		]);
	});

	it('should evaluate inclusion', function () {
		expect(new jsmake.FsScanner('base', true)._evaluatePath('anything')).toBeFalsy();
		expect(new jsmake.FsScanner('base', true).include('**/*')._evaluatePath('anything')).toBeTruthy();
		expect(new jsmake.FsScanner('base', true).include('**/*').exclude('**/*_old.*')._evaluatePath('folder/file_old.txt')).toBeFalsy();
	});
});
