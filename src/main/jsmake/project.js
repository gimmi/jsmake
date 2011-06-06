var recursionChecker = require('./recursionChecker');
var utils = require('./utils');
var task = require('./task');

var Project = function (logger) {
	this._tasks = {};
	this._logger = logger;
};
Project.prototype = {
	addTask: function (task) {
		this._tasks[task.getName()] = task;
	},
	getTask: function (name) {
		var task = this._tasks[name];
		if (!task) {
			throw "Task '" + name + "' not defined";
		}
		return task;
	},
	getTasks: function (name) {
		var tasks = [];
		this._fillDependencies(this.getTask(name), tasks, new recursionChecker.RecursionChecker('Task recursion found'));
		return utils.Utils.distinct(tasks);
	},
	runTask: function (name, args) {
		var tasks, taskNames;
		name = name || this._defaultTaskName;
		tasks = this.getTasks(name);
		taskNames = utils.Utils.map(tasks, function (task) {
			return task.getName();
		}, this);
		this._logger.log('Task execution order: ' + taskNames.join(', '));
		utils.Utils.each(tasks, function (task) {
			task.run(task.getName() === name ? args : []);
		}, this);
	},
	_fillDependencies: function (task, tasks, recursionChecker) {
		recursionChecker.wrap(task.getName(), function () {
			utils.Utils.each(task.getTaskNames(), function (taskName) {
				var task = this.getTask(taskName);
				this._fillDependencies(task, tasks, recursionChecker);
			}, this);
			tasks.push(task);
		}, this);
	}
};

exports.Project = Project;