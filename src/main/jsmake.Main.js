jsmake.Main = function () {
	this._project = null;
	this._logger = jsmake.Sys;
};
jsmake.Main.prototype = {
	init: function (global) {
		this._project = new jsmake.Project(this._logger);
		global.task = this._bind(this._task, this);
	},
	runTask: function (name, args) {
		this._project.runTask(name, args);
	},
	// TODO document it with JSDoc
	_task: function () {
		var args = this._getTaskParameters(jsmake.Utils.toArray(arguments));
		this._project.addTask(new jsmake.Task(args[0], args[1], args[2], this._logger));
	},
	_getTaskParameters: function (args) {
		return [
			args.shift(),
			jsmake.Utils.isFunction(args[0]) ? [] : jsmake.Utils.toArray(args.shift()),
			args.shift() || jsmake.Utils.EMPTY_FN
		];
	},
	_bind: function (fn, scope) {
		return function () {
			fn.apply(scope, arguments);
		};
	}
};
