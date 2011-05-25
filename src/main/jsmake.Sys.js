jsmake.Sys = {
	isWindowsOs: function () {
		return jsmake.Fs.getPathSeparator() === '\\';
	},
	runCommand: function (command, opts) {
		return runCommand(command, opts);
	},
	createRunner: function (command) {
		return new jsmake.CommandRunner(command);
	},
	getEnvVar: function (name, def) {
		return java.lang.System.getenv(name) || def;
	},
	log: function (msg) {
		print(msg);
	}
};
