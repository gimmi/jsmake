jsmake.Main = function () {
	this._project = null;
	this._logger = jsmake.Sys;
};
jsmake.Main.prototype = {
	getProject: function () {
		if (!this._project) {
			throw 'No project defined';
		}
		return this._project;
	},
	init: function (global) {
		this._project = new jsmake.Project('a project', 'default', function () {}, this._logger);
		global.task = this._bind(this._task, this);
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
