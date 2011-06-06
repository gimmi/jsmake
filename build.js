JSMAKE_FILES = [
	'src/main/jsmake.js',
	'src/main/jsmake.Utils.js',
	'src/main/jsmake.Project.js',
	'src/main/jsmake.Task.js',
	'src/main/jsmake.RecursionChecker.js',
	'src/main/jsmake.AntPathMatcher.js',
	'src/main/jsmake.Sys.js',
	'src/main/jsmake.Fs.js',
	'src/main/jsmake.FsScanner.js',
	'src/main/jsmake.CommandRunner.js',
	'src/main/jsmake.PathZipper.js',
	'src/main/jsmake.Main.js'
];
//for(var i = 0; i < JSMAKE_FILES.length; i += 1) {
//	load(JSMAKE_FILES[i]);
//}

var sys = require('jsmake').Sys;
var fs = require('jsmake').Fs;
var utils = require('jsmake').Utils;
var project = require('jsmake').project;
var task = require('jsmake').task;

load('tools/JSLint-2011.05.10/jslint.js');

//var main = new jsmake.Main();
//main.initGlobalScope(this);

project('jsmake', 'release', function () {
	var version, versionString, buildPath = 'build/jsmake';

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

//		var content = utils.map(JSMAKE_FILES, function (file) {
//			return fs.readFile(file);
//		});
//
//		var header = [];
//		header.push('/*');
//		header.push('JSMake version ' + versionString);
//		header.push('');
//		header.push(fs.readFile('LICENSE'));
//		header.push('*/');
//		content.unshift(header.join('\n'));
//
//		fs.writeFile(fs.combinePaths(buildPath, 'jsmake.js'), content.join('\n'));
	});
	
	task('test', [ 'compile' ], function () {
		var runner = sys.createRunner('java');
		runner.args('-jar', 'lib/main/rhino-1.7r3/js.jar', 'specrunner.js');
		var files = fs.createScanner('src/test').include('**/*.js').scan();
		utils.each(utils.flatten([ fs.combinePaths(buildPath, 'jsmake.js'), files ]), function (file) {
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
		runner.args(fs.combinePaths(buildPath, 'jsmake.js'));
		runner.run();
		fs.copyPath(fs.combinePaths(buildPath, 'jsdoc'), 'gh-pages/jsdoc');
	});

	task('clean', [], function () {
		fs.deletePath(buildPath);
	});
});

//main.getProject().runBody(this);
//main.getProject().runTask(arguments[0], []);

