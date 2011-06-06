/** @class Various helper methods to make working with Javascript easier */
jsmake.Utils = {
	/**
	 * Return the same string with escaped regex chars, in order to be safely included as part of regex
	 * @param {String} str string to escape
	 * @returns {String} escaped string
	 */
	escapeForRegex: function (str) {
		return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	},
	/**
	 * @param v
	 * @returns {Boolean} true if passed value is an array
	 */
	isArray: function (v) {
		// Check ignored test 'isArray should show strange behavior on Firefox'
		return Object.prototype.toString.apply(v) === '[object Array]';
	},
	/**
	 * @param v
	 * @returns {Boolean} true if passed value is an argument object
	 */
	isArguments: function (v) {
		return !!(v && Object.prototype.hasOwnProperty.call(v, 'callee'));
	},
	/**
	 * @param v
	 * @returns {Array} passed value, converted to array
	 */
	toArray: function (v) {
		if (this.isEmpty(v)) {
			return [];
		} else if (this.isArray(v)) {
			return v;
		} else if (this.isArguments(v)) {
			return Array.prototype.slice.call(v);
		} else {
			return [ v ];
		}
	},
	/**
	 * @param v
	 * @returns {Boolean} true if passed value is an object
	 */
	isObject : function (v) {
		return !!v && Object.prototype.toString.call(v) === '[object Object]';
	},
	/**
	 * @param v
	 * @returns {Boolean} true if passed value is a number
	 */
	isNumber: function (v) {
		return typeof v === 'number' && isFinite(v);
	},
	/**
	 * @param v
	 * @returns {Boolean} true if passed value is null, undefined or empty array
	 */
	isEmpty : function (v) {
		return v === null || v === undefined || ((this.isArray(v) && !v.length));
	},
	/**
	 * @param v
	 * @returns {Boolean} true if passed value is a function
	 */
	isFunction : function (v) {
		return Object.prototype.toString.apply(v) === '[object Function]';
	},
	/**
	 * @param {String} str string to trim
	 * @returns {String} passed value with head and tail spaces removed
	 */
	trim: function (str) {
		return str.replace(/(?:^\s+)|(?:\s+$)/g, '');
	},
	/**
	 * Iterate over each element of items.
	 * @param items the collection on which iterate, can be anything
	 * @param {Function} fn the funcion to call for each element in items.
	 * Will be called with the following parameters: currentItem, itemIndex, items.
	 * If function returns truthy value then iteration will stop
	 * @param {Object} [scope] 'this' binding for function
	 * @example
	 * // Array iteration: the following code logs
	 * // item=a, index=0, items=[a,b]
	 * // item=b, index=1, items=[a,b]
	 * jsmake.Utils.each([ 'a', 'b'], function (item, index, items) {
	 *     jsmake.Sys.log('item=' + item + ', index=' + index + ', items=' + items);
	 * }, this);
	 * // Object iteration: the following code logs
	 * // item=1, index=a, items=[object]
	 * // item=2, index=b, items=[object]
	 * jsmake.Utils.each({ a: 1, b: 2 }, function (item, index, items) {
	 *     jsmake.Sys.log('item=' + item + ', index=' + index + ', items=' + items);
	 * }, this);
	 */
	each: function (items, fn, scope) {
		var key;
		if (this.isObject(items)) {
			for (key in items) {
				if (items.hasOwnProperty(key)) {
					if (fn.call(scope, items[key], key, items)) {
						return;
					}
				}
			}
		} else {
			items = this.toArray(items);
			for (key = 0; key < items.length; key += 1) {
				if (fn.call(scope, items[key], key, items)) {
					return;
				}
			}
		}
	},
	/**
	 * Filter collection, returning elements that satisfy passed criteria
	 * @param items can be anything, see {@link jsmake.Utils.each}
	 * @param {Function} fn filter criteria, will be called for each element in items, passing current element as parameter.
	 * Must return falsy value to indicate that the element should be filtered out
	 * @param {Object} [scope] 'this' binding for function
	 * @returns {Array} filtered values
	 * @example
	 * // returns [ 1, 2 ]
	 * jsmake.Utils.filter([ 1, 2, 3 ], function (item) {
	 *     return item < 3;
	 * });
	 */
	filter: function (items, fn, scope) {
		var ret = [];
		this.each(items, function (item) {
			if (fn.call(scope, item)) {
				ret.push(item);
			}
		}, this);
		return ret;
	},
	/**
	 * Transform each item in passed collection, returning a new array with transformed items
	 * @param items can be anything, see {@link jsmake.Utils.each}
	 * @param {Function} fn transformation function, will be called for each element in items.
	 * Will be called with the following parameters: currentItem, itemIndex, items.
	 * If function returns truthy value then iteration will stop
	 * Must return the transformed item
	 * @param {Object} [scope] 'this' binding for function
	 * @returns {Array} new array with transformed items
	 * @example
	 * // returns [ 4, 9 ]
	 * jsmake.Utils.map([ 2, 3 ], function (item) {
	 *     return item * item;
	 * });
	 */
	map: function (items, fn, scope) {
		var ret = [];
		this.each(items, function (item, key) {
			ret.push(fn.call(scope, item, key, items));
		}, this);
		return ret;
	},
	/**
	 * @example
	 * // returns 'items are: 2 3 '
	 * jsmake.Utils.reduce([ 2, 3 ], function (memo, item) {
	 *     return memo + item + ' ';
	 * }, 'items are: ');
	 */
	reduce: function (items, fn, memo, scope) {
		this.each(items, function (item) {
			memo = fn.call(scope, memo, item);
		}, this);
		return memo;
	},
	/**
	 * @example
	 * jsmake.Utils.contains([ 2, 3 ], 3); // returns true
	 * jsmake.Utils.contains([ 2, 3 ], 4); // returns false
	 */
	contains: function (items, item) {
		var ret = false;
		this.each(items, function (it) {
			ret = (it === item);
			return ret;
		}, this);
		return ret;
	},
	/**
	 * @example
	 * jsmake.Utils.distinct([ 2, 3, 2, 3 ]); // returns [ 2, 3 ]
	 */
	distinct: function (items) {
		var ret = [];
		this.each(items, function (item) {
			if (!this.contains(ret, item)) {
				ret.push(item);
			}
		}, this);
		return ret;
	},
	/**
	 * @example
	 * jsmake.Utils.flatten([ 1, [ 2, 3 ], [ 4, [ 5, 6 ] ] ]); // returns [ 1, 2, 3, 4, 5, 6 ]
	 */
	flatten: function (items) {
		return this.reduce(items, function (memo, item) {
			if (this.isArray(item)) {
				memo = memo.concat(this.flatten(item));
			} else {
				memo.push(item);
			}
			return memo;
		}, [], this);
	}
};
