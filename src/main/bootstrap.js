var jsmake = require('jsmake');
//var main = new jsmake.Main();
//main.initGlobalScope(this);
require('build');
//jsmake.getProject().runBody(this);
jsmake.getProject().runTask(arguments.shift(), arguments);
