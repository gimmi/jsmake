Make.Project = function (name, defaultTaskName, logger) {
	this._name = name;
	this._defaultTaskName = defaultTaskName;
	this._tasks = {};
	this._logger = logger;
};
Make.Project.prototype = {
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
		this._fillDependencies(this.getTask(name), tasks, new Make.RecursionChecker('Task recursion found'));
		return Make.Utils.distinct(tasks);
	},
	run: function (name, args) {
		var tasks, taskNames;
		name = name || this._defaultTaskName;
		tasks = this.getTasks(name);
		taskNames = Make.Utils.map(tasks, function (task) {
			return task.getName();
		}, this);
		this._logger.log('Task execution order: ' + taskNames.join(', '));
		Make.Utils.each(tasks, function (task) {
			task.run(task.getName() === name ? args : []);
		}, this);
	},
	_fillDependencies: function (task, tasks, recursionChecker) {
		recursionChecker.wrap(task.getName(), function () {
			Make.Utils.each(task.getTaskNames(), function (taskName) {
				var task = this.getTask(taskName);
				this._fillDependencies(task, tasks, recursionChecker);
			}, this);
			tasks.push(task);
		}, this);
	}
};
