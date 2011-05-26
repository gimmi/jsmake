// From http://stackoverflow.com/questions/2261705/how-to-run-a-javascript-function-asynchronously-without-using-settimeout/5767884#5767884
(function (global) {
    var timer = new java.util.Timer();
    var counter = 1; 
    var ids = {};

    global.setTimeout = function (fn, delay) {
        var id = counter++;
        ids[id] = new JavaAdapter(java.util.TimerTask, { run: fn });
        timer.schedule(ids[id], delay);
        return id;
    };

    global.clearTimeout = function (id) {
        ids[id].cancel();
        timer.purge();
        delete ids[id];
    };

    global.setInterval = function (fn, delay) {
        var id = counter++; 
        ids[id] = new JavaAdapter(java.util.TimerTask, { run: fn });
        timer.schedule(ids[id], delay, delay);
        return id;
    };

    global.clearInterval = global.clearTimeout;
})(this);

load('lib/test/jasmine-1.0.2/jasmine.js');

load('src/main/jsmake.js');
load('src/main/jsmake.Utils.js');
load('src/main/jsmake.Sys.js');
load('src/main/jsmake.Fs.js');
load('src/main/jsmake.Project.js');
load('src/main/jsmake.Task.js');
load('src/main/jsmake.RecursionChecker.js');
load('src/main/jsmake.AntPathMatcher.js');
load('src/main/jsmake.FsScanner.js');
load('src/main/jsmake.Main.js');
load('src/main/jsmake.CommandRunner.js');

load('src/test/jsmake.UtilsTest.js');
load('src/test/jsmake.RecursionCheckerTest.js');
load('src/test/jsmake.ProjectTest.js');
load('src/test/jsmake.TaskTest.js');
load('src/test/jsmake.AntPathMatcherTest.js');
load('src/test/jsmake.FsScannerTest.js');
load('src/test/jsmake.MainTest.js');
load('src/test/jsmake.CommandRunnerTest.js');
load('src/test/jsmake.FsTest.js');

jasmine.RhinoReporter = function() {
	this._results = "";
};
jasmine.RhinoReporter.prototype = {
	reportRunnerStarting: function(runner) {
	},
	reportRunnerResults: function(runner) {
		var failedCount = runner.results().failedCount;

		this.log(this._results);
		this.log("Passed: " + runner.results().passedCount);
		this.log("Failed: " + failedCount);
		this.log("Total : " + runner.results().totalCount);

		java.lang.System.exit(failedCount);
	},
	reportSuiteResults: function(suite) {
	},
	reportSpecStarting: function(spec) {
	},
	reportSpecResults: function(spec) {
		var i, specResults = spec.results().getItems();

		if (spec.results().passed()) {
			java.lang.System.out.print(".");
		} else {
			java.lang.System.out.print("F");
			this._results += "FAILED\n";
			this._results += "Suite: " + spec.suite.description + "\n";
			this._results += "Spec : " + spec.description + "\n";
			for (i = 0; i < specResults.length; i += 1) {
				this._results += specResults[i].trace + "\n";
			}
		}
	},
	log: function(str) {
		print(str);
	}
};
jasmine.getEnv().addReporter(new jasmine.RhinoReporter());
jasmine.getEnv().execute();