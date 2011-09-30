var Rhino = {
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

exports.Rhino = Rhino;