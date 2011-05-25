/*global Make, jasmine, describe, beforeEach, expect, it, xit, toString */

describe("jsmake.Utils", function () {
	var target;

	beforeEach(function () {
		target = jsmake.Utils;
	});

	xit('isArray should show strange behavior on Firefox', function () {
		expect(toString.apply([])).toBe('[xpconnect wrapped native prototype]');
		expect(Object.prototype.toString.apply([])).toBe('[object Array]');
	});

	it("isArray", function () {
		expect(target.isArray()).toBe(false);
		expect(target.isArray([])).toBe(true);
		expect(target.isArray({})).toBe(false);
		expect(target.isArray(123)).toBe(false);
		expect(target.isArray('')).toBe(false);
		expect(target.isArray('a string')).toBe(false);
		expect(target.isArray(null)).toBe(false);
		expect(target.isArray(arguments)).toBe(false);
	});
	
	it("isArguments", function () {
		expect(target.isArguments(arguments)).toBe(true);
		expect(target.isArguments([])).toBe(false);
		expect(target.isArguments({})).toBe(false);
		expect(target.isArguments(123)).toBe(false);
		expect(target.isArguments('')).toBe(false);
		expect(target.isArguments('a string')).toBe(false);
		expect(target.isArguments(null)).toBe(false);
	});

	it("isObject", function () {
		expect(target.isObject()).toBe(false);
		expect(target.isObject([])).toBe(false);
		expect(target.isObject({})).toBe(true);
		expect(target.isObject(123)).toBe(false);
		expect(target.isObject('')).toBe(false);
		expect(target.isObject('a string')).toBe(false);
		expect(target.isObject(null)).toBe(false);
		expect(target.isObject(arguments)).toBe(false);
	});
	
	it("isNumber", function () {
		expect(target.isNumber(1)).toBe(true);
		expect(target.isNumber(-1)).toBe(true);
		expect(target.isNumber(0)).toBe(true);
		expect(target.isNumber(undefined)).toBe(false);
		expect(target.isNumber(null)).toBe(false);
		expect(target.isNumber(NaN)).toBe(false);
		expect(target.isNumber(arguments)).toBe(false);
	});

	it('toArray', function () {
		expect(target.toArray()).toEqual([]);
		expect(target.toArray(null)).toEqual([]);
		expect(target.toArray(undefined)).toEqual([]);
		expect(target.toArray([ 1, 2 ])).toEqual([ 1, 2 ]);
		expect(target.toArray(1)).toEqual([ 1 ]);
		expect(target.toArray('str')).toEqual([ 'str' ]);
		expect(target.toArray('')).toEqual([ '' ]);
		(function () {
			expect(target.toArray(arguments)).toEqual([ 1, 2, 3 ]);
		}(1, 2, 3));
	});

	it("trim", function () {
		expect(target.trim(' a ')).toBe('a');
		expect(target.trim('')).toBe('');
	});
	
	describe('each', function () {
		it('should call function whit expected params when iterating object', function () {
			var items, fn, scope;
			items = { a: 1, b: 2 };
			fn = jasmine.createSpy();
			scope = {};

			target.each(items, fn, scope);

			expect(fn).toHaveBeenCalledWith(1, 'a', items);
			expect(fn).toHaveBeenCalledWith(2, 'b', items);
			expect(fn.callCount).toEqual(2);
			expect(fn.mostRecentCall.object).toBe(scope);
		});
		
		it('should call function whit expected params when iterating array', function () {
			var items, fn, scope;
			items = [ 'a', 'b' ];
			fn = jasmine.createSpy();
			scope = {};

			target.each(items, fn, scope);

			expect(fn).toHaveBeenCalledWith('a', 0, items);
			expect(fn).toHaveBeenCalledWith('b', 1, items);
			expect(fn.callCount).toEqual(2);
			expect(fn.mostRecentCall.object).toBe(scope);
		});
		
		it('should stop iterating object when fn return trurhy value', function () {
			var items, fn;
			items = { a: 1, b: 2 };
			fn = jasmine.createSpy().andReturn(true);

			target.each({ a: 1, b: 2 }, fn);

			expect(fn).toHaveBeenCalledWith(1, 'a', items);
			expect(fn.callCount).toEqual(1);
		});
		
		it('should stop iterating array when fn return trurhy value', function () {
			var items, fn;
			items = [ 1, 2 ];
			fn = jasmine.createSpy().andReturn(true);

			target.each(items, fn);

			expect(fn).toHaveBeenCalledWith(1, 0, items);
			expect(fn.callCount).toEqual(1);
		});
		
		it('should just pass parameter when not object or array', function () {
			var fn, scope;
			fn = jasmine.createSpy();
			scope = {};

			target.each(123, fn, scope);

			expect(fn).toHaveBeenCalledWith(123, 0, [ 123 ]);
			expect(fn.callCount).toEqual(1);
			expect(fn.mostRecentCall.object).toBe(scope);
		});
		
		it('should not call fn if null or empty', function () {
			var fn = jasmine.createSpy();
			
			target.each(null, fn);
			target.each(undefined, fn);
			
			expect(fn).not.toHaveBeenCalled();
		});

		it('should work with "arguments" parameter', function () {
			var fn = jasmine.createSpy();

			(function () {
				target.each(arguments, fn);
			}(1, 2, 3));

			expect(fn).toHaveBeenCalledWith(1, 0, jasmine.any(Object));
			expect(fn).toHaveBeenCalledWith(2, 1, jasmine.any(Object));
			expect(fn).toHaveBeenCalledWith(3, 2, jasmine.any(Object));
		});
	});
	
	it('filter', function () {
		var fn, scope, actual;
		fn = jasmine.createSpy();
		fn.andCallFake(function (item) {
			return item % 2;
		});
		scope = {};

		actual = target.filter([ 1, 2, 3, 4 ], fn, scope);

		expect(actual).toEqual([ 1, 3 ]);
		expect(fn.callCount).toEqual(4);
		expect(fn.mostRecentCall.object).toBe(scope);
	});
	
	it('map', function () {
		var fn, scope, actual;
		fn = jasmine.createSpy();
		fn.andCallFake(function (item) {
			return item.toUpperCase();
		});
		scope = {};

		actual = target.map([ 'a', 'b' ], fn, scope);

		expect(actual).toEqual([ 'A', 'B' ]);
		expect(fn.mostRecentCall.object).toBe(scope);
	});
	
	it('contains', function () {
		expect(target.contains([ 1, 2, 3 ], 2)).toBeTruthy();
		expect(target.contains([ 1, 2, 3 ], 4)).toBeFalsy();
		expect(target.contains({ a: 1, b: 2, c: 3 }, 2)).toBeTruthy();
		expect(target.contains({ a: 1, b: 2, c: 3 }, 4)).toBeFalsy();
		expect(target.contains(4, 4)).toBeTruthy();
		expect(target.contains(4, 5)).toBeFalsy();
	});
	
	it('distinct', function () {
		expect(target.distinct([ 1, 1, 2, 3, 2, 3 ])).toEqual([ 1, 2, 3 ]);
		expect(target.distinct(1)).toEqual([ 1 ]);
	});

	it('reduce', function () {
		var fn, scope, actual;
		fn = jasmine.createSpy();
		fn.andCallFake(function (memo, item) {
			return memo + item;
		});
		scope = {};

		actual = target.reduce([ '2', '3', '4' ], fn, '1', scope);

		expect(actual).toEqual('1234');
		expect(fn.callCount).toEqual(3);
		expect(fn.mostRecentCall.object).toBe(scope);
	});

	it('flatten', function () {
		var actual;

		(function () {
			actual = target.flatten(arguments);
		}(1, [ 2, 3 ]));
		expect(actual).toEqual([ 1, 2, 3 ]);

		actual = target.flatten([ 4, 5, 6 ]);
		expect(actual).toEqual([ 4, 5, 6 ]);

		actual = target.flatten([ 1, [ 2, [ 3, 4 ]], 5, 6 ]);
		expect(actual).toEqual([ 1, 2, 3, 4, 5, 6 ]);

		actual = target.flatten();
		expect(actual).toEqual([]);

		actual = target.flatten(null);
		expect(actual).toEqual([]);
	});

	it('escapeForRegex', function () {
		expect(target.escapeForRegex('-')).toEqual('\\-');
		expect(target.escapeForRegex('[')).toEqual('\\[');
		expect(target.escapeForRegex(']')).toEqual('\\]');
		expect(target.escapeForRegex('{')).toEqual('\\{');
		expect(target.escapeForRegex('}')).toEqual('\\}');
		expect(target.escapeForRegex('(')).toEqual('\\(');
		expect(target.escapeForRegex(')')).toEqual('\\)');
		expect(target.escapeForRegex('*')).toEqual('\\*');
		expect(target.escapeForRegex('+')).toEqual('\\+');
		expect(target.escapeForRegex('?')).toEqual('\\?');
		expect(target.escapeForRegex('.')).toEqual('\\.');
		expect(target.escapeForRegex(',')).toEqual('\\,');
		expect(target.escapeForRegex('\\')).toEqual('\\\\');
		expect(target.escapeForRegex('^')).toEqual('\\^');
		expect(target.escapeForRegex('$')).toEqual('\\$');
		expect(target.escapeForRegex('|')).toEqual('\\|');
		expect(target.escapeForRegex(' ')).toEqual('\\ ');
	});
});
