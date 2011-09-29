/*global Make, describe, beforeEach, afterEach, expect, it, spyOn */

describe("jsmake.Rhino", function () {
	var target;

	beforeEach(function () {
		target = jsmake.Rhino;
	});
	
	it('should not consider Java strings as Javascript strings', function () {
		expect(jsmake.Utils.isString(new java.lang.String('java string'))).toBe(false);
	});

	it('should convert Java strings to Javascript strings', function () {
		var actual;

		actual = target.translateJavaString(null);
		expect(actual).toBeNull();
		
		actual = target.translateJavaString(undefined);
		expect(actual).toBeUndefined();
		
		actual = target.translateJavaString('js string');
		expect(actual).toBe('js string');
		expect(jsmake.Utils.isString(actual)).toBe(true);
		
		actual = target.translateJavaString(new java.lang.String('java string'));
		expect(actual).toBe('java string');
		expect(jsmake.Utils.isString(actual)).toBe(true);
	});
});
