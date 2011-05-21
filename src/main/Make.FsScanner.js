Make.FsScanner = function (basePath, caseSensitive) {
	this._basePath = basePath;
	this._includeMatchers = [];
	this._excludeMatchers = [];
	this._caseSensitive = caseSensitive;
};
Make.FsScanner.prototype = {
	include: function (pattern) {
		this._includeMatchers.push(new Make.AntPathMatcher(pattern, this._caseSensitive));
		return this;
	},
	exclude: function (pattern) {
		this._excludeMatchers.push(new Make.AntPathMatcher(pattern, this._caseSensitive));
		return this;
	},
	scan: function () {
		var fileNames = [];
		if (this._includeMatchers.length === 0) {
			this.include('**/*');
		}
		this._scan('.', fileNames);
		return fileNames;
	},
	_scan: function (relativePath, fileNames) {
		var fullPath = Make.Fs.combinePath(this._basePath, relativePath);
		Make.Utils.each(Make.Fs.getFiles(fullPath), function (fileName) {
			fileName = Make.Fs.combinePath(relativePath, fileName);
			if (this._evaluatePath(fileName, false)) {
				fileNames.push(Make.Fs.combinePath(this._basePath, fileName));
			}
		}, this);
		Make.Utils.each(Make.Fs.getDirectories(fullPath), function (dir) {
			dir = Make.Fs.combinePath(relativePath, dir);
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
