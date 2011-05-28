/*global Make, describe, beforeEach, afterEach, expect, it, spyOn */

describe("jsmake.PathZipper", function () {
	var target;

	beforeEach(function () {
		target = jsmake.PathZipper;
		jsmake.Fs.createDirectory('temp');
	});

	afterEach(function () {
		jsmake.Fs.deletePath('temp');
	});

	it('should zip file', function () {
		jsmake.Fs.writeFile('temp/file.txt', 'content');

		target.zip('temp/file.txt', 'temp/file.zip');

		expect(jsmake.Fs.fileExists('temp/file.zip')).toBeTruthy();
	});

	it('should zip directory', function () {
		jsmake.Fs.writeFile('temp/a/file1.txt', 'content');
		jsmake.Fs.writeFile('temp/a/file2.txt', 'content');
		jsmake.Fs.writeFile('temp/a/b/file3.txt', 'content');

		target.zip('temp/a', 'temp/a.zip');

		expect(jsmake.Fs.fileExists('temp/a.zip')).toBeTruthy();
	});
});
