jsmake.Rhino = {
	runCommand: function (command, opts) {
		return runCommand(command, opts);
	},
	translateJavaString: function (javaString) {
		if (javaString === null) {
			return null;
		}
		if (javaString === undefined) {
			return undefined;
		}
		return String(javaString);
	}
};