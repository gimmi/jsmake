/** @namespace Contains methods for working with filesystem */
jsmake.Fs = {
	/**
	 * Create a zip file containing specified file/directory
	 * @param {String} srcPath file/directory to zip
	 * @param {String} destFile zip file name
	 */
	zipPath: function (srcPath, destFile) {
		jsmake.PathZipper.zip(srcPath, destFile);
	},
	/**
	 * Create a filesystem scanner
	 * @param {String} basePath the path to scan for children tha match criteria
	 * @returns {jsmake.FsScanner}
	 * @see jsmake.FsScanner
	 * @example
	 * jsmake.Fs.createScanner('\home').include('**\*.js').exclude('**\.git').scan();
	 */
	createScanner: function (basePath) {
		return new jsmake.FsScanner(basePath, this.isCaseSensitive());
	},
	/**
	 * Return default OS character encoding
	 * @returns {String} Character encoding, e.g. 'UTF-8' or 'Cp1252'
	 */
	getCharacterEncoding: function () {
		return java.lang.System.getProperty("file.encoding", "UTF-8"); // Windows default is "Cp1252"
	},
	/**
	 * Return OS path separator
	 * @returns {String} path separator, e.g. '/' or '\'
	 */
	getPathSeparator: function () {
		return java.io.File.separator;
	},
	/**
	 * Returns true if OS has case sensitive filesystem
	 * @returns {Boolean} true if OS has case sensitive filesystem
	 */
	isCaseSensitive: function () {
		return !jsmake.Sys.isWindowsOs();
	},
	/**
	 * Read text file content
	 * @param {String} path path of the file to read
	 * @param {String} [characterEncoding=OS default]
	 * @returns {String} text content
	 */
	readFile: function (path, characterEncoding) {
		characterEncoding = characterEncoding || this.getCharacterEncoding();
		if (!this.fileExists(path)) {
			throw "File '" + path + "' not found";
		}
		return readFile(path, characterEncoding);
	},
	/**
	 * Write String to file, creating all necessary parent directories and overwriting if file already exists
	 * @param {String} path path of the file to write
	 * @param {String} content file content
	 * @param {String} [characterEncoding=OS default]
	 */
	writeFile: function (path, content, characterEncoding) {
		characterEncoding = characterEncoding || this.getCharacterEncoding();
		this.createDirectory(this.getParentDirectory(path));
		var out = new java.io.FileOutputStream(new java.io.File(path));
		content = new java.lang.String(content || '');
		try {
			out.write(content.getBytes(characterEncoding));
		} finally {
			out.close();
		}
	},
	/**
	 * Extract last element from a path
	 * @param {String} path the source path
	 * @returns {String} the name of the last element in the path
	 * @example
	 * jsmake.Fs.getName('/users/gimmi/file.txt'); // returns 'file.txt'
	 */
	getName: function (path) {
		return this._translateJavaString(new java.io.File(path).getName());
	},
	/**
	 * Copy file or directory to another directory
	 * @param {String} srcPath source file/directory. Must exists
	 * @param {String} destDirectory destination directory
	 */
	copyPath: function (srcPath, destDirectory) {
		if (this.fileExists(srcPath)) {
			this._copyFile(srcPath, destDirectory);
		} else if (this.directoryExists(srcPath)) {
			this._copyDirectory(srcPath, destDirectory);
		} else {
			throw "Cannot copy source path '" + srcPath + "', it does not exists";
		}
	},
	/**
	 * @param {String} path file or directory path
	 * @returns {Boolean} true if file or directory exists
	 */
	pathExists: function (path) {
		return new java.io.File(path).exists();
	},
	/**
	 * @param {String} path directory path
	 * @returns {Boolean} true if path exists and is a directory
	 */
	directoryExists: function (path) {
		var file = new java.io.File(path);
		return file.exists() && file.isDirectory();
	},
	/**
	 * @param {String} path file path
	 * @returns {Boolean} true if path exists and is a file
	 */
	fileExists: function (path) {
		var file = new java.io.File(path);
		return file.exists() && file.isFile();
	},
	/**
	 * Create directory and all necessary parents
	 * @param {String} path directory to create
	 */
	createDirectory: function (path) {
		var file = new java.io.File(path);
		if (file.exists() && file.isDirectory()) {
			return;
		}
		if (!file.mkdirs()) {
			throw "Failed to create directories for path '" + path + "'";
		}
	},
	/**
	 * Delete file or directory, with all cild elements
	 * @param {String} path to delete
	 */
	deletePath: function (path) {
		if (!this.pathExists(path)) {
			return;
		}
		jsmake.Utils.each(jsmake.Fs.getChildPathNames(path), function (name) {
			this.deletePath(this.combinePaths(path, name));
		}, this);
		if (!new java.io.File(path)['delete']()) {
			throw "'Unable to delete path '" + path + "'";
		}
	},
	/**
	 * Transform a path to absolute, removing '.' and '..' references
	 * @param {String} path path to translate
	 * @returns {String} path in canonical form
	 * @example
	 * jsmake.Fs.getCanonicalPath('../file.txt'); // returns '/users/file.txt'
	 */
	getCanonicalPath: function (path) {
		return this._translateJavaString(new java.io.File(path).getCanonicalPath());
	},
	/**
	 * Returns parent path
	 * @param {String} path
	 * @returns {String} parent path
	 */
	getParentDirectory: function (path) {
		return this._translateJavaString(new java.io.File(path).getCanonicalFile().getParent());
	},
	/**
	 * Combine all passed path fragments into one, using OS path separator. Supports any number of parameters.
	 * @example
	 * jsmake.Fs.combinePaths('home', 'gimmi', [ 'dir/subdir', 'file.txt' ]);
	 * // returns 'home/gimmi/dir/subdir/file.txt'
	 */
	combinePaths: function () {
		var paths = jsmake.Utils.flatten(arguments);
		return jsmake.Utils.reduce(paths, function (memo, path) {
			return (memo ? this._javaCombine(memo, path) : path);
		}, null, this);
	},
	getChildPathNames: function (basePath) {
		return this._listFilesWithFilter(basePath, function () {
			return true;
		});
	},
	getChildFileNames: function (basePath) {
		return this._listFilesWithFilter(basePath, function (fileName) {
			return new java.io.File(fileName).isFile();
		});
	},
	getChildDirectoryNames: function (basePath) {
		return this._listFilesWithFilter(basePath, function (fileName) {
			return new java.io.File(fileName).isDirectory();
		});
	},
	_javaCombine: function (path1, path2) {
		return this._translateJavaString(new java.io.File(path1, path2).getPath());
	},
	_copyDirectory: function (srcDirectory, destDirectory) {
		this.deletePath(destDirectory);
		this.createDirectory(destDirectory);
		jsmake.Utils.each(this.getChildFileNames(srcDirectory), function (path) {
			this.copyPath(this.combinePaths(srcDirectory, path), destDirectory);
		}, this);
		jsmake.Utils.each(this.getChildDirectoryNames(srcDirectory), function (path) {
			this.copyPath(this.combinePaths(srcDirectory, path), this.combinePaths(destDirectory, path));
		}, this);
	},
	_copyFile: function (srcFile, destDirectory) {
		var destFile = this.combinePaths(destDirectory, this.getName(srcFile));
		this.deletePath(destFile);
		this.createDirectory(destDirectory);
		this._copyFileToFile(srcFile, destFile);
	},
	_copyFileToFile: function (srcFile, destFile) {
		var input, output, buffer, n;
		input = new java.io.FileInputStream(srcFile);
		try {
			output = new java.io.FileOutputStream(destFile);
			try {
				buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024 * 4);
				while (-1 !== (n = input.read(buffer))) {
					output.write(buffer, 0, n);
				}
			} finally {
				output.close();
			}
		} finally {
			input.close();
		}
	},
	_listFilesWithFilter: function (basePath, filter) {
		var fileFilter, files;
		fileFilter = new java.io.FileFilter({ accept: filter });
		files = this._translateJavaArray(new java.io.File(basePath).listFiles(fileFilter));
		return jsmake.Utils.map(files, function (file) {
			return this._translateJavaString(file.getName());
		}, this);
	},
	_translateJavaArray: function (javaArray) {
		var ary = [], i;
		if (javaArray === null) {
			return null;
		}
		for (i = 0; i < javaArray.length; i += 1) {
			ary.push(javaArray[i]);
		}
		return ary;
	},
	_translateJavaString: function (javaString) {
		return String(javaString);
	}
};