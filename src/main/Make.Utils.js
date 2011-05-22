Make.Utils = {
	escapeForRegex: function (str) {
		return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	},
	isArray: function (v) {
		return toString.apply(v) === '[object Array]';
	},
	isArguments: function (v) {
		return !!(v && hasOwnProperty.call(v, 'callee'));
	},
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
	isObject : function (v) {
		return !!v && Object.prototype.toString.call(v) === '[object Object]';
	},
	isNumber: function (v) {
		return typeof v === 'number' && isFinite(v);
	},
	isEmpty : function (v) {
		return v === null || v === undefined || ((this.isArray(v) && !v.length));
	},
	trim: function (str) {
		return str.replace(/(?:^\s+)|(?:\s+$)/g, '');
	},
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
	filter: function (items, fn, scope) {
		var ret = [];
		this.each(items, function (item) {
			if (fn.call(scope, item)) {
				ret.push(item);
			}
		}, this);
		return ret;
	},
	map: function (items, fn, scope) {
		var ret = [];
		this.each(items, function (item, key) {
			ret.push(fn.call(scope, item, key, items));
		}, this);
		return ret;
	},
	reduce: function (items, fn, memo, scope) {
		this.each(items, function (item) {
			memo = fn.call(scope, memo, item);
		}, this);
		return memo;
	},
	contains: function (items, item) {
		var ret = false;
		this.each(items, function (it) {
			ret = (it === item);
			return ret;
		}, this);
		return ret;
	},
	distinct: function (items) {
		var ret = [];
		this.each(items, function (item) {
			if (!this.contains(ret, item)) {
				ret.push(item);
			}
		}, this);
		return ret;
	}
};
