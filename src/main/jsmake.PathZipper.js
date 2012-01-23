jsmake.PathZipper = {
	zip: function (srcPath, destFile) {
		var basePath, relativePath, 
			zipOutputStream = new java.util.zip.ZipOutputStream(new java.io.FileOutputStream(destFile));
		if (jsmake.Fs.fileExists(srcPath)) {
			basePath = jsmake.Fs.getParentDirectory(srcPath);
			relativePath = jsmake.Fs.getName(srcPath);
		} else if (jsmake.Fs.directoryExists(srcPath)) {
			basePath = srcPath;
			relativePath = '';
		} else {
			throw "Cannot zip source path '" + srcPath + "', it does not exists";
		}
		try {
			this._zip(basePath, relativePath, zipOutputStream);
		} finally {
			zipOutputStream.close(); // This raise exception "java.util.zip.ZipException: ZIP file must have at least one entry"
		}
	},
	_zip: function (basePath, relativePath, zipOutputStream) {
		var names, path;
		path = jsmake.Fs.combinePaths(basePath, relativePath);
		if (jsmake.Fs.directoryExists(path)) {
			jsmake.Utils.each(jsmake.Fs.getChildPathNames(path), function (name) {
				this._zip(basePath, jsmake.Fs.combinePaths(relativePath, name), zipOutputStream);
			}, this);
		} else {
			this._addFile(basePath, relativePath, zipOutputStream);
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