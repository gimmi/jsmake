var project = require('jsmake/project');
var task = require('jsmake/task');
var sys = require('jsmake/sys');

var _project = new project.Project('a project', 'default', function () {}, sys.Sys);

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


