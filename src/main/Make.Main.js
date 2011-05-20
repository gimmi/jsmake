Make.Main = function () {
	this._definedProject = null;
	this._currentProject = null;
	this._logger = Make.Sys;
};
Make.Main.prototype = {
	initGlobalScope: function (global) {
		global.project = this._bind(this.project, this);
		global.task = this._bind(this.task, this);
	},
	run: function (args) {
		if (!this._definedProject) {
			throw 'No project defined';
		}
		this._definedProject.run(args.shift(), args);
	},
	project: function (name, defaultTaskName, body) {
		if (this._definedProject) {
			throw 'project already defined';
		}
		this._definedProject = this._currentProject = new Make.Project(name, defaultTaskName, this._logger);
		body.apply({}, []);
		this._currentProject = null;
	},
	task: function (name, tasks, body) {
		if (!this._currentProject) {
			throw 'Tasks must be defined only into projects';
		}
		this._currentProject.addTask(new Make.Task(name, tasks, body, this._logger));
	},
	_bind: function (fn, scope) {
		return function () {
			fn.apply(scope, arguments);
		};
	}
};
