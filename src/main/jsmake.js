var project = require('jsmake/project');
var task = require('jsmake/task');
var sys = require('jsmake/sys');

var _project = null;

exports.project = function (name, defaultTaskName, body) {
	if (_project) {
		throw 'project already defined';
	}
	_project = new project.Project(name, defaultTaskName, body, sys.Sys);
};
exports.task = function (name, tasks, body) {
	if (!_project) {
		throw 'no project defined';
	}
	_project.addTask(new task.Task(name, tasks, body, sys.Sys));
};
exports.getProject = function () {
	if (!_project) {
		throw 'no project defined';
	}
	return _project;
};
exports.Utils = require('jsmake/utils').Utils;
exports.Fs = require('jsmake/fs').Fs;
exports.Sys = require('jsmake/sys').Sys;
exports.Main = require('jsmake/main').Main;

