Make.Sys = {
	loadJavascriptFile: function (file) {
		load(file);
	},
	isWindowsOs: function () {
		return Make.Fs.getPathSeparator() === '\\';
	},
	runCommand: function (command, opts) {
		return runCommand(command, opts);
	},
	createRunner: function (command) {
		return new Make.CommandRunner(command);
	},
	getEnvVar: function (name, def) {
		return java.lang.System.getenv(name) || def;
	},
	log: function (msg) {
		print(msg);
	}
};
