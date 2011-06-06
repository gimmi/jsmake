var fs = require('./fs');
var commandRunner = require('./commandRunner');

/**
 * @class Contains methods for system interaciont and informations
 */
var Sys = {
	/**
	 * Returns if OS is Windows
	 * @returns true if running on Windows
	 */
	isWindowsOs: function () {
		return fs.Fs.getPathSeparator() === '\\';
	},
	runCommand: function (command, opts) {
		return runCommand(command, opts);
	},
	/**
	 * Create a runner object, used to define and invoke an external program
	 * @param {String} command the path of the command executable
	 * @return {CommandRunner} CommandRunner instance to fluently configure and run command
	 * @see CommandRunner
	 * @example
	 * // runs '/path/to/cmd.exe par1 par2 par3 par4'
	 * Sys.createRunner('/path/to/cmd.exe')
	 *     .args('par1', 'par2')
	 *     .args([ 'par3', 'par4' ])
	 *     .run();
	 */
	createRunner: function (command) {
		return new commandRunner.CommandRunner(command);
	},
	/**
	 * Returns environment variable value
	 * @param {String} name name of the environment variable
	 * @param {String} def default value to return if environment variable not defined
	 * @returns {String} environment variable value or def
	 */
	getEnvVar: function (name, def) {
		return java.lang.System.getenv(name) || def;
	},
	/**
	 * Log message to the console
	 * @param {String} msg the message to log
	 */
	log: function (msg) {
		print(msg);
	}
};

exports.Sys = Sys;