var utils = require('./utils');

var RecursionChecker = function (message) {
	this._message = message;
	this._stack = [];
};
RecursionChecker.prototype = {
	enter: function (id) {
		this._check(id);
		this._stack.push(id);
	},
	exit: function () {
		this._stack.pop();
	},
	wrap: function (id, fn, scope) {
		this.enter(id);
		try {
			fn.call(scope);
		} finally {
			this.exit();
		}
	},
	_check: function (id) {
		if (utils.Utils.contains(this._stack, id)) {
			this._stack.push(id);
			throw this._message + ': ' + this._stack.join(' => ');
		}
	}
};

exports.RecursionChecker = RecursionChecker;