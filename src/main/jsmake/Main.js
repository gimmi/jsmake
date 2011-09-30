var project = require('./Project');
var sys = require('./Sys');
var task = require('./Task');
var utils = require('./Utils');

var Main = function () {
	this._project = null;
	this._logger = sys.Sys;
};
Main.prototype = {
	init: function (global) {
		this._project = new project.Project(this._logger);
		global.task = this._bind(this._task, this);
	},
	runTask: function (name, args) {
		this._project.runTask(name, args);
	},
	// TODO document it with JSDoc
	_task: function () {
		var args = this._getTaskParameters(utils.Utils.toArray(arguments));
		this._project.addTask(new task.Task(args[0], args[1], args[2], this._logger));
	},
	_getTaskParameters: function (args) {
		return [
			args.shift(),
			utils.Utils.isFunction(args[0]) ? [] : utils.Utils.toArray(args.shift()),
			args.shift() || utils.Utils.EMPTY_FN
		];
	},
	_bind: function (fn, scope) {
		return function () {
			fn.apply(scope, arguments);
		};
	}
};

exports.Main = Main;