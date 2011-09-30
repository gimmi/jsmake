var Sys = require('./jsmake/Sys').Sys;
var Main = require('./jsmake/Main').Main;

var _main = new Main();
_main.init(exports);
exports.runTask = function (name, args) {
	return _main.runTask(name, args);
};
exports.Utils = require('./jsmake/Utils').Utils;
exports.Fs = require('./jsmake/Fs').Fs;
exports.Sys = require('./jsmake/Sys').Sys;
exports.Xml = require('./jsmake/Xml').Xml;