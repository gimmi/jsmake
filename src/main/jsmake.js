var project = require('jsmake/project');
var task = require('jsmake/task');
var sys = require('jsmake/sys');

var _project = new project.Project('default', sys.Sys);

exports.task = function (name, tasks, body) {
	_project.addTask(new task.Task(name, tasks, body, sys.Sys));
};
exports.runTask = function (name, args) {
	return _project.runTask(name, args);
};
exports.Utils = require('jsmake/utils').Utils;
exports.Fs = require('jsmake/fs').Fs;
exports.Sys = require('jsmake/sys').Sys;


