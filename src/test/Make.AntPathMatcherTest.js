/*global Make, describe, beforeEach, expect, it */

describe("Make.AntPathMatcher", function () {
	var target;

	beforeEach(function () {
		target = new Make.AntPathMatcher('');
	});
	
	it('should match patterns without ** wildcard', function () {
		expect(new Make.AntPathMatcher('a', 'a')).toBeTruthy();
		expect(new Make.AntPathMatcher('a/b').match('a/b')).toBeTruthy();

		expect(new Make.AntPathMatcher('a').match('b')).toBeFalsy();
		expect(new Make.AntPathMatcher('a').match('a/b')).toBeFalsy();
		expect(new Make.AntPathMatcher('a/b').match('a')).toBeFalsy();
		expect(new Make.AntPathMatcher('a/b').match('a/b/c')).toBeFalsy();
	});
	
	it('should match pattern with ** wildcard', function () {
		expect(new Make.AntPathMatcher('**/a').match('a')).toBeTruthy();
		expect(new Make.AntPathMatcher('**/b').match('a/b')).toBeTruthy();
		expect(new Make.AntPathMatcher('**/c').match('a/b/c')).toBeTruthy();
		expect(new Make.AntPathMatcher('a/**/b').match('a/b')).toBeTruthy();
		expect(new Make.AntPathMatcher('a/**/c').match('a/b/c')).toBeTruthy();
		expect(new Make.AntPathMatcher('a/**/d').match('a/b/c/d')).toBeTruthy();
		expect(new Make.AntPathMatcher('a/**/d').match('a/b/c/d/d')).toBeTruthy();

		expect(new Make.AntPathMatcher('a/**/c').match('a/b')).toBeFalsy();
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
	
	it('should match token with special characters', function () {
		expect(target._matchToken('-[]{}()+.,\\^$|# ', '-[]{}()+.,\\^$|# ')).toBeTruthy();
	});
});