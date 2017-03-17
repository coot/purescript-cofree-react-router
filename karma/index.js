(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],3:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
}).call(this,require('_process'))
},{"_process":1}],4:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":1}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var printWarning = function printWarning(format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function warning(condition, format) {
      if (format === undefined) {
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  })();
}

module.exports = warning;
}).call(this,require('_process'))
},{"./emptyFunction":2,"_process":1}],6:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],7:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */
function unescape(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

var KeyEscapeUtils = {
  escape: escape,
  unescape: unescape
};

module.exports = KeyEscapeUtils;
},{}],8:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function (copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function (a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function (a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fourArgumentPooler = function (a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

var standardReleaser = function (instance) {
  var Klass = this;
  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function (CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler
};

module.exports = PooledClass;
}).call(this,require('_process'))
},{"./reactProdInvariant":29,"_process":1,"fbjs/lib/invariant":4}],9:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactChildren = require('./ReactChildren');
var ReactComponent = require('./ReactComponent');
var ReactPureComponent = require('./ReactPureComponent');
var ReactClass = require('./ReactClass');
var ReactDOMFactories = require('./ReactDOMFactories');
var ReactElement = require('./ReactElement');
var ReactPropTypes = require('./ReactPropTypes');
var ReactVersion = require('./ReactVersion');

var onlyChild = require('./onlyChild');
var warning = require('fbjs/lib/warning');

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var __spread = _assign;

if (process.env.NODE_ENV !== 'production') {
  var warned = false;
  __spread = function () {
    process.env.NODE_ENV !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
    warned = true;
    return _assign.apply(null, arguments);
  };
}

var React = {

  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild
  },

  Component: ReactComponent,
  PureComponent: ReactPureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createFactory: createFactory,
  createMixin: function (mixin) {
    // Currently a noop. Will be used to validate and trace mixins.
    return mixin;
  },

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread
};

module.exports = React;
}).call(this,require('_process'))
},{"./ReactChildren":10,"./ReactClass":11,"./ReactComponent":12,"./ReactDOMFactories":15,"./ReactElement":16,"./ReactElementValidator":18,"./ReactPropTypes":21,"./ReactPureComponent":23,"./ReactVersion":24,"./onlyChild":28,"_process":1,"fbjs/lib/warning":5,"object-assign":6}],10:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var PooledClass = require('./PooledClass');
var ReactElement = require('./ReactElement');

var emptyFunction = require('fbjs/lib/emptyFunction');
var traverseAllChildren = require('./traverseAllChildren');

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var fourArgumentPooler = PooledClass.fourArgumentPooler;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}
ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function () {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement.isValidElement(mappedChild)) {
      mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

function forEachSingleChildDummy(traverseContext, child, name) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray
};

module.exports = ReactChildren;
},{"./PooledClass":8,"./ReactElement":16,"./traverseAllChildren":30,"fbjs/lib/emptyFunction":2}],11:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var ReactComponent = require('./ReactComponent');
var ReactElement = require('./ReactElement');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

/**
 * Policies that describe methods in `ReactClassInterface`.
 */


var injectedMixins = [];

/**
 * Composite components are higher-level components that compose other composite
 * or host components.
 *
 * To create a new type of `ReactClass`, pass a specification of
 * your new class to `React.createClass`. The only requirement of your class
 * specification is that you implement a `render` method.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return <div>Hello World</div>;
 *     }
 *   });
 *
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `render`). See `ReactClassInterface` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will be available on the prototype.
 *
 * @interface ReactClassInterface
 * @internal
 */
var ReactClassInterface = {

  /**
   * An array of Mixin objects to include when defining your component.
   *
   * @type {array}
   * @optional
   */
  mixins: 'DEFINE_MANY',

  /**
   * An object containing properties and methods that should be defined on
   * the component's constructor instead of its prototype (static methods).
   *
   * @type {object}
   * @optional
   */
  statics: 'DEFINE_MANY',

  /**
   * Definition of prop types for this component.
   *
   * @type {object}
   * @optional
   */
  propTypes: 'DEFINE_MANY',

  /**
   * Definition of context types for this component.
   *
   * @type {object}
   * @optional
   */
  contextTypes: 'DEFINE_MANY',

  /**
   * Definition of context types this component sets for its children.
   *
   * @type {object}
   * @optional
   */
  childContextTypes: 'DEFINE_MANY',

  // ==== Definition methods ====

  /**
   * Invoked when the component is mounted. Values in the mapping will be set on
   * `this.props` if that prop is not specified (i.e. using an `in` check).
   *
   * This method is invoked before `getInitialState` and therefore cannot rely
   * on `this.state` or use `this.setState`.
   *
   * @return {object}
   * @optional
   */
  getDefaultProps: 'DEFINE_MANY_MERGED',

  /**
   * Invoked once before the component is mounted. The return value will be used
   * as the initial value of `this.state`.
   *
   *   getInitialState: function() {
   *     return {
   *       isOn: false,
   *       fooBaz: new BazFoo()
   *     }
   *   }
   *
   * @return {object}
   * @optional
   */
  getInitialState: 'DEFINE_MANY_MERGED',

  /**
   * @return {object}
   * @optional
   */
  getChildContext: 'DEFINE_MANY_MERGED',

  /**
   * Uses props from `this.props` and state from `this.state` to render the
   * structure of the component.
   *
   * No guarantees are made about when or how often this method is invoked, so
   * it must not have side effects.
   *
   *   render: function() {
   *     var name = this.props.name;
   *     return <div>Hello, {name}!</div>;
   *   }
   *
   * @return {ReactComponent}
   * @nosideeffects
   * @required
   */
  render: 'DEFINE_ONCE',

  // ==== Delegate methods ====

  /**
   * Invoked when the component is initially created and about to be mounted.
   * This may have side effects, but any external subscriptions or data created
   * by this method must be cleaned up in `componentWillUnmount`.
   *
   * @optional
   */
  componentWillMount: 'DEFINE_MANY',

  /**
   * Invoked when the component has been mounted and has a DOM representation.
   * However, there is no guarantee that the DOM node is in the document.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been mounted (initialized and rendered) for the first time.
   *
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidMount: 'DEFINE_MANY',

  /**
   * Invoked before the component receives new props.
   *
   * Use this as an opportunity to react to a prop transition by updating the
   * state using `this.setState`. Current props are accessed via `this.props`.
   *
   *   componentWillReceiveProps: function(nextProps, nextContext) {
   *     this.setState({
   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
   *     });
   *   }
   *
   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
   * transition may cause a state change, but the opposite is not true. If you
   * need it, you are probably looking for `componentWillUpdate`.
   *
   * @param {object} nextProps
   * @optional
   */
  componentWillReceiveProps: 'DEFINE_MANY',

  /**
   * Invoked while deciding if the component should be updated as a result of
   * receiving new props, state and/or context.
   *
   * Use this as an opportunity to `return false` when you're certain that the
   * transition to the new props/state/context will not require a component
   * update.
   *
   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
   *     return !equal(nextProps, this.props) ||
   *       !equal(nextState, this.state) ||
   *       !equal(nextContext, this.context);
   *   }
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @return {boolean} True if the component should update.
   * @optional
   */
  shouldComponentUpdate: 'DEFINE_ONCE',

  /**
   * Invoked when the component is about to update due to a transition from
   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
   * and `nextContext`.
   *
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * NOTE: You **cannot** use `this.setState()` in this method.
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @param {ReactReconcileTransaction} transaction
   * @optional
   */
  componentWillUpdate: 'DEFINE_MANY',

  /**
   * Invoked when the component's DOM representation has been updated.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been updated.
   *
   * @param {object} prevProps
   * @param {?object} prevState
   * @param {?object} prevContext
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidUpdate: 'DEFINE_MANY',

  /**
   * Invoked when the component is about to be removed from its parent and have
   * its DOM representation destroyed.
   *
   * Use this as an opportunity to deallocate any external resources.
   *
   * NOTE: There is no `componentDidUnmount` since your component will have been
   * destroyed by that point.
   *
   * @optional
   */
  componentWillUnmount: 'DEFINE_MANY',

  // ==== Advanced methods ====

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   * @overridable
   */
  updateComponent: 'OVERRIDE_BASE'

};

/**
 * Mapping from class specification keys to special processing functions.
 *
 * Although these are declared like instance properties in the specification
 * when defining classes using `React.createClass`, they are actually static
 * and are accessible on the constructor instead of the prototype. Despite
 * being static, they must be defined outside of the "statics" key under
 * which all other static methods are defined.
 */
var RESERVED_SPEC_KEYS = {
  displayName: function (Constructor, displayName) {
    Constructor.displayName = displayName;
  },
  mixins: function (Constructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(Constructor, mixins[i]);
      }
    }
  },
  childContextTypes: function (Constructor, childContextTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, childContextTypes, 'childContext');
    }
    Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
  },
  contextTypes: function (Constructor, contextTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, contextTypes, 'context');
    }
    Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
  },
  /**
   * Special case getDefaultProps which should move into statics but requires
   * automatic merging.
   */
  getDefaultProps: function (Constructor, getDefaultProps) {
    if (Constructor.getDefaultProps) {
      Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
    } else {
      Constructor.getDefaultProps = getDefaultProps;
    }
  },
  propTypes: function (Constructor, propTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, propTypes, 'prop');
    }
    Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
  },
  statics: function (Constructor, statics) {
    mixStaticSpecIntoComponent(Constructor, statics);
  },
  autobind: function () {} };

function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      // use a warning instead of an invariant so components
      // don't show up in prod but only in __DEV__
      process.env.NODE_ENV !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
    }
  }
}

function validateMethodOverride(isAlreadyDefined, name) {
  var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactClassMixin.hasOwnProperty(name)) {
    !(specPolicy === 'OVERRIDE_BASE') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant('73', name) : void 0;
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (isAlreadyDefined) {
    !(specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('74', name) : void 0;
  }
}

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building React classes.
 */
function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) {
    if (process.env.NODE_ENV !== 'production') {
      var typeofSpec = typeof spec;
      var isMixinValid = typeofSpec === 'object' && spec !== null;

      process.env.NODE_ENV !== 'production' ? warning(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
    }

    return;
  }

  !(typeof spec !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.') : _prodInvariant('75') : void 0;
  !!ReactElement.isValidElement(spec) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.') : _prodInvariant('76') : void 0;

  var proto = Constructor.prototype;
  var autoBindPairs = proto.__reactAutoBindPairs;

  // By handling mixins before any other properties, we ensure the same
  // chaining order is applied to methods with DEFINE_MANY policy, whether
  // mixins are listed before or after these methods in the spec.
  if (spec.hasOwnProperty(MIXINS_KEY)) {
    RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    if (name === MIXINS_KEY) {
      // We have already handled mixins in a special case above.
      continue;
    }

    var property = spec[name];
    var isAlreadyDefined = proto.hasOwnProperty(name);
    validateMethodOverride(isAlreadyDefined, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](Constructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactClass methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
      var isFunction = typeof property === 'function';
      var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

      if (shouldAutoBind) {
        autoBindPairs.push(name, property);
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactClassInterface[name];

          // These cases should already be caught by validateMethodOverride.
          !(isReactClassMethod && (specPolicy === 'DEFINE_MANY_MERGED' || specPolicy === 'DEFINE_MANY')) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', specPolicy, name) : _prodInvariant('77', specPolicy, name) : void 0;

          // For methods which are defined more than once, call the existing
          // methods before calling the new property, merging if appropriate.
          if (specPolicy === 'DEFINE_MANY_MERGED') {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === 'DEFINE_MANY') {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
          if (process.env.NODE_ENV !== 'production') {
            // Add verbose displayName to the function, which helps when looking
            // at profiling tools.
            if (typeof property === 'function' && spec.displayName) {
              proto[name].displayName = spec.displayName + '_' + name;
            }
          }
        }
      }
    }
  }
}

function mixStaticSpecIntoComponent(Constructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name)) {
      continue;
    }

    var isReserved = name in RESERVED_SPEC_KEYS;
    !!isReserved ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name) : _prodInvariant('78', name) : void 0;

    var isInherited = name in Constructor;
    !!isInherited ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('79', name) : void 0;
    Constructor[name] = property;
  }
}

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeIntoWithNoDuplicateKeys(one, two) {
  !(one && two && typeof one === 'object' && typeof two === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : _prodInvariant('80') : void 0;

  for (var key in two) {
    if (two.hasOwnProperty(key)) {
      !(one[key] === undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', key) : _prodInvariant('81', key) : void 0;
      one[key] = two[key];
    }
  }
  return one;
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    var c = {};
    mergeIntoWithNoDuplicateKeys(c, a);
    mergeIntoWithNoDuplicateKeys(c, b);
    return c;
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

/**
 * Binds a method to the component.
 *
 * @param {object} component Component whose method is going to be bound.
 * @param {function} method Method to be bound.
 * @return {function} The bound method.
 */
function bindAutoBindMethod(component, method) {
  var boundMethod = method.bind(component);
  if (process.env.NODE_ENV !== 'production') {
    boundMethod.__reactBoundContext = component;
    boundMethod.__reactBoundMethod = method;
    boundMethod.__reactBoundArguments = null;
    var componentName = component.constructor.displayName;
    var _bind = boundMethod.bind;
    boundMethod.bind = function (newThis) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // User is trying to bind() an autobound method; we effectively will
      // ignore the value of "this" that the user is trying to use, so
      // let's warn.
      if (newThis !== component && newThis !== null) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
      } else if (!args.length) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
        return boundMethod;
      }
      var reboundMethod = _bind.apply(boundMethod, arguments);
      reboundMethod.__reactBoundContext = component;
      reboundMethod.__reactBoundMethod = method;
      reboundMethod.__reactBoundArguments = args;
      return reboundMethod;
    };
  }
  return boundMethod;
}

/**
 * Binds all auto-bound methods in a component.
 *
 * @param {object} component Component whose method is going to be bound.
 */
function bindAutoBindMethods(component) {
  var pairs = component.__reactAutoBindPairs;
  for (var i = 0; i < pairs.length; i += 2) {
    var autoBindKey = pairs[i];
    var method = pairs[i + 1];
    component[autoBindKey] = bindAutoBindMethod(component, method);
  }
}

/**
 * Add more to the ReactClass base class. These are all legacy features and
 * therefore not already part of the modern ReactComponent.
 */
var ReactClassMixin = {

  /**
   * TODO: This will be deprecated because state should always keep a consistent
   * type signature and the only use case for this, is to avoid that.
   */
  replaceState: function (newState, callback) {
    this.updater.enqueueReplaceState(this, newState);
    if (callback) {
      this.updater.enqueueCallback(this, callback, 'replaceState');
    }
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function () {
    return this.updater.isMounted(this);
  }
};

var ReactClassComponent = function () {};
_assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);

/**
 * Module for creating composite components.
 *
 * @class ReactClass
 */
var ReactClass = {

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  createClass: function (spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function (props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (initialState === undefined && this.getInitialState._isMockFunction) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      !(typeof initialState === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : _prodInvariant('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, spec);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    !Constructor.prototype.render ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createClass(...): Class specification must implement a `render` method.') : _prodInvariant('83') : void 0;

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  },

  injection: {
    injectMixin: function (mixin) {
      injectedMixins.push(mixin);
    }
  }

};

module.exports = ReactClass;
}).call(this,require('_process'))
},{"./ReactComponent":12,"./ReactElement":16,"./ReactNoopUpdateQueue":19,"./ReactPropTypeLocationNames":20,"./reactProdInvariant":29,"_process":1,"fbjs/lib/emptyObject":3,"fbjs/lib/invariant":4,"fbjs/lib/warning":5,"object-assign":6}],12:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var canDefineProperty = require('./canDefineProperty');
var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'forceUpdate');
  }
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
if (process.env.NODE_ENV !== 'production') {
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    if (canDefineProperty) {
      Object.defineProperty(ReactComponent.prototype, methodName, {
        get: function () {
          process.env.NODE_ENV !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
          return undefined;
        }
      });
    }
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

module.exports = ReactComponent;
}).call(this,require('_process'))
},{"./ReactNoopUpdateQueue":19,"./canDefineProperty":25,"./reactProdInvariant":29,"_process":1,"fbjs/lib/emptyObject":3,"fbjs/lib/invariant":4,"fbjs/lib/warning":5}],13:[function(require,module,exports){
(function (process){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var reIsNative = RegExp('^' + funcToString
  // Take an example native function source for comparison
  .call(hasOwnProperty)
  // Strip regex characters so we can use it for regex
  .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  // Remove hasOwnProperty from the template to make it generic
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

var canUseCollections =
// Array.from
typeof Array.from === 'function' &&
// Map
typeof Map === 'function' && isNative(Map) &&
// Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
// Set
typeof Set === 'function' && isNative(Set) &&
// Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

var setItem;
var getItem;
var removeItem;
var getItemIDs;
var addRoot;
var removeRoot;
var getRootIDs;

if (canUseCollections) {
  var itemMap = new Map();
  var rootIDSet = new Set();

  setItem = function (id, item) {
    itemMap.set(id, item);
  };
  getItem = function (id) {
    return itemMap.get(id);
  };
  removeItem = function (id) {
    itemMap['delete'](id);
  };
  getItemIDs = function () {
    return Array.from(itemMap.keys());
  };

  addRoot = function (id) {
    rootIDSet.add(id);
  };
  removeRoot = function (id) {
    rootIDSet['delete'](id);
  };
  getRootIDs = function () {
    return Array.from(rootIDSet.keys());
  };
} else {
  var itemByKey = {};
  var rootByKey = {};

  // Use non-numeric keys to prevent V8 performance issues:
  // https://github.com/facebook/react/pull/7232
  var getKeyFromID = function (id) {
    return '.' + id;
  };
  var getIDFromKey = function (key) {
    return parseInt(key.substr(1), 10);
  };

  setItem = function (id, item) {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  };
  getItem = function (id) {
    var key = getKeyFromID(id);
    return itemByKey[key];
  };
  removeItem = function (id) {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  };
  getItemIDs = function () {
    return Object.keys(itemByKey).map(getIDFromKey);
  };

  addRoot = function (id) {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  };
  removeRoot = function (id) {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  };
  getRootIDs = function () {
    return Object.keys(rootByKey).map(getIDFromKey);
  };
}

var unmountedIDs = [];

function purgeDeep(id) {
  var item = getItem(id);
  if (item) {
    var childIDs = item.childIDs;

    removeItem(id);
    childIDs.forEach(purgeDeep);
  }
}

function describeComponentFrame(name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

function getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName;
  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }
  process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
  return describeComponentFrame(name, element && element._source, ownerName);
}

var ReactComponentTreeHook = {
  onSetChildren: function (id, nextChildIDs) {
    var item = getItem(id);
    !item ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = getItem(nextChildID);
      !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
      !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
      !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
      if (nextChild.parentID == null) {
        nextChild.parentID = id;
        // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent id is missing.
      }
      !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function (id, element, parentID) {
    var item = {
      element: element,
      parentID: parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0
    };
    setItem(id, item);
  },
  onBeforeUpdateComponent: function (id, element) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.element = element;
  },
  onMountComponent: function (id) {
    var item = getItem(id);
    !item ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function (id) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent: function (id) {
    var item = getItem(id);
    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  isMounted: function (id) {
    var item = getItem(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function (topElement) {
    var info = '';
    if (topElement) {
      var name = getDisplayName(topElement);
      var owner = topElement._owner;
      info += describeComponentFrame(name, topElement._source, owner && owner.getName());
    }

    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    info += ReactComponentTreeHook.getStackAddendumByID(id);
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = getItem(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName(element);
  },
  getElement: function (id) {
    var item = getItem(id);
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID: function (id) {
    var item = getItem(id);
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = getItem(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function (id) {
    var item = getItem(id);
    return item ? item.updateCount : 0;
  },


  getRootIDs: getRootIDs,
  getRegisteredIDs: getItemIDs
};

module.exports = ReactComponentTreeHook;
}).call(this,require('_process'))
},{"./ReactCurrentOwner":14,"./reactProdInvariant":29,"_process":1,"fbjs/lib/invariant":4,"fbjs/lib/warning":5}],14:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {

  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null

};

module.exports = ReactCurrentOwner;
},{}],15:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactElement = require('./ReactElement');

/**
 * Create a factory that creates HTML tag elements.
 *
 * @private
 */
var createDOMFactory = ReactElement.createFactory;
if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createDOMFactory = ReactElementValidator.createFactory;
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOMFactories = {
  a: createDOMFactory('a'),
  abbr: createDOMFactory('abbr'),
  address: createDOMFactory('address'),
  area: createDOMFactory('area'),
  article: createDOMFactory('article'),
  aside: createDOMFactory('aside'),
  audio: createDOMFactory('audio'),
  b: createDOMFactory('b'),
  base: createDOMFactory('base'),
  bdi: createDOMFactory('bdi'),
  bdo: createDOMFactory('bdo'),
  big: createDOMFactory('big'),
  blockquote: createDOMFactory('blockquote'),
  body: createDOMFactory('body'),
  br: createDOMFactory('br'),
  button: createDOMFactory('button'),
  canvas: createDOMFactory('canvas'),
  caption: createDOMFactory('caption'),
  cite: createDOMFactory('cite'),
  code: createDOMFactory('code'),
  col: createDOMFactory('col'),
  colgroup: createDOMFactory('colgroup'),
  data: createDOMFactory('data'),
  datalist: createDOMFactory('datalist'),
  dd: createDOMFactory('dd'),
  del: createDOMFactory('del'),
  details: createDOMFactory('details'),
  dfn: createDOMFactory('dfn'),
  dialog: createDOMFactory('dialog'),
  div: createDOMFactory('div'),
  dl: createDOMFactory('dl'),
  dt: createDOMFactory('dt'),
  em: createDOMFactory('em'),
  embed: createDOMFactory('embed'),
  fieldset: createDOMFactory('fieldset'),
  figcaption: createDOMFactory('figcaption'),
  figure: createDOMFactory('figure'),
  footer: createDOMFactory('footer'),
  form: createDOMFactory('form'),
  h1: createDOMFactory('h1'),
  h2: createDOMFactory('h2'),
  h3: createDOMFactory('h3'),
  h4: createDOMFactory('h4'),
  h5: createDOMFactory('h5'),
  h6: createDOMFactory('h6'),
  head: createDOMFactory('head'),
  header: createDOMFactory('header'),
  hgroup: createDOMFactory('hgroup'),
  hr: createDOMFactory('hr'),
  html: createDOMFactory('html'),
  i: createDOMFactory('i'),
  iframe: createDOMFactory('iframe'),
  img: createDOMFactory('img'),
  input: createDOMFactory('input'),
  ins: createDOMFactory('ins'),
  kbd: createDOMFactory('kbd'),
  keygen: createDOMFactory('keygen'),
  label: createDOMFactory('label'),
  legend: createDOMFactory('legend'),
  li: createDOMFactory('li'),
  link: createDOMFactory('link'),
  main: createDOMFactory('main'),
  map: createDOMFactory('map'),
  mark: createDOMFactory('mark'),
  menu: createDOMFactory('menu'),
  menuitem: createDOMFactory('menuitem'),
  meta: createDOMFactory('meta'),
  meter: createDOMFactory('meter'),
  nav: createDOMFactory('nav'),
  noscript: createDOMFactory('noscript'),
  object: createDOMFactory('object'),
  ol: createDOMFactory('ol'),
  optgroup: createDOMFactory('optgroup'),
  option: createDOMFactory('option'),
  output: createDOMFactory('output'),
  p: createDOMFactory('p'),
  param: createDOMFactory('param'),
  picture: createDOMFactory('picture'),
  pre: createDOMFactory('pre'),
  progress: createDOMFactory('progress'),
  q: createDOMFactory('q'),
  rp: createDOMFactory('rp'),
  rt: createDOMFactory('rt'),
  ruby: createDOMFactory('ruby'),
  s: createDOMFactory('s'),
  samp: createDOMFactory('samp'),
  script: createDOMFactory('script'),
  section: createDOMFactory('section'),
  select: createDOMFactory('select'),
  small: createDOMFactory('small'),
  source: createDOMFactory('source'),
  span: createDOMFactory('span'),
  strong: createDOMFactory('strong'),
  style: createDOMFactory('style'),
  sub: createDOMFactory('sub'),
  summary: createDOMFactory('summary'),
  sup: createDOMFactory('sup'),
  table: createDOMFactory('table'),
  tbody: createDOMFactory('tbody'),
  td: createDOMFactory('td'),
  textarea: createDOMFactory('textarea'),
  tfoot: createDOMFactory('tfoot'),
  th: createDOMFactory('th'),
  thead: createDOMFactory('thead'),
  time: createDOMFactory('time'),
  title: createDOMFactory('title'),
  tr: createDOMFactory('tr'),
  track: createDOMFactory('track'),
  u: createDOMFactory('u'),
  ul: createDOMFactory('ul'),
  'var': createDOMFactory('var'),
  video: createDOMFactory('video'),
  wbr: createDOMFactory('wbr'),

  // SVG
  circle: createDOMFactory('circle'),
  clipPath: createDOMFactory('clipPath'),
  defs: createDOMFactory('defs'),
  ellipse: createDOMFactory('ellipse'),
  g: createDOMFactory('g'),
  image: createDOMFactory('image'),
  line: createDOMFactory('line'),
  linearGradient: createDOMFactory('linearGradient'),
  mask: createDOMFactory('mask'),
  path: createDOMFactory('path'),
  pattern: createDOMFactory('pattern'),
  polygon: createDOMFactory('polygon'),
  polyline: createDOMFactory('polyline'),
  radialGradient: createDOMFactory('radialGradient'),
  rect: createDOMFactory('rect'),
  stop: createDOMFactory('stop'),
  svg: createDOMFactory('svg'),
  text: createDOMFactory('text'),
  tspan: createDOMFactory('tspan')
};

module.exports = ReactDOMFactories;
}).call(this,require('_process'))
},{"./ReactElement":16,"./ReactElementValidator":18,"_process":1}],16:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var warning = require('fbjs/lib/warning');
var canDefineProperty = require('./canDefineProperty');
var hasOwnProperty = Object.prototype.hasOwnProperty;

var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown, specialPropRefWarningShown;

function hasValidRef(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  if (process.env.NODE_ENV !== 'production') {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    if (canDefineProperty) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._source = source;
    }
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
 */
ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (process.env.NODE_ENV !== 'production') {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};

/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
 */
ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
 */
ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};

module.exports = ReactElement;
}).call(this,require('_process'))
},{"./ReactCurrentOwner":14,"./ReactElementSymbol":17,"./canDefineProperty":25,"_process":1,"fbjs/lib/warning":5,"object-assign":6}],17:[function(require,module,exports){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.

var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

module.exports = REACT_ELEMENT_TYPE;
},{}],18:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

'use strict';

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactComponentTreeHook = require('./ReactComponentTreeHook');
var ReactElement = require('./ReactElement');

var checkReactTypeSpec = require('./checkReactTypeSpec');

var canDefineProperty = require('./canDefineProperty');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = ReactCurrentOwner.current.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = ' Check the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (memoizer[currentComponentErrorInfo]) {
    return;
  }
  memoizer[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
  }

  process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    // Entry iterators provide implicit keys.
    if (iteratorFn) {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  if (componentClass.propTypes) {
    checkReactTypeSpec(componentClass.propTypes, element.props, 'prop', name, element, null);
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

var ReactElementValidator = {

  createElement: function (type, props, children) {
    var validType = typeof type === 'string' || typeof type === 'function';
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      if (typeof type !== 'function' && typeof type !== 'string') {
        var info = '';
        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + 'it\'s defined in.';
        }
        info += getDeclarationErrorAddendum();
        process.env.NODE_ENV !== 'production' ? warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info) : void 0;
      }
    }

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    validatePropTypes(element);

    return element;
  },

  createFactory: function (type) {
    var validatedFactory = ReactElementValidator.createElement.bind(null, type);
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    if (process.env.NODE_ENV !== 'production') {
      if (canDefineProperty) {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            process.env.NODE_ENV !== 'production' ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
    }

    return validatedFactory;
  },

  cloneElement: function (element, props, children) {
    var newElement = ReactElement.cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

};

module.exports = ReactElementValidator;
}).call(this,require('_process'))
},{"./ReactComponentTreeHook":13,"./ReactCurrentOwner":14,"./ReactElement":16,"./canDefineProperty":25,"./checkReactTypeSpec":26,"./getIteratorFn":27,"_process":1,"fbjs/lib/warning":5}],19:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var warning = require('fbjs/lib/warning');

function warnNoop(publicInstance, callerName) {
  if (process.env.NODE_ENV !== 'production') {
    var constructor = publicInstance.constructor;
    process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {

  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */
  enqueueCallback: function (publicInstance, callback) {},

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState) {
    warnNoop(publicInstance, 'setState');
  }
};

module.exports = ReactNoopUpdateQueue;
}).call(this,require('_process'))
},{"_process":1,"fbjs/lib/warning":5}],20:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactPropTypeLocationNames = {};

if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;
}).call(this,require('_process'))
},{"_process":1}],21:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactElement = require('./ReactElement');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var emptyFunction = require('fbjs/lib/emptyFunction');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *  var MyLink = React.createClass({
 *    propTypes: {
 *      // An optional string or URI prop named "href".
 *      href: function(props, propName, componentName) {
 *        var propValue = props[propName];
 *        if (propValue != null && typeof propValue !== 'string' &&
 *            !(propValue instanceof URI)) {
 *          return new Error(
 *            'Expected a string or an URI for ' + propName + ' in ' +
 *            componentName
 *          );
 *        }
 *      }
 *    },
 *    render: function() {...}
 *  });
 *
 * @internal
 */

var ANONYMOUS = '<<anonymous>>';

var ReactPropTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),
  symbol: createPrimitiveTypeChecker('symbol'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: createElementTypeChecker(),
  instanceOf: createInstanceTypeChecker,
  node: createNodeChecker(),
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker
};

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
/*eslint-disable no-self-compare*/
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}
/*eslint-enable no-self-compare*/

/**
 * We use an Error-like object for backward compatibility as people may call
 * PropTypes directly and inspect their output. However we don't use real
 * Errors anymore. We don't inspect their stack anyway, and creating them
 * is prohibitively expensive if they are created too often, such as what
 * happens in oneOfType() for any type before the one that matched.
 */
function PropTypeError(message) {
  this.message = message;
  this.stack = '';
}
// Make `instanceof Error` still work for returned errors.
PropTypeError.prototype = Error.prototype;

function createChainableTypeChecker(validate) {
  if (process.env.NODE_ENV !== 'production') {
    var manualPropTypeCallCache = {};
  }
  function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
    componentName = componentName || ANONYMOUS;
    propFullName = propFullName || propName;
    if (process.env.NODE_ENV !== 'production') {
      if (secret !== ReactPropTypesSecret && typeof console !== 'undefined') {
        var cacheKey = componentName + ':' + propName;
        if (!manualPropTypeCallCache[cacheKey]) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will not work in production with the next major version. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName) : void 0;
          manualPropTypeCallCache[cacheKey] = true;
        }
      }
    }
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        if (props[propName] === null) {
          return new PropTypeError('The ' + locationName + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
        }
        return new PropTypeError('The ' + locationName + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
      }
      return null;
    } else {
      return validate(props, propName, componentName, location, propFullName);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location, propFullName, secret) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = ReactPropTypeLocationNames[location];
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction.thatReturns(null));
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
    }
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    if (!ReactElement.isValidElement(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName, location, propFullName) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = ReactPropTypeLocationNames[location];
      var expectedClassName = expectedClass.name || ANONYMOUS;
      var actualClassName = getClassName(props[propName]);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (is(propValue, expectedValues[i])) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    var valuesString = JSON.stringify(expectedValues);
    return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
    }
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
  }
  return createChainableTypeChecker(validate);
}

function createNodeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    if (!isNode(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function isNode(propValue) {
  switch (typeof propValue) {
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'boolean':
      return !propValue;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isNode);
      }
      if (propValue === null || ReactElement.isValidElement(propValue)) {
        return true;
      }

      var iteratorFn = getIteratorFn(propValue);
      if (iteratorFn) {
        var iterator = iteratorFn.call(propValue);
        var step;
        if (iteratorFn !== propValue.entries) {
          while (!(step = iterator.next()).done) {
            if (!isNode(step.value)) {
              return false;
            }
          }
        } else {
          // Iterator will provide entry [k,v] tuples rather than values.
          while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
              if (!isNode(entry[1])) {
                return false;
              }
            }
          }
        }
      } else {
        return false;
      }

      return true;
    default:
      return false;
  }
}

function isSymbol(propType, propValue) {
  // Native Symbol.
  if (propType === 'symbol') {
    return true;
  }

  // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
  if (propValue['@@toStringTag'] === 'Symbol') {
    return true;
  }

  // Fallback for non-spec compliant Symbols which are polyfilled.
  if (typeof Symbol === 'function' && propValue instanceof Symbol) {
    return true;
  }

  return false;
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  if (isSymbol(propType, propValue)) {
    return 'symbol';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

// Returns class name of the object, if any.
function getClassName(propValue) {
  if (!propValue.constructor || !propValue.constructor.name) {
    return ANONYMOUS;
  }
  return propValue.constructor.name;
}

module.exports = ReactPropTypes;
}).call(this,require('_process'))
},{"./ReactElement":16,"./ReactPropTypeLocationNames":20,"./ReactPropTypesSecret":22,"./getIteratorFn":27,"_process":1,"fbjs/lib/emptyFunction":2,"fbjs/lib/warning":5}],22:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;
},{}],23:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactComponent = require('./ReactComponent');
var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var emptyObject = require('fbjs/lib/emptyObject');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
ReactPureComponent.prototype = new ComponentDummy();
ReactPureComponent.prototype.constructor = ReactPureComponent;
// Avoid an extra prototype jump for these methods.
_assign(ReactPureComponent.prototype, ReactComponent.prototype);
ReactPureComponent.prototype.isPureReactComponent = true;

module.exports = ReactPureComponent;
},{"./ReactComponent":12,"./ReactNoopUpdateQueue":19,"fbjs/lib/emptyObject":3,"object-assign":6}],24:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

module.exports = '15.4.2';
},{}],25:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var canDefineProperty = false;
if (process.env.NODE_ENV !== 'production') {
  try {
    // $FlowFixMe https://github.com/facebook/flow/issues/285
    Object.defineProperty({}, 'x', { get: function () {} });
    canDefineProperty = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

module.exports = canDefineProperty;
}).call(this,require('_process'))
},{"_process":1}],26:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('./ReactComponentTreeHook');
}

var loggedTypeFailures = {};

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?object} element The React element that is being type-checked
 * @param {?number} debugID The React component instance that is being type-checked
 * @private
 */
function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
  for (var typeSpecName in typeSpecs) {
    if (typeSpecs.hasOwnProperty(typeSpecName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
        error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
      } catch (ex) {
        error = ex;
      }
      process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var componentStackInfo = '';

        if (process.env.NODE_ENV !== 'production') {
          if (!ReactComponentTreeHook) {
            ReactComponentTreeHook = require('./ReactComponentTreeHook');
          }
          if (debugID !== null) {
            componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
          } else if (element !== null) {
            componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
          }
        }

        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
      }
    }
  }
}

module.exports = checkReactTypeSpec;
}).call(this,require('_process'))
},{"./ReactComponentTreeHook":13,"./ReactPropTypeLocationNames":20,"./ReactPropTypesSecret":22,"./reactProdInvariant":29,"_process":1,"fbjs/lib/invariant":4,"fbjs/lib/warning":5}],27:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/* global Symbol */

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */
function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

module.exports = getIteratorFn;
},{}],28:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactElement = require('./ReactElement');

var invariant = require('fbjs/lib/invariant');

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
  return children;
}

module.exports = onlyChild;
}).call(this,require('_process'))
},{"./ReactElement":16,"./reactProdInvariant":29,"_process":1,"fbjs/lib/invariant":4}],29:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
'use strict';

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function reactProdInvariant(code) {
  var argCount = arguments.length - 1;

  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

  var error = new Error(message);
  error.name = 'Invariant Violation';
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

module.exports = reactProdInvariant;
},{}],30:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');
var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var getIteratorFn = require('./getIteratorFn');
var invariant = require('fbjs/lib/invariant');
var KeyEscapeUtils = require('./KeyEscapeUtils');
var warning = require('fbjs/lib/warning');

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * This is inlined from ReactElement since this file is shared between
 * isomorphic and renderers. We could extract this to a
 *
 */

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils.escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          var mapsAsChildrenAddendum = '';
          if (ReactCurrentOwner.current) {
            var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
            if (mapsAsChildrenOwnerName) {
              mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
            }
          }
          process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
          didWarnAboutMaps = true;
        }
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';
      if (process.env.NODE_ENV !== 'production') {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
        if (children._isReactElement) {
          addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
        }
        if (ReactCurrentOwner.current) {
          var name = ReactCurrentOwner.current.getName();
          if (name) {
            addendum += ' Check the render method of `' + name + '`.';
          }
        }
      }
      var childrenString = String(children);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

module.exports = traverseAllChildren;
}).call(this,require('_process'))
},{"./KeyEscapeUtils":7,"./ReactCurrentOwner":14,"./ReactElementSymbol":17,"./getIteratorFn":27,"./reactProdInvariant":29,"_process":1,"fbjs/lib/invariant":4,"fbjs/lib/warning":5}],31:[function(require,module,exports){
'use strict';

module.exports = require('./lib/React');

},{"./lib/React":9}],32:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Functor = require("../Data.Functor");
var Data_Semigroup = require("../Data.Semigroup");
var Alt = function (__superclass_Data$dotFunctor$dotFunctor_0, alt) {
    this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
    this.alt = alt;
};
var altArray = new Alt(function () {
    return Data_Functor.functorArray;
}, Data_Semigroup.append(Data_Semigroup.semigroupArray));
var alt = function (dict) {
    return dict.alt;
};
module.exports = {
    Alt: Alt, 
    alt: alt, 
    altArray: altArray
};

},{"../Data.Functor":127,"../Data.Semigroup":161}],33:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Plus = require("../Control.Plus");
var Data_Functor = require("../Data.Functor");
var Alternative = function (__superclass_Control$dotApplicative$dotApplicative_0, __superclass_Control$dotPlus$dotPlus_1) {
    this["__superclass_Control.Applicative.Applicative_0"] = __superclass_Control$dotApplicative$dotApplicative_0;
    this["__superclass_Control.Plus.Plus_1"] = __superclass_Control$dotPlus$dotPlus_1;
};
var alternativeArray = new Alternative(function () {
    return Control_Applicative.applicativeArray;
}, function () {
    return Control_Plus.plusArray;
});
module.exports = {
    Alternative: Alternative, 
    alternativeArray: alternativeArray
};

},{"../Control.Alt":32,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Plus":87,"../Data.Functor":127}],34:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Apply = require("../Control.Apply");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
var Applicative = function (__superclass_Control$dotApply$dotApply_0, pure) {
    this["__superclass_Control.Apply.Apply_0"] = __superclass_Control$dotApply$dotApply_0;
    this.pure = pure;
};
var pure = function (dict) {
    return dict.pure;
};
var unless = function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (!v) {
                return v1;
            };
            if (v) {
                return pure(dictApplicative)(Data_Unit.unit);
            };
            throw new Error("Failed pattern match at Control.Applicative line 63, column 1 - line 63, column 19: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};
var when = function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (v) {
                return v1;
            };
            if (!v) {
                return pure(dictApplicative)(Data_Unit.unit);
            };
            throw new Error("Failed pattern match at Control.Applicative line 58, column 1 - line 58, column 16: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};
var liftA1 = function (dictApplicative) {
    return function (f) {
        return function (a) {
            return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(pure(dictApplicative)(f))(a);
        };
    };
};
var applicativeFn = new Applicative(function () {
    return Control_Apply.applyFn;
}, function (x) {
    return function (v) {
        return x;
    };
});
var applicativeArray = new Applicative(function () {
    return Control_Apply.applyArray;
}, function (x) {
    return [ x ];
});
module.exports = {
    Applicative: Applicative, 
    liftA1: liftA1, 
    pure: pure, 
    unless: unless, 
    when: when, 
    applicativeFn: applicativeFn, 
    applicativeArray: applicativeArray
};

},{"../Control.Apply":36,"../Data.Functor":127,"../Data.Unit":183}],35:[function(require,module,exports){
"use strict";

exports.arrayApply = function (fs) {
  return function (xs) {
    var result = [];
    var n = 0;
    for (var i = 0, l = fs.length; i < l; i++) {
      for (var j = 0, k = xs.length; j < k; j++) {
        result[n++] = fs[i](xs[j]);
      }
    }
    return result;
  };
};

},{}],36:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Functor = require("../Data.Functor");
var Data_Function = require("../Data.Function");
var Control_Category = require("../Control.Category");
var Apply = function (__superclass_Data$dotFunctor$dotFunctor_0, apply) {
    this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
    this.apply = apply;
};
var applyFn = new Apply(function () {
    return Data_Functor.functorFn;
}, function (f) {
    return function (g) {
        return function (x) {
            return f(x)(g(x));
        };
    };
});
var applyArray = new Apply(function () {
    return Data_Functor.functorArray;
}, $foreign.arrayApply);
var apply = function (dict) {
    return dict.apply;
};
var applyFirst = function (dictApply) {
    return function (a) {
        return function (b) {
            return apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(Data_Function["const"])(a))(b);
        };
    };
};
var applySecond = function (dictApply) {
    return function (a) {
        return function (b) {
            return apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(Data_Function["const"](Control_Category.id(Control_Category.categoryFn)))(a))(b);
        };
    };
};
var lift2 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(f)(a))(b);
            };
        };
    };
};
var lift3 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(f)(a))(b))(c);
                };
            };
        };
    };
};
var lift4 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        return apply(dictApply)(apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(f)(a))(b))(c))(d);
                    };
                };
            };
        };
    };
};
var lift5 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        return function (e) {
                            return apply(dictApply)(apply(dictApply)(apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(f)(a))(b))(c))(d))(e);
                        };
                    };
                };
            };
        };
    };
};
module.exports = {
    Apply: Apply, 
    apply: apply, 
    applyFirst: applyFirst, 
    applySecond: applySecond, 
    lift2: lift2, 
    lift3: lift3, 
    lift4: lift4, 
    lift5: lift5, 
    applyFn: applyFn, 
    applyArray: applyArray
};

},{"../Control.Category":41,"../Data.Function":121,"../Data.Functor":127,"./foreign":35}],37:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Biapply = require("../Control.Biapply");
var Biapplicative = function (__superclass_Control$dotBiapply$dotBiapply_0, bipure) {
    this["__superclass_Control.Biapply.Biapply_0"] = __superclass_Control$dotBiapply$dotBiapply_0;
    this.bipure = bipure;
};
var bipure = function (dict) {
    return dict.bipure;
};
module.exports = {
    Biapplicative: Biapplicative, 
    bipure: bipure
};

},{"../Control.Biapply":38}],38:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Function = require("../Data.Function");
var Data_Bifunctor = require("../Data.Bifunctor");
var Control_Category = require("../Control.Category");
var Biapply = function (__superclass_Data$dotBifunctor$dotBifunctor_0, biapply) {
    this["__superclass_Data.Bifunctor.Bifunctor_0"] = __superclass_Data$dotBifunctor$dotBifunctor_0;
    this.biapply = biapply;
};
var biapply = function (dict) {
    return dict.biapply;
};
var biapplyFirst = function (dictBiapply) {
    return function (a) {
        return function (b) {
            return biapply(dictBiapply)(Control_Category.id(Control_Category.categoryFn)(Data_Bifunctor.bimap(dictBiapply["__superclass_Data.Bifunctor.Bifunctor_0"]())(Data_Function["const"](Control_Category.id(Control_Category.categoryFn)))(Data_Function["const"](Control_Category.id(Control_Category.categoryFn))))(a))(b);
        };
    };
};
var biapplySecond = function (dictBiapply) {
    return function (a) {
        return function (b) {
            return biapply(dictBiapply)(Control_Category.id(Control_Category.categoryFn)(Data_Bifunctor.bimap(dictBiapply["__superclass_Data.Bifunctor.Bifunctor_0"]())(Data_Function["const"])(Data_Function["const"]))(a))(b);
        };
    };
};
var bilift2 = function (dictBiapply) {
    return function (f) {
        return function (g) {
            return function (a) {
                return function (b) {
                    return biapply(dictBiapply)(Control_Category.id(Control_Category.categoryFn)(Data_Bifunctor.bimap(dictBiapply["__superclass_Data.Bifunctor.Bifunctor_0"]())(f)(g))(a))(b);
                };
            };
        };
    };
};
var bilift3 = function (dictBiapply) {
    return function (f) {
        return function (g) {
            return function (a) {
                return function (b) {
                    return function (c) {
                        return biapply(dictBiapply)(biapply(dictBiapply)(Control_Category.id(Control_Category.categoryFn)(Data_Bifunctor.bimap(dictBiapply["__superclass_Data.Bifunctor.Bifunctor_0"]())(f)(g))(a))(b))(c);
                    };
                };
            };
        };
    };
};
module.exports = {
    Biapply: Biapply, 
    biapply: biapply, 
    biapplyFirst: biapplyFirst, 
    biapplySecond: biapplySecond, 
    bilift2: bilift2, 
    bilift3: bilift3
};

},{"../Control.Category":41,"../Data.Bifunctor":100,"../Data.Function":121}],39:[function(require,module,exports){
"use strict";

exports.arrayBind = function (arr) {
  return function (f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

},{}],40:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Category = require("../Control.Category");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
var Bind = function (__superclass_Control$dotApply$dotApply_0, bind) {
    this["__superclass_Control.Apply.Apply_0"] = __superclass_Control$dotApply$dotApply_0;
    this.bind = bind;
};
var Discard = function (discard) {
    this.discard = discard;
};
var discard = function (dict) {
    return dict.discard;
};
var bindFn = new Bind(function () {
    return Control_Apply.applyFn;
}, function (m) {
    return function (f) {
        return function (x) {
            return f(m(x))(x);
        };
    };
});
var bindArray = new Bind(function () {
    return Control_Apply.applyArray;
}, $foreign.arrayBind);
var bind = function (dict) {
    return dict.bind;
};
var bindFlipped = function (dictBind) {
    return Data_Function.flip(bind(dictBind));
};
var composeKleisliFlipped = function (dictBind) {
    return function (f) {
        return function (g) {
            return function (a) {
                return bindFlipped(dictBind)(f)(g(a));
            };
        };
    };
};
var composeKleisli = function (dictBind) {
    return function (f) {
        return function (g) {
            return function (a) {
                return bind(dictBind)(f(a))(g);
            };
        };
    };
};
var discardUnit = new Discard(function (dictBind) {
    return bind(dictBind);
});
var ifM = function (dictBind) {
    return function (cond) {
        return function (t) {
            return function (f) {
                return bind(dictBind)(cond)(function (cond$prime) {
                    if (cond$prime) {
                        return t;
                    };
                    if (!cond$prime) {
                        return f;
                    };
                    throw new Error("Failed pattern match at Control.Bind line 116, column 35 - line 116, column 56: " + [ cond$prime.constructor.name ]);
                });
            };
        };
    };
};
var join = function (dictBind) {
    return function (m) {
        return bind(dictBind)(m)(Control_Category.id(Control_Category.categoryFn));
    };
};
module.exports = {
    Bind: Bind, 
    Discard: Discard, 
    bind: bind, 
    bindFlipped: bindFlipped, 
    composeKleisli: composeKleisli, 
    composeKleisliFlipped: composeKleisliFlipped, 
    discard: discard, 
    ifM: ifM, 
    join: join, 
    bindFn: bindFn, 
    bindArray: bindArray, 
    discardUnit: discardUnit
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Category":41,"../Data.Function":121,"../Data.Functor":127,"../Data.Unit":183,"./foreign":39}],41:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Category = function (__superclass_Control$dotSemigroupoid$dotSemigroupoid_0, id) {
    this["__superclass_Control.Semigroupoid.Semigroupoid_0"] = __superclass_Control$dotSemigroupoid$dotSemigroupoid_0;
    this.id = id;
};
var id = function (dict) {
    return dict.id;
};
var categoryFn = new Category(function () {
    return Control_Semigroupoid.semigroupoidFn;
}, function (x) {
    return x;
});
module.exports = {
    Category: Category, 
    id: id, 
    categoryFn: categoryFn
};

},{"../Control.Semigroupoid":88}],42:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Free = require("../Control.Monad.Free");
var Control_Alternative = require("../Control.Alternative");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_Monad_State = require("../Control.Monad.State");
var Data_Foldable = require("../Data.Foldable");
var Data_Lazy = require("../Data.Lazy");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Functor = require("../Data.Functor");
var Data_Function = require("../Data.Function");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Category = require("../Control.Category");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Plus = require("../Control.Plus");
var Control_Bind = require("../Control.Bind");
var Control_Alt = require("../Control.Alt");
var Control_Monad = require("../Control.Monad");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Control_Monad_State_Trans = require("../Control.Monad.State.Trans");
var Data_Identity = require("../Data.Identity");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Cofree = (function () {
    function Cofree(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Cofree.create = function (value0) {
        return function (value1) {
            return new Cofree(value0, value1);
        };
    };
    return Cofree;
})();
var unfoldCofree = function (dictFunctor) {
    return function (s) {
        return function (e) {
            return function (n) {
                return new Cofree(e(s), Data_Lazy.defer(function (v) {
                    return Data_Functor.map(dictFunctor)(function (s1) {
                        return unfoldCofree(dictFunctor)(s1)(e)(n);
                    })(n(s));
                }));
            };
        };
    };
};
var tail = function (v) {
    return Data_Lazy.force(v.value1);
};
var mkCofree = function (a) {
    return function (t) {
        return new Cofree(a, Data_Lazy.defer(function (v) {
            return t;
        }));
    };
};
var head = function (v) {
    return v.value0;
};
var hoistCofree = function (dictFunctor) {
    return function (nat) {
        return function (cf) {
            return mkCofree(head(cf))(nat(Data_Functor.map(dictFunctor)(hoistCofree(dictFunctor)(nat))(tail(cf))));
        };
    };
};
var foldableCofree = function (dictFoldable) {
    return new Data_Foldable.Foldable(function (dictMonoid) {
        return function (f) {
            var go = function (fa) {
                return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(f(head(fa)))(Data_Foldable.foldMap(dictFoldable)(dictMonoid)(go)(tail(fa)));
            };
            return go;
        };
    }, function (f) {
        var go = function (b) {
            return function (fa) {
                return Data_Foldable.foldl(dictFoldable)(go)(f(b)(head(fa)))(tail(fa));
            };
        };
        return go;
    }, function (f) {
        var go = function (fa) {
            return function (b) {
                return f(head(fa))(Data_Foldable.foldr(dictFoldable)(go)(b)(tail(fa)));
            };
        };
        return Data_Function.flip(go);
    });
};
var eqCofree = function (dictEq) {
    return function (dictEq1) {
        return new Data_Eq.Eq(function (x) {
            return function (y) {
                return Data_Eq.eq(dictEq1)(head(x))(head(y)) && Data_Eq.eq(dictEq)(tail(x))(tail(y));
            };
        });
    };
};
var ordCofree = function (dictOrd) {
    return function (dictOrd1) {
        return new Data_Ord.Ord(function () {
            return eqCofree(dictOrd["__superclass_Data.Eq.Eq_0"]())(dictOrd1["__superclass_Data.Eq.Eq_0"]());
        }, function (x) {
            return function (y) {
                var $34 = Data_Ord.compare(dictOrd1)(head(x))(head(y));
                if ($34 instanceof Data_Ordering.EQ) {
                    return Data_Ord.compare(dictOrd)(tail(x))(tail(y));
                };
                return $34;
            };
        });
    };
};
var _tail = function (v) {
    return v.value1;
};
var _lift = function (dictFunctor) {
    return function ($41) {
        return Data_Functor.map(Data_Lazy.functorLazy)(Data_Functor.map(dictFunctor)($41));
    };
};
var functorCofree = function (dictFunctor) {
    return new Data_Functor.Functor(function (f) {
        var loop = function (fa) {
            return new Cofree(f(head(fa)), _lift(dictFunctor)(loop)(_tail(fa)));
        };
        return loop;
    });
};
var applyCofree = function (dictApply) {
    return new Control_Apply.Apply(function () {
        return functorCofree(dictApply["__superclass_Data.Functor.Functor_0"]());
    }, function (f) {
        return function (x) {
            var t = Control_Apply.apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(Control_Apply.apply(applyCofree(dictApply)))(tail(f)))(tail(x));
            var h = head(f)(head(x));
            return mkCofree(h)(t);
        };
    });
};
var applicativeCofree = function (dictAlternative) {
    return new Control_Applicative.Applicative(function () {
        return applyCofree((dictAlternative["__superclass_Control.Applicative.Applicative_0"]())["__superclass_Control.Apply.Apply_0"]());
    }, function (a) {
        return mkCofree(a)(Control_Plus.empty(dictAlternative["__superclass_Control.Plus.Plus_1"]()));
    });
};
var bindCofree = function (dictAlternative) {
    return new Control_Bind.Bind(function () {
        return applyCofree((dictAlternative["__superclass_Control.Applicative.Applicative_0"]())["__superclass_Control.Apply.Apply_0"]());
    }, function (fa) {
        return function (f) {
            var loop = function (fa$prime) {
                var fh = f(head(fa$prime));
                return mkCofree(head(fh))(Control_Alt.alt((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())(tail(fh))(Data_Functor.map(((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())["__superclass_Data.Functor.Functor_0"]())(loop)(tail(fa$prime))));
            };
            return loop(fa);
        };
    });
};
var monadCofree = function (dictAlternative) {
    return new Control_Monad.Monad(function () {
        return applicativeCofree(dictAlternative);
    }, function () {
        return bindCofree(dictAlternative);
    });
};
var extendCofree = function (dictFunctor) {
    return new Control_Extend.Extend(function () {
        return functorCofree(dictFunctor);
    }, function (f) {
        var loop = function (fa) {
            return new Cofree(f(fa), _lift(dictFunctor)(loop)(_tail(fa)));
        };
        return loop;
    });
};
var comonadCofree = function (dictFunctor) {
    return new Control_Comonad.Comonad(function () {
        return extendCofree(dictFunctor);
    }, head);
};
var explore = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (pair) {
            return function (m) {
                return function (w) {
                    var step = function (ff) {
                        return Control_Monad_State_Class.state(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))(function (cof) {
                            return pair(Data_Functor.map(dictFunctor)(Data_Tuple.Tuple.create)(ff))(tail(cof));
                        });
                    };
                    var $38 = Control_Monad_State.runState(Control_Monad_Free.runFreeM(dictFunctor)(Control_Monad_State_Trans.monadRecStateT(Control_Monad_Rec_Class.monadRecIdentity))(step)(m))(w);
                    return $38.value0(Control_Comonad.extract(comonadCofree(dictFunctor1))($38.value1));
                };
            };
        };
    };
};
var traversableCofree = function (dictTraversable) {
    return new Data_Traversable.Traversable(function () {
        return foldableCofree(dictTraversable["__superclass_Data.Foldable.Foldable_1"]());
    }, function () {
        return functorCofree(dictTraversable["__superclass_Data.Functor.Functor_0"]());
    }, function (dictApplicative) {
        return Data_Traversable.traverse(traversableCofree(dictTraversable))(dictApplicative)(Control_Category.id(Control_Category.categoryFn));
    }, function (dictApplicative) {
        return function (f) {
            var loop = function (ta) {
                return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(mkCofree)(f(head(ta))))(Data_Traversable.traverse(dictTraversable)(dictApplicative)(loop)(tail(ta)));
            };
            return loop;
        };
    });
};
module.exports = {
    explore: explore, 
    head: head, 
    hoistCofree: hoistCofree, 
    mkCofree: mkCofree, 
    tail: tail, 
    unfoldCofree: unfoldCofree, 
    eqCofree: eqCofree, 
    ordCofree: ordCofree, 
    functorCofree: functorCofree, 
    foldableCofree: foldableCofree, 
    traversableCofree: traversableCofree, 
    extendCofree: extendCofree, 
    comonadCofree: comonadCofree, 
    applyCofree: applyCofree, 
    applicativeCofree: applicativeCofree, 
    bindCofree: bindCofree, 
    monadCofree: monadCofree
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Monad":82,"../Control.Monad.Free":69,"../Control.Monad.Rec.Class":73,"../Control.Monad.State":78,"../Control.Monad.State.Class":76,"../Control.Monad.State.Trans":77,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Identity":132,"../Data.Lazy":135,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Semigroup":161,"../Data.Traversable":178,"../Data.Tuple":179,"../Prelude":196}],43:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Extend = require("../Control.Extend");
var Data_Functor = require("../Data.Functor");
var Comonad = function (__superclass_Control$dotExtend$dotExtend_0, extract) {
    this["__superclass_Control.Extend.Extend_0"] = __superclass_Control$dotExtend$dotExtend_0;
    this.extract = extract;
};
var extract = function (dict) {
    return dict.extract;
};
module.exports = {
    Comonad: Comonad, 
    extract: extract
};

},{"../Control.Extend":44,"../Data.Functor":127}],44:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Category = require("../Control.Category");
var Data_Functor = require("../Data.Functor");
var Data_Semigroup = require("../Data.Semigroup");
var Extend = function (__superclass_Data$dotFunctor$dotFunctor_0, extend) {
    this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
    this.extend = extend;
};
var extendFn = function (dictSemigroup) {
    return new Extend(function () {
        return Data_Functor.functorFn;
    }, function (f) {
        return function (g) {
            return function (w) {
                return f(function (w$prime) {
                    return g(Data_Semigroup.append(dictSemigroup)(w)(w$prime));
                });
            };
        };
    });
};
var extend = function (dict) {
    return dict.extend;
};
var extendFlipped = function (dictExtend) {
    return function (w) {
        return function (f) {
            return extend(dictExtend)(f)(w);
        };
    };
};
var duplicate = function (dictExtend) {
    return extend(dictExtend)(Control_Category.id(Control_Category.categoryFn));
};
var composeCoKleisliFlipped = function (dictExtend) {
    return function (f) {
        return function (g) {
            return function (w) {
                return f(extend(dictExtend)(g)(w));
            };
        };
    };
};
var composeCoKleisli = function (dictExtend) {
    return function (f) {
        return function (g) {
            return function (w) {
                return g(extend(dictExtend)(f)(w));
            };
        };
    };
};
module.exports = {
    Extend: Extend, 
    composeCoKleisli: composeCoKleisli, 
    composeCoKleisliFlipped: composeCoKleisliFlipped, 
    duplicate: duplicate, 
    extend: extend, 
    extendFlipped: extendFlipped, 
    extendFn: extendFn
};

},{"../Control.Category":41,"../Data.Functor":127,"../Data.Semigroup":161}],45:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Unit = require("../Data.Unit");
var Lazy = function (defer) {
    this.defer = defer;
};
var defer = function (dict) {
    return dict.defer;
};
var fix = function (dictLazy) {
    return function (f) {
        return defer(dictLazy)(function (v) {
            return f(fix(dictLazy)(f));
        });
    };
};
module.exports = {
    Lazy: Lazy, 
    defer: defer, 
    fix: fix
};

},{"../Data.Unit":183}],46:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Aff_Internal = require("../Control.Monad.Aff.Internal");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Data_Function_Uncurried = require("../Data.Function.Uncurried");
var Unsafe_Coerce = require("../Unsafe.Coerce");
var Data_Function = require("../Data.Function");
var Control_Bind = require("../Control.Bind");
var Control_Applicative = require("../Control.Applicative");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var fromAVBox = Unsafe_Coerce.unsafeCoerce;
var killVar = function (q) {
    return function (e) {
        return fromAVBox(Control_Monad_Aff_Internal._killVar(Control_Monad_Aff.nonCanceler, q, e));
    };
};
var makeVar = fromAVBox(Control_Monad_Aff_Internal._makeVar(Control_Monad_Aff.nonCanceler));
var peekVar = function (q) {
    return fromAVBox(Control_Monad_Aff_Internal._peekVar(Control_Monad_Aff.nonCanceler, q));
};
var putVar = function (q) {
    return function (a) {
        return fromAVBox(Control_Monad_Aff_Internal._putVar(Control_Monad_Aff.nonCanceler, q, a));
    };
};
var makeVar$prime = function (a) {
    return Control_Bind.bind(Control_Monad_Aff.bindAff)(makeVar)(function (v) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(putVar(v)(a))(function () {
            return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v);
        });
    });
};
var takeVar = function (q) {
    return fromAVBox(Control_Monad_Aff_Internal._takeVar(Control_Monad_Aff.nonCanceler, q));
};
var modifyVar = function (f) {
    return function (v) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(takeVar(v))(function ($2) {
            return putVar(v)(f($2));
        });
    };
};
module.exports = {
    killVar: killVar, 
    makeVar: makeVar, 
    "makeVar'": makeVar$prime, 
    modifyVar: modifyVar, 
    peekVar: peekVar, 
    putVar: putVar, 
    takeVar: takeVar
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Aff":51,"../Control.Monad.Aff.Internal":49,"../Control.Monad.Eff.Exception":58,"../Control.Semigroupoid":88,"../Data.Function":121,"../Data.Function.Uncurried":120,"../Prelude":196,"../Unsafe.Coerce":223}],47:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Eff_Console = require("../Control.Monad.Eff.Console");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var warnShow = function (dictShow) {
    return function ($4) {
        return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.warnShow(dictShow)($4));
    };
};
var warn = function ($5) {
    return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.warn($5));
};
var logShow = function (dictShow) {
    return function ($6) {
        return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.logShow(dictShow)($6));
    };
};
var log = function ($7) {
    return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.log($7));
};
var infoShow = function (dictShow) {
    return function ($8) {
        return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.infoShow(dictShow)($8));
    };
};
var info = function ($9) {
    return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.info($9));
};
var errorShow = function (dictShow) {
    return function ($10) {
        return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.errorShow(dictShow)($10));
    };
};
var error = function ($11) {
    return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.error($11));
};
module.exports = {
    error: error, 
    errorShow: errorShow, 
    info: info, 
    infoShow: infoShow, 
    log: log, 
    logShow: logShow, 
    warn: warn, 
    warnShow: warnShow
};

},{"../Control.Monad.Aff":51,"../Control.Monad.Eff.Class":54,"../Control.Monad.Eff.Console":56,"../Control.Semigroupoid":88,"../Prelude":196}],48:[function(require,module,exports){
"use strict";

exports._makeVar = function (nonCanceler) {
  return function (success) {
    success({
      consumers: [],
      producers: [],
      error: undefined
    });
    return nonCanceler;
  };
};

exports._takeVar = function (nonCanceler, avar) {
  return function (success, error) {
    if (avar.error !== undefined) {
      error(avar.error);
    } else if (avar.producers.length > 0) {
      avar.producers.shift()(success, error);
    } else {
      avar.consumers.push({ peek: false, success: success, error: error });
    }

    return nonCanceler;
  };
};

exports._peekVar = function (nonCanceler, avar) {
  return function (success, error) {
    if (avar.error !== undefined) {
      error(avar.error);
    } else if (avar.producers.length > 0) {
      avar.producers[0](success, error);
    } else {
      avar.consumers.push({ peek: true, success: success, error: error });
    }
    return nonCanceler;
  };
};

exports._putVar = function (nonCanceler, avar, a) {
  return function (success, error) {
    if (avar.error !== undefined) {
      error(avar.error);
    } else {
      var shouldQueue = true;
      var consumers = [];
      var consumer;

      while (true) {
        consumer = avar.consumers.shift();
        if (consumer) {
          consumers.push(consumer);
          if (consumer.peek) {
            continue;
          } else {
            shouldQueue = false;
          }
        }
        break;
      }

      if (shouldQueue) {
        avar.producers.push(function (success) {
          success(a);
          return nonCanceler;
        });
      }

      for (var i = 0; i < consumers.length; i++) {
        consumers[i].success(a);
      }

      success({});
    }

    return nonCanceler;
  };
};

exports._killVar = function (nonCanceler, avar, e) {
  return function (success, error) {
    if (avar.error !== undefined) {
      error(avar.error);
    } else {
      avar.error = e;
      while (avar.consumers.length) {
        avar.consumers.shift().error(e);
      }
      success({});
    }

    return nonCanceler;
  };
};

},{}],49:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Data_Function_Uncurried = require("../Data.Function.Uncurried");
module.exports = {
    _killVar: $foreign._killVar, 
    _makeVar: $foreign._makeVar, 
    _peekVar: $foreign._peekVar, 
    _putVar: $foreign._putVar, 
    _takeVar: $foreign._takeVar
};

},{"../Control.Monad.Eff.Exception":58,"../Data.Function.Uncurried":120,"../Prelude":196,"./foreign":48}],50:[function(require,module,exports){
/* globals setTimeout, clearTimeout, setImmediate, clearImmediate */
"use strict";

exports._cancelWith = function (nonCanceler, aff, canceler1) {
  return function (success, error) {
    var canceler2 = aff(success, error);

    return function (e) {
      return function (success, error) {
        var cancellations = 0;
        var result = false;
        var errored = false;

        var s = function (bool) {
          cancellations = cancellations + 1;
          result = result || bool;

          if (cancellations === 2 && !errored) {
            success(result);
          }
        };

        var f = function (err) {
          if (!errored) {
            errored = true;
            error(err);
          }
        };

        canceler2(e)(s, f);
        canceler1(e)(s, f);

        return nonCanceler;
      };
    };
  };
};

exports._setTimeout = function (nonCanceler, millis, aff) {
  var set = setTimeout;
  var clear = clearTimeout;
  if (millis <= 0 && typeof setImmediate === "function") {
    set = setImmediate;
    clear = clearImmediate;
  }
  return function (success, error) {
    var canceler;

    var timeout = set(function () {
      canceler = aff(success, error);
    }, millis);

    return function (e) {
      return function (s, f) {
        if (canceler !== undefined) {
          return canceler(e)(s, f);
        } else {
          clear(timeout);
          s(true);
          return nonCanceler;
        }
      };
    };
  };
};

exports._unsafeInterleaveAff = function (aff) {
  return aff;
};

exports._forkAff = function (nonCanceler, aff) {
  var voidF = function () {};

  return function (success) {
    var canceler = aff(voidF, voidF);
    success(canceler);
    return nonCanceler;
  };
};

exports._forkAll = function (nonCanceler, foldl, affs) {
  var voidF = function () {};

  return function (success) {
    var cancelers = foldl(function (acc) {
      return function (aff) {
        acc.push(aff(voidF, voidF));
        return acc;
      };
    })([])(affs);

    var canceler = function (e) {
      return function (success, error) {
        var cancellations = 0;
        var result        = false;
        var errored       = false;

        var s = function (bool) {
          cancellations = cancellations + 1;
          result        = result || bool;

          if (cancellations === cancelers.length && !errored) {
            success(result);
          }
        };

        var f = function (err) {
          if (!errored) {
            errored = true;
            error(err);
          }
        };

        for (var i = 0; i < cancelers.length; i++) {
          cancelers[i](e)(s, f);
        }

        return nonCanceler;
      };
    };

    success(canceler);
    return nonCanceler;
  };
};

exports._makeAff = function (cb) {
  return function (success, error) {
    try {
      return cb(function (e) {
        return function () {
          error(e);
        };
      })(function (v) {
        return function () {
          success(v);
        };
      })();
    } catch (err) {
      error(err);
    }
  };
};

exports._pure = function (nonCanceler, v) {
  return function (success) {
    success(v);
    return nonCanceler;
  };
};

exports._throwError = function (nonCanceler, e) {
  return function (success, error) {
    error(e);
    return nonCanceler;
  };
};

exports._fmap = function (f, aff) {
  return function (success, error) {
    return aff(function (v) {
      success(f(v));
    }, error);
  };
};

exports._bind = function (alwaysCanceler, aff, f) {
  return function (success, error) {
    var canceler1, canceler2;

    var isCanceled    = false;
    var requestCancel = false;

    var onCanceler = function () {};

    canceler1 = aff(function (v) {
      if (requestCancel) {
        isCanceled = true;

        return alwaysCanceler;
      } else {
        canceler2 = f(v)(success, error);

        onCanceler(canceler2);

        return canceler2;
      }
    }, error);

    return function (e) {
      return function (s, f) {
        requestCancel = true;

        if (canceler2 !== undefined) {
          return canceler2(e)(s, f);
        } else {
          return canceler1(e)(function (bool) {
            if (bool || isCanceled) {
              s(true);
            } else {
              onCanceler = function (canceler) {
                canceler(e)(s, f);
              };
            }
          }, f);
        }
      };
    };
  };
};

exports._attempt = function (Left, Right, aff) {
  return function (success) {
    return aff(function (v) {
      success(Right(v));
    }, function (e) {
      success(Left(e));
    });
  };
};

exports._runAff = function (errorT, successT, aff) {
  // If errorT or successT throw, and an Aff is comprised only of synchronous
  // effects, then it's possible for makeAff/liftEff to accidentally catch
  // it, which may end up rerunning the Aff depending on error recovery
  // behavior. To mitigate this, we observe synchronicity using mutation. If
  // an Aff is observed to be synchronous, we let the stack reset and run the
  // handlers outside of the normal callback flow.
  return function () {
    var status = 0;
    var result, success;

    var canceler = aff(function (v) {
      if (status === 2) {
        successT(v)();
      } else {
        status = 1;
        result = v;
        success = true;
      }
    }, function (e) {
      if (status === 2) {
        errorT(e)();
      } else {
        status = 1;
        result = e;
        success = false;
      }
    });

    if (status === 1) {
      if (success) {
        successT(result)();
      } else {
        errorT(result)();
      }
    } else {
      status = 2;
    }

    return canceler;
  };
};

exports._liftEff = function (nonCanceler, e) {
  return function (success, error) {
    var result;
    try {
      result = e();
    } catch (err) {
      error(err);
      return nonCanceler;
    }

    success(result);
    return nonCanceler;
  };
};

exports._tailRecM = function (isLeft, f, a) {
  return function (success, error) {
    return function go (acc) {
      var result, status, canceler;

      // Observes synchronous effects using a flag.
      //   status = 0 (unresolved status)
      //   status = 1 (synchronous effect)
      //   status = 2 (asynchronous effect)

      var csuccess = function (v) {
        // If the status is still unresolved, we have observed a
        // synchronous effect. Otherwise, the status will be `2`.
        if (status === 0) {
          // Store the result for further synchronous processing.
          result = v;
          status = 1;
        } else {
          // When we have observed an asynchronous effect, we use normal
          // recursion. This is safe because we will be on a new stack.
          if (isLeft(v)) {
            go(v.value0);
          } else {
            success(v.value0);
          }
        }
      };

      while (true) {
        status = 0;
        canceler = f(acc)(csuccess, error);

        // If the status has already resolved to `1` by our Aff handler, then
        // we have observed a synchronous effect. Otherwise it will still be
        // `0`.
        if (status === 1) {
          // When we have observed a synchronous effect, we merely swap out the
          // accumulator and continue the loop, preserving stack.
          if (isLeft(result)) {
            acc = result.value0;
            continue;
          } else {
            success(result.value0);
          }
        } else {
          // If the status has not resolved yet, then we have observed an
          // asynchronous effect.
          status = 2;
        }
        return canceler;
      }

    }(a);
  };
};

},{}],51:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Monad_Aff_Internal = require("../Control.Monad.Aff.Internal");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Control_Monad_Error_Class = require("../Control.Monad.Error.Class");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Control_MonadPlus = require("../Control.MonadPlus");
var Control_Parallel = require("../Control.Parallel");
var Control_Plus = require("../Control.Plus");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_Function_Uncurried = require("../Data.Function.Uncurried");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Tuple = require("../Data.Tuple");
var Unsafe_Coerce = require("../Unsafe.Coerce");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Apply = require("../Control.Apply");
var Data_Functor = require("../Data.Functor");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Function = require("../Data.Function");
var Control_MonadZero = require("../Control.MonadZero");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Eq = require("../Data.Eq");
var Data_Semiring = require("../Data.Semiring");
var Control_Parallel_Class = require("../Control.Parallel.Class");
var Data_Unit = require("../Data.Unit");
var ParAff = function (x) {
    return x;
};
var Canceler = function (x) {
    return x;
};
var runAff = function (ex) {
    return function (f) {
        return function (aff) {
            return $foreign._runAff(ex, f, aff);
        };
    };
};
var newtypeParAff = new Data_Newtype.Newtype(function (n) {
    return n;
}, ParAff);
var makeAff$prime = function (h) {
    return $foreign._makeAff(h);
};
var functorAff = new Data_Functor.Functor(function (f) {
    return function (fa) {
        return $foreign._fmap(f, fa);
    };
});
var functorParAff = functorAff;
var fromAVBox = Unsafe_Coerce.unsafeCoerce;
var cancel = function (v) {
    return v;
};
var launchAff = (function () {
    var lowerEx = Data_Functor.map(Control_Monad_Eff.functorEff)(function ($53) {
        return Canceler(Data_Functor.map(Data_Functor.functorFn)($foreign._unsafeInterleaveAff)(cancel($53)));
    });
    return function ($54) {
        return lowerEx(runAff(Control_Monad_Eff_Exception.throwException)(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit)))($foreign._unsafeInterleaveAff($54)));
    };
})();
var attempt = function (aff) {
    return $foreign._attempt(Data_Either.Left.create, Data_Either.Right.create, aff);
};
var apathize = function (a) {
    return Data_Functor.map(functorAff)(Data_Function["const"](Data_Unit.unit))(attempt(a));
};
var applyAff = new Control_Apply.Apply(function () {
    return functorAff;
}, function (ff) {
    return function (fa) {
        return $foreign._bind(alwaysCanceler, ff, function (f) {
            return Data_Functor.map(functorAff)(f)(fa);
        });
    };
});
var applicativeAff = new Control_Applicative.Applicative(function () {
    return applyAff;
}, function (v) {
    return $foreign._pure(nonCanceler, v);
});
var nonCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(false));
var alwaysCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(true));
var cancelWith = function (aff) {
    return function (c) {
        return $foreign._cancelWith(nonCanceler, aff, c);
    };
};
var forkAff = function (aff) {
    return $foreign._forkAff(nonCanceler, aff);
};
var forkAll = function (dictFoldable) {
    return function (affs) {
        return $foreign._forkAll(nonCanceler, Data_Foldable.foldl(dictFoldable), affs);
    };
};
var killVar = function (q) {
    return function (e) {
        return fromAVBox(Control_Monad_Aff_Internal._killVar(nonCanceler, q, e));
    };
};
var later$prime = function (n) {
    return function (aff) {
        return $foreign._setTimeout(nonCanceler, n, aff);
    };
};
var later = later$prime(0);
var liftEff$prime = function (eff) {
    return attempt($foreign._unsafeInterleaveAff($foreign._liftEff(nonCanceler, eff)));
};
var makeAff = function (h) {
    return makeAff$prime(function (e) {
        return function (a) {
            return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Function["const"](nonCanceler))(h(e)(a));
        };
    });
};
var makeVar = fromAVBox(Control_Monad_Aff_Internal._makeVar(nonCanceler));
var putVar = function (q) {
    return function (a) {
        return fromAVBox(Control_Monad_Aff_Internal._putVar(nonCanceler, q, a));
    };
};
var takeVar = function (q) {
    return fromAVBox(Control_Monad_Aff_Internal._takeVar(nonCanceler, q));
};
var semigroupAff = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (a) {
        return function (b) {
            return Control_Apply.apply(applyAff)(Data_Functor.map(functorAff)(Data_Semigroup.append(dictSemigroup))(a))(b);
        };
    });
};
var monoidAff = function (dictMonoid) {
    return new Data_Monoid.Monoid(function () {
        return semigroupAff(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]());
    }, Control_Applicative.pure(applicativeAff)(Data_Monoid.mempty(dictMonoid)));
};
var semigroupCanceler = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        return function (e) {
            return Control_Apply.apply(applyAff)(Data_Functor.map(functorAff)(Data_HeytingAlgebra.disj(Data_HeytingAlgebra.heytingAlgebraBoolean))(v(e)))(v1(e));
        };
    };
});
var monoidCanceler = new Data_Monoid.Monoid(function () {
    return semigroupCanceler;
}, Data_Function["const"](Control_Applicative.pure(applicativeAff)(true)));
var bindAff = new Control_Bind.Bind(function () {
    return applyAff;
}, function (fa) {
    return function (f) {
        return $foreign._bind(alwaysCanceler, fa, f);
    };
});
var applyParAff = new Control_Apply.Apply(function () {
    return functorParAff;
}, function (v) {
    return function (v1) {
        var putOrKill = function (v2) {
            return Data_Either.either(killVar(v2))(putVar(v2));
        };
        return Control_Bind.bind(bindAff)(makeVar)(function (v2) {
            return Control_Bind.bind(bindAff)(makeVar)(function (v3) {
                return Control_Bind.bind(bindAff)(forkAff(Control_Bind.bindFlipped(bindAff)(putOrKill(v2))(attempt(v))))(function (v4) {
                    return Control_Bind.bind(bindAff)(forkAff(Control_Bind.bindFlipped(bindAff)(putOrKill(v3))(attempt(v1))))(function (v5) {
                        return cancelWith(Control_Apply.apply(applyAff)(takeVar(v2))(takeVar(v3)))(Data_Semigroup.append(semigroupCanceler)(v4)(v5));
                    });
                });
            });
        });
    };
});
var applicativeParAff = new Control_Applicative.Applicative(function () {
    return applyParAff;
}, function ($55) {
    return ParAff(Control_Applicative.pure(applicativeAff)($55));
});
var semigroupParAff = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (a) {
        return function (b) {
            return Control_Apply.apply(applyParAff)(Data_Functor.map(functorParAff)(Data_Semigroup.append(dictSemigroup))(a))(b);
        };
    });
};
var monoidParAff = function (dictMonoid) {
    return new Data_Monoid.Monoid(function () {
        return semigroupParAff(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]());
    }, Control_Applicative.pure(applicativeParAff)(Data_Monoid.mempty(dictMonoid)));
};
var monadAff = new Control_Monad.Monad(function () {
    return applicativeAff;
}, function () {
    return bindAff;
});
var monadEffAff = new Control_Monad_Eff_Class.MonadEff(function () {
    return monadAff;
}, function (eff) {
    return $foreign._liftEff(nonCanceler, eff);
});
var monadRecAff = new Control_Monad_Rec_Class.MonadRec(function () {
    return monadAff;
}, function (f) {
    return function (a) {
        var isLoop = function (v) {
            if (v instanceof Control_Monad_Rec_Class.Loop) {
                return true;
            };
            return false;
        };
        return $foreign._tailRecM(isLoop, f, a);
    };
});
var parallelParAff = new Control_Parallel_Class.Parallel(function () {
    return applicativeParAff;
}, function () {
    return monadAff;
}, ParAff, function (v) {
    return v;
});
var monadErrorAff = new Control_Monad_Error_Class.MonadError(function () {
    return monadAff;
}, function (aff) {
    return function (ex) {
        return Control_Bind.bind(bindAff)(attempt(aff))(Data_Either.either(ex)(Control_Applicative.pure(applicativeAff)));
    };
}, function (e) {
    return $foreign._throwError(nonCanceler, e);
});
var $$finally = function (aff1) {
    return function (aff2) {
        return Control_Bind.bind(bindAff)(attempt(aff1))(function (v) {
            return Control_Bind.bind(bindAff)(aff2)(function (v1) {
                return Data_Either.either(Control_Monad_Error_Class.throwError(monadErrorAff))(Control_Applicative.pure(applicativeAff))(v);
            });
        });
    };
};
var altParAff = new Control_Alt.Alt(function () {
    return functorParAff;
}, function (v) {
    return function (v1) {
        var maybeKill = function (va) {
            return function (ve) {
                return function (err) {
                    return Control_Bind.bind(bindAff)(takeVar(ve))(function (v2) {
                        return Control_Bind.bind(bindAff)(Control_Applicative.when(applicativeAff)(v2 === 1)(killVar(va)(err)))(function () {
                            return putVar(ve)(v2 + 1 | 0);
                        });
                    });
                };
            };
        };
        var done = function (cs) {
            return function (get) {
                return function (va) {
                    return function (x) {
                        return Control_Bind.bind(bindAff)(putVar(va)(x))(function () {
                            return Control_Bind.bind(bindAff)(Data_Functor.map(functorAff)(get)(takeVar(cs)))(function (v2) {
                                return Data_Functor["void"](functorAff)(cancel(v2)(Control_Monad_Eff_Exception.error("Alt early exit")));
                            });
                        });
                    };
                };
            };
        };
        return Control_Bind.bind(bindAff)(makeVar)(function (v2) {
            return Control_Bind.bind(bindAff)(makeVar)(function (v3) {
                return Control_Bind.bind(bindAff)(makeVar)(function (v4) {
                    return Control_Bind.bind(bindAff)(putVar(v3)(0))(function () {
                        return Control_Bind.bind(bindAff)(forkAff(Control_Bind.bindFlipped(bindAff)(Data_Either.either(maybeKill(v2)(v3))(done(v4)(Data_Tuple.snd)(v2)))(attempt(v))))(function (v5) {
                            return Control_Bind.bind(bindAff)(forkAff(Control_Bind.bindFlipped(bindAff)(Data_Either.either(maybeKill(v2)(v3))(done(v4)(Data_Tuple.fst)(v2)))(attempt(v1))))(function (v6) {
                                return Control_Bind.bind(bindAff)(putVar(v4)(new Data_Tuple.Tuple(v5, v6)))(function () {
                                    return cancelWith(takeVar(v2))(Data_Semigroup.append(semigroupCanceler)(v5)(v6));
                                });
                            });
                        });
                    });
                });
            });
        });
    };
});
var altAff = new Control_Alt.Alt(function () {
    return functorAff;
}, function (a1) {
    return function (a2) {
        return Control_Bind.bind(bindAff)(attempt(a1))(Data_Either.either(Data_Function["const"](a2))(Control_Applicative.pure(applicativeAff)));
    };
});
var plusAff = new Control_Plus.Plus(function () {
    return altAff;
}, Control_Monad_Error_Class.throwError(monadErrorAff)(Control_Monad_Eff_Exception.error("Always fails")));
var alternativeAff = new Control_Alternative.Alternative(function () {
    return applicativeAff;
}, function () {
    return plusAff;
});
var monadZero = new Control_MonadZero.MonadZero(function () {
    return alternativeAff;
}, function () {
    return monadAff;
});
var monadPlusAff = new Control_MonadPlus.MonadPlus(function () {
    return monadZero;
});
var plusParAff = new Control_Plus.Plus(function () {
    return altParAff;
}, Control_Plus.empty(plusAff));
var alternativeParAff = new Control_Alternative.Alternative(function () {
    return applicativeParAff;
}, function () {
    return plusParAff;
});
module.exports = {
    Canceler: Canceler, 
    ParAff: ParAff, 
    apathize: apathize, 
    attempt: attempt, 
    cancel: cancel, 
    cancelWith: cancelWith, 
    "finally": $$finally, 
    forkAff: forkAff, 
    forkAll: forkAll, 
    later: later, 
    "later'": later$prime, 
    launchAff: launchAff, 
    "liftEff'": liftEff$prime, 
    makeAff: makeAff, 
    "makeAff'": makeAff$prime, 
    nonCanceler: nonCanceler, 
    runAff: runAff, 
    semigroupAff: semigroupAff, 
    monoidAff: monoidAff, 
    functorAff: functorAff, 
    applyAff: applyAff, 
    applicativeAff: applicativeAff, 
    bindAff: bindAff, 
    monadAff: monadAff, 
    monadEffAff: monadEffAff, 
    monadErrorAff: monadErrorAff, 
    altAff: altAff, 
    plusAff: plusAff, 
    alternativeAff: alternativeAff, 
    monadZero: monadZero, 
    monadPlusAff: monadPlusAff, 
    monadRecAff: monadRecAff, 
    semigroupCanceler: semigroupCanceler, 
    monoidCanceler: monoidCanceler, 
    newtypeParAff: newtypeParAff, 
    semigroupParAff: semigroupParAff, 
    monoidParAff: monoidParAff, 
    functorParAff: functorParAff, 
    applyParAff: applyParAff, 
    applicativeParAff: applicativeParAff, 
    altParAff: altParAff, 
    plusParAff: plusParAff, 
    alternativeParAff: alternativeParAff, 
    parallelParAff: parallelParAff
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad":82,"../Control.Monad.Aff.Internal":49,"../Control.Monad.Eff":66,"../Control.Monad.Eff.Class":54,"../Control.Monad.Eff.Exception":58,"../Control.Monad.Error.Class":67,"../Control.Monad.Rec.Class":73,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Parallel":86,"../Control.Parallel.Class":85,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Function.Uncurried":120,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Tuple":179,"../Data.Unit":183,"../Prelude":196,"../Unsafe.Coerce":223,"./foreign":50}],52:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var MonadCont = function (__superclass_Control$dotMonad$dotMonad_0, callCC) {
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
    this.callCC = callCC;
};
var callCC = function (dict) {
    return dict.callCC;
};
module.exports = {
    MonadCont: MonadCont, 
    callCC: callCC
};

},{"../Prelude":196}],53:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Cont_Class = require("../Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Reader_Class = require("../Control.Monad.Reader.Class");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Control_Monad_Trans_Class = require("../Control.Monad.Trans.Class");
var Data_Newtype = require("../Data.Newtype");
var Data_Functor = require("../Data.Functor");
var Data_Function = require("../Data.Function");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var ContT = function (x) {
    return x;
};
var withContT = function (f) {
    return function (v) {
        return function (k) {
            return v(f(k));
        };
    };
};
var runContT = function (v) {
    return function (k) {
        return v(k);
    };
};
var newtypeContT = new Data_Newtype.Newtype(function (n) {
    return n;
}, ContT);
var monadTransContT = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
    return function (m) {
        return function (k) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(m)(k);
        };
    };
});
var mapContT = function (f) {
    return function (v) {
        return function (k) {
            return f(v(k));
        };
    };
};
var functorContT = function (dictFunctor) {
    return new Data_Functor.Functor(function (f) {
        return function (v) {
            return function (k) {
                return v(function (a) {
                    return k(f(a));
                });
            };
        };
    });
};
var applyContT = function (dictApply) {
    return new Control_Apply.Apply(function () {
        return functorContT(dictApply["__superclass_Data.Functor.Functor_0"]());
    }, function (v) {
        return function (v1) {
            return function (k) {
                return v(function (g) {
                    return v1(function (a) {
                        return k(g(a));
                    });
                });
            };
        };
    });
};
var bindContT = function (dictBind) {
    return new Control_Bind.Bind(function () {
        return applyContT(dictBind["__superclass_Control.Apply.Apply_0"]());
    }, function (v) {
        return function (k) {
            return function (k$prime) {
                return v(function (a) {
                    var $36 = k(a);
                    return $36(k$prime);
                });
            };
        };
    });
};
var applicativeContT = function (dictApplicative) {
    return new Control_Applicative.Applicative(function () {
        return applyContT(dictApplicative["__superclass_Control.Apply.Apply_0"]());
    }, function (a) {
        return function (k) {
            return k(a);
        };
    });
};
var monadContT = function (dictMonad) {
    return new Control_Monad.Monad(function () {
        return applicativeContT(dictMonad["__superclass_Control.Applicative.Applicative_0"]());
    }, function () {
        return bindContT(dictMonad["__superclass_Control.Bind.Bind_1"]());
    });
};
var monadAskContT = function (dictMonadAsk) {
    return new Control_Monad_Reader_Class.MonadAsk(function () {
        return monadContT(dictMonadAsk["__superclass_Control.Monad.Monad_0"]());
    }, Control_Monad_Trans_Class.lift(monadTransContT)(dictMonadAsk["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Reader_Class.ask(dictMonadAsk)));
};
var monadReaderContT = function (dictMonadReader) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadAskContT(dictMonadReader["__superclass_Control.Monad.Reader.Class.MonadAsk_0"]());
    }, function (f) {
        return function (v) {
            return function (k) {
                return Control_Bind.bind(((dictMonadReader["__superclass_Control.Monad.Reader.Class.MonadAsk_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Reader_Class.ask(dictMonadReader["__superclass_Control.Monad.Reader.Class.MonadAsk_0"]()))(function (v1) {
                    return Control_Monad_Reader_Class.local(dictMonadReader)(f)(v(function ($42) {
                        return Control_Monad_Reader_Class.local(dictMonadReader)(Data_Function["const"](v1))(k($42));
                    }));
                });
            };
        };
    });
};
var monadContContT = function (dictMonad) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadContT(dictMonad);
    }, function (f) {
        return function (k) {
            var $41 = f(function (a) {
                return function (v) {
                    return k(a);
                };
            });
            return $41(k);
        };
    });
};
var monadEffContT = function (dictMonadEff) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadContT(dictMonadEff["__superclass_Control.Monad.Monad_0"]());
    }, function ($43) {
        return Control_Monad_Trans_Class.lift(monadTransContT)(dictMonadEff["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)($43));
    });
};
var monadStateContT = function (dictMonadState) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadContT(dictMonadState["__superclass_Control.Monad.Monad_0"]());
    }, function ($44) {
        return Control_Monad_Trans_Class.lift(monadTransContT)(dictMonadState["__superclass_Control.Monad.Monad_0"]())(Control_Monad_State_Class.state(dictMonadState)($44));
    });
};
module.exports = {
    ContT: ContT, 
    mapContT: mapContT, 
    runContT: runContT, 
    withContT: withContT, 
    newtypeContT: newtypeContT, 
    monadContContT: monadContContT, 
    functorContT: functorContT, 
    applyContT: applyContT, 
    applicativeContT: applicativeContT, 
    bindContT: bindContT, 
    monadContT: monadContT, 
    monadTransContT: monadTransContT, 
    monadEffContT: monadEffContT, 
    monadAskContT: monadAskContT, 
    monadReaderContT: monadReaderContT, 
    monadStateContT: monadStateContT
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad":82,"../Control.Monad.Cont.Class":52,"../Control.Monad.Eff.Class":54,"../Control.Monad.Reader.Class":71,"../Control.Monad.State.Class":76,"../Control.Monad.Trans.Class":79,"../Control.Semigroupoid":88,"../Data.Function":121,"../Data.Functor":127,"../Data.Newtype":149,"../Prelude":196}],54:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Category = require("../Control.Category");
var Control_Monad = require("../Control.Monad");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var MonadEff = function (__superclass_Control$dotMonad$dotMonad_0, liftEff) {
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
    this.liftEff = liftEff;
};
var monadEffEff = new MonadEff(function () {
    return Control_Monad_Eff.monadEff;
}, Control_Category.id(Control_Category.categoryFn));
var liftEff = function (dict) {
    return dict.liftEff;
};
module.exports = {
    MonadEff: MonadEff, 
    liftEff: liftEff, 
    monadEffEff: monadEffEff
};

},{"../Control.Category":41,"../Control.Monad":82,"../Control.Monad.Eff":66}],55:[function(require,module,exports){
"use strict";

exports.log = function (s) {
  return function () {
    console.log(s);
    return {};
  };
};

exports.warn = function (s) {
  return function () {
    console.warn(s);
    return {};
  };
};

exports.error = function (s) {
  return function () {
    console.error(s);
    return {};
  };
};

exports.info = function (s) {
  return function () {
    console.info(s);
    return {};
  };
};

},{}],56:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Data_Show = require("../Data.Show");
var Data_Unit = require("../Data.Unit");
var warnShow = function (dictShow) {
    return function (a) {
        return $foreign.warn(Data_Show.show(dictShow)(a));
    };
};
var logShow = function (dictShow) {
    return function (a) {
        return $foreign.log(Data_Show.show(dictShow)(a));
    };
};
var infoShow = function (dictShow) {
    return function (a) {
        return $foreign.info(Data_Show.show(dictShow)(a));
    };
};
var errorShow = function (dictShow) {
    return function (a) {
        return $foreign.error(Data_Show.show(dictShow)(a));
    };
};
module.exports = {
    errorShow: errorShow, 
    infoShow: infoShow, 
    logShow: logShow, 
    warnShow: warnShow, 
    error: $foreign.error, 
    info: $foreign.info, 
    log: $foreign.log, 
    warn: $foreign.warn
};

},{"../Control.Monad.Eff":66,"../Data.Show":165,"../Data.Unit":183,"./foreign":55}],57:[function(require,module,exports){
"use strict";

exports.showErrorImpl = function (err) {
  return err.stack || err.toString();
};

exports.error = function (msg) {
  return new Error(msg);
};

exports.message = function (e) {
  return e.message;
};

exports.stackImpl = function (just) {
  return function (nothing) {
    return function (e) {
      return e.stack ? just(e.stack) : nothing;
    };
  };
};

exports.throwException = function (e) {
  return function () {
    throw e;
  };
};

exports.catchException = function (c) {
  return function (t) {
    return function () {
      try {
        return t();
      } catch (e) {
        if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
          return c(e)();
        } else {
          return c(new Error(e.toString()))();
        }
      }
    };
  };
};

},{}],58:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Data_Either = require("../Data.Either");
var Data_Maybe = require("../Data.Maybe");
var Data_Show = require("../Data.Show");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Applicative = require("../Control.Applicative");
var Data_Functor = require("../Data.Functor");
var $$try = function (action) {
    return $foreign.catchException(function ($0) {
        return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Either.Left.create($0));
    })(Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Either.Right.create)(action));
};
var $$throw = function ($1) {
    return $foreign.throwException($foreign.error($1));
};
var stack = $foreign.stackImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var showError = new Data_Show.Show($foreign.showErrorImpl);
module.exports = {
    stack: stack, 
    "throw": $$throw, 
    "try": $$try, 
    showError: showError, 
    catchException: $foreign.catchException, 
    error: $foreign.error, 
    message: $foreign.message, 
    throwException: $foreign.throwException
};

},{"../Control.Applicative":34,"../Control.Monad.Eff":66,"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Functor":127,"../Data.Maybe":140,"../Data.Show":165,"../Prelude":196,"./foreign":57}],59:[function(require,module,exports){
"use strict";

exports.newRef = function (val) {
  return function () {
    return { value: val };
  };
};

exports.readRef = function (ref) {
  return function () {
    return ref.value;
  };
};

exports["modifyRef'"] = function (ref) {
  return function (f) {
    return function () {
      var t = f(ref.value);
      ref.value = t.state;
      return t.value;
    };
  };
};

exports.writeRef = function (ref) {
  return function (val) {
    return function () {
      ref.value = val;
      return {};
    };
  };
};

},{}],60:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Data_Unit = require("../Data.Unit");
var modifyRef = function (ref) {
    return function (f) {
        return $foreign["modifyRef'"](ref)(function (s) {
            return {
                state: f(s), 
                value: Data_Unit.unit
            };
        });
    };
};
module.exports = {
    modifyRef: modifyRef, 
    "modifyRef'": $foreign["modifyRef'"], 
    newRef: $foreign.newRef, 
    readRef: $foreign.readRef, 
    writeRef: $foreign.writeRef
};

},{"../Control.Monad.Eff":66,"../Data.Unit":183,"../Prelude":196,"./foreign":59}],61:[function(require,module,exports){
/* global exports */
"use strict";

exports.setTimeout = function (ms) {
  return function (fn) {
    return function () {
      return setTimeout(fn, ms);
    };
  };
};

exports.clearTimeout = function (id) {
  return function () {
    clearTimeout(id);
  };
};

exports.setInterval = function (ms) {
  return function (fn) {
    return function () {
      return setInterval(fn, ms);
    };
  };
};

exports.clearInterval = function (id) {
  return function () {
    clearInterval(id);
  };
};

},{}],62:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var TimeoutId = function (x) {
    return x;
};
var IntervalId = function (x) {
    return x;
};
var eqTimeoutId = new Data_Eq.Eq(function (x) {
    return function (y) {
        return x === y;
    };
});
var ordTimeoutId = new Data_Ord.Ord(function () {
    return eqTimeoutId;
}, function (x) {
    return function (y) {
        return Data_Ord.compare(Data_Ord.ordInt)(x)(y);
    };
});
var eqIntervalId = new Data_Eq.Eq(function (x) {
    return function (y) {
        return x === y;
    };
});
var ordIntervalId = new Data_Ord.Ord(function () {
    return eqIntervalId;
}, function (x) {
    return function (y) {
        return Data_Ord.compare(Data_Ord.ordInt)(x)(y);
    };
});
module.exports = {
    eqTimeoutId: eqTimeoutId, 
    ordTimeoutId: ordTimeoutId, 
    eqIntervalId: eqIntervalId, 
    ordIntervalId: ordIntervalId, 
    clearInterval: $foreign.clearInterval, 
    clearTimeout: $foreign.clearTimeout, 
    setInterval: $foreign.setInterval, 
    setTimeout: $foreign.setTimeout
};

},{"../Control.Monad.Eff":66,"../Data.Eq":113,"../Data.Ord":154,"../Prelude":196,"./foreign":61}],63:[function(require,module,exports){
"use strict";

exports.unsafeCoerceEff = function (f) {
  return f;
};

},{}],64:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var unsafePerformEff = function ($0) {
    return Control_Monad_Eff.runPure($foreign.unsafeCoerceEff($0));
};
module.exports = {
    unsafePerformEff: unsafePerformEff, 
    unsafeCoerceEff: $foreign.unsafeCoerceEff
};

},{"../Control.Monad.Eff":66,"../Control.Semigroupoid":88,"./foreign":63}],65:[function(require,module,exports){
"use strict";

exports.pureE = function (a) {
  return function () {
    return a;
  };
};

exports.bindE = function (a) {
  return function (f) {
    return function () {
      return f(a())();
    };
  };
};

exports.runPure = function (f) {
  return f();
};

exports.untilE = function (f) {
  return function () {
    while (!f());
    return {};
  };
};

exports.whileE = function (f) {
  return function (a) {
    return function () {
      while (f()) {
        a();
      }
      return {};
    };
  };
};

exports.forE = function (lo) {
  return function (hi) {
    return function (f) {
      return function () {
        for (var i = lo; i < hi; i++) {
          f(i)();
        }
      };
    };
  };
};

exports.foreachE = function (as) {
  return function (f) {
    return function () {
      for (var i = 0, l = as.length; i < l; i++) {
        f(as[i])();
      }
    };
  };
};

},{}],66:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
var monadEff = new Control_Monad.Monad(function () {
    return applicativeEff;
}, function () {
    return bindEff;
});
var bindEff = new Control_Bind.Bind(function () {
    return applyEff;
}, $foreign.bindE);
var applyEff = new Control_Apply.Apply(function () {
    return functorEff;
}, Control_Monad.ap(monadEff));
var applicativeEff = new Control_Applicative.Applicative(function () {
    return applyEff;
}, $foreign.pureE);
var functorEff = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEff));
module.exports = {
    functorEff: functorEff, 
    applyEff: applyEff, 
    applicativeEff: applicativeEff, 
    bindEff: bindEff, 
    monadEff: monadEff, 
    forE: $foreign.forE, 
    foreachE: $foreign.foreachE, 
    runPure: $foreign.runPure, 
    untilE: $foreign.untilE, 
    whileE: $foreign.whileE
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad":82,"../Data.Functor":127,"../Data.Unit":183,"./foreign":65}],67:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Maybe = require("../Data.Maybe");
var Data_Either = require("../Data.Either");
var Data_Function = require("../Data.Function");
var Data_Unit = require("../Data.Unit");
var MonadError = function (__superclass_Control$dotMonad$dotMonad_0, catchError, throwError) {
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
    this.catchError = catchError;
    this.throwError = throwError;
};
var throwError = function (dict) {
    return dict.throwError;
};
var monadErrorMaybe = new MonadError(function () {
    return Data_Maybe.monadMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Data_Maybe.Nothing) {
            return v1(Data_Unit.unit);
        };
        if (v instanceof Data_Maybe.Just) {
            return new Data_Maybe.Just(v.value0);
        };
        throw new Error("Failed pattern match at Control.Monad.Error.Class line 55, column 3 - line 55, column 33: " + [ v.constructor.name, v1.constructor.name ]);
    };
}, Data_Function["const"](Data_Maybe.Nothing.value));
var monadErrorEither = new MonadError(function () {
    return Data_Either.monadEither;
}, function (v) {
    return function (v1) {
        if (v instanceof Data_Either.Left) {
            return v1(v.value0);
        };
        if (v instanceof Data_Either.Right) {
            return new Data_Either.Right(v.value0);
        };
        throw new Error("Failed pattern match at Control.Monad.Error.Class line 50, column 3 - line 50, column 30: " + [ v.constructor.name, v1.constructor.name ]);
    };
}, Data_Either.Left.create);
var catchError = function (dict) {
    return dict.catchError;
};
var catchJust = function (dictMonadError) {
    return function (p) {
        return function (act) {
            return function (handler) {
                var handle = function (e) {
                    var $12 = p(e);
                    if ($12 instanceof Data_Maybe.Nothing) {
                        return throwError(dictMonadError)(e);
                    };
                    if ($12 instanceof Data_Maybe.Just) {
                        return handler($12.value0);
                    };
                    throw new Error("Failed pattern match at Control.Monad.Error.Class line 44, column 5 - line 46, column 26: " + [ $12.constructor.name ]);
                };
                return catchError(dictMonadError)(act)(handle);
            };
        };
    };
};
module.exports = {
    MonadError: MonadError, 
    catchError: catchError, 
    catchJust: catchJust, 
    throwError: throwError, 
    monadErrorEither: monadErrorEither, 
    monadErrorMaybe: monadErrorMaybe
};

},{"../Data.Either":111,"../Data.Function":121,"../Data.Maybe":140,"../Data.Unit":183,"../Prelude":196}],68:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Monad_Cont_Class = require("../Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("../Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("../Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Control_Monad_Trans_Class = require("../Control.Monad.Trans.Class");
var Control_Monad_Writer_Class = require("../Control.Monad.Writer.Class");
var Control_MonadPlus = require("../Control.MonadPlus");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Either = require("../Data.Either");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Tuple = require("../Data.Tuple");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Monad = require("../Control.Monad");
var Control_Applicative = require("../Control.Applicative");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Bind = require("../Control.Bind");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Function = require("../Data.Function");
var Control_Category = require("../Control.Category");
var ExceptT = function (x) {
    return x;
};
var withExceptT = function (dictFunctor) {
    return function (f) {
        return function (v) {
            var mapLeft = function (v1) {
                return function (v2) {
                    if (v2 instanceof Data_Either.Right) {
                        return new Data_Either.Right(v2.value0);
                    };
                    if (v2 instanceof Data_Either.Left) {
                        return new Data_Either.Left(v1(v2.value0));
                    };
                    throw new Error("Failed pattern match at Control.Monad.Except.Trans line 44, column 3 - line 44, column 32: " + [ v1.constructor.name, v2.constructor.name ]);
                };
            };
            return ExceptT(Data_Functor.map(dictFunctor)(mapLeft(f))(v));
        };
    };
};
var runExceptT = function (v) {
    return v;
};
var newtypeExceptT = new Data_Newtype.Newtype(function (n) {
    return n;
}, ExceptT);
var monadTransExceptT = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
    return function (m) {
        return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(m)(function (v) {
            return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Either.Right(v));
        });
    };
});
var mapExceptT = function (f) {
    return function (v) {
        return f(v);
    };
};
var functorExceptT = function (dictFunctor) {
    return new Data_Functor.Functor(function (f) {
        return mapExceptT(Data_Functor.map(dictFunctor)(Data_Functor.map(Data_Either.functorEither)(f)));
    });
};
var except = function (dictApplicative) {
    return function ($87) {
        return ExceptT(Control_Applicative.pure(dictApplicative)($87));
    };
};
var monadExceptT = function (dictMonad) {
    return new Control_Monad.Monad(function () {
        return applicativeExceptT(dictMonad);
    }, function () {
        return bindExceptT(dictMonad);
    });
};
var bindExceptT = function (dictMonad) {
    return new Control_Bind.Bind(function () {
        return applyExceptT(dictMonad);
    }, function (v) {
        return function (k) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(Data_Either.either(function ($88) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Either.Left.create($88));
            })(function (a) {
                var $56 = k(a);
                return $56;
            }));
        };
    });
};
var applyExceptT = function (dictMonad) {
    return new Control_Apply.Apply(function () {
        return functorExceptT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
    }, Control_Monad.ap(monadExceptT(dictMonad)));
};
var applicativeExceptT = function (dictMonad) {
    return new Control_Applicative.Applicative(function () {
        return applyExceptT(dictMonad);
    }, function ($89) {
        return ExceptT(Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Either.Right.create($89)));
    });
};
var monadAskExceptT = function (dictMonadAsk) {
    return new Control_Monad_Reader_Class.MonadAsk(function () {
        return monadExceptT(dictMonadAsk["__superclass_Control.Monad.Monad_0"]());
    }, Control_Monad_Trans_Class.lift(monadTransExceptT)(dictMonadAsk["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Reader_Class.ask(dictMonadAsk)));
};
var monadReaderExceptT = function (dictMonadReader) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadAskExceptT(dictMonadReader["__superclass_Control.Monad.Reader.Class.MonadAsk_0"]());
    }, function (f) {
        return mapExceptT(Control_Monad_Reader_Class.local(dictMonadReader)(f));
    });
};
var monadContExceptT = function (dictMonadCont) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadExceptT(dictMonadCont["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return ExceptT(Control_Monad_Cont_Class.callCC(dictMonadCont)(function (c) {
            var $57 = f(function (a) {
                return ExceptT(c(new Data_Either.Right(a)));
            });
            return $57;
        }));
    });
};
var monadEffExceptT = function (dictMonadEff) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadExceptT(dictMonadEff["__superclass_Control.Monad.Monad_0"]());
    }, function ($90) {
        return Control_Monad_Trans_Class.lift(monadTransExceptT)(dictMonadEff["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)($90));
    });
};
var monadErrorExceptT = function (dictMonad) {
    return new Control_Monad_Error_Class.MonadError(function () {
        return monadExceptT(dictMonad);
    }, function (v) {
        return function (k) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(Data_Either.either(function (a) {
                var $60 = k(a);
                return $60;
            })(function ($91) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Either.Right.create($91));
            }));
        };
    }, function ($92) {
        return ExceptT(Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Either.Left.create($92)));
    });
};
var monadRecExceptT = function (dictMonadRec) {
    return new Control_Monad_Rec_Class.MonadRec(function () {
        return monadExceptT(dictMonadRec["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return function ($93) {
            return ExceptT(Control_Monad_Rec_Class.tailRecM(dictMonadRec)(function (a) {
                return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())((function () {
                    var $61 = f(a);
                    return $61;
                })())(function (m$prime) {
                    return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())((function () {
                        if (m$prime instanceof Data_Either.Left) {
                            return new Control_Monad_Rec_Class.Done(new Data_Either.Left(m$prime.value0));
                        };
                        if (m$prime instanceof Data_Either.Right && m$prime.value0 instanceof Control_Monad_Rec_Class.Loop) {
                            return new Control_Monad_Rec_Class.Loop(m$prime.value0.value0);
                        };
                        if (m$prime instanceof Data_Either.Right && m$prime.value0 instanceof Control_Monad_Rec_Class.Done) {
                            return new Control_Monad_Rec_Class.Done(new Data_Either.Right(m$prime.value0.value0));
                        };
                        throw new Error("Failed pattern match at Control.Monad.Except.Trans line 76, column 14 - line 79, column 43: " + [ m$prime.constructor.name ]);
                    })());
                });
            })($93));
        };
    });
};
var monadStateExceptT = function (dictMonadState) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadExceptT(dictMonadState["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return Control_Monad_Trans_Class.lift(monadTransExceptT)(dictMonadState["__superclass_Control.Monad.Monad_0"]())(Control_Monad_State_Class.state(dictMonadState)(f));
    });
};
var monadTellExceptT = function (dictMonadTell) {
    return new Control_Monad_Writer_Class.MonadTell(function () {
        return monadExceptT(dictMonadTell["__superclass_Control.Monad.Monad_0"]());
    }, function ($94) {
        return Control_Monad_Trans_Class.lift(monadTransExceptT)(dictMonadTell["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Writer_Class.tell(dictMonadTell)($94));
    });
};
var monadWriterExceptT = function (dictMonadWriter) {
    return new Control_Monad_Writer_Class.MonadWriter(function () {
        return monadTellExceptT(dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]());
    }, mapExceptT(function (m) {
        return Control_Bind.bind(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Writer_Class.listen(dictMonadWriter)(m))(function (v) {
            return Control_Applicative.pure(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(Data_Functor.map(Data_Either.functorEither)(function (r) {
                return new Data_Tuple.Tuple(r, v.value1);
            })(v.value0));
        });
    }), mapExceptT(function (m) {
        return Control_Monad_Writer_Class.pass(dictMonadWriter)(Control_Bind.bind(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(m)(function (v) {
            return Control_Applicative.pure(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())((function () {
                if (v instanceof Data_Either.Left) {
                    return new Data_Tuple.Tuple(new Data_Either.Left(v.value0), Control_Category.id(Control_Category.categoryFn));
                };
                if (v instanceof Data_Either.Right) {
                    return new Data_Tuple.Tuple(new Data_Either.Right(v.value0.value0), v.value0.value1);
                };
                throw new Error("Failed pattern match at Control.Monad.Except.Trans line 136, column 10 - line 138, column 44: " + [ v.constructor.name ]);
            })());
        }));
    }));
};
var altExceptT = function (dictSemigroup) {
    return function (dictMonad) {
        return new Control_Alt.Alt(function () {
            return functorExceptT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
        }, function (v) {
            return function (v1) {
                return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(function (v2) {
                    if (v2 instanceof Data_Either.Right) {
                        return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Either.Right(v2.value0));
                    };
                    if (v2 instanceof Data_Either.Left) {
                        return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v1)(function (v3) {
                            if (v3 instanceof Data_Either.Right) {
                                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Either.Right(v3.value0));
                            };
                            if (v3 instanceof Data_Either.Left) {
                                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Either.Left(Data_Semigroup.append(dictSemigroup)(v2.value0)(v3.value0)));
                            };
                            throw new Error("Failed pattern match at Control.Monad.Except.Trans line 88, column 9 - line 90, column 49: " + [ v3.constructor.name ]);
                        });
                    };
                    throw new Error("Failed pattern match at Control.Monad.Except.Trans line 84, column 5 - line 90, column 49: " + [ v2.constructor.name ]);
                });
            };
        });
    };
};
var plusExceptT = function (dictMonoid) {
    return function (dictMonad) {
        return new Control_Plus.Plus(function () {
            return altExceptT(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(dictMonad);
        }, Control_Monad_Error_Class.throwError(monadErrorExceptT(dictMonad))(Data_Monoid.mempty(dictMonoid)));
    };
};
var alternativeExceptT = function (dictMonoid) {
    return function (dictMonad) {
        return new Control_Alternative.Alternative(function () {
            return applicativeExceptT(dictMonad);
        }, function () {
            return plusExceptT(dictMonoid)(dictMonad);
        });
    };
};
var monadZeroExceptT = function (dictMonoid) {
    return function (dictMonad) {
        return new Control_MonadZero.MonadZero(function () {
            return alternativeExceptT(dictMonoid)(dictMonad);
        }, function () {
            return monadExceptT(dictMonad);
        });
    };
};
var monadPlusExceptT = function (dictMonoid) {
    return function (dictMonad) {
        return new Control_MonadPlus.MonadPlus(function () {
            return monadZeroExceptT(dictMonoid)(dictMonad);
        });
    };
};
module.exports = {
    ExceptT: ExceptT, 
    except: except, 
    mapExceptT: mapExceptT, 
    runExceptT: runExceptT, 
    withExceptT: withExceptT, 
    newtypeExceptT: newtypeExceptT, 
    functorExceptT: functorExceptT, 
    applyExceptT: applyExceptT, 
    applicativeExceptT: applicativeExceptT, 
    bindExceptT: bindExceptT, 
    monadExceptT: monadExceptT, 
    monadRecExceptT: monadRecExceptT, 
    altExceptT: altExceptT, 
    plusExceptT: plusExceptT, 
    alternativeExceptT: alternativeExceptT, 
    monadPlusExceptT: monadPlusExceptT, 
    monadZeroExceptT: monadZeroExceptT, 
    monadTransExceptT: monadTransExceptT, 
    monadEffExceptT: monadEffExceptT, 
    monadContExceptT: monadContExceptT, 
    monadErrorExceptT: monadErrorExceptT, 
    monadAskExceptT: monadAskExceptT, 
    monadReaderExceptT: monadReaderExceptT, 
    monadStateExceptT: monadStateExceptT, 
    monadTellExceptT: monadTellExceptT, 
    monadWriterExceptT: monadWriterExceptT
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Monad":82,"../Control.Monad.Cont.Class":52,"../Control.Monad.Eff.Class":54,"../Control.Monad.Error.Class":67,"../Control.Monad.Reader.Class":71,"../Control.Monad.Rec.Class":73,"../Control.Monad.State.Class":76,"../Control.Monad.Trans.Class":79,"../Control.Monad.Writer.Class":80,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Function":121,"../Data.Functor":127,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Semigroup":161,"../Data.Tuple":179,"../Prelude":196}],69:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Control_Monad_Trans_Class = require("../Control.Monad.Trans.Class");
var Data_CatList = require("../Data.CatList");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_Inject = require("../Data.Inject");
var Data_Maybe = require("../Data.Maybe");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Unsafe_Coerce = require("../Unsafe.Coerce");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Functor = require("../Data.Functor");
var Control_Bind = require("../Control.Bind");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Monad = require("../Control.Monad");
var Data_Function = require("../Data.Function");
var Control_Category = require("../Control.Category");
var Data_Semigroup = require("../Data.Semigroup");
var ExpF = function (x) {
    return x;
};
var Free = (function () {
    function Free(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Free.create = function (value0) {
        return function (value1) {
            return new Free(value0, value1);
        };
    };
    return Free;
})();
var Return = (function () {
    function Return(value0) {
        this.value0 = value0;
    };
    Return.create = function (value0) {
        return new Return(value0);
    };
    return Return;
})();
var Bind = (function () {
    function Bind(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Bind.create = function (value0) {
        return function (value1) {
            return new Bind(value0, value1);
        };
    };
    return Bind;
})();
var toView = function (__copy_v) {
    var v = __copy_v;
    tco: while (true) {
        var runExpF = function (v2) {
            return v2;
        };
        var concatF = function (v2) {
            return function (r) {
                return new Free(v2.value0, Data_Semigroup.append(Data_CatList.semigroupCatList)(v2.value1)(r));
            };
        };
        if (v.value0 instanceof Return) {
            var $37 = Data_CatList.uncons(v.value1);
            if ($37 instanceof Data_Maybe.Nothing) {
                return new Return(Unsafe_Coerce.unsafeCoerce(v.value0.value0));
            };
            if ($37 instanceof Data_Maybe.Just) {
                var __tco_v = Unsafe_Coerce.unsafeCoerce(concatF(runExpF($37.value0.value0)(v.value0.value0))($37.value0.value1));
                v = __tco_v;
                continue tco;
            };
            throw new Error("Failed pattern match at Control.Monad.Free line 206, column 7 - line 210, column 64: " + [ $37.constructor.name ]);
        };
        if (v.value0 instanceof Bind) {
            return new Bind(v.value0.value0, function (a) {
                return Unsafe_Coerce.unsafeCoerce(concatF(v.value0.value1(a))(v.value1));
            });
        };
        throw new Error("Failed pattern match at Control.Monad.Free line 204, column 3 - line 212, column 56: " + [ v.value0.constructor.name ]);
    };
};
var runFreeM = function (dictFunctor) {
    return function (dictMonadRec) {
        return function (k) {
            var go = function (f) {
                var $46 = toView(f);
                if ($46 instanceof Return) {
                    return Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_Rec_Class.Done.create)(Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())($46.value0));
                };
                if ($46 instanceof Bind) {
                    return Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_Rec_Class.Loop.create)(k(Data_Functor.map(dictFunctor)($46.value1)($46.value0)));
                };
                throw new Error("Failed pattern match at Control.Monad.Free line 182, column 10 - line 184, column 37: " + [ $46.constructor.name ]);
            };
            return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(go);
        };
    };
};
var runFree = function (dictFunctor) {
    return function (k) {
        var go = function (__copy_f) {
            var f = __copy_f;
            tco: while (true) {
                var $50 = toView(f);
                if ($50 instanceof Return) {
                    return $50.value0;
                };
                if ($50 instanceof Bind) {
                    var __tco_f = k(Data_Functor.map(dictFunctor)($50.value1)($50.value0));
                    f = __tco_f;
                    continue tco;
                };
                throw new Error("Failed pattern match at Control.Monad.Free line 167, column 10 - line 169, column 33: " + [ $50.constructor.name ]);
            };
        };
        return go;
    };
};
var resume = function (dictFunctor) {
    return function (f) {
        var $54 = toView(f);
        if ($54 instanceof Return) {
            return new Data_Either.Right($54.value0);
        };
        if ($54 instanceof Bind) {
            return new Data_Either.Left(Data_Functor.map(dictFunctor)($54.value1)($54.value0));
        };
        throw new Error("Failed pattern match at Control.Monad.Free line 192, column 12 - line 194, column 29: " + [ $54.constructor.name ]);
    };
};
var fromView = function (f) {
    return new Free(Unsafe_Coerce.unsafeCoerce(f), Data_CatList.empty);
};
var suspendF = function (dictApplicative) {
    return function (f) {
        return fromView(new Bind(Unsafe_Coerce.unsafeCoerce(Control_Applicative.pure(dictApplicative)(f)), Unsafe_Coerce.unsafeCoerce));
    };
};
var freeMonad = new Control_Monad.Monad(function () {
    return freeApplicative;
}, function () {
    return freeBind;
});
var freeFunctor = new Data_Functor.Functor(function (k) {
    return function (f) {
        return Control_Bind.bindFlipped(freeBind)(function ($85) {
            return Control_Applicative.pure(freeApplicative)(k($85));
        })(f);
    };
});
var freeBind = new Control_Bind.Bind(function () {
    return freeApply;
}, function (v) {
    return function (k) {
        return new Free(v.value0, Data_CatList.snoc(v.value1)(Unsafe_Coerce.unsafeCoerce(k)));
    };
});
var freeApply = new Control_Apply.Apply(function () {
    return freeFunctor;
}, Control_Monad.ap(freeMonad));
var freeApplicative = new Control_Applicative.Applicative(function () {
    return freeApply;
}, function ($86) {
    return fromView(Return.create($86));
});
var freeMonadRec = new Control_Monad_Rec_Class.MonadRec(function () {
    return freeMonad;
}, function (k) {
    return function (a) {
        return Control_Bind.bind(freeBind)(k(a))(function (v) {
            if (v instanceof Control_Monad_Rec_Class.Loop) {
                return Control_Monad_Rec_Class.tailRecM(freeMonadRec)(k)(v.value0);
            };
            if (v instanceof Control_Monad_Rec_Class.Done) {
                return Control_Applicative.pure(freeApplicative)(v.value0);
            };
            throw new Error("Failed pattern match at Control.Monad.Free line 71, column 26 - line 73, column 21: " + [ v.constructor.name ]);
        });
    };
});
var liftF = function (f) {
    return fromView(new Bind(Unsafe_Coerce.unsafeCoerce(f), function ($87) {
        return Control_Applicative.pure(freeApplicative)(Unsafe_Coerce.unsafeCoerce($87));
    }));
};
var freeMonadTrans = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
    return liftF;
});
var liftFI = function (dictInject) {
    return function (fa) {
        return liftF(Data_Inject.inj(dictInject)(fa));
    };
};
var substFree = function (k) {
    var go = function (f) {
        var $65 = toView(f);
        if ($65 instanceof Return) {
            return Control_Applicative.pure(freeApplicative)($65.value0);
        };
        if ($65 instanceof Bind) {
            return Control_Bind.bind(freeBind)(k($65.value0))(Data_Functor.map(Data_Functor.functorFn)(go)($65.value1));
        };
        throw new Error("Failed pattern match at Control.Monad.Free line 157, column 10 - line 159, column 33: " + [ $65.constructor.name ]);
    };
    return go;
};
var hoistFree = function (k) {
    return substFree(function ($88) {
        return liftF(k($88));
    });
};
var injF = function (dictInject) {
    return hoistFree(Data_Inject.inj(dictInject));
};
var foldableFree = function (dictFunctor) {
    return function (dictFoldable) {
        return new Data_Foldable.Foldable(function (dictMonoid) {
            return function (f) {
                var go = function ($89) {
                    return (function (v) {
                        if (v instanceof Data_Either.Left) {
                            return Data_Foldable.foldMap(dictFoldable)(dictMonoid)(go)(v.value0);
                        };
                        if (v instanceof Data_Either.Right) {
                            return f(v.value0);
                        };
                        throw new Error("Failed pattern match at Control.Monad.Free line 78, column 21 - line 80, column 21: " + [ v.constructor.name ]);
                    })(resume(dictFunctor)($89));
                };
                return go;
            };
        }, function (f) {
            var go = function (r) {
                return function ($90) {
                    return (function (v) {
                        if (v instanceof Data_Either.Left) {
                            return Data_Foldable.foldl(dictFoldable)(go)(r)(v.value0);
                        };
                        if (v instanceof Data_Either.Right) {
                            return f(r)(v.value0);
                        };
                        throw new Error("Failed pattern match at Control.Monad.Free line 83, column 23 - line 85, column 23: " + [ v.constructor.name ]);
                    })(resume(dictFunctor)($90));
                };
            };
            return go;
        }, function (f) {
            var go = function (r) {
                return function ($91) {
                    return (function (v) {
                        if (v instanceof Data_Either.Left) {
                            return Data_Foldable.foldr(dictFoldable)(Data_Function.flip(go))(r)(v.value0);
                        };
                        if (v instanceof Data_Either.Right) {
                            return f(v.value0)(r);
                        };
                        throw new Error("Failed pattern match at Control.Monad.Free line 88, column 23 - line 90, column 23: " + [ v.constructor.name ]);
                    })(resume(dictFunctor)($91));
                };
            };
            return go;
        });
    };
};
var traversableFree = function (dictTraversable) {
    return new Data_Traversable.Traversable(function () {
        return foldableFree(dictTraversable["__superclass_Data.Functor.Functor_0"]())(dictTraversable["__superclass_Data.Foldable.Foldable_1"]());
    }, function () {
        return freeFunctor;
    }, function (dictApplicative) {
        return function (tma) {
            return Data_Traversable.traverse(traversableFree(dictTraversable))(dictApplicative)(Control_Category.id(Control_Category.categoryFn))(tma);
        };
    }, function (dictApplicative) {
        return function (f) {
            var go = function ($92) {
                return (function (v) {
                    if (v instanceof Data_Either.Left) {
                        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(function ($93) {
                            return Control_Bind.join(freeBind)(liftF($93));
                        })(Data_Traversable.traverse(dictTraversable)(dictApplicative)(go)(v.value0));
                    };
                    if (v instanceof Data_Either.Right) {
                        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Applicative.pure(freeApplicative))(f(v.value0));
                    };
                    throw new Error("Failed pattern match at Control.Monad.Free line 95, column 21 - line 97, column 30: " + [ v.constructor.name ]);
                })(resume(dictTraversable["__superclass_Data.Functor.Functor_0"]())($92));
            };
            return go;
        };
    });
};
var foldFree = function (dictMonadRec) {
    return function (k) {
        var go = function (f) {
            var $81 = toView(f);
            if ($81 instanceof Return) {
                return Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_Rec_Class.Done.create)(Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())($81.value0));
            };
            if ($81 instanceof Bind) {
                return Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(function ($94) {
                    return Control_Monad_Rec_Class.Loop.create($81.value1($94));
                })(k($81.value0));
            };
            throw new Error("Failed pattern match at Control.Monad.Free line 147, column 10 - line 149, column 37: " + [ $81.constructor.name ]);
        };
        return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(go);
    };
};
var eqFree = function (dictFunctor) {
    return function (dictEq) {
        return function (dictEq1) {
            return new Data_Eq.Eq(function (x) {
                return function (y) {
                    return Data_Eq.eq(Data_Either.eqEither(dictEq)(dictEq1))(resume(dictFunctor)(x))(resume(dictFunctor)(y));
                };
            });
        };
    };
};
var ordFree = function (dictFunctor) {
    return function (dictOrd) {
        return function (dictOrd1) {
            return new Data_Ord.Ord(function () {
                return eqFree(dictFunctor)(dictOrd["__superclass_Data.Eq.Eq_0"]())(dictOrd1["__superclass_Data.Eq.Eq_0"]());
            }, function (x) {
                return function (y) {
                    return Data_Ord.compare(Data_Either.ordEither(dictOrd)(dictOrd1))(resume(dictFunctor)(x))(resume(dictFunctor)(y));
                };
            });
        };
    };
};
module.exports = {
    foldFree: foldFree, 
    hoistFree: hoistFree, 
    injF: injF, 
    liftF: liftF, 
    liftFI: liftFI, 
    resume: resume, 
    runFree: runFree, 
    runFreeM: runFreeM, 
    substFree: substFree, 
    suspendF: suspendF, 
    eqFree: eqFree, 
    ordFree: ordFree, 
    freeFunctor: freeFunctor, 
    freeBind: freeBind, 
    freeApplicative: freeApplicative, 
    freeApply: freeApply, 
    freeMonad: freeMonad, 
    freeMonadTrans: freeMonadTrans, 
    freeMonadRec: freeMonadRec, 
    foldableFree: foldableFree, 
    traversableFree: traversableFree
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Monad":82,"../Control.Monad.Rec.Class":73,"../Control.Monad.Trans.Class":79,"../Control.Semigroupoid":88,"../Data.CatList":106,"../Data.Either":111,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.Inject":133,"../Data.Maybe":140,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Traversable":178,"../Data.Tuple":179,"../Prelude":196,"../Unsafe.Coerce":223}],70:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Monad_Cont_Class = require("../Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("../Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("../Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Control_Monad_Trans_Class = require("../Control.Monad.Trans.Class");
var Control_Monad_Writer_Class = require("../Control.Monad.Writer.Class");
var Control_MonadPlus = require("../Control.MonadPlus");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Maybe = require("../Data.Maybe");
var Data_Newtype = require("../Data.Newtype");
var Data_Tuple = require("../Data.Tuple");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Monad = require("../Control.Monad");
var Control_Applicative = require("../Control.Applicative");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Bind = require("../Control.Bind");
var Data_Function = require("../Data.Function");
var Control_Category = require("../Control.Category");
var MaybeT = function (x) {
    return x;
};
var runMaybeT = function (v) {
    return v;
};
var newtypeMaybeT = new Data_Newtype.Newtype(function (n) {
    return n;
}, MaybeT);
var monadTransMaybeT = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
    return function ($66) {
        return MaybeT(Control_Monad.liftM1(dictMonad)(Data_Maybe.Just.create)($66));
    };
});
var mapMaybeT = function (f) {
    return function (v) {
        return f(v);
    };
};
var functorMaybeT = function (dictFunctor) {
    return new Data_Functor.Functor(function (f) {
        return function (v) {
            return Data_Functor.map(dictFunctor)(Data_Functor.map(Data_Maybe.functorMaybe)(f))(v);
        };
    });
};
var monadMaybeT = function (dictMonad) {
    return new Control_Monad.Monad(function () {
        return applicativeMaybeT(dictMonad);
    }, function () {
        return bindMaybeT(dictMonad);
    });
};
var bindMaybeT = function (dictMonad) {
    return new Control_Bind.Bind(function () {
        return applyMaybeT(dictMonad);
    }, function (v) {
        return function (f) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(function (v1) {
                if (v1 instanceof Data_Maybe.Nothing) {
                    return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Maybe.Nothing.value);
                };
                if (v1 instanceof Data_Maybe.Just) {
                    var $42 = f(v1.value0);
                    return $42;
                };
                throw new Error("Failed pattern match at Control.Monad.Maybe.Trans line 55, column 11 - line 57, column 42: " + [ v1.constructor.name ]);
            });
        };
    });
};
var applyMaybeT = function (dictMonad) {
    return new Control_Apply.Apply(function () {
        return functorMaybeT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
    }, Control_Monad.ap(monadMaybeT(dictMonad)));
};
var applicativeMaybeT = function (dictMonad) {
    return new Control_Applicative.Applicative(function () {
        return applyMaybeT(dictMonad);
    }, function ($67) {
        return MaybeT(Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Maybe.Just.create($67)));
    });
};
var monadAskMaybeT = function (dictMonadAsk) {
    return new Control_Monad_Reader_Class.MonadAsk(function () {
        return monadMaybeT(dictMonadAsk["__superclass_Control.Monad.Monad_0"]());
    }, Control_Monad_Trans_Class.lift(monadTransMaybeT)(dictMonadAsk["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Reader_Class.ask(dictMonadAsk)));
};
var monadReaderMaybeT = function (dictMonadReader) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadAskMaybeT(dictMonadReader["__superclass_Control.Monad.Reader.Class.MonadAsk_0"]());
    }, function (f) {
        return mapMaybeT(Control_Monad_Reader_Class.local(dictMonadReader)(f));
    });
};
var monadContMaybeT = function (dictMonadCont) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadMaybeT(dictMonadCont["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return MaybeT(Control_Monad_Cont_Class.callCC(dictMonadCont)(function (c) {
            var $44 = f(function (a) {
                return MaybeT(c(new Data_Maybe.Just(a)));
            });
            return $44;
        }));
    });
};
var monadEffMaybe = function (dictMonadEff) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadMaybeT(dictMonadEff["__superclass_Control.Monad.Monad_0"]());
    }, function ($68) {
        return Control_Monad_Trans_Class.lift(monadTransMaybeT)(dictMonadEff["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)($68));
    });
};
var monadErrorMaybeT = function (dictMonadError) {
    return new Control_Monad_Error_Class.MonadError(function () {
        return monadMaybeT(dictMonadError["__superclass_Control.Monad.Monad_0"]());
    }, function (v) {
        return function (h) {
            return MaybeT(Control_Monad_Error_Class.catchError(dictMonadError)(v)(function (a) {
                var $47 = h(a);
                return $47;
            }));
        };
    }, function (e) {
        return Control_Monad_Trans_Class.lift(monadTransMaybeT)(dictMonadError["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Error_Class.throwError(dictMonadError)(e));
    });
};
var monadRecMaybeT = function (dictMonadRec) {
    return new Control_Monad_Rec_Class.MonadRec(function () {
        return monadMaybeT(dictMonadRec["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return function ($69) {
            return MaybeT(Control_Monad_Rec_Class.tailRecM(dictMonadRec)(function (a) {
                return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())((function () {
                    var $48 = f(a);
                    return $48;
                })())(function (m$prime) {
                    return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())((function () {
                        if (m$prime instanceof Data_Maybe.Nothing) {
                            return new Control_Monad_Rec_Class.Done(Data_Maybe.Nothing.value);
                        };
                        if (m$prime instanceof Data_Maybe.Just && m$prime.value0 instanceof Control_Monad_Rec_Class.Loop) {
                            return new Control_Monad_Rec_Class.Loop(m$prime.value0.value0);
                        };
                        if (m$prime instanceof Data_Maybe.Just && m$prime.value0 instanceof Control_Monad_Rec_Class.Done) {
                            return new Control_Monad_Rec_Class.Done(new Data_Maybe.Just(m$prime.value0.value0));
                        };
                        throw new Error("Failed pattern match at Control.Monad.Maybe.Trans line 85, column 16 - line 88, column 43: " + [ m$prime.constructor.name ]);
                    })());
                });
            })($69));
        };
    });
};
var monadStateMaybeT = function (dictMonadState) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadMaybeT(dictMonadState["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return Control_Monad_Trans_Class.lift(monadTransMaybeT)(dictMonadState["__superclass_Control.Monad.Monad_0"]())(Control_Monad_State_Class.state(dictMonadState)(f));
    });
};
var monadTellMaybeT = function (dictMonadTell) {
    return new Control_Monad_Writer_Class.MonadTell(function () {
        return monadMaybeT(dictMonadTell["__superclass_Control.Monad.Monad_0"]());
    }, function ($70) {
        return Control_Monad_Trans_Class.lift(monadTransMaybeT)(dictMonadTell["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Writer_Class.tell(dictMonadTell)($70));
    });
};
var monadWriterMaybeT = function (dictMonadWriter) {
    return new Control_Monad_Writer_Class.MonadWriter(function () {
        return monadTellMaybeT(dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]());
    }, mapMaybeT(function (m) {
        return Control_Bind.bind(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Writer_Class.listen(dictMonadWriter)(m))(function (v) {
            return Control_Applicative.pure(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(Data_Functor.map(Data_Maybe.functorMaybe)(function (r) {
                return new Data_Tuple.Tuple(r, v.value1);
            })(v.value0));
        });
    }), mapMaybeT(function (m) {
        return Control_Monad_Writer_Class.pass(dictMonadWriter)(Control_Bind.bind(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(m)(function (v) {
            return Control_Applicative.pure(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())((function () {
                if (v instanceof Data_Maybe.Nothing) {
                    return new Data_Tuple.Tuple(Data_Maybe.Nothing.value, Control_Category.id(Control_Category.categoryFn));
                };
                if (v instanceof Data_Maybe.Just) {
                    return new Data_Tuple.Tuple(new Data_Maybe.Just(v.value0.value0), v.value0.value1);
                };
                throw new Error("Failed pattern match at Control.Monad.Maybe.Trans line 120, column 10 - line 122, column 42: " + [ v.constructor.name ]);
            })());
        }));
    }));
};
var altMaybeT = function (dictMonad) {
    return new Control_Alt.Alt(function () {
        return functorMaybeT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
    }, function (v) {
        return function (v1) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(function (v2) {
                if (v2 instanceof Data_Maybe.Nothing) {
                    return v1;
                };
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(v2);
            });
        };
    });
};
var plusMaybeT = function (dictMonad) {
    return new Control_Plus.Plus(function () {
        return altMaybeT(dictMonad);
    }, Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Maybe.Nothing.value));
};
var alternativeMaybeT = function (dictMonad) {
    return new Control_Alternative.Alternative(function () {
        return applicativeMaybeT(dictMonad);
    }, function () {
        return plusMaybeT(dictMonad);
    });
};
var monadZeroMaybeT = function (dictMonad) {
    return new Control_MonadZero.MonadZero(function () {
        return alternativeMaybeT(dictMonad);
    }, function () {
        return monadMaybeT(dictMonad);
    });
};
var monadPlusMaybeT = function (dictMonad) {
    return new Control_MonadPlus.MonadPlus(function () {
        return monadZeroMaybeT(dictMonad);
    });
};
module.exports = {
    MaybeT: MaybeT, 
    mapMaybeT: mapMaybeT, 
    runMaybeT: runMaybeT, 
    newtypeMaybeT: newtypeMaybeT, 
    functorMaybeT: functorMaybeT, 
    applyMaybeT: applyMaybeT, 
    applicativeMaybeT: applicativeMaybeT, 
    bindMaybeT: bindMaybeT, 
    monadMaybeT: monadMaybeT, 
    monadTransMaybeT: monadTransMaybeT, 
    altMaybeT: altMaybeT, 
    plusMaybeT: plusMaybeT, 
    alternativeMaybeT: alternativeMaybeT, 
    monadPlusMaybeT: monadPlusMaybeT, 
    monadZeroMaybeT: monadZeroMaybeT, 
    monadRecMaybeT: monadRecMaybeT, 
    monadEffMaybe: monadEffMaybe, 
    monadContMaybeT: monadContMaybeT, 
    monadErrorMaybeT: monadErrorMaybeT, 
    monadAskMaybeT: monadAskMaybeT, 
    monadReaderMaybeT: monadReaderMaybeT, 
    monadStateMaybeT: monadStateMaybeT, 
    monadTellMaybeT: monadTellMaybeT, 
    monadWriterMaybeT: monadWriterMaybeT
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Monad":82,"../Control.Monad.Cont.Class":52,"../Control.Monad.Eff.Class":54,"../Control.Monad.Error.Class":67,"../Control.Monad.Reader.Class":71,"../Control.Monad.Rec.Class":73,"../Control.Monad.State.Class":76,"../Control.Monad.Trans.Class":79,"../Control.Monad.Writer.Class":80,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Function":121,"../Data.Functor":127,"../Data.Maybe":140,"../Data.Newtype":149,"../Data.Tuple":179,"../Prelude":196}],71:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Category = require("../Control.Category");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Monad = require("../Control.Monad");
var Data_Functor = require("../Data.Functor");
var MonadAsk = function (__superclass_Control$dotMonad$dotMonad_0, ask) {
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
    this.ask = ask;
};
var MonadReader = function (__superclass_Control$dotMonad$dotReader$dotClass$dotMonadAsk_0, local) {
    this["__superclass_Control.Monad.Reader.Class.MonadAsk_0"] = __superclass_Control$dotMonad$dotReader$dotClass$dotMonadAsk_0;
    this.local = local;
};
var monadAskFun = new MonadAsk(function () {
    return Control_Monad.monadFn;
}, Control_Category.id(Control_Category.categoryFn));
var monadReaderFun = new MonadReader(function () {
    return monadAskFun;
}, Control_Semigroupoid.composeFlipped(Control_Semigroupoid.semigroupoidFn));
var local = function (dict) {
    return dict.local;
};
var ask = function (dict) {
    return dict.ask;
};
var asks = function (dictMonadAsk) {
    return function (f) {
        return Data_Functor.map((((dictMonadAsk["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(f)(ask(dictMonadAsk));
    };
};
module.exports = {
    MonadAsk: MonadAsk, 
    MonadReader: MonadReader, 
    ask: ask, 
    asks: asks, 
    local: local, 
    monadAskFun: monadAskFun, 
    monadReaderFun: monadReaderFun
};

},{"../Control.Category":41,"../Control.Monad":82,"../Control.Semigroupoid":88,"../Data.Functor":127,"../Prelude":196}],72:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Monad_Cont_Class = require("../Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("../Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("../Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Control_Monad_Trans_Class = require("../Control.Monad.Trans.Class");
var Control_Monad_Writer_Class = require("../Control.Monad.Writer.Class");
var Control_MonadPlus = require("../Control.MonadPlus");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Distributive = require("../Data.Distributive");
var Data_Newtype = require("../Data.Newtype");
var Data_Functor = require("../Data.Functor");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Data_Function = require("../Data.Function");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var ReaderT = function (x) {
    return x;
};
var withReaderT = function (f) {
    return function (v) {
        return function ($53) {
            return v(f($53));
        };
    };
};
var runReaderT = function (v) {
    return v;
};
var newtypeReaderT = new Data_Newtype.Newtype(function (n) {
    return n;
}, ReaderT);
var monadTransReaderT = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
    return function ($54) {
        return ReaderT(Data_Function["const"]($54));
    };
});
var mapReaderT = function (f) {
    return function (v) {
        return function ($55) {
            return f(v($55));
        };
    };
};
var functorReaderT = function (dictFunctor) {
    return new Data_Functor.Functor(function ($56) {
        return mapReaderT(Data_Functor.map(dictFunctor)($56));
    });
};
var distributiveReaderT = function (dictDistributive) {
    return new Data_Distributive.Distributive(function () {
        return functorReaderT(dictDistributive["__superclass_Data.Functor.Functor_0"]());
    }, function (dictFunctor) {
        return function (f) {
            return function ($57) {
                return Data_Distributive.distribute(distributiveReaderT(dictDistributive))(dictFunctor)(Data_Functor.map(dictFunctor)(f)($57));
            };
        };
    }, function (dictFunctor) {
        return function (a) {
            return function (e) {
                return Data_Distributive.collect(dictDistributive)(dictFunctor)(function (r) {
                    return r(e);
                })(a);
            };
        };
    });
};
var applyReaderT = function (dictApply) {
    return new Control_Apply.Apply(function () {
        return functorReaderT(dictApply["__superclass_Data.Functor.Functor_0"]());
    }, function (v) {
        return function (v1) {
            return function (r) {
                return Control_Apply.apply(dictApply)(v(r))(v1(r));
            };
        };
    });
};
var bindReaderT = function (dictBind) {
    return new Control_Bind.Bind(function () {
        return applyReaderT(dictBind["__superclass_Control.Apply.Apply_0"]());
    }, function (v) {
        return function (k) {
            return function (r) {
                return Control_Bind.bind(dictBind)(v(r))(function (a) {
                    var $45 = k(a);
                    return $45(r);
                });
            };
        };
    });
};
var applicativeReaderT = function (dictApplicative) {
    return new Control_Applicative.Applicative(function () {
        return applyReaderT(dictApplicative["__superclass_Control.Apply.Apply_0"]());
    }, function ($58) {
        return ReaderT(Data_Function["const"](Control_Applicative.pure(dictApplicative)($58)));
    });
};
var monadReaderT = function (dictMonad) {
    return new Control_Monad.Monad(function () {
        return applicativeReaderT(dictMonad["__superclass_Control.Applicative.Applicative_0"]());
    }, function () {
        return bindReaderT(dictMonad["__superclass_Control.Bind.Bind_1"]());
    });
};
var monadAskReaderT = function (dictMonad) {
    return new Control_Monad_Reader_Class.MonadAsk(function () {
        return monadReaderT(dictMonad);
    }, Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]()));
};
var monadReaderReaderT = function (dictMonad) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadAskReaderT(dictMonad);
    }, withReaderT);
};
var monadContReaderT = function (dictMonadCont) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadReaderT(dictMonadCont["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return function (r) {
            return Control_Monad_Cont_Class.callCC(dictMonadCont)(function (c) {
                var $46 = f(function ($59) {
                    return ReaderT(Data_Function["const"](c($59)));
                });
                return $46(r);
            });
        };
    });
};
var monadEffReader = function (dictMonadEff) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadReaderT(dictMonadEff["__superclass_Control.Monad.Monad_0"]());
    }, function ($60) {
        return Control_Monad_Trans_Class.lift(monadTransReaderT)(dictMonadEff["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)($60));
    });
};
var monadErrorReaderT = function (dictMonadError) {
    return new Control_Monad_Error_Class.MonadError(function () {
        return monadReaderT(dictMonadError["__superclass_Control.Monad.Monad_0"]());
    }, function (v) {
        return function (h) {
            return function (r) {
                return Control_Monad_Error_Class.catchError(dictMonadError)(v(r))(function (e) {
                    var $49 = h(e);
                    return $49(r);
                });
            };
        };
    }, function ($61) {
        return Control_Monad_Trans_Class.lift(monadTransReaderT)(dictMonadError["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Error_Class.throwError(dictMonadError)($61));
    });
};
var monadRecReaderT = function (dictMonadRec) {
    return new Control_Monad_Rec_Class.MonadRec(function () {
        return monadReaderT(dictMonadRec["__superclass_Control.Monad.Monad_0"]());
    }, function (k) {
        return function (a) {
            var k$prime = function (r) {
                return function (a$prime) {
                    var $50 = k(a$prime);
                    return Control_Bind.bindFlipped((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]()))($50(r));
                };
            };
            return function (r) {
                return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(k$prime(r))(a);
            };
        };
    });
};
var monadStateReaderT = function (dictMonadState) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadReaderT(dictMonadState["__superclass_Control.Monad.Monad_0"]());
    }, function ($62) {
        return Control_Monad_Trans_Class.lift(monadTransReaderT)(dictMonadState["__superclass_Control.Monad.Monad_0"]())(Control_Monad_State_Class.state(dictMonadState)($62));
    });
};
var monadTellReaderT = function (dictMonadTell) {
    return new Control_Monad_Writer_Class.MonadTell(function () {
        return monadReaderT(dictMonadTell["__superclass_Control.Monad.Monad_0"]());
    }, function ($63) {
        return Control_Monad_Trans_Class.lift(monadTransReaderT)(dictMonadTell["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Writer_Class.tell(dictMonadTell)($63));
    });
};
var monadWriterReaderT = function (dictMonadWriter) {
    return new Control_Monad_Writer_Class.MonadWriter(function () {
        return monadTellReaderT(dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]());
    }, mapReaderT(Control_Monad_Writer_Class.listen(dictMonadWriter)), mapReaderT(Control_Monad_Writer_Class.pass(dictMonadWriter)));
};
var altReaderT = function (dictAlt) {
    return new Control_Alt.Alt(function () {
        return functorReaderT(dictAlt["__superclass_Data.Functor.Functor_0"]());
    }, function (v) {
        return function (v1) {
            return function (r) {
                return Control_Alt.alt(dictAlt)(v(r))(v1(r));
            };
        };
    });
};
var plusReaderT = function (dictPlus) {
    return new Control_Plus.Plus(function () {
        return altReaderT(dictPlus["__superclass_Control.Alt.Alt_0"]());
    }, Data_Function["const"](Control_Plus.empty(dictPlus)));
};
var alternativeReaderT = function (dictAlternative) {
    return new Control_Alternative.Alternative(function () {
        return applicativeReaderT(dictAlternative["__superclass_Control.Applicative.Applicative_0"]());
    }, function () {
        return plusReaderT(dictAlternative["__superclass_Control.Plus.Plus_1"]());
    });
};
var monadZeroReaderT = function (dictMonadZero) {
    return new Control_MonadZero.MonadZero(function () {
        return alternativeReaderT(dictMonadZero["__superclass_Control.Alternative.Alternative_1"]());
    }, function () {
        return monadReaderT(dictMonadZero["__superclass_Control.Monad.Monad_0"]());
    });
};
var monadPlusReaderT = function (dictMonadPlus) {
    return new Control_MonadPlus.MonadPlus(function () {
        return monadZeroReaderT(dictMonadPlus["__superclass_Control.MonadZero.MonadZero_0"]());
    });
};
module.exports = {
    ReaderT: ReaderT, 
    mapReaderT: mapReaderT, 
    runReaderT: runReaderT, 
    withReaderT: withReaderT, 
    newtypeReaderT: newtypeReaderT, 
    functorReaderT: functorReaderT, 
    applyReaderT: applyReaderT, 
    applicativeReaderT: applicativeReaderT, 
    altReaderT: altReaderT, 
    plusReaderT: plusReaderT, 
    alternativeReaderT: alternativeReaderT, 
    bindReaderT: bindReaderT, 
    monadReaderT: monadReaderT, 
    monadZeroReaderT: monadZeroReaderT, 
    monadPlusReaderT: monadPlusReaderT, 
    monadTransReaderT: monadTransReaderT, 
    monadEffReader: monadEffReader, 
    monadContReaderT: monadContReaderT, 
    monadErrorReaderT: monadErrorReaderT, 
    monadAskReaderT: monadAskReaderT, 
    monadReaderReaderT: monadReaderReaderT, 
    monadStateReaderT: monadStateReaderT, 
    monadTellReaderT: monadTellReaderT, 
    monadWriterReaderT: monadWriterReaderT, 
    distributiveReaderT: distributiveReaderT, 
    monadRecReaderT: monadRecReaderT
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad":82,"../Control.Monad.Cont.Class":52,"../Control.Monad.Eff.Class":54,"../Control.Monad.Error.Class":67,"../Control.Monad.Reader.Class":71,"../Control.Monad.Rec.Class":73,"../Control.Monad.State.Class":76,"../Control.Monad.Trans.Class":79,"../Control.Monad.Writer.Class":80,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Distributive":110,"../Data.Function":121,"../Data.Functor":127,"../Data.Newtype":149,"../Prelude":196}],73:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Unsafe = require("../Control.Monad.Eff.Unsafe");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Either = require("../Data.Either");
var Data_Identity = require("../Data.Identity");
var Data_Bifunctor = require("../Data.Bifunctor");
var Partial_Unsafe = require("../Partial.Unsafe");
var Data_Functor = require("../Data.Functor");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Bind = require("../Control.Bind");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var Loop = (function () {
    function Loop(value0) {
        this.value0 = value0;
    };
    Loop.create = function (value0) {
        return new Loop(value0);
    };
    return Loop;
})();
var Done = (function () {
    function Done(value0) {
        this.value0 = value0;
    };
    Done.create = function (value0) {
        return new Done(value0);
    };
    return Done;
})();
var MonadRec = function (__superclass_Control$dotMonad$dotMonad_0, tailRecM) {
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
    this.tailRecM = tailRecM;
};
var tailRecM = function (dict) {
    return dict.tailRecM;
};
var tailRecM2 = function (dictMonadRec) {
    return function (f) {
        return function (a) {
            return function (b) {
                return tailRecM(dictMonadRec)(function (o) {
                    return f(o.a)(o.b);
                })({
                    a: a, 
                    b: b
                });
            };
        };
    };
};
var tailRecM3 = function (dictMonadRec) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return tailRecM(dictMonadRec)(function (o) {
                        return f(o.a)(o.b)(o.c);
                    })({
                        a: a, 
                        b: b, 
                        c: c
                    });
                };
            };
        };
    };
};
var tailRecEff = function (f) {
    return function (a) {
        var fromDone = function (v) {
            var __unused = function (dictPartial1) {
                return function ($dollar16) {
                    return $dollar16;
                };
            };
            return __unused()((function () {
                if (v instanceof Done) {
                    return v.value0;
                };
                throw new Error("Failed pattern match at Control.Monad.Rec.Class line 130, column 28 - line 130, column 42: " + [ v.constructor.name ]);
            })());
        };
        var f$prime = function ($49) {
            return Control_Monad_Eff_Unsafe.unsafeCoerceEff(f($49));
        };
        return function __do() {
            var v = f$prime(a)();
            var v1 = {
                value: v
            };
            (function () {
                while (!(function __do() {
                    var v2 = v1.value;
                    if (v2 instanceof Loop) {
                        var v3 = f$prime(v2.value0)();
                        var v4 = v1.value = v3;
                        return false;
                    };
                    if (v2 instanceof Done) {
                        return true;
                    };
                    throw new Error("Failed pattern match at Control.Monad.Rec.Class line 119, column 5 - line 124, column 26: " + [ v2.constructor.name ]);
                })()) {

                };
                return {};
            })();
            return Data_Functor.map(Control_Monad_Eff.functorEff)(fromDone)(Control_Monad_ST.readSTRef(v1))();
        };
    };
};
var tailRec = function (f) {
    var go = function (__copy_v) {
        var v = __copy_v;
        tco: while (true) {
            if (v instanceof Loop) {
                var __tco_v = f(v.value0);
                v = __tco_v;
                continue tco;
            };
            if (v instanceof Done) {
                return v.value0;
            };
            throw new Error("Failed pattern match at Control.Monad.Rec.Class line 93, column 1 - line 96, column 18: " + [ v.constructor.name ]);
        };
    };
    return function ($50) {
        return go(f($50));
    };
};
var monadRecIdentity = new MonadRec(function () {
    return Data_Identity.monadIdentity;
}, function (f) {
    var runIdentity = function (v) {
        return v;
    };
    return function ($51) {
        return Data_Identity.Identity(tailRec(function ($52) {
            return runIdentity(f($52));
        })($51));
    };
});
var monadRecEither = new MonadRec(function () {
    return Data_Either.monadEither;
}, function (f) {
    return function (a0) {
        var g = function (v) {
            if (v instanceof Data_Either.Left) {
                return new Done(new Data_Either.Left(v.value0));
            };
            if (v instanceof Data_Either.Right && v.value0 instanceof Loop) {
                return new Loop(f(v.value0.value0));
            };
            if (v instanceof Data_Either.Right && v.value0 instanceof Done) {
                return new Done(new Data_Either.Right(v.value0.value0));
            };
            throw new Error("Failed pattern match at Control.Monad.Rec.Class line 108, column 7 - line 108, column 33: " + [ v.constructor.name ]);
        };
        return tailRec(g)(f(a0));
    };
});
var monadRecEff = new MonadRec(function () {
    return Control_Monad_Eff.monadEff;
}, tailRecEff);
var functorStep = new Data_Functor.Functor(function (f) {
    return function (v) {
        if (v instanceof Loop) {
            return new Loop(v.value0);
        };
        if (v instanceof Done) {
            return new Done(f(v.value0));
        };
        throw new Error("Failed pattern match at Control.Monad.Rec.Class line 28, column 3 - line 28, column 26: " + [ f.constructor.name, v.constructor.name ]);
    };
});
var forever = function (dictMonadRec) {
    return function (ma) {
        return tailRecM(dictMonadRec)(function (u) {
            return Data_Functor.voidRight((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(new Loop(u))(ma);
        })(Data_Unit.unit);
    };
};
var bifunctorStep = new Data_Bifunctor.Bifunctor(function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Loop) {
                return new Loop(v(v2.value0));
            };
            if (v2 instanceof Done) {
                return new Done(v1(v2.value0));
            };
            throw new Error("Failed pattern match at Control.Monad.Rec.Class line 32, column 3 - line 32, column 34: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
});
module.exports = {
    Loop: Loop, 
    Done: Done, 
    MonadRec: MonadRec, 
    forever: forever, 
    tailRec: tailRec, 
    tailRecM: tailRecM, 
    tailRecM2: tailRecM2, 
    tailRecM3: tailRecM3, 
    functorStep: functorStep, 
    bifunctorStep: bifunctorStep, 
    monadRecIdentity: monadRecIdentity, 
    monadRecEff: monadRecEff, 
    monadRecEither: monadRecEither
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Eff":66,"../Control.Monad.Eff.Unsafe":64,"../Control.Monad.ST":75,"../Control.Semigroupoid":88,"../Data.Bifunctor":100,"../Data.Either":111,"../Data.Functor":127,"../Data.Identity":132,"../Data.Unit":183,"../Partial.Unsafe":193,"../Prelude":196}],74:[function(require,module,exports){
"use strict";

exports.newSTRef = function (val) {
  return function () {
    return { value: val };
  };
};

exports.readSTRef = function (ref) {
  return function () {
    return ref.value;
  };
};

exports.modifySTRef = function (ref) {
  return function (f) {
    return function () {
      /* jshint boss: true */
      return ref.value = f(ref.value);
    };
  };
};

exports.writeSTRef = function (ref) {
  return function (a) {
    return function () {
      /* jshint boss: true */
      return ref.value = a;
    };
  };
};

exports.runST = function (f) {
  return f;
};

},{}],75:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var pureST = function (st) {
    return Control_Monad_Eff.runPure($foreign.runST(st));
};
module.exports = {
    pureST: pureST, 
    modifySTRef: $foreign.modifySTRef, 
    newSTRef: $foreign.newSTRef, 
    readSTRef: $foreign.readSTRef, 
    runST: $foreign.runST, 
    writeSTRef: $foreign.writeSTRef
};

},{"../Control.Monad.Eff":66,"./foreign":74}],76:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Tuple = require("../Data.Tuple");
var Data_Unit = require("../Data.Unit");
var MonadState = function (__superclass_Control$dotMonad$dotMonad_0, state) {
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
    this.state = state;
};
var state = function (dict) {
    return dict.state;
};
var put = function (dictMonadState) {
    return function (s) {
        return state(dictMonadState)(function (v) {
            return new Data_Tuple.Tuple(Data_Unit.unit, s);
        });
    };
};
var modify = function (dictMonadState) {
    return function (f) {
        return state(dictMonadState)(function (s) {
            return new Data_Tuple.Tuple(Data_Unit.unit, f(s));
        });
    };
};
var gets = function (dictMonadState) {
    return function (f) {
        return state(dictMonadState)(function (s) {
            return new Data_Tuple.Tuple(f(s), s);
        });
    };
};
var get = function (dictMonadState) {
    return state(dictMonadState)(function (s) {
        return new Data_Tuple.Tuple(s, s);
    });
};
module.exports = {
    MonadState: MonadState, 
    get: get, 
    gets: gets, 
    modify: modify, 
    put: put, 
    state: state
};

},{"../Data.Tuple":179,"../Data.Unit":183,"../Prelude":196}],77:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Lazy = require("../Control.Lazy");
var Control_Monad_Cont_Class = require("../Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("../Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("../Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Control_Monad_Trans_Class = require("../Control.Monad.Trans.Class");
var Control_Monad_Writer_Class = require("../Control.Monad.Writer.Class");
var Control_MonadPlus = require("../Control.MonadPlus");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Newtype = require("../Data.Newtype");
var Data_Tuple = require("../Data.Tuple");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Monad = require("../Control.Monad");
var Control_Applicative = require("../Control.Applicative");
var Data_Function = require("../Data.Function");
var Control_Bind = require("../Control.Bind");
var Data_Unit = require("../Data.Unit");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var StateT = function (x) {
    return x;
};
var withStateT = function (f) {
    return function (v) {
        return function ($97) {
            return v(f($97));
        };
    };
};
var runStateT = function (v) {
    return v;
};
var newtypeStateT = new Data_Newtype.Newtype(function (n) {
    return n;
}, StateT);
var monadTransStateT = new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
    return function (m) {
        return function (s) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(m)(function (v) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(v, s));
            });
        };
    };
});
var mapStateT = function (f) {
    return function (v) {
        return function ($98) {
            return f(v($98));
        };
    };
};
var lazyStateT = new Control_Lazy.Lazy(function (f) {
    return function (s) {
        var $52 = f(Data_Unit.unit);
        return $52(s);
    };
});
var functorStateT = function (dictFunctor) {
    return new Data_Functor.Functor(function (f) {
        return function (v) {
            return function (s) {
                return Data_Functor.map(dictFunctor)(function (v1) {
                    return new Data_Tuple.Tuple(f(v1.value0), v1.value1);
                })(v(s));
            };
        };
    });
};
var execStateT = function (dictFunctor) {
    return function (v) {
        return function (s) {
            return Data_Functor.map(dictFunctor)(Data_Tuple.snd)(v(s));
        };
    };
};
var evalStateT = function (dictFunctor) {
    return function (v) {
        return function (s) {
            return Data_Functor.map(dictFunctor)(Data_Tuple.fst)(v(s));
        };
    };
};
var monadStateT = function (dictMonad) {
    return new Control_Monad.Monad(function () {
        return applicativeStateT(dictMonad);
    }, function () {
        return bindStateT(dictMonad);
    });
};
var bindStateT = function (dictMonad) {
    return new Control_Bind.Bind(function () {
        return applyStateT(dictMonad);
    }, function (v) {
        return function (f) {
            return function (s) {
                return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v(s))(function (v1) {
                    var $65 = f(v1.value0);
                    return $65(v1.value1);
                });
            };
        };
    });
};
var applyStateT = function (dictMonad) {
    return new Control_Apply.Apply(function () {
        return functorStateT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
    }, Control_Monad.ap(monadStateT(dictMonad)));
};
var applicativeStateT = function (dictMonad) {
    return new Control_Applicative.Applicative(function () {
        return applyStateT(dictMonad);
    }, function (a) {
        return function (s) {
            return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(a, s));
        };
    });
};
var monadAskStateT = function (dictMonadAsk) {
    return new Control_Monad_Reader_Class.MonadAsk(function () {
        return monadStateT(dictMonadAsk["__superclass_Control.Monad.Monad_0"]());
    }, Control_Monad_Trans_Class.lift(monadTransStateT)(dictMonadAsk["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Reader_Class.ask(dictMonadAsk)));
};
var monadReaderStateT = function (dictMonadReader) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadAskStateT(dictMonadReader["__superclass_Control.Monad.Reader.Class.MonadAsk_0"]());
    }, function ($99) {
        return mapStateT(Control_Monad_Reader_Class.local(dictMonadReader)($99));
    });
};
var monadContStateT = function (dictMonadCont) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadStateT(dictMonadCont["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return function (s) {
            return Control_Monad_Cont_Class.callCC(dictMonadCont)(function (c) {
                var $68 = f(function (a) {
                    return function (s$prime) {
                        return c(new Data_Tuple.Tuple(a, s$prime));
                    };
                });
                return $68(s);
            });
        };
    });
};
var monadEffState = function (dictMonadEff) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadStateT(dictMonadEff["__superclass_Control.Monad.Monad_0"]());
    }, function ($100) {
        return Control_Monad_Trans_Class.lift(monadTransStateT)(dictMonadEff["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)($100));
    });
};
var monadErrorStateT = function (dictMonadError) {
    return new Control_Monad_Error_Class.MonadError(function () {
        return monadStateT(dictMonadError["__superclass_Control.Monad.Monad_0"]());
    }, function (v) {
        return function (h) {
            return function (s) {
                return Control_Monad_Error_Class.catchError(dictMonadError)(v(s))(function (e) {
                    var $71 = h(e);
                    return $71(s);
                });
            };
        };
    }, function (e) {
        return Control_Monad_Trans_Class.lift(monadTransStateT)(dictMonadError["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Error_Class.throwError(dictMonadError)(e));
    });
};
var monadRecStateT = function (dictMonadRec) {
    return new Control_Monad_Rec_Class.MonadRec(function () {
        return monadStateT(dictMonadRec["__superclass_Control.Monad.Monad_0"]());
    }, function (f) {
        return function (a) {
            var f$prime = function (v) {
                return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())((function () {
                    var $73 = f(v.value0);
                    return $73;
                })()(v.value1))(function (v1) {
                    return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())((function () {
                        if (v1.value0 instanceof Control_Monad_Rec_Class.Loop) {
                            return new Control_Monad_Rec_Class.Loop(new Data_Tuple.Tuple(v1.value0.value0, v1.value1));
                        };
                        if (v1.value0 instanceof Control_Monad_Rec_Class.Done) {
                            return new Control_Monad_Rec_Class.Done(new Data_Tuple.Tuple(v1.value0.value0, v1.value1));
                        };
                        throw new Error("Failed pattern match at Control.Monad.State.Trans line 88, column 16 - line 90, column 40: " + [ v1.value0.constructor.name ]);
                    })());
                });
            };
            return function (s) {
                return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(f$prime)(new Data_Tuple.Tuple(a, s));
            };
        };
    });
};
var monadStateStateT = function (dictMonad) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadStateT(dictMonad);
    }, function (f) {
        return StateT(function ($101) {
            return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(f($101));
        });
    });
};
var monadTellStateT = function (dictMonadTell) {
    return new Control_Monad_Writer_Class.MonadTell(function () {
        return monadStateT(dictMonadTell["__superclass_Control.Monad.Monad_0"]());
    }, function ($102) {
        return Control_Monad_Trans_Class.lift(monadTransStateT)(dictMonadTell["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Writer_Class.tell(dictMonadTell)($102));
    });
};
var monadWriterStateT = function (dictMonadWriter) {
    return new Control_Monad_Writer_Class.MonadWriter(function () {
        return monadTellStateT(dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]());
    }, function (m) {
        return function (s) {
            return Control_Bind.bind(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Writer_Class.listen(dictMonadWriter)(m(s)))(function (v) {
                return Control_Applicative.pure(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(new Data_Tuple.Tuple(v.value0.value0, v.value1), v.value0.value1));
            });
        };
    }, function (m) {
        return function (s) {
            return Control_Monad_Writer_Class.pass(dictMonadWriter)(Control_Bind.bind(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(m(s))(function (v) {
                return Control_Applicative.pure(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(new Data_Tuple.Tuple(v.value0.value0, v.value1), v.value0.value1));
            }));
        };
    });
};
var altStateT = function (dictMonad) {
    return function (dictAlt) {
        return new Control_Alt.Alt(function () {
            return functorStateT(dictAlt["__superclass_Data.Functor.Functor_0"]());
        }, function (v) {
            return function (v1) {
                return function (s) {
                    return Control_Alt.alt(dictAlt)(v(s))(v1(s));
                };
            };
        });
    };
};
var plusStateT = function (dictMonad) {
    return function (dictPlus) {
        return new Control_Plus.Plus(function () {
            return altStateT(dictMonad)(dictPlus["__superclass_Control.Alt.Alt_0"]());
        }, function (v) {
            return Control_Plus.empty(dictPlus);
        });
    };
};
var alternativeStateT = function (dictMonad) {
    return function (dictAlternative) {
        return new Control_Alternative.Alternative(function () {
            return applicativeStateT(dictMonad);
        }, function () {
            return plusStateT(dictMonad)(dictAlternative["__superclass_Control.Plus.Plus_1"]());
        });
    };
};
var monadZeroStateT = function (dictMonadZero) {
    return new Control_MonadZero.MonadZero(function () {
        return alternativeStateT(dictMonadZero["__superclass_Control.Monad.Monad_0"]())(dictMonadZero["__superclass_Control.Alternative.Alternative_1"]());
    }, function () {
        return monadStateT(dictMonadZero["__superclass_Control.Monad.Monad_0"]());
    });
};
var monadPlusStateT = function (dictMonadPlus) {
    return new Control_MonadPlus.MonadPlus(function () {
        return monadZeroStateT(dictMonadPlus["__superclass_Control.MonadZero.MonadZero_0"]());
    });
};
module.exports = {
    StateT: StateT, 
    evalStateT: evalStateT, 
    execStateT: execStateT, 
    mapStateT: mapStateT, 
    runStateT: runStateT, 
    withStateT: withStateT, 
    newtypeStateT: newtypeStateT, 
    functorStateT: functorStateT, 
    applyStateT: applyStateT, 
    applicativeStateT: applicativeStateT, 
    altStateT: altStateT, 
    plusStateT: plusStateT, 
    alternativeStateT: alternativeStateT, 
    bindStateT: bindStateT, 
    monadStateT: monadStateT, 
    monadRecStateT: monadRecStateT, 
    monadZeroStateT: monadZeroStateT, 
    monadPlusStateT: monadPlusStateT, 
    monadTransStateT: monadTransStateT, 
    lazyStateT: lazyStateT, 
    monadEffState: monadEffState, 
    monadContStateT: monadContStateT, 
    monadErrorStateT: monadErrorStateT, 
    monadAskStateT: monadAskStateT, 
    monadReaderStateT: monadReaderStateT, 
    monadStateStateT: monadStateStateT, 
    monadTellStateT: monadTellStateT, 
    monadWriterStateT: monadWriterStateT
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Lazy":45,"../Control.Monad":82,"../Control.Monad.Cont.Class":52,"../Control.Monad.Eff.Class":54,"../Control.Monad.Error.Class":67,"../Control.Monad.Reader.Class":71,"../Control.Monad.Rec.Class":73,"../Control.Monad.State.Class":76,"../Control.Monad.Trans.Class":79,"../Control.Monad.Writer.Class":80,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Function":121,"../Data.Functor":127,"../Data.Newtype":149,"../Data.Tuple":179,"../Data.Unit":183,"../Prelude":196}],78:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Control_Monad_State_Trans = require("../Control.Monad.State.Trans");
var Data_Identity = require("../Data.Identity");
var Data_Newtype = require("../Data.Newtype");
var Data_Tuple = require("../Data.Tuple");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var withState = Control_Monad_State_Trans.withStateT;
var runState = function (v) {
    return function ($14) {
        return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(v($14));
    };
};
var mapState = function (f) {
    return Control_Monad_State_Trans.mapStateT(function ($15) {
        return Data_Identity.Identity(f(Data_Newtype.unwrap(Data_Identity.newtypeIdentity)($15)));
    });
};
var execState = function (v) {
    return function (s) {
        var $6 = v(s);
        return $6.value1;
    };
};
var evalState = function (v) {
    return function (s) {
        var $11 = v(s);
        return $11.value0;
    };
};
module.exports = {
    evalState: evalState, 
    execState: execState, 
    mapState: mapState, 
    runState: runState, 
    withState: withState
};

},{"../Control.Monad.State.Class":76,"../Control.Monad.State.Trans":77,"../Control.Semigroupoid":88,"../Data.Identity":132,"../Data.Newtype":149,"../Data.Tuple":179,"../Prelude":196}],79:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var MonadTrans = function (lift) {
    this.lift = lift;
};
var lift = function (dict) {
    return dict.lift;
};
module.exports = {
    MonadTrans: MonadTrans, 
    lift: lift
};

},{"../Prelude":196}],80:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Tuple = require("../Data.Tuple");
var Control_Bind = require("../Control.Bind");
var Data_Function = require("../Data.Function");
var Control_Applicative = require("../Control.Applicative");
var MonadTell = function (__superclass_Control$dotMonad$dotMonad_0, tell) {
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
    this.tell = tell;
};
var MonadWriter = function (__superclass_Control$dotMonad$dotWriter$dotClass$dotMonadTell_0, listen, pass) {
    this["__superclass_Control.Monad.Writer.Class.MonadTell_0"] = __superclass_Control$dotMonad$dotWriter$dotClass$dotMonadTell_0;
    this.listen = listen;
    this.pass = pass;
};
var tell = function (dict) {
    return dict.tell;
};
var pass = function (dict) {
    return dict.pass;
};
var listen = function (dict) {
    return dict.listen;
};
var listens = function (dictMonadWriter) {
    return function (f) {
        return function (m) {
            return Control_Bind.bind(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(listen(dictMonadWriter)(m))(function (v) {
                return Control_Applicative.pure(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(v.value0, f(v.value1)));
            });
        };
    };
};
var censor = function (dictMonadWriter) {
    return function (f) {
        return function (m) {
            return pass(dictMonadWriter)(Control_Bind.bind(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(m)(function (v) {
                return Control_Applicative.pure(((dictMonadWriter["__superclass_Control.Monad.Writer.Class.MonadTell_0"]())["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(v, f));
            }));
        };
    };
};
module.exports = {
    MonadTell: MonadTell, 
    MonadWriter: MonadWriter, 
    censor: censor, 
    listen: listen, 
    listens: listens, 
    pass: pass, 
    tell: tell
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Data.Function":121,"../Data.Tuple":179,"../Prelude":196}],81:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Monad_Cont_Class = require("../Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("../Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("../Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Control_Monad_Trans_Class = require("../Control.Monad.Trans.Class");
var Control_Monad_Writer_Class = require("../Control.Monad.Writer.Class");
var Control_MonadPlus = require("../Control.MonadPlus");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Tuple = require("../Data.Tuple");
var Data_Functor = require("../Data.Functor");
var Data_Function = require("../Data.Function");
var Control_Apply = require("../Control.Apply");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Unit = require("../Data.Unit");
var WriterT = function (x) {
    return x;
};
var runWriterT = function (v) {
    return v;
};
var newtypeWriterT = new Data_Newtype.Newtype(function (n) {
    return n;
}, WriterT);
var monadTransWriterT = function (dictMonoid) {
    return new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
        return function (m) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(m)(function (v) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(v, Data_Monoid.mempty(dictMonoid)));
            });
        };
    });
};
var mapWriterT = function (f) {
    return function (v) {
        return f(v);
    };
};
var functorWriterT = function (dictFunctor) {
    return new Data_Functor.Functor(function (f) {
        return mapWriterT(Data_Functor.map(dictFunctor)(function (v) {
            return new Data_Tuple.Tuple(f(v.value0), v.value1);
        }));
    });
};
var execWriterT = function (dictFunctor) {
    return function (v) {
        return Data_Functor.map(dictFunctor)(Data_Tuple.snd)(v);
    };
};
var applyWriterT = function (dictSemigroup) {
    return function (dictApply) {
        return new Control_Apply.Apply(function () {
            return functorWriterT(dictApply["__superclass_Data.Functor.Functor_0"]());
        }, function (v) {
            return function (v1) {
                var k = function (v3) {
                    return function (v4) {
                        return new Data_Tuple.Tuple(v3.value0(v4.value0), Data_Semigroup.append(dictSemigroup)(v3.value1)(v4.value1));
                    };
                };
                return Control_Apply.apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(k)(v))(v1);
            };
        });
    };
};
var bindWriterT = function (dictSemigroup) {
    return function (dictBind) {
        return new Control_Bind.Bind(function () {
            return applyWriterT(dictSemigroup)(dictBind["__superclass_Control.Apply.Apply_0"]());
        }, function (v) {
            return function (k) {
                return WriterT(Control_Bind.bind(dictBind)(v)(function (v1) {
                    var $81 = k(v1.value0);
                    return Data_Functor.map((dictBind["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(function (v2) {
                        return new Data_Tuple.Tuple(v2.value0, Data_Semigroup.append(dictSemigroup)(v1.value1)(v2.value1));
                    })($81);
                }));
            };
        });
    };
};
var applicativeWriterT = function (dictMonoid) {
    return function (dictApplicative) {
        return new Control_Applicative.Applicative(function () {
            return applyWriterT(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(dictApplicative["__superclass_Control.Apply.Apply_0"]());
        }, function (a) {
            return WriterT(Control_Applicative.pure(dictApplicative)(new Data_Tuple.Tuple(a, Data_Monoid.mempty(dictMonoid))));
        });
    };
};
var monadWriterT = function (dictMonoid) {
    return function (dictMonad) {
        return new Control_Monad.Monad(function () {
            return applicativeWriterT(dictMonoid)(dictMonad["__superclass_Control.Applicative.Applicative_0"]());
        }, function () {
            return bindWriterT(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(dictMonad["__superclass_Control.Bind.Bind_1"]());
        });
    };
};
var monadAskWriterT = function (dictMonoid) {
    return function (dictMonadAsk) {
        return new Control_Monad_Reader_Class.MonadAsk(function () {
            return monadWriterT(dictMonoid)(dictMonadAsk["__superclass_Control.Monad.Monad_0"]());
        }, Control_Monad_Trans_Class.lift(monadTransWriterT(dictMonoid))(dictMonadAsk["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Reader_Class.ask(dictMonadAsk)));
    };
};
var monadReaderWriterT = function (dictMonoid) {
    return function (dictMonadReader) {
        return new Control_Monad_Reader_Class.MonadReader(function () {
            return monadAskWriterT(dictMonoid)(dictMonadReader["__superclass_Control.Monad.Reader.Class.MonadAsk_0"]());
        }, function (f) {
            return mapWriterT(Control_Monad_Reader_Class.local(dictMonadReader)(f));
        });
    };
};
var monadContWriterT = function (dictMonoid) {
    return function (dictMonadCont) {
        return new Control_Monad_Cont_Class.MonadCont(function () {
            return monadWriterT(dictMonoid)(dictMonadCont["__superclass_Control.Monad.Monad_0"]());
        }, function (f) {
            return WriterT(Control_Monad_Cont_Class.callCC(dictMonadCont)(function (c) {
                var $87 = f(function (a) {
                    return WriterT(c(new Data_Tuple.Tuple(a, Data_Monoid.mempty(dictMonoid))));
                });
                return $87;
            }));
        });
    };
};
var monadEffWriter = function (dictMonoid) {
    return function (dictMonadEff) {
        return new Control_Monad_Eff_Class.MonadEff(function () {
            return monadWriterT(dictMonoid)(dictMonadEff["__superclass_Control.Monad.Monad_0"]());
        }, function ($113) {
            return Control_Monad_Trans_Class.lift(monadTransWriterT(dictMonoid))(dictMonadEff["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)($113));
        });
    };
};
var monadErrorWriterT = function (dictMonoid) {
    return function (dictMonadError) {
        return new Control_Monad_Error_Class.MonadError(function () {
            return monadWriterT(dictMonoid)(dictMonadError["__superclass_Control.Monad.Monad_0"]());
        }, function (v) {
            return function (h) {
                return WriterT(Control_Monad_Error_Class.catchError(dictMonadError)(v)(function (e) {
                    var $90 = h(e);
                    return $90;
                }));
            };
        }, function (e) {
            return Control_Monad_Trans_Class.lift(monadTransWriterT(dictMonoid))(dictMonadError["__superclass_Control.Monad.Monad_0"]())(Control_Monad_Error_Class.throwError(dictMonadError)(e));
        });
    };
};
var monadRecWriterT = function (dictMonoid) {
    return function (dictMonadRec) {
        return new Control_Monad_Rec_Class.MonadRec(function () {
            return monadWriterT(dictMonoid)(dictMonadRec["__superclass_Control.Monad.Monad_0"]());
        }, function (f) {
            return function (a) {
                var f$prime = function (v) {
                    return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())((function () {
                        var $92 = f(v.value0);
                        return $92;
                    })())(function (v1) {
                        return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())((function () {
                            if (v1.value0 instanceof Control_Monad_Rec_Class.Loop) {
                                return new Control_Monad_Rec_Class.Loop(new Data_Tuple.Tuple(v1.value0.value0, Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(v.value1)(v1.value1)));
                            };
                            if (v1.value0 instanceof Control_Monad_Rec_Class.Done) {
                                return new Control_Monad_Rec_Class.Done(new Data_Tuple.Tuple(v1.value0.value0, Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(v.value1)(v1.value1)));
                            };
                            throw new Error("Failed pattern match at Control.Monad.Writer.Trans line 85, column 16 - line 87, column 47: " + [ v1.value0.constructor.name ]);
                        })());
                    });
                };
                return WriterT(Control_Monad_Rec_Class.tailRecM(dictMonadRec)(f$prime)(new Data_Tuple.Tuple(a, Data_Monoid.mempty(dictMonoid))));
            };
        });
    };
};
var monadStateWriterT = function (dictMonoid) {
    return function (dictMonadState) {
        return new Control_Monad_State_Class.MonadState(function () {
            return monadWriterT(dictMonoid)(dictMonadState["__superclass_Control.Monad.Monad_0"]());
        }, function (f) {
            return Control_Monad_Trans_Class.lift(monadTransWriterT(dictMonoid))(dictMonadState["__superclass_Control.Monad.Monad_0"]())(Control_Monad_State_Class.state(dictMonadState)(f));
        });
    };
};
var monadTellWriterT = function (dictMonoid) {
    return function (dictMonad) {
        return new Control_Monad_Writer_Class.MonadTell(function () {
            return monadWriterT(dictMonoid)(dictMonad);
        }, function ($114) {
            return WriterT(Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Tuple.Tuple.create(Data_Unit.unit)($114)));
        });
    };
};
var monadWriterWriterT = function (dictMonoid) {
    return function (dictMonad) {
        return new Control_Monad_Writer_Class.MonadWriter(function () {
            return monadTellWriterT(dictMonoid)(dictMonad);
        }, function (v) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(function (v1) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(new Data_Tuple.Tuple(v1.value0, v1.value1), v1.value1));
            });
        }, function (v) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(function (v1) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(v1.value0.value0, v1.value0.value1(v1.value1)));
            });
        });
    };
};
var altWriterT = function (dictAlt) {
    return new Control_Alt.Alt(function () {
        return functorWriterT(dictAlt["__superclass_Data.Functor.Functor_0"]());
    }, function (v) {
        return function (v1) {
            return Control_Alt.alt(dictAlt)(v)(v1);
        };
    });
};
var plusWriterT = function (dictPlus) {
    return new Control_Plus.Plus(function () {
        return altWriterT(dictPlus["__superclass_Control.Alt.Alt_0"]());
    }, Control_Plus.empty(dictPlus));
};
var alternativeWriterT = function (dictMonoid) {
    return function (dictAlternative) {
        return new Control_Alternative.Alternative(function () {
            return applicativeWriterT(dictMonoid)(dictAlternative["__superclass_Control.Applicative.Applicative_0"]());
        }, function () {
            return plusWriterT(dictAlternative["__superclass_Control.Plus.Plus_1"]());
        });
    };
};
var monadZeroWriterT = function (dictMonoid) {
    return function (dictMonadZero) {
        return new Control_MonadZero.MonadZero(function () {
            return alternativeWriterT(dictMonoid)(dictMonadZero["__superclass_Control.Alternative.Alternative_1"]());
        }, function () {
            return monadWriterT(dictMonoid)(dictMonadZero["__superclass_Control.Monad.Monad_0"]());
        });
    };
};
var monadPlusWriterT = function (dictMonoid) {
    return function (dictMonadPlus) {
        return new Control_MonadPlus.MonadPlus(function () {
            return monadZeroWriterT(dictMonoid)(dictMonadPlus["__superclass_Control.MonadZero.MonadZero_0"]());
        });
    };
};
module.exports = {
    WriterT: WriterT, 
    execWriterT: execWriterT, 
    mapWriterT: mapWriterT, 
    runWriterT: runWriterT, 
    newtypeWriterT: newtypeWriterT, 
    functorWriterT: functorWriterT, 
    applyWriterT: applyWriterT, 
    applicativeWriterT: applicativeWriterT, 
    altWriterT: altWriterT, 
    plusWriterT: plusWriterT, 
    alternativeWriterT: alternativeWriterT, 
    bindWriterT: bindWriterT, 
    monadWriterT: monadWriterT, 
    monadRecWriterT: monadRecWriterT, 
    monadZeroWriterT: monadZeroWriterT, 
    monadPlusWriterT: monadPlusWriterT, 
    monadTransWriterT: monadTransWriterT, 
    monadEffWriter: monadEffWriter, 
    monadContWriterT: monadContWriterT, 
    monadErrorWriterT: monadErrorWriterT, 
    monadAskWriterT: monadAskWriterT, 
    monadReaderWriterT: monadReaderWriterT, 
    monadStateWriterT: monadStateWriterT, 
    monadTellWriterT: monadTellWriterT, 
    monadWriterWriterT: monadWriterWriterT
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad":82,"../Control.Monad.Cont.Class":52,"../Control.Monad.Eff.Class":54,"../Control.Monad.Error.Class":67,"../Control.Monad.Reader.Class":71,"../Control.Monad.Rec.Class":73,"../Control.Monad.State.Class":76,"../Control.Monad.Trans.Class":79,"../Control.Monad.Writer.Class":80,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Function":121,"../Data.Functor":127,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Semigroup":161,"../Data.Tuple":179,"../Data.Unit":183,"../Prelude":196}],82:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
var Monad = function (__superclass_Control$dotApplicative$dotApplicative_0, __superclass_Control$dotBind$dotBind_1) {
    this["__superclass_Control.Applicative.Applicative_0"] = __superclass_Control$dotApplicative$dotApplicative_0;
    this["__superclass_Control.Bind.Bind_1"] = __superclass_Control$dotBind$dotBind_1;
};
var whenM = function (dictMonad) {
    return function (mb) {
        return function (m) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(mb)(function (v) {
                return Control_Applicative.when(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(v)(m);
            });
        };
    };
};
var unlessM = function (dictMonad) {
    return function (mb) {
        return function (m) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(mb)(function (v) {
                return Control_Applicative.unless(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(v)(m);
            });
        };
    };
};
var monadFn = new Monad(function () {
    return Control_Applicative.applicativeFn;
}, function () {
    return Control_Bind.bindFn;
});
var monadArray = new Monad(function () {
    return Control_Applicative.applicativeArray;
}, function () {
    return Control_Bind.bindArray;
});
var liftM1 = function (dictMonad) {
    return function (f) {
        return function (a) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(a)(function (v) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(f(v));
            });
        };
    };
};
var ap = function (dictMonad) {
    return function (f) {
        return function (a) {
            return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(f)(function (v) {
                return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(a)(function (v1) {
                    return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(v(v1));
                });
            });
        };
    };
};
module.exports = {
    Monad: Monad, 
    ap: ap, 
    liftM1: liftM1, 
    unlessM: unlessM, 
    whenM: whenM, 
    monadFn: monadFn, 
    monadArray: monadArray
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Data.Functor":127,"../Data.Unit":183}],83:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Functor = require("../Data.Functor");
var MonadPlus = function (__superclass_Control$dotMonadZero$dotMonadZero_0) {
    this["__superclass_Control.MonadZero.MonadZero_0"] = __superclass_Control$dotMonadZero$dotMonadZero_0;
};
var monadPlusArray = new MonadPlus(function () {
    return Control_MonadZero.monadZeroArray;
});
module.exports = {
    MonadPlus: MonadPlus, 
    monadPlusArray: monadPlusArray
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad":82,"../Control.MonadZero":84,"../Control.Plus":87,"../Data.Functor":127}],84:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Control_Plus = require("../Control.Plus");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
var MonadZero = function (__superclass_Control$dotAlternative$dotAlternative_1, __superclass_Control$dotMonad$dotMonad_0) {
    this["__superclass_Control.Alternative.Alternative_1"] = __superclass_Control$dotAlternative$dotAlternative_1;
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
};
var monadZeroArray = new MonadZero(function () {
    return Control_Alternative.alternativeArray;
}, function () {
    return Control_Monad.monadArray;
});
var guard = function (dictMonadZero) {
    return function (v) {
        if (v) {
            return Control_Applicative.pure((dictMonadZero["__superclass_Control.Alternative.Alternative_1"]())["__superclass_Control.Applicative.Applicative_0"]())(Data_Unit.unit);
        };
        if (!v) {
            return Control_Plus.empty((dictMonadZero["__superclass_Control.Alternative.Alternative_1"]())["__superclass_Control.Plus.Plus_1"]());
        };
        throw new Error("Failed pattern match at Control.MonadZero line 52, column 1 - line 52, column 23: " + [ v.constructor.name ]);
    };
};
module.exports = {
    MonadZero: MonadZero, 
    guard: guard, 
    monadZeroArray: monadZeroArray
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad":82,"../Control.Plus":87,"../Data.Functor":127,"../Data.Unit":183}],85:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Monad_Cont_Trans = require("../Control.Monad.Cont.Trans");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Eff_Ref = require("../Control.Monad.Eff.Ref");
var Control_Monad_Eff_Unsafe = require("../Control.Monad.Eff.Unsafe");
var Control_Monad_Except_Trans = require("../Control.Monad.Except.Trans");
var Control_Monad_Maybe_Trans = require("../Control.Monad.Maybe.Trans");
var Control_Monad_Reader_Trans = require("../Control.Monad.Reader.Trans");
var Control_Monad_Writer_Trans = require("../Control.Monad.Writer.Trans");
var Control_Plus = require("../Control.Plus");
var Data_Either = require("../Data.Either");
var Data_Functor_Compose = require("../Data.Functor.Compose");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Functor = require("../Data.Functor");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Apply = require("../Control.Apply");
var Data_Function = require("../Data.Function");
var Control_Bind = require("../Control.Bind");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var ParCont = function (x) {
    return x;
};
var Parallel = function (__superclass_Control$dotApplicative$dotApplicative_1, __superclass_Control$dotMonad$dotMonad_0, parallel, sequential) {
    this["__superclass_Control.Applicative.Applicative_1"] = __superclass_Control$dotApplicative$dotApplicative_1;
    this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
    this.parallel = parallel;
    this.sequential = sequential;
};
var unsafeWithRef = Control_Monad_Eff_Unsafe.unsafeCoerceEff;
var sequential = function (dict) {
    return dict.sequential;
};
var parallel = function (dict) {
    return dict.parallel;
};
var newtypeParCont = new Data_Newtype.Newtype(function (n) {
    return n;
}, ParCont);
var monadParWriterT = function (dictMonoid) {
    return function (dictParallel) {
        return new Parallel(function () {
            return Control_Monad_Writer_Trans.applicativeWriterT(dictMonoid)(dictParallel["__superclass_Control.Applicative.Applicative_1"]());
        }, function () {
            return Control_Monad_Writer_Trans.monadWriterT(dictMonoid)(dictParallel["__superclass_Control.Monad.Monad_0"]());
        }, Control_Monad_Writer_Trans.mapWriterT(parallel(dictParallel)), Control_Monad_Writer_Trans.mapWriterT(sequential(dictParallel)));
    };
};
var monadParReaderT = function (dictParallel) {
    return new Parallel(function () {
        return Control_Monad_Reader_Trans.applicativeReaderT(dictParallel["__superclass_Control.Applicative.Applicative_1"]());
    }, function () {
        return Control_Monad_Reader_Trans.monadReaderT(dictParallel["__superclass_Control.Monad.Monad_0"]());
    }, Control_Monad_Reader_Trans.mapReaderT(parallel(dictParallel)), Control_Monad_Reader_Trans.mapReaderT(sequential(dictParallel)));
};
var monadParMaybeT = function (dictParallel) {
    return new Parallel(function () {
        return Data_Functor_Compose.applicativeCompose(dictParallel["__superclass_Control.Applicative.Applicative_1"]())(Data_Maybe.applicativeMaybe);
    }, function () {
        return Control_Monad_Maybe_Trans.monadMaybeT(dictParallel["__superclass_Control.Monad.Monad_0"]());
    }, function (v) {
        return parallel(dictParallel)(v);
    }, function (v) {
        return sequential(dictParallel)(v);
    });
};
var monadParExceptT = function (dictParallel) {
    return new Parallel(function () {
        return Data_Functor_Compose.applicativeCompose(dictParallel["__superclass_Control.Applicative.Applicative_1"]())(Data_Either.applicativeEither);
    }, function () {
        return Control_Monad_Except_Trans.monadExceptT(dictParallel["__superclass_Control.Monad.Monad_0"]());
    }, function (v) {
        return parallel(dictParallel)(v);
    }, function (v) {
        return sequential(dictParallel)(v);
    });
};
var monadParParCont = function (dictMonadEff) {
    return new Parallel(function () {
        return applicativeParCont(dictMonadEff);
    }, function () {
        return Control_Monad_Cont_Trans.monadContT(dictMonadEff["__superclass_Control.Monad.Monad_0"]());
    }, ParCont, function (v) {
        return v;
    });
};
var functorParCont = function (dictMonadEff) {
    return new Data_Functor.Functor(function (f) {
        return function ($55) {
            return parallel(monadParParCont(dictMonadEff))(Data_Functor.map(Control_Monad_Cont_Trans.functorContT((((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]()))(f)(sequential(monadParParCont(dictMonadEff))($55)));
        };
    });
};
var applyParCont = function (dictMonadEff) {
    return new Control_Apply.Apply(function () {
        return functorParCont(dictMonadEff);
    }, function (v) {
        return function (v1) {
            return ParCont(function (k) {
                return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.newRef(Data_Maybe.Nothing.value))))(function (v2) {
                    return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.newRef(Data_Maybe.Nothing.value))))(function (v3) {
                        return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Cont_Trans.runContT(v)(function (a) {
                            return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.readRef(v3))))(function (v4) {
                                if (v4 instanceof Data_Maybe.Nothing) {
                                    return Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.writeRef(v2)(new Data_Maybe.Just(a))));
                                };
                                if (v4 instanceof Data_Maybe.Just) {
                                    return k(a(v4.value0));
                                };
                                throw new Error("Failed pattern match at Control.Parallel.Class line 81, column 7 - line 83, column 26: " + [ v4.constructor.name ]);
                            });
                        }))(function () {
                            return Control_Monad_Cont_Trans.runContT(v1)(function (b) {
                                return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.readRef(v2))))(function (v4) {
                                    if (v4 instanceof Data_Maybe.Nothing) {
                                        return Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.writeRef(v3)(new Data_Maybe.Just(b))));
                                    };
                                    if (v4 instanceof Data_Maybe.Just) {
                                        return k(v4.value0(b));
                                    };
                                    throw new Error("Failed pattern match at Control.Parallel.Class line 87, column 7 - line 89, column 26: " + [ v4.constructor.name ]);
                                });
                            });
                        });
                    });
                });
            });
        };
    });
};
var applicativeParCont = function (dictMonadEff) {
    return new Control_Applicative.Applicative(function () {
        return applyParCont(dictMonadEff);
    }, function ($56) {
        return parallel(monadParParCont(dictMonadEff))(Control_Applicative.pure(Control_Monad_Cont_Trans.applicativeContT((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]()))($56));
    });
};
var altParCont = function (dictMonadEff) {
    return new Control_Alt.Alt(function () {
        return functorParCont(dictMonadEff);
    }, function (v) {
        return function (v1) {
            return ParCont(function (k) {
                return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.newRef(false))))(function (v2) {
                    return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Cont_Trans.runContT(v)(function (a) {
                        return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.readRef(v2))))(function (v3) {
                            if (v3) {
                                return Control_Applicative.pure((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(Data_Unit.unit);
                            };
                            if (!v3) {
                                return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.writeRef(v2)(true))))(function () {
                                    return k(a);
                                });
                            };
                            throw new Error("Failed pattern match at Control.Parallel.Class line 100, column 7 - line 104, column 14: " + [ v3.constructor.name ]);
                        });
                    }))(function () {
                        return Control_Monad_Cont_Trans.runContT(v1)(function (a) {
                            return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.readRef(v2))))(function (v3) {
                                if (v3) {
                                    return Control_Applicative.pure((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(Data_Unit.unit);
                                };
                                if (!v3) {
                                    return Control_Bind.bind((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Monad_Eff_Class.liftEff(dictMonadEff)(unsafeWithRef(Control_Monad_Eff_Ref.writeRef(v2)(true))))(function () {
                                        return k(a);
                                    });
                                };
                                throw new Error("Failed pattern match at Control.Parallel.Class line 108, column 7 - line 112, column 14: " + [ v3.constructor.name ]);
                            });
                        });
                    });
                });
            });
        };
    });
};
var plusParCont = function (dictMonadEff) {
    return new Control_Plus.Plus(function () {
        return altParCont(dictMonadEff);
    }, ParCont(function (v) {
        return Control_Applicative.pure((dictMonadEff["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(Data_Unit.unit);
    }));
};
var alternativeParCont = function (dictMonadEff) {
    return new Control_Alternative.Alternative(function () {
        return applicativeParCont(dictMonadEff);
    }, function () {
        return plusParCont(dictMonadEff);
    });
};
module.exports = {
    ParCont: ParCont, 
    Parallel: Parallel, 
    parallel: parallel, 
    sequential: sequential, 
    monadParExceptT: monadParExceptT, 
    monadParReaderT: monadParReaderT, 
    monadParWriterT: monadParWriterT, 
    monadParMaybeT: monadParMaybeT, 
    newtypeParCont: newtypeParCont, 
    functorParCont: functorParCont, 
    applyParCont: applyParCont, 
    applicativeParCont: applicativeParCont, 
    altParCont: altParCont, 
    plusParCont: plusParCont, 
    alternativeParCont: alternativeParCont, 
    monadParParCont: monadParParCont
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad.Cont.Trans":53,"../Control.Monad.Eff":66,"../Control.Monad.Eff.Class":54,"../Control.Monad.Eff.Ref":60,"../Control.Monad.Eff.Unsafe":64,"../Control.Monad.Except.Trans":68,"../Control.Monad.Maybe.Trans":70,"../Control.Monad.Reader.Trans":72,"../Control.Monad.Writer.Trans":81,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Function":121,"../Data.Functor":127,"../Data.Functor.Compose":122,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Unit":183,"../Prelude":196}],86:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Parallel_Class = require("../Control.Parallel.Class");
var Data_Foldable = require("../Data.Foldable");
var Data_Traversable = require("../Data.Traversable");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Category = require("../Control.Category");
var parTraverse_ = function (dictParallel) {
    return function (dictFoldable) {
        return function (f) {
            return function ($8) {
                return Control_Parallel_Class.sequential(dictParallel)(Data_Foldable.traverse_(dictParallel["__superclass_Control.Applicative.Applicative_1"]())(dictFoldable)(function ($9) {
                    return Control_Parallel_Class.parallel(dictParallel)(f($9));
                })($8));
            };
        };
    };
};
var parTraverse = function (dictParallel) {
    return function (dictTraversable) {
        return function (f) {
            return function ($10) {
                return Control_Parallel_Class.sequential(dictParallel)(Data_Traversable.traverse(dictTraversable)(dictParallel["__superclass_Control.Applicative.Applicative_1"]())(function ($11) {
                    return Control_Parallel_Class.parallel(dictParallel)(f($11));
                })($10));
            };
        };
    };
};
var parSequence_ = function (dictParallel) {
    return function (dictTraversable) {
        return parTraverse_(dictParallel)(dictTraversable["__superclass_Data.Foldable.Foldable_1"]())(Control_Category.id(Control_Category.categoryFn));
    };
};
var parSequence = function (dictParallel) {
    return function (dictTraversable) {
        return parTraverse(dictParallel)(dictTraversable)(Control_Category.id(Control_Category.categoryFn));
    };
};
module.exports = {
    parSequence: parSequence, 
    parSequence_: parSequence_, 
    parTraverse: parTraverse, 
    parTraverse_: parTraverse_
};

},{"../Control.Category":41,"../Control.Parallel.Class":85,"../Control.Semigroupoid":88,"../Data.Foldable":118,"../Data.Traversable":178,"../Prelude":196}],87:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Data_Functor = require("../Data.Functor");
var Plus = function (__superclass_Control$dotAlt$dotAlt_0, empty) {
    this["__superclass_Control.Alt.Alt_0"] = __superclass_Control$dotAlt$dotAlt_0;
    this.empty = empty;
};
var plusArray = new Plus(function () {
    return Control_Alt.altArray;
}, [  ]);
var empty = function (dict) {
    return dict.empty;
};
module.exports = {
    Plus: Plus, 
    empty: empty, 
    plusArray: plusArray
};

},{"../Control.Alt":32,"../Data.Functor":127}],88:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Semigroupoid = function (compose) {
    this.compose = compose;
};
var semigroupoidFn = new Semigroupoid(function (f) {
    return function (g) {
        return function (x) {
            return f(g(x));
        };
    };
});
var compose = function (dict) {
    return dict.compose;
};
var composeFlipped = function (dictSemigroupoid) {
    return function (f) {
        return function (g) {
            return compose(dictSemigroupoid)(g)(f);
        };
    };
};
module.exports = {
    Semigroupoid: Semigroupoid, 
    compose: compose, 
    composeFlipped: composeFlipped, 
    semigroupoidFn: semigroupoidFn
};

},{}],89:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Array_ST = require("../Data.Array.ST");
var Data_Maybe = require("../Data.Maybe");
var Control_Bind = require("../Control.Bind");
var Control_Applicative = require("../Control.Applicative");
var Data_Semiring = require("../Data.Semiring");
var Data_Functor = require("../Data.Functor");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Function = require("../Data.Function");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Iterator = (function () {
    function Iterator(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Iterator.create = function (value0) {
        return function (value1) {
            return new Iterator(value0, value1);
        };
    };
    return Iterator;
})();
var peek = function (v) {
    return function __do() {
        var v1 = Control_Monad_ST.readSTRef(v.value1)();
        return v.value0(v1);
    };
};
var next = function (v) {
    return function __do() {
        var v1 = Control_Monad_ST.readSTRef(v.value1)();
        var v2 = Control_Monad_ST.modifySTRef(v.value1)(function (v2) {
            return v2 + 1 | 0;
        })();
        return v.value0(v1);
    };
};
var pushWhile = function (p) {
    return function (iter) {
        return function (array) {
            return function __do() {
                var v = Control_Monad_ST.newSTRef(false)();
                while (Data_Functor.map(Control_Monad_Eff.functorEff)(Data_HeytingAlgebra.not(Data_HeytingAlgebra.heytingAlgebraBoolean))(Control_Monad_ST.readSTRef(v))()) {
                    (function __do() {
                        var v1 = peek(iter)();
                        if (v1 instanceof Data_Maybe.Just && p(v1.value0)) {
                            var v2 = Data_Array_ST.pushSTArray(array)(v1.value0)();
                            return Data_Functor["void"](Control_Monad_Eff.functorEff)(next(iter))();
                        };
                        return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(v)(true))();
                    })();
                };
                return {};
            };
        };
    };
};
var pushAll = pushWhile(Data_Function["const"](true));
var iterator = function (f) {
    return Data_Functor.map(Control_Monad_Eff.functorEff)(Iterator.create(f))(Control_Monad_ST.newSTRef(0));
};
var iterate = function (iter) {
    return function (f) {
        return function __do() {
            var v = Control_Monad_ST.newSTRef(false)();
            while (Data_Functor.map(Control_Monad_Eff.functorEff)(Data_HeytingAlgebra.not(Data_HeytingAlgebra.heytingAlgebraBoolean))(Control_Monad_ST.readSTRef(v))()) {
                (function __do() {
                    var v1 = next(iter)();
                    if (v1 instanceof Data_Maybe.Just) {
                        return f(v1.value0)();
                    };
                    if (v1 instanceof Data_Maybe.Nothing) {
                        return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(v)(true))();
                    };
                    throw new Error("Failed pattern match at Data.Array.ST.Iterator line 39, column 5 - line 41, column 46: " + [ v1.constructor.name ]);
                })();
            };
            return {};
        };
    };
};
var exhausted = function ($29) {
    return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.isNothing)(peek($29));
};
module.exports = {
    exhausted: exhausted, 
    iterate: iterate, 
    iterator: iterator, 
    next: next, 
    peek: peek, 
    pushAll: pushAll, 
    pushWhile: pushWhile
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Eff":66,"../Control.Monad.ST":75,"../Control.Semigroupoid":88,"../Data.Array.ST":91,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Maybe":140,"../Data.Semiring":163,"../Prelude":196}],90:[function(require,module,exports){
"use strict";

exports.runSTArray = function (f) {
  return f;
};

exports.emptySTArray = function () {
  return [];
};

exports.peekSTArrayImpl = function (just) {
  return function (nothing) {
    return function (xs) {
      return function (i) {
        return function () {
          return i >= 0 && i < xs.length ? just(xs[i]) : nothing;
        };
      };
    };
  };
};

exports.pokeSTArray = function (xs) {
  return function (i) {
    return function (a) {
      return function () {
        var ret = i >= 0 && i < xs.length;
        if (ret) xs[i] = a;
        return ret;
      };
    };
  };
};

exports.pushAllSTArray = function (xs) {
  return function (as) {
    return function () {
      return xs.push.apply(xs, as);
    };
  };
};

exports.spliceSTArray = function (xs) {
  return function (i) {
    return function (howMany) {
      return function (bs) {
        return function () {
          return xs.splice.apply(xs, [i, howMany].concat(bs));
        };
      };
    };
  };
};

exports.copyImpl = function (xs) {
  return function () {
    return xs.slice();
  };
};

exports.toAssocArray = function (xs) {
  return function () {
    var n = xs.length;
    var as = new Array(n);
    for (var i = 0; i < n; i++) as[i] = { value: xs[i], index: i };
    return as;
  };
};

},{}],91:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Maybe = require("../Data.Maybe");
var Unsafe_Coerce = require("../Unsafe.Coerce");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Applicative = require("../Control.Applicative");
var unsafeFreeze = function ($0) {
    return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Unsafe_Coerce.unsafeCoerce($0));
};
var thaw = $foreign.copyImpl;
var pushSTArray = function (arr) {
    return function (a) {
        return $foreign.pushAllSTArray(arr)([ a ]);
    };
};
var peekSTArray = $foreign.peekSTArrayImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var freeze = $foreign.copyImpl;
module.exports = {
    freeze: freeze, 
    peekSTArray: peekSTArray, 
    pushSTArray: pushSTArray, 
    thaw: thaw, 
    unsafeFreeze: unsafeFreeze, 
    emptySTArray: $foreign.emptySTArray, 
    pokeSTArray: $foreign.pokeSTArray, 
    pushAllSTArray: $foreign.pushAllSTArray, 
    runSTArray: $foreign.runSTArray, 
    spliceSTArray: $foreign.spliceSTArray, 
    toAssocArray: $foreign.toAssocArray
};

},{"../Control.Applicative":34,"../Control.Monad.Eff":66,"../Control.Monad.ST":75,"../Control.Semigroupoid":88,"../Data.Maybe":140,"../Prelude":196,"../Unsafe.Coerce":223,"./foreign":90}],92:[function(require,module,exports){
"use strict";

//------------------------------------------------------------------------------
// Array creation --------------------------------------------------------------
//------------------------------------------------------------------------------

exports.range = function (start) {
  return function (end) {
    var step = start > end ? -1 : 1;
    var result = [];
    for (var i = start, n = 0; i !== end; i += step) {
      result[n++] = i;
    }
    result[n] = i;
    return result;
  };
};

exports.replicate = function (count) {
  return function (value) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value;
    }
    return result;
  };
};

exports.fromFoldableImpl = (function () {
  // jshint maxparams: 2
  function Cons(head, tail) {
    this.head = head;
    this.tail = tail;
  }
  var emptyList = {};

  function curryCons(head) {
    return function (tail) {
      return new Cons(head, tail);
    };
  }

  function listToArray(list) {
    var result = [];
    var count = 0;
    while (list !== emptyList) {
      result[count++] = list.head;
      list = list.tail;
    }
    return result;
  }

  return function (foldr) {
    return function (xs) {
      return listToArray(foldr(curryCons)(emptyList)(xs));
    };
  };
})();

//------------------------------------------------------------------------------
// Array size ------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.length = function (xs) {
  return xs.length;
};

//------------------------------------------------------------------------------
// Extending arrays ------------------------------------------------------------
//------------------------------------------------------------------------------

exports.cons = function (e) {
  return function (l) {
    return [e].concat(l);
  };
};

exports.snoc = function (l) {
  return function (e) {
    var l1 = l.slice();
    l1.push(e);
    return l1;
  };
};

//------------------------------------------------------------------------------
// Non-indexed reads -----------------------------------------------------------
//------------------------------------------------------------------------------

exports["uncons'"] = function (empty) {
  return function (next) {
    return function (xs) {
      return xs.length === 0 ? empty({}) : next(xs[0])(xs.slice(1));
    };
  };
};

//------------------------------------------------------------------------------
// Indexed operations ----------------------------------------------------------
//------------------------------------------------------------------------------

exports.indexImpl = function (just) {
  return function (nothing) {
    return function (xs) {
      return function (i) {
        return i < 0 || i >= xs.length ? nothing :  just(xs[i]);
      };
    };
  };
};

exports.findIndexImpl = function (just) {
  return function (nothing) {
    return function (f) {
      return function (xs) {
        for (var i = 0, l = xs.length; i < l; i++) {
          if (f(xs[i])) return just(i);
        }
        return nothing;
      };
    };
  };
};

exports.findLastIndexImpl = function (just) {
  return function (nothing) {
    return function (f) {
      return function (xs) {
        for (var i = xs.length - 1; i >= 0; i--) {
          if (f(xs[i])) return just(i);
        }
        return nothing;
      };
    };
  };
};

exports._insertAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (a) {
        return function (l) {
          if (i < 0 || i > l.length) return nothing;
          var l1 = l.slice();
          l1.splice(i, 0, a);
          return just(l1);
        };
      };
    };
  };
};

exports._deleteAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (l) {
        if (i < 0 || i >= l.length) return nothing;
        var l1 = l.slice();
        l1.splice(i, 1);
        return just(l1);
      };
    };
  };
};

exports._updateAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (a) {
        return function (l) {
          if (i < 0 || i >= l.length) return nothing;
          var l1 = l.slice();
          l1[i] = a;
          return just(l1);
        };
      };
    };
  };
};

//------------------------------------------------------------------------------
// Transformations -------------------------------------------------------------
//------------------------------------------------------------------------------

exports.reverse = function (l) {
  return l.slice().reverse();
};

exports.concat = function (xss) {
  var result = [];
  for (var i = 0, l = xss.length; i < l; i++) {
    var xs = xss[i];
    for (var j = 0, m = xs.length; j < m; j++) {
      result.push(xs[j]);
    }
  }
  return result;
};

exports.filter = function (f) {
  return function (xs) {
    return xs.filter(f);
  };
};

exports.partition = function (f) {
  return function (xs) {
    var yes = [];
    var no  = [];
    for (var i = 0; i < xs.length; i++) {
      var x = xs[i];
      if (f(x))
        yes.push(x);
      else
        no.push(x);
    }
    return { yes: yes, no: no };
  };
};

//------------------------------------------------------------------------------
// Sorting ---------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.sortImpl = function (f) {
  return function (l) {
    // jshint maxparams: 2
    return l.slice().sort(function (x, y) {
      return f(x)(y);
    });
  };
};

//------------------------------------------------------------------------------
// Subarrays -------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.slice = function (s) {
  return function (e) {
    return function (l) {
      return l.slice(s, e);
    };
  };
};

exports.take = function (n) {
  return function (l) {
    return n < 1 ? [] : l.slice(0, n);
  };
};

exports.drop = function (n) {
  return function (l) {
    return n < 1 ? l : l.slice(n);
  };
};

//------------------------------------------------------------------------------
// Zipping ---------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.zipWith = function (f) {
  return function (xs) {
    return function (ys) {
      var l = xs.length < ys.length ? xs.length : ys.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(xs[i])(ys[i]);
      }
      return result;
    };
  };
};

//------------------------------------------------------------------------------
// Partial ---------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.unsafeIndexImpl = function (xs) {
  return function (n) {
    return xs[n];
  };
};

},{}],93:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Lazy = require("../Control.Lazy");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Array_ST = require("../Data.Array.ST");
var Data_Array_ST_Iterator = require("../Data.Array.ST.Iterator");
var Data_Foldable = require("../Data.Foldable");
var Data_Maybe = require("../Data.Maybe");
var Data_NonEmpty = require("../Data.NonEmpty");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Data_Unfoldable = require("../Data.Unfoldable");
var Partial_Unsafe = require("../Partial.Unsafe");
var Data_Function = require("../Data.Function");
var Data_Ord = require("../Data.Ord");
var Data_Semiring = require("../Data.Semiring");
var Data_Boolean = require("../Data.Boolean");
var Data_Ordering = require("../Data.Ordering");
var Data_Ring = require("../Data.Ring");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Control_Apply = require("../Control.Apply");
var Data_Functor = require("../Data.Functor");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Category = require("../Control.Category");
var zipWithA = function (dictApplicative) {
    return function (f) {
        return function (xs) {
            return function (ys) {
                return Data_Traversable.sequence(Data_Traversable.traversableArray)(dictApplicative)($foreign.zipWith(f)(xs)(ys));
            };
        };
    };
};
var zip = $foreign.zipWith(Data_Tuple.Tuple.create);
var updateAt = $foreign._updateAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var unzip = $foreign["uncons'"](function (v) {
    return new Data_Tuple.Tuple([  ], [  ]);
})(function (v) {
    return function (ts) {
        var $49 = unzip(ts);
        return new Data_Tuple.Tuple($foreign.cons(v.value0)($49.value0), $foreign.cons(v.value1)($49.value1));
    };
});
var unsafeIndex = function (dictPartial) {
    return $foreign.unsafeIndexImpl;
};
var uncons = $foreign["uncons'"](Data_Function["const"](Data_Maybe.Nothing.value))(function (x) {
    return function (xs) {
        return new Data_Maybe.Just({
            head: x, 
            tail: xs
        });
    };
});
var toUnfoldable = function (dictUnfoldable) {
    return function (xs) {
        var len = $foreign.length(xs);
        var f = function (i) {
            if (i < len) {
                return new Data_Maybe.Just(new Data_Tuple.Tuple(unsafeIndex()(xs)(i), i + 1 | 0));
            };
            if (Data_Boolean.otherwise) {
                return Data_Maybe.Nothing.value;
            };
            throw new Error("Failed pattern match at Data.Array line 133, column 1 - line 138, column 26: " + [ i.constructor.name ]);
        };
        return Data_Unfoldable.unfoldr(dictUnfoldable)(f)(0);
    };
};
var tail = $foreign["uncons'"](Data_Function["const"](Data_Maybe.Nothing.value))(function (v) {
    return function (xs) {
        return new Data_Maybe.Just(xs);
    };
});
var sortBy = function (comp) {
    return function (xs) {
        var comp$prime = function (x) {
            return function (y) {
                var $56 = comp(x)(y);
                if ($56 instanceof Data_Ordering.GT) {
                    return 1;
                };
                if ($56 instanceof Data_Ordering.EQ) {
                    return 0;
                };
                if ($56 instanceof Data_Ordering.LT) {
                    return -1 | 0;
                };
                throw new Error("Failed pattern match at Data.Array line 467, column 15 - line 472, column 1: " + [ $56.constructor.name ]);
            };
        };
        return $foreign.sortImpl(comp$prime)(xs);
    };
};
var sort = function (dictOrd) {
    return function (xs) {
        return sortBy(Data_Ord.compare(dictOrd))(xs);
    };
};
var singleton = function (a) {
    return [ a ];
};
var $$null = function (xs) {
    return $foreign.length(xs) === 0;
};
var nubBy = function (eq) {
    return function (xs) {
        var $57 = uncons(xs);
        if ($57 instanceof Data_Maybe.Just) {
            return $foreign.cons($57.value0.head)(nubBy(eq)($foreign.filter(function (y) {
                return !eq($57.value0.head)(y);
            })($57.value0.tail)));
        };
        if ($57 instanceof Data_Maybe.Nothing) {
            return [  ];
        };
        throw new Error("Failed pattern match at Data.Array line 570, column 3 - line 572, column 18: " + [ $57.constructor.name ]);
    };
};
var nub = function (dictEq) {
    return nubBy(Data_Eq.eq(dictEq));
};
var mapWithIndex = function (f) {
    return function (xs) {
        return $foreign.zipWith(f)($foreign.range(0)($foreign.length(xs) - 1 | 0))(xs);
    };
};
var some = function (dictAlternative) {
    return function (dictLazy) {
        return function (v) {
            return Control_Apply.apply((dictAlternative["__superclass_Control.Applicative.Applicative_0"]())["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map(((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())["__superclass_Data.Functor.Functor_0"]())($foreign.cons)(v))(Control_Lazy.defer(dictLazy)(function (v1) {
                return many(dictAlternative)(dictLazy)(v);
            }));
        };
    };
};
var many = function (dictAlternative) {
    return function (dictLazy) {
        return function (v) {
            return Control_Alt.alt((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())(some(dictAlternative)(dictLazy)(v))(Control_Applicative.pure(dictAlternative["__superclass_Control.Applicative.Applicative_0"]())([  ]));
        };
    };
};
var insertAt = $foreign._insertAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var init = function (xs) {
    if ($$null(xs)) {
        return Data_Maybe.Nothing.value;
    };
    if (Data_Boolean.otherwise) {
        return new Data_Maybe.Just($foreign.slice(0)($foreign.length(xs) - 1 | 0)(xs));
    };
    throw new Error("Failed pattern match at Data.Array line 249, column 1 - line 251, column 55: " + [ xs.constructor.name ]);
};
var index = $foreign.indexImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var last = function (xs) {
    return index(xs)($foreign.length(xs) - 1 | 0);
};
var unsnoc = function (xs) {
    return Control_Apply.apply(Data_Maybe.applyMaybe)(Data_Functor.map(Data_Maybe.functorMaybe)(function (v) {
        return function (v1) {
            return {
                init: v, 
                last: v1
            };
        };
    })(init(xs)))(last(xs));
};
var modifyAt = function (i) {
    return function (f) {
        return function (xs) {
            var go = function (x) {
                return updateAt(i)(f(x))(xs);
            };
            return Data_Maybe.maybe(Data_Maybe.Nothing.value)(go)(index(xs)(i));
        };
    };
};
var span = function (p) {
    return function (arr) {
        var go = function (__copy_i) {
            var i = __copy_i;
            tco: while (true) {
                var $61 = index(arr)(i);
                if ($61 instanceof Data_Maybe.Just) {
                    var $62 = p($61.value0);
                    if ($62) {
                        var __tco_i = i + 1 | 0;
                        i = __tco_i;
                        continue tco;
                    };
                    if (!$62) {
                        return new Data_Maybe.Just(i);
                    };
                    throw new Error("Failed pattern match at Data.Array line 529, column 17 - line 529, column 49: " + [ $62.constructor.name ]);
                };
                if ($61 instanceof Data_Maybe.Nothing) {
                    return Data_Maybe.Nothing.value;
                };
                throw new Error("Failed pattern match at Data.Array line 528, column 5 - line 530, column 25: " + [ $61.constructor.name ]);
            };
        };
        var breakIndex = go(0);
        if (breakIndex instanceof Data_Maybe.Just && breakIndex.value0 === 0) {
            return {
                init: [  ], 
                rest: arr
            };
        };
        if (breakIndex instanceof Data_Maybe.Just) {
            return {
                init: $foreign.slice(0)(breakIndex.value0)(arr), 
                rest: $foreign.slice(breakIndex.value0)($foreign.length(arr))(arr)
            };
        };
        if (breakIndex instanceof Data_Maybe.Nothing) {
            return {
                init: arr, 
                rest: [  ]
            };
        };
        throw new Error("Failed pattern match at Data.Array line 515, column 3 - line 521, column 30: " + [ breakIndex.constructor.name ]);
    };
};
var takeWhile = function (p) {
    return function (xs) {
        return (span(p)(xs)).init;
    };
};
var head = function (xs) {
    return index(xs)(0);
};
var groupBy = function (op) {
    return function (xs) {
        return Control_Monad_ST.pureST(function __do() {
            var v = Data_Array_ST.emptySTArray();
            var v1 = Data_Array_ST_Iterator.iterator(function (v1) {
                return index(xs)(v1);
            })();
            Data_Array_ST_Iterator.iterate(v1)(function (x) {
                return Data_Functor["void"](Control_Monad_Eff.functorEff)(function __do() {
                    var v2 = Data_Array_ST.emptySTArray();
                    Data_Array_ST_Iterator.pushWhile(op(x))(v1)(v2)();
                    var v3 = Data_Array_ST.unsafeFreeze(v2)();
                    return Data_Array_ST.pushSTArray(v)(new Data_NonEmpty.NonEmpty(x, v3))();
                });
            })();
            return Data_Array_ST.unsafeFreeze(v)();
        });
    };
};
var group = function (dictEq) {
    return function (xs) {
        return groupBy(Data_Eq.eq(dictEq))(xs);
    };
};
var group$prime = function (dictOrd) {
    return function ($84) {
        return group(dictOrd["__superclass_Data.Eq.Eq_0"]())(sort(dictOrd)($84));
    };
};
var fromFoldable = function (dictFoldable) {
    return $foreign.fromFoldableImpl(Data_Foldable.foldr(dictFoldable));
};
var foldRecM = function (dictMonadRec) {
    return function (f) {
        return function (a) {
            return function (array) {
                var go = function (res) {
                    return function (i) {
                        if (i >= $foreign.length(array)) {
                            return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Control_Monad_Rec_Class.Done(res));
                        };
                        if (Data_Boolean.otherwise) {
                            return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(f(res)(unsafeIndex()(array)(i)))(function (v) {
                                return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Control_Monad_Rec_Class.Loop({
                                    a: v, 
                                    b: i + 1 | 0
                                }));
                            });
                        };
                        throw new Error("Failed pattern match at Data.Array line 671, column 3 - line 675, column 42: " + [ res.constructor.name, i.constructor.name ]);
                    };
                };
                return Control_Monad_Rec_Class.tailRecM2(dictMonadRec)(go)(a)(0);
            };
        };
    };
};
var foldM = function (dictMonad) {
    return function (f) {
        return function (a) {
            return $foreign["uncons'"](function (v) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(a);
            })(function (b) {
                return function (bs) {
                    return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(f(a)(b))(function (a$prime) {
                        return foldM(dictMonad)(f)(a$prime)(bs);
                    });
                };
            });
        };
    };
};
var findLastIndex = $foreign.findLastIndexImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var insertBy = function (cmp) {
    return function (x) {
        return function (ys) {
            var i = Data_Maybe.maybe(0)(function (v) {
                return v + 1 | 0;
            })(findLastIndex(function (y) {
                return Data_Eq.eq(Data_Ordering.eqOrdering)(cmp(x)(y))(Data_Ordering.GT.value);
            })(ys));
            return Data_Maybe.fromJust()(insertAt(i)(x)(ys));
        };
    };
};
var insert = function (dictOrd) {
    return insertBy(Data_Ord.compare(dictOrd));
};
var findIndex = $foreign.findIndexImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var intersectBy = function (eq) {
    return function (xs) {
        return function (ys) {
            return $foreign.filter(function (x) {
                return Data_Maybe.isJust(findIndex(eq(x))(ys));
            })(xs);
        };
    };
};
var intersect = function (dictEq) {
    return intersectBy(Data_Eq.eq(dictEq));
};
var elemLastIndex = function (dictEq) {
    return function (x) {
        return findLastIndex(function (v) {
            return Data_Eq.eq(dictEq)(v)(x);
        });
    };
};
var elemIndex = function (dictEq) {
    return function (x) {
        return findIndex(function (v) {
            return Data_Eq.eq(dictEq)(v)(x);
        });
    };
};
var dropWhile = function (p) {
    return function (xs) {
        return (span(p)(xs)).rest;
    };
};
var deleteAt = $foreign._deleteAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var deleteBy = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2.length === 0) {
                return [  ];
            };
            return Data_Maybe.maybe(v2)(function (i) {
                return Data_Maybe.fromJust()(deleteAt(i)(v2));
            })(findIndex(v(v1))(v2));
        };
    };
};
var unionBy = function (eq) {
    return function (xs) {
        return function (ys) {
            return Data_Semigroup.append(Data_Semigroup.semigroupArray)(xs)(Data_Foldable.foldl(Data_Foldable.foldableArray)(Data_Function.flip(deleteBy(eq)))(nubBy(eq)(ys))(xs));
        };
    };
};
var union = function (dictEq) {
    return unionBy(Data_Eq.eq(dictEq));
};
var $$delete = function (dictEq) {
    return deleteBy(Data_Eq.eq(dictEq));
};
var difference = function (dictEq) {
    return Data_Foldable.foldr(Data_Foldable.foldableArray)($$delete(dictEq));
};
var concatMap = Data_Function.flip(Control_Bind.bind(Control_Bind.bindArray));
var mapMaybe = function (f) {
    return concatMap(function ($85) {
        return Data_Maybe.maybe([  ])(singleton)(f($85));
    });
};
var filterA = function (dictApplicative) {
    return function (p) {
        return function ($86) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(mapMaybe(function (v) {
                if (v.value1) {
                    return new Data_Maybe.Just(v.value0);
                };
                if (!v.value1) {
                    return Data_Maybe.Nothing.value;
                };
                throw new Error("Failed pattern match at Data.Array line 430, column 38 - line 430, column 67: " + [ v.value1.constructor.name ]);
            }))(Data_Traversable.traverse(Data_Traversable.traversableArray)(dictApplicative)(function (x) {
                return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Tuple.Tuple.create(x))(p(x));
            })($86));
        };
    };
};
var filterM = function (dictMonad) {
    return filterA(dictMonad["__superclass_Control.Applicative.Applicative_0"]());
};
var catMaybes = mapMaybe(Control_Category.id(Control_Category.categoryFn));
var alterAt = function (i) {
    return function (f) {
        return function (xs) {
            var go = function (x) {
                var $82 = f(x);
                if ($82 instanceof Data_Maybe.Nothing) {
                    return deleteAt(i)(xs);
                };
                if ($82 instanceof Data_Maybe.Just) {
                    return updateAt(i)($82.value0)(xs);
                };
                throw new Error("Failed pattern match at Data.Array line 389, column 10 - line 391, column 32: " + [ $82.constructor.name ]);
            };
            return Data_Maybe.maybe(Data_Maybe.Nothing.value)(go)(index(xs)(i));
        };
    };
};
module.exports = {
    alterAt: alterAt, 
    catMaybes: catMaybes, 
    concatMap: concatMap, 
    "delete": $$delete, 
    deleteAt: deleteAt, 
    deleteBy: deleteBy, 
    difference: difference, 
    dropWhile: dropWhile, 
    elemIndex: elemIndex, 
    elemLastIndex: elemLastIndex, 
    filterA: filterA, 
    filterM: filterM, 
    findIndex: findIndex, 
    findLastIndex: findLastIndex, 
    foldM: foldM, 
    foldRecM: foldRecM, 
    fromFoldable: fromFoldable, 
    group: group, 
    "group'": group$prime, 
    groupBy: groupBy, 
    head: head, 
    index: index, 
    init: init, 
    insert: insert, 
    insertAt: insertAt, 
    insertBy: insertBy, 
    intersect: intersect, 
    intersectBy: intersectBy, 
    last: last, 
    many: many, 
    mapMaybe: mapMaybe, 
    mapWithIndex: mapWithIndex, 
    modifyAt: modifyAt, 
    nub: nub, 
    nubBy: nubBy, 
    "null": $$null, 
    singleton: singleton, 
    some: some, 
    sort: sort, 
    sortBy: sortBy, 
    span: span, 
    tail: tail, 
    takeWhile: takeWhile, 
    toUnfoldable: toUnfoldable, 
    uncons: uncons, 
    union: union, 
    unionBy: unionBy, 
    unsafeIndex: unsafeIndex, 
    unsnoc: unsnoc, 
    unzip: unzip, 
    updateAt: updateAt, 
    zip: zip, 
    zipWithA: zipWithA, 
    concat: $foreign.concat, 
    cons: $foreign.cons, 
    drop: $foreign.drop, 
    filter: $foreign.filter, 
    length: $foreign.length, 
    partition: $foreign.partition, 
    range: $foreign.range, 
    replicate: $foreign.replicate, 
    reverse: $foreign.reverse, 
    slice: $foreign.slice, 
    snoc: $foreign.snoc, 
    take: $foreign.take, 
    zipWith: $foreign.zipWith
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Lazy":45,"../Control.Monad.Eff":66,"../Control.Monad.Rec.Class":73,"../Control.Monad.ST":75,"../Control.Semigroupoid":88,"../Data.Array.ST":91,"../Data.Array.ST.Iterator":89,"../Data.Boolean":102,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Maybe":140,"../Data.NonEmpty":150,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Traversable":178,"../Data.Tuple":179,"../Data.Unfoldable":181,"../Partial.Unsafe":193,"../Prelude":196,"./foreign":92}],94:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Apply = require("../Control.Apply");
var Data_Monoid = require("../Data.Monoid");
var Data_Monoid_Conj = require("../Data.Monoid.Conj");
var Data_Monoid_Disj = require("../Data.Monoid.Disj");
var Data_Monoid_Dual = require("../Data.Monoid.Dual");
var Data_Monoid_Endo = require("../Data.Monoid.Endo");
var Data_Newtype = require("../Data.Newtype");
var Data_Foldable = require("../Data.Foldable");
var Data_Bifunctor_Clown = require("../Data.Bifunctor.Clown");
var Data_Bifunctor_Joker = require("../Data.Bifunctor.Joker");
var Data_Bifunctor_Flip = require("../Data.Bifunctor.Flip");
var Data_Bifunctor_Product = require("../Data.Bifunctor.Product");
var Data_Bifunctor_Wrap = require("../Data.Bifunctor.Wrap");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var Control_Category = require("../Control.Category");
var Data_Function = require("../Data.Function");
var Bifoldable = function (bifoldMap, bifoldl, bifoldr) {
    this.bifoldMap = bifoldMap;
    this.bifoldl = bifoldl;
    this.bifoldr = bifoldr;
};
var bifoldr = function (dict) {
    return dict.bifoldr;
};
var bitraverse_ = function (dictBifoldable) {
    return function (dictApplicative) {
        return function (f) {
            return function (g) {
                return bifoldr(dictBifoldable)(function ($97) {
                    return Control_Apply.applySecond(dictApplicative["__superclass_Control.Apply.Apply_0"]())(f($97));
                })(function ($98) {
                    return Control_Apply.applySecond(dictApplicative["__superclass_Control.Apply.Apply_0"]())(g($98));
                })(Control_Applicative.pure(dictApplicative)(Data_Unit.unit));
            };
        };
    };
};
var bifor_ = function (dictBifoldable) {
    return function (dictApplicative) {
        return function (t) {
            return function (f) {
                return function (g) {
                    return bitraverse_(dictBifoldable)(dictApplicative)(f)(g)(t);
                };
            };
        };
    };
};
var bisequence_ = function (dictBifoldable) {
    return function (dictApplicative) {
        return bitraverse_(dictBifoldable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn))(Control_Category.id(Control_Category.categoryFn));
    };
};
var bifoldl = function (dict) {
    return dict.bifoldl;
};
var bifoldableJoker = function (dictFoldable) {
    return new Bifoldable(function (dictMonoid) {
        return function (v) {
            return function (r) {
                return function (v1) {
                    return Data_Foldable.foldMap(dictFoldable)(dictMonoid)(r)(v1);
                };
            };
        };
    }, function (v) {
        return function (r) {
            return function (u) {
                return function (v1) {
                    return Data_Foldable.foldl(dictFoldable)(r)(u)(v1);
                };
            };
        };
    }, function (v) {
        return function (r) {
            return function (u) {
                return function (v1) {
                    return Data_Foldable.foldr(dictFoldable)(r)(u)(v1);
                };
            };
        };
    });
};
var bifoldableClown = function (dictFoldable) {
    return new Bifoldable(function (dictMonoid) {
        return function (l) {
            return function (v) {
                return function (v1) {
                    return Data_Foldable.foldMap(dictFoldable)(dictMonoid)(l)(v1);
                };
            };
        };
    }, function (l) {
        return function (v) {
            return function (u) {
                return function (v1) {
                    return Data_Foldable.foldl(dictFoldable)(l)(u)(v1);
                };
            };
        };
    }, function (l) {
        return function (v) {
            return function (u) {
                return function (v1) {
                    return Data_Foldable.foldr(dictFoldable)(l)(u)(v1);
                };
            };
        };
    });
};
var bifoldMapDefaultR = function (dictBifoldable) {
    return function (dictMonoid) {
        return function (f) {
            return function (g) {
                return function (p) {
                    return bifoldr(dictBifoldable)(function ($99) {
                        return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(f($99));
                    })(function ($100) {
                        return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(g($100));
                    })(Data_Monoid.mempty(dictMonoid))(p);
                };
            };
        };
    };
};
var bifoldMapDefaultL = function (dictBifoldable) {
    return function (dictMonoid) {
        return function (f) {
            return function (g) {
                return function (p) {
                    return bifoldl(dictBifoldable)(function (m) {
                        return function (a) {
                            return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(m)(f(a));
                        };
                    })(function (m) {
                        return function (b) {
                            return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(m)(g(b));
                        };
                    })(Data_Monoid.mempty(dictMonoid))(p);
                };
            };
        };
    };
};
var bifoldMap = function (dict) {
    return dict.bifoldMap;
};
var bifoldableFlip = function (dictBifoldable) {
    return new Bifoldable(function (dictMonoid) {
        return function (r) {
            return function (l) {
                return function (v) {
                    return bifoldMap(dictBifoldable)(dictMonoid)(l)(r)(v);
                };
            };
        };
    }, function (r) {
        return function (l) {
            return function (u) {
                return function (v) {
                    return bifoldl(dictBifoldable)(l)(r)(u)(v);
                };
            };
        };
    }, function (r) {
        return function (l) {
            return function (u) {
                return function (v) {
                    return bifoldr(dictBifoldable)(l)(r)(u)(v);
                };
            };
        };
    });
};
var bifoldableWrap = function (dictBifoldable) {
    return new Bifoldable(function (dictMonoid) {
        return function (l) {
            return function (r) {
                return function (v) {
                    return bifoldMap(dictBifoldable)(dictMonoid)(l)(r)(v);
                };
            };
        };
    }, function (l) {
        return function (r) {
            return function (u) {
                return function (v) {
                    return bifoldl(dictBifoldable)(l)(r)(u)(v);
                };
            };
        };
    }, function (l) {
        return function (r) {
            return function (u) {
                return function (v) {
                    return bifoldr(dictBifoldable)(l)(r)(u)(v);
                };
            };
        };
    });
};
var bifoldlDefault = function (dictBifoldable) {
    return function (f) {
        return function (g) {
            return function (z) {
                return function (p) {
                    return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(Data_Newtype.unwrap(Data_Monoid_Dual.newtypeDual)(bifoldMap(dictBifoldable)(Data_Monoid_Dual.monoidDual(Data_Monoid_Endo.monoidEndo))(function ($101) {
                        return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Data_Function.flip(f)($101)));
                    })(function ($102) {
                        return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Data_Function.flip(g)($102)));
                    })(p)))(z);
                };
            };
        };
    };
};
var bifoldrDefault = function (dictBifoldable) {
    return function (f) {
        return function (g) {
            return function (z) {
                return function (p) {
                    return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(bifoldMap(dictBifoldable)(Data_Monoid_Endo.monoidEndo)(function ($103) {
                        return Data_Monoid_Endo.Endo(f($103));
                    })(function ($104) {
                        return Data_Monoid_Endo.Endo(g($104));
                    })(p))(z);
                };
            };
        };
    };
};
var bifoldableProduct = function (dictBifoldable) {
    return function (dictBifoldable1) {
        return new Bifoldable(function (dictMonoid) {
            return function (l) {
                return function (r) {
                    return function (v) {
                        return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(bifoldMap(dictBifoldable)(dictMonoid)(l)(r)(v.value0))(bifoldMap(dictBifoldable1)(dictMonoid)(l)(r)(v.value1));
                    };
                };
            };
        }, function (l) {
            return function (r) {
                return function (u) {
                    return function (m) {
                        return bifoldlDefault(bifoldableProduct(dictBifoldable)(dictBifoldable1))(l)(r)(u)(m);
                    };
                };
            };
        }, function (l) {
            return function (r) {
                return function (u) {
                    return function (m) {
                        return bifoldrDefault(bifoldableProduct(dictBifoldable)(dictBifoldable1))(l)(r)(u)(m);
                    };
                };
            };
        });
    };
};
var bifold = function (dictBifoldable) {
    return function (dictMonoid) {
        return bifoldMap(dictBifoldable)(dictMonoid)(Control_Category.id(Control_Category.categoryFn))(Control_Category.id(Control_Category.categoryFn));
    };
};
var biany = function (dictBifoldable) {
    return function (dictBooleanAlgebra) {
        return function (p) {
            return function (q) {
                return function ($105) {
                    return Data_Newtype.unwrap(Data_Monoid_Disj.newtypeDisj)(bifoldMap(dictBifoldable)(Data_Monoid_Disj.monoidDisj(dictBooleanAlgebra["__superclass_Data.HeytingAlgebra.HeytingAlgebra_0"]()))(function ($106) {
                        return Data_Monoid_Disj.Disj(p($106));
                    })(function ($107) {
                        return Data_Monoid_Disj.Disj(q($107));
                    })($105));
                };
            };
        };
    };
};
var biall = function (dictBifoldable) {
    return function (dictBooleanAlgebra) {
        return function (p) {
            return function (q) {
                return function ($108) {
                    return Data_Newtype.unwrap(Data_Monoid_Conj.newtypeConj)(bifoldMap(dictBifoldable)(Data_Monoid_Conj.monoidConj(dictBooleanAlgebra["__superclass_Data.HeytingAlgebra.HeytingAlgebra_0"]()))(function ($109) {
                        return Data_Monoid_Conj.Conj(p($109));
                    })(function ($110) {
                        return Data_Monoid_Conj.Conj(q($110));
                    })($108));
                };
            };
        };
    };
};
module.exports = {
    Bifoldable: Bifoldable, 
    biall: biall, 
    biany: biany, 
    bifold: bifold, 
    bifoldMap: bifoldMap, 
    bifoldMapDefaultL: bifoldMapDefaultL, 
    bifoldMapDefaultR: bifoldMapDefaultR, 
    bifoldl: bifoldl, 
    bifoldlDefault: bifoldlDefault, 
    bifoldr: bifoldr, 
    bifoldrDefault: bifoldrDefault, 
    bifor_: bifor_, 
    bisequence_: bisequence_, 
    bitraverse_: bitraverse_, 
    bifoldableClown: bifoldableClown, 
    bifoldableJoker: bifoldableJoker, 
    bifoldableFlip: bifoldableFlip, 
    bifoldableProduct: bifoldableProduct, 
    bifoldableWrap: bifoldableWrap
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Category":41,"../Control.Semigroupoid":88,"../Data.Bifunctor.Clown":95,"../Data.Bifunctor.Flip":96,"../Data.Bifunctor.Joker":97,"../Data.Bifunctor.Product":98,"../Data.Bifunctor.Wrap":99,"../Data.Foldable":118,"../Data.Function":121,"../Data.Monoid":147,"../Data.Monoid.Conj":142,"../Data.Monoid.Disj":143,"../Data.Monoid.Dual":144,"../Data.Monoid.Endo":145,"../Data.Newtype":149,"../Data.Semigroup":161,"../Data.Unit":183,"../Prelude":196}],95:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Clown = function (x) {
    return x;
};
var showClown = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Clown " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordClown = function (dictOrd) {
    return dictOrd;
};
var newtypeClown = new Data_Newtype.Newtype(function (n) {
    return n;
}, Clown);
var functorClown = new Data_Functor.Functor(function (v) {
    return function (v1) {
        return v1;
    };
});
var eqClown = function (dictEq) {
    return dictEq;
};
var bifunctorClown = function (dictFunctor) {
    return new Data_Bifunctor.Bifunctor(function (f) {
        return function (v) {
            return function (v1) {
                return Data_Functor.map(dictFunctor)(f)(v1);
            };
        };
    });
};
var biapplyClown = function (dictApply) {
    return new Control_Biapply.Biapply(function () {
        return bifunctorClown(dictApply["__superclass_Data.Functor.Functor_0"]());
    }, function (v) {
        return function (v1) {
            return Control_Apply.apply(dictApply)(v)(v1);
        };
    });
};
var biapplicativeClown = function (dictApplicative) {
    return new Control_Biapplicative.Biapplicative(function () {
        return biapplyClown(dictApplicative["__superclass_Control.Apply.Apply_0"]());
    }, function (a) {
        return function (v) {
            return Control_Applicative.pure(dictApplicative)(a);
        };
    });
};
module.exports = {
    Clown: Clown, 
    newtypeClown: newtypeClown, 
    eqClown: eqClown, 
    ordClown: ordClown, 
    showClown: showClown, 
    functorClown: functorClown, 
    bifunctorClown: bifunctorClown, 
    biapplyClown: biapplyClown, 
    biapplicativeClown: biapplicativeClown
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Biapplicative":37,"../Control.Biapply":38,"../Data.Bifunctor":100,"../Data.Eq":113,"../Data.Functor":127,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196}],96:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Functor = require("../Data.Functor");
var Flip = function (x) {
    return x;
};
var showFlip = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Flip " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordFlip = function (dictOrd) {
    return dictOrd;
};
var newtypeFlip = new Data_Newtype.Newtype(function (n) {
    return n;
}, Flip);
var functorFlip = function (dictBifunctor) {
    return new Data_Functor.Functor(function (f) {
        return function (v) {
            return Data_Bifunctor.lmap(dictBifunctor)(f)(v);
        };
    });
};
var eqFlip = function (dictEq) {
    return dictEq;
};
var bifunctorFlip = function (dictBifunctor) {
    return new Data_Bifunctor.Bifunctor(function (f) {
        return function (g) {
            return function (v) {
                return Data_Bifunctor.bimap(dictBifunctor)(g)(f)(v);
            };
        };
    });
};
var biapplyFlip = function (dictBiapply) {
    return new Control_Biapply.Biapply(function () {
        return bifunctorFlip(dictBiapply["__superclass_Data.Bifunctor.Bifunctor_0"]());
    }, function (v) {
        return function (v1) {
            return Control_Biapply.biapply(dictBiapply)(v)(v1);
        };
    });
};
var biapplicativeFlip = function (dictBiapplicative) {
    return new Control_Biapplicative.Biapplicative(function () {
        return biapplyFlip(dictBiapplicative["__superclass_Control.Biapply.Biapply_0"]());
    }, function (a) {
        return function (b) {
            return Control_Biapplicative.bipure(dictBiapplicative)(b)(a);
        };
    });
};
module.exports = {
    Flip: Flip, 
    newtypeFlip: newtypeFlip, 
    eqFlip: eqFlip, 
    ordFlip: ordFlip, 
    showFlip: showFlip, 
    functorFlip: functorFlip, 
    bifunctorFlip: bifunctorFlip, 
    biapplyFlip: biapplyFlip, 
    biapplicativeFlip: biapplicativeFlip
};

},{"../Control.Biapplicative":37,"../Control.Biapply":38,"../Data.Bifunctor":100,"../Data.Eq":113,"../Data.Functor":127,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196}],97:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Joker = function (x) {
    return x;
};
var showJoker = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Joker " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordJoker = function (dictOrd) {
    return dictOrd;
};
var newtypeJoker = new Data_Newtype.Newtype(function (n) {
    return n;
}, Joker);
var functorJoker = function (dictFunctor) {
    return new Data_Functor.Functor(function (g) {
        return function (v) {
            return Data_Functor.map(dictFunctor)(g)(v);
        };
    });
};
var eqJoker = function (dictEq) {
    return dictEq;
};
var bifunctorJoker = function (dictFunctor) {
    return new Data_Bifunctor.Bifunctor(function (v) {
        return function (g) {
            return function (v1) {
                return Data_Functor.map(dictFunctor)(g)(v1);
            };
        };
    });
};
var biapplyJoker = function (dictApply) {
    return new Control_Biapply.Biapply(function () {
        return bifunctorJoker(dictApply["__superclass_Data.Functor.Functor_0"]());
    }, function (v) {
        return function (v1) {
            return Control_Apply.apply(dictApply)(v)(v1);
        };
    });
};
var biapplicativeJoker = function (dictApplicative) {
    return new Control_Biapplicative.Biapplicative(function () {
        return biapplyJoker(dictApplicative["__superclass_Control.Apply.Apply_0"]());
    }, function (v) {
        return function (b) {
            return Control_Applicative.pure(dictApplicative)(b);
        };
    });
};
module.exports = {
    Joker: Joker, 
    newtypeJoker: newtypeJoker, 
    eqJoker: eqJoker, 
    ordJoker: ordJoker, 
    showJoker: showJoker, 
    functorJoker: functorJoker, 
    bifunctorJoker: bifunctorJoker, 
    biapplyJoker: biapplyJoker, 
    biapplicativeJoker: biapplicativeJoker
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Biapplicative":37,"../Control.Biapply":38,"../Data.Bifunctor":100,"../Data.Eq":113,"../Data.Functor":127,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196}],98:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Product = (function () {
    function Product(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Product.create = function (value0) {
        return function (value1) {
            return new Product(value0, value1);
        };
    };
    return Product;
})();
var showProduct = function (dictShow) {
    return function (dictShow1) {
        return new Data_Show.Show(function (v) {
            return "(Product " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(dictShow1)(v.value1) + ")")));
        });
    };
};
var eqProduct = function (dictEq) {
    return function (dictEq1) {
        return new Data_Eq.Eq(function (x) {
            return function (y) {
                return Data_Eq.eq(dictEq)(x.value0)(y.value0) && Data_Eq.eq(dictEq1)(x.value1)(y.value1);
            };
        });
    };
};
var ordProduct = function (dictOrd) {
    return function (dictOrd1) {
        return new Data_Ord.Ord(function () {
            return eqProduct(dictOrd["__superclass_Data.Eq.Eq_0"]())(dictOrd1["__superclass_Data.Eq.Eq_0"]());
        }, function (x) {
            return function (y) {
                var $39 = Data_Ord.compare(dictOrd)(x.value0)(y.value0);
                if ($39 instanceof Data_Ordering.LT) {
                    return Data_Ordering.LT.value;
                };
                if ($39 instanceof Data_Ordering.GT) {
                    return Data_Ordering.GT.value;
                };
                return Data_Ord.compare(dictOrd1)(x.value1)(y.value1);
            };
        });
    };
};
var bifunctorProduct = function (dictBifunctor) {
    return function (dictBifunctor1) {
        return new Data_Bifunctor.Bifunctor(function (f) {
            return function (g) {
                return function (v) {
                    return new Product(Data_Bifunctor.bimap(dictBifunctor)(f)(g)(v.value0), Data_Bifunctor.bimap(dictBifunctor1)(f)(g)(v.value1));
                };
            };
        });
    };
};
var biapplyProduct = function (dictBiapply) {
    return function (dictBiapply1) {
        return new Control_Biapply.Biapply(function () {
            return bifunctorProduct(dictBiapply["__superclass_Data.Bifunctor.Bifunctor_0"]())(dictBiapply1["__superclass_Data.Bifunctor.Bifunctor_0"]());
        }, function (v) {
            return function (v1) {
                return new Product(Control_Biapply.biapply(dictBiapply)(v.value0)(v1.value0), Control_Biapply.biapply(dictBiapply1)(v.value1)(v1.value1));
            };
        });
    };
};
var biapplicativeProduct = function (dictBiapplicative) {
    return function (dictBiapplicative1) {
        return new Control_Biapplicative.Biapplicative(function () {
            return biapplyProduct(dictBiapplicative["__superclass_Control.Biapply.Biapply_0"]())(dictBiapplicative1["__superclass_Control.Biapply.Biapply_0"]());
        }, function (a) {
            return function (b) {
                return new Product(Control_Biapplicative.bipure(dictBiapplicative)(a)(b), Control_Biapplicative.bipure(dictBiapplicative1)(a)(b));
            };
        });
    };
};
module.exports = {
    Product: Product, 
    eqProduct: eqProduct, 
    ordProduct: ordProduct, 
    showProduct: showProduct, 
    bifunctorProduct: bifunctorProduct, 
    biapplyProduct: biapplyProduct, 
    biapplicativeProduct: biapplicativeProduct
};

},{"../Control.Biapplicative":37,"../Control.Biapply":38,"../Data.Bifunctor":100,"../Data.Eq":113,"../Data.HeytingAlgebra":131,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196}],99:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Functor = require("../Data.Functor");
var Wrap = function (x) {
    return x;
};
var showWrap = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Wrap " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordWrap = function (dictOrd) {
    return dictOrd;
};
var newtypeWrap = new Data_Newtype.Newtype(function (n) {
    return n;
}, Wrap);
var functorWrap = function (dictBifunctor) {
    return new Data_Functor.Functor(function (f) {
        return function (v) {
            return Data_Bifunctor.rmap(dictBifunctor)(f)(v);
        };
    });
};
var eqWrap = function (dictEq) {
    return dictEq;
};
var bifunctorWrap = function (dictBifunctor) {
    return new Data_Bifunctor.Bifunctor(function (f) {
        return function (g) {
            return function (v) {
                return Data_Bifunctor.bimap(dictBifunctor)(f)(g)(v);
            };
        };
    });
};
var biapplyWrap = function (dictBiapply) {
    return new Control_Biapply.Biapply(function () {
        return bifunctorWrap(dictBiapply["__superclass_Data.Bifunctor.Bifunctor_0"]());
    }, function (v) {
        return function (v1) {
            return Control_Biapply.biapply(dictBiapply)(v)(v1);
        };
    });
};
var biapplicativeWrap = function (dictBiapplicative) {
    return new Control_Biapplicative.Biapplicative(function () {
        return biapplyWrap(dictBiapplicative["__superclass_Control.Biapply.Biapply_0"]());
    }, function (a) {
        return function (b) {
            return Control_Biapplicative.bipure(dictBiapplicative)(a)(b);
        };
    });
};
module.exports = {
    Wrap: Wrap, 
    newtypeWrap: newtypeWrap, 
    eqWrap: eqWrap, 
    ordWrap: ordWrap, 
    showWrap: showWrap, 
    functorWrap: functorWrap, 
    bifunctorWrap: bifunctorWrap, 
    biapplyWrap: biapplyWrap, 
    biapplicativeWrap: biapplicativeWrap
};

},{"../Control.Biapplicative":37,"../Control.Biapply":38,"../Data.Bifunctor":100,"../Data.Eq":113,"../Data.Functor":127,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196}],100:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Category = require("../Control.Category");
var Bifunctor = function (bimap) {
    this.bimap = bimap;
};
var bimap = function (dict) {
    return dict.bimap;
};
var lmap = function (dictBifunctor) {
    return function (f) {
        return bimap(dictBifunctor)(f)(Control_Category.id(Control_Category.categoryFn));
    };
};
var rmap = function (dictBifunctor) {
    return bimap(dictBifunctor)(Control_Category.id(Control_Category.categoryFn));
};
module.exports = {
    Bifunctor: Bifunctor, 
    bimap: bimap, 
    lmap: lmap, 
    rmap: rmap
};

},{"../Control.Category":41}],101:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Bifoldable = require("../Data.Bifoldable");
var Data_Traversable = require("../Data.Traversable");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Bifunctor_Clown = require("../Data.Bifunctor.Clown");
var Data_Bifunctor_Joker = require("../Data.Bifunctor.Joker");
var Data_Bifunctor_Flip = require("../Data.Bifunctor.Flip");
var Data_Bifunctor_Product = require("../Data.Bifunctor.Product");
var Data_Bifunctor_Wrap = require("../Data.Bifunctor.Wrap");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Category = require("../Control.Category");
var Bitraversable = function (__superclass_Data$dotBifoldable$dotBifoldable_1, __superclass_Data$dotBifunctor$dotBifunctor_0, bisequence, bitraverse) {
    this["__superclass_Data.Bifoldable.Bifoldable_1"] = __superclass_Data$dotBifoldable$dotBifoldable_1;
    this["__superclass_Data.Bifunctor.Bifunctor_0"] = __superclass_Data$dotBifunctor$dotBifunctor_0;
    this.bisequence = bisequence;
    this.bitraverse = bitraverse;
};
var bitraverse = function (dict) {
    return dict.bitraverse;
};
var lfor = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (t) {
            return function (f) {
                return bitraverse(dictBitraversable)(dictApplicative)(f)(Control_Applicative.pure(dictApplicative))(t);
            };
        };
    };
};
var ltraverse = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (f) {
            return bitraverse(dictBitraversable)(dictApplicative)(f)(Control_Applicative.pure(dictApplicative));
        };
    };
};
var rfor = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (t) {
            return function (f) {
                return bitraverse(dictBitraversable)(dictApplicative)(Control_Applicative.pure(dictApplicative))(f)(t);
            };
        };
    };
};
var rtraverse = function (dictBitraversable) {
    return function (dictApplicative) {
        return bitraverse(dictBitraversable)(dictApplicative)(Control_Applicative.pure(dictApplicative));
    };
};
var bitraversableJoker = function (dictTraversable) {
    return new Bitraversable(function () {
        return Data_Bifoldable.bifoldableJoker(dictTraversable["__superclass_Data.Foldable.Foldable_1"]());
    }, function () {
        return Data_Bifunctor_Joker.bifunctorJoker(dictTraversable["__superclass_Data.Functor.Functor_0"]());
    }, function (dictApplicative) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Joker.Joker)(Data_Traversable.sequence(dictTraversable)(dictApplicative)(v));
        };
    }, function (dictApplicative) {
        return function (v) {
            return function (r) {
                return function (v1) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Joker.Joker)(Data_Traversable.traverse(dictTraversable)(dictApplicative)(r)(v1));
                };
            };
        };
    });
};
var bitraversableClown = function (dictTraversable) {
    return new Bitraversable(function () {
        return Data_Bifoldable.bifoldableClown(dictTraversable["__superclass_Data.Foldable.Foldable_1"]());
    }, function () {
        return Data_Bifunctor_Clown.bifunctorClown(dictTraversable["__superclass_Data.Functor.Functor_0"]());
    }, function (dictApplicative) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Clown.Clown)(Data_Traversable.sequence(dictTraversable)(dictApplicative)(v));
        };
    }, function (dictApplicative) {
        return function (l) {
            return function (v) {
                return function (v1) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Clown.Clown)(Data_Traversable.traverse(dictTraversable)(dictApplicative)(l)(v1));
                };
            };
        };
    });
};
var bisequenceDefault = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (t) {
            return bitraverse(dictBitraversable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn))(Control_Category.id(Control_Category.categoryFn))(t);
        };
    };
};
var bisequence = function (dict) {
    return dict.bisequence;
};
var bitraversableFlip = function (dictBitraversable) {
    return new Bitraversable(function () {
        return Data_Bifoldable.bifoldableFlip(dictBitraversable["__superclass_Data.Bifoldable.Bifoldable_1"]());
    }, function () {
        return Data_Bifunctor_Flip.bifunctorFlip(dictBitraversable["__superclass_Data.Bifunctor.Bifunctor_0"]());
    }, function (dictApplicative) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Flip.Flip)(bisequence(dictBitraversable)(dictApplicative)(v));
        };
    }, function (dictApplicative) {
        return function (r) {
            return function (l) {
                return function (v) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Flip.Flip)(bitraverse(dictBitraversable)(dictApplicative)(l)(r)(v));
                };
            };
        };
    });
};
var bitraversableProduct = function (dictBitraversable) {
    return function (dictBitraversable1) {
        return new Bitraversable(function () {
            return Data_Bifoldable.bifoldableProduct(dictBitraversable["__superclass_Data.Bifoldable.Bifoldable_1"]())(dictBitraversable1["__superclass_Data.Bifoldable.Bifoldable_1"]());
        }, function () {
            return Data_Bifunctor_Product.bifunctorProduct(dictBitraversable["__superclass_Data.Bifunctor.Bifunctor_0"]())(dictBitraversable1["__superclass_Data.Bifunctor.Bifunctor_0"]());
        }, function (dictApplicative) {
            return function (v) {
                return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Product.Product.create)(bisequence(dictBitraversable)(dictApplicative)(v.value0)))(bisequence(dictBitraversable1)(dictApplicative)(v.value1));
            };
        }, function (dictApplicative) {
            return function (l) {
                return function (r) {
                    return function (v) {
                        return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Product.Product.create)(bitraverse(dictBitraversable)(dictApplicative)(l)(r)(v.value0)))(bitraverse(dictBitraversable1)(dictApplicative)(l)(r)(v.value1));
                    };
                };
            };
        });
    };
};
var bitraversableWrap = function (dictBitraversable) {
    return new Bitraversable(function () {
        return Data_Bifoldable.bifoldableWrap(dictBitraversable["__superclass_Data.Bifoldable.Bifoldable_1"]());
    }, function () {
        return Data_Bifunctor_Wrap.bifunctorWrap(dictBitraversable["__superclass_Data.Bifunctor.Bifunctor_0"]());
    }, function (dictApplicative) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Wrap.Wrap)(bisequence(dictBitraversable)(dictApplicative)(v));
        };
    }, function (dictApplicative) {
        return function (l) {
            return function (r) {
                return function (v) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Bifunctor_Wrap.Wrap)(bitraverse(dictBitraversable)(dictApplicative)(l)(r)(v));
                };
            };
        };
    });
};
var bitraverseDefault = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (f) {
            return function (g) {
                return function (t) {
                    return bisequence(dictBitraversable)(dictApplicative)(Data_Bifunctor.bimap(dictBitraversable["__superclass_Data.Bifunctor.Bifunctor_0"]())(f)(g)(t));
                };
            };
        };
    };
};
var bifor = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (t) {
            return function (f) {
                return function (g) {
                    return bitraverse(dictBitraversable)(dictApplicative)(f)(g)(t);
                };
            };
        };
    };
};
module.exports = {
    Bitraversable: Bitraversable, 
    bifor: bifor, 
    bisequence: bisequence, 
    bisequenceDefault: bisequenceDefault, 
    bitraverse: bitraverse, 
    bitraverseDefault: bitraverseDefault, 
    lfor: lfor, 
    ltraverse: ltraverse, 
    rfor: rfor, 
    rtraverse: rtraverse, 
    bitraversableClown: bitraversableClown, 
    bitraversableJoker: bitraversableJoker, 
    bitraversableFlip: bitraversableFlip, 
    bitraversableProduct: bitraversableProduct, 
    bitraversableWrap: bitraversableWrap
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Category":41,"../Data.Bifoldable":94,"../Data.Bifunctor":100,"../Data.Bifunctor.Clown":95,"../Data.Bifunctor.Flip":96,"../Data.Bifunctor.Joker":97,"../Data.Bifunctor.Product":98,"../Data.Bifunctor.Wrap":99,"../Data.Functor":127,"../Data.Traversable":178,"../Prelude":196}],102:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var otherwise = true;
module.exports = {
    otherwise: otherwise
};

},{}],103:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Unit = require("../Data.Unit");
var BooleanAlgebra = function (__superclass_Data$dotHeytingAlgebra$dotHeytingAlgebra_0) {
    this["__superclass_Data.HeytingAlgebra.HeytingAlgebra_0"] = __superclass_Data$dotHeytingAlgebra$dotHeytingAlgebra_0;
};
var booleanAlgebraUnit = new BooleanAlgebra(function () {
    return Data_HeytingAlgebra.heytingAlgebraUnit;
});
var booleanAlgebraFn = function (dictBooleanAlgebra) {
    return new BooleanAlgebra(function () {
        return Data_HeytingAlgebra.heytingAlgebraFunction(dictBooleanAlgebra["__superclass_Data.HeytingAlgebra.HeytingAlgebra_0"]());
    });
};
var booleanAlgebraBoolean = new BooleanAlgebra(function () {
    return Data_HeytingAlgebra.heytingAlgebraBoolean;
});
module.exports = {
    BooleanAlgebra: BooleanAlgebra, 
    booleanAlgebraBoolean: booleanAlgebraBoolean, 
    booleanAlgebraUnit: booleanAlgebraUnit, 
    booleanAlgebraFn: booleanAlgebraFn
};

},{"../Data.HeytingAlgebra":131,"../Data.Unit":183}],104:[function(require,module,exports){
"use strict";

exports.topInt = 2147483647;
exports.bottomInt = -2147483648;

exports.topChar = String.fromCharCode(65535);
exports.bottomChar = String.fromCharCode(0);

},{}],105:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Ord = require("../Data.Ord");
var Data_Unit = require("../Data.Unit");
var Data_Ordering = require("../Data.Ordering");
var Bounded = function (__superclass_Data$dotOrd$dotOrd_0, bottom, top) {
    this["__superclass_Data.Ord.Ord_0"] = __superclass_Data$dotOrd$dotOrd_0;
    this.bottom = bottom;
    this.top = top;
};
var top = function (dict) {
    return dict.top;
};
var boundedUnit = new Bounded(function () {
    return Data_Ord.ordUnit;
}, Data_Unit.unit, Data_Unit.unit);
var boundedOrdering = new Bounded(function () {
    return Data_Ord.ordOrdering;
}, Data_Ordering.LT.value, Data_Ordering.GT.value);
var boundedInt = new Bounded(function () {
    return Data_Ord.ordInt;
}, $foreign.bottomInt, $foreign.topInt);
var boundedChar = new Bounded(function () {
    return Data_Ord.ordChar;
}, $foreign.bottomChar, $foreign.topChar);
var boundedBoolean = new Bounded(function () {
    return Data_Ord.ordBoolean;
}, false, true);
var bottom = function (dict) {
    return dict.bottom;
};
module.exports = {
    Bounded: Bounded, 
    bottom: bottom, 
    top: top, 
    boundedBoolean: boundedBoolean, 
    boundedInt: boundedInt, 
    boundedChar: boundedChar, 
    boundedOrdering: boundedOrdering, 
    boundedUnit: boundedUnit
};

},{"../Data.Ord":154,"../Data.Ordering":155,"../Data.Unit":183,"./foreign":104}],106:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_CatQueue = require("../Data.CatQueue");
var Data_Foldable = require("../Data.Foldable");
var Data_List = require("../Data.List");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Control_MonadPlus = require("../Control.MonadPlus");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_NaturalTransformation = require("../Data.NaturalTransformation");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Data_Unfoldable = require("../Data.Unfoldable");
var Data_List_Types = require("../Data.List.Types");
var CatNil = (function () {
    function CatNil() {

    };
    CatNil.value = new CatNil();
    return CatNil;
})();
var CatCons = (function () {
    function CatCons(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    CatCons.create = function (value0) {
        return function (value1) {
            return new CatCons(value0, value1);
        };
    };
    return CatCons;
})();
var showCatList = function (dictShow) {
    return new Data_Show.Show(function (v) {
        if (v instanceof CatNil) {
            return "CatNil";
        };
        if (v instanceof CatCons) {
            return "(CatList " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(Data_CatQueue.showCatQueue(showCatList(dictShow)))(v.value1) + ")")));
        };
        throw new Error("Failed pattern match at Data.CatList line 154, column 3 - line 155, column 3: " + [ v.constructor.name ]);
    });
};
var $$null = function (v) {
    if (v instanceof CatNil) {
        return true;
    };
    return false;
};
var link = function (v) {
    return function (cat) {
        if (v instanceof CatNil) {
            return cat;
        };
        if (v instanceof CatCons) {
            return new CatCons(v.value0, Data_CatQueue.snoc(v.value1)(cat));
        };
        throw new Error("Failed pattern match at Data.CatList line 111, column 1 - line 111, column 22: " + [ v.constructor.name, cat.constructor.name ]);
    };
};
var foldr = function (k) {
    return function (b) {
        return function (q) {
            var foldl = function (__copy_v) {
                return function (__copy_c) {
                    return function (__copy_v1) {
                        var v = __copy_v;
                        var c = __copy_c;
                        var v1 = __copy_v1;
                        tco: while (true) {
                            if (v1 instanceof Data_List_Types.Nil) {
                                return c;
                            };
                            if (v1 instanceof Data_List_Types.Cons) {
                                var __tco_v = v;
                                var __tco_c = v(c)(v1.value0);
                                var __tco_v1 = v1.value1;
                                v = __tco_v;
                                c = __tco_c;
                                v1 = __tco_v1;
                                continue tco;
                            };
                            throw new Error("Failed pattern match at Data.CatList line 126, column 3 - line 126, column 22: " + [ v.constructor.name, c.constructor.name, v1.constructor.name ]);
                        };
                    };
                };
            };
            var go = function (__copy_xs) {
                return function (__copy_ys) {
                    var xs = __copy_xs;
                    var ys = __copy_ys;
                    tco: while (true) {
                        var $33 = Data_CatQueue.uncons(xs);
                        if ($33 instanceof Data_Maybe.Nothing) {
                            return foldl(function (x) {
                                return function (i) {
                                    return i(x);
                                };
                            })(b)(ys);
                        };
                        if ($33 instanceof Data_Maybe.Just) {
                            var __tco_ys = new Data_List_Types.Cons(k($33.value0.value0), ys);
                            xs = $33.value0.value1;
                            ys = __tco_ys;
                            continue tco;
                        };
                        throw new Error("Failed pattern match at Data.CatList line 121, column 14 - line 123, column 67: " + [ $33.constructor.name ]);
                    };
                };
            };
            return go(q)(Data_List_Types.Nil.value);
        };
    };
};
var uncons = function (v) {
    if (v instanceof CatNil) {
        return Data_Maybe.Nothing.value;
    };
    if (v instanceof CatCons) {
        return new Data_Maybe.Just(new Data_Tuple.Tuple(v.value0, (function () {
            var $38 = Data_CatQueue["null"](v.value1);
            if ($38) {
                return CatNil.value;
            };
            if (!$38) {
                return foldr(link)(CatNil.value)(v.value1);
            };
            throw new Error("Failed pattern match at Data.CatList line 103, column 39 - line 103, column 89: " + [ $38.constructor.name ]);
        })()));
    };
    throw new Error("Failed pattern match at Data.CatList line 102, column 1 - line 102, column 24: " + [ v.constructor.name ]);
};
var foldMap = function (dictMonoid) {
    return function (f) {
        return function (v) {
            if (v instanceof CatNil) {
                return Data_Monoid.mempty(dictMonoid);
            };
            if (v instanceof CatCons) {
                var d = (function () {
                    var $43 = Data_CatQueue["null"](v.value1);
                    if ($43) {
                        return CatNil.value;
                    };
                    if (!$43) {
                        return foldr(link)(CatNil.value)(v.value1);
                    };
                    throw new Error("Failed pattern match at Data.CatList line 144, column 11 - line 144, column 61: " + [ $43.constructor.name ]);
                })();
                return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(f(v.value0))(foldMap(dictMonoid)(f)(d));
            };
            throw new Error("Failed pattern match at Data.CatList line 142, column 1 - line 142, column 26: " + [ f.constructor.name, v.constructor.name ]);
        };
    };
};
var foldableCatList = new Data_Foldable.Foldable(function (dictMonoid) {
    return function (f) {
        return function (l) {
            return foldMap(dictMonoid)(f)(l);
        };
    };
}, function (f) {
    return function (s) {
        return function (l) {
            return Data_Foldable.foldlDefault(foldableCatList)(f)(s)(l);
        };
    };
}, function (f) {
    return function (s) {
        return function (l) {
            return Data_Foldable.foldrDefault(foldableCatList)(f)(s)(l);
        };
    };
});
var empty = CatNil.value;
var append = function (v) {
    return function (v1) {
        if (v1 instanceof CatNil) {
            return v;
        };
        if (v instanceof CatNil) {
            return v1;
        };
        return link(v)(v1);
    };
};
var cons = function (a) {
    return function (cat) {
        return append(new CatCons(a, Data_CatQueue.empty))(cat);
    };
};
var map = function (v) {
    return function (v1) {
        if (v1 instanceof CatNil) {
            return CatNil.value;
        };
        if (v1 instanceof CatCons) {
            var d = (function () {
                var $50 = Data_CatQueue["null"](v1.value1);
                if ($50) {
                    return CatNil.value;
                };
                if (!$50) {
                    return foldr(link)(CatNil.value)(v1.value1);
                };
                throw new Error("Failed pattern match at Data.CatList line 138, column 11 - line 138, column 61: " + [ $50.constructor.name ]);
            })();
            return cons(v(v1.value0))(map(v)(d));
        };
        throw new Error("Failed pattern match at Data.CatList line 136, column 1 - line 136, column 22: " + [ v.constructor.name, v1.constructor.name ]);
    };
};
var functorCatList = new Data_Functor.Functor(map);
var singleton = function (a) {
    return cons(a)(CatNil.value);
};
var traversableCatList = new Data_Traversable.Traversable(function () {
    return foldableCatList;
}, function () {
    return functorCatList;
}, function (dictApplicative) {
    return function (v) {
        if (v instanceof CatNil) {
            return Control_Applicative.pure(dictApplicative)(CatNil.value);
        };
        if (v instanceof CatCons) {
            var d = (function () {
                var $54 = Data_CatQueue["null"](v.value1);
                if ($54) {
                    return CatNil.value;
                };
                if (!$54) {
                    return foldr(link)(CatNil.value)(v.value1);
                };
                throw new Error("Failed pattern match at Data.CatList line 176, column 13 - line 176, column 63: " + [ $54.constructor.name ]);
            })();
            return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(cons)(v.value0))(Data_Traversable.sequence(traversableCatList)(dictApplicative)(d));
        };
        throw new Error("Failed pattern match at Data.CatList line 174, column 3 - line 174, column 32: " + [ v.constructor.name ]);
    };
}, function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (v1 instanceof CatNil) {
                return Control_Applicative.pure(dictApplicative)(CatNil.value);
            };
            if (v1 instanceof CatCons) {
                var d = (function () {
                    var $59 = Data_CatQueue["null"](v1.value1);
                    if ($59) {
                        return CatNil.value;
                    };
                    if (!$59) {
                        return foldr(link)(CatNil.value)(v1.value1);
                    };
                    throw new Error("Failed pattern match at Data.CatList line 172, column 13 - line 172, column 63: " + [ $59.constructor.name ]);
                })();
                return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(cons)(v(v1.value0)))(Data_Traversable.traverse(traversableCatList)(dictApplicative)(v)(d));
            };
            throw new Error("Failed pattern match at Data.CatList line 170, column 3 - line 170, column 34: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
});
var semigroupCatList = new Data_Semigroup.Semigroup(append);
var monoidCatList = new Data_Monoid.Monoid(function () {
    return semigroupCatList;
}, CatNil.value);
var monadCatList = new Control_Monad.Monad(function () {
    return applicativeCatList;
}, function () {
    return bindCatList;
});
var bindCatList = new Control_Bind.Bind(function () {
    return applyCatList;
}, Data_Function.flip(foldMap(monoidCatList)));
var applyCatList = new Control_Apply.Apply(function () {
    return functorCatList;
}, Control_Monad.ap(monadCatList));
var applicativeCatList = new Control_Applicative.Applicative(function () {
    return applyCatList;
}, singleton);
var fromFoldable = function (dictFoldable) {
    return function (f) {
        return Data_Foldable.foldMap(dictFoldable)(monoidCatList)(singleton)(f);
    };
};
var snoc = function (cat) {
    return function (a) {
        return append(cat)(new CatCons(a, Data_CatQueue.empty));
    };
};
var unfoldableCatList = new Data_Unfoldable.Unfoldable(function (f) {
    return function (b) {
        var go = function (__copy_source) {
            return function (__copy_memo) {
                var source = __copy_source;
                var memo = __copy_memo;
                tco: while (true) {
                    var $62 = f(source);
                    if ($62 instanceof Data_Maybe.Nothing) {
                        return memo;
                    };
                    if ($62 instanceof Data_Maybe.Just) {
                        var __tco_memo = snoc(memo)($62.value0.value0);
                        source = $62.value0.value1;
                        memo = __tco_memo;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.CatList line 165, column 24 - line 167, column 57: " + [ $62.constructor.name ]);
                };
            };
        };
        return go(b)(CatNil.value);
    };
});
var altCatList = new Control_Alt.Alt(function () {
    return functorCatList;
}, append);
var plusCatList = new Control_Plus.Plus(function () {
    return altCatList;
}, empty);
var alternativeCatList = new Control_Alternative.Alternative(function () {
    return applicativeCatList;
}, function () {
    return plusCatList;
});
var monadZeroCatList = new Control_MonadZero.MonadZero(function () {
    return alternativeCatList;
}, function () {
    return monadCatList;
});
var monadPlusCatList = new Control_MonadPlus.MonadPlus(function () {
    return monadZeroCatList;
});
module.exports = {
    CatNil: CatNil, 
    CatCons: CatCons, 
    append: append, 
    cons: cons, 
    empty: empty, 
    fromFoldable: fromFoldable, 
    "null": $$null, 
    snoc: snoc, 
    uncons: uncons, 
    semigroupCatList: semigroupCatList, 
    monoidCatList: monoidCatList, 
    showCatList: showCatList, 
    foldableCatList: foldableCatList, 
    unfoldableCatList: unfoldableCatList, 
    traversableCatList: traversableCatList, 
    functorCatList: functorCatList, 
    applyCatList: applyCatList, 
    applicativeCatList: applicativeCatList, 
    bindCatList: bindCatList, 
    monadCatList: monadCatList, 
    altCatList: altCatList, 
    plusCatList: plusCatList, 
    alternativeCatList: alternativeCatList, 
    monadZeroCatList: monadZeroCatList, 
    monadPlusCatList: monadPlusCatList
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Monad":82,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Plus":87,"../Data.CatQueue":107,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.List":137,"../Data.List.Types":136,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.NaturalTransformation":148,"../Data.Semigroup":161,"../Data.Show":165,"../Data.Traversable":178,"../Data.Tuple":179,"../Data.Unfoldable":181}],107:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_List = require("../Data.List");
var Data_Maybe = require("../Data.Maybe");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Data_Tuple = require("../Data.Tuple");
var Data_List_Types = require("../Data.List.Types");
var CatQueue = (function () {
    function CatQueue(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    CatQueue.create = function (value0) {
        return function (value1) {
            return new CatQueue(value0, value1);
        };
    };
    return CatQueue;
})();
var uncons = function (__copy_v) {
    var v = __copy_v;
    tco: while (true) {
        if (v.value0 instanceof Data_List_Types.Nil && v.value1 instanceof Data_List_Types.Nil) {
            return Data_Maybe.Nothing.value;
        };
        if (v.value0 instanceof Data_List_Types.Nil) {
            var __tco_v = new CatQueue(Data_List.reverse(v.value1), Data_List_Types.Nil.value);
            v = __tco_v;
            continue tco;
        };
        if (v.value0 instanceof Data_List_Types.Cons) {
            return new Data_Maybe.Just(new Data_Tuple.Tuple(v.value0.value0, new CatQueue(v.value0.value1, v.value1)));
        };
        throw new Error("Failed pattern match at Data.CatQueue line 51, column 1 - line 51, column 36: " + [ v.constructor.name ]);
    };
};
var snoc = function (v) {
    return function (a) {
        return new CatQueue(v.value0, new Data_List_Types.Cons(a, v.value1));
    };
};
var showCatQueue = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(CatQueue " + (Data_Show.show(Data_List_Types.showList(dictShow))(v.value0) + (" " + (Data_Show.show(Data_List_Types.showList(dictShow))(v.value1) + ")")));
    });
};
var $$null = function (v) {
    if (v.value0 instanceof Data_List_Types.Nil && v.value1 instanceof Data_List_Types.Nil) {
        return true;
    };
    return false;
};
var empty = new CatQueue(Data_List_Types.Nil.value, Data_List_Types.Nil.value);
module.exports = {
    CatQueue: CatQueue, 
    empty: empty, 
    "null": $$null, 
    snoc: snoc, 
    uncons: uncons, 
    showCatQueue: showCatQueue
};

},{"../Data.List":137,"../Data.List.Types":136,"../Data.Maybe":140,"../Data.Semigroup":161,"../Data.Show":165,"../Data.Tuple":179}],108:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var CommutativeRing = function (__superclass_Data$dotRing$dotRing_0) {
    this["__superclass_Data.Ring.Ring_0"] = __superclass_Data$dotRing$dotRing_0;
};
var commutativeRingUnit = new CommutativeRing(function () {
    return Data_Ring.ringUnit;
});
var commutativeRingNumber = new CommutativeRing(function () {
    return Data_Ring.ringNumber;
});
var commutativeRingInt = new CommutativeRing(function () {
    return Data_Ring.ringInt;
});
var commutativeRingFn = function (dictCommutativeRing) {
    return new CommutativeRing(function () {
        return Data_Ring.ringFn(dictCommutativeRing["__superclass_Data.Ring.Ring_0"]());
    });
};
module.exports = {
    CommutativeRing: CommutativeRing, 
    commutativeRingInt: commutativeRingInt, 
    commutativeRingNumber: commutativeRingNumber, 
    commutativeRingUnit: commutativeRingUnit, 
    commutativeRingFn: commutativeRingFn
};

},{"../Data.Ring":159,"../Data.Semiring":163,"../Data.Unit":183}],109:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Foldable = require("../Data.Foldable");
var Data_Functor_Contravariant = require("../Data.Functor.Contravariant");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Traversable = require("../Data.Traversable");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Semiring = require("../Data.Semiring");
var Data_Ring = require("../Data.Ring");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_Field = require("../Data.Field");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_BooleanAlgebra = require("../Data.BooleanAlgebra");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Applicative = require("../Control.Applicative");
var Const = function (x) {
    return x;
};
var showConst = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Const " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semiringConst = function (dictSemiring) {
    return dictSemiring;
};
var semigroupoidConst = new Control_Semigroupoid.Semigroupoid(function (v) {
    return function (v1) {
        return v1;
    };
});
var semigroupConst = function (dictSemigroup) {
    return dictSemigroup;
};
var ringConst = function (dictRing) {
    return dictRing;
};
var ordConst = function (dictOrd) {
    return dictOrd;
};
var newtypeConst = new Data_Newtype.Newtype(function (n) {
    return n;
}, Const);
var monoidConst = function (dictMonoid) {
    return dictMonoid;
};
var heytingAlgebraConst = function (dictHeytingAlgebra) {
    return dictHeytingAlgebra;
};
var functorConst = new Data_Functor.Functor(function (v) {
    return function (v1) {
        return v1;
    };
});
var invariantConst = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorConst));
var foldableConst = new Data_Foldable.Foldable(function (dictMonoid) {
    return function (v) {
        return function (v1) {
            return Data_Monoid.mempty(dictMonoid);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            return z;
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            return z;
        };
    };
});
var traversableConst = new Data_Traversable.Traversable(function () {
    return foldableConst;
}, function () {
    return functorConst;
}, function (dictApplicative) {
    return function (v) {
        return Control_Applicative.pure(dictApplicative)(v);
    };
}, function (dictApplicative) {
    return function (v) {
        return function (v1) {
            return Control_Applicative.pure(dictApplicative)(v1);
        };
    };
});
var fieldConst = function (dictField) {
    return dictField;
};
var euclideanRingConst = function (dictEuclideanRing) {
    return dictEuclideanRing;
};
var eqConst = function (dictEq) {
    return dictEq;
};
var contravariantConst = new Data_Functor_Contravariant.Contravariant(function (v) {
    return function (v1) {
        return v1;
    };
});
var commutativeRingConst = function (dictCommutativeRing) {
    return dictCommutativeRing;
};
var boundedConst = function (dictBounded) {
    return dictBounded;
};
var booleanAlgebraConst = function (dictBooleanAlgebra) {
    return dictBooleanAlgebra;
};
var applyConst = function (dictSemigroup) {
    return new Control_Apply.Apply(function () {
        return functorConst;
    }, function (v) {
        return function (v1) {
            return Data_Semigroup.append(dictSemigroup)(v)(v1);
        };
    });
};
var bindConst = function (dictSemigroup) {
    return new Control_Bind.Bind(function () {
        return applyConst(dictSemigroup);
    }, function (v) {
        return function (v1) {
            return v;
        };
    });
};
var applicativeConst = function (dictMonoid) {
    return new Control_Applicative.Applicative(function () {
        return applyConst(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]());
    }, function (v) {
        return Data_Monoid.mempty(dictMonoid);
    });
};
module.exports = {
    Const: Const, 
    newtypeConst: newtypeConst, 
    eqConst: eqConst, 
    ordConst: ordConst, 
    boundedConst: boundedConst, 
    showConst: showConst, 
    semigroupoidConst: semigroupoidConst, 
    semigroupConst: semigroupConst, 
    monoidConst: monoidConst, 
    semiringConst: semiringConst, 
    ringConst: ringConst, 
    euclideanRingConst: euclideanRingConst, 
    commutativeRingConst: commutativeRingConst, 
    fieldConst: fieldConst, 
    heytingAlgebraConst: heytingAlgebraConst, 
    booleanAlgebraConst: booleanAlgebraConst, 
    functorConst: functorConst, 
    invariantConst: invariantConst, 
    contravariantConst: contravariantConst, 
    applyConst: applyConst, 
    bindConst: bindConst, 
    applicativeConst: applicativeConst, 
    foldableConst: foldableConst, 
    traversableConst: traversableConst
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Semigroupoid":88,"../Data.BooleanAlgebra":103,"../Data.Bounded":105,"../Data.CommutativeRing":108,"../Data.Eq":113,"../Data.EuclideanRing":115,"../Data.Field":116,"../Data.Foldable":118,"../Data.Functor":127,"../Data.Functor.Contravariant":123,"../Data.Functor.Invariant":125,"../Data.HeytingAlgebra":131,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.Traversable":178,"../Prelude":196}],110:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Identity = require("../Data.Identity");
var Data_Newtype = require("../Data.Newtype");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Functor = require("../Data.Functor");
var Data_Function = require("../Data.Function");
var Control_Category = require("../Control.Category");
var Distributive = function (__superclass_Data$dotFunctor$dotFunctor_0, collect, distribute) {
    this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
    this.collect = collect;
    this.distribute = distribute;
};
var distributiveIdentity = new Distributive(function () {
    return Data_Identity.functorIdentity;
}, function (dictFunctor) {
    return function (f) {
        return function ($11) {
            return Data_Identity.Identity(Data_Functor.map(dictFunctor)(function ($12) {
                return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(f($12));
            })($11));
        };
    };
}, function (dictFunctor) {
    return function ($13) {
        return Data_Identity.Identity(Data_Functor.map(dictFunctor)(Data_Newtype.unwrap(Data_Identity.newtypeIdentity))($13));
    };
});
var distribute = function (dict) {
    return dict.distribute;
};
var distributiveFunction = new Distributive(function () {
    return Data_Functor.functorFn;
}, function (dictFunctor) {
    return function (f) {
        return function ($14) {
            return distribute(distributiveFunction)(dictFunctor)(Data_Functor.map(dictFunctor)(f)($14));
        };
    };
}, function (dictFunctor) {
    return function (a) {
        return function (e) {
            return Data_Functor.map(dictFunctor)(function (v) {
                return v(e);
            })(a);
        };
    };
});
var cotraverse = function (dictDistributive) {
    return function (dictFunctor) {
        return function (f) {
            return function ($15) {
                return Data_Functor.map(dictDistributive["__superclass_Data.Functor.Functor_0"]())(f)(distribute(dictDistributive)(dictFunctor)($15));
            };
        };
    };
};
var collectDefault = function (dictDistributive) {
    return function (dictFunctor) {
        return function (f) {
            return function ($16) {
                return distribute(dictDistributive)(dictFunctor)(Data_Functor.map(dictFunctor)(f)($16));
            };
        };
    };
};
var collect = function (dict) {
    return dict.collect;
};
var distributeDefault = function (dictDistributive) {
    return function (dictFunctor) {
        return collect(dictDistributive)(dictFunctor)(Control_Category.id(Control_Category.categoryFn));
    };
};
module.exports = {
    Distributive: Distributive, 
    collect: collect, 
    collectDefault: collectDefault, 
    cotraverse: cotraverse, 
    distribute: distribute, 
    distributeDefault: distributeDefault, 
    distributiveIdentity: distributiveIdentity, 
    distributiveFunction: distributiveFunction
};

},{"../Control.Category":41,"../Control.Semigroupoid":88,"../Data.Function":121,"../Data.Functor":127,"../Data.Identity":132,"../Data.Newtype":149,"../Prelude":196}],111:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Extend = require("../Control.Extend");
var Data_Bifoldable = require("../Data.Bifoldable");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Bitraversable = require("../Data.Bitraversable");
var Data_Eq = require("../Data.Eq");
var Data_Foldable = require("../Data.Foldable");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Ord = require("../Data.Ord");
var Data_Traversable = require("../Data.Traversable");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Ordering = require("../Data.Ordering");
var Data_Bounded = require("../Data.Bounded");
var Data_Semiring = require("../Data.Semiring");
var Data_Function = require("../Data.Function");
var Left = (function () {
    function Left(value0) {
        this.value0 = value0;
    };
    Left.create = function (value0) {
        return new Left(value0);
    };
    return Left;
})();
var Right = (function () {
    function Right(value0) {
        this.value0 = value0;
    };
    Right.create = function (value0) {
        return new Right(value0);
    };
    return Right;
})();
var showEither = function (dictShow) {
    return function (dictShow1) {
        return new Data_Show.Show(function (v) {
            if (v instanceof Left) {
                return "(Left " + (Data_Show.show(dictShow)(v.value0) + ")");
            };
            if (v instanceof Right) {
                return "(Right " + (Data_Show.show(dictShow1)(v.value0) + ")");
            };
            throw new Error("Failed pattern match at Data.Either line 161, column 3 - line 162, column 3: " + [ v.constructor.name ]);
        });
    };
};
var functorEither = new Data_Functor.Functor(function (v) {
    return function (v1) {
        if (v1 instanceof Left) {
            return new Left(v1.value0);
        };
        if (v1 instanceof Right) {
            return new Right(v(v1.value0));
        };
        throw new Error("Failed pattern match at Data.Either line 37, column 3 - line 37, column 26: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var invariantEither = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorEither));
var fromRight = function (dictPartial) {
    return function (v) {
        var __unused = function (dictPartial1) {
            return function ($dollar62) {
                return $dollar62;
            };
        };
        return __unused(dictPartial)((function () {
            if (v instanceof Right) {
                return v.value0;
            };
            throw new Error("Failed pattern match at Data.Either line 253, column 1 - line 253, column 23: " + [ v.constructor.name ]);
        })());
    };
};
var fromLeft = function (dictPartial) {
    return function (v) {
        var __unused = function (dictPartial1) {
            return function ($dollar66) {
                return $dollar66;
            };
        };
        return __unused(dictPartial)((function () {
            if (v instanceof Left) {
                return v.value0;
            };
            throw new Error("Failed pattern match at Data.Either line 248, column 1 - line 248, column 22: " + [ v.constructor.name ]);
        })());
    };
};
var foldableEither = new Data_Foldable.Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            if (v instanceof Left) {
                return Data_Monoid.mempty(dictMonoid);
            };
            if (v instanceof Right) {
                return f(v.value0);
            };
            throw new Error("Failed pattern match at Data.Either line 189, column 3 - line 189, column 31: " + [ f.constructor.name, v.constructor.name ]);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            if (v1 instanceof Left) {
                return z;
            };
            if (v1 instanceof Right) {
                return v(z)(v1.value0);
            };
            throw new Error("Failed pattern match at Data.Either line 187, column 3 - line 187, column 26: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            if (v1 instanceof Left) {
                return z;
            };
            if (v1 instanceof Right) {
                return v(v1.value0)(z);
            };
            throw new Error("Failed pattern match at Data.Either line 185, column 3 - line 185, column 26: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
        };
    };
});
var traversableEither = new Data_Traversable.Traversable(function () {
    return foldableEither;
}, function () {
    return functorEither;
}, function (dictApplicative) {
    return function (v) {
        if (v instanceof Left) {
            return Control_Applicative.pure(dictApplicative)(new Left(v.value0));
        };
        if (v instanceof Right) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Right.create)(v.value0);
        };
        throw new Error("Failed pattern match at Data.Either line 203, column 3 - line 203, column 36: " + [ v.constructor.name ]);
    };
}, function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (v1 instanceof Left) {
                return Control_Applicative.pure(dictApplicative)(new Left(v1.value0));
            };
            if (v1 instanceof Right) {
                return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Right.create)(v(v1.value0));
            };
            throw new Error("Failed pattern match at Data.Either line 201, column 3 - line 201, column 39: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
});
var extendEither = new Control_Extend.Extend(function () {
    return functorEither;
}, function (v) {
    return function (v1) {
        if (v1 instanceof Left) {
            return new Left(v1.value0);
        };
        return new Right(v(v1));
    };
});
var eqEither = function (dictEq) {
    return function (dictEq1) {
        return new Data_Eq.Eq(function (x) {
            return function (y) {
                if (x instanceof Left && y instanceof Left) {
                    return Data_Eq.eq(dictEq)(x.value0)(y.value0);
                };
                if (x instanceof Right && y instanceof Right) {
                    return Data_Eq.eq(dictEq1)(x.value0)(y.value0);
                };
                return false;
            };
        });
    };
};
var ordEither = function (dictOrd) {
    return function (dictOrd1) {
        return new Data_Ord.Ord(function () {
            return eqEither(dictOrd["__superclass_Data.Eq.Eq_0"]())(dictOrd1["__superclass_Data.Eq.Eq_0"]());
        }, function (x) {
            return function (y) {
                if (x instanceof Left && y instanceof Left) {
                    return Data_Ord.compare(dictOrd)(x.value0)(y.value0);
                };
                if (x instanceof Left) {
                    return Data_Ordering.LT.value;
                };
                if (y instanceof Left) {
                    return Data_Ordering.GT.value;
                };
                if (x instanceof Right && y instanceof Right) {
                    return Data_Ord.compare(dictOrd1)(x.value0)(y.value0);
                };
                throw new Error("Failed pattern match at Data.Either line 176, column 1 - line 176, column 64: " + [ x.constructor.name, y.constructor.name ]);
            };
        });
    };
};
var eq1Either = function (dictEq) {
    return new Data_Eq.Eq1(function (dictEq1) {
        return Data_Eq.eq(eqEither(dictEq)(dictEq1));
    });
};
var ord1Either = function (dictOrd) {
    return new Data_Ord.Ord1(function () {
        return eq1Either(dictOrd["__superclass_Data.Eq.Eq_0"]());
    }, function (dictOrd1) {
        return Data_Ord.compare(ordEither(dictOrd)(dictOrd1));
    });
};
var either = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Left) {
                return v(v2.value0);
            };
            if (v2 instanceof Right) {
                return v1(v2.value0);
            };
            throw new Error("Failed pattern match at Data.Either line 230, column 1 - line 230, column 26: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
};
var isLeft = either(Data_Function["const"](true))(Data_Function["const"](false));
var isRight = either(Data_Function["const"](false))(Data_Function["const"](true));
var choose = function (dictAlt) {
    return function (a) {
        return function (b) {
            return Control_Alt.alt(dictAlt)(Data_Functor.map(dictAlt["__superclass_Data.Functor.Functor_0"]())(Left.create)(a))(Data_Functor.map(dictAlt["__superclass_Data.Functor.Functor_0"]())(Right.create)(b));
        };
    };
};
var boundedEither = function (dictBounded) {
    return function (dictBounded1) {
        return new Data_Bounded.Bounded(function () {
            return ordEither(dictBounded["__superclass_Data.Ord.Ord_0"]())(dictBounded1["__superclass_Data.Ord.Ord_0"]());
        }, new Left(Data_Bounded.bottom(dictBounded)), new Right(Data_Bounded.top(dictBounded1)));
    };
};
var bifunctorEither = new Data_Bifunctor.Bifunctor(function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Left) {
                return new Left(v(v2.value0));
            };
            if (v2 instanceof Right) {
                return new Right(v1(v2.value0));
            };
            throw new Error("Failed pattern match at Data.Either line 44, column 3 - line 44, column 34: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
});
var bifoldableEither = new Data_Bifoldable.Bifoldable(function (dictMonoid) {
    return function (v) {
        return function (v1) {
            return function (v2) {
                if (v2 instanceof Left) {
                    return v(v2.value0);
                };
                if (v2 instanceof Right) {
                    return v1(v2.value0);
                };
                throw new Error("Failed pattern match at Data.Either line 197, column 3 - line 197, column 31: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
            };
        };
    };
}, function (v) {
    return function (v1) {
        return function (z) {
            return function (v2) {
                if (v2 instanceof Left) {
                    return v(z)(v2.value0);
                };
                if (v2 instanceof Right) {
                    return v1(z)(v2.value0);
                };
                throw new Error("Failed pattern match at Data.Either line 195, column 3 - line 195, column 33: " + [ v.constructor.name, v1.constructor.name, z.constructor.name, v2.constructor.name ]);
            };
        };
    };
}, function (v) {
    return function (v1) {
        return function (z) {
            return function (v2) {
                if (v2 instanceof Left) {
                    return v(v2.value0)(z);
                };
                if (v2 instanceof Right) {
                    return v1(v2.value0)(z);
                };
                throw new Error("Failed pattern match at Data.Either line 193, column 3 - line 193, column 33: " + [ v.constructor.name, v1.constructor.name, z.constructor.name, v2.constructor.name ]);
            };
        };
    };
});
var bitraversableEither = new Data_Bitraversable.Bitraversable(function () {
    return bifoldableEither;
}, function () {
    return bifunctorEither;
}, function (dictApplicative) {
    return function (v) {
        if (v instanceof Left) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Left.create)(v.value0);
        };
        if (v instanceof Right) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Right.create)(v.value0);
        };
        throw new Error("Failed pattern match at Data.Either line 209, column 3 - line 209, column 35: " + [ v.constructor.name ]);
    };
}, function (dictApplicative) {
    return function (v) {
        return function (v1) {
            return function (v2) {
                if (v2 instanceof Left) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Left.create)(v(v2.value0));
                };
                if (v2 instanceof Right) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Right.create)(v1(v2.value0));
                };
                throw new Error("Failed pattern match at Data.Either line 207, column 3 - line 207, column 41: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
            };
        };
    };
});
var applyEither = new Control_Apply.Apply(function () {
    return functorEither;
}, function (v) {
    return function (v1) {
        if (v instanceof Left) {
            return new Left(v.value0);
        };
        if (v instanceof Right) {
            return Data_Functor.map(functorEither)(v.value0)(v1);
        };
        throw new Error("Failed pattern match at Data.Either line 80, column 3 - line 80, column 28: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var bindEither = new Control_Bind.Bind(function () {
    return applyEither;
}, either(function (e) {
    return function (v) {
        return new Left(e);
    };
})(function (a) {
    return function (f) {
        return f(a);
    };
}));
var semigroupEither = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (x) {
        return function (y) {
            return Control_Apply.apply(applyEither)(Data_Functor.map(functorEither)(Data_Semigroup.append(dictSemigroup))(x))(y);
        };
    });
};
var semiringEither = function (dictSemiring) {
    return new Data_Semiring.Semiring(function (x) {
        return function (y) {
            return Control_Apply.apply(applyEither)(Data_Functor.map(functorEither)(Data_Semiring.add(dictSemiring))(x))(y);
        };
    }, function (x) {
        return function (y) {
            return Control_Apply.apply(applyEither)(Data_Functor.map(functorEither)(Data_Semiring.mul(dictSemiring))(x))(y);
        };
    }, new Right(Data_Semiring.one(dictSemiring)), new Right(Data_Semiring.zero(dictSemiring)));
};
var applicativeEither = new Control_Applicative.Applicative(function () {
    return applyEither;
}, Right.create);
var monadEither = new Control_Monad.Monad(function () {
    return applicativeEither;
}, function () {
    return bindEither;
});
var altEither = new Control_Alt.Alt(function () {
    return functorEither;
}, function (v) {
    return function (v1) {
        if (v instanceof Left) {
            return v1;
        };
        return v;
    };
});
module.exports = {
    Left: Left, 
    Right: Right, 
    choose: choose, 
    either: either, 
    fromLeft: fromLeft, 
    fromRight: fromRight, 
    isLeft: isLeft, 
    isRight: isRight, 
    functorEither: functorEither, 
    invariantEither: invariantEither, 
    bifunctorEither: bifunctorEither, 
    applyEither: applyEither, 
    applicativeEither: applicativeEither, 
    altEither: altEither, 
    bindEither: bindEither, 
    monadEither: monadEither, 
    extendEither: extendEither, 
    showEither: showEither, 
    eqEither: eqEither, 
    eq1Either: eq1Either, 
    ordEither: ordEither, 
    ord1Either: ord1Either, 
    boundedEither: boundedEither, 
    foldableEither: foldableEither, 
    bifoldableEither: bifoldableEither, 
    traversableEither: traversableEither, 
    bitraversableEither: bitraversableEither, 
    semiringEither: semiringEither, 
    semigroupEither: semigroupEither
};

},{"../Control.Alt":32,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Extend":44,"../Control.Monad":82,"../Data.Bifoldable":94,"../Data.Bifunctor":100,"../Data.Bitraversable":101,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.Monoid":147,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.Traversable":178,"../Prelude":196}],112:[function(require,module,exports){
"use strict";

exports.refEq = function (r1) {
  return function (r2) {
    return r1 === r2;
  };
};

exports.refIneq = function (r1) {
  return function (r2) {
    return r1 !== r2;
  };
};

exports.eqArrayImpl = function (f) {
  return function (xs) {
    return function (ys) {
      if (xs.length !== ys.length) return false;
      for (var i = 0; i < xs.length; i++) {
        if (!f(xs[i])(ys[i])) return false;
      }
      return true;
    };
  };
};

},{}],113:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
var Eq = function (eq) {
    this.eq = eq;
};
var Eq1 = function (eq1) {
    this.eq1 = eq1;
};
var eqVoid = new Eq(function (v) {
    return function (v1) {
        return true;
    };
});
var eqUnit = new Eq(function (v) {
    return function (v1) {
        return true;
    };
});
var eqString = new Eq($foreign.refEq);
var eqNumber = new Eq($foreign.refEq);
var eqInt = new Eq($foreign.refEq);
var eqChar = new Eq($foreign.refEq);
var eqBoolean = new Eq($foreign.refEq);
var eq1 = function (dict) {
    return dict.eq1;
};
var eq = function (dict) {
    return dict.eq;
};
var eqArray = function (dictEq) {
    return new Eq($foreign.eqArrayImpl(eq(dictEq)));
};
var eq1Array = new Eq1(function (dictEq) {
    return eq(eqArray(dictEq));
});
var notEq = function (dictEq) {
    return function (x) {
        return function (y) {
            return eq(eqBoolean)(eq(dictEq)(x)(y))(false);
        };
    };
};
var notEq1 = function (dictEq1) {
    return function (dictEq) {
        return function (x) {
            return function (y) {
                return eq(eqBoolean)(eq1(dictEq1)(dictEq)(x)(y))(false);
            };
        };
    };
};
module.exports = {
    Eq: Eq, 
    Eq1: Eq1, 
    eq: eq, 
    eq1: eq1, 
    notEq: notEq, 
    notEq1: notEq1, 
    eqBoolean: eqBoolean, 
    eqInt: eqInt, 
    eqNumber: eqNumber, 
    eqChar: eqChar, 
    eqString: eqString, 
    eqUnit: eqUnit, 
    eqVoid: eqVoid, 
    eqArray: eqArray, 
    eq1Array: eq1Array
};

},{"../Data.Unit":183,"../Data.Void":184,"./foreign":112}],114:[function(require,module,exports){
"use strict";

exports.intDegree = function (x) {
  return Math.min(Math.abs(x), 2147483647);
};

exports.intDiv = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x / y | 0;
  };
};

exports.intMod = function (x) {
  return function (y) {
    return x % y;
  };
};

exports.numDiv = function (n1) {
  return function (n2) {
    return n1 / n2;
  };
};

},{}],115:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_BooleanAlgebra = require("../Data.BooleanAlgebra");
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_Eq = require("../Data.Eq");
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var EuclideanRing = function (__superclass_Data$dotCommutativeRing$dotCommutativeRing_0, degree, div, mod) {
    this["__superclass_Data.CommutativeRing.CommutativeRing_0"] = __superclass_Data$dotCommutativeRing$dotCommutativeRing_0;
    this.degree = degree;
    this.div = div;
    this.mod = mod;
};
var mod = function (dict) {
    return dict.mod;
};
var gcd = function (__copy_dictEq) {
    return function (__copy_dictEuclideanRing) {
        return function (__copy_a) {
            return function (__copy_b) {
                var dictEq = __copy_dictEq;
                var dictEuclideanRing = __copy_dictEuclideanRing;
                var a = __copy_a;
                var b = __copy_b;
                tco: while (true) {
                    var $12 = Data_Eq.eq(dictEq)(b)(Data_Semiring.zero(((dictEuclideanRing["__superclass_Data.CommutativeRing.CommutativeRing_0"]())["__superclass_Data.Ring.Ring_0"]())["__superclass_Data.Semiring.Semiring_0"]()));
                    if ($12) {
                        return a;
                    };
                    if (!$12) {
                        var __tco_dictEq = dictEq;
                        var __tco_dictEuclideanRing = dictEuclideanRing;
                        var __tco_a = b;
                        var __tco_b = mod(dictEuclideanRing)(a)(b);
                        dictEq = __tco_dictEq;
                        dictEuclideanRing = __tco_dictEuclideanRing;
                        a = __tco_a;
                        b = __tco_b;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.EuclideanRing line 80, column 3 - line 82, column 27: " + [ $12.constructor.name ]);
                };
            };
        };
    };
};
var euclideanRingUnit = new EuclideanRing(function () {
    return Data_CommutativeRing.commutativeRingUnit;
}, function (v) {
    return 1;
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
});
var euclideanRingNumber = new EuclideanRing(function () {
    return Data_CommutativeRing.commutativeRingNumber;
}, function (v) {
    return 1;
}, $foreign.numDiv, function (v) {
    return function (v1) {
        return 0.0;
    };
});
var euclideanRingInt = new EuclideanRing(function () {
    return Data_CommutativeRing.commutativeRingInt;
}, $foreign.intDegree, $foreign.intDiv, $foreign.intMod);
var div = function (dict) {
    return dict.div;
};
var lcm = function (dictEq) {
    return function (dictEuclideanRing) {
        return function (a) {
            return function (b) {
                var $13 = Data_Eq.eq(dictEq)(a)(Data_Semiring.zero(((dictEuclideanRing["__superclass_Data.CommutativeRing.CommutativeRing_0"]())["__superclass_Data.Ring.Ring_0"]())["__superclass_Data.Semiring.Semiring_0"]())) || Data_Eq.eq(dictEq)(b)(Data_Semiring.zero(((dictEuclideanRing["__superclass_Data.CommutativeRing.CommutativeRing_0"]())["__superclass_Data.Ring.Ring_0"]())["__superclass_Data.Semiring.Semiring_0"]()));
                if ($13) {
                    return Data_Semiring.zero(((dictEuclideanRing["__superclass_Data.CommutativeRing.CommutativeRing_0"]())["__superclass_Data.Ring.Ring_0"]())["__superclass_Data.Semiring.Semiring_0"]());
                };
                if (!$13) {
                    return div(dictEuclideanRing)(Data_Semiring.mul(((dictEuclideanRing["__superclass_Data.CommutativeRing.CommutativeRing_0"]())["__superclass_Data.Ring.Ring_0"]())["__superclass_Data.Semiring.Semiring_0"]())(a)(b))(gcd(dictEq)(dictEuclideanRing)(a)(b));
                };
                throw new Error("Failed pattern match at Data.EuclideanRing line 87, column 3 - line 89, column 24: " + [ $13.constructor.name ]);
            };
        };
    };
};
var degree = function (dict) {
    return dict.degree;
};
module.exports = {
    EuclideanRing: EuclideanRing, 
    degree: degree, 
    div: div, 
    gcd: gcd, 
    lcm: lcm, 
    mod: mod, 
    euclideanRingInt: euclideanRingInt, 
    euclideanRingNumber: euclideanRingNumber, 
    euclideanRingUnit: euclideanRingUnit
};

},{"../Data.BooleanAlgebra":103,"../Data.CommutativeRing":108,"../Data.Eq":113,"../Data.HeytingAlgebra":131,"../Data.Ring":159,"../Data.Semiring":163,"../Data.Unit":183,"./foreign":114}],116:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var Field = function (__superclass_Data$dotEuclideanRing$dotEuclideanRing_0) {
    this["__superclass_Data.EuclideanRing.EuclideanRing_0"] = __superclass_Data$dotEuclideanRing$dotEuclideanRing_0;
};
var fieldUnit = new Field(function () {
    return Data_EuclideanRing.euclideanRingUnit;
});
var fieldNumber = new Field(function () {
    return Data_EuclideanRing.euclideanRingNumber;
});
module.exports = {
    Field: Field, 
    fieldNumber: fieldNumber, 
    fieldUnit: fieldUnit
};

},{"../Data.CommutativeRing":108,"../Data.EuclideanRing":115,"../Data.Ring":159,"../Data.Semiring":163,"../Data.Unit":183}],117:[function(require,module,exports){
"use strict";

exports.foldrArray = function (f) {
  return function (init) {
    return function (xs) {
      var acc = init;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};

exports.foldlArray = function (f) {
  return function (init) {
    return function (xs) {
      var acc = init;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

},{}],118:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Plus = require("../Control.Plus");
var Data_Maybe = require("../Data.Maybe");
var Data_Maybe_First = require("../Data.Maybe.First");
var Data_Maybe_Last = require("../Data.Maybe.Last");
var Data_Monoid = require("../Data.Monoid");
var Data_Monoid_Additive = require("../Data.Monoid.Additive");
var Data_Monoid_Conj = require("../Data.Monoid.Conj");
var Data_Monoid_Disj = require("../Data.Monoid.Disj");
var Data_Monoid_Dual = require("../Data.Monoid.Dual");
var Data_Monoid_Endo = require("../Data.Monoid.Endo");
var Data_Monoid_Multiplicative = require("../Data.Monoid.Multiplicative");
var Data_Newtype = require("../Data.Newtype");
var Control_Alt = require("../Control.Alt");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var Data_Function = require("../Data.Function");
var Control_Category = require("../Control.Category");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Eq = require("../Data.Eq");
var Data_Ordering = require("../Data.Ordering");
var Data_Ord = require("../Data.Ord");
var Data_Semiring = require("../Data.Semiring");
var Data_Functor = require("../Data.Functor");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Foldable = function (foldMap, foldl, foldr) {
    this.foldMap = foldMap;
    this.foldl = foldl;
    this.foldr = foldr;
};
var foldr = function (dict) {
    return dict.foldr;
};
var oneOf = function (dictFoldable) {
    return function (dictPlus) {
        return foldr(dictFoldable)(Control_Alt.alt(dictPlus["__superclass_Control.Alt.Alt_0"]()))(Control_Plus.empty(dictPlus));
    };
};
var traverse_ = function (dictApplicative) {
    return function (dictFoldable) {
        return function (f) {
            return foldr(dictFoldable)(function ($169) {
                return Control_Apply.applySecond(dictApplicative["__superclass_Control.Apply.Apply_0"]())(f($169));
            })(Control_Applicative.pure(dictApplicative)(Data_Unit.unit));
        };
    };
};
var for_ = function (dictApplicative) {
    return function (dictFoldable) {
        return Data_Function.flip(traverse_(dictApplicative)(dictFoldable));
    };
};
var sequence_ = function (dictApplicative) {
    return function (dictFoldable) {
        return traverse_(dictApplicative)(dictFoldable)(Control_Category.id(Control_Category.categoryFn));
    };
};
var foldl = function (dict) {
    return dict.foldl;
};
var intercalate = function (dictFoldable) {
    return function (dictMonoid) {
        return function (sep) {
            return function (xs) {
                var go = function (v) {
                    return function (x) {
                        if (v.init) {
                            return {
                                init: false, 
                                acc: x
                            };
                        };
                        return {
                            init: false, 
                            acc: Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(v.acc)(Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(sep)(x))
                        };
                    };
                };
                return (foldl(dictFoldable)(go)({
                    init: true, 
                    acc: Data_Monoid.mempty(dictMonoid)
                })(xs)).acc;
            };
        };
    };
};
var maximumBy = function (dictFoldable) {
    return function (cmp) {
        var max$prime = function (v) {
            return function (v1) {
                if (v instanceof Data_Maybe.Nothing) {
                    return new Data_Maybe.Just(v1);
                };
                if (v instanceof Data_Maybe.Just) {
                    return new Data_Maybe.Just((function () {
                        var $92 = Data_Eq.eq(Data_Ordering.eqOrdering)(cmp(v.value0)(v1))(Data_Ordering.GT.value);
                        if ($92) {
                            return v.value0;
                        };
                        if (!$92) {
                            return v1;
                        };
                        throw new Error("Failed pattern match at Data.Foldable line 291, column 27 - line 291, column 57: " + [ $92.constructor.name ]);
                    })());
                };
                throw new Error("Failed pattern match at Data.Foldable line 290, column 3 - line 290, column 27: " + [ v.constructor.name, v1.constructor.name ]);
            };
        };
        return foldl(dictFoldable)(max$prime)(Data_Maybe.Nothing.value);
    };
};
var maximum = function (dictOrd) {
    return function (dictFoldable) {
        return maximumBy(dictFoldable)(Data_Ord.compare(dictOrd));
    };
};
var minimumBy = function (dictFoldable) {
    return function (cmp) {
        var min$prime = function (v) {
            return function (v1) {
                if (v instanceof Data_Maybe.Nothing) {
                    return new Data_Maybe.Just(v1);
                };
                if (v instanceof Data_Maybe.Just) {
                    return new Data_Maybe.Just((function () {
                        var $96 = Data_Eq.eq(Data_Ordering.eqOrdering)(cmp(v.value0)(v1))(Data_Ordering.LT.value);
                        if ($96) {
                            return v.value0;
                        };
                        if (!$96) {
                            return v1;
                        };
                        throw new Error("Failed pattern match at Data.Foldable line 304, column 27 - line 304, column 57: " + [ $96.constructor.name ]);
                    })());
                };
                throw new Error("Failed pattern match at Data.Foldable line 303, column 3 - line 303, column 27: " + [ v.constructor.name, v1.constructor.name ]);
            };
        };
        return foldl(dictFoldable)(min$prime)(Data_Maybe.Nothing.value);
    };
};
var minimum = function (dictOrd) {
    return function (dictFoldable) {
        return minimumBy(dictFoldable)(Data_Ord.compare(dictOrd));
    };
};
var product = function (dictFoldable) {
    return function (dictSemiring) {
        return foldl(dictFoldable)(Data_Semiring.mul(dictSemiring))(Data_Semiring.one(dictSemiring));
    };
};
var sum = function (dictFoldable) {
    return function (dictSemiring) {
        return foldl(dictFoldable)(Data_Semiring.add(dictSemiring))(Data_Semiring.zero(dictSemiring));
    };
};
var foldableMultiplicative = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldableMaybe = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            if (v instanceof Data_Maybe.Nothing) {
                return Data_Monoid.mempty(dictMonoid);
            };
            if (v instanceof Data_Maybe.Just) {
                return f(v.value0);
            };
            throw new Error("Failed pattern match at Data.Foldable line 126, column 3 - line 126, column 30: " + [ f.constructor.name, v.constructor.name ]);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            if (v1 instanceof Data_Maybe.Nothing) {
                return z;
            };
            if (v1 instanceof Data_Maybe.Just) {
                return v(z)(v1.value0);
            };
            throw new Error("Failed pattern match at Data.Foldable line 124, column 3 - line 124, column 25: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            if (v1 instanceof Data_Maybe.Nothing) {
                return z;
            };
            if (v1 instanceof Data_Maybe.Just) {
                return v(v1.value0)(z);
            };
            throw new Error("Failed pattern match at Data.Foldable line 122, column 3 - line 122, column 25: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
        };
    };
});
var foldableDual = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldableDisj = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldableConj = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldableAdditive = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldMapDefaultR = function (dictFoldable) {
    return function (dictMonoid) {
        return function (f) {
            return function (xs) {
                return foldr(dictFoldable)(function (x) {
                    return function (acc) {
                        return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(f(x))(acc);
                    };
                })(Data_Monoid.mempty(dictMonoid))(xs);
            };
        };
    };
};
var foldableArray = new Foldable(function (dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
}, $foreign.foldlArray, $foreign.foldrArray);
var foldMapDefaultL = function (dictFoldable) {
    return function (dictMonoid) {
        return function (f) {
            return function (xs) {
                return foldl(dictFoldable)(function (acc) {
                    return function (x) {
                        return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(f(x))(acc);
                    };
                })(Data_Monoid.mempty(dictMonoid))(xs);
            };
        };
    };
};
var foldMap = function (dict) {
    return dict.foldMap;
};
var foldableFirst = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return foldMap(foldableMaybe)(dictMonoid)(f)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return foldl(foldableMaybe)(f)(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return foldr(foldableMaybe)(f)(z)(v);
        };
    };
});
var foldableLast = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return foldMap(foldableMaybe)(dictMonoid)(f)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return foldl(foldableMaybe)(f)(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return foldr(foldableMaybe)(f)(z)(v);
        };
    };
});
var foldlDefault = function (dictFoldable) {
    return function (c) {
        return function (u) {
            return function (xs) {
                return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(Data_Newtype.unwrap(Data_Monoid_Dual.newtypeDual)(foldMap(dictFoldable)(Data_Monoid_Dual.monoidDual(Data_Monoid_Endo.monoidEndo))(function ($170) {
                    return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Data_Function.flip(c)($170)));
                })(xs)))(u);
            };
        };
    };
};
var foldrDefault = function (dictFoldable) {
    return function (c) {
        return function (u) {
            return function (xs) {
                return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(foldMap(dictFoldable)(Data_Monoid_Endo.monoidEndo)(function ($171) {
                    return Data_Monoid_Endo.Endo(c($171));
                })(xs))(u);
            };
        };
    };
};
var fold = function (dictFoldable) {
    return function (dictMonoid) {
        return foldMap(dictFoldable)(dictMonoid)(Control_Category.id(Control_Category.categoryFn));
    };
};
var findMap = function (dictFoldable) {
    return function (p) {
        var go = function (v) {
            return function (v1) {
                if (v instanceof Data_Maybe.Nothing) {
                    return p(v1);
                };
                return v;
            };
        };
        return foldl(dictFoldable)(go)(Data_Maybe.Nothing.value);
    };
};
var find = function (dictFoldable) {
    return function (p) {
        var go = function (v) {
            return function (v1) {
                if (v instanceof Data_Maybe.Nothing && p(v1)) {
                    return new Data_Maybe.Just(v1);
                };
                return v;
            };
        };
        return foldl(dictFoldable)(go)(Data_Maybe.Nothing.value);
    };
};
var any = function (dictFoldable) {
    return function (dictHeytingAlgebra) {
        return function (p) {
            return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.Disj)(foldMap(dictFoldable)(Data_Monoid_Disj.monoidDisj(dictHeytingAlgebra)))(p);
        };
    };
};
var elem = function (dictFoldable) {
    return function (dictEq) {
        return function ($172) {
            return any(dictFoldable)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Eq.eq(dictEq)($172));
        };
    };
};
var notElem = function (dictFoldable) {
    return function (dictEq) {
        return function (x) {
            return function ($173) {
                return !elem(dictFoldable)(dictEq)(x)($173);
            };
        };
    };
};
var or = function (dictFoldable) {
    return function (dictHeytingAlgebra) {
        return any(dictFoldable)(dictHeytingAlgebra)(Control_Category.id(Control_Category.categoryFn));
    };
};
var all = function (dictFoldable) {
    return function (dictHeytingAlgebra) {
        return function (p) {
            return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Monoid_Conj.newtypeConj)(Data_Monoid_Conj.newtypeConj)(Data_Monoid_Conj.Conj)(foldMap(dictFoldable)(Data_Monoid_Conj.monoidConj(dictHeytingAlgebra)))(p);
        };
    };
};
var and = function (dictFoldable) {
    return function (dictHeytingAlgebra) {
        return all(dictFoldable)(dictHeytingAlgebra)(Control_Category.id(Control_Category.categoryFn));
    };
};
module.exports = {
    Foldable: Foldable, 
    all: all, 
    and: and, 
    any: any, 
    elem: elem, 
    find: find, 
    findMap: findMap, 
    fold: fold, 
    foldMap: foldMap, 
    foldMapDefaultL: foldMapDefaultL, 
    foldMapDefaultR: foldMapDefaultR, 
    foldl: foldl, 
    foldlDefault: foldlDefault, 
    foldr: foldr, 
    foldrDefault: foldrDefault, 
    for_: for_, 
    intercalate: intercalate, 
    maximum: maximum, 
    maximumBy: maximumBy, 
    minimum: minimum, 
    minimumBy: minimumBy, 
    notElem: notElem, 
    oneOf: oneOf, 
    or: or, 
    product: product, 
    sequence_: sequence_, 
    sum: sum, 
    traverse_: traverse_, 
    foldableArray: foldableArray, 
    foldableMaybe: foldableMaybe, 
    foldableFirst: foldableFirst, 
    foldableLast: foldableLast, 
    foldableAdditive: foldableAdditive, 
    foldableDual: foldableDual, 
    foldableDisj: foldableDisj, 
    foldableConj: foldableConj, 
    foldableMultiplicative: foldableMultiplicative
};

},{"../Control.Alt":32,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Category":41,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Eq":113,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Maybe":140,"../Data.Maybe.First":138,"../Data.Maybe.Last":139,"../Data.Monoid":147,"../Data.Monoid.Additive":141,"../Data.Monoid.Conj":142,"../Data.Monoid.Disj":143,"../Data.Monoid.Dual":144,"../Data.Monoid.Endo":145,"../Data.Monoid.Multiplicative":146,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Unit":183,"../Prelude":196,"./foreign":117}],119:[function(require,module,exports){
"use strict";

// module Data.Function.Uncurried

exports.mkFn0 = function (fn) {
  return function () {
    return fn({});
  };
};

exports.mkFn2 = function (fn) {
  /* jshint maxparams: 2 */
  return function (a, b) {
    return fn(a)(b);
  };
};

exports.mkFn3 = function (fn) {
  /* jshint maxparams: 3 */
  return function (a, b, c) {
    return fn(a)(b)(c);
  };
};

exports.mkFn4 = function (fn) {
  /* jshint maxparams: 4 */
  return function (a, b, c, d) {
    return fn(a)(b)(c)(d);
  };
};

exports.mkFn5 = function (fn) {
  /* jshint maxparams: 5 */
  return function (a, b, c, d, e) {
    return fn(a)(b)(c)(d)(e);
  };
};

exports.mkFn6 = function (fn) {
  /* jshint maxparams: 6 */
  return function (a, b, c, d, e, f) {
    return fn(a)(b)(c)(d)(e)(f);
  };
};

exports.mkFn7 = function (fn) {
  /* jshint maxparams: 7 */
  return function (a, b, c, d, e, f, g) {
    return fn(a)(b)(c)(d)(e)(f)(g);
  };
};

exports.mkFn8 = function (fn) {
  /* jshint maxparams: 8 */
  return function (a, b, c, d, e, f, g, h) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h);
  };
};

exports.mkFn9 = function (fn) {
  /* jshint maxparams: 9 */
  return function (a, b, c, d, e, f, g, h, i) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h)(i);
  };
};

exports.mkFn10 = function (fn) {
  /* jshint maxparams: 10 */
  return function (a, b, c, d, e, f, g, h, i, j) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)(j);
  };
};

exports.runFn0 = function (fn) {
  return fn();
};

exports.runFn2 = function (fn) {
  return function (a) {
    return function (b) {
      return fn(a, b);
    };
  };
};

exports.runFn3 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return fn(a, b, c);
      };
    };
  };
};

exports.runFn4 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};

exports.runFn5 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return fn(a, b, c, d, e);
          };
        };
      };
    };
  };
};

exports.runFn6 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return fn(a, b, c, d, e, f);
            };
          };
        };
      };
    };
  };
};

exports.runFn7 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return fn(a, b, c, d, e, f, g);
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn8 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return fn(a, b, c, d, e, f, g, h);
                };
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn9 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return function (i) {
                    return fn(a, b, c, d, e, f, g, h, i);
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn10 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return function (i) {
                    return function (j) {
                      return fn(a, b, c, d, e, f, g, h, i, j);
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};

},{}],120:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var runFn1 = function (f) {
    return f;
};
var mkFn1 = function (f) {
    return f;
};
module.exports = {
    mkFn1: mkFn1, 
    runFn1: runFn1, 
    mkFn0: $foreign.mkFn0, 
    mkFn10: $foreign.mkFn10, 
    mkFn2: $foreign.mkFn2, 
    mkFn3: $foreign.mkFn3, 
    mkFn4: $foreign.mkFn4, 
    mkFn5: $foreign.mkFn5, 
    mkFn6: $foreign.mkFn6, 
    mkFn7: $foreign.mkFn7, 
    mkFn8: $foreign.mkFn8, 
    mkFn9: $foreign.mkFn9, 
    runFn0: $foreign.runFn0, 
    runFn10: $foreign.runFn10, 
    runFn2: $foreign.runFn2, 
    runFn3: $foreign.runFn3, 
    runFn4: $foreign.runFn4, 
    runFn5: $foreign.runFn5, 
    runFn6: $foreign.runFn6, 
    runFn7: $foreign.runFn7, 
    runFn8: $foreign.runFn8, 
    runFn9: $foreign.runFn9
};

},{"../Data.Unit":183,"./foreign":119}],121:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Category = require("../Control.Category");
var on = function (f) {
    return function (g) {
        return function (x) {
            return function (y) {
                return f(g(x))(g(y));
            };
        };
    };
};
var flip = function (f) {
    return function (b) {
        return function (a) {
            return f(a)(b);
        };
    };
};
var $$const = function (a) {
    return function (v) {
        return a;
    };
};
var applyFlipped = function (x) {
    return function (f) {
        return f(x);
    };
};
var apply = function (f) {
    return function (x) {
        return f(x);
    };
};
module.exports = {
    apply: apply, 
    applyFlipped: applyFlipped, 
    "const": $$const, 
    flip: flip, 
    on: on
};

},{"../Control.Category":41}],122:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Plus = require("../Control.Plus");
var Data_Foldable = require("../Data.Foldable");
var Data_Newtype = require("../Data.Newtype");
var Data_Traversable = require("../Data.Traversable");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Functor = require("../Data.Functor");
var Data_Function = require("../Data.Function");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Category = require("../Control.Category");
var Compose = function (x) {
    return x;
};
var showCompose = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Compose " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordCompose = function (dictOrd) {
    return dictOrd;
};
var newtypeCompose = new Data_Newtype.Newtype(function (n) {
    return n;
}, Compose);
var functorCompose = function (dictFunctor) {
    return function (dictFunctor1) {
        return new Data_Functor.Functor(function (f) {
            return function (v) {
                return Compose(Data_Functor.map(dictFunctor)(Data_Functor.map(dictFunctor1)(f))(v));
            };
        });
    };
};
var foldableCompose = function (dictFoldable) {
    return function (dictFoldable1) {
        return new Data_Foldable.Foldable(function (dictMonoid) {
            return function (f) {
                return function (v) {
                    return Data_Foldable.foldMap(dictFoldable)(dictMonoid)(Data_Foldable.foldMap(dictFoldable1)(dictMonoid)(f))(v);
                };
            };
        }, function (f) {
            return function (i) {
                return function (v) {
                    return Data_Foldable.foldl(dictFoldable)(Data_Foldable.foldl(dictFoldable1)(f))(i)(v);
                };
            };
        }, function (f) {
            return function (i) {
                return function (v) {
                    return Data_Foldable.foldr(dictFoldable)(Data_Function.flip(Data_Foldable.foldr(dictFoldable1)(f)))(i)(v);
                };
            };
        });
    };
};
var traversableCompose = function (dictTraversable) {
    return function (dictTraversable1) {
        return new Data_Traversable.Traversable(function () {
            return foldableCompose(dictTraversable["__superclass_Data.Foldable.Foldable_1"]())(dictTraversable1["__superclass_Data.Foldable.Foldable_1"]());
        }, function () {
            return functorCompose(dictTraversable["__superclass_Data.Functor.Functor_0"]())(dictTraversable1["__superclass_Data.Functor.Functor_0"]());
        }, function (dictApplicative) {
            return Data_Traversable.traverse(traversableCompose(dictTraversable)(dictTraversable1))(dictApplicative)(Control_Category.id(Control_Category.categoryFn));
        }, function (dictApplicative) {
            return function (f) {
                return function (v) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Compose)(Data_Traversable.traverse(dictTraversable)(dictApplicative)(Data_Traversable.traverse(dictTraversable1)(dictApplicative)(f))(v));
                };
            };
        });
    };
};
var eqCompose = function (dictEq) {
    return dictEq;
};
var bihoistCompose = function (dictFunctor) {
    return function (natF) {
        return function (natG) {
            return function (v) {
                return natF(Data_Functor.map(dictFunctor)(natG)(v));
            };
        };
    };
};
var applyCompose = function (dictApply) {
    return function (dictApply1) {
        return new Control_Apply.Apply(function () {
            return functorCompose(dictApply["__superclass_Data.Functor.Functor_0"]())(dictApply1["__superclass_Data.Functor.Functor_0"]());
        }, function (v) {
            return function (v1) {
                return Compose(Control_Apply.apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(Control_Apply.apply(dictApply1))(v))(v1));
            };
        });
    };
};
var applicativeCompose = function (dictApplicative) {
    return function (dictApplicative1) {
        return new Control_Applicative.Applicative(function () {
            return applyCompose(dictApplicative["__superclass_Control.Apply.Apply_0"]())(dictApplicative1["__superclass_Control.Apply.Apply_0"]());
        }, function ($57) {
            return Compose(Control_Applicative.pure(dictApplicative)(Control_Applicative.pure(dictApplicative1)($57)));
        });
    };
};
var altCompose = function (dictAlt) {
    return function (dictFunctor) {
        return new Control_Alt.Alt(function () {
            return functorCompose(dictAlt["__superclass_Data.Functor.Functor_0"]())(dictFunctor);
        }, function (v) {
            return function (v1) {
                return Compose(Control_Alt.alt(dictAlt)(v)(v1));
            };
        });
    };
};
var plusCompose = function (dictPlus) {
    return function (dictFunctor) {
        return new Control_Plus.Plus(function () {
            return altCompose(dictPlus["__superclass_Control.Alt.Alt_0"]())(dictFunctor);
        }, Control_Plus.empty(dictPlus));
    };
};
var alternativeCompose = function (dictAlternative) {
    return function (dictApplicative) {
        return new Control_Alternative.Alternative(function () {
            return applicativeCompose(dictAlternative["__superclass_Control.Applicative.Applicative_0"]())(dictApplicative);
        }, function () {
            return plusCompose(dictAlternative["__superclass_Control.Plus.Plus_1"]())((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
        });
    };
};
module.exports = {
    Compose: Compose, 
    bihoistCompose: bihoistCompose, 
    newtypeCompose: newtypeCompose, 
    eqCompose: eqCompose, 
    ordCompose: ordCompose, 
    showCompose: showCompose, 
    functorCompose: functorCompose, 
    applyCompose: applyCompose, 
    applicativeCompose: applicativeCompose, 
    foldableCompose: foldableCompose, 
    traversableCompose: traversableCompose, 
    altCompose: altCompose, 
    plusCompose: plusCompose, 
    alternativeCompose: alternativeCompose
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Category":41,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Data.Traversable":178,"../Prelude":196}],123:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Functor = require("../Data.Functor");
var Data_Void = require("../Data.Void");
var Contravariant = function (cmap) {
    this.cmap = cmap;
};
var cmap = function (dict) {
    return dict.cmap;
};
var cmapFlipped = function (dictContravariant) {
    return function (x) {
        return function (f) {
            return cmap(dictContravariant)(f)(x);
        };
    };
};
var coerce = function (dictContravariant) {
    return function (dictFunctor) {
        return function (a) {
            return Data_Functor.map(dictFunctor)(Data_Void.absurd)(cmap(dictContravariant)(Data_Void.absurd)(a));
        };
    };
};
module.exports = {
    Contravariant: Contravariant, 
    cmap: cmap, 
    cmapFlipped: cmapFlipped, 
    coerce: coerce
};

},{"../Data.Functor":127,"../Data.Void":184,"../Prelude":196}],124:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Extend = require("../Control.Extend");
var Control_Comonad = require("../Control.Comonad");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_Newtype = require("../Data.Newtype");
var Data_Traversable = require("../Data.Traversable");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Functor = require("../Data.Functor");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Coproduct = function (x) {
    return x;
};
var showCoproduct = function (dictShow) {
    return function (dictShow1) {
        return new Data_Show.Show(function (v) {
            if (v instanceof Data_Either.Left) {
                return "(left " + (Data_Show.show(dictShow)(v.value0) + ")");
            };
            if (v instanceof Data_Either.Right) {
                return "(right " + (Data_Show.show(dictShow1)(v.value0) + ")");
            };
            throw new Error("Failed pattern match at Data.Functor.Coproduct line 46, column 3 - line 47, column 3: " + [ v.constructor.name ]);
        });
    };
};
var right = function (ga) {
    return new Data_Either.Right(ga);
};
var newtypeCoproduct = new Data_Newtype.Newtype(function (n) {
    return n;
}, Coproduct);
var left = function (fa) {
    return new Data_Either.Left(fa);
};
var functorCoproduct = function (dictFunctor) {
    return function (dictFunctor1) {
        return new Data_Functor.Functor(function (f) {
            return function (v) {
                return Data_Bifunctor.bimap(Data_Either.bifunctorEither)(Data_Functor.map(dictFunctor)(f))(Data_Functor.map(dictFunctor1)(f))(v);
            };
        });
    };
};
var eqCoproduct = function (dictEq) {
    return function (dictEq1) {
        return new Data_Eq.Eq(function (x) {
            return function (y) {
                return Data_Eq.eq(Data_Either.eqEither(dictEq)(dictEq1))(x)(y);
            };
        });
    };
};
var ordCoproduct = function (dictOrd) {
    return function (dictOrd1) {
        return new Data_Ord.Ord(function () {
            return eqCoproduct(dictOrd["__superclass_Data.Eq.Eq_0"]())(dictOrd1["__superclass_Data.Eq.Eq_0"]());
        }, function (x) {
            return function (y) {
                return Data_Ord.compare(Data_Either.ordEither(dictOrd)(dictOrd1))(x)(y);
            };
        });
    };
};
var coproduct = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Data_Either.Left) {
                return v(v2.value0);
            };
            if (v2 instanceof Data_Either.Right) {
                return v1(v2.value0);
            };
            throw new Error("Failed pattern match at Data.Functor.Coproduct line 27, column 1 - line 27, column 41: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
};
var extendCoproduct = function (dictExtend) {
    return function (dictExtend1) {
        return new Control_Extend.Extend(function () {
            return functorCoproduct(dictExtend["__superclass_Data.Functor.Functor_0"]())(dictExtend1["__superclass_Data.Functor.Functor_0"]());
        }, function (f) {
            return function ($53) {
                return Coproduct(coproduct(function ($54) {
                    return Data_Either.Left.create(Control_Extend.extend(dictExtend)(function ($55) {
                        return f(Coproduct(Data_Either.Left.create($55)));
                    })($54));
                })(function ($56) {
                    return Data_Either.Right.create(Control_Extend.extend(dictExtend1)(function ($57) {
                        return f(Coproduct(Data_Either.Right.create($57)));
                    })($56));
                })($53));
            };
        });
    };
};
var foldableCoproduct = function (dictFoldable) {
    return function (dictFoldable1) {
        return new Data_Foldable.Foldable(function (dictMonoid) {
            return function (f) {
                return coproduct(Data_Foldable.foldMap(dictFoldable)(dictMonoid)(f))(Data_Foldable.foldMap(dictFoldable1)(dictMonoid)(f));
            };
        }, function (f) {
            return function (z) {
                return coproduct(Data_Foldable.foldl(dictFoldable)(f)(z))(Data_Foldable.foldl(dictFoldable1)(f)(z));
            };
        }, function (f) {
            return function (z) {
                return coproduct(Data_Foldable.foldr(dictFoldable)(f)(z))(Data_Foldable.foldr(dictFoldable1)(f)(z));
            };
        });
    };
};
var traversableCoproduct = function (dictTraversable) {
    return function (dictTraversable1) {
        return new Data_Traversable.Traversable(function () {
            return foldableCoproduct(dictTraversable["__superclass_Data.Foldable.Foldable_1"]())(dictTraversable1["__superclass_Data.Foldable.Foldable_1"]());
        }, function () {
            return functorCoproduct(dictTraversable["__superclass_Data.Functor.Functor_0"]())(dictTraversable1["__superclass_Data.Functor.Functor_0"]());
        }, function (dictApplicative) {
            return coproduct(function ($58) {
                return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(function ($59) {
                    return Coproduct(Data_Either.Left.create($59));
                })(Data_Traversable.sequence(dictTraversable)(dictApplicative)($58));
            })(function ($60) {
                return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(function ($61) {
                    return Coproduct(Data_Either.Right.create($61));
                })(Data_Traversable.sequence(dictTraversable1)(dictApplicative)($60));
            });
        }, function (dictApplicative) {
            return function (f) {
                return coproduct(function ($62) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(function ($63) {
                        return Coproduct(Data_Either.Left.create($63));
                    })(Data_Traversable.traverse(dictTraversable)(dictApplicative)(f)($62));
                })(function ($64) {
                    return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(function ($65) {
                        return Coproduct(Data_Either.Right.create($65));
                    })(Data_Traversable.traverse(dictTraversable1)(dictApplicative)(f)($64));
                });
            };
        });
    };
};
var comonadCoproduct = function (dictComonad) {
    return function (dictComonad1) {
        return new Control_Comonad.Comonad(function () {
            return extendCoproduct(dictComonad["__superclass_Control.Extend.Extend_0"]())(dictComonad1["__superclass_Control.Extend.Extend_0"]());
        }, coproduct(Control_Comonad.extract(dictComonad))(Control_Comonad.extract(dictComonad1)));
    };
};
var bihoistCoproduct = function (natF) {
    return function (natG) {
        return function (v) {
            return Data_Bifunctor.bimap(Data_Either.bifunctorEither)(natF)(natG)(v);
        };
    };
};
module.exports = {
    Coproduct: Coproduct, 
    bihoistCoproduct: bihoistCoproduct, 
    coproduct: coproduct, 
    left: left, 
    right: right, 
    newtypeCoproduct: newtypeCoproduct, 
    eqCoproduct: eqCoproduct, 
    ordCoproduct: ordCoproduct, 
    showCoproduct: showCoproduct, 
    functorCoproduct: functorCoproduct, 
    extendCoproduct: extendCoproduct, 
    comonadCoproduct: comonadCoproduct, 
    foldableCoproduct: foldableCoproduct, 
    traversableCoproduct: traversableCoproduct
};

},{"../Control.Comonad":43,"../Control.Extend":44,"../Control.Semigroupoid":88,"../Data.Bifunctor":100,"../Data.Either":111,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Functor":127,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Data.Traversable":178,"../Prelude":196}],125:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Functor = require("../Data.Functor");
var Invariant = function (imap) {
    this.imap = imap;
};
var imapF = function (dictFunctor) {
    return function (f) {
        return function (v) {
            return Data_Functor.map(dictFunctor)(f);
        };
    };
};
var invariantArray = new Invariant(imapF(Data_Functor.functorArray));
var invariantFn = new Invariant(imapF(Data_Functor.functorFn));
var imap = function (dict) {
    return dict.imap;
};
module.exports = {
    Invariant: Invariant, 
    imap: imap, 
    imapF: imapF, 
    invariantFn: invariantFn, 
    invariantArray: invariantArray
};

},{"../Data.Functor":127}],126:[function(require,module,exports){
"use strict";

exports.arrayMap = function (f) {
  return function (arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

},{}],127:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Function = require("../Data.Function");
var Data_Unit = require("../Data.Unit");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Functor = function (map) {
    this.map = map;
};
var map = function (dict) {
    return dict.map;
};
var mapFlipped = function (dictFunctor) {
    return function (fa) {
        return function (f) {
            return map(dictFunctor)(f)(fa);
        };
    };
};
var $$void = function (dictFunctor) {
    return map(dictFunctor)(Data_Function["const"](Data_Unit.unit));
};
var voidLeft = function (dictFunctor) {
    return function (f) {
        return function (x) {
            return map(dictFunctor)(Data_Function["const"](x))(f);
        };
    };
};
var voidRight = function (dictFunctor) {
    return function (x) {
        return map(dictFunctor)(Data_Function["const"](x));
    };
};
var functorFn = new Functor(Control_Semigroupoid.compose(Control_Semigroupoid.semigroupoidFn));
var functorArray = new Functor($foreign.arrayMap);
var flap = function (dictFunctor) {
    return function (ff) {
        return function (x) {
            return map(dictFunctor)(function (f) {
                return f(x);
            })(ff);
        };
    };
};
module.exports = {
    Functor: Functor, 
    flap: flap, 
    map: map, 
    mapFlipped: mapFlipped, 
    "void": $$void, 
    voidLeft: voidLeft, 
    voidRight: voidRight, 
    functorFn: functorFn, 
    functorArray: functorArray
};

},{"../Control.Semigroupoid":88,"../Data.Function":121,"../Data.Unit":183,"./foreign":126}],128:[function(require,module,exports){
"use strict";

// module Data.Generic

exports.zipAll = function (f) {
  return function (xs) {
    return function (ys) {
      var l = xs.length < ys.length ? xs.length : ys.length;
      for (var i = 0; i < l; i++) {
        if (!f(xs[i])(ys[i])) {
          return false;
        }
      }
      return true;
    };
  };
};

exports.zipCompare = function (f) {
  return function (xs) {
    return function (ys) {
      var i = 0;
      var xlen = xs.length;
      var ylen = ys.length;
      while (i < xlen && i < ylen) {
        var o = f(xs[i])(ys[i]);
        if (o !== 0) {
          return o;
        }
        i++;
      }
      if (xlen === ylen) {
        return 0;
      } else if (xlen > ylen) {
        return -1;
      } else {
        return 1;
      }
    };
  };
};

},{}],129:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Data_Array = require("../Data.Array");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_Identity = require("../Data.Identity");
var Data_Maybe = require("../Data.Maybe");
var Data_NonEmpty = require("../Data.NonEmpty");
var Data_String = require("../Data.String");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Type_Proxy = require("../Type.Proxy");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Data_Ordering = require("../Data.Ordering");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Ord = require("../Data.Ord");
var Data_Function = require("../Data.Function");
var Data_Monoid = require("../Data.Monoid");
var Data_Ring = require("../Data.Ring");
var Data_Boolean = require("../Data.Boolean");
var SProd = (function () {
    function SProd(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    SProd.create = function (value0) {
        return function (value1) {
            return new SProd(value0, value1);
        };
    };
    return SProd;
})();
var SRecord = (function () {
    function SRecord(value0) {
        this.value0 = value0;
    };
    SRecord.create = function (value0) {
        return new SRecord(value0);
    };
    return SRecord;
})();
var SNumber = (function () {
    function SNumber(value0) {
        this.value0 = value0;
    };
    SNumber.create = function (value0) {
        return new SNumber(value0);
    };
    return SNumber;
})();
var SBoolean = (function () {
    function SBoolean(value0) {
        this.value0 = value0;
    };
    SBoolean.create = function (value0) {
        return new SBoolean(value0);
    };
    return SBoolean;
})();
var SInt = (function () {
    function SInt(value0) {
        this.value0 = value0;
    };
    SInt.create = function (value0) {
        return new SInt(value0);
    };
    return SInt;
})();
var SString = (function () {
    function SString(value0) {
        this.value0 = value0;
    };
    SString.create = function (value0) {
        return new SString(value0);
    };
    return SString;
})();
var SChar = (function () {
    function SChar(value0) {
        this.value0 = value0;
    };
    SChar.create = function (value0) {
        return new SChar(value0);
    };
    return SChar;
})();
var SArray = (function () {
    function SArray(value0) {
        this.value0 = value0;
    };
    SArray.create = function (value0) {
        return new SArray(value0);
    };
    return SArray;
})();
var SUnit = (function () {
    function SUnit() {

    };
    SUnit.value = new SUnit();
    return SUnit;
})();
var SigProd = (function () {
    function SigProd(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    SigProd.create = function (value0) {
        return function (value1) {
            return new SigProd(value0, value1);
        };
    };
    return SigProd;
})();
var SigRecord = (function () {
    function SigRecord(value0) {
        this.value0 = value0;
    };
    SigRecord.create = function (value0) {
        return new SigRecord(value0);
    };
    return SigRecord;
})();
var SigNumber = (function () {
    function SigNumber() {

    };
    SigNumber.value = new SigNumber();
    return SigNumber;
})();
var SigBoolean = (function () {
    function SigBoolean() {

    };
    SigBoolean.value = new SigBoolean();
    return SigBoolean;
})();
var SigInt = (function () {
    function SigInt() {

    };
    SigInt.value = new SigInt();
    return SigInt;
})();
var SigString = (function () {
    function SigString() {

    };
    SigString.value = new SigString();
    return SigString;
})();
var SigChar = (function () {
    function SigChar() {

    };
    SigChar.value = new SigChar();
    return SigChar;
})();
var SigArray = (function () {
    function SigArray(value0) {
        this.value0 = value0;
    };
    SigArray.create = function (value0) {
        return new SigArray(value0);
    };
    return SigArray;
})();
var SigUnit = (function () {
    function SigUnit() {

    };
    SigUnit.value = new SigUnit();
    return SigUnit;
})();
var Generic = function (fromSpine, toSignature, toSpine) {
    this.fromSpine = fromSpine;
    this.toSignature = toSignature;
    this.toSpine = toSpine;
};
var toSpine = function (dict) {
    return dict.toSpine;
};
var toSignature = function (dict) {
    return dict.toSignature;
};
var showSuspended = function (dictShow) {
    return function (e) {
        return "\\_ -> " + Data_Show.show(dictShow)(e(Data_Unit.unit));
    };
};
var showArray = function (v) {
    return function (v1) {
        if (v1.length === 0) {
            return "[]";
        };
        return "[ " + (Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(", ")(Data_Functor.map(Data_Functor.functorArray)(v)(v1)) + " ]");
    };
};
var showGenericSpine = new Data_Show.Show(function (v) {
    if (v instanceof SUnit) {
        return "SUnit";
    };
    if (v instanceof SChar) {
        return "SChar " + Data_Show.show(Data_Show.showChar)(v.value0);
    };
    if (v instanceof SString) {
        return "SString " + Data_Show.show(Data_Show.showString)(v.value0);
    };
    if (v instanceof SBoolean) {
        return "SBoolean " + Data_Show.show(Data_Show.showBoolean)(v.value0);
    };
    if (v instanceof SNumber) {
        return "SNumber " + Data_Show.show(Data_Show.showNumber)(v.value0);
    };
    if (v instanceof SInt) {
        return "SInt " + Data_Show.show(Data_Show.showInt)(v.value0);
    };
    if (v instanceof SArray) {
        return "SArray " + showArray(showSuspended(showGenericSpine))(v.value0);
    };
    if (v instanceof SProd) {
        return "SProd " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + showArray(showSuspended(showGenericSpine))(v.value1)));
    };
    if (v instanceof SRecord) {
        var showElt = function (v1) {
            return Data_Foldable.fold(Data_Foldable.foldableArray)(Data_Monoid.monoidString)([ "{ recLabel: ", Data_Show.show(Data_Show.showString)(v1.recLabel), ", recValue: ", showSuspended(showGenericSpine)(v1.recValue), " }" ]);
        };
        return "SRecord " + showArray(showElt)(v.value0);
    };
    throw new Error("Failed pattern match at Data.Generic line 227, column 9 - line 228, column 9: " + [ v.constructor.name ]);
});
var orderingToInt = function (v) {
    if (v instanceof Data_Ordering.EQ) {
        return 0;
    };
    if (v instanceof Data_Ordering.LT) {
        return 1;
    };
    if (v instanceof Data_Ordering.GT) {
        return -1 | 0;
    };
    throw new Error("Failed pattern match at Data.Generic line 493, column 17 - line 496, column 10: " + [ v.constructor.name ]);
};
var genericVoid = new Generic(function (v) {
    return Data_Maybe.Nothing.value;
}, function (v) {
    return new SigProd("Data.Void.Void", [  ]);
}, Data_Void.absurd);
var genericUnit = new Generic(function (v) {
    if (v instanceof SUnit) {
        return new Data_Maybe.Just(Data_Unit.unit);
    };
    return Data_Maybe.Nothing.value;
}, function (v) {
    return SigUnit.value;
}, function (v) {
    return SUnit.value;
});
var genericString = new Generic(function (v) {
    if (v instanceof SString) {
        return new Data_Maybe.Just(v.value0);
    };
    return Data_Maybe.Nothing.value;
}, function (v) {
    return SigString.value;
}, SString.create);
var genericOrdering = new Generic(function (v) {
    if (v instanceof SProd && (v.value0 === "Data.Ordering.LT" && v.value1.length === 0)) {
        return new Data_Maybe.Just(Data_Ordering.LT.value);
    };
    if (v instanceof SProd && (v.value0 === "Data.Ordering.EQ" && v.value1.length === 0)) {
        return new Data_Maybe.Just(Data_Ordering.EQ.value);
    };
    if (v instanceof SProd && (v.value0 === "Data.Ordering.GT" && v.value1.length === 0)) {
        return new Data_Maybe.Just(Data_Ordering.GT.value);
    };
    return Data_Maybe.Nothing.value;
}, function (v) {
    return new SigProd("Data.Ordering.Ordering", [ {
        sigConstructor: "Data.Ordering.LT", 
        sigValues: [  ]
    }, {
        sigConstructor: "Data.Ordering.EQ", 
        sigValues: [  ]
    }, {
        sigConstructor: "Data.Ordering.GT", 
        sigValues: [  ]
    } ]);
}, function (v) {
    if (v instanceof Data_Ordering.LT) {
        return new SProd("Data.Ordering.LT", [  ]);
    };
    if (v instanceof Data_Ordering.EQ) {
        return new SProd("Data.Ordering.EQ", [  ]);
    };
    if (v instanceof Data_Ordering.GT) {
        return new SProd("Data.Ordering.GT", [  ]);
    };
    throw new Error("Failed pattern match at Data.Generic line 173, column 13 - line 176, column 38: " + [ v.constructor.name ]);
});
var genericNumber = new Generic(function (v) {
    if (v instanceof SNumber) {
        return new Data_Maybe.Just(v.value0);
    };
    return Data_Maybe.Nothing.value;
}, function (v) {
    return SigNumber.value;
}, SNumber.create);
var genericInt = new Generic(function (v) {
    if (v instanceof SInt) {
        return new Data_Maybe.Just(v.value0);
    };
    return Data_Maybe.Nothing.value;
}, function (v) {
    return SigInt.value;
}, SInt.create);
var genericChar = new Generic(function (v) {
    if (v instanceof SChar) {
        return new Data_Maybe.Just(v.value0);
    };
    return Data_Maybe.Nothing.value;
}, function (v) {
    return SigChar.value;
}, SChar.create);
var genericBool = new Generic(function (v) {
    if (v instanceof SBoolean) {
        return new Data_Maybe.Just(v.value0);
    };
    return Data_Maybe.Nothing.value;
}, function (v) {
    return SigBoolean.value;
}, SBoolean.create);
var fromSpine = function (dict) {
    return dict.fromSpine;
};
var force = function (f) {
    return f(Data_Unit.unit);
};
var genericArray = function (dictGeneric) {
    return new Generic(function (v) {
        if (v instanceof SArray) {
            return Data_Traversable.traverse(Data_Traversable.traversableArray)(Data_Maybe.applicativeMaybe)(function ($294) {
                return fromSpine(dictGeneric)(force($294));
            })(v.value0);
        };
        return Data_Maybe.Nothing.value;
    }, function (x) {
        var lowerProxy = function (v) {
            return Type_Proxy["Proxy"].value;
        };
        return new SigArray(function (v) {
            return toSignature(dictGeneric)(lowerProxy(x));
        });
    }, function ($295) {
        return SArray.create(Data_Functor.map(Data_Functor.functorArray)(function (x) {
            return function (v) {
                return toSpine(dictGeneric)(x);
            };
        })($295));
    });
};
var genericEither = function (dictGeneric) {
    return function (dictGeneric1) {
        return new Generic(function (v) {
            if (v instanceof SProd && (v.value0 === "Data.Either.Left" && v.value1.length === 1)) {
                return Data_Functor.map(Data_Maybe.functorMaybe)(Data_Either.Left.create)(fromSpine(dictGeneric)(force(v["value1"][0])));
            };
            if (v instanceof SProd && (v.value0 === "Data.Either.Right" && v.value1.length === 1)) {
                return Data_Functor.map(Data_Maybe.functorMaybe)(Data_Either.Right.create)(fromSpine(dictGeneric1)(force(v["value1"][0])));
            };
            return Data_Maybe.Nothing.value;
        }, function (x) {
            var rproxy = function (v) {
                return Type_Proxy["Proxy"].value;
            };
            var lproxy = function (v) {
                return Type_Proxy["Proxy"].value;
            };
            return new SigProd("Data.Either.Either", [ {
                sigConstructor: "Data.Either.Left", 
                sigValues: [ function (v) {
                    return toSignature(dictGeneric)(lproxy(x));
                } ]
            }, {
                sigConstructor: "Data.Either.Right", 
                sigValues: [ function (v) {
                    return toSignature(dictGeneric1)(rproxy(x));
                } ]
            } ]);
        }, function (v) {
            if (v instanceof Data_Either.Left) {
                return new SProd("Data.Either.Left", [ function (v1) {
                    return toSpine(dictGeneric)(v.value0);
                } ]);
            };
            if (v instanceof Data_Either.Right) {
                return new SProd("Data.Either.Right", [ function (v1) {
                    return toSpine(dictGeneric1)(v.value0);
                } ]);
            };
            throw new Error("Failed pattern match at Data.Generic line 136, column 3 - line 136, column 64: " + [ v.constructor.name ]);
        });
    };
};
var genericIdentity = function (dictGeneric) {
    return new Generic(function (v) {
        if (v instanceof SProd && (v.value0 === "Data.Identity.Identity" && v.value1.length === 1)) {
            return Data_Functor.map(Data_Maybe.functorMaybe)(Data_Identity.Identity)(fromSpine(dictGeneric)(force(v["value1"][0])));
        };
        return Data_Maybe.Nothing.value;
    }, function (x) {
        var iproxy = function (v) {
            return Type_Proxy["Proxy"].value;
        };
        return new SigProd("Data.Identity.Identity", [ {
            sigConstructor: "Data.Identity.Identity", 
            sigValues: [ function (v) {
                return toSignature(dictGeneric)(iproxy(x));
            } ]
        } ]);
    }, function (v) {
        return new SProd("Data.Identity.Identity", [ function (v1) {
            return toSpine(dictGeneric)(v);
        } ]);
    });
};
var genericMaybe = function (dictGeneric) {
    return new Generic(function (v) {
        if (v instanceof SProd && (v.value0 === "Data.Maybe.Just" && v.value1.length === 1)) {
            return Data_Functor.map(Data_Maybe.functorMaybe)(Data_Maybe.Just.create)(fromSpine(dictGeneric)(force(v["value1"][0])));
        };
        if (v instanceof SProd && (v.value0 === "Data.Maybe.Nothing" && v.value1.length === 0)) {
            return Control_Applicative.pure(Data_Maybe.applicativeMaybe)(Data_Maybe.Nothing.value);
        };
        return Data_Maybe.Nothing.value;
    }, function (x) {
        var mbProxy = function (v) {
            return Type_Proxy["Proxy"].value;
        };
        return new SigProd("Data.Maybe.Maybe", [ {
            sigConstructor: "Data.Maybe.Just", 
            sigValues: [ function (v) {
                return toSignature(dictGeneric)(mbProxy(x));
            } ]
        }, {
            sigConstructor: "Data.Maybe.Nothing", 
            sigValues: [  ]
        } ]);
    }, function (v) {
        if (v instanceof Data_Maybe.Just) {
            return new SProd("Data.Maybe.Just", [ function (v1) {
                return toSpine(dictGeneric)(v.value0);
            } ]);
        };
        if (v instanceof Data_Maybe.Nothing) {
            return new SProd("Data.Maybe.Nothing", [  ]);
        };
        throw new Error("Failed pattern match at Data.Generic line 116, column 3 - line 116, column 63: " + [ v.constructor.name ]);
    });
};
var genericNonEmpty = function (dictGeneric) {
    return function (dictGeneric1) {
        return new Generic(function (v) {
            if (v instanceof SProd && (v.value0 === "Data.NonEmpty.NonEmpty" && v.value1.length === 2)) {
                return Control_Apply.apply(Data_Maybe.applyMaybe)(Data_Functor.map(Data_Maybe.functorMaybe)(Data_NonEmpty.NonEmpty.create)(fromSpine(dictGeneric1)(force(v["value1"][0]))))(fromSpine(dictGeneric)(force(v["value1"][1])));
            };
            return Data_Maybe.Nothing.value;
        }, function (x) {
            var tailProxy = function (v) {
                return Type_Proxy["Proxy"].value;
            };
            var headProxy = function (v) {
                return Type_Proxy["Proxy"].value;
            };
            return new SigProd("Data.NonEmpty.NonEmpty", [ {
                sigConstructor: "Data.NonEmpty.NonEmpty", 
                sigValues: [ function (v) {
                    return toSignature(dictGeneric1)(headProxy(x));
                }, function (v) {
                    return toSignature(dictGeneric)(tailProxy(x));
                } ]
            } ]);
        }, function (v) {
            return new SProd("Data.NonEmpty.NonEmpty", [ function (v1) {
                return toSpine(dictGeneric1)(v.value0);
            }, function (v1) {
                return toSpine(dictGeneric)(v.value1);
            } ]);
        });
    };
};
var genericShowPrec = function (v) {
    return function (v1) {
        if (v1 instanceof SProd) {
            if (Data_Array["null"](v1.value1)) {
                return v1.value0;
            };
            if (Data_Boolean.otherwise) {
                var showParen = function (v2) {
                    return function (x) {
                        if (!v2) {
                            return x;
                        };
                        if (v2) {
                            return "(" + (x + ")");
                        };
                        throw new Error("Failed pattern match at Data.Generic line 422, column 7 - line 422, column 28: " + [ v2.constructor.name, x.constructor.name ]);
                    };
                };
                return showParen(v > 10)(v1.value0 + (" " + Data_String.joinWith(" ")(Data_Functor.map(Data_Functor.functorArray)(function (x) {
                    return genericShowPrec(11)(force(x));
                })(v1.value1))));
            };
        };
        if (v1 instanceof SRecord) {
            var showLabelPart = function (x) {
                return x.recLabel + (": " + genericShowPrec(0)(force(x.recValue)));
            };
            return "{" + (Data_String.joinWith(", ")(Data_Functor.map(Data_Functor.functorArray)(showLabelPart)(v1.value0)) + "}");
        };
        if (v1 instanceof SBoolean) {
            return Data_Show.show(Data_Show.showBoolean)(v1.value0);
        };
        if (v1 instanceof SInt) {
            return Data_Show.show(Data_Show.showInt)(v1.value0);
        };
        if (v1 instanceof SNumber) {
            return Data_Show.show(Data_Show.showNumber)(v1.value0);
        };
        if (v1 instanceof SString) {
            return Data_Show.show(Data_Show.showString)(v1.value0);
        };
        if (v1 instanceof SChar) {
            return Data_Show.show(Data_Show.showChar)(v1.value0);
        };
        if (v1 instanceof SArray) {
            return "[" + (Data_String.joinWith(", ")(Data_Functor.map(Data_Functor.functorArray)(function (x) {
                return genericShowPrec(0)(force(x));
            })(v1.value0)) + "]");
        };
        if (v1 instanceof SUnit) {
            return "unit";
        };
        throw new Error("Failed pattern match at Data.Generic line 416, column 1 - line 424, column 1: " + [ v.constructor.name, v1.constructor.name ]);
    };
};
var gShow = function (dictGeneric) {
    return function ($296) {
        return genericShowPrec(0)(toSpine(dictGeneric)($296));
    };
};
var genericTuple = function (dictGeneric) {
    return function (dictGeneric1) {
        return new Generic(function (v) {
            if (v instanceof SProd && (v.value0 === "Data.Tuple.Tuple" && v.value1.length === 2)) {
                return Control_Apply.apply(Data_Maybe.applyMaybe)(Data_Functor.map(Data_Maybe.functorMaybe)(Data_Tuple.Tuple.create)(fromSpine(dictGeneric)(force(v["value1"][0]))))(fromSpine(dictGeneric1)(force(v["value1"][1])));
            };
            return Data_Maybe.Nothing.value;
        }, function (x) {
            var sndProxy = function (v) {
                return Type_Proxy["Proxy"].value;
            };
            var fstProxy = function (v) {
                return Type_Proxy["Proxy"].value;
            };
            return new SigProd("Data.Tuple.Tuple", [ {
                sigConstructor: "Data.Tuple.Tuple", 
                sigValues: [ function (v) {
                    return toSignature(dictGeneric)(fstProxy(x));
                }, function (v) {
                    return toSignature(dictGeneric1)(sndProxy(x));
                } ]
            } ]);
        }, function (v) {
            return new SProd("Data.Tuple.Tuple", [ function (v1) {
                return toSpine(dictGeneric)(v.value0);
            }, function (v1) {
                return toSpine(dictGeneric1)(v.value1);
            } ]);
        });
    };
};
var isValidSpine = function (v) {
    return function (v1) {
        if (v instanceof SigBoolean && v1 instanceof SBoolean) {
            return true;
        };
        if (v instanceof SigNumber && v1 instanceof SNumber) {
            return true;
        };
        if (v instanceof SigInt && v1 instanceof SInt) {
            return true;
        };
        if (v instanceof SigString && v1 instanceof SString) {
            return true;
        };
        if (v instanceof SigChar && v1 instanceof SChar) {
            return true;
        };
        if (v instanceof SigArray && v1 instanceof SArray) {
            return Data_Foldable.all(Data_Foldable.foldableArray)(Data_HeytingAlgebra.heytingAlgebraBoolean)(function ($297) {
                return isValidSpine(force(v.value0))(force($297));
            })(v1.value0);
        };
        if (v instanceof SigProd && v1 instanceof SProd) {
            var $204 = Data_Foldable.find(Data_Foldable.foldableArray)(function (alt) {
                return alt.sigConstructor === v1.value0;
            })(v.value1);
            if ($204 instanceof Data_Maybe.Nothing) {
                return false;
            };
            if ($204 instanceof Data_Maybe.Just) {
                return Data_Foldable.and(Data_Foldable.foldableArray)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Array.zipWith(function (sig) {
                    return function (spine) {
                        return isValidSpine(force(sig))(force(spine));
                    };
                })($204.value0.sigValues)(v1.value1));
            };
            throw new Error("Failed pattern match at Data.Generic line 393, column 3 - line 399, column 15: " + [ $204.constructor.name ]);
        };
        if (v instanceof SigRecord && v1 instanceof SRecord) {
            return Data_Foldable.and(Data_Foldable.foldableArray)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Array.zipWith(function (sig) {
                return function (val) {
                    return isValidSpine(force(sig.recValue))(force(val.recValue));
                };
            })(Data_Array.sortBy(function (a) {
                return function (b) {
                    return Data_Ord.compare(Data_Ord.ordString)(a.recLabel)(b.recLabel);
                };
            })(v.value0))(Data_Array.sortBy(function (a) {
                return function (b) {
                    return Data_Ord.compare(Data_Ord.ordString)(a.recLabel)(b.recLabel);
                };
            })(v1.value0)));
        };
        if (v instanceof SigUnit && v1 instanceof SUnit) {
            return true;
        };
        return false;
    };
};
var showSignature = function (sig) {
    var needsParen = function (s) {
        if (s instanceof SigProd) {
            return true;
        };
        if (s instanceof SigRecord) {
            return true;
        };
        if (s instanceof SigNumber) {
            return false;
        };
        if (s instanceof SigBoolean) {
            return false;
        };
        if (s instanceof SigInt) {
            return false;
        };
        if (s instanceof SigString) {
            return false;
        };
        if (s instanceof SigChar) {
            return false;
        };
        if (s instanceof SigArray) {
            return true;
        };
        if (s instanceof SigUnit) {
            return false;
        };
        throw new Error("Failed pattern match at Data.Generic line 358, column 18 - line 367, column 21: " + [ s.constructor.name ]);
    };
    var paren = function (s) {
        if (needsParen(s)) {
            return "(" + (showSignature(s) + ")");
        };
        if (Data_Boolean.otherwise) {
            return showSignature(s);
        };
        throw new Error("Failed pattern match at Data.Generic line 340, column 1 - line 367, column 21: " + [ s.constructor.name ]);
    };
    return Data_Foldable.fold(Data_Foldable.foldableArray)(Data_Monoid.monoidString)((function () {
        if (sig instanceof SigProd) {
            return [ "SigProd ", Data_Show.show(Data_Show.showString)(sig.value0), " ", showArray(showDataConstructor)(sig.value1) ];
        };
        if (sig instanceof SigRecord) {
            return [ "SigRecord ", showArray(showLabel)(sig.value0) ];
        };
        if (sig instanceof SigNumber) {
            return [ "SigNumber" ];
        };
        if (sig instanceof SigBoolean) {
            return [ "SigBoolean" ];
        };
        if (sig instanceof SigInt) {
            return [ "SigInt" ];
        };
        if (sig instanceof SigString) {
            return [ "SigString" ];
        };
        if (sig instanceof SigChar) {
            return [ "SigChar" ];
        };
        if (sig instanceof SigArray) {
            return [ "SigArray ", paren(force(sig.value0)) ];
        };
        if (sig instanceof SigUnit) {
            return [ "SigUnit" ];
        };
        throw new Error("Failed pattern match at Data.Generic line 341, column 10 - line 351, column 27: " + [ sig.constructor.name ]);
    })());
};
var showLabel = function (l) {
    return "{ recLabel: " + (Data_Show.show(Data_Show.showString)(l.recLabel) + (", recValue: " + (showSignature(force(l.recValue)) + " }")));
};
var showDataConstructor = function (dc) {
    return "{ sigConstructor: " + (Data_Show.show(Data_Show.showString)(dc.sigConstructor) + (", sigValues: " + (showArray(function ($298) {
        return showSignature(force($298));
    })(dc.sigValues) + " }")));
};
var showGenericSignature = new Data_Show.Show(showSignature);
var eqThunk = function (dictEq) {
    return function (x) {
        return function (y) {
            return Data_Eq.eq(dictEq)(force(x))(force(y));
        };
    };
};
var eqRecordSigs = function (dictEq) {
    return function (arr1) {
        return function (arr2) {
            var labelCompare = function (r1) {
                return function (r2) {
                    return Data_Ord.compare(Data_Ord.ordString)(r1.recLabel)(r2.recLabel);
                };
            };
            var sorted1 = Data_Array.sortBy(labelCompare)(arr1);
            var sorted2 = Data_Array.sortBy(labelCompare)(arr2);
            var doCmp = function (x) {
                return function (y) {
                    return x.recLabel === y.recLabel && Data_Eq.eq(dictEq)(force(x.recValue))(force(y.recValue));
                };
            };
            return Data_Array.length(arr1) === Data_Array.length(arr2) && $foreign.zipAll(doCmp)(sorted1)(sorted2);
        };
    };
};
var eqGenericSpine = new Data_Eq.Eq(function (v) {
    return function (v1) {
        if (v instanceof SProd && v1 instanceof SProd) {
            return v.value0 === v1.value0 && (Data_Array.length(v.value1) === Data_Array.length(v1.value1) && $foreign.zipAll(eqThunk(eqGenericSpine))(v.value1)(v1.value1));
        };
        if (v instanceof SRecord && v1 instanceof SRecord) {
            return eqRecordSigs(eqGenericSpine)(v.value0)(v1.value0);
        };
        if (v instanceof SNumber && v1 instanceof SNumber) {
            return v.value0 === v1.value0;
        };
        if (v instanceof SBoolean && v1 instanceof SBoolean) {
            return v.value0 === v1.value0;
        };
        if (v instanceof SInt && v1 instanceof SInt) {
            return v.value0 === v1.value0;
        };
        if (v instanceof SString && v1 instanceof SString) {
            return v.value0 === v1.value0;
        };
        if (v instanceof SChar && v1 instanceof SChar) {
            return v.value0 === v1.value0;
        };
        if (v instanceof SArray && v1 instanceof SArray) {
            return Data_Array.length(v.value0) === Data_Array.length(v1.value0) && $foreign.zipAll(eqThunk(eqGenericSpine))(v.value0)(v1.value0);
        };
        if (v instanceof SUnit && v1 instanceof SUnit) {
            return true;
        };
        return false;
    };
});
var gEq = function (dictGeneric) {
    return function (x) {
        return function (y) {
            return Data_Eq.eq(eqGenericSpine)(toSpine(dictGeneric)(x))(toSpine(dictGeneric)(y));
        };
    };
};
var eqGenericSignature = new Data_Eq.Eq(function (v) {
    return function (v1) {
        if (v instanceof SigProd && v1 instanceof SigProd) {
            return v.value0 === v1.value0 && (Data_Array.length(v.value1) === Data_Array.length(v1.value1) && $foreign.zipAll(eqDataConstructor)(v.value1)(v1.value1));
        };
        if (v instanceof SigRecord && v1 instanceof SigRecord) {
            return eqRecordSigs(eqGenericSignature)(v.value0)(v1.value0);
        };
        if (v instanceof SigNumber && v1 instanceof SigNumber) {
            return true;
        };
        if (v instanceof SigBoolean && v1 instanceof SigBoolean) {
            return true;
        };
        if (v instanceof SigInt && v1 instanceof SigInt) {
            return true;
        };
        if (v instanceof SigString && v1 instanceof SigString) {
            return true;
        };
        if (v instanceof SigChar && v1 instanceof SigChar) {
            return true;
        };
        if (v instanceof SigArray && v1 instanceof SigArray) {
            return eqThunk(eqGenericSignature)(v.value0)(v1.value0);
        };
        if (v instanceof SigUnit && v1 instanceof SigUnit) {
            return true;
        };
        return false;
    };
});
var eqDataConstructor = function (p1) {
    return function (p2) {
        return p1.sigConstructor === p2.sigConstructor && $foreign.zipAll(eqThunk(eqGenericSignature))(p1.sigValues)(p2.sigValues);
    };
};
var compareThunk = function (dictOrd) {
    return function (x) {
        return function (y) {
            return orderingToInt(Data_Ord.compare(dictOrd)(force(x))(force(y)));
        };
    };
};
var ordGenericSpine = new Data_Ord.Ord(function () {
    return eqGenericSpine;
}, function (v) {
    return function (v1) {
        if (v instanceof SProd && v1 instanceof SProd) {
            var $256 = Data_Ord.compare(Data_Ord.ordString)(v.value0)(v1.value0);
            if ($256 instanceof Data_Ordering.EQ) {
                return Data_Ord.compare(Data_Ord.ordInt)(0)($foreign.zipCompare(compareThunk(ordGenericSpine))(v.value1)(v1.value1));
            };
            return $256;
        };
        if (v instanceof SProd) {
            return Data_Ordering.LT.value;
        };
        if (v1 instanceof SProd) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof SRecord && v1 instanceof SRecord) {
            var go = function (x) {
                return function (y) {
                    var $265 = Data_Ord.compare(Data_Ord.ordString)(x.recLabel)(y.recLabel);
                    if ($265 instanceof Data_Ordering.EQ) {
                        return orderingToInt(Data_Ord.compare(ordGenericSpine)(force(x.recValue))(force(y.recValue)));
                    };
                    return orderingToInt($265);
                };
            };
            return Data_Ord.compare(Data_Ord.ordInt)(0)($foreign.zipCompare(go)(v.value0)(v1.value0));
        };
        if (v instanceof SRecord) {
            return Data_Ordering.LT.value;
        };
        if (v1 instanceof SRecord) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof SInt && v1 instanceof SInt) {
            return Data_Ord.compare(Data_Ord.ordInt)(v.value0)(v1.value0);
        };
        if (v instanceof SInt) {
            return Data_Ordering.LT.value;
        };
        if (v1 instanceof SInt) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof SBoolean && v1 instanceof SBoolean) {
            return Data_Ord.compare(Data_Ord.ordBoolean)(v.value0)(v1.value0);
        };
        if (v instanceof SBoolean) {
            return Data_Ordering.LT.value;
        };
        if (v1 instanceof SBoolean) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof SNumber && v1 instanceof SNumber) {
            return Data_Ord.compare(Data_Ord.ordNumber)(v.value0)(v1.value0);
        };
        if (v instanceof SNumber) {
            return Data_Ordering.LT.value;
        };
        if (v1 instanceof SNumber) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof SString && v1 instanceof SString) {
            return Data_Ord.compare(Data_Ord.ordString)(v.value0)(v1.value0);
        };
        if (v instanceof SString) {
            return Data_Ordering.LT.value;
        };
        if (v1 instanceof SString) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof SChar && v1 instanceof SChar) {
            return Data_Ord.compare(Data_Ord.ordChar)(v.value0)(v1.value0);
        };
        if (v instanceof SChar) {
            return Data_Ordering.LT.value;
        };
        if (v1 instanceof SChar) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof SArray && v1 instanceof SArray) {
            return Data_Ord.compare(Data_Ord.ordInt)(0)($foreign.zipCompare(compareThunk(ordGenericSpine))(v.value0)(v1.value0));
        };
        if (v instanceof SArray) {
            return Data_Ordering.LT.value;
        };
        if (v1 instanceof SArray) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof SUnit && v1 instanceof SUnit) {
            return Data_Ordering.EQ.value;
        };
        throw new Error("Failed pattern match at Data.Generic line 259, column 3 - line 262, column 15: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var gCompare = function (dictGeneric) {
    return function (x) {
        return function (y) {
            return Data_Ord.compare(ordGenericSpine)(toSpine(dictGeneric)(x))(toSpine(dictGeneric)(y));
        };
    };
};
module.exports = {
    SigProd: SigProd, 
    SigRecord: SigRecord, 
    SigNumber: SigNumber, 
    SigBoolean: SigBoolean, 
    SigInt: SigInt, 
    SigString: SigString, 
    SigChar: SigChar, 
    SigArray: SigArray, 
    SigUnit: SigUnit, 
    SProd: SProd, 
    SRecord: SRecord, 
    SNumber: SNumber, 
    SBoolean: SBoolean, 
    SInt: SInt, 
    SString: SString, 
    SChar: SChar, 
    SArray: SArray, 
    SUnit: SUnit, 
    Generic: Generic, 
    fromSpine: fromSpine, 
    gCompare: gCompare, 
    gEq: gEq, 
    gShow: gShow, 
    isValidSpine: isValidSpine, 
    showDataConstructor: showDataConstructor, 
    showSignature: showSignature, 
    toSignature: toSignature, 
    toSpine: toSpine, 
    genericNumber: genericNumber, 
    genericInt: genericInt, 
    genericString: genericString, 
    genericChar: genericChar, 
    genericBool: genericBool, 
    genericArray: genericArray, 
    genericUnit: genericUnit, 
    genericVoid: genericVoid, 
    genericTuple: genericTuple, 
    genericMaybe: genericMaybe, 
    genericEither: genericEither, 
    genericIdentity: genericIdentity, 
    genericOrdering: genericOrdering, 
    genericNonEmpty: genericNonEmpty, 
    showGenericSpine: showGenericSpine, 
    eqGenericSpine: eqGenericSpine, 
    ordGenericSpine: ordGenericSpine, 
    eqGenericSignature: eqGenericSignature, 
    showGenericSignature: showGenericSignature
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Semigroupoid":88,"../Data.Array":93,"../Data.Boolean":102,"../Data.Either":111,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Identity":132,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.NonEmpty":150,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Show":165,"../Data.String":176,"../Data.Traversable":178,"../Data.Tuple":179,"../Data.Unit":183,"../Data.Void":184,"../Prelude":196,"../Type.Proxy":221,"./foreign":128}],130:[function(require,module,exports){
"use strict";

exports.boolConj = function (b1) {
  return function (b2) {
    return b1 && b2;
  };
};

exports.boolDisj = function (b1) {
  return function (b2) {
    return b1 || b2;
  };
};

exports.boolNot = function (b) {
  return !b;
};

},{}],131:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var HeytingAlgebra = function (conj, disj, ff, implies, not, tt) {
    this.conj = conj;
    this.disj = disj;
    this.ff = ff;
    this.implies = implies;
    this.not = not;
    this.tt = tt;
};
var tt = function (dict) {
    return dict.tt;
};
var not = function (dict) {
    return dict.not;
};
var implies = function (dict) {
    return dict.implies;
};
var heytingAlgebraUnit = new HeytingAlgebra(function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, Data_Unit.unit, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, function (v) {
    return Data_Unit.unit;
}, Data_Unit.unit);
var ff = function (dict) {
    return dict.ff;
};
var disj = function (dict) {
    return dict.disj;
};
var heytingAlgebraBoolean = new HeytingAlgebra($foreign.boolConj, $foreign.boolDisj, false, function (a) {
    return function (b) {
        return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
    };
}, $foreign.boolNot, true);
var conj = function (dict) {
    return dict.conj;
};
var heytingAlgebraFunction = function (dictHeytingAlgebra) {
    return new HeytingAlgebra(function (f) {
        return function (g) {
            return function (a) {
                return conj(dictHeytingAlgebra)(f(a))(g(a));
            };
        };
    }, function (f) {
        return function (g) {
            return function (a) {
                return disj(dictHeytingAlgebra)(f(a))(g(a));
            };
        };
    }, function (v) {
        return ff(dictHeytingAlgebra);
    }, function (f) {
        return function (g) {
            return function (a) {
                return implies(dictHeytingAlgebra)(f(a))(g(a));
            };
        };
    }, function (f) {
        return function (a) {
            return not(dictHeytingAlgebra)(f(a));
        };
    }, function (v) {
        return tt(dictHeytingAlgebra);
    });
};
module.exports = {
    HeytingAlgebra: HeytingAlgebra, 
    conj: conj, 
    disj: disj, 
    ff: ff, 
    implies: implies, 
    not: not, 
    tt: tt, 
    heytingAlgebraBoolean: heytingAlgebraBoolean, 
    heytingAlgebraUnit: heytingAlgebraUnit, 
    heytingAlgebraFunction: heytingAlgebraFunction
};

},{"../Data.Unit":183,"./foreign":130}],132:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Data_Foldable = require("../Data.Foldable");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Traversable = require("../Data.Traversable");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_BooleanAlgebra = require("../Data.BooleanAlgebra");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Ring = require("../Data.Ring");
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_Field = require("../Data.Field");
var Data_Show = require("../Data.Show");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Identity = function (x) {
    return x;
};
var showIdentity = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Identity " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semiringIdentity = function (dictSemiring) {
    return dictSemiring;
};
var semigroupIdenity = function (dictSemigroup) {
    return dictSemigroup;
};
var ringIdentity = function (dictRing) {
    return dictRing;
};
var ordIdentity = function (dictOrd) {
    return dictOrd;
};
var newtypeIdentity = new Data_Newtype.Newtype(function (n) {
    return n;
}, Identity);
var monoidIdentity = function (dictMonoid) {
    return dictMonoid;
};
var heytingAlgebraIdentity = function (dictHeytingAlgebra) {
    return dictHeytingAlgebra;
};
var functorIdentity = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var invariantIdentity = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorIdentity));
var foldableIdentity = new Data_Foldable.Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var traversableIdentity = new Data_Traversable.Traversable(function () {
    return foldableIdentity;
}, function () {
    return functorIdentity;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Identity)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Identity)(f(v));
        };
    };
});
var fieldIdentity = function (dictField) {
    return dictField;
};
var extendIdentity = new Control_Extend.Extend(function () {
    return functorIdentity;
}, function (f) {
    return function (m) {
        return f(m);
    };
});
var euclideanRingIdentity = function (dictEuclideanRing) {
    return dictEuclideanRing;
};
var eqIdentity = function (dictEq) {
    return dictEq;
};
var comonadIdentity = new Control_Comonad.Comonad(function () {
    return extendIdentity;
}, function (v) {
    return v;
});
var commutativeRingIdentity = function (dictCommutativeRing) {
    return dictCommutativeRing;
};
var boundedIdentity = function (dictBounded) {
    return dictBounded;
};
var booleanAlgebraIdentity = function (dictBooleanAlgebra) {
    return dictBooleanAlgebra;
};
var applyIdentity = new Control_Apply.Apply(function () {
    return functorIdentity;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindIdentity = new Control_Bind.Bind(function () {
    return applyIdentity;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeIdentity = new Control_Applicative.Applicative(function () {
    return applyIdentity;
}, Identity);
var monadIdentity = new Control_Monad.Monad(function () {
    return applicativeIdentity;
}, function () {
    return bindIdentity;
});
var altIdentity = new Control_Alt.Alt(function () {
    return functorIdentity;
}, function (x) {
    return function (v) {
        return x;
    };
});
module.exports = {
    Identity: Identity, 
    newtypeIdentity: newtypeIdentity, 
    eqIdentity: eqIdentity, 
    ordIdentity: ordIdentity, 
    boundedIdentity: boundedIdentity, 
    heytingAlgebraIdentity: heytingAlgebraIdentity, 
    booleanAlgebraIdentity: booleanAlgebraIdentity, 
    semigroupIdenity: semigroupIdenity, 
    monoidIdentity: monoidIdentity, 
    semiringIdentity: semiringIdentity, 
    euclideanRingIdentity: euclideanRingIdentity, 
    ringIdentity: ringIdentity, 
    commutativeRingIdentity: commutativeRingIdentity, 
    fieldIdentity: fieldIdentity, 
    showIdentity: showIdentity, 
    functorIdentity: functorIdentity, 
    invariantIdentity: invariantIdentity, 
    altIdentity: altIdentity, 
    applyIdentity: applyIdentity, 
    applicativeIdentity: applicativeIdentity, 
    bindIdentity: bindIdentity, 
    monadIdentity: monadIdentity, 
    extendIdentity: extendIdentity, 
    comonadIdentity: comonadIdentity, 
    foldableIdentity: foldableIdentity, 
    traversableIdentity: traversableIdentity
};

},{"../Control.Alt":32,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Monad":82,"../Data.BooleanAlgebra":103,"../Data.Bounded":105,"../Data.CommutativeRing":108,"../Data.Eq":113,"../Data.EuclideanRing":115,"../Data.Field":116,"../Data.Foldable":118,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.HeytingAlgebra":131,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.Traversable":178,"../Prelude":196}],133:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Either = require("../Data.Either");
var Data_Functor_Coproduct = require("../Data.Functor.Coproduct");
var Data_Maybe = require("../Data.Maybe");
var Control_Category = require("../Control.Category");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Function = require("../Data.Function");
var Inject = function (inj, prj) {
    this.inj = inj;
    this.prj = prj;
};
var prj = function (dict) {
    return dict.prj;
};
var injectReflexive = new Inject(Control_Category.id(Control_Category.categoryFn), Data_Maybe.Just.create);
var injectLeft = new Inject(function ($1) {
    return Data_Functor_Coproduct.Coproduct(Data_Either.Left.create($1));
}, Data_Functor_Coproduct.coproduct(Data_Maybe.Just.create)(Data_Function["const"](Data_Maybe.Nothing.value)));
var inj = function (dict) {
    return dict.inj;
};
var injectRight = function (dictInject) {
    return new Inject(function ($2) {
        return Data_Functor_Coproduct.Coproduct(Data_Either.Right.create(inj(dictInject)($2)));
    }, Data_Functor_Coproduct.coproduct(Data_Function["const"](Data_Maybe.Nothing.value))(prj(dictInject)));
};
module.exports = {
    Inject: Inject, 
    inj: inj, 
    prj: prj, 
    injectReflexive: injectReflexive, 
    injectLeft: injectLeft, 
    injectRight: injectRight
};

},{"../Control.Category":41,"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Function":121,"../Data.Functor.Coproduct":124,"../Data.Maybe":140,"../Prelude":196}],134:[function(require,module,exports){
"use strict";

exports.defer = function () {

  function Defer(thunk) {
    if (this instanceof Defer) {
      this.thunk = thunk;
      return this;
    } else {
      return new Defer(thunk);
    }
  }

  Defer.prototype.force = function () {
    var value = this.thunk();
    this.thunk = null;
    this.force = function () {
      return value;
    };
    return value;
  };

  return Defer;

}();

exports.force = function (l) {
  return l.force();
};

},{}],135:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_Lazy = require("../Control.Lazy");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Monoid = require("../Data.Monoid");
var Data_Semiring = require("../Data.Semiring");
var Data_Ring = require("../Data.Ring");
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Field = require("../Data.Field");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Apply = require("../Control.Apply");
var Data_Functor = require("../Data.Functor");
var Data_BooleanAlgebra = require("../Data.BooleanAlgebra");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Data_Function = require("../Data.Function");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Unit = require("../Data.Unit");
var showLazy = function (dictShow) {
    return new Data_Show.Show(function (x) {
        return "(defer \\_ -> " + (Data_Show.show(dictShow)($foreign.force(x)) + ")");
    });
};
var semiringLazy = function (dictSemiring) {
    return new Data_Semiring.Semiring(function (a) {
        return function (b) {
            return $foreign.defer(function (v) {
                return Data_Semiring.add(dictSemiring)($foreign.force(a))($foreign.force(b));
            });
        };
    }, function (a) {
        return function (b) {
            return $foreign.defer(function (v) {
                return Data_Semiring.mul(dictSemiring)($foreign.force(a))($foreign.force(b));
            });
        };
    }, $foreign.defer(function (v) {
        return Data_Semiring.one(dictSemiring);
    }), $foreign.defer(function (v) {
        return Data_Semiring.zero(dictSemiring);
    }));
};
var semigroupLazy = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (a) {
        return function (b) {
            return $foreign.defer(function (v) {
                return Data_Semigroup.append(dictSemigroup)($foreign.force(a))($foreign.force(b));
            });
        };
    });
};
var ringLazy = function (dictRing) {
    return new Data_Ring.Ring(function () {
        return semiringLazy(dictRing["__superclass_Data.Semiring.Semiring_0"]());
    }, function (a) {
        return function (b) {
            return $foreign.defer(function (v) {
                return Data_Ring.sub(dictRing)($foreign.force(a))($foreign.force(b));
            });
        };
    });
};
var monoidLazy = function (dictMonoid) {
    return new Data_Monoid.Monoid(function () {
        return semigroupLazy(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]());
    }, $foreign.defer(function (v) {
        return Data_Monoid.mempty(dictMonoid);
    }));
};
var lazyLazy = new Control_Lazy.Lazy(function (f) {
    return $foreign.defer(function (v) {
        return $foreign.force(f(Data_Unit.unit));
    });
});
var functorLazy = new Data_Functor.Functor(function (f) {
    return function (l) {
        return $foreign.defer(function (v) {
            return f($foreign.force(l));
        });
    };
});
var extendLazy = new Control_Extend.Extend(function () {
    return functorLazy;
}, function (f) {
    return function (x) {
        return $foreign.defer(function (v) {
            return f(x);
        });
    };
});
var eqLazy = function (dictEq) {
    return new Data_Eq.Eq(function (x) {
        return function (y) {
            return Data_Eq.eq(dictEq)($foreign.force(x))($foreign.force(y));
        };
    });
};
var ordLazy = function (dictOrd) {
    return new Data_Ord.Ord(function () {
        return eqLazy(dictOrd["__superclass_Data.Eq.Eq_0"]());
    }, function (x) {
        return function (y) {
            return Data_Ord.compare(dictOrd)($foreign.force(x))($foreign.force(y));
        };
    });
};
var comonadLazy = new Control_Comonad.Comonad(function () {
    return extendLazy;
}, $foreign.force);
var commutativeRingLazy = function (dictCommutativeRing) {
    return new Data_CommutativeRing.CommutativeRing(function () {
        return ringLazy(dictCommutativeRing["__superclass_Data.Ring.Ring_0"]());
    });
};
var euclideanRingLazy = function (dictEuclideanRing) {
    return new Data_EuclideanRing.EuclideanRing(function () {
        return commutativeRingLazy(dictEuclideanRing["__superclass_Data.CommutativeRing.CommutativeRing_0"]());
    }, function ($51) {
        return Data_EuclideanRing.degree(dictEuclideanRing)($foreign.force($51));
    }, function (a) {
        return function (b) {
            return $foreign.defer(function (v) {
                return Data_EuclideanRing.div(dictEuclideanRing)($foreign.force(a))($foreign.force(b));
            });
        };
    }, function (a) {
        return function (b) {
            return $foreign.defer(function (v) {
                return Data_EuclideanRing.mod(dictEuclideanRing)($foreign.force(a))($foreign.force(b));
            });
        };
    });
};
var fieldLazy = function (dictField) {
    return new Data_Field.Field(function () {
        return euclideanRingLazy(dictField["__superclass_Data.EuclideanRing.EuclideanRing_0"]());
    });
};
var boundedLazy = function (dictBounded) {
    return new Data_Bounded.Bounded(function () {
        return ordLazy(dictBounded["__superclass_Data.Ord.Ord_0"]());
    }, $foreign.defer(function (v) {
        return Data_Bounded.bottom(dictBounded);
    }), $foreign.defer(function (v) {
        return Data_Bounded.top(dictBounded);
    }));
};
var applyLazy = new Control_Apply.Apply(function () {
    return functorLazy;
}, function (f) {
    return function (x) {
        return $foreign.defer(function (v) {
            return $foreign.force(f)($foreign.force(x));
        });
    };
});
var bindLazy = new Control_Bind.Bind(function () {
    return applyLazy;
}, function (l) {
    return function (f) {
        return $foreign.defer(function (v) {
            return $foreign.force(f($foreign.force(l)));
        });
    };
});
var heytingAlgebraLazy = function (dictHeytingAlgebra) {
    return new Data_HeytingAlgebra.HeytingAlgebra(function (a) {
        return function (b) {
            return Control_Apply.apply(applyLazy)(Data_Functor.map(functorLazy)(Data_HeytingAlgebra.conj(dictHeytingAlgebra))(a))(b);
        };
    }, function (a) {
        return function (b) {
            return Control_Apply.apply(applyLazy)(Data_Functor.map(functorLazy)(Data_HeytingAlgebra.disj(dictHeytingAlgebra))(a))(b);
        };
    }, $foreign.defer(function (v) {
        return Data_HeytingAlgebra.ff(dictHeytingAlgebra);
    }), function (a) {
        return function (b) {
            return Control_Apply.apply(applyLazy)(Data_Functor.map(functorLazy)(Data_HeytingAlgebra.implies(dictHeytingAlgebra))(a))(b);
        };
    }, function (a) {
        return Data_Functor.map(functorLazy)(Data_HeytingAlgebra.not(dictHeytingAlgebra))(a);
    }, $foreign.defer(function (v) {
        return Data_HeytingAlgebra.tt(dictHeytingAlgebra);
    }));
};
var booleanAlgebraLazy = function (dictBooleanAlgebra) {
    return new Data_BooleanAlgebra.BooleanAlgebra(function () {
        return heytingAlgebraLazy(dictBooleanAlgebra["__superclass_Data.HeytingAlgebra.HeytingAlgebra_0"]());
    });
};
var applicativeLazy = new Control_Applicative.Applicative(function () {
    return applyLazy;
}, function (a) {
    return $foreign.defer(function (v) {
        return a;
    });
});
var monadLazy = new Control_Monad.Monad(function () {
    return applicativeLazy;
}, function () {
    return bindLazy;
});
module.exports = {
    semiringLazy: semiringLazy, 
    ringLazy: ringLazy, 
    commutativeRingLazy: commutativeRingLazy, 
    euclideanRingLazy: euclideanRingLazy, 
    fieldLazy: fieldLazy, 
    eqLazy: eqLazy, 
    ordLazy: ordLazy, 
    boundedLazy: boundedLazy, 
    semigroupLazy: semigroupLazy, 
    monoidLazy: monoidLazy, 
    heytingAlgebraLazy: heytingAlgebraLazy, 
    booleanAlgebraLazy: booleanAlgebraLazy, 
    functorLazy: functorLazy, 
    applyLazy: applyLazy, 
    applicativeLazy: applicativeLazy, 
    bindLazy: bindLazy, 
    monadLazy: monadLazy, 
    extendLazy: extendLazy, 
    comonadLazy: comonadLazy, 
    showLazy: showLazy, 
    lazyLazy: lazyLazy, 
    defer: $foreign.defer, 
    force: $foreign.force
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Lazy":45,"../Control.Monad":82,"../Control.Semigroupoid":88,"../Data.BooleanAlgebra":103,"../Data.Bounded":105,"../Data.CommutativeRing":108,"../Data.Eq":113,"../Data.EuclideanRing":115,"../Data.Field":116,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Monoid":147,"../Data.Ord":154,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.Unit":183,"../Prelude":196,"./foreign":134}],136:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Apply = require("../Control.Apply");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_MonadPlus = require("../Control.MonadPlus");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Foldable = require("../Data.Foldable");
var Data_Generic = require("../Data.Generic");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_NonEmpty = require("../Data.NonEmpty");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Data_Unfoldable = require("../Data.Unfoldable");
var Data_Unit = require("../Data.Unit");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Functor = require("../Data.Functor");
var Data_Eq = require("../Data.Eq");
var Data_Function = require("../Data.Function");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Applicative = require("../Control.Applicative");
var Control_Category = require("../Control.Category");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Nil = (function () {
    function Nil() {

    };
    Nil.value = new Nil();
    return Nil;
})();
var Cons = (function () {
    function Cons(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Cons.create = function (value0) {
        return function (value1) {
            return new Cons(value0, value1);
        };
    };
    return Cons;
})();
var NonEmptyList = function (x) {
    return x;
};
var toList = function (v) {
    return new Cons(v.value0, v.value1);
};
var newtypeNonEmptyList = new Data_Newtype.Newtype(function (n) {
    return n;
}, NonEmptyList);
var genericList = function (dictGeneric) {
    return new Data_Generic.Generic(function (v) {
        if (v instanceof Data_Generic.SProd && (v.value0 === "Data.List.Types.Nil" && v.value1.length === 0)) {
            return new Data_Maybe.Just(Nil.value);
        };
        if (v instanceof Data_Generic.SProd && (v.value0 === "Data.List.Types.Cons" && v.value1.length === 2)) {
            return Control_Apply.apply(Data_Maybe.applyMaybe)(Control_Apply.apply(Data_Maybe.applyMaybe)(new Data_Maybe.Just(Cons.create))(Data_Generic.fromSpine(dictGeneric)(v["value1"][0](Data_Unit.unit))))(Data_Generic.fromSpine(genericList(dictGeneric))(v["value1"][1](Data_Unit.unit)));
        };
        return Data_Maybe.Nothing.value;
    }, function ($dollarq) {
        return new Data_Generic.SigProd("Data.List.Types.List", [ {
            sigConstructor: "Data.List.Types.Nil", 
            sigValues: [  ]
        }, {
            sigConstructor: "Data.List.Types.Cons", 
            sigValues: [ function ($dollarq1) {
                return Data_Generic.toSignature(dictGeneric)(Data_Generic.anyProxy);
            }, function ($dollarq1) {
                return Data_Generic.toSignature(genericList(dictGeneric))(Data_Generic.anyProxy);
            } ]
        } ]);
    }, function (v) {
        if (v instanceof Nil) {
            return new Data_Generic.SProd("Data.List.Types.Nil", [  ]);
        };
        if (v instanceof Cons) {
            return new Data_Generic.SProd("Data.List.Types.Cons", [ function ($dollarq) {
                return Data_Generic.toSpine(dictGeneric)(v.value0);
            }, function ($dollarq) {
                return Data_Generic.toSpine(genericList(dictGeneric))(v.value1);
            } ]);
        };
        throw new Error("Failed pattern match: " + [ v.constructor.name ]);
    });
};
var genericEmptyList = function (dictGeneric) {
    return Data_Generic.genericNonEmpty(genericList(dictGeneric))(dictGeneric);
};
var foldableList = new Data_Foldable.Foldable(function (dictMonoid) {
    return function (f) {
        return Data_Foldable.foldl(foldableList)(function (acc) {
            return function ($128) {
                return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(acc)(f($128));
            };
        })(Data_Monoid.mempty(dictMonoid));
    };
}, function (f) {
    var go = function (__copy_b) {
        return function (__copy_v) {
            var b = __copy_b;
            var v = __copy_v;
            tco: while (true) {
                if (v instanceof Nil) {
                    return b;
                };
                if (v instanceof Cons) {
                    var __tco_b = f(b)(v.value0);
                    var __tco_v = v.value1;
                    b = __tco_b;
                    v = __tco_v;
                    continue tco;
                };
                throw new Error("Failed pattern match at Data.List.Types line 66, column 3 - line 69, column 34: " + [ b.constructor.name, v.constructor.name ]);
            };
        };
    };
    return go;
}, function (f) {
    return function (b) {
        return function (as) {
            var rev = function (__copy_acc) {
                return function (__copy_v) {
                    var acc = __copy_acc;
                    var v = __copy_v;
                    tco: while (true) {
                        if (v instanceof Nil) {
                            return acc;
                        };
                        if (v instanceof Cons) {
                            var __tco_acc = new Cons(v.value0, acc);
                            var __tco_v = v.value1;
                            acc = __tco_acc;
                            v = __tco_v;
                            continue tco;
                        };
                        throw new Error("Failed pattern match at Data.List.Types line 62, column 3 - line 65, column 40: " + [ acc.constructor.name, v.constructor.name ]);
                    };
                };
            };
            return Data_Foldable.foldl(foldableList)(Data_Function.flip(f))(b)(rev(Nil.value)(as));
        };
    };
});
var foldableNonEmptyList = Data_NonEmpty.foldableNonEmpty(foldableList);
var functorList = new Data_Functor.Functor(function (f) {
    return Data_Foldable.foldr(foldableList)(function (x) {
        return function (acc) {
            return new Cons(f(x), acc);
        };
    })(Nil.value);
});
var functorNonEmptyList = Data_NonEmpty.functorNonEmpty(functorList);
var semigroupList = new Data_Semigroup.Semigroup(function (xs) {
    return function (ys) {
        return Data_Foldable.foldr(foldableList)(Cons.create)(ys)(xs);
    };
});
var monoidList = new Data_Monoid.Monoid(function () {
    return semigroupList;
}, Nil.value);
var semigroupNonEmptyList = new Data_Semigroup.Semigroup(function (v) {
    return function (as$prime) {
        return new Data_NonEmpty.NonEmpty(v.value0, Data_Semigroup.append(semigroupList)(v.value1)(toList(as$prime)));
    };
});
var showList = function (dictShow) {
    return new Data_Show.Show(function (v) {
        if (v instanceof Nil) {
            return "Nil";
        };
        return "(" + (Data_Foldable.intercalate(foldableList)(Data_Monoid.monoidString)(" : ")(Data_Functor.map(functorList)(Data_Show.show(dictShow))(v)) + " : Nil)");
    });
};
var showNonEmptyList = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(NonEmptyList " + (Data_Show.show(Data_NonEmpty.showNonEmpty(dictShow)(showList(dictShow)))(v) + ")");
    });
};
var traversableList = new Data_Traversable.Traversable(function () {
    return foldableList;
}, function () {
    return functorList;
}, function (dictApplicative) {
    return Data_Traversable.traverse(traversableList)(dictApplicative)(Control_Category.id(Control_Category.categoryFn));
}, function (dictApplicative) {
    return function (f) {
        return function ($129) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Foldable.foldl(foldableList)(Data_Function.flip(Cons.create))(Nil.value))(Data_Foldable.foldl(foldableList)(function (acc) {
                return function ($130) {
                    return Control_Apply.lift2(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Function.flip(Cons.create))(acc)(f($130));
                };
            })(Control_Applicative.pure(dictApplicative)(Nil.value))($129));
        };
    };
});
var traversableNonEmptyList = Data_NonEmpty.traversableNonEmpty(traversableList);
var unfoldableList = new Data_Unfoldable.Unfoldable(function (f) {
    return function (b) {
        var go = function (__copy_source) {
            return function (__copy_memo) {
                var source = __copy_source;
                var memo = __copy_memo;
                tco: while (true) {
                    var $70 = f(source);
                    if ($70 instanceof Data_Maybe.Nothing) {
                        return Data_Foldable.foldl(foldableList)(Data_Function.flip(Cons.create))(Nil.value)(memo);
                    };
                    if ($70 instanceof Data_Maybe.Just) {
                        var __tco_memo = new Cons($70.value0.value0, memo);
                        source = $70.value0.value1;
                        memo = __tco_memo;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.List.Types line 75, column 24 - line 77, column 54: " + [ $70.constructor.name ]);
                };
            };
        };
        return go(b)(Nil.value);
    };
});
var extendNonEmptyList = new Control_Extend.Extend(function () {
    return functorNonEmptyList;
}, function (f) {
    return function (v) {
        var go = function (a) {
            return function (v1) {
                return {
                    val: new Cons(f(new Data_NonEmpty.NonEmpty(a, v1.acc)), v1.val), 
                    acc: new Cons(a, v1.acc)
                };
            };
        };
        return new Data_NonEmpty.NonEmpty(f(v), (Data_Foldable.foldr(foldableList)(go)({
            val: Nil.value, 
            acc: Nil.value
        })(v.value1)).val);
    };
});
var extendList = new Control_Extend.Extend(function () {
    return functorList;
}, function (f) {
    return function (v) {
        if (v instanceof Nil) {
            return Nil.value;
        };
        if (v instanceof Cons) {
            var go = function (a$prime) {
                return function (v1) {
                    var acc$prime = new Cons(a$prime, v1.acc);
                    return {
                        val: new Cons(f(acc$prime), v1.val), 
                        acc: acc$prime
                    };
                };
            };
            return new Cons(f(v), (Data_Foldable.foldr(foldableList)(go)({
                val: Nil.value, 
                acc: Nil.value
            })(v.value1)).val);
        };
        throw new Error("Failed pattern match at Data.List.Types line 109, column 3 - line 109, column 21: " + [ f.constructor.name, v.constructor.name ]);
    };
});
var eqList = function (dictEq) {
    return new Data_Eq.Eq(function (xs) {
        return function (ys) {
            var go = function (__copy_v) {
                return function (__copy_v1) {
                    return function (__copy_v2) {
                        var v = __copy_v;
                        var v1 = __copy_v1;
                        var v2 = __copy_v2;
                        tco: while (true) {
                            if (!v2) {
                                return false;
                            };
                            if (v instanceof Nil && v1 instanceof Nil) {
                                return v2;
                            };
                            if (v instanceof Cons && v1 instanceof Cons) {
                                var __tco_v = v.value1;
                                var __tco_v1 = v1.value1;
                                var __tco_v2 = v2 && Data_Eq.eq(dictEq)(v1.value0)(v.value0);
                                v = __tco_v;
                                v1 = __tco_v1;
                                v2 = __tco_v2;
                                continue tco;
                            };
                            return false;
                        };
                    };
                };
            };
            return go(xs)(ys)(true);
        };
    });
};
var eqNonEmptyList = function (dictEq) {
    return Data_NonEmpty.eqNonEmpty(dictEq)(eqList(dictEq));
};
var ordList = function (dictOrd) {
    return new Data_Ord.Ord(function () {
        return eqList(dictOrd["__superclass_Data.Eq.Eq_0"]());
    }, function (xs) {
        return function (ys) {
            var go = function (__copy_v) {
                return function (__copy_v1) {
                    var v = __copy_v;
                    var v1 = __copy_v1;
                    tco: while (true) {
                        if (v instanceof Nil && v1 instanceof Nil) {
                            return Data_Ordering.EQ.value;
                        };
                        if (v instanceof Nil) {
                            return Data_Ordering.LT.value;
                        };
                        if (v1 instanceof Nil) {
                            return Data_Ordering.GT.value;
                        };
                        if (v instanceof Cons && v1 instanceof Cons) {
                            var $99 = Data_Ord.compare(dictOrd)(v.value0)(v1.value0);
                            if ($99 instanceof Data_Ordering.EQ) {
                                var __tco_v = v.value1;
                                var __tco_v1 = v1.value1;
                                v = __tco_v;
                                v1 = __tco_v1;
                                continue tco;
                            };
                            return $99;
                        };
                        throw new Error("Failed pattern match at Data.List.Types line 42, column 3 - line 50, column 23: " + [ v.constructor.name, v1.constructor.name ]);
                    };
                };
            };
            return go(xs)(ys);
        };
    });
};
var ordNonEmptyList = function (dictOrd) {
    return Data_NonEmpty.ordNonEmpty(dictOrd)(ordList(dictOrd));
};
var comonadNonEmptyList = new Control_Comonad.Comonad(function () {
    return extendNonEmptyList;
}, function (v) {
    return v.value0;
});
var applyList = new Control_Apply.Apply(function () {
    return functorList;
}, function (v) {
    return function (v1) {
        if (v instanceof Nil) {
            return Nil.value;
        };
        if (v instanceof Cons) {
            return Data_Semigroup.append(semigroupList)(Data_Functor.map(functorList)(v.value0)(v1))(Control_Apply.apply(applyList)(v.value1)(v1));
        };
        throw new Error("Failed pattern match at Data.List.Types line 84, column 3 - line 84, column 20: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var applyNonEmptyList = new Control_Apply.Apply(function () {
    return functorNonEmptyList;
}, function (v) {
    return function (v1) {
        return new Data_NonEmpty.NonEmpty(v.value0(v1.value0), Data_Semigroup.append(semigroupList)(Control_Apply.apply(applyList)(v.value1)(new Cons(v1.value0, Nil.value)))(Control_Apply.apply(applyList)(new Cons(v.value0, v.value1))(v1.value1)));
    };
});
var bindList = new Control_Bind.Bind(function () {
    return applyList;
}, function (v) {
    return function (v1) {
        if (v instanceof Nil) {
            return Nil.value;
        };
        if (v instanceof Cons) {
            return Data_Semigroup.append(semigroupList)(v1(v.value0))(Control_Bind.bind(bindList)(v.value1)(v1));
        };
        throw new Error("Failed pattern match at Data.List.Types line 91, column 3 - line 91, column 19: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var bindNonEmptyList = new Control_Bind.Bind(function () {
    return applyNonEmptyList;
}, function (v) {
    return function (f) {
        var $123 = f(v.value0);
        return new Data_NonEmpty.NonEmpty($123.value0, Data_Semigroup.append(semigroupList)($123.value1)(Control_Bind.bind(bindList)(v.value1)(function ($131) {
            return toList(f($131));
        })));
    };
});
var applicativeList = new Control_Applicative.Applicative(function () {
    return applyList;
}, function (a) {
    return new Cons(a, Nil.value);
});
var monadList = new Control_Monad.Monad(function () {
    return applicativeList;
}, function () {
    return bindList;
});
var altNonEmptyList = new Control_Alt.Alt(function () {
    return functorNonEmptyList;
}, Data_Semigroup.append(semigroupNonEmptyList));
var altList = new Control_Alt.Alt(function () {
    return functorList;
}, Data_Semigroup.append(semigroupList));
var plusList = new Control_Plus.Plus(function () {
    return altList;
}, Nil.value);
var alternativeList = new Control_Alternative.Alternative(function () {
    return applicativeList;
}, function () {
    return plusList;
});
var monadZeroList = new Control_MonadZero.MonadZero(function () {
    return alternativeList;
}, function () {
    return monadList;
});
var monadPlusList = new Control_MonadPlus.MonadPlus(function () {
    return monadZeroList;
});
var applicativeNonEmptyList = new Control_Applicative.Applicative(function () {
    return applyNonEmptyList;
}, function ($132) {
    return NonEmptyList(Data_NonEmpty.singleton(plusList)($132));
});
var monadNonEmptyList = new Control_Monad.Monad(function () {
    return applicativeNonEmptyList;
}, function () {
    return bindNonEmptyList;
});
module.exports = {
    Nil: Nil, 
    Cons: Cons, 
    NonEmptyList: NonEmptyList, 
    toList: toList, 
    genericList: genericList, 
    showList: showList, 
    eqList: eqList, 
    ordList: ordList, 
    semigroupList: semigroupList, 
    monoidList: monoidList, 
    functorList: functorList, 
    foldableList: foldableList, 
    unfoldableList: unfoldableList, 
    traversableList: traversableList, 
    applyList: applyList, 
    applicativeList: applicativeList, 
    bindList: bindList, 
    monadList: monadList, 
    altList: altList, 
    plusList: plusList, 
    alternativeList: alternativeList, 
    monadZeroList: monadZeroList, 
    monadPlusList: monadPlusList, 
    extendList: extendList, 
    newtypeNonEmptyList: newtypeNonEmptyList, 
    eqNonEmptyList: eqNonEmptyList, 
    ordNonEmptyList: ordNonEmptyList, 
    genericEmptyList: genericEmptyList, 
    showNonEmptyList: showNonEmptyList, 
    functorNonEmptyList: functorNonEmptyList, 
    applyNonEmptyList: applyNonEmptyList, 
    applicativeNonEmptyList: applicativeNonEmptyList, 
    bindNonEmptyList: bindNonEmptyList, 
    monadNonEmptyList: monadNonEmptyList, 
    altNonEmptyList: altNonEmptyList, 
    extendNonEmptyList: extendNonEmptyList, 
    comonadNonEmptyList: comonadNonEmptyList, 
    semigroupNonEmptyList: semigroupNonEmptyList, 
    foldableNonEmptyList: foldableNonEmptyList, 
    traversableNonEmptyList: traversableNonEmptyList
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Monad":82,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Plus":87,"../Control.Semigroupoid":88,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.Generic":129,"../Data.HeytingAlgebra":131,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.NonEmpty":150,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Semigroup":161,"../Data.Show":165,"../Data.Traversable":178,"../Data.Tuple":179,"../Data.Unfoldable":181,"../Data.Unit":183,"../Prelude":196}],137:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Lazy = require("../Control.Lazy");
var Control_Monad_Rec_Class = require("../Control.Monad.Rec.Class");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Foldable = require("../Data.Foldable");
var Data_List_Types = require("../Data.List.Types");
var Data_Maybe = require("../Data.Maybe");
var Data_NonEmpty = require("../Data.NonEmpty");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Data_Unfoldable = require("../Data.Unfoldable");
var Data_Functor = require("../Data.Functor");
var Data_Ring = require("../Data.Ring");
var Data_Eq = require("../Data.Eq");
var Data_Ordering = require("../Data.Ordering");
var Data_Boolean = require("../Data.Boolean");
var Data_Function = require("../Data.Function");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Ord = require("../Data.Ord");
var Data_Semiring = require("../Data.Semiring");
var Control_Bind = require("../Control.Bind");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var Control_Apply = require("../Control.Apply");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Category = require("../Control.Category");
var updateAt = function (v) {
    return function (v1) {
        return function (v2) {
            if (v === 0 && v2 instanceof Data_List_Types.Cons) {
                return new Data_Maybe.Just(new Data_List_Types.Cons(v1, v2.value1));
            };
            if (v2 instanceof Data_List_Types.Cons) {
                return Data_Functor.map(Data_Maybe.functorMaybe)(function (v3) {
                    return new Data_List_Types.Cons(v2.value0, v3);
                })(updateAt(v - 1 | 0)(v1)(v2.value1));
            };
            return Data_Maybe.Nothing.value;
        };
    };
};
var unzip = Data_Foldable.foldr(Data_List_Types.foldableList)(function (v) {
    return function (v1) {
        return new Data_Tuple.Tuple(new Data_List_Types.Cons(v.value0, v1.value0), new Data_List_Types.Cons(v.value1, v1.value1));
    };
})(new Data_Tuple.Tuple(Data_List_Types.Nil.value, Data_List_Types.Nil.value));
var uncons = function (v) {
    if (v instanceof Data_List_Types.Nil) {
        return Data_Maybe.Nothing.value;
    };
    if (v instanceof Data_List_Types.Cons) {
        return new Data_Maybe.Just({
            head: v.value0, 
            tail: v.value1
        });
    };
    throw new Error("Failed pattern match at Data.List line 253, column 1 - line 253, column 21: " + [ v.constructor.name ]);
};
var toUnfoldable = function (dictUnfoldable) {
    return Data_Unfoldable.unfoldr(dictUnfoldable)(function (xs) {
        return Data_Functor.map(Data_Maybe.functorMaybe)(function (rec) {
            return new Data_Tuple.Tuple(rec.head, rec.tail);
        })(uncons(xs));
    });
};
var tail = function (v) {
    if (v instanceof Data_List_Types.Nil) {
        return Data_Maybe.Nothing.value;
    };
    if (v instanceof Data_List_Types.Cons) {
        return new Data_Maybe.Just(v.value1);
    };
    throw new Error("Failed pattern match at Data.List line 239, column 1 - line 239, column 19: " + [ v.constructor.name ]);
};
var span = function (v) {
    return function (v1) {
        if (v1 instanceof Data_List_Types.Cons && v(v1.value0)) {
            var $124 = span(v)(v1.value1);
            return {
                init: new Data_List_Types.Cons(v1.value0, $124.init), 
                rest: $124.rest
            };
        };
        return {
            init: Data_List_Types.Nil.value, 
            rest: v1
        };
    };
};
var singleton = function (a) {
    return new Data_List_Types.Cons(a, Data_List_Types.Nil.value);
};
var sortBy = function (cmp) {
    var merge = function (v) {
        return function (v1) {
            if (v instanceof Data_List_Types.Cons && v1 instanceof Data_List_Types.Cons) {
                if (Data_Eq.eq(Data_Ordering.eqOrdering)(cmp(v.value0)(v1.value0))(Data_Ordering.GT.value)) {
                    return new Data_List_Types.Cons(v1.value0, merge(v)(v1.value1));
                };
                if (Data_Boolean.otherwise) {
                    return new Data_List_Types.Cons(v.value0, merge(v.value1)(v1));
                };
            };
            if (v instanceof Data_List_Types.Nil) {
                return v1;
            };
            if (v1 instanceof Data_List_Types.Nil) {
                return v;
            };
            throw new Error("Failed pattern match at Data.List line 468, column 3 - line 470, column 41: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
    var mergePairs = function (v) {
        if (v instanceof Data_List_Types.Cons && v.value1 instanceof Data_List_Types.Cons) {
            return new Data_List_Types.Cons(merge(v.value0)(v.value1.value0), mergePairs(v.value1.value1));
        };
        return v;
    };
    var mergeAll = function (__copy_v) {
        var v = __copy_v;
        tco: while (true) {
            if (v instanceof Data_List_Types.Cons && v.value1 instanceof Data_List_Types.Nil) {
                return v.value0;
            };
            var __tco_v = mergePairs(v);
            v = __tco_v;
            continue tco;
        };
    };
    var sequences = function (v) {
        if (v instanceof Data_List_Types.Cons && v.value1 instanceof Data_List_Types.Cons) {
            if (Data_Eq.eq(Data_Ordering.eqOrdering)(cmp(v.value0)(v.value1.value0))(Data_Ordering.GT.value)) {
                return descending(v.value1.value0)(singleton(v.value0))(v.value1.value1);
            };
            if (Data_Boolean.otherwise) {
                return ascending(v.value1.value0)(function (v1) {
                    return new Data_List_Types.Cons(v.value0, v1);
                })(v.value1.value1);
            };
        };
        return singleton(v);
    };
    var descending = function (__copy_a) {
        return function (__copy_as) {
            return function (__copy_v) {
                var a = __copy_a;
                var as = __copy_as;
                var v = __copy_v;
                tco: while (true) {
                    if (v instanceof Data_List_Types.Cons && Data_Eq.eq(Data_Ordering.eqOrdering)(cmp(a)(v.value0))(Data_Ordering.GT.value)) {
                        var __tco_a = v.value0;
                        var __tco_as = new Data_List_Types.Cons(a, as);
                        var __tco_v = v.value1;
                        a = __tco_a;
                        as = __tco_as;
                        v = __tco_v;
                        continue tco;
                    };
                    return new Data_List_Types.Cons(new Data_List_Types.Cons(a, as), sequences(v));
                };
            };
        };
    };
    var ascending = function (a) {
        return function (as) {
            return function (v) {
                if (v instanceof Data_List_Types.Cons && Data_Eq.notEq(Data_Ordering.eqOrdering)(cmp(a)(v.value0))(Data_Ordering.GT.value)) {
                    return ascending(v.value0)(function (ys) {
                        return as(new Data_List_Types.Cons(a, ys));
                    })(v.value1);
                };
                return new Data_List_Types.Cons(as(singleton(a)), sequences(v));
            };
        };
    };
    return function ($302) {
        return mergeAll(sequences($302));
    };
};
var sort = function (dictOrd) {
    return function (xs) {
        return sortBy(Data_Ord.compare(dictOrd))(xs);
    };
};
var reverse = (function () {
    var go = function (__copy_acc) {
        return function (__copy_v) {
            var acc = __copy_acc;
            var v = __copy_v;
            tco: while (true) {
                if (v instanceof Data_List_Types.Nil) {
                    return acc;
                };
                if (v instanceof Data_List_Types.Cons) {
                    var __tco_acc = new Data_List_Types.Cons(v.value0, acc);
                    var __tco_v = v.value1;
                    acc = __tco_acc;
                    v = __tco_v;
                    continue tco;
                };
                throw new Error("Failed pattern match at Data.List line 359, column 1 - line 362, column 36: " + [ acc.constructor.name, v.constructor.name ]);
            };
        };
    };
    return go(Data_List_Types.Nil.value);
})();
var snoc = function (xs) {
    return function (x) {
        return reverse(new Data_List_Types.Cons(x, reverse(xs)));
    };
};
var take = (function () {
    var go = function (__copy_acc) {
        return function (__copy_v) {
            return function (__copy_v1) {
                var acc = __copy_acc;
                var v = __copy_v;
                var v1 = __copy_v1;
                tco: while (true) {
                    if (v === 0) {
                        return reverse(acc);
                    };
                    if (v1 instanceof Data_List_Types.Nil) {
                        return reverse(acc);
                    };
                    if (v1 instanceof Data_List_Types.Cons) {
                        var __tco_acc = new Data_List_Types.Cons(v1.value0, acc);
                        var __tco_v = v - 1 | 0;
                        var __tco_v1 = v1.value1;
                        acc = __tco_acc;
                        v = __tco_v;
                        v1 = __tco_v1;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.List line 486, column 1 - line 490, column 46: " + [ acc.constructor.name, v.constructor.name, v1.constructor.name ]);
                };
            };
        };
    };
    return go(Data_List_Types.Nil.value);
})();
var takeWhile = function (p) {
    var go = function (__copy_acc) {
        return function (__copy_v) {
            var acc = __copy_acc;
            var v = __copy_v;
            tco: while (true) {
                if (v instanceof Data_List_Types.Cons && p(v.value0)) {
                    var __tco_acc = new Data_List_Types.Cons(v.value0, acc);
                    var __tco_v = v.value1;
                    acc = __tco_acc;
                    v = __tco_v;
                    continue tco;
                };
                return reverse(acc);
            };
        };
    };
    return go(Data_List_Types.Nil.value);
};
var unsnoc = function (lst) {
    var go = function (__copy_v) {
        return function (__copy_acc) {
            var v = __copy_v;
            var acc = __copy_acc;
            tco: while (true) {
                if (v instanceof Data_List_Types.Nil) {
                    return Data_Maybe.Nothing.value;
                };
                if (v instanceof Data_List_Types.Cons && v.value1 instanceof Data_List_Types.Nil) {
                    return new Data_Maybe.Just({
                        revInit: acc, 
                        last: v.value0
                    });
                };
                if (v instanceof Data_List_Types.Cons) {
                    var __tco_v = v.value1;
                    var __tco_acc = new Data_List_Types.Cons(v.value0, acc);
                    v = __tco_v;
                    acc = __tco_acc;
                    continue tco;
                };
                throw new Error("Failed pattern match at Data.List line 261, column 1 - line 265, column 36: " + [ v.constructor.name, acc.constructor.name ]);
            };
        };
    };
    return Data_Functor.map(Data_Maybe.functorMaybe)(function (h) {
        return {
            init: reverse(h.revInit), 
            last: h.last
        };
    })(go(lst)(Data_List_Types.Nil.value));
};
var zipWith = function (f) {
    return function (xs) {
        return function (ys) {
            var go = function (__copy_v) {
                return function (__copy_v1) {
                    return function (__copy_acc) {
                        var v = __copy_v;
                        var v1 = __copy_v1;
                        var acc = __copy_acc;
                        tco: while (true) {
                            if (v instanceof Data_List_Types.Nil) {
                                return acc;
                            };
                            if (v1 instanceof Data_List_Types.Nil) {
                                return acc;
                            };
                            if (v instanceof Data_List_Types.Cons && v1 instanceof Data_List_Types.Cons) {
                                var __tco_v = v.value1;
                                var __tco_v1 = v1.value1;
                                var __tco_acc = new Data_List_Types.Cons(f(v.value0)(v1.value0), acc);
                                v = __tco_v;
                                v1 = __tco_v1;
                                acc = __tco_acc;
                                continue tco;
                            };
                            throw new Error("Failed pattern match at Data.List line 650, column 1 - line 654, column 52: " + [ v.constructor.name, v1.constructor.name, acc.constructor.name ]);
                        };
                    };
                };
            };
            return reverse(go(xs)(ys)(Data_List_Types.Nil.value));
        };
    };
};
var zip = zipWith(Data_Tuple.Tuple.create);
var zipWithA = function (dictApplicative) {
    return function (f) {
        return function (xs) {
            return function (ys) {
                return Data_Traversable.sequence(Data_List_Types.traversableList)(dictApplicative)(zipWith(f)(xs)(ys));
            };
        };
    };
};
var range = function (start) {
    return function (end) {
        if (start === end) {
            return singleton(start);
        };
        if (Data_Boolean.otherwise) {
            var go = function (__copy_s) {
                return function (__copy_e) {
                    return function (__copy_step) {
                        return function (__copy_rest) {
                            var s = __copy_s;
                            var e = __copy_e;
                            var step = __copy_step;
                            var rest = __copy_rest;
                            tco: while (true) {
                                if (s === e) {
                                    return new Data_List_Types.Cons(s, rest);
                                };
                                if (Data_Boolean.otherwise) {
                                    var __tco_s = s + step | 0;
                                    var __tco_e = e;
                                    var __tco_step = step;
                                    var __tco_rest = new Data_List_Types.Cons(s, rest);
                                    s = __tco_s;
                                    e = __tco_e;
                                    step = __tco_step;
                                    rest = __tco_rest;
                                    continue tco;
                                };
                                throw new Error("Failed pattern match at Data.List line 138, column 1 - line 142, column 65: " + [ s.constructor.name, e.constructor.name, step.constructor.name, rest.constructor.name ]);
                            };
                        };
                    };
                };
            };
            return go(end)(start)((function () {
                var $190 = start > end;
                if ($190) {
                    return 1;
                };
                if (!$190) {
                    return -1 | 0;
                };
                throw new Error("Failed pattern match at Data.List line 139, column 45 - line 139, column 74: " + [ $190.constructor.name ]);
            })())(Data_List_Types.Nil.value);
        };
        throw new Error("Failed pattern match at Data.List line 138, column 1 - line 142, column 65: " + [ start.constructor.name, end.constructor.name ]);
    };
};
var $$null = function (v) {
    if (v instanceof Data_List_Types.Nil) {
        return true;
    };
    return false;
};
var mapWithIndex = function (f) {
    return function (lst) {
        var go = function (__copy_v) {
            return function (__copy_v1) {
                return function (__copy_acc) {
                    var v = __copy_v;
                    var v1 = __copy_v1;
                    var acc = __copy_acc;
                    tco: while (true) {
                        if (v1 instanceof Data_List_Types.Nil) {
                            return acc;
                        };
                        if (v1 instanceof Data_List_Types.Cons) {
                            var __tco_v = v + 1 | 0;
                            var __tco_v1 = v1.value1;
                            var __tco_acc = new Data_List_Types.Cons(f(v1.value0)(v), acc);
                            v = __tco_v;
                            v1 = __tco_v1;
                            acc = __tco_acc;
                            continue tco;
                        };
                        throw new Error("Failed pattern match at Data.List line 424, column 1 - line 427, column 48: " + [ v.constructor.name, v1.constructor.name, acc.constructor.name ]);
                    };
                };
            };
        };
        return reverse(go(0)(lst)(Data_List_Types.Nil.value));
    };
};
var mapMaybe = function (f) {
    var go = function (__copy_acc) {
        return function (__copy_v) {
            var acc = __copy_acc;
            var v = __copy_v;
            tco: while (true) {
                if (v instanceof Data_List_Types.Nil) {
                    return reverse(acc);
                };
                if (v instanceof Data_List_Types.Cons) {
                    var $199 = f(v.value0);
                    if ($199 instanceof Data_Maybe.Nothing) {
                        var __tco_acc = acc;
                        var __tco_v = v.value1;
                        acc = __tco_acc;
                        v = __tco_v;
                        continue tco;
                    };
                    if ($199 instanceof Data_Maybe.Just) {
                        var __tco_acc = new Data_List_Types.Cons($199.value0, acc);
                        var __tco_v = v.value1;
                        acc = __tco_acc;
                        v = __tco_v;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.List line 412, column 5 - line 414, column 32: " + [ $199.constructor.name ]);
                };
                throw new Error("Failed pattern match at Data.List line 408, column 1 - line 414, column 32: " + [ acc.constructor.name, v.constructor.name ]);
            };
        };
    };
    return go(Data_List_Types.Nil.value);
};
var manyRec = function (dictMonadRec) {
    return function (dictAlternative) {
        return function (p) {
            var go = function (acc) {
                return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Alt.alt((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())(Data_Functor.map(((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_Rec_Class.Loop.create)(p))(Control_Applicative.pure(dictAlternative["__superclass_Control.Applicative.Applicative_0"]())(new Control_Monad_Rec_Class.Done(Data_Unit.unit))))(function (v) {
                    return Control_Applicative.pure(dictAlternative["__superclass_Control.Applicative.Applicative_0"]())(Data_Bifunctor.bimap(Control_Monad_Rec_Class.bifunctorStep)(function (v1) {
                        return new Data_List_Types.Cons(v1, acc);
                    })(function (v1) {
                        return reverse(acc);
                    })(v));
                });
            };
            return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(go)(Data_List_Types.Nil.value);
        };
    };
};
var someRec = function (dictMonadRec) {
    return function (dictAlternative) {
        return function (v) {
            return Control_Apply.apply((dictAlternative["__superclass_Control.Applicative.Applicative_0"]())["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map(((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_List_Types.Cons.create)(v))(manyRec(dictMonadRec)(dictAlternative)(v));
        };
    };
};
var some = function (dictAlternative) {
    return function (dictLazy) {
        return function (v) {
            return Control_Apply.apply((dictAlternative["__superclass_Control.Applicative.Applicative_0"]())["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map(((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_List_Types.Cons.create)(v))(Control_Lazy.defer(dictLazy)(function (v1) {
                return many(dictAlternative)(dictLazy)(v);
            }));
        };
    };
};
var many = function (dictAlternative) {
    return function (dictLazy) {
        return function (v) {
            return Control_Alt.alt((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())(some(dictAlternative)(dictLazy)(v))(Control_Applicative.pure(dictAlternative["__superclass_Control.Applicative.Applicative_0"]())(Data_List_Types.Nil.value));
        };
    };
};
var length = Data_Foldable.foldl(Data_List_Types.foldableList)(function (acc) {
    return function (v) {
        return acc + 1 | 0;
    };
})(0);
var last = function (__copy_v) {
    var v = __copy_v;
    tco: while (true) {
        if (v instanceof Data_List_Types.Cons && v.value1 instanceof Data_List_Types.Nil) {
            return new Data_Maybe.Just(v.value0);
        };
        if (v instanceof Data_List_Types.Cons) {
            var __tco_v = v.value1;
            v = __tco_v;
            continue tco;
        };
        return Data_Maybe.Nothing.value;
    };
};
var insertBy = function (v) {
    return function (x) {
        return function (v1) {
            if (v1 instanceof Data_List_Types.Nil) {
                return singleton(x);
            };
            if (v1 instanceof Data_List_Types.Cons) {
                var $215 = v(x)(v1.value0);
                if ($215 instanceof Data_Ordering.GT) {
                    return new Data_List_Types.Cons(v1.value0, insertBy(v)(x)(v1.value1));
                };
                return new Data_List_Types.Cons(x, v1);
            };
            throw new Error("Failed pattern match at Data.List line 210, column 1 - line 210, column 31: " + [ v.constructor.name, x.constructor.name, v1.constructor.name ]);
        };
    };
};
var insertAt = function (v) {
    return function (v1) {
        return function (v2) {
            if (v === 0) {
                return new Data_Maybe.Just(new Data_List_Types.Cons(v1, v2));
            };
            if (v2 instanceof Data_List_Types.Cons) {
                return Data_Functor.map(Data_Maybe.functorMaybe)(function (v3) {
                    return new Data_List_Types.Cons(v2.value0, v3);
                })(insertAt(v - 1 | 0)(v1)(v2.value1));
            };
            return Data_Maybe.Nothing.value;
        };
    };
};
var insert = function (dictOrd) {
    return insertBy(Data_Ord.compare(dictOrd));
};
var init = function (lst) {
    return Data_Functor.map(Data_Maybe.functorMaybe)(function (v) {
        return v.init;
    })(unsnoc(lst));
};
var index = function (__copy_v) {
    return function (__copy_v1) {
        var v = __copy_v;
        var v1 = __copy_v1;
        tco: while (true) {
            if (v instanceof Data_List_Types.Nil) {
                return Data_Maybe.Nothing.value;
            };
            if (v instanceof Data_List_Types.Cons && v1 === 0) {
                return new Data_Maybe.Just(v.value0);
            };
            if (v instanceof Data_List_Types.Cons) {
                var __tco_v = v.value1;
                var __tco_v1 = v1 - 1 | 0;
                v = __tco_v;
                v1 = __tco_v1;
                continue tco;
            };
            throw new Error("Failed pattern match at Data.List line 275, column 1 - line 275, column 22: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};
var head = function (v) {
    if (v instanceof Data_List_Types.Nil) {
        return Data_Maybe.Nothing.value;
    };
    if (v instanceof Data_List_Types.Cons) {
        return new Data_Maybe.Just(v.value0);
    };
    throw new Error("Failed pattern match at Data.List line 224, column 1 - line 224, column 19: " + [ v.constructor.name ]);
};
var transpose = function (v) {
    if (v instanceof Data_List_Types.Nil) {
        return Data_List_Types.Nil.value;
    };
    if (v instanceof Data_List_Types.Cons && v.value0 instanceof Data_List_Types.Nil) {
        return transpose(v.value1);
    };
    if (v instanceof Data_List_Types.Cons && v.value0 instanceof Data_List_Types.Cons) {
        return new Data_List_Types.Cons(new Data_List_Types.Cons(v.value0.value0, mapMaybe(head)(v.value1)), transpose(new Data_List_Types.Cons(v.value0.value1, mapMaybe(tail)(v.value1))));
    };
    throw new Error("Failed pattern match at Data.List line 687, column 1 - line 687, column 20: " + [ v.constructor.name ]);
};
var groupBy = function (v) {
    return function (v1) {
        if (v1 instanceof Data_List_Types.Nil) {
            return Data_List_Types.Nil.value;
        };
        if (v1 instanceof Data_List_Types.Cons) {
            var $241 = span(v(v1.value0))(v1.value1);
            return new Data_List_Types.Cons(new Data_NonEmpty.NonEmpty(v1.value0, $241.init), groupBy(v)($241.rest));
        };
        throw new Error("Failed pattern match at Data.List line 560, column 1 - line 560, column 20: " + [ v.constructor.name, v1.constructor.name ]);
    };
};
var group = function (dictEq) {
    return groupBy(Data_Eq.eq(dictEq));
};
var group$prime = function (dictOrd) {
    return function ($303) {
        return group(dictOrd["__superclass_Data.Eq.Eq_0"]())(sort(dictOrd)($303));
    };
};
var fromFoldable = function (dictFoldable) {
    return Data_Foldable.foldr(dictFoldable)(Data_List_Types.Cons.create)(Data_List_Types.Nil.value);
};
var foldM = function (dictMonad) {
    return function (v) {
        return function (a) {
            return function (v1) {
                if (v1 instanceof Data_List_Types.Nil) {
                    return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(a);
                };
                if (v1 instanceof Data_List_Types.Cons) {
                    return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v(a)(v1.value0))(function (a$prime) {
                        return foldM(dictMonad)(v)(a$prime)(v1.value1);
                    });
                };
                throw new Error("Failed pattern match at Data.List line 698, column 1 - line 698, column 23: " + [ v.constructor.name, a.constructor.name, v1.constructor.name ]);
            };
        };
    };
};
var findIndex = function (fn) {
    var go = function (__copy_v) {
        return function (__copy_v1) {
            var v = __copy_v;
            var v1 = __copy_v1;
            tco: while (true) {
                if (v1 instanceof Data_List_Types.Cons) {
                    if (fn(v1.value0)) {
                        return new Data_Maybe.Just(v);
                    };
                    if (Data_Boolean.otherwise) {
                        var __tco_v = v + 1 | 0;
                        var __tco_v1 = v1.value1;
                        v = __tco_v;
                        v1 = __tco_v1;
                        continue tco;
                    };
                };
                if (v1 instanceof Data_List_Types.Nil) {
                    return Data_Maybe.Nothing.value;
                };
                throw new Error("Failed pattern match at Data.List line 295, column 3 - line 296, column 44: " + [ v.constructor.name, v1.constructor.name ]);
            };
        };
    };
    return go(0);
};
var findLastIndex = function (fn) {
    return function (xs) {
        return Data_Functor.map(Data_Maybe.functorMaybe)(function (v) {
            return (length(xs) - 1 | 0) - v | 0;
        })(findIndex(fn)(reverse(xs)));
    };
};
var filterM = function (dictMonad) {
    return function (v) {
        return function (v1) {
            if (v1 instanceof Data_List_Types.Nil) {
                return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_List_Types.Nil.value);
            };
            if (v1 instanceof Data_List_Types.Cons) {
                return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v(v1.value0))(function (v2) {
                    return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(filterM(dictMonad)(v)(v1.value1))(function (v3) {
                        return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())((function () {
                            if (v2) {
                                return new Data_List_Types.Cons(v1.value0, v3);
                            };
                            if (!v2) {
                                return v3;
                            };
                            throw new Error("Failed pattern match at Data.List line 401, column 8 - line 401, column 34: " + [ v2.constructor.name ]);
                        })());
                    });
                });
            };
            throw new Error("Failed pattern match at Data.List line 397, column 1 - line 397, column 25: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};
var filter = function (p) {
    var go = function (__copy_acc) {
        return function (__copy_v) {
            var acc = __copy_acc;
            var v = __copy_v;
            tco: while (true) {
                if (v instanceof Data_List_Types.Nil) {
                    return reverse(acc);
                };
                if (v instanceof Data_List_Types.Cons) {
                    if (p(v.value0)) {
                        var __tco_acc = new Data_List_Types.Cons(v.value0, acc);
                        var __tco_v = v.value1;
                        acc = __tco_acc;
                        v = __tco_v;
                        continue tco;
                    };
                    if (Data_Boolean.otherwise) {
                        var __tco_acc = acc;
                        var __tco_v = v.value1;
                        acc = __tco_acc;
                        v = __tco_v;
                        continue tco;
                    };
                };
                throw new Error("Failed pattern match at Data.List line 381, column 1 - line 386, column 28: " + [ acc.constructor.name, v.constructor.name ]);
            };
        };
    };
    return go(Data_List_Types.Nil.value);
};
var intersectBy = function (v) {
    return function (v1) {
        return function (v2) {
            if (v1 instanceof Data_List_Types.Nil) {
                return Data_List_Types.Nil.value;
            };
            if (v2 instanceof Data_List_Types.Nil) {
                return Data_List_Types.Nil.value;
            };
            return filter(function (x) {
                return Data_Foldable.any(Data_List_Types.foldableList)(Data_HeytingAlgebra.heytingAlgebraBoolean)(v(x))(v2);
            })(v1);
        };
    };
};
var intersect = function (dictEq) {
    return intersectBy(Data_Eq.eq(dictEq));
};
var nubBy = function (v) {
    return function (v1) {
        if (v1 instanceof Data_List_Types.Nil) {
            return Data_List_Types.Nil.value;
        };
        if (v1 instanceof Data_List_Types.Cons) {
            return new Data_List_Types.Cons(v1.value0, nubBy(v)(filter(function (y) {
                return !v(v1.value0)(y);
            })(v1.value1)));
        };
        throw new Error("Failed pattern match at Data.List line 579, column 1 - line 579, column 22: " + [ v.constructor.name, v1.constructor.name ]);
    };
};
var nub = function (dictEq) {
    return nubBy(Data_Eq.eq(dictEq));
};
var elemLastIndex = function (dictEq) {
    return function (x) {
        return findLastIndex(function (v) {
            return Data_Eq.eq(dictEq)(v)(x);
        });
    };
};
var elemIndex = function (dictEq) {
    return function (x) {
        return findIndex(function (v) {
            return Data_Eq.eq(dictEq)(v)(x);
        });
    };
};
var dropWhile = function (p) {
    var go = function (__copy_v) {
        var v = __copy_v;
        tco: while (true) {
            if (v instanceof Data_List_Types.Cons && p(v.value0)) {
                var __tco_v = v.value1;
                v = __tco_v;
                continue tco;
            };
            return v;
        };
    };
    return go;
};
var drop = function (__copy_v) {
    return function (__copy_v1) {
        var v = __copy_v;
        var v1 = __copy_v1;
        tco: while (true) {
            if (v === 0) {
                return v1;
            };
            if (v1 instanceof Data_List_Types.Nil) {
                return Data_List_Types.Nil.value;
            };
            if (v1 instanceof Data_List_Types.Cons) {
                var __tco_v = v - 1 | 0;
                var __tco_v1 = v1.value1;
                v = __tco_v;
                v1 = __tco_v1;
                continue tco;
            };
            throw new Error("Failed pattern match at Data.List line 505, column 1 - line 505, column 15: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};
var slice = function (start) {
    return function (end) {
        return function (xs) {
            return take(end - start | 0)(drop(start)(xs));
        };
    };
};
var deleteBy = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Data_List_Types.Nil) {
                return Data_List_Types.Nil.value;
            };
            if (v2 instanceof Data_List_Types.Cons && v(v1)(v2.value0)) {
                return v2.value1;
            };
            if (v2 instanceof Data_List_Types.Cons) {
                return new Data_List_Types.Cons(v2.value0, deleteBy(v)(v1)(v2.value1));
            };
            throw new Error("Failed pattern match at Data.List line 606, column 1 - line 606, column 23: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
};
var unionBy = function (eq) {
    return function (xs) {
        return function (ys) {
            return Data_Semigroup.append(Data_List_Types.semigroupList)(xs)(Data_Foldable.foldl(Data_List_Types.foldableList)(Data_Function.flip(deleteBy(eq)))(nubBy(eq)(ys))(xs));
        };
    };
};
var union = function (dictEq) {
    return unionBy(Data_Eq.eq(dictEq));
};
var deleteAt = function (v) {
    return function (v1) {
        if (v === 0 && v1 instanceof Data_List_Types.Cons) {
            return new Data_Maybe.Just(v1.value1);
        };
        if (v1 instanceof Data_List_Types.Cons) {
            return Data_Functor.map(Data_Maybe.functorMaybe)(function (v2) {
                return new Data_List_Types.Cons(v1.value0, v2);
            })(deleteAt(v - 1 | 0)(v1.value1));
        };
        return Data_Maybe.Nothing.value;
    };
};
var $$delete = function (dictEq) {
    return deleteBy(Data_Eq.eq(dictEq));
};
var difference = function (dictEq) {
    return Data_Foldable.foldl(Data_List_Types.foldableList)(Data_Function.flip($$delete(dictEq)));
};
var concatMap = Data_Function.flip(Control_Bind.bind(Data_List_Types.bindList));
var concat = function (v) {
    return Control_Bind.bind(Data_List_Types.bindList)(v)(Control_Category.id(Control_Category.categoryFn));
};
var catMaybes = mapMaybe(Control_Category.id(Control_Category.categoryFn));
var alterAt = function (v) {
    return function (v1) {
        return function (v2) {
            if (v === 0 && v2 instanceof Data_List_Types.Cons) {
                return Data_Maybe.Just.create((function () {
                    var $296 = v1(v2.value0);
                    if ($296 instanceof Data_Maybe.Nothing) {
                        return v2.value1;
                    };
                    if ($296 instanceof Data_Maybe.Just) {
                        return new Data_List_Types.Cons($296.value0, v2.value1);
                    };
                    throw new Error("Failed pattern match at Data.List line 345, column 3 - line 347, column 23: " + [ $296.constructor.name ]);
                })());
            };
            if (v2 instanceof Data_List_Types.Cons) {
                return Data_Functor.map(Data_Maybe.functorMaybe)(function (v3) {
                    return new Data_List_Types.Cons(v2.value0, v3);
                })(alterAt(v - 1 | 0)(v1)(v2.value1));
            };
            return Data_Maybe.Nothing.value;
        };
    };
};
var modifyAt = function (n) {
    return function (f) {
        return alterAt(n)(function ($304) {
            return Data_Maybe.Just.create(f($304));
        });
    };
};
module.exports = {
    alterAt: alterAt, 
    catMaybes: catMaybes, 
    concat: concat, 
    concatMap: concatMap, 
    "delete": $$delete, 
    deleteAt: deleteAt, 
    deleteBy: deleteBy, 
    difference: difference, 
    drop: drop, 
    dropWhile: dropWhile, 
    elemIndex: elemIndex, 
    elemLastIndex: elemLastIndex, 
    filter: filter, 
    filterM: filterM, 
    findIndex: findIndex, 
    findLastIndex: findLastIndex, 
    foldM: foldM, 
    fromFoldable: fromFoldable, 
    group: group, 
    "group'": group$prime, 
    groupBy: groupBy, 
    head: head, 
    index: index, 
    init: init, 
    insert: insert, 
    insertAt: insertAt, 
    insertBy: insertBy, 
    intersect: intersect, 
    intersectBy: intersectBy, 
    last: last, 
    length: length, 
    many: many, 
    manyRec: manyRec, 
    mapMaybe: mapMaybe, 
    mapWithIndex: mapWithIndex, 
    modifyAt: modifyAt, 
    nub: nub, 
    nubBy: nubBy, 
    "null": $$null, 
    range: range, 
    reverse: reverse, 
    singleton: singleton, 
    slice: slice, 
    snoc: snoc, 
    some: some, 
    someRec: someRec, 
    sort: sort, 
    sortBy: sortBy, 
    span: span, 
    tail: tail, 
    take: take, 
    takeWhile: takeWhile, 
    toUnfoldable: toUnfoldable, 
    transpose: transpose, 
    uncons: uncons, 
    union: union, 
    unionBy: unionBy, 
    unsnoc: unsnoc, 
    unzip: unzip, 
    updateAt: updateAt, 
    zip: zip, 
    zipWith: zipWith, 
    zipWithA: zipWithA
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Lazy":45,"../Control.Monad.Rec.Class":73,"../Control.Semigroupoid":88,"../Data.Bifunctor":100,"../Data.Boolean":102,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.List.Types":136,"../Data.Maybe":140,"../Data.NonEmpty":150,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Traversable":178,"../Data.Tuple":179,"../Data.Unfoldable":181,"../Data.Unit":183,"../Prelude":196}],138:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Extend = require("../Control.Extend");
var Data_Eq = require("../Data.Eq");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var First = function (x) {
    return x;
};
var showFirst = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "First (" + (Data_Show.show(Data_Maybe.showMaybe(dictShow))(v) + ")");
    });
};
var semigroupFirst = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        if (v instanceof Data_Maybe.Just) {
            return v;
        };
        return v1;
    };
});
var ordFirst = function (dictOrd) {
    return Data_Maybe.ordMaybe(dictOrd);
};
var ord1First = Data_Maybe.ord1Maybe;
var newtypeFirst = new Data_Newtype.Newtype(function (n) {
    return n;
}, First);
var monoidFirst = new Data_Monoid.Monoid(function () {
    return semigroupFirst;
}, Data_Maybe.Nothing.value);
var monadFirst = Data_Maybe.monadMaybe;
var invariantFirst = Data_Maybe.invariantMaybe;
var functorFirst = Data_Maybe.functorMaybe;
var extendFirst = Data_Maybe.extendMaybe;
var eqFirst = function (dictEq) {
    return Data_Maybe.eqMaybe(dictEq);
};
var eq1First = Data_Maybe.eq1Maybe;
var boundedFirst = function (dictBounded) {
    return Data_Maybe.boundedMaybe(dictBounded);
};
var bindFirst = Data_Maybe.bindMaybe;
var applyFirst = Data_Maybe.applyMaybe;
var applicativeFirst = Data_Maybe.applicativeMaybe;
module.exports = {
    First: First, 
    newtypeFirst: newtypeFirst, 
    eqFirst: eqFirst, 
    eq1First: eq1First, 
    ordFirst: ordFirst, 
    ord1First: ord1First, 
    boundedFirst: boundedFirst, 
    functorFirst: functorFirst, 
    invariantFirst: invariantFirst, 
    applyFirst: applyFirst, 
    applicativeFirst: applicativeFirst, 
    bindFirst: bindFirst, 
    monadFirst: monadFirst, 
    extendFirst: extendFirst, 
    showFirst: showFirst, 
    semigroupFirst: semigroupFirst, 
    monoidFirst: monoidFirst
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Extend":44,"../Control.Monad":82,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196}],139:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Extend = require("../Control.Extend");
var Data_Eq = require("../Data.Eq");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Last = function (x) {
    return x;
};
var showLast = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Last " + (Data_Show.show(Data_Maybe.showMaybe(dictShow))(v) + ")");
    });
};
var semigroupLast = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        if (v1 instanceof Data_Maybe.Just) {
            return v1;
        };
        if (v1 instanceof Data_Maybe.Nothing) {
            return v;
        };
        throw new Error("Failed pattern match at Data.Maybe.Last line 54, column 3 - line 54, column 39: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var ordLast = function (dictOrd) {
    return Data_Maybe.ordMaybe(dictOrd);
};
var ord1Last = Data_Maybe.ord1Maybe;
var newtypeLast = new Data_Newtype.Newtype(function (n) {
    return n;
}, Last);
var monoidLast = new Data_Monoid.Monoid(function () {
    return semigroupLast;
}, Data_Maybe.Nothing.value);
var monadLast = Data_Maybe.monadMaybe;
var invariantLast = Data_Maybe.invariantMaybe;
var functorLast = Data_Maybe.functorMaybe;
var extendLast = Data_Maybe.extendMaybe;
var eqLast = function (dictEq) {
    return Data_Maybe.eqMaybe(dictEq);
};
var eq1Last = Data_Maybe.eq1Maybe;
var boundedLast = function (dictBounded) {
    return Data_Maybe.boundedMaybe(dictBounded);
};
var bindLast = Data_Maybe.bindMaybe;
var applyLast = Data_Maybe.applyMaybe;
var applicativeLast = Data_Maybe.applicativeMaybe;
module.exports = {
    Last: Last, 
    newtypeLast: newtypeLast, 
    eqLast: eqLast, 
    eq1Last: eq1Last, 
    ordLast: ordLast, 
    ord1Last: ord1Last, 
    boundedLast: boundedLast, 
    functorLast: functorLast, 
    invariantLast: invariantLast, 
    applyLast: applyLast, 
    applicativeLast: applicativeLast, 
    bindLast: bindLast, 
    monadLast: monadLast, 
    extendLast: extendLast, 
    showLast: showLast, 
    semigroupLast: semigroupLast, 
    monoidLast: monoidLast
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Extend":44,"../Control.Monad":82,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196}],140:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Extend = require("../Control.Extend");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Eq = require("../Data.Eq");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Ord = require("../Data.Ord");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Ordering = require("../Data.Ordering");
var Data_Bounded = require("../Data.Bounded");
var Data_Show = require("../Data.Show");
var Data_Unit = require("../Data.Unit");
var Data_Function = require("../Data.Function");
var Control_Category = require("../Control.Category");
var Nothing = (function () {
    function Nothing() {

    };
    Nothing.value = new Nothing();
    return Nothing;
})();
var Just = (function () {
    function Just(value0) {
        this.value0 = value0;
    };
    Just.create = function (value0) {
        return new Just(value0);
    };
    return Just;
})();
var showMaybe = function (dictShow) {
    return new Data_Show.Show(function (v) {
        if (v instanceof Just) {
            return "(Just " + (Data_Show.show(dictShow)(v.value0) + ")");
        };
        if (v instanceof Nothing) {
            return "Nothing";
        };
        throw new Error("Failed pattern match at Data.Maybe line 208, column 3 - line 209, column 3: " + [ v.constructor.name ]);
    });
};
var semigroupMaybe = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            if (v instanceof Nothing) {
                return v1;
            };
            if (v1 instanceof Nothing) {
                return v;
            };
            if (v instanceof Just && v1 instanceof Just) {
                return new Just(Data_Semigroup.append(dictSemigroup)(v.value0)(v1.value0));
            };
            throw new Error("Failed pattern match at Data.Maybe line 177, column 3 - line 177, column 23: " + [ v.constructor.name, v1.constructor.name ]);
        };
    });
};
var monoidMaybe = function (dictSemigroup) {
    return new Data_Monoid.Monoid(function () {
        return semigroupMaybe(dictSemigroup);
    }, Nothing.value);
};
var maybe$prime = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Nothing) {
                return v(Data_Unit.unit);
            };
            if (v2 instanceof Just) {
                return v1(v2.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe line 233, column 1 - line 233, column 28: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
};
var maybe = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Nothing) {
                return v;
            };
            if (v2 instanceof Just) {
                return v1(v2.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe line 220, column 1 - line 220, column 22: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
};
var isNothing = maybe(true)(Data_Function["const"](false));
var isJust = maybe(false)(Data_Function["const"](true));
var functorMaybe = new Data_Functor.Functor(function (v) {
    return function (v1) {
        if (v1 instanceof Just) {
            return new Just(v(v1.value0));
        };
        return Nothing.value;
    };
});
var invariantMaybe = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorMaybe));
var fromMaybe$prime = function (a) {
    return maybe$prime(a)(Control_Category.id(Control_Category.categoryFn));
};
var fromMaybe = function (a) {
    return maybe(a)(Control_Category.id(Control_Category.categoryFn));
};
var fromJust = function (dictPartial) {
    return function (v) {
        var __unused = function (dictPartial1) {
            return function ($dollar34) {
                return $dollar34;
            };
        };
        return __unused(dictPartial)((function () {
            if (v instanceof Just) {
                return v.value0;
            };
            throw new Error("Failed pattern match at Data.Maybe line 271, column 1 - line 271, column 21: " + [ v.constructor.name ]);
        })());
    };
};
var extendMaybe = new Control_Extend.Extend(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v1 instanceof Nothing) {
            return Nothing.value;
        };
        return new Just(v(v1));
    };
});
var eqMaybe = function (dictEq) {
    return new Data_Eq.Eq(function (x) {
        return function (y) {
            if (x instanceof Nothing && y instanceof Nothing) {
                return true;
            };
            if (x instanceof Just && y instanceof Just) {
                return Data_Eq.eq(dictEq)(x.value0)(y.value0);
            };
            return false;
        };
    });
};
var ordMaybe = function (dictOrd) {
    return new Data_Ord.Ord(function () {
        return eqMaybe(dictOrd["__superclass_Data.Eq.Eq_0"]());
    }, function (x) {
        return function (y) {
            if (x instanceof Nothing && y instanceof Nothing) {
                return Data_Ordering.EQ.value;
            };
            if (x instanceof Nothing) {
                return Data_Ordering.LT.value;
            };
            if (y instanceof Nothing) {
                return Data_Ordering.GT.value;
            };
            if (x instanceof Just && y instanceof Just) {
                return Data_Ord.compare(dictOrd)(x.value0)(y.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe line 196, column 1 - line 196, column 51: " + [ x.constructor.name, y.constructor.name ]);
        };
    });
};
var eq1Maybe = new Data_Eq.Eq1(function (dictEq) {
    return Data_Eq.eq(eqMaybe(dictEq));
});
var ord1Maybe = new Data_Ord.Ord1(function () {
    return eq1Maybe;
}, function (dictOrd) {
    return Data_Ord.compare(ordMaybe(dictOrd));
});
var boundedMaybe = function (dictBounded) {
    return new Data_Bounded.Bounded(function () {
        return ordMaybe(dictBounded["__superclass_Data.Ord.Ord_0"]());
    }, Nothing.value, new Just(Data_Bounded.top(dictBounded)));
};
var applyMaybe = new Control_Apply.Apply(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Just) {
            return Data_Functor.map(functorMaybe)(v.value0)(v1);
        };
        if (v instanceof Nothing) {
            return Nothing.value;
        };
        throw new Error("Failed pattern match at Data.Maybe line 69, column 3 - line 69, column 31: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var bindMaybe = new Control_Bind.Bind(function () {
    return applyMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Just) {
            return v1(v.value0);
        };
        if (v instanceof Nothing) {
            return Nothing.value;
        };
        throw new Error("Failed pattern match at Data.Maybe line 128, column 3 - line 128, column 24: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var applicativeMaybe = new Control_Applicative.Applicative(function () {
    return applyMaybe;
}, Just.create);
var monadMaybe = new Control_Monad.Monad(function () {
    return applicativeMaybe;
}, function () {
    return bindMaybe;
});
var altMaybe = new Control_Alt.Alt(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Nothing) {
            return v1;
        };
        return v;
    };
});
var plusMaybe = new Control_Plus.Plus(function () {
    return altMaybe;
}, Nothing.value);
var alternativeMaybe = new Control_Alternative.Alternative(function () {
    return applicativeMaybe;
}, function () {
    return plusMaybe;
});
var monadZeroMaybe = new Control_MonadZero.MonadZero(function () {
    return alternativeMaybe;
}, function () {
    return monadMaybe;
});
module.exports = {
    Nothing: Nothing, 
    Just: Just, 
    fromJust: fromJust, 
    fromMaybe: fromMaybe, 
    "fromMaybe'": fromMaybe$prime, 
    isJust: isJust, 
    isNothing: isNothing, 
    maybe: maybe, 
    "maybe'": maybe$prime, 
    functorMaybe: functorMaybe, 
    applyMaybe: applyMaybe, 
    applicativeMaybe: applicativeMaybe, 
    altMaybe: altMaybe, 
    plusMaybe: plusMaybe, 
    alternativeMaybe: alternativeMaybe, 
    bindMaybe: bindMaybe, 
    monadMaybe: monadMaybe, 
    monadZeroMaybe: monadZeroMaybe, 
    extendMaybe: extendMaybe, 
    invariantMaybe: invariantMaybe, 
    semigroupMaybe: semigroupMaybe, 
    monoidMaybe: monoidMaybe, 
    eqMaybe: eqMaybe, 
    eq1Maybe: eq1Maybe, 
    ordMaybe: ordMaybe, 
    ord1Maybe: ord1Maybe, 
    boundedMaybe: boundedMaybe, 
    showMaybe: showMaybe
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Extend":44,"../Control.Monad":82,"../Control.MonadZero":84,"../Control.Plus":87,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Function":121,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.Monoid":147,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Semigroup":161,"../Data.Show":165,"../Data.Unit":183,"../Prelude":196}],141:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Additive = function (x) {
    return x;
};
var showAdditive = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Additive " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semigroupAdditive = function (dictSemiring) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_Semiring.add(dictSemiring)(v)(v1);
        };
    });
};
var ordAdditive = function (dictOrd) {
    return dictOrd;
};
var newtypeAdditive = new Data_Newtype.Newtype(function (n) {
    return n;
}, Additive);
var monoidAdditive = function (dictSemiring) {
    return new Data_Monoid.Monoid(function () {
        return semigroupAdditive(dictSemiring);
    }, Data_Semiring.zero(dictSemiring));
};
var invariantAdditive = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorAdditive = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendAdditive = new Control_Extend.Extend(function () {
    return functorAdditive;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqAdditive = function (dictEq) {
    return dictEq;
};
var comonadAdditive = new Control_Comonad.Comonad(function () {
    return extendAdditive;
}, Data_Newtype.unwrap(newtypeAdditive));
var boundedAdditive = function (dictBounded) {
    return dictBounded;
};
var applyAdditive = new Control_Apply.Apply(function () {
    return functorAdditive;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindAdditive = new Control_Bind.Bind(function () {
    return applyAdditive;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeAdditive = new Control_Applicative.Applicative(function () {
    return applyAdditive;
}, Additive);
var monadAdditive = new Control_Monad.Monad(function () {
    return applicativeAdditive;
}, function () {
    return bindAdditive;
});
module.exports = {
    Additive: Additive, 
    newtypeAdditive: newtypeAdditive, 
    eqAdditive: eqAdditive, 
    ordAdditive: ordAdditive, 
    boundedAdditive: boundedAdditive, 
    functorAdditive: functorAdditive, 
    invariantAdditive: invariantAdditive, 
    applyAdditive: applyAdditive, 
    applicativeAdditive: applicativeAdditive, 
    bindAdditive: bindAdditive, 
    monadAdditive: monadAdditive, 
    extendAdditive: extendAdditive, 
    comonadAdditive: comonadAdditive, 
    showAdditive: showAdditive, 
    semigroupAdditive: semigroupAdditive, 
    monoidAdditive: monoidAdditive
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Monad":82,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Prelude":196}],142:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Conj = function (x) {
    return x;
};
var showConj = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Conj " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semiringConj = function (dictHeytingAlgebra) {
    return new Data_Semiring.Semiring(function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.conj(dictHeytingAlgebra)(v)(v1);
        };
    }, function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
        };
    }, Data_HeytingAlgebra.ff(dictHeytingAlgebra), Data_HeytingAlgebra.tt(dictHeytingAlgebra));
};
var semigroupConj = function (dictHeytingAlgebra) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.conj(dictHeytingAlgebra)(v)(v1);
        };
    });
};
var ordConj = function (dictOrd) {
    return dictOrd;
};
var newtypeConj = new Data_Newtype.Newtype(function (n) {
    return n;
}, Conj);
var monoidConj = function (dictHeytingAlgebra) {
    return new Data_Monoid.Monoid(function () {
        return semigroupConj(dictHeytingAlgebra);
    }, Data_HeytingAlgebra.tt(dictHeytingAlgebra));
};
var invariantConj = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorConj = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendConj = new Control_Extend.Extend(function () {
    return functorConj;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqConj = function (dictEq) {
    return dictEq;
};
var comonadConj = new Control_Comonad.Comonad(function () {
    return extendConj;
}, Data_Newtype.unwrap(newtypeConj));
var boundedConj = function (dictBounded) {
    return dictBounded;
};
var applyConj = new Control_Apply.Apply(function () {
    return functorConj;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindConj = new Control_Bind.Bind(function () {
    return applyConj;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeConj = new Control_Applicative.Applicative(function () {
    return applyConj;
}, Conj);
var monadConj = new Control_Monad.Monad(function () {
    return applicativeConj;
}, function () {
    return bindConj;
});
module.exports = {
    Conj: Conj, 
    newtypeConj: newtypeConj, 
    eqConj: eqConj, 
    ordConj: ordConj, 
    boundedConj: boundedConj, 
    functorConj: functorConj, 
    invariantConj: invariantConj, 
    applyConj: applyConj, 
    applicativeConj: applicativeConj, 
    bindConj: bindConj, 
    monadConj: monadConj, 
    extendConj: extendConj, 
    comonadConj: comonadConj, 
    showConj: showConj, 
    semigroupConj: semigroupConj, 
    monoidConj: monoidConj, 
    semiringConj: semiringConj
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Monad":82,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.HeytingAlgebra":131,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Prelude":196}],143:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Disj = function (x) {
    return x;
};
var showDisj = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Disj " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semiringDisj = function (dictHeytingAlgebra) {
    return new Data_Semiring.Semiring(function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
        };
    }, function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.conj(dictHeytingAlgebra)(v)(v1);
        };
    }, Data_HeytingAlgebra.tt(dictHeytingAlgebra), Data_HeytingAlgebra.ff(dictHeytingAlgebra));
};
var semigroupDisj = function (dictHeytingAlgebra) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
        };
    });
};
var ordDisj = function (dictOrd) {
    return dictOrd;
};
var newtypeDisj = new Data_Newtype.Newtype(function (n) {
    return n;
}, Disj);
var monoidDisj = function (dictHeytingAlgebra) {
    return new Data_Monoid.Monoid(function () {
        return semigroupDisj(dictHeytingAlgebra);
    }, Data_HeytingAlgebra.ff(dictHeytingAlgebra));
};
var invariantDisj = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorDisj = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendDisj = new Control_Extend.Extend(function () {
    return functorDisj;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqDisj = function (dictEq) {
    return dictEq;
};
var comonadDisj = new Control_Comonad.Comonad(function () {
    return extendDisj;
}, Data_Newtype.unwrap(newtypeDisj));
var boundedDisj = function (dictBounded) {
    return dictBounded;
};
var applyDisj = new Control_Apply.Apply(function () {
    return functorDisj;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindDisj = new Control_Bind.Bind(function () {
    return applyDisj;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeDisj = new Control_Applicative.Applicative(function () {
    return applyDisj;
}, Disj);
var monadDisj = new Control_Monad.Monad(function () {
    return applicativeDisj;
}, function () {
    return bindDisj;
});
module.exports = {
    Disj: Disj, 
    newtypeDisj: newtypeDisj, 
    eqDisj: eqDisj, 
    ordDisj: ordDisj, 
    boundedDisj: boundedDisj, 
    functorDisj: functorDisj, 
    invariantDisj: invariantDisj, 
    applyDisj: applyDisj, 
    applicativeDisj: applicativeDisj, 
    bindDisj: bindDisj, 
    monadDisj: monadDisj, 
    extendDisj: extendDisj, 
    comonadDisj: comonadDisj, 
    showDisj: showDisj, 
    semigroupDisj: semigroupDisj, 
    monoidDisj: monoidDisj, 
    semiringDisj: semiringDisj
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Monad":82,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.HeytingAlgebra":131,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Prelude":196}],144:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Dual = function (x) {
    return x;
};
var showDual = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Dual " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semigroupDual = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_Semigroup.append(dictSemigroup)(v1)(v);
        };
    });
};
var ordDual = function (dictOrd) {
    return dictOrd;
};
var newtypeDual = new Data_Newtype.Newtype(function (n) {
    return n;
}, Dual);
var monoidDual = function (dictMonoid) {
    return new Data_Monoid.Monoid(function () {
        return semigroupDual(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]());
    }, Data_Monoid.mempty(dictMonoid));
};
var invariantDual = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorDual = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendDual = new Control_Extend.Extend(function () {
    return functorDual;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqDual = function (dictEq) {
    return dictEq;
};
var comonadDual = new Control_Comonad.Comonad(function () {
    return extendDual;
}, Data_Newtype.unwrap(newtypeDual));
var boundedDual = function (dictBounded) {
    return dictBounded;
};
var applyDual = new Control_Apply.Apply(function () {
    return functorDual;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindDual = new Control_Bind.Bind(function () {
    return applyDual;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeDual = new Control_Applicative.Applicative(function () {
    return applyDual;
}, Dual);
var monadDual = new Control_Monad.Monad(function () {
    return applicativeDual;
}, function () {
    return bindDual;
});
module.exports = {
    Dual: Dual, 
    newtypeDual: newtypeDual, 
    eqDual: eqDual, 
    ordDual: ordDual, 
    boundedDual: boundedDual, 
    functorDual: functorDual, 
    invariantDual: invariantDual, 
    applyDual: applyDual, 
    applicativeDual: applicativeDual, 
    bindDual: bindDual, 
    monadDual: monadDual, 
    extendDual: extendDual, 
    comonadDual: comonadDual, 
    showDual: showDual, 
    semigroupDual: semigroupDual, 
    monoidDual: monoidDual
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Monad":82,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196}],145:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Category = require("../Control.Category");
var Endo = function (x) {
    return x;
};
var semigroupEndo = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        return function ($11) {
            return v(v1($11));
        };
    };
});
var newtypeEndo = new Data_Newtype.Newtype(function (n) {
    return n;
}, Endo);
var monoidEndo = new Data_Monoid.Monoid(function () {
    return semigroupEndo;
}, Control_Category.id(Control_Category.categoryFn));
var invariantEndo = new Data_Functor_Invariant.Invariant(function (ab) {
    return function (ba) {
        return function (v) {
            return function ($12) {
                return ab(v(ba($12)));
            };
        };
    };
});
module.exports = {
    Endo: Endo, 
    newtypeEndo: newtypeEndo, 
    invariantEndo: invariantEndo, 
    semigroupEndo: semigroupEndo, 
    monoidEndo: monoidEndo
};

},{"../Control.Category":41,"../Control.Semigroupoid":88,"../Data.Functor.Invariant":125,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Semigroup":161,"../Prelude":196}],146:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Bounded = require("../Data.Bounded");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Multiplicative = function (x) {
    return x;
};
var showMultiplicative = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Multiplicative " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semigroupMultiplicative = function (dictSemiring) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_Semiring.mul(dictSemiring)(v)(v1);
        };
    });
};
var ordMultiplicative = function (dictOrd) {
    return dictOrd;
};
var newtypeMultiplicative = new Data_Newtype.Newtype(function (n) {
    return n;
}, Multiplicative);
var monoidMultiplicative = function (dictSemiring) {
    return new Data_Monoid.Monoid(function () {
        return semigroupMultiplicative(dictSemiring);
    }, Data_Semiring.one(dictSemiring));
};
var invariantMultiplicative = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorMultiplicative = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendMultiplicative = new Control_Extend.Extend(function () {
    return functorMultiplicative;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqMultiplicative = function (dictEq) {
    return dictEq;
};
var comonadMultiplicative = new Control_Comonad.Comonad(function () {
    return extendMultiplicative;
}, Data_Newtype.unwrap(newtypeMultiplicative));
var boundedMultiplicative = function (dictBounded) {
    return dictBounded;
};
var applyMultiplicative = new Control_Apply.Apply(function () {
    return functorMultiplicative;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindMultiplicative = new Control_Bind.Bind(function () {
    return applyMultiplicative;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeMultiplicative = new Control_Applicative.Applicative(function () {
    return applyMultiplicative;
}, Multiplicative);
var monadMultiplicative = new Control_Monad.Monad(function () {
    return applicativeMultiplicative;
}, function () {
    return bindMultiplicative;
});
module.exports = {
    Multiplicative: Multiplicative, 
    newtypeMultiplicative: newtypeMultiplicative, 
    eqMultiplicative: eqMultiplicative, 
    ordMultiplicative: ordMultiplicative, 
    boundedMultiplicative: boundedMultiplicative, 
    functorMultiplicative: functorMultiplicative, 
    invariantMultiplicative: invariantMultiplicative, 
    applyMultiplicative: applyMultiplicative, 
    applicativeMultiplicative: applicativeMultiplicative, 
    bindMultiplicative: bindMultiplicative, 
    monadMultiplicative: monadMultiplicative, 
    extendMultiplicative: extendMultiplicative, 
    comonadMultiplicative: comonadMultiplicative, 
    showMultiplicative: showMultiplicative, 
    semigroupMultiplicative: semigroupMultiplicative, 
    monoidMultiplicative: monoidMultiplicative
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Monad":82,"../Data.Bounded":105,"../Data.Eq":113,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Prelude":196}],147:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Unit = require("../Data.Unit");
var Data_Function = require("../Data.Function");
var Data_Ord = require("../Data.Ord");
var Data_Eq = require("../Data.Eq");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Boolean = require("../Data.Boolean");
var Monoid = function (__superclass_Data$dotSemigroup$dotSemigroup_0, mempty) {
    this["__superclass_Data.Semigroup.Semigroup_0"] = __superclass_Data$dotSemigroup$dotSemigroup_0;
    this.mempty = mempty;
};
var monoidUnit = new Monoid(function () {
    return Data_Semigroup.semigroupUnit;
}, Data_Unit.unit);
var monoidString = new Monoid(function () {
    return Data_Semigroup.semigroupString;
}, "");
var monoidArray = new Monoid(function () {
    return Data_Semigroup.semigroupArray;
}, [  ]);
var mempty = function (dict) {
    return dict.mempty;
};
var monoidFn = function (dictMonoid) {
    return new Monoid(function () {
        return Data_Semigroup.semigroupFn(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]());
    }, Data_Function["const"](mempty(dictMonoid)));
};
var power = function (dictMonoid) {
    return function (x) {
        var go = function (p) {
            if (p <= 0) {
                return mempty(dictMonoid);
            };
            if (p === 1) {
                return x;
            };
            if (p % 2 === 0) {
                var x$prime = go(p / 2 | 0);
                return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(x$prime)(x$prime);
            };
            if (Data_Boolean.otherwise) {
                var x$prime = go(p / 2 | 0);
                return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(x$prime)(Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(x$prime)(x));
            };
            throw new Error("Failed pattern match at Data.Monoid line 49, column 3 - line 53, column 57: " + [ p.constructor.name ]);
        };
        return go;
    };
};
module.exports = {
    Monoid: Monoid, 
    mempty: mempty, 
    power: power, 
    monoidUnit: monoidUnit, 
    monoidFn: monoidFn, 
    monoidString: monoidString, 
    monoidArray: monoidArray
};

},{"../Data.Boolean":102,"../Data.Eq":113,"../Data.EuclideanRing":115,"../Data.Function":121,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.Unit":183,"../Prelude":196}],148:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
module.exports = {};

},{}],149:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Function = require("../Data.Function");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Functor = require("../Data.Functor");
var Newtype = function (unwrap, wrap) {
    this.unwrap = unwrap;
    this.wrap = wrap;
};
var wrap = function (dict) {
    return dict.wrap;
};
var unwrap = function (dict) {
    return dict.unwrap;
};
var underF2 = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($50) {
                            return function ($51) {
                                return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(Data_Function.on(f)(Data_Functor.map(dictFunctor)(wrap(dictNewtype)))($50)($51));
                            };
                        };
                    };
                };
            };
        };
    };
};
var underF = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($52) {
                            return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(wrap(dictNewtype))($52)));
                        };
                    };
                };
            };
        };
    };
};
var under2 = function (dictNewtype) {
    return function (dictNewtype1) {
        return function (v) {
            return function (f) {
                return function ($53) {
                    return function ($54) {
                        return unwrap(dictNewtype1)(Data_Function.on(f)(wrap(dictNewtype))($53)($54));
                    };
                };
            };
        };
    };
};
var under = function (dictNewtype) {
    return function (dictNewtype1) {
        return function (v) {
            return function (f) {
                return function ($55) {
                    return unwrap(dictNewtype1)(f(wrap(dictNewtype)($55)));
                };
            };
        };
    };
};
var un = function (dictNewtype) {
    return function (v) {
        return unwrap(dictNewtype);
    };
};
var traverse = function (dictFunctor) {
    return function (dictNewtype) {
        return function (v) {
            return function (f) {
                return function ($56) {
                    return Data_Functor.map(dictFunctor)(wrap(dictNewtype))(f(unwrap(dictNewtype)($56)));
                };
            };
        };
    };
};
var overF2 = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($57) {
                            return function ($58) {
                                return Data_Functor.map(dictFunctor1)(wrap(dictNewtype1))(Data_Function.on(f)(Data_Functor.map(dictFunctor)(unwrap(dictNewtype)))($57)($58));
                            };
                        };
                    };
                };
            };
        };
    };
};
var overF = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($59) {
                            return Data_Functor.map(dictFunctor1)(wrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(unwrap(dictNewtype))($59)));
                        };
                    };
                };
            };
        };
    };
};
var over2 = function (dictNewtype) {
    return function (dictNewtype1) {
        return function (v) {
            return function (f) {
                return function ($60) {
                    return function ($61) {
                        return wrap(dictNewtype1)(Data_Function.on(f)(unwrap(dictNewtype))($60)($61));
                    };
                };
            };
        };
    };
};
var over = function (dictNewtype) {
    return function (dictNewtype1) {
        return function (v) {
            return function (f) {
                return function ($62) {
                    return wrap(dictNewtype1)(f(unwrap(dictNewtype)($62)));
                };
            };
        };
    };
};
var op = function (dictNewtype) {
    return un(dictNewtype);
};
var collect = function (dictFunctor) {
    return function (dictNewtype) {
        return function (v) {
            return function (f) {
                return function ($63) {
                    return wrap(dictNewtype)(f(Data_Functor.map(dictFunctor)(unwrap(dictNewtype))($63)));
                };
            };
        };
    };
};
var alaF = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($64) {
                            return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(wrap(dictNewtype))($64)));
                        };
                    };
                };
            };
        };
    };
};
var ala = function (dictFunctor) {
    return function (dictNewtype) {
        return function (dictNewtype1) {
            return function (v) {
                return function (f) {
                    return Data_Functor.map(dictFunctor)(unwrap(dictNewtype))(f(wrap(dictNewtype1)));
                };
            };
        };
    };
};
module.exports = {
    Newtype: Newtype, 
    ala: ala, 
    alaF: alaF, 
    collect: collect, 
    op: op, 
    over: over, 
    over2: over2, 
    overF: overF, 
    overF2: overF2, 
    traverse: traverse, 
    un: un, 
    under: under, 
    under2: under2, 
    underF: underF, 
    underF2: underF2, 
    unwrap: unwrap, 
    wrap: wrap
};

},{"../Control.Semigroupoid":88,"../Data.Function":121,"../Data.Functor":127,"../Prelude":196}],150:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Plus = require("../Control.Plus");
var Data_Foldable = require("../Data.Foldable");
var Data_Traversable = require("../Data.Traversable");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Category = require("../Control.Category");
var NonEmpty = (function () {
    function NonEmpty(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    NonEmpty.create = function (value0) {
        return function (value1) {
            return new NonEmpty(value0, value1);
        };
    };
    return NonEmpty;
})();
var tail = function (v) {
    return v.value1;
};
var singleton = function (dictPlus) {
    return function (a) {
        return new NonEmpty(a, Control_Plus.empty(dictPlus));
    };
};
var showNonEmpty = function (dictShow) {
    return function (dictShow1) {
        return new Data_Show.Show(function (v) {
            return "(NonEmpty " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(dictShow1)(v.value1) + ")")));
        });
    };
};
var oneOf = function (dictAlternative) {
    return function (v) {
        return Control_Alt.alt((dictAlternative["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())(Control_Applicative.pure(dictAlternative["__superclass_Control.Applicative.Applicative_0"]())(v.value0))(v.value1);
    };
};
var head = function (v) {
    return v.value0;
};
var functorNonEmpty = function (dictFunctor) {
    return new Data_Functor.Functor(function (f) {
        return function (v) {
            return new NonEmpty(f(v.value0), Data_Functor.map(dictFunctor)(f)(v.value1));
        };
    });
};
var fromNonEmpty = function (f) {
    return function (v) {
        return f(v.value0)(v.value1);
    };
};
var foldl1 = function (dictFoldable) {
    return function (f) {
        return function (v) {
            return Data_Foldable.foldl(dictFoldable)(f)(v.value0)(v.value1);
        };
    };
};
var foldableNonEmpty = function (dictFoldable) {
    return new Data_Foldable.Foldable(function (dictMonoid) {
        return function (f) {
            return function (v) {
                return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(f(v.value0))(Data_Foldable.foldMap(dictFoldable)(dictMonoid)(f)(v.value1));
            };
        };
    }, function (f) {
        return function (b) {
            return function (v) {
                return Data_Foldable.foldl(dictFoldable)(f)(f(b)(v.value0))(v.value1);
            };
        };
    }, function (f) {
        return function (b) {
            return function (v) {
                return f(v.value0)(Data_Foldable.foldr(dictFoldable)(f)(b)(v.value1));
            };
        };
    });
};
var traversableNonEmpty = function (dictTraversable) {
    return new Data_Traversable.Traversable(function () {
        return foldableNonEmpty(dictTraversable["__superclass_Data.Foldable.Foldable_1"]());
    }, function () {
        return functorNonEmpty(dictTraversable["__superclass_Data.Functor.Functor_0"]());
    }, function (dictApplicative) {
        return function (v) {
            return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(NonEmpty.create)(v.value0))(Data_Traversable.sequence(dictTraversable)(dictApplicative)(v.value1));
        };
    }, function (dictApplicative) {
        return function (f) {
            return function (v) {
                return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(NonEmpty.create)(f(v.value0)))(Data_Traversable.traverse(dictTraversable)(dictApplicative)(f)(v.value1));
            };
        };
    });
};
var foldMap1 = function (dictSemigroup) {
    return function (dictFoldable) {
        return function (f) {
            return function (v) {
                return Data_Foldable.foldl(dictFoldable)(function (s) {
                    return function (a1) {
                        return Data_Semigroup.append(dictSemigroup)(s)(f(a1));
                    };
                })(f(v.value0))(v.value1);
            };
        };
    };
};
var fold1 = function (dictSemigroup) {
    return function (dictFoldable) {
        return foldMap1(dictSemigroup)(dictFoldable)(Control_Category.id(Control_Category.categoryFn));
    };
};
var eqNonEmpty = function (dictEq) {
    return function (dictEq1) {
        return new Data_Eq.Eq(function (x) {
            return function (y) {
                return Data_Eq.eq(dictEq)(x.value0)(y.value0) && Data_Eq.eq(dictEq1)(x.value1)(y.value1);
            };
        });
    };
};
var ordNonEmpty = function (dictOrd) {
    return function (dictOrd1) {
        return new Data_Ord.Ord(function () {
            return eqNonEmpty(dictOrd["__superclass_Data.Eq.Eq_0"]())(dictOrd1["__superclass_Data.Eq.Eq_0"]());
        }, function (x) {
            return function (y) {
                var $101 = Data_Ord.compare(dictOrd)(x.value0)(y.value0);
                if ($101 instanceof Data_Ordering.LT) {
                    return Data_Ordering.LT.value;
                };
                if ($101 instanceof Data_Ordering.GT) {
                    return Data_Ordering.GT.value;
                };
                return Data_Ord.compare(dictOrd1)(x.value1)(y.value1);
            };
        });
    };
};
module.exports = {
    NonEmpty: NonEmpty, 
    fold1: fold1, 
    foldMap1: foldMap1, 
    foldl1: foldl1, 
    fromNonEmpty: fromNonEmpty, 
    head: head, 
    oneOf: oneOf, 
    singleton: singleton, 
    tail: tail, 
    showNonEmpty: showNonEmpty, 
    eqNonEmpty: eqNonEmpty, 
    ordNonEmpty: ordNonEmpty, 
    functorNonEmpty: functorNonEmpty, 
    foldableNonEmpty: foldableNonEmpty, 
    traversableNonEmpty: traversableNonEmpty
};

},{"../Control.Alt":32,"../Control.Alternative":33,"../Control.Applicative":34,"../Control.Apply":36,"../Control.Category":41,"../Control.Plus":87,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Semigroup":161,"../Data.Show":165,"../Data.Traversable":178,"../Prelude":196}],151:[function(require,module,exports){
"use strict";

exports.unsafeCompareImpl = function (lt) {
  return function (eq) {
    return function (gt) {
      return function (x) {
        return function (y) {
          return x < y ? lt : x === y ? eq : gt;
        };
      };
    };
  };
};

},{}],152:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Ordering = require("../Data.Ordering");
var unsafeCompare = $foreign.unsafeCompareImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value);
module.exports = {
    unsafeCompare: unsafeCompare
};

},{"../Data.Ordering":155,"./foreign":151}],153:[function(require,module,exports){
"use strict";

exports.ordArrayImpl = function (f) {
  return function (xs) {
    return function (ys) {
      var i = 0;
      var xlen = xs.length;
      var ylen = ys.length;
      while (i < xlen && i < ylen) {
        var x = xs[i];
        var y = ys[i];
        var o = f(x)(y);
        if (o !== 0) {
          return o;
        }
        i++;
      }
      if (xlen === ylen) {
        return 0;
      } else if (xlen > ylen) {
        return -1;
      } else {
        return 1;
      }
    };
  };
};

},{}],154:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Eq = require("../Data.Eq");
var Data_Function = require("../Data.Function");
var Data_Ord_Unsafe = require("../Data.Ord.Unsafe");
var Data_Ordering = require("../Data.Ordering");
var Data_Ring = require("../Data.Ring");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
var Data_Semiring = require("../Data.Semiring");
var Ord = function (__superclass_Data$dotEq$dotEq_0, compare) {
    this["__superclass_Data.Eq.Eq_0"] = __superclass_Data$dotEq$dotEq_0;
    this.compare = compare;
};
var Ord1 = function (__superclass_Data$dotEq$dotEq1_0, compare1) {
    this["__superclass_Data.Eq.Eq1_0"] = __superclass_Data$dotEq$dotEq1_0;
    this.compare1 = compare1;
};
var ordVoid = new Ord(function () {
    return Data_Eq.eqVoid;
}, function (v) {
    return function (v1) {
        return Data_Ordering.EQ.value;
    };
});
var ordUnit = new Ord(function () {
    return Data_Eq.eqUnit;
}, function (v) {
    return function (v1) {
        return Data_Ordering.EQ.value;
    };
});
var ordString = new Ord(function () {
    return Data_Eq.eqString;
}, Data_Ord_Unsafe.unsafeCompare);
var ordOrdering = new Ord(function () {
    return Data_Ordering.eqOrdering;
}, function (v) {
    return function (v1) {
        if (v instanceof Data_Ordering.LT && v1 instanceof Data_Ordering.LT) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.EQ) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.GT && v1 instanceof Data_Ordering.GT) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.LT) {
            return Data_Ordering.LT.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.LT) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.GT) {
            return Data_Ordering.LT.value;
        };
        if (v instanceof Data_Ordering.GT) {
            return Data_Ordering.GT.value;
        };
        throw new Error("Failed pattern match at Data.Ord line 69, column 3 - line 69, column 21: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var ordNumber = new Ord(function () {
    return Data_Eq.eqNumber;
}, Data_Ord_Unsafe.unsafeCompare);
var ordInt = new Ord(function () {
    return Data_Eq.eqInt;
}, Data_Ord_Unsafe.unsafeCompare);
var ordChar = new Ord(function () {
    return Data_Eq.eqChar;
}, Data_Ord_Unsafe.unsafeCompare);
var ordBoolean = new Ord(function () {
    return Data_Eq.eqBoolean;
}, Data_Ord_Unsafe.unsafeCompare);
var compare1 = function (dict) {
    return dict.compare1;
};
var compare = function (dict) {
    return dict.compare;
};
var comparing = function (dictOrd) {
    return function (f) {
        return Data_Function.on(compare(dictOrd))(f);
    };
};
var greaterThan = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var $23 = compare(dictOrd)(a1)(a2);
            if ($23 instanceof Data_Ordering.GT) {
                return true;
            };
            return false;
        };
    };
};
var greaterThanOrEq = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var $24 = compare(dictOrd)(a1)(a2);
            if ($24 instanceof Data_Ordering.LT) {
                return false;
            };
            return true;
        };
    };
};
var signum = function (dictOrd) {
    return function (dictRing) {
        return function (x) {
            var $25 = greaterThanOrEq(dictOrd)(x)(Data_Semiring.zero(dictRing["__superclass_Data.Semiring.Semiring_0"]()));
            if ($25) {
                return Data_Semiring.one(dictRing["__superclass_Data.Semiring.Semiring_0"]());
            };
            if (!$25) {
                return Data_Ring.negate(dictRing)(Data_Semiring.one(dictRing["__superclass_Data.Semiring.Semiring_0"]()));
            };
            throw new Error("Failed pattern match at Data.Ord line 164, column 12 - line 164, column 49: " + [ $25.constructor.name ]);
        };
    };
};
var lessThan = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var $26 = compare(dictOrd)(a1)(a2);
            if ($26 instanceof Data_Ordering.LT) {
                return true;
            };
            return false;
        };
    };
};
var lessThanOrEq = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var $27 = compare(dictOrd)(a1)(a2);
            if ($27 instanceof Data_Ordering.GT) {
                return false;
            };
            return true;
        };
    };
};
var max = function (dictOrd) {
    return function (x) {
        return function (y) {
            var $28 = compare(dictOrd)(x)(y);
            if ($28 instanceof Data_Ordering.LT) {
                return y;
            };
            if ($28 instanceof Data_Ordering.EQ) {
                return x;
            };
            if ($28 instanceof Data_Ordering.GT) {
                return x;
            };
            throw new Error("Failed pattern match at Data.Ord line 123, column 3 - line 126, column 12: " + [ $28.constructor.name ]);
        };
    };
};
var min = function (dictOrd) {
    return function (x) {
        return function (y) {
            var $29 = compare(dictOrd)(x)(y);
            if ($29 instanceof Data_Ordering.LT) {
                return x;
            };
            if ($29 instanceof Data_Ordering.EQ) {
                return x;
            };
            if ($29 instanceof Data_Ordering.GT) {
                return y;
            };
            throw new Error("Failed pattern match at Data.Ord line 114, column 3 - line 117, column 12: " + [ $29.constructor.name ]);
        };
    };
};
var ordArray = function (dictOrd) {
    return new Ord(function () {
        return Data_Eq.eqArray(dictOrd["__superclass_Data.Eq.Eq_0"]());
    }, (function () {
        var toDelta = function (x) {
            return function (y) {
                var $30 = compare(dictOrd)(x)(y);
                if ($30 instanceof Data_Ordering.EQ) {
                    return 0;
                };
                if ($30 instanceof Data_Ordering.LT) {
                    return 1;
                };
                if ($30 instanceof Data_Ordering.GT) {
                    return -1 | 0;
                };
                throw new Error("Failed pattern match at Data.Ord line 61, column 7 - line 66, column 1: " + [ $30.constructor.name ]);
            };
        };
        return function (xs) {
            return function (ys) {
                return compare(ordInt)(0)($foreign.ordArrayImpl(toDelta)(xs)(ys));
            };
        };
    })());
};
var ord1Array = new Ord1(function () {
    return Data_Eq.eq1Array;
}, function (dictOrd) {
    return compare(ordArray(dictOrd));
});
var clamp = function (dictOrd) {
    return function (low) {
        return function (hi) {
            return function (x) {
                return min(dictOrd)(hi)(max(dictOrd)(low)(x));
            };
        };
    };
};
var between = function (dictOrd) {
    return function (low) {
        return function (hi) {
            return function (x) {
                if (lessThan(dictOrd)(x)(low)) {
                    return false;
                };
                if (greaterThan(dictOrd)(x)(hi)) {
                    return false;
                };
                if (true) {
                    return true;
                };
                throw new Error("Failed pattern match at Data.Ord line 151, column 1 - line 154, column 16: " + [ low.constructor.name, hi.constructor.name, x.constructor.name ]);
            };
        };
    };
};
var abs = function (dictOrd) {
    return function (dictRing) {
        return function (x) {
            var $34 = greaterThanOrEq(dictOrd)(x)(Data_Semiring.zero(dictRing["__superclass_Data.Semiring.Semiring_0"]()));
            if ($34) {
                return x;
            };
            if (!$34) {
                return Data_Ring.negate(dictRing)(x);
            };
            throw new Error("Failed pattern match at Data.Ord line 159, column 9 - line 159, column 42: " + [ $34.constructor.name ]);
        };
    };
};
module.exports = {
    Ord: Ord, 
    Ord1: Ord1, 
    abs: abs, 
    between: between, 
    clamp: clamp, 
    compare: compare, 
    compare1: compare1, 
    comparing: comparing, 
    greaterThan: greaterThan, 
    greaterThanOrEq: greaterThanOrEq, 
    lessThan: lessThan, 
    lessThanOrEq: lessThanOrEq, 
    max: max, 
    min: min, 
    signum: signum, 
    ordBoolean: ordBoolean, 
    ordInt: ordInt, 
    ordNumber: ordNumber, 
    ordString: ordString, 
    ordChar: ordChar, 
    ordUnit: ordUnit, 
    ordVoid: ordVoid, 
    ordArray: ordArray, 
    ordOrdering: ordOrdering, 
    ord1Array: ord1Array
};

},{"../Data.Eq":113,"../Data.Function":121,"../Data.Ord.Unsafe":152,"../Data.Ordering":155,"../Data.Ring":159,"../Data.Semiring":163,"../Data.Unit":183,"../Data.Void":184,"./foreign":153}],155:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Eq = require("../Data.Eq");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var LT = (function () {
    function LT() {

    };
    LT.value = new LT();
    return LT;
})();
var GT = (function () {
    function GT() {

    };
    GT.value = new GT();
    return GT;
})();
var EQ = (function () {
    function EQ() {

    };
    EQ.value = new EQ();
    return EQ;
})();
var showOrdering = new Data_Show.Show(function (v) {
    if (v instanceof LT) {
        return "LT";
    };
    if (v instanceof GT) {
        return "GT";
    };
    if (v instanceof EQ) {
        return "EQ";
    };
    throw new Error("Failed pattern match at Data.Ordering line 27, column 3 - line 28, column 3: " + [ v.constructor.name ]);
});
var semigroupOrdering = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        if (v instanceof LT) {
            return LT.value;
        };
        if (v instanceof GT) {
            return GT.value;
        };
        if (v instanceof EQ) {
            return v1;
        };
        throw new Error("Failed pattern match at Data.Ordering line 22, column 3 - line 22, column 19: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var invert = function (v) {
    if (v instanceof GT) {
        return LT.value;
    };
    if (v instanceof EQ) {
        return EQ.value;
    };
    if (v instanceof LT) {
        return GT.value;
    };
    throw new Error("Failed pattern match at Data.Ordering line 34, column 1 - line 34, column 15: " + [ v.constructor.name ]);
};
var eqOrdering = new Data_Eq.Eq(function (v) {
    return function (v1) {
        if (v instanceof LT && v1 instanceof LT) {
            return true;
        };
        if (v instanceof GT && v1 instanceof GT) {
            return true;
        };
        if (v instanceof EQ && v1 instanceof EQ) {
            return true;
        };
        return false;
    };
});
module.exports = {
    LT: LT, 
    GT: GT, 
    EQ: EQ, 
    invert: invert, 
    eqOrdering: eqOrdering, 
    semigroupOrdering: semigroupOrdering, 
    showOrdering: showOrdering
};

},{"../Data.Eq":113,"../Data.Semigroup":161,"../Data.Show":165}],156:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Either = require("../Data.Either");
var Data_Profunctor = require("../Data.Profunctor");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Category = require("../Control.Category");
var Choice = function (__superclass_Data$dotProfunctor$dotProfunctor_0, left, right) {
    this["__superclass_Data.Profunctor.Profunctor_0"] = __superclass_Data$dotProfunctor$dotProfunctor_0;
    this.left = left;
    this.right = right;
};
var right = function (dict) {
    return dict.right;
};
var left = function (dict) {
    return dict.left;
};
var splitChoice = function (dictCategory) {
    return function (dictChoice) {
        return function (l) {
            return function (r) {
                return Control_Semigroupoid.composeFlipped(dictCategory["__superclass_Control.Semigroupoid.Semigroupoid_0"]())(left(dictChoice)(l))(right(dictChoice)(r));
            };
        };
    };
};
var fanin = function (dictCategory) {
    return function (dictChoice) {
        return function (l) {
            return function (r) {
                var join = Data_Profunctor.dimap(dictChoice["__superclass_Data.Profunctor.Profunctor_0"]())(Data_Either.either(Control_Category.id(Control_Category.categoryFn))(Control_Category.id(Control_Category.categoryFn)))(Control_Category.id(Control_Category.categoryFn))(Control_Category.id(dictCategory));
                return Control_Semigroupoid.composeFlipped(dictCategory["__superclass_Control.Semigroupoid.Semigroupoid_0"]())(splitChoice(dictCategory)(dictChoice)(l)(r))(join);
            };
        };
    };
};
var choiceFn = new Choice(function () {
    return Data_Profunctor.profunctorFn;
}, function (v) {
    return function (v1) {
        if (v1 instanceof Data_Either.Left) {
            return Data_Either.Left.create(v(v1.value0));
        };
        if (v1 instanceof Data_Either.Right) {
            return new Data_Either.Right(v1.value0);
        };
        throw new Error("Failed pattern match at Data.Profunctor.Choice line 33, column 3 - line 33, column 36: " + [ v.constructor.name, v1.constructor.name ]);
    };
}, Data_Functor.map(Data_Either.functorEither));
module.exports = {
    Choice: Choice, 
    fanin: fanin, 
    left: left, 
    right: right, 
    splitChoice: splitChoice, 
    choiceFn: choiceFn
};

},{"../Control.Category":41,"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Function":121,"../Data.Functor":127,"../Data.Profunctor":157,"../Prelude":196}],157:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Newtype = require("../Data.Newtype");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Category = require("../Control.Category");
var Profunctor = function (dimap) {
    this.dimap = dimap;
};
var profunctorFn = new Profunctor(function (a2b) {
    return function (c2d) {
        return function (b2c) {
            return function ($9) {
                return c2d(b2c(a2b($9)));
            };
        };
    };
});
var dimap = function (dict) {
    return dict.dimap;
};
var lmap = function (dictProfunctor) {
    return function (a2b) {
        return dimap(dictProfunctor)(a2b)(Control_Category.id(Control_Category.categoryFn));
    };
};
var rmap = function (dictProfunctor) {
    return function (b2c) {
        return dimap(dictProfunctor)(Control_Category.id(Control_Category.categoryFn))(b2c);
    };
};
var unwrapIso = function (dictProfunctor) {
    return function (dictNewtype) {
        return dimap(dictProfunctor)(Data_Newtype.wrap(dictNewtype))(Data_Newtype.unwrap(dictNewtype));
    };
};
var wrapIso = function (dictProfunctor) {
    return function (dictNewtype) {
        return function (v) {
            return dimap(dictProfunctor)(Data_Newtype.unwrap(dictNewtype))(Data_Newtype.wrap(dictNewtype));
        };
    };
};
var arr = function (dictCategory) {
    return function (dictProfunctor) {
        return function (f) {
            return rmap(dictProfunctor)(f)(Control_Category.id(dictCategory));
        };
    };
};
module.exports = {
    Profunctor: Profunctor, 
    arr: arr, 
    dimap: dimap, 
    lmap: lmap, 
    rmap: rmap, 
    unwrapIso: unwrapIso, 
    wrapIso: wrapIso, 
    profunctorFn: profunctorFn
};

},{"../Control.Category":41,"../Control.Semigroupoid":88,"../Data.Newtype":149,"../Prelude":196}],158:[function(require,module,exports){
"use strict";

exports.intSub = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x - y | 0;
  };
};

exports.numSub = function (n1) {
  return function (n2) {
    return n1 - n2;
  };
};

},{}],159:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var Ring = function (__superclass_Data$dotSemiring$dotSemiring_0, sub) {
    this["__superclass_Data.Semiring.Semiring_0"] = __superclass_Data$dotSemiring$dotSemiring_0;
    this.sub = sub;
};
var sub = function (dict) {
    return dict.sub;
};
var ringUnit = new Ring(function () {
    return Data_Semiring.semiringUnit;
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
});
var ringNumber = new Ring(function () {
    return Data_Semiring.semiringNumber;
}, $foreign.numSub);
var ringInt = new Ring(function () {
    return Data_Semiring.semiringInt;
}, $foreign.intSub);
var ringFn = function (dictRing) {
    return new Ring(function () {
        return Data_Semiring.semiringFn(dictRing["__superclass_Data.Semiring.Semiring_0"]());
    }, function (f) {
        return function (g) {
            return function (x) {
                return sub(dictRing)(f(x))(g(x));
            };
        };
    });
};
var negate = function (dictRing) {
    return function (a) {
        return sub(dictRing)(Data_Semiring.zero(dictRing["__superclass_Data.Semiring.Semiring_0"]()))(a);
    };
};
module.exports = {
    Ring: Ring, 
    negate: negate, 
    sub: sub, 
    ringInt: ringInt, 
    ringNumber: ringNumber, 
    ringUnit: ringUnit, 
    ringFn: ringFn
};

},{"../Data.Semiring":163,"../Data.Unit":183,"./foreign":158}],160:[function(require,module,exports){
"use strict";

exports.concatString = function (s1) {
  return function (s2) {
    return s1 + s2;
  };
};

exports.concatArray = function (xs) {
  return function (ys) {
    if (xs.length === 0) return ys;
    if (ys.length === 0) return xs;
    return xs.concat(ys);
  };
};

},{}],161:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
var Semigroup = function (append) {
    this.append = append;
};
var semigroupVoid = new Semigroup(function (v) {
    return Data_Void.absurd;
});
var semigroupUnit = new Semigroup(function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
});
var semigroupString = new Semigroup($foreign.concatString);
var semigroupArray = new Semigroup($foreign.concatArray);
var append = function (dict) {
    return dict.append;
};
var semigroupFn = function (dictSemigroup) {
    return new Semigroup(function (f) {
        return function (g) {
            return function (x) {
                return append(dictSemigroup)(f(x))(g(x));
            };
        };
    });
};
module.exports = {
    Semigroup: Semigroup, 
    append: append, 
    semigroupString: semigroupString, 
    semigroupUnit: semigroupUnit, 
    semigroupVoid: semigroupVoid, 
    semigroupFn: semigroupFn, 
    semigroupArray: semigroupArray
};

},{"../Data.Unit":183,"../Data.Void":184,"./foreign":160}],162:[function(require,module,exports){
"use strict";

exports.intAdd = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x + y | 0;
  };
};

exports.intMul = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x * y | 0;
  };
};

exports.numAdd = function (n1) {
  return function (n2) {
    return n1 + n2;
  };
};

exports.numMul = function (n1) {
  return function (n2) {
    return n1 * n2;
  };
};

},{}],163:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var Semiring = function (add, mul, one, zero) {
    this.add = add;
    this.mul = mul;
    this.one = one;
    this.zero = zero;
};
var zero = function (dict) {
    return dict.zero;
};
var semiringUnit = new Semiring(function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, Data_Unit.unit, Data_Unit.unit);
var semiringNumber = new Semiring($foreign.numAdd, $foreign.numMul, 1.0, 0.0);
var semiringInt = new Semiring($foreign.intAdd, $foreign.intMul, 1, 0);
var one = function (dict) {
    return dict.one;
};
var mul = function (dict) {
    return dict.mul;
};
var add = function (dict) {
    return dict.add;
};
var semiringFn = function (dictSemiring) {
    return new Semiring(function (f) {
        return function (g) {
            return function (x) {
                return add(dictSemiring)(f(x))(g(x));
            };
        };
    }, function (f) {
        return function (g) {
            return function (x) {
                return mul(dictSemiring)(f(x))(g(x));
            };
        };
    }, function (v) {
        return one(dictSemiring);
    }, function (v) {
        return zero(dictSemiring);
    });
};
module.exports = {
    Semiring: Semiring, 
    add: add, 
    mul: mul, 
    one: one, 
    zero: zero, 
    semiringInt: semiringInt, 
    semiringNumber: semiringNumber, 
    semiringFn: semiringFn, 
    semiringUnit: semiringUnit
};

},{"../Data.Unit":183,"./foreign":162}],164:[function(require,module,exports){
"use strict";

exports.showIntImpl = function (n) {
  return n.toString();
};

exports.showNumberImpl = function (n) {
  var str = n.toString();
  return isNaN(str + ".0") ? str : str + ".0";
};

exports.showCharImpl = function (c) {
  var code = c.charCodeAt(0);
  if (code < 0x20 || code === 0x7F) {
    switch (c) {
      case "\x07": return "'\\a'";
      case "\b": return "'\\b'";
      case "\f": return "'\\f'";
      case "\n": return "'\\n'";
      case "\r": return "'\\r'";
      case "\t": return "'\\t'";
      case "\v": return "'\\v'";
    }
    return "'\\" + code.toString(10) + "'";
  }
  return c === "'" || c === "\\" ? "'\\" + c + "'" : "'" + c + "'";
};

exports.showStringImpl = function (s) {
  var l = s.length;
  return "\"" + s.replace(
    /[\0-\x1F\x7F"\\]/g,
    function (c, i) { // jshint ignore:line
      switch (c) {
        case "\"":
        case "\\":
          return "\\" + c;
        case "\x07": return "\\a";
        case "\b": return "\\b";
        case "\f": return "\\f";
        case "\n": return "\\n";
        case "\r": return "\\r";
        case "\t": return "\\t";
        case "\v": return "\\v";
      }
      var k = i + 1;
      var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
      return "\\" + c.charCodeAt(0).toString(10) + empty;
    }
  ) + "\"";
};

exports.showArrayImpl = function (f) {
  return function (xs) {
    var ss = [];
    for (var i = 0, l = xs.length; i < l; i++) {
      ss[i] = f(xs[i]);
    }
    return "[" + ss.join(",") + "]";
  };
};

},{}],165:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Show = function (show) {
    this.show = show;
};
var showString = new Show($foreign.showStringImpl);
var showNumber = new Show($foreign.showNumberImpl);
var showInt = new Show($foreign.showIntImpl);
var showChar = new Show($foreign.showCharImpl);
var showBoolean = new Show(function (v) {
    if (v) {
        return "true";
    };
    if (!v) {
        return "false";
    };
    throw new Error("Failed pattern match at Data.Show line 13, column 3 - line 14, column 3: " + [ v.constructor.name ]);
});
var show = function (dict) {
    return dict.show;
};
var showArray = function (dictShow) {
    return new Show($foreign.showArrayImpl(show(dictShow)));
};
module.exports = {
    Show: Show, 
    show: show, 
    showBoolean: showBoolean, 
    showInt: showInt, 
    showNumber: showNumber, 
    showChar: showChar, 
    showString: showString, 
    showArray: showArray
};

},{"./foreign":164}],166:[function(require,module,exports){
/* global exports */
"use strict";

// module Data.StrMap.ST

exports["new"] = function () {
  return {};
};

exports.peekImpl = function (just) {
  return function (nothing) {
    return function (m) {
      return function (k) {
        return function () {
          return {}.hasOwnProperty.call(m, k) ? just(m[k]) : nothing;
        };
      };
    };
  };
};

exports.poke = function (m) {
  return function (k) {
    return function (v) {
      return function () {
        m[k] = v;
        return m;
      };
    };
  };
};

exports["delete"] = function (m) {
  return function (k) {
    return function () {
      delete m[k];
      return m;
    };
  };
};

},{}],167:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Maybe = require("../Data.Maybe");
var peek = $foreign.peekImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
module.exports = {
    peek: peek, 
    "delete": $foreign["delete"], 
    "new": $foreign["new"], 
    poke: $foreign.poke
};

},{"../Control.Monad.Eff":66,"../Control.Monad.ST":75,"../Data.Maybe":140,"./foreign":166}],168:[function(require,module,exports){
/* global exports */
"use strict";

// module Data.StrMap

exports._copyEff = function (m) {
  return function () {
    var r = {};
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r[k] = m[k];
      }
    }
    return r;
  };
};

exports.empty = {};

exports.runST = function (f) {
  return f;
};

// jshint maxparams: 2
exports._fmapStrMap = function (m0, f) {
  var m = {};
  for (var k in m0) {
    if (hasOwnProperty.call(m0, k)) {
      m[k] = f(m0[k]);
    }
  }
  return m;
};

// jshint maxparams: 2
exports._mapWithKey = function (m0, f) {
  var m = {};
  for (var k in m0) {
    if (hasOwnProperty.call(m0, k)) {
      m[k] = f(k)(m0[k]);
    }
  }
  return m;
};

// jshint maxparams: 1
exports._foldM = function (bind) {
  return function (f) {
    return function (mz) {
      return function (m) {
        var acc = mz;
        function g(k) {
          return function (z) {
            return f(z)(k)(m[k]);
          };
        }
        for (var k in m) {
          if (hasOwnProperty.call(m, k)) {
            acc = bind(acc)(g(k));
          }
        }
        return acc;
      };
    };
  };
};

// jshint maxparams: 4
exports._foldSCStrMap = function (m, z, f, fromMaybe) {
  for (var k in m) {
    if (hasOwnProperty.call(m, k)) {
      var maybeR = f(z)(k)(m[k]);
      var r = fromMaybe(null)(maybeR);
      if (r === null) return z;
      else z = r;
    }
  }
  return z;
};

// jshint maxparams: 1
exports.all = function (f) {
  return function (m) {
    for (var k in m) {
      if (hasOwnProperty.call(m, k) && !f(k)(m[k])) return false;
    }
    return true;
  };
};

exports.size = function (m) {
  var s = 0;
  for (var k in m) {
    if (hasOwnProperty.call(m, k)) {
      ++s;
    }
  }
  return s;
};

// jshint maxparams: 4
exports._lookup = function (no, yes, k, m) {
  return k in m ? yes(m[k]) : no;
};

// jshint maxparams: 2
exports._unsafeDeleteStrMap = function (m, k) {
  delete m[k];
  return m;
};

// jshint maxparams: 4
exports._lookupST = function (no, yes, k, m) {
  return function () {
    return k in m ? yes(m[k]) : no;
  };
};

function _collect(f) {
  return function (m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}

exports._collect = _collect;

exports.keys = Object.keys || _collect(function (k) {
  return function () { return k; };
});

},{}],169:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Foldable = require("../Data.Foldable");
var Data_Function_Uncurried = require("../Data.Function.Uncurried");
var Data_List = require("../Data.List");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_StrMap_ST = require("../Data.StrMap.ST");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Data_Unfoldable = require("../Data.Unfoldable");
var Data_Functor = require("../Data.Functor");
var Data_Function = require("../Data.Function");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Category = require("../Control.Category");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_List_Types = require("../Data.List.Types");
var Control_Bind = require("../Control.Bind");
var values = function ($43) {
    return Data_List.fromFoldable(Data_Foldable.foldableArray)($foreign._collect(function (v) {
        return function (v1) {
            return v1;
        };
    })($43));
};
var toList = function ($44) {
    return Data_List.fromFoldable(Data_Foldable.foldableArray)($foreign._collect(Data_Tuple.Tuple.create)($44));
};
var toUnfoldable = function (dictUnfoldable) {
    return function ($45) {
        return Data_List.toUnfoldable(dictUnfoldable)(toList($45));
    };
};
var thawST = $foreign._copyEff;
var showStrMap = function (dictShow) {
    return new Data_Show.Show(function (m) {
        return "fromList " + Data_Show.show(Data_List_Types.showList(Data_Tuple.showTuple(Data_Show.showString)(dictShow)))(toList(m));
    });
};
var pureST = function (f) {
    return Control_Monad_Eff.runPure($foreign.runST(f));
};
var singleton = function (k) {
    return function (v) {
        return pureST(function __do() {
            var v1 = Data_StrMap_ST["new"]();
            var v2 = Data_StrMap_ST.poke(v1)(k)(v)();
            return v1;
        });
    };
};
var mutate = function (f) {
    return function (m) {
        return pureST(function __do() {
            var v = thawST(m)();
            var v1 = f(v)();
            return v;
        });
    };
};
var member = Data_Function_Uncurried.runFn4($foreign._lookup)(false)(Data_Function["const"](true));
var mapWithKey = function (f) {
    return function (m) {
        return $foreign._mapWithKey(m, f);
    };
};
var lookup = Data_Function_Uncurried.runFn4($foreign._lookup)(Data_Maybe.Nothing.value)(Data_Maybe.Just.create);
var isSubmap = function (dictEq) {
    return function (m1) {
        return function (m2) {
            var f = function (k) {
                return function (v) {
                    return $foreign._lookup(false, Data_Eq.eq(dictEq)(v), k, m2);
                };
            };
            return $foreign.all(f)(m1);
        };
    };
};
var isEmpty = $foreign.all(function (v) {
    return function (v1) {
        return false;
    };
});
var insert = function (k) {
    return function (v) {
        return mutate(function (s) {
            return Data_Functor["void"](Control_Monad_Eff.functorEff)(Data_StrMap_ST.poke(s)(k)(v));
        });
    };
};
var functorStrMap = new Data_Functor.Functor(function (f) {
    return function (m) {
        return $foreign._fmapStrMap(m, f);
    };
});
var fromFoldableWith = function (dictFoldable) {
    return function (f) {
        return function (l) {
            return pureST(function __do() {
                var v = Data_StrMap_ST["new"]();
                Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(dictFoldable)(l)(function (v1) {
                    return Control_Bind.bind(Control_Monad_Eff.bindEff)($foreign._lookupST(v1.value1, f(v1.value1), v1.value0, v))(Data_StrMap_ST.poke(v)(v1.value0));
                })();
                return v;
            });
        };
    };
};
var fromFoldable = function (dictFoldable) {
    return function (l) {
        return pureST(function __do() {
            var v = Data_StrMap_ST["new"]();
            Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(dictFoldable)(l)(function (v1) {
                return Data_StrMap_ST.poke(v)(v1.value0)(v1.value1);
            })();
            return v;
        });
    };
};
var freezeST = $foreign._copyEff;
var foldMaybe = function (f) {
    return function (z) {
        return function (m) {
            return $foreign._foldSCStrMap(m, z, f, Data_Maybe.fromMaybe);
        };
    };
};
var foldM = function (dictMonad) {
    return function (f) {
        return function (z) {
            return $foreign._foldM(Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]()))(f)(Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(z));
        };
    };
};
var semigroupStrMap = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (m1) {
        return function (m2) {
            return mutate(function (s1) {
                return Data_Functor["void"](Control_Monad_Eff.functorEff)(foldM(Control_Monad_Eff.monadEff)(function (s2) {
                    return function (k) {
                        return function (v2) {
                            return Data_StrMap_ST.poke(s2)(k)($foreign._lookup(v2, function (v1) {
                                return Data_Semigroup.append(dictSemigroup)(v1)(v2);
                            }, k, m2));
                        };
                    };
                })(s1)(m1));
            })(m2);
        };
    });
};
var monoidStrMap = function (dictSemigroup) {
    return new Data_Monoid.Monoid(function () {
        return semigroupStrMap(dictSemigroup);
    }, $foreign.empty);
};
var union = function (m) {
    return mutate(function (s) {
        return Data_Functor["void"](Control_Monad_Eff.functorEff)(foldM(Control_Monad_Eff.monadEff)(Data_StrMap_ST.poke)(s)(m));
    });
};
var unions = Data_Foldable.foldl(Data_List_Types.foldableList)(union)($foreign.empty);
var fold = $foreign._foldM(Data_Function.applyFlipped);
var foldMap = function (dictMonoid) {
    return function (f) {
        return fold(function (acc) {
            return function (k) {
                return function (v) {
                    return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(acc)(f(k)(v));
                };
            };
        })(Data_Monoid.mempty(dictMonoid));
    };
};
var foldableStrMap = new Data_Foldable.Foldable(function (dictMonoid) {
    return function (f) {
        return foldMap(dictMonoid)(Data_Function["const"](f));
    };
}, function (f) {
    return fold(function (z) {
        return function (v) {
            return f(z);
        };
    });
}, function (f) {
    return function (z) {
        return function (m) {
            return Data_Foldable.foldr(Data_List_Types.foldableList)(f)(z)(values(m));
        };
    };
});
var traversableStrMap = new Data_Traversable.Traversable(function () {
    return foldableStrMap;
}, function () {
    return functorStrMap;
}, function (dictApplicative) {
    return Data_Traversable.traverse(traversableStrMap)(dictApplicative)(Control_Category.id(Control_Category.categoryFn));
}, function (dictApplicative) {
    return function (f) {
        return function (ms) {
            return Data_Foldable.foldr(Data_List_Types.foldableList)(function (x) {
                return function (acc) {
                    return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(union)(x))(acc);
                };
            })(Control_Applicative.pure(dictApplicative)($foreign.empty))(Data_Functor.map(Data_List_Types.functorList)(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Tuple.uncurry(singleton)))(Data_Functor.map(Data_List_Types.functorList)(Data_Traversable.traverse(Data_Tuple.traversableTuple)(dictApplicative)(f))(toList(ms))));
        };
    };
});
var eqStrMap = function (dictEq) {
    return new Data_Eq.Eq(function (m1) {
        return function (m2) {
            return isSubmap(dictEq)(m1)(m2) && isSubmap(dictEq)(m2)(m1);
        };
    });
};
var $$delete = function (k) {
    return mutate(function (s) {
        return Data_Functor["void"](Control_Monad_Eff.functorEff)(Data_StrMap_ST["delete"](s)(k));
    });
};
var pop = function (k) {
    return function (m) {
        return Data_Functor.mapFlipped(Data_Maybe.functorMaybe)(lookup(k)(m))(function (a) {
            return new Data_Tuple.Tuple(a, $$delete(k)(m));
        });
    };
};
var alter = function (f) {
    return function (k) {
        return function (m) {
            var $41 = f(lookup(k)(m));
            if ($41 instanceof Data_Maybe.Nothing) {
                return $$delete(k)(m);
            };
            if ($41 instanceof Data_Maybe.Just) {
                return insert(k)($41.value0)(m);
            };
            throw new Error("Failed pattern match at Data.StrMap line 184, column 15 - line 186, column 25: " + [ $41.constructor.name ]);
        };
    };
};
var update = function (f) {
    return function (k) {
        return function (m) {
            return alter(Data_Maybe.maybe(Data_Maybe.Nothing.value)(f))(k)(m);
        };
    };
};
module.exports = {
    alter: alter, 
    "delete": $$delete, 
    fold: fold, 
    foldM: foldM, 
    foldMap: foldMap, 
    foldMaybe: foldMaybe, 
    freezeST: freezeST, 
    fromFoldable: fromFoldable, 
    fromFoldableWith: fromFoldableWith, 
    insert: insert, 
    isEmpty: isEmpty, 
    isSubmap: isSubmap, 
    lookup: lookup, 
    mapWithKey: mapWithKey, 
    member: member, 
    pop: pop, 
    pureST: pureST, 
    singleton: singleton, 
    thawST: thawST, 
    toList: toList, 
    toUnfoldable: toUnfoldable, 
    union: union, 
    unions: unions, 
    update: update, 
    values: values, 
    functorStrMap: functorStrMap, 
    foldableStrMap: foldableStrMap, 
    traversableStrMap: traversableStrMap, 
    eqStrMap: eqStrMap, 
    showStrMap: showStrMap, 
    semigroupStrMap: semigroupStrMap, 
    monoidStrMap: monoidStrMap, 
    all: $foreign.all, 
    empty: $foreign.empty, 
    keys: $foreign.keys, 
    runST: $foreign.runST, 
    size: $foreign.size
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Monad.Eff":66,"../Control.Monad.ST":75,"../Control.Semigroupoid":88,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Function.Uncurried":120,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.List":137,"../Data.List.Types":136,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.Semigroup":161,"../Data.Show":165,"../Data.StrMap.ST":167,"../Data.Traversable":178,"../Data.Tuple":179,"../Data.Unfoldable":181,"../Prelude":196,"./foreign":168}],170:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_MonadPlus = require("../Control.MonadPlus");
var Data_Monoid = require("../Data.Monoid");
var Data_String = require("../Data.String");
var Data_Semigroup = require("../Data.Semigroup");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Eq = require("../Data.Eq");
var Data_Show = require("../Data.Show");
var Data_Functor = require("../Data.Functor");
var Control_MonadZero = require("../Control.MonadZero");
var RegexFlags = (function () {
    function RegexFlags(value0) {
        this.value0 = value0;
    };
    RegexFlags.create = function (value0) {
        return new RegexFlags(value0);
    };
    return RegexFlags;
})();
var unicode = new RegexFlags({
    global: false, 
    ignoreCase: false, 
    multiline: false, 
    sticky: false, 
    unicode: true
});
var sticky = new RegexFlags({
    global: false, 
    ignoreCase: false, 
    multiline: false, 
    sticky: true, 
    unicode: false
});
var showRegexFlags = new Data_Show.Show(function (v) {
    var usedFlags = Data_Semigroup.append(Data_Semigroup.semigroupArray)([  ])(Data_Semigroup.append(Data_Semigroup.semigroupArray)(Data_Functor.voidLeft(Data_Functor.functorArray)(Control_MonadZero.guard(Control_MonadZero.monadZeroArray)(v.value0.global))("global"))(Data_Semigroup.append(Data_Semigroup.semigroupArray)(Data_Functor.voidLeft(Data_Functor.functorArray)(Control_MonadZero.guard(Control_MonadZero.monadZeroArray)(v.value0.ignoreCase))("ignoreCase"))(Data_Semigroup.append(Data_Semigroup.semigroupArray)(Data_Functor.voidLeft(Data_Functor.functorArray)(Control_MonadZero.guard(Control_MonadZero.monadZeroArray)(v.value0.multiline))("multiline"))(Data_Semigroup.append(Data_Semigroup.semigroupArray)(Data_Functor.voidLeft(Data_Functor.functorArray)(Control_MonadZero.guard(Control_MonadZero.monadZeroArray)(v.value0.sticky))("sticky"))(Data_Functor.voidLeft(Data_Functor.functorArray)(Control_MonadZero.guard(Control_MonadZero.monadZeroArray)(v.value0.unicode))("unicode"))))));
    var $6 = Data_Eq.eq(Data_Eq.eqArray(Data_Eq.eqString))(usedFlags)([  ]);
    if ($6) {
        return "noFlags";
    };
    if (!$6) {
        return "(" + (Data_String.joinWith(" <> ")(usedFlags) + ")");
    };
    throw new Error("Failed pattern match at Data.String.Regex.Flags line 112, column 7 - line 114, column 48: " + [ $6.constructor.name ]);
});
var semigroupRegexFlags = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        return new RegexFlags({
            global: v.value0.global || v1.value0.global, 
            ignoreCase: v.value0.ignoreCase || v1.value0.ignoreCase, 
            multiline: v.value0.multiline || v1.value0.multiline, 
            sticky: v.value0.sticky || v1.value0.sticky, 
            unicode: v.value0.unicode || v1.value0.unicode
        });
    };
});
var noFlags = new RegexFlags({
    global: false, 
    ignoreCase: false, 
    multiline: false, 
    sticky: false, 
    unicode: false
});
var multiline = new RegexFlags({
    global: false, 
    ignoreCase: false, 
    multiline: true, 
    sticky: false, 
    unicode: false
});
var monoidRegexFlags = new Data_Monoid.Monoid(function () {
    return semigroupRegexFlags;
}, noFlags);
var ignoreCase = new RegexFlags({
    global: false, 
    ignoreCase: true, 
    multiline: false, 
    sticky: false, 
    unicode: false
});
var global = new RegexFlags({
    global: true, 
    ignoreCase: false, 
    multiline: false, 
    sticky: false, 
    unicode: false
});
var eqRegexFlags = new Data_Eq.Eq(function (v) {
    return function (v1) {
        return v.value0.global === v1.value0.global && (v.value0.ignoreCase === v1.value0.ignoreCase && (v.value0.multiline === v1.value0.multiline && (v.value0.sticky === v1.value0.sticky && v.value0.unicode === v1.value0.unicode)));
    };
});
module.exports = {
    RegexFlags: RegexFlags, 
    global: global, 
    ignoreCase: ignoreCase, 
    multiline: multiline, 
    noFlags: noFlags, 
    sticky: sticky, 
    unicode: unicode, 
    semigroupRegexFlags: semigroupRegexFlags, 
    monoidRegexFlags: monoidRegexFlags, 
    eqRegexFlags: eqRegexFlags, 
    showRegexFlags: showRegexFlags
};

},{"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Data.Eq":113,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Monoid":147,"../Data.Semigroup":161,"../Data.Show":165,"../Data.String":176,"../Prelude":196}],171:[function(require,module,exports){
"use strict";

exports["showRegex'"] = function (r) {
  return "" + r;
};

exports["regex'"] = function (left) {
  return function (right) {
    return function (s1) {
      return function (s2) {
        try {
          return right(new RegExp(s1, s2));
        } catch (e) {
          return left(e.message);
        }
      };
    };
  };
};

exports.source = function (r) {
  return r.source;
};

exports["flags'"] = function (r) {
  return {
    multiline: r.multiline,
    ignoreCase: r.ignoreCase,
    global: r.global,
    sticky: !!r.sticky,
    unicode: !!r.unicode
  };
};

exports.test = function (r) {
  return function (s) {
    var lastIndex = r.lastIndex;
    var result = r.test(s);
    r.lastIndex = lastIndex;
    return result;
  };
};

exports._match = function (just) {
  return function (nothing) {
    return function (r) {
      return function (s) {
        var m = s.match(r);
        if (m == null) {
          return nothing;
        } else {
          var list = [];
          for (var i = 0; i < m.length; i++) {
            list.push(m[i] == null ? nothing : just(m[i]));
          }
          return just(list);
        }
      };
    };
  };
};

exports.replace = function (r) {
  return function (s1) {
    return function (s2) {
      return s2.replace(r, s1);
    };
  };
};

exports["replace'"] = function (r) {
  return function (f) {
    return function (s2) {
      return s2.replace(r, function (match) {
        return f(match)(Array.prototype.splice.call(arguments, 1, arguments.length - 3));
      });
    };
  };
};

exports._search = function (just) {
  return function (nothing) {
    return function (r) {
      return function (s) {
        var result = s.search(r);
        return result === -1 ? nothing : just(result);
      };
    };
  };
};

exports.split = function (r) {
  return function (s) {
    return s.split(r);
  };
};

},{}],172:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Data_Either = require("../Data.Either");
var Data_Maybe = require("../Data.Maybe");
var Data_String = require("../Data.String");
var Data_String_Regex_Flags = require("../Data.String.Regex.Flags");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Function = require("../Data.Function");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var showRegex = new Data_Show.Show($foreign["showRegex'"]);
var search = $foreign._search(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var renderFlags = function (v) {
    return (function () {
        if (v.value0.global) {
            return "g";
        };
        if (!v.value0.global) {
            return "";
        };
        throw new Error("Failed pattern match at Data.String.Regex line 59, column 4 - line 59, column 32: " + [ v.value0.global.constructor.name ]);
    })() + ((function () {
        if (v.value0.ignoreCase) {
            return "i";
        };
        if (!v.value0.ignoreCase) {
            return "";
        };
        throw new Error("Failed pattern match at Data.String.Regex line 60, column 4 - line 60, column 36: " + [ v.value0.ignoreCase.constructor.name ]);
    })() + ((function () {
        if (v.value0.multiline) {
            return "m";
        };
        if (!v.value0.multiline) {
            return "";
        };
        throw new Error("Failed pattern match at Data.String.Regex line 61, column 4 - line 61, column 35: " + [ v.value0.multiline.constructor.name ]);
    })() + ((function () {
        if (v.value0.sticky) {
            return "y";
        };
        if (!v.value0.sticky) {
            return "";
        };
        throw new Error("Failed pattern match at Data.String.Regex line 62, column 4 - line 62, column 32: " + [ v.value0.sticky.constructor.name ]);
    })() + (function () {
        if (v.value0.unicode) {
            return "u";
        };
        if (!v.value0.unicode) {
            return "";
        };
        throw new Error("Failed pattern match at Data.String.Regex line 63, column 4 - line 63, column 33: " + [ v.value0.unicode.constructor.name ]);
    })())));
};
var regex = function (s) {
    return function (f) {
        return $foreign["regex'"](Data_Either.Left.create)(Data_Either.Right.create)(s)(renderFlags(f));
    };
};
var parseFlags = function (s) {
    return new Data_String_Regex_Flags.RegexFlags({
        global: Data_String.contains("g")(s), 
        ignoreCase: Data_String.contains("i")(s), 
        multiline: Data_String.contains("m")(s), 
        sticky: Data_String.contains("y")(s), 
        unicode: Data_String.contains("u")(s)
    });
};
var match = $foreign._match(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var flags = function ($8) {
    return Data_String_Regex_Flags.RegexFlags.create($foreign["flags'"]($8));
};
module.exports = {
    flags: flags, 
    match: match, 
    parseFlags: parseFlags, 
    regex: regex, 
    renderFlags: renderFlags, 
    search: search, 
    showRegex: showRegex, 
    replace: $foreign.replace, 
    "replace'": $foreign["replace'"], 
    source: $foreign.source, 
    split: $foreign.split, 
    test: $foreign.test
};

},{"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Function":121,"../Data.Maybe":140,"../Data.Semigroup":161,"../Data.Show":165,"../Data.String":176,"../Data.String.Regex.Flags":170,"../Prelude":196,"./foreign":171}],173:[function(require,module,exports){
"use strict";

exports.charCodeAt = function (i) {
  return function (s) {
    if (i >= 0 && i < s.length) return s.charCodeAt(i);
    throw new Error("Data.String.Unsafe.charCodeAt: Invalid index.");
  };
};

exports.charAt = function (i) {
  return function (s) {
    if (i >= 0 && i < s.length) return s.charAt(i);
    throw new Error("Data.String.Unsafe.charAt: Invalid index.");
  };
};

exports.char = function (s) {
  if (s.length === 1) return s.charAt(0);
  throw new Error("Data.String.Unsafe.char: Expected string of length 1.");
};

},{}],174:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
module.exports = {
    "char": $foreign["char"], 
    charAt: $foreign.charAt, 
    charCodeAt: $foreign.charCodeAt
};

},{"./foreign":173}],175:[function(require,module,exports){
"use strict";

exports._charAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (s) {
        return i >= 0 && i < s.length ? just(s.charAt(i)) : nothing;
      };
    };
  };
};

exports.singleton = function (c) {
  return c;
};

exports._charCodeAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (s) {
        return i >= 0 && i < s.length ? just(s.charCodeAt(i)) : nothing;
      };
    };
  };
};

exports._toChar = function (just) {
  return function (nothing) {
    return function (s) {
      return s.length === 1 ? just(s) : nothing;
    };
  };
};

exports.fromCharArray = function (a) {
  return a.join("");
};

exports._indexOf = function (just) {
  return function (nothing) {
    return function (x) {
      return function (s) {
        var i = s.indexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};

exports["_indexOf'"] = function (just) {
  return function (nothing) {
    return function (x) {
      return function (startAt) {
        return function (s) {
          if (startAt < 0 || startAt > s.length) return nothing;
          var i = s.indexOf(x, startAt);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };
};

exports._lastIndexOf = function (just) {
  return function (nothing) {
    return function (x) {
      return function (s) {
        var i = s.lastIndexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};

exports["_lastIndexOf'"] = function (just) {
  return function (nothing) {
    return function (x) {
      return function (startAt) {
        return function (s) {
          if (startAt < 0 || startAt > s.length) return nothing;
          var i = s.lastIndexOf(x, startAt);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };
};

exports.length = function (s) {
  return s.length;
};

exports._localeCompare = function (lt) {
  return function (eq) {
    return function (gt) {
      return function (s1) {
        return function (s2) {
          var result = s1.localeCompare(s2);
          return result < 0 ? lt : result > 0 ? gt : eq;
        };
      };
    };
  };
};

exports.replace = function (s1) {
  return function (s2) {
    return function (s3) {
      return s3.replace(s1, s2);
    };
  };
};

exports.replaceAll = function (s1) {
  return function (s2) {
    return function (s3) {
      return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2);
    };
  };
};

exports.take = function (n) {
  return function (s) {
    return s.substr(0, n);
  };
};

exports.drop = function (n) {
  return function (s) {
    return s.substring(n);
  };
};

exports.count = function (p) {
  return function (s) {
    for (var i = 0; i < s.length && p(s.charAt(i)); i++); {}
    return i;
  };
};

exports.split = function (sep) {
  return function (s) {
    return s.split(sep);
  };
};

exports._splitAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (s) {
        return i >= 0 && i < s.length ?
               just([s.substring(0, i), s.substring(i)]) : nothing;
      };
    };
  };
};

exports.toCharArray = function (s) {
  return s.split("");
};

exports.toLower = function (s) {
  return s.toLowerCase();
};

exports.toUpper = function (s) {
  return s.toUpperCase();
};

exports.trim = function (s) {
  return s.trim();
};

exports.joinWith = function (s) {
  return function (xs) {
    return xs.join(s);
  };
};

},{}],176:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Data_Maybe = require("../Data.Maybe");
var Data_Newtype = require("../Data.Newtype");
var Data_String_Unsafe = require("../Data.String.Unsafe");
var Data_Eq = require("../Data.Eq");
var Data_Ord = require("../Data.Ord");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Ordering = require("../Data.Ordering");
var Data_Ring = require("../Data.Ring");
var Data_Function = require("../Data.Function");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Replacement = function (x) {
    return x;
};
var Pattern = function (x) {
    return x;
};
var uncons = function (v) {
    if (v === "") {
        return Data_Maybe.Nothing.value;
    };
    return new Data_Maybe.Just({
        head: Data_String_Unsafe.charAt(0)(v), 
        tail: $foreign.drop(1)(v)
    });
};
var toChar = $foreign._toChar(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var takeWhile = function (p) {
    return function (s) {
        return $foreign.take($foreign.count(p)(s))(s);
    };
};
var splitAt = $foreign._splitAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var showReplacement = new Data_Show.Show(function (v) {
    return "(Replacement " + (v + ")");
});
var showPattern = new Data_Show.Show(function (v) {
    return "(Pattern " + (v + ")");
});
var $$null = function (s) {
    return s === "";
};
var newtypeReplacement = new Data_Newtype.Newtype(function (n) {
    return n;
}, Replacement);
var newtypePattern = new Data_Newtype.Newtype(function (n) {
    return n;
}, Pattern);
var localeCompare = $foreign._localeCompare(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value);
var lastIndexOf$prime = $foreign["_lastIndexOf'"](Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var lastIndexOf = $foreign._lastIndexOf(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var stripSuffix = function (v) {
    return function (str) {
        var $32 = lastIndexOf(v)(str);
        if ($32 instanceof Data_Maybe.Just && $32.value0 === ($foreign.length(str) - $foreign.length(v) | 0)) {
            return Data_Maybe.Just.create($foreign.take($32.value0)(str));
        };
        return Data_Maybe.Nothing.value;
    };
};
var indexOf$prime = $foreign["_indexOf'"](Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var indexOf = $foreign._indexOf(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var stripPrefix = function (v) {
    return function (str) {
        var $36 = indexOf(v)(str);
        if ($36 instanceof Data_Maybe.Just && $36.value0 === 0) {
            return Data_Maybe.Just.create($foreign.drop($foreign.length(v))(str));
        };
        return Data_Maybe.Nothing.value;
    };
};
var eqReplacement = new Data_Eq.Eq(function (x) {
    return function (y) {
        return x === y;
    };
});
var ordReplacement = new Data_Ord.Ord(function () {
    return eqReplacement;
}, function (x) {
    return function (y) {
        return Data_Ord.compare(Data_Ord.ordString)(x)(y);
    };
});
var eqPattern = new Data_Eq.Eq(function (x) {
    return function (y) {
        return x === y;
    };
});
var ordPattern = new Data_Ord.Ord(function () {
    return eqPattern;
}, function (x) {
    return function (y) {
        return Data_Ord.compare(Data_Ord.ordString)(x)(y);
    };
});
var dropWhile = function (p) {
    return function (s) {
        return $foreign.drop($foreign.count(p)(s))(s);
    };
};
var contains = function (pat) {
    return function ($46) {
        return Data_Maybe.isJust(indexOf(pat)($46));
    };
};
var charCodeAt = $foreign._charCodeAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var charAt = $foreign._charAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
module.exports = {
    Pattern: Pattern, 
    Replacement: Replacement, 
    charAt: charAt, 
    charCodeAt: charCodeAt, 
    contains: contains, 
    dropWhile: dropWhile, 
    indexOf: indexOf, 
    "indexOf'": indexOf$prime, 
    lastIndexOf: lastIndexOf, 
    "lastIndexOf'": lastIndexOf$prime, 
    localeCompare: localeCompare, 
    "null": $$null, 
    splitAt: splitAt, 
    stripPrefix: stripPrefix, 
    stripSuffix: stripSuffix, 
    takeWhile: takeWhile, 
    toChar: toChar, 
    uncons: uncons, 
    eqPattern: eqPattern, 
    ordPattern: ordPattern, 
    newtypePattern: newtypePattern, 
    showPattern: showPattern, 
    eqReplacement: eqReplacement, 
    ordReplacement: ordReplacement, 
    newtypeReplacement: newtypeReplacement, 
    showReplacement: showReplacement, 
    count: $foreign.count, 
    drop: $foreign.drop, 
    fromCharArray: $foreign.fromCharArray, 
    joinWith: $foreign.joinWith, 
    length: $foreign.length, 
    replace: $foreign.replace, 
    replaceAll: $foreign.replaceAll, 
    singleton: $foreign.singleton, 
    split: $foreign.split, 
    take: $foreign.take, 
    toCharArray: $foreign.toCharArray, 
    toLower: $foreign.toLower, 
    toUpper: $foreign.toUpper, 
    trim: $foreign.trim
};

},{"../Control.Semigroupoid":88,"../Data.Eq":113,"../Data.Function":121,"../Data.Maybe":140,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.String.Unsafe":174,"../Prelude":196,"./foreign":175}],177:[function(require,module,exports){
"use strict";

// jshint maxparams: 3

exports.traverseArrayImpl = function () {
  function Cont(fn) {
    this.fn = fn;
  }

  var emptyList = {};

  var ConsCell = function (head, tail) {
    this.head = head;
    this.tail = tail;
  };

  function consList(x) {
    return function (xs) {
      return new ConsCell(x, xs);
    };
  }

  function listToArray(list) {
    var arr = [];
    while (list !== emptyList) {
      arr.push(list.head);
      list = list.tail;
    }
    return arr;
  }

  return function (apply) {
    return function (map) {
      return function (pure) {
        return function (f) {
          var buildFrom = function (x, ys) {
            return apply(map(consList)(f(x)))(ys);
          };

          var go = function (acc, currentLen, xs) {
            if (currentLen === 0) {
              return acc;
            } else {
              var last = xs[currentLen - 1];
              return new Cont(function () {
                return go(buildFrom(last, acc), currentLen - 1, xs);
              });
            }
          };

          return function (array) {
            var result = go(pure(emptyList), array.length, array);
            while (result instanceof Cont) {
              result = result.fn();
            }

            return map(listToArray)(result);
          };
        };
      };
    };
  };
}();

},{}],178:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Data_Foldable = require("../Data.Foldable");
var Data_Maybe = require("../Data.Maybe");
var Data_Maybe_First = require("../Data.Maybe.First");
var Data_Maybe_Last = require("../Data.Maybe.Last");
var Data_Monoid_Additive = require("../Data.Monoid.Additive");
var Data_Monoid_Conj = require("../Data.Monoid.Conj");
var Data_Monoid_Disj = require("../Data.Monoid.Disj");
var Data_Monoid_Dual = require("../Data.Monoid.Dual");
var Data_Monoid_Multiplicative = require("../Data.Monoid.Multiplicative");
var Control_Apply = require("../Control.Apply");
var Data_Functor = require("../Data.Functor");
var Control_Applicative = require("../Control.Applicative");
var Control_Category = require("../Control.Category");
var StateL = function (x) {
    return x;
};
var StateR = function (x) {
    return x;
};
var Traversable = function (__superclass_Data$dotFoldable$dotFoldable_1, __superclass_Data$dotFunctor$dotFunctor_0, sequence, traverse) {
    this["__superclass_Data.Foldable.Foldable_1"] = __superclass_Data$dotFoldable$dotFoldable_1;
    this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
    this.sequence = sequence;
    this.traverse = traverse;
};
var traverse = function (dict) {
    return dict.traverse;
};
var traversableMultiplicative = new Traversable(function () {
    return Data_Foldable.foldableMultiplicative;
}, function () {
    return Data_Monoid_Multiplicative.functorMultiplicative;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Multiplicative.Multiplicative)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Multiplicative.Multiplicative)(f(v));
        };
    };
});
var traversableMaybe = new Traversable(function () {
    return Data_Foldable.foldableMaybe;
}, function () {
    return Data_Maybe.functorMaybe;
}, function (dictApplicative) {
    return function (v) {
        if (v instanceof Data_Maybe.Nothing) {
            return Control_Applicative.pure(dictApplicative)(Data_Maybe.Nothing.value);
        };
        if (v instanceof Data_Maybe.Just) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Maybe.Just.create)(v.value0);
        };
        throw new Error("Failed pattern match at Data.Traversable line 85, column 3 - line 85, column 35: " + [ v.constructor.name ]);
    };
}, function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (v1 instanceof Data_Maybe.Nothing) {
                return Control_Applicative.pure(dictApplicative)(Data_Maybe.Nothing.value);
            };
            if (v1 instanceof Data_Maybe.Just) {
                return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Maybe.Just.create)(v(v1.value0));
            };
            throw new Error("Failed pattern match at Data.Traversable line 83, column 3 - line 83, column 37: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
});
var traversableDual = new Traversable(function () {
    return Data_Foldable.foldableDual;
}, function () {
    return Data_Monoid_Dual.functorDual;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Dual.Dual)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Dual.Dual)(f(v));
        };
    };
});
var traversableDisj = new Traversable(function () {
    return Data_Foldable.foldableDisj;
}, function () {
    return Data_Monoid_Disj.functorDisj;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Disj.Disj)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Disj.Disj)(f(v));
        };
    };
});
var traversableConj = new Traversable(function () {
    return Data_Foldable.foldableConj;
}, function () {
    return Data_Monoid_Conj.functorConj;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Conj.Conj)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Conj.Conj)(f(v));
        };
    };
});
var traversableAdditive = new Traversable(function () {
    return Data_Foldable.foldableAdditive;
}, function () {
    return Data_Monoid_Additive.functorAdditive;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Additive.Additive)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Monoid_Additive.Additive)(f(v));
        };
    };
});
var stateR = function (v) {
    return v;
};
var stateL = function (v) {
    return v;
};
var sequenceDefault = function (dictTraversable) {
    return function (dictApplicative) {
        return function (tma) {
            return traverse(dictTraversable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn))(tma);
        };
    };
};
var traversableArray = new Traversable(function () {
    return Data_Foldable.foldableArray;
}, function () {
    return Data_Functor.functorArray;
}, function (dictApplicative) {
    return sequenceDefault(traversableArray)(dictApplicative);
}, function (dictApplicative) {
    return $foreign.traverseArrayImpl(Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]()))(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]()))(Control_Applicative.pure(dictApplicative));
});
var sequence = function (dict) {
    return dict.sequence;
};
var traversableFirst = new Traversable(function () {
    return Data_Foldable.foldableFirst;
}, function () {
    return Data_Maybe_First.functorFirst;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Maybe_First.First)(sequence(traversableMaybe)(dictApplicative)(v));
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Maybe_First.First)(traverse(traversableMaybe)(dictApplicative)(f)(v));
        };
    };
});
var traversableLast = new Traversable(function () {
    return Data_Foldable.foldableLast;
}, function () {
    return Data_Maybe_Last.functorLast;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Maybe_Last.Last)(sequence(traversableMaybe)(dictApplicative)(v));
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Maybe_Last.Last)(traverse(traversableMaybe)(dictApplicative)(f)(v));
        };
    };
});
var traverseDefault = function (dictTraversable) {
    return function (dictApplicative) {
        return function (f) {
            return function (ta) {
                return sequence(dictTraversable)(dictApplicative)(Data_Functor.map(dictTraversable["__superclass_Data.Functor.Functor_0"]())(f)(ta));
            };
        };
    };
};
var functorStateR = new Data_Functor.Functor(function (f) {
    return function (k) {
        return function (s) {
            var $75 = stateR(k)(s);
            return {
                accum: $75.accum, 
                value: f($75.value)
            };
        };
    };
});
var functorStateL = new Data_Functor.Functor(function (f) {
    return function (k) {
        return function (s) {
            var $78 = stateL(k)(s);
            return {
                accum: $78.accum, 
                value: f($78.value)
            };
        };
    };
});
var $$for = function (dictApplicative) {
    return function (dictTraversable) {
        return function (x) {
            return function (f) {
                return traverse(dictTraversable)(dictApplicative)(f)(x);
            };
        };
    };
};
var applyStateR = new Control_Apply.Apply(function () {
    return functorStateR;
}, function (f) {
    return function (x) {
        return function (s) {
            var $81 = stateR(x)(s);
            var $82 = stateR(f)($81.accum);
            return {
                accum: $82.accum, 
                value: $82.value($81.value)
            };
        };
    };
});
var applyStateL = new Control_Apply.Apply(function () {
    return functorStateL;
}, function (f) {
    return function (x) {
        return function (s) {
            var $87 = stateL(f)(s);
            var $88 = stateL(x)($87.accum);
            return {
                accum: $88.accum, 
                value: $87.value($88.value)
            };
        };
    };
});
var applicativeStateR = new Control_Applicative.Applicative(function () {
    return applyStateR;
}, function (a) {
    return function (s) {
        return {
            accum: s, 
            value: a
        };
    };
});
var mapAccumR = function (dictTraversable) {
    return function (f) {
        return function (s0) {
            return function (xs) {
                return stateR(traverse(dictTraversable)(applicativeStateR)(function (a) {
                    return function (s) {
                        return f(s)(a);
                    };
                })(xs))(s0);
            };
        };
    };
};
var scanr = function (dictTraversable) {
    return function (f) {
        return function (b0) {
            return function (xs) {
                return (mapAccumR(dictTraversable)(function (b) {
                    return function (a) {
                        var b$prime = f(a)(b);
                        return {
                            accum: b$prime, 
                            value: b$prime
                        };
                    };
                })(b0)(xs)).value;
            };
        };
    };
};
var applicativeStateL = new Control_Applicative.Applicative(function () {
    return applyStateL;
}, function (a) {
    return function (s) {
        return {
            accum: s, 
            value: a
        };
    };
});
var mapAccumL = function (dictTraversable) {
    return function (f) {
        return function (s0) {
            return function (xs) {
                return stateL(traverse(dictTraversable)(applicativeStateL)(function (a) {
                    return function (s) {
                        return f(s)(a);
                    };
                })(xs))(s0);
            };
        };
    };
};
var scanl = function (dictTraversable) {
    return function (f) {
        return function (b0) {
            return function (xs) {
                return (mapAccumL(dictTraversable)(function (b) {
                    return function (a) {
                        var b$prime = f(b)(a);
                        return {
                            accum: b$prime, 
                            value: b$prime
                        };
                    };
                })(b0)(xs)).value;
            };
        };
    };
};
module.exports = {
    Traversable: Traversable, 
    "for": $$for, 
    mapAccumL: mapAccumL, 
    mapAccumR: mapAccumR, 
    scanl: scanl, 
    scanr: scanr, 
    sequence: sequence, 
    sequenceDefault: sequenceDefault, 
    traverse: traverse, 
    traverseDefault: traverseDefault, 
    traversableArray: traversableArray, 
    traversableMaybe: traversableMaybe, 
    traversableFirst: traversableFirst, 
    traversableLast: traversableLast, 
    traversableAdditive: traversableAdditive, 
    traversableDual: traversableDual, 
    traversableConj: traversableConj, 
    traversableDisj: traversableDisj, 
    traversableMultiplicative: traversableMultiplicative
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Category":41,"../Data.Foldable":118,"../Data.Functor":127,"../Data.Maybe":140,"../Data.Maybe.First":138,"../Data.Maybe.Last":139,"../Data.Monoid.Additive":141,"../Data.Monoid.Conj":142,"../Data.Monoid.Disj":143,"../Data.Monoid.Dual":144,"../Data.Monoid.Multiplicative":146,"../Prelude":196,"./foreign":177}],179:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_Lazy = require("../Control.Lazy");
var Data_Bifoldable = require("../Data.Bifoldable");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Bitraversable = require("../Data.Bitraversable");
var Data_Eq = require("../Data.Eq");
var Data_Foldable = require("../Data.Foldable");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Maybe = require("../Data.Maybe");
var Data_Maybe_First = require("../Data.Maybe.First");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Traversable = require("../Data.Traversable");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Ordering = require("../Data.Ordering");
var Data_Bounded = require("../Data.Bounded");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Semiring = require("../Data.Semiring");
var Data_Ring = require("../Data.Ring");
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_BooleanAlgebra = require("../Data.BooleanAlgebra");
var Data_Functor = require("../Data.Functor");
var Control_Apply = require("../Control.Apply");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Function = require("../Data.Function");
var Data_Unit = require("../Data.Unit");
var Tuple = (function () {
    function Tuple(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Tuple.create = function (value0) {
        return function (value1) {
            return new Tuple(value0, value1);
        };
    };
    return Tuple;
})();
var uncurry = function (f) {
    return function (v) {
        return f(v.value0)(v.value1);
    };
};
var swap = function (v) {
    return new Tuple(v.value1, v.value0);
};
var snd = function (v) {
    return v.value1;
};
var showTuple = function (dictShow) {
    return function (dictShow1) {
        return new Data_Show.Show(function (v) {
            return "(Tuple " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(dictShow1)(v.value1) + ")")));
        });
    };
};
var semiringTuple = function (dictSemiring) {
    return function (dictSemiring1) {
        return new Data_Semiring.Semiring(function (v) {
            return function (v1) {
                return new Tuple(Data_Semiring.add(dictSemiring)(v.value0)(v1.value0), Data_Semiring.add(dictSemiring1)(v.value1)(v1.value1));
            };
        }, function (v) {
            return function (v1) {
                return new Tuple(Data_Semiring.mul(dictSemiring)(v.value0)(v1.value0), Data_Semiring.mul(dictSemiring1)(v.value1)(v1.value1));
            };
        }, new Tuple(Data_Semiring.one(dictSemiring), Data_Semiring.one(dictSemiring1)), new Tuple(Data_Semiring.zero(dictSemiring), Data_Semiring.zero(dictSemiring1)));
    };
};
var semigroupoidTuple = new Control_Semigroupoid.Semigroupoid(function (v) {
    return function (v1) {
        return new Tuple(v1.value0, v.value1);
    };
});
var semigroupTuple = function (dictSemigroup) {
    return function (dictSemigroup1) {
        return new Data_Semigroup.Semigroup(function (v) {
            return function (v1) {
                return new Tuple(Data_Semigroup.append(dictSemigroup)(v.value0)(v1.value0), Data_Semigroup.append(dictSemigroup1)(v.value1)(v1.value1));
            };
        });
    };
};
var ringTuple = function (dictRing) {
    return function (dictRing1) {
        return new Data_Ring.Ring(function () {
            return semiringTuple(dictRing["__superclass_Data.Semiring.Semiring_0"]())(dictRing1["__superclass_Data.Semiring.Semiring_0"]());
        }, function (v) {
            return function (v1) {
                return new Tuple(Data_Ring.sub(dictRing)(v.value0)(v1.value0), Data_Ring.sub(dictRing1)(v.value1)(v1.value1));
            };
        });
    };
};
var monoidTuple = function (dictMonoid) {
    return function (dictMonoid1) {
        return new Data_Monoid.Monoid(function () {
            return semigroupTuple(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(dictMonoid1["__superclass_Data.Semigroup.Semigroup_0"]());
        }, new Tuple(Data_Monoid.mempty(dictMonoid), Data_Monoid.mempty(dictMonoid1)));
    };
};
var lookup = function (dictFoldable) {
    return function (dictEq) {
        return function (a) {
            return function ($259) {
                return Data_Newtype.unwrap(Data_Maybe_First.newtypeFirst)(Data_Foldable.foldMap(dictFoldable)(Data_Maybe_First.monoidFirst)(function (v) {
                    var $139 = Data_Eq.eq(dictEq)(a)(v.value0);
                    if ($139) {
                        return new Data_Maybe.Just(v.value1);
                    };
                    if (!$139) {
                        return Data_Maybe.Nothing.value;
                    };
                    throw new Error("Failed pattern match at Data.Tuple line 176, column 55 - line 176, column 90: " + [ $139.constructor.name ]);
                })($259));
            };
        };
    };
};
var heytingAlgebraTuple = function (dictHeytingAlgebra) {
    return function (dictHeytingAlgebra1) {
        return new Data_HeytingAlgebra.HeytingAlgebra(function (v) {
            return function (v1) {
                return new Tuple(Data_HeytingAlgebra.conj(dictHeytingAlgebra)(v.value0)(v1.value0), Data_HeytingAlgebra.conj(dictHeytingAlgebra1)(v.value1)(v1.value1));
            };
        }, function (v) {
            return function (v1) {
                return new Tuple(Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v.value0)(v1.value0), Data_HeytingAlgebra.disj(dictHeytingAlgebra1)(v.value1)(v1.value1));
            };
        }, new Tuple(Data_HeytingAlgebra.ff(dictHeytingAlgebra), Data_HeytingAlgebra.ff(dictHeytingAlgebra1)), function (v) {
            return function (v1) {
                return new Tuple(Data_HeytingAlgebra.implies(dictHeytingAlgebra)(v.value0)(v1.value0), Data_HeytingAlgebra.implies(dictHeytingAlgebra1)(v.value1)(v1.value1));
            };
        }, function (v) {
            return new Tuple(Data_HeytingAlgebra.not(dictHeytingAlgebra)(v.value0), Data_HeytingAlgebra.not(dictHeytingAlgebra1)(v.value1));
        }, new Tuple(Data_HeytingAlgebra.tt(dictHeytingAlgebra), Data_HeytingAlgebra.tt(dictHeytingAlgebra1)));
    };
};
var functorTuple = new Data_Functor.Functor(function (f) {
    return function (v) {
        return new Tuple(v.value0, f(v.value1));
    };
});
var invariantTuple = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorTuple));
var fst = function (v) {
    return v.value0;
};
var lazyTuple = function (dictLazy) {
    return function (dictLazy1) {
        return new Control_Lazy.Lazy(function (f) {
            return new Tuple(Control_Lazy.defer(dictLazy)(function (v) {
                return fst(f(Data_Unit.unit));
            }), Control_Lazy.defer(dictLazy1)(function (v) {
                return snd(f(Data_Unit.unit));
            }));
        });
    };
};
var foldableTuple = new Data_Foldable.Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v.value1);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v.value1);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v.value1)(z);
        };
    };
});
var traversableTuple = new Data_Traversable.Traversable(function () {
    return foldableTuple;
}, function () {
    return functorTuple;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Tuple.create(v.value0))(v.value1);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Tuple.create(v.value0))(f(v.value1));
        };
    };
});
var extendTuple = new Control_Extend.Extend(function () {
    return functorTuple;
}, function (f) {
    return function (v) {
        return new Tuple(v.value0, f(v));
    };
});
var eqTuple = function (dictEq) {
    return function (dictEq1) {
        return new Data_Eq.Eq(function (x) {
            return function (y) {
                return Data_Eq.eq(dictEq)(x.value0)(y.value0) && Data_Eq.eq(dictEq1)(x.value1)(y.value1);
            };
        });
    };
};
var ordTuple = function (dictOrd) {
    return function (dictOrd1) {
        return new Data_Ord.Ord(function () {
            return eqTuple(dictOrd["__superclass_Data.Eq.Eq_0"]())(dictOrd1["__superclass_Data.Eq.Eq_0"]());
        }, function (x) {
            return function (y) {
                var $205 = Data_Ord.compare(dictOrd)(x.value0)(y.value0);
                if ($205 instanceof Data_Ordering.LT) {
                    return Data_Ordering.LT.value;
                };
                if ($205 instanceof Data_Ordering.GT) {
                    return Data_Ordering.GT.value;
                };
                return Data_Ord.compare(dictOrd1)(x.value1)(y.value1);
            };
        });
    };
};
var eq1Tuple = function (dictEq) {
    return new Data_Eq.Eq1(function (dictEq1) {
        return Data_Eq.eq(eqTuple(dictEq)(dictEq1));
    });
};
var ord1Tuple = function (dictOrd) {
    return new Data_Ord.Ord1(function () {
        return eq1Tuple(dictOrd["__superclass_Data.Eq.Eq_0"]());
    }, function (dictOrd1) {
        return Data_Ord.compare(ordTuple(dictOrd)(dictOrd1));
    });
};
var curry = function (f) {
    return function (a) {
        return function (b) {
            return f(new Tuple(a, b));
        };
    };
};
var comonadTuple = new Control_Comonad.Comonad(function () {
    return extendTuple;
}, snd);
var commutativeRingTuple = function (dictCommutativeRing) {
    return function (dictCommutativeRing1) {
        return new Data_CommutativeRing.CommutativeRing(function () {
            return ringTuple(dictCommutativeRing["__superclass_Data.Ring.Ring_0"]())(dictCommutativeRing1["__superclass_Data.Ring.Ring_0"]());
        });
    };
};
var boundedTuple = function (dictBounded) {
    return function (dictBounded1) {
        return new Data_Bounded.Bounded(function () {
            return ordTuple(dictBounded["__superclass_Data.Ord.Ord_0"]())(dictBounded1["__superclass_Data.Ord.Ord_0"]());
        }, new Tuple(Data_Bounded.bottom(dictBounded), Data_Bounded.bottom(dictBounded1)), new Tuple(Data_Bounded.top(dictBounded), Data_Bounded.top(dictBounded1)));
    };
};
var booleanAlgebraTuple = function (dictBooleanAlgebra) {
    return function (dictBooleanAlgebra1) {
        return new Data_BooleanAlgebra.BooleanAlgebra(function () {
            return heytingAlgebraTuple(dictBooleanAlgebra["__superclass_Data.HeytingAlgebra.HeytingAlgebra_0"]())(dictBooleanAlgebra1["__superclass_Data.HeytingAlgebra.HeytingAlgebra_0"]());
        });
    };
};
var bifunctorTuple = new Data_Bifunctor.Bifunctor(function (f) {
    return function (g) {
        return function (v) {
            return new Tuple(f(v.value0), g(v.value1));
        };
    };
});
var bifoldableTuple = new Data_Bifoldable.Bifoldable(function (dictMonoid) {
    return function (f) {
        return function (g) {
            return function (v) {
                return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(f(v.value0))(g(v.value1));
            };
        };
    };
}, function (f) {
    return function (g) {
        return function (z) {
            return function (v) {
                return g(f(z)(v.value0))(v.value1);
            };
        };
    };
}, function (f) {
    return function (g) {
        return function (z) {
            return function (v) {
                return f(v.value0)(g(v.value1)(z));
            };
        };
    };
});
var bitraversableTuple = new Data_Bitraversable.Bitraversable(function () {
    return bifoldableTuple;
}, function () {
    return bifunctorTuple;
}, function (dictApplicative) {
    return function (v) {
        return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Tuple.create)(v.value0))(v.value1);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (g) {
            return function (v) {
                return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Tuple.create)(f(v.value0)))(g(v.value1));
            };
        };
    };
});
var biapplyTuple = new Control_Biapply.Biapply(function () {
    return bifunctorTuple;
}, function (v) {
    return function (v1) {
        return new Tuple(v.value0(v1.value0), v.value1(v1.value1));
    };
});
var biapplicativeTuple = new Control_Biapplicative.Biapplicative(function () {
    return biapplyTuple;
}, Tuple.create);
var applyTuple = function (dictSemigroup) {
    return new Control_Apply.Apply(function () {
        return functorTuple;
    }, function (v) {
        return function (v1) {
            return new Tuple(Data_Semigroup.append(dictSemigroup)(v.value0)(v1.value0), v.value1(v1.value1));
        };
    });
};
var bindTuple = function (dictSemigroup) {
    return new Control_Bind.Bind(function () {
        return applyTuple(dictSemigroup);
    }, function (v) {
        return function (f) {
            var $254 = f(v.value1);
            return new Tuple(Data_Semigroup.append(dictSemigroup)(v.value0)($254.value0), $254.value1);
        };
    });
};
var applicativeTuple = function (dictMonoid) {
    return new Control_Applicative.Applicative(function () {
        return applyTuple(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]());
    }, Tuple.create(Data_Monoid.mempty(dictMonoid)));
};
var monadTuple = function (dictMonoid) {
    return new Control_Monad.Monad(function () {
        return applicativeTuple(dictMonoid);
    }, function () {
        return bindTuple(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]());
    });
};
module.exports = {
    Tuple: Tuple, 
    curry: curry, 
    fst: fst, 
    lookup: lookup, 
    snd: snd, 
    swap: swap, 
    uncurry: uncurry, 
    showTuple: showTuple, 
    eqTuple: eqTuple, 
    eq1Tuple: eq1Tuple, 
    ordTuple: ordTuple, 
    ord1Tuple: ord1Tuple, 
    boundedTuple: boundedTuple, 
    semigroupoidTuple: semigroupoidTuple, 
    semigroupTuple: semigroupTuple, 
    monoidTuple: monoidTuple, 
    semiringTuple: semiringTuple, 
    ringTuple: ringTuple, 
    commutativeRingTuple: commutativeRingTuple, 
    heytingAlgebraTuple: heytingAlgebraTuple, 
    booleanAlgebraTuple: booleanAlgebraTuple, 
    functorTuple: functorTuple, 
    invariantTuple: invariantTuple, 
    bifunctorTuple: bifunctorTuple, 
    applyTuple: applyTuple, 
    biapplyTuple: biapplyTuple, 
    applicativeTuple: applicativeTuple, 
    biapplicativeTuple: biapplicativeTuple, 
    bindTuple: bindTuple, 
    monadTuple: monadTuple, 
    extendTuple: extendTuple, 
    comonadTuple: comonadTuple, 
    lazyTuple: lazyTuple, 
    foldableTuple: foldableTuple, 
    bifoldableTuple: bifoldableTuple, 
    traversableTuple: traversableTuple, 
    bitraversableTuple: bitraversableTuple
};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Biapplicative":37,"../Control.Biapply":38,"../Control.Bind":40,"../Control.Comonad":43,"../Control.Extend":44,"../Control.Lazy":45,"../Control.Monad":82,"../Control.Semigroupoid":88,"../Data.Bifoldable":94,"../Data.Bifunctor":100,"../Data.Bitraversable":101,"../Data.BooleanAlgebra":103,"../Data.Bounded":105,"../Data.CommutativeRing":108,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.Functor.Invariant":125,"../Data.HeytingAlgebra":131,"../Data.Maybe":140,"../Data.Maybe.First":138,"../Data.Monoid":147,"../Data.Newtype":149,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.Traversable":178,"../Data.Unit":183,"../Prelude":196}],180:[function(require,module,exports){
"use strict";

exports.unfoldrArrayImpl = function (isNothing) {
  return function (fromJust) {
    return function (fst) {
      return function (snd) {
        return function (f) {
          return function (b) {
            var result = [];
            while (true) {
              var maybe = f(b);
              if (isNothing(maybe)) return result;
              var tuple = fromJust(maybe);
              result.push(fst(tuple));
              b = snd(tuple);
            }
          };
        };
      };
    };
  };
};

},{}],181:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Data_Maybe = require("../Data.Maybe");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Partial_Unsafe = require("../Partial.Unsafe");
var Data_Ord = require("../Data.Ord");
var Data_Ring = require("../Data.Ring");
var Data_Function = require("../Data.Function");
var Data_Unit = require("../Data.Unit");
var Data_Functor = require("../Data.Functor");
var Unfoldable = function (unfoldr) {
    this.unfoldr = unfoldr;
};
var unfoldr = function (dict) {
    return dict.unfoldr;
};
var unfoldableArray = new Unfoldable($foreign.unfoldrArrayImpl(Data_Maybe.isNothing)(Data_Maybe.fromJust())(Data_Tuple.fst)(Data_Tuple.snd));
var replicate = function (dictUnfoldable) {
    return function (n) {
        return function (v) {
            var step = function (i) {
                var $8 = i <= 0;
                if ($8) {
                    return Data_Maybe.Nothing.value;
                };
                if (!$8) {
                    return new Data_Maybe.Just(new Data_Tuple.Tuple(v, i - 1 | 0));
                };
                throw new Error("Failed pattern match at Data.Unfoldable line 59, column 7 - line 60, column 34: " + [ $8.constructor.name ]);
            };
            return unfoldr(dictUnfoldable)(step)(n);
        };
    };
};
var replicateA = function (dictApplicative) {
    return function (dictUnfoldable) {
        return function (dictTraversable) {
            return function (n) {
                return function (m) {
                    return Data_Traversable.sequence(dictTraversable)(dictApplicative)(replicate(dictUnfoldable)(n)(m));
                };
            };
        };
    };
};
var singleton = function (dictUnfoldable) {
    return replicate(dictUnfoldable)(1);
};
var none = function (dictUnfoldable) {
    return unfoldr(dictUnfoldable)(Data_Function["const"](Data_Maybe.Nothing.value))(Data_Unit.unit);
};
var fromMaybe = function (dictUnfoldable) {
    return unfoldr(dictUnfoldable)(function (b) {
        return Data_Functor.map(Data_Maybe.functorMaybe)(Data_Function.flip(Data_Tuple.Tuple.create)(Data_Maybe.Nothing.value))(b);
    });
};
module.exports = {
    Unfoldable: Unfoldable, 
    fromMaybe: fromMaybe, 
    none: none, 
    replicate: replicate, 
    replicateA: replicateA, 
    singleton: singleton, 
    unfoldr: unfoldr, 
    unfoldableArray: unfoldableArray
};

},{"../Data.Function":121,"../Data.Functor":127,"../Data.Maybe":140,"../Data.Ord":154,"../Data.Ring":159,"../Data.Traversable":178,"../Data.Tuple":179,"../Data.Unit":183,"../Partial.Unsafe":193,"../Prelude":196,"./foreign":180}],182:[function(require,module,exports){
"use strict";

exports.unit = {};

},{}],183:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Show = require("../Data.Show");
var showUnit = new Data_Show.Show(function (v) {
    return "unit";
});
module.exports = {
    showUnit: showUnit, 
    unit: $foreign.unit
};

},{"../Data.Show":165,"./foreign":182}],184:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Show = require("../Data.Show");
var Void = function (x) {
    return x;
};
var absurd = function (a) {
    var spin = function (__copy_v) {
        var v = __copy_v;
        tco: while (true) {
            var __tco_v = v;
            v = __tco_v;
            continue tco;
        };
    };
    return spin(a);
};
var showVoid = new Data_Show.Show(absurd);
module.exports = {
    absurd: absurd, 
    showVoid: showVoid
};

},{"../Data.Show":165}],185:[function(require,module,exports){
/* globals exports */
"use strict";

// module Global

exports.nan = NaN;

exports.isNaN = isNaN;

exports.infinity = Infinity;

exports.isFinite = isFinite;

exports.readInt = function (radix) {
  return function (n) {
    return parseInt(n, radix);
  };
};

exports.readFloat = parseFloat;

exports.decodeURI = decodeURI;
exports.encodeURI = encodeURI;
exports.decodeURIComponent = decodeURIComponent;
exports.encodeURIComponent = encodeURIComponent;

},{}],186:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
module.exports = {
    "decodeURI": $foreign["decodeURI"], 
    "decodeURIComponent": $foreign["decodeURIComponent"], 
    "encodeURI": $foreign["encodeURI"], 
    "encodeURIComponent": $foreign["encodeURIComponent"], 
    infinity: $foreign.infinity, 
    "isFinite": $foreign["isFinite"], 
    "isNaN": $foreign["isNaN"], 
    nan: $foreign.nan, 
    readFloat: $foreign.readFloat, 
    readInt: $foreign.readInt
};

},{"./foreign":185}],187:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Const = require("../Data.Const");
var Data_Functor_Contravariant = require("../Data.Functor.Contravariant");
var Data_Newtype = require("../Data.Newtype");
var Data_Profunctor = require("../Data.Profunctor");
var Optic_Types = require("../Optic.Types");
var Prelude = require("../Prelude");
var Data_Function = require("../Data.Function");
var view = function (asa) {
    return function (s) {
        return Data_Newtype.unwrap(Data_Const.newtypeConst)(asa(Data_Const.Const)(s));
    };
};
var weiv = Data_Function.flip(view);
var to = function (dictContravariant) {
    return function (dictFunctor) {
        return function (dictProfunctor) {
            return function (s2a) {
                return Data_Profunctor.dimap(dictProfunctor)(s2a)(Data_Functor_Contravariant.coerce(dictContravariant)(dictFunctor));
            };
        };
    };
};
module.exports = {
    to: to, 
    view: view, 
    weiv: weiv
};

},{"../Data.Const":109,"../Data.Function":121,"../Data.Functor.Contravariant":123,"../Data.Newtype":149,"../Data.Profunctor":157,"../Optic.Types":191,"../Prelude":196}],188:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Profunctor = require("../Data.Profunctor");
var Data_Profunctor_Choice = require("../Data.Profunctor.Choice");
var Data_Either = require("../Data.Either");
var Prelude = require("../Prelude");
var Data_Functor = require("../Data.Functor");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Function = require("../Data.Function");
var Market = (function () {
    function Market(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Market.create = function (value0) {
        return function (value1) {
            return new Market(value0, value1);
        };
    };
    return Market;
})();
var profunctorMarket = new Data_Profunctor.Profunctor(function (s2r) {
    return function (t2u) {
        return function (v) {
            return new Market(function ($25) {
                return t2u(v.value0($25));
            }, function ($26) {
                return Data_Either.either(function ($27) {
                    return Data_Either.Left.create(t2u($27));
                })(Data_Either.Right.create)(v.value1(s2r($26)));
            });
        };
    };
});
var functorMarket = new Data_Functor.Functor(function (t2u) {
    return function (v) {
        return new Market(function ($28) {
            return t2u(v.value0($28));
        }, function ($29) {
            return Data_Either.either(function ($30) {
                return Data_Either.Left.create(t2u($30));
            })(Data_Either.Right.create)(v.value1($29));
        });
    };
});
var choiceMarket = new Data_Profunctor_Choice.Choice(function () {
    return profunctorMarket;
}, function (v) {
    return new Market(function ($31) {
        return Data_Either.Left.create(v.value0($31));
    }, function (thing) {
        if (thing instanceof Data_Either.Left) {
            return Data_Either.either(function ($32) {
                return Data_Either.Left.create(Data_Either.Left.create($32));
            })(Data_Either.Right.create)(v.value1(thing.value0));
        };
        if (thing instanceof Data_Either.Right) {
            return Data_Either.Left.create(new Data_Either.Right(thing.value0));
        };
        throw new Error("Failed pattern match at Optic.Internal.Prism line 24, column 63 - line 26, column 32: " + [ thing.constructor.name ]);
    });
}, function (v) {
    return new Market(function ($33) {
        return Data_Either.Right.create(v.value0($33));
    }, function (thing) {
        if (thing instanceof Data_Either.Left) {
            return Data_Either.Left.create(new Data_Either.Left(thing.value0));
        };
        if (thing instanceof Data_Either.Right) {
            return Data_Either.either(function ($34) {
                return Data_Either.Left.create(Data_Either.Right.create($34));
            })(Data_Either.Right.create)(v.value1(thing.value0));
        };
        throw new Error("Failed pattern match at Optic.Internal.Prism line 28, column 65 - line 30, column 56: " + [ thing.constructor.name ]);
    });
});
module.exports = {
    Market: Market, 
    functorMarket: functorMarket, 
    profunctorMarket: profunctorMarket, 
    choiceMarket: choiceMarket
};

},{"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Function":121,"../Data.Functor":127,"../Data.Profunctor":157,"../Data.Profunctor.Choice":156,"../Prelude":196}],189:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Distributive = require("../Data.Distributive");
var Data_Identity = require("../Data.Identity");
var Data_Newtype = require("../Data.Newtype");
var Data_Profunctor = require("../Data.Profunctor");
var Data_Traversable = require("../Data.Traversable");
var Prelude = require("../Prelude");
var Settable = function (__superclass_Control$dotApplicative$dotApplicative_0, __superclass_Data$dotDistributive$dotDistributive_1, __superclass_Data$dotTraversable$dotTraversable_2, taintedDot, untainted, untaintedDot) {
    this["__superclass_Control.Applicative.Applicative_0"] = __superclass_Control$dotApplicative$dotApplicative_0;
    this["__superclass_Data.Distributive.Distributive_1"] = __superclass_Data$dotDistributive$dotDistributive_1;
    this["__superclass_Data.Traversable.Traversable_2"] = __superclass_Data$dotTraversable$dotTraversable_2;
    this.taintedDot = taintedDot;
    this.untainted = untainted;
    this.untaintedDot = untaintedDot;
};
var untaintedDot = function (dict) {
    return dict.untaintedDot;
};
var untainted = function (dict) {
    return dict.untainted;
};
var taintedDot = function (dict) {
    return dict.taintedDot;
};
var settableIdentity = new Settable(function () {
    return Data_Identity.applicativeIdentity;
}, function () {
    return Data_Distributive.distributiveIdentity;
}, function () {
    return Data_Identity.traversableIdentity;
}, function (dictProfunctor) {
    return Data_Profunctor.rmap(dictProfunctor)(Data_Identity.Identity);
}, function (v) {
    return v;
}, function (dictProfunctor) {
    return Data_Profunctor.rmap(dictProfunctor)(Data_Newtype.unwrap(Data_Identity.newtypeIdentity));
});
module.exports = {
    Settable: Settable, 
    taintedDot: taintedDot, 
    untainted: untainted, 
    untaintedDot: untaintedDot, 
    settableIdentity: settableIdentity
};

},{"../Data.Distributive":110,"../Data.Identity":132,"../Data.Newtype":149,"../Data.Profunctor":157,"../Data.Traversable":178,"../Prelude":196}],190:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Optic_Types = require("../Optic.Types");
var Prelude = require("../Prelude");
var Data_Functor = require("../Data.Functor");
var lens = function (s2a) {
    return function (s2b2t) {
        return function (dictFunctor) {
            return function (a2fb) {
                return function (s) {
                    return Data_Functor.map(dictFunctor)(s2b2t(s))(a2fb(s2a(s)));
                };
            };
        };
    };
};
var flip$prime = function (dictFunctor) {
    return function (ff) {
        return function (x) {
            return Data_Functor.map(dictFunctor)(function (f) {
                return f(x);
            })(ff);
        };
    };
};
module.exports = {
    "flip'": flip$prime, 
    lens: lens
};

},{"../Data.Functor":127,"../Optic.Types":191,"../Prelude":196}],191:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Const = require("../Data.Const");
var Data_Functor_Contravariant = require("../Data.Functor.Contravariant");
var Data_Identity = require("../Data.Identity");
var Data_Profunctor_Choice = require("../Data.Profunctor.Choice");
var Optic_Internal_Prism = require("../Optic.Internal.Prism");
var Optic_Internal_Setter = require("../Optic.Internal.Setter");
var Prelude = require("../Prelude");
module.exports = {};

},{"../Data.Const":109,"../Data.Functor.Contravariant":123,"../Data.Identity":132,"../Data.Profunctor.Choice":156,"../Optic.Internal.Prism":188,"../Optic.Internal.Setter":189,"../Prelude":196}],192:[function(require,module,exports){
"use strict";

// module Partial.Unsafe

exports.unsafePartial = function (f) {
  return f();
};

exports.unsafePartialBecause = function (reason) {
  return function (f) {
    try {
      return exports.unsafePartial(f);
    } catch (err) {
      throw new Error("unsafePartial failed. The following " +
                      "assumption was incorrect: '" + reason + "'.");
    }
  };
};

},{}],193:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Partial = require("../Partial");
var unsafeCrashWith = function (msg) {
    return $foreign.unsafePartial(function (dictPartial) {
        return Partial.crashWith(dictPartial)(msg);
    });
};
module.exports = {
    unsafeCrashWith: unsafeCrashWith, 
    unsafePartial: $foreign.unsafePartial, 
    unsafePartialBecause: $foreign.unsafePartialBecause
};

},{"../Partial":195,"./foreign":192}],194:[function(require,module,exports){
"use strict";

// module Partial

exports.crashWith = function () {
  return function (msg) {
    throw new Error(msg);
  };
};

},{}],195:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var crash = function (dictPartial) {
    return $foreign.crashWith(dictPartial)("Partial.crash: partial function");
};
module.exports = {
    crash: crash, 
    crashWith: $foreign.crashWith
};

},{"./foreign":194}],196:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Category = require("../Control.Category");
var Control_Monad = require("../Control.Monad");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Boolean = require("../Data.Boolean");
var Data_BooleanAlgebra = require("../Data.BooleanAlgebra");
var Data_Bounded = require("../Data.Bounded");
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_Eq = require("../Data.Eq");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Field = require("../Data.Field");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_NaturalTransformation = require("../Data.NaturalTransformation");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Ring = require("../Data.Ring");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
module.exports = {};

},{"../Control.Applicative":34,"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.Monad":82,"../Control.Semigroupoid":88,"../Data.Boolean":102,"../Data.BooleanAlgebra":103,"../Data.Bounded":105,"../Data.CommutativeRing":108,"../Data.Eq":113,"../Data.EuclideanRing":115,"../Data.Field":116,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.NaturalTransformation":148,"../Data.Ord":154,"../Data.Ordering":155,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.Unit":183,"../Data.Void":184}],197:[function(require,module,exports){
/* global exports */
"use strict";

var React = require("react");

function unsafeMkProps(key) {
  return function(value){
    var result = {};
    result[key] = value;
    return result;
  };
}
exports.unsafeMkProps = unsafeMkProps;

function unsafeUnfoldProps(key) {
  return function(value){
    var result = {};
    var props = {};
    props[key] = result;

    for (var subprop in value) {
      if (value.hasOwnProperty(subprop)) {
        result[subprop] = value[subprop];
      }
    }

    return props;
  };
}
exports.unsafeUnfoldProps = unsafeUnfoldProps;

function unsafePrefixProps(prefix) {
  return function(value){
    var result = {};

    for (var prop in value) {
      if (value.hasOwnProperty(prop)) {
        result[prefix + prop] = value[prop];
      }
    }

    return result;
  };
}
exports.unsafePrefixProps = unsafePrefixProps;

function unsafeFromPropsArray(props) {
  var result = {};

  for (var i = 0, len = props.length; i < len; i++) {
    var prop = props[i];

    for (var key in prop) {
      if (prop.hasOwnProperty(key)) {
        result[key] = prop[key];
      }
    }
  }

  return result;
};
exports.unsafeFromPropsArray = unsafeFromPropsArray;

},{"react":31}],198:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var React = require("../React");
var wrap = $foreign.unsafeMkProps("wrap");
var wmode = $foreign.unsafeMkProps("wmode");
var width = $foreign.unsafeMkProps("width");
var vocab = $foreign.unsafeMkProps("vocab");
var value = $foreign.unsafeMkProps("value");
var useMap = $foreign.unsafeMkProps("useMap");
var unselectable = $foreign.unsafeMkProps("unselectable");
var $$typeof = $foreign.unsafeMkProps("typeof");
var title = $foreign.unsafeMkProps("title");
var target = $foreign.unsafeMkProps("target");
var tabIndex = $foreign.unsafeMkProps("tabIndex");
var summary = $foreign.unsafeMkProps("summary");
var style = $foreign.unsafeUnfoldProps("style");
var step = $foreign.unsafeMkProps("step");
var start = $foreign.unsafeMkProps("start");
var srcSet = $foreign.unsafeMkProps("srcSet");
var srcLang = $foreign.unsafeMkProps("srcLang");
var srcDoc = $foreign.unsafeMkProps("srcDoc");
var src = $foreign.unsafeMkProps("src");
var spellCheck = $foreign.unsafeMkProps("spellCheck");
var span = $foreign.unsafeMkProps("span");
var sizes = $foreign.unsafeMkProps("sizes");
var size = $foreign.unsafeMkProps("size");
var shape = $foreign.unsafeMkProps("shape");
var selected = $foreign.unsafeMkProps("selected");
var security = $foreign.unsafeMkProps("security");
var seamless = $foreign.unsafeMkProps("seamless");
var scrolling = $foreign.unsafeMkProps("scrolling");
var scoped = $foreign.unsafeMkProps("scoped");
var scope = $foreign.unsafeMkProps("scope");
var sandbox = $foreign.unsafeMkProps("sandbox");
var rows = $foreign.unsafeMkProps("rows");
var rowSpan = $foreign.unsafeMkProps("rowSpan");
var role = $foreign.unsafeMkProps("role");
var reversed = $foreign.unsafeMkProps("reversed");
var results = $foreign.unsafeMkProps("results");
var resource = $foreign.unsafeMkProps("resource");
var required = $foreign.unsafeMkProps("required");
var rel = $foreign.unsafeMkProps("rel");
var readOnly = $foreign.unsafeMkProps("readOnly");
var radioGroup = $foreign.unsafeMkProps("radioGroup");
var property = $foreign.unsafeMkProps("property");
var profile = $foreign.unsafeMkProps("profile");
var preload = $foreign.unsafeMkProps("preload");
var prefix = $foreign.unsafeMkProps("prefix");
var poster = $foreign.unsafeMkProps("poster");
var placeholder = $foreign.unsafeMkProps("placeholder");
var pattern = $foreign.unsafeMkProps("pattern");
var optimum = $foreign.unsafeMkProps("optimum");
var open = $foreign.unsafeMkProps("open");
var onWheel = function (f) {
    return $foreign.unsafeMkProps("onWheel")(React.handle(f));
};
var onTouchStart = function (f) {
    return $foreign.unsafeMkProps("onTouchStart")(React.handle(f));
};
var onTouchMove = function (f) {
    return $foreign.unsafeMkProps("onTouchMove")(React.handle(f));
};
var onTouchEnd = function (f) {
    return $foreign.unsafeMkProps("onTouchEnd")(React.handle(f));
};
var onTouchCancel = function (f) {
    return $foreign.unsafeMkProps("onTouchCancel")(React.handle(f));
};
var onSubmit = function (f) {
    return $foreign.unsafeMkProps("onSubmit")(React.handle(f));
};
var onScroll = function (f) {
    return $foreign.unsafeMkProps("onScroll")(React.handle(f));
};
var onPaste = function (f) {
    return $foreign.unsafeMkProps("onPaste")(React.handle(f));
};
var onMouseUp = function (f) {
    return $foreign.unsafeMkProps("onMouseUp")(React.handle(f));
};
var onMouseOver = function (f) {
    return $foreign.unsafeMkProps("onMouseOver")(React.handle(f));
};
var onMouseOut = function (f) {
    return $foreign.unsafeMkProps("onMouseOut")(React.handle(f));
};
var onMouseMove = function (f) {
    return $foreign.unsafeMkProps("onMouseMove")(React.handle(f));
};
var onMouseLeave = function (f) {
    return $foreign.unsafeMkProps("onMouseLeave")(React.handle(f));
};
var onMouseEnter = function (f) {
    return $foreign.unsafeMkProps("onMouseEnter")(React.handle(f));
};
var onMouseDown = function (f) {
    return $foreign.unsafeMkProps("onMouseDown")(React.handle(f));
};
var onKeyUp = function (f) {
    return $foreign.unsafeMkProps("onKeyUp")(React.handle(f));
};
var onKeyPress = function (f) {
    return $foreign.unsafeMkProps("onKeyPress")(React.handle(f));
};
var onKeyDown = function (f) {
    return $foreign.unsafeMkProps("onKeyDown")(React.handle(f));
};
var onInput = function (f) {
    return $foreign.unsafeMkProps("onInput")(React.handle(f));
};
var onFocus = function (f) {
    return $foreign.unsafeMkProps("onFocus")(React.handle(f));
};
var onDrop = function (f) {
    return $foreign.unsafeMkProps("onDrop")(React.handle(f));
};
var onDragStart = function (f) {
    return $foreign.unsafeMkProps("onDragStart")(React.handle(f));
};
var onDragOver = function (f) {
    return $foreign.unsafeMkProps("onDragOver")(React.handle(f));
};
var onDragLeave = function (f) {
    return $foreign.unsafeMkProps("onDragLeave")(React.handle(f));
};
var onDragExit = function (f) {
    return $foreign.unsafeMkProps("onDragExit")(React.handle(f));
};
var onDragEnter = function (f) {
    return $foreign.unsafeMkProps("onDragEnter")(React.handle(f));
};
var onDragEnd = function (f) {
    return $foreign.unsafeMkProps("onDragEnd")(React.handle(f));
};
var onDrag = function (f) {
    return $foreign.unsafeMkProps("onDrag")(React.handle(f));
};
var onDoubleClick = function (f) {
    return $foreign.unsafeMkProps("onDoubleClick")(React.handle(f));
};
var onCut = function (f) {
    return $foreign.unsafeMkProps("onCut")(React.handle(f));
};
var onCopy = function (f) {
    return $foreign.unsafeMkProps("onCopy")(React.handle(f));
};
var onClick = function (f) {
    return $foreign.unsafeMkProps("onClick")(React.handle(f));
};
var onChange = function (f) {
    return $foreign.unsafeMkProps("onChange")(React.handle(f));
};
var onBlur = function (f) {
    return $foreign.unsafeMkProps("onBlur")(React.handle(f));
};
var nonce = $foreign.unsafeMkProps("nonce");
var noValidate = $foreign.unsafeMkProps("noValidate");
var name = $foreign.unsafeMkProps("name");
var muted = $foreign.unsafeMkProps("muted");
var multiple = $foreign.unsafeMkProps("multiple");
var minLength = $foreign.unsafeMkProps("minLength");
var min = $foreign.unsafeMkProps("min");
var method = $foreign.unsafeMkProps("method");
var mediaGroup = $foreign.unsafeMkProps("mediaGroup");
var media = $foreign.unsafeMkProps("media");
var maxLength = $foreign.unsafeMkProps("maxLength");
var max = $foreign.unsafeMkProps("max");
var marginWidth = $foreign.unsafeMkProps("marginWidth");
var marginHeight = $foreign.unsafeMkProps("marginHeight");
var manifest = $foreign.unsafeMkProps("manifest");
var low = $foreign.unsafeMkProps("low");
var loop = $foreign.unsafeMkProps("loop");
var list = $foreign.unsafeMkProps("list");
var lang = $foreign.unsafeMkProps("lang");
var label = $foreign.unsafeMkProps("label");
var kind = $foreign.unsafeMkProps("kind");
var keyType = $foreign.unsafeMkProps("keyType");
var keyParams = $foreign.unsafeMkProps("keyParams");
var key = $foreign.unsafeMkProps("key");
var itemType = $foreign.unsafeMkProps("itemType");
var itemScope = $foreign.unsafeMkProps("itemScope");
var itemRef = $foreign.unsafeMkProps("itemRef");
var itemProp = $foreign.unsafeMkProps("itemProp");
var itemID = $foreign.unsafeMkProps("itemID");
var is = $foreign.unsafeMkProps("is");
var integrity = $foreign.unsafeMkProps("integrity");
var inputMode = $foreign.unsafeMkProps("inputMode");
var inlist = $foreign.unsafeMkProps("inlist");
var icon = $foreign.unsafeMkProps("icon");
var httpEquiv = $foreign.unsafeMkProps("httpEquiv");
var htmlFor = $foreign.unsafeMkProps("htmlFor");
var hrefLang = $foreign.unsafeMkProps("hrefLang");
var href = $foreign.unsafeMkProps("href");
var high = $foreign.unsafeMkProps("high");
var hidden = $foreign.unsafeMkProps("hidden");
var height = $foreign.unsafeMkProps("height");
var headers = $foreign.unsafeMkProps("headers");
var frameBorder = $foreign.unsafeMkProps("frameBorder");
var formTarget = $foreign.unsafeMkProps("formTarget");
var formNoValidate = $foreign.unsafeMkProps("formNoValidate");
var formMethod = $foreign.unsafeMkProps("formMethod");
var formEncType = $foreign.unsafeMkProps("formEncType");
var formAction = $foreign.unsafeMkProps("formAction");
var form = $foreign.unsafeMkProps("form");
var encType = $foreign.unsafeMkProps("encType");
var draggable = $foreign.unsafeMkProps("draggable");
var download = $foreign.unsafeMkProps("download");
var disabled = $foreign.unsafeMkProps("disabled");
var dir = $foreign.unsafeMkProps("dir");
var defer = $foreign.unsafeMkProps("defer");
var defaultValue = $foreign.unsafeMkProps("defaultValue");
var defaultChecked = $foreign.unsafeMkProps("defaultChecked");
var $$default = $foreign.unsafeMkProps("default");
var dateTime = $foreign.unsafeMkProps("dateTime");
var datatype = $foreign.unsafeMkProps("datatype");
var dangerouslySetInnerHTML = $foreign.unsafeMkProps("dangerouslySetInnerHTML");
var crossOrigin = $foreign.unsafeMkProps("crossOrigin");
var coords = $foreign.unsafeMkProps("coords");
var controls = $foreign.unsafeMkProps("controls");
var contextMenu = $foreign.unsafeMkProps("contextMenu");
var contentEditable = $foreign.unsafeMkProps("contentEditable");
var content = $foreign.unsafeMkProps("content");
var cols = $foreign.unsafeMkProps("cols");
var color = $foreign.unsafeMkProps("color");
var colSpan = $foreign.unsafeMkProps("colSpan");
var className = $foreign.unsafeMkProps("className");
var classID = $foreign.unsafeMkProps("classID");
var cite = $foreign.unsafeMkProps("cite");
var checked = $foreign.unsafeMkProps("checked");
var charSet = $foreign.unsafeMkProps("charSet");
var challenge = $foreign.unsafeMkProps("checked");
var cellSpacing = $foreign.unsafeMkProps("cellSpacing");
var cellPadding = $foreign.unsafeMkProps("cellPadding");
var capture = $foreign.unsafeMkProps("capture");
var autoSave = $foreign.unsafeMkProps("autoSave");
var autoPlay = $foreign.unsafeMkProps("autoPlay");
var autoFocus = $foreign.unsafeMkProps("autoFocus");
var autoCorrect = $foreign.unsafeMkProps("autoCorrect");
var autoComplete = $foreign.unsafeMkProps("autoComplete");
var autoCapitalize = $foreign.unsafeMkProps("autoCapitalize");
var async = $foreign.unsafeMkProps("async");
var aria = $foreign.unsafePrefixProps("aria-");
var alt = $foreign.unsafeMkProps("alt");
var allowTransparency = $foreign.unsafeMkProps("allowTransparency");
var allowFullScreen = $foreign.unsafeMkProps("allowFullScreen");
var action = $foreign.unsafeMkProps("action");
var accessKey = $foreign.unsafeMkProps("accessKey");
var acceptCharset = $foreign.unsafeMkProps("acceptCharset");
var accept = $foreign.unsafeMkProps("accept");
var about = $foreign.unsafeMkProps("about");
var _type = $foreign.unsafeMkProps("type");
var _id = $foreign.unsafeMkProps("id");
var _data = $foreign.unsafePrefixProps("data-");
module.exports = {
    _data: _data, 
    _id: _id, 
    _type: _type, 
    about: about, 
    accept: accept, 
    acceptCharset: acceptCharset, 
    accessKey: accessKey, 
    action: action, 
    allowFullScreen: allowFullScreen, 
    allowTransparency: allowTransparency, 
    alt: alt, 
    aria: aria, 
    async: async, 
    autoCapitalize: autoCapitalize, 
    autoComplete: autoComplete, 
    autoCorrect: autoCorrect, 
    autoFocus: autoFocus, 
    autoPlay: autoPlay, 
    autoSave: autoSave, 
    capture: capture, 
    cellPadding: cellPadding, 
    cellSpacing: cellSpacing, 
    challenge: challenge, 
    charSet: charSet, 
    checked: checked, 
    cite: cite, 
    classID: classID, 
    className: className, 
    colSpan: colSpan, 
    color: color, 
    cols: cols, 
    content: content, 
    contentEditable: contentEditable, 
    contextMenu: contextMenu, 
    controls: controls, 
    coords: coords, 
    crossOrigin: crossOrigin, 
    dangerouslySetInnerHTML: dangerouslySetInnerHTML, 
    datatype: datatype, 
    dateTime: dateTime, 
    "default": $$default, 
    defaultChecked: defaultChecked, 
    defaultValue: defaultValue, 
    defer: defer, 
    dir: dir, 
    disabled: disabled, 
    download: download, 
    draggable: draggable, 
    encType: encType, 
    form: form, 
    formAction: formAction, 
    formEncType: formEncType, 
    formMethod: formMethod, 
    formNoValidate: formNoValidate, 
    formTarget: formTarget, 
    frameBorder: frameBorder, 
    headers: headers, 
    height: height, 
    hidden: hidden, 
    high: high, 
    href: href, 
    hrefLang: hrefLang, 
    htmlFor: htmlFor, 
    httpEquiv: httpEquiv, 
    icon: icon, 
    inlist: inlist, 
    inputMode: inputMode, 
    integrity: integrity, 
    is: is, 
    itemID: itemID, 
    itemProp: itemProp, 
    itemRef: itemRef, 
    itemScope: itemScope, 
    itemType: itemType, 
    key: key, 
    keyParams: keyParams, 
    keyType: keyType, 
    kind: kind, 
    label: label, 
    lang: lang, 
    list: list, 
    loop: loop, 
    low: low, 
    manifest: manifest, 
    marginHeight: marginHeight, 
    marginWidth: marginWidth, 
    max: max, 
    maxLength: maxLength, 
    media: media, 
    mediaGroup: mediaGroup, 
    method: method, 
    min: min, 
    minLength: minLength, 
    multiple: multiple, 
    muted: muted, 
    name: name, 
    noValidate: noValidate, 
    nonce: nonce, 
    onBlur: onBlur, 
    onChange: onChange, 
    onClick: onClick, 
    onCopy: onCopy, 
    onCut: onCut, 
    onDoubleClick: onDoubleClick, 
    onDrag: onDrag, 
    onDragEnd: onDragEnd, 
    onDragEnter: onDragEnter, 
    onDragExit: onDragExit, 
    onDragLeave: onDragLeave, 
    onDragOver: onDragOver, 
    onDragStart: onDragStart, 
    onDrop: onDrop, 
    onFocus: onFocus, 
    onInput: onInput, 
    onKeyDown: onKeyDown, 
    onKeyPress: onKeyPress, 
    onKeyUp: onKeyUp, 
    onMouseDown: onMouseDown, 
    onMouseEnter: onMouseEnter, 
    onMouseLeave: onMouseLeave, 
    onMouseMove: onMouseMove, 
    onMouseOut: onMouseOut, 
    onMouseOver: onMouseOver, 
    onMouseUp: onMouseUp, 
    onPaste: onPaste, 
    onScroll: onScroll, 
    onSubmit: onSubmit, 
    onTouchCancel: onTouchCancel, 
    onTouchEnd: onTouchEnd, 
    onTouchMove: onTouchMove, 
    onTouchStart: onTouchStart, 
    onWheel: onWheel, 
    open: open, 
    optimum: optimum, 
    pattern: pattern, 
    placeholder: placeholder, 
    poster: poster, 
    prefix: prefix, 
    preload: preload, 
    profile: profile, 
    property: property, 
    radioGroup: radioGroup, 
    readOnly: readOnly, 
    rel: rel, 
    required: required, 
    resource: resource, 
    results: results, 
    reversed: reversed, 
    role: role, 
    rowSpan: rowSpan, 
    rows: rows, 
    sandbox: sandbox, 
    scope: scope, 
    scoped: scoped, 
    scrolling: scrolling, 
    seamless: seamless, 
    security: security, 
    selected: selected, 
    shape: shape, 
    size: size, 
    sizes: sizes, 
    span: span, 
    spellCheck: spellCheck, 
    src: src, 
    srcDoc: srcDoc, 
    srcLang: srcLang, 
    srcSet: srcSet, 
    start: start, 
    step: step, 
    style: style, 
    summary: summary, 
    tabIndex: tabIndex, 
    target: target, 
    title: title, 
    "typeof": $$typeof, 
    unselectable: unselectable, 
    useMap: useMap, 
    value: value, 
    vocab: vocab, 
    width: width, 
    wmode: wmode, 
    wrap: wrap, 
    unsafeFromPropsArray: $foreign.unsafeFromPropsArray, 
    unsafeMkProps: $foreign.unsafeMkProps, 
    unsafePrefixProps: $foreign.unsafePrefixProps, 
    unsafeUnfoldProps: $foreign.unsafeUnfoldProps
};

},{"../React":204,"./foreign":197}],199:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var React = require("../React");
var React_DOM_Props = require("../React.DOM.Props");
var Unsafe_Coerce = require("../Unsafe.Coerce");
var IsDynamic = function (x) {
    return x;
};
var text = Unsafe_Coerce.unsafeCoerce;
var mkDOM = function (dynamic) {
    return function (tag) {
        return function (props) {
            var createElement = (function () {
                if (!dynamic) {
                    return React.createElementTagName;
                };
                if (dynamic) {
                    return React.createElementTagNameDynamic;
                };
                throw new Error("Failed pattern match at React.DOM line 15, column 5 - line 17, column 55: " + [ dynamic.constructor.name ]);
            })();
            return createElement(tag)(React_DOM_Props.unsafeFromPropsArray(props));
        };
    };
};
var nav = mkDOM(false)("nav");
var nav$prime = nav([  ]);
var noscript = mkDOM(false)("noscript");
var noscript$prime = noscript([  ]);
var object = mkDOM(false)("object");
var object$prime = object([  ]);
var ol = mkDOM(false)("ol");
var ol$prime = ol([  ]);
var optgroup = mkDOM(false)("optgroup");
var optgroup$prime = optgroup([  ]);
var option = mkDOM(false)("option");
var option$prime = option([  ]);
var output = mkDOM(false)("output");
var output$prime = output([  ]);
var p = mkDOM(false)("p");
var p$prime = p([  ]);
var param = mkDOM(false)("param");
var param$prime = param([  ]);
var picture = mkDOM(false)("picture");
var picture$prime = picture([  ]);
var pre = mkDOM(false)("pre");
var pre$prime = pre([  ]);
var progress = mkDOM(false)("progress");
var progress$prime = progress([  ]);
var q = mkDOM(false)("q");
var q$prime = q([  ]);
var rp = mkDOM(false)("rp");
var rp$prime = rp([  ]);
var rt = mkDOM(false)("rt");
var rt$prime = rt([  ]);
var ruby = mkDOM(false)("ruby");
var ruby$prime = ruby([  ]);
var s = mkDOM(false)("s");
var s$prime = s([  ]);
var samp = mkDOM(false)("samp");
var samp$prime = samp([  ]);
var script = mkDOM(false)("script");
var script$prime = script([  ]);
var section = mkDOM(false)("section");
var section$prime = section([  ]);
var select = mkDOM(false)("select");
var select$prime = select([  ]);
var small = mkDOM(false)("small");
var small$prime = small([  ]);
var source = mkDOM(false)("source");
var source$prime = source([  ]);
var span = mkDOM(false)("span");
var span$prime = span([  ]);
var strong = mkDOM(false)("strong");
var strong$prime = strong([  ]);
var style = mkDOM(false)("style");
var style$prime = style([  ]);
var sub = mkDOM(false)("sub");
var sub$prime = sub([  ]);
var summary = mkDOM(false)("summary");
var summary$prime = summary([  ]);
var sup = mkDOM(false)("sup");
var sup$prime = sup([  ]);
var table = mkDOM(false)("table");
var table$prime = table([  ]);
var tbody = mkDOM(false)("tbody");
var tbody$prime = tbody([  ]);
var td = mkDOM(false)("td");
var td$prime = td([  ]);
var textarea = mkDOM(false)("textarea");
var textarea$prime = textarea([  ]);
var tfoot = mkDOM(false)("tfoot");
var tfoot$prime = tfoot([  ]);
var th = mkDOM(false)("th");
var th$prime = th([  ]);
var thead = mkDOM(false)("thead");
var thead$prime = thead([  ]);
var time = mkDOM(false)("time");
var time$prime = time([  ]);
var title = mkDOM(false)("title");
var title$prime = title([  ]);
var tr = mkDOM(false)("tr");
var tr$prime = tr([  ]);
var track = mkDOM(false)("track");
var track$prime = track([  ]);
var u = mkDOM(false)("u");
var u$prime = u([  ]);
var ul = mkDOM(false)("ul");
var ul$prime = ul([  ]);
var $$var = mkDOM(false)("var");
var var$prime = $$var([  ]);
var video = mkDOM(false)("video");
var video$prime = video([  ]);
var wbr = mkDOM(false)("body");
var wbr$prime = wbr([  ]);
var meter = mkDOM(false)("meter");
var meter$prime = meter([  ]);
var meta = mkDOM(false)("meta");
var meta$prime = meta([  ]);
var menuitem = mkDOM(false)("menuitem");
var menuitem$prime = menuitem([  ]);
var menu = mkDOM(false)("menu");
var menu$prime = menu([  ]);
var mark = mkDOM(false)("mark");
var mark$prime = mark([  ]);
var map = mkDOM(false)("map");
var map$prime = map([  ]);
var main = mkDOM(false)("main");
var main$prime = main([  ]);
var link = mkDOM(false)("link");
var li = mkDOM(false)("li");
var li$prime = li([  ]);
var legend = mkDOM(false)("legend");
var legend$prime = legend([  ]);
var label = mkDOM(false)("label");
var label$prime = label([  ]);
var keygen = mkDOM(false)("keygen");
var keygen$prime = keygen([  ]);
var kbd = mkDOM(false)("kbd");
var kbd$prime = kbd([  ]);
var ins = mkDOM(false)("ins");
var ins$prime = ins([  ]);
var input = mkDOM(false)("input");
var input$prime = input([  ]);
var img = mkDOM(false)("img");
var img$prime = img([  ]);
var iframe = mkDOM(false)("iframe");
var iframe$prime = iframe([  ]);
var i = mkDOM(false)("i");
var i$prime = i([  ]);
var html = mkDOM(false)("html");
var html$prime = html([  ]);
var hr = mkDOM(false)("hr");
var hr$prime = hr([  ]);
var header = mkDOM(false)("header");
var header$prime = header([  ]);
var head = mkDOM(false)("head");
var head$prime = head([  ]);
var h6 = mkDOM(false)("h6");
var h6$prime = h6([  ]);
var h5 = mkDOM(false)("h5");
var h5$prime = h5([  ]);
var h4 = mkDOM(false)("h4");
var h4$prime = h4([  ]);
var h3 = mkDOM(false)("h3");
var h3$prime = h3([  ]);
var h2 = mkDOM(false)("h2");
var h2$prime = h2([  ]);
var h1 = mkDOM(false)("h1");
var h1$prime = h1([  ]);
var form = mkDOM(false)("form");
var form$prime = form([  ]);
var footer = mkDOM(false)("footer");
var footer$prime = footer([  ]);
var figure = mkDOM(false)("figure");
var figure$prime = figure([  ]);
var figcaption = mkDOM(false)("figcaption");
var figcaption$prime = figcaption([  ]);
var fieldset = mkDOM(false)("fieldset");
var fieldset$prime = fieldset([  ]);
var embed = mkDOM(false)("embed");
var embed$prime = embed([  ]);
var em = mkDOM(false)("em");
var em$prime = em([  ]);
var dt = mkDOM(false)("dt");
var dt$prime = dt([  ]);
var dl = mkDOM(false)("dl");
var dl$prime = dl([  ]);
var div = mkDOM(false)("div");
var div$prime = div([  ]);
var dialog = mkDOM(false)("dialog");
var dialog$prime = dialog([  ]);
var dfn = mkDOM(false)("dfn");
var dfn$prime = dfn([  ]);
var details = mkDOM(false)("details");
var details$prime = details([  ]);
var del = mkDOM(false)("del");
var del$prime = del([  ]);
var dd = mkDOM(false)("dd");
var dd$prime = dd([  ]);
var datalist = mkDOM(false)("datalist");
var datalist$prime = datalist([  ]);
var colgroup = mkDOM(false)("colgroup");
var colgroup$prime = colgroup([  ]);
var col = mkDOM(false)("col");
var col$prime = col([  ]);
var code = mkDOM(false)("code");
var code$prime = code([  ]);
var cite = mkDOM(false)("cite");
var cite$prime = cite([  ]);
var caption = mkDOM(false)("caption");
var caption$prime = caption([  ]);
var canvas = mkDOM(false)("canvas");
var canvas$prime = canvas([  ]);
var button = mkDOM(false)("button");
var button$prime = button([  ]);
var br = mkDOM(false)("br");
var br$prime = br([  ]);
var body = mkDOM(false)("body");
var body$prime = body([  ]);
var link$prime = body([  ]);
var blockquote = mkDOM(false)("blockquote");
var blockquote$prime = blockquote([  ]);
var big = mkDOM(false)("big");
var big$prime = big([  ]);
var bdo = mkDOM(false)("bdo");
var bdo$prime = bdo([  ]);
var bdi = mkDOM(false)("bdi");
var bdi$prime = bdi([  ]);
var base = mkDOM(false)("base");
var base$prime = base([  ]);
var b = mkDOM(false)("b");
var b$prime = b([  ]);
var audio = mkDOM(false)("audio");
var audio$prime = audio([  ]);
var aside = mkDOM(false)("aside");
var aside$prime = aside([  ]);
var article = mkDOM(false)("article");
var article$prime = article([  ]);
var area = mkDOM(false)("area");
var area$prime = area([  ]);
var address = mkDOM(false)("address");
var address$prime = address([  ]);
var abbr = mkDOM(false)("abbr");
var abbr$prime = abbr([  ]);
var a = mkDOM(false)("a");
var a$prime = a([  ]);
var _data = mkDOM(false)("data");
var _data$prime = _data([  ]);
module.exports = {
    IsDynamic: IsDynamic, 
    _data: _data, 
    "_data'": _data$prime, 
    a: a, 
    "a'": a$prime, 
    abbr: abbr, 
    "abbr'": abbr$prime, 
    address: address, 
    "address'": address$prime, 
    area: area, 
    "area'": area$prime, 
    article: article, 
    "article'": article$prime, 
    aside: aside, 
    "aside'": aside$prime, 
    audio: audio, 
    "audio'": audio$prime, 
    b: b, 
    "b'": b$prime, 
    base: base, 
    "base'": base$prime, 
    bdi: bdi, 
    "bdi'": bdi$prime, 
    bdo: bdo, 
    "bdo'": bdo$prime, 
    big: big, 
    "big'": big$prime, 
    blockquote: blockquote, 
    "blockquote'": blockquote$prime, 
    body: body, 
    "body'": body$prime, 
    br: br, 
    "br'": br$prime, 
    button: button, 
    "button'": button$prime, 
    canvas: canvas, 
    "canvas'": canvas$prime, 
    caption: caption, 
    "caption'": caption$prime, 
    cite: cite, 
    "cite'": cite$prime, 
    code: code, 
    "code'": code$prime, 
    col: col, 
    "col'": col$prime, 
    colgroup: colgroup, 
    "colgroup'": colgroup$prime, 
    datalist: datalist, 
    "datalist'": datalist$prime, 
    dd: dd, 
    "dd'": dd$prime, 
    del: del, 
    "del'": del$prime, 
    details: details, 
    "details'": details$prime, 
    dfn: dfn, 
    "dfn'": dfn$prime, 
    dialog: dialog, 
    "dialog'": dialog$prime, 
    div: div, 
    "div'": div$prime, 
    dl: dl, 
    "dl'": dl$prime, 
    dt: dt, 
    "dt'": dt$prime, 
    em: em, 
    "em'": em$prime, 
    embed: embed, 
    "embed'": embed$prime, 
    fieldset: fieldset, 
    "fieldset'": fieldset$prime, 
    figcaption: figcaption, 
    "figcaption'": figcaption$prime, 
    figure: figure, 
    "figure'": figure$prime, 
    footer: footer, 
    "footer'": footer$prime, 
    form: form, 
    "form'": form$prime, 
    h1: h1, 
    "h1'": h1$prime, 
    h2: h2, 
    "h2'": h2$prime, 
    h3: h3, 
    "h3'": h3$prime, 
    h4: h4, 
    "h4'": h4$prime, 
    h5: h5, 
    "h5'": h5$prime, 
    h6: h6, 
    "h6'": h6$prime, 
    head: head, 
    "head'": head$prime, 
    header: header, 
    "header'": header$prime, 
    hr: hr, 
    "hr'": hr$prime, 
    html: html, 
    "html'": html$prime, 
    i: i, 
    "i'": i$prime, 
    iframe: iframe, 
    "iframe'": iframe$prime, 
    img: img, 
    "img'": img$prime, 
    input: input, 
    "input'": input$prime, 
    ins: ins, 
    "ins'": ins$prime, 
    kbd: kbd, 
    "kbd'": kbd$prime, 
    keygen: keygen, 
    "keygen'": keygen$prime, 
    label: label, 
    "label'": label$prime, 
    legend: legend, 
    "legend'": legend$prime, 
    li: li, 
    "li'": li$prime, 
    link: link, 
    "link'": link$prime, 
    main: main, 
    "main'": main$prime, 
    map: map, 
    "map'": map$prime, 
    mark: mark, 
    "mark'": mark$prime, 
    menu: menu, 
    "menu'": menu$prime, 
    menuitem: menuitem, 
    "menuitem'": menuitem$prime, 
    meta: meta, 
    "meta'": meta$prime, 
    meter: meter, 
    "meter'": meter$prime, 
    mkDOM: mkDOM, 
    nav: nav, 
    "nav'": nav$prime, 
    noscript: noscript, 
    "noscript'": noscript$prime, 
    object: object, 
    "object'": object$prime, 
    ol: ol, 
    "ol'": ol$prime, 
    optgroup: optgroup, 
    "optgroup'": optgroup$prime, 
    option: option, 
    "option'": option$prime, 
    output: output, 
    "output'": output$prime, 
    p: p, 
    "p'": p$prime, 
    param: param, 
    "param'": param$prime, 
    picture: picture, 
    "picture'": picture$prime, 
    pre: pre, 
    "pre'": pre$prime, 
    progress: progress, 
    "progress'": progress$prime, 
    q: q, 
    "q'": q$prime, 
    rp: rp, 
    "rp'": rp$prime, 
    rt: rt, 
    "rt'": rt$prime, 
    ruby: ruby, 
    "ruby'": ruby$prime, 
    s: s, 
    "s'": s$prime, 
    samp: samp, 
    "samp'": samp$prime, 
    script: script, 
    "script'": script$prime, 
    section: section, 
    "section'": section$prime, 
    select: select, 
    "select'": select$prime, 
    small: small, 
    "small'": small$prime, 
    source: source, 
    "source'": source$prime, 
    span: span, 
    "span'": span$prime, 
    strong: strong, 
    "strong'": strong$prime, 
    style: style, 
    "style'": style$prime, 
    sub: sub, 
    "sub'": sub$prime, 
    summary: summary, 
    "summary'": summary$prime, 
    sup: sup, 
    "sup'": sup$prime, 
    table: table, 
    "table'": table$prime, 
    tbody: tbody, 
    "tbody'": tbody$prime, 
    td: td, 
    "td'": td$prime, 
    text: text, 
    textarea: textarea, 
    "textarea'": textarea$prime, 
    tfoot: tfoot, 
    "tfoot'": tfoot$prime, 
    th: th, 
    "th'": th$prime, 
    thead: thead, 
    "thead'": thead$prime, 
    time: time, 
    "time'": time$prime, 
    title: title, 
    "title'": title$prime, 
    tr: tr, 
    "tr'": tr$prime, 
    track: track, 
    "track'": track$prime, 
    u: u, 
    "u'": u$prime, 
    ul: ul, 
    "ul'": ul$prime, 
    "var": $$var, 
    "var'": var$prime, 
    video: video, 
    "video'": video$prime, 
    wbr: wbr, 
    "wbr'": wbr$prime
};

},{"../React":204,"../React.DOM.Props":198,"../Unsafe.Coerce":223}],200:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_MonadPlus = require("../Control.MonadPlus");
var Data_Array = require("../Data.Array");
var Data_Either = require("../Data.Either");
var Data_StrMap = require("../Data.StrMap");
var Data_Maybe = require("../Data.Maybe");
var Data_String = require("../Data.String");
var Data_String_Regex = require("../Data.String.Regex");
var Data_String_Regex_Flags = require("../Data.String.Regex.Flags");
var Data_Tuple = require("../Data.Tuple");
var Data_Traversable = require("../Data.Traversable");
var Partial_Unsafe = require("../Partial.Unsafe");
var React_Router_Types = require("../React.Router.Types");
var Data_Function = require("../Data.Function");
var Data_Foldable = require("../Data.Foldable");
var Control_Bind = require("../Control.Bind");
var Control_MonadZero = require("../Control.MonadZero");
var Data_Ord = require("../Data.Ord");
var Control_Apply = require("../Control.Apply");
var Data_Functor = require("../Data.Functor");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Category = require("../Control.Category");
var Data_Eq = require("../Data.Eq");
var splitPath = function (v) {
    if (v === "/") {
        return [ "" ];
    };
    return Data_String.split("/")(v);
};
var split = function (url) {
    var reg = Data_Either.fromRight()(Data_String_Regex.regex("(?=[?#])")(Data_String_Regex_Flags.global));
    return Data_String_Regex.split(reg)(url);
};
var parseQuery = function (decode) {
    return function (str) {
        var parts = Data_Array.fromFoldable(Data_Foldable.foldableArray)(Data_String.split("&")(str));
        var part2tuple = function (inp) {
            var keyVal = Data_String.split("=")(inp);
            return Control_Bind.bind(Data_Maybe.bindMaybe)(Control_MonadZero.guard(Data_Maybe.monadZeroMaybe)(Data_Array.length(keyVal) <= 2))(function () {
                return Control_Apply.apply(Data_Maybe.applyMaybe)(Data_Functor.map(Data_Maybe.functorMaybe)(Data_Tuple.Tuple.create)(Data_Functor.map(Data_Maybe.functorMaybe)(decode)(Data_Array.head(keyVal))))(Data_Functor.map(Data_Maybe.functorMaybe)(decode)(Data_Array.index(keyVal)(1)));
            });
        };
        return Data_Functor.map(Data_Maybe.functorMaybe)(Data_StrMap.fromFoldable(Data_Foldable.foldableArray))(Data_Traversable.traverse(Data_Traversable.traversableArray)(Data_Maybe.applicativeMaybe)(part2tuple)(parts));
    };
};
var parse = function (decode) {
    return function (url) {
        var go = function (r) {
            return function (p) {
                var $7 = Data_String.take(1)(p);
                if ($7 === "?") {
                    var $8 = parseQuery(decode)(Data_String.drop(1)(p));
                    if ($8 instanceof Data_Maybe.Nothing) {
                        return r;
                    };
                    if ($8 instanceof Data_Maybe.Just) {
                        var $9 = {};
                        for (var $10 in r) {
                            if ({}.hasOwnProperty.call(r, $10)) {
                                $9[$10] = r[$10];
                            };
                        };
                        $9.query = Data_Semigroup.append(Data_StrMap.semigroupStrMap(Data_Semigroup.semigroupString))(r.query)($8.value0);
                        return $9;
                    };
                    throw new Error("Failed pattern match at React.Router.Parser line 48, column 20 - line 50, column 61: " + [ $8.constructor.name ]);
                };
                if ($7 === "#") {
                    var $13 = {};
                    for (var $14 in r) {
                        if ({}.hasOwnProperty.call(r, $14)) {
                            $13[$14] = r[$14];
                        };
                    };
                    $13.hash = decode(Data_String.drop(1)(p));
                    return $13;
                };
                var $16 = {};
                for (var $17 in r) {
                    if ({}.hasOwnProperty.call(r, $17)) {
                        $16[$17] = r[$17];
                    };
                };
                $16.path = Data_Semigroup.append(Data_Semigroup.semigroupArray)(r.path)(Data_Functor.map(Data_Functor.functorArray)(function ($29) {
                    return React_Router_Types.PathPart(decode($29));
                })(splitPath(p)));
                return $16;
            };
        };
        return Data_Foldable.foldl(Data_Foldable.foldableArray)(go)({
            path: [  ], 
            query: Data_StrMap.empty, 
            hash: ""
        })(split(url));
    };
};
var match = function (pat) {
    return function (url) {
        var patPath = (parse(Control_Category.id(Control_Category.categoryFn))(pat)).path;
        var wrap = function (args) {
            return Data_Maybe.Just.create(new Data_Tuple.Tuple((function () {
                var $19 = {};
                for (var $20 in url) {
                    if ({}.hasOwnProperty.call(url, $20)) {
                        $19[$20] = url[$20];
                    };
                };
                $19.path = Data_Array.drop(Data_Array.length(patPath))(url.path);
                return $19;
            })(), new React_Router_Types.RouteData(args, url.query, url.hash)));
        };
        var go = function (__copy_ps) {
            return function (__copy_args) {
                var ps = __copy_ps;
                var args = __copy_args;
                tco: while (true) {
                    var tail = Data_Array.tail(ps);
                    var head = Data_Array.head(ps);
                    if (head instanceof Data_Maybe.Nothing) {
                        return new Data_Maybe.Just(args);
                    };
                    if (head instanceof Data_Maybe.Just) {
                        var $23 = Data_String.take(1)(head.value0.value0);
                        if ($23 === ":") {
                            var __tco_ps = Data_Maybe.maybe([  ])(Control_Category.id(Control_Category.categoryFn))(tail);
                            var __tco_args = Data_Semigroup.append(Data_StrMap.semigroupStrMap(Data_Semigroup.semigroupString))(args)(Data_StrMap.singleton(Data_String.drop(1)(head.value0.value0))(head.value0.value1));
                            ps = __tco_ps;
                            args = __tco_args;
                            continue tco;
                        };
                        var $24 = head.value0.value0 === head.value0.value1;
                        if ($24) {
                            var __tco_ps = Data_Maybe.maybe([  ])(Control_Category.id(Control_Category.categoryFn))(tail);
                            var __tco_args = args;
                            ps = __tco_ps;
                            args = __tco_args;
                            continue tco;
                        };
                        if (!$24) {
                            return Data_Maybe.Nothing.value;
                        };
                        throw new Error("Failed pattern match at React.Router.Parser line 70, column 41 - line 72, column 56: " + [ $24.constructor.name ]);
                    };
                    throw new Error("Failed pattern match at React.Router.Parser line 66, column 13 - line 72, column 56: " + [ head.constructor.name ]);
                };
            };
        };
        var $28 = Data_Array.length(patPath) > Data_Array.length(url.path);
        if ($28) {
            return Data_Maybe.Nothing.value;
        };
        if (!$28) {
            return Data_Maybe.maybe(Data_Maybe.Nothing.value)(wrap)(go(Data_Array.zip(patPath)(url.path))(Data_StrMap.empty));
        };
        throw new Error("Failed pattern match at React.Router.Parser line 57, column 5 - line 59, column 71: " + [ $28.constructor.name ]);
    };
};
module.exports = {
    match: match, 
    parse: parse
};

},{"../Control.Apply":36,"../Control.Bind":40,"../Control.Category":41,"../Control.MonadPlus":83,"../Control.MonadZero":84,"../Control.Semigroupoid":88,"../Data.Array":93,"../Data.Either":111,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.Maybe":140,"../Data.Ord":154,"../Data.Semigroup":161,"../Data.StrMap":169,"../Data.String":176,"../Data.String.Regex":172,"../Data.String.Regex.Flags":170,"../Data.Traversable":178,"../Data.Tuple":179,"../Partial.Unsafe":193,"../Prelude":196,"../React.Router.Types":201}],201:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Comonad_Cofree = require("../Control.Comonad.Cofree");
var Data_Maybe = require("../Data.Maybe");
var Data_Newtype = require("../Data.Newtype");
var Data_StrMap = require("../Data.StrMap");
var Data_Tuple = require("../Data.Tuple");
var Optic_Types = require("../Optic.Types");
var Optic_Lens = require("../Optic.Lens");
var React = require("../React");
var Data_Show = require("../Data.Show");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Eq = require("../Data.Eq");
var PathPart = function (x) {
    return x;
};
var Hash = function (x) {
    return x;
};
var RouteData = (function () {
    function RouteData(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    RouteData.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new RouteData(value0, value1, value2);
            };
        };
    };
    return RouteData;
})();
var IndexRoute = (function () {
    function IndexRoute(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    IndexRoute.create = function (value0) {
        return function (value1) {
            return new IndexRoute(value0, value1);
        };
    };
    return IndexRoute;
})();
var Route = (function () {
    function Route(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    Route.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new Route(value0, value1, value2);
            };
        };
    };
    return Route;
})();
var withoutIndex = function (r) {
    return function (rs) {
        return Control_Comonad_Cofree.mkCofree(new Data_Tuple.Tuple(r, Data_Maybe.Nothing.value))(rs);
    };
};
var showRoute = new Data_Show.Show(function (v) {
    return "<Route \"" + (v.value0 + ("\" \"" + (v.value1 + "\">")));
});
var showPathPart = new Data_Show.Show(function (v) {
    return "(PathPart \"" + (v + "\")");
});
var showHash = new Data_Show.Show(function (v) {
    return "Hash " + v;
});
var showRouteData = new Data_Show.Show(function (v) {
    return "RouteData " + (" " + (Data_Show.show(Data_StrMap.showStrMap(Data_Show.showString))(v.value0) + (" " + (Data_Show.show(Data_StrMap.showStrMap(Data_Show.showString))(v.value1) + (" " + Data_Show.show(showHash)(v.value2))))));
});
var routeUrlLens = function (dictFunctor) {
    return Optic_Lens.lens(function (v) {
        return v.value1;
    })(function (v) {
        return function (url) {
            return new Route(v.value0, url, v.value2);
        };
    })(dictFunctor);
};
var routeIdLens = function (dictFunctor) {
    return Optic_Lens.lens(function (v) {
        return v.value0;
    })(function (v) {
        return function (id) {
            return new Route(id, v.value1, v.value2);
        };
    })(dictFunctor);
};
var routeClassLens = function (dictFunctor) {
    return Optic_Lens.lens(function (v) {
        return v.value2;
    })(function (v) {
        return function (cls) {
            return new Route(v.value0, v.value1, cls);
        };
    })(dictFunctor);
};
var newTypePathPart = new Data_Newtype.Newtype(function (n) {
    return n;
}, PathPart);
var newHash = new Data_Newtype.Newtype(function (n) {
    return n;
}, Hash);
var eqPathPart = new Data_Eq.Eq(function (x) {
    return function (y) {
        return x === y;
    };
});
var eqHash = new Data_Eq.Eq(function (x) {
    return function (y) {
        return x === y;
    };
});
module.exports = {
    Hash: Hash, 
    IndexRoute: IndexRoute, 
    PathPart: PathPart, 
    Route: Route, 
    RouteData: RouteData, 
    routeClassLens: routeClassLens, 
    routeIdLens: routeIdLens, 
    routeUrlLens: routeUrlLens, 
    withoutIndex: withoutIndex, 
    newTypePathPart: newTypePathPart, 
    showPathPart: showPathPart, 
    eqPathPart: eqPathPart, 
    newHash: newHash, 
    showHash: showHash, 
    eqHash: eqHash, 
    showRouteData: showRouteData, 
    showRoute: showRoute
};

},{"../Control.Comonad.Cofree":42,"../Data.Eq":113,"../Data.Maybe":140,"../Data.Newtype":149,"../Data.Semigroup":161,"../Data.Show":165,"../Data.StrMap":169,"../Data.Tuple":179,"../Optic.Lens":190,"../Optic.Types":191,"../Prelude":196,"../React":204}],202:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Data_Array = require("../Data.Array");
var Control_Comonad_Cofree = require("../Control.Comonad.Cofree");
var Data_Foldable = require("../Data.Foldable");
var Data_Maybe = require("../Data.Maybe");
var Data_Tuple = require("../Data.Tuple");
var Global = require("../Global");
var Optic_Getter = require("../Optic.Getter");
var Prelude = require("../Prelude");
var React = require("../React");
var React_Router_Parser = require("../React.Router.Parser");
var React_Router_Types = require("../React.Router.Types");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Eq = require("../Data.Eq");
var Data_Function = require("../Data.Function");
var Data_Const = require("../Data.Const");
var Data_Functor = require("../Data.Functor");
var shake = function (cof) {
    var is404 = function (url) {
        return function (tail) {
            return Data_Array.length(url.path) !== 0 && Data_Array.length(tail) === 0;
        };
    };
    var go = function (cofs) {
        var f = function (cofs1) {
            return function (cof1) {
                var $4 = Control_Comonad_Cofree.head(cof1);
                if ($4 instanceof Data_Maybe.Nothing) {
                    return cofs1;
                };
                if ($4 instanceof Data_Maybe.Just) {
                    var tail_ = go(Control_Comonad_Cofree.tail(cof1));
                    var $5 = is404($4.value0.url)(tail_);
                    if ($5) {
                        return cofs1;
                    };
                    if (!$5) {
                        return Data_Array.snoc(cofs1)(Control_Comonad_Cofree.mkCofree($4.value0)(tail_));
                    };
                    throw new Error("Failed pattern match at React.Router line 39, column 33 - line 41, column 71: " + [ $5.constructor.name ]);
                };
                throw new Error("Failed pattern match at React.Router line 35, column 22 - line 41, column 71: " + [ $4.constructor.name ]);
            };
        };
        return Data_Foldable.foldl(Data_Foldable.foldableArray)(f)([  ])(cofs);
    };
    var $7 = Control_Comonad_Cofree.head(cof);
    if ($7 instanceof Data_Maybe.Nothing) {
        return Data_Maybe.Nothing.value;
    };
    if ($7 instanceof Data_Maybe.Just) {
        var tail_ = go(Control_Comonad_Cofree.tail(cof));
        var $8 = is404($7.value0.url)(tail_);
        if ($8) {
            return Data_Maybe.Nothing.value;
        };
        if (!$8) {
            return Data_Maybe.Just.create(Control_Comonad_Cofree.mkCofree($7.value0)(go(Control_Comonad_Cofree.tail(cof))));
        };
        throw new Error("Failed pattern match at React.Router line 25, column 11 - line 27, column 44: " + [ $8.constructor.name ]);
    };
    throw new Error("Failed pattern match at React.Router line 21, column 13 - line 27, column 44: " + [ $7.constructor.name ]);
};
var matchRouter = function (url) {
    return function (router) {
        var check = function (route) {
            return function (url1) {
                var $10 = React_Router_Parser.match(Optic_Getter.view(React_Router_Types.routeUrlLens(Data_Const.functorConst))(route))(url1);
                if ($10 instanceof Data_Maybe.Nothing) {
                    return Data_Maybe.Nothing.value;
                };
                if ($10 instanceof Data_Maybe.Just) {
                    return new Data_Maybe.Just({
                        url: $10.value0.value0, 
                        props: {
                            id: route.value0, 
                            args: $10.value0.value1.value0, 
                            query: $10.value0.value1.value1, 
                            hash: $10.value0.value1.value2
                        }
                    });
                };
                throw new Error("Failed pattern match at React.Router line 57, column 7 - line 61, column 91: " + [ $10.constructor.name ]);
            };
        };
        var go = function (url1) {
            return function (r) {
                var head_ = Control_Comonad_Cofree.head(r);
                var indexRoute = Data_Tuple.snd(head_);
                var route = Data_Tuple.fst(head_);
                var $21 = check(route)(url1);
                if ($21 instanceof Data_Maybe.Just) {
                    return Control_Comonad_Cofree.mkCofree(new Data_Maybe.Just({
                        url: $21.value0.url, 
                        props: $21.value0.props, 
                        route: route, 
                        indexRoute: indexRoute
                    }))(Data_Functor.map(Data_Functor.functorArray)(go($21.value0.url))(Control_Comonad_Cofree.tail(r)));
                };
                if ($21 instanceof Data_Maybe.Nothing) {
                    return Control_Comonad_Cofree.mkCofree(Data_Maybe.Nothing.value)([  ]);
                };
                throw new Error("Failed pattern match at React.Router line 65, column 16 - line 69, column 36: " + [ $21.constructor.name ]);
            };
        };
        var $25 = shake(go(url)(router));
        if ($25 instanceof Data_Maybe.Nothing) {
            return Data_Maybe.Nothing.value;
        };
        if ($25 instanceof Data_Maybe.Just) {
            return new Data_Maybe.Just($25.value0);
        };
        throw new Error("Failed pattern match at React.Router line 47, column 26 - line 49, column 27: " + [ $25.constructor.name ]);
    };
};
var runRouter = function (urlStr) {
    return function (router) {
        var createRouteElement = function (cof) {
            var asElement = function (v) {
                return function (v1) {
                    if (v1.length === 0) {
                        var addIndex = function (children) {
                            return Data_Maybe.maybe(children)(function (v2) {
                                return Data_Array.cons(React.createElement(v2.value1)((function () {
                                    var $30 = {};
                                    for (var $31 in v.props) {
                                        if ({}.hasOwnProperty.call(v.props, $31)) {
                                            $30[$31] = v["props"][$31];
                                        };
                                    };
                                    $30.id = v2.value0;
                                    return $30;
                                })())([  ]))(children);
                            })(v.indexRoute);
                        };
                        return React.createElement(v.route.value2)(v.props)(addIndex([  ]));
                    };
                    return React.createElement(v.route.value2)(v.props)(Data_Functor.map(Data_Functor.functorArray)(createRouteElement)(v1));
                };
            };
            return asElement(Control_Comonad_Cofree.head(cof))(Control_Comonad_Cofree.tail(cof));
        };
        return Data_Functor.map(Data_Maybe.functorMaybe)(createRouteElement)(matchRouter(React_Router_Parser.parse(Global["decodeURIComponent"])(urlStr))(router));
    };
};
module.exports = {
    matchRouter: matchRouter, 
    runRouter: runRouter, 
    shake: shake
};

},{"../Control.Comonad.Cofree":42,"../Data.Array":93,"../Data.Const":109,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Maybe":140,"../Data.Tuple":179,"../Global":186,"../Optic.Getter":187,"../Prelude":196,"../React":204,"../React.Router.Parser":200,"../React.Router.Types":201}],203:[function(require,module,exports){
/* global exports */
"use strict";

var React = require("react");

function getProps(this_) {
  return function(){
    return this_.props;
  };
}
exports.getProps = getProps;

function getRefs(this_) {
  return function(){
    return this_.refs;
  };
}
exports.getRefs = getRefs;

function childrenToArray(children) {
  var result = [];

  React.Children.forEach(children, function(child){
    result.push(child);
  });

  return result;
}
exports.childrenToArray = childrenToArray;

function getChildren(this_) {
  return function(){
    var children = this_.props.children;

    var result = childrenToArray(children);

    return result;
  };
}
exports.getChildren = getChildren;

function writeState(this_) {
  return function(state){
    return function(){
      this_.setState({
        state: state
      });
      return state;
    };
  };
}
exports.writeState = writeState;

function writeStateWithCallback(this_, cb) {
  return function(state){
    return function(cb){
      return function() {
        this_.setState({
          state: state
        }, cb);
        return state;
      };
    };
  };
}
exports.writeStateWithCallback = writeStateWithCallback;

function readState(this_) {
  return function(){
    return this_.state.state;
  };
}
exports.readState = readState;

function transformState(this_){
  return function(update){
    return function(){
      this_.setState(function(old, props){
        return {state: update(old.state)};
      });
    };
  };
}
exports.transformState = transformState;

function createClass(spec) {
  var result = {
    displayName: spec.displayName,
    render: function(){
      return spec.render(this)();
    },
    getInitialState: function(){
      return {
        state: spec.getInitialState(this)()
      };
    },
    componentWillMount: function(){
      return spec.componentWillMount(this)();
    },
    componentDidMount: function(){
      return spec.componentDidMount(this)();
    },
    componentWillReceiveProps: function(nextProps){
      return spec.componentWillReceiveProps(this)(nextProps)();
    },
    shouldComponentUpdate: function(nextProps, nextState){
      return spec.shouldComponentUpdate(this)(nextProps)(nextState.state)();
    },
    componentWillUpdate: function(nextProps, nextState){
      return spec.componentWillUpdate(this)(nextProps)(nextState.state)();
    },
    componentDidUpdate: function(prevProps, prevState){
      return spec.componentDidUpdate(this)(prevProps)(prevState.state)();
    },
    componentWillUnmount: function(){
      return spec.componentWillUnmount(this)();
    }
  };

  return React.createClass(result);
}
exports.createClass = createClass;

function handle(f) {
  return function(e){
    return f(e)();
  };
};
exports.handle = handle;

function createElement(class_) {
  return function(props){
    return function(children){
      return React.createElement.apply(React, [class_, props].concat(children));
    };
  };
}
exports.createElement = createElement;
exports.createElementTagName = createElement;

function createElementDynamic(class_) {
  return function(props) {
    return function(children){
      return React.createElement(class_, props, children);
    };
  };
};
exports.createElementDynamic = createElementDynamic;
exports.createElementTagNameDynamic = createElementDynamic;

function createFactory(class_) {
  return React.createFactory(class_);
}
exports.createFactory = createFactory;

function preventDefault(event) {
  return function() { return event.preventDefault();}
};
exports.preventDefault = preventDefault;

function stopPropagation(event) {
  return function() { return event.stopPropagation();}
};
exports.stopPropagation = stopPropagation;

},{"react":31}],204:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Unsafe_Coerce = require("../Unsafe.Coerce");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var spec$prime = function (getInitialState) {
    return function (renderFn) {
        return {
            render: renderFn, 
            displayName: "", 
            getInitialState: getInitialState, 
            componentWillMount: function (v) {
                return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
            }, 
            componentDidMount: function (v) {
                return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
            }, 
            componentWillReceiveProps: function (v) {
                return function (v1) {
                    return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
                };
            }, 
            shouldComponentUpdate: function (v) {
                return function (v1) {
                    return function (v2) {
                        return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(true);
                    };
                };
            }, 
            componentWillUpdate: function (v) {
                return function (v1) {
                    return function (v2) {
                        return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
                    };
                };
            }, 
            componentDidUpdate: function (v) {
                return function (v1) {
                    return function (v2) {
                        return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
                    };
                };
            }, 
            componentWillUnmount: function (v) {
                return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
            }
        };
    };
};
var spec = function (state) {
    return spec$prime(function (v) {
        return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(state);
    });
};
var createClassStateless = Unsafe_Coerce.unsafeCoerce;
var createClassStateless$prime = function (k) {
    return createClassStateless(function (props) {
        return k(props)($foreign.childrenToArray((Unsafe_Coerce.unsafeCoerce(props)).children));
    });
};
module.exports = {
    createClassStateless: createClassStateless, 
    "createClassStateless'": createClassStateless$prime, 
    spec: spec, 
    "spec'": spec$prime, 
    createClass: $foreign.createClass, 
    createElement: $foreign.createElement, 
    createElementDynamic: $foreign.createElementDynamic, 
    createElementTagName: $foreign.createElementTagName, 
    createElementTagNameDynamic: $foreign.createElementTagNameDynamic, 
    createFactory: $foreign.createFactory, 
    getChildren: $foreign.getChildren, 
    getProps: $foreign.getProps, 
    getRefs: $foreign.getRefs, 
    handle: $foreign.handle, 
    preventDefault: $foreign.preventDefault, 
    readState: $foreign.readState, 
    stopPropagation: $foreign.stopPropagation, 
    transformState: $foreign.transformState, 
    writeState: $foreign.writeState, 
    writeStateWithCallback: $foreign.writeStateWithCallback
};

},{"../Control.Applicative":34,"../Control.Monad.Eff":66,"../Data.Unit":183,"../Prelude":196,"../Unsafe.Coerce":223,"./foreign":203}],205:[function(require,module,exports){
"use strict";

exports._runKarma = function(run) {
  return function() {
    window.__karma__.start = (function(karma) {
      return function() {
        run(function(args) {
          return function() {
            return karma.info(args)
          }
        })(function(args) {
          return function() {
            return karma.result(args)
          }
        })(window.__karma__.complete)()
      }
    })(window.__karma__)
  }
}

},{}],206:[function(require,module,exports){
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Data_Array = require("../Data.Array");
var Test_Unit_Output_Simple = require("../Test.Unit.Output.Simple");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("../Control.Monad.Aff.AVar");
var Control_Monad_Aff_Console = require("../Control.Monad.Aff.Console");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Eff_Console = require("../Control.Monad.Eff.Console");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Control_Monad_Free = require("../Control.Monad.Free");
var Control_Monad_State = require("../Control.Monad.State");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_List = require("../Data.List");
var Test_Router = require("../Test.Router");
var Test_Router_Parser = require("../Test.Router.Parser");
var Test_Unit = require("../Test.Unit");
var Test_Unit_Console = require("../Test.Unit.Console");
var Test_Unit_Main = require("../Test.Unit.Main");
var Control_Bind = require("../Control.Bind");
var Control_Monad_State_Trans = require("../Control.Monad.State.Trans");
var Data_Identity = require("../Data.Identity");
var Control_Monad_State_Class = require("../Control.Monad.State.Class");
var Data_Semiring = require("../Data.Semiring");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var Data_Function = require("../Data.Function");
var Data_List_Types = require("../Data.List.Types");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var countTests = function (tst) {
    var $2 = Control_Monad_Free.resume(Test_Unit.functorTestF)(tst);
    if ($2 instanceof Data_Either.Left && $2.value0 instanceof Test_Unit.TestGroup) {
        return Control_Bind.bind(Control_Monad_State_Trans.bindStateT(Data_Identity.monadIdentity))(countTests($2.value0.value0.value1))(function () {
            return countTests($2.value0.value1);
        });
    };
    if ($2 instanceof Data_Either.Left && $2.value0 instanceof Test_Unit.TestUnit) {
        return Control_Bind.bind(Control_Monad_State_Trans.bindStateT(Data_Identity.monadIdentity))(Control_Monad_State_Class.modify(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))(Data_Semiring.add(Data_Semiring.semiringInt)(1)))(function () {
            return countTests($2.value0.value2);
        });
    };
    if ($2 instanceof Data_Either.Right) {
        return Control_Applicative.pure(Control_Monad_State_Trans.applicativeStateT(Data_Identity.monadIdentity))(Data_Unit.unit);
    };
    throw new Error("Failed pattern match at Test.Main line 37, column 3 - line 46, column 28: " + [ $2.constructor.name ]);
};
var runKarma = (function () {
    var createRunner = function (suite) {
        return function (info) {
            return function (result) {
                return function (complete) {
                    var total = Control_Monad_State.execState(countTests(suite))(0);
                    var karmaRunner = function (tst) {
                        var runSuiteItem = function (path) {
                            return function (v) {
                                if (v instanceof Test_Unit.TestGroup) {
                                    return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit);
                                };
                                if (v instanceof Test_Unit.TestUnit) {
                                    return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(v.value1))(function (v1) {
                                        return Control_Bind.bind(Control_Monad_Aff.bindAff)((function () {
                                            if (v1 instanceof Data_Either.Right) {
                                                return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(result({
                                                    id: v.value0, 
                                                    suite: Data_Foldable.foldl(Data_List_Types.foldableList)(Data_Array.snoc)([  ])(path), 
                                                    description: v.value0, 
                                                    log: [  ], 
                                                    success: true, 
                                                    skipped: false
                                                }));
                                            };
                                            if (v1 instanceof Data_Either.Left) {
                                                return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(result({
                                                    id: v.value0, 
                                                    suite: Data_Foldable.foldl(Data_List_Types.foldableList)(Data_Array.snoc)([  ])(path), 
                                                    description: v.value0, 
                                                    log: [ Control_Monad_Eff_Exception.message(v1.value0) ], 
                                                    success: false, 
                                                    skipped: false
                                                }));
                                            };
                                            throw new Error("Failed pattern match at Test.Main line 67, column 13 - line 71, column 148: " + [ v1.constructor.name ]);
                                        })())(function () {
                                            return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit);
                                        });
                                    });
                                };
                                throw new Error("Failed pattern match at Test.Main line 63, column 11 - line 64, column 22: " + [ path.constructor.name, v.constructor.name ]);
                            };
                        };
                        return Test_Unit.walkSuite(runSuiteItem)(tst);
                    };
                    return function __do() {
                        info({
                            total: total
                        })();
                        Test_Unit_Main.run(Test_Unit_Main.runTestWith(karmaRunner)(suite))();
                        return complete();
                    };
                };
            };
        };
    };
    return function ($26) {
        return $foreign._runKarma(createRunner($26));
    };
})();
var main = runKarma(Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Router_Parser.testSuite)(function () {
    return Test_Router.testSuite;
}));
module.exports = {
    countTests: countTests, 
    main: main, 
    runKarma: runKarma, 
    _runKarma: $foreign._runKarma
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Aff":51,"../Control.Monad.Aff.AVar":46,"../Control.Monad.Aff.Console":47,"../Control.Monad.Eff":66,"../Control.Monad.Eff.Class":54,"../Control.Monad.Eff.Console":56,"../Control.Monad.Eff.Exception":58,"../Control.Monad.Free":69,"../Control.Monad.State":78,"../Control.Monad.State.Class":76,"../Control.Monad.State.Trans":77,"../Control.Semigroupoid":88,"../Data.Array":93,"../Data.Either":111,"../Data.Foldable":118,"../Data.Function":121,"../Data.Identity":132,"../Data.List":137,"../Data.List.Types":136,"../Data.Semiring":163,"../Data.Unit":183,"../Prelude":196,"../Test.Router":209,"../Test.Router.Parser":207,"../Test.Unit":220,"../Test.Unit.Console":212,"../Test.Unit.Main":214,"../Test.Unit.Output.Simple":216,"./foreign":205}],207:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Maybe = require("../Data.Maybe");
var Data_StrMap = require("../Data.StrMap");
var Data_Tuple = require("../Data.Tuple");
var Test_Unit = require("../Test.Unit");
var Test_Unit_Assert = require("../Test.Unit.Assert");
var React_Router_Types = require("../React.Router.Types");
var React_Router_Parser = require("../React.Router.Parser");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Free = require("../Control.Monad.Free");
var Data_Function = require("../Data.Function");
var Control_Category = require("../Control.Category");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Data_Eq = require("../Data.Eq");
var Data_Foldable = require("../Data.Foldable");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var testSuite = Test_Unit.suite("Router.Parser")(Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.suite("parse")(Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("parse path")((function () {
    var urlR = React_Router_Parser.parse(Control_Category.id(Control_Category.categoryFn))("/user/1/settings");
    var expected = [ "", "user", "1", "settings" ];
    return Test_Unit_Assert.assert("path for url " + ("/user/1/settings" + (": " + Data_Show.show(Data_Show.showArray(React_Router_Types.showPathPart))(urlR.path))))(Data_Eq.eq(Data_Eq.eqArray(React_Router_Types.eqPathPart))(urlR.path)(expected));
})()))(function () {
    return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("parse query")((function () {
        var urlR = React_Router_Parser.parse(Control_Category.id(Control_Category.categoryFn))("?a=1&b=2");
        var expected = Data_StrMap.fromFoldable(Data_Foldable.foldableArray)([ new Data_Tuple.Tuple("a", "1"), new Data_Tuple.Tuple("b", "2") ]);
        return Test_Unit_Assert.assert("query for url " + ("?a=1&b=2" + (": " + Data_Show.show(Data_StrMap.showStrMap(Data_Show.showString))(urlR.query))))(Data_Eq.eq(Data_StrMap.eqStrMap(Data_Eq.eqString))(urlR.query)(expected));
    })()))(function () {
        return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("join queries")((function () {
            var urlR = React_Router_Parser.parse(Control_Category.id(Control_Category.categoryFn))("?a=1?b=2");
            var expected = Data_StrMap.fromFoldable(Data_Foldable.foldableArray)([ new Data_Tuple.Tuple("a", "1"), new Data_Tuple.Tuple("b", "2") ]);
            return Test_Unit_Assert.assert("query for url " + ("?a=1?b=2" + (": " + Data_Show.show(Data_StrMap.showStrMap(Data_Show.showString))(urlR.query))))(Data_Eq.eq(Data_StrMap.eqStrMap(Data_Eq.eqString))(urlR.query)(expected));
        })()))(function () {
            return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("parse hash")((function () {
                var urlR = React_Router_Parser.parse(Control_Category.id(Control_Category.categoryFn))("#hash");
                return Test_Unit_Assert.assert("hash for url " + ("#hash" + (": " + Data_Show.show(React_Router_Types.showHash)(urlR.hash))))(Data_Eq.eq(React_Router_Types.eqHash)(urlR.hash)("hash"));
            })()))(function () {
                return Test_Unit.test("parse path query and hash")((function () {
                    var urlR = React_Router_Parser.parse(Control_Category.id(Control_Category.categoryFn))("user/1/settings?a=1&b=2#hash");
                    var expected = {
                        path: [ "user", "1", "settings" ], 
                        query: Data_StrMap.fromFoldable(Data_Foldable.foldableArray)([ new Data_Tuple.Tuple("a", "1"), new Data_Tuple.Tuple("b", "2") ]), 
                        hash: "hash"
                    };
                    return Control_Bind.bind(Control_Monad_Aff.bindAff)(Test_Unit_Assert.assert("parsing url " + ("user/1/settings?a=1&b=2#hash" + (" returned path: " + Data_Show.show(Data_Show.showArray(React_Router_Types.showPathPart))(urlR.path))))(Data_Eq.eq(Data_Eq.eqArray(React_Router_Types.eqPathPart))(urlR.path)(expected.path)))(function () {
                        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Test_Unit_Assert.assert("parsing url " + ("user/1/settings?a=1&b=2#hash" + (" returned query: " + Data_Show.show(Data_StrMap.showStrMap(Data_Show.showString))(urlR.query))))(Data_Eq.eq(Data_StrMap.eqStrMap(Data_Eq.eqString))(urlR.query)(expected.query)))(function () {
                            return Test_Unit_Assert.assert("parsing url " + ("user/1/settings?a=1&b=2#hash" + (" returned hash: " + Data_Show.show(React_Router_Types.showHash)(urlR.hash))))(Data_Eq.eq(React_Router_Types.eqHash)(urlR.hash)(expected.hash));
                        });
                    });
                })());
            });
        });
    });
})))(function () {
    return Test_Unit.suite("match")(Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("match paths")((function () {
        var match_ = function (pat) {
            return function (url) {
                return function (expected) {
                    var urlR = React_Router_Parser.parse(Control_Category.id(Control_Category.categoryFn))(url);
                    var res = React_Router_Parser.match(pat)(urlR);
                    if (res instanceof Data_Maybe.Nothing) {
                        return Test_Unit.failure("pattern <" + (pat + ("> did not match url <" + (url + ">"))));
                    };
                    if (res instanceof Data_Maybe.Just) {
                        return Test_Unit_Assert.assert("got wrong args for url: " + (url + (": " + Data_Show.show(React_Router_Types.showRouteData)(res.value0.value1))))(Data_Eq.eq(Data_StrMap.eqStrMap(Data_Eq.eqString))(res.value0.value1.value0)(expected));
                    };
                    throw new Error("Failed pattern match at Test.Router.Parser line 61, column 28 - line 64, column 86: " + [ res.constructor.name ]);
                };
            };
        };
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(match_("/")("/")(Data_StrMap.empty))(function () {
            return Control_Bind.bind(Control_Monad_Aff.bindAff)(match_("/")("/home")(Data_StrMap.empty))(function () {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(match_("user/:user_id")("user/2")(Data_StrMap.singleton("user_id")("2")))(function () {
                    return Control_Bind.bind(Control_Monad_Aff.bindAff)(match_("user")("user/2")(Data_StrMap.empty))(function () {
                        return match_("/user/:user_id/book/:book_id")("/user/1/book/2")(Data_StrMap.fromFoldable(Data_Foldable.foldableArray)([ new Data_Tuple.Tuple("user_id", "1"), new Data_Tuple.Tuple("book_id", "2") ]));
                    });
                });
            });
        });
    })()))(function () {
        return Test_Unit.test("do not match paths")((function () {
            var doNotMatch = function (pat) {
                return function (url) {
                    var urlR = React_Router_Parser.parse(Control_Category.id(Control_Category.categoryFn))(url);
                    var res = React_Router_Parser.match(pat)(urlR);
                    if (res instanceof Data_Maybe.Nothing) {
                        return Test_Unit.success;
                    };
                    if (res instanceof Data_Maybe.Just) {
                        return Test_Unit.failure("url <" + (url + ("> matched <" + (pat + ">"))));
                    };
                    throw new Error("Failed pattern match at Test.Router.Parser line 76, column 28 - line 79, column 17: " + [ res.constructor.name ]);
                };
            };
            return Control_Bind.bind(Control_Monad_Aff.bindAff)(doNotMatch("/user/:user_id/lunch/:lunch_id")("/user/1/book/2"))(function () {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(doNotMatch("/user")("user"))(function () {
                    return Control_Bind.bind(Control_Monad_Aff.bindAff)(doNotMatch("/user")("user/"))(function () {
                        return Control_Bind.bind(Control_Monad_Aff.bindAff)(doNotMatch("/user/")("/user"))(function () {
                            return doNotMatch("/user/:user_id")("user/23");
                        });
                    });
                });
            });
        })());
    }));
}));
module.exports = {
    testSuite: testSuite
};

},{"../Control.Bind":40,"../Control.Category":41,"../Control.Monad.Aff":51,"../Control.Monad.Free":69,"../Data.Eq":113,"../Data.Foldable":118,"../Data.Function":121,"../Data.Maybe":140,"../Data.Semigroup":161,"../Data.Show":165,"../Data.StrMap":169,"../Data.Tuple":179,"../Prelude":196,"../React.Router.Parser":200,"../React.Router.Types":201,"../Test.Unit":220,"../Test.Unit.Assert":210}],208:[function(require,module,exports){
"use strict"

exports.getIds = function getIds(element) {
  var ids = []
  ids.push(element.props.id);
  var children = element.props.children
  if (Array.isArray(children))
    children.forEach(function(el) {
      Array.prototype.push.apply(ids, getIds(el))
    })
  else if (!!children) {
      Array.prototype.push.apply(ids, getIds(children))
  }
  return ids
}

/*
 * exports.getChildren = function(element) {
 *   var children = element.props.children
 *   if (Array.isArray(children))
 *     return children
 *   else
 *     return [children]
 * }
 */

function toArray(o) {
  if (Array.isArray(o))
    return o
  if (!!o)
    return [o]
  else
    return []
}

exports.isLastIndexRoute = function(element) {
  return (function _search(element) {
    var children = toArray(element.props.children)
    if (children.length !== 0)
      // traverse all branches
      return children.map(function(child) {
        return _search(child)
      }).every(function(x) {return x})
    else
      return element.type.displayName === "indexRouteClass"
  })(element)
}

exports.countIndexRoutes = function(element) {
  var cnt = 0
  return (function _search(element) {
    if (element.type.displayName === "indexRouteClass")
      cnt += 1
    var children = toArray(element.props.children)
    // traverse whole tree
    children.forEach(function(child) {
      _search(child)
    })
    return cnt
  })(element)
}

function getComponentById(id, element) {
  if (element.props.id === id)
    return element
  var children = toArray(element.props.children)
  for (var i=0, len=children.length; i < len; i++) {
    var element = getComponentById(id, children[i]);
    if (element)
      return element
  }
  return null
}


exports._getProp = function(propName) {
  return function getArgs(Just) {
    return function(Nothing) {
      return function(id) {
        return function(element) {
          var element = getComponentById(id, element)
          if (!element)
            return Nothing
          if (element.props[propName])
            return Just(element.props[propName])
          else
            return Nothing
        }
      }
    }
  }
}

exports._eqCofree = function eqCofree (eq) {
  return function _eqCofree(cofA) {
    return function (cofB) {
      if (!eq(cofA.value0)(cofB.value0))
        return false

      var tailA = cofA.value1.thunk()
      var tailB = cofB.value1.thunk()
      if (tailA.length != tailB.length)
        return false

      for (var i=0, len=tailA.length; i < len; i++) {
        var x = tailA[i]
        var y = tailB[i]
        if (!_eqCofree(x)(y)) {
          return false
        }
      }
      return true
    }
  }
}

exports._showCofree = function showCofree(show) {
  return function (cof) {
    return (function _show(cof, level) {
      var indent = Array.apply(Array, Array(level)).map(function(el) {return "  "}).join("")
      var str = show(cof.value0) + "\n" + indent + "  ["
      var tail = cof.value1.thunk().forEach(function(cof_, idx) {str = str + (idx === 0 ? " " : ("\n" + indent + "  , ")) +  _show(cof_, level + 1)})
      return str + "\n" + indent + "  ]"
    })(cof, 0)
  }
}

},{}],209:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Data_Array = require("../Data.Array");
var Data_StrMap = require("../Data.StrMap");
var Control_Comonad_Cofree = require("../Control.Comonad.Cofree");
var Control_Monad_Eff_Console = require("../Control.Monad.Eff.Console");
var Control_Monad_Eff_Unsafe = require("../Control.Monad.Eff.Unsafe");
var Data_Maybe = require("../Data.Maybe");
var Data_Tuple = require("../Data.Tuple");
var Global = require("../Global");
var Partial_Unsafe = require("../Partial.Unsafe");
var React = require("../React");
var React_DOM = require("../React.DOM");
var React_DOM_Props = require("../React.DOM.Props");
var React_Router = require("../React.Router");
var React_Router_Parser = require("../React.Router.Parser");
var React_Router_Types = require("../React.Router.Types");
var Test_Unit = require("../Test.Unit");
var Test_Unit_Assert = require("../Test.Unit.Assert");
var Unsafe_Coerce = require("../Unsafe.Coerce");
var Prelude = require("../Prelude");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Control_Category = require("../Control.Category");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Applicative = require("../Control.Applicative");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Control_Monad_Free = require("../Control.Monad.Free");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Data_Show = require("../Data.Show");
var unsafeGetChildren = function ($39) {
    return Control_Monad_Eff_Unsafe.unsafePerformEff(React.getChildren(Unsafe_Coerce.unsafeCoerce($39)));
};
var unsafeChildrenTree = function (el) {
    var getId = function (el_) {
        return (function (v) {
            return v.id;
        })(Unsafe_Coerce.unsafeCoerce(Control_Monad_Eff_Unsafe.unsafePerformEff(React.getProps(Unsafe_Coerce.unsafeCoerce(el_)))));
    };
    return Data_Functor.map(Control_Comonad_Cofree.functorCofree(Data_Functor.functorArray))(getId)(Control_Comonad_Cofree.unfoldCofree(Data_Functor.functorArray)(el)(Control_Category.id(Control_Category.categoryFn))(unsafeGetChildren));
};
var showChildrenTree = (function () {
    var showId = Control_Category.id(Control_Category.categoryFn);
    return $foreign._showCofree(showId);
})();
var routeClass2 = React.createClass(React.spec(0)(function ($$this) {
    return function __do() {
        var v = React.getProps($$this)();
        var v1 = React.getChildren($$this)();
        return React_DOM.div([ React_DOM_Props._id(v.id) ])(v1);
    };
}));
var routeClass = React.createClassStateless(function (props) {
    return React_DOM.div([ React_DOM_Props._id(props.id) ])([ React_DOM.text("route: " + props.id) ]);
});
var indexRouteClass = (function () {
    var clsSpec = React.spec(0)(function ($$this) {
        return function __do() {
            var v = React.getProps($$this)();
            return React_DOM.div([ React_DOM_Props._id(v.id), React_DOM_Props.className("index") ])([  ]);
        };
    });
    return React.createClass((function () {
        var $10 = {};
        for (var $11 in clsSpec) {
            if ({}.hasOwnProperty.call(clsSpec, $11)) {
                $10[$11] = clsSpec[$11];
            };
        };
        $10.displayName = "indexRouteClass";
        return $10;
    })());
})();
var idTree = Data_Functor.map(Control_Comonad_Cofree.functorCofree(Data_Functor.functorArray))(function (v) {
    return {
        id: v.props.id, 
        indexId: Data_Maybe.maybe(Data_Maybe.Nothing.value)(function (v1) {
            return new Data_Maybe.Just(v1.value0);
        })(v.indexRoute)
    };
});
var getQuery = $foreign._getProp("query")(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var getArgs = $foreign._getProp("args")(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var eqCofreeS = $foreign._eqCofree(function (a) {
    return function (b) {
        return a === b;
    };
});
var eqCofree = $foreign._eqCofree(function (a) {
    return function (b) {
        return a.id === b.id && Data_Eq.eq(Data_Maybe.eqMaybe(Data_Eq.eqString))(a.indexId)(b.indexId);
    };
});
var testSuite = Test_Unit.suite("Router")(Test_Unit.suite("runRouter")((function () {
    var router3 = React_Router_Types.withoutIndex(new React_Router_Types.Route("main", "/", routeClass2))([ Control_Comonad_Cofree.mkCofree(new Data_Tuple.Tuple(new React_Router_Types.Route("home", "home", routeClass2), Data_Maybe.Just.create(new React_Router_Types.IndexRoute("home-index", indexRouteClass))))([ Control_Comonad_Cofree.mkCofree(new Data_Tuple.Tuple(new React_Router_Types.Route("users", "users", routeClass2), Data_Maybe.Just.create(new React_Router_Types.IndexRoute("users-index", indexRouteClass))))([  ]), React_Router_Types.withoutIndex(new React_Router_Types.Route("user", "users/:user_id", routeClass2))([  ]) ]) ]);
    var router2 = React_Router_Types.withoutIndex(new React_Router_Types.Route("main", "/", routeClass2))([ React_Router_Types.withoutIndex(new React_Router_Types.Route("home", "home", routeClass2))([ React_Router_Types.withoutIndex(new React_Router_Types.Route("user", "user", routeClass2))([  ]) ]), React_Router_Types.withoutIndex(new React_Router_Types.Route("user-settings", "home/user/settings", routeClass))([  ]) ]);
    var router = React_Router_Types.withoutIndex(new React_Router_Types.Route("main", "/", routeClass))([ React_Router_Types.withoutIndex(new React_Router_Types.Route("home", "home", routeClass))([  ]), Control_Comonad_Cofree.mkCofree(new Data_Tuple.Tuple(new React_Router_Types.Route("user", "user/:user_id", routeClass), Data_Maybe.Just.create(new React_Router_Types.IndexRoute("user-index", indexRouteClass))))([ React_Router_Types.withoutIndex(new React_Router_Types.Route("book", "books/:book_id", routeClass))([ React_Router_Types.withoutIndex(new React_Router_Types.Route("pages", "pages", routeClass))([ React_Router_Types.withoutIndex(new React_Router_Types.Route("page", ":page_id", routeClass))([  ]) ]) ]) ]), React_Router_Types.withoutIndex(new React_Router_Types.Route("user-settings", "user/:user_id/settings", routeClass))([  ]) ]);
    var checkTree = function (router_) {
        return function (url) {
            return function (expected) {
                var $21 = Data_Functor.map(Data_Maybe.functorMaybe)(idTree)(React_Router.matchRouter(React_Router_Parser.parse(Global["decodeURIComponent"])(url))(router_));
                if ($21 instanceof Data_Maybe.Nothing) {
                    return Test_Unit.failure("router did't found <" + (url + ">"));
                };
                if ($21 instanceof Data_Maybe.Just) {
                    return Test_Unit_Assert.assert("trees do not match")(eqCofree($21.value0)(expected));
                };
                throw new Error("Failed pattern match at Test.Router line 149, column 19 - line 152, column 78: " + [ $21.constructor.name ]);
            };
        };
    };
    var checkElementTree = function (router_) {
        return function (url) {
            return function (expected) {
                var $23 = React_Router.runRouter(url)(router_);
                if ($23 instanceof Data_Maybe.Nothing) {
                    return Test_Unit.failure("router didn't found <" + (url + ">"));
                };
                if ($23 instanceof Data_Maybe.Just) {
                    var chTree = unsafeChildrenTree($23.value0);
                    return Test_Unit_Assert.assert("children trees are not equal: got\x0a" + (showChildrenTree(chTree) + ("\x0aexpected\x0a" + showChildrenTree(expected))))(eqCofreeS(chTree)(expected));
                };
                throw new Error("Failed pattern match at Test.Router line 140, column 19 - line 146, column 54: " + [ $23.constructor.name ]);
            };
        };
    };
    return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("should find patterns")(Control_Bind.bind(Control_Monad_Aff.bindAff)(checkTree(router)("/")(Control_Comonad_Cofree.mkCofree({
        id: "main", 
        indexId: Data_Maybe.Nothing.value
    })([  ])))(function () {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(checkElementTree(router)("/")(Control_Comonad_Cofree.mkCofree("main")([  ])))(function () {
            return Control_Bind.bind(Control_Monad_Aff.bindAff)(checkTree(router)("/home")(Control_Comonad_Cofree.mkCofree({
                id: "main", 
                indexId: Data_Maybe.Nothing.value
            })([ Control_Comonad_Cofree.mkCofree({
                id: "home", 
                indexId: Data_Maybe.Nothing.value
            })([  ]) ])))(function () {
                return checkElementTree(router)("/home")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("home")([  ]) ]));
            });
        });
    })))(function () {
        return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("should mount index route when present")(Control_Bind.bind(Control_Monad_Aff.bindAff)(checkTree(router)("/user/2")(Control_Comonad_Cofree.mkCofree({
            id: "main", 
            indexId: Data_Maybe.Nothing.value
        })([ Control_Comonad_Cofree.mkCofree({
            id: "user", 
            indexId: new Data_Maybe.Just("user-index")
        })([  ]) ])))(function () {
            return checkElementTree(router)("/user/2")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("user")([ Control_Comonad_Cofree.mkCofree("user-index")([  ]) ]) ]));
        })))(function () {
            return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("should not mount index route when the url goes deeper")(Control_Bind.bind(Control_Monad_Aff.bindAff)(checkTree(router)("/user/2/books/1")(Control_Comonad_Cofree.mkCofree({
                id: "main", 
                indexId: Data_Maybe.Nothing.value
            })([ Control_Comonad_Cofree.mkCofree({
                id: "user", 
                indexId: new Data_Maybe.Just("user-index")
            })([ Control_Comonad_Cofree.mkCofree({
                id: "book", 
                indexId: Data_Maybe.Nothing.value
            })([  ]) ]) ])))(function () {
                return checkElementTree(router)("/user/2/books/1")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("user")([ Control_Comonad_Cofree.mkCofree("book")([  ]) ]) ]));
            })))(function () {
                return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("should find a long path")(Control_Bind.bind(Control_Monad_Aff.bindAff)(checkTree(router)("/user/2/books/1/pages/100")(Control_Comonad_Cofree.mkCofree({
                    id: "main", 
                    indexId: Data_Maybe.Nothing.value
                })([ Control_Comonad_Cofree.mkCofree({
                    id: "user", 
                    indexId: new Data_Maybe.Just("user-index")
                })([ Control_Comonad_Cofree.mkCofree({
                    id: "book", 
                    indexId: Data_Maybe.Nothing.value
                })([ Control_Comonad_Cofree.mkCofree({
                    id: "pages", 
                    indexId: Data_Maybe.Nothing.value
                })([ Control_Comonad_Cofree.mkCofree({
                    id: "page", 
                    indexId: Data_Maybe.Nothing.value
                })([  ]) ]) ]) ]) ])))(function () {
                    return checkElementTree(router)("/user/2/books/1/pages/100")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("user")([ Control_Comonad_Cofree.mkCofree("book")([ Control_Comonad_Cofree.mkCofree("pages")([ Control_Comonad_Cofree.mkCofree("page")([  ]) ]) ]) ]) ]));
                })))(function () {
                    return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("mount various paths at the same time")((function () {
                        var router1 = React_Router_Types.withoutIndex(new React_Router_Types.Route("main", "/", routeClass))([ React_Router_Types.withoutIndex(new React_Router_Types.Route("users", "users", routeClass))([  ]), React_Router_Types.withoutIndex(new React_Router_Types.Route("books", "users", routeClass))([  ]) ]);
                        return Control_Bind.bind(Control_Monad_Aff.bindAff)(checkTree(router1)("/users")(Control_Comonad_Cofree.mkCofree({
                            id: "main", 
                            indexId: Data_Maybe.Nothing.value
                        })([ Control_Comonad_Cofree.mkCofree({
                            id: "users", 
                            indexId: Data_Maybe.Nothing.value
                        })([  ]), Control_Comonad_Cofree.mkCofree({
                            id: "books", 
                            indexId: Data_Maybe.Nothing.value
                        })([  ]) ])))(function () {
                            return checkElementTree(router1)("/users")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("users")([  ]), Control_Comonad_Cofree.mkCofree("books")([  ]) ]));
                        });
                    })()))(function () {
                        return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("mount various paths with indexes")((function () {
                            var router1 = React_Router_Types.withoutIndex(new React_Router_Types.Route("main", "/", routeClass))([ Control_Comonad_Cofree.mkCofree(new Data_Tuple.Tuple(new React_Router_Types.Route("users", "users", routeClass), Data_Maybe.Just.create(new React_Router_Types.IndexRoute("users-index", indexRouteClass))))([  ]), Control_Comonad_Cofree.mkCofree(new Data_Tuple.Tuple(new React_Router_Types.Route("books", "users", routeClass), Data_Maybe.Just.create(new React_Router_Types.IndexRoute("books-index", indexRouteClass))))([  ]) ]);
                            return Control_Bind.bind(Control_Monad_Aff.bindAff)(checkTree(router1)("/users")(Control_Comonad_Cofree.mkCofree({
                                id: "main", 
                                indexId: Data_Maybe.Nothing.value
                            })([ Control_Comonad_Cofree.mkCofree({
                                id: "users", 
                                indexId: new Data_Maybe.Just("users-index")
                            })([  ]), Control_Comonad_Cofree.mkCofree({
                                id: "books", 
                                indexId: new Data_Maybe.Just("books-index")
                            })([  ]) ])))(function () {
                                return checkElementTree(router1)("/users")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("users")([ Control_Comonad_Cofree.mkCofree("users-index")([  ]) ]), Control_Comonad_Cofree.mkCofree("books")([ Control_Comonad_Cofree.mkCofree("books-index")([  ]) ]) ]));
                            });
                        })()))(function () {
                            return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("404 pages")(Control_Bind.bind(Control_Monad_Aff.bindAff)((function () {
                                var $25 = React_Router.runRouter("/user/2/404-page")(router);
                                if ($25 instanceof Data_Maybe.Nothing) {
                                    return Test_Unit.success;
                                };
                                if ($25 instanceof Data_Maybe.Just) {
                                    return Test_Unit.failure("router found \"/user/2/404-page\": " + Data_Show.show(Data_Show.showArray(Data_Show.showString))($foreign.getIds($25.value0)));
                                };
                                throw new Error("Failed pattern match at Test.Router line 239, column 19 - line 241, column 102: " + [ $25.constructor.name ]);
                            })())(function () {
                                return Control_Bind.bind(Control_Monad_Aff.bindAff)((function () {
                                    var $27 = React_Router.runRouter("/user/2/books/10/404-page")(router);
                                    if ($27 instanceof Data_Maybe.Nothing) {
                                        return Test_Unit.success;
                                    };
                                    if ($27 instanceof Data_Maybe.Just) {
                                        return Test_Unit.failure("router found \"/user/2/bookes/10/404-page\": " + Data_Show.show(Data_Show.showArray(Data_Show.showString))($foreign.getIds($27.value0)));
                                    };
                                    throw new Error("Failed pattern match at Test.Router line 244, column 19 - line 246, column 112: " + [ $27.constructor.name ]);
                                })())(function () {
                                    var $29 = React_Router.runRouter("/404-page/main")(router);
                                    if ($29 instanceof Data_Maybe.Nothing) {
                                        return Test_Unit.success;
                                    };
                                    if ($29 instanceof Data_Maybe.Just) {
                                        return Test_Unit.failure("router found \"/404-page/main\": " + Data_Show.show(Data_Show.showArray(Data_Show.showString))($foreign.getIds($29.value0)));
                                    };
                                    throw new Error("Failed pattern match at Test.Router line 249, column 19 - line 251, column 100: " + [ $29.constructor.name ]);
                                });
                            })))(function () {
                                return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("should find a route if a less speicalized one hides it")(Control_Bind.bind(Control_Monad_Aff.bindAff)(checkElementTree(router)("/user/2/settings")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("user-settings")([  ]) ])))(function () {
                                    return checkElementTree(router)("/user/2/books/3")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("user")([ Control_Comonad_Cofree.mkCofree("book")([  ]) ]) ]));
                                })))(function () {
                                    return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("find a route in a different branch")(checkElementTree(router2)("/home/user/settings")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("user-settings")([  ]) ]))))(function () {
                                        return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("should mount children")(Control_Bind.bind(Control_Monad_Aff.bindAff)(checkTree(router2)("/home")(Control_Comonad_Cofree.mkCofree({
                                            id: "main", 
                                            indexId: Data_Maybe.Nothing.value
                                        })([ Control_Comonad_Cofree.mkCofree({
                                            id: "home", 
                                            indexId: Data_Maybe.Nothing.value
                                        })([  ]) ])))(function () {
                                            return Control_Bind.bind(Control_Monad_Aff.bindAff)(checkElementTree(router2)("/home")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("home")([  ]) ])))(function () {
                                                var $31 = React_Router.runRouter("/home")(router2);
                                                if ($31 instanceof Data_Maybe.Nothing) {
                                                    return Test_Unit.failure("router2 didn't found </home>");
                                                };
                                                if ($31 instanceof Data_Maybe.Just) {
                                                    var len = Data_Array.length(unsafeGetChildren($31.value0));
                                                    return Test_Unit_Assert.assert("should have 1 child while found: " + (Data_Show.show(Data_Show.showInt)(len) + (" children " + Data_Show.show(Data_Show.showArray(Data_Show.showString))($foreign.getIds($31.value0)))))(len === 1);
                                                };
                                                throw new Error("Failed pattern match at Test.Router line 277, column 19 - line 283, column 17: " + [ $31.constructor.name ]);
                                            });
                                        })))(function () {
                                            return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("should mount index route")(Control_Bind.bind(Control_Monad_Aff.bindAff)(checkElementTree(router3)("/home/users")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("home")([ Control_Comonad_Cofree.mkCofree("users")([ Control_Comonad_Cofree.mkCofree("users-index")([  ]) ]) ]) ])))(function () {
                                                var $33 = React_Router.runRouter("/home/users")(router3);
                                                if ($33 instanceof Data_Maybe.Nothing) {
                                                    return Test_Unit.failure("router3 didn't found </home/user>");
                                                };
                                                if ($33 instanceof Data_Maybe.Just) {
                                                    return Test_Unit_Assert.assert("the last child is not an index route ")($foreign.isLastIndexRoute($33.value0));
                                                };
                                                throw new Error("Failed pattern match at Test.Router line 289, column 19 - line 291, column 103: " + [ $33.constructor.name ]);
                                            })))(function () {
                                                return Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.test("should mount only one index route")((function () {
                                                    var $35 = React_Router.runRouter("/home/users")(router3);
                                                    if ($35 instanceof Data_Maybe.Nothing) {
                                                        return Test_Unit.failure("router3 didn't found </home/user>");
                                                    };
                                                    if ($35 instanceof Data_Maybe.Just) {
                                                        var cnt = $foreign.countIndexRoutes($35.value0);
                                                        return Test_Unit_Assert.assert("there should by only one index route mounted, but found: " + Data_Show.show(Data_Show.showInt)(cnt))(cnt === 1);
                                                    };
                                                    throw new Error("Failed pattern match at Test.Router line 294, column 19 - line 301, column 17: " + [ $35.constructor.name ]);
                                                })()))(function () {
                                                    return Test_Unit.test("should not mount index route when it is not configured")(Control_Bind.bind(Control_Monad_Aff.bindAff)(checkElementTree(router3)("/home/users/1")(Control_Comonad_Cofree.mkCofree("main")([ Control_Comonad_Cofree.mkCofree("home")([ Control_Comonad_Cofree.mkCofree("user")([  ]) ]) ])))(function () {
                                                        var $37 = React_Router.runRouter("/home/users/1")(router3);
                                                        if ($37 instanceof Data_Maybe.Nothing) {
                                                            return Test_Unit.failure("router3 didn't found </home/users/1>");
                                                        };
                                                        if ($37 instanceof Data_Maybe.Just) {
                                                            var cnt = $foreign.countIndexRoutes($37.value0);
                                                            return Test_Unit_Assert.assert("there should be no index route mounted, but found: " + Data_Show.show(Data_Show.showInt)(cnt))(cnt === 0);
                                                        };
                                                        throw new Error("Failed pattern match at Test.Router line 306, column 19 - line 311, column 113: " + [ $37.constructor.name ]);
                                                    }));
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
})()));
module.exports = {
    testSuite: testSuite
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Category":41,"../Control.Comonad.Cofree":42,"../Control.Monad.Aff":51,"../Control.Monad.Eff":66,"../Control.Monad.Eff.Console":56,"../Control.Monad.Eff.Unsafe":64,"../Control.Monad.Free":69,"../Control.Semigroupoid":88,"../Data.Array":93,"../Data.Eq":113,"../Data.Function":121,"../Data.Functor":127,"../Data.HeytingAlgebra":131,"../Data.Maybe":140,"../Data.Semigroup":161,"../Data.Show":165,"../Data.StrMap":169,"../Data.Tuple":179,"../Global":186,"../Partial.Unsafe":193,"../Prelude":196,"../React":204,"../React.DOM":199,"../React.DOM.Props":198,"../React.Router":202,"../React.Router.Parser":200,"../React.Router.Types":201,"../Test.Unit":220,"../Test.Unit.Assert":210,"../Unsafe.Coerce":223,"./foreign":208}],210:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Data_Either = require("../Data.Either");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Test_Unit = require("../Test.Unit");
var Control_Bind = require("../Control.Bind");
var Data_Function = require("../Data.Function");
var Data_Eq = require("../Data.Eq");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var expectFailure = function (reason) {
    return function (t) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(t))(function (v) {
            return Data_Either.either(Data_Function["const"](Test_Unit.success))(Data_Function["const"](Test_Unit.failure(reason)))(v);
        });
    };
};
var equal$prime = function (dictEq) {
    return function (reason) {
        return function (expected) {
            return function (actual) {
                var $11 = Data_Eq.eq(dictEq)(expected)(actual);
                if ($11) {
                    return Test_Unit.success;
                };
                if (!$11) {
                    return Test_Unit.failure(reason);
                };
                throw new Error("Failed pattern match at Test.Unit.Assert line 45, column 3 - line 45, column 57: " + [ $11.constructor.name ]);
            };
        };
    };
};
var equal = function (dictEq) {
    return function (dictShow) {
        return function (expected) {
            return function (actual) {
                var $12 = Data_Eq.eq(dictEq)(expected)(actual);
                if ($12) {
                    return Test_Unit.success;
                };
                if (!$12) {
                    return Test_Unit.failure("expected " + (Data_Show.show(dictShow)(expected) + (", got " + Data_Show.show(dictShow)(actual))));
                };
                throw new Error("Failed pattern match at Test.Unit.Assert line 37, column 3 - line 39, column 31: " + [ $12.constructor.name ]);
            };
        };
    };
};
var shouldEqual = function (dictEq) {
    return function (dictShow) {
        return Data_Function.flip(equal(dictEq)(dictShow));
    };
};
var assertFalse = function (v) {
    return function (v1) {
        if (!v1) {
            return Test_Unit.success;
        };
        if (v1) {
            return Test_Unit.failure(v);
        };
        throw new Error("Failed pattern match at Test.Unit.Assert line 24, column 1 - line 24, column 30: " + [ v.constructor.name, v1.constructor.name ]);
    };
};
var assert = function (v) {
    return function (v1) {
        if (v1) {
            return Test_Unit.success;
        };
        if (!v1) {
            return Test_Unit.failure(v);
        };
        throw new Error("Failed pattern match at Test.Unit.Assert line 18, column 1 - line 18, column 24: " + [ v.constructor.name, v1.constructor.name ]);
    };
};
module.exports = {
    assert: assert, 
    assertFalse: assertFalse, 
    equal: equal, 
    "equal'": equal$prime, 
    expectFailure: expectFailure, 
    shouldEqual: shouldEqual
};

},{"../Control.Bind":40,"../Control.Monad.Aff":51,"../Data.Either":111,"../Data.Eq":113,"../Data.Function":121,"../Data.Semigroup":161,"../Data.Show":165,"../Prelude":196,"../Test.Unit":220}],211:[function(require,module,exports){
(function (process){
/* global exports */
"use strict";

// module Test.Unit.Console

var hasStderr;
try { hasStderr = !!process.stderr; } catch (e) { hasStderr = false; }
exports.hasStderr = hasStderr;

var hasColours = (function() {
  if (typeof process === "undefined") {
    return false;
  }
  if (process.stdout && !process.stdout.isTTY) {
    return false;
  }
  if (process.platform === "win32" || "COLORTERM" in process.env) {
    return true;
  }
  if (process.env.TERM === "dumb") {
    return false;
  }
  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
    return true;
  }
  return false;
})();
exports.hasColours = hasColours;

exports.consoleLog = function consoleLog(s) {
  return function() {
    console.log(s);
  };
};
exports.consoleError = function consoleError(s) {
  return function() {
    console.error(s);
  };
};
exports.savePos = function savePos() {
  process.stderr.write("\x1b[s");
};
exports.restorePos = function restorePos() {
  process.stderr.write("\x1b[u");
};
exports.eraseLine = function eraseLine() {
  process.stderr.write("\x1b[K");
};
exports.print = function print(s) {
  return function() {
    process.stderr.write("\x1b[33m" + s + "\x1b[0m");
  };
};
exports.printLabel = function printLabel(s) {
  return function() {
    process.stderr.write("\x1b[33;1m" + s + "\x1b[0m");
  };
};
exports.printFail = function printFail(s) {
  return function() {
    process.stderr.write("\x1b[31;1m" + s + "\x1b[0m");
  };
};
exports.printPass = function printPass(s) {
  return function() {
    process.stderr.write("\x1b[32m" + s + "\x1b[0m");
  };
};

}).call(this,require('_process'))
},{"_process":1}],212:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Eff = require("../Control.Monad.Eff");
module.exports = {
    consoleError: $foreign.consoleError, 
    consoleLog: $foreign.consoleLog, 
    eraseLine: $foreign.eraseLine, 
    hasColours: $foreign.hasColours, 
    hasStderr: $foreign.hasStderr, 
    print: $foreign.print, 
    printFail: $foreign.printFail, 
    printLabel: $foreign.printLabel, 
    printPass: $foreign.printPass, 
    restorePos: $foreign.restorePos, 
    savePos: $foreign.savePos
};

},{"../Control.Monad.Eff":66,"../Prelude":196,"./foreign":211}],213:[function(require,module,exports){
(function (process){
// module Test.Unit.Main

exports.exit = function exit(rv) {
  return function() {
    try { process.exit(rv); } catch (e) {
      try { phantom.exit(rv); } catch (e) {}
    };
  };
};

}).call(this,require('_process'))
},{"_process":1}],214:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Test_Unit_Output_Fancy = require("../Test.Unit.Output.Fancy");
var Test_Unit_Output_Simple = require("../Test.Unit.Output.Simple");
var Test_Unit_Output_TAP = require("../Test.Unit.Output.TAP");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("../Control.Monad.Aff.AVar");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Eff_Console = require("../Control.Monad.Eff.Console");
var Data_List = require("../Data.List");
var Test_Unit = require("../Test.Unit");
var Test_Unit_Console = require("../Test.Unit.Console");
var Control_Bind = require("../Control.Bind");
var Data_Ord = require("../Data.Ord");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Function = require("../Data.Function");
var runTestWith = function (runner) {
    return function (suite) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Bind.bind(Control_Monad_Aff.bindAff)(runner(suite))(Test_Unit.collectResults))(function (v) {
            var errs = Test_Unit.keepErrors(v);
            var $4 = Data_List.length(errs) > 0;
            if ($4) {
                return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)($foreign.exit(1));
            };
            if (!$4) {
                return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit);
            };
            throw new Error("Failed pattern match at Test.Unit.Main line 38, column 3 - line 38, column 58: " + [ $4.constructor.name ]);
        });
    };
};
var run = function (e) {
    var successHandler = function (v) {
        return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
    };
    var errorHandler = function (v) {
        return $foreign.exit(1);
    };
    return function __do() {
        Control_Monad_Aff.runAff(errorHandler)(successHandler)(e)();
        return Data_Unit.unit;
    };
};
var runTest = function (suite) {
    var runner = (function () {
        if (Test_Unit_Output_TAP.requested) {
            return Test_Unit_Output_TAP.runTest;
        };
        if (!Test_Unit_Output_TAP.requested) {
            var $6 = Test_Unit_Console.hasStderr && Test_Unit_Console.hasColours;
            if ($6) {
                return Test_Unit_Output_Fancy.runTest;
            };
            if (!$6) {
                return Test_Unit_Output_Simple.runTest;
            };
            throw new Error("Failed pattern match at Test.Unit.Main line 45, column 23 - line 47, column 35: " + [ $6.constructor.name ]);
        };
        throw new Error("Failed pattern match at Test.Unit.Main line 43, column 18 - line 47, column 35: " + [ Test_Unit_Output_TAP.requested.constructor.name ]);
    })();
    return run(runTestWith(runner)(suite));
};
module.exports = {
    run: run, 
    runTest: runTest, 
    runTestWith: runTestWith, 
    exit: $foreign.exit
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Aff":51,"../Control.Monad.Aff.AVar":46,"../Control.Monad.Eff":66,"../Control.Monad.Eff.Class":54,"../Control.Monad.Eff.Console":56,"../Data.Function":121,"../Data.HeytingAlgebra":131,"../Data.List":137,"../Data.Ord":154,"../Data.Unit":183,"../Prelude":196,"../Test.Unit":220,"../Test.Unit.Console":212,"../Test.Unit.Output.Fancy":215,"../Test.Unit.Output.Simple":216,"../Test.Unit.Output.TAP":218,"./foreign":213}],215:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("../Control.Monad.Aff.AVar");
var Control_Monad_Eff_Class = require("../Control.Monad.Eff.Class");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_List = require("../Data.List");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Tuple = require("../Data.Tuple");
var Test_Unit = require("../Test.Unit");
var Test_Unit_Console = require("../Test.Unit.Console");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Ring = require("../Data.Ring");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_Semiring = require("../Data.Semiring");
var Data_List_Types = require("../Data.List.Types");
var Data_Show = require("../Data.Show");
var Control_Applicative = require("../Control.Applicative");
var indent = function (v) {
    if (v === 0) {
        return Data_Monoid.mempty(Data_Monoid.monoidString);
    };
    return "  " + indent(v - 1 | 0);
};
var indent$prime = function ($30) {
    return indent(Data_List.length($30));
};
var printLive = function (tst) {
    var runSuiteItem = function (path) {
        return function (v) {
            if (v instanceof Test_Unit.TestGroup) {
                return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(function __do() {
                    Test_Unit_Console.print(indent$prime(path))();
                    Test_Unit_Console.print("\u2192 Suite: ")();
                    Test_Unit_Console.printLabel(v.value0.value0)();
                    return Data_Functor["void"](Control_Monad_Eff.functorEff)(Test_Unit_Console.print("\x0a"))();
                });
            };
            if (v instanceof Test_Unit.TestUnit) {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(function __do() {
                    Test_Unit_Console.print(indent$prime(path))();
                    Test_Unit_Console.savePos();
                    Test_Unit_Console.print("\u2192 Running: ")();
                    Test_Unit_Console.printLabel(v.value0)();
                    return Test_Unit_Console.restorePos();
                }))(function () {
                    return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(v.value1))(function (v1) {
                        return Data_Functor["void"](Control_Monad_Aff.functorAff)((function () {
                            if (v1 instanceof Data_Either.Right) {
                                return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(function __do() {
                                    Test_Unit_Console.eraseLine();
                                    Test_Unit_Console.printPass("\u2713 Passed: ")();
                                    Test_Unit_Console.printLabel(v.value0)();
                                    return Test_Unit_Console.print("\x0a")();
                                });
                            };
                            if (v1 instanceof Data_Either.Left) {
                                return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(function __do() {
                                    Test_Unit_Console.eraseLine();
                                    Test_Unit_Console.printFail("\u2620 Failed: ")();
                                    Test_Unit_Console.printLabel(v.value0)();
                                    Test_Unit_Console.print(" because ")();
                                    Test_Unit_Console.printFail(Control_Monad_Eff_Exception.message(v1.value0))();
                                    return Test_Unit_Console.print("\x0a")();
                                });
                            };
                            throw new Error("Failed pattern match at Test.Unit.Output.Fancy line 43, column 14 - line 57, column 1: " + [ v1.constructor.name ]);
                        })());
                    });
                });
            };
            throw new Error("Failed pattern match at Test.Unit.Output.Fancy line 29, column 5 - line 35, column 5: " + [ path.constructor.name, v.constructor.name ]);
        };
    };
    return Test_Unit.walkSuite(runSuiteItem)(tst);
};
var printErrors = function (tests) {
    var printHeader = function (level) {
        return function (path) {
            var $20 = Data_List.uncons(path);
            if ($20 instanceof Data_Maybe.Nothing) {
                return Test_Unit_Console.print(indent(level));
            };
            if ($20 instanceof Data_Maybe.Just) {
                return function __do() {
                    Test_Unit_Console.print(indent(level) + ("In \"" + ($20.value0.head + "\":\x0a")))();
                    return printHeader(level + 1 | 0)($20.value0.tail)();
                };
            };
            throw new Error("Failed pattern match at Test.Unit.Output.Fancy line 75, column 34 - line 79, column 41: " + [ $20.constructor.name ]);
        };
    };
    var printError = function (err) {
        return function __do() {
            Data_Maybe.maybe(Test_Unit_Console.printFail(Control_Monad_Eff_Exception.message(err)))(Test_Unit_Console.printFail)(Control_Monad_Eff_Exception.stack(err))();
            return Test_Unit_Console.print("\x0a")();
        };
    };
    var printItem = function (v) {
        return function __do() {
            printHeader(0)(v.value0)();
            printError(v.value1)();
            return Test_Unit_Console.print("\x0a")();
        };
    };
    var list = Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_List_Types.foldableList)(printItem);
    return Control_Bind.bind(Control_Monad_Aff.bindAff)(Test_Unit.collectResults(tests))(function (v) {
        var errors = Test_Unit.keepErrors(v);
        return Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)((function () {
            var $28 = Data_List.length(errors);
            if ($28 === 0) {
                return Test_Unit_Console.printPass("\x0aAll " + (Data_Show.show(Data_Show.showInt)(Data_List.length(v)) + " tests passed! \ud83c\udf89\x0a\x0a"));
            };
            if ($28 === 1) {
                return function __do() {
                    Test_Unit_Console.printFail("\x0a1 test failed:\x0a\x0a")();
                    return list(errors)();
                };
            };
            return function __do() {
                Test_Unit_Console.printFail("\x0a" + (Data_Show.show(Data_Show.showInt)($28) + " tests failed:\x0a\x0a"))();
                return list(errors)();
            };
        })());
    });
};
var runTest = function (suite) {
    return Control_Bind.bind(Control_Monad_Aff.bindAff)(printLive(suite))(function (v) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(printErrors(v))(function () {
            return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v);
        });
    });
};
module.exports = {
    runTest: runTest
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Aff":51,"../Control.Monad.Aff.AVar":46,"../Control.Monad.Eff":66,"../Control.Monad.Eff.Class":54,"../Control.Monad.Eff.Exception":58,"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.List":137,"../Data.List.Types":136,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.Tuple":179,"../Prelude":196,"../Test.Unit":220,"../Test.Unit.Console":212}],216:[function(require,module,exports){
"use strict";
var Prelude = require("../Prelude");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("../Control.Monad.Aff.AVar");
var Control_Monad_Aff_Console = require("../Control.Monad.Aff.Console");
var Control_Monad_Eff_Console = require("../Control.Monad.Eff.Console");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_List = require("../Data.List");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Tuple = require("../Data.Tuple");
var Test_Unit = require("../Test.Unit");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Ring = require("../Data.Ring");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Control_Bind = require("../Control.Bind");
var Data_Function = require("../Data.Function");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var Data_Semiring = require("../Data.Semiring");
var Data_List_Types = require("../Data.List.Types");
var Data_Show = require("../Data.Show");
var indent = function (v) {
    if (v === 0) {
        return Data_Monoid.mempty(Data_Monoid.monoidString);
    };
    return "  " + indent(v - 1 | 0);
};
var indent$prime = function ($30) {
    return indent(Data_List.length($30));
};
var printLive = function (tst) {
    var runSuiteItem = function (path) {
        return function (v) {
            if (v instanceof Test_Unit.TestGroup) {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log(indent$prime(path) + ("- Suite: " + v.value0.value0)))(function () {
                    return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit);
                });
            };
            if (v instanceof Test_Unit.TestUnit) {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(v.value1))(function (v1) {
                    return Control_Bind.bind(Control_Monad_Aff.bindAff)((function () {
                        if (v1 instanceof Data_Either.Right) {
                            return Control_Monad_Aff_Console.log(indent$prime(path) + ("\u2713 Passed: " + v.value0));
                        };
                        if (v1 instanceof Data_Either.Left) {
                            return Control_Monad_Aff_Console.log(indent$prime(path) + ("\u2620 Failed: " + (v.value0 + (" because " + Control_Monad_Eff_Exception.message(v1.value0)))));
                        };
                        throw new Error("Failed pattern match at Test.Unit.Output.Simple line 34, column 7 - line 38, column 59: " + [ v1.constructor.name ]);
                    })())(function () {
                        return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit);
                    });
                });
            };
            throw new Error("Failed pattern match at Test.Unit.Output.Simple line 29, column 5 - line 31, column 16: " + [ path.constructor.name, v.constructor.name ]);
        };
    };
    return Test_Unit.walkSuite(runSuiteItem)(tst);
};
var printErrors = function (tests) {
    var printHeader = function (level) {
        return function (path) {
            var $20 = Data_List.uncons(path);
            if ($20 instanceof Data_Maybe.Nothing) {
                return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit);
            };
            if ($20 instanceof Data_Maybe.Just) {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log(indent(level) + ("In \"" + ($20.value0.head + "\":"))))(function () {
                    return printHeader(level + 1 | 0)($20.value0.tail);
                });
            };
            throw new Error("Failed pattern match at Test.Unit.Output.Simple line 59, column 34 - line 63, column 41: " + [ $20.constructor.name ]);
        };
    };
    var printError = function (err) {
        return Control_Monad_Aff_Console.log("Error: " + Data_Maybe.fromMaybe(Control_Monad_Eff_Exception.message(err))(Control_Monad_Eff_Exception.stack(err)));
    };
    var print = function (v) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(printHeader(0)(v.value0))(function () {
            return Control_Bind.bind(Control_Monad_Aff.bindAff)(printError(v.value1))(function () {
                return Control_Monad_Aff_Console.log("");
            });
        });
    };
    var list = Data_Foldable.traverse_(Control_Monad_Aff.applicativeAff)(Data_List_Types.foldableList)(print);
    return Control_Bind.bind(Control_Monad_Aff.bindAff)(Test_Unit.collectResults(tests))(function (v) {
        var errors = Test_Unit.keepErrors(v);
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log(""))(function () {
            var $28 = Data_List.length(errors);
            if ($28 === 0) {
                return Control_Monad_Aff_Console.log("All " + (Data_Show.show(Data_Show.showInt)(Data_List.length(v)) + " tests passed!\x0a"));
            };
            if ($28 === 1) {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log("1 test failed:\x0a"))(function () {
                    return list(errors);
                });
            };
            return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log(Data_Show.show(Data_Show.showInt)($28) + " tests failed:\x0a"))(function () {
                return list(errors);
            });
        });
    });
};
var runTest = function (suite) {
    return Control_Bind.bind(Control_Monad_Aff.bindAff)(printLive(suite))(function (v) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(printErrors(v))(function () {
            return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v);
        });
    });
};
module.exports = {
    runTest: runTest
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Aff":51,"../Control.Monad.Aff.AVar":46,"../Control.Monad.Aff.Console":47,"../Control.Monad.Eff.Console":56,"../Control.Monad.Eff.Exception":58,"../Control.Semigroupoid":88,"../Data.Either":111,"../Data.Foldable":118,"../Data.Function":121,"../Data.List":137,"../Data.List.Types":136,"../Data.Maybe":140,"../Data.Monoid":147,"../Data.Ring":159,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.Tuple":179,"../Data.Unit":183,"../Prelude":196,"../Test.Unit":220}],217:[function(require,module,exports){
(function (process){
//module Test.Unit.Output.TAP

exports.requested = (function() {
  try {
    if (process.argv.indexOf("--tap") >= 0
        || process.argv.indexOf("tap") >= 0) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
})();

}).call(this,require('_process'))
},{"_process":1}],218:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("../Control.Monad.Aff.AVar");
var Control_Monad_Aff_Console = require("../Control.Monad.Aff.Console");
var Control_Monad_Eff_Console = require("../Control.Monad.Eff.Console");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_List = require("../Data.List");
var Data_Maybe = require("../Data.Maybe");
var Data_String = require("../Data.String");
var Data_Tuple = require("../Data.Tuple");
var Test_Unit = require("../Test.Unit");
var Control_Applicative = require("../Control.Applicative");
var Data_Unit = require("../Data.Unit");
var Control_Bind = require("../Control.Bind");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Unfoldable = require("../Data.Unfoldable");
var Data_Show = require("../Data.Show");
var Data_List_Types = require("../Data.List.Types");
var printStack = function (err) {
    var $4 = Control_Monad_Eff_Exception.stack(err);
    if ($4 instanceof Data_Maybe.Nothing) {
        return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit);
    };
    if ($4 instanceof Data_Maybe.Just) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log("  stack: |-"))(function () {
            return Control_Monad_Aff_Console.log(Data_String.joinWith("\x0a")(Data_Functor.map(Data_Functor.functorArray)(Data_Semigroup.append(Data_Semigroup.semigroupString)("    "))(Data_String.split("\x0a")($4.value0))));
        });
    };
    throw new Error("Failed pattern match at Test.Unit.Output.TAP line 23, column 18 - line 27, column 67: " + [ $4.constructor.name ]);
};
var runTest = function (suite) {
    var run = function (v) {
        return function (v1) {
            return Data_Tuple.Tuple.create(v.value0 + 1 | 0)(Data_List.snoc(v.value1)((function () {
                var label = Data_String.joinWith(" / ")(Data_List.toUnfoldable(Data_Unfoldable.unfoldableArray)(v1.value0));
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(v1.value1))(function (v2) {
                    if (v2 instanceof Data_Either.Left) {
                        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log("not ok " + (Data_Show.show(Data_Show.showInt)(v.value0) + (" " + label))))(function () {
                            return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log("  ---"))(function () {
                                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log("  message: " + Control_Monad_Eff_Exception.message(v2.value0)))(function () {
                                    return Control_Bind.bind(Control_Monad_Aff.bindAff)(printStack(v2.value0))(function () {
                                        return Control_Monad_Aff_Console.log("  ...");
                                    });
                                });
                            });
                        });
                    };
                    if (v2 instanceof Data_Either.Right) {
                        return Control_Monad_Aff_Console.log("ok " + (Data_Show.show(Data_Show.showInt)(v.value0) + (" " + label)));
                    };
                    throw new Error("Failed pattern match at Test.Unit.Output.TAP line 40, column 7 - line 47, column 58: " + [ v2.constructor.name ]);
                });
            })()));
        };
    };
    return Control_Bind.bind(Control_Monad_Aff.bindAff)(Test_Unit.collectTests(suite))(function (v) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_Console.log("1.." + Data_Show.show(Data_Show.showInt)(Data_List.length(v))))(function () {
            var acts = Data_Foldable.foldl(Data_List_Types.foldableList)(run)(new Data_Tuple.Tuple(1, Data_List_Types.Nil.value))(v);
            return Control_Bind.bind(Control_Monad_Aff.bindAff)(Data_Foldable.sequence_(Control_Monad_Aff.applicativeAff)(Data_List_Types.foldableList)(Data_Tuple.snd(acts)))(function () {
                return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v);
            });
        });
    });
};
module.exports = {
    runTest: runTest, 
    requested: $foreign.requested
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Aff":51,"../Control.Monad.Aff.AVar":46,"../Control.Monad.Aff.Console":47,"../Control.Monad.Eff.Console":56,"../Control.Monad.Eff.Exception":58,"../Data.Either":111,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.List":137,"../Data.List.Types":136,"../Data.Maybe":140,"../Data.Semigroup":161,"../Data.Semiring":163,"../Data.Show":165,"../Data.String":176,"../Data.Tuple":179,"../Data.Unfoldable":181,"../Data.Unit":183,"../Prelude":196,"../Test.Unit":220,"./foreign":217}],219:[function(require,module,exports){
// module Test.Unit

exports.memoise = function(aff) {
  var fresh = true;
  var listeners = [];
  var resultValue = undefined;
  var failed = false;
  var done = false;
  return function(success, failure) {
    if (done) {
      if (failed) {
        failure(resultValue);
      } else {
        success(resultValue);
      }
      return;
    }

    listeners.push({success: success, failure: failure});

    if (fresh) {
      fresh = false;
      aff(function(result) {
        done = true;
        resultValue = result;
        listeners.forEach(function(listener) {
          listener.success(result);
        });
        listeners = [];
      }, function(error) {
        done = true;
        failed = true;
        resultValue = error;
        listeners.forEach(function(listener) {
          listener.failure(error);
        });
        listeners = [];
      });
    }
  };
};

},{}],220:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
var Prelude = require("../Prelude");
var Control_Monad_Aff = require("../Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("../Control.Monad.Aff.AVar");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Control_Monad_Eff_Timer = require("../Control.Monad.Eff.Timer");
var Control_Monad_Free = require("../Control.Monad.Free");
var Data_Either = require("../Data.Either");
var Data_Foldable = require("../Data.Foldable");
var Data_List = require("../Data.List");
var Data_Traversable = require("../Data.Traversable");
var Data_Tuple = require("../Data.Tuple");
var Data_Functor = require("../Data.Functor");
var Data_Function = require("../Data.Function");
var Data_Unit = require("../Data.Unit");
var Control_Bind = require("../Control.Bind");
var Data_Semigroup = require("../Data.Semigroup");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Data_Show = require("../Data.Show");
var Data_List_Types = require("../Data.List.Types");
var Control_Applicative = require("../Control.Applicative");
var Group = (function () {
    function Group(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Group.create = function (value0) {
        return function (value1) {
            return new Group(value0, value1);
        };
    };
    return Group;
})();
var TestGroup = (function () {
    function TestGroup(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    TestGroup.create = function (value0) {
        return function (value1) {
            return new TestGroup(value0, value1);
        };
    };
    return TestGroup;
})();
var TestUnit = (function () {
    function TestUnit(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    TestUnit.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new TestUnit(value0, value1, value2);
            };
        };
    };
    return TestUnit;
})();
var test = function (l) {
    return function (t) {
        return Control_Monad_Free.liftF(new TestUnit(l, $foreign.memoise(t), Data_Unit.unit));
    };
};
var suite = function (label) {
    return function (tests) {
        return Control_Monad_Free.liftF(new TestGroup(new Group(label, tests), Data_Unit.unit));
    };
};
var success = Control_Monad_Aff.makeAff(function (v) {
    return function (succeed) {
        return succeed(Data_Unit.unit);
    };
});
var pickFirst = function (t1) {
    return function (t2) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.makeVar)(function (v) {
            return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.forkAff(Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(t1))(Data_Either.either(Control_Monad_Aff_AVar.killVar(v))(Control_Monad_Aff_AVar.putVar(v)))))(function (v1) {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.forkAff(Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(t2))(Data_Either.either(Control_Monad_Aff_AVar.killVar(v))(Control_Monad_Aff_AVar.putVar(v)))))(function (v2) {
                    return Control_Monad_Aff.cancelWith(Control_Monad_Aff_AVar.takeVar(v))(Data_Semigroup.append(Control_Monad_Aff.semigroupCanceler)(v1)(v2));
                });
            });
        });
    };
};
var makeTimeout = function (time) {
    return Control_Monad_Aff.makeAff(function (fail) {
        return function (v) {
            return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_Eff_Timer.setTimeout(time)(fail(Control_Monad_Eff_Exception.error("test timed out after " + (Data_Show.show(Data_Show.showInt)(time) + "ms")))));
        };
    });
};
var timeout = function (time) {
    return function (t) {
        return pickFirst(t)(makeTimeout(time));
    };
};
var keepErrors = (function () {
    var run = function (s) {
        return function (v) {
            if (v.value1 instanceof Data_Either.Left) {
                return Data_List.snoc(s)(new Data_Tuple.Tuple(v.value0, v.value1.value0));
            };
            return s;
        };
    };
    return Data_Foldable.foldl(Data_List_Types.foldableList)(run)(Data_List_Types.Nil.value);
})();
var it = test;
var functorTestF = new Data_Functor.Functor(function (f) {
    return function (v) {
        if (v instanceof TestGroup) {
            return new TestGroup(v.value0, f(v.value1));
        };
        if (v instanceof TestUnit) {
            return new TestUnit(v.value0, v.value1, f(v.value2));
        };
        throw new Error("Failed pattern match at Test.Unit line 68, column 3 - line 68, column 44: " + [ f.constructor.name, v.constructor.name ]);
    };
});
var walkSuite = function (runItem) {
    return function (tests) {
        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar["makeVar'"](Data_List_Types.Nil.value))(function (v) {
            var walkItem = function (path) {
                return function (v1) {
                    if (v1 instanceof TestGroup) {
                        return Control_Bind.bind(Control_Monad_Aff.bindAff)(runItem(path)(v1))(function () {
                            return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Free.runFreeM(functorTestF)(Control_Monad_Aff.monadRecAff)(walkItem(Data_List.snoc(path)(v1.value0.value0)))(v1.value0.value1))(function () {
                                return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v1.value1);
                            });
                        });
                    };
                    if (v1 instanceof TestUnit) {
                        return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.modifyVar(Data_List_Types.Cons.create(new Data_Tuple.Tuple(Data_List.snoc(path)(v1.value0), v1.value1)))(v))(function () {
                            return Control_Bind.bind(Control_Monad_Aff.bindAff)(runItem(path)(v1))(function () {
                                return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v1.value2);
                            });
                        });
                    };
                    throw new Error("Failed pattern match at Test.Unit line 91, column 27 - line 103, column 11: " + [ path.constructor.name, v1.constructor.name ]);
                };
            };
            return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Free.runFreeM(functorTestF)(Control_Monad_Aff.monadRecAff)(walkItem(Data_List_Types.Nil.value))(tests))(function () {
                return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(v))(function (v1) {
                    return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v1);
                });
            });
        });
    };
};
var failure = function (reason) {
    return Control_Monad_Aff.makeAff(function (fail) {
        return function (v) {
            return fail(Control_Monad_Eff_Exception.error(reason));
        };
    });
};
var describe = suite;
var collectTests = walkSuite(function (v) {
    return function (v1) {
        return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit);
    };
});
var collectResults = function (tests) {
    var run = function (v) {
        return Data_Functor.map(Control_Monad_Aff.functorAff)(Data_Tuple.Tuple.create(v.value0))(Control_Monad_Aff.attempt(v.value1));
    };
    return Data_Traversable["for"](Control_Monad_Aff.applicativeAff)(Data_List_Types.traversableList)(tests)(run);
};
module.exports = {
    Group: Group, 
    TestGroup: TestGroup, 
    TestUnit: TestUnit, 
    collectResults: collectResults, 
    collectTests: collectTests, 
    describe: describe, 
    failure: failure, 
    it: it, 
    keepErrors: keepErrors, 
    success: success, 
    suite: suite, 
    test: test, 
    timeout: timeout, 
    walkSuite: walkSuite, 
    functorTestF: functorTestF
};

},{"../Control.Applicative":34,"../Control.Bind":40,"../Control.Monad.Aff":51,"../Control.Monad.Aff.AVar":46,"../Control.Monad.Eff":66,"../Control.Monad.Eff.Exception":58,"../Control.Monad.Eff.Timer":62,"../Control.Monad.Free":69,"../Data.Either":111,"../Data.Foldable":118,"../Data.Function":121,"../Data.Functor":127,"../Data.List":137,"../Data.List.Types":136,"../Data.Semigroup":161,"../Data.Show":165,"../Data.Traversable":178,"../Data.Tuple":179,"../Data.Unit":183,"../Prelude":196,"./foreign":219}],221:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var Proxy3 = (function () {
    function Proxy3() {

    };
    Proxy3.value = new Proxy3();
    return Proxy3;
})();
var Proxy2 = (function () {
    function Proxy2() {

    };
    Proxy2.value = new Proxy2();
    return Proxy2;
})();
var $$Proxy = (function () {
    function $$Proxy() {

    };
    $$Proxy.value = new $$Proxy();
    return $$Proxy;
})();
module.exports = {
    "Proxy": $$Proxy, 
    Proxy2: Proxy2, 
    Proxy3: Proxy3
};

},{}],222:[function(require,module,exports){
"use strict";

// module Unsafe.Coerce

exports.unsafeCoerce = function (x) {
  return x;
};

},{}],223:[function(require,module,exports){
// Generated by psc version 0.10.7
"use strict";
var $foreign = require("./foreign");
module.exports = {
    unsafeCoerce: $foreign.unsafeCoerce
};

},{"./foreign":222}],224:[function(require,module,exports){
require('Test.Main').main();

},{"Test.Main":206}]},{},[224]);
