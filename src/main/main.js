var sys = require('./sys');
var project = require('./project');

var Main = function () {
	this._project = null;
	this._logger = sys.Sys;
};
Main.prototype = {
	getProject: function () {
		if (!this._project) {
			throw 'No project defined';
		}
		return this._project;
	},
	initGlobalScope: function (global) {
		global.project = this._bind(this.project, this);
	},
	run: function (args) {
		this.getProject().run(args.shift(), args);
	},
	project: function (name, defaultTaskName, body) {
		if (this._project) {
			throw 'project already defined';
		}
		this._project = new project.Project(name, defaultTaskName, body, this._logger);
	},
	_bind: function (fn, scope) {
		return function () {
			fn.apply(scope, arguments);
		};
	}
};

exports.Main = Main;