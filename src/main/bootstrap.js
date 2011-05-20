(function (args) {
	var main = new Make.Main();
	main.initGlobalScope(this);
	if (!Make.Sys.fileExists('build.js')) {
		Make.Sys.log('File build.js not found in current directory.');
	} else {
		Make.Sys.loadJavascriptFile('build.js');
		main.run(args);
	}
}(arguments));
