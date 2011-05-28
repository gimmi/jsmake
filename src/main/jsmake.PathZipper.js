jsmake.PathZipper = {
	zip: function (srcPath, destFile) {
		var zipOutputStream = new java.util.zip.ZipOutputStream(new java.io.FileOutputStream(destFile));
		try {
			this._zip(jsmake.Fs.getParentDirectory(srcPath), jsmake.Fs.getName(srcPath), zipOutputStream);
		} finally {
			zipOutputStream.close(); // This raise exception "java.util.zip.ZipException: ZIP file must have at least one entry"
		}
	},
	_zip: function (basePath, relativePath, zipOutputStream) {
		var names, path;
		path = jsmake.Fs.combinePaths(basePath, relativePath);
		if (jsmake.Fs.fileExists(path)) {
			this._addFile(basePath, relativePath, zipOutputStream);
		} else if (jsmake.Fs.directoryExists(path)) {
			jsmake.Utils.each(jsmake.Fs.getPathNames(path), function (name) {
				this._zip(basePath, jsmake.Fs.combinePaths(relativePath, name), zipOutputStream);
			}, this);
		} else {
			throw "Cannot zip source path '" + path + "', it does not exists";
		}
	},
	_addFile: function (basePath, relativePath, zipOutputStream) {
		var fileInputStream, buffer, n;
		zipOutputStream.putNextEntry(new java.util.zip.ZipEntry(relativePath));
		buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024 * 4);
		fileInputStream = new java.io.FileInputStream(jsmake.Fs.combinePaths(basePath, relativePath));
		try {
			while (-1 !== (n = fileInputStream.read(buffer))) {
				zipOutputStream.write(buffer, 0, n);
			}
		} finally {
			fileInputStream.close();
		}
		zipOutputStream.closeEntry();
	}
};