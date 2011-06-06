/*global Make, describe, beforeEach, afterEach, expect, it, spyOn */

describe("PathZipper", function () {
	var target, Fs;

	beforeEach(function () {
		target = require('jsmake/pathZipper').PathZipper;
		Fs = require('jsmake/fs').Fs;
		Fs.createDirectory('temp');
	});

	afterEach(function () {
		Fs.deletePath('temp');
	});

	it('should zip file', function () {
		Fs.writeFile('temp/file.txt', 'content');

		target.zip('temp/file.txt', 'temp/file.zip');

		expect(Fs.fileExists('temp/file.zip')).toBeTruthy();
	});

	it('should zip directory', function () {
		Fs.writeFile('temp/a/file1.txt', 'content');
		Fs.writeFile('temp/a/file2.txt', 'content');
		Fs.writeFile('temp/a/b/file3.txt', 'content');

		target.zip('temp/a', 'temp/a.zip');

		expect(Fs.fileExists('temp/a.zip')).toBeTruthy();
	});
});
