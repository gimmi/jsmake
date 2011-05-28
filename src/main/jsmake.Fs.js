jsmake.Fs = {
	zipPath: function (srcPath, destFile) {
		jsmake.PathZipper.zip(srcPath, destFile);
	},
	createScanner: function (basePath) {
		return new jsmake.FsScanner(basePath, this.isCaseSensitive());
	},
	getCharacterEncoding: function () {
		return java.lang.System.getProperty("file.encoding", "UTF-8"); // Windows default is "Cp1252"
	},
	getPathSeparator: function () {
		return java.io.File.separator;
	},
	isCaseSensitive: function () {
		return !jsmake.Sys.isWindowsOs();
	},
	readFile: function (path, characterEncoding) {
		characterEncoding = characterEncoding || this.getCharacterEncoding();
		if (!this.fileExists(path)) {
			throw "File '" + path + "' not found";
		}
		return readFile(path, characterEncoding);
	},
	writeFile: function (path, data, characterEncoding) {
		characterEncoding = characterEncoding || this.getCharacterEncoding();
		this.createDirectory(this.getParentDirectory(path));
		var out = new java.io.FileOutputStream(new java.io.File(path));
		data = new java.lang.String(data || '');
		try {
			out.write(data.getBytes(characterEncoding));
		} finally {
			out.close();
		}
	},
	getName: function (path) {
		return this._translateJavaString(new java.io.File(path).getName());
	},
	copyPath: function (srcPath, destDirectory) {
		if (this.fileExists(srcPath)) {
			this._copyFile(srcPath, destDirectory);
		} else if (this.directoryExists(srcPath)) {
			this._copyDirectory(srcPath, destDirectory);
		} else {
			throw "Cannot copy source path '" + srcPath + "', it does not exists";
		}
	},
	pathExists: function (path) {
		return new java.io.File(path).exists();
	},
	directoryExists: function (path) {
		var file = new java.io.File(path);
		return file.exists() && file.isDirectory();
	},
	fileExists: function (path) {
		var file = new java.io.File(path);
		return file.exists() && file.isFile();
	},
	createDirectory: function (path) {
		var file = new java.io.File(path);
		if (file.exists() && file.isDirectory()) {
			return;
		}
		if (!file.mkdirs()) {
			throw "Failed to create directories for path '" + path + "'";
		}
	},
	deletePath: function (path) {
		if (!this.pathExists(path)) {
			return;
		}
		jsmake.Utils.each(jsmake.Fs.getPathNames(path), function (name) {
			this.deletePath(this.combinePaths(path, name));
		}, this);
		if (!new java.io.File(path)['delete']()) {
			throw "'Unable to delete path '" + path + "'";
		}
	},
	getCanonicalPath: function (path) {
		return this._translateJavaString(new java.io.File(path).getCanonicalPath());
	},
	getParentDirectory: function (path) {
		return this._translateJavaString(new java.io.File(path).getCanonicalFile().getParent());
	},
	combinePaths: function () {
		var paths = jsmake.Utils.flatten(arguments);
		return jsmake.Utils.reduce(paths, function (memo, path) {
			return (memo ? this._javaCombine(memo, path) : path);
		}, null, this);
	},
	getPathNames: function (basePath) {
		return this._listFilesWithFilter(basePath, function () {
			return true;
		});
	},
	getFileNames: function (basePath) {
		return this._listFilesWithFilter(basePath, function (fileName) {
			return new java.io.File(fileName).isFile();
		});
	},
	getDirectoryNames: function (basePath) {
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
		jsmake.Utils.each(this.getFileNames(srcDirectory), function (path) {
			this.copyPath(this.combinePaths(srcDirectory, path), destDirectory);
		}, this);
		jsmake.Utils.each(this.getDirectoryNames(srcDirectory), function (path) {
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