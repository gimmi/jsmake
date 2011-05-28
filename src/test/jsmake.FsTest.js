/*global Make, describe, beforeEach, afterEach, expect, it, spyOn */

describe("jsmake.Fs", function () {
	var target;

	beforeEach(function () {
		target = jsmake.Fs;
		target.createDirectory('temp');
	});

	afterEach(function () {
		target.deletePath('temp');
	});

	it('should combine paths', function () {
		expect(target.combinePaths('a', 'b', [ 'c', [ 'd' ] ])).toEqual([ 'a', 'b', 'c', 'd' ].join(target.getPathSeparator()));
		expect(target.combinePaths()).toBeNull();
	});

	it('should get path name', function () {
		expect(target.getName('a/b/c/file.txt')).toEqual('file.txt');
	});

	it('should do nothing when trying to delete non existent paths', function () {
		target.deletePath('temp/doesntexists.txt');
	});

	it('should copy file', function () {
		target.writeFile('temp/file.txt', 'content');
		target.copyPath('temp/file.txt', 'temp/a/b/c');
		expect(target.fileExists('temp/a/b/c/file.txt')).toBeTruthy();
	});

	it('should copy directory', function () {
		target.writeFile('temp/a/file1.txt', 'content');
		target.writeFile('temp/a/aa/file2.txt', 'content');

		target.copyPath('temp/a', 'temp/b');

		expect(target.fileExists('temp/b/file1.txt')).toBeTruthy();
		expect(target.fileExists('temp/b/aa/file2.txt')).toBeTruthy();
	});

	it('should throw error if path to copy does not exists', function () {
		expect(function () {
			target.copyPath('temp/a', 'temp/b');
		}).toThrow("Cannot copy source path 'temp/a', it does not exists");
	});

	it('should create directory and all parents if needed', function () {
		target.createDirectory('temp/a/b/c/d');

		expect(target.directoryExists('temp/a/b/c/d')).toBeTruthy();
	});

	it('should delete file', function () {
		target.writeFile('temp/file1.txt', 'content');

		target.deletePath('temp/file1.txt');

		expect(target.fileExists('temp/file1.txt')).toBeFalsy();
	});

	it('should delete directory tree', function () {
		target.writeFile('temp/a/b/file.txt', 'content');

		target.deletePath('temp/a');

		expect(target.directoryExists('temp/a')).toBeFalsy();
	});

	it('should get all children in directory', function () {
		target.writeFile('temp/file1.txt', 'content');
		target.writeFile('temp/file2.txt', 'content');
		target.writeFile('temp/a/file3.txt', 'content');
		target.writeFile('temp/b/file4.txt', 'content');

		expect(target.getChildFileNames('temp')).toEqual([ 'file1.txt', 'file2.txt' ]);
		expect(target.getDirectoryNames('temp')).toEqual([ 'a', 'b' ]);
		expect(target.getChildPathNames('temp')).toEqual([ 'a', 'b', 'file1.txt', 'file2.txt' ]);
	});

	it('should get all directories in directory', function () {
		target.writeFile('temp/file1.txt', 'content');
		target.writeFile('temp/file2.txt', 'content');
		target.writeFile('temp/a/file3.txt', 'content');

		var actual = target.getChildFileNames('temp');

		expect(actual).toEqual([ 'file1.txt', 'file2.txt' ]);
	});

	it('should return no children for file', function () {
		target.writeFile('temp/file.txt', 'content');

		expect(target.getChildFileNames('temp/file.txt')).toEqual([]);
		expect(target.getDirectoryNames('temp/file.txt')).toEqual([]);
	});

	it('should write and read file, handling strange chars, and creating parent directories if needed', function () {
		target.writeFile('temp/a/b/c/file.txt', 'אטעיש');
		expect(target.fileExists('temp/a/b/c/file.txt')).toBeTruthy();
		expect(target.readFile('temp/a/b/c/file.txt')).toEqual('אטעיש');
	});
});
