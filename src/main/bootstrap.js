(function (args) {
	var main = new Make.Main();
	main.initGlobalScope(this);
	Make.Sys.loadJavascriptFile('build.js');
	main.run(args);
}(arguments));
