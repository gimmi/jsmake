Make.Task = function (name, taskNames, body, logger) {
	this._name = name;
	this._taskNames = taskNames;
	this._body = body;
	this._logger = logger;
};
Make.Task.prototype = {
	getName: function () {
		return this._name;
	},
	getTaskNames: function () {
		return this._taskNames;
	},
	run: function (args) {
		this._logger.log('Executing task ' + this._name);
		this._body.apply({}, args);
	}
};
