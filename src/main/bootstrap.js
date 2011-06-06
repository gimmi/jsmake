var jsmake = require('jsmake');
require('build');
jsmake.runTask(arguments.shift() || 'default', arguments);
