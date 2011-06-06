var task = require('jsmake').task;
var sys = require('jsmake').Sys;
var fs = require('jsmake').Fs;
var utils = require('jsmake').Utils;

load('tools/JSLint-2011.05.10/jslint.js');

var version, versionString, buildPath = 'build/jsmake';

task('default', [ 'release' ], function () {
});

task('init', [], function () {
	version = JSON.parse(fs.readFile('version.json'));
	versionString = version.major + '.' + version.minor + '.' + version.patch;
});

task('release', [ 'build', 'jsdoc' ], function () {
	version.patch += 1;
	fs.writeFile('version.json', JSON.stringify(version));
	fs.zipPath(buildPath, buildPath + '-' + versionString + '.zip');
});

task('jslint', [], function () {
	var files = fs.createScanner('src').include('**/*.js').scan();
	var errors = [];
	utils.each(files, function (file) {
		var content = '/*global jsmake: true, java, require, exports */\n' + fs.readFile(file);
		JSLINT(content, { white: true, onevar: true, undef: true, regexp: true, plusplus: true, bitwise: true, newcap: true, rhino: true });
		utils.each(JSLINT.errors, function (error) {
			if (error) {
				errors.push(file + ':' + error.line + ',' + error.character + ': ' + error.reason);
			}
		});
	});

	if (errors.length) {
		sys.log('JSLint found ' + errors.length + ' errors');
		sys.log(errors.join('\n'));
		throw 'Fatal error, see previous messages.';
	}
});

task('compile', [ 'init', 'jslint' ], function () {
	fs.copyPath('src/main', buildPath);
});

task('test', [ 'compile' ], function () {
	var runner = sys.createRunner('java');
	runner.args('-jar', 'lib/main/rhino-1.7r3/js.jar');
	runner.args('-modules', 'src/main');
	runner.args('specrunner.js');
	var files = fs.createScanner('src/test').include('**/*.js').scan();
	utils.each(files, function (file) {
		runner.args(file);
	});
	runner.run();
});

task('build', [ 'test' ], function () {
	utils.each([ 'src/main/bootstrap.js', 'src/main/jsmake.cmd', 'src/main/jsmaked.cmd', 'lib/main/rhino-1.7r3/js.jar' ], function (file) {
		fs.copyPath(file, buildPath);
	});
});

task('jsdoc', [ 'compile' ], function () {
	var runner = sys.createRunner('java');
	runner.args('-jar', 'tools/jsdoctoolkit-2.4.0/jsrun.jar', 'tools/jsdoctoolkit-2.4.0/app/run.js');
	runner.args('-t=tools/jsdoctoolkit-2.4.0/templates/jsdoc');
	runner.args('-d=' + fs.combinePaths(buildPath, 'jsdoc'));
	var files = fs.createScanner('src/main').include('**/*.js').scan();
	utils.each(files, function (file) {
		runner.args(file);
	});
	runner.run();
	fs.copyPath(fs.combinePaths(buildPath, 'jsdoc'), 'gh-pages/jsdoc');
});

task('clean', [], function () {
	fs.deletePath(buildPath);
});

