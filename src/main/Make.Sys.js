Make.Sys = {
	getDefaultFileEncoding: function () {
		return java.lang.System.getProperty("file.encoding", "UTF-8"); // Windows default is "Cp1252"
	},
	loadJavascriptFile: function (file) {
		load(file);
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
	copyFileToDirectory: function (srcPath, destPath) {
		this.copyFileToFile(srcPath, this.combinePath(destPath, this.getName(srcPath)));
	},
	copyFileToFile: function (srcPath, destPath) {
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
			this.deletePath(this.combinePath(path, dirName));
		}, this);
		new java.io.File(path)['delete']();
	},
	getCanonicalPath: function (path) {
		return this._translateJavaString(new java.io.File(path).getCanonicalPath());
	},
	getParentDirectory: function (path) {
		return this._translateJavaString(new java.io.File(path).getCanonicalFile().getParent());
	},
	combinePath: function (path1, path2) {
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
	runCmd: function (cmd) {
		return runCommand(cmd);
	},
	getEnvVar: function (name, def) {
		return java.lang.System.getenv(name) || def;
	},
	log: function (msg) {
		print(msg);
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
