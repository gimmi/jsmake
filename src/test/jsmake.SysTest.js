/*global Make, jasmine, describe, beforeEach, expect, it, xit, toString, spyOn */

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
	
	describe('_buildRunConfig', function () {
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
	
	describe('run', function () {
		beforeEach(function () {
			spyOn(jsmake.Rhino, 'runCommand').andReturn(0);
			spyOn(target, '_buildRunConfig');
		});
		
		it('should delegate to _buildRunConfig parameter interpretation', function () {
			target._buildRunConfig.andReturn({});
			
			target.run('p1', 'p2');
			
			expect(target._buildRunConfig).toHaveBeenCalledWith('p1', 'p2');
			expect(target._buildRunConfig.mostRecentCall.object).toBe(target);
		});
		
		it('should pass command and parameters, returning code', function () {
			target._buildRunConfig.andReturn({
				cmd: 'command',
				args: [1, 2, 3]
			});
			
			var actual = target.run();
			
			expect(jsmake.Rhino.runCommand).toHaveBeenCalledWith('command', { args: [1, 2, 3]});
			expect(actual).toBe(0);
		});

		it('should pass output and err when capturing output, and return values to the caller', function () {
			target._buildRunConfig.andReturn({
				cmd: '',
				args: [],
				captureOutput: true				
			});
			
			var actual = target.run();
			
			expect(jsmake.Rhino.runCommand).toHaveBeenCalledWith('', { args: [], output: '', err: ''});
			expect(actual.out).toBe('');
			expect(actual.err).toBe('');
			expect(actual.code).toBe(0);
		});

		it('should throw exception when execution fail and failOnError is set', function () {
			target._buildRunConfig.andReturn({
				cmd: '',
				args: [],
				failOnError: true,
				successCodes: 1
			});
			
			expect(function () {
				target.run();
			}).toThrow('Command failed with exit status 0');
		});

		it('should not throw exception when execution fail and failOnError is not set', function () {
			target._buildRunConfig.andReturn({
				cmd: '',
				args: [],
				failOnError: false,
				successCodes: 1
			});
			
			target.run();
		});
	});
});
