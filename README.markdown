## JSMake is a simple Javascript build program with capabilities similar to make.

#### JSMake has the following benefits:

 * Let you write build script in Javascript, the most widely used scripting language
 * It is a general purpose build tool, not specific for building Javascript projects
 * It's cross platform, supporting both Windows and *nix environment
 * It's very lightweight, it's meant to be included directly in your project repository so you don't have to do exotic setup just to build your project
 * It only require Java to run, and should work anywhere Java works
 * Thanks to [Rhino](http://www.mozilla.org/rhino/), you get interactive debugging of your build script without installing anything else, just run jsmaked instead of jsmake ([more info](http://www.mozilla.org/rhino/debugger.html))
 * You can include external JS libraries like [JSLint](http://www.jslint.com/), [Underscore.js](http://documentcloud.github.com/underscore/), [XRegExp](http://xregexp.com/), ... and use it to develop your build script
 * You can easly use any Java class or library, thanks to [Rhino interoperability](http://www.mozilla.org/rhino/ScriptingJava.html)

#### Getting started

 * Download latest JSMake package from [here](https://github.com/gimmi/jsmake/archives/master)
 * Extract JSMake in a place you can reach from the commandline
 * Create a file named "build.js" in your project folder
 * Add the following code to build.js

		project('my first jsmake project', 'default task', function () {
			task('default task', [], function () {
				Make.Sys.log('Hello, World!');
			});
		});

 * Save file
 * Open a commandline and go to the directory containing build.js file you just created
 * Run the following command

		path/to/jsmake/jsmake

 * The build should start and 'Hello, World!' should be written to the console

#### License

See [LICENSE file](https://github.com/gimmi/jsmake/raw/master/LICENSE) included with sources