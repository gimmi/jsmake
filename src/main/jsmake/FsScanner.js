/**
 * Don't instantiate it directly, use {@link jsmake.Fs.createScanner}
 * @constructor
 */
jsmake.FsScanner = function (basePath, caseSensitive) {
	this._basePath = basePath;
	this._includeMatchers = [];
	this._excludeMatchers = [];
	this._caseSensitive = caseSensitive;
};
jsmake.FsScanner.prototype = {
	/**
	 * Add a criteria for path inclusion. If no inclusion path are specified, '**\*' is assumed
	 * @param {String} pattern
	 * @returns {jsmake.FsScanner} this instance, for chaining calls
	 * @example
	 * jsmake.Fs.createScanner('\home').include('**\*.js').scan();
	 */
	include: function (pattern) {
		this._includeMatchers.push(new jsmake.AntPathMatcher(pattern, this._caseSensitive));
		return this;
	},
	/**
	 * Add a criteria for path exclusion
	 * @param {String} pattern
	 * @returns {jsmake.FsScanner} this instance, for chaining calls
	 * @example
	 * jsmake.Fs.createScanner('\home').exclude('**\.git').scan();
	 */
	exclude: function (pattern) {
		this._excludeMatchers.push(new jsmake.AntPathMatcher(pattern, this._caseSensitive));
		return this;
	},
	/**
	 * Execute filesystem scanning with defined criterias
	 * @returns {String[]} all mathing paths
	 * @example
	 * // returns the path of all files in /home directory
	 * jsmake.Fs.createScanner('/home').scan();
	 */
	scan: function () {
		var fileNames = [];
		if (this._includeMatchers.length === 0) {
			this.include('**/*');
		}
		this._scan('.', fileNames);
		return fileNames;
	},
	_scan: function (relativePath, fileNames) {
		var fullPath = jsmake.Fs.combinePaths(this._basePath, relativePath);
		jsmake.Utils.each(jsmake.Fs.getChildFileNames(fullPath), function (fileName) {
			fileName = jsmake.Fs.combinePaths(relativePath, fileName);
			if (this._evaluatePath(fileName, false)) {
				fileNames.push(jsmake.Fs.combinePaths(this._basePath, fileName));
			}
		}, this);
		jsmake.Utils.each(jsmake.Fs.getChildDirectoryNames(fullPath), function (dir) {
			dir = jsmake.Fs.combinePaths(relativePath, dir);
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
		jsmake.Utils.each(matchers, function (matcher) {
			match = match || matcher.match(value);
		}, this);
		return match;
	}
};
