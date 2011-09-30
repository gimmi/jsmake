var jsmake = require('jsmake');
var task = require('jsmake').task;
var runTask = require('jsmake').runTask;

JSMAKE_FILES = [
	'src/main/jsmake.js',
	'src/main/jsmake/Rhino.js',
	'src/main/jsmake/Utils.js',
	'src/main/jsmake/Project.js',
	'src/main/jsmake/Task.js',
	'src/main/jsmake/RecursionChecker.js',
	'src/main/jsmake/AntPathMatcher.js',
	'src/main/jsmake/Sys.js',
	'src/main/jsmake/Fs.js',
	'src/main/jsmake/FsScanner.js',
	'src/main/jsmake/CommandRunner.js',
	'src/main/jsmake/PathZipper.js',
	'src/main/jsmake/Xml.js',
	'src/main/jsmake/Main.js'
];

load('tools/JSLint-2011.05.10/jslint.js');

var sys = jsmake.Sys;
var fs = jsmake.Fs;
var utils = jsmake.Utils;

var version, versionString, buildPath = 'build/jsmake';

task('default', 'release');

task('init', function () {
	version = JSON.parse(fs.readFile('version.json'));
	versionString = version.major + '.' + version.minor + '.' + version.patch;
});

task('release', [ 'build', 'jsdoc' ], function () {
	version.patch += 1;
	fs.writeFile('version.json', JSON.stringify(version));
	fs.zipPath(buildPath, buildPath + '-' + versionString + '.zip');
});

task('jslint', function () {
	var files = fs.createScanner('src').include('**/*.js').scan();
	var errors = [];
	utils.each(files, function (file) {
		var content = '/*global require, exports, java, javax */\n' + fs.readFile(file);
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

task('build', [ 'init', 'jslint' ], function () {
	var header = [
		'/*',
		'JSMake version ' + versionString,
		'',
		fs.readFile('LICENSE'),
		'*/'
	].join('\n');
	fs.copyPath('src/main', buildPath);
	var jsfiles = fs.createScanner(buildPath).include('**/*.js').scan();
	utils.each(jsfiles, function (jsfile) {
		var content = fs.readFile(jsfile);
		fs.writeFile(jsfile, header + '\n' + content);
	});
	fs.copyPath('lib/main/rhino-1.7r3/js.jar', buildPath);
});

task('test', 'build', function () {
	var runner = jsmake.Sys.createRunner('java');
	runner.args('-cp', fs.combinePaths(buildPath, 'js.jar'));
	runner.args('org.mozilla.javascript.tools.shell.Main');
	//runner.args('org.mozilla.javascript.tools.debugger.Main');
	runner.args('-modules', buildPath);
	runner.args('-main', 'specrunner.js', 'specrunner.js'); // See https://github.com/mozilla/rhino/issues/11
	var files = fs.createScanner('src/test').include('**/*.js').scan();
	utils.each(files, function (file) {
		runner.args(file);
	});
	runner.run();
});

task('jsdoc', 'build', function () {
	var runner = jsmake.Sys.createRunner('java');
	runner.args('-jar', 'tools/jsdoctoolkit-2.4.0/jsrun.jar', 'tools/jsdoctoolkit-2.4.0/app/run.js');
	runner.args('-t=tools/jsdoctoolkit-2.4.0/templates/jsdoc');
	runner.args('-d=' + fs.combinePaths(buildPath, 'jsdoc'));
	var jsfiles = fs.createScanner(buildPath).include('**/*.js').scan();
	utils.each(fs.createScanner(buildPath).include('**/*.js').scan(), function (jsfile) {
		runner.args(jsfile);
	});
	runner.run();
	fs.copyPath(fs.combinePaths(buildPath, 'jsdoc'), 'gh-pages/jsdoc');
});

task('clean', function () {
	fs.deletePath(buildPath);
});

