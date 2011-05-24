Make.Fs = {
	createScanner: function (basePath) {
		return new Make.FsScanner(basePath, this.isCaseSensitive());
	},
	getFileEncoding: function () {
		return java.lang.System.getProperty("file.encoding", "UTF-8"); // Windows default is "Cp1252"
	},
	getPathSeparator: function () {
		return java.io.File.separator;
	},
	isCaseSensitive: function () {
		return !Make.Sys.isWindowsOs();
	},
	readFile: function (path) {
		if (!this.fileExists(path)) {
			throw "File '" + path + "' not found";
		}
		return readFile(path);
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
	writeFile: function (path, data, encoding) {
		this.createDirectory(this.getParentDirectory(path));
		var out = new java.io.FileOutputStream(new java.io.File(path));
		data = new java.lang.String(data || '');
		try {
			if (!encoding) {
				out.write(data.getBytes());
			} else {
				out.write(data.getBytes(encoding));
			}
		} finally {
			out.close();
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
		Make.Utils.each(this.getFiles(path), function (fileName) {
			new java.io.File(path, fileName)['delete']();
		}, this);
		Make.Utils.each(this.getDirectories(path), function (dirName) {
			this.deletePath(this.combinePaths(path, dirName));
		}, this);
		new java.io.File(path)['delete']();
	},
	getCanonicalPath: function (path) {
		return this._translateJavaString(new java.io.File(path).getCanonicalPath());
	},
	getParentDirectory: function (path) {
		return this._translateJavaString(new java.io.File(path).getCanonicalFile().getParent());
	},
	combinePaths: function () {
		var paths = Make.Utils.flatten(arguments);
		return Make.Utils.reduce(paths, function (memo, path) {
			return (memo ? this._combine(memo, path) : path);
		}, null, this);
	},
	_combine: function (path1, path2) {
		return this._translateJavaString(new java.io.File(path1, path2).getPath());
	},
	getFiles: function (basePath) {
		return this._getFiles(basePath, function (fileName) {
			return new java.io.File(fileName).isFile();
		});
	},
	getDirectories: function (basePath) {
		return this._getFiles(basePath, function (fileName) {
			return new java.io.File(fileName).isDirectory();
		});
	},
	_copyDirectory: function (srcDirectory, destDirectory) {
		this.deletePath(destDirectory);
		this.createDirectory(destDirectory);
		Make.Utils.each(this.getFiles(srcDirectory), function (path) {
			this.copyPath(this.combinePaths(srcDirectory, path), destDirectory);
		}, this);
		Make.Utils.each(this.getDirectories(srcDirectory), function (path) {
			this.copyPath(this.combinePaths(srcDirectory, path), this.combinePaths(destDirectory, path));
		}, this);
	},
	_copyFile: function (srcFile, destDirectory) {
		var destFile = this.combinePaths(destDirectory, this.getName(srcFile));
		this.deletePath(destFile);
		this.createDirectory(destDirectory);
		this._copyFileToFile(srcFile, destFile);
	},
	_copyFileToFile: function (srcPath, destPath) {
		var srcFile, destFile, output, input, buffer, n;
		srcFile = new java.io.File(srcPath);
		destFile = new java.io.File(destPath);
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
	_getFiles: function (basePath, filter) {
		var fileFilter, files;
		fileFilter = new java.io.FileFilter({ accept: filter });
		files = this._translateJavaArray(new java.io.File(basePath).listFiles(fileFilter));
		return Make.Utils.map(files, function (file) {
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