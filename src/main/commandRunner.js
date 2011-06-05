var sys = require('./sys');
var utils = require('./utils');

/**
 * Don't instantiate it directly, use {@link Sys.createRunner}
 * @constructor
 */
var CommandRunner = function (command) {
	this._command = command;
	this._arguments = [];
	this._logger = sys.Sys;
};
CommandRunner.prototype = {
	/**
	 * Add all passed arguments. Supports any number of parameters.
	 * @returns {CommandRunner} this instance, for chaining calls
	 * @example
	 * Sys.createRunner('cmd.exe').args('par1', 'par2', [ 'par3', 'par4' ]).run();
	 */
	args: function () {
		this._arguments = this._arguments.concat(utils.Utils.flatten(arguments));
		return this;
	},
	/**
	 * Run configured command. if exitstatus of the command is 0 then execution is considered succesful, otherwise an exception is thrown
	 */
	run: function () {
		this._logger.log(this._command + ' ' + this._arguments.join(' '));
		var exitStatus = sys.Sys.runCommand(this._command, { args: this._arguments });
		if (exitStatus !== 0) {
			throw 'Command failed with exit status ' + exitStatus;
		}
	}
};

exports.CommandRunner = CommandRunner;