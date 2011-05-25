jsmake.DirectoryZipper = {
	zip: function (srcDirectory, destFile) {
		var zipOutputStream = new java.util.zip.ZipOutputStream(new java.io.FileOutputStream(destFile));
		try {
			this._zip(jsmake.Fs.getParentDirectory(srcDirectory), jsmake.Fs.getName(srcDirectory), zipOutputStream);
		} finally {
			zipOutputStream.close(); // This raise exception "java.util.zip.ZipException: ZIP file must have at least one entry"
		}
	},
	_zip: function (basePath, relativePath, zipOutputStream) {
		var path = jsmake.Fs.combinePaths(basePath, relativePath);
		jsmake.Utils.each(jsmake.Fs.getFileNames(path), function (fileName) {
			this._addFile(basePath, jsmake.Fs.combinePaths(relativePath, fileName), zipOutputStream);
		}, this);
		jsmake.Utils.each(jsmake.Fs.getDirectoryNames(path), function (dirName) {
			this._zip(basePath, jsmake.Fs.combinePaths(relativePath, dirName), zipOutputStream);
		}, this);
	},
	_addFile: function (basePath, relativePath, zipOutputStream) {
		var fileInputStream, buffer, n;
		zipOutputStream.putNextEntry(new java.util.zip.ZipEntry(relativePath));
		fileInputStream = new java.io.FileInputStream(jsmake.Fs.combinePaths(basePath, relativePath));
		buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024 * 4);
		while (-1 !== (n = fileInputStream.read(buffer))) {
			zipOutputStream.write(buffer, 0, n);
		}
		zipOutputStream.closeEntry();
	}
};