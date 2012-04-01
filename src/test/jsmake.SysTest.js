/*global Make, jasmine, describe, beforeEach, expect, it, xit, toString */

describe("jsmake.Sys", function () {
	var target;

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
	
	describe('run', function () {
		it('should build configuration from simple parameters', function () {
			expect(target._buildRunConfig('COMMAND')).toEqual({
				cmd: 'COMMAND',
				args: [],
				successCodes: [0],
				failOnError: true,
				captureOutput: false
			});

			expect(target._buildRunConfig('COMMAND', 'p1', ['p2', 'p3'])).toEqual({
				cmd: 'COMMAND',
				args: ['p1', 'p2', 'p3'],
				successCodes: [0],
				failOnError: true,
				captureOutput: false
			});
		});
		
		it('should build cmd parameter', function () {
			expect(target._buildRunConfig({}).cmd).toEqual('');
			expect(target._buildRunConfig({ cmd: 'COMMAND' }).cmd).toEqual('COMMAND');
			expect(target._buildRunConfig({ cmd: 123 }).cmd).toEqual('');
		});
		
		it('should build args parameter', function () {
			expect(target._buildRunConfig({}).args).toEqual([]);
			expect(target._buildRunConfig({ args: 'p1' }).args).toEqual(['p1']);
			expect(target._buildRunConfig({ args: ['p1', ['p2', 'p3']] }).args).toEqual(['p1', 'p2', 'p3']);
		});
		
		it('should build successCodes parameter', function () {
			expect(target._buildRunConfig({}).successCodes).toEqual([0]);
			expect(target._buildRunConfig({ successCodes: 3 }).successCodes).toEqual([3]);
			expect(target._buildRunConfig({ successCodes: [1, [2, 3]] }).successCodes).toEqual([1, 2, 3]);
		});
		
		it('should build failOnError parameters', function () {
			expect(target._buildRunConfig({}).failOnError).toEqual(true);
			expect(target._buildRunConfig({ failOnError: false }).failOnError).toEqual(false);
			expect(target._buildRunConfig({ failOnError: 'T' }).failOnError).toEqual(true);
		});
		
		it('should build captureOutput parameters', function () {
			expect(target._buildRunConfig({}).captureOutput).toEqual(false);
			expect(target._buildRunConfig({ captureOutput: true }).captureOutput).toEqual(true);
			expect(target._buildRunConfig({ captureOutput: 0 }).captureOutput).toEqual(false);
		});
	});
});
