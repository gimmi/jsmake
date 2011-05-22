JSMAKE_FILES = [
	'src/main/Make.js',
	'src/main/Make.Utils.js',
	'src/main/Make.Project.js',
	'src/main/Make.Task.js',
	'src/main/Make.RecursionChecker.js',
	'src/main/Make.AntPathMatcher.js',
	'src/main/Make.Sys.js',
	'src/main/Make.Fs.js',
	'src/main/Make.FsScanner.js',
	'src/main/Make.Main.js'
];
for(var i = 0; i < JSMAKE_FILES.length; i += 1) {
	load(JSMAKE_FILES[i]);
}
load('tools/JSLint-2011.05.10/jslint.js');

var main = new Make.Main();
main.initGlobalScope(this);

project('jsmake', 'build', function () {
	var sys = Make.Sys;
	var fs = Make.Fs;
	var utils = Make.Utils;
	
	var version = '0.8.1';
	var buildPath = 'build/jsmake-' + version;

	task('jslint', [], function () {
		var files = fs.createScanner('src').include('**/*.js').scan();
		var errors = [];
		utils.each(files, function (file) {
			var content = '/*global Make: true, java, toString */\n' + fs.readFile(file);
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

	task('compile', [ 'jslint' ], function () {
		var content = utils.map(JSMAKE_FILES, function (file) {
			return fs.readFile(file);
		});

		var header = [];
		header.push('/*');
		header.push('JSMake version ' + version);
		header.push('');
		header.push(fs.readFile('LICENSE'));
		header.push('*/');
		content.unshift(header.join('\n'));

		fs.writeFile(fs.combinePath(buildPath, 'jsmake.js'), content.join('\n'));
	});

	task('build', [ 'compile' ], function () {
		utils.each([ 'src/main/bootstrap.js', 'src/main/jsmake.cmd', 'src/main/jsmaked.cmd', 'lib/main/rhino-1.7r2/js.jar' ], function (file) {
			fs.copyFileToDirectory(file, buildPath);
		});
	});

	task('clean', [], function () {
		fs.deletePath(buildPath);
	});
});

main.run(arguments);

