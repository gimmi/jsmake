jsmake.Main = function () {
	this._project = null;
	this._logger = jsmake.Sys;
};
jsmake.Main.prototype = {
	init: function (global) {
		this._project = new jsmake.Project(function () {}, this._logger);
		global.task = this._bind(this._task, this);
	},
	runTask: function (name, args) {
		this._project.runTask(name, args);
	},
	_task: function (name, tasks, body) {
		this._project.addTask(new jsmake.Task(name, tasks, body, this._logger));
	},
	_bind: function (fn, scope) {
		return function () {
			fn.apply(scope, arguments);
		};
	}
};
