/*global Make, describe, beforeEach, expect, it */

describe("AntPathMatcher", function () {
	var target, AntPathMatcher = require('jsmake/antPathMatcher').AntPathMatcher;

	beforeEach(function () {
		target = new AntPathMatcher('', true);
	});
	
	it('should match patterns without ** wildcard', function () {
		expect(new AntPathMatcher('a', true).match('a')).toBeTruthy();
		expect(new AntPathMatcher('a/b', true).match('a/b')).toBeTruthy();

		expect(new AntPathMatcher('a', true).match('b')).toBeFalsy();
		expect(new AntPathMatcher('a', true).match('a/b')).toBeFalsy();
		expect(new AntPathMatcher('a/b', true).match('a')).toBeFalsy();
		expect(new AntPathMatcher('a/b', true).match('a/b/c')).toBeFalsy();
	});

	it('should match pattern with ** wildcard', function () {
		expect(new AntPathMatcher('**/a', true).match('a')).toBeTruthy();
		expect(new AntPathMatcher('**/b', true).match('a/b')).toBeTruthy();
		expect(new AntPathMatcher('**/c', true).match('a/b/c')).toBeTruthy();
		expect(new AntPathMatcher('a/**/b', true).match('a/b')).toBeTruthy();
		expect(new AntPathMatcher('a/**/c', true).match('a/b/c')).toBeTruthy();
		expect(new AntPathMatcher('a/**/d', true).match('a/b/c/d')).toBeTruthy();
		expect(new AntPathMatcher('a/**/d', true).match('a/b/c/d/d')).toBeTruthy();

		expect(new AntPathMatcher('a/**/c', true).match('a/b')).toBeFalsy();
	});

	it('should tokenize path/pattern', function () {
		expect(target._tokenize('a/b/c')).toEqual([ 'a', 'b', 'c' ]);
		expect(target._tokenize('a\\b\\c')).toEqual([ 'a', 'b', 'c' ]);
		expect(target._tokenize(' a / b / c ')).toEqual([ 'a', 'b', 'c' ]);
		expect(target._tokenize('/a')).toEqual([ 'a' ]);
		expect(target._tokenize(' / a')).toEqual([ 'a' ]);
		expect(target._tokenize('a/')).toEqual([ 'a' ]);
		expect(target._tokenize('a / ')).toEqual([ 'a' ]);
		expect(target._tokenize('a/./b')).toEqual([ 'a', 'b' ]);
	});
	
	it('should throw exception when tokenizing invalid pattern', function () {
		expect(function () {
			target._tokenize('a/**');
		}).toThrow('Invalid ** wildcard at end pattern, use **/* instead');
	});
	
	it('should match token considering wildcards', function () {
		expect(target._matchToken('file', 'file')).toBeTruthy();
		expect(target._matchToken('?', 'f')).toBeTruthy();
		expect(target._matchToken('a?c', 'abc')).toBeTruthy();
		expect(target._matchToken('*', '')).toBeTruthy();
		expect(target._matchToken('*', 'file')).toBeTruthy();
		expect(target._matchToken('*', 'file')).toBeTruthy();
		expect(target._matchToken('f*e', 'file')).toBeTruthy();
		expect(target._matchToken('fil*e', 'file')).toBeTruthy();

		expect(target._matchToken('file', '')).toBeFalsy();
		expect(target._matchToken('file', 'other')).toBeFalsy();
		expect(target._matchToken('?', '')).toBeFalsy();
		expect(target._matchToken('a?c', 'ac')).toBeFalsy();
		expect(target._matchToken('a*c', 'def')).toBeFalsy();
	});
	
	it('pattern should match the whole path', function () {
		expect(target._matchToken('file', 'fileXXX')).toBeFalsy();
		expect(target._matchToken('file', 'XXXfile')).toBeFalsy();
	});

	it('should consider or ignore case', function () {
		expect(new AntPathMatcher('a', false).match('A')).toBeTruthy();
		expect(new AntPathMatcher('a', true).match('A')).toBeFalsy();

	});
	
	it('should match token with special characters', function () {
		expect(target._matchToken('-[]{}()+.,\\^$|# ', '-[]{}()+.,\\^$|# ')).toBeTruthy();
	});
});