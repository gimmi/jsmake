Make.Sys = {
	loadJavascriptFile: function (file) {
		load(file);
	},
	isWindowsOs: function () {
		return Make.Fs.getPathSeparator() === '\\';
	},
	runCmd: function (cmd) {
		return runCommand(cmd);
	},
	getEnvVar: function (name, def) {
		return java.lang.System.getenv(name) || def;
	},
	log: function (msg) {
		print(msg);
	}
};
