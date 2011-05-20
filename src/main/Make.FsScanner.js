Make.FsScanner = function (basePath) {
	this._basePath = basePath;
	this._includeMatchers = [];
	this._excludeMatchers = [];
};
Make.FsScanner.prototype = {
	include: function (pattern) {
		this._includeMatchers.push(new Make.AntPathMatcher(pattern));
		return this;
	},
	exclude: function (pattern) {
		this._excludeMatchers.push(new Make.AntPathMatcher(pattern));
		return this;
	},
	scan: function () {
		var fileNames = [];
		this._scan('.', fileNames);
		return fileNames;
	},
	_scan: function (relativePath, fileNames) {
		var fullPath = Make.Sys.combinePath(this._basePath, relativePath);
		Make.Utils.each(Make.Sys.getFiles(fullPath), function (fileName) {
			fileName = Make.Sys.combinePath(relativePath, fileName);
			if (this._evaluatePath(fileName, false)) {
				fileNames.push(fileName);
			}
		}, this);
		Make.Utils.each(Make.Sys.getDirectories(fullPath), function (dir) {
			dir = Make.Sys.combinePath(relativePath, dir);
			if (this._evaluatePath(dir, true)) {
				this._scan(dir, fileNames);
			}
		}, this);
	},
	_evaluatePath: function (path, def) {
		if (this._runMatchers(this._excludeMatchers, path)) {
			return false;
		}
		if (this._runMatchers(this._includeMatchers, path)) {
			return true;
		}
		return def;
	},
	_runMatchers: function (matchers, value) {
		var match = false;
		Make.Utils.each(matchers, function (matcher) {
			match = match || matcher.match(value);
		}, this);
		return match;
	}
};
