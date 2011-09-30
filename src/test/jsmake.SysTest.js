/*global Make, jasmine, describe, beforeEach, expect, it, xit, toString */

describe("jsmake.Sys", function () {
	var target, jsmake = { Sys: require('jsmake/Sys').Sys };

	beforeEach(function () {
		target = jsmake.Sys;
	});

	it('should evaluate environment variable', function () {
		expect(target._getEnvVar('name', 'val', 'def')).toEqual('val');
		expect(target._getEnvVar('name', '', 'def')).toEqual('');
		expect(target._getEnvVar('name', null, 'def')).toEqual('def');
		expect(target._getEnvVar('name', null, null)).toBeNull();
		expect(target._getEnvVar('name', null, '')).toEqual('');
		expect(function () {
			target._getEnvVar('name', null, undefined);
		}).toThrow('Environment variable "name" not defined.');
	});
});
