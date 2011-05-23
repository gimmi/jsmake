Make.CommandRunner = function (command) {
	this._command = command;
	this._arguments = [];
	this._logger = Make.Sys;
};
Make.CommandRunner.prototype = {
	args: function () {
		this._arguments = this._arguments.concat(Make.Utils.flatten(arguments));
		return this;
	},
	run: function () {
		this._logger.log(this._command + ' ' + this._arguments.join(' '));
		var exitStatus = Make.Sys.runCommand(this._command, { args: this._arguments });
		if (exitStatus !== 0) {
			throw 'Command failed with exit status ' + exitStatus;
		}
	}
};