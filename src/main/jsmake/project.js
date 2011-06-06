var recursionChecker = require('./recursionChecker');
var utils = require('./utils');
var task = require('./task');

var Project = function (name, defaultTaskName, body, logger) {
	this._name = name;
	this._defaultTaskName = defaultTaskName;
	this._tasks = {};
	this._body = body;
	this._logger = logger;
};
Project.prototype = {
	getName: function () {
		return this._name;
	},
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
	runBody: function (global) {
		var me = this;
		global.task = function (name, tasks, body) {
			me.addTask(new task.Task(name, tasks, body, me._logger));
		};
		this._body.apply({}, []);
		global.task = undefined;
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