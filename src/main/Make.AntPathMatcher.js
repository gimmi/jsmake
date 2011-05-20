Make.AntPathMatcher = function (pattern) {
	this._pattern = pattern;
};
Make.AntPathMatcher.prototype = {
	match: function (path) {
		var patternTokens, pathTokens;
		patternTokens = this._tokenize(this._pattern);
		pathTokens = this._tokenize(path);
		return this._matchTokens(patternTokens, pathTokens);
	},
	_matchTokens: function (patternTokens, pathTokens) {
		var patternToken, pathToken;
		while (true) {
			patternToken = patternTokens.shift();
			if (patternToken === '**') {
				pathTokens = pathTokens.slice(-patternTokens.length).reverse();
				patternTokens = patternTokens.reverse();
				return this._matchTokens(patternTokens, pathTokens);
			}
			pathToken = pathTokens.shift();
			if (patternToken && pathToken) {
				if (!this._matchToken(patternToken, pathToken)) {
					return false;
				}
			} else if (patternToken && !pathToken) {
				return false;
			} else if (!patternToken && pathToken) {
				return false;
			} else {
				return true;
			}
		}
	},
	_matchToken: function (patternToken, pathToken) {
		var regex = '', i, ch;
		for (i = 0; i < patternToken.length; i += 1) {
			ch = patternToken.charAt(i);
			if (ch === '*') {
				regex += '.*';
			} else if (ch === '?') {
				regex += '.{1}';
			} else {
				regex += Make.Utils.escapeForRegex(ch);
			}
		}
		return new RegExp(regex).test(pathToken);
	},
	_tokenize: function (pattern) {
		var tokens = pattern.split(/\\+|\/+/);
		tokens = Make.Utils.map(tokens, function (token) {
			return Make.Utils.trim(token);
		}, this);
		tokens = Make.Utils.filter(tokens, function (token) {
			return !/^[\s\.]*$/.test(token);
		}, this);
		if (tokens[tokens.length - 1] === '**') {
			throw 'Invalid ** wildcard at end pattern, use **/* instead'; // TODO maybe useless
		}
		// TODO invalid more then one **
		return tokens;
	}
};
