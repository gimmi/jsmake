/**
 * @class Contains methods for system interaciont and informations
 */
jsmake.Sys = {
	/**
	 * Returns if OS is Windows
	 * @returns true if running on Windows
	 */
	isWindowsOs: function () {
		return jsmake.Fs.getPathSeparator() === '\\';
	},
	/**
	 * @deprecated Use {@link jsmake.Sys.run}
	 */
	createRunner: function (command) {
		return new jsmake.CommandRunner(command);
	},
	/**
	 * Stops execution for the specified amount of seconds
	 */
	wait: function (seconds) {
		this.log('Waiting ' + seconds + ' seconds...');
		java.lang.Thread.sleep(seconds * 1000);
	},
	/**
	 * Run an external program
	 * This method can be called in two ways: 
	 * @example
	 * // Simple call pattern
	 * jsmake.Sys.run('COMMAND_TO_RUN'); // Just invoke the command, throwing error if return code of the command is not 0
	 * jsmake.Sys.run('COMMAND_TO_RUN', 'PARAMETER 1', 'PARAMETER 2', ...); // Same as above, with command line parameters
	 * @example
	 * // Complex call pattern
	 * jsmake.Sys.run({
	 *     cmd: 'COMMAND_TO_RUN', // Same as simple call
	 *     args: [ 'PARAMETER 1', 'PARAMETER 2' ], // (Optional, default to []) Command parameters.
	 *     successCodes: [0, 1, 2], // (Optional, default to [0]) Command exit codes that are considered a succesful execution.
	 *     failOnError: false, // (Optional, default to true) Indicate if an error must be thrown when execution fail.
	 *                         // A command execution is considered failed when the return code is not one of the successCodes.
	 *     captureOutput: true, // (Optional, default to false) Indicate if the output of the commend must be captured and returned to the caller.
	 *                          // Note that if captureOutput=true, the output of the command is not printed to the console during JSMake execution.
	 * });
	 * @return If called with captureOutput=false the return value is just the command return code, otherwise is an object containig the following fields:
	 * 'code' (the command return code), 'out' (the command stdout) and 'err' (the command stderr)
	 */
	run: function () {
		var cfg = this._buildRunConfig.apply(this, arguments),
			options = { args: cfg.args },
			exitCode;
			
		if (cfg.captureOutput) {
			options.output = '';
			options.err = '';
		}

		this.log(cfg.cmd + ' ' + cfg.args.join(' '));
		exitCode = jsmake.Rhino.runCommand(cfg.cmd, options);

		if (cfg.failOnError && !jsmake.Utils.contains(cfg.successCodes, exitCode)) {
			throw 'Command failed with exit status ' + exitCode;
		}

		return cfg.captureOutput ? {
			out: options.output,
			err: options.err,
			code: exitCode
		} : exitCode;
	},
	/**
	 * Returns environment variable value
	 * @param {String} name name of the environment variable
	 * @param {String} [def] default value to return if environment variable not defined.
	 * @returns {String} environment variable value if found, or default value.
	 * @throws {Error} if environment variable is not found and no default value passed.
	 */
	getEnvVar: function (name, def) {
		var val = jsmake.Rhino.translateJavaString(java.lang.System.getenv(name));
		return this._getEnvVar(name, val, def);
	},
	/**
	 * Log message to the console
	 * @param {String} msg the message to log
	 */
	log: function (msg) {
		print(msg);
	},
	_getEnvVar: function (name, val, def) {
		if (val !== null) {
			return val;
		}
		if (def !== undefined) {
			return def;
		}
		throw 'Environment variable "' + name + '" not defined.';
	},
	_buildRunConfig: function () {
		var args = jsmake.Utils.flatten(arguments);

		if (jsmake.Utils.isString(args[0])) {
			args = {
				cmd: args.shift(),
				args: args
			};
		} else {
			args = args[0];
		}
		
		return {
			cmd: jsmake.Utils.isString(args.cmd) ? args.cmd : '',
			args: jsmake.Utils.flatten(args.args),
			successCodes: jsmake.Utils.isEmpty(args.successCodes) ? [0] : jsmake.Utils.flatten(args.successCodes),
			failOnError: jsmake.Utils.isEmpty(args.failOnError) ? true : !!args.failOnError,
			captureOutput: jsmake.Utils.isEmpty(args.captureOutput) ? false : !!args.captureOutput
		};
	}
};
