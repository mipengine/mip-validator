(function(define) {
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MIPValidator = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":60}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":2,"ieee754":8,"isarray":5}],5:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],6:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":10}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],8:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],9:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],11:[function(require,module,exports){
(function (global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @license
 * Lodash lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 */
;(function () {
  function n(n, t) {
    return n.set(t[0], t[1]), n;
  }function t(n, t) {
    return n.add(t), n;
  }function r(n, t, r) {
    switch (r.length) {case 0:
        return n.call(t);case 1:
        return n.call(t, r[0]);case 2:
        return n.call(t, r[0], r[1]);case 3:
        return n.call(t, r[0], r[1], r[2]);}return n.apply(t, r);
  }function e(n, t, r, e) {
    for (var u = -1, i = null == n ? 0 : n.length; ++u < i;) {
      var o = n[u];t(e, o, r(o), n);
    }return e;
  }function u(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length; ++r < e && false !== t(n[r], r, n);) {}return n;
  }function i(n, t) {
    for (var r = null == n ? 0 : n.length; r-- && false !== t(n[r], r, n);) {}
    return n;
  }function o(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length; ++r < e;) {
      if (!t(n[r], r, n)) return false;
    }return true;
  }function f(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length, u = 0, i = []; ++r < e;) {
      var o = n[r];t(o, r, n) && (i[u++] = o);
    }return i;
  }function c(n, t) {
    return !(null == n || !n.length) && -1 < d(n, t, 0);
  }function a(n, t, r) {
    for (var e = -1, u = null == n ? 0 : n.length; ++e < u;) {
      if (r(t, n[e])) return true;
    }return false;
  }function l(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length, u = Array(e); ++r < e;) {
      u[r] = t(n[r], r, n);
    }return u;
  }function s(n, t) {
    for (var r = -1, e = t.length, u = n.length; ++r < e;) {
      n[u + r] = t[r];
    }return n;
  }function h(n, t, r, e) {
    var u = -1,
        i = null == n ? 0 : n.length;for (e && i && (r = n[++u]); ++u < i;) {
      r = t(r, n[u], u, n);
    }return r;
  }function p(n, t, r, e) {
    var u = null == n ? 0 : n.length;for (e && u && (r = n[--u]); u--;) {
      r = t(r, n[u], u, n);
    }return r;
  }function _(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length; ++r < e;) {
      if (t(n[r], r, n)) return true;
    }return false;
  }function v(n, t, r) {
    var e;return r(n, function (n, r, u) {
      if (t(n, r, u)) return e = r, false;
    }), e;
  }function g(n, t, r, e) {
    var u = n.length;for (r += e ? 1 : -1; e ? r-- : ++r < u;) {
      if (t(n[r], r, n)) return r;
    }return -1;
  }function d(n, t, r) {
    if (t === t) n: {
      --r;for (var e = n.length; ++r < e;) {
        if (n[r] === t) {
          n = r;break n;
        }
      }n = -1;
    } else n = g(n, b, r);return n;
  }function y(n, t, r, e) {
    --r;for (var u = n.length; ++r < u;) {
      if (e(n[r], t)) return r;
    }return -1;
  }function b(n) {
    return n !== n;
  }function x(n, t) {
    var r = null == n ? 0 : n.length;return r ? k(n, t) / r : P;
  }function j(n) {
    return function (t) {
      return null == t ? F : t[n];
    };
  }function w(n) {
    return function (t) {
      return null == n ? F : n[t];
    };
  }function m(n, t, r, e, u) {
    return u(n, function (n, u, i) {
      r = e ? (e = false, n) : t(r, n, u, i);
    }), r;
  }function A(n, t) {
    var r = n.length;for (n.sort(t); r--;) {
      n[r] = n[r].c;
    }return n;
  }function k(n, t) {
    for (var r, e = -1, u = n.length; ++e < u;) {
      var i = t(n[e]);i !== F && (r = r === F ? i : r + i);
    }return r;
  }function E(n, t) {
    for (var r = -1, e = Array(n); ++r < n;) {
      e[r] = t(r);
    }return e;
  }function O(n, t) {
    return l(t, function (t) {
      return [t, n[t]];
    });
  }function S(n) {
    return function (t) {
      return n(t);
    };
  }function I(n, t) {
    return l(t, function (t) {
      return n[t];
    });
  }function R(n, t) {
    return n.has(t);
  }function z(n, t) {
    for (var r = -1, e = n.length; ++r < e && -1 < d(t, n[r], 0);) {}return r;
  }function W(n, t) {
    for (var r = n.length; r-- && -1 < d(t, n[r], 0);) {}return r;
  }function B(n) {
    return "\\" + Tn[n];
  }function L(n) {
    var t = -1,
        r = Array(n.size);return n.forEach(function (n, e) {
      r[++t] = [e, n];
    }), r;
  }function U(n, t) {
    return function (r) {
      return n(t(r));
    };
  }function C(n, t) {
    for (var r = -1, e = n.length, u = 0, i = []; ++r < e;) {
      var o = n[r];o !== t && "__lodash_placeholder__" !== o || (n[r] = "__lodash_placeholder__", i[u++] = r);
    }return i;
  }function D(n) {
    var t = -1,
        r = Array(n.size);return n.forEach(function (n) {
      r[++t] = n;
    }), r;
  }function M(n) {
    var t = -1,
        r = Array(n.size);return n.forEach(function (n) {
      r[++t] = [n, n];
    }), r;
  }function T(n) {
    if (Bn.test(n)) {
      for (var t = zn.lastIndex = 0; zn.test(n);) {
        ++t;
      }n = t;
    } else n = tt(n);return n;
  }function $(n) {
    return Bn.test(n) ? n.match(zn) || [] : n.split("");
  }var F,
      N = 1 / 0,
      P = NaN,
      Z = [["ary", 128], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", 16], ["flip", 512], ["partial", 32], ["partialRight", 64], ["rearg", 256]],
      q = /\b__p\+='';/g,
      V = /\b(__p\+=)''\+/g,
      K = /(__e\(.*?\)|\b__t\))\+'';/g,
      G = /&(?:amp|lt|gt|quot|#39);/g,
      H = /[&<>"']/g,
      J = RegExp(G.source),
      Y = RegExp(H.source),
      Q = /<%-([\s\S]+?)%>/g,
      X = /<%([\s\S]+?)%>/g,
      nn = /<%=([\s\S]+?)%>/g,
      tn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      rn = /^\w*$/,
      en = /^\./,
      un = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      on = /[\\^$.*+?()[\]{}|]/g,
      fn = RegExp(on.source),
      cn = /^\s+|\s+$/g,
      an = /^\s+/,
      ln = /\s+$/,
      sn = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      hn = /\{\n\/\* \[wrapped with (.+)\] \*/,
      pn = /,? & /,
      _n = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
      vn = /\\(\\)?/g,
      gn = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
      dn = /\w*$/,
      yn = /^[-+]0x[0-9a-f]+$/i,
      bn = /^0b[01]+$/i,
      xn = /^\[object .+?Constructor\]$/,
      jn = /^0o[0-7]+$/i,
      wn = /^(?:0|[1-9]\d*)$/,
      mn = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
      An = /($^)/,
      kn = /['\n\r\u2028\u2029\\]/g,
      En = "[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?)*",
      On = "(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])" + En,
      Sn = "(?:[^\\ud800-\\udfff][\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]?|[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\ud800-\\udfff])",
      In = RegExp("['\u2019]", "g"),
      Rn = RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]", "g"),
      zn = RegExp("\\ud83c[\\udffb-\\udfff](?=\\ud83c[\\udffb-\\udfff])|" + Sn + En, "g"),
      Wn = RegExp(["[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+(?:['\u2019](?:d|ll|m|re|s|t|ve))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde]|$)|(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde](?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])|$)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?(?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:d|ll|m|re|s|t|ve))?|[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?|\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)|\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)|\\d+", On].join("|"), "g"),
      Bn = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]"),
      Ln = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
      Un = "Array Buffer DataView Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Math Object Promise RegExp Set String Symbol TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap _ clearTimeout isFinite parseInt setTimeout".split(" "),
      Cn = {};
  Cn["[object Float32Array]"] = Cn["[object Float64Array]"] = Cn["[object Int8Array]"] = Cn["[object Int16Array]"] = Cn["[object Int32Array]"] = Cn["[object Uint8Array]"] = Cn["[object Uint8ClampedArray]"] = Cn["[object Uint16Array]"] = Cn["[object Uint32Array]"] = true, Cn["[object Arguments]"] = Cn["[object Array]"] = Cn["[object ArrayBuffer]"] = Cn["[object Boolean]"] = Cn["[object DataView]"] = Cn["[object Date]"] = Cn["[object Error]"] = Cn["[object Function]"] = Cn["[object Map]"] = Cn["[object Number]"] = Cn["[object Object]"] = Cn["[object RegExp]"] = Cn["[object Set]"] = Cn["[object String]"] = Cn["[object WeakMap]"] = false;
  var Dn = {};Dn["[object Arguments]"] = Dn["[object Array]"] = Dn["[object ArrayBuffer]"] = Dn["[object DataView]"] = Dn["[object Boolean]"] = Dn["[object Date]"] = Dn["[object Float32Array]"] = Dn["[object Float64Array]"] = Dn["[object Int8Array]"] = Dn["[object Int16Array]"] = Dn["[object Int32Array]"] = Dn["[object Map]"] = Dn["[object Number]"] = Dn["[object Object]"] = Dn["[object RegExp]"] = Dn["[object Set]"] = Dn["[object String]"] = Dn["[object Symbol]"] = Dn["[object Uint8Array]"] = Dn["[object Uint8ClampedArray]"] = Dn["[object Uint16Array]"] = Dn["[object Uint32Array]"] = true, Dn["[object Error]"] = Dn["[object Function]"] = Dn["[object WeakMap]"] = false;var Mn,
      Tn = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" },
      $n = parseFloat,
      Fn = parseInt,
      Nn = (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global && global.Object === Object && global,
      Pn = (typeof self === "undefined" ? "undefined" : _typeof(self)) == "object" && self && self.Object === Object && self,
      Zn = Nn || Pn || Function("return this")(),
      qn = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && exports && !exports.nodeType && exports,
      Vn = qn && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && module && !module.nodeType && module,
      Kn = Vn && Vn.exports === qn,
      Gn = Kn && Nn.process;
  n: {
    try {
      Mn = Gn && Gn.binding && Gn.binding("util");break n;
    } catch (n) {}Mn = void 0;
  }var Hn = Mn && Mn.isArrayBuffer,
      Jn = Mn && Mn.isDate,
      Yn = Mn && Mn.isMap,
      Qn = Mn && Mn.isRegExp,
      Xn = Mn && Mn.isSet,
      nt = Mn && Mn.isTypedArray,
      tt = j("length"),
      rt = w({ "\xc0": "A", "\xc1": "A", "\xc2": "A", "\xc3": "A", "\xc4": "A", "\xc5": "A", "\xe0": "a", "\xe1": "a", "\xe2": "a", "\xe3": "a", "\xe4": "a", "\xe5": "a", "\xc7": "C", "\xe7": "c", "\xd0": "D", "\xf0": "d", "\xc8": "E", "\xc9": "E", "\xca": "E", "\xcb": "E", "\xe8": "e", "\xe9": "e", "\xea": "e", "\xeb": "e", "\xcc": "I", "\xcd": "I", "\xce": "I",
    "\xcf": "I", "\xec": "i", "\xed": "i", "\xee": "i", "\xef": "i", "\xd1": "N", "\xf1": "n", "\xd2": "O", "\xd3": "O", "\xd4": "O", "\xd5": "O", "\xd6": "O", "\xd8": "O", "\xf2": "o", "\xf3": "o", "\xf4": "o", "\xf5": "o", "\xf6": "o", "\xf8": "o", "\xd9": "U", "\xda": "U", "\xdb": "U", "\xdc": "U", "\xf9": "u", "\xfa": "u", "\xfb": "u", "\xfc": "u", "\xdd": "Y", "\xfd": "y", "\xff": "y", "\xc6": "Ae", "\xe6": "ae", "\xde": "Th", "\xfe": "th", "\xdf": "ss", "\u0100": "A", "\u0102": "A", "\u0104": "A", "\u0101": "a", "\u0103": "a", "\u0105": "a", "\u0106": "C", "\u0108": "C", "\u010A": "C",
    "\u010C": "C", "\u0107": "c", "\u0109": "c", "\u010B": "c", "\u010D": "c", "\u010E": "D", "\u0110": "D", "\u010F": "d", "\u0111": "d", "\u0112": "E", "\u0114": "E", "\u0116": "E", "\u0118": "E", "\u011A": "E", "\u0113": "e", "\u0115": "e", "\u0117": "e", "\u0119": "e", "\u011B": "e", "\u011C": "G", "\u011E": "G", "\u0120": "G", "\u0122": "G", "\u011D": "g", "\u011F": "g", "\u0121": "g", "\u0123": "g", "\u0124": "H", "\u0126": "H", "\u0125": "h", "\u0127": "h", "\u0128": "I", "\u012A": "I", "\u012C": "I", "\u012E": "I", "\u0130": "I", "\u0129": "i", "\u012B": "i", "\u012D": "i",
    "\u012F": "i", "\u0131": "i", "\u0134": "J", "\u0135": "j", "\u0136": "K", "\u0137": "k", "\u0138": "k", "\u0139": "L", "\u013B": "L", "\u013D": "L", "\u013F": "L", "\u0141": "L", "\u013A": "l", "\u013C": "l", "\u013E": "l", "\u0140": "l", "\u0142": "l", "\u0143": "N", "\u0145": "N", "\u0147": "N", "\u014A": "N", "\u0144": "n", "\u0146": "n", "\u0148": "n", "\u014B": "n", "\u014C": "O", "\u014E": "O", "\u0150": "O", "\u014D": "o", "\u014F": "o", "\u0151": "o", "\u0154": "R", "\u0156": "R", "\u0158": "R", "\u0155": "r", "\u0157": "r", "\u0159": "r", "\u015A": "S", "\u015C": "S",
    "\u015E": "S", "\u0160": "S", "\u015B": "s", "\u015D": "s", "\u015F": "s", "\u0161": "s", "\u0162": "T", "\u0164": "T", "\u0166": "T", "\u0163": "t", "\u0165": "t", "\u0167": "t", "\u0168": "U", "\u016A": "U", "\u016C": "U", "\u016E": "U", "\u0170": "U", "\u0172": "U", "\u0169": "u", "\u016B": "u", "\u016D": "u", "\u016F": "u", "\u0171": "u", "\u0173": "u", "\u0174": "W", "\u0175": "w", "\u0176": "Y", "\u0177": "y", "\u0178": "Y", "\u0179": "Z", "\u017B": "Z", "\u017D": "Z", "\u017A": "z", "\u017C": "z", "\u017E": "z", "\u0132": "IJ", "\u0133": "ij", "\u0152": "Oe", "\u0153": "oe",
    "\u0149": "'n", "\u017F": "s" }),
      et = w({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }),
      ut = w({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }),
      it = function w(En) {
    function On(n) {
      if (xu(n) && !af(n) && !(n instanceof Mn)) {
        if (n instanceof zn) return n;if (ci.call(n, "__wrapped__")) return Pe(n);
      }return new zn(n);
    }function Sn() {}function zn(n, t) {
      this.__wrapped__ = n, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = F;
    }function Mn(n) {
      this.__wrapped__ = n, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = 4294967295, this.__views__ = [];
    }function Tn(n) {
      var t = -1,
          r = null == n ? 0 : n.length;for (this.clear(); ++t < r;) {
        var e = n[t];this.set(e[0], e[1]);
      }
    }function Nn(n) {
      var t = -1,
          r = null == n ? 0 : n.length;for (this.clear(); ++t < r;) {
        var e = n[t];this.set(e[0], e[1]);
      }
    }function Pn(n) {
      var t = -1,
          r = null == n ? 0 : n.length;for (this.clear(); ++t < r;) {
        var e = n[t];this.set(e[0], e[1]);
      }
    }function qn(n) {
      var t = -1,
          r = null == n ? 0 : n.length;for (this.__data__ = new Pn(); ++t < r;) {
        this.add(n[t]);
      }
    }function Vn(n) {
      this.size = (this.__data__ = new Nn(n)).size;
    }function Gn(n, t) {
      var r,
          e = af(n),
          u = !e && cf(n),
          i = !e && !u && sf(n),
          o = !e && !u && !i && gf(n),
          u = (e = e || u || i || o) ? E(n.length, ri) : [],
          f = u.length;for (r in n) {
        !t && !ci.call(n, r) || e && ("length" == r || i && ("offset" == r || "parent" == r) || o && ("buffer" == r || "byteLength" == r || "byteOffset" == r) || Re(r, f)) || u.push(r);
      }return u;
    }function tt(n) {
      var t = n.length;return t ? n[cr(0, t - 1)] : F;
    }function ot(n, t) {
      return Te(Mr(n), gt(t, 0, n.length));
    }function ft(n) {
      return Te(Mr(n));
    }function ct(n, t, r) {
      (r === F || hu(n[t], r)) && (r !== F || t in n) || _t(n, t, r);
    }function at(n, t, r) {
      var e = n[t];ci.call(n, t) && hu(e, r) && (r !== F || t in n) || _t(n, t, r);
    }function lt(n, t) {
      for (var r = n.length; r--;) {
        if (hu(n[r][0], t)) return r;
      }return -1;
    }function st(n, t, r, e) {
      return oo(n, function (n, u, i) {
        t(e, n, r(n), i);
      }), e;
    }function ht(n, t) {
      return n && Tr(t, Lu(t), n);
    }function pt(n, t) {
      return n && Tr(t, Uu(t), n);
    }function _t(n, t, r) {
      "__proto__" == t && Ei ? Ei(n, t, { configurable: true, enumerable: true, value: r, writable: true }) : n[t] = r;
    }function vt(n, t) {
      for (var r = -1, e = t.length, u = Hu(e), i = null == n; ++r < e;) {
        u[r] = i ? F : Wu(n, t[r]);
      }return u;
    }function gt(n, t, r) {
      return n === n && (r !== F && (n = n <= r ? n : r), t !== F && (n = n >= t ? n : t)), n;
    }function dt(n, t, r, e, i, o) {
      var f,
          c = 1 & t,
          a = 2 & t,
          l = 4 & t;if (r && (f = i ? r(n, e, i, o) : r(n)), f !== F) return f;if (!bu(n)) return n;if (e = af(n)) {
        if (f = Ee(n), !c) return Mr(n, f);
      } else {
        var s = yo(n),
            h = "[object Function]" == s || "[object GeneratorFunction]" == s;if (sf(n)) return Wr(n, c);if ("[object Object]" == s || "[object Arguments]" == s || h && !i) {
          if (f = a || h ? {} : Oe(n), !c) return a ? Fr(n, pt(f, n)) : $r(n, ht(f, n));
        } else {
          if (!Dn[s]) return i ? n : {};f = Se(n, s, dt, c);
        }
      }if (o || (o = new Vn()), i = o.get(n)) return i;o.set(n, f);var a = l ? a ? ye : de : a ? Uu : Lu,
          p = e ? F : a(n);return u(p || n, function (e, u) {
        p && (u = e, e = n[u]), at(f, u, dt(e, t, r, u, n, o));
      }), f;
    }function yt(n) {
      var t = Lu(n);return function (r) {
        return bt(r, n, t);
      };
    }function bt(n, t, r) {
      var e = r.length;if (null == n) return !e;for (n = ni(n); e--;) {
        var u = r[e],
            i = t[u],
            o = n[u];if (o === F && !(u in n) || !i(o)) return false;
      }return true;
    }function xt(n, t, r) {
      if (typeof n != "function") throw new ei("Expected a function");return jo(function () {
        n.apply(F, r);
      }, t);
    }function jt(n, t, r, e) {
      var u = -1,
          i = c,
          o = true,
          f = n.length,
          s = [],
          h = t.length;
      if (!f) return s;r && (t = l(t, S(r))), e ? (i = a, o = false) : 200 <= t.length && (i = R, o = false, t = new qn(t));n: for (; ++u < f;) {
        var p = n[u],
            _ = null == r ? p : r(p),
            p = e || 0 !== p ? p : 0;if (o && _ === _) {
          for (var v = h; v--;) {
            if (t[v] === _) continue n;
          }s.push(p);
        } else i(t, _, e) || s.push(p);
      }return s;
    }function wt(n, t) {
      var r = true;return oo(n, function (n, e, u) {
        return r = !!t(n, e, u);
      }), r;
    }function mt(n, t, r) {
      for (var e = -1, u = n.length; ++e < u;) {
        var i = n[e],
            o = t(i);if (null != o && (f === F ? o === o && !Au(o) : r(o, f))) var f = o,
            c = i;
      }return c;
    }function At(n, t) {
      var r = [];return oo(n, function (n, e, u) {
        t(n, e, u) && r.push(n);
      }), r;
    }function kt(n, t, r, e, u) {
      var i = -1,
          o = n.length;for (r || (r = Ie), u || (u = []); ++i < o;) {
        var f = n[i];0 < t && r(f) ? 1 < t ? kt(f, t - 1, r, e, u) : s(u, f) : e || (u[u.length] = f);
      }return u;
    }function Et(n, t) {
      return n && co(n, t, Lu);
    }function Ot(n, t) {
      return n && ao(n, t, Lu);
    }function St(n, t) {
      return f(t, function (t) {
        return gu(n[t]);
      });
    }function It(n, t) {
      t = Rr(t, n);for (var r = 0, e = t.length; null != n && r < e;) {
        n = n[$e(t[r++])];
      }return r && r == e ? n : F;
    }function Rt(n, t, r) {
      return t = t(n), af(n) ? t : s(t, r(n));
    }function zt(n) {
      if (null == n) n = n === F ? "[object Undefined]" : "[object Null]";else if (ki && ki in ni(n)) {
        var t = ci.call(n, ki),
            r = n[ki];try {
          n[ki] = F;var e = true;
        } catch (n) {}var u = si.call(n);e && (t ? n[ki] = r : delete n[ki]), n = u;
      } else n = si.call(n);return n;
    }function Wt(n, t) {
      return n > t;
    }function Bt(n, t) {
      return null != n && ci.call(n, t);
    }function Lt(n, t) {
      return null != n && t in ni(n);
    }function Ut(n, t, r) {
      for (var e = r ? a : c, u = n[0].length, i = n.length, o = i, f = Hu(i), s = 1 / 0, h = []; o--;) {
        var p = n[o];o && t && (p = l(p, S(t))), s = Mi(p.length, s), f[o] = !r && (t || 120 <= u && 120 <= p.length) ? new qn(o && p) : F;
      }var p = n[0],
          _ = -1,
          v = f[0];n: for (; ++_ < u && h.length < s;) {
        var g = p[_],
            d = t ? t(g) : g,
            g = r || 0 !== g ? g : 0;
        if (v ? !R(v, d) : !e(h, d, r)) {
          for (o = i; --o;) {
            var y = f[o];if (y ? !R(y, d) : !e(n[o], d, r)) continue n;
          }v && v.push(d), h.push(g);
        }
      }return h;
    }function Ct(n, t, r) {
      var e = {};return Et(n, function (n, u, i) {
        t(e, r(n), u, i);
      }), e;
    }function Dt(n, t, e) {
      return t = Rr(t, n), n = 2 > t.length ? n : It(n, vr(t, 0, -1)), t = null == n ? n : n[$e(Ge(t))], null == t ? F : r(t, n, e);
    }function Mt(n) {
      return xu(n) && "[object Arguments]" == zt(n);
    }function Tt(n) {
      return xu(n) && "[object ArrayBuffer]" == zt(n);
    }function $t(n) {
      return xu(n) && "[object Date]" == zt(n);
    }function Ft(n, t, r, e, u) {
      if (n === t) t = true;else if (null == n || null == t || !xu(n) && !xu(t)) t = n !== n && t !== t;else n: {
        var i = af(n),
            o = af(t),
            f = i ? "[object Array]" : yo(n),
            c = o ? "[object Array]" : yo(t),
            f = "[object Arguments]" == f ? "[object Object]" : f,
            c = "[object Arguments]" == c ? "[object Object]" : c,
            a = "[object Object]" == f,
            o = "[object Object]" == c;if ((c = f == c) && sf(n)) {
          if (!sf(t)) {
            t = false;break n;
          }i = true, a = false;
        }if (c && !a) u || (u = new Vn()), t = i || gf(n) ? _e(n, t, r, e, Ft, u) : ve(n, t, f, r, e, Ft, u);else {
          if (!(1 & r) && (i = a && ci.call(n, "__wrapped__"), f = o && ci.call(t, "__wrapped__"), i || f)) {
            n = i ? n.value() : n, t = f ? t.value() : t, u || (u = new Vn()), t = Ft(n, t, r, e, u);break n;
          }if (c) {
            t: if (u || (u = new Vn()), i = 1 & r, f = de(n), o = f.length, c = de(t).length, o == c || i) {
              for (a = o; a--;) {
                var l = f[a];if (!(i ? l in t : ci.call(t, l))) {
                  t = false;break t;
                }
              }if ((c = u.get(n)) && u.get(t)) t = c == t;else {
                c = true, u.set(n, t), u.set(t, n);for (var s = i; ++a < o;) {
                  var l = f[a],
                      h = n[l],
                      p = t[l];if (e) var _ = i ? e(p, h, l, t, n, u) : e(h, p, l, n, t, u);if (_ === F ? h !== p && !Ft(h, p, r, e, u) : !_) {
                    c = false;break;
                  }s || (s = "constructor" == l);
                }c && !s && (r = n.constructor, e = t.constructor, r != e && "constructor" in n && "constructor" in t && !(typeof r == "function" && r instanceof r && typeof e == "function" && e instanceof e) && (c = false)), u.delete(n), u.delete(t), t = c;
              }
            } else t = false;
          } else t = false;
        }
      }return t;
    }function Nt(n) {
      return xu(n) && "[object Map]" == yo(n);
    }function Pt(n, t, r, e) {
      var u = r.length,
          i = u,
          o = !e;if (null == n) return !i;for (n = ni(n); u--;) {
        var f = r[u];if (o && f[2] ? f[1] !== n[f[0]] : !(f[0] in n)) return false;
      }for (; ++u < i;) {
        var f = r[u],
            c = f[0],
            a = n[c],
            l = f[1];if (o && f[2]) {
          if (a === F && !(c in n)) return false;
        } else {
          if (f = new Vn(), e) var s = e(a, l, c, n, t, f);if (s === F ? !Ft(l, a, 3, e, f) : !s) return false;
        }
      }return true;
    }function Zt(n) {
      return !(!bu(n) || li && li in n) && (gu(n) ? _i : xn).test(Fe(n));
    }function qt(n) {
      return xu(n) && "[object RegExp]" == zt(n);
    }function Vt(n) {
      return xu(n) && "[object Set]" == yo(n);
    }function Kt(n) {
      return xu(n) && yu(n.length) && !!Cn[zt(n)];
    }function Gt(n) {
      return typeof n == "function" ? n : null == n ? Nu : (typeof n === "undefined" ? "undefined" : _typeof(n)) == "object" ? af(n) ? Xt(n[0], n[1]) : Qt(n) : Vu(n);
    }function Ht(n) {
      if (!Le(n)) return Ci(n);var t,
          r = [];for (t in ni(n)) {
        ci.call(n, t) && "constructor" != t && r.push(t);
      }return r;
    }function Jt(n, t) {
      return n < t;
    }function Yt(n, t) {
      var r = -1,
          e = pu(n) ? Hu(n.length) : [];return oo(n, function (n, u, i) {
        e[++r] = t(n, u, i);
      }), e;
    }function Qt(n) {
      var t = me(n);return 1 == t.length && t[0][2] ? Ue(t[0][0], t[0][1]) : function (r) {
        return r === n || Pt(r, n, t);
      };
    }function Xt(n, t) {
      return We(n) && t === t && !bu(t) ? Ue($e(n), t) : function (r) {
        var e = Wu(r, n);return e === F && e === t ? Bu(r, n) : Ft(t, e, 3);
      };
    }function nr(n, t, r, e, u) {
      n !== t && co(t, function (i, o) {
        if (bu(i)) {
          u || (u = new Vn());var f = u,
              c = n[o],
              a = t[o],
              l = f.get(a);if (l) ct(n, o, l);else {
            var l = e ? e(c, a, o + "", n, t, f) : F,
                s = l === F;if (s) {
              var h = af(a),
                  p = !h && sf(a),
                  _ = !h && !p && gf(a),
                  l = a;h || p || _ ? af(c) ? l = c : _u(c) ? l = Mr(c) : p ? (s = false, l = Wr(a, true)) : _ ? (s = false, l = Lr(a, true)) : l = [] : wu(a) || cf(a) ? (l = c, cf(c) ? l = Ru(c) : (!bu(c) || r && gu(c)) && (l = Oe(a))) : s = false;
            }s && (f.set(a, l), nr(l, a, r, e, f), f.delete(a)), ct(n, o, l);
          }
        } else f = e ? e(n[o], i, o + "", n, t, u) : F, f === F && (f = i), ct(n, o, f);
      }, Uu);
    }function tr(n, t) {
      var r = n.length;if (r) return t += 0 > t ? r : 0, Re(t, r) ? n[t] : F;
    }function rr(n, t, r) {
      var e = -1;return t = l(t.length ? t : [Nu], S(je())), n = Yt(n, function (n) {
        return { a: l(t, function (t) {
            return t(n);
          }), b: ++e, c: n };
      }), A(n, function (n, t) {
        var e;n: {
          e = -1;for (var u = n.a, i = t.a, o = u.length, f = r.length; ++e < o;) {
            var c = Ur(u[e], i[e]);if (c) {
              e = e >= f ? c : c * ("desc" == r[e] ? -1 : 1);
              break n;
            }
          }e = n.b - t.b;
        }return e;
      });
    }function er(n, t) {
      return ur(n, t, function (t, r) {
        return Bu(n, r);
      });
    }function ur(n, t, r) {
      for (var e = -1, u = t.length, i = {}; ++e < u;) {
        var o = t[e],
            f = It(n, o);r(f, o) && pr(i, Rr(o, n), f);
      }return i;
    }function ir(n) {
      return function (t) {
        return It(t, n);
      };
    }function or(n, t, r, e) {
      var u = e ? y : d,
          i = -1,
          o = t.length,
          f = n;for (n === t && (t = Mr(t)), r && (f = l(n, S(r))); ++i < o;) {
        for (var c = 0, a = t[i], a = r ? r(a) : a; -1 < (c = u(f, a, c, e));) {
          f !== n && wi.call(f, c, 1), wi.call(n, c, 1);
        }
      }return n;
    }function fr(n, t) {
      for (var r = n ? t.length : 0, e = r - 1; r--;) {
        var u = t[r];
        if (r == e || u !== i) {
          var i = u;Re(u) ? wi.call(n, u, 1) : mr(n, u);
        }
      }
    }function cr(n, t) {
      return n + zi(Fi() * (t - n + 1));
    }function ar(n, t) {
      var r = "";if (!n || 1 > t || 9007199254740991 < t) return r;do {
        t % 2 && (r += n), (t = zi(t / 2)) && (n += n);
      } while (t);return r;
    }function lr(n, t) {
      return wo(Ce(n, t, Nu), n + "");
    }function sr(n) {
      return tt(Du(n));
    }function hr(n, t) {
      var r = Du(n);return Te(r, gt(t, 0, r.length));
    }function pr(n, t, r, e) {
      if (!bu(n)) return n;t = Rr(t, n);for (var u = -1, i = t.length, o = i - 1, f = n; null != f && ++u < i;) {
        var c = $e(t[u]),
            a = r;if (u != o) {
          var l = f[c],
              a = e ? e(l, c, f) : F;
          a === F && (a = bu(l) ? l : Re(t[u + 1]) ? [] : {});
        }at(f, c, a), f = f[c];
      }return n;
    }function _r(n) {
      return Te(Du(n));
    }function vr(n, t, r) {
      var e = -1,
          u = n.length;for (0 > t && (t = -t > u ? 0 : u + t), r = r > u ? u : r, 0 > r && (r += u), u = t > r ? 0 : r - t >>> 0, t >>>= 0, r = Hu(u); ++e < u;) {
        r[e] = n[e + t];
      }return r;
    }function gr(n, t) {
      var r;return oo(n, function (n, e, u) {
        return r = t(n, e, u), !r;
      }), !!r;
    }function dr(n, t, r) {
      var e = 0,
          u = null == n ? e : n.length;if (typeof t == "number" && t === t && 2147483647 >= u) {
        for (; e < u;) {
          var i = e + u >>> 1,
              o = n[i];null !== o && !Au(o) && (r ? o <= t : o < t) ? e = i + 1 : u = i;
        }return u;
      }return yr(n, t, Nu, r);
    }function yr(n, t, r, e) {
      t = r(t);for (var u = 0, i = null == n ? 0 : n.length, o = t !== t, f = null === t, c = Au(t), a = t === F; u < i;) {
        var l = zi((u + i) / 2),
            s = r(n[l]),
            h = s !== F,
            p = null === s,
            _ = s === s,
            v = Au(s);(o ? e || _ : a ? _ && (e || h) : f ? _ && h && (e || !p) : c ? _ && h && !p && (e || !v) : p || v ? 0 : e ? s <= t : s < t) ? u = l + 1 : i = l;
      }return Mi(i, 4294967294);
    }function br(n, t) {
      for (var r = -1, e = n.length, u = 0, i = []; ++r < e;) {
        var o = n[r],
            f = t ? t(o) : o;if (!r || !hu(f, c)) {
          var c = f;i[u++] = 0 === o ? 0 : o;
        }
      }return i;
    }function xr(n) {
      return typeof n == "number" ? n : Au(n) ? P : +n;
    }function jr(n) {
      if (typeof n == "string") return n;
      if (af(n)) return l(n, jr) + "";if (Au(n)) return uo ? uo.call(n) : "";var t = n + "";return "0" == t && 1 / n == -N ? "-0" : t;
    }function wr(n, t, r) {
      var e = -1,
          u = c,
          i = n.length,
          o = true,
          f = [],
          l = f;if (r) o = false, u = a;else if (200 <= i) {
        if (u = t ? null : po(n)) return D(u);o = false, u = R, l = new qn();
      } else l = t ? [] : f;n: for (; ++e < i;) {
        var s = n[e],
            h = t ? t(s) : s,
            s = r || 0 !== s ? s : 0;if (o && h === h) {
          for (var p = l.length; p--;) {
            if (l[p] === h) continue n;
          }t && l.push(h), f.push(s);
        } else u(l, h, r) || (l !== f && l.push(h), f.push(s));
      }return f;
    }function mr(n, t) {
      return t = Rr(t, n), n = 2 > t.length ? n : It(n, vr(t, 0, -1)), null == n || delete n[$e(Ge(t))];
    }function Ar(n, t, r, e) {
      for (var u = n.length, i = e ? u : -1; (e ? i-- : ++i < u) && t(n[i], i, n);) {}return r ? vr(n, e ? 0 : i, e ? i + 1 : u) : vr(n, e ? i + 1 : 0, e ? u : i);
    }function kr(n, t) {
      var r = n;return r instanceof Mn && (r = r.value()), h(t, function (n, t) {
        return t.func.apply(t.thisArg, s([n], t.args));
      }, r);
    }function Er(n, t, r) {
      var e = n.length;if (2 > e) return e ? wr(n[0]) : [];for (var u = -1, i = Hu(e); ++u < e;) {
        for (var o = n[u], f = -1; ++f < e;) {
          f != u && (i[u] = jt(i[u] || o, n[f], t, r));
        }
      }return wr(kt(i, 1), t, r);
    }function Or(n, t, r) {
      for (var e = -1, u = n.length, i = t.length, o = {}; ++e < u;) {
        r(o, n[e], e < i ? t[e] : F);
      }return o;
    }function Sr(n) {
      return _u(n) ? n : [];
    }function Ir(n) {
      return typeof n == "function" ? n : Nu;
    }function Rr(n, t) {
      return af(n) ? n : We(n, t) ? [n] : mo(zu(n));
    }function zr(n, t, r) {
      var e = n.length;return r = r === F ? e : r, !t && r >= e ? n : vr(n, t, r);
    }function Wr(n, t) {
      if (t) return n.slice();var r = n.length,
          r = yi ? yi(r) : new n.constructor(r);return n.copy(r), r;
    }function Br(n) {
      var t = new n.constructor(n.byteLength);return new di(t).set(new di(n)), t;
    }function Lr(n, t) {
      return new n.constructor(t ? Br(n.buffer) : n.buffer, n.byteOffset, n.length);
    }function Ur(n, t) {
      if (n !== t) {
        var r = n !== F,
            e = null === n,
            u = n === n,
            i = Au(n),
            o = t !== F,
            f = null === t,
            c = t === t,
            a = Au(t);if (!f && !a && !i && n > t || i && o && c && !f && !a || e && o && c || !r && c || !u) return 1;if (!e && !i && !a && n < t || a && r && u && !e && !i || f && r && u || !o && u || !c) return -1;
      }return 0;
    }function Cr(n, t, r, e) {
      var u = -1,
          i = n.length,
          o = r.length,
          f = -1,
          c = t.length,
          a = Di(i - o, 0),
          l = Hu(c + a);for (e = !e; ++f < c;) {
        l[f] = t[f];
      }for (; ++u < o;) {
        (e || u < i) && (l[r[u]] = n[u]);
      }for (; a--;) {
        l[f++] = n[u++];
      }return l;
    }function Dr(n, t, r, e) {
      var u = -1,
          i = n.length,
          o = -1,
          f = r.length,
          c = -1,
          a = t.length,
          l = Di(i - f, 0),
          s = Hu(l + a);
      for (e = !e; ++u < l;) {
        s[u] = n[u];
      }for (l = u; ++c < a;) {
        s[l + c] = t[c];
      }for (; ++o < f;) {
        (e || u < i) && (s[l + r[o]] = n[u++]);
      }return s;
    }function Mr(n, t) {
      var r = -1,
          e = n.length;for (t || (t = Hu(e)); ++r < e;) {
        t[r] = n[r];
      }return t;
    }function Tr(n, t, r, e) {
      var u = !r;r || (r = {});for (var i = -1, o = t.length; ++i < o;) {
        var f = t[i],
            c = e ? e(r[f], n[f], f, r, n) : F;c === F && (c = n[f]), u ? _t(r, f, c) : at(r, f, c);
      }return r;
    }function $r(n, t) {
      return Tr(n, vo(n), t);
    }function Fr(n, t) {
      return Tr(n, go(n), t);
    }function Nr(n, t) {
      return function (r, u) {
        var i = af(r) ? e : st,
            o = t ? t() : {};return i(r, n, je(u, 2), o);
      };
    }function Pr(n) {
      return lr(function (t, r) {
        var e = -1,
            u = r.length,
            i = 1 < u ? r[u - 1] : F,
            o = 2 < u ? r[2] : F,
            i = 3 < n.length && typeof i == "function" ? (u--, i) : F;for (o && ze(r[0], r[1], o) && (i = 3 > u ? F : i, u = 1), t = ni(t); ++e < u;) {
          (o = r[e]) && n(t, o, e, i);
        }return t;
      });
    }function Zr(n, t) {
      return function (r, e) {
        if (null == r) return r;if (!pu(r)) return n(r, e);for (var u = r.length, i = t ? u : -1, o = ni(r); (t ? i-- : ++i < u) && false !== e(o[i], i, o);) {}return r;
      };
    }function qr(n) {
      return function (t, r, e) {
        var u = -1,
            i = ni(t);e = e(t);for (var o = e.length; o--;) {
          var f = e[n ? o : ++u];if (false === r(i[f], f, i)) break;
        }return t;
      };
    }function Vr(n, t, r) {
      function e() {
        return (this && this !== Zn && this instanceof e ? i : n).apply(u ? r : this, arguments);
      }var u = 1 & t,
          i = Hr(n);return e;
    }function Kr(n) {
      return function (t) {
        t = zu(t);var r = Bn.test(t) ? $(t) : F,
            e = r ? r[0] : t.charAt(0);return t = r ? zr(r, 1).join("") : t.slice(1), e[n]() + t;
      };
    }function Gr(n) {
      return function (t) {
        return h($u(Tu(t).replace(In, "")), n, "");
      };
    }function Hr(n) {
      return function () {
        var t = arguments;switch (t.length) {case 0:
            return new n();case 1:
            return new n(t[0]);case 2:
            return new n(t[0], t[1]);case 3:
            return new n(t[0], t[1], t[2]);case 4:
            return new n(t[0], t[1], t[2], t[3]);case 5:
            return new n(t[0], t[1], t[2], t[3], t[4]);case 6:
            return new n(t[0], t[1], t[2], t[3], t[4], t[5]);case 7:
            return new n(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);}var r = io(n.prototype),
            t = n.apply(r, t);return bu(t) ? t : r;
      };
    }function Jr(n, t, e) {
      function u() {
        for (var o = arguments.length, f = Hu(o), c = o, a = xe(u); c--;) {
          f[c] = arguments[c];
        }return c = 3 > o && f[0] !== a && f[o - 1] !== a ? [] : C(f, a), o -= c.length, o < e ? fe(n, t, Xr, u.placeholder, F, f, c, F, F, e - o) : r(this && this !== Zn && this instanceof u ? i : n, this, f);
      }var i = Hr(n);return u;
    }function Yr(n) {
      return function (t, r, e) {
        var u = ni(t);if (!pu(t)) {
          var i = je(r, 3);t = Lu(t), r = function r(n) {
            return i(u[n], n, u);
          };
        }return r = n(t, r, e), -1 < r ? u[i ? t[r] : r] : F;
      };
    }function Qr(n) {
      return ge(function (t) {
        var r = t.length,
            e = r,
            u = zn.prototype.thru;for (n && t.reverse(); e--;) {
          var i = t[e];if (typeof i != "function") throw new ei("Expected a function");if (u && !o && "wrapper" == be(i)) var o = new zn([], true);
        }for (e = o ? e : r; ++e < r;) {
          var i = t[e],
              u = be(i),
              f = "wrapper" == u ? _o(i) : F,
              o = f && Be(f[0]) && 424 == f[1] && !f[4].length && 1 == f[9] ? o[be(f[0])].apply(o, f[3]) : 1 == i.length && Be(i) ? o[u]() : o.thru(i);
        }return function () {
          var n = arguments,
              e = n[0];if (o && 1 == n.length && af(e)) return o.plant(e).value();for (var u = 0, n = r ? t[u].apply(this, n) : e; ++u < r;) {
            n = t[u].call(this, n);
          }return n;
        };
      });
    }function Xr(n, t, r, e, u, i, o, f, c, a) {
      function l() {
        for (var d = arguments.length, y = Hu(d), b = d; b--;) {
          y[b] = arguments[b];
        }if (_) {
          var x,
              j = xe(l),
              b = y.length;for (x = 0; b--;) {
            y[b] === j && ++x;
          }
        }if (e && (y = Cr(y, e, u, _)), i && (y = Dr(y, i, o, _)), d -= x, _ && d < a) return j = C(y, j), fe(n, t, Xr, l.placeholder, r, y, j, f, c, a - d);if (j = h ? r : this, b = p ? j[n] : n, d = y.length, f) {
          x = y.length;for (var w = Mi(f.length, x), m = Mr(y); w--;) {
            var A = f[w];y[w] = Re(A, x) ? m[A] : F;
          }
        } else v && 1 < d && y.reverse();return s && c < d && (y.length = c), this && this !== Zn && this instanceof l && (b = g || Hr(b)), b.apply(j, y);
      }var s = 128 & t,
          h = 1 & t,
          p = 2 & t,
          _ = 24 & t,
          v = 512 & t,
          g = p ? F : Hr(n);return l;
    }function ne(n, t) {
      return function (r, e) {
        return Ct(r, n, t(e));
      };
    }function te(n, t) {
      return function (r, e) {
        var u;if (r === F && e === F) return t;if (r !== F && (u = r), e !== F) {
          if (u === F) return e;typeof r == "string" || typeof e == "string" ? (r = jr(r), e = jr(e)) : (r = xr(r), e = xr(e)), u = n(r, e);
        }return u;
      };
    }function re(n) {
      return ge(function (t) {
        return t = l(t, S(je())), lr(function (e) {
          var u = this;return n(t, function (n) {
            return r(n, u, e);
          });
        });
      });
    }function ee(n, t) {
      t = t === F ? " " : jr(t);var r = t.length;return 2 > r ? r ? ar(t, n) : t : (r = ar(t, Ri(n / T(t))), Bn.test(t) ? zr($(r), 0, n).join("") : r.slice(0, n));
    }function ue(n, t, e, u) {
      function i() {
        for (var t = -1, c = arguments.length, a = -1, l = u.length, s = Hu(l + c), h = this && this !== Zn && this instanceof i ? f : n; ++a < l;) {
          s[a] = u[a];
        }for (; c--;) {
          s[a++] = arguments[++t];
        }return r(h, o ? e : this, s);
      }var o = 1 & t,
          f = Hr(n);return i;
    }function ie(n) {
      return function (t, r, e) {
        e && typeof e != "number" && ze(t, r, e) && (r = e = F), t = Eu(t), r === F ? (r = t, t = 0) : r = Eu(r), e = e === F ? t < r ? 1 : -1 : Eu(e);var u = -1;r = Di(Ri((r - t) / (e || 1)), 0);for (var i = Hu(r); r--;) {
          i[n ? r : ++u] = t, t += e;
        }return i;
      };
    }function oe(n) {
      return function (t, r) {
        return typeof t == "string" && typeof r == "string" || (t = Iu(t), r = Iu(r)), n(t, r);
      };
    }function fe(n, t, r, e, u, i, o, f, c, a) {
      var l = 8 & t,
          s = l ? o : F;o = l ? F : o;var h = l ? i : F;return i = l ? F : i, t = (t | (l ? 32 : 64)) & ~(l ? 64 : 32), 4 & t || (t &= -4), u = [n, t, u, h, s, i, o, f, c, a], r = r.apply(F, u), Be(n) && xo(r, u), r.placeholder = e, De(r, n, t);
    }function ce(n) {
      var t = Xu[n];return function (n, r) {
        if (n = Iu(n), r = null == r ? 0 : Mi(Ou(r), 292)) {
          var e = (zu(n) + "e").split("e"),
              e = t(e[0] + "e" + (+e[1] + r)),
              e = (zu(e) + "e").split("e");return +(e[0] + "e" + (+e[1] - r));
        }return t(n);
      };
    }function ae(n) {
      return function (t) {
        var r = yo(t);return "[object Map]" == r ? L(t) : "[object Set]" == r ? M(t) : O(t, n(t));
      };
    }function le(n, t, r, e, u, i, o, f) {
      var c = 2 & t;if (!c && typeof n != "function") throw new ei("Expected a function");var a = e ? e.length : 0;if (a || (t &= -97, e = u = F), o = o === F ? o : Di(Ou(o), 0), f = f === F ? f : Ou(f), a -= u ? u.length : 0, 64 & t) {
        var l = e,
            s = u;e = u = F;
      }var h = c ? F : _o(n);return i = [n, t, r, e, u, l, s, i, o, f], h && (r = i[1], n = h[1], t = r | n, e = 128 == n && 8 == r || 128 == n && 256 == r && i[7].length <= h[8] || 384 == n && h[7].length <= h[8] && 8 == r, 131 > t || e) && (1 & n && (i[2] = h[2], t |= 1 & r ? 0 : 4), (r = h[3]) && (e = i[3], i[3] = e ? Cr(e, r, h[4]) : r, i[4] = e ? C(i[3], "__lodash_placeholder__") : h[4]), (r = h[5]) && (e = i[5], i[5] = e ? Dr(e, r, h[6]) : r, i[6] = e ? C(i[5], "__lodash_placeholder__") : h[6]), (r = h[7]) && (i[7] = r), 128 & n && (i[8] = null == i[8] ? h[8] : Mi(i[8], h[8])), null == i[9] && (i[9] = h[9]), i[0] = h[0], i[1] = t), n = i[0], t = i[1], r = i[2], e = i[3], u = i[4], f = i[9] = i[9] === F ? c ? 0 : n.length : Di(i[9] - a, 0), !f && 24 & t && (t &= -25), De((h ? lo : xo)(t && 1 != t ? 8 == t || 16 == t ? Jr(n, t, f) : 32 != t && 33 != t || u.length ? Xr.apply(F, i) : ue(n, t, r, e) : Vr(n, t, r), i), n, t);
    }function se(n, t, r, e) {
      return n === F || hu(n, ii[r]) && !ci.call(e, r) ? t : n;
    }function he(n, t, r, e, u, i) {
      return bu(n) && bu(t) && (i.set(t, n), nr(n, t, F, he, i), i.delete(t)), n;
    }function pe(n) {
      return wu(n) ? F : n;
    }function _e(n, t, r, e, u, i) {
      var o = 1 & r,
          f = n.length,
          c = t.length;if (f != c && !(o && c > f)) return false;if ((c = i.get(n)) && i.get(t)) return c == t;var c = -1,
          a = true,
          l = 2 & r ? new qn() : F;
      for (i.set(n, t), i.set(t, n); ++c < f;) {
        var s = n[c],
            h = t[c];if (e) var p = o ? e(h, s, c, t, n, i) : e(s, h, c, n, t, i);if (p !== F) {
          if (p) continue;a = false;break;
        }if (l) {
          if (!_(t, function (n, t) {
            if (!R(l, t) && (s === n || u(s, n, r, e, i))) return l.push(t);
          })) {
            a = false;break;
          }
        } else if (s !== h && !u(s, h, r, e, i)) {
          a = false;break;
        }
      }return i.delete(n), i.delete(t), a;
    }function ve(n, t, r, e, u, i, o) {
      switch (r) {case "[object DataView]":
          if (n.byteLength != t.byteLength || n.byteOffset != t.byteOffset) break;n = n.buffer, t = t.buffer;case "[object ArrayBuffer]":
          if (n.byteLength != t.byteLength || !i(new di(n), new di(t))) break;
          return true;case "[object Boolean]":case "[object Date]":case "[object Number]":
          return hu(+n, +t);case "[object Error]":
          return n.name == t.name && n.message == t.message;case "[object RegExp]":case "[object String]":
          return n == t + "";case "[object Map]":
          var f = L;case "[object Set]":
          if (f || (f = D), n.size != t.size && !(1 & e)) break;return (r = o.get(n)) ? r == t : (e |= 2, o.set(n, t), t = _e(f(n), f(t), e, u, i, o), o.delete(n), t);case "[object Symbol]":
          if (eo) return eo.call(n) == eo.call(t);}return false;
    }function ge(n) {
      return wo(Ce(n, F, Ve), n + "");
    }function de(n) {
      return Rt(n, Lu, vo);
    }function ye(n) {
      return Rt(n, Uu, go);
    }function be(n) {
      for (var t = n.name + "", r = Ji[t], e = ci.call(Ji, t) ? r.length : 0; e--;) {
        var u = r[e],
            i = u.func;if (null == i || i == n) return u.name;
      }return t;
    }function xe(n) {
      return (ci.call(On, "placeholder") ? On : n).placeholder;
    }function je() {
      var n = On.iteratee || Pu,
          n = n === Pu ? Gt : n;return arguments.length ? n(arguments[0], arguments[1]) : n;
    }function we(n, t) {
      var r = n.__data__,
          e = typeof t === "undefined" ? "undefined" : _typeof(t);return ("string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
    }function me(n) {
      for (var t = Lu(n), r = t.length; r--;) {
        var e = t[r],
            u = n[e];t[r] = [e, u, u === u && !bu(u)];
      }return t;
    }function Ae(n, t) {
      var r = null == n ? F : n[t];return Zt(r) ? r : F;
    }function ke(n, t, r) {
      t = Rr(t, n);for (var e = -1, u = t.length, i = false; ++e < u;) {
        var o = $e(t[e]);if (!(i = null != n && r(n, o))) break;n = n[o];
      }return i || ++e != u ? i : (u = null == n ? 0 : n.length, !!u && yu(u) && Re(o, u) && (af(n) || cf(n)));
    }function Ee(n) {
      var t = n.length,
          r = n.constructor(t);return t && "string" == typeof n[0] && ci.call(n, "index") && (r.index = n.index, r.input = n.input), r;
    }function Oe(n) {
      return typeof n.constructor != "function" || Le(n) ? {} : io(bi(n));
    }function Se(r, e, u, i) {
      var o = r.constructor;switch (e) {case "[object ArrayBuffer]":
          return Br(r);case "[object Boolean]":case "[object Date]":
          return new o(+r);case "[object DataView]":
          return e = i ? Br(r.buffer) : r.buffer, new r.constructor(e, r.byteOffset, r.byteLength);case "[object Float32Array]":case "[object Float64Array]":case "[object Int8Array]":case "[object Int16Array]":case "[object Int32Array]":case "[object Uint8Array]":case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":case "[object Uint32Array]":
          return Lr(r, i);case "[object Map]":
          return e = i ? u(L(r), 1) : L(r), h(e, n, new r.constructor());case "[object Number]":case "[object String]":
          return new o(r);case "[object RegExp]":
          return e = new r.constructor(r.source, dn.exec(r)), e.lastIndex = r.lastIndex, e;case "[object Set]":
          return e = i ? u(D(r), 1) : D(r), h(e, t, new r.constructor());case "[object Symbol]":
          return eo ? ni(eo.call(r)) : {};}
    }function Ie(n) {
      return af(n) || cf(n) || !!(mi && n && n[mi]);
    }function Re(n, t) {
      return t = null == t ? 9007199254740991 : t, !!t && (typeof n == "number" || wn.test(n)) && -1 < n && 0 == n % 1 && n < t;
    }function ze(n, t, r) {
      if (!bu(r)) return false;var e = typeof t === "undefined" ? "undefined" : _typeof(t);return !!("number" == e ? pu(r) && Re(t, r.length) : "string" == e && t in r) && hu(r[t], n);
    }function We(n, t) {
      if (af(n)) return false;var r = typeof n === "undefined" ? "undefined" : _typeof(n);return !("number" != r && "symbol" != r && "boolean" != r && null != n && !Au(n)) || rn.test(n) || !tn.test(n) || null != t && n in ni(t);
    }function Be(n) {
      var t = be(n),
          r = On[t];return typeof r == "function" && t in Mn.prototype && (n === r || (t = _o(r), !!t && n === t[0]));
    }function Le(n) {
      var t = n && n.constructor;
      return n === (typeof t == "function" && t.prototype || ii);
    }function Ue(n, t) {
      return function (r) {
        return null != r && r[n] === t && (t !== F || n in ni(r));
      };
    }function Ce(n, t, e) {
      return t = Di(t === F ? n.length - 1 : t, 0), function () {
        for (var u = arguments, i = -1, o = Di(u.length - t, 0), f = Hu(o); ++i < o;) {
          f[i] = u[t + i];
        }for (i = -1, o = Hu(t + 1); ++i < t;) {
          o[i] = u[i];
        }return o[t] = e(f), r(n, this, o);
      };
    }function De(n, t, r) {
      var e = t + "";t = wo;var u,
          i = Ne;return u = (u = e.match(hn)) ? u[1].split(pn) : [], r = i(u, r), (i = r.length) && (u = i - 1, r[u] = (1 < i ? "& " : "") + r[u], r = r.join(2 < i ? ", " : " "), e = e.replace(sn, "{\n/* [wrapped with " + r + "] */\n")), t(n, e);
    }function Me(n) {
      var t = 0,
          r = 0;return function () {
        var e = Ti(),
            u = 16 - (e - r);if (r = e, 0 < u) {
          if (800 <= ++t) return arguments[0];
        } else t = 0;return n.apply(F, arguments);
      };
    }function Te(n, t) {
      var r = -1,
          e = n.length,
          u = e - 1;for (t = t === F ? e : t; ++r < t;) {
        var e = cr(r, u),
            i = n[e];n[e] = n[r], n[r] = i;
      }return n.length = t, n;
    }function $e(n) {
      if (typeof n == "string" || Au(n)) return n;var t = n + "";return "0" == t && 1 / n == -N ? "-0" : t;
    }function Fe(n) {
      if (null != n) {
        try {
          return fi.call(n);
        } catch (n) {}return n + "";
      }return "";
    }function Ne(n, t) {
      return u(Z, function (r) {
        var e = "_." + r[0];t & r[1] && !c(n, e) && n.push(e);
      }), n.sort();
    }function Pe(n) {
      if (n instanceof Mn) return n.clone();var t = new zn(n.__wrapped__, n.__chain__);return t.__actions__ = Mr(n.__actions__), t.__index__ = n.__index__, t.__values__ = n.__values__, t;
    }function Ze(n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (r = null == r ? 0 : Ou(r), 0 > r && (r = Di(e + r, 0)), g(n, je(t, 3), r)) : -1;
    }function qe(n, t, r) {
      var e = null == n ? 0 : n.length;if (!e) return -1;var u = e - 1;return r !== F && (u = Ou(r), u = 0 > r ? Di(e + u, 0) : Mi(u, e - 1)), g(n, je(t, 3), u, true);
    }function Ve(n) {
      return (null == n ? 0 : n.length) ? kt(n, 1) : [];
    }function Ke(n) {
      return n && n.length ? n[0] : F;
    }function Ge(n) {
      var t = null == n ? 0 : n.length;return t ? n[t - 1] : F;
    }function He(n, t) {
      return n && n.length && t && t.length ? or(n, t) : n;
    }function Je(n) {
      return null == n ? n : Ni.call(n);
    }function Ye(n) {
      if (!n || !n.length) return [];var t = 0;return n = f(n, function (n) {
        if (_u(n)) return t = Di(n.length, t), true;
      }), E(t, function (t) {
        return l(n, j(t));
      });
    }function Qe(n, t) {
      if (!n || !n.length) return [];var e = Ye(n);return null == t ? e : l(e, function (n) {
        return r(t, F, n);
      });
    }function Xe(n) {
      return n = On(n), n.__chain__ = true, n;
    }function nu(n, t) {
      return t(n);
    }function tu() {
      return this;
    }function ru(n, t) {
      return (af(n) ? u : oo)(n, je(t, 3));
    }function eu(n, t) {
      return (af(n) ? i : fo)(n, je(t, 3));
    }function uu(n, t) {
      return (af(n) ? l : Yt)(n, je(t, 3));
    }function iu(n, t, r) {
      return t = r ? F : t, t = n && null == t ? n.length : t, le(n, 128, F, F, F, F, t);
    }function ou(n, t) {
      var r;if (typeof t != "function") throw new ei("Expected a function");return n = Ou(n), function () {
        return 0 < --n && (r = t.apply(this, arguments)), 1 >= n && (t = F), r;
      };
    }function fu(n, t, r) {
      return t = r ? F : t, n = le(n, 8, F, F, F, F, F, t), n.placeholder = fu.placeholder, n;
    }function cu(n, t, r) {
      return t = r ? F : t, n = le(n, 16, F, F, F, F, F, t), n.placeholder = cu.placeholder, n;
    }function au(n, t, r) {
      function e(t) {
        var r = c,
            e = a;return c = a = F, _ = t, s = n.apply(e, r);
      }function u(n) {
        var r = n - p;return n -= _, p === F || r >= t || 0 > r || g && n >= l;
      }function i() {
        var n = Jo();if (u(n)) return o(n);var r,
            e = jo;r = n - _, n = t - (n - p), r = g ? Mi(n, l - r) : n, h = e(i, r);
      }function o(n) {
        return h = F, d && c ? e(n) : (c = a = F, s);
      }function f() {
        var n = Jo(),
            r = u(n);if (c = arguments, a = this, p = n, r) {
          if (h === F) return _ = n = p, h = jo(i, t), v ? e(n) : s;if (g) return h = jo(i, t), e(p);
        }return h === F && (h = jo(i, t)), s;
      }var c,
          a,
          l,
          s,
          h,
          p,
          _ = 0,
          v = false,
          g = false,
          d = true;if (typeof n != "function") throw new ei("Expected a function");return t = Iu(t) || 0, bu(r) && (v = !!r.leading, l = (g = "maxWait" in r) ? Di(Iu(r.maxWait) || 0, t) : l, d = "trailing" in r ? !!r.trailing : d), f.cancel = function () {
        h !== F && ho(h), _ = 0, c = p = a = h = F;
      }, f.flush = function () {
        return h === F ? s : o(Jo());
      }, f;
    }function lu(n, t) {
      function r() {
        var e = arguments,
            u = t ? t.apply(this, e) : e[0],
            i = r.cache;return i.has(u) ? i.get(u) : (e = n.apply(this, e), r.cache = i.set(u, e) || i, e);
      }if (typeof n != "function" || null != t && typeof t != "function") throw new ei("Expected a function");return r.cache = new (lu.Cache || Pn)(), r;
    }function su(n) {
      if (typeof n != "function") throw new ei("Expected a function");return function () {
        var t = arguments;switch (t.length) {case 0:
            return !n.call(this);case 1:
            return !n.call(this, t[0]);case 2:
            return !n.call(this, t[0], t[1]);case 3:
            return !n.call(this, t[0], t[1], t[2]);}return !n.apply(this, t);
      };
    }function hu(n, t) {
      return n === t || n !== n && t !== t;
    }function pu(n) {
      return null != n && yu(n.length) && !gu(n);
    }function _u(n) {
      return xu(n) && pu(n);
    }function vu(n) {
      if (!xu(n)) return false;var t = zt(n);return "[object Error]" == t || "[object DOMException]" == t || typeof n.message == "string" && typeof n.name == "string" && !wu(n);
    }function gu(n) {
      return !!bu(n) && (n = zt(n), "[object Function]" == n || "[object GeneratorFunction]" == n || "[object AsyncFunction]" == n || "[object Proxy]" == n);
    }function du(n) {
      return typeof n == "number" && n == Ou(n);
    }function yu(n) {
      return typeof n == "number" && -1 < n && 0 == n % 1 && 9007199254740991 >= n;
    }function bu(n) {
      var t = typeof n === "undefined" ? "undefined" : _typeof(n);return null != n && ("object" == t || "function" == t);
    }function xu(n) {
      return null != n && (typeof n === "undefined" ? "undefined" : _typeof(n)) == "object";
    }function ju(n) {
      return typeof n == "number" || xu(n) && "[object Number]" == zt(n);
    }function wu(n) {
      return !(!xu(n) || "[object Object]" != zt(n)) && (n = bi(n), null === n || (n = ci.call(n, "constructor") && n.constructor, typeof n == "function" && n instanceof n && fi.call(n) == hi));
    }function mu(n) {
      return typeof n == "string" || !af(n) && xu(n) && "[object String]" == zt(n);
    }function Au(n) {
      return (typeof n === "undefined" ? "undefined" : _typeof(n)) == "symbol" || xu(n) && "[object Symbol]" == zt(n);
    }function ku(n) {
      if (!n) return [];if (pu(n)) return mu(n) ? $(n) : Mr(n);
      if (Ai && n[Ai]) {
        n = n[Ai]();for (var t, r = []; !(t = n.next()).done;) {
          r.push(t.value);
        }return r;
      }return t = yo(n), ("[object Map]" == t ? L : "[object Set]" == t ? D : Du)(n);
    }function Eu(n) {
      return n ? (n = Iu(n), n === N || n === -N ? 1.7976931348623157e308 * (0 > n ? -1 : 1) : n === n ? n : 0) : 0 === n ? n : 0;
    }function Ou(n) {
      n = Eu(n);var t = n % 1;return n === n ? t ? n - t : n : 0;
    }function Su(n) {
      return n ? gt(Ou(n), 0, 4294967295) : 0;
    }function Iu(n) {
      if (typeof n == "number") return n;if (Au(n)) return P;if (bu(n) && (n = typeof n.valueOf == "function" ? n.valueOf() : n, n = bu(n) ? n + "" : n), typeof n != "string") return 0 === n ? n : +n;
      n = n.replace(cn, "");var t = bn.test(n);return t || jn.test(n) ? Fn(n.slice(2), t ? 2 : 8) : yn.test(n) ? P : +n;
    }function Ru(n) {
      return Tr(n, Uu(n));
    }function zu(n) {
      return null == n ? "" : jr(n);
    }function Wu(n, t, r) {
      return n = null == n ? F : It(n, t), n === F ? r : n;
    }function Bu(n, t) {
      return null != n && ke(n, t, Lt);
    }function Lu(n) {
      return pu(n) ? Gn(n) : Ht(n);
    }function Uu(n) {
      if (pu(n)) n = Gn(n, true);else if (bu(n)) {
        var t,
            r = Le(n),
            e = [];for (t in n) {
          ("constructor" != t || !r && ci.call(n, t)) && e.push(t);
        }n = e;
      } else {
        if (t = [], null != n) for (r in ni(n)) {
          t.push(r);
        }n = t;
      }return n;
    }function Cu(n, t) {
      if (null == n) return {};var r = l(ye(n), function (n) {
        return [n];
      });return t = je(t), ur(n, r, function (n, r) {
        return t(n, r[0]);
      });
    }function Du(n) {
      return null == n ? [] : I(n, Lu(n));
    }function Mu(n) {
      return Nf(zu(n).toLowerCase());
    }function Tu(n) {
      return (n = zu(n)) && n.replace(mn, rt).replace(Rn, "");
    }function $u(n, t, r) {
      return n = zu(n), t = r ? F : t, t === F ? Ln.test(n) ? n.match(Wn) || [] : n.match(_n) || [] : n.match(t) || [];
    }function Fu(n) {
      return function () {
        return n;
      };
    }function Nu(n) {
      return n;
    }function Pu(n) {
      return Gt(typeof n == "function" ? n : dt(n, 1));
    }function Zu(n, t, r) {
      var e = Lu(t),
          i = St(t, e);null != r || bu(t) && (i.length || !e.length) || (r = t, t = n, n = this, i = St(t, Lu(t)));var o = !(bu(r) && "chain" in r && !r.chain),
          f = gu(n);return u(i, function (r) {
        var e = t[r];n[r] = e, f && (n.prototype[r] = function () {
          var t = this.__chain__;if (o || t) {
            var r = n(this.__wrapped__);return (r.__actions__ = Mr(this.__actions__)).push({ func: e, args: arguments, thisArg: n }), r.__chain__ = t, r;
          }return e.apply(n, s([this.value()], arguments));
        });
      }), n;
    }function qu() {}function Vu(n) {
      return We(n) ? j($e(n)) : ir(n);
    }function Ku() {
      return [];
    }function Gu() {
      return false;
    }En = null == En ? Zn : it.defaults(Zn.Object(), En, it.pick(Zn, Un));var Hu = En.Array,
        Ju = En.Date,
        Yu = En.Error,
        Qu = En.Function,
        Xu = En.Math,
        ni = En.Object,
        ti = En.RegExp,
        ri = En.String,
        ei = En.TypeError,
        ui = Hu.prototype,
        ii = ni.prototype,
        oi = En["__core-js_shared__"],
        fi = Qu.prototype.toString,
        ci = ii.hasOwnProperty,
        ai = 0,
        li = function () {
      var n = /[^.]+$/.exec(oi && oi.keys && oi.keys.IE_PROTO || "");return n ? "Symbol(src)_1." + n : "";
    }(),
        si = ii.toString,
        hi = fi.call(ni),
        pi = Zn._,
        _i = ti("^" + fi.call(ci).replace(on, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
        vi = Kn ? En.Buffer : F,
        gi = En.Symbol,
        di = En.Uint8Array,
        yi = vi ? vi.f : F,
        bi = U(ni.getPrototypeOf, ni),
        xi = ni.create,
        ji = ii.propertyIsEnumerable,
        wi = ui.splice,
        mi = gi ? gi.isConcatSpreadable : F,
        Ai = gi ? gi.iterator : F,
        ki = gi ? gi.toStringTag : F,
        Ei = function () {
      try {
        var n = Ae(ni, "defineProperty");return n({}, "", {}), n;
      } catch (n) {}
    }(),
        Oi = En.clearTimeout !== Zn.clearTimeout && En.clearTimeout,
        Si = Ju && Ju.now !== Zn.Date.now && Ju.now,
        Ii = En.setTimeout !== Zn.setTimeout && En.setTimeout,
        Ri = Xu.ceil,
        zi = Xu.floor,
        Wi = ni.getOwnPropertySymbols,
        Bi = vi ? vi.isBuffer : F,
        Li = En.isFinite,
        Ui = ui.join,
        Ci = U(ni.keys, ni),
        Di = Xu.max,
        Mi = Xu.min,
        Ti = Ju.now,
        $i = En.parseInt,
        Fi = Xu.random,
        Ni = ui.reverse,
        Pi = Ae(En, "DataView"),
        Zi = Ae(En, "Map"),
        qi = Ae(En, "Promise"),
        Vi = Ae(En, "Set"),
        Ki = Ae(En, "WeakMap"),
        Gi = Ae(ni, "create"),
        Hi = Ki && new Ki(),
        Ji = {},
        Yi = Fe(Pi),
        Qi = Fe(Zi),
        Xi = Fe(qi),
        no = Fe(Vi),
        to = Fe(Ki),
        ro = gi ? gi.prototype : F,
        eo = ro ? ro.valueOf : F,
        uo = ro ? ro.toString : F,
        io = function () {
      function n() {}return function (t) {
        return bu(t) ? xi ? xi(t) : (n.prototype = t, t = new n(), n.prototype = F, t) : {};
      };
    }();On.templateSettings = { escape: Q, evaluate: X, interpolate: nn, variable: "", imports: { _: On } }, On.prototype = Sn.prototype, On.prototype.constructor = On, zn.prototype = io(Sn.prototype), zn.prototype.constructor = zn, Mn.prototype = io(Sn.prototype), Mn.prototype.constructor = Mn, Tn.prototype.clear = function () {
      this.__data__ = Gi ? Gi(null) : {}, this.size = 0;
    }, Tn.prototype.delete = function (n) {
      return n = this.has(n) && delete this.__data__[n], this.size -= n ? 1 : 0, n;
    }, Tn.prototype.get = function (n) {
      var t = this.__data__;return Gi ? (n = t[n], "__lodash_hash_undefined__" === n ? F : n) : ci.call(t, n) ? t[n] : F;
    }, Tn.prototype.has = function (n) {
      var t = this.__data__;return Gi ? t[n] !== F : ci.call(t, n);
    }, Tn.prototype.set = function (n, t) {
      var r = this.__data__;return this.size += this.has(n) ? 0 : 1, r[n] = Gi && t === F ? "__lodash_hash_undefined__" : t, this;
    }, Nn.prototype.clear = function () {
      this.__data__ = [], this.size = 0;
    }, Nn.prototype.delete = function (n) {
      var t = this.__data__;return n = lt(t, n), !(0 > n) && (n == t.length - 1 ? t.pop() : wi.call(t, n, 1), --this.size, true);
    }, Nn.prototype.get = function (n) {
      var t = this.__data__;return n = lt(t, n), 0 > n ? F : t[n][1];
    }, Nn.prototype.has = function (n) {
      return -1 < lt(this.__data__, n);
    }, Nn.prototype.set = function (n, t) {
      var r = this.__data__,
          e = lt(r, n);return 0 > e ? (++this.size, r.push([n, t])) : r[e][1] = t, this;
    }, Pn.prototype.clear = function () {
      this.size = 0, this.__data__ = { hash: new Tn(), map: new (Zi || Nn)(), string: new Tn() };
    }, Pn.prototype.delete = function (n) {
      return n = we(this, n).delete(n), this.size -= n ? 1 : 0, n;
    }, Pn.prototype.get = function (n) {
      return we(this, n).get(n);
    }, Pn.prototype.has = function (n) {
      return we(this, n).has(n);
    }, Pn.prototype.set = function (n, t) {
      var r = we(this, n),
          e = r.size;return r.set(n, t), this.size += r.size == e ? 0 : 1, this;
    }, qn.prototype.add = qn.prototype.push = function (n) {
      return this.__data__.set(n, "__lodash_hash_undefined__"), this;
    }, qn.prototype.has = function (n) {
      return this.__data__.has(n);
    }, Vn.prototype.clear = function () {
      this.__data__ = new Nn(), this.size = 0;
    }, Vn.prototype.delete = function (n) {
      var t = this.__data__;return n = t.delete(n), this.size = t.size, n;
    }, Vn.prototype.get = function (n) {
      return this.__data__.get(n);
    }, Vn.prototype.has = function (n) {
      return this.__data__.has(n);
    }, Vn.prototype.set = function (n, t) {
      var r = this.__data__;if (r instanceof Nn) {
        var e = r.__data__;if (!Zi || 199 > e.length) return e.push([n, t]), this.size = ++r.size, this;r = this.__data__ = new Pn(e);
      }return r.set(n, t), this.size = r.size, this;
    };var oo = Zr(Et),
        fo = Zr(Ot, true),
        co = qr(),
        ao = qr(true),
        lo = Hi ? function (n, t) {
      return Hi.set(n, t), n;
    } : Nu,
        so = Ei ? function (n, t) {
      return Ei(n, "toString", { configurable: true, enumerable: false, value: Fu(t), writable: true });
    } : Nu,
        ho = Oi || function (n) {
      return Zn.clearTimeout(n);
    },
        po = Vi && 1 / D(new Vi([, -0]))[1] == N ? function (n) {
      return new Vi(n);
    } : qu,
        _o = Hi ? function (n) {
      return Hi.get(n);
    } : qu,
        vo = Wi ? function (n) {
      return null == n ? [] : (n = ni(n), f(Wi(n), function (t) {
        return ji.call(n, t);
      }));
    } : Ku,
        go = Wi ? function (n) {
      for (var t = []; n;) {
        s(t, vo(n)), n = bi(n);
      }return t;
    } : Ku,
        yo = zt;(Pi && "[object DataView]" != yo(new Pi(new ArrayBuffer(1))) || Zi && "[object Map]" != yo(new Zi()) || qi && "[object Promise]" != yo(qi.resolve()) || Vi && "[object Set]" != yo(new Vi()) || Ki && "[object WeakMap]" != yo(new Ki())) && (yo = function yo(n) {
      var t = zt(n);if (n = (n = "[object Object]" == t ? n.constructor : F) ? Fe(n) : "") switch (n) {case Yi:
          return "[object DataView]";case Qi:
          return "[object Map]";case Xi:
          return "[object Promise]";case no:
          return "[object Set]";case to:
          return "[object WeakMap]";}return t;
    });var bo = oi ? gu : Gu,
        xo = Me(lo),
        jo = Ii || function (n, t) {
      return Zn.setTimeout(n, t);
    },
        wo = Me(so),
        mo = function (n) {
      n = lu(n, function (n) {
        return 500 === t.size && t.clear(), n;
      });var t = n.cache;return n;
    }(function (n) {
      var t = [];return en.test(n) && t.push(""), n.replace(un, function (n, r, e, u) {
        t.push(e ? u.replace(vn, "$1") : r || n);
      }), t;
    }),
        Ao = lr(function (n, t) {
      return _u(n) ? jt(n, kt(t, 1, _u, true)) : [];
    }),
        ko = lr(function (n, t) {
      var r = Ge(t);return _u(r) && (r = F), _u(n) ? jt(n, kt(t, 1, _u, true), je(r, 2)) : [];
    }),
        Eo = lr(function (n, t) {
      var r = Ge(t);return _u(r) && (r = F), _u(n) ? jt(n, kt(t, 1, _u, true), F, r) : [];
    }),
        Oo = lr(function (n) {
      var t = l(n, Sr);return t.length && t[0] === n[0] ? Ut(t) : [];
    }),
        So = lr(function (n) {
      var t = Ge(n),
          r = l(n, Sr);return t === Ge(r) ? t = F : r.pop(), r.length && r[0] === n[0] ? Ut(r, je(t, 2)) : [];
    }),
        Io = lr(function (n) {
      var t = Ge(n),
          r = l(n, Sr);return (t = typeof t == "function" ? t : F) && r.pop(), r.length && r[0] === n[0] ? Ut(r, F, t) : [];
    }),
        Ro = lr(He),
        zo = ge(function (n, t) {
      var r = null == n ? 0 : n.length,
          e = vt(n, t);return fr(n, l(t, function (n) {
        return Re(n, r) ? +n : n;
      }).sort(Ur)), e;
    }),
        Wo = lr(function (n) {
      return wr(kt(n, 1, _u, true));
    }),
        Bo = lr(function (n) {
      var t = Ge(n);return _u(t) && (t = F), wr(kt(n, 1, _u, true), je(t, 2));
    }),
        Lo = lr(function (n) {
      var t = Ge(n),
          t = typeof t == "function" ? t : F;return wr(kt(n, 1, _u, true), F, t);
    }),
        Uo = lr(function (n, t) {
      return _u(n) ? jt(n, t) : [];
    }),
        Co = lr(function (n) {
      return Er(f(n, _u));
    }),
        Do = lr(function (n) {
      var t = Ge(n);return _u(t) && (t = F), Er(f(n, _u), je(t, 2));
    }),
        Mo = lr(function (n) {
      var t = Ge(n),
          t = typeof t == "function" ? t : F;return Er(f(n, _u), F, t);
    }),
        To = lr(Ye),
        $o = lr(function (n) {
      var t = n.length,
          t = 1 < t ? n[t - 1] : F,
          t = typeof t == "function" ? (n.pop(), t) : F;return Qe(n, t);
    }),
        Fo = ge(function (n) {
      function t(t) {
        return vt(t, n);
      }var r = n.length,
          e = r ? n[0] : 0,
          u = this.__wrapped__;return !(1 < r || this.__actions__.length) && u instanceof Mn && Re(e) ? (u = u.slice(e, +e + (r ? 1 : 0)), u.__actions__.push({ func: nu, args: [t], thisArg: F }), new zn(u, this.__chain__).thru(function (n) {
        return r && !n.length && n.push(F), n;
      })) : this.thru(t);
    }),
        No = Nr(function (n, t, r) {
      ci.call(n, r) ? ++n[r] : _t(n, r, 1);
    }),
        Po = Yr(Ze),
        Zo = Yr(qe),
        qo = Nr(function (n, t, r) {
      ci.call(n, r) ? n[r].push(t) : _t(n, r, [t]);
    }),
        Vo = lr(function (n, t, e) {
      var u = -1,
          i = typeof t == "function",
          o = pu(n) ? Hu(n.length) : [];return oo(n, function (n) {
        o[++u] = i ? r(t, n, e) : Dt(n, t, e);
      }), o;
    }),
        Ko = Nr(function (n, t, r) {
      _t(n, r, t);
    }),
        Go = Nr(function (n, t, r) {
      n[r ? 0 : 1].push(t);
    }, function () {
      return [[], []];
    }),
        Ho = lr(function (n, t) {
      if (null == n) return [];var r = t.length;return 1 < r && ze(n, t[0], t[1]) ? t = [] : 2 < r && ze(t[0], t[1], t[2]) && (t = [t[0]]), rr(n, kt(t, 1), []);
    }),
        Jo = Si || function () {
      return Zn.Date.now();
    },
        Yo = lr(function (n, t, r) {
      var e = 1;if (r.length) var u = C(r, xe(Yo)),
          e = 32 | e;return le(n, e, t, r, u);
    }),
        Qo = lr(function (n, t, r) {
      var e = 3;if (r.length) var u = C(r, xe(Qo)),
          e = 32 | e;return le(t, e, n, r, u);
    }),
        Xo = lr(function (n, t) {
      return xt(n, 1, t);
    }),
        nf = lr(function (n, t, r) {
      return xt(n, Iu(t) || 0, r);
    });lu.Cache = Pn;var tf = lr(function (n, t) {
      t = 1 == t.length && af(t[0]) ? l(t[0], S(je())) : l(kt(t, 1), S(je()));var e = t.length;return lr(function (u) {
        for (var i = -1, o = Mi(u.length, e); ++i < o;) {
          u[i] = t[i].call(this, u[i]);
        }return r(n, this, u);
      });
    }),
        rf = lr(function (n, t) {
      return le(n, 32, F, t, C(t, xe(rf)));
    }),
        ef = lr(function (n, t) {
      return le(n, 64, F, t, C(t, xe(ef)));
    }),
        uf = ge(function (n, t) {
      return le(n, 256, F, F, F, t);
    }),
        of = oe(Wt),
        ff = oe(function (n, t) {
      return n >= t;
    }),
        cf = Mt(function () {
      return arguments;
    }()) ? Mt : function (n) {
      return xu(n) && ci.call(n, "callee") && !ji.call(n, "callee");
    },
        af = Hu.isArray,
        lf = Hn ? S(Hn) : Tt,
        sf = Bi || Gu,
        hf = Jn ? S(Jn) : $t,
        pf = Yn ? S(Yn) : Nt,
        _f = Qn ? S(Qn) : qt,
        vf = Xn ? S(Xn) : Vt,
        gf = nt ? S(nt) : Kt,
        df = oe(Jt),
        yf = oe(function (n, t) {
      return n <= t;
    }),
        bf = Pr(function (n, t) {
      if (Le(t) || pu(t)) Tr(t, Lu(t), n);else for (var r in t) {
        ci.call(t, r) && at(n, r, t[r]);
      }
    }),
        xf = Pr(function (n, t) {
      Tr(t, Uu(t), n);
    }),
        jf = Pr(function (n, t, r, e) {
      Tr(t, Uu(t), n, e);
    }),
        wf = Pr(function (n, t, r, e) {
      Tr(t, Lu(t), n, e);
    }),
        mf = ge(vt),
        Af = lr(function (n) {
      return n.push(F, se), r(jf, F, n);
    }),
        kf = lr(function (n) {
      return n.push(F, he), r(Rf, F, n);
    }),
        Ef = ne(function (n, t, r) {
      n[t] = r;
    }, Fu(Nu)),
        Of = ne(function (n, t, r) {
      ci.call(n, t) ? n[t].push(r) : n[t] = [r];
    }, je),
        Sf = lr(Dt),
        If = Pr(function (n, t, r) {
      nr(n, t, r);
    }),
        Rf = Pr(function (n, t, r, e) {
      nr(n, t, r, e);
    }),
        zf = ge(function (n, t) {
      var r = {};if (null == n) return r;var e = false;t = l(t, function (t) {
        return t = Rr(t, n), e || (e = 1 < t.length), t;
      }), Tr(n, ye(n), r), e && (r = dt(r, 7, pe));for (var u = t.length; u--;) {
        mr(r, t[u]);
      }return r;
    }),
        Wf = ge(function (n, t) {
      return null == n ? {} : er(n, t);
    }),
        Bf = ae(Lu),
        Lf = ae(Uu),
        Uf = Gr(function (n, t, r) {
      return t = t.toLowerCase(), n + (r ? Mu(t) : t);
    }),
        Cf = Gr(function (n, t, r) {
      return n + (r ? "-" : "") + t.toLowerCase();
    }),
        Df = Gr(function (n, t, r) {
      return n + (r ? " " : "") + t.toLowerCase();
    }),
        Mf = Kr("toLowerCase"),
        Tf = Gr(function (n, t, r) {
      return n + (r ? "_" : "") + t.toLowerCase();
    }),
        $f = Gr(function (n, t, r) {
      return n + (r ? " " : "") + Nf(t);
    }),
        Ff = Gr(function (n, t, r) {
      return n + (r ? " " : "") + t.toUpperCase();
    }),
        Nf = Kr("toUpperCase"),
        Pf = lr(function (n, t) {
      try {
        return r(n, F, t);
      } catch (n) {
        return vu(n) ? n : new Yu(n);
      }
    }),
        Zf = ge(function (n, t) {
      return u(t, function (t) {
        t = $e(t), _t(n, t, Yo(n[t], n));
      }), n;
    }),
        qf = Qr(),
        Vf = Qr(true),
        Kf = lr(function (n, t) {
      return function (r) {
        return Dt(r, n, t);
      };
    }),
        Gf = lr(function (n, t) {
      return function (r) {
        return Dt(n, r, t);
      };
    }),
        Hf = re(l),
        Jf = re(o),
        Yf = re(_),
        Qf = ie(),
        Xf = ie(true),
        nc = te(function (n, t) {
      return n + t;
    }, 0),
        tc = ce("ceil"),
        rc = te(function (n, t) {
      return n / t;
    }, 1),
        ec = ce("floor"),
        uc = te(function (n, t) {
      return n * t;
    }, 1),
        ic = ce("round"),
        oc = te(function (n, t) {
      return n - t;
    }, 0);return On.after = function (n, t) {
      if (typeof t != "function") throw new ei("Expected a function");return n = Ou(n), function () {
        if (1 > --n) return t.apply(this, arguments);
      };
    }, On.ary = iu, On.assign = bf, On.assignIn = xf, On.assignInWith = jf, On.assignWith = wf, On.at = mf, On.before = ou, On.bind = Yo, On.bindAll = Zf, On.bindKey = Qo, On.castArray = function () {
      if (!arguments.length) return [];var n = arguments[0];return af(n) ? n : [n];
    }, On.chain = Xe, On.chunk = function (n, t, r) {
      if (t = (r ? ze(n, t, r) : t === F) ? 1 : Di(Ou(t), 0), r = null == n ? 0 : n.length, !r || 1 > t) return [];for (var e = 0, u = 0, i = Hu(Ri(r / t)); e < r;) {
        i[u++] = vr(n, e, e += t);
      }return i;
    }, On.compact = function (n) {
      for (var t = -1, r = null == n ? 0 : n.length, e = 0, u = []; ++t < r;) {
        var i = n[t];i && (u[e++] = i);
      }return u;
    }, On.concat = function () {
      var n = arguments.length;if (!n) return [];for (var t = Hu(n - 1), r = arguments[0]; n--;) {
        t[n - 1] = arguments[n];
      }return s(af(r) ? Mr(r) : [r], kt(t, 1));
    }, On.cond = function (n) {
      var t = null == n ? 0 : n.length,
          e = je();return n = t ? l(n, function (n) {
        if ("function" != typeof n[1]) throw new ei("Expected a function");return [e(n[0]), n[1]];
      }) : [], lr(function (e) {
        for (var u = -1; ++u < t;) {
          var i = n[u];if (r(i[0], this, e)) return r(i[1], this, e);
        }
      });
    }, On.conforms = function (n) {
      return yt(dt(n, 1));
    }, On.constant = Fu, On.countBy = No, On.create = function (n, t) {
      var r = io(n);return null == t ? r : ht(r, t);
    }, On.curry = fu, On.curryRight = cu, On.debounce = au, On.defaults = Af, On.defaultsDeep = kf, On.defer = Xo, On.delay = nf, On.difference = Ao, On.differenceBy = ko, On.differenceWith = Eo, On.drop = function (n, t, r) {
      var e = null == n ? 0 : n.length;
      return e ? (t = r || t === F ? 1 : Ou(t), vr(n, 0 > t ? 0 : t, e)) : [];
    }, On.dropRight = function (n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (t = r || t === F ? 1 : Ou(t), t = e - t, vr(n, 0, 0 > t ? 0 : t)) : [];
    }, On.dropRightWhile = function (n, t) {
      return n && n.length ? Ar(n, je(t, 3), true, true) : [];
    }, On.dropWhile = function (n, t) {
      return n && n.length ? Ar(n, je(t, 3), true) : [];
    }, On.fill = function (n, t, r, e) {
      var u = null == n ? 0 : n.length;if (!u) return [];for (r && typeof r != "number" && ze(n, t, r) && (r = 0, e = u), u = n.length, r = Ou(r), 0 > r && (r = -r > u ? 0 : u + r), e = e === F || e > u ? u : Ou(e), 0 > e && (e += u), e = r > e ? 0 : Su(e); r < e;) {
        n[r++] = t;
      }return n;
    }, On.filter = function (n, t) {
      return (af(n) ? f : At)(n, je(t, 3));
    }, On.flatMap = function (n, t) {
      return kt(uu(n, t), 1);
    }, On.flatMapDeep = function (n, t) {
      return kt(uu(n, t), N);
    }, On.flatMapDepth = function (n, t, r) {
      return r = r === F ? 1 : Ou(r), kt(uu(n, t), r);
    }, On.flatten = Ve, On.flattenDeep = function (n) {
      return (null == n ? 0 : n.length) ? kt(n, N) : [];
    }, On.flattenDepth = function (n, t) {
      return null != n && n.length ? (t = t === F ? 1 : Ou(t), kt(n, t)) : [];
    }, On.flip = function (n) {
      return le(n, 512);
    }, On.flow = qf, On.flowRight = Vf, On.fromPairs = function (n) {
      for (var t = -1, r = null == n ? 0 : n.length, e = {}; ++t < r;) {
        var u = n[t];e[u[0]] = u[1];
      }return e;
    }, On.functions = function (n) {
      return null == n ? [] : St(n, Lu(n));
    }, On.functionsIn = function (n) {
      return null == n ? [] : St(n, Uu(n));
    }, On.groupBy = qo, On.initial = function (n) {
      return (null == n ? 0 : n.length) ? vr(n, 0, -1) : [];
    }, On.intersection = Oo, On.intersectionBy = So, On.intersectionWith = Io, On.invert = Ef, On.invertBy = Of, On.invokeMap = Vo, On.iteratee = Pu, On.keyBy = Ko, On.keys = Lu, On.keysIn = Uu, On.map = uu, On.mapKeys = function (n, t) {
      var r = {};return t = je(t, 3), Et(n, function (n, e, u) {
        _t(r, t(n, e, u), n);
      }), r;
    }, On.mapValues = function (n, t) {
      var r = {};return t = je(t, 3), Et(n, function (n, e, u) {
        _t(r, e, t(n, e, u));
      }), r;
    }, On.matches = function (n) {
      return Qt(dt(n, 1));
    }, On.matchesProperty = function (n, t) {
      return Xt(n, dt(t, 1));
    }, On.memoize = lu, On.merge = If, On.mergeWith = Rf, On.method = Kf, On.methodOf = Gf, On.mixin = Zu, On.negate = su, On.nthArg = function (n) {
      return n = Ou(n), lr(function (t) {
        return tr(t, n);
      });
    }, On.omit = zf, On.omitBy = function (n, t) {
      return Cu(n, su(je(t)));
    }, On.once = function (n) {
      return ou(2, n);
    }, On.orderBy = function (n, t, r, e) {
      return null == n ? [] : (af(t) || (t = null == t ? [] : [t]), r = e ? F : r, af(r) || (r = null == r ? [] : [r]), rr(n, t, r));
    }, On.over = Hf, On.overArgs = tf, On.overEvery = Jf, On.overSome = Yf, On.partial = rf, On.partialRight = ef, On.partition = Go, On.pick = Wf, On.pickBy = Cu, On.property = Vu, On.propertyOf = function (n) {
      return function (t) {
        return null == n ? F : It(n, t);
      };
    }, On.pull = Ro, On.pullAll = He, On.pullAllBy = function (n, t, r) {
      return n && n.length && t && t.length ? or(n, t, je(r, 2)) : n;
    }, On.pullAllWith = function (n, t, r) {
      return n && n.length && t && t.length ? or(n, t, F, r) : n;
    }, On.pullAt = zo, On.range = Qf, On.rangeRight = Xf, On.rearg = uf, On.reject = function (n, t) {
      return (af(n) ? f : At)(n, su(je(t, 3)));
    }, On.remove = function (n, t) {
      var r = [];if (!n || !n.length) return r;var e = -1,
          u = [],
          i = n.length;for (t = je(t, 3); ++e < i;) {
        var o = n[e];t(o, e, n) && (r.push(o), u.push(e));
      }return fr(n, u), r;
    }, On.rest = function (n, t) {
      if (typeof n != "function") throw new ei("Expected a function");return t = t === F ? t : Ou(t), lr(n, t);
    }, On.reverse = Je, On.sampleSize = function (n, t, r) {
      return t = (r ? ze(n, t, r) : t === F) ? 1 : Ou(t), (af(n) ? ot : hr)(n, t);
    }, On.set = function (n, t, r) {
      return null == n ? n : pr(n, t, r);
    }, On.setWith = function (n, t, r, e) {
      return e = typeof e == "function" ? e : F, null == n ? n : pr(n, t, r, e);
    }, On.shuffle = function (n) {
      return (af(n) ? ft : _r)(n);
    }, On.slice = function (n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (r && typeof r != "number" && ze(n, t, r) ? (t = 0, r = e) : (t = null == t ? 0 : Ou(t), r = r === F ? e : Ou(r)), vr(n, t, r)) : [];
    }, On.sortBy = Ho, On.sortedUniq = function (n) {
      return n && n.length ? br(n) : [];
    }, On.sortedUniqBy = function (n, t) {
      return n && n.length ? br(n, je(t, 2)) : [];
    }, On.split = function (n, t, r) {
      return r && typeof r != "number" && ze(n, t, r) && (t = r = F), r = r === F ? 4294967295 : r >>> 0, r ? (n = zu(n)) && (typeof t == "string" || null != t && !_f(t)) && (t = jr(t), !t && Bn.test(n)) ? zr($(n), 0, r) : n.split(t, r) : [];
    }, On.spread = function (n, t) {
      if (typeof n != "function") throw new ei("Expected a function");return t = null == t ? 0 : Di(Ou(t), 0), lr(function (e) {
        var u = e[t];return e = zr(e, 0, t), u && s(e, u), r(n, this, e);
      });
    }, On.tail = function (n) {
      var t = null == n ? 0 : n.length;return t ? vr(n, 1, t) : [];
    }, On.take = function (n, t, r) {
      return n && n.length ? (t = r || t === F ? 1 : Ou(t), vr(n, 0, 0 > t ? 0 : t)) : [];
    }, On.takeRight = function (n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (t = r || t === F ? 1 : Ou(t), t = e - t, vr(n, 0 > t ? 0 : t, e)) : [];
    }, On.takeRightWhile = function (n, t) {
      return n && n.length ? Ar(n, je(t, 3), false, true) : [];
    }, On.takeWhile = function (n, t) {
      return n && n.length ? Ar(n, je(t, 3)) : [];
    }, On.tap = function (n, t) {
      return t(n), n;
    }, On.throttle = function (n, t, r) {
      var e = true,
          u = true;if (typeof n != "function") throw new ei("Expected a function");return bu(r) && (e = "leading" in r ? !!r.leading : e, u = "trailing" in r ? !!r.trailing : u), au(n, t, { leading: e, maxWait: t, trailing: u });
    }, On.thru = nu, On.toArray = ku, On.toPairs = Bf, On.toPairsIn = Lf, On.toPath = function (n) {
      return af(n) ? l(n, $e) : Au(n) ? [n] : Mr(mo(zu(n)));
    }, On.toPlainObject = Ru, On.transform = function (n, t, r) {
      var e = af(n),
          i = e || sf(n) || gf(n);if (t = je(t, 4), null == r) {
        var o = n && n.constructor;r = i ? e ? new o() : [] : bu(n) && gu(o) ? io(bi(n)) : {};
      }return (i ? u : Et)(n, function (n, e, u) {
        return t(r, n, e, u);
      }), r;
    }, On.unary = function (n) {
      return iu(n, 1);
    }, On.union = Wo, On.unionBy = Bo, On.unionWith = Lo, On.uniq = function (n) {
      return n && n.length ? wr(n) : [];
    }, On.uniqBy = function (n, t) {
      return n && n.length ? wr(n, je(t, 2)) : [];
    }, On.uniqWith = function (n, t) {
      return t = typeof t == "function" ? t : F, n && n.length ? wr(n, F, t) : [];
    }, On.unset = function (n, t) {
      return null == n || mr(n, t);
    }, On.unzip = Ye, On.unzipWith = Qe, On.update = function (n, t, r) {
      return null == n ? n : pr(n, t, Ir(r)(It(n, t)), void 0);
    }, On.updateWith = function (n, t, r, e) {
      return e = typeof e == "function" ? e : F, null != n && (n = pr(n, t, Ir(r)(It(n, t)), e)), n;
    }, On.values = Du, On.valuesIn = function (n) {
      return null == n ? [] : I(n, Uu(n));
    }, On.without = Uo, On.words = $u, On.wrap = function (n, t) {
      return rf(Ir(t), n);
    }, On.xor = Co, On.xorBy = Do, On.xorWith = Mo, On.zip = To, On.zipObject = function (n, t) {
      return Or(n || [], t || [], at);
    }, On.zipObjectDeep = function (n, t) {
      return Or(n || [], t || [], pr);
    }, On.zipWith = $o, On.entries = Bf, On.entriesIn = Lf, On.extend = xf, On.extendWith = jf, Zu(On, On), On.add = nc, On.attempt = Pf, On.camelCase = Uf, On.capitalize = Mu, On.ceil = tc, On.clamp = function (n, t, r) {
      return r === F && (r = t, t = F), r !== F && (r = Iu(r), r = r === r ? r : 0), t !== F && (t = Iu(t), t = t === t ? t : 0), gt(Iu(n), t, r);
    }, On.clone = function (n) {
      return dt(n, 4);
    }, On.cloneDeep = function (n) {
      return dt(n, 5);
    }, On.cloneDeepWith = function (n, t) {
      return t = typeof t == "function" ? t : F, dt(n, 5, t);
    }, On.cloneWith = function (n, t) {
      return t = typeof t == "function" ? t : F, dt(n, 4, t);
    }, On.conformsTo = function (n, t) {
      return null == t || bt(n, t, Lu(t));
    }, On.deburr = Tu, On.defaultTo = function (n, t) {
      return null == n || n !== n ? t : n;
    }, On.divide = rc, On.endsWith = function (n, t, r) {
      n = zu(n), t = jr(t);var e = n.length,
          e = r = r === F ? e : gt(Ou(r), 0, e);return r -= t.length, 0 <= r && n.slice(r, e) == t;
    }, On.eq = hu, On.escape = function (n) {
      return (n = zu(n)) && Y.test(n) ? n.replace(H, et) : n;
    }, On.escapeRegExp = function (n) {
      return (n = zu(n)) && fn.test(n) ? n.replace(on, "\\$&") : n;
    }, On.every = function (n, t, r) {
      var e = af(n) ? o : wt;return r && ze(n, t, r) && (t = F), e(n, je(t, 3));
    }, On.find = Po, On.findIndex = Ze, On.findKey = function (n, t) {
      return v(n, je(t, 3), Et);
    }, On.findLast = Zo, On.findLastIndex = qe, On.findLastKey = function (n, t) {
      return v(n, je(t, 3), Ot);
    }, On.floor = ec, On.forEach = ru, On.forEachRight = eu, On.forIn = function (n, t) {
      return null == n ? n : co(n, je(t, 3), Uu);
    }, On.forInRight = function (n, t) {
      return null == n ? n : ao(n, je(t, 3), Uu);
    }, On.forOwn = function (n, t) {
      return n && Et(n, je(t, 3));
    }, On.forOwnRight = function (n, t) {
      return n && Ot(n, je(t, 3));
    }, On.get = Wu, On.gt = of, On.gte = ff, On.has = function (n, t) {
      return null != n && ke(n, t, Bt);
    }, On.hasIn = Bu, On.head = Ke, On.identity = Nu, On.includes = function (n, t, r, e) {
      return n = pu(n) ? n : Du(n), r = r && !e ? Ou(r) : 0, e = n.length, 0 > r && (r = Di(e + r, 0)), mu(n) ? r <= e && -1 < n.indexOf(t, r) : !!e && -1 < d(n, t, r);
    }, On.indexOf = function (n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (r = null == r ? 0 : Ou(r), 0 > r && (r = Di(e + r, 0)), d(n, t, r)) : -1;
    }, On.inRange = function (n, t, r) {
      return t = Eu(t), r === F ? (r = t, t = 0) : r = Eu(r), n = Iu(n), n >= Mi(t, r) && n < Di(t, r);
    }, On.invoke = Sf, On.isArguments = cf, On.isArray = af, On.isArrayBuffer = lf, On.isArrayLike = pu, On.isArrayLikeObject = _u, On.isBoolean = function (n) {
      return true === n || false === n || xu(n) && "[object Boolean]" == zt(n);
    }, On.isBuffer = sf, On.isDate = hf, On.isElement = function (n) {
      return xu(n) && 1 === n.nodeType && !wu(n);
    }, On.isEmpty = function (n) {
      if (null == n) return true;if (pu(n) && (af(n) || typeof n == "string" || typeof n.splice == "function" || sf(n) || gf(n) || cf(n))) return !n.length;var t = yo(n);if ("[object Map]" == t || "[object Set]" == t) return !n.size;if (Le(n)) return !Ht(n).length;for (var r in n) {
        if (ci.call(n, r)) return false;
      }return true;
    }, On.isEqual = function (n, t) {
      return Ft(n, t);
    }, On.isEqualWith = function (n, t, r) {
      var e = (r = typeof r == "function" ? r : F) ? r(n, t) : F;return e === F ? Ft(n, t, F, r) : !!e;
    }, On.isError = vu, On.isFinite = function (n) {
      return typeof n == "number" && Li(n);
    }, On.isFunction = gu, On.isInteger = du, On.isLength = yu, On.isMap = pf, On.isMatch = function (n, t) {
      return n === t || Pt(n, t, me(t));
    }, On.isMatchWith = function (n, t, r) {
      return r = typeof r == "function" ? r : F, Pt(n, t, me(t), r);
    }, On.isNaN = function (n) {
      return ju(n) && n != +n;
    }, On.isNative = function (n) {
      if (bo(n)) throw new Yu("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
      return Zt(n);
    }, On.isNil = function (n) {
      return null == n;
    }, On.isNull = function (n) {
      return null === n;
    }, On.isNumber = ju, On.isObject = bu, On.isObjectLike = xu, On.isPlainObject = wu, On.isRegExp = _f, On.isSafeInteger = function (n) {
      return du(n) && -9007199254740991 <= n && 9007199254740991 >= n;
    }, On.isSet = vf, On.isString = mu, On.isSymbol = Au, On.isTypedArray = gf, On.isUndefined = function (n) {
      return n === F;
    }, On.isWeakMap = function (n) {
      return xu(n) && "[object WeakMap]" == yo(n);
    }, On.isWeakSet = function (n) {
      return xu(n) && "[object WeakSet]" == zt(n);
    }, On.join = function (n, t) {
      return null == n ? "" : Ui.call(n, t);
    }, On.kebabCase = Cf, On.last = Ge, On.lastIndexOf = function (n, t, r) {
      var e = null == n ? 0 : n.length;if (!e) return -1;var u = e;if (r !== F && (u = Ou(r), u = 0 > u ? Di(e + u, 0) : Mi(u, e - 1)), t === t) {
        for (r = u + 1; r-- && n[r] !== t;) {}n = r;
      } else n = g(n, b, u, true);return n;
    }, On.lowerCase = Df, On.lowerFirst = Mf, On.lt = df, On.lte = yf, On.max = function (n) {
      return n && n.length ? mt(n, Nu, Wt) : F;
    }, On.maxBy = function (n, t) {
      return n && n.length ? mt(n, je(t, 2), Wt) : F;
    }, On.mean = function (n) {
      return x(n, Nu);
    }, On.meanBy = function (n, t) {
      return x(n, je(t, 2));
    }, On.min = function (n) {
      return n && n.length ? mt(n, Nu, Jt) : F;
    }, On.minBy = function (n, t) {
      return n && n.length ? mt(n, je(t, 2), Jt) : F;
    }, On.stubArray = Ku, On.stubFalse = Gu, On.stubObject = function () {
      return {};
    }, On.stubString = function () {
      return "";
    }, On.stubTrue = function () {
      return true;
    }, On.multiply = uc, On.nth = function (n, t) {
      return n && n.length ? tr(n, Ou(t)) : F;
    }, On.noConflict = function () {
      return Zn._ === this && (Zn._ = pi), this;
    }, On.noop = qu, On.now = Jo, On.pad = function (n, t, r) {
      n = zu(n);var e = (t = Ou(t)) ? T(n) : 0;return !t || e >= t ? n : (t = (t - e) / 2, ee(zi(t), r) + n + ee(Ri(t), r));
    }, On.padEnd = function (n, t, r) {
      n = zu(n);var e = (t = Ou(t)) ? T(n) : 0;return t && e < t ? n + ee(t - e, r) : n;
    }, On.padStart = function (n, t, r) {
      n = zu(n);var e = (t = Ou(t)) ? T(n) : 0;return t && e < t ? ee(t - e, r) + n : n;
    }, On.parseInt = function (n, t, r) {
      return r || null == t ? t = 0 : t && (t = +t), $i(zu(n).replace(an, ""), t || 0);
    }, On.random = function (n, t, r) {
      if (r && typeof r != "boolean" && ze(n, t, r) && (t = r = F), r === F && (typeof t == "boolean" ? (r = t, t = F) : typeof n == "boolean" && (r = n, n = F)), n === F && t === F ? (n = 0, t = 1) : (n = Eu(n), t === F ? (t = n, n = 0) : t = Eu(t)), n > t) {
        var e = n;n = t, t = e;
      }return r || n % 1 || t % 1 ? (r = Fi(), Mi(n + r * (t - n + $n("1e-" + ((r + "").length - 1))), t)) : cr(n, t);
    }, On.reduce = function (n, t, r) {
      var e = af(n) ? h : m,
          u = 3 > arguments.length;return e(n, je(t, 4), r, u, oo);
    }, On.reduceRight = function (n, t, r) {
      var e = af(n) ? p : m,
          u = 3 > arguments.length;return e(n, je(t, 4), r, u, fo);
    }, On.repeat = function (n, t, r) {
      return t = (r ? ze(n, t, r) : t === F) ? 1 : Ou(t), ar(zu(n), t);
    }, On.replace = function () {
      var n = arguments,
          t = zu(n[0]);return 3 > n.length ? t : t.replace(n[1], n[2]);
    }, On.result = function (n, t, r) {
      t = Rr(t, n);var e = -1,
          u = t.length;for (u || (u = 1, n = F); ++e < u;) {
        var i = null == n ? F : n[$e(t[e])];i === F && (e = u, i = r), n = gu(i) ? i.call(n) : i;
      }return n;
    }, On.round = ic, On.runInContext = w, On.sample = function (n) {
      return (af(n) ? tt : sr)(n);
    }, On.size = function (n) {
      if (null == n) return 0;if (pu(n)) return mu(n) ? T(n) : n.length;var t = yo(n);return "[object Map]" == t || "[object Set]" == t ? n.size : Ht(n).length;
    }, On.snakeCase = Tf, On.some = function (n, t, r) {
      var e = af(n) ? _ : gr;return r && ze(n, t, r) && (t = F), e(n, je(t, 3));
    }, On.sortedIndex = function (n, t) {
      return dr(n, t);
    }, On.sortedIndexBy = function (n, t, r) {
      return yr(n, t, je(r, 2));
    }, On.sortedIndexOf = function (n, t) {
      var r = null == n ? 0 : n.length;if (r) {
        var e = dr(n, t);if (e < r && hu(n[e], t)) return e;
      }return -1;
    }, On.sortedLastIndex = function (n, t) {
      return dr(n, t, true);
    }, On.sortedLastIndexBy = function (n, t, r) {
      return yr(n, t, je(r, 2), true);
    }, On.sortedLastIndexOf = function (n, t) {
      if (null == n ? 0 : n.length) {
        var r = dr(n, t, true) - 1;if (hu(n[r], t)) return r;
      }return -1;
    }, On.startCase = $f, On.startsWith = function (n, t, r) {
      return n = zu(n), r = null == r ? 0 : gt(Ou(r), 0, n.length), t = jr(t), n.slice(r, r + t.length) == t;
    }, On.subtract = oc, On.sum = function (n) {
      return n && n.length ? k(n, Nu) : 0;
    }, On.sumBy = function (n, t) {
      return n && n.length ? k(n, je(t, 2)) : 0;
    }, On.template = function (n, t, r) {
      var e = On.templateSettings;r && ze(n, t, r) && (t = F), n = zu(n), t = jf({}, t, e, se), r = jf({}, t.imports, e.imports, se);var u,
          i,
          o = Lu(r),
          f = I(r, o),
          c = 0;r = t.interpolate || An;var a = "__p+='";r = ti((t.escape || An).source + "|" + r.source + "|" + (r === nn ? gn : An).source + "|" + (t.evaluate || An).source + "|$", "g");var l = "sourceURL" in t ? "//# sourceURL=" + t.sourceURL + "\n" : "";if (n.replace(r, function (t, r, e, o, f, l) {
        return e || (e = o), a += n.slice(c, l).replace(kn, B), r && (u = true, a += "'+__e(" + r + ")+'"), f && (i = true, a += "';" + f + ";\n__p+='"), e && (a += "'+((__t=(" + e + "))==null?'':__t)+'"), c = l + t.length, t;
      }), a += "';", (t = t.variable) || (a = "with(obj){" + a + "}"), a = (i ? a.replace(q, "") : a).replace(V, "$1").replace(K, "$1;"), a = "function(" + (t || "obj") + "){" + (t ? "" : "obj||(obj={});") + "var __t,__p=''" + (u ? ",__e=_.escape" : "") + (i ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + a + "return __p}", t = Pf(function () {
        return Qu(o, l + "return " + a).apply(F, f);
      }), t.source = a, vu(t)) throw t;return t;
    }, On.times = function (n, t) {
      if (n = Ou(n), 1 > n || 9007199254740991 < n) return [];
      var r = 4294967295,
          e = Mi(n, 4294967295);for (t = je(t), n -= 4294967295, e = E(e, t); ++r < n;) {
        t(r);
      }return e;
    }, On.toFinite = Eu, On.toInteger = Ou, On.toLength = Su, On.toLower = function (n) {
      return zu(n).toLowerCase();
    }, On.toNumber = Iu, On.toSafeInteger = function (n) {
      return n ? gt(Ou(n), -9007199254740991, 9007199254740991) : 0 === n ? n : 0;
    }, On.toString = zu, On.toUpper = function (n) {
      return zu(n).toUpperCase();
    }, On.trim = function (n, t, r) {
      return (n = zu(n)) && (r || t === F) ? n.replace(cn, "") : n && (t = jr(t)) ? (n = $(n), r = $(t), t = z(n, r), r = W(n, r) + 1, zr(n, t, r).join("")) : n;
    }, On.trimEnd = function (n, t, r) {
      return (n = zu(n)) && (r || t === F) ? n.replace(ln, "") : n && (t = jr(t)) ? (n = $(n), t = W(n, $(t)) + 1, zr(n, 0, t).join("")) : n;
    }, On.trimStart = function (n, t, r) {
      return (n = zu(n)) && (r || t === F) ? n.replace(an, "") : n && (t = jr(t)) ? (n = $(n), t = z(n, $(t)), zr(n, t).join("")) : n;
    }, On.truncate = function (n, t) {
      var r = 30,
          e = "...";if (bu(t)) var u = "separator" in t ? t.separator : u,
          r = "length" in t ? Ou(t.length) : r,
          e = "omission" in t ? jr(t.omission) : e;n = zu(n);var i = n.length;if (Bn.test(n)) var o = $(n),
          i = o.length;if (r >= i) return n;if (i = r - T(e), 1 > i) return e;
      if (r = o ? zr(o, 0, i).join("") : n.slice(0, i), u === F) return r + e;if (o && (i += r.length - i), _f(u)) {
        if (n.slice(i).search(u)) {
          var f = r;for (u.global || (u = ti(u.source, zu(dn.exec(u)) + "g")), u.lastIndex = 0; o = u.exec(f);) {
            var c = o.index;
          }r = r.slice(0, c === F ? i : c);
        }
      } else n.indexOf(jr(u), i) != i && (u = r.lastIndexOf(u), -1 < u && (r = r.slice(0, u)));return r + e;
    }, On.unescape = function (n) {
      return (n = zu(n)) && J.test(n) ? n.replace(G, ut) : n;
    }, On.uniqueId = function (n) {
      var t = ++ai;return zu(n) + t;
    }, On.upperCase = Ff, On.upperFirst = Nf, On.each = ru, On.eachRight = eu, On.first = Ke, Zu(On, function () {
      var n = {};return Et(On, function (t, r) {
        ci.call(On.prototype, r) || (n[r] = t);
      }), n;
    }(), { chain: false }), On.VERSION = "4.17.4", u("bind bindKey curry curryRight partial partialRight".split(" "), function (n) {
      On[n].placeholder = On;
    }), u(["drop", "take"], function (n, t) {
      Mn.prototype[n] = function (r) {
        r = r === F ? 1 : Di(Ou(r), 0);var e = this.__filtered__ && !t ? new Mn(this) : this.clone();return e.__filtered__ ? e.__takeCount__ = Mi(r, e.__takeCount__) : e.__views__.push({ size: Mi(r, 4294967295), type: n + (0 > e.__dir__ ? "Right" : "") }), e;
      }, Mn.prototype[n + "Right"] = function (t) {
        return this.reverse()[n](t).reverse();
      };
    }), u(["filter", "map", "takeWhile"], function (n, t) {
      var r = t + 1,
          e = 1 == r || 3 == r;Mn.prototype[n] = function (n) {
        var t = this.clone();return t.__iteratees__.push({ iteratee: je(n, 3), type: r }), t.__filtered__ = t.__filtered__ || e, t;
      };
    }), u(["head", "last"], function (n, t) {
      var r = "take" + (t ? "Right" : "");Mn.prototype[n] = function () {
        return this[r](1).value()[0];
      };
    }), u(["initial", "tail"], function (n, t) {
      var r = "drop" + (t ? "" : "Right");Mn.prototype[n] = function () {
        return this.__filtered__ ? new Mn(this) : this[r](1);
      };
    }), Mn.prototype.compact = function () {
      return this.filter(Nu);
    }, Mn.prototype.find = function (n) {
      return this.filter(n).head();
    }, Mn.prototype.findLast = function (n) {
      return this.reverse().find(n);
    }, Mn.prototype.invokeMap = lr(function (n, t) {
      return typeof n == "function" ? new Mn(this) : this.map(function (r) {
        return Dt(r, n, t);
      });
    }), Mn.prototype.reject = function (n) {
      return this.filter(su(je(n)));
    }, Mn.prototype.slice = function (n, t) {
      n = Ou(n);var r = this;return r.__filtered__ && (0 < n || 0 > t) ? new Mn(r) : (0 > n ? r = r.takeRight(-n) : n && (r = r.drop(n)), t !== F && (t = Ou(t), r = 0 > t ? r.dropRight(-t) : r.take(t - n)), r);
    }, Mn.prototype.takeRightWhile = function (n) {
      return this.reverse().takeWhile(n).reverse();
    }, Mn.prototype.toArray = function () {
      return this.take(4294967295);
    }, Et(Mn.prototype, function (n, t) {
      var r = /^(?:filter|find|map|reject)|While$/.test(t),
          e = /^(?:head|last)$/.test(t),
          u = On[e ? "take" + ("last" == t ? "Right" : "") : t],
          i = e || /^find/.test(t);u && (On.prototype[t] = function () {
        function t(n) {
          return n = u.apply(On, s([n], f)), e && h ? n[0] : n;
        }var o = this.__wrapped__,
            f = e ? [1] : arguments,
            c = o instanceof Mn,
            a = f[0],
            l = c || af(o);
        l && r && typeof a == "function" && 1 != a.length && (c = l = false);var h = this.__chain__,
            p = !!this.__actions__.length,
            a = i && !h,
            c = c && !p;return !i && l ? (o = c ? o : new Mn(this), o = n.apply(o, f), o.__actions__.push({ func: nu, args: [t], thisArg: F }), new zn(o, h)) : a && c ? n.apply(this, f) : (o = this.thru(t), a ? e ? o.value()[0] : o.value() : o);
      });
    }), u("pop push shift sort splice unshift".split(" "), function (n) {
      var t = ui[n],
          r = /^(?:push|sort|unshift)$/.test(n) ? "tap" : "thru",
          e = /^(?:pop|shift)$/.test(n);On.prototype[n] = function () {
        var n = arguments;if (e && !this.__chain__) {
          var u = this.value();return t.apply(af(u) ? u : [], n);
        }return this[r](function (r) {
          return t.apply(af(r) ? r : [], n);
        });
      };
    }), Et(Mn.prototype, function (n, t) {
      var r = On[t];if (r) {
        var e = r.name + "";(Ji[e] || (Ji[e] = [])).push({ name: t, func: r });
      }
    }), Ji[Xr(F, 2).name] = [{ name: "wrapper", func: F }], Mn.prototype.clone = function () {
      var n = new Mn(this.__wrapped__);return n.__actions__ = Mr(this.__actions__), n.__dir__ = this.__dir__, n.__filtered__ = this.__filtered__, n.__iteratees__ = Mr(this.__iteratees__), n.__takeCount__ = this.__takeCount__, n.__views__ = Mr(this.__views__), n;
    }, Mn.prototype.reverse = function () {
      if (this.__filtered__) {
        var n = new Mn(this);n.__dir__ = -1, n.__filtered__ = true;
      } else n = this.clone(), n.__dir__ *= -1;return n;
    }, Mn.prototype.value = function () {
      var n,
          t = this.__wrapped__.value(),
          r = this.__dir__,
          e = af(t),
          u = 0 > r,
          i = e ? t.length : 0;n = i;for (var o = this.__views__, f = 0, c = -1, a = o.length; ++c < a;) {
        var l = o[c],
            s = l.size;switch (l.type) {case "drop":
            f += s;break;case "dropRight":
            n -= s;break;case "take":
            n = Mi(n, f + s);break;case "takeRight":
            f = Di(f, n - s);}
      }if (n = { start: f, end: n }, o = n.start, f = n.end, n = f - o, o = u ? f : o - 1, f = this.__iteratees__, c = f.length, a = 0, l = Mi(n, this.__takeCount__), !e || !u && i == n && l == n) return kr(t, this.__actions__);e = [];n: for (; n-- && a < l;) {
        for (o += r, u = -1, i = t[o]; ++u < c;) {
          var h = f[u],
              s = h.type,
              h = (0, h.iteratee)(i);if (2 == s) i = h;else if (!h) {
            if (1 == s) continue n;break n;
          }
        }e[a++] = i;
      }return e;
    }, On.prototype.at = Fo, On.prototype.chain = function () {
      return Xe(this);
    }, On.prototype.commit = function () {
      return new zn(this.value(), this.__chain__);
    }, On.prototype.next = function () {
      this.__values__ === F && (this.__values__ = ku(this.value()));
      var n = this.__index__ >= this.__values__.length;return { done: n, value: n ? F : this.__values__[this.__index__++] };
    }, On.prototype.plant = function (n) {
      for (var t, r = this; r instanceof Sn;) {
        var e = Pe(r);e.__index__ = 0, e.__values__ = F, t ? u.__wrapped__ = e : t = e;var u = e,
            r = r.__wrapped__;
      }return u.__wrapped__ = n, t;
    }, On.prototype.reverse = function () {
      var n = this.__wrapped__;return n instanceof Mn ? (this.__actions__.length && (n = new Mn(this)), n = n.reverse(), n.__actions__.push({ func: nu, args: [Je], thisArg: F }), new zn(n, this.__chain__)) : this.thru(Je);
    }, On.prototype.toJSON = On.prototype.valueOf = On.prototype.value = function () {
      return kr(this.__wrapped__, this.__actions__);
    }, On.prototype.first = On.prototype.head, Ai && (On.prototype[Ai] = tu), On;
  }();typeof define == "function" && _typeof(define.amd) == "object" && define.amd ? (Zn._ = it, define(function () {
    return it;
  })) : Vn ? ((Vn.exports = it)._ = it, qn._ = it) : Zn._ = it;
}).call(undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
'use strict';

var DOCUMENT_MODE = require('./html').DOCUMENT_MODE;

//Const
var VALID_DOCTYPE_NAME = 'html',
    QUIRKS_MODE_SYSTEM_ID = 'http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd',
    QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
        '+//silmaril//dtd html pro v0r11 19970101//en',
        '-//advasoft ltd//dtd html 3.0 aswedit + extensions//en',
        '-//as//dtd html 3.0 aswedit + extensions//en',
        '-//ietf//dtd html 2.0 level 1//en',
        '-//ietf//dtd html 2.0 level 2//en',
        '-//ietf//dtd html 2.0 strict level 1//en',
        '-//ietf//dtd html 2.0 strict level 2//en',
        '-//ietf//dtd html 2.0 strict//en',
        '-//ietf//dtd html 2.0//en',
        '-//ietf//dtd html 2.1e//en',
        '-//ietf//dtd html 3.0//en',
        '-//ietf//dtd html 3.0//en//',
        '-//ietf//dtd html 3.2 final//en',
        '-//ietf//dtd html 3.2//en',
        '-//ietf//dtd html 3//en',
        '-//ietf//dtd html level 0//en',
        '-//ietf//dtd html level 0//en//2.0',
        '-//ietf//dtd html level 1//en',
        '-//ietf//dtd html level 1//en//2.0',
        '-//ietf//dtd html level 2//en',
        '-//ietf//dtd html level 2//en//2.0',
        '-//ietf//dtd html level 3//en',
        '-//ietf//dtd html level 3//en//3.0',
        '-//ietf//dtd html strict level 0//en',
        '-//ietf//dtd html strict level 0//en//2.0',
        '-//ietf//dtd html strict level 1//en',
        '-//ietf//dtd html strict level 1//en//2.0',
        '-//ietf//dtd html strict level 2//en',
        '-//ietf//dtd html strict level 2//en//2.0',
        '-//ietf//dtd html strict level 3//en',
        '-//ietf//dtd html strict level 3//en//3.0',
        '-//ietf//dtd html strict//en',
        '-//ietf//dtd html strict//en//2.0',
        '-//ietf//dtd html strict//en//3.0',
        '-//ietf//dtd html//en',
        '-//ietf//dtd html//en//2.0',
        '-//ietf//dtd html//en//3.0',
        '-//metrius//dtd metrius presentational//en',
        '-//microsoft//dtd internet explorer 2.0 html strict//en',
        '-//microsoft//dtd internet explorer 2.0 html//en',
        '-//microsoft//dtd internet explorer 2.0 tables//en',
        '-//microsoft//dtd internet explorer 3.0 html strict//en',
        '-//microsoft//dtd internet explorer 3.0 html//en',
        '-//microsoft//dtd internet explorer 3.0 tables//en',
        '-//netscape comm. corp.//dtd html//en',
        '-//netscape comm. corp.//dtd strict html//en',
        '-//o\'reilly and associates//dtd html 2.0//en',
        '-//o\'reilly and associates//dtd html extended 1.0//en',
        '-//spyglass//dtd html 2.0 extended//en',
        '-//sq//dtd html 2.0 hotmetal + extensions//en',
        '-//sun microsystems corp.//dtd hotjava html//en',
        '-//sun microsystems corp.//dtd hotjava strict html//en',
        '-//w3c//dtd html 3 1995-03-24//en',
        '-//w3c//dtd html 3.2 draft//en',
        '-//w3c//dtd html 3.2 final//en',
        '-//w3c//dtd html 3.2//en',
        '-//w3c//dtd html 3.2s draft//en',
        '-//w3c//dtd html 4.0 frameset//en',
        '-//w3c//dtd html 4.0 transitional//en',
        '-//w3c//dtd html experimental 19960712//en',
        '-//w3c//dtd html experimental 970421//en',
        '-//w3c//dtd w3 html//en',
        '-//w3o//dtd w3 html 3.0//en',
        '-//w3o//dtd w3 html 3.0//en//',
        '-//webtechs//dtd mozilla html 2.0//en',
        '-//webtechs//dtd mozilla html//en'
    ],
    QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = QUIRKS_MODE_PUBLIC_ID_PREFIXES.concat([
        '-//w3c//dtd html 4.01 frameset//',
        '-//w3c//dtd html 4.01 transitional//'
    ]),
    QUIRKS_MODE_PUBLIC_IDS = [
        '-//w3o//dtd w3 html strict 3.0//en//',
        '-/w3c/dtd html 4.0 transitional/en',
        'html'
    ],
    LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = [
        '-//W3C//DTD XHTML 1.0 Frameset//',
        '-//W3C//DTD XHTML 1.0 Transitional//'
    ],
    LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = LIMITED_QUIRKS_PUBLIC_ID_PREFIXES.concat([
        '-//W3C//DTD HTML 4.01 Frameset//',
        '-//W3C//DTD HTML 4.01 Transitional//'
    ]);


//Utils
function enquoteDoctypeId(id) {
    var quote = id.indexOf('"') !== -1 ? '\'' : '"';

    return quote + id + quote;
}

function hasPrefix(publicId, prefixes) {
    for (var i = 0; i < prefixes.length; i++) {
        if (publicId.indexOf(prefixes[i]) === 0)
            return true;
    }

    return false;
}


//API
exports.getDocumentMode = function (name, publicId, systemId) {
    if (name !== VALID_DOCTYPE_NAME)
        return DOCUMENT_MODE.QUIRKS;

    if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID)
        return DOCUMENT_MODE.QUIRKS;

    if (publicId !== null) {
        publicId = publicId.toLowerCase();

        if (QUIRKS_MODE_PUBLIC_IDS.indexOf(publicId) > -1)
            return DOCUMENT_MODE.QUIRKS;

        var prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;

        if (hasPrefix(publicId, prefixes))
            return DOCUMENT_MODE.QUIRKS;

        prefixes = systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;

        if (hasPrefix(publicId, prefixes))
            return DOCUMENT_MODE.LIMITED_QUIRKS;
    }

    return DOCUMENT_MODE.NO_QUIRKS;
};

exports.serializeContent = function (name, publicId, systemId) {
    var str = '!DOCTYPE ';

    if (name)
        str += name;

    if (publicId !== null)
        str += ' PUBLIC ' + enquoteDoctypeId(publicId);

    else if (systemId !== null)
        str += ' SYSTEM';

    if (systemId !== null)
        str += ' ' + enquoteDoctypeId(systemId);

    return str;
};

},{"./html":14}],13:[function(require,module,exports){
'use strict';

var Tokenizer = require('../tokenizer'),
    HTML = require('./html');

//Aliases
var $ = HTML.TAG_NAMES,
    NS = HTML.NAMESPACES,
    ATTRS = HTML.ATTRS;


//MIME types
var MIME_TYPES = {
    TEXT_HTML: 'text/html',
    APPLICATION_XML: 'application/xhtml+xml'
};

//Attributes
var DEFINITION_URL_ATTR = 'definitionurl',
    ADJUSTED_DEFINITION_URL_ATTR = 'definitionURL',
    SVG_ATTRS_ADJUSTMENT_MAP = {
        'attributename': 'attributeName',
        'attributetype': 'attributeType',
        'basefrequency': 'baseFrequency',
        'baseprofile': 'baseProfile',
        'calcmode': 'calcMode',
        'clippathunits': 'clipPathUnits',
        'diffuseconstant': 'diffuseConstant',
        'edgemode': 'edgeMode',
        'filterunits': 'filterUnits',
        'glyphref': 'glyphRef',
        'gradienttransform': 'gradientTransform',
        'gradientunits': 'gradientUnits',
        'kernelmatrix': 'kernelMatrix',
        'kernelunitlength': 'kernelUnitLength',
        'keypoints': 'keyPoints',
        'keysplines': 'keySplines',
        'keytimes': 'keyTimes',
        'lengthadjust': 'lengthAdjust',
        'limitingconeangle': 'limitingConeAngle',
        'markerheight': 'markerHeight',
        'markerunits': 'markerUnits',
        'markerwidth': 'markerWidth',
        'maskcontentunits': 'maskContentUnits',
        'maskunits': 'maskUnits',
        'numoctaves': 'numOctaves',
        'pathlength': 'pathLength',
        'patterncontentunits': 'patternContentUnits',
        'patterntransform': 'patternTransform',
        'patternunits': 'patternUnits',
        'pointsatx': 'pointsAtX',
        'pointsaty': 'pointsAtY',
        'pointsatz': 'pointsAtZ',
        'preservealpha': 'preserveAlpha',
        'preserveaspectratio': 'preserveAspectRatio',
        'primitiveunits': 'primitiveUnits',
        'refx': 'refX',
        'refy': 'refY',
        'repeatcount': 'repeatCount',
        'repeatdur': 'repeatDur',
        'requiredextensions': 'requiredExtensions',
        'requiredfeatures': 'requiredFeatures',
        'specularconstant': 'specularConstant',
        'specularexponent': 'specularExponent',
        'spreadmethod': 'spreadMethod',
        'startoffset': 'startOffset',
        'stddeviation': 'stdDeviation',
        'stitchtiles': 'stitchTiles',
        'surfacescale': 'surfaceScale',
        'systemlanguage': 'systemLanguage',
        'tablevalues': 'tableValues',
        'targetx': 'targetX',
        'targety': 'targetY',
        'textlength': 'textLength',
        'viewbox': 'viewBox',
        'viewtarget': 'viewTarget',
        'xchannelselector': 'xChannelSelector',
        'ychannelselector': 'yChannelSelector',
        'zoomandpan': 'zoomAndPan'
    },
    XML_ATTRS_ADJUSTMENT_MAP = {
        'xlink:actuate': {prefix: 'xlink', name: 'actuate', namespace: NS.XLINK},
        'xlink:arcrole': {prefix: 'xlink', name: 'arcrole', namespace: NS.XLINK},
        'xlink:href': {prefix: 'xlink', name: 'href', namespace: NS.XLINK},
        'xlink:role': {prefix: 'xlink', name: 'role', namespace: NS.XLINK},
        'xlink:show': {prefix: 'xlink', name: 'show', namespace: NS.XLINK},
        'xlink:title': {prefix: 'xlink', name: 'title', namespace: NS.XLINK},
        'xlink:type': {prefix: 'xlink', name: 'type', namespace: NS.XLINK},
        'xml:base': {prefix: 'xml', name: 'base', namespace: NS.XML},
        'xml:lang': {prefix: 'xml', name: 'lang', namespace: NS.XML},
        'xml:space': {prefix: 'xml', name: 'space', namespace: NS.XML},
        'xmlns': {prefix: '', name: 'xmlns', namespace: NS.XMLNS},
        'xmlns:xlink': {prefix: 'xmlns', name: 'xlink', namespace: NS.XMLNS}

    };

//SVG tag names adjustment map
var SVG_TAG_NAMES_ADJUSTMENT_MAP = exports.SVG_TAG_NAMES_ADJUSTMENT_MAP = {
    'altglyph': 'altGlyph',
    'altglyphdef': 'altGlyphDef',
    'altglyphitem': 'altGlyphItem',
    'animatecolor': 'animateColor',
    'animatemotion': 'animateMotion',
    'animatetransform': 'animateTransform',
    'clippath': 'clipPath',
    'feblend': 'feBlend',
    'fecolormatrix': 'feColorMatrix',
    'fecomponenttransfer': 'feComponentTransfer',
    'fecomposite': 'feComposite',
    'feconvolvematrix': 'feConvolveMatrix',
    'fediffuselighting': 'feDiffuseLighting',
    'fedisplacementmap': 'feDisplacementMap',
    'fedistantlight': 'feDistantLight',
    'feflood': 'feFlood',
    'fefunca': 'feFuncA',
    'fefuncb': 'feFuncB',
    'fefuncg': 'feFuncG',
    'fefuncr': 'feFuncR',
    'fegaussianblur': 'feGaussianBlur',
    'feimage': 'feImage',
    'femerge': 'feMerge',
    'femergenode': 'feMergeNode',
    'femorphology': 'feMorphology',
    'feoffset': 'feOffset',
    'fepointlight': 'fePointLight',
    'fespecularlighting': 'feSpecularLighting',
    'fespotlight': 'feSpotLight',
    'fetile': 'feTile',
    'feturbulence': 'feTurbulence',
    'foreignobject': 'foreignObject',
    'glyphref': 'glyphRef',
    'lineargradient': 'linearGradient',
    'radialgradient': 'radialGradient',
    'textpath': 'textPath'
};

//Tags that causes exit from foreign content
var EXITS_FOREIGN_CONTENT = Object.create(null);

EXITS_FOREIGN_CONTENT[$.B] = true;
EXITS_FOREIGN_CONTENT[$.BIG] = true;
EXITS_FOREIGN_CONTENT[$.BLOCKQUOTE] = true;
EXITS_FOREIGN_CONTENT[$.BODY] = true;
EXITS_FOREIGN_CONTENT[$.BR] = true;
EXITS_FOREIGN_CONTENT[$.CENTER] = true;
EXITS_FOREIGN_CONTENT[$.CODE] = true;
EXITS_FOREIGN_CONTENT[$.DD] = true;
EXITS_FOREIGN_CONTENT[$.DIV] = true;
EXITS_FOREIGN_CONTENT[$.DL] = true;
EXITS_FOREIGN_CONTENT[$.DT] = true;
EXITS_FOREIGN_CONTENT[$.EM] = true;
EXITS_FOREIGN_CONTENT[$.EMBED] = true;
EXITS_FOREIGN_CONTENT[$.H1] = true;
EXITS_FOREIGN_CONTENT[$.H2] = true;
EXITS_FOREIGN_CONTENT[$.H3] = true;
EXITS_FOREIGN_CONTENT[$.H4] = true;
EXITS_FOREIGN_CONTENT[$.H5] = true;
EXITS_FOREIGN_CONTENT[$.H6] = true;
EXITS_FOREIGN_CONTENT[$.HEAD] = true;
EXITS_FOREIGN_CONTENT[$.HR] = true;
EXITS_FOREIGN_CONTENT[$.I] = true;
EXITS_FOREIGN_CONTENT[$.IMG] = true;
EXITS_FOREIGN_CONTENT[$.LI] = true;
EXITS_FOREIGN_CONTENT[$.LISTING] = true;
EXITS_FOREIGN_CONTENT[$.MENU] = true;
EXITS_FOREIGN_CONTENT[$.META] = true;
EXITS_FOREIGN_CONTENT[$.NOBR] = true;
EXITS_FOREIGN_CONTENT[$.OL] = true;
EXITS_FOREIGN_CONTENT[$.P] = true;
EXITS_FOREIGN_CONTENT[$.PRE] = true;
EXITS_FOREIGN_CONTENT[$.RUBY] = true;
EXITS_FOREIGN_CONTENT[$.S] = true;
EXITS_FOREIGN_CONTENT[$.SMALL] = true;
EXITS_FOREIGN_CONTENT[$.SPAN] = true;
EXITS_FOREIGN_CONTENT[$.STRONG] = true;
EXITS_FOREIGN_CONTENT[$.STRIKE] = true;
EXITS_FOREIGN_CONTENT[$.SUB] = true;
EXITS_FOREIGN_CONTENT[$.SUP] = true;
EXITS_FOREIGN_CONTENT[$.TABLE] = true;
EXITS_FOREIGN_CONTENT[$.TT] = true;
EXITS_FOREIGN_CONTENT[$.U] = true;
EXITS_FOREIGN_CONTENT[$.UL] = true;
EXITS_FOREIGN_CONTENT[$.VAR] = true;

//Check exit from foreign content
exports.causesExit = function (startTagToken) {
    var tn = startTagToken.tagName;
    var isFontWithAttrs = tn === $.FONT && (Tokenizer.getTokenAttr(startTagToken, ATTRS.COLOR) !== null ||
                                            Tokenizer.getTokenAttr(startTagToken, ATTRS.SIZE) !== null ||
                                            Tokenizer.getTokenAttr(startTagToken, ATTRS.FACE) !== null);

    return isFontWithAttrs ? true : EXITS_FOREIGN_CONTENT[tn];
};

//Token adjustments
exports.adjustTokenMathMLAttrs = function (token) {
    for (var i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i].name === DEFINITION_URL_ATTR) {
            token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
            break;
        }
    }
};

exports.adjustTokenSVGAttrs = function (token) {
    for (var i = 0; i < token.attrs.length; i++) {
        var adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP[token.attrs[i].name];

        if (adjustedAttrName)
            token.attrs[i].name = adjustedAttrName;
    }
};

exports.adjustTokenXMLAttrs = function (token) {
    for (var i = 0; i < token.attrs.length; i++) {
        var adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP[token.attrs[i].name];

        if (adjustedAttrEntry) {
            token.attrs[i].prefix = adjustedAttrEntry.prefix;
            token.attrs[i].name = adjustedAttrEntry.name;
            token.attrs[i].namespace = adjustedAttrEntry.namespace;
        }
    }
};

exports.adjustTokenSVGTagName = function (token) {
    var adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP[token.tagName];

    if (adjustedTagName)
        token.tagName = adjustedTagName;
};

//Integration points
function isMathMLTextIntegrationPoint(tn, ns) {
    return ns === NS.MATHML && (tn === $.MI || tn === $.MO || tn === $.MN || tn === $.MS || tn === $.MTEXT);
}

function isHtmlIntegrationPoint(tn, ns, attrs) {
    if (ns === NS.MATHML && tn === $.ANNOTATION_XML) {
        for (var i = 0; i < attrs.length; i++) {
            if (attrs[i].name === ATTRS.ENCODING) {
                var value = attrs[i].value.toLowerCase();

                return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
            }
        }
    }

    return ns === NS.SVG && (tn === $.FOREIGN_OBJECT || tn === $.DESC || tn === $.TITLE);
}

exports.isIntegrationPoint = function (tn, ns, attrs, foreignNS) {
    if ((!foreignNS || foreignNS === NS.HTML) && isHtmlIntegrationPoint(tn, ns, attrs))
        return true;

    if ((!foreignNS || foreignNS === NS.MATHML) && isMathMLTextIntegrationPoint(tn, ns))
        return true;

    return false;
};

},{"../tokenizer":31,"./html":14}],14:[function(require,module,exports){
'use strict';

var NS = exports.NAMESPACES = {
    HTML: 'http://www.w3.org/1999/xhtml',
    MATHML: 'http://www.w3.org/1998/Math/MathML',
    SVG: 'http://www.w3.org/2000/svg',
    XLINK: 'http://www.w3.org/1999/xlink',
    XML: 'http://www.w3.org/XML/1998/namespace',
    XMLNS: 'http://www.w3.org/2000/xmlns/'
};

exports.ATTRS = {
    TYPE: 'type',
    ACTION: 'action',
    ENCODING: 'encoding',
    PROMPT: 'prompt',
    NAME: 'name',
    COLOR: 'color',
    FACE: 'face',
    SIZE: 'size'
};

exports.DOCUMENT_MODE = {
    NO_QUIRKS: 'no-quirks',
    QUIRKS: 'quirks',
    LIMITED_QUIRKS: 'limited-quirks'
};

var $ = exports.TAG_NAMES = {
    A: 'a',
    ADDRESS: 'address',
    ANNOTATION_XML: 'annotation-xml',
    APPLET: 'applet',
    AREA: 'area',
    ARTICLE: 'article',
    ASIDE: 'aside',

    B: 'b',
    BASE: 'base',
    BASEFONT: 'basefont',
    BGSOUND: 'bgsound',
    BIG: 'big',
    BLOCKQUOTE: 'blockquote',
    BODY: 'body',
    BR: 'br',
    BUTTON: 'button',

    CAPTION: 'caption',
    CENTER: 'center',
    CODE: 'code',
    COL: 'col',
    COLGROUP: 'colgroup',

    DD: 'dd',
    DESC: 'desc',
    DETAILS: 'details',
    DIALOG: 'dialog',
    DIR: 'dir',
    DIV: 'div',
    DL: 'dl',
    DT: 'dt',

    EM: 'em',
    EMBED: 'embed',

    FIELDSET: 'fieldset',
    FIGCAPTION: 'figcaption',
    FIGURE: 'figure',
    FONT: 'font',
    FOOTER: 'footer',
    FOREIGN_OBJECT: 'foreignObject',
    FORM: 'form',
    FRAME: 'frame',
    FRAMESET: 'frameset',

    H1: 'h1',
    H2: 'h2',
    H3: 'h3',
    H4: 'h4',
    H5: 'h5',
    H6: 'h6',
    HEAD: 'head',
    HEADER: 'header',
    HGROUP: 'hgroup',
    HR: 'hr',
    HTML: 'html',

    I: 'i',
    IMG: 'img',
    IMAGE: 'image',
    INPUT: 'input',
    IFRAME: 'iframe',

    KEYGEN: 'keygen',

    LABEL: 'label',
    LI: 'li',
    LINK: 'link',
    LISTING: 'listing',

    MAIN: 'main',
    MALIGNMARK: 'malignmark',
    MARQUEE: 'marquee',
    MATH: 'math',
    MENU: 'menu',
    MENUITEM: 'menuitem',
    META: 'meta',
    MGLYPH: 'mglyph',
    MI: 'mi',
    MO: 'mo',
    MN: 'mn',
    MS: 'ms',
    MTEXT: 'mtext',

    NAV: 'nav',
    NOBR: 'nobr',
    NOFRAMES: 'noframes',
    NOEMBED: 'noembed',
    NOSCRIPT: 'noscript',

    OBJECT: 'object',
    OL: 'ol',
    OPTGROUP: 'optgroup',
    OPTION: 'option',

    P: 'p',
    PARAM: 'param',
    PLAINTEXT: 'plaintext',
    PRE: 'pre',

    RB: 'rb',
    RP: 'rp',
    RT: 'rt',
    RTC: 'rtc',
    RUBY: 'ruby',

    S: 's',
    SCRIPT: 'script',
    SECTION: 'section',
    SELECT: 'select',
    SOURCE: 'source',
    SMALL: 'small',
    SPAN: 'span',
    STRIKE: 'strike',
    STRONG: 'strong',
    STYLE: 'style',
    SUB: 'sub',
    SUMMARY: 'summary',
    SUP: 'sup',

    TABLE: 'table',
    TBODY: 'tbody',
    TEMPLATE: 'template',
    TEXTAREA: 'textarea',
    TFOOT: 'tfoot',
    TD: 'td',
    TH: 'th',
    THEAD: 'thead',
    TITLE: 'title',
    TR: 'tr',
    TRACK: 'track',
    TT: 'tt',

    U: 'u',
    UL: 'ul',

    SVG: 'svg',

    VAR: 'var',

    WBR: 'wbr',

    XMP: 'xmp'
};

var SPECIAL_ELEMENTS = exports.SPECIAL_ELEMENTS = Object.create(null);

SPECIAL_ELEMENTS[NS.HTML] = Object.create(null);
SPECIAL_ELEMENTS[NS.HTML][$.ADDRESS] = true;
SPECIAL_ELEMENTS[NS.HTML][$.APPLET] = true;
SPECIAL_ELEMENTS[NS.HTML][$.AREA] = true;
SPECIAL_ELEMENTS[NS.HTML][$.ARTICLE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.ASIDE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.BASE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.BASEFONT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.BGSOUND] = true;
SPECIAL_ELEMENTS[NS.HTML][$.BLOCKQUOTE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.BODY] = true;
SPECIAL_ELEMENTS[NS.HTML][$.BR] = true;
SPECIAL_ELEMENTS[NS.HTML][$.BUTTON] = true;
SPECIAL_ELEMENTS[NS.HTML][$.CAPTION] = true;
SPECIAL_ELEMENTS[NS.HTML][$.CENTER] = true;
SPECIAL_ELEMENTS[NS.HTML][$.COL] = true;
SPECIAL_ELEMENTS[NS.HTML][$.COLGROUP] = true;
SPECIAL_ELEMENTS[NS.HTML][$.DD] = true;
SPECIAL_ELEMENTS[NS.HTML][$.DETAILS] = true;
SPECIAL_ELEMENTS[NS.HTML][$.DIR] = true;
SPECIAL_ELEMENTS[NS.HTML][$.DIV] = true;
SPECIAL_ELEMENTS[NS.HTML][$.DL] = true;
SPECIAL_ELEMENTS[NS.HTML][$.DT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.EMBED] = true;
SPECIAL_ELEMENTS[NS.HTML][$.FIELDSET] = true;
SPECIAL_ELEMENTS[NS.HTML][$.FIGCAPTION] = true;
SPECIAL_ELEMENTS[NS.HTML][$.FIGURE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.FOOTER] = true;
SPECIAL_ELEMENTS[NS.HTML][$.FORM] = true;
SPECIAL_ELEMENTS[NS.HTML][$.FRAME] = true;
SPECIAL_ELEMENTS[NS.HTML][$.FRAMESET] = true;
SPECIAL_ELEMENTS[NS.HTML][$.H1] = true;
SPECIAL_ELEMENTS[NS.HTML][$.H2] = true;
SPECIAL_ELEMENTS[NS.HTML][$.H3] = true;
SPECIAL_ELEMENTS[NS.HTML][$.H4] = true;
SPECIAL_ELEMENTS[NS.HTML][$.H5] = true;
SPECIAL_ELEMENTS[NS.HTML][$.H6] = true;
SPECIAL_ELEMENTS[NS.HTML][$.HEAD] = true;
SPECIAL_ELEMENTS[NS.HTML][$.HEADER] = true;
SPECIAL_ELEMENTS[NS.HTML][$.HGROUP] = true;
SPECIAL_ELEMENTS[NS.HTML][$.HR] = true;
SPECIAL_ELEMENTS[NS.HTML][$.HTML] = true;
SPECIAL_ELEMENTS[NS.HTML][$.IFRAME] = true;
SPECIAL_ELEMENTS[NS.HTML][$.IMG] = true;
SPECIAL_ELEMENTS[NS.HTML][$.INPUT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.LI] = true;
SPECIAL_ELEMENTS[NS.HTML][$.LINK] = true;
SPECIAL_ELEMENTS[NS.HTML][$.LISTING] = true;
SPECIAL_ELEMENTS[NS.HTML][$.MAIN] = true;
SPECIAL_ELEMENTS[NS.HTML][$.MARQUEE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.MENU] = true;
SPECIAL_ELEMENTS[NS.HTML][$.META] = true;
SPECIAL_ELEMENTS[NS.HTML][$.NAV] = true;
SPECIAL_ELEMENTS[NS.HTML][$.NOEMBED] = true;
SPECIAL_ELEMENTS[NS.HTML][$.NOFRAMES] = true;
SPECIAL_ELEMENTS[NS.HTML][$.NOSCRIPT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.OBJECT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.OL] = true;
SPECIAL_ELEMENTS[NS.HTML][$.P] = true;
SPECIAL_ELEMENTS[NS.HTML][$.PARAM] = true;
SPECIAL_ELEMENTS[NS.HTML][$.PLAINTEXT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.PRE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.SCRIPT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.SECTION] = true;
SPECIAL_ELEMENTS[NS.HTML][$.SELECT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.SOURCE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.STYLE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.SUMMARY] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TABLE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TBODY] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TD] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TEMPLATE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TEXTAREA] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TFOOT] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TH] = true;
SPECIAL_ELEMENTS[NS.HTML][$.THEAD] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TITLE] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TR] = true;
SPECIAL_ELEMENTS[NS.HTML][$.TRACK] = true;
SPECIAL_ELEMENTS[NS.HTML][$.UL] = true;
SPECIAL_ELEMENTS[NS.HTML][$.WBR] = true;
SPECIAL_ELEMENTS[NS.HTML][$.XMP] = true;

SPECIAL_ELEMENTS[NS.MATHML] = Object.create(null);
SPECIAL_ELEMENTS[NS.MATHML][$.MI] = true;
SPECIAL_ELEMENTS[NS.MATHML][$.MO] = true;
SPECIAL_ELEMENTS[NS.MATHML][$.MN] = true;
SPECIAL_ELEMENTS[NS.MATHML][$.MS] = true;
SPECIAL_ELEMENTS[NS.MATHML][$.MTEXT] = true;
SPECIAL_ELEMENTS[NS.MATHML][$.ANNOTATION_XML] = true;

SPECIAL_ELEMENTS[NS.SVG] = Object.create(null);
SPECIAL_ELEMENTS[NS.SVG][$.TITLE] = true;
SPECIAL_ELEMENTS[NS.SVG][$.FOREIGN_OBJECT] = true;
SPECIAL_ELEMENTS[NS.SVG][$.DESC] = true;

},{}],15:[function(require,module,exports){
'use strict';

exports.REPLACEMENT_CHARACTER = '\uFFFD';

exports.CODE_POINTS = {
    EOF: -1,
    NULL: 0x00,
    TABULATION: 0x09,
    CARRIAGE_RETURN: 0x0D,
    LINE_FEED: 0x0A,
    FORM_FEED: 0x0C,
    SPACE: 0x20,
    EXCLAMATION_MARK: 0x21,
    QUOTATION_MARK: 0x22,
    NUMBER_SIGN: 0x23,
    AMPERSAND: 0x26,
    APOSTROPHE: 0x27,
    HYPHEN_MINUS: 0x2D,
    SOLIDUS: 0x2F,
    DIGIT_0: 0x30,
    DIGIT_9: 0x39,
    SEMICOLON: 0x3B,
    LESS_THAN_SIGN: 0x3C,
    EQUALS_SIGN: 0x3D,
    GREATER_THAN_SIGN: 0x3E,
    QUESTION_MARK: 0x3F,
    LATIN_CAPITAL_A: 0x41,
    LATIN_CAPITAL_F: 0x46,
    LATIN_CAPITAL_X: 0x58,
    LATIN_CAPITAL_Z: 0x5A,
    GRAVE_ACCENT: 0x60,
    LATIN_SMALL_A: 0x61,
    LATIN_SMALL_F: 0x66,
    LATIN_SMALL_X: 0x78,
    LATIN_SMALL_Z: 0x7A,
    REPLACEMENT_CHARACTER: 0xFFFD
};

exports.CODE_POINT_SEQUENCES = {
    DASH_DASH_STRING: [0x2D, 0x2D], //--
    DOCTYPE_STRING: [0x44, 0x4F, 0x43, 0x54, 0x59, 0x50, 0x45], //DOCTYPE
    CDATA_START_STRING: [0x5B, 0x43, 0x44, 0x41, 0x54, 0x41, 0x5B], //[CDATA[
    CDATA_END_STRING: [0x5D, 0x5D, 0x3E], //]]>
    SCRIPT_STRING: [0x73, 0x63, 0x72, 0x69, 0x70, 0x74], //script
    PUBLIC_STRING: [0x50, 0x55, 0x42, 0x4C, 0x49, 0x43], //PUBLIC
    SYSTEM_STRING: [0x53, 0x59, 0x53, 0x54, 0x45, 0x4D] //SYSTEM
};

},{}],16:[function(require,module,exports){
'use strict';

var Mixin = require('../../utils/mixin'),
    inherits = require('util').inherits;

var LocationInfoOpenElementStackMixin = module.exports = function (stack, options) {
    Mixin.call(this, stack);

    this.onItemPop = options.onItemPop;
};

inherits(LocationInfoOpenElementStackMixin, Mixin);

LocationInfoOpenElementStackMixin.prototype._getOverriddenMethods = function (mxn, orig) {
    return {
        pop: function () {
            mxn.onItemPop(this.current);
            orig.pop.call(this);
        },

        popAllUpToHtmlElement: function () {
            for (var i = this.stackTop; i > 0; i--)
                mxn.onItemPop(this.items[i]);

            orig.popAllUpToHtmlElement.call(this);
        },

        remove: function (element) {
            mxn.onItemPop(this.current);
            orig.remove.call(this, element);
        }
    };
};


},{"../../utils/mixin":37,"util":60}],17:[function(require,module,exports){
'use strict';

var Mixin = require('../../utils/mixin'),
    Tokenizer = require('../../tokenizer'),
    LocationInfoTokenizerMixin = require('./tokenizer_mixin'),
    PositionTrackingPreprocessorMixin = require('../position_tracking/preprocessor_mixin'),
    LocationInfoOpenElementStackMixin = require('./open_element_stack_mixin'),
    HTML = require('../../common/html'),
    inherits = require('util').inherits;


//Aliases
var $ = HTML.TAG_NAMES;

var LocationInfoParserMixin = module.exports = function (parser) {
    Mixin.call(this, parser);

    this.parser = parser;
    this.posTracker = null;
    this.lastStartTagToken = null;
    this.lastFosterParentingLocation = null;
    this.currentToken = null;
};

inherits(LocationInfoParserMixin, Mixin);


LocationInfoParserMixin.prototype._setStartLocation = function (element) {
    if (this.lastStartTagToken) {
        element.__location = Object.create(this.lastStartTagToken.location);
        element.__location.startTag = this.lastStartTagToken.location;
    }
    else
        element.__location = null;
};

LocationInfoParserMixin.prototype._setEndLocation = function (element, closingToken) {
    var loc = element.__location;

    if (loc) {
        if (closingToken.location) {
            var ctLoc = closingToken.location,
                tn = this.parser.treeAdapter.getTagName(element);

            // NOTE: For cases like <p> <p> </p> - First 'p' closes without a closing
            // tag and for cases like <td> <p> </td> - 'p' closes without a closing tag.
            var isClosingEndTag = closingToken.type === Tokenizer.END_TAG_TOKEN && tn === closingToken.tagName;

            if (isClosingEndTag) {
                loc.endTag = Object.create(ctLoc);
                loc.endOffset = ctLoc.endOffset;
            }

            else
                loc.endOffset = ctLoc.startOffset;
        }

        else if (closingToken.type === Tokenizer.EOF_TOKEN)
            loc.endOffset = this.posTracker.offset;
    }
};

LocationInfoParserMixin.prototype._getOverriddenMethods = function (mxn, orig) {
    return {
        _bootstrap: function (document, fragmentContext) {
            orig._bootstrap.call(this, document, fragmentContext);

            mxn.lastStartTagToken = null;
            mxn.lastFosterParentingLocation = null;
            mxn.currentToken = null;
            mxn.posTracker = new PositionTrackingPreprocessorMixin(this.tokenizer.preprocessor);

            new LocationInfoTokenizerMixin(this.tokenizer);

            new LocationInfoOpenElementStackMixin(this.openElements, {
                onItemPop: function (element) {
                    mxn._setEndLocation(element, mxn.currentToken);
                }
            });
        },

        _runParsingLoop: function (scriptHandler) {
            orig._runParsingLoop.call(this, scriptHandler);

            // NOTE: generate location info for elements
            // that remains on open element stack
            for (var i = this.openElements.stackTop; i >= 0; i--)
                mxn._setEndLocation(this.openElements.items[i], mxn.currentToken);
        },


        //Token processing
        _processTokenInForeignContent: function (token) {
            mxn.currentToken = token;
            orig._processTokenInForeignContent.call(this, token);
        },

        _processToken: function (token) {
            mxn.currentToken = token;
            orig._processToken.call(this, token);

            //NOTE: <body> and <html> are never popped from the stack, so we need to updated
            //their end location explicitly.
            var requireExplicitUpdate = token.type === Tokenizer.END_TAG_TOKEN &&
                                        (token.tagName === $.HTML ||
                                         token.tagName === $.BODY && this.openElements.hasInScope($.BODY));

            if (requireExplicitUpdate) {
                for (var i = this.openElements.stackTop; i >= 0; i--) {
                    var element = this.openElements.items[i];

                    if (this.treeAdapter.getTagName(element) === token.tagName) {
                        mxn._setEndLocation(element, token);
                        break;
                    }
                }
            }
        },


        //Doctype
        _setDocumentType: function (token) {
            orig._setDocumentType.call(this, token);

            var documentChildren = this.treeAdapter.getChildNodes(this.document),
                cnLength = documentChildren.length;

            for (var i = 0; i < cnLength; i++) {
                var node = documentChildren[i];

                if (this.treeAdapter.isDocumentTypeNode(node)) {
                    node.__location = token.location;
                    break;
                }
            }
        },


        //Elements
        _attachElementToTree: function (element) {
            //NOTE: _attachElementToTree is called from _appendElement, _insertElement and _insertTemplate methods.
            //So we will use token location stored in this methods for the element.
            mxn._setStartLocation(element);
            mxn.lastStartTagToken = null;
            orig._attachElementToTree.call(this, element);
        },

        _appendElement: function (token, namespaceURI) {
            mxn.lastStartTagToken = token;
            orig._appendElement.call(this, token, namespaceURI);
        },

        _insertElement: function (token, namespaceURI) {
            mxn.lastStartTagToken = token;
            orig._insertElement.call(this, token, namespaceURI);
        },

        _insertTemplate: function (token) {
            mxn.lastStartTagToken = token;
            orig._insertTemplate.call(this, token);

            var tmplContent = this.treeAdapter.getTemplateContent(this.openElements.current);

            tmplContent.__location = null;
        },

        _insertFakeRootElement: function () {
            orig._insertFakeRootElement.call(this);
            this.openElements.current.__location = null;
        },

        //Comments
        _appendCommentNode: function (token, parent) {
            orig._appendCommentNode.call(this, token, parent);

            var children = this.treeAdapter.getChildNodes(parent),
                commentNode = children[children.length - 1];

            commentNode.__location = token.location;
        },

        //Text
        _findFosterParentingLocation: function () {
            //NOTE: store last foster parenting location, so we will be able to find inserted text
            //in case of foster parenting
            mxn.lastFosterParentingLocation = orig._findFosterParentingLocation.call(this);

            return mxn.lastFosterParentingLocation;
        },

        _insertCharacters: function (token) {
            orig._insertCharacters.call(this, token);

            var hasFosterParent = this._shouldFosterParentOnInsertion(),
                parent = hasFosterParent && mxn.lastFosterParentingLocation.parent ||
                         this.openElements.currentTmplContent ||
                         this.openElements.current,
                siblings = this.treeAdapter.getChildNodes(parent),
                textNodeIdx = hasFosterParent && mxn.lastFosterParentingLocation.beforeElement ?
                siblings.indexOf(mxn.lastFosterParentingLocation.beforeElement) - 1 :
                siblings.length - 1,
                textNode = siblings[textNodeIdx];

            //NOTE: if we have location assigned by another token, then just update end position
            if (textNode.__location)
                textNode.__location.endOffset = token.location.endOffset;

            else
                textNode.__location = token.location;
        }
    };
};


},{"../../common/html":14,"../../tokenizer":31,"../../utils/mixin":37,"../position_tracking/preprocessor_mixin":19,"./open_element_stack_mixin":16,"./tokenizer_mixin":18,"util":60}],18:[function(require,module,exports){
'use strict';

var Mixin = require('../../utils/mixin'),
    Tokenizer = require('../../tokenizer'),
    PositionTrackingPreprocessorMixin = require('../position_tracking/preprocessor_mixin'),
    inherits = require('util').inherits;

var LocationInfoTokenizerMixin = module.exports = function (tokenizer) {
    Mixin.call(this, tokenizer);

    this.tokenizer = tokenizer;
    this.posTracker = new PositionTrackingPreprocessorMixin(tokenizer.preprocessor);
    this.currentAttrLocation = null;
    this.currentTokenLocation = null;
};

inherits(LocationInfoTokenizerMixin, Mixin);

LocationInfoTokenizerMixin.prototype._getCurrentLocation = function () {
    return {
        line: this.posTracker.line,
        col: this.posTracker.col,
        startOffset: this.posTracker.offset,
        endOffset: -1
    };
};

LocationInfoTokenizerMixin.prototype._attachCurrentAttrLocationInfo = function () {
    this.currentAttrLocation.endOffset = this.posTracker.offset;

    var currentToken = this.tokenizer.currentToken,
        currentAttr = this.tokenizer.currentAttr;

    if (!currentToken.location.attrs)
        currentToken.location.attrs = Object.create(null);

    currentToken.location.attrs[currentAttr.name] = this.currentAttrLocation;
};

LocationInfoTokenizerMixin.prototype._getOverriddenMethods = function (mxn, orig) {
    var methods = {
        _createStartTagToken: function () {
            orig._createStartTagToken.call(this);
            this.currentToken.location = mxn.currentTokenLocation;
        },

        _createEndTagToken: function () {
            orig._createEndTagToken.call(this);
            this.currentToken.location = mxn.currentTokenLocation;
        },

        _createCommentToken: function () {
            orig._createCommentToken.call(this);
            this.currentToken.location = mxn.currentTokenLocation;
        },

        _createDoctypeToken: function (initialName) {
            orig._createDoctypeToken.call(this, initialName);
            this.currentToken.location = mxn.currentTokenLocation;
        },

        _createCharacterToken: function (type, ch) {
            orig._createCharacterToken.call(this, type, ch);
            this.currentCharacterToken.location = mxn.currentTokenLocation;
        },

        _createAttr: function (attrNameFirstCh) {
            orig._createAttr.call(this, attrNameFirstCh);
            mxn.currentAttrLocation = mxn._getCurrentLocation();
        },

        _leaveAttrName: function (toState) {
            orig._leaveAttrName.call(this, toState);
            mxn._attachCurrentAttrLocationInfo();
        },

        _leaveAttrValue: function (toState) {
            orig._leaveAttrValue.call(this, toState);
            mxn._attachCurrentAttrLocationInfo();
        },

        _emitCurrentToken: function () {
            //NOTE: if we have pending character token make it's end location equal to the
            //current token's start location.
            if (this.currentCharacterToken)
                this.currentCharacterToken.location.endOffset = this.currentToken.location.startOffset;

            this.currentToken.location.endOffset = mxn.posTracker.offset + 1;
            orig._emitCurrentToken.call(this);
        },

        _emitCurrentCharacterToken: function () {
            //NOTE: if we have character token and it's location wasn't set in the _emitCurrentToken(),
            //then set it's location at the current preprocessor position.
            //We don't need to increment preprocessor position, since character token
            //emission is always forced by the start of the next character token here.
            //So, we already have advanced position.
            if (this.currentCharacterToken && this.currentCharacterToken.location.endOffset === -1)
                this.currentCharacterToken.location.endOffset = mxn.posTracker.offset;

            orig._emitCurrentCharacterToken.call(this);
        }
    };

    //NOTE: patch initial states for each mode to obtain token start position
    Object.keys(Tokenizer.MODE).forEach(function (modeName) {
        var state = Tokenizer.MODE[modeName];

        methods[state] = function (cp) {
            mxn.currentTokenLocation = mxn._getCurrentLocation();
            orig[state].call(this, cp);
        };
    });

    return methods;
};


},{"../../tokenizer":31,"../../utils/mixin":37,"../position_tracking/preprocessor_mixin":19,"util":60}],19:[function(require,module,exports){
'use strict';

var Mixin = require('../../utils/mixin'),
    inherits = require('util').inherits,
    UNICODE = require('../../common/unicode');

//Aliases
var $ = UNICODE.CODE_POINTS;

var PositionTrackingPreprocessorMixin = module.exports = function (preprocessor) {
    // NOTE: avoid installing tracker twice
    if (!preprocessor.__locTracker) {
        preprocessor.__locTracker = this;

        Mixin.call(this, preprocessor);

        this.preprocessor = preprocessor;
        this.isEol = false;
        this.lineStartPos = 0;
        this.droppedBufferSize = 0;

        this.col = -1;
        this.line = 1;
    }

    return preprocessor.__locTracker;
};

inherits(PositionTrackingPreprocessorMixin, Mixin);

Object.defineProperty(PositionTrackingPreprocessorMixin.prototype, 'offset', {
    get: function () {
        return this.droppedBufferSize + this.preprocessor.pos;
    }
});

PositionTrackingPreprocessorMixin.prototype._getOverriddenMethods = function (mxn, orig) {
    return {
        advance: function () {
            var cp = orig.advance.call(this);

            //NOTE: LF should be in the last column of the line
            if (mxn.isEol) {
                mxn.isEol = false;
                mxn.line++;
                mxn.lineStartPos = mxn.offset;
            }

            if (cp === $.LINE_FEED)
                mxn.isEol = true;

            mxn.col = mxn.offset - mxn.lineStartPos + 1;

            return cp;
        },

        retreat: function () {
            orig.retreat.call(this);
            mxn.isEol = false;

            mxn.col = mxn.offset - mxn.lineStartPos + 1;
        },

        dropParsedChunk: function () {
            var prevPos = this.pos;

            orig.dropParsedChunk.call(this);

            mxn.droppedBufferSize += prevPos - this.pos;
        }
    };
};

},{"../../common/unicode":15,"../../utils/mixin":37,"util":60}],20:[function(require,module,exports){
'use strict';

var Parser = require('./parser'),
    Serializer = require('./serializer');


// Shorthands
exports.parse = function parse(html, options) {
    var parser = new Parser(options);

    return parser.parse(html);
};

exports.parseFragment = function parseFragment(fragmentContext, html, options) {
    if (typeof fragmentContext === 'string') {
        options = html;
        html = fragmentContext;
        fragmentContext = null;
    }

    var parser = new Parser(options);

    return parser.parseFragment(html, fragmentContext);
};

exports.serialize = function (node, options) {
    var serializer = new Serializer(node, options);

    return serializer.serialize();
};


// Tree adapters
exports.treeAdapters = {
    default: require('./tree_adapters/default'),
    htmlparser2: require('./tree_adapters/htmlparser2')
};


// Streaming
exports.ParserStream = require('./parser/parser_stream');
exports.PlainTextConversionStream = require('./parser/plain_text_conversion_stream');
exports.SerializerStream = require('./serializer/serializer_stream');
exports.SAXParser = require('./sax');

},{"./parser":22,"./parser/parser_stream":24,"./parser/plain_text_conversion_stream":25,"./sax":27,"./serializer":29,"./serializer/serializer_stream":30,"./tree_adapters/default":34,"./tree_adapters/htmlparser2":35}],21:[function(require,module,exports){
'use strict';

//Const
var NOAH_ARK_CAPACITY = 3;

//List of formatting elements
var FormattingElementList = module.exports = function (treeAdapter) {
    this.length = 0;
    this.entries = [];
    this.treeAdapter = treeAdapter;
    this.bookmark = null;
};

//Entry types
FormattingElementList.MARKER_ENTRY = 'MARKER_ENTRY';
FormattingElementList.ELEMENT_ENTRY = 'ELEMENT_ENTRY';

//Noah Ark's condition
//OPTIMIZATION: at first we try to find possible candidates for exclusion using
//lightweight heuristics without thorough attributes check.
FormattingElementList.prototype._getNoahArkConditionCandidates = function (newElement) {
    var candidates = [];

    if (this.length >= NOAH_ARK_CAPACITY) {
        var neAttrsLength = this.treeAdapter.getAttrList(newElement).length,
            neTagName = this.treeAdapter.getTagName(newElement),
            neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);

        for (var i = this.length - 1; i >= 0; i--) {
            var entry = this.entries[i];

            if (entry.type === FormattingElementList.MARKER_ENTRY)
                break;

            var element = entry.element,
                elementAttrs = this.treeAdapter.getAttrList(element),
                isCandidate = this.treeAdapter.getTagName(element) === neTagName &&
                              this.treeAdapter.getNamespaceURI(element) === neNamespaceURI &&
                              elementAttrs.length === neAttrsLength;

            if (isCandidate)
                candidates.push({idx: i, attrs: elementAttrs});
        }
    }

    return candidates.length < NOAH_ARK_CAPACITY ? [] : candidates;
};

FormattingElementList.prototype._ensureNoahArkCondition = function (newElement) {
    var candidates = this._getNoahArkConditionCandidates(newElement),
        cLength = candidates.length;

    if (cLength) {
        var neAttrs = this.treeAdapter.getAttrList(newElement),
            neAttrsLength = neAttrs.length,
            neAttrsMap = Object.create(null);

        //NOTE: build attrs map for the new element so we can perform fast lookups
        for (var i = 0; i < neAttrsLength; i++) {
            var neAttr = neAttrs[i];

            neAttrsMap[neAttr.name] = neAttr.value;
        }

        for (i = 0; i < neAttrsLength; i++) {
            for (var j = 0; j < cLength; j++) {
                var cAttr = candidates[j].attrs[i];

                if (neAttrsMap[cAttr.name] !== cAttr.value) {
                    candidates.splice(j, 1);
                    cLength--;
                }

                if (candidates.length < NOAH_ARK_CAPACITY)
                    return;
            }
        }

        //NOTE: remove bottommost candidates until Noah's Ark condition will not be met
        for (i = cLength - 1; i >= NOAH_ARK_CAPACITY - 1; i--) {
            this.entries.splice(candidates[i].idx, 1);
            this.length--;
        }
    }
};

//Mutations
FormattingElementList.prototype.insertMarker = function () {
    this.entries.push({type: FormattingElementList.MARKER_ENTRY});
    this.length++;
};

FormattingElementList.prototype.pushElement = function (element, token) {
    this._ensureNoahArkCondition(element);

    this.entries.push({
        type: FormattingElementList.ELEMENT_ENTRY,
        element: element,
        token: token
    });

    this.length++;
};

FormattingElementList.prototype.insertElementAfterBookmark = function (element, token) {
    var bookmarkIdx = this.length - 1;

    for (; bookmarkIdx >= 0; bookmarkIdx--) {
        if (this.entries[bookmarkIdx] === this.bookmark)
            break;
    }

    this.entries.splice(bookmarkIdx + 1, 0, {
        type: FormattingElementList.ELEMENT_ENTRY,
        element: element,
        token: token
    });

    this.length++;
};

FormattingElementList.prototype.removeEntry = function (entry) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this.entries[i] === entry) {
            this.entries.splice(i, 1);
            this.length--;
            break;
        }
    }
};

FormattingElementList.prototype.clearToLastMarker = function () {
    while (this.length) {
        var entry = this.entries.pop();

        this.length--;

        if (entry.type === FormattingElementList.MARKER_ENTRY)
            break;
    }
};

//Search
FormattingElementList.prototype.getElementEntryInScopeWithTagName = function (tagName) {
    for (var i = this.length - 1; i >= 0; i--) {
        var entry = this.entries[i];

        if (entry.type === FormattingElementList.MARKER_ENTRY)
            return null;

        if (this.treeAdapter.getTagName(entry.element) === tagName)
            return entry;
    }

    return null;
};

FormattingElementList.prototype.getElementEntry = function (element) {
    for (var i = this.length - 1; i >= 0; i--) {
        var entry = this.entries[i];

        if (entry.type === FormattingElementList.ELEMENT_ENTRY && entry.element === element)
            return entry;
    }

    return null;
};

},{}],22:[function(require,module,exports){
'use strict';

var Tokenizer = require('../tokenizer'),
    OpenElementStack = require('./open_element_stack'),
    FormattingElementList = require('./formatting_element_list'),
    LocationInfoParserMixin = require('../extensions/location_info/parser_mixin'),
    defaultTreeAdapter = require('../tree_adapters/default'),
    mergeOptions = require('../utils/merge_options'),
    doctype = require('../common/doctype'),
    foreignContent = require('../common/foreign_content'),
    UNICODE = require('../common/unicode'),
    HTML = require('../common/html');

//Aliases
var $ = HTML.TAG_NAMES,
    NS = HTML.NAMESPACES,
    ATTRS = HTML.ATTRS;

var DEFAULT_OPTIONS = {
    locationInfo: false,
    treeAdapter: defaultTreeAdapter
};

//Misc constants
var HIDDEN_INPUT_TYPE = 'hidden';

//Adoption agency loops iteration count
var AA_OUTER_LOOP_ITER = 8,
    AA_INNER_LOOP_ITER = 3;

//Insertion modes
var INITIAL_MODE = 'INITIAL_MODE',
    BEFORE_HTML_MODE = 'BEFORE_HTML_MODE',
    BEFORE_HEAD_MODE = 'BEFORE_HEAD_MODE',
    IN_HEAD_MODE = 'IN_HEAD_MODE',
    AFTER_HEAD_MODE = 'AFTER_HEAD_MODE',
    IN_BODY_MODE = 'IN_BODY_MODE',
    TEXT_MODE = 'TEXT_MODE',
    IN_TABLE_MODE = 'IN_TABLE_MODE',
    IN_TABLE_TEXT_MODE = 'IN_TABLE_TEXT_MODE',
    IN_CAPTION_MODE = 'IN_CAPTION_MODE',
    IN_COLUMN_GROUP_MODE = 'IN_COLUMN_GROUP_MODE',
    IN_TABLE_BODY_MODE = 'IN_TABLE_BODY_MODE',
    IN_ROW_MODE = 'IN_ROW_MODE',
    IN_CELL_MODE = 'IN_CELL_MODE',
    IN_SELECT_MODE = 'IN_SELECT_MODE',
    IN_SELECT_IN_TABLE_MODE = 'IN_SELECT_IN_TABLE_MODE',
    IN_TEMPLATE_MODE = 'IN_TEMPLATE_MODE',
    AFTER_BODY_MODE = 'AFTER_BODY_MODE',
    IN_FRAMESET_MODE = 'IN_FRAMESET_MODE',
    AFTER_FRAMESET_MODE = 'AFTER_FRAMESET_MODE',
    AFTER_AFTER_BODY_MODE = 'AFTER_AFTER_BODY_MODE',
    AFTER_AFTER_FRAMESET_MODE = 'AFTER_AFTER_FRAMESET_MODE';

//Insertion mode reset map
var INSERTION_MODE_RESET_MAP = Object.create(null);

INSERTION_MODE_RESET_MAP[$.TR] = IN_ROW_MODE;
INSERTION_MODE_RESET_MAP[$.TBODY] =
INSERTION_MODE_RESET_MAP[$.THEAD] =
INSERTION_MODE_RESET_MAP[$.TFOOT] = IN_TABLE_BODY_MODE;
INSERTION_MODE_RESET_MAP[$.CAPTION] = IN_CAPTION_MODE;
INSERTION_MODE_RESET_MAP[$.COLGROUP] = IN_COLUMN_GROUP_MODE;
INSERTION_MODE_RESET_MAP[$.TABLE] = IN_TABLE_MODE;
INSERTION_MODE_RESET_MAP[$.BODY] = IN_BODY_MODE;
INSERTION_MODE_RESET_MAP[$.FRAMESET] = IN_FRAMESET_MODE;

//Template insertion mode switch map
var TEMPLATE_INSERTION_MODE_SWITCH_MAP = Object.create(null);

TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.CAPTION] =
TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.COLGROUP] =
TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TBODY] =
TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TFOOT] =
TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.THEAD] = IN_TABLE_MODE;
TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.COL] = IN_COLUMN_GROUP_MODE;
TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TR] = IN_TABLE_BODY_MODE;
TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TD] =
TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TH] = IN_ROW_MODE;

//Token handlers map for insertion modes
var _ = Object.create(null);

_[INITIAL_MODE] = Object.create(null);
_[INITIAL_MODE][Tokenizer.CHARACTER_TOKEN] =
_[INITIAL_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = tokenInInitialMode;
_[INITIAL_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = ignoreToken;
_[INITIAL_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[INITIAL_MODE][Tokenizer.DOCTYPE_TOKEN] = doctypeInInitialMode;
_[INITIAL_MODE][Tokenizer.START_TAG_TOKEN] =
_[INITIAL_MODE][Tokenizer.END_TAG_TOKEN] =
_[INITIAL_MODE][Tokenizer.EOF_TOKEN] = tokenInInitialMode;

_[BEFORE_HTML_MODE] = Object.create(null);
_[BEFORE_HTML_MODE][Tokenizer.CHARACTER_TOKEN] =
_[BEFORE_HTML_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = tokenBeforeHtml;
_[BEFORE_HTML_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = ignoreToken;
_[BEFORE_HTML_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[BEFORE_HTML_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[BEFORE_HTML_MODE][Tokenizer.START_TAG_TOKEN] = startTagBeforeHtml;
_[BEFORE_HTML_MODE][Tokenizer.END_TAG_TOKEN] = endTagBeforeHtml;
_[BEFORE_HTML_MODE][Tokenizer.EOF_TOKEN] = tokenBeforeHtml;

_[BEFORE_HEAD_MODE] = Object.create(null);
_[BEFORE_HEAD_MODE][Tokenizer.CHARACTER_TOKEN] =
_[BEFORE_HEAD_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = tokenBeforeHead;
_[BEFORE_HEAD_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = ignoreToken;
_[BEFORE_HEAD_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[BEFORE_HEAD_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[BEFORE_HEAD_MODE][Tokenizer.START_TAG_TOKEN] = startTagBeforeHead;
_[BEFORE_HEAD_MODE][Tokenizer.END_TAG_TOKEN] = endTagBeforeHead;
_[BEFORE_HEAD_MODE][Tokenizer.EOF_TOKEN] = tokenBeforeHead;

_[IN_HEAD_MODE] = Object.create(null);
_[IN_HEAD_MODE][Tokenizer.CHARACTER_TOKEN] =
_[IN_HEAD_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = tokenInHead;
_[IN_HEAD_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = insertCharacters;
_[IN_HEAD_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_HEAD_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_HEAD_MODE][Tokenizer.START_TAG_TOKEN] = startTagInHead;
_[IN_HEAD_MODE][Tokenizer.END_TAG_TOKEN] = endTagInHead;
_[IN_HEAD_MODE][Tokenizer.EOF_TOKEN] = tokenInHead;

_[AFTER_HEAD_MODE] = Object.create(null);
_[AFTER_HEAD_MODE][Tokenizer.CHARACTER_TOKEN] =
_[AFTER_HEAD_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = tokenAfterHead;
_[AFTER_HEAD_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = insertCharacters;
_[AFTER_HEAD_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[AFTER_HEAD_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[AFTER_HEAD_MODE][Tokenizer.START_TAG_TOKEN] = startTagAfterHead;
_[AFTER_HEAD_MODE][Tokenizer.END_TAG_TOKEN] = endTagAfterHead;
_[AFTER_HEAD_MODE][Tokenizer.EOF_TOKEN] = tokenAfterHead;

_[IN_BODY_MODE] = Object.create(null);
_[IN_BODY_MODE][Tokenizer.CHARACTER_TOKEN] = characterInBody;
_[IN_BODY_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[IN_BODY_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = whitespaceCharacterInBody;
_[IN_BODY_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_BODY_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_BODY_MODE][Tokenizer.START_TAG_TOKEN] = startTagInBody;
_[IN_BODY_MODE][Tokenizer.END_TAG_TOKEN] = endTagInBody;
_[IN_BODY_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[TEXT_MODE] = Object.create(null);
_[TEXT_MODE][Tokenizer.CHARACTER_TOKEN] =
_[TEXT_MODE][Tokenizer.NULL_CHARACTER_TOKEN] =
_[TEXT_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = insertCharacters;
_[TEXT_MODE][Tokenizer.COMMENT_TOKEN] =
_[TEXT_MODE][Tokenizer.DOCTYPE_TOKEN] =
_[TEXT_MODE][Tokenizer.START_TAG_TOKEN] = ignoreToken;
_[TEXT_MODE][Tokenizer.END_TAG_TOKEN] = endTagInText;
_[TEXT_MODE][Tokenizer.EOF_TOKEN] = eofInText;

_[IN_TABLE_MODE] = Object.create(null);
_[IN_TABLE_MODE][Tokenizer.CHARACTER_TOKEN] =
_[IN_TABLE_MODE][Tokenizer.NULL_CHARACTER_TOKEN] =
_[IN_TABLE_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = characterInTable;
_[IN_TABLE_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_TABLE_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_TABLE_MODE][Tokenizer.START_TAG_TOKEN] = startTagInTable;
_[IN_TABLE_MODE][Tokenizer.END_TAG_TOKEN] = endTagInTable;
_[IN_TABLE_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[IN_TABLE_TEXT_MODE] = Object.create(null);
_[IN_TABLE_TEXT_MODE][Tokenizer.CHARACTER_TOKEN] = characterInTableText;
_[IN_TABLE_TEXT_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[IN_TABLE_TEXT_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = whitespaceCharacterInTableText;
_[IN_TABLE_TEXT_MODE][Tokenizer.COMMENT_TOKEN] =
_[IN_TABLE_TEXT_MODE][Tokenizer.DOCTYPE_TOKEN] =
_[IN_TABLE_TEXT_MODE][Tokenizer.START_TAG_TOKEN] =
_[IN_TABLE_TEXT_MODE][Tokenizer.END_TAG_TOKEN] =
_[IN_TABLE_TEXT_MODE][Tokenizer.EOF_TOKEN] = tokenInTableText;

_[IN_CAPTION_MODE] = Object.create(null);
_[IN_CAPTION_MODE][Tokenizer.CHARACTER_TOKEN] = characterInBody;
_[IN_CAPTION_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[IN_CAPTION_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = whitespaceCharacterInBody;
_[IN_CAPTION_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_CAPTION_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_CAPTION_MODE][Tokenizer.START_TAG_TOKEN] = startTagInCaption;
_[IN_CAPTION_MODE][Tokenizer.END_TAG_TOKEN] = endTagInCaption;
_[IN_CAPTION_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[IN_COLUMN_GROUP_MODE] = Object.create(null);
_[IN_COLUMN_GROUP_MODE][Tokenizer.CHARACTER_TOKEN] =
_[IN_COLUMN_GROUP_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = tokenInColumnGroup;
_[IN_COLUMN_GROUP_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = insertCharacters;
_[IN_COLUMN_GROUP_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_COLUMN_GROUP_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_COLUMN_GROUP_MODE][Tokenizer.START_TAG_TOKEN] = startTagInColumnGroup;
_[IN_COLUMN_GROUP_MODE][Tokenizer.END_TAG_TOKEN] = endTagInColumnGroup;
_[IN_COLUMN_GROUP_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[IN_TABLE_BODY_MODE] = Object.create(null);
_[IN_TABLE_BODY_MODE][Tokenizer.CHARACTER_TOKEN] =
_[IN_TABLE_BODY_MODE][Tokenizer.NULL_CHARACTER_TOKEN] =
_[IN_TABLE_BODY_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = characterInTable;
_[IN_TABLE_BODY_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_TABLE_BODY_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_TABLE_BODY_MODE][Tokenizer.START_TAG_TOKEN] = startTagInTableBody;
_[IN_TABLE_BODY_MODE][Tokenizer.END_TAG_TOKEN] = endTagInTableBody;
_[IN_TABLE_BODY_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[IN_ROW_MODE] = Object.create(null);
_[IN_ROW_MODE][Tokenizer.CHARACTER_TOKEN] =
_[IN_ROW_MODE][Tokenizer.NULL_CHARACTER_TOKEN] =
_[IN_ROW_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = characterInTable;
_[IN_ROW_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_ROW_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_ROW_MODE][Tokenizer.START_TAG_TOKEN] = startTagInRow;
_[IN_ROW_MODE][Tokenizer.END_TAG_TOKEN] = endTagInRow;
_[IN_ROW_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[IN_CELL_MODE] = Object.create(null);
_[IN_CELL_MODE][Tokenizer.CHARACTER_TOKEN] = characterInBody;
_[IN_CELL_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[IN_CELL_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = whitespaceCharacterInBody;
_[IN_CELL_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_CELL_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_CELL_MODE][Tokenizer.START_TAG_TOKEN] = startTagInCell;
_[IN_CELL_MODE][Tokenizer.END_TAG_TOKEN] = endTagInCell;
_[IN_CELL_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[IN_SELECT_MODE] = Object.create(null);
_[IN_SELECT_MODE][Tokenizer.CHARACTER_TOKEN] = insertCharacters;
_[IN_SELECT_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[IN_SELECT_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = insertCharacters;
_[IN_SELECT_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_SELECT_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_SELECT_MODE][Tokenizer.START_TAG_TOKEN] = startTagInSelect;
_[IN_SELECT_MODE][Tokenizer.END_TAG_TOKEN] = endTagInSelect;
_[IN_SELECT_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[IN_SELECT_IN_TABLE_MODE] = Object.create(null);
_[IN_SELECT_IN_TABLE_MODE][Tokenizer.CHARACTER_TOKEN] = insertCharacters;
_[IN_SELECT_IN_TABLE_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[IN_SELECT_IN_TABLE_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = insertCharacters;
_[IN_SELECT_IN_TABLE_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_SELECT_IN_TABLE_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_SELECT_IN_TABLE_MODE][Tokenizer.START_TAG_TOKEN] = startTagInSelectInTable;
_[IN_SELECT_IN_TABLE_MODE][Tokenizer.END_TAG_TOKEN] = endTagInSelectInTable;
_[IN_SELECT_IN_TABLE_MODE][Tokenizer.EOF_TOKEN] = eofInBody;

_[IN_TEMPLATE_MODE] = Object.create(null);
_[IN_TEMPLATE_MODE][Tokenizer.CHARACTER_TOKEN] = characterInBody;
_[IN_TEMPLATE_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[IN_TEMPLATE_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = whitespaceCharacterInBody;
_[IN_TEMPLATE_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_TEMPLATE_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_TEMPLATE_MODE][Tokenizer.START_TAG_TOKEN] = startTagInTemplate;
_[IN_TEMPLATE_MODE][Tokenizer.END_TAG_TOKEN] = endTagInTemplate;
_[IN_TEMPLATE_MODE][Tokenizer.EOF_TOKEN] = eofInTemplate;

_[AFTER_BODY_MODE] = Object.create(null);
_[AFTER_BODY_MODE][Tokenizer.CHARACTER_TOKEN] =
_[AFTER_BODY_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = tokenAfterBody;
_[AFTER_BODY_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = whitespaceCharacterInBody;
_[AFTER_BODY_MODE][Tokenizer.COMMENT_TOKEN] = appendCommentToRootHtmlElement;
_[AFTER_BODY_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[AFTER_BODY_MODE][Tokenizer.START_TAG_TOKEN] = startTagAfterBody;
_[AFTER_BODY_MODE][Tokenizer.END_TAG_TOKEN] = endTagAfterBody;
_[AFTER_BODY_MODE][Tokenizer.EOF_TOKEN] = stopParsing;

_[IN_FRAMESET_MODE] = Object.create(null);
_[IN_FRAMESET_MODE][Tokenizer.CHARACTER_TOKEN] =
_[IN_FRAMESET_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[IN_FRAMESET_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = insertCharacters;
_[IN_FRAMESET_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[IN_FRAMESET_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[IN_FRAMESET_MODE][Tokenizer.START_TAG_TOKEN] = startTagInFrameset;
_[IN_FRAMESET_MODE][Tokenizer.END_TAG_TOKEN] = endTagInFrameset;
_[IN_FRAMESET_MODE][Tokenizer.EOF_TOKEN] = stopParsing;

_[AFTER_FRAMESET_MODE] = Object.create(null);
_[AFTER_FRAMESET_MODE][Tokenizer.CHARACTER_TOKEN] =
_[AFTER_FRAMESET_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[AFTER_FRAMESET_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = insertCharacters;
_[AFTER_FRAMESET_MODE][Tokenizer.COMMENT_TOKEN] = appendComment;
_[AFTER_FRAMESET_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[AFTER_FRAMESET_MODE][Tokenizer.START_TAG_TOKEN] = startTagAfterFrameset;
_[AFTER_FRAMESET_MODE][Tokenizer.END_TAG_TOKEN] = endTagAfterFrameset;
_[AFTER_FRAMESET_MODE][Tokenizer.EOF_TOKEN] = stopParsing;

_[AFTER_AFTER_BODY_MODE] = Object.create(null);
_[AFTER_AFTER_BODY_MODE][Tokenizer.CHARACTER_TOKEN] = tokenAfterAfterBody;
_[AFTER_AFTER_BODY_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = tokenAfterAfterBody;
_[AFTER_AFTER_BODY_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = whitespaceCharacterInBody;
_[AFTER_AFTER_BODY_MODE][Tokenizer.COMMENT_TOKEN] = appendCommentToDocument;
_[AFTER_AFTER_BODY_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[AFTER_AFTER_BODY_MODE][Tokenizer.START_TAG_TOKEN] = startTagAfterAfterBody;
_[AFTER_AFTER_BODY_MODE][Tokenizer.END_TAG_TOKEN] = tokenAfterAfterBody;
_[AFTER_AFTER_BODY_MODE][Tokenizer.EOF_TOKEN] = stopParsing;

_[AFTER_AFTER_FRAMESET_MODE] = Object.create(null);
_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.CHARACTER_TOKEN] =
_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.NULL_CHARACTER_TOKEN] = ignoreToken;
_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN] = whitespaceCharacterInBody;
_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.COMMENT_TOKEN] = appendCommentToDocument;
_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.DOCTYPE_TOKEN] = ignoreToken;
_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.START_TAG_TOKEN] = startTagAfterAfterFrameset;
_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.END_TAG_TOKEN] = ignoreToken;
_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.EOF_TOKEN] = stopParsing;


//Parser
var Parser = module.exports = function (options) {
    this.options = mergeOptions(DEFAULT_OPTIONS, options);

    this.treeAdapter = this.options.treeAdapter;
    this.pendingScript = null;

    if (this.options.locationInfo)
        new LocationInfoParserMixin(this);
};

// API
Parser.prototype.parse = function (html) {
    var document = this.treeAdapter.createDocument();

    this._bootstrap(document, null);
    this.tokenizer.write(html, true);
    this._runParsingLoop(null);

    return document;
};

Parser.prototype.parseFragment = function (html, fragmentContext) {
    //NOTE: use <template> element as a fragment context if context element was not provided,
    //so we will parse in "forgiving" manner
    if (!fragmentContext)
        fragmentContext = this.treeAdapter.createElement($.TEMPLATE, NS.HTML, []);

    //NOTE: create fake element which will be used as 'document' for fragment parsing.
    //This is important for jsdom there 'document' can't be recreated, therefore
    //fragment parsing causes messing of the main `document`.
    var documentMock = this.treeAdapter.createElement('documentmock', NS.HTML, []);

    this._bootstrap(documentMock, fragmentContext);

    if (this.treeAdapter.getTagName(fragmentContext) === $.TEMPLATE)
        this._pushTmplInsertionMode(IN_TEMPLATE_MODE);

    this._initTokenizerForFragmentParsing();
    this._insertFakeRootElement();
    this._resetInsertionMode();
    this._findFormInFragmentContext();
    this.tokenizer.write(html, true);
    this._runParsingLoop(null);

    var rootElement = this.treeAdapter.getFirstChild(documentMock),
        fragment = this.treeAdapter.createDocumentFragment();

    this._adoptNodes(rootElement, fragment);

    return fragment;
};

//Bootstrap parser
Parser.prototype._bootstrap = function (document, fragmentContext) {
    this.tokenizer = new Tokenizer(this.options);

    this.stopped = false;

    this.insertionMode = INITIAL_MODE;
    this.originalInsertionMode = '';

    this.document = document;
    this.fragmentContext = fragmentContext;

    this.headElement = null;
    this.formElement = null;

    this.openElements = new OpenElementStack(this.document, this.treeAdapter);
    this.activeFormattingElements = new FormattingElementList(this.treeAdapter);

    this.tmplInsertionModeStack = [];
    this.tmplInsertionModeStackTop = -1;
    this.currentTmplInsertionMode = null;

    this.pendingCharacterTokens = [];
    this.hasNonWhitespacePendingCharacterToken = false;

    this.framesetOk = true;
    this.skipNextNewLine = false;
    this.fosterParentingEnabled = false;
};

//Parsing loop
Parser.prototype._runParsingLoop  = function (scriptHandler) {
    while (!this.stopped) {
        this._setupTokenizerCDATAMode();

        var token = this.tokenizer.getNextToken();

        if (token.type === Tokenizer.HIBERNATION_TOKEN)
            break;

        if (this.skipNextNewLine) {
            this.skipNextNewLine = false;

            if (token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN && token.chars[0] === '\n') {
                if (token.chars.length === 1)
                    continue;

                token.chars = token.chars.substr(1);
            }
        }

        this._processInputToken(token);

        if (scriptHandler && this.pendingScript)
            break;
    }
};

Parser.prototype.runParsingLoopForCurrentChunk = function (writeCallback, scriptHandler) {
    this._runParsingLoop(scriptHandler);

    if (scriptHandler && this.pendingScript) {
        var script = this.pendingScript;

        this.pendingScript = null;

        scriptHandler(script);

        return;
    }

    if (writeCallback)
        writeCallback();
};

//Text parsing
Parser.prototype._setupTokenizerCDATAMode = function () {
    var current = this._getAdjustedCurrentElement();

    this.tokenizer.allowCDATA = current && current !== this.document &&
                                this.treeAdapter.getNamespaceURI(current) !== NS.HTML && !this._isIntegrationPoint(current);
};

Parser.prototype._switchToTextParsing = function (currentToken, nextTokenizerState) {
    this._insertElement(currentToken, NS.HTML);
    this.tokenizer.state = nextTokenizerState;
    this.originalInsertionMode = this.insertionMode;
    this.insertionMode = TEXT_MODE;
};

Parser.prototype.switchToPlaintextParsing = function () {
    this.insertionMode = TEXT_MODE;
    this.originalInsertionMode = IN_BODY_MODE;
    this.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
};

//Fragment parsing
Parser.prototype._getAdjustedCurrentElement = function () {
    return this.openElements.stackTop === 0 && this.fragmentContext ?
        this.fragmentContext :
        this.openElements.current;
};

Parser.prototype._findFormInFragmentContext = function () {
    var node = this.fragmentContext;

    do {
        if (this.treeAdapter.getTagName(node) === $.FORM) {
            this.formElement = node;
            break;
        }

        node = this.treeAdapter.getParentNode(node);
    } while (node);
};

Parser.prototype._initTokenizerForFragmentParsing = function () {
    if (this.treeAdapter.getNamespaceURI(this.fragmentContext) === NS.HTML) {
        var tn = this.treeAdapter.getTagName(this.fragmentContext);

        if (tn === $.TITLE || tn === $.TEXTAREA)
            this.tokenizer.state = Tokenizer.MODE.RCDATA;

        else if (tn === $.STYLE || tn === $.XMP || tn === $.IFRAME ||
                 tn === $.NOEMBED || tn === $.NOFRAMES || tn === $.NOSCRIPT)
            this.tokenizer.state = Tokenizer.MODE.RAWTEXT;

        else if (tn === $.SCRIPT)
            this.tokenizer.state = Tokenizer.MODE.SCRIPT_DATA;

        else if (tn === $.PLAINTEXT)
            this.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
    }
};

//Tree mutation
Parser.prototype._setDocumentType = function (token) {
    this.treeAdapter.setDocumentType(this.document, token.name, token.publicId, token.systemId);
};

Parser.prototype._attachElementToTree = function (element) {
    if (this._shouldFosterParentOnInsertion())
        this._fosterParentElement(element);

    else {
        var parent = this.openElements.currentTmplContent || this.openElements.current;

        this.treeAdapter.appendChild(parent, element);
    }
};

Parser.prototype._appendElement = function (token, namespaceURI) {
    var element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);

    this._attachElementToTree(element);
};

Parser.prototype._insertElement = function (token, namespaceURI) {
    var element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);

    this._attachElementToTree(element);
    this.openElements.push(element);
};

Parser.prototype._insertFakeElement = function (tagName) {
    var element = this.treeAdapter.createElement(tagName, NS.HTML, []);

    this._attachElementToTree(element);
    this.openElements.push(element);
};

Parser.prototype._insertTemplate = function (token) {
    var tmpl = this.treeAdapter.createElement(token.tagName, NS.HTML, token.attrs),
        content = this.treeAdapter.createDocumentFragment();

    this.treeAdapter.setTemplateContent(tmpl, content);
    this._attachElementToTree(tmpl);
    this.openElements.push(tmpl);
};

Parser.prototype._insertFakeRootElement = function () {
    var element = this.treeAdapter.createElement($.HTML, NS.HTML, []);

    this.treeAdapter.appendChild(this.openElements.current, element);
    this.openElements.push(element);
};

Parser.prototype._appendCommentNode = function (token, parent) {
    var commentNode = this.treeAdapter.createCommentNode(token.data);

    this.treeAdapter.appendChild(parent, commentNode);
};

Parser.prototype._insertCharacters = function (token) {
    if (this._shouldFosterParentOnInsertion())
        this._fosterParentText(token.chars);

    else {
        var parent = this.openElements.currentTmplContent || this.openElements.current;

        this.treeAdapter.insertText(parent, token.chars);
    }
};

Parser.prototype._adoptNodes = function (donor, recipient) {
    while (true) {
        var child = this.treeAdapter.getFirstChild(donor);

        if (!child)
            break;

        this.treeAdapter.detachNode(child);
        this.treeAdapter.appendChild(recipient, child);
    }
};

//Token processing
Parser.prototype._shouldProcessTokenInForeignContent = function (token) {
    var current = this._getAdjustedCurrentElement();

    if (!current || current === this.document)
        return false;

    var ns = this.treeAdapter.getNamespaceURI(current);

    if (ns === NS.HTML)
        return false;

    if (this.treeAdapter.getTagName(current) === $.ANNOTATION_XML && ns === NS.MATHML &&
        token.type === Tokenizer.START_TAG_TOKEN && token.tagName === $.SVG)
        return false;

    var isCharacterToken = token.type === Tokenizer.CHARACTER_TOKEN ||
                           token.type === Tokenizer.NULL_CHARACTER_TOKEN ||
                           token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN,
        isMathMLTextStartTag = token.type === Tokenizer.START_TAG_TOKEN &&
                               token.tagName !== $.MGLYPH &&
                               token.tagName !== $.MALIGNMARK;

    if ((isMathMLTextStartTag || isCharacterToken) && this._isIntegrationPoint(current, NS.MATHML))
        return false;

    if ((token.type === Tokenizer.START_TAG_TOKEN || isCharacterToken) && this._isIntegrationPoint(current, NS.HTML))
        return false;

    return token.type !== Tokenizer.EOF_TOKEN;
};

Parser.prototype._processToken = function (token) {
    _[this.insertionMode][token.type](this, token);
};

Parser.prototype._processTokenInBodyMode = function (token) {
    _[IN_BODY_MODE][token.type](this, token);
};

Parser.prototype._processTokenInForeignContent = function (token) {
    if (token.type === Tokenizer.CHARACTER_TOKEN)
        characterInForeignContent(this, token);

    else if (token.type === Tokenizer.NULL_CHARACTER_TOKEN)
        nullCharacterInForeignContent(this, token);

    else if (token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN)
        insertCharacters(this, token);

    else if (token.type === Tokenizer.COMMENT_TOKEN)
        appendComment(this, token);

    else if (token.type === Tokenizer.START_TAG_TOKEN)
        startTagInForeignContent(this, token);

    else if (token.type === Tokenizer.END_TAG_TOKEN)
        endTagInForeignContent(this, token);
};

Parser.prototype._processInputToken = function (token) {
    if (this._shouldProcessTokenInForeignContent(token))
        this._processTokenInForeignContent(token);

    else
        this._processToken(token);
};

//Integration points
Parser.prototype._isIntegrationPoint = function (element, foreignNS) {
    var tn = this.treeAdapter.getTagName(element),
        ns = this.treeAdapter.getNamespaceURI(element),
        attrs = this.treeAdapter.getAttrList(element);

    return foreignContent.isIntegrationPoint(tn, ns, attrs, foreignNS);
};

//Active formatting elements reconstruction
Parser.prototype._reconstructActiveFormattingElements = function () {
    var listLength = this.activeFormattingElements.length;

    if (listLength) {
        var unopenIdx = listLength,
            entry = null;

        do {
            unopenIdx--;
            entry = this.activeFormattingElements.entries[unopenIdx];

            if (entry.type === FormattingElementList.MARKER_ENTRY || this.openElements.contains(entry.element)) {
                unopenIdx++;
                break;
            }
        } while (unopenIdx > 0);

        for (var i = unopenIdx; i < listLength; i++) {
            entry = this.activeFormattingElements.entries[i];
            this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
            entry.element = this.openElements.current;
        }
    }
};

//Close elements
Parser.prototype._closeTableCell = function () {
    this.openElements.generateImpliedEndTags();
    this.openElements.popUntilTableCellPopped();
    this.activeFormattingElements.clearToLastMarker();
    this.insertionMode = IN_ROW_MODE;
};

Parser.prototype._closePElement = function () {
    this.openElements.generateImpliedEndTagsWithExclusion($.P);
    this.openElements.popUntilTagNamePopped($.P);
};

//Insertion modes
Parser.prototype._resetInsertionMode = function () {
    for (var i = this.openElements.stackTop, last = false; i >= 0; i--) {
        var element = this.openElements.items[i];

        if (i === 0) {
            last = true;

            if (this.fragmentContext)
                element = this.fragmentContext;
        }

        var tn = this.treeAdapter.getTagName(element),
            newInsertionMode = INSERTION_MODE_RESET_MAP[tn];

        if (newInsertionMode) {
            this.insertionMode = newInsertionMode;
            break;
        }

        else if (!last && (tn === $.TD || tn === $.TH)) {
            this.insertionMode = IN_CELL_MODE;
            break;
        }

        else if (!last && tn === $.HEAD) {
            this.insertionMode = IN_HEAD_MODE;
            break;
        }

        else if (tn === $.SELECT) {
            this._resetInsertionModeForSelect(i);
            break;
        }

        else if (tn === $.TEMPLATE) {
            this.insertionMode = this.currentTmplInsertionMode;
            break;
        }

        else if (tn === $.HTML) {
            this.insertionMode = this.headElement ? AFTER_HEAD_MODE : BEFORE_HEAD_MODE;
            break;
        }

        else if (last) {
            this.insertionMode = IN_BODY_MODE;
            break;
        }
    }
};

Parser.prototype._resetInsertionModeForSelect = function (selectIdx) {
    if (selectIdx > 0) {
        for (var i = selectIdx - 1; i > 0; i--) {
            var ancestor = this.openElements.items[i],
                tn = this.treeAdapter.getTagName(ancestor);

            if (tn === $.TEMPLATE)
                break;

            else if (tn === $.TABLE) {
                this.insertionMode = IN_SELECT_IN_TABLE_MODE;
                return;
            }
        }
    }

    this.insertionMode = IN_SELECT_MODE;
};

Parser.prototype._pushTmplInsertionMode = function (mode) {
    this.tmplInsertionModeStack.push(mode);
    this.tmplInsertionModeStackTop++;
    this.currentTmplInsertionMode = mode;
};

Parser.prototype._popTmplInsertionMode = function () {
    this.tmplInsertionModeStack.pop();
    this.tmplInsertionModeStackTop--;
    this.currentTmplInsertionMode = this.tmplInsertionModeStack[this.tmplInsertionModeStackTop];
};

//Foster parenting
Parser.prototype._isElementCausesFosterParenting = function (element) {
    var tn = this.treeAdapter.getTagName(element);

    return tn === $.TABLE || tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD || tn === $.TR;
};

Parser.prototype._shouldFosterParentOnInsertion = function () {
    return this.fosterParentingEnabled && this._isElementCausesFosterParenting(this.openElements.current);
};

Parser.prototype._findFosterParentingLocation = function () {
    var location = {
        parent: null,
        beforeElement: null
    };

    for (var i = this.openElements.stackTop; i >= 0; i--) {
        var openElement = this.openElements.items[i],
            tn = this.treeAdapter.getTagName(openElement),
            ns = this.treeAdapter.getNamespaceURI(openElement);

        if (tn === $.TEMPLATE && ns === NS.HTML) {
            location.parent = this.treeAdapter.getTemplateContent(openElement);
            break;
        }

        else if (tn === $.TABLE) {
            location.parent = this.treeAdapter.getParentNode(openElement);

            if (location.parent)
                location.beforeElement = openElement;
            else
                location.parent = this.openElements.items[i - 1];

            break;
        }
    }

    if (!location.parent)
        location.parent = this.openElements.items[0];

    return location;
};

Parser.prototype._fosterParentElement = function (element) {
    var location = this._findFosterParentingLocation();

    if (location.beforeElement)
        this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
    else
        this.treeAdapter.appendChild(location.parent, element);
};

Parser.prototype._fosterParentText = function (chars) {
    var location = this._findFosterParentingLocation();

    if (location.beforeElement)
        this.treeAdapter.insertTextBefore(location.parent, chars, location.beforeElement);
    else
        this.treeAdapter.insertText(location.parent, chars);
};

//Special elements
Parser.prototype._isSpecialElement = function (element) {
    var tn = this.treeAdapter.getTagName(element),
        ns = this.treeAdapter.getNamespaceURI(element);

    return HTML.SPECIAL_ELEMENTS[ns][tn];
};

//Adoption agency algorithm
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html#adoptionAgency)
//------------------------------------------------------------------

//Steps 5-8 of the algorithm
function aaObtainFormattingElementEntry(p, token) {
    var formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);

    if (formattingElementEntry) {
        if (!p.openElements.contains(formattingElementEntry.element)) {
            p.activeFormattingElements.removeEntry(formattingElementEntry);
            formattingElementEntry = null;
        }

        else if (!p.openElements.hasInScope(token.tagName))
            formattingElementEntry = null;
    }

    else
        genericEndTagInBody(p, token);

    return formattingElementEntry;
}

//Steps 9 and 10 of the algorithm
function aaObtainFurthestBlock(p, formattingElementEntry) {
    var furthestBlock = null;

    for (var i = p.openElements.stackTop; i >= 0; i--) {
        var element = p.openElements.items[i];

        if (element === formattingElementEntry.element)
            break;

        if (p._isSpecialElement(element))
            furthestBlock = element;
    }

    if (!furthestBlock) {
        p.openElements.popUntilElementPopped(formattingElementEntry.element);
        p.activeFormattingElements.removeEntry(formattingElementEntry);
    }

    return furthestBlock;
}

//Step 13 of the algorithm
function aaInnerLoop(p, furthestBlock, formattingElement) {
    var lastElement = furthestBlock,
        nextElement = p.openElements.getCommonAncestor(furthestBlock);

    for (var i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
        //NOTE: store next element for the next loop iteration (it may be deleted from the stack by step 9.5)
        nextElement = p.openElements.getCommonAncestor(element);

        var elementEntry = p.activeFormattingElements.getElementEntry(element),
            counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER,
            shouldRemoveFromOpenElements = !elementEntry || counterOverflow;

        if (shouldRemoveFromOpenElements) {
            if (counterOverflow)
                p.activeFormattingElements.removeEntry(elementEntry);

            p.openElements.remove(element);
        }

        else {
            element = aaRecreateElementFromEntry(p, elementEntry);

            if (lastElement === furthestBlock)
                p.activeFormattingElements.bookmark = elementEntry;

            p.treeAdapter.detachNode(lastElement);
            p.treeAdapter.appendChild(element, lastElement);
            lastElement = element;
        }
    }

    return lastElement;
}

//Step 13.7 of the algorithm
function aaRecreateElementFromEntry(p, elementEntry) {
    var ns = p.treeAdapter.getNamespaceURI(elementEntry.element),
        newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);

    p.openElements.replace(elementEntry.element, newElement);
    elementEntry.element = newElement;

    return newElement;
}

//Step 14 of the algorithm
function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
    if (p._isElementCausesFosterParenting(commonAncestor))
        p._fosterParentElement(lastElement);

    else {
        var tn = p.treeAdapter.getTagName(commonAncestor),
            ns = p.treeAdapter.getNamespaceURI(commonAncestor);

        if (tn === $.TEMPLATE && ns === NS.HTML)
            commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);

        p.treeAdapter.appendChild(commonAncestor, lastElement);
    }
}

//Steps 15-19 of the algorithm
function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
    var ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element),
        token = formattingElementEntry.token,
        newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);

    p._adoptNodes(furthestBlock, newElement);
    p.treeAdapter.appendChild(furthestBlock, newElement);

    p.activeFormattingElements.insertElementAfterBookmark(newElement, formattingElementEntry.token);
    p.activeFormattingElements.removeEntry(formattingElementEntry);

    p.openElements.remove(formattingElementEntry.element);
    p.openElements.insertAfter(furthestBlock, newElement);
}

//Algorithm entry point
function callAdoptionAgency(p, token) {
    var formattingElementEntry;

    for (var i = 0; i < AA_OUTER_LOOP_ITER; i++) {
        formattingElementEntry = aaObtainFormattingElementEntry(p, token, formattingElementEntry);

        if (!formattingElementEntry)
            break;

        var furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);

        if (!furthestBlock)
            break;

        p.activeFormattingElements.bookmark = formattingElementEntry;

        var lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element),
            commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);

        p.treeAdapter.detachNode(lastElement);
        aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
        aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
    }
}


//Generic token handlers
//------------------------------------------------------------------
function ignoreToken() {
    //NOTE: do nothing =)
}

function appendComment(p, token) {
    p._appendCommentNode(token, p.openElements.currentTmplContent || p.openElements.current);
}

function appendCommentToRootHtmlElement(p, token) {
    p._appendCommentNode(token, p.openElements.items[0]);
}

function appendCommentToDocument(p, token) {
    p._appendCommentNode(token, p.document);
}

function insertCharacters(p, token) {
    p._insertCharacters(token);
}

function stopParsing(p) {
    p.stopped = true;
}

//12.2.5.4.1 The "initial" insertion mode
//------------------------------------------------------------------
function doctypeInInitialMode(p, token) {
    p._setDocumentType(token);

    var mode = token.forceQuirks ?
        HTML.DOCUMENT_MODE.QUIRKS :
        doctype.getDocumentMode(token.name, token.publicId, token.systemId);

    p.treeAdapter.setDocumentMode(p.document, mode);

    p.insertionMode = BEFORE_HTML_MODE;
}

function tokenInInitialMode(p, token) {
    p.treeAdapter.setDocumentMode(p.document, HTML.DOCUMENT_MODE.QUIRKS);
    p.insertionMode = BEFORE_HTML_MODE;
    p._processToken(token);
}


//12.2.5.4.2 The "before html" insertion mode
//------------------------------------------------------------------
function startTagBeforeHtml(p, token) {
    if (token.tagName === $.HTML) {
        p._insertElement(token, NS.HTML);
        p.insertionMode = BEFORE_HEAD_MODE;
    }

    else
        tokenBeforeHtml(p, token);
}

function endTagBeforeHtml(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML || tn === $.HEAD || tn === $.BODY || tn === $.BR)
        tokenBeforeHtml(p, token);
}

function tokenBeforeHtml(p, token) {
    p._insertFakeRootElement();
    p.insertionMode = BEFORE_HEAD_MODE;
    p._processToken(token);
}


//12.2.5.4.3 The "before head" insertion mode
//------------------------------------------------------------------
function startTagBeforeHead(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML)
        startTagInBody(p, token);

    else if (tn === $.HEAD) {
        p._insertElement(token, NS.HTML);
        p.headElement = p.openElements.current;
        p.insertionMode = IN_HEAD_MODE;
    }

    else
        tokenBeforeHead(p, token);
}

function endTagBeforeHead(p, token) {
    var tn = token.tagName;

    if (tn === $.HEAD || tn === $.BODY || tn === $.HTML || tn === $.BR)
        tokenBeforeHead(p, token);
}

function tokenBeforeHead(p, token) {
    p._insertFakeElement($.HEAD);
    p.headElement = p.openElements.current;
    p.insertionMode = IN_HEAD_MODE;
    p._processToken(token);
}


//12.2.5.4.4 The "in head" insertion mode
//------------------------------------------------------------------
function startTagInHead(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML)
        startTagInBody(p, token);

    else if (tn === $.BASE || tn === $.BASEFONT || tn === $.BGSOUND || tn === $.LINK || tn === $.META)
        p._appendElement(token, NS.HTML);

    else if (tn === $.TITLE)
        p._switchToTextParsing(token, Tokenizer.MODE.RCDATA);

    //NOTE: here we assume that we always act as an interactive user agent with enabled scripting, so we parse
    //<noscript> as a rawtext.
    else if (tn === $.NOSCRIPT || tn === $.NOFRAMES || tn === $.STYLE)
        p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);

    else if (tn === $.SCRIPT)
        p._switchToTextParsing(token, Tokenizer.MODE.SCRIPT_DATA);

    else if (tn === $.TEMPLATE) {
        p._insertTemplate(token, NS.HTML);
        p.activeFormattingElements.insertMarker();
        p.framesetOk = false;
        p.insertionMode = IN_TEMPLATE_MODE;
        p._pushTmplInsertionMode(IN_TEMPLATE_MODE);
    }

    else if (tn !== $.HEAD)
        tokenInHead(p, token);
}

function endTagInHead(p, token) {
    var tn = token.tagName;

    if (tn === $.HEAD) {
        p.openElements.pop();
        p.insertionMode = AFTER_HEAD_MODE;
    }

    else if (tn === $.BODY || tn === $.BR || tn === $.HTML)
        tokenInHead(p, token);

    else if (tn === $.TEMPLATE && p.openElements.tmplCount > 0) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped($.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p._popTmplInsertionMode();
        p._resetInsertionMode();
    }
}

function tokenInHead(p, token) {
    p.openElements.pop();
    p.insertionMode = AFTER_HEAD_MODE;
    p._processToken(token);
}


//12.2.5.4.6 The "after head" insertion mode
//------------------------------------------------------------------
function startTagAfterHead(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML)
        startTagInBody(p, token);

    else if (tn === $.BODY) {
        p._insertElement(token, NS.HTML);
        p.framesetOk = false;
        p.insertionMode = IN_BODY_MODE;
    }

    else if (tn === $.FRAMESET) {
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_FRAMESET_MODE;
    }

    else if (tn === $.BASE || tn === $.BASEFONT || tn === $.BGSOUND || tn === $.LINK || tn === $.META ||
             tn === $.NOFRAMES || tn === $.SCRIPT || tn === $.STYLE || tn === $.TEMPLATE || tn === $.TITLE) {
        p.openElements.push(p.headElement);
        startTagInHead(p, token);
        p.openElements.remove(p.headElement);
    }

    else if (tn !== $.HEAD)
        tokenAfterHead(p, token);
}

function endTagAfterHead(p, token) {
    var tn = token.tagName;

    if (tn === $.BODY || tn === $.HTML || tn === $.BR)
        tokenAfterHead(p, token);

    else if (tn === $.TEMPLATE)
        endTagInHead(p, token);
}

function tokenAfterHead(p, token) {
    p._insertFakeElement($.BODY);
    p.insertionMode = IN_BODY_MODE;
    p._processToken(token);
}


//12.2.5.4.7 The "in body" insertion mode
//------------------------------------------------------------------
function whitespaceCharacterInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertCharacters(token);
}

function characterInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertCharacters(token);
    p.framesetOk = false;
}

function htmlStartTagInBody(p, token) {
    if (p.openElements.tmplCount === 0)
        p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
}

function bodyStartTagInBody(p, token) {
    var bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();

    if (bodyElement && p.openElements.tmplCount === 0) {
        p.framesetOk = false;
        p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
    }
}

function framesetStartTagInBody(p, token) {
    var bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();

    if (p.framesetOk && bodyElement) {
        p.treeAdapter.detachNode(bodyElement);
        p.openElements.popAllUpToHtmlElement();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_FRAMESET_MODE;
    }
}

function addressStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P))
        p._closePElement();

    p._insertElement(token, NS.HTML);
}

function numberedHeaderStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P))
        p._closePElement();

    var tn = p.openElements.currentTagName;

    if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6)
        p.openElements.pop();

    p._insertElement(token, NS.HTML);
}

function preStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P))
        p._closePElement();

    p._insertElement(token, NS.HTML);
    //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
    //on to the next one. (Newlines at the start of pre blocks are ignored as an authoring convenience.)
    p.skipNextNewLine = true;
    p.framesetOk = false;
}

function formStartTagInBody(p, token) {
    var inTemplate = p.openElements.tmplCount > 0;

    if (!p.formElement || inTemplate) {
        if (p.openElements.hasInButtonScope($.P))
            p._closePElement();

        p._insertElement(token, NS.HTML);

        if (!inTemplate)
            p.formElement = p.openElements.current;
    }
}

function listItemStartTagInBody(p, token) {
    p.framesetOk = false;

    var tn = token.tagName;

    for (var i = p.openElements.stackTop; i >= 0; i--) {
        var element = p.openElements.items[i],
            elementTn = p.treeAdapter.getTagName(element),
            closeTn = null;

        if (tn === $.LI && elementTn === $.LI)
            closeTn = $.LI;

        else if ((tn === $.DD || tn === $.DT) && (elementTn === $.DD || elementTn === $.DT))
            closeTn = elementTn;

        if (closeTn) {
            p.openElements.generateImpliedEndTagsWithExclusion(closeTn);
            p.openElements.popUntilTagNamePopped(closeTn);
            break;
        }

        if (elementTn !== $.ADDRESS && elementTn !== $.DIV && elementTn !== $.P && p._isSpecialElement(element))
            break;
    }

    if (p.openElements.hasInButtonScope($.P))
        p._closePElement();

    p._insertElement(token, NS.HTML);
}

function plaintextStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P))
        p._closePElement();

    p._insertElement(token, NS.HTML);
    p.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
}

function buttonStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.BUTTON)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped($.BUTTON);
    }

    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.framesetOk = false;
}

function aStartTagInBody(p, token) {
    var activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName($.A);

    if (activeElementEntry) {
        callAdoptionAgency(p, token);
        p.openElements.remove(activeElementEntry.element);
        p.activeFormattingElements.removeEntry(activeElementEntry);
    }

    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}

function bStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}

function nobrStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();

    if (p.openElements.hasInScope($.NOBR)) {
        callAdoptionAgency(p, token);
        p._reconstructActiveFormattingElements();
    }

    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}

function appletStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.insertMarker();
    p.framesetOk = false;
}

function tableStartTagInBody(p, token) {
    if (p.treeAdapter.getDocumentMode(p.document) !== HTML.DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope($.P))
        p._closePElement();

    p._insertElement(token, NS.HTML);
    p.framesetOk = false;
    p.insertionMode = IN_TABLE_MODE;
}

function areaStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._appendElement(token, NS.HTML);
    p.framesetOk = false;
}

function inputStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._appendElement(token, NS.HTML);

    var inputType = Tokenizer.getTokenAttr(token, ATTRS.TYPE);

    if (!inputType || inputType.toLowerCase() !== HIDDEN_INPUT_TYPE)
        p.framesetOk = false;

}

function paramStartTagInBody(p, token) {
    p._appendElement(token, NS.HTML);
}

function hrStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P))
        p._closePElement();

    if (p.openElements.currentTagName === $.MENUITEM)
        p.openElements.pop();

    p._appendElement(token, NS.HTML);
    p.framesetOk = false;
}

function imageStartTagInBody(p, token) {
    token.tagName = $.IMG;
    areaStartTagInBody(p, token);
}

function textareaStartTagInBody(p, token) {
    p._insertElement(token, NS.HTML);
    //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
    //on to the next one. (Newlines at the start of textarea elements are ignored as an authoring convenience.)
    p.skipNextNewLine = true;
    p.tokenizer.state = Tokenizer.MODE.RCDATA;
    p.originalInsertionMode = p.insertionMode;
    p.framesetOk = false;
    p.insertionMode = TEXT_MODE;
}

function xmpStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P))
        p._closePElement();

    p._reconstructActiveFormattingElements();
    p.framesetOk = false;
    p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
}

function iframeStartTagInBody(p, token) {
    p.framesetOk = false;
    p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
}

//NOTE: here we assume that we always act as an user agent with enabled plugins, so we parse
//<noembed> as a rawtext.
function noembedStartTagInBody(p, token) {
    p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
}

function selectStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.framesetOk = false;

    if (p.insertionMode === IN_TABLE_MODE ||
        p.insertionMode === IN_CAPTION_MODE ||
        p.insertionMode === IN_TABLE_BODY_MODE ||
        p.insertionMode === IN_ROW_MODE ||
        p.insertionMode === IN_CELL_MODE)

        p.insertionMode = IN_SELECT_IN_TABLE_MODE;

    else
        p.insertionMode = IN_SELECT_MODE;
}

function optgroupStartTagInBody(p, token) {
    if (p.openElements.currentTagName === $.OPTION)
        p.openElements.pop();

    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
}

function rbStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.RUBY))
        p.openElements.generateImpliedEndTags();

    p._insertElement(token, NS.HTML);
}

function rtStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.RUBY))
        p.openElements.generateImpliedEndTagsWithExclusion($.RTC);

    p._insertElement(token, NS.HTML);
}

function menuitemStartTagInBody(p, token) {
    if (p.openElements.currentTagName === $.MENUITEM)
        p.openElements.pop();

    // TODO needs clarification, see https://github.com/whatwg/html/pull/907/files#r73505877
    p._reconstructActiveFormattingElements();

    p._insertElement(token, NS.HTML);
}

function menuStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P))
        p._closePElement();

    if (p.openElements.currentTagName === $.MENUITEM)
        p.openElements.pop();

    p._insertElement(token, NS.HTML);
}

function mathStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();

    foreignContent.adjustTokenMathMLAttrs(token);
    foreignContent.adjustTokenXMLAttrs(token);

    if (token.selfClosing)
        p._appendElement(token, NS.MATHML);
    else
        p._insertElement(token, NS.MATHML);
}

function svgStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();

    foreignContent.adjustTokenSVGAttrs(token);
    foreignContent.adjustTokenXMLAttrs(token);

    if (token.selfClosing)
        p._appendElement(token, NS.SVG);
    else
        p._insertElement(token, NS.SVG);
}

function genericStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
}

//OPTIMIZATION: Integer comparisons are low-cost, so we can use very fast tag name length filters here.
//It's faster than using dictionary.
function startTagInBody(p, token) {
    var tn = token.tagName;

    switch (tn.length) {
        case 1:
            if (tn === $.I || tn === $.S || tn === $.B || tn === $.U)
                bStartTagInBody(p, token);

            else if (tn === $.P)
                addressStartTagInBody(p, token);

            else if (tn === $.A)
                aStartTagInBody(p, token);

            else
                genericStartTagInBody(p, token);

            break;

        case 2:
            if (tn === $.DL || tn === $.OL || tn === $.UL)
                addressStartTagInBody(p, token);

            else if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6)
                numberedHeaderStartTagInBody(p, token);

            else if (tn === $.LI || tn === $.DD || tn === $.DT)
                listItemStartTagInBody(p, token);

            else if (tn === $.EM || tn === $.TT)
                bStartTagInBody(p, token);

            else if (tn === $.BR)
                areaStartTagInBody(p, token);

            else if (tn === $.HR)
                hrStartTagInBody(p, token);

            else if (tn === $.RB)
                rbStartTagInBody(p, token);

            else if (tn === $.RT || tn === $.RP)
                rtStartTagInBody(p, token);

            else if (tn !== $.TH && tn !== $.TD && tn !== $.TR)
                genericStartTagInBody(p, token);

            break;

        case 3:
            if (tn === $.DIV || tn === $.DIR || tn === $.NAV)
                addressStartTagInBody(p, token);

            else if (tn === $.PRE)
                preStartTagInBody(p, token);

            else if (tn === $.BIG)
                bStartTagInBody(p, token);

            else if (tn === $.IMG || tn === $.WBR)
                areaStartTagInBody(p, token);

            else if (tn === $.XMP)
                xmpStartTagInBody(p, token);

            else if (tn === $.SVG)
                svgStartTagInBody(p, token);

            else if (tn === $.RTC)
                rbStartTagInBody(p, token);

            else if (tn !== $.COL)
                genericStartTagInBody(p, token);

            break;

        case 4:
            if (tn === $.HTML)
                htmlStartTagInBody(p, token);

            else if (tn === $.BASE || tn === $.LINK || tn === $.META)
                startTagInHead(p, token);

            else if (tn === $.BODY)
                bodyStartTagInBody(p, token);

            else if (tn === $.MAIN)
                addressStartTagInBody(p, token);

            else if (tn === $.FORM)
                formStartTagInBody(p, token);

            else if (tn === $.CODE || tn === $.FONT)
                bStartTagInBody(p, token);

            else if (tn === $.NOBR)
                nobrStartTagInBody(p, token);

            else if (tn === $.AREA)
                areaStartTagInBody(p, token);

            else if (tn === $.MATH)
                mathStartTagInBody(p, token);

            else if (tn === $.MENU)
                menuStartTagInBody(p, token);

            else if (tn !== $.HEAD)
                genericStartTagInBody(p, token);

            break;

        case 5:
            if (tn === $.STYLE || tn === $.TITLE)
                startTagInHead(p, token);

            else if (tn === $.ASIDE)
                addressStartTagInBody(p, token);

            else if (tn === $.SMALL)
                bStartTagInBody(p, token);

            else if (tn === $.TABLE)
                tableStartTagInBody(p, token);

            else if (tn === $.EMBED)
                areaStartTagInBody(p, token);

            else if (tn === $.INPUT)
                inputStartTagInBody(p, token);

            else if (tn === $.PARAM || tn === $.TRACK)
                paramStartTagInBody(p, token);

            else if (tn === $.IMAGE)
                imageStartTagInBody(p, token);

            else if (tn !== $.FRAME && tn !== $.TBODY && tn !== $.TFOOT && tn !== $.THEAD)
                genericStartTagInBody(p, token);

            break;

        case 6:
            if (tn === $.SCRIPT)
                startTagInHead(p, token);

            else if (tn === $.CENTER || tn === $.FIGURE || tn === $.FOOTER || tn === $.HEADER || tn === $.HGROUP)
                addressStartTagInBody(p, token);

            else if (tn === $.BUTTON)
                buttonStartTagInBody(p, token);

            else if (tn === $.STRIKE || tn === $.STRONG)
                bStartTagInBody(p, token);

            else if (tn === $.APPLET || tn === $.OBJECT)
                appletStartTagInBody(p, token);

            else if (tn === $.KEYGEN)
                areaStartTagInBody(p, token);

            else if (tn === $.SOURCE)
                paramStartTagInBody(p, token);

            else if (tn === $.IFRAME)
                iframeStartTagInBody(p, token);

            else if (tn === $.SELECT)
                selectStartTagInBody(p, token);

            else if (tn === $.OPTION)
                optgroupStartTagInBody(p, token);

            else
                genericStartTagInBody(p, token);

            break;

        case 7:
            if (tn === $.BGSOUND)
                startTagInHead(p, token);

            else if (tn === $.DETAILS || tn === $.ADDRESS || tn === $.ARTICLE || tn === $.SECTION || tn === $.SUMMARY)
                addressStartTagInBody(p, token);

            else if (tn === $.LISTING)
                preStartTagInBody(p, token);

            else if (tn === $.MARQUEE)
                appletStartTagInBody(p, token);

            else if (tn === $.NOEMBED)
                noembedStartTagInBody(p, token);

            else if (tn !== $.CAPTION)
                genericStartTagInBody(p, token);

            break;

        case 8:
            if (tn === $.BASEFONT)
                startTagInHead(p, token);

            else if (tn === $.MENUITEM)
                menuitemStartTagInBody(p, token);

            else if (tn === $.FRAMESET)
                framesetStartTagInBody(p, token);

            else if (tn === $.FIELDSET)
                addressStartTagInBody(p, token);

            else if (tn === $.TEXTAREA)
                textareaStartTagInBody(p, token);

            else if (tn === $.TEMPLATE)
                startTagInHead(p, token);

            else if (tn === $.NOSCRIPT)
                noembedStartTagInBody(p, token);

            else if (tn === $.OPTGROUP)
                optgroupStartTagInBody(p, token);

            else if (tn !== $.COLGROUP)
                genericStartTagInBody(p, token);

            break;

        case 9:
            if (tn === $.PLAINTEXT)
                plaintextStartTagInBody(p, token);

            else
                genericStartTagInBody(p, token);

            break;

        case 10:
            if (tn === $.BLOCKQUOTE || tn === $.FIGCAPTION)
                addressStartTagInBody(p, token);

            else
                genericStartTagInBody(p, token);

            break;

        default:
            genericStartTagInBody(p, token);
    }
}

function bodyEndTagInBody(p) {
    if (p.openElements.hasInScope($.BODY))
        p.insertionMode = AFTER_BODY_MODE;
}

function htmlEndTagInBody(p, token) {
    if (p.openElements.hasInScope($.BODY)) {
        p.insertionMode = AFTER_BODY_MODE;
        p._processToken(token);
    }
}

function addressEndTagInBody(p, token) {
    var tn = token.tagName;

    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(tn);
    }
}

function formEndTagInBody(p) {
    var inTemplate = p.openElements.tmplCount > 0,
        formElement = p.formElement;

    if (!inTemplate)
        p.formElement = null;

    if ((formElement || inTemplate) && p.openElements.hasInScope($.FORM)) {
        p.openElements.generateImpliedEndTags();

        if (inTemplate)
            p.openElements.popUntilTagNamePopped($.FORM);

        else
            p.openElements.remove(formElement);
    }
}

function pEndTagInBody(p) {
    if (!p.openElements.hasInButtonScope($.P))
        p._insertFakeElement($.P);

    p._closePElement();
}

function liEndTagInBody(p) {
    if (p.openElements.hasInListItemScope($.LI)) {
        p.openElements.generateImpliedEndTagsWithExclusion($.LI);
        p.openElements.popUntilTagNamePopped($.LI);
    }
}

function ddEndTagInBody(p, token) {
    var tn = token.tagName;

    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTagsWithExclusion(tn);
        p.openElements.popUntilTagNamePopped(tn);
    }
}

function numberedHeaderEndTagInBody(p) {
    if (p.openElements.hasNumberedHeaderInScope()) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilNumberedHeaderPopped();
    }
}

function appletEndTagInBody(p, token) {
    var tn = token.tagName;

    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(tn);
        p.activeFormattingElements.clearToLastMarker();
    }
}

function brEndTagInBody(p) {
    p._reconstructActiveFormattingElements();
    p._insertFakeElement($.BR);
    p.openElements.pop();
    p.framesetOk = false;
}

function genericEndTagInBody(p, token) {
    var tn = token.tagName;

    for (var i = p.openElements.stackTop; i > 0; i--) {
        var element = p.openElements.items[i];

        if (p.treeAdapter.getTagName(element) === tn) {
            p.openElements.generateImpliedEndTagsWithExclusion(tn);
            p.openElements.popUntilElementPopped(element);
            break;
        }

        if (p._isSpecialElement(element))
            break;
    }
}

//OPTIMIZATION: Integer comparisons are low-cost, so we can use very fast tag name length filters here.
//It's faster than using dictionary.
function endTagInBody(p, token) {
    var tn = token.tagName;

    switch (tn.length) {
        case 1:
            if (tn === $.A || tn === $.B || tn === $.I || tn === $.S || tn === $.U)
                callAdoptionAgency(p, token);

            else if (tn === $.P)
                pEndTagInBody(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        case 2:
            if (tn === $.DL || tn === $.UL || tn === $.OL)
                addressEndTagInBody(p, token);

            else if (tn === $.LI)
                liEndTagInBody(p, token);

            else if (tn === $.DD || tn === $.DT)
                ddEndTagInBody(p, token);

            else if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6)
                numberedHeaderEndTagInBody(p, token);

            else if (tn === $.BR)
                brEndTagInBody(p, token);

            else if (tn === $.EM || tn === $.TT)
                callAdoptionAgency(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        case 3:
            if (tn === $.BIG)
                callAdoptionAgency(p, token);

            else if (tn === $.DIR || tn === $.DIV || tn === $.NAV)
                addressEndTagInBody(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        case 4:
            if (tn === $.BODY)
                bodyEndTagInBody(p, token);

            else if (tn === $.HTML)
                htmlEndTagInBody(p, token);

            else if (tn === $.FORM)
                formEndTagInBody(p, token);

            else if (tn === $.CODE || tn === $.FONT || tn === $.NOBR)
                callAdoptionAgency(p, token);

            else if (tn === $.MAIN || tn === $.MENU)
                addressEndTagInBody(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        case 5:
            if (tn === $.ASIDE)
                addressEndTagInBody(p, token);

            else if (tn === $.SMALL)
                callAdoptionAgency(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        case 6:
            if (tn === $.CENTER || tn === $.FIGURE || tn === $.FOOTER || tn === $.HEADER || tn === $.HGROUP)
                addressEndTagInBody(p, token);

            else if (tn === $.APPLET || tn === $.OBJECT)
                appletEndTagInBody(p, token);

            else if (tn === $.STRIKE || tn === $.STRONG)
                callAdoptionAgency(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        case 7:
            if (tn === $.ADDRESS || tn === $.ARTICLE || tn === $.DETAILS || tn === $.SECTION || tn === $.SUMMARY)
                addressEndTagInBody(p, token);

            else if (tn === $.MARQUEE)
                appletEndTagInBody(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        case 8:
            if (tn === $.FIELDSET)
                addressEndTagInBody(p, token);

            else if (tn === $.TEMPLATE)
                endTagInHead(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        case 10:
            if (tn === $.BLOCKQUOTE || tn === $.FIGCAPTION)
                addressEndTagInBody(p, token);

            else
                genericEndTagInBody(p, token);

            break;

        default :
            genericEndTagInBody(p, token);
    }
}

function eofInBody(p, token) {
    if (p.tmplInsertionModeStackTop > -1)
        eofInTemplate(p, token);

    else
        p.stopped = true;
}

//12.2.5.4.8 The "text" insertion mode
//------------------------------------------------------------------
function endTagInText(p, token) {
    if (token.tagName === $.SCRIPT)
        p.pendingScript = p.openElements.current;

    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
}


function eofInText(p, token) {
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
    p._processToken(token);
}


//12.2.5.4.9 The "in table" insertion mode
//------------------------------------------------------------------
function characterInTable(p, token) {
    var curTn = p.openElements.currentTagName;

    if (curTn === $.TABLE || curTn === $.TBODY || curTn === $.TFOOT || curTn === $.THEAD || curTn === $.TR) {
        p.pendingCharacterTokens = [];
        p.hasNonWhitespacePendingCharacterToken = false;
        p.originalInsertionMode = p.insertionMode;
        p.insertionMode = IN_TABLE_TEXT_MODE;
        p._processToken(token);
    }

    else
        tokenInTable(p, token);
}

function captionStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p.activeFormattingElements.insertMarker();
    p._insertElement(token, NS.HTML);
    p.insertionMode = IN_CAPTION_MODE;
}

function colgroupStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertElement(token, NS.HTML);
    p.insertionMode = IN_COLUMN_GROUP_MODE;
}

function colStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertFakeElement($.COLGROUP);
    p.insertionMode = IN_COLUMN_GROUP_MODE;
    p._processToken(token);
}

function tbodyStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertElement(token, NS.HTML);
    p.insertionMode = IN_TABLE_BODY_MODE;
}

function tdStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertFakeElement($.TBODY);
    p.insertionMode = IN_TABLE_BODY_MODE;
    p._processToken(token);
}

function tableStartTagInTable(p, token) {
    if (p.openElements.hasInTableScope($.TABLE)) {
        p.openElements.popUntilTagNamePopped($.TABLE);
        p._resetInsertionMode();
        p._processToken(token);
    }
}

function inputStartTagInTable(p, token) {
    var inputType = Tokenizer.getTokenAttr(token, ATTRS.TYPE);

    if (inputType && inputType.toLowerCase() === HIDDEN_INPUT_TYPE)
        p._appendElement(token, NS.HTML);

    else
        tokenInTable(p, token);
}

function formStartTagInTable(p, token) {
    if (!p.formElement && p.openElements.tmplCount === 0) {
        p._insertElement(token, NS.HTML);
        p.formElement = p.openElements.current;
        p.openElements.pop();
    }
}

function startTagInTable(p, token) {
    var tn = token.tagName;

    switch (tn.length) {
        case 2:
            if (tn === $.TD || tn === $.TH || tn === $.TR)
                tdStartTagInTable(p, token);

            else
                tokenInTable(p, token);

            break;

        case 3:
            if (tn === $.COL)
                colStartTagInTable(p, token);

            else
                tokenInTable(p, token);

            break;

        case 4:
            if (tn === $.FORM)
                formStartTagInTable(p, token);

            else
                tokenInTable(p, token);

            break;

        case 5:
            if (tn === $.TABLE)
                tableStartTagInTable(p, token);

            else if (tn === $.STYLE)
                startTagInHead(p, token);

            else if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD)
                tbodyStartTagInTable(p, token);

            else if (tn === $.INPUT)
                inputStartTagInTable(p, token);

            else
                tokenInTable(p, token);

            break;

        case 6:
            if (tn === $.SCRIPT)
                startTagInHead(p, token);

            else
                tokenInTable(p, token);

            break;

        case 7:
            if (tn === $.CAPTION)
                captionStartTagInTable(p, token);

            else
                tokenInTable(p, token);

            break;

        case 8:
            if (tn === $.COLGROUP)
                colgroupStartTagInTable(p, token);

            else if (tn === $.TEMPLATE)
                startTagInHead(p, token);

            else
                tokenInTable(p, token);

            break;

        default:
            tokenInTable(p, token);
    }

}

function endTagInTable(p, token) {
    var tn = token.tagName;

    if (tn === $.TABLE) {
        if (p.openElements.hasInTableScope($.TABLE)) {
            p.openElements.popUntilTagNamePopped($.TABLE);
            p._resetInsertionMode();
        }
    }

    else if (tn === $.TEMPLATE)
        endTagInHead(p, token);

    else if (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP && tn !== $.HTML &&
             tn !== $.TBODY && tn !== $.TD && tn !== $.TFOOT && tn !== $.TH && tn !== $.THEAD && tn !== $.TR)
        tokenInTable(p, token);
}

function tokenInTable(p, token) {
    var savedFosterParentingState = p.fosterParentingEnabled;

    p.fosterParentingEnabled = true;
    p._processTokenInBodyMode(token);
    p.fosterParentingEnabled = savedFosterParentingState;
}


//12.2.5.4.10 The "in table text" insertion mode
//------------------------------------------------------------------
function whitespaceCharacterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
}

function characterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
    p.hasNonWhitespacePendingCharacterToken = true;
}

function tokenInTableText(p, token) {
    var i = 0;

    if (p.hasNonWhitespacePendingCharacterToken) {
        for (; i < p.pendingCharacterTokens.length; i++)
            tokenInTable(p, p.pendingCharacterTokens[i]);
    }

    else {
        for (; i < p.pendingCharacterTokens.length; i++)
            p._insertCharacters(p.pendingCharacterTokens[i]);
    }

    p.insertionMode = p.originalInsertionMode;
    p._processToken(token);
}


//12.2.5.4.11 The "in caption" insertion mode
//------------------------------------------------------------------
function startTagInCaption(p, token) {
    var tn = token.tagName;

    if (tn === $.CAPTION || tn === $.COL || tn === $.COLGROUP || tn === $.TBODY ||
        tn === $.TD || tn === $.TFOOT || tn === $.TH || tn === $.THEAD || tn === $.TR) {
        if (p.openElements.hasInTableScope($.CAPTION)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped($.CAPTION);
            p.activeFormattingElements.clearToLastMarker();
            p.insertionMode = IN_TABLE_MODE;
            p._processToken(token);
        }
    }

    else
        startTagInBody(p, token);
}

function endTagInCaption(p, token) {
    var tn = token.tagName;

    if (tn === $.CAPTION || tn === $.TABLE) {
        if (p.openElements.hasInTableScope($.CAPTION)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped($.CAPTION);
            p.activeFormattingElements.clearToLastMarker();
            p.insertionMode = IN_TABLE_MODE;

            if (tn === $.TABLE)
                p._processToken(token);
        }
    }

    else if (tn !== $.BODY && tn !== $.COL && tn !== $.COLGROUP && tn !== $.HTML && tn !== $.TBODY &&
             tn !== $.TD && tn !== $.TFOOT && tn !== $.TH && tn !== $.THEAD && tn !== $.TR)
        endTagInBody(p, token);
}


//12.2.5.4.12 The "in column group" insertion mode
//------------------------------------------------------------------
function startTagInColumnGroup(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML)
        startTagInBody(p, token);

    else if (tn === $.COL)
        p._appendElement(token, NS.HTML);

    else if (tn === $.TEMPLATE)
        startTagInHead(p, token);

    else
        tokenInColumnGroup(p, token);
}

function endTagInColumnGroup(p, token) {
    var tn = token.tagName;

    if (tn === $.COLGROUP) {
        if (p.openElements.currentTagName === $.COLGROUP) {
            p.openElements.pop();
            p.insertionMode = IN_TABLE_MODE;
        }
    }

    else if (tn === $.TEMPLATE)
        endTagInHead(p, token);

    else if (tn !== $.COL)
        tokenInColumnGroup(p, token);
}

function tokenInColumnGroup(p, token) {
    if (p.openElements.currentTagName === $.COLGROUP) {
        p.openElements.pop();
        p.insertionMode = IN_TABLE_MODE;
        p._processToken(token);
    }
}

//12.2.5.4.13 The "in table body" insertion mode
//------------------------------------------------------------------
function startTagInTableBody(p, token) {
    var tn = token.tagName;

    if (tn === $.TR) {
        p.openElements.clearBackToTableBodyContext();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_ROW_MODE;
    }

    else if (tn === $.TH || tn === $.TD) {
        p.openElements.clearBackToTableBodyContext();
        p._insertFakeElement($.TR);
        p.insertionMode = IN_ROW_MODE;
        p._processToken(token);
    }

    else if (tn === $.CAPTION || tn === $.COL || tn === $.COLGROUP ||
             tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {

        if (p.openElements.hasTableBodyContextInTableScope()) {
            p.openElements.clearBackToTableBodyContext();
            p.openElements.pop();
            p.insertionMode = IN_TABLE_MODE;
            p._processToken(token);
        }
    }

    else
        startTagInTable(p, token);
}

function endTagInTableBody(p, token) {
    var tn = token.tagName;

    if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {
        if (p.openElements.hasInTableScope(tn)) {
            p.openElements.clearBackToTableBodyContext();
            p.openElements.pop();
            p.insertionMode = IN_TABLE_MODE;
        }
    }

    else if (tn === $.TABLE) {
        if (p.openElements.hasTableBodyContextInTableScope()) {
            p.openElements.clearBackToTableBodyContext();
            p.openElements.pop();
            p.insertionMode = IN_TABLE_MODE;
            p._processToken(token);
        }
    }

    else if (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP ||
             tn !== $.HTML && tn !== $.TD && tn !== $.TH && tn !== $.TR)
        endTagInTable(p, token);
}

//12.2.5.4.14 The "in row" insertion mode
//------------------------------------------------------------------
function startTagInRow(p, token) {
    var tn = token.tagName;

    if (tn === $.TH || tn === $.TD) {
        p.openElements.clearBackToTableRowContext();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_CELL_MODE;
        p.activeFormattingElements.insertMarker();
    }

    else if (tn === $.CAPTION || tn === $.COL || tn === $.COLGROUP || tn === $.TBODY ||
             tn === $.TFOOT || tn === $.THEAD || tn === $.TR) {
        if (p.openElements.hasInTableScope($.TR)) {
            p.openElements.clearBackToTableRowContext();
            p.openElements.pop();
            p.insertionMode = IN_TABLE_BODY_MODE;
            p._processToken(token);
        }
    }

    else
        startTagInTable(p, token);
}

function endTagInRow(p, token) {
    var tn = token.tagName;

    if (tn === $.TR) {
        if (p.openElements.hasInTableScope($.TR)) {
            p.openElements.clearBackToTableRowContext();
            p.openElements.pop();
            p.insertionMode = IN_TABLE_BODY_MODE;
        }
    }

    else if (tn === $.TABLE) {
        if (p.openElements.hasInTableScope($.TR)) {
            p.openElements.clearBackToTableRowContext();
            p.openElements.pop();
            p.insertionMode = IN_TABLE_BODY_MODE;
            p._processToken(token);
        }
    }

    else if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {
        if (p.openElements.hasInTableScope(tn) || p.openElements.hasInTableScope($.TR)) {
            p.openElements.clearBackToTableRowContext();
            p.openElements.pop();
            p.insertionMode = IN_TABLE_BODY_MODE;
            p._processToken(token);
        }
    }

    else if (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP ||
             tn !== $.HTML && tn !== $.TD && tn !== $.TH)
        endTagInTable(p, token);
}


//12.2.5.4.15 The "in cell" insertion mode
//------------------------------------------------------------------
function startTagInCell(p, token) {
    var tn = token.tagName;

    if (tn === $.CAPTION || tn === $.COL || tn === $.COLGROUP || tn === $.TBODY ||
        tn === $.TD || tn === $.TFOOT || tn === $.TH || tn === $.THEAD || tn === $.TR) {

        if (p.openElements.hasInTableScope($.TD) || p.openElements.hasInTableScope($.TH)) {
            p._closeTableCell();
            p._processToken(token);
        }
    }

    else
        startTagInBody(p, token);
}

function endTagInCell(p, token) {
    var tn = token.tagName;

    if (tn === $.TD || tn === $.TH) {
        if (p.openElements.hasInTableScope(tn)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped(tn);
            p.activeFormattingElements.clearToLastMarker();
            p.insertionMode = IN_ROW_MODE;
        }
    }

    else if (tn === $.TABLE || tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD || tn === $.TR) {
        if (p.openElements.hasInTableScope(tn)) {
            p._closeTableCell();
            p._processToken(token);
        }
    }

    else if (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP && tn !== $.HTML)
        endTagInBody(p, token);
}

//12.2.5.4.16 The "in select" insertion mode
//------------------------------------------------------------------
function startTagInSelect(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML)
        startTagInBody(p, token);

    else if (tn === $.OPTION) {
        if (p.openElements.currentTagName === $.OPTION)
            p.openElements.pop();

        p._insertElement(token, NS.HTML);
    }

    else if (tn === $.OPTGROUP) {
        if (p.openElements.currentTagName === $.OPTION)
            p.openElements.pop();

        if (p.openElements.currentTagName === $.OPTGROUP)
            p.openElements.pop();

        p._insertElement(token, NS.HTML);
    }

    else if (tn === $.INPUT || tn === $.KEYGEN || tn === $.TEXTAREA || tn === $.SELECT) {
        if (p.openElements.hasInSelectScope($.SELECT)) {
            p.openElements.popUntilTagNamePopped($.SELECT);
            p._resetInsertionMode();

            if (tn !== $.SELECT)
                p._processToken(token);
        }
    }

    else if (tn === $.SCRIPT || tn === $.TEMPLATE)
        startTagInHead(p, token);
}

function endTagInSelect(p, token) {
    var tn = token.tagName;

    if (tn === $.OPTGROUP) {
        var prevOpenElement = p.openElements.items[p.openElements.stackTop - 1],
            prevOpenElementTn = prevOpenElement && p.treeAdapter.getTagName(prevOpenElement);

        if (p.openElements.currentTagName === $.OPTION && prevOpenElementTn === $.OPTGROUP)
            p.openElements.pop();

        if (p.openElements.currentTagName === $.OPTGROUP)
            p.openElements.pop();
    }

    else if (tn === $.OPTION) {
        if (p.openElements.currentTagName === $.OPTION)
            p.openElements.pop();
    }

    else if (tn === $.SELECT && p.openElements.hasInSelectScope($.SELECT)) {
        p.openElements.popUntilTagNamePopped($.SELECT);
        p._resetInsertionMode();
    }

    else if (tn === $.TEMPLATE)
        endTagInHead(p, token);
}

//12.2.5.4.17 The "in select in table" insertion mode
//------------------------------------------------------------------
function startTagInSelectInTable(p, token) {
    var tn = token.tagName;

    if (tn === $.CAPTION || tn === $.TABLE || tn === $.TBODY || tn === $.TFOOT ||
        tn === $.THEAD || tn === $.TR || tn === $.TD || tn === $.TH) {
        p.openElements.popUntilTagNamePopped($.SELECT);
        p._resetInsertionMode();
        p._processToken(token);
    }

    else
        startTagInSelect(p, token);
}

function endTagInSelectInTable(p, token) {
    var tn = token.tagName;

    if (tn === $.CAPTION || tn === $.TABLE || tn === $.TBODY || tn === $.TFOOT ||
        tn === $.THEAD || tn === $.TR || tn === $.TD || tn === $.TH) {
        if (p.openElements.hasInTableScope(tn)) {
            p.openElements.popUntilTagNamePopped($.SELECT);
            p._resetInsertionMode();
            p._processToken(token);
        }
    }

    else
        endTagInSelect(p, token);
}

//12.2.5.4.18 The "in template" insertion mode
//------------------------------------------------------------------
function startTagInTemplate(p, token) {
    var tn = token.tagName;

    if (tn === $.BASE || tn === $.BASEFONT || tn === $.BGSOUND || tn === $.LINK || tn === $.META ||
        tn === $.NOFRAMES || tn === $.SCRIPT || tn === $.STYLE || tn === $.TEMPLATE || tn === $.TITLE)
        startTagInHead(p, token);

    else {
        var newInsertionMode = TEMPLATE_INSERTION_MODE_SWITCH_MAP[tn] || IN_BODY_MODE;

        p._popTmplInsertionMode();
        p._pushTmplInsertionMode(newInsertionMode);
        p.insertionMode = newInsertionMode;
        p._processToken(token);
    }
}

function endTagInTemplate(p, token) {
    if (token.tagName === $.TEMPLATE)
        endTagInHead(p, token);
}

function eofInTemplate(p, token) {
    if (p.openElements.tmplCount > 0) {
        p.openElements.popUntilTagNamePopped($.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p._popTmplInsertionMode();
        p._resetInsertionMode();
        p._processToken(token);
    }

    else
        p.stopped = true;
}


//12.2.5.4.19 The "after body" insertion mode
//------------------------------------------------------------------
function startTagAfterBody(p, token) {
    if (token.tagName === $.HTML)
        startTagInBody(p, token);

    else
        tokenAfterBody(p, token);
}

function endTagAfterBody(p, token) {
    if (token.tagName === $.HTML) {
        if (!p.fragmentContext)
            p.insertionMode = AFTER_AFTER_BODY_MODE;
    }

    else
        tokenAfterBody(p, token);
}

function tokenAfterBody(p, token) {
    p.insertionMode = IN_BODY_MODE;
    p._processToken(token);
}

//12.2.5.4.20 The "in frameset" insertion mode
//------------------------------------------------------------------
function startTagInFrameset(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML)
        startTagInBody(p, token);

    else if (tn === $.FRAMESET)
        p._insertElement(token, NS.HTML);

    else if (tn === $.FRAME)
        p._appendElement(token, NS.HTML);

    else if (tn === $.NOFRAMES)
        startTagInHead(p, token);
}

function endTagInFrameset(p, token) {
    if (token.tagName === $.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
        p.openElements.pop();

        if (!p.fragmentContext && p.openElements.currentTagName !== $.FRAMESET)
            p.insertionMode = AFTER_FRAMESET_MODE;
    }
}

//12.2.5.4.21 The "after frameset" insertion mode
//------------------------------------------------------------------
function startTagAfterFrameset(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML)
        startTagInBody(p, token);

    else if (tn === $.NOFRAMES)
        startTagInHead(p, token);
}

function endTagAfterFrameset(p, token) {
    if (token.tagName === $.HTML)
        p.insertionMode = AFTER_AFTER_FRAMESET_MODE;
}

//12.2.5.4.22 The "after after body" insertion mode
//------------------------------------------------------------------
function startTagAfterAfterBody(p, token) {
    if (token.tagName === $.HTML)
        startTagInBody(p, token);

    else
        tokenAfterAfterBody(p, token);
}

function tokenAfterAfterBody(p, token) {
    p.insertionMode = IN_BODY_MODE;
    p._processToken(token);
}

//12.2.5.4.23 The "after after frameset" insertion mode
//------------------------------------------------------------------
function startTagAfterAfterFrameset(p, token) {
    var tn = token.tagName;

    if (tn === $.HTML)
        startTagInBody(p, token);

    else if (tn === $.NOFRAMES)
        startTagInHead(p, token);
}


//12.2.5.5 The rules for parsing tokens in foreign content
//------------------------------------------------------------------
function nullCharacterInForeignContent(p, token) {
    token.chars = UNICODE.REPLACEMENT_CHARACTER;
    p._insertCharacters(token);
}

function characterInForeignContent(p, token) {
    p._insertCharacters(token);
    p.framesetOk = false;
}

function startTagInForeignContent(p, token) {
    if (foreignContent.causesExit(token) && !p.fragmentContext) {
        while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML && !p._isIntegrationPoint(p.openElements.current))
            p.openElements.pop();

        p._processToken(token);
    }

    else {
        var current = p._getAdjustedCurrentElement(),
            currentNs = p.treeAdapter.getNamespaceURI(current);

        if (currentNs === NS.MATHML)
            foreignContent.adjustTokenMathMLAttrs(token);

        else if (currentNs === NS.SVG) {
            foreignContent.adjustTokenSVGTagName(token);
            foreignContent.adjustTokenSVGAttrs(token);
        }

        foreignContent.adjustTokenXMLAttrs(token);

        if (token.selfClosing)
            p._appendElement(token, currentNs);
        else
            p._insertElement(token, currentNs);
    }
}

function endTagInForeignContent(p, token) {
    for (var i = p.openElements.stackTop; i > 0; i--) {
        var element = p.openElements.items[i];

        if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
            p._processToken(token);
            break;
        }

        if (p.treeAdapter.getTagName(element).toLowerCase() === token.tagName) {
            p.openElements.popUntilElementPopped(element);
            break;
        }
    }
}

},{"../common/doctype":12,"../common/foreign_content":13,"../common/html":14,"../common/unicode":15,"../extensions/location_info/parser_mixin":17,"../tokenizer":31,"../tree_adapters/default":34,"../utils/merge_options":36,"./formatting_element_list":21,"./open_element_stack":23}],23:[function(require,module,exports){
'use strict';

var HTML = require('../common/html');

//Aliases
var $ = HTML.TAG_NAMES,
    NS = HTML.NAMESPACES;

//Element utils

//OPTIMIZATION: Integer comparisons are low-cost, so we can use very fast tag name length filters here.
//It's faster than using dictionary.
function isImpliedEndTagRequired(tn) {
    switch (tn.length) {
        case 1:
            return tn === $.P;

        case 2:
            return tn === $.RB || tn === $.RP || tn === $.RT || tn === $.DD || tn === $.DT || tn === $.LI;

        case 3:
            return tn === $.RTC;

        case 6:
            return tn === $.OPTION;

        case 8:
            return tn === $.OPTGROUP || tn === $.MENUITEM;
    }

    return false;
}

function isScopingElement(tn, ns) {
    switch (tn.length) {
        case 2:
            if (tn === $.TD || tn === $.TH)
                return ns === NS.HTML;

            else if (tn === $.MI || tn === $.MO || tn === $.MN || tn === $.MS)
                return ns === NS.MATHML;

            break;

        case 4:
            if (tn === $.HTML)
                return ns === NS.HTML;

            else if (tn === $.DESC)
                return ns === NS.SVG;

            break;

        case 5:
            if (tn === $.TABLE)
                return ns === NS.HTML;

            else if (tn === $.MTEXT)
                return ns === NS.MATHML;

            else if (tn === $.TITLE)
                return ns === NS.SVG;

            break;

        case 6:
            return (tn === $.APPLET || tn === $.OBJECT) && ns === NS.HTML;

        case 7:
            return (tn === $.CAPTION || tn === $.MARQUEE) && ns === NS.HTML;

        case 8:
            return tn === $.TEMPLATE && ns === NS.HTML;

        case 13:
            return tn === $.FOREIGN_OBJECT && ns === NS.SVG;

        case 14:
            return tn === $.ANNOTATION_XML && ns === NS.MATHML;
    }

    return false;
}

//Stack of open elements
var OpenElementStack = module.exports = function (document, treeAdapter) {
    this.stackTop = -1;
    this.items = [];
    this.current = document;
    this.currentTagName = null;
    this.currentTmplContent = null;
    this.tmplCount = 0;
    this.treeAdapter = treeAdapter;
};

//Index of element
OpenElementStack.prototype._indexOf = function (element) {
    var idx = -1;

    for (var i = this.stackTop; i >= 0; i--) {
        if (this.items[i] === element) {
            idx = i;
            break;
        }
    }
    return idx;
};

//Update current element
OpenElementStack.prototype._isInTemplate = function () {
    return this.currentTagName === $.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === NS.HTML;
};

OpenElementStack.prototype._updateCurrentElement = function () {
    this.current = this.items[this.stackTop];
    this.currentTagName = this.current && this.treeAdapter.getTagName(this.current);

    this.currentTmplContent = this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : null;
};

//Mutations
OpenElementStack.prototype.push = function (element) {
    this.items[++this.stackTop] = element;
    this._updateCurrentElement();

    if (this._isInTemplate())
        this.tmplCount++;

};

OpenElementStack.prototype.pop = function () {
    this.stackTop--;

    if (this.tmplCount > 0 && this._isInTemplate())
        this.tmplCount--;

    this._updateCurrentElement();
};

OpenElementStack.prototype.replace = function (oldElement, newElement) {
    var idx = this._indexOf(oldElement);

    this.items[idx] = newElement;

    if (idx === this.stackTop)
        this._updateCurrentElement();
};

OpenElementStack.prototype.insertAfter = function (referenceElement, newElement) {
    var insertionIdx = this._indexOf(referenceElement) + 1;

    this.items.splice(insertionIdx, 0, newElement);

    if (insertionIdx === ++this.stackTop)
        this._updateCurrentElement();
};

OpenElementStack.prototype.popUntilTagNamePopped = function (tagName) {
    while (this.stackTop > -1) {
        var tn = this.currentTagName,
            ns = this.treeAdapter.getNamespaceURI(this.current);

        this.pop();

        if (tn === tagName && ns === NS.HTML)
            break;
    }
};

OpenElementStack.prototype.popUntilElementPopped = function (element) {
    while (this.stackTop > -1) {
        var poppedElement = this.current;

        this.pop();

        if (poppedElement === element)
            break;
    }
};

OpenElementStack.prototype.popUntilNumberedHeaderPopped = function () {
    while (this.stackTop > -1) {
        var tn = this.currentTagName,
            ns = this.treeAdapter.getNamespaceURI(this.current);

        this.pop();

        if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6 && ns === NS.HTML)
            break;
    }
};

OpenElementStack.prototype.popUntilTableCellPopped = function () {
    while (this.stackTop > -1) {
        var tn = this.currentTagName,
            ns = this.treeAdapter.getNamespaceURI(this.current);

        this.pop();

        if (tn === $.TD || tn === $.TH && ns === NS.HTML)
            break;
    }
};

OpenElementStack.prototype.popAllUpToHtmlElement = function () {
    //NOTE: here we assume that root <html> element is always first in the open element stack, so
    //we perform this fast stack clean up.
    this.stackTop = 0;
    this._updateCurrentElement();
};

OpenElementStack.prototype.clearBackToTableContext = function () {
    while (this.currentTagName !== $.TABLE &&
           this.currentTagName !== $.TEMPLATE &&
           this.currentTagName !== $.HTML ||
           this.treeAdapter.getNamespaceURI(this.current) !== NS.HTML)
        this.pop();
};

OpenElementStack.prototype.clearBackToTableBodyContext = function () {
    while (this.currentTagName !== $.TBODY &&
           this.currentTagName !== $.TFOOT &&
           this.currentTagName !== $.THEAD &&
           this.currentTagName !== $.TEMPLATE &&
           this.currentTagName !== $.HTML ||
           this.treeAdapter.getNamespaceURI(this.current) !== NS.HTML)
        this.pop();
};

OpenElementStack.prototype.clearBackToTableRowContext = function () {
    while (this.currentTagName !== $.TR &&
           this.currentTagName !== $.TEMPLATE &&
           this.currentTagName !== $.HTML ||
           this.treeAdapter.getNamespaceURI(this.current) !== NS.HTML)
        this.pop();
};

OpenElementStack.prototype.remove = function (element) {
    for (var i = this.stackTop; i >= 0; i--) {
        if (this.items[i] === element) {
            this.items.splice(i, 1);
            this.stackTop--;
            this._updateCurrentElement();
            break;
        }
    }
};

//Search
OpenElementStack.prototype.tryPeekProperlyNestedBodyElement = function () {
    //Properly nested <body> element (should be second element in stack).
    var element = this.items[1];

    return element && this.treeAdapter.getTagName(element) === $.BODY ? element : null;
};

OpenElementStack.prototype.contains = function (element) {
    return this._indexOf(element) > -1;
};

OpenElementStack.prototype.getCommonAncestor = function (element) {
    var elementIdx = this._indexOf(element);

    return --elementIdx >= 0 ? this.items[elementIdx] : null;
};

OpenElementStack.prototype.isRootHtmlElementCurrent = function () {
    return this.stackTop === 0 && this.currentTagName === $.HTML;
};

//Element in scope
OpenElementStack.prototype.hasInScope = function (tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
        var tn = this.treeAdapter.getTagName(this.items[i]),
            ns = this.treeAdapter.getNamespaceURI(this.items[i]);

        if (tn === tagName && ns === NS.HTML)
            return true;

        if (isScopingElement(tn, ns))
            return false;
    }

    return true;
};

OpenElementStack.prototype.hasNumberedHeaderInScope = function () {
    for (var i = this.stackTop; i >= 0; i--) {
        var tn = this.treeAdapter.getTagName(this.items[i]),
            ns = this.treeAdapter.getNamespaceURI(this.items[i]);

        if ((tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6) && ns === NS.HTML)
            return true;

        if (isScopingElement(tn, ns))
            return false;
    }

    return true;
};

OpenElementStack.prototype.hasInListItemScope = function (tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
        var tn = this.treeAdapter.getTagName(this.items[i]),
            ns = this.treeAdapter.getNamespaceURI(this.items[i]);

        if (tn === tagName && ns === NS.HTML)
            return true;

        if ((tn === $.UL || tn === $.OL) && ns === NS.HTML || isScopingElement(tn, ns))
            return false;
    }

    return true;
};

OpenElementStack.prototype.hasInButtonScope = function (tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
        var tn = this.treeAdapter.getTagName(this.items[i]),
            ns = this.treeAdapter.getNamespaceURI(this.items[i]);

        if (tn === tagName && ns === NS.HTML)
            return true;

        if (tn === $.BUTTON && ns === NS.HTML || isScopingElement(tn, ns))
            return false;
    }

    return true;
};

OpenElementStack.prototype.hasInTableScope = function (tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
        var tn = this.treeAdapter.getTagName(this.items[i]),
            ns = this.treeAdapter.getNamespaceURI(this.items[i]);

        if (ns !== NS.HTML)
            continue;

        if (tn === tagName)
            return true;

        if (tn === $.TABLE || tn === $.TEMPLATE || tn === $.HTML)
            return false;
    }

    return true;
};

OpenElementStack.prototype.hasTableBodyContextInTableScope = function () {
    for (var i = this.stackTop; i >= 0; i--) {
        var tn = this.treeAdapter.getTagName(this.items[i]),
            ns = this.treeAdapter.getNamespaceURI(this.items[i]);

        if (ns !== NS.HTML)
            continue;

        if (tn === $.TBODY || tn === $.THEAD || tn === $.TFOOT)
            return true;

        if (tn === $.TABLE || tn === $.HTML)
            return false;
    }

    return true;
};

OpenElementStack.prototype.hasInSelectScope = function (tagName) {
    for (var i = this.stackTop; i >= 0; i--) {
        var tn = this.treeAdapter.getTagName(this.items[i]),
            ns = this.treeAdapter.getNamespaceURI(this.items[i]);

        if (ns !== NS.HTML)
            continue;

        if (tn === tagName)
            return true;

        if (tn !== $.OPTION && tn !== $.OPTGROUP)
            return false;
    }

    return true;
};

//Implied end tags
OpenElementStack.prototype.generateImpliedEndTags = function () {
    while (isImpliedEndTagRequired(this.currentTagName))
        this.pop();
};

OpenElementStack.prototype.generateImpliedEndTagsWithExclusion = function (exclusionTagName) {
    while (isImpliedEndTagRequired(this.currentTagName) && this.currentTagName !== exclusionTagName)
        this.pop();
};

},{"../common/html":14}],24:[function(require,module,exports){
'use strict';

var WritableStream = require('stream').Writable,
    inherits = require('util').inherits,
    Parser = require('./index');

var ParserStream = module.exports = function (options) {
    WritableStream.call(this);

    this.parser = new Parser(options);

    this.lastChunkWritten = false;
    this.writeCallback = null;
    this.pausedByScript = false;

    this.document = this.parser.treeAdapter.createDocument();

    this.pendingHtmlInsertions = [];

    this._resume = this._resume.bind(this);
    this._documentWrite = this._documentWrite.bind(this);
    this._scriptHandler = this._scriptHandler.bind(this);

    this.parser._bootstrap(this.document, null);
};

inherits(ParserStream, WritableStream);

//WritableStream implementation
ParserStream.prototype._write = function (chunk, encoding, callback) {
    this.writeCallback = callback;
    this.parser.tokenizer.write(chunk.toString('utf8'), this.lastChunkWritten);
    this._runParsingLoop();
};

ParserStream.prototype.end = function (chunk, encoding, callback) {
    this.lastChunkWritten = true;
    WritableStream.prototype.end.call(this, chunk || '', encoding, callback);
};

//Scriptable parser implementation
ParserStream.prototype._runParsingLoop = function () {
    this.parser.runParsingLoopForCurrentChunk(this.writeCallback, this._scriptHandler);
};

ParserStream.prototype._resume = function () {
    if (!this.pausedByScript)
        throw new Error('Parser was already resumed');

    while (this.pendingHtmlInsertions.length) {
        var html = this.pendingHtmlInsertions.pop();

        this.parser.tokenizer.insertHtmlAtCurrentPos(html);
    }

    this.pausedByScript = false;

    //NOTE: keep parsing if we don't wait for the next input chunk
    if (this.parser.tokenizer.active)
        this._runParsingLoop();
};

ParserStream.prototype._documentWrite = function (html) {
    if (!this.parser.stopped)
        this.pendingHtmlInsertions.push(html);
};

ParserStream.prototype._scriptHandler = function (scriptElement) {
    if (this.listeners('script').length) {
        this.pausedByScript = true;
        this.emit('script', scriptElement, this._documentWrite, this._resume);
    }
    else
        this._runParsingLoop();
};


},{"./index":22,"stream":56,"util":60}],25:[function(require,module,exports){
'use strict';

var ParserStream = require('./parser_stream'),
    inherits = require('util').inherits,
    $ = require('../common/html').TAG_NAMES;

var PlainTextConversionStream = module.exports = function (options) {
    ParserStream.call(this, options);

    // NOTE: see https://html.spec.whatwg.org/#read-text
    this.parser._insertFakeElement($.HTML);
    this.parser._insertFakeElement($.HEAD);
    this.parser.openElements.pop();
    this.parser._insertFakeElement($.BODY);
    this.parser._insertFakeElement($.PRE);
    this.parser.treeAdapter.insertText(this.parser.openElements.current, '\n');
    this.parser.switchToPlaintextParsing();
};

inherits(PlainTextConversionStream, ParserStream);

},{"../common/html":14,"./parser_stream":24,"util":60}],26:[function(require,module,exports){
'use strict';

var WritableStream = require('stream').Writable,
    util = require('util');

var DevNullStream = module.exports = function () {
    WritableStream.call(this);
};

util.inherits(DevNullStream, WritableStream);

DevNullStream.prototype._write = function (chunk, encoding, cb) {
    cb();
};

},{"stream":56,"util":60}],27:[function(require,module,exports){
'use strict';

var TransformStream = require('stream').Transform,
    DevNullStream = require('./dev_null_stream'),
    inherits = require('util').inherits,
    Tokenizer = require('../tokenizer'),
    LocationInfoTokenizerMixin = require('../extensions/location_info/tokenizer_mixin'),
    ParserFeedbackSimulator = require('./parser_feedback_simulator'),
    mergeOptions = require('../utils/merge_options');

var DEFAULT_OPTIONS = {
    locationInfo: false
};

var SAXParser = module.exports = function (options) {
    TransformStream.call(this);

    this.options = mergeOptions(DEFAULT_OPTIONS, options);

    this.tokenizer = new Tokenizer(options);

    if (this.options.locationInfo)
        new LocationInfoTokenizerMixin(this.tokenizer);

    this.parserFeedbackSimulator = new ParserFeedbackSimulator(this.tokenizer);

    this.pendingText = null;
    this.currentTokenLocation = void 0;

    this.lastChunkWritten = false;
    this.stopped = false;

    // NOTE: always pipe stream to the /dev/null stream to avoid
    // `highWaterMark` hit even if we don't have consumers.
    // (see: https://github.com/inikulin/parse5/issues/97#issuecomment-171940774)
    this.pipe(new DevNullStream());
};

inherits(SAXParser, TransformStream);

//TransformStream implementation
SAXParser.prototype._transform = function (chunk, encoding, callback) {
    if (!this.stopped) {
        this.tokenizer.write(chunk.toString('utf8'), this.lastChunkWritten);
        this._runParsingLoop();
    }

    this.push(chunk);

    callback();
};

SAXParser.prototype._flush = function (callback) {
    callback();
};

SAXParser.prototype.end = function (chunk, encoding, callback) {
    this.lastChunkWritten = true;
    TransformStream.prototype.end.call(this, chunk, encoding, callback);
};

SAXParser.prototype.stop = function () {
    this.stopped = true;
};

//Internals
SAXParser.prototype._runParsingLoop = function () {
    do {
        var token = this.parserFeedbackSimulator.getNextToken();

        if (token.type === Tokenizer.HIBERNATION_TOKEN)
            break;

        if (token.type === Tokenizer.CHARACTER_TOKEN ||
            token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN ||
            token.type === Tokenizer.NULL_CHARACTER_TOKEN) {

            if (this.options.locationInfo) {
                if (this.pendingText === null)
                    this.currentTokenLocation = token.location;

                else
                    this.currentTokenLocation.endOffset = token.location.endOffset;
            }

            this.pendingText = (this.pendingText || '') + token.chars;
        }

        else {
            this._emitPendingText();
            this._handleToken(token);
        }
    } while (!this.stopped && token.type !== Tokenizer.EOF_TOKEN);
};

SAXParser.prototype._handleToken = function (token) {
    if (this.options.locationInfo)
        this.currentTokenLocation = token.location;

    if (token.type === Tokenizer.START_TAG_TOKEN)
        this.emit('startTag', token.tagName, token.attrs, token.selfClosing, this.currentTokenLocation);

    else if (token.type === Tokenizer.END_TAG_TOKEN)
        this.emit('endTag', token.tagName, this.currentTokenLocation);

    else if (token.type === Tokenizer.COMMENT_TOKEN)
        this.emit('comment', token.data, this.currentTokenLocation);

    else if (token.type === Tokenizer.DOCTYPE_TOKEN)
        this.emit('doctype', token.name, token.publicId, token.systemId, this.currentTokenLocation);
};

SAXParser.prototype._emitPendingText = function () {
    if (this.pendingText !== null) {
        this.emit('text', this.pendingText, this.currentTokenLocation);
        this.pendingText = null;
    }
};

},{"../extensions/location_info/tokenizer_mixin":18,"../tokenizer":31,"../utils/merge_options":36,"./dev_null_stream":26,"./parser_feedback_simulator":28,"stream":56,"util":60}],28:[function(require,module,exports){
'use strict';

var Tokenizer = require('../tokenizer'),
    foreignContent = require('../common/foreign_content'),
    UNICODE = require('../common/unicode'),
    HTML = require('../common/html');


//Aliases
var $ = HTML.TAG_NAMES,
    NS = HTML.NAMESPACES;


//ParserFeedbackSimulator
//Simulates adjustment of the Tokenizer which performed by standard parser during tree construction.
var ParserFeedbackSimulator = module.exports = function (tokenizer) {
    this.tokenizer = tokenizer;

    this.namespaceStack = [];
    this.namespaceStackTop = -1;
    this._enterNamespace(NS.HTML);
};

ParserFeedbackSimulator.prototype.getNextToken = function () {
    var token = this.tokenizer.getNextToken();

    if (token.type === Tokenizer.START_TAG_TOKEN)
        this._handleStartTagToken(token);

    else if (token.type === Tokenizer.END_TAG_TOKEN)
        this._handleEndTagToken(token);

    else if (token.type === Tokenizer.NULL_CHARACTER_TOKEN && this.inForeignContent) {
        token.type = Tokenizer.CHARACTER_TOKEN;
        token.chars = UNICODE.REPLACEMENT_CHARACTER;
    }

    else if (this.skipNextNewLine) {
        if (token.type !== Tokenizer.HIBERNATION_TOKEN)
            this.skipNextNewLine = false;

        if (token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN && token.chars[0] === '\n') {
            if (token.chars.length === 1)
                return this.getNextToken();

            token.chars = token.chars.substr(1);
        }
    }

    return token;
};

//Namespace stack mutations
ParserFeedbackSimulator.prototype._enterNamespace = function (namespace) {
    this.namespaceStackTop++;
    this.namespaceStack.push(namespace);

    this.inForeignContent = namespace !== NS.HTML;
    this.currentNamespace = namespace;
    this.tokenizer.allowCDATA = this.inForeignContent;
};

ParserFeedbackSimulator.prototype._leaveCurrentNamespace = function () {
    this.namespaceStackTop--;
    this.namespaceStack.pop();

    this.currentNamespace = this.namespaceStack[this.namespaceStackTop];
    this.inForeignContent = this.currentNamespace !== NS.HTML;
    this.tokenizer.allowCDATA = this.inForeignContent;
};

//Token handlers
ParserFeedbackSimulator.prototype._ensureTokenizerMode = function (tn) {
    if (tn === $.TEXTAREA || tn === $.TITLE)
        this.tokenizer.state = Tokenizer.MODE.RCDATA;

    else if (tn === $.PLAINTEXT)
        this.tokenizer.state = Tokenizer.MODE.PLAINTEXT;

    else if (tn === $.SCRIPT)
        this.tokenizer.state = Tokenizer.MODE.SCRIPT_DATA;

    else if (tn === $.STYLE || tn === $.IFRAME || tn === $.XMP ||
             tn === $.NOEMBED || tn === $.NOFRAMES || tn === $.NOSCRIPT)
        this.tokenizer.state = Tokenizer.MODE.RAWTEXT;
};

ParserFeedbackSimulator.prototype._handleStartTagToken = function (token) {
    var tn = token.tagName;

    if (tn === $.SVG)
        this._enterNamespace(NS.SVG);

    else if (tn === $.MATH)
        this._enterNamespace(NS.MATHML);

    if (this.inForeignContent) {
        if (foreignContent.causesExit(token)) {
            this._leaveCurrentNamespace();
            return;
        }

        var currentNs = this.currentNamespace;

        if (currentNs === NS.MATHML)
            foreignContent.adjustTokenMathMLAttrs(token);

        else if (currentNs === NS.SVG) {
            foreignContent.adjustTokenSVGTagName(token);
            foreignContent.adjustTokenSVGAttrs(token);
        }

        foreignContent.adjustTokenXMLAttrs(token);

        tn = token.tagName;

        if (!token.selfClosing && foreignContent.isIntegrationPoint(tn, currentNs, token.attrs))
            this._enterNamespace(NS.HTML);
    }

    else {
        if (tn === $.PRE || tn === $.TEXTAREA || tn === $.LISTING)
            this.skipNextNewLine = true;

        else if (tn === $.IMAGE)
            token.tagName = $.IMG;

        this._ensureTokenizerMode(tn);
    }
};

ParserFeedbackSimulator.prototype._handleEndTagToken = function (token) {
    var tn = token.tagName;

    if (!this.inForeignContent) {
        var previousNs = this.namespaceStack[this.namespaceStackTop - 1];

        if (previousNs === NS.SVG && foreignContent.SVG_TAG_NAMES_ADJUSTMENT_MAP[tn])
            tn = foreignContent.SVG_TAG_NAMES_ADJUSTMENT_MAP[tn];

        //NOTE: check for exit from integration point
        if (foreignContent.isIntegrationPoint(tn, previousNs, token.attrs))
            this._leaveCurrentNamespace();
    }

    else if (tn === $.SVG && this.currentNamespace === NS.SVG ||
             tn === $.MATH && this.currentNamespace === NS.MATHML)
        this._leaveCurrentNamespace();

    // NOTE: adjust end tag name as well for consistency
    if (this.currentNamespace === NS.SVG)
        foreignContent.adjustTokenSVGTagName(token);
};

},{"../common/foreign_content":13,"../common/html":14,"../common/unicode":15,"../tokenizer":31}],29:[function(require,module,exports){
'use strict';

var defaultTreeAdapter = require('../tree_adapters/default'),
    mergeOptions = require('../utils/merge_options'),
    doctype = require('../common/doctype'),
    HTML = require('../common/html');

//Aliases
var $ = HTML.TAG_NAMES,
    NS = HTML.NAMESPACES;

//Default serializer options
var DEFAULT_OPTIONS = {
    treeAdapter: defaultTreeAdapter
};

//Escaping regexes
var AMP_REGEX = /&/g,
    NBSP_REGEX = /\u00a0/g,
    DOUBLE_QUOTE_REGEX = /"/g,
    LT_REGEX = /</g,
    GT_REGEX = />/g;

//Serializer
var Serializer = module.exports = function (node, options) {
    this.options = mergeOptions(DEFAULT_OPTIONS, options);
    this.treeAdapter = this.options.treeAdapter;

    this.html = '';
    this.startNode = node;
};

// NOTE: exported as static method for the testing purposes
Serializer.escapeString = function (str, attrMode) {
    str = str
        .replace(AMP_REGEX, '&amp;')
        .replace(NBSP_REGEX, '&nbsp;');

    if (attrMode)
        str = str.replace(DOUBLE_QUOTE_REGEX, '&quot;');

    else {
        str = str
            .replace(LT_REGEX, '&lt;')
            .replace(GT_REGEX, '&gt;');
    }

    return str;
};


//API
Serializer.prototype.serialize = function () {
    this._serializeChildNodes(this.startNode);

    return this.html;
};


//Internals
Serializer.prototype._serializeChildNodes = function (parentNode) {
    var childNodes = this.treeAdapter.getChildNodes(parentNode);

    if (childNodes) {
        for (var i = 0, cnLength = childNodes.length; i < cnLength; i++) {
            var currentNode = childNodes[i];

            if (this.treeAdapter.isElementNode(currentNode))
                this._serializeElement(currentNode);

            else if (this.treeAdapter.isTextNode(currentNode))
                this._serializeTextNode(currentNode);

            else if (this.treeAdapter.isCommentNode(currentNode))
                this._serializeCommentNode(currentNode);

            else if (this.treeAdapter.isDocumentTypeNode(currentNode))
                this._serializeDocumentTypeNode(currentNode);
        }
    }
};

Serializer.prototype._serializeElement = function (node) {
    var tn = this.treeAdapter.getTagName(node),
        ns = this.treeAdapter.getNamespaceURI(node);

    this.html += '<' + tn;
    this._serializeAttributes(node);
    this.html += '>';

    if (tn !== $.AREA && tn !== $.BASE && tn !== $.BASEFONT && tn !== $.BGSOUND && tn !== $.BR && tn !== $.BR &&
        tn !== $.COL && tn !== $.EMBED && tn !== $.FRAME && tn !== $.HR && tn !== $.IMG && tn !== $.INPUT &&
        tn !== $.KEYGEN && tn !== $.LINK && tn !== $.MENUITEM && tn !== $.META && tn !== $.PARAM && tn !== $.SOURCE &&
        tn !== $.TRACK && tn !== $.WBR) {

        var childNodesHolder = tn === $.TEMPLATE && ns === NS.HTML ?
            this.treeAdapter.getTemplateContent(node) :
            node;

        this._serializeChildNodes(childNodesHolder);
        this.html += '</' + tn + '>';
    }
};

Serializer.prototype._serializeAttributes = function (node) {
    var attrs = this.treeAdapter.getAttrList(node);

    for (var i = 0, attrsLength = attrs.length; i < attrsLength; i++) {
        var attr = attrs[i],
            value = Serializer.escapeString(attr.value, true);

        this.html += ' ';

        if (!attr.namespace)
            this.html += attr.name;

        else if (attr.namespace === NS.XML)
            this.html += 'xml:' + attr.name;

        else if (attr.namespace === NS.XMLNS) {
            if (attr.name !== 'xmlns')
                this.html += 'xmlns:';

            this.html += attr.name;
        }

        else if (attr.namespace === NS.XLINK)
            this.html += 'xlink:' + attr.name;

        else
            this.html += attr.namespace + ':' + attr.name;

        this.html += '="' + value + '"';
    }
};

Serializer.prototype._serializeTextNode = function (node) {
    var content = this.treeAdapter.getTextNodeContent(node),
        parent = this.treeAdapter.getParentNode(node),
        parentTn = void 0;

    if (parent && this.treeAdapter.isElementNode(parent))
        parentTn = this.treeAdapter.getTagName(parent);

    if (parentTn === $.STYLE || parentTn === $.SCRIPT || parentTn === $.XMP || parentTn === $.IFRAME ||
        parentTn === $.NOEMBED || parentTn === $.NOFRAMES || parentTn === $.PLAINTEXT || parentTn === $.NOSCRIPT)

        this.html += content;

    else
        this.html += Serializer.escapeString(content, false);
};

Serializer.prototype._serializeCommentNode = function (node) {
    this.html += '<!--' + this.treeAdapter.getCommentNodeContent(node) + '-->';
};

Serializer.prototype._serializeDocumentTypeNode = function (node) {
    var name = this.treeAdapter.getDocumentTypeNodeName(node);

    this.html += '<' + doctype.serializeContent(name, null, null) + '>';
};

},{"../common/doctype":12,"../common/html":14,"../tree_adapters/default":34,"../utils/merge_options":36}],30:[function(require,module,exports){
'use strict';

var ReadableStream = require('stream').Readable,
    inherits = require('util').inherits,
    Serializer = require('./index');

var SerializerStream = module.exports = function (node, options) {
    ReadableStream.call(this);

    this.serializer = new Serializer(node, options);

    Object.defineProperty(this.serializer, 'html', {
        //NOTE: To make `+=` concat operator work properly we define
        //getter which always returns empty string
        get: function () {
            return '';
        },
        set: this.push.bind(this)
    });
};

inherits(SerializerStream, ReadableStream);

//Readable stream implementation
SerializerStream.prototype._read = function () {
    this.serializer.serialize();
    this.push(null);
};

},{"./index":29,"stream":56,"util":60}],31:[function(require,module,exports){
'use strict';

var Preprocessor = require('./preprocessor'),
    UNICODE = require('../common/unicode'),
    neTree = require('./named_entity_data');

//Aliases
var $ = UNICODE.CODE_POINTS,
    $$ = UNICODE.CODE_POINT_SEQUENCES;

//Replacement code points for numeric entities
var NUMERIC_ENTITY_REPLACEMENTS = {
    0x00: 0xFFFD, 0x0D: 0x000D, 0x80: 0x20AC, 0x81: 0x0081, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E,
    0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039,
    0x8C: 0x0152, 0x8D: 0x008D, 0x8E: 0x017D, 0x8F: 0x008F, 0x90: 0x0090, 0x91: 0x2018, 0x92: 0x2019,
    0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02DC, 0x99: 0x2122,
    0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153, 0x9D: 0x009D, 0x9E: 0x017E, 0x9F: 0x0178
};

// Named entity tree flags
var HAS_DATA_FLAG = 1 << 0;
var DATA_DUPLET_FLAG = 1 << 1;
var HAS_BRANCHES_FLAG = 1 << 2;
var MAX_BRANCH_MARKER_VALUE = HAS_DATA_FLAG | DATA_DUPLET_FLAG | HAS_BRANCHES_FLAG;


//States
var DATA_STATE = 'DATA_STATE',
    CHARACTER_REFERENCE_IN_DATA_STATE = 'CHARACTER_REFERENCE_IN_DATA_STATE',
    RCDATA_STATE = 'RCDATA_STATE',
    CHARACTER_REFERENCE_IN_RCDATA_STATE = 'CHARACTER_REFERENCE_IN_RCDATA_STATE',
    RAWTEXT_STATE = 'RAWTEXT_STATE',
    SCRIPT_DATA_STATE = 'SCRIPT_DATA_STATE',
    PLAINTEXT_STATE = 'PLAINTEXT_STATE',
    TAG_OPEN_STATE = 'TAG_OPEN_STATE',
    END_TAG_OPEN_STATE = 'END_TAG_OPEN_STATE',
    TAG_NAME_STATE = 'TAG_NAME_STATE',
    RCDATA_LESS_THAN_SIGN_STATE = 'RCDATA_LESS_THAN_SIGN_STATE',
    RCDATA_END_TAG_OPEN_STATE = 'RCDATA_END_TAG_OPEN_STATE',
    RCDATA_END_TAG_NAME_STATE = 'RCDATA_END_TAG_NAME_STATE',
    RAWTEXT_LESS_THAN_SIGN_STATE = 'RAWTEXT_LESS_THAN_SIGN_STATE',
    RAWTEXT_END_TAG_OPEN_STATE = 'RAWTEXT_END_TAG_OPEN_STATE',
    RAWTEXT_END_TAG_NAME_STATE = 'RAWTEXT_END_TAG_NAME_STATE',
    SCRIPT_DATA_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_LESS_THAN_SIGN_STATE',
    SCRIPT_DATA_END_TAG_OPEN_STATE = 'SCRIPT_DATA_END_TAG_OPEN_STATE',
    SCRIPT_DATA_END_TAG_NAME_STATE = 'SCRIPT_DATA_END_TAG_NAME_STATE',
    SCRIPT_DATA_ESCAPE_START_STATE = 'SCRIPT_DATA_ESCAPE_START_STATE',
    SCRIPT_DATA_ESCAPE_START_DASH_STATE = 'SCRIPT_DATA_ESCAPE_START_DASH_STATE',
    SCRIPT_DATA_ESCAPED_STATE = 'SCRIPT_DATA_ESCAPED_STATE',
    SCRIPT_DATA_ESCAPED_DASH_STATE = 'SCRIPT_DATA_ESCAPED_DASH_STATE',
    SCRIPT_DATA_ESCAPED_DASH_DASH_STATE = 'SCRIPT_DATA_ESCAPED_DASH_DASH_STATE',
    SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE',
    SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE = 'SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE',
    SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE = 'SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE',
    SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE',
    SCRIPT_DATA_DOUBLE_ESCAPED_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_STATE',
    SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE',
    SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE',
    SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE',
    SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE',
    BEFORE_ATTRIBUTE_NAME_STATE = 'BEFORE_ATTRIBUTE_NAME_STATE',
    ATTRIBUTE_NAME_STATE = 'ATTRIBUTE_NAME_STATE',
    AFTER_ATTRIBUTE_NAME_STATE = 'AFTER_ATTRIBUTE_NAME_STATE',
    BEFORE_ATTRIBUTE_VALUE_STATE = 'BEFORE_ATTRIBUTE_VALUE_STATE',
    ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE = 'ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE',
    ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE = 'ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE',
    ATTRIBUTE_VALUE_UNQUOTED_STATE = 'ATTRIBUTE_VALUE_UNQUOTED_STATE',
    CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE = 'CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE',
    AFTER_ATTRIBUTE_VALUE_QUOTED_STATE = 'AFTER_ATTRIBUTE_VALUE_QUOTED_STATE',
    SELF_CLOSING_START_TAG_STATE = 'SELF_CLOSING_START_TAG_STATE',
    BOGUS_COMMENT_STATE = 'BOGUS_COMMENT_STATE',
    BOGUS_COMMENT_STATE_CONTINUATION = 'BOGUS_COMMENT_STATE_CONTINUATION',
    MARKUP_DECLARATION_OPEN_STATE = 'MARKUP_DECLARATION_OPEN_STATE',
    COMMENT_START_STATE = 'COMMENT_START_STATE',
    COMMENT_START_DASH_STATE = 'COMMENT_START_DASH_STATE',
    COMMENT_STATE = 'COMMENT_STATE',
    COMMENT_END_DASH_STATE = 'COMMENT_END_DASH_STATE',
    COMMENT_END_STATE = 'COMMENT_END_STATE',
    COMMENT_END_BANG_STATE = 'COMMENT_END_BANG_STATE',
    DOCTYPE_STATE = 'DOCTYPE_STATE',
    DOCTYPE_NAME_STATE = 'DOCTYPE_NAME_STATE',
    AFTER_DOCTYPE_NAME_STATE = 'AFTER_DOCTYPE_NAME_STATE',
    BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE = 'BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE',
    DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE = 'DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE',
    DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE = 'DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE',
    BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE = 'BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE',
    BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE = 'BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE',
    DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE = 'DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE',
    DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE = 'DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE',
    AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE = 'AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE',
    BOGUS_DOCTYPE_STATE = 'BOGUS_DOCTYPE_STATE',
    CDATA_SECTION_STATE = 'CDATA_SECTION_STATE';

//Utils

//OPTIMIZATION: these utility functions should not be moved out of this module. V8 Crankshaft will not inline
//this functions if they will be situated in another module due to context switch.
//Always perform inlining check before modifying this functions ('node --trace-inlining').
function isWhitespace(cp) {
    return cp === $.SPACE || cp === $.LINE_FEED || cp === $.TABULATION || cp === $.FORM_FEED;
}

function isAsciiDigit(cp) {
    return cp >= $.DIGIT_0 && cp <= $.DIGIT_9;
}

function isAsciiUpper(cp) {
    return cp >= $.LATIN_CAPITAL_A && cp <= $.LATIN_CAPITAL_Z;
}

function isAsciiLower(cp) {
    return cp >= $.LATIN_SMALL_A && cp <= $.LATIN_SMALL_Z;
}

function isAsciiLetter(cp) {
    return isAsciiLower(cp) || isAsciiUpper(cp);
}

function isAsciiAlphaNumeric(cp) {
    return isAsciiLetter(cp) || isAsciiDigit(cp);
}

function isDigit(cp, isHex) {
    return isAsciiDigit(cp) || isHex && (cp >= $.LATIN_CAPITAL_A && cp <= $.LATIN_CAPITAL_F ||
                                         cp >= $.LATIN_SMALL_A && cp <= $.LATIN_SMALL_F);
}

function isReservedCodePoint(cp) {
    return cp >= 0xD800 && cp <= 0xDFFF || cp > 0x10FFFF;
}

function toAsciiLowerCodePoint(cp) {
    return cp + 0x0020;
}

//NOTE: String.fromCharCode() function can handle only characters from BMP subset.
//So, we need to workaround this manually.
//(see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/fromCharCode#Getting_it_to_work_with_higher_values)
function toChar(cp) {
    if (cp <= 0xFFFF)
        return String.fromCharCode(cp);

    cp -= 0x10000;
    return String.fromCharCode(cp >>> 10 & 0x3FF | 0xD800) + String.fromCharCode(0xDC00 | cp & 0x3FF);
}

function toAsciiLowerChar(cp) {
    return String.fromCharCode(toAsciiLowerCodePoint(cp));
}

function findNamedEntityTreeBranch(nodeIx, cp) {
    var branchCount = neTree[++nodeIx],
        lo = ++nodeIx,
        hi = lo + branchCount - 1;

    while (lo <= hi) {
        var mid = lo + hi >>> 1,
            midCp = neTree[mid];

        if (midCp < cp)
            lo = mid + 1;

        else if (midCp > cp)
            hi = mid - 1;

        else
            return neTree[mid + branchCount];
    }

    return -1;
}


//Tokenizer
var Tokenizer = module.exports = function () {
    this.preprocessor = new Preprocessor();

    this.tokenQueue = [];

    this.allowCDATA = false;

    this.state = DATA_STATE;
    this.returnState = '';

    this.tempBuff = [];
    this.additionalAllowedCp = void 0;
    this.lastStartTagName = '';

    this.consumedAfterSnapshot = -1;
    this.active = false;

    this.currentCharacterToken = null;
    this.currentToken = null;
    this.currentAttr = null;
};

//Token types
Tokenizer.CHARACTER_TOKEN = 'CHARACTER_TOKEN';
Tokenizer.NULL_CHARACTER_TOKEN = 'NULL_CHARACTER_TOKEN';
Tokenizer.WHITESPACE_CHARACTER_TOKEN = 'WHITESPACE_CHARACTER_TOKEN';
Tokenizer.START_TAG_TOKEN = 'START_TAG_TOKEN';
Tokenizer.END_TAG_TOKEN = 'END_TAG_TOKEN';
Tokenizer.COMMENT_TOKEN = 'COMMENT_TOKEN';
Tokenizer.DOCTYPE_TOKEN = 'DOCTYPE_TOKEN';
Tokenizer.EOF_TOKEN = 'EOF_TOKEN';
Tokenizer.HIBERNATION_TOKEN = 'HIBERNATION_TOKEN';

//Tokenizer initial states for different modes
Tokenizer.MODE = {
    DATA: DATA_STATE,
    RCDATA: RCDATA_STATE,
    RAWTEXT: RAWTEXT_STATE,
    SCRIPT_DATA: SCRIPT_DATA_STATE,
    PLAINTEXT: PLAINTEXT_STATE
};

//Static
Tokenizer.getTokenAttr = function (token, attrName) {
    for (var i = token.attrs.length - 1; i >= 0; i--) {
        if (token.attrs[i].name === attrName)
            return token.attrs[i].value;
    }

    return null;
};

//API
Tokenizer.prototype.getNextToken = function () {
    while (!this.tokenQueue.length && this.active) {
        this._hibernationSnapshot();

        var cp = this._consume();

        if (!this._ensureHibernation())
            this[this.state](cp);
    }

    return this.tokenQueue.shift();
};

Tokenizer.prototype.write = function (chunk, isLastChunk) {
    this.active = true;
    this.preprocessor.write(chunk, isLastChunk);
};

Tokenizer.prototype.insertHtmlAtCurrentPos = function (chunk) {
    this.active = true;
    this.preprocessor.insertHtmlAtCurrentPos(chunk);
};

//Hibernation
Tokenizer.prototype._hibernationSnapshot = function () {
    this.consumedAfterSnapshot = 0;
};

Tokenizer.prototype._ensureHibernation = function () {
    if (this.preprocessor.endOfChunkHit) {
        for (; this.consumedAfterSnapshot > 0; this.consumedAfterSnapshot--)
            this.preprocessor.retreat();

        this.active = false;
        this.tokenQueue.push({type: Tokenizer.HIBERNATION_TOKEN});

        return true;
    }

    return false;
};


//Consumption
Tokenizer.prototype._consume = function () {
    this.consumedAfterSnapshot++;
    return this.preprocessor.advance();
};

Tokenizer.prototype._unconsume = function () {
    this.consumedAfterSnapshot--;
    this.preprocessor.retreat();
};

Tokenizer.prototype._unconsumeSeveral = function (count) {
    while (count--)
        this._unconsume();
};

Tokenizer.prototype._reconsumeInState = function (state) {
    this.state = state;
    this._unconsume();
};

Tokenizer.prototype._consumeSubsequentIfMatch = function (pattern, startCp, caseSensitive) {
    var consumedCount = 0,
        isMatch = true,
        patternLength = pattern.length,
        patternPos = 0,
        cp = startCp,
        patternCp = void 0;

    for (; patternPos < patternLength; patternPos++) {
        if (patternPos > 0) {
            cp = this._consume();
            consumedCount++;
        }

        if (cp === $.EOF) {
            isMatch = false;
            break;
        }

        patternCp = pattern[patternPos];

        if (cp !== patternCp && (caseSensitive || cp !== toAsciiLowerCodePoint(patternCp))) {
            isMatch = false;
            break;
        }
    }

    if (!isMatch)
        this._unconsumeSeveral(consumedCount);

    return isMatch;
};

//Lookahead
Tokenizer.prototype._lookahead = function () {
    var cp = this._consume();

    this._unconsume();

    return cp;
};

//Temp buffer
Tokenizer.prototype.isTempBufferEqualToScriptString = function () {
    if (this.tempBuff.length !== $$.SCRIPT_STRING.length)
        return false;

    for (var i = 0; i < this.tempBuff.length; i++) {
        if (this.tempBuff[i] !== $$.SCRIPT_STRING[i])
            return false;
    }

    return true;
};

//Token creation
Tokenizer.prototype._createStartTagToken = function () {
    this.currentToken = {
        type: Tokenizer.START_TAG_TOKEN,
        tagName: '',
        selfClosing: false,
        attrs: []
    };
};

Tokenizer.prototype._createEndTagToken = function () {
    this.currentToken = {
        type: Tokenizer.END_TAG_TOKEN,
        tagName: '',
        attrs: []
    };
};

Tokenizer.prototype._createCommentToken = function () {
    this.currentToken = {
        type: Tokenizer.COMMENT_TOKEN,
        data: ''
    };
};

Tokenizer.prototype._createDoctypeToken = function (initialName) {
    this.currentToken = {
        type: Tokenizer.DOCTYPE_TOKEN,
        name: initialName,
        forceQuirks: false,
        publicId: null,
        systemId: null
    };
};

Tokenizer.prototype._createCharacterToken = function (type, ch) {
    this.currentCharacterToken = {
        type: type,
        chars: ch
    };
};

//Tag attributes
Tokenizer.prototype._createAttr = function (attrNameFirstCh) {
    this.currentAttr = {
        name: attrNameFirstCh,
        value: ''
    };
};

Tokenizer.prototype._isDuplicateAttr = function () {
    return Tokenizer.getTokenAttr(this.currentToken, this.currentAttr.name) !== null;
};

Tokenizer.prototype._leaveAttrName = function (toState) {
    this.state = toState;

    if (!this._isDuplicateAttr())
        this.currentToken.attrs.push(this.currentAttr);
};

Tokenizer.prototype._leaveAttrValue = function (toState) {
    this.state = toState;
};

//Appropriate end tag token
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tokenization.html#appropriate-end-tag-token)
Tokenizer.prototype._isAppropriateEndTagToken = function () {
    return this.lastStartTagName === this.currentToken.tagName;
};

//Token emission
Tokenizer.prototype._emitCurrentToken = function () {
    this._emitCurrentCharacterToken();

    //NOTE: store emited start tag's tagName to determine is the following end tag token is appropriate.
    if (this.currentToken.type === Tokenizer.START_TAG_TOKEN)
        this.lastStartTagName = this.currentToken.tagName;

    this.tokenQueue.push(this.currentToken);
    this.currentToken = null;
};

Tokenizer.prototype._emitCurrentCharacterToken = function () {
    if (this.currentCharacterToken) {
        this.tokenQueue.push(this.currentCharacterToken);
        this.currentCharacterToken = null;
    }
};

Tokenizer.prototype._emitEOFToken = function () {
    this._emitCurrentCharacterToken();
    this.tokenQueue.push({type: Tokenizer.EOF_TOKEN});
};

//Characters emission

//OPTIMIZATION: specification uses only one type of character tokens (one token per character).
//This causes a huge memory overhead and a lot of unnecessary parser loops. parse5 uses 3 groups of characters.
//If we have a sequence of characters that belong to the same group, parser can process it
//as a single solid character token.
//So, there are 3 types of character tokens in parse5:
//1)NULL_CHARACTER_TOKEN - \u0000-character sequences (e.g. '\u0000\u0000\u0000')
//2)WHITESPACE_CHARACTER_TOKEN - any whitespace/new-line character sequences (e.g. '\n  \r\t   \f')
//3)CHARACTER_TOKEN - any character sequence which don't belong to groups 1 and 2 (e.g. 'abcdef1234@@#$%^')
Tokenizer.prototype._appendCharToCurrentCharacterToken = function (type, ch) {
    if (this.currentCharacterToken && this.currentCharacterToken.type !== type)
        this._emitCurrentCharacterToken();

    if (this.currentCharacterToken)
        this.currentCharacterToken.chars += ch;

    else
        this._createCharacterToken(type, ch);
};

Tokenizer.prototype._emitCodePoint = function (cp) {
    var type = Tokenizer.CHARACTER_TOKEN;

    if (isWhitespace(cp))
        type = Tokenizer.WHITESPACE_CHARACTER_TOKEN;

    else if (cp === $.NULL)
        type = Tokenizer.NULL_CHARACTER_TOKEN;

    this._appendCharToCurrentCharacterToken(type, toChar(cp));
};

Tokenizer.prototype._emitSeveralCodePoints = function (codePoints) {
    for (var i = 0; i < codePoints.length; i++)
        this._emitCodePoint(codePoints[i]);
};

//NOTE: used then we emit character explicitly. This is always a non-whitespace and a non-null character.
//So we can avoid additional checks here.
Tokenizer.prototype._emitChar = function (ch) {
    this._appendCharToCurrentCharacterToken(Tokenizer.CHARACTER_TOKEN, ch);
};

//Character reference tokenization
Tokenizer.prototype._consumeNumericEntity = function (isHex) {
    var digits = '',
        nextCp = void 0;

    do {
        digits += toChar(this._consume());
        nextCp = this._lookahead();
    } while (nextCp !== $.EOF && isDigit(nextCp, isHex));

    if (this._lookahead() === $.SEMICOLON)
        this._consume();

    var referencedCp = parseInt(digits, isHex ? 16 : 10),
        replacement = NUMERIC_ENTITY_REPLACEMENTS[referencedCp];

    if (replacement)
        return replacement;

    if (isReservedCodePoint(referencedCp))
        return $.REPLACEMENT_CHARACTER;

    return referencedCp;
};

// NOTE: for the details on this algorithm see
// https://github.com/inikulin/parse5/tree/master/scripts/generate_named_entity_data/README.md
Tokenizer.prototype._consumeNamedEntity = function (inAttr) {
    var referencedCodePoints = null,
        referenceSize = 0,
        cp = null,
        consumedCount = 0,
        semicolonTerminated = false;

    for (var i = 0; i > -1;) {
        var current = neTree[i],
            inNode = current < MAX_BRANCH_MARKER_VALUE,
            nodeWithData = inNode && current & HAS_DATA_FLAG;

        if (nodeWithData) {
            referencedCodePoints = current & DATA_DUPLET_FLAG ? [neTree[++i], neTree[++i]] : [neTree[++i]];
            referenceSize = consumedCount;

            if (cp === $.SEMICOLON) {
                semicolonTerminated = true;
                break;
            }
        }

        cp = this._consume();
        consumedCount++;

        if (cp === $.EOF)
            break;

        if (inNode)
            i = current & HAS_BRANCHES_FLAG ? findNamedEntityTreeBranch(i, cp) : -1;

        else
            i = cp === current ? ++i : -1;
    }


    if (referencedCodePoints) {
        if (!semicolonTerminated) {
            //NOTE: unconsume excess (e.g. 'it' in '&notit')
            this._unconsumeSeveral(consumedCount - referenceSize);

            //NOTE: If the character reference is being consumed as part of an attribute and the next character
            //is either a U+003D EQUALS SIGN character (=) or an alphanumeric ASCII character, then, for historical
            //reasons, all the characters that were matched after the U+0026 AMPERSAND character (&) must be
            //unconsumed, and nothing is returned.
            //However, if this next character is in fact a U+003D EQUALS SIGN character (=), then this is a
            //parse error, because some legacy user agents will misinterpret the markup in those cases.
            //(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tokenization.html#tokenizing-character-references)
            if (inAttr) {
                var nextCp = this._lookahead();

                if (nextCp === $.EQUALS_SIGN || isAsciiAlphaNumeric(nextCp)) {
                    this._unconsumeSeveral(referenceSize);
                    return null;
                }
            }
        }

        return referencedCodePoints;
    }

    this._unconsumeSeveral(consumedCount);

    return null;
};

Tokenizer.prototype._consumeCharacterReference = function (startCp, inAttr) {
    if (isWhitespace(startCp) || startCp === $.GREATER_THAN_SIGN ||
        startCp === $.AMPERSAND || startCp === this.additionalAllowedCp || startCp === $.EOF) {
        //NOTE: not a character reference. No characters are consumed, and nothing is returned.
        this._unconsume();
        return null;
    }

    if (startCp === $.NUMBER_SIGN) {
        //NOTE: we have a numeric entity candidate, now we should determine if it's hex or decimal
        var isHex = false,
            nextCp = this._lookahead();

        if (nextCp === $.LATIN_SMALL_X || nextCp === $.LATIN_CAPITAL_X) {
            this._consume();
            isHex = true;
        }

        nextCp = this._lookahead();

        //NOTE: if we have at least one digit this is a numeric entity for sure, so we consume it
        if (nextCp !== $.EOF && isDigit(nextCp, isHex))
            return [this._consumeNumericEntity(isHex)];

        //NOTE: otherwise this is a bogus number entity and a parse error. Unconsume the number sign
        //and the 'x'-character if appropriate.
        this._unconsumeSeveral(isHex ? 2 : 1);
        return null;
    }

    this._unconsume();

    return this._consumeNamedEntity(inAttr);
};

//State machine
var _ = Tokenizer.prototype;

//12.2.4.1 Data state
//------------------------------------------------------------------
_[DATA_STATE] = function dataState(cp) {
    this.preprocessor.dropParsedChunk();

    if (cp === $.AMPERSAND)
        this.state = CHARACTER_REFERENCE_IN_DATA_STATE;

    else if (cp === $.LESS_THAN_SIGN)
        this.state = TAG_OPEN_STATE;

    else if (cp === $.NULL)
        this._emitCodePoint(cp);

    else if (cp === $.EOF)
        this._emitEOFToken();

    else
        this._emitCodePoint(cp);
};


//12.2.4.2 Character reference in data state
//------------------------------------------------------------------
_[CHARACTER_REFERENCE_IN_DATA_STATE] = function characterReferenceInDataState(cp) {
    this.additionalAllowedCp = void 0;

    var referencedCodePoints = this._consumeCharacterReference(cp, false);

    if (!this._ensureHibernation()) {
        if (referencedCodePoints)
            this._emitSeveralCodePoints(referencedCodePoints);

        else
            this._emitChar('&');

        this.state = DATA_STATE;
    }
};


//12.2.4.3 RCDATA state
//------------------------------------------------------------------
_[RCDATA_STATE] = function rcdataState(cp) {
    this.preprocessor.dropParsedChunk();

    if (cp === $.AMPERSAND)
        this.state = CHARACTER_REFERENCE_IN_RCDATA_STATE;

    else if (cp === $.LESS_THAN_SIGN)
        this.state = RCDATA_LESS_THAN_SIGN_STATE;

    else if (cp === $.NULL)
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);

    else if (cp === $.EOF)
        this._emitEOFToken();

    else
        this._emitCodePoint(cp);
};


//12.2.4.4 Character reference in RCDATA state
//------------------------------------------------------------------
_[CHARACTER_REFERENCE_IN_RCDATA_STATE] = function characterReferenceInRcdataState(cp) {
    this.additionalAllowedCp = void 0;

    var referencedCodePoints = this._consumeCharacterReference(cp, false);

    if (!this._ensureHibernation()) {
        if (referencedCodePoints)
            this._emitSeveralCodePoints(referencedCodePoints);

        else
            this._emitChar('&');

        this.state = RCDATA_STATE;
    }
};


//12.2.4.5 RAWTEXT state
//------------------------------------------------------------------
_[RAWTEXT_STATE] = function rawtextState(cp) {
    this.preprocessor.dropParsedChunk();

    if (cp === $.LESS_THAN_SIGN)
        this.state = RAWTEXT_LESS_THAN_SIGN_STATE;

    else if (cp === $.NULL)
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);

    else if (cp === $.EOF)
        this._emitEOFToken();

    else
        this._emitCodePoint(cp);
};


//12.2.4.6 Script data state
//------------------------------------------------------------------
_[SCRIPT_DATA_STATE] = function scriptDataState(cp) {
    this.preprocessor.dropParsedChunk();

    if (cp === $.LESS_THAN_SIGN)
        this.state = SCRIPT_DATA_LESS_THAN_SIGN_STATE;

    else if (cp === $.NULL)
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);

    else if (cp === $.EOF)
        this._emitEOFToken();

    else
        this._emitCodePoint(cp);
};


//12.2.4.7 PLAINTEXT state
//------------------------------------------------------------------
_[PLAINTEXT_STATE] = function plaintextState(cp) {
    this.preprocessor.dropParsedChunk();

    if (cp === $.NULL)
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);

    else if (cp === $.EOF)
        this._emitEOFToken();

    else
        this._emitCodePoint(cp);
};


//12.2.4.8 Tag open state
//------------------------------------------------------------------
_[TAG_OPEN_STATE] = function tagOpenState(cp) {
    if (cp === $.EXCLAMATION_MARK)
        this.state = MARKUP_DECLARATION_OPEN_STATE;

    else if (cp === $.SOLIDUS)
        this.state = END_TAG_OPEN_STATE;

    else if (isAsciiLetter(cp)) {
        this._createStartTagToken();
        this._reconsumeInState(TAG_NAME_STATE);
    }

    else if (cp === $.QUESTION_MARK)
        this._reconsumeInState(BOGUS_COMMENT_STATE);

    else {
        this._emitChar('<');
        this._reconsumeInState(DATA_STATE);
    }
};


//12.2.4.9 End tag open state
//------------------------------------------------------------------
_[END_TAG_OPEN_STATE] = function endTagOpenState(cp) {
    if (isAsciiLetter(cp)) {
        this._createEndTagToken();
        this._reconsumeInState(TAG_NAME_STATE);
    }

    else if (cp === $.GREATER_THAN_SIGN)
        this.state = DATA_STATE;

    else if (cp === $.EOF) {
        this._reconsumeInState(DATA_STATE);
        this._emitChar('<');
        this._emitChar('/');
    }

    else
        this._reconsumeInState(BOGUS_COMMENT_STATE);
};


//12.2.4.10 Tag name state
//------------------------------------------------------------------
_[TAG_NAME_STATE] = function tagNameState(cp) {
    if (isWhitespace(cp))
        this.state = BEFORE_ATTRIBUTE_NAME_STATE;

    else if (cp === $.SOLIDUS)
        this.state = SELF_CLOSING_START_TAG_STATE;

    else if (cp === $.GREATER_THAN_SIGN) {
        this.state = DATA_STATE;
        this._emitCurrentToken();
    }

    else if (isAsciiUpper(cp))
        this.currentToken.tagName += toAsciiLowerChar(cp);

    else if (cp === $.NULL)
        this.currentToken.tagName += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else
        this.currentToken.tagName += toChar(cp);
};


//12.2.4.11 RCDATA less-than sign state
//------------------------------------------------------------------
_[RCDATA_LESS_THAN_SIGN_STATE] = function rcdataLessThanSignState(cp) {
    if (cp === $.SOLIDUS) {
        this.tempBuff = [];
        this.state = RCDATA_END_TAG_OPEN_STATE;
    }

    else {
        this._emitChar('<');
        this._reconsumeInState(RCDATA_STATE);
    }
};


//12.2.4.12 RCDATA end tag open state
//------------------------------------------------------------------
_[RCDATA_END_TAG_OPEN_STATE] = function rcdataEndTagOpenState(cp) {
    if (isAsciiLetter(cp)) {
        this._createEndTagToken();
        this._reconsumeInState(RCDATA_END_TAG_NAME_STATE);
    }

    else {
        this._emitChar('<');
        this._emitChar('/');
        this._reconsumeInState(RCDATA_STATE);
    }
};


//12.2.4.13 RCDATA end tag name state
//------------------------------------------------------------------
_[RCDATA_END_TAG_NAME_STATE] = function rcdataEndTagNameState(cp) {
    if (isAsciiUpper(cp)) {
        this.currentToken.tagName += toAsciiLowerChar(cp);
        this.tempBuff.push(cp);
    }

    else if (isAsciiLower(cp)) {
        this.currentToken.tagName += toChar(cp);
        this.tempBuff.push(cp);
    }

    else {
        if (this._isAppropriateEndTagToken()) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                return;
            }

            if (cp === $.SOLIDUS) {
                this.state = SELF_CLOSING_START_TAG_STATE;
                return;
            }

            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
                return;
            }
        }

        this._emitChar('<');
        this._emitChar('/');
        this._emitSeveralCodePoints(this.tempBuff);
        this._reconsumeInState(RCDATA_STATE);
    }
};


//12.2.4.14 RAWTEXT less-than sign state
//------------------------------------------------------------------
_[RAWTEXT_LESS_THAN_SIGN_STATE] = function rawtextLessThanSignState(cp) {
    if (cp === $.SOLIDUS) {
        this.tempBuff = [];
        this.state = RAWTEXT_END_TAG_OPEN_STATE;
    }

    else {
        this._emitChar('<');
        this._reconsumeInState(RAWTEXT_STATE);
    }
};


//12.2.4.15 RAWTEXT end tag open state
//------------------------------------------------------------------
_[RAWTEXT_END_TAG_OPEN_STATE] = function rawtextEndTagOpenState(cp) {
    if (isAsciiLetter(cp)) {
        this._createEndTagToken();
        this._reconsumeInState(RAWTEXT_END_TAG_NAME_STATE);
    }

    else {
        this._emitChar('<');
        this._emitChar('/');
        this._reconsumeInState(RAWTEXT_STATE);
    }
};


//12.2.4.16 RAWTEXT end tag name state
//------------------------------------------------------------------
_[RAWTEXT_END_TAG_NAME_STATE] = function rawtextEndTagNameState(cp) {
    if (isAsciiUpper(cp)) {
        this.currentToken.tagName += toAsciiLowerChar(cp);
        this.tempBuff.push(cp);
    }

    else if (isAsciiLower(cp)) {
        this.currentToken.tagName += toChar(cp);
        this.tempBuff.push(cp);
    }

    else {
        if (this._isAppropriateEndTagToken()) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                return;
            }

            if (cp === $.SOLIDUS) {
                this.state = SELF_CLOSING_START_TAG_STATE;
                return;
            }

            if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
                return;
            }
        }

        this._emitChar('<');
        this._emitChar('/');
        this._emitSeveralCodePoints(this.tempBuff);
        this._reconsumeInState(RAWTEXT_STATE);
    }
};


//12.2.4.17 Script data less-than sign state
//------------------------------------------------------------------
_[SCRIPT_DATA_LESS_THAN_SIGN_STATE] = function scriptDataLessThanSignState(cp) {
    if (cp === $.SOLIDUS) {
        this.tempBuff = [];
        this.state = SCRIPT_DATA_END_TAG_OPEN_STATE;
    }

    else if (cp === $.EXCLAMATION_MARK) {
        this.state = SCRIPT_DATA_ESCAPE_START_STATE;
        this._emitChar('<');
        this._emitChar('!');
    }

    else {
        this._emitChar('<');
        this._reconsumeInState(SCRIPT_DATA_STATE);
    }
};


//12.2.4.18 Script data end tag open state
//------------------------------------------------------------------
_[SCRIPT_DATA_END_TAG_OPEN_STATE] = function scriptDataEndTagOpenState(cp) {
    if (isAsciiLetter(cp)) {
        this._createEndTagToken();
        this._reconsumeInState(SCRIPT_DATA_END_TAG_NAME_STATE);
    }

    else {
        this._emitChar('<');
        this._emitChar('/');
        this._reconsumeInState(SCRIPT_DATA_STATE);
    }
};


//12.2.4.19 Script data end tag name state
//------------------------------------------------------------------
_[SCRIPT_DATA_END_TAG_NAME_STATE] = function scriptDataEndTagNameState(cp) {
    if (isAsciiUpper(cp)) {
        this.currentToken.tagName += toAsciiLowerChar(cp);
        this.tempBuff.push(cp);
    }

    else if (isAsciiLower(cp)) {
        this.currentToken.tagName += toChar(cp);
        this.tempBuff.push(cp);
    }

    else {
        if (this._isAppropriateEndTagToken()) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                return;
            }

            else if (cp === $.SOLIDUS) {
                this.state = SELF_CLOSING_START_TAG_STATE;
                return;
            }

            else if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
                return;
            }
        }

        this._emitChar('<');
        this._emitChar('/');
        this._emitSeveralCodePoints(this.tempBuff);
        this._reconsumeInState(SCRIPT_DATA_STATE);
    }
};


//12.2.4.20 Script data escape start state
//------------------------------------------------------------------
_[SCRIPT_DATA_ESCAPE_START_STATE] = function scriptDataEscapeStartState(cp) {
    if (cp === $.HYPHEN_MINUS) {
        this.state = SCRIPT_DATA_ESCAPE_START_DASH_STATE;
        this._emitChar('-');
    }

    else
        this._reconsumeInState(SCRIPT_DATA_STATE);
};


//12.2.4.21 Script data escape start dash state
//------------------------------------------------------------------
_[SCRIPT_DATA_ESCAPE_START_DASH_STATE] = function scriptDataEscapeStartDashState(cp) {
    if (cp === $.HYPHEN_MINUS) {
        this.state = SCRIPT_DATA_ESCAPED_DASH_DASH_STATE;
        this._emitChar('-');
    }

    else
        this._reconsumeInState(SCRIPT_DATA_STATE);
};


//12.2.4.22 Script data escaped state
//------------------------------------------------------------------
_[SCRIPT_DATA_ESCAPED_STATE] = function scriptDataEscapedState(cp) {
    if (cp === $.HYPHEN_MINUS) {
        this.state = SCRIPT_DATA_ESCAPED_DASH_STATE;
        this._emitChar('-');
    }

    else if (cp === $.LESS_THAN_SIGN)
        this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;

    else if (cp === $.NULL)
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else
        this._emitCodePoint(cp);
};


//12.2.4.23 Script data escaped dash state
//------------------------------------------------------------------
_[SCRIPT_DATA_ESCAPED_DASH_STATE] = function scriptDataEscapedDashState(cp) {
    if (cp === $.HYPHEN_MINUS) {
        this.state = SCRIPT_DATA_ESCAPED_DASH_DASH_STATE;
        this._emitChar('-');
    }

    else if (cp === $.LESS_THAN_SIGN)
        this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;

    else if (cp === $.NULL) {
        this.state = SCRIPT_DATA_ESCAPED_STATE;
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);
    }

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else {
        this.state = SCRIPT_DATA_ESCAPED_STATE;
        this._emitCodePoint(cp);
    }
};


//12.2.4.24 Script data escaped dash dash state
//------------------------------------------------------------------
_[SCRIPT_DATA_ESCAPED_DASH_DASH_STATE] = function scriptDataEscapedDashDashState(cp) {
    if (cp === $.HYPHEN_MINUS)
        this._emitChar('-');

    else if (cp === $.LESS_THAN_SIGN)
        this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;

    else if (cp === $.GREATER_THAN_SIGN) {
        this.state = SCRIPT_DATA_STATE;
        this._emitChar('>');
    }

    else if (cp === $.NULL) {
        this.state = SCRIPT_DATA_ESCAPED_STATE;
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);
    }

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else {
        this.state = SCRIPT_DATA_ESCAPED_STATE;
        this._emitCodePoint(cp);
    }
};


//12.2.4.25 Script data escaped less-than sign state
//------------------------------------------------------------------
_[SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE] = function scriptDataEscapedLessThanSignState(cp) {
    if (cp === $.SOLIDUS) {
        this.tempBuff = [];
        this.state = SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE;
    }

    else if (isAsciiLetter(cp)) {
        this.tempBuff = [];
        this._emitChar('<');
        this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE);
    }

    else {
        this._emitChar('<');
        this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
    }
};


//12.2.4.26 Script data escaped end tag open state
//------------------------------------------------------------------
_[SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE] = function scriptDataEscapedEndTagOpenState(cp) {
    if (isAsciiLetter(cp)) {
        this._createEndTagToken();
        this._reconsumeInState(SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE);
    }

    else {
        this._emitChar('<');
        this._emitChar('/');
        this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
    }
};


//12.2.4.27 Script data escaped end tag name state
//------------------------------------------------------------------
_[SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE] = function scriptDataEscapedEndTagNameState(cp) {
    if (isAsciiUpper(cp)) {
        this.currentToken.tagName += toAsciiLowerChar(cp);
        this.tempBuff.push(cp);
    }

    else if (isAsciiLower(cp)) {
        this.currentToken.tagName += toChar(cp);
        this.tempBuff.push(cp);
    }

    else {
        if (this._isAppropriateEndTagToken()) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                return;
            }

            if (cp === $.SOLIDUS) {
                this.state = SELF_CLOSING_START_TAG_STATE;
                return;
            }

            if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
                return;
            }
        }

        this._emitChar('<');
        this._emitChar('/');
        this._emitSeveralCodePoints(this.tempBuff);
        this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
    }
};


//12.2.4.28 Script data double escape start state
//------------------------------------------------------------------
_[SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE] = function scriptDataDoubleEscapeStartState(cp) {
    if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN) {
        this.state = this.isTempBufferEqualToScriptString() ? SCRIPT_DATA_DOUBLE_ESCAPED_STATE : SCRIPT_DATA_ESCAPED_STATE;
        this._emitCodePoint(cp);
    }

    else if (isAsciiUpper(cp)) {
        this.tempBuff.push(toAsciiLowerCodePoint(cp));
        this._emitCodePoint(cp);
    }

    else if (isAsciiLower(cp)) {
        this.tempBuff.push(cp);
        this._emitCodePoint(cp);
    }

    else
        this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
};


//12.2.4.29 Script data double escaped state
//------------------------------------------------------------------
_[SCRIPT_DATA_DOUBLE_ESCAPED_STATE] = function scriptDataDoubleEscapedState(cp) {
    if (cp === $.HYPHEN_MINUS) {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE;
        this._emitChar('-');
    }

    else if (cp === $.LESS_THAN_SIGN) {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
        this._emitChar('<');
    }

    else if (cp === $.NULL)
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else
        this._emitCodePoint(cp);
};


//12.2.4.30 Script data double escaped dash state
//------------------------------------------------------------------
_[SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE] = function scriptDataDoubleEscapedDashState(cp) {
    if (cp === $.HYPHEN_MINUS) {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE;
        this._emitChar('-');
    }

    else if (cp === $.LESS_THAN_SIGN) {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
        this._emitChar('<');
    }

    else if (cp === $.NULL) {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);
    }

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
        this._emitCodePoint(cp);
    }
};


//12.2.4.31 Script data double escaped dash dash state
//------------------------------------------------------------------
_[SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE] = function scriptDataDoubleEscapedDashDashState(cp) {
    if (cp === $.HYPHEN_MINUS)
        this._emitChar('-');

    else if (cp === $.LESS_THAN_SIGN) {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
        this._emitChar('<');
    }

    else if (cp === $.GREATER_THAN_SIGN) {
        this.state = SCRIPT_DATA_STATE;
        this._emitChar('>');
    }

    else if (cp === $.NULL) {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
        this._emitChar(UNICODE.REPLACEMENT_CHARACTER);
    }

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else {
        this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
        this._emitCodePoint(cp);
    }
};


//12.2.4.32 Script data double escaped less-than sign state
//------------------------------------------------------------------
_[SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE] = function scriptDataDoubleEscapedLessThanSignState(cp) {
    if (cp === $.SOLIDUS) {
        this.tempBuff = [];
        this.state = SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE;
        this._emitChar('/');
    }

    else
        this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPED_STATE);
};


//12.2.4.33 Script data double escape end state
//------------------------------------------------------------------
_[SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE] = function scriptDataDoubleEscapeEndState(cp) {
    if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN) {
        this.state = this.isTempBufferEqualToScriptString() ? SCRIPT_DATA_ESCAPED_STATE : SCRIPT_DATA_DOUBLE_ESCAPED_STATE;

        this._emitCodePoint(cp);
    }

    else if (isAsciiUpper(cp)) {
        this.tempBuff.push(toAsciiLowerCodePoint(cp));
        this._emitCodePoint(cp);
    }

    else if (isAsciiLower(cp)) {
        this.tempBuff.push(cp);
        this._emitCodePoint(cp);
    }

    else
        this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPED_STATE);
};


//12.2.4.34 Before attribute name state
//------------------------------------------------------------------
_[BEFORE_ATTRIBUTE_NAME_STATE] = function beforeAttributeNameState(cp) {
    if (isWhitespace(cp))
        return;

    if (cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN || cp === $.EOF)
        this._reconsumeInState(AFTER_ATTRIBUTE_NAME_STATE);

    else if (cp === $.EQUALS_SIGN) {
        this._createAttr('=');
        this.state = ATTRIBUTE_NAME_STATE;
    }

    else {
        this._createAttr('');
        this._reconsumeInState(ATTRIBUTE_NAME_STATE);
    }
};


//12.2.4.35 Attribute name state
//------------------------------------------------------------------
_[ATTRIBUTE_NAME_STATE] = function attributeNameState(cp) {
    if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN || cp === $.EOF) {
        this._leaveAttrName(AFTER_ATTRIBUTE_NAME_STATE);
        this._unconsume();
    }

    else if (cp === $.EQUALS_SIGN)
        this._leaveAttrName(BEFORE_ATTRIBUTE_VALUE_STATE);

    else if (isAsciiUpper(cp))
        this.currentAttr.name += toAsciiLowerChar(cp);

    else if (cp === $.QUOTATION_MARK || cp === $.APOSTROPHE || cp === $.LESS_THAN_SIGN)
        this.currentAttr.name += toChar(cp);

    else if (cp === $.NULL)
        this.currentAttr.name += UNICODE.REPLACEMENT_CHARACTER;

    else
        this.currentAttr.name += toChar(cp);
};


//12.2.4.36 After attribute name state
//------------------------------------------------------------------
_[AFTER_ATTRIBUTE_NAME_STATE] = function afterAttributeNameState(cp) {
    if (isWhitespace(cp))
        return;

    if (cp === $.SOLIDUS)
        this.state = SELF_CLOSING_START_TAG_STATE;

    else if (cp === $.EQUALS_SIGN)
        this.state = BEFORE_ATTRIBUTE_VALUE_STATE;

    else if (cp === $.GREATER_THAN_SIGN) {
        this.state = DATA_STATE;
        this._emitCurrentToken();
    }

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else {
        this._createAttr('');
        this._reconsumeInState(ATTRIBUTE_NAME_STATE);
    }
};


//12.2.4.37 Before attribute value state
//------------------------------------------------------------------
_[BEFORE_ATTRIBUTE_VALUE_STATE] = function beforeAttributeValueState(cp) {
    if (isWhitespace(cp))
        return;

    if (cp === $.QUOTATION_MARK)
        this.state = ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE;

    else if (cp === $.APOSTROPHE)
        this.state = ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE;

    else
        this._reconsumeInState(ATTRIBUTE_VALUE_UNQUOTED_STATE);
};


//12.2.4.38 Attribute value (double-quoted) state
//------------------------------------------------------------------
_[ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE] = function attributeValueDoubleQuotedState(cp) {
    if (cp === $.QUOTATION_MARK)
        this.state = AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;

    else if (cp === $.AMPERSAND) {
        this.additionalAllowedCp = $.QUOTATION_MARK;
        this.returnState = this.state;
        this.state = CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE;
    }

    else if (cp === $.NULL)
        this.currentAttr.value += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else
        this.currentAttr.value += toChar(cp);
};


//12.2.4.39 Attribute value (single-quoted) state
//------------------------------------------------------------------
_[ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE] = function attributeValueSingleQuotedState(cp) {
    if (cp === $.APOSTROPHE)
        this.state = AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;

    else if (cp === $.AMPERSAND) {
        this.additionalAllowedCp = $.APOSTROPHE;
        this.returnState = this.state;
        this.state = CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE;
    }

    else if (cp === $.NULL)
        this.currentAttr.value += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else
        this.currentAttr.value += toChar(cp);
};


//12.2.4.40 Attribute value (unquoted) state
//------------------------------------------------------------------
_[ATTRIBUTE_VALUE_UNQUOTED_STATE] = function attributeValueUnquotedState(cp) {
    if (isWhitespace(cp))
        this._leaveAttrValue(BEFORE_ATTRIBUTE_NAME_STATE);

    else if (cp === $.AMPERSAND) {
        this.additionalAllowedCp = $.GREATER_THAN_SIGN;
        this.returnState = this.state;
        this.state = CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE;
    }

    else if (cp === $.GREATER_THAN_SIGN) {
        this._leaveAttrValue(DATA_STATE);
        this._emitCurrentToken();
    }

    else if (cp === $.NULL)
        this.currentAttr.value += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.QUOTATION_MARK || cp === $.APOSTROPHE || cp === $.LESS_THAN_SIGN ||
             cp === $.EQUALS_SIGN || cp === $.GRAVE_ACCENT)
        this.currentAttr.value += toChar(cp);

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else
        this.currentAttr.value += toChar(cp);
};


//12.2.4.41 Character reference in attribute value state
//------------------------------------------------------------------
_[CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE] = function characterReferenceInAttributeValueState(cp) {
    var referencedCodePoints = this._consumeCharacterReference(cp, true);

    if (!this._ensureHibernation()) {
        if (referencedCodePoints) {
            for (var i = 0; i < referencedCodePoints.length; i++)
                this.currentAttr.value += toChar(referencedCodePoints[i]);
        }
        else
            this.currentAttr.value += '&';

        this.state = this.returnState;
    }
};


//12.2.4.42 After attribute value (quoted) state
//------------------------------------------------------------------
_[AFTER_ATTRIBUTE_VALUE_QUOTED_STATE] = function afterAttributeValueQuotedState(cp) {
    if (isWhitespace(cp))
        this._leaveAttrValue(BEFORE_ATTRIBUTE_NAME_STATE);

    else if (cp === $.SOLIDUS)
        this._leaveAttrValue(SELF_CLOSING_START_TAG_STATE);

    else if (cp === $.GREATER_THAN_SIGN) {
        this._leaveAttrValue(DATA_STATE);
        this._emitCurrentToken();
    }

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else
        this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE);
};


//12.2.4.43 Self-closing start tag state
//------------------------------------------------------------------
_[SELF_CLOSING_START_TAG_STATE] = function selfClosingStartTagState(cp) {
    if (cp === $.GREATER_THAN_SIGN) {
        this.currentToken.selfClosing = true;
        this.state = DATA_STATE;
        this._emitCurrentToken();
    }

    else if (cp === $.EOF)
        this._reconsumeInState(DATA_STATE);

    else
        this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE);
};


//12.2.4.44 Bogus comment state
//------------------------------------------------------------------
_[BOGUS_COMMENT_STATE] = function bogusCommentState() {
    this._createCommentToken();
    this._reconsumeInState(BOGUS_COMMENT_STATE_CONTINUATION);
};

//HACK: to support streaming and make BOGUS_COMMENT_STATE reentrant we've
//introduced BOGUS_COMMENT_STATE_CONTINUATION state which will not produce
//comment token on each call.
_[BOGUS_COMMENT_STATE_CONTINUATION] = function bogusCommentStateContinuation(cp) {
    while (true) {
        if (cp === $.GREATER_THAN_SIGN) {
            this.state = DATA_STATE;
            break;
        }

        else if (cp === $.EOF) {
            this._reconsumeInState(DATA_STATE);
            break;
        }

        else {
            this.currentToken.data += cp === $.NULL ? UNICODE.REPLACEMENT_CHARACTER : toChar(cp);

            this._hibernationSnapshot();
            cp = this._consume();

            if (this._ensureHibernation())
                return;
        }
    }

    this._emitCurrentToken();
};

//12.2.4.45 Markup declaration open state
//------------------------------------------------------------------
_[MARKUP_DECLARATION_OPEN_STATE] = function markupDeclarationOpenState(cp) {
    var dashDashMatch = this._consumeSubsequentIfMatch($$.DASH_DASH_STRING, cp, true),
        doctypeMatch = !dashDashMatch && this._consumeSubsequentIfMatch($$.DOCTYPE_STRING, cp, false),
        cdataMatch = !dashDashMatch && !doctypeMatch &&
                     this.allowCDATA &&
                     this._consumeSubsequentIfMatch($$.CDATA_START_STRING, cp, true);

    if (!this._ensureHibernation()) {
        if (dashDashMatch) {
            this._createCommentToken();
            this.state = COMMENT_START_STATE;
        }

        else if (doctypeMatch)
            this.state = DOCTYPE_STATE;

        else if (cdataMatch)
            this.state = CDATA_SECTION_STATE;

        else
            this._reconsumeInState(BOGUS_COMMENT_STATE);
    }
};


//12.2.4.46 Comment start state
//------------------------------------------------------------------
_[COMMENT_START_STATE] = function commentStartState(cp) {
    if (cp === $.HYPHEN_MINUS)
        this.state = COMMENT_START_DASH_STATE;

    else if (cp === $.NULL) {
        this.currentToken.data += UNICODE.REPLACEMENT_CHARACTER;
        this.state = COMMENT_STATE;
    }

    else if (cp === $.GREATER_THAN_SIGN) {
        this.state = DATA_STATE;
        this._emitCurrentToken();
    }

    else if (cp === $.EOF) {
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else {
        this.currentToken.data += toChar(cp);
        this.state = COMMENT_STATE;
    }
};


//12.2.4.47 Comment start dash state
//------------------------------------------------------------------
_[COMMENT_START_DASH_STATE] = function commentStartDashState(cp) {
    if (cp === $.HYPHEN_MINUS)
        this.state = COMMENT_END_STATE;

    else if (cp === $.NULL) {
        this.currentToken.data += '-';
        this.currentToken.data += UNICODE.REPLACEMENT_CHARACTER;
        this.state = COMMENT_STATE;
    }

    else if (cp === $.GREATER_THAN_SIGN) {
        this.state = DATA_STATE;
        this._emitCurrentToken();
    }

    else if (cp === $.EOF) {
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else {
        this.currentToken.data += '-';
        this.currentToken.data += toChar(cp);
        this.state = COMMENT_STATE;
    }
};


//12.2.4.48 Comment state
//------------------------------------------------------------------
_[COMMENT_STATE] = function commentState(cp) {
    if (cp === $.HYPHEN_MINUS)
        this.state = COMMENT_END_DASH_STATE;

    else if (cp === $.NULL)
        this.currentToken.data += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.EOF) {
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else
        this.currentToken.data += toChar(cp);
};


//12.2.4.49 Comment end dash state
//------------------------------------------------------------------
_[COMMENT_END_DASH_STATE] = function commentEndDashState(cp) {
    if (cp === $.HYPHEN_MINUS)
        this.state = COMMENT_END_STATE;

    else if (cp === $.NULL) {
        this.currentToken.data += '-';
        this.currentToken.data += UNICODE.REPLACEMENT_CHARACTER;
        this.state = COMMENT_STATE;
    }

    else if (cp === $.EOF) {
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else {
        this.currentToken.data += '-';
        this.currentToken.data += toChar(cp);
        this.state = COMMENT_STATE;
    }
};


//12.2.4.50 Comment end state
//------------------------------------------------------------------
_[COMMENT_END_STATE] = function commentEndState(cp) {
    if (cp === $.GREATER_THAN_SIGN) {
        this.state = DATA_STATE;
        this._emitCurrentToken();
    }

    else if (cp === $.EXCLAMATION_MARK)
        this.state = COMMENT_END_BANG_STATE;

    else if (cp === $.HYPHEN_MINUS)
        this.currentToken.data += '-';

    else if (cp === $.NULL) {
        this.currentToken.data += '--';
        this.currentToken.data += UNICODE.REPLACEMENT_CHARACTER;
        this.state = COMMENT_STATE;
    }

    else if (cp === $.EOF) {
        this._reconsumeInState(DATA_STATE);
        this._emitCurrentToken();
    }

    else {
        this.currentToken.data += '--';
        this.currentToken.data += toChar(cp);
        this.state = COMMENT_STATE;
    }
};


//12.2.4.51 Comment end bang state
//------------------------------------------------------------------
_[COMMENT_END_BANG_STATE] = function commentEndBangState(cp) {
    if (cp === $.HYPHEN_MINUS) {
        this.currentToken.data += '--!';
        this.state = COMMENT_END_DASH_STATE;
    }

    else if (cp === $.GREATER_THAN_SIGN) {
        this.state = DATA_STATE;
        this._emitCurrentToken();
    }

    else if (cp === $.NULL) {
        this.currentToken.data += '--!';
        this.currentToken.data += UNICODE.REPLACEMENT_CHARACTER;
        this.state = COMMENT_STATE;
    }

    else if (cp === $.EOF) {
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else {
        this.currentToken.data += '--!';
        this.currentToken.data += toChar(cp);
        this.state = COMMENT_STATE;
    }
};


//12.2.4.52 DOCTYPE state
//------------------------------------------------------------------
_[DOCTYPE_STATE] = function doctypeState(cp) {
    if (isWhitespace(cp))
        return;

    else if (cp === $.GREATER_THAN_SIGN) {
        this._createDoctypeToken(null);
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this.state = DATA_STATE;
    }

    else if (cp === $.EOF) {
        this._createDoctypeToken(null);
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }
    else {
        this._createDoctypeToken('');
        this._reconsumeInState(DOCTYPE_NAME_STATE);
    }
};


//12.2.4.54 DOCTYPE name state
//------------------------------------------------------------------
_[DOCTYPE_NAME_STATE] = function doctypeNameState(cp) {
    if (isWhitespace(cp) || cp === $.GREATER_THAN_SIGN || cp === $.EOF)
        this._reconsumeInState(AFTER_DOCTYPE_NAME_STATE);

    else if (isAsciiUpper(cp))
        this.currentToken.name += toAsciiLowerChar(cp);

    else if (cp === $.NULL)
        this.currentToken.name += UNICODE.REPLACEMENT_CHARACTER;

    else
        this.currentToken.name += toChar(cp);
};


//12.2.4.55 After DOCTYPE name state
//------------------------------------------------------------------
_[AFTER_DOCTYPE_NAME_STATE] = function afterDoctypeNameState(cp) {
    if (isWhitespace(cp))
        return;

    if (cp === $.GREATER_THAN_SIGN) {
        this.state = DATA_STATE;
        this._emitCurrentToken();
    }

    else {
        var publicMatch = this._consumeSubsequentIfMatch($$.PUBLIC_STRING, cp, false),
            systemMatch = !publicMatch && this._consumeSubsequentIfMatch($$.SYSTEM_STRING, cp, false);

        if (!this._ensureHibernation()) {
            if (publicMatch)
                this.state = BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE;

            else if (systemMatch)
                this.state = BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE;

            else {
                this.currentToken.forceQuirks = true;
                this.state = BOGUS_DOCTYPE_STATE;
            }
        }
    }
};


//12.2.4.57 Before DOCTYPE public identifier state
//------------------------------------------------------------------
_[BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE] = function beforeDoctypePublicIdentifierState(cp) {
    if (isWhitespace(cp))
        return;

    if (cp === $.QUOTATION_MARK) {
        this.currentToken.publicId = '';
        this.state = DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE;
    }

    else if (cp === $.APOSTROPHE) {
        this.currentToken.publicId = '';
        this.state = DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE;
    }

    else {
        this.currentToken.forceQuirks = true;
        this._reconsumeInState(BOGUS_DOCTYPE_STATE);
    }
};


//12.2.4.58 DOCTYPE public identifier (double-quoted) state
//------------------------------------------------------------------
_[DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE] = function doctypePublicIdentifierDoubleQuotedState(cp) {
    if (cp === $.QUOTATION_MARK)
        this.state = BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE;

    else if (cp === $.NULL)
        this.currentToken.publicId += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.GREATER_THAN_SIGN) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this.state = DATA_STATE;
    }

    else if (cp === $.EOF) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else
        this.currentToken.publicId += toChar(cp);
};


//12.2.4.59 DOCTYPE public identifier (single-quoted) state
//------------------------------------------------------------------
_[DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE] = function doctypePublicIdentifierSingleQuotedState(cp) {
    if (cp === $.APOSTROPHE)
        this.state = BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE;

    else if (cp === $.NULL)
        this.currentToken.publicId += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.GREATER_THAN_SIGN) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this.state = DATA_STATE;
    }

    else if (cp === $.EOF) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else
        this.currentToken.publicId += toChar(cp);
};


//12.2.4.61 Between DOCTYPE public and system identifiers state
//------------------------------------------------------------------
_[BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE] = function betweenDoctypePublicAndSystemIdentifiersState(cp) {
    if (isWhitespace(cp))
        return;

    if (cp === $.GREATER_THAN_SIGN) {
        this._emitCurrentToken();
        this.state = DATA_STATE;
    }

    else if (cp === $.QUOTATION_MARK) {
        this.currentToken.systemId = '';
        this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
    }


    else if (cp === $.APOSTROPHE) {
        this.currentToken.systemId = '';
        this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
    }

    else {
        this.currentToken.forceQuirks = true;
        this._reconsumeInState(BOGUS_DOCTYPE_STATE);
    }
};


//12.2.4.63 Before DOCTYPE system identifier state
//------------------------------------------------------------------
_[BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE] = function beforeDoctypeSystemIdentifierState(cp) {
    if (isWhitespace(cp))
        return;

    if (cp === $.QUOTATION_MARK) {
        this.currentToken.systemId = '';
        this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
    }

    else if (cp === $.APOSTROPHE) {
        this.currentToken.systemId = '';
        this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
    }

    else {
        this.currentToken.forceQuirks = true;
        this._reconsumeInState(BOGUS_DOCTYPE_STATE);
    }
};


//12.2.4.64 DOCTYPE system identifier (double-quoted) state
//------------------------------------------------------------------
_[DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE] = function doctypeSystemIdentifierDoubleQuotedState(cp) {
    if (cp === $.QUOTATION_MARK)
        this.state = AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE;

    else if (cp === $.GREATER_THAN_SIGN) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this.state = DATA_STATE;
    }

    else if (cp === $.NULL)
        this.currentToken.systemId += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.EOF) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else
        this.currentToken.systemId += toChar(cp);
};


//12.2.4.65 DOCTYPE system identifier (single-quoted) state
//------------------------------------------------------------------
_[DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE] = function doctypeSystemIdentifierSingleQuotedState(cp) {
    if (cp === $.APOSTROPHE)
        this.state = AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE;

    else if (cp === $.GREATER_THAN_SIGN) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this.state = DATA_STATE;
    }

    else if (cp === $.NULL)
        this.currentToken.systemId += UNICODE.REPLACEMENT_CHARACTER;

    else if (cp === $.EOF) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else
        this.currentToken.systemId += toChar(cp);
};


//12.2.4.66 After DOCTYPE system identifier state
//------------------------------------------------------------------
_[AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE] = function afterDoctypeSystemIdentifierState(cp) {
    if (isWhitespace(cp))
        return;

    if (cp === $.GREATER_THAN_SIGN) {
        this._emitCurrentToken();
        this.state = DATA_STATE;
    }

    else if (cp === $.EOF) {
        this.currentToken.forceQuirks = true;
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }

    else
        this.state = BOGUS_DOCTYPE_STATE;
};


//12.2.4.67 Bogus DOCTYPE state
//------------------------------------------------------------------
_[BOGUS_DOCTYPE_STATE] = function bogusDoctypeState(cp) {
    if (cp === $.GREATER_THAN_SIGN) {
        this._emitCurrentToken();
        this.state = DATA_STATE;
    }

    else if (cp === $.EOF) {
        this._emitCurrentToken();
        this._reconsumeInState(DATA_STATE);
    }
};


//12.2.4.68 CDATA section state
//------------------------------------------------------------------
_[CDATA_SECTION_STATE] = function cdataSectionState(cp) {
    while (true) {
        if (cp === $.EOF) {
            this._reconsumeInState(DATA_STATE);
            break;
        }

        else {
            var cdataEndMatch = this._consumeSubsequentIfMatch($$.CDATA_END_STRING, cp, true);

            if (this._ensureHibernation())
                break;

            if (cdataEndMatch) {
                this.state = DATA_STATE;
                break;
            }

            this._emitCodePoint(cp);

            this._hibernationSnapshot();
            cp = this._consume();

            if (this._ensureHibernation())
                break;
        }
    }
};

},{"../common/unicode":15,"./named_entity_data":32,"./preprocessor":33}],32:[function(require,module,exports){
'use strict';

//NOTE: this file contains auto-generated array mapped radix tree that is used for the named entity references consumption
//(details: https://github.com/inikulin/parse5/tree/master/scripts/generate_named_entity_data/README.md)
module.exports = new Uint16Array([4,52,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,106,303,412,810,1432,1701,1796,1987,2114,2360,2420,2484,3170,3251,4140,4393,4575,4610,5106,5512,5728,6117,6274,6315,6345,6427,6516,7002,7910,8733,9323,9870,10170,10631,10893,11318,11386,11467,12773,13092,14474,14922,15448,15542,16419,17666,18166,18611,19004,19095,19298,19397,4,16,69,77,97,98,99,102,103,108,109,110,111,112,114,115,116,117,140,150,158,169,176,194,199,210,216,222,226,242,256,266,283,294,108,105,103,5,198,1,59,148,1,198,80,5,38,1,59,156,1,38,99,117,116,101,5,193,1,59,167,1,193,114,101,118,101,59,1,258,4,2,105,121,182,191,114,99,5,194,1,59,189,1,194,59,1,1040,114,59,3,55349,56580,114,97,118,101,5,192,1,59,208,1,192,112,104,97,59,1,913,97,99,114,59,1,256,100,59,1,10835,4,2,103,112,232,237,111,110,59,1,260,102,59,3,55349,56632,112,108,121,70,117,110,99,116,105,111,110,59,1,8289,105,110,103,5,197,1,59,264,1,197,4,2,99,115,272,277,114,59,3,55349,56476,105,103,110,59,1,8788,105,108,100,101,5,195,1,59,292,1,195,109,108,5,196,1,59,301,1,196,4,8,97,99,101,102,111,114,115,117,321,350,354,383,388,394,400,405,4,2,99,114,327,336,107,115,108,97,115,104,59,1,8726,4,2,118,119,342,345,59,1,10983,101,100,59,1,8966,121,59,1,1041,4,3,99,114,116,362,369,379,97,117,115,101,59,1,8757,110,111,117,108,108,105,115,59,1,8492,97,59,1,914,114,59,3,55349,56581,112,102,59,3,55349,56633,101,118,101,59,1,728,99,114,59,1,8492,109,112,101,113,59,1,8782,4,14,72,79,97,99,100,101,102,104,105,108,111,114,115,117,442,447,456,504,542,547,569,573,577,616,678,784,790,796,99,121,59,1,1063,80,89,5,169,1,59,454,1,169,4,3,99,112,121,464,470,497,117,116,101,59,1,262,4,2,59,105,476,478,1,8914,116,97,108,68,105,102,102,101,114,101,110,116,105,97,108,68,59,1,8517,108,101,121,115,59,1,8493,4,4,97,101,105,111,514,520,530,535,114,111,110,59,1,268,100,105,108,5,199,1,59,528,1,199,114,99,59,1,264,110,105,110,116,59,1,8752,111,116,59,1,266,4,2,100,110,553,560,105,108,108,97,59,1,184,116,101,114,68,111,116,59,1,183,114,59,1,8493,105,59,1,935,114,99,108,101,4,4,68,77,80,84,591,596,603,609,111,116,59,1,8857,105,110,117,115,59,1,8854,108,117,115,59,1,8853,105,109,101,115,59,1,8855,111,4,2,99,115,623,646,107,119,105,115,101,67,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8754,101,67,117,114,108,121,4,2,68,81,658,671,111,117,98,108,101,81,117,111,116,101,59,1,8221,117,111,116,101,59,1,8217,4,4,108,110,112,117,688,701,736,753,111,110,4,2,59,101,696,698,1,8759,59,1,10868,4,3,103,105,116,709,717,722,114,117,101,110,116,59,1,8801,110,116,59,1,8751,111,117,114,73,110,116,101,103,114,97,108,59,1,8750,4,2,102,114,742,745,59,1,8450,111,100,117,99,116,59,1,8720,110,116,101,114,67,108,111,99,107,119,105,115,101,67,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8755,111,115,115,59,1,10799,99,114,59,3,55349,56478,112,4,2,59,67,803,805,1,8915,97,112,59,1,8781,4,11,68,74,83,90,97,99,101,102,105,111,115,834,850,855,860,865,888,903,916,921,1011,1415,4,2,59,111,840,842,1,8517,116,114,97,104,100,59,1,10513,99,121,59,1,1026,99,121,59,1,1029,99,121,59,1,1039,4,3,103,114,115,873,879,883,103,101,114,59,1,8225,114,59,1,8609,104,118,59,1,10980,4,2,97,121,894,900,114,111,110,59,1,270,59,1,1044,108,4,2,59,116,910,912,1,8711,97,59,1,916,114,59,3,55349,56583,4,2,97,102,927,998,4,2,99,109,933,992,114,105,116,105,99,97,108,4,4,65,68,71,84,950,957,978,985,99,117,116,101,59,1,180,111,4,2,116,117,964,967,59,1,729,98,108,101,65,99,117,116,101,59,1,733,114,97,118,101,59,1,96,105,108,100,101,59,1,732,111,110,100,59,1,8900,102,101,114,101,110,116,105,97,108,68,59,1,8518,4,4,112,116,117,119,1021,1026,1048,1249,102,59,3,55349,56635,4,3,59,68,69,1034,1036,1041,1,168,111,116,59,1,8412,113,117,97,108,59,1,8784,98,108,101,4,6,67,68,76,82,85,86,1065,1082,1101,1189,1211,1236,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8751,111,4,2,116,119,1089,1092,59,1,168,110,65,114,114,111,119,59,1,8659,4,2,101,111,1107,1141,102,116,4,3,65,82,84,1117,1124,1136,114,114,111,119,59,1,8656,105,103,104,116,65,114,114,111,119,59,1,8660,101,101,59,1,10980,110,103,4,2,76,82,1149,1177,101,102,116,4,2,65,82,1158,1165,114,114,111,119,59,1,10232,105,103,104,116,65,114,114,111,119,59,1,10234,105,103,104,116,65,114,114,111,119,59,1,10233,105,103,104,116,4,2,65,84,1199,1206,114,114,111,119,59,1,8658,101,101,59,1,8872,112,4,2,65,68,1218,1225,114,114,111,119,59,1,8657,111,119,110,65,114,114,111,119,59,1,8661,101,114,116,105,99,97,108,66,97,114,59,1,8741,110,4,6,65,66,76,82,84,97,1264,1292,1299,1352,1391,1408,114,114,111,119,4,3,59,66,85,1276,1278,1283,1,8595,97,114,59,1,10515,112,65,114,114,111,119,59,1,8693,114,101,118,101,59,1,785,101,102,116,4,3,82,84,86,1310,1323,1334,105,103,104,116,86,101,99,116,111,114,59,1,10576,101,101,86,101,99,116,111,114,59,1,10590,101,99,116,111,114,4,2,59,66,1345,1347,1,8637,97,114,59,1,10582,105,103,104,116,4,2,84,86,1362,1373,101,101,86,101,99,116,111,114,59,1,10591,101,99,116,111,114,4,2,59,66,1384,1386,1,8641,97,114,59,1,10583,101,101,4,2,59,65,1399,1401,1,8868,114,114,111,119,59,1,8615,114,114,111,119,59,1,8659,4,2,99,116,1421,1426,114,59,3,55349,56479,114,111,107,59,1,272,4,16,78,84,97,99,100,102,103,108,109,111,112,113,115,116,117,120,1466,1470,1478,1489,1515,1520,1525,1536,1544,1593,1609,1617,1650,1664,1668,1677,71,59,1,330,72,5,208,1,59,1476,1,208,99,117,116,101,5,201,1,59,1487,1,201,4,3,97,105,121,1497,1503,1512,114,111,110,59,1,282,114,99,5,202,1,59,1510,1,202,59,1,1069,111,116,59,1,278,114,59,3,55349,56584,114,97,118,101,5,200,1,59,1534,1,200,101,109,101,110,116,59,1,8712,4,2,97,112,1550,1555,99,114,59,1,274,116,121,4,2,83,86,1563,1576,109,97,108,108,83,113,117,97,114,101,59,1,9723,101,114,121,83,109,97,108,108,83,113,117,97,114,101,59,1,9643,4,2,103,112,1599,1604,111,110,59,1,280,102,59,3,55349,56636,115,105,108,111,110,59,1,917,117,4,2,97,105,1624,1640,108,4,2,59,84,1631,1633,1,10869,105,108,100,101,59,1,8770,108,105,98,114,105,117,109,59,1,8652,4,2,99,105,1656,1660,114,59,1,8496,109,59,1,10867,97,59,1,919,109,108,5,203,1,59,1675,1,203,4,2,105,112,1683,1689,115,116,115,59,1,8707,111,110,101,110,116,105,97,108,69,59,1,8519,4,5,99,102,105,111,115,1713,1717,1722,1762,1791,121,59,1,1060,114,59,3,55349,56585,108,108,101,100,4,2,83,86,1732,1745,109,97,108,108,83,113,117,97,114,101,59,1,9724,101,114,121,83,109,97,108,108,83,113,117,97,114,101,59,1,9642,4,3,112,114,117,1770,1775,1781,102,59,3,55349,56637,65,108,108,59,1,8704,114,105,101,114,116,114,102,59,1,8497,99,114,59,1,8497,4,12,74,84,97,98,99,100,102,103,111,114,115,116,1822,1827,1834,1848,1855,1877,1882,1887,1890,1896,1978,1984,99,121,59,1,1027,5,62,1,59,1832,1,62,109,109,97,4,2,59,100,1843,1845,1,915,59,1,988,114,101,118,101,59,1,286,4,3,101,105,121,1863,1869,1874,100,105,108,59,1,290,114,99,59,1,284,59,1,1043,111,116,59,1,288,114,59,3,55349,56586,59,1,8921,112,102,59,3,55349,56638,101,97,116,101,114,4,6,69,70,71,76,83,84,1915,1933,1944,1953,1959,1971,113,117,97,108,4,2,59,76,1925,1927,1,8805,101,115,115,59,1,8923,117,108,108,69,113,117,97,108,59,1,8807,114,101,97,116,101,114,59,1,10914,101,115,115,59,1,8823,108,97,110,116,69,113,117,97,108,59,1,10878,105,108,100,101,59,1,8819,99,114,59,3,55349,56482,59,1,8811,4,8,65,97,99,102,105,111,115,117,2005,2012,2026,2032,2036,2049,2073,2089,82,68,99,121,59,1,1066,4,2,99,116,2018,2023,101,107,59,1,711,59,1,94,105,114,99,59,1,292,114,59,1,8460,108,98,101,114,116,83,112,97,99,101,59,1,8459,4,2,112,114,2055,2059,102,59,1,8461,105,122,111,110,116,97,108,76,105,110,101,59,1,9472,4,2,99,116,2079,2083,114,59,1,8459,114,111,107,59,1,294,109,112,4,2,68,69,2097,2107,111,119,110,72,117,109,112,59,1,8782,113,117,97,108,59,1,8783,4,14,69,74,79,97,99,100,102,103,109,110,111,115,116,117,2144,2149,2155,2160,2171,2189,2194,2198,2209,2245,2307,2329,2334,2341,99,121,59,1,1045,108,105,103,59,1,306,99,121,59,1,1025,99,117,116,101,5,205,1,59,2169,1,205,4,2,105,121,2177,2186,114,99,5,206,1,59,2184,1,206,59,1,1048,111,116,59,1,304,114,59,1,8465,114,97,118,101,5,204,1,59,2207,1,204,4,3,59,97,112,2217,2219,2238,1,8465,4,2,99,103,2225,2229,114,59,1,298,105,110,97,114,121,73,59,1,8520,108,105,101,115,59,1,8658,4,2,116,118,2251,2281,4,2,59,101,2257,2259,1,8748,4,2,103,114,2265,2271,114,97,108,59,1,8747,115,101,99,116,105,111,110,59,1,8898,105,115,105,98,108,101,4,2,67,84,2293,2300,111,109,109,97,59,1,8291,105,109,101,115,59,1,8290,4,3,103,112,116,2315,2320,2325,111,110,59,1,302,102,59,3,55349,56640,97,59,1,921,99,114,59,1,8464,105,108,100,101,59,1,296,4,2,107,109,2347,2352,99,121,59,1,1030,108,5,207,1,59,2358,1,207,4,5,99,102,111,115,117,2372,2386,2391,2397,2414,4,2,105,121,2378,2383,114,99,59,1,308,59,1,1049,114,59,3,55349,56589,112,102,59,3,55349,56641,4,2,99,101,2403,2408,114,59,3,55349,56485,114,99,121,59,1,1032,107,99,121,59,1,1028,4,7,72,74,97,99,102,111,115,2436,2441,2446,2452,2467,2472,2478,99,121,59,1,1061,99,121,59,1,1036,112,112,97,59,1,922,4,2,101,121,2458,2464,100,105,108,59,1,310,59,1,1050,114,59,3,55349,56590,112,102,59,3,55349,56642,99,114,59,3,55349,56486,4,11,74,84,97,99,101,102,108,109,111,115,116,2508,2513,2520,2562,2585,2981,2986,3004,3011,3146,3167,99,121,59,1,1033,5,60,1,59,2518,1,60,4,5,99,109,110,112,114,2532,2538,2544,2548,2558,117,116,101,59,1,313,98,100,97,59,1,923,103,59,1,10218,108,97,99,101,116,114,102,59,1,8466,114,59,1,8606,4,3,97,101,121,2570,2576,2582,114,111,110,59,1,317,100,105,108,59,1,315,59,1,1051,4,2,102,115,2591,2907,116,4,10,65,67,68,70,82,84,85,86,97,114,2614,2663,2672,2728,2735,2760,2820,2870,2888,2895,4,2,110,114,2620,2633,103,108,101,66,114,97,99,107,101,116,59,1,10216,114,111,119,4,3,59,66,82,2644,2646,2651,1,8592,97,114,59,1,8676,105,103,104,116,65,114,114,111,119,59,1,8646,101,105,108,105,110,103,59,1,8968,111,4,2,117,119,2679,2692,98,108,101,66,114,97,99,107,101,116,59,1,10214,110,4,2,84,86,2699,2710,101,101,86,101,99,116,111,114,59,1,10593,101,99,116,111,114,4,2,59,66,2721,2723,1,8643,97,114,59,1,10585,108,111,111,114,59,1,8970,105,103,104,116,4,2,65,86,2745,2752,114,114,111,119,59,1,8596,101,99,116,111,114,59,1,10574,4,2,101,114,2766,2792,101,4,3,59,65,86,2775,2777,2784,1,8867,114,114,111,119,59,1,8612,101,99,116,111,114,59,1,10586,105,97,110,103,108,101,4,3,59,66,69,2806,2808,2813,1,8882,97,114,59,1,10703,113,117,97,108,59,1,8884,112,4,3,68,84,86,2829,2841,2852,111,119,110,86,101,99,116,111,114,59,1,10577,101,101,86,101,99,116,111,114,59,1,10592,101,99,116,111,114,4,2,59,66,2863,2865,1,8639,97,114,59,1,10584,101,99,116,111,114,4,2,59,66,2881,2883,1,8636,97,114,59,1,10578,114,114,111,119,59,1,8656,105,103,104,116,97,114,114,111,119,59,1,8660,115,4,6,69,70,71,76,83,84,2922,2936,2947,2956,2962,2974,113,117,97,108,71,114,101,97,116,101,114,59,1,8922,117,108,108,69,113,117,97,108,59,1,8806,114,101,97,116,101,114,59,1,8822,101,115,115,59,1,10913,108,97,110,116,69,113,117,97,108,59,1,10877,105,108,100,101,59,1,8818,114,59,3,55349,56591,4,2,59,101,2992,2994,1,8920,102,116,97,114,114,111,119,59,1,8666,105,100,111,116,59,1,319,4,3,110,112,119,3019,3110,3115,103,4,4,76,82,108,114,3030,3058,3070,3098,101,102,116,4,2,65,82,3039,3046,114,114,111,119,59,1,10229,105,103,104,116,65,114,114,111,119,59,1,10231,105,103,104,116,65,114,114,111,119,59,1,10230,101,102,116,4,2,97,114,3079,3086,114,114,111,119,59,1,10232,105,103,104,116,97,114,114,111,119,59,1,10234,105,103,104,116,97,114,114,111,119,59,1,10233,102,59,3,55349,56643,101,114,4,2,76,82,3123,3134,101,102,116,65,114,114,111,119,59,1,8601,105,103,104,116,65,114,114,111,119,59,1,8600,4,3,99,104,116,3154,3158,3161,114,59,1,8466,59,1,8624,114,111,107,59,1,321,59,1,8810,4,8,97,99,101,102,105,111,115,117,3188,3192,3196,3222,3227,3237,3243,3248,112,59,1,10501,121,59,1,1052,4,2,100,108,3202,3213,105,117,109,83,112,97,99,101,59,1,8287,108,105,110,116,114,102,59,1,8499,114,59,3,55349,56592,110,117,115,80,108,117,115,59,1,8723,112,102,59,3,55349,56644,99,114,59,1,8499,59,1,924,4,9,74,97,99,101,102,111,115,116,117,3271,3276,3283,3306,3422,3427,4120,4126,4137,99,121,59,1,1034,99,117,116,101,59,1,323,4,3,97,101,121,3291,3297,3303,114,111,110,59,1,327,100,105,108,59,1,325,59,1,1053,4,3,103,115,119,3314,3380,3415,97,116,105,118,101,4,3,77,84,86,3327,3340,3365,101,100,105,117,109,83,112,97,99,101,59,1,8203,104,105,4,2,99,110,3348,3357,107,83,112,97,99,101,59,1,8203,83,112,97,99,101,59,1,8203,101,114,121,84,104,105,110,83,112,97,99,101,59,1,8203,116,101,100,4,2,71,76,3389,3405,114,101,97,116,101,114,71,114,101,97,116,101,114,59,1,8811,101,115,115,76,101,115,115,59,1,8810,76,105,110,101,59,1,10,114,59,3,55349,56593,4,4,66,110,112,116,3437,3444,3460,3464,114,101,97,107,59,1,8288,66,114,101,97,107,105,110,103,83,112,97,99,101,59,1,160,102,59,1,8469,4,13,59,67,68,69,71,72,76,78,80,82,83,84,86,3492,3494,3517,3536,3578,3657,3685,3784,3823,3860,3915,4066,4107,1,10988,4,2,111,117,3500,3510,110,103,114,117,101,110,116,59,1,8802,112,67,97,112,59,1,8813,111,117,98,108,101,86,101,114,116,105,99,97,108,66,97,114,59,1,8742,4,3,108,113,120,3544,3552,3571,101,109,101,110,116,59,1,8713,117,97,108,4,2,59,84,3561,3563,1,8800,105,108,100,101,59,3,8770,824,105,115,116,115,59,1,8708,114,101,97,116,101,114,4,7,59,69,70,71,76,83,84,3600,3602,3609,3621,3631,3637,3650,1,8815,113,117,97,108,59,1,8817,117,108,108,69,113,117,97,108,59,3,8807,824,114,101,97,116,101,114,59,3,8811,824,101,115,115,59,1,8825,108,97,110,116,69,113,117,97,108,59,3,10878,824,105,108,100,101,59,1,8821,117,109,112,4,2,68,69,3666,3677,111,119,110,72,117,109,112,59,3,8782,824,113,117,97,108,59,3,8783,824,101,4,2,102,115,3692,3724,116,84,114,105,97,110,103,108,101,4,3,59,66,69,3709,3711,3717,1,8938,97,114,59,3,10703,824,113,117,97,108,59,1,8940,115,4,6,59,69,71,76,83,84,3739,3741,3748,3757,3764,3777,1,8814,113,117,97,108,59,1,8816,114,101,97,116,101,114,59,1,8824,101,115,115,59,3,8810,824,108,97,110,116,69,113,117,97,108,59,3,10877,824,105,108,100,101,59,1,8820,101,115,116,101,100,4,2,71,76,3795,3812,114,101,97,116,101,114,71,114,101,97,116,101,114,59,3,10914,824,101,115,115,76,101,115,115,59,3,10913,824,114,101,99,101,100,101,115,4,3,59,69,83,3838,3840,3848,1,8832,113,117,97,108,59,3,10927,824,108,97,110,116,69,113,117,97,108,59,1,8928,4,2,101,105,3866,3881,118,101,114,115,101,69,108,101,109,101,110,116,59,1,8716,103,104,116,84,114,105,97,110,103,108,101,4,3,59,66,69,3900,3902,3908,1,8939,97,114,59,3,10704,824,113,117,97,108,59,1,8941,4,2,113,117,3921,3973,117,97,114,101,83,117,4,2,98,112,3933,3952,115,101,116,4,2,59,69,3942,3945,3,8847,824,113,117,97,108,59,1,8930,101,114,115,101,116,4,2,59,69,3963,3966,3,8848,824,113,117,97,108,59,1,8931,4,3,98,99,112,3981,4000,4045,115,101,116,4,2,59,69,3990,3993,3,8834,8402,113,117,97,108,59,1,8840,99,101,101,100,115,4,4,59,69,83,84,4015,4017,4025,4037,1,8833,113,117,97,108,59,3,10928,824,108,97,110,116,69,113,117,97,108,59,1,8929,105,108,100,101,59,3,8831,824,101,114,115,101,116,4,2,59,69,4056,4059,3,8835,8402,113,117,97,108,59,1,8841,105,108,100,101,4,4,59,69,70,84,4080,4082,4089,4100,1,8769,113,117,97,108,59,1,8772,117,108,108,69,113,117,97,108,59,1,8775,105,108,100,101,59,1,8777,101,114,116,105,99,97,108,66,97,114,59,1,8740,99,114,59,3,55349,56489,105,108,100,101,5,209,1,59,4135,1,209,59,1,925,4,14,69,97,99,100,102,103,109,111,112,114,115,116,117,118,4170,4176,4187,4205,4212,4217,4228,4253,4259,4292,4295,4316,4337,4346,108,105,103,59,1,338,99,117,116,101,5,211,1,59,4185,1,211,4,2,105,121,4193,4202,114,99,5,212,1,59,4200,1,212,59,1,1054,98,108,97,99,59,1,336,114,59,3,55349,56594,114,97,118,101,5,210,1,59,4226,1,210,4,3,97,101,105,4236,4241,4246,99,114,59,1,332,103,97,59,1,937,99,114,111,110,59,1,927,112,102,59,3,55349,56646,101,110,67,117,114,108,121,4,2,68,81,4272,4285,111,117,98,108,101,81,117,111,116,101,59,1,8220,117,111,116,101,59,1,8216,59,1,10836,4,2,99,108,4301,4306,114,59,3,55349,56490,97,115,104,5,216,1,59,4314,1,216,105,4,2,108,109,4323,4332,100,101,5,213,1,59,4330,1,213,101,115,59,1,10807,109,108,5,214,1,59,4344,1,214,101,114,4,2,66,80,4354,4380,4,2,97,114,4360,4364,114,59,1,8254,97,99,4,2,101,107,4372,4375,59,1,9182,101,116,59,1,9140,97,114,101,110,116,104,101,115,105,115,59,1,9180,4,9,97,99,102,104,105,108,111,114,115,4413,4422,4426,4431,4435,4438,4448,4471,4561,114,116,105,97,108,68,59,1,8706,121,59,1,1055,114,59,3,55349,56595,105,59,1,934,59,1,928,117,115,77,105,110,117,115,59,1,177,4,2,105,112,4454,4467,110,99,97,114,101,112,108,97,110,101,59,1,8460,102,59,1,8473,4,4,59,101,105,111,4481,4483,4526,4531,1,10939,99,101,100,101,115,4,4,59,69,83,84,4498,4500,4507,4519,1,8826,113,117,97,108,59,1,10927,108,97,110,116,69,113,117,97,108,59,1,8828,105,108,100,101,59,1,8830,109,101,59,1,8243,4,2,100,112,4537,4543,117,99,116,59,1,8719,111,114,116,105,111,110,4,2,59,97,4555,4557,1,8759,108,59,1,8733,4,2,99,105,4567,4572,114,59,3,55349,56491,59,1,936,4,4,85,102,111,115,4585,4594,4599,4604,79,84,5,34,1,59,4592,1,34,114,59,3,55349,56596,112,102,59,1,8474,99,114,59,3,55349,56492,4,12,66,69,97,99,101,102,104,105,111,114,115,117,4636,4642,4650,4681,4704,4763,4767,4771,5047,5069,5081,5094,97,114,114,59,1,10512,71,5,174,1,59,4648,1,174,4,3,99,110,114,4658,4664,4668,117,116,101,59,1,340,103,59,1,10219,114,4,2,59,116,4675,4677,1,8608,108,59,1,10518,4,3,97,101,121,4689,4695,4701,114,111,110,59,1,344,100,105,108,59,1,342,59,1,1056,4,2,59,118,4710,4712,1,8476,101,114,115,101,4,2,69,85,4722,4748,4,2,108,113,4728,4736,101,109,101,110,116,59,1,8715,117,105,108,105,98,114,105,117,109,59,1,8651,112,69,113,117,105,108,105,98,114,105,117,109,59,1,10607,114,59,1,8476,111,59,1,929,103,104,116,4,8,65,67,68,70,84,85,86,97,4792,4840,4849,4905,4912,4972,5022,5040,4,2,110,114,4798,4811,103,108,101,66,114,97,99,107,101,116,59,1,10217,114,111,119,4,3,59,66,76,4822,4824,4829,1,8594,97,114,59,1,8677,101,102,116,65,114,114,111,119,59,1,8644,101,105,108,105,110,103,59,1,8969,111,4,2,117,119,4856,4869,98,108,101,66,114,97,99,107,101,116,59,1,10215,110,4,2,84,86,4876,4887,101,101,86,101,99,116,111,114,59,1,10589,101,99,116,111,114,4,2,59,66,4898,4900,1,8642,97,114,59,1,10581,108,111,111,114,59,1,8971,4,2,101,114,4918,4944,101,4,3,59,65,86,4927,4929,4936,1,8866,114,114,111,119,59,1,8614,101,99,116,111,114,59,1,10587,105,97,110,103,108,101,4,3,59,66,69,4958,4960,4965,1,8883,97,114,59,1,10704,113,117,97,108,59,1,8885,112,4,3,68,84,86,4981,4993,5004,111,119,110,86,101,99,116,111,114,59,1,10575,101,101,86,101,99,116,111,114,59,1,10588,101,99,116,111,114,4,2,59,66,5015,5017,1,8638,97,114,59,1,10580,101,99,116,111,114,4,2,59,66,5033,5035,1,8640,97,114,59,1,10579,114,114,111,119,59,1,8658,4,2,112,117,5053,5057,102,59,1,8477,110,100,73,109,112,108,105,101,115,59,1,10608,105,103,104,116,97,114,114,111,119,59,1,8667,4,2,99,104,5087,5091,114,59,1,8475,59,1,8625,108,101,68,101,108,97,121,101,100,59,1,10740,4,13,72,79,97,99,102,104,105,109,111,113,115,116,117,5134,5150,5157,5164,5198,5203,5259,5265,5277,5283,5374,5380,5385,4,2,67,99,5140,5146,72,99,121,59,1,1065,121,59,1,1064,70,84,99,121,59,1,1068,99,117,116,101,59,1,346,4,5,59,97,101,105,121,5176,5178,5184,5190,5195,1,10940,114,111,110,59,1,352,100,105,108,59,1,350,114,99,59,1,348,59,1,1057,114,59,3,55349,56598,111,114,116,4,4,68,76,82,85,5216,5227,5238,5250,111,119,110,65,114,114,111,119,59,1,8595,101,102,116,65,114,114,111,119,59,1,8592,105,103,104,116,65,114,114,111,119,59,1,8594,112,65,114,114,111,119,59,1,8593,103,109,97,59,1,931,97,108,108,67,105,114,99,108,101,59,1,8728,112,102,59,3,55349,56650,4,2,114,117,5289,5293,116,59,1,8730,97,114,101,4,4,59,73,83,85,5306,5308,5322,5367,1,9633,110,116,101,114,115,101,99,116,105,111,110,59,1,8851,117,4,2,98,112,5329,5347,115,101,116,4,2,59,69,5338,5340,1,8847,113,117,97,108,59,1,8849,101,114,115,101,116,4,2,59,69,5358,5360,1,8848,113,117,97,108,59,1,8850,110,105,111,110,59,1,8852,99,114,59,3,55349,56494,97,114,59,1,8902,4,4,98,99,109,112,5395,5420,5475,5478,4,2,59,115,5401,5403,1,8912,101,116,4,2,59,69,5411,5413,1,8912,113,117,97,108,59,1,8838,4,2,99,104,5426,5468,101,101,100,115,4,4,59,69,83,84,5440,5442,5449,5461,1,8827,113,117,97,108,59,1,10928,108,97,110,116,69,113,117,97,108,59,1,8829,105,108,100,101,59,1,8831,84,104,97,116,59,1,8715,59,1,8721,4,3,59,101,115,5486,5488,5507,1,8913,114,115,101,116,4,2,59,69,5498,5500,1,8835,113,117,97,108,59,1,8839,101,116,59,1,8913,4,11,72,82,83,97,99,102,104,105,111,114,115,5536,5546,5552,5567,5579,5602,5607,5655,5695,5701,5711,79,82,78,5,222,1,59,5544,1,222,65,68,69,59,1,8482,4,2,72,99,5558,5563,99,121,59,1,1035,121,59,1,1062,4,2,98,117,5573,5576,59,1,9,59,1,932,4,3,97,101,121,5587,5593,5599,114,111,110,59,1,356,100,105,108,59,1,354,59,1,1058,114,59,3,55349,56599,4,2,101,105,5613,5631,4,2,114,116,5619,5627,101,102,111,114,101,59,1,8756,97,59,1,920,4,2,99,110,5637,5647,107,83,112,97,99,101,59,3,8287,8202,83,112,97,99,101,59,1,8201,108,100,101,4,4,59,69,70,84,5668,5670,5677,5688,1,8764,113,117,97,108,59,1,8771,117,108,108,69,113,117,97,108,59,1,8773,105,108,100,101,59,1,8776,112,102,59,3,55349,56651,105,112,108,101,68,111,116,59,1,8411,4,2,99,116,5717,5722,114,59,3,55349,56495,114,111,107,59,1,358,4,14,97,98,99,100,102,103,109,110,111,112,114,115,116,117,5758,5789,5805,5823,5830,5835,5846,5852,5921,5937,6089,6095,6101,6108,4,2,99,114,5764,5774,117,116,101,5,218,1,59,5772,1,218,114,4,2,59,111,5781,5783,1,8607,99,105,114,59,1,10569,114,4,2,99,101,5796,5800,121,59,1,1038,118,101,59,1,364,4,2,105,121,5811,5820,114,99,5,219,1,59,5818,1,219,59,1,1059,98,108,97,99,59,1,368,114,59,3,55349,56600,114,97,118,101,5,217,1,59,5844,1,217,97,99,114,59,1,362,4,2,100,105,5858,5905,101,114,4,2,66,80,5866,5892,4,2,97,114,5872,5876,114,59,1,95,97,99,4,2,101,107,5884,5887,59,1,9183,101,116,59,1,9141,97,114,101,110,116,104,101,115,105,115,59,1,9181,111,110,4,2,59,80,5913,5915,1,8899,108,117,115,59,1,8846,4,2,103,112,5927,5932,111,110,59,1,370,102,59,3,55349,56652,4,8,65,68,69,84,97,100,112,115,5955,5985,5996,6009,6026,6033,6044,6075,114,114,111,119,4,3,59,66,68,5967,5969,5974,1,8593,97,114,59,1,10514,111,119,110,65,114,114,111,119,59,1,8645,111,119,110,65,114,114,111,119,59,1,8597,113,117,105,108,105,98,114,105,117,109,59,1,10606,101,101,4,2,59,65,6017,6019,1,8869,114,114,111,119,59,1,8613,114,114,111,119,59,1,8657,111,119,110,97,114,114,111,119,59,1,8661,101,114,4,2,76,82,6052,6063,101,102,116,65,114,114,111,119,59,1,8598,105,103,104,116,65,114,114,111,119,59,1,8599,105,4,2,59,108,6082,6084,1,978,111,110,59,1,933,105,110,103,59,1,366,99,114,59,3,55349,56496,105,108,100,101,59,1,360,109,108,5,220,1,59,6115,1,220,4,9,68,98,99,100,101,102,111,115,118,6137,6143,6148,6152,6166,6250,6255,6261,6267,97,115,104,59,1,8875,97,114,59,1,10987,121,59,1,1042,97,115,104,4,2,59,108,6161,6163,1,8873,59,1,10982,4,2,101,114,6172,6175,59,1,8897,4,3,98,116,121,6183,6188,6238,97,114,59,1,8214,4,2,59,105,6194,6196,1,8214,99,97,108,4,4,66,76,83,84,6209,6214,6220,6231,97,114,59,1,8739,105,110,101,59,1,124,101,112,97,114,97,116,111,114,59,1,10072,105,108,100,101,59,1,8768,84,104,105,110,83,112,97,99,101,59,1,8202,114,59,3,55349,56601,112,102,59,3,55349,56653,99,114,59,3,55349,56497,100,97,115,104,59,1,8874,4,5,99,101,102,111,115,6286,6292,6298,6303,6309,105,114,99,59,1,372,100,103,101,59,1,8896,114,59,3,55349,56602,112,102,59,3,55349,56654,99,114,59,3,55349,56498,4,4,102,105,111,115,6325,6330,6333,6339,114,59,3,55349,56603,59,1,926,112,102,59,3,55349,56655,99,114,59,3,55349,56499,4,9,65,73,85,97,99,102,111,115,117,6365,6370,6375,6380,6391,6405,6410,6416,6422,99,121,59,1,1071,99,121,59,1,1031,99,121,59,1,1070,99,117,116,101,5,221,1,59,6389,1,221,4,2,105,121,6397,6402,114,99,59,1,374,59,1,1067,114,59,3,55349,56604,112,102,59,3,55349,56656,99,114,59,3,55349,56500,109,108,59,1,376,4,8,72,97,99,100,101,102,111,115,6445,6450,6457,6472,6477,6501,6505,6510,99,121,59,1,1046,99,117,116,101,59,1,377,4,2,97,121,6463,6469,114,111,110,59,1,381,59,1,1047,111,116,59,1,379,4,2,114,116,6483,6497,111,87,105,100,116,104,83,112,97,99,101,59,1,8203,97,59,1,918,114,59,1,8488,112,102,59,1,8484,99,114,59,3,55349,56501,4,16,97,98,99,101,102,103,108,109,110,111,112,114,115,116,117,119,6550,6561,6568,6612,6622,6634,6645,6672,6699,6854,6870,6923,6933,6963,6974,6983,99,117,116,101,5,225,1,59,6559,1,225,114,101,118,101,59,1,259,4,6,59,69,100,105,117,121,6582,6584,6588,6591,6600,6609,1,8766,59,3,8766,819,59,1,8767,114,99,5,226,1,59,6598,1,226,116,101,5,180,1,59,6607,1,180,59,1,1072,108,105,103,5,230,1,59,6620,1,230,4,2,59,114,6628,6630,1,8289,59,3,55349,56606,114,97,118,101,5,224,1,59,6643,1,224,4,2,101,112,6651,6667,4,2,102,112,6657,6663,115,121,109,59,1,8501,104,59,1,8501,104,97,59,1,945,4,2,97,112,6678,6692,4,2,99,108,6684,6688,114,59,1,257,103,59,1,10815,5,38,1,59,6697,1,38,4,2,100,103,6705,6737,4,5,59,97,100,115,118,6717,6719,6724,6727,6734,1,8743,110,100,59,1,10837,59,1,10844,108,111,112,101,59,1,10840,59,1,10842,4,7,59,101,108,109,114,115,122,6753,6755,6758,6762,6814,6835,6848,1,8736,59,1,10660,101,59,1,8736,115,100,4,2,59,97,6770,6772,1,8737,4,8,97,98,99,100,101,102,103,104,6790,6793,6796,6799,6802,6805,6808,6811,59,1,10664,59,1,10665,59,1,10666,59,1,10667,59,1,10668,59,1,10669,59,1,10670,59,1,10671,116,4,2,59,118,6821,6823,1,8735,98,4,2,59,100,6830,6832,1,8894,59,1,10653,4,2,112,116,6841,6845,104,59,1,8738,59,1,197,97,114,114,59,1,9084,4,2,103,112,6860,6865,111,110,59,1,261,102,59,3,55349,56658,4,7,59,69,97,101,105,111,112,6886,6888,6891,6897,6900,6904,6908,1,8776,59,1,10864,99,105,114,59,1,10863,59,1,8778,100,59,1,8779,115,59,1,39,114,111,120,4,2,59,101,6917,6919,1,8776,113,59,1,8778,105,110,103,5,229,1,59,6931,1,229,4,3,99,116,121,6941,6946,6949,114,59,3,55349,56502,59,1,42,109,112,4,2,59,101,6957,6959,1,8776,113,59,1,8781,105,108,100,101,5,227,1,59,6972,1,227,109,108,5,228,1,59,6981,1,228,4,2,99,105,6989,6997,111,110,105,110,116,59,1,8755,110,116,59,1,10769,4,16,78,97,98,99,100,101,102,105,107,108,110,111,112,114,115,117,7036,7041,7119,7135,7149,7155,7219,7224,7347,7354,7463,7489,7786,7793,7814,7866,111,116,59,1,10989,4,2,99,114,7047,7094,107,4,4,99,101,112,115,7058,7064,7073,7080,111,110,103,59,1,8780,112,115,105,108,111,110,59,1,1014,114,105,109,101,59,1,8245,105,109,4,2,59,101,7088,7090,1,8765,113,59,1,8909,4,2,118,119,7100,7105,101,101,59,1,8893,101,100,4,2,59,103,7113,7115,1,8965,101,59,1,8965,114,107,4,2,59,116,7127,7129,1,9141,98,114,107,59,1,9142,4,2,111,121,7141,7146,110,103,59,1,8780,59,1,1073,113,117,111,59,1,8222,4,5,99,109,112,114,116,7167,7181,7188,7193,7199,97,117,115,4,2,59,101,7176,7178,1,8757,59,1,8757,112,116,121,118,59,1,10672,115,105,59,1,1014,110,111,117,59,1,8492,4,3,97,104,119,7207,7210,7213,59,1,946,59,1,8502,101,101,110,59,1,8812,114,59,3,55349,56607,103,4,7,99,111,115,116,117,118,119,7241,7262,7288,7305,7328,7335,7340,4,3,97,105,117,7249,7253,7258,112,59,1,8898,114,99,59,1,9711,112,59,1,8899,4,3,100,112,116,7270,7275,7281,111,116,59,1,10752,108,117,115,59,1,10753,105,109,101,115,59,1,10754,4,2,113,116,7294,7300,99,117,112,59,1,10758,97,114,59,1,9733,114,105,97,110,103,108,101,4,2,100,117,7318,7324,111,119,110,59,1,9661,112,59,1,9651,112,108,117,115,59,1,10756,101,101,59,1,8897,101,100,103,101,59,1,8896,97,114,111,119,59,1,10509,4,3,97,107,111,7362,7436,7458,4,2,99,110,7368,7432,107,4,3,108,115,116,7377,7386,7394,111,122,101,110,103,101,59,1,10731,113,117,97,114,101,59,1,9642,114,105,97,110,103,108,101,4,4,59,100,108,114,7411,7413,7419,7425,1,9652,111,119,110,59,1,9662,101,102,116,59,1,9666,105,103,104,116,59,1,9656,107,59,1,9251,4,2,49,51,7442,7454,4,2,50,52,7448,7451,59,1,9618,59,1,9617,52,59,1,9619,99,107,59,1,9608,4,2,101,111,7469,7485,4,2,59,113,7475,7478,3,61,8421,117,105,118,59,3,8801,8421,116,59,1,8976,4,4,112,116,119,120,7499,7504,7517,7523,102,59,3,55349,56659,4,2,59,116,7510,7512,1,8869,111,109,59,1,8869,116,105,101,59,1,8904,4,12,68,72,85,86,98,100,104,109,112,116,117,118,7549,7571,7597,7619,7655,7660,7682,7708,7715,7721,7728,7750,4,4,76,82,108,114,7559,7562,7565,7568,59,1,9559,59,1,9556,59,1,9558,59,1,9555,4,5,59,68,85,100,117,7583,7585,7588,7591,7594,1,9552,59,1,9574,59,1,9577,59,1,9572,59,1,9575,4,4,76,82,108,114,7607,7610,7613,7616,59,1,9565,59,1,9562,59,1,9564,59,1,9561,4,7,59,72,76,82,104,108,114,7635,7637,7640,7643,7646,7649,7652,1,9553,59,1,9580,59,1,9571,59,1,9568,59,1,9579,59,1,9570,59,1,9567,111,120,59,1,10697,4,4,76,82,108,114,7670,7673,7676,7679,59,1,9557,59,1,9554,59,1,9488,59,1,9484,4,5,59,68,85,100,117,7694,7696,7699,7702,7705,1,9472,59,1,9573,59,1,9576,59,1,9516,59,1,9524,105,110,117,115,59,1,8863,108,117,115,59,1,8862,105,109,101,115,59,1,8864,4,4,76,82,108,114,7738,7741,7744,7747,59,1,9563,59,1,9560,59,1,9496,59,1,9492,4,7,59,72,76,82,104,108,114,7766,7768,7771,7774,7777,7780,7783,1,9474,59,1,9578,59,1,9569,59,1,9566,59,1,9532,59,1,9508,59,1,9500,114,105,109,101,59,1,8245,4,2,101,118,7799,7804,118,101,59,1,728,98,97,114,5,166,1,59,7812,1,166,4,4,99,101,105,111,7824,7829,7834,7846,114,59,3,55349,56503,109,105,59,1,8271,109,4,2,59,101,7841,7843,1,8765,59,1,8909,108,4,3,59,98,104,7855,7857,7860,1,92,59,1,10693,115,117,98,59,1,10184,4,2,108,109,7872,7885,108,4,2,59,101,7879,7881,1,8226,116,59,1,8226,112,4,3,59,69,101,7894,7896,7899,1,8782,59,1,10926,4,2,59,113,7905,7907,1,8783,59,1,8783,4,15,97,99,100,101,102,104,105,108,111,114,115,116,117,119,121,7942,8021,8075,8080,8121,8126,8157,8279,8295,8430,8446,8485,8491,8707,8726,4,3,99,112,114,7950,7956,8007,117,116,101,59,1,263,4,6,59,97,98,99,100,115,7970,7972,7977,7984,7998,8003,1,8745,110,100,59,1,10820,114,99,117,112,59,1,10825,4,2,97,117,7990,7994,112,59,1,10827,112,59,1,10823,111,116,59,1,10816,59,3,8745,65024,4,2,101,111,8013,8017,116,59,1,8257,110,59,1,711,4,4,97,101,105,117,8031,8046,8056,8061,4,2,112,114,8037,8041,115,59,1,10829,111,110,59,1,269,100,105,108,5,231,1,59,8054,1,231,114,99,59,1,265,112,115,4,2,59,115,8069,8071,1,10828,109,59,1,10832,111,116,59,1,267,4,3,100,109,110,8088,8097,8104,105,108,5,184,1,59,8095,1,184,112,116,121,118,59,1,10674,116,5,162,2,59,101,8112,8114,1,162,114,100,111,116,59,1,183,114,59,3,55349,56608,4,3,99,101,105,8134,8138,8154,121,59,1,1095,99,107,4,2,59,109,8146,8148,1,10003,97,114,107,59,1,10003,59,1,967,114,4,7,59,69,99,101,102,109,115,8174,8176,8179,8258,8261,8268,8273,1,9675,59,1,10691,4,3,59,101,108,8187,8189,8193,1,710,113,59,1,8791,101,4,2,97,100,8200,8223,114,114,111,119,4,2,108,114,8210,8216,101,102,116,59,1,8634,105,103,104,116,59,1,8635,4,5,82,83,97,99,100,8235,8238,8241,8246,8252,59,1,174,59,1,9416,115,116,59,1,8859,105,114,99,59,1,8858,97,115,104,59,1,8861,59,1,8791,110,105,110,116,59,1,10768,105,100,59,1,10991,99,105,114,59,1,10690,117,98,115,4,2,59,117,8288,8290,1,9827,105,116,59,1,9827,4,4,108,109,110,112,8305,8326,8376,8400,111,110,4,2,59,101,8313,8315,1,58,4,2,59,113,8321,8323,1,8788,59,1,8788,4,2,109,112,8332,8344,97,4,2,59,116,8339,8341,1,44,59,1,64,4,3,59,102,108,8352,8354,8358,1,8705,110,59,1,8728,101,4,2,109,120,8365,8371,101,110,116,59,1,8705,101,115,59,1,8450,4,2,103,105,8382,8395,4,2,59,100,8388,8390,1,8773,111,116,59,1,10861,110,116,59,1,8750,4,3,102,114,121,8408,8412,8417,59,3,55349,56660,111,100,59,1,8720,5,169,2,59,115,8424,8426,1,169,114,59,1,8471,4,2,97,111,8436,8441,114,114,59,1,8629,115,115,59,1,10007,4,2,99,117,8452,8457,114,59,3,55349,56504,4,2,98,112,8463,8474,4,2,59,101,8469,8471,1,10959,59,1,10961,4,2,59,101,8480,8482,1,10960,59,1,10962,100,111,116,59,1,8943,4,7,100,101,108,112,114,118,119,8507,8522,8536,8550,8600,8697,8702,97,114,114,4,2,108,114,8516,8519,59,1,10552,59,1,10549,4,2,112,115,8528,8532,114,59,1,8926,99,59,1,8927,97,114,114,4,2,59,112,8545,8547,1,8630,59,1,10557,4,6,59,98,99,100,111,115,8564,8566,8573,8587,8592,8596,1,8746,114,99,97,112,59,1,10824,4,2,97,117,8579,8583,112,59,1,10822,112,59,1,10826,111,116,59,1,8845,114,59,1,10821,59,3,8746,65024,4,4,97,108,114,118,8610,8623,8663,8672,114,114,4,2,59,109,8618,8620,1,8631,59,1,10556,121,4,3,101,118,119,8632,8651,8656,113,4,2,112,115,8639,8645,114,101,99,59,1,8926,117,99,99,59,1,8927,101,101,59,1,8910,101,100,103,101,59,1,8911,101,110,5,164,1,59,8670,1,164,101,97,114,114,111,119,4,2,108,114,8684,8690,101,102,116,59,1,8630,105,103,104,116,59,1,8631,101,101,59,1,8910,101,100,59,1,8911,4,2,99,105,8713,8721,111,110,105,110,116,59,1,8754,110,116,59,1,8753,108,99,116,121,59,1,9005,4,19,65,72,97,98,99,100,101,102,104,105,106,108,111,114,115,116,117,119,122,8773,8778,8783,8821,8839,8854,8887,8914,8930,8944,9036,9041,9058,9197,9227,9258,9281,9297,9305,114,114,59,1,8659,97,114,59,1,10597,4,4,103,108,114,115,8793,8799,8805,8809,103,101,114,59,1,8224,101,116,104,59,1,8504,114,59,1,8595,104,4,2,59,118,8816,8818,1,8208,59,1,8867,4,2,107,108,8827,8834,97,114,111,119,59,1,10511,97,99,59,1,733,4,2,97,121,8845,8851,114,111,110,59,1,271,59,1,1076,4,3,59,97,111,8862,8864,8880,1,8518,4,2,103,114,8870,8876,103,101,114,59,1,8225,114,59,1,8650,116,115,101,113,59,1,10871,4,3,103,108,109,8895,8902,8907,5,176,1,59,8900,1,176,116,97,59,1,948,112,116,121,118,59,1,10673,4,2,105,114,8920,8926,115,104,116,59,1,10623,59,3,55349,56609,97,114,4,2,108,114,8938,8941,59,1,8643,59,1,8642,4,5,97,101,103,115,118,8956,8986,8989,8996,9001,109,4,3,59,111,115,8965,8967,8983,1,8900,110,100,4,2,59,115,8975,8977,1,8900,117,105,116,59,1,9830,59,1,9830,59,1,168,97,109,109,97,59,1,989,105,110,59,1,8946,4,3,59,105,111,9009,9011,9031,1,247,100,101,5,247,2,59,111,9020,9022,1,247,110,116,105,109,101,115,59,1,8903,110,120,59,1,8903,99,121,59,1,1106,99,4,2,111,114,9048,9053,114,110,59,1,8990,111,112,59,1,8973,4,5,108,112,116,117,119,9070,9076,9081,9130,9144,108,97,114,59,1,36,102,59,3,55349,56661,4,5,59,101,109,112,115,9093,9095,9109,9116,9122,1,729,113,4,2,59,100,9102,9104,1,8784,111,116,59,1,8785,105,110,117,115,59,1,8760,108,117,115,59,1,8724,113,117,97,114,101,59,1,8865,98,108,101,98,97,114,119,101,100,103,101,59,1,8966,110,4,3,97,100,104,9153,9160,9172,114,114,111,119,59,1,8595,111,119,110,97,114,114,111,119,115,59,1,8650,97,114,112,111,111,110,4,2,108,114,9184,9190,101,102,116,59,1,8643,105,103,104,116,59,1,8642,4,2,98,99,9203,9211,107,97,114,111,119,59,1,10512,4,2,111,114,9217,9222,114,110,59,1,8991,111,112,59,1,8972,4,3,99,111,116,9235,9248,9252,4,2,114,121,9241,9245,59,3,55349,56505,59,1,1109,108,59,1,10742,114,111,107,59,1,273,4,2,100,114,9264,9269,111,116,59,1,8945,105,4,2,59,102,9276,9278,1,9663,59,1,9662,4,2,97,104,9287,9292,114,114,59,1,8693,97,114,59,1,10607,97,110,103,108,101,59,1,10662,4,2,99,105,9311,9315,121,59,1,1119,103,114,97,114,114,59,1,10239,4,18,68,97,99,100,101,102,103,108,109,110,111,112,113,114,115,116,117,120,9361,9376,9398,9439,9444,9447,9462,9495,9531,9585,9598,9614,9659,9755,9771,9792,9808,9826,4,2,68,111,9367,9372,111,116,59,1,10871,116,59,1,8785,4,2,99,115,9382,9392,117,116,101,5,233,1,59,9390,1,233,116,101,114,59,1,10862,4,4,97,105,111,121,9408,9414,9430,9436,114,111,110,59,1,283,114,4,2,59,99,9421,9423,1,8790,5,234,1,59,9428,1,234,108,111,110,59,1,8789,59,1,1101,111,116,59,1,279,59,1,8519,4,2,68,114,9453,9458,111,116,59,1,8786,59,3,55349,56610,4,3,59,114,115,9470,9472,9482,1,10906,97,118,101,5,232,1,59,9480,1,232,4,2,59,100,9488,9490,1,10902,111,116,59,1,10904,4,4,59,105,108,115,9505,9507,9515,9518,1,10905,110,116,101,114,115,59,1,9191,59,1,8467,4,2,59,100,9524,9526,1,10901,111,116,59,1,10903,4,3,97,112,115,9539,9544,9564,99,114,59,1,275,116,121,4,3,59,115,118,9554,9556,9561,1,8709,101,116,59,1,8709,59,1,8709,112,4,2,49,59,9571,9583,4,2,51,52,9577,9580,59,1,8196,59,1,8197,1,8195,4,2,103,115,9591,9594,59,1,331,112,59,1,8194,4,2,103,112,9604,9609,111,110,59,1,281,102,59,3,55349,56662,4,3,97,108,115,9622,9635,9640,114,4,2,59,115,9629,9631,1,8917,108,59,1,10723,117,115,59,1,10865,105,4,3,59,108,118,9649,9651,9656,1,949,111,110,59,1,949,59,1,1013,4,4,99,115,117,118,9669,9686,9716,9747,4,2,105,111,9675,9680,114,99,59,1,8790,108,111,110,59,1,8789,4,2,105,108,9692,9696,109,59,1,8770,97,110,116,4,2,103,108,9705,9710,116,114,59,1,10902,101,115,115,59,1,10901,4,3,97,101,105,9724,9729,9734,108,115,59,1,61,115,116,59,1,8799,118,4,2,59,68,9741,9743,1,8801,68,59,1,10872,112,97,114,115,108,59,1,10725,4,2,68,97,9761,9766,111,116,59,1,8787,114,114,59,1,10609,4,3,99,100,105,9779,9783,9788,114,59,1,8495,111,116,59,1,8784,109,59,1,8770,4,2,97,104,9798,9801,59,1,951,5,240,1,59,9806,1,240,4,2,109,114,9814,9822,108,5,235,1,59,9820,1,235,111,59,1,8364,4,3,99,105,112,9834,9838,9843,108,59,1,33,115,116,59,1,8707,4,2,101,111,9849,9859,99,116,97,116,105,111,110,59,1,8496,110,101,110,116,105,97,108,101,59,1,8519,4,12,97,99,101,102,105,106,108,110,111,112,114,115,9896,9910,9914,9921,9954,9960,9967,9989,9994,10027,10036,10164,108,108,105,110,103,100,111,116,115,101,113,59,1,8786,121,59,1,1092,109,97,108,101,59,1,9792,4,3,105,108,114,9929,9935,9950,108,105,103,59,1,64259,4,2,105,108,9941,9945,103,59,1,64256,105,103,59,1,64260,59,3,55349,56611,108,105,103,59,1,64257,108,105,103,59,3,102,106,4,3,97,108,116,9975,9979,9984,116,59,1,9837,105,103,59,1,64258,110,115,59,1,9649,111,102,59,1,402,4,2,112,114,10000,10005,102,59,3,55349,56663,4,2,97,107,10011,10016,108,108,59,1,8704,4,2,59,118,10022,10024,1,8916,59,1,10969,97,114,116,105,110,116,59,1,10765,4,2,97,111,10042,10159,4,2,99,115,10048,10155,4,6,49,50,51,52,53,55,10062,10102,10114,10135,10139,10151,4,6,50,51,52,53,54,56,10076,10083,10086,10093,10096,10099,5,189,1,59,10081,1,189,59,1,8531,5,188,1,59,10091,1,188,59,1,8533,59,1,8537,59,1,8539,4,2,51,53,10108,10111,59,1,8532,59,1,8534,4,3,52,53,56,10122,10129,10132,5,190,1,59,10127,1,190,59,1,8535,59,1,8540,53,59,1,8536,4,2,54,56,10145,10148,59,1,8538,59,1,8541,56,59,1,8542,108,59,1,8260,119,110,59,1,8994,99,114,59,3,55349,56507,4,17,69,97,98,99,100,101,102,103,105,106,108,110,111,114,115,116,118,10206,10217,10247,10254,10268,10273,10358,10363,10374,10380,10385,10406,10458,10464,10470,10497,10610,4,2,59,108,10212,10214,1,8807,59,1,10892,4,3,99,109,112,10225,10231,10244,117,116,101,59,1,501,109,97,4,2,59,100,10239,10241,1,947,59,1,989,59,1,10886,114,101,118,101,59,1,287,4,2,105,121,10260,10265,114,99,59,1,285,59,1,1075,111,116,59,1,289,4,4,59,108,113,115,10283,10285,10288,10308,1,8805,59,1,8923,4,3,59,113,115,10296,10298,10301,1,8805,59,1,8807,108,97,110,116,59,1,10878,4,4,59,99,100,108,10318,10320,10324,10345,1,10878,99,59,1,10921,111,116,4,2,59,111,10332,10334,1,10880,4,2,59,108,10340,10342,1,10882,59,1,10884,4,2,59,101,10351,10354,3,8923,65024,115,59,1,10900,114,59,3,55349,56612,4,2,59,103,10369,10371,1,8811,59,1,8921,109,101,108,59,1,8503,99,121,59,1,1107,4,4,59,69,97,106,10395,10397,10400,10403,1,8823,59,1,10898,59,1,10917,59,1,10916,4,4,69,97,101,115,10416,10419,10434,10453,59,1,8809,112,4,2,59,112,10426,10428,1,10890,114,111,120,59,1,10890,4,2,59,113,10440,10442,1,10888,4,2,59,113,10448,10450,1,10888,59,1,8809,105,109,59,1,8935,112,102,59,3,55349,56664,97,118,101,59,1,96,4,2,99,105,10476,10480,114,59,1,8458,109,4,3,59,101,108,10489,10491,10494,1,8819,59,1,10894,59,1,10896,5,62,6,59,99,100,108,113,114,10512,10514,10527,10532,10538,10545,1,62,4,2,99,105,10520,10523,59,1,10919,114,59,1,10874,111,116,59,1,8919,80,97,114,59,1,10645,117,101,115,116,59,1,10876,4,5,97,100,101,108,115,10557,10574,10579,10599,10605,4,2,112,114,10563,10570,112,114,111,120,59,1,10886,114,59,1,10616,111,116,59,1,8919,113,4,2,108,113,10586,10592,101,115,115,59,1,8923,108,101,115,115,59,1,10892,101,115,115,59,1,8823,105,109,59,1,8819,4,2,101,110,10616,10626,114,116,110,101,113,113,59,3,8809,65024,69,59,3,8809,65024,4,10,65,97,98,99,101,102,107,111,115,121,10653,10658,10713,10718,10724,10760,10765,10786,10850,10875,114,114,59,1,8660,4,4,105,108,109,114,10668,10674,10678,10684,114,115,112,59,1,8202,102,59,1,189,105,108,116,59,1,8459,4,2,100,114,10690,10695,99,121,59,1,1098,4,3,59,99,119,10703,10705,10710,1,8596,105,114,59,1,10568,59,1,8621,97,114,59,1,8463,105,114,99,59,1,293,4,3,97,108,114,10732,10748,10754,114,116,115,4,2,59,117,10741,10743,1,9829,105,116,59,1,9829,108,105,112,59,1,8230,99,111,110,59,1,8889,114,59,3,55349,56613,115,4,2,101,119,10772,10779,97,114,111,119,59,1,10533,97,114,111,119,59,1,10534,4,5,97,109,111,112,114,10798,10803,10809,10839,10844,114,114,59,1,8703,116,104,116,59,1,8763,107,4,2,108,114,10816,10827,101,102,116,97,114,114,111,119,59,1,8617,105,103,104,116,97,114,114,111,119,59,1,8618,102,59,3,55349,56665,98,97,114,59,1,8213,4,3,99,108,116,10858,10863,10869,114,59,3,55349,56509,97,115,104,59,1,8463,114,111,107,59,1,295,4,2,98,112,10881,10887,117,108,108,59,1,8259,104,101,110,59,1,8208,4,15,97,99,101,102,103,105,106,109,110,111,112,113,115,116,117,10925,10936,10958,10977,10990,11001,11039,11045,11101,11192,11220,11226,11237,11285,11299,99,117,116,101,5,237,1,59,10934,1,237,4,3,59,105,121,10944,10946,10955,1,8291,114,99,5,238,1,59,10953,1,238,59,1,1080,4,2,99,120,10964,10968,121,59,1,1077,99,108,5,161,1,59,10975,1,161,4,2,102,114,10983,10986,59,1,8660,59,3,55349,56614,114,97,118,101,5,236,1,59,10999,1,236,4,4,59,105,110,111,11011,11013,11028,11034,1,8520,4,2,105,110,11019,11024,110,116,59,1,10764,116,59,1,8749,102,105,110,59,1,10716,116,97,59,1,8489,108,105,103,59,1,307,4,3,97,111,112,11053,11092,11096,4,3,99,103,116,11061,11065,11088,114,59,1,299,4,3,101,108,112,11073,11076,11082,59,1,8465,105,110,101,59,1,8464,97,114,116,59,1,8465,104,59,1,305,102,59,1,8887,101,100,59,1,437,4,5,59,99,102,111,116,11113,11115,11121,11136,11142,1,8712,97,114,101,59,1,8453,105,110,4,2,59,116,11129,11131,1,8734,105,101,59,1,10717,100,111,116,59,1,305,4,5,59,99,101,108,112,11154,11156,11161,11179,11186,1,8747,97,108,59,1,8890,4,2,103,114,11167,11173,101,114,115,59,1,8484,99,97,108,59,1,8890,97,114,104,107,59,1,10775,114,111,100,59,1,10812,4,4,99,103,112,116,11202,11206,11211,11216,121,59,1,1105,111,110,59,1,303,102,59,3,55349,56666,97,59,1,953,114,111,100,59,1,10812,117,101,115,116,5,191,1,59,11235,1,191,4,2,99,105,11243,11248,114,59,3,55349,56510,110,4,5,59,69,100,115,118,11261,11263,11266,11271,11282,1,8712,59,1,8953,111,116,59,1,8949,4,2,59,118,11277,11279,1,8948,59,1,8947,59,1,8712,4,2,59,105,11291,11293,1,8290,108,100,101,59,1,297,4,2,107,109,11305,11310,99,121,59,1,1110,108,5,239,1,59,11316,1,239,4,6,99,102,109,111,115,117,11332,11346,11351,11357,11363,11380,4,2,105,121,11338,11343,114,99,59,1,309,59,1,1081,114,59,3,55349,56615,97,116,104,59,1,567,112,102,59,3,55349,56667,4,2,99,101,11369,11374,114,59,3,55349,56511,114,99,121,59,1,1112,107,99,121,59,1,1108,4,8,97,99,102,103,104,106,111,115,11404,11418,11433,11438,11445,11450,11455,11461,112,112,97,4,2,59,118,11413,11415,1,954,59,1,1008,4,2,101,121,11424,11430,100,105,108,59,1,311,59,1,1082,114,59,3,55349,56616,114,101,101,110,59,1,312,99,121,59,1,1093,99,121,59,1,1116,112,102,59,3,55349,56668,99,114,59,3,55349,56512,4,23,65,66,69,72,97,98,99,100,101,102,103,104,106,108,109,110,111,112,114,115,116,117,118,11515,11538,11544,11555,11560,11721,11780,11818,11868,12136,12160,12171,12203,12208,12246,12275,12327,12509,12523,12569,12641,12732,12752,4,3,97,114,116,11523,11528,11532,114,114,59,1,8666,114,59,1,8656,97,105,108,59,1,10523,97,114,114,59,1,10510,4,2,59,103,11550,11552,1,8806,59,1,10891,97,114,59,1,10594,4,9,99,101,103,109,110,112,113,114,116,11580,11586,11594,11600,11606,11624,11627,11636,11694,117,116,101,59,1,314,109,112,116,121,118,59,1,10676,114,97,110,59,1,8466,98,100,97,59,1,955,103,4,3,59,100,108,11615,11617,11620,1,10216,59,1,10641,101,59,1,10216,59,1,10885,117,111,5,171,1,59,11634,1,171,114,4,8,59,98,102,104,108,112,115,116,11655,11657,11669,11673,11677,11681,11685,11690,1,8592,4,2,59,102,11663,11665,1,8676,115,59,1,10527,115,59,1,10525,107,59,1,8617,112,59,1,8619,108,59,1,10553,105,109,59,1,10611,108,59,1,8610,4,3,59,97,101,11702,11704,11709,1,10923,105,108,59,1,10521,4,2,59,115,11715,11717,1,10925,59,3,10925,65024,4,3,97,98,114,11729,11734,11739,114,114,59,1,10508,114,107,59,1,10098,4,2,97,107,11745,11758,99,4,2,101,107,11752,11755,59,1,123,59,1,91,4,2,101,115,11764,11767,59,1,10635,108,4,2,100,117,11774,11777,59,1,10639,59,1,10637,4,4,97,101,117,121,11790,11796,11811,11815,114,111,110,59,1,318,4,2,100,105,11802,11807,105,108,59,1,316,108,59,1,8968,98,59,1,123,59,1,1083,4,4,99,113,114,115,11828,11832,11845,11864,97,59,1,10550,117,111,4,2,59,114,11840,11842,1,8220,59,1,8222,4,2,100,117,11851,11857,104,97,114,59,1,10599,115,104,97,114,59,1,10571,104,59,1,8626,4,5,59,102,103,113,115,11880,11882,12008,12011,12031,1,8804,116,4,5,97,104,108,114,116,11895,11913,11935,11947,11996,114,114,111,119,4,2,59,116,11905,11907,1,8592,97,105,108,59,1,8610,97,114,112,111,111,110,4,2,100,117,11925,11931,111,119,110,59,1,8637,112,59,1,8636,101,102,116,97,114,114,111,119,115,59,1,8647,105,103,104,116,4,3,97,104,115,11959,11974,11984,114,114,111,119,4,2,59,115,11969,11971,1,8596,59,1,8646,97,114,112,111,111,110,115,59,1,8651,113,117,105,103,97,114,114,111,119,59,1,8621,104,114,101,101,116,105,109,101,115,59,1,8907,59,1,8922,4,3,59,113,115,12019,12021,12024,1,8804,59,1,8806,108,97,110,116,59,1,10877,4,5,59,99,100,103,115,12043,12045,12049,12070,12083,1,10877,99,59,1,10920,111,116,4,2,59,111,12057,12059,1,10879,4,2,59,114,12065,12067,1,10881,59,1,10883,4,2,59,101,12076,12079,3,8922,65024,115,59,1,10899,4,5,97,100,101,103,115,12095,12103,12108,12126,12131,112,112,114,111,120,59,1,10885,111,116,59,1,8918,113,4,2,103,113,12115,12120,116,114,59,1,8922,103,116,114,59,1,10891,116,114,59,1,8822,105,109,59,1,8818,4,3,105,108,114,12144,12150,12156,115,104,116,59,1,10620,111,111,114,59,1,8970,59,3,55349,56617,4,2,59,69,12166,12168,1,8822,59,1,10897,4,2,97,98,12177,12198,114,4,2,100,117,12184,12187,59,1,8637,4,2,59,108,12193,12195,1,8636,59,1,10602,108,107,59,1,9604,99,121,59,1,1113,4,5,59,97,99,104,116,12220,12222,12227,12235,12241,1,8810,114,114,59,1,8647,111,114,110,101,114,59,1,8990,97,114,100,59,1,10603,114,105,59,1,9722,4,2,105,111,12252,12258,100,111,116,59,1,320,117,115,116,4,2,59,97,12267,12269,1,9136,99,104,101,59,1,9136,4,4,69,97,101,115,12285,12288,12303,12322,59,1,8808,112,4,2,59,112,12295,12297,1,10889,114,111,120,59,1,10889,4,2,59,113,12309,12311,1,10887,4,2,59,113,12317,12319,1,10887,59,1,8808,105,109,59,1,8934,4,8,97,98,110,111,112,116,119,122,12345,12359,12364,12421,12446,12467,12474,12490,4,2,110,114,12351,12355,103,59,1,10220,114,59,1,8701,114,107,59,1,10214,103,4,3,108,109,114,12373,12401,12409,101,102,116,4,2,97,114,12382,12389,114,114,111,119,59,1,10229,105,103,104,116,97,114,114,111,119,59,1,10231,97,112,115,116,111,59,1,10236,105,103,104,116,97,114,114,111,119,59,1,10230,112,97,114,114,111,119,4,2,108,114,12433,12439,101,102,116,59,1,8619,105,103,104,116,59,1,8620,4,3,97,102,108,12454,12458,12462,114,59,1,10629,59,3,55349,56669,117,115,59,1,10797,105,109,101,115,59,1,10804,4,2,97,98,12480,12485,115,116,59,1,8727,97,114,59,1,95,4,3,59,101,102,12498,12500,12506,1,9674,110,103,101,59,1,9674,59,1,10731,97,114,4,2,59,108,12517,12519,1,40,116,59,1,10643,4,5,97,99,104,109,116,12535,12540,12548,12561,12564,114,114,59,1,8646,111,114,110,101,114,59,1,8991,97,114,4,2,59,100,12556,12558,1,8651,59,1,10605,59,1,8206,114,105,59,1,8895,4,6,97,99,104,105,113,116,12583,12589,12594,12597,12614,12635,113,117,111,59,1,8249,114,59,3,55349,56513,59,1,8624,109,4,3,59,101,103,12606,12608,12611,1,8818,59,1,10893,59,1,10895,4,2,98,117,12620,12623,59,1,91,111,4,2,59,114,12630,12632,1,8216,59,1,8218,114,111,107,59,1,322,5,60,8,59,99,100,104,105,108,113,114,12660,12662,12675,12680,12686,12692,12698,12705,1,60,4,2,99,105,12668,12671,59,1,10918,114,59,1,10873,111,116,59,1,8918,114,101,101,59,1,8907,109,101,115,59,1,8905,97,114,114,59,1,10614,117,101,115,116,59,1,10875,4,2,80,105,12711,12716,97,114,59,1,10646,4,3,59,101,102,12724,12726,12729,1,9667,59,1,8884,59,1,9666,114,4,2,100,117,12739,12746,115,104,97,114,59,1,10570,104,97,114,59,1,10598,4,2,101,110,12758,12768,114,116,110,101,113,113,59,3,8808,65024,69,59,3,8808,65024,4,14,68,97,99,100,101,102,104,105,108,110,111,112,115,117,12803,12809,12893,12908,12914,12928,12933,12937,13011,13025,13032,13049,13052,13069,68,111,116,59,1,8762,4,4,99,108,112,114,12819,12827,12849,12887,114,5,175,1,59,12825,1,175,4,2,101,116,12833,12836,59,1,9794,4,2,59,101,12842,12844,1,10016,115,101,59,1,10016,4,2,59,115,12855,12857,1,8614,116,111,4,4,59,100,108,117,12869,12871,12877,12883,1,8614,111,119,110,59,1,8615,101,102,116,59,1,8612,112,59,1,8613,107,101,114,59,1,9646,4,2,111,121,12899,12905,109,109,97,59,1,10793,59,1,1084,97,115,104,59,1,8212,97,115,117,114,101,100,97,110,103,108,101,59,1,8737,114,59,3,55349,56618,111,59,1,8487,4,3,99,100,110,12945,12954,12985,114,111,5,181,1,59,12952,1,181,4,4,59,97,99,100,12964,12966,12971,12976,1,8739,115,116,59,1,42,105,114,59,1,10992,111,116,5,183,1,59,12983,1,183,117,115,4,3,59,98,100,12995,12997,13000,1,8722,59,1,8863,4,2,59,117,13006,13008,1,8760,59,1,10794,4,2,99,100,13017,13021,112,59,1,10971,114,59,1,8230,112,108,117,115,59,1,8723,4,2,100,112,13038,13044,101,108,115,59,1,8871,102,59,3,55349,56670,59,1,8723,4,2,99,116,13058,13063,114,59,3,55349,56514,112,111,115,59,1,8766,4,3,59,108,109,13077,13079,13087,1,956,116,105,109,97,112,59,1,8888,97,112,59,1,8888,4,24,71,76,82,86,97,98,99,100,101,102,103,104,105,106,108,109,111,112,114,115,116,117,118,119,13142,13165,13217,13229,13247,13330,13359,13414,13420,13508,13513,13579,13602,13626,13631,13762,13767,13855,13936,13995,14214,14285,14312,14432,4,2,103,116,13148,13152,59,3,8921,824,4,2,59,118,13158,13161,3,8811,8402,59,3,8811,824,4,3,101,108,116,13173,13200,13204,102,116,4,2,97,114,13181,13188,114,114,111,119,59,1,8653,105,103,104,116,97,114,114,111,119,59,1,8654,59,3,8920,824,4,2,59,118,13210,13213,3,8810,8402,59,3,8810,824,105,103,104,116,97,114,114,111,119,59,1,8655,4,2,68,100,13235,13241,97,115,104,59,1,8879,97,115,104,59,1,8878,4,5,98,99,110,112,116,13259,13264,13270,13275,13308,108,97,59,1,8711,117,116,101,59,1,324,103,59,3,8736,8402,4,5,59,69,105,111,112,13287,13289,13293,13298,13302,1,8777,59,3,10864,824,100,59,3,8779,824,115,59,1,329,114,111,120,59,1,8777,117,114,4,2,59,97,13316,13318,1,9838,108,4,2,59,115,13325,13327,1,9838,59,1,8469,4,2,115,117,13336,13344,112,5,160,1,59,13342,1,160,109,112,4,2,59,101,13352,13355,3,8782,824,59,3,8783,824,4,5,97,101,111,117,121,13371,13385,13391,13407,13411,4,2,112,114,13377,13380,59,1,10819,111,110,59,1,328,100,105,108,59,1,326,110,103,4,2,59,100,13399,13401,1,8775,111,116,59,3,10861,824,112,59,1,10818,59,1,1085,97,115,104,59,1,8211,4,7,59,65,97,100,113,115,120,13436,13438,13443,13466,13472,13478,13494,1,8800,114,114,59,1,8663,114,4,2,104,114,13450,13454,107,59,1,10532,4,2,59,111,13460,13462,1,8599,119,59,1,8599,111,116,59,3,8784,824,117,105,118,59,1,8802,4,2,101,105,13484,13489,97,114,59,1,10536,109,59,3,8770,824,105,115,116,4,2,59,115,13503,13505,1,8708,59,1,8708,114,59,3,55349,56619,4,4,69,101,115,116,13523,13527,13563,13568,59,3,8807,824,4,3,59,113,115,13535,13537,13559,1,8817,4,3,59,113,115,13545,13547,13551,1,8817,59,3,8807,824,108,97,110,116,59,3,10878,824,59,3,10878,824,105,109,59,1,8821,4,2,59,114,13574,13576,1,8815,59,1,8815,4,3,65,97,112,13587,13592,13597,114,114,59,1,8654,114,114,59,1,8622,97,114,59,1,10994,4,3,59,115,118,13610,13612,13623,1,8715,4,2,59,100,13618,13620,1,8956,59,1,8954,59,1,8715,99,121,59,1,1114,4,7,65,69,97,100,101,115,116,13647,13652,13656,13661,13665,13737,13742,114,114,59,1,8653,59,3,8806,824,114,114,59,1,8602,114,59,1,8229,4,4,59,102,113,115,13675,13677,13703,13725,1,8816,116,4,2,97,114,13684,13691,114,114,111,119,59,1,8602,105,103,104,116,97,114,114,111,119,59,1,8622,4,3,59,113,115,13711,13713,13717,1,8816,59,3,8806,824,108,97,110,116,59,3,10877,824,4,2,59,115,13731,13734,3,10877,824,59,1,8814,105,109,59,1,8820,4,2,59,114,13748,13750,1,8814,105,4,2,59,101,13757,13759,1,8938,59,1,8940,105,100,59,1,8740,4,2,112,116,13773,13778,102,59,3,55349,56671,5,172,3,59,105,110,13787,13789,13829,1,172,110,4,4,59,69,100,118,13800,13802,13806,13812,1,8713,59,3,8953,824,111,116,59,3,8949,824,4,3,97,98,99,13820,13823,13826,59,1,8713,59,1,8951,59,1,8950,105,4,2,59,118,13836,13838,1,8716,4,3,97,98,99,13846,13849,13852,59,1,8716,59,1,8958,59,1,8957,4,3,97,111,114,13863,13892,13899,114,4,4,59,97,115,116,13874,13876,13883,13888,1,8742,108,108,101,108,59,1,8742,108,59,3,11005,8421,59,3,8706,824,108,105,110,116,59,1,10772,4,3,59,99,101,13907,13909,13914,1,8832,117,101,59,1,8928,4,2,59,99,13920,13923,3,10927,824,4,2,59,101,13929,13931,1,8832,113,59,3,10927,824,4,4,65,97,105,116,13946,13951,13971,13982,114,114,59,1,8655,114,114,4,3,59,99,119,13961,13963,13967,1,8603,59,3,10547,824,59,3,8605,824,103,104,116,97,114,114,111,119,59,1,8603,114,105,4,2,59,101,13990,13992,1,8939,59,1,8941,4,7,99,104,105,109,112,113,117,14011,14036,14060,14080,14085,14090,14106,4,4,59,99,101,114,14021,14023,14028,14032,1,8833,117,101,59,1,8929,59,3,10928,824,59,3,55349,56515,111,114,116,4,2,109,112,14045,14050,105,100,59,1,8740,97,114,97,108,108,101,108,59,1,8742,109,4,2,59,101,14067,14069,1,8769,4,2,59,113,14075,14077,1,8772,59,1,8772,105,100,59,1,8740,97,114,59,1,8742,115,117,4,2,98,112,14098,14102,101,59,1,8930,101,59,1,8931,4,3,98,99,112,14114,14157,14171,4,4,59,69,101,115,14124,14126,14130,14133,1,8836,59,3,10949,824,59,1,8840,101,116,4,2,59,101,14141,14144,3,8834,8402,113,4,2,59,113,14151,14153,1,8840,59,3,10949,824,99,4,2,59,101,14164,14166,1,8833,113,59,3,10928,824,4,4,59,69,101,115,14181,14183,14187,14190,1,8837,59,3,10950,824,59,1,8841,101,116,4,2,59,101,14198,14201,3,8835,8402,113,4,2,59,113,14208,14210,1,8841,59,3,10950,824,4,4,103,105,108,114,14224,14228,14238,14242,108,59,1,8825,108,100,101,5,241,1,59,14236,1,241,103,59,1,8824,105,97,110,103,108,101,4,2,108,114,14254,14269,101,102,116,4,2,59,101,14263,14265,1,8938,113,59,1,8940,105,103,104,116,4,2,59,101,14279,14281,1,8939,113,59,1,8941,4,2,59,109,14291,14293,1,957,4,3,59,101,115,14301,14303,14308,1,35,114,111,59,1,8470,112,59,1,8199,4,9,68,72,97,100,103,105,108,114,115,14332,14338,14344,14349,14355,14369,14376,14408,14426,97,115,104,59,1,8877,97,114,114,59,1,10500,112,59,3,8781,8402,97,115,104,59,1,8876,4,2,101,116,14361,14365,59,3,8805,8402,59,3,62,8402,110,102,105,110,59,1,10718,4,3,65,101,116,14384,14389,14393,114,114,59,1,10498,59,3,8804,8402,4,2,59,114,14399,14402,3,60,8402,105,101,59,3,8884,8402,4,2,65,116,14414,14419,114,114,59,1,10499,114,105,101,59,3,8885,8402,105,109,59,3,8764,8402,4,3,65,97,110,14440,14445,14468,114,114,59,1,8662,114,4,2,104,114,14452,14456,107,59,1,10531,4,2,59,111,14462,14464,1,8598,119,59,1,8598,101,97,114,59,1,10535,4,18,83,97,99,100,101,102,103,104,105,108,109,111,112,114,115,116,117,118,14512,14515,14535,14560,14597,14603,14618,14643,14657,14662,14701,14741,14747,14769,14851,14877,14907,14916,59,1,9416,4,2,99,115,14521,14531,117,116,101,5,243,1,59,14529,1,243,116,59,1,8859,4,2,105,121,14541,14557,114,4,2,59,99,14548,14550,1,8858,5,244,1,59,14555,1,244,59,1,1086,4,5,97,98,105,111,115,14572,14577,14583,14587,14591,115,104,59,1,8861,108,97,99,59,1,337,118,59,1,10808,116,59,1,8857,111,108,100,59,1,10684,108,105,103,59,1,339,4,2,99,114,14609,14614,105,114,59,1,10687,59,3,55349,56620,4,3,111,114,116,14626,14630,14640,110,59,1,731,97,118,101,5,242,1,59,14638,1,242,59,1,10689,4,2,98,109,14649,14654,97,114,59,1,10677,59,1,937,110,116,59,1,8750,4,4,97,99,105,116,14672,14677,14693,14698,114,114,59,1,8634,4,2,105,114,14683,14687,114,59,1,10686,111,115,115,59,1,10683,110,101,59,1,8254,59,1,10688,4,3,97,101,105,14709,14714,14719,99,114,59,1,333,103,97,59,1,969,4,3,99,100,110,14727,14733,14736,114,111,110,59,1,959,59,1,10678,117,115,59,1,8854,112,102,59,3,55349,56672,4,3,97,101,108,14755,14759,14764,114,59,1,10679,114,112,59,1,10681,117,115,59,1,8853,4,7,59,97,100,105,111,115,118,14785,14787,14792,14831,14837,14841,14848,1,8744,114,114,59,1,8635,4,4,59,101,102,109,14802,14804,14817,14824,1,10845,114,4,2,59,111,14811,14813,1,8500,102,59,1,8500,5,170,1,59,14822,1,170,5,186,1,59,14829,1,186,103,111,102,59,1,8886,114,59,1,10838,108,111,112,101,59,1,10839,59,1,10843,4,3,99,108,111,14859,14863,14873,114,59,1,8500,97,115,104,5,248,1,59,14871,1,248,108,59,1,8856,105,4,2,108,109,14884,14893,100,101,5,245,1,59,14891,1,245,101,115,4,2,59,97,14901,14903,1,8855,115,59,1,10806,109,108,5,246,1,59,14914,1,246,98,97,114,59,1,9021,4,12,97,99,101,102,104,105,108,109,111,114,115,117,14948,14992,14996,15033,15038,15068,15090,15189,15192,15222,15427,15441,114,4,4,59,97,115,116,14959,14961,14976,14989,1,8741,5,182,2,59,108,14968,14970,1,182,108,101,108,59,1,8741,4,2,105,108,14982,14986,109,59,1,10995,59,1,11005,59,1,8706,121,59,1,1087,114,4,5,99,105,109,112,116,15009,15014,15019,15024,15027,110,116,59,1,37,111,100,59,1,46,105,108,59,1,8240,59,1,8869,101,110,107,59,1,8241,114,59,3,55349,56621,4,3,105,109,111,15046,15057,15063,4,2,59,118,15052,15054,1,966,59,1,981,109,97,116,59,1,8499,110,101,59,1,9742,4,3,59,116,118,15076,15078,15087,1,960,99,104,102,111,114,107,59,1,8916,59,1,982,4,2,97,117,15096,15119,110,4,2,99,107,15103,15115,107,4,2,59,104,15110,15112,1,8463,59,1,8462,118,59,1,8463,115,4,9,59,97,98,99,100,101,109,115,116,15140,15142,15148,15151,15156,15168,15171,15179,15184,1,43,99,105,114,59,1,10787,59,1,8862,105,114,59,1,10786,4,2,111,117,15162,15165,59,1,8724,59,1,10789,59,1,10866,110,5,177,1,59,15177,1,177,105,109,59,1,10790,119,111,59,1,10791,59,1,177,4,3,105,112,117,15200,15208,15213,110,116,105,110,116,59,1,10773,102,59,3,55349,56673,110,100,5,163,1,59,15220,1,163,4,10,59,69,97,99,101,105,110,111,115,117,15244,15246,15249,15253,15258,15334,15347,15367,15416,15421,1,8826,59,1,10931,112,59,1,10935,117,101,59,1,8828,4,2,59,99,15264,15266,1,10927,4,6,59,97,99,101,110,115,15280,15282,15290,15299,15303,15329,1,8826,112,112,114,111,120,59,1,10935,117,114,108,121,101,113,59,1,8828,113,59,1,10927,4,3,97,101,115,15311,15319,15324,112,112,114,111,120,59,1,10937,113,113,59,1,10933,105,109,59,1,8936,105,109,59,1,8830,109,101,4,2,59,115,15342,15344,1,8242,59,1,8473,4,3,69,97,115,15355,15358,15362,59,1,10933,112,59,1,10937,105,109,59,1,8936,4,3,100,102,112,15375,15378,15404,59,1,8719,4,3,97,108,115,15386,15392,15398,108,97,114,59,1,9006,105,110,101,59,1,8978,117,114,102,59,1,8979,4,2,59,116,15410,15412,1,8733,111,59,1,8733,105,109,59,1,8830,114,101,108,59,1,8880,4,2,99,105,15433,15438,114,59,3,55349,56517,59,1,968,110,99,115,112,59,1,8200,4,6,102,105,111,112,115,117,15462,15467,15472,15478,15485,15491,114,59,3,55349,56622,110,116,59,1,10764,112,102,59,3,55349,56674,114,105,109,101,59,1,8279,99,114,59,3,55349,56518,4,3,97,101,111,15499,15520,15534,116,4,2,101,105,15506,15515,114,110,105,111,110,115,59,1,8461,110,116,59,1,10774,115,116,4,2,59,101,15528,15530,1,63,113,59,1,8799,116,5,34,1,59,15540,1,34,4,21,65,66,72,97,98,99,100,101,102,104,105,108,109,110,111,112,114,115,116,117,120,15586,15609,15615,15620,15796,15855,15893,15931,15977,16001,16039,16183,16204,16222,16228,16285,16312,16318,16363,16408,16416,4,3,97,114,116,15594,15599,15603,114,114,59,1,8667,114,59,1,8658,97,105,108,59,1,10524,97,114,114,59,1,10511,97,114,59,1,10596,4,7,99,100,101,110,113,114,116,15636,15651,15656,15664,15687,15696,15770,4,2,101,117,15642,15646,59,3,8765,817,116,101,59,1,341,105,99,59,1,8730,109,112,116,121,118,59,1,10675,103,4,4,59,100,101,108,15675,15677,15680,15683,1,10217,59,1,10642,59,1,10661,101,59,1,10217,117,111,5,187,1,59,15694,1,187,114,4,11,59,97,98,99,102,104,108,112,115,116,119,15721,15723,15727,15739,15742,15746,15750,15754,15758,15763,15767,1,8594,112,59,1,10613,4,2,59,102,15733,15735,1,8677,115,59,1,10528,59,1,10547,115,59,1,10526,107,59,1,8618,112,59,1,8620,108,59,1,10565,105,109,59,1,10612,108,59,1,8611,59,1,8605,4,2,97,105,15776,15781,105,108,59,1,10522,111,4,2,59,110,15788,15790,1,8758,97,108,115,59,1,8474,4,3,97,98,114,15804,15809,15814,114,114,59,1,10509,114,107,59,1,10099,4,2,97,107,15820,15833,99,4,2,101,107,15827,15830,59,1,125,59,1,93,4,2,101,115,15839,15842,59,1,10636,108,4,2,100,117,15849,15852,59,1,10638,59,1,10640,4,4,97,101,117,121,15865,15871,15886,15890,114,111,110,59,1,345,4,2,100,105,15877,15882,105,108,59,1,343,108,59,1,8969,98,59,1,125,59,1,1088,4,4,99,108,113,115,15903,15907,15914,15927,97,59,1,10551,100,104,97,114,59,1,10601,117,111,4,2,59,114,15922,15924,1,8221,59,1,8221,104,59,1,8627,4,3,97,99,103,15939,15966,15970,108,4,4,59,105,112,115,15950,15952,15957,15963,1,8476,110,101,59,1,8475,97,114,116,59,1,8476,59,1,8477,116,59,1,9645,5,174,1,59,15975,1,174,4,3,105,108,114,15985,15991,15997,115,104,116,59,1,10621,111,111,114,59,1,8971,59,3,55349,56623,4,2,97,111,16007,16028,114,4,2,100,117,16014,16017,59,1,8641,4,2,59,108,16023,16025,1,8640,59,1,10604,4,2,59,118,16034,16036,1,961,59,1,1009,4,3,103,110,115,16047,16167,16171,104,116,4,6,97,104,108,114,115,116,16063,16081,16103,16130,16143,16155,114,114,111,119,4,2,59,116,16073,16075,1,8594,97,105,108,59,1,8611,97,114,112,111,111,110,4,2,100,117,16093,16099,111,119,110,59,1,8641,112,59,1,8640,101,102,116,4,2,97,104,16112,16120,114,114,111,119,115,59,1,8644,97,114,112,111,111,110,115,59,1,8652,105,103,104,116,97,114,114,111,119,115,59,1,8649,113,117,105,103,97,114,114,111,119,59,1,8605,104,114,101,101,116,105,109,101,115,59,1,8908,103,59,1,730,105,110,103,100,111,116,115,101,113,59,1,8787,4,3,97,104,109,16191,16196,16201,114,114,59,1,8644,97,114,59,1,8652,59,1,8207,111,117,115,116,4,2,59,97,16214,16216,1,9137,99,104,101,59,1,9137,109,105,100,59,1,10990,4,4,97,98,112,116,16238,16252,16257,16278,4,2,110,114,16244,16248,103,59,1,10221,114,59,1,8702,114,107,59,1,10215,4,3,97,102,108,16265,16269,16273,114,59,1,10630,59,3,55349,56675,117,115,59,1,10798,105,109,101,115,59,1,10805,4,2,97,112,16291,16304,114,4,2,59,103,16298,16300,1,41,116,59,1,10644,111,108,105,110,116,59,1,10770,97,114,114,59,1,8649,4,4,97,99,104,113,16328,16334,16339,16342,113,117,111,59,1,8250,114,59,3,55349,56519,59,1,8625,4,2,98,117,16348,16351,59,1,93,111,4,2,59,114,16358,16360,1,8217,59,1,8217,4,3,104,105,114,16371,16377,16383,114,101,101,59,1,8908,109,101,115,59,1,8906,105,4,4,59,101,102,108,16394,16396,16399,16402,1,9657,59,1,8885,59,1,9656,116,114,105,59,1,10702,108,117,104,97,114,59,1,10600,59,1,8478,4,19,97,98,99,100,101,102,104,105,108,109,111,112,113,114,115,116,117,119,122,16459,16466,16472,16572,16590,16672,16687,16746,16844,16850,16924,16963,16988,17115,17121,17154,17206,17614,17656,99,117,116,101,59,1,347,113,117,111,59,1,8218,4,10,59,69,97,99,101,105,110,112,115,121,16494,16496,16499,16513,16518,16531,16536,16556,16564,16569,1,8827,59,1,10932,4,2,112,114,16505,16508,59,1,10936,111,110,59,1,353,117,101,59,1,8829,4,2,59,100,16524,16526,1,10928,105,108,59,1,351,114,99,59,1,349,4,3,69,97,115,16544,16547,16551,59,1,10934,112,59,1,10938,105,109,59,1,8937,111,108,105,110,116,59,1,10771,105,109,59,1,8831,59,1,1089,111,116,4,3,59,98,101,16582,16584,16587,1,8901,59,1,8865,59,1,10854,4,7,65,97,99,109,115,116,120,16606,16611,16634,16642,16646,16652,16668,114,114,59,1,8664,114,4,2,104,114,16618,16622,107,59,1,10533,4,2,59,111,16628,16630,1,8600,119,59,1,8600,116,5,167,1,59,16640,1,167,105,59,1,59,119,97,114,59,1,10537,109,4,2,105,110,16659,16665,110,117,115,59,1,8726,59,1,8726,116,59,1,10038,114,4,2,59,111,16679,16682,3,55349,56624,119,110,59,1,8994,4,4,97,99,111,121,16697,16702,16716,16739,114,112,59,1,9839,4,2,104,121,16708,16713,99,121,59,1,1097,59,1,1096,114,116,4,2,109,112,16724,16729,105,100,59,1,8739,97,114,97,108,108,101,108,59,1,8741,5,173,1,59,16744,1,173,4,2,103,109,16752,16770,109,97,4,3,59,102,118,16762,16764,16767,1,963,59,1,962,59,1,962,4,8,59,100,101,103,108,110,112,114,16788,16790,16795,16806,16817,16828,16832,16838,1,8764,111,116,59,1,10858,4,2,59,113,16801,16803,1,8771,59,1,8771,4,2,59,69,16812,16814,1,10910,59,1,10912,4,2,59,69,16823,16825,1,10909,59,1,10911,101,59,1,8774,108,117,115,59,1,10788,97,114,114,59,1,10610,97,114,114,59,1,8592,4,4,97,101,105,116,16860,16883,16891,16904,4,2,108,115,16866,16878,108,115,101,116,109,105,110,117,115,59,1,8726,104,112,59,1,10803,112,97,114,115,108,59,1,10724,4,2,100,108,16897,16900,59,1,8739,101,59,1,8995,4,2,59,101,16910,16912,1,10922,4,2,59,115,16918,16920,1,10924,59,3,10924,65024,4,3,102,108,112,16932,16938,16958,116,99,121,59,1,1100,4,2,59,98,16944,16946,1,47,4,2,59,97,16952,16954,1,10692,114,59,1,9023,102,59,3,55349,56676,97,4,2,100,114,16970,16985,101,115,4,2,59,117,16978,16980,1,9824,105,116,59,1,9824,59,1,8741,4,3,99,115,117,16996,17028,17089,4,2,97,117,17002,17015,112,4,2,59,115,17009,17011,1,8851,59,3,8851,65024,112,4,2,59,115,17022,17024,1,8852,59,3,8852,65024,117,4,2,98,112,17035,17062,4,3,59,101,115,17043,17045,17048,1,8847,59,1,8849,101,116,4,2,59,101,17056,17058,1,8847,113,59,1,8849,4,3,59,101,115,17070,17072,17075,1,8848,59,1,8850,101,116,4,2,59,101,17083,17085,1,8848,113,59,1,8850,4,3,59,97,102,17097,17099,17112,1,9633,114,4,2,101,102,17106,17109,59,1,9633,59,1,9642,59,1,9642,97,114,114,59,1,8594,4,4,99,101,109,116,17131,17136,17142,17148,114,59,3,55349,56520,116,109,110,59,1,8726,105,108,101,59,1,8995,97,114,102,59,1,8902,4,2,97,114,17160,17172,114,4,2,59,102,17167,17169,1,9734,59,1,9733,4,2,97,110,17178,17202,105,103,104,116,4,2,101,112,17188,17197,112,115,105,108,111,110,59,1,1013,104,105,59,1,981,115,59,1,175,4,5,98,99,109,110,112,17218,17351,17420,17423,17427,4,9,59,69,100,101,109,110,112,114,115,17238,17240,17243,17248,17261,17267,17279,17285,17291,1,8834,59,1,10949,111,116,59,1,10941,4,2,59,100,17254,17256,1,8838,111,116,59,1,10947,117,108,116,59,1,10945,4,2,69,101,17273,17276,59,1,10955,59,1,8842,108,117,115,59,1,10943,97,114,114,59,1,10617,4,3,101,105,117,17299,17335,17339,116,4,3,59,101,110,17308,17310,17322,1,8834,113,4,2,59,113,17317,17319,1,8838,59,1,10949,101,113,4,2,59,113,17330,17332,1,8842,59,1,10955,109,59,1,10951,4,2,98,112,17345,17348,59,1,10965,59,1,10963,99,4,6,59,97,99,101,110,115,17366,17368,17376,17385,17389,17415,1,8827,112,112,114,111,120,59,1,10936,117,114,108,121,101,113,59,1,8829,113,59,1,10928,4,3,97,101,115,17397,17405,17410,112,112,114,111,120,59,1,10938,113,113,59,1,10934,105,109,59,1,8937,105,109,59,1,8831,59,1,8721,103,59,1,9834,4,13,49,50,51,59,69,100,101,104,108,109,110,112,115,17455,17462,17469,17476,17478,17481,17496,17509,17524,17530,17536,17548,17554,5,185,1,59,17460,1,185,5,178,1,59,17467,1,178,5,179,1,59,17474,1,179,1,8835,59,1,10950,4,2,111,115,17487,17491,116,59,1,10942,117,98,59,1,10968,4,2,59,100,17502,17504,1,8839,111,116,59,1,10948,115,4,2,111,117,17516,17520,108,59,1,10185,98,59,1,10967,97,114,114,59,1,10619,117,108,116,59,1,10946,4,2,69,101,17542,17545,59,1,10956,59,1,8843,108,117,115,59,1,10944,4,3,101,105,117,17562,17598,17602,116,4,3,59,101,110,17571,17573,17585,1,8835,113,4,2,59,113,17580,17582,1,8839,59,1,10950,101,113,4,2,59,113,17593,17595,1,8843,59,1,10956,109,59,1,10952,4,2,98,112,17608,17611,59,1,10964,59,1,10966,4,3,65,97,110,17622,17627,17650,114,114,59,1,8665,114,4,2,104,114,17634,17638,107,59,1,10534,4,2,59,111,17644,17646,1,8601,119,59,1,8601,119,97,114,59,1,10538,108,105,103,5,223,1,59,17664,1,223,4,13,97,98,99,100,101,102,104,105,111,112,114,115,119,17694,17709,17714,17737,17742,17749,17754,17860,17905,17957,17964,18090,18122,4,2,114,117,17700,17706,103,101,116,59,1,8982,59,1,964,114,107,59,1,9140,4,3,97,101,121,17722,17728,17734,114,111,110,59,1,357,100,105,108,59,1,355,59,1,1090,111,116,59,1,8411,108,114,101,99,59,1,8981,114,59,3,55349,56625,4,4,101,105,107,111,17764,17805,17836,17851,4,2,114,116,17770,17786,101,4,2,52,102,17777,17780,59,1,8756,111,114,101,59,1,8756,97,4,3,59,115,118,17795,17797,17802,1,952,121,109,59,1,977,59,1,977,4,2,99,110,17811,17831,107,4,2,97,115,17818,17826,112,112,114,111,120,59,1,8776,105,109,59,1,8764,115,112,59,1,8201,4,2,97,115,17842,17846,112,59,1,8776,105,109,59,1,8764,114,110,5,254,1,59,17858,1,254,4,3,108,109,110,17868,17873,17901,100,101,59,1,732,101,115,5,215,3,59,98,100,17884,17886,17898,1,215,4,2,59,97,17892,17894,1,8864,114,59,1,10801,59,1,10800,116,59,1,8749,4,3,101,112,115,17913,17917,17953,97,59,1,10536,4,4,59,98,99,102,17927,17929,17934,17939,1,8868,111,116,59,1,9014,105,114,59,1,10993,4,2,59,111,17945,17948,3,55349,56677,114,107,59,1,10970,97,59,1,10537,114,105,109,101,59,1,8244,4,3,97,105,112,17972,17977,18082,100,101,59,1,8482,4,7,97,100,101,109,112,115,116,17993,18051,18056,18059,18066,18072,18076,110,103,108,101,4,5,59,100,108,113,114,18009,18011,18017,18032,18035,1,9653,111,119,110,59,1,9663,101,102,116,4,2,59,101,18026,18028,1,9667,113,59,1,8884,59,1,8796,105,103,104,116,4,2,59,101,18045,18047,1,9657,113,59,1,8885,111,116,59,1,9708,59,1,8796,105,110,117,115,59,1,10810,108,117,115,59,1,10809,98,59,1,10701,105,109,101,59,1,10811,101,122,105,117,109,59,1,9186,4,3,99,104,116,18098,18111,18116,4,2,114,121,18104,18108,59,3,55349,56521,59,1,1094,99,121,59,1,1115,114,111,107,59,1,359,4,2,105,111,18128,18133,120,116,59,1,8812,104,101,97,100,4,2,108,114,18143,18154,101,102,116,97,114,114,111,119,59,1,8606,105,103,104,116,97,114,114,111,119,59,1,8608,4,18,65,72,97,98,99,100,102,103,104,108,109,111,112,114,115,116,117,119,18204,18209,18214,18234,18250,18268,18292,18308,18319,18343,18379,18397,18413,18504,18547,18553,18584,18603,114,114,59,1,8657,97,114,59,1,10595,4,2,99,114,18220,18230,117,116,101,5,250,1,59,18228,1,250,114,59,1,8593,114,4,2,99,101,18241,18245,121,59,1,1118,118,101,59,1,365,4,2,105,121,18256,18265,114,99,5,251,1,59,18263,1,251,59,1,1091,4,3,97,98,104,18276,18281,18287,114,114,59,1,8645,108,97,99,59,1,369,97,114,59,1,10606,4,2,105,114,18298,18304,115,104,116,59,1,10622,59,3,55349,56626,114,97,118,101,5,249,1,59,18317,1,249,4,2,97,98,18325,18338,114,4,2,108,114,18332,18335,59,1,8639,59,1,8638,108,107,59,1,9600,4,2,99,116,18349,18374,4,2,111,114,18355,18369,114,110,4,2,59,101,18363,18365,1,8988,114,59,1,8988,111,112,59,1,8975,114,105,59,1,9720,4,2,97,108,18385,18390,99,114,59,1,363,5,168,1,59,18395,1,168,4,2,103,112,18403,18408,111,110,59,1,371,102,59,3,55349,56678,4,6,97,100,104,108,115,117,18427,18434,18445,18470,18475,18494,114,114,111,119,59,1,8593,111,119,110,97,114,114,111,119,59,1,8597,97,114,112,111,111,110,4,2,108,114,18457,18463,101,102,116,59,1,8639,105,103,104,116,59,1,8638,117,115,59,1,8846,105,4,3,59,104,108,18484,18486,18489,1,965,59,1,978,111,110,59,1,965,112,97,114,114,111,119,115,59,1,8648,4,3,99,105,116,18512,18537,18542,4,2,111,114,18518,18532,114,110,4,2,59,101,18526,18528,1,8989,114,59,1,8989,111,112,59,1,8974,110,103,59,1,367,114,105,59,1,9721,99,114,59,3,55349,56522,4,3,100,105,114,18561,18566,18572,111,116,59,1,8944,108,100,101,59,1,361,105,4,2,59,102,18579,18581,1,9653,59,1,9652,4,2,97,109,18590,18595,114,114,59,1,8648,108,5,252,1,59,18601,1,252,97,110,103,108,101,59,1,10663,4,15,65,66,68,97,99,100,101,102,108,110,111,112,114,115,122,18643,18648,18661,18667,18847,18851,18857,18904,18909,18915,18931,18937,18943,18949,18996,114,114,59,1,8661,97,114,4,2,59,118,18656,18658,1,10984,59,1,10985,97,115,104,59,1,8872,4,2,110,114,18673,18679,103,114,116,59,1,10652,4,7,101,107,110,112,114,115,116,18695,18704,18711,18720,18742,18754,18810,112,115,105,108,111,110,59,1,1013,97,112,112,97,59,1,1008,111,116,104,105,110,103,59,1,8709,4,3,104,105,114,18728,18732,18735,105,59,1,981,59,1,982,111,112,116,111,59,1,8733,4,2,59,104,18748,18750,1,8597,111,59,1,1009,4,2,105,117,18760,18766,103,109,97,59,1,962,4,2,98,112,18772,18791,115,101,116,110,101,113,4,2,59,113,18784,18787,3,8842,65024,59,3,10955,65024,115,101,116,110,101,113,4,2,59,113,18803,18806,3,8843,65024,59,3,10956,65024,4,2,104,114,18816,18822,101,116,97,59,1,977,105,97,110,103,108,101,4,2,108,114,18834,18840,101,102,116,59,1,8882,105,103,104,116,59,1,8883,121,59,1,1074,97,115,104,59,1,8866,4,3,101,108,114,18865,18884,18890,4,3,59,98,101,18873,18875,18880,1,8744,97,114,59,1,8891,113,59,1,8794,108,105,112,59,1,8942,4,2,98,116,18896,18901,97,114,59,1,124,59,1,124,114,59,3,55349,56627,116,114,105,59,1,8882,115,117,4,2,98,112,18923,18927,59,3,8834,8402,59,3,8835,8402,112,102,59,3,55349,56679,114,111,112,59,1,8733,116,114,105,59,1,8883,4,2,99,117,18955,18960,114,59,3,55349,56523,4,2,98,112,18966,18981,110,4,2,69,101,18973,18977,59,3,10955,65024,59,3,8842,65024,110,4,2,69,101,18988,18992,59,3,10956,65024,59,3,8843,65024,105,103,122,97,103,59,1,10650,4,7,99,101,102,111,112,114,115,19020,19026,19061,19066,19072,19075,19089,105,114,99,59,1,373,4,2,100,105,19032,19055,4,2,98,103,19038,19043,97,114,59,1,10847,101,4,2,59,113,19050,19052,1,8743,59,1,8793,101,114,112,59,1,8472,114,59,3,55349,56628,112,102,59,3,55349,56680,59,1,8472,4,2,59,101,19081,19083,1,8768,97,116,104,59,1,8768,99,114,59,3,55349,56524,4,14,99,100,102,104,105,108,109,110,111,114,115,117,118,119,19125,19146,19152,19157,19173,19176,19192,19197,19202,19236,19252,19269,19286,19291,4,3,97,105,117,19133,19137,19142,112,59,1,8898,114,99,59,1,9711,112,59,1,8899,116,114,105,59,1,9661,114,59,3,55349,56629,4,2,65,97,19163,19168,114,114,59,1,10234,114,114,59,1,10231,59,1,958,4,2,65,97,19182,19187,114,114,59,1,10232,114,114,59,1,10229,97,112,59,1,10236,105,115,59,1,8955,4,3,100,112,116,19210,19215,19230,111,116,59,1,10752,4,2,102,108,19221,19225,59,3,55349,56681,117,115,59,1,10753,105,109,101,59,1,10754,4,2,65,97,19242,19247,114,114,59,1,10233,114,114,59,1,10230,4,2,99,113,19258,19263,114,59,3,55349,56525,99,117,112,59,1,10758,4,2,112,116,19275,19281,108,117,115,59,1,10756,114,105,59,1,9651,101,101,59,1,8897,101,100,103,101,59,1,8896,4,8,97,99,101,102,105,111,115,117,19316,19335,19349,19357,19362,19367,19373,19379,99,4,2,117,121,19323,19332,116,101,5,253,1,59,19330,1,253,59,1,1103,4,2,105,121,19341,19346,114,99,59,1,375,59,1,1099,110,5,165,1,59,19355,1,165,114,59,3,55349,56630,99,121,59,1,1111,112,102,59,3,55349,56682,99,114,59,3,55349,56526,4,2,99,109,19385,19389,121,59,1,1102,108,5,255,1,59,19395,1,255,4,10,97,99,100,101,102,104,105,111,115,119,19419,19426,19441,19446,19462,19467,19472,19480,19486,19492,99,117,116,101,59,1,378,4,2,97,121,19432,19438,114,111,110,59,1,382,59,1,1079,111,116,59,1,380,4,2,101,116,19452,19458,116,114,102,59,1,8488,97,59,1,950,114,59,3,55349,56631,99,121,59,1,1078,103,114,97,114,114,59,1,8669,112,102,59,3,55349,56683,99,114,59,3,55349,56527,4,2,106,110,19498,19501,59,1,8205,106,59,1,8204]);
},{}],33:[function(require,module,exports){
'use strict';

var UNICODE = require('../common/unicode');

//Aliases
var $ = UNICODE.CODE_POINTS;

//Utils

//OPTIMIZATION: these utility functions should not be moved out of this module. V8 Crankshaft will not inline
//this functions if they will be situated in another module due to context switch.
//Always perform inlining check before modifying this functions ('node --trace-inlining').
function isSurrogatePair(cp1, cp2) {
    return cp1 >= 0xD800 && cp1 <= 0xDBFF && cp2 >= 0xDC00 && cp2 <= 0xDFFF;
}

function getSurrogatePairCodePoint(cp1, cp2) {
    return (cp1 - 0xD800) * 0x400 + 0x2400 + cp2;
}


//Const
var DEFAULT_BUFFER_WATERLINE = 1 << 16;


//Preprocessor
//NOTE: HTML input preprocessing
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#preprocessing-the-input-stream)
var Preprocessor = module.exports = function () {
    this.html = null;

    this.pos = -1;
    this.lastGapPos = -1;
    this.lastCharPos = -1;

    this.gapStack = [];

    this.skipNextNewLine = false;

    this.lastChunkWritten = false;
    this.endOfChunkHit = false;
    this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
};

Preprocessor.prototype.dropParsedChunk = function () {
    if (this.pos > this.bufferWaterline) {
        this.lastCharPos -= this.pos;
        this.html = this.html.substring(this.pos);
        this.pos = 0;
        this.lastGapPos = -1;
        this.gapStack = [];
    }
};

Preprocessor.prototype._addGap = function () {
    this.gapStack.push(this.lastGapPos);
    this.lastGapPos = this.pos;
};

Preprocessor.prototype._processHighRangeCodePoint = function (cp) {
    //NOTE: try to peek a surrogate pair
    if (this.pos !== this.lastCharPos) {
        var nextCp = this.html.charCodeAt(this.pos + 1);

        if (isSurrogatePair(cp, nextCp)) {
            //NOTE: we have a surrogate pair. Peek pair character and recalculate code point.
            this.pos++;
            cp = getSurrogatePairCodePoint(cp, nextCp);

            //NOTE: add gap that should be avoided during retreat
            this._addGap();
        }
    }

    // NOTE: we've hit the end of chunk, stop processing at this point
    else if (!this.lastChunkWritten) {
        this.endOfChunkHit = true;
        return $.EOF;
    }

    return cp;
};

Preprocessor.prototype.write = function (chunk, isLastChunk) {
    if (this.html)
        this.html += chunk;

    else
        this.html = chunk;

    this.lastCharPos = this.html.length - 1;
    this.endOfChunkHit = false;
    this.lastChunkWritten = isLastChunk;
};

Preprocessor.prototype.insertHtmlAtCurrentPos = function (chunk) {
    this.html = this.html.substring(0, this.pos + 1) +
                chunk +
                this.html.substring(this.pos + 1, this.html.length);

    this.lastCharPos = this.html.length - 1;
    this.endOfChunkHit = false;
};


Preprocessor.prototype.advance = function () {
    this.pos++;

    if (this.pos > this.lastCharPos) {
        if (!this.lastChunkWritten)
            this.endOfChunkHit = true;

        return $.EOF;
    }

    var cp = this.html.charCodeAt(this.pos);

    //NOTE: any U+000A LINE FEED (LF) characters that immediately follow a U+000D CARRIAGE RETURN (CR) character
    //must be ignored.
    if (this.skipNextNewLine && cp === $.LINE_FEED) {
        this.skipNextNewLine = false;
        this._addGap();
        return this.advance();
    }

    //NOTE: all U+000D CARRIAGE RETURN (CR) characters must be converted to U+000A LINE FEED (LF) characters
    if (cp === $.CARRIAGE_RETURN) {
        this.skipNextNewLine = true;
        return $.LINE_FEED;
    }

    this.skipNextNewLine = false;

    //OPTIMIZATION: first perform check if the code point in the allowed range that covers most common
    //HTML input (e.g. ASCII codes) to avoid performance-cost operations for high-range code points.
    return cp >= 0xD800 ? this._processHighRangeCodePoint(cp) : cp;
};

Preprocessor.prototype.retreat = function () {
    if (this.pos === this.lastGapPos) {
        this.lastGapPos = this.gapStack.pop();
        this.pos--;
    }

    this.pos--;
};


},{"../common/unicode":15}],34:[function(require,module,exports){
'use strict';

var DOCUMENT_MODE = require('../common/html').DOCUMENT_MODE;

//Node construction
exports.createDocument = function () {
    return {
        nodeName: '#document',
        mode: DOCUMENT_MODE.NO_QUIRKS,
        childNodes: []
    };
};

exports.createDocumentFragment = function () {
    return {
        nodeName: '#document-fragment',
        childNodes: []
    };
};

exports.createElement = function (tagName, namespaceURI, attrs) {
    return {
        nodeName: tagName,
        tagName: tagName,
        attrs: attrs,
        namespaceURI: namespaceURI,
        childNodes: [],
        parentNode: null
    };
};

exports.createCommentNode = function (data) {
    return {
        nodeName: '#comment',
        data: data,
        parentNode: null
    };
};

var createTextNode = function (value) {
    return {
        nodeName: '#text',
        value: value,
        parentNode: null
    };
};


//Tree mutation
var appendChild = exports.appendChild = function (parentNode, newNode) {
    parentNode.childNodes.push(newNode);
    newNode.parentNode = parentNode;
};

var insertBefore = exports.insertBefore = function (parentNode, newNode, referenceNode) {
    var insertionIdx = parentNode.childNodes.indexOf(referenceNode);

    parentNode.childNodes.splice(insertionIdx, 0, newNode);
    newNode.parentNode = parentNode;
};

exports.setTemplateContent = function (templateElement, contentElement) {
    templateElement.content = contentElement;
};

exports.getTemplateContent = function (templateElement) {
    return templateElement.content;
};

exports.setDocumentType = function (document, name, publicId, systemId) {
    var doctypeNode = null;

    for (var i = 0; i < document.childNodes.length; i++) {
        if (document.childNodes[i].nodeName === '#documentType') {
            doctypeNode = document.childNodes[i];
            break;
        }
    }

    if (doctypeNode) {
        doctypeNode.name = name;
        doctypeNode.publicId = publicId;
        doctypeNode.systemId = systemId;
    }

    else {
        appendChild(document, {
            nodeName: '#documentType',
            name: name,
            publicId: publicId,
            systemId: systemId
        });
    }
};

exports.setDocumentMode = function (document, mode) {
    document.mode = mode;
};

exports.getDocumentMode = function (document) {
    return document.mode;
};

exports.detachNode = function (node) {
    if (node.parentNode) {
        var idx = node.parentNode.childNodes.indexOf(node);

        node.parentNode.childNodes.splice(idx, 1);
        node.parentNode = null;
    }
};

exports.insertText = function (parentNode, text) {
    if (parentNode.childNodes.length) {
        var prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];

        if (prevNode.nodeName === '#text') {
            prevNode.value += text;
            return;
        }
    }

    appendChild(parentNode, createTextNode(text));
};

exports.insertTextBefore = function (parentNode, text, referenceNode) {
    var prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];

    if (prevNode && prevNode.nodeName === '#text')
        prevNode.value += text;
    else
        insertBefore(parentNode, createTextNode(text), referenceNode);
};

exports.adoptAttributes = function (recipient, attrs) {
    var recipientAttrsMap = [];

    for (var i = 0; i < recipient.attrs.length; i++)
        recipientAttrsMap.push(recipient.attrs[i].name);

    for (var j = 0; j < attrs.length; j++) {
        if (recipientAttrsMap.indexOf(attrs[j].name) === -1)
            recipient.attrs.push(attrs[j]);
    }
};


//Tree traversing
exports.getFirstChild = function (node) {
    return node.childNodes[0];
};

exports.getChildNodes = function (node) {
    return node.childNodes;
};

exports.getParentNode = function (node) {
    return node.parentNode;
};

exports.getAttrList = function (element) {
    return element.attrs;
};

//Node data
exports.getTagName = function (element) {
    return element.tagName;
};

exports.getNamespaceURI = function (element) {
    return element.namespaceURI;
};

exports.getTextNodeContent = function (textNode) {
    return textNode.value;
};

exports.getCommentNodeContent = function (commentNode) {
    return commentNode.data;
};

exports.getDocumentTypeNodeName = function (doctypeNode) {
    return doctypeNode.name;
};

exports.getDocumentTypeNodePublicId = function (doctypeNode) {
    return doctypeNode.publicId;
};

exports.getDocumentTypeNodeSystemId = function (doctypeNode) {
    return doctypeNode.systemId;
};

//Node types
exports.isTextNode = function (node) {
    return node.nodeName === '#text';
};

exports.isCommentNode = function (node) {
    return node.nodeName === '#comment';
};

exports.isDocumentTypeNode = function (node) {
    return node.nodeName === '#documentType';
};

exports.isElementNode = function (node) {
    return !!node.tagName;
};

},{"../common/html":14}],35:[function(require,module,exports){
'use strict';

var doctype = require('../common/doctype'),
    DOCUMENT_MODE = require('../common/html').DOCUMENT_MODE;


//Conversion tables for DOM Level1 structure emulation
var nodeTypes = {
    element: 1,
    text: 3,
    cdata: 4,
    comment: 8
};

var nodePropertyShorthands = {
    tagName: 'name',
    childNodes: 'children',
    parentNode: 'parent',
    previousSibling: 'prev',
    nextSibling: 'next',
    nodeValue: 'data'
};

//Node
var Node = function (props) {
    for (var key in props) {
        if (props.hasOwnProperty(key))
            this[key] = props[key];
    }
};

Node.prototype = {
    get firstChild() {
        var children = this.children;

        return children && children[0] || null;
    },

    get lastChild() {
        var children = this.children;

        return children && children[children.length - 1] || null;
    },

    get nodeType() {
        return nodeTypes[this.type] || nodeTypes.element;
    }
};

Object.keys(nodePropertyShorthands).forEach(function (key) {
    var shorthand = nodePropertyShorthands[key];

    Object.defineProperty(Node.prototype, key, {
        get: function () {
            return this[shorthand] || null;
        },
        set: function (val) {
            this[shorthand] = val;
            return val;
        }
    });
});


//Node construction
exports.createDocument = function () {
    return new Node({
        type: 'root',
        name: 'root',
        parent: null,
        prev: null,
        next: null,
        children: [],
        'x-mode': DOCUMENT_MODE.NO_QUIRKS
    });
};

exports.createDocumentFragment = function () {
    return new Node({
        type: 'root',
        name: 'root',
        parent: null,
        prev: null,
        next: null,
        children: []
    });
};

exports.createElement = function (tagName, namespaceURI, attrs) {
    var attribs = Object.create(null),
        attribsNamespace = Object.create(null),
        attribsPrefix = Object.create(null);

    for (var i = 0; i < attrs.length; i++) {
        var attrName = attrs[i].name;

        attribs[attrName] = attrs[i].value;
        attribsNamespace[attrName] = attrs[i].namespace;
        attribsPrefix[attrName] = attrs[i].prefix;
    }

    return new Node({
        type: tagName === 'script' || tagName === 'style' ? tagName : 'tag',
        name: tagName,
        namespace: namespaceURI,
        attribs: attribs,
        'x-attribsNamespace': attribsNamespace,
        'x-attribsPrefix': attribsPrefix,
        children: [],
        parent: null,
        prev: null,
        next: null
    });
};

exports.createCommentNode = function (data) {
    return new Node({
        type: 'comment',
        data: data,
        parent: null,
        prev: null,
        next: null
    });
};

var createTextNode = function (value) {
    return new Node({
        type: 'text',
        data: value,
        parent: null,
        prev: null,
        next: null
    });
};


//Tree mutation
var appendChild = exports.appendChild = function (parentNode, newNode) {
    var prev = parentNode.children[parentNode.children.length - 1];

    if (prev) {
        prev.next = newNode;
        newNode.prev = prev;
    }

    parentNode.children.push(newNode);
    newNode.parent = parentNode;
};

var insertBefore = exports.insertBefore = function (parentNode, newNode, referenceNode) {
    var insertionIdx = parentNode.children.indexOf(referenceNode),
        prev = referenceNode.prev;

    if (prev) {
        prev.next = newNode;
        newNode.prev = prev;
    }

    referenceNode.prev = newNode;
    newNode.next = referenceNode;

    parentNode.children.splice(insertionIdx, 0, newNode);
    newNode.parent = parentNode;
};

exports.setTemplateContent = function (templateElement, contentElement) {
    appendChild(templateElement, contentElement);
};

exports.getTemplateContent = function (templateElement) {
    return templateElement.children[0];
};

exports.setDocumentType = function (document, name, publicId, systemId) {
    var data = doctype.serializeContent(name, publicId, systemId),
        doctypeNode = null;

    for (var i = 0; i < document.children.length; i++) {
        if (document.children[i].type === 'directive' && document.children[i].name === '!doctype') {
            doctypeNode = document.children[i];
            break;
        }
    }

    if (doctypeNode) {
        doctypeNode.data = data;
        doctypeNode['x-name'] = name;
        doctypeNode['x-publicId'] = publicId;
        doctypeNode['x-systemId'] = systemId;
    }

    else {
        appendChild(document, new Node({
            type: 'directive',
            name: '!doctype',
            data: data,
            'x-name': name,
            'x-publicId': publicId,
            'x-systemId': systemId
        }));
    }

};

exports.setDocumentMode = function (document, mode) {
    document['x-mode'] = mode;
};

exports.getDocumentMode = function (document) {
    return document['x-mode'];
};

exports.detachNode = function (node) {
    if (node.parent) {
        var idx = node.parent.children.indexOf(node),
            prev = node.prev,
            next = node.next;

        node.prev = null;
        node.next = null;

        if (prev)
            prev.next = next;

        if (next)
            next.prev = prev;

        node.parent.children.splice(idx, 1);
        node.parent = null;
    }
};

exports.insertText = function (parentNode, text) {
    var lastChild = parentNode.children[parentNode.children.length - 1];

    if (lastChild && lastChild.type === 'text')
        lastChild.data += text;
    else
        appendChild(parentNode, createTextNode(text));
};

exports.insertTextBefore = function (parentNode, text, referenceNode) {
    var prevNode = parentNode.children[parentNode.children.indexOf(referenceNode) - 1];

    if (prevNode && prevNode.type === 'text')
        prevNode.data += text;
    else
        insertBefore(parentNode, createTextNode(text), referenceNode);
};

exports.adoptAttributes = function (recipient, attrs) {
    for (var i = 0; i < attrs.length; i++) {
        var attrName = attrs[i].name;

        if (typeof recipient.attribs[attrName] === 'undefined') {
            recipient.attribs[attrName] = attrs[i].value;
            recipient['x-attribsNamespace'][attrName] = attrs[i].namespace;
            recipient['x-attribsPrefix'][attrName] = attrs[i].prefix;
        }
    }
};


//Tree traversing
exports.getFirstChild = function (node) {
    return node.children[0];
};

exports.getChildNodes = function (node) {
    return node.children;
};

exports.getParentNode = function (node) {
    return node.parent;
};

exports.getAttrList = function (element) {
    var attrList = [];

    for (var name in element.attribs) {
        attrList.push({
            name: name,
            value: element.attribs[name],
            namespace: element['x-attribsNamespace'][name],
            prefix: element['x-attribsPrefix'][name]
        });
    }

    return attrList;
};


//Node data
exports.getTagName = function (element) {
    return element.name;
};

exports.getNamespaceURI = function (element) {
    return element.namespace;
};

exports.getTextNodeContent = function (textNode) {
    return textNode.data;
};

exports.getCommentNodeContent = function (commentNode) {
    return commentNode.data;
};

exports.getDocumentTypeNodeName = function (doctypeNode) {
    return doctypeNode['x-name'];
};

exports.getDocumentTypeNodePublicId = function (doctypeNode) {
    return doctypeNode['x-publicId'];
};

exports.getDocumentTypeNodeSystemId = function (doctypeNode) {
    return doctypeNode['x-systemId'];
};


//Node types
exports.isTextNode = function (node) {
    return node.type === 'text';
};

exports.isCommentNode = function (node) {
    return node.type === 'comment';
};

exports.isDocumentTypeNode = function (node) {
    return node.type === 'directive' && node.name === '!doctype';
};

exports.isElementNode = function (node) {
    return !!node.attribs;
};

},{"../common/doctype":12,"../common/html":14}],36:[function(require,module,exports){
'use strict';

module.exports = function mergeOptions(defaults, options) {
    options = options || Object.create(null);

    return [defaults, options].reduce(function (merged, optObj) {
        Object.keys(optObj).forEach(function (key) {
            merged[key] = optObj[key];
        });

        return merged;
    }, Object.create(null));
};

},{}],37:[function(require,module,exports){
'use strict';

var Mixin = module.exports = function (host) {
    var originalMethods = {},
        overriddenMethods = this._getOverriddenMethods(this, originalMethods);

    Object.keys(overriddenMethods).forEach(function (key) {
        if (typeof overriddenMethods[key] === 'function') {
            originalMethods[key] = host[key];
            host[key] = overriddenMethods[key];
        }
    });
};

Mixin.prototype._getOverriddenMethods = function () {
    throw new Error('Not implemented');
};


},{}],38:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))
},{"_process":39}],39:[function(require,module,exports){
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],40:[function(require,module,exports){
module.exports = require('./lib/_stream_duplex.js');

},{"./lib/_stream_duplex.js":41}],41:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":43,"./_stream_writable":45,"core-util-is":6,"inherits":9,"process-nextick-args":38}],42:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":44,"core-util-is":6,"inherits":9}],43:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/
var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var destroyImpl = require('./internal/streams/destroy');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":41,"./internal/streams/BufferList":46,"./internal/streams/destroy":47,"./internal/streams/stream":48,"_process":39,"core-util-is":6,"events":7,"inherits":9,"isarray":49,"process-nextick-args":38,"safe-buffer":55,"string_decoder/":50,"util":3}],44:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return stream.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":41,"core-util-is":6,"inherits":9}],45:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/
var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

var destroyImpl = require('./internal/streams/destroy');

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = _isUint8Array(chunk) && !state.objectMode;

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":41,"./internal/streams/destroy":47,"./internal/streams/stream":48,"_process":39,"core-util-is":6,"inherits":9,"process-nextick-args":38,"safe-buffer":55,"util-deprecate":57}],46:[function(require,module,exports){
'use strict';

/*<replacement>*/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();
},{"safe-buffer":55}],47:[function(require,module,exports){
'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextTick(emitErrorNT, this, err);
    }
    return;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};
},{"process-nextick-args":38}],48:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":7}],49:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],50:[function(require,module,exports){
'use strict';

var Buffer = require('safe-buffer').Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return -1;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd'.repeat(p);
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd'.repeat(p + 1);
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd'.repeat(p + 2);
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":55}],51:[function(require,module,exports){
module.exports = require('./readable').PassThrough

},{"./readable":52}],52:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":41,"./lib/_stream_passthrough.js":42,"./lib/_stream_readable.js":43,"./lib/_stream_transform.js":44,"./lib/_stream_writable.js":45}],53:[function(require,module,exports){
module.exports = require('./readable').Transform

},{"./readable":52}],54:[function(require,module,exports){
module.exports = require('./lib/_stream_writable.js');

},{"./lib/_stream_writable.js":45}],55:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":4}],56:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":7,"inherits":9,"readable-stream/duplex.js":40,"readable-stream/passthrough.js":51,"readable-stream/readable.js":52,"readable-stream/transform.js":53,"readable-stream/writable.js":54}],57:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],58:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],59:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],60:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":59,"_process":39,"inherits":58}],61:[function(require,module,exports){
module.exports={
    "name": "mip-validator",
    "version": "1.5.12",
    "description": "MIP validator",
    "main": "index.js",
    "dependencies": {
        "commander": "^2.9.0",
        "jschardet": "^1.4.1",
        "lodash": "^4.17.2",
        "parse5": "^3.0.1"
    },
    "browserify": {
        "transform": [
            [
                "babelify",
                {
                    "presets": [
                        "es2015"
                    ],
                    "global": true
                }
            ],
            [
                "aliasify",
                {
                    "aliases": {
                        "jschardet": "./src/encoding/fake-jschardet.js",
                        "lodash": "./node_modules/lodash/lodash.min.js"
                    }
                }
            ]
        ]
    },
    "devDependencies": {
        "aliasify": "^2.1.0",
        "babel-preset-es2015": "^6.13.2",
        "babelify": "^7.3.0",
        "browserify": "^13.1.0",
        "chai": "^3.5.0",
        "chai-as-promised": "^6.0.0",
        "changelog": "^1.0.7",
        "coveralls": "^2.11.9",
        "eslint": "^3.19.0",
        "eslint-config-standard": "^10.2.1",
        "eslint-plugin-import": "^2.2.0",
        "eslint-plugin-mocha": "^4.9.0",
        "eslint-plugin-node": "^4.2.2",
        "eslint-plugin-promise": "^3.5.0",
        "eslint-plugin-standard": "^3.0.1",
        "git-changelog": "^1.0.1",
        "istanbul": "^0.4.3",
        "mocha": "^3.2.0",
        "mock-fs": "^3.11.0",
        "sinon": "^1.17.6",
        "sinon-chai": "^2.8.0",
        "supertest": "^2.0.1",
        "uglifyjs": "^2.4.10"
    },
    "engines": {
        "node": ">=4.0.0"
    },
    "scripts": {
        "test": "DEBUG='mip-validator:' mocha",
        "lint": "eslint src/ test/ bin/ index.js",
        "preversion": "npm run lint && npm test",
        "version": "make dist && git add -A dist",
        "postversion": "git push && git push --tags && npm publish"
    },
    "bin": {
        "mip-validator": "./bin/cli.js",
        "mip-validator-http": "./bin/http.js",
        "mip-validator-socket": "./bin/socket.js"
    },
    "repository": {
        "type": "git",
        "url": "ssh://git@github.com:mipengine/mip-validator.git"
    },
    "keywords": [
        "MIP",
        "validator"
    ],
    "author": "harttle",
    "license": "ISC"
}

},{}],62:[function(require,module,exports){
module.exports={
    "script": {
        "mandatory": [{
             "type": "/^text\/javascript|$/",
             "src": "/^https:\/\/mipcache\\.bdstatic\\.com\/static\/v1\/mip-fixed\/mip-fixed\\.js$/"
        }, {
             "type": "/^text\/javascript|$/",
             "src": "/^https:\/\/mipcache\\.bdstatic\\.com\/static\/v1\/mip-mustache\/mip-mustache\\.js$/"
        }, {
             "type": "/^text\/javascript|$/",
             "src": "/^https:\/\/mipcache\\.bdstatic\\.com\/static\/v1\/mip-custom\/mip-custom\\.js$/"
        }]
    },
    "mip-custom": {
        "mandatory": true
    }
}

},{}],63:[function(require,module,exports){
module.exports={
    "/.*/": {
        "attrs": {
            "style": {
                "disallow": true
            },
            "/^on.+/": {
                "disallow": true
            }
        }
    },

    "html": {
        "mandatory": true,
        "attrs": {
            "mip": {
                "mandatory": true
            }
        },
        "duplicate": true
    },

    "meta": {
        "duplicate": [{
            "name": "/^viewport/"
        }, {
            "http-equiv": "/Content-Type/i"
        }, {
            "charset": "/^(UTF-8)/i"
        }],
        "attrs": {
            "content": [{
                "match": {
                    "name": "/^viewport/"
                },
                "properties": {
                    "width": "device-width",
                    "initial-scale": "1"
                }
            }]
        },
        "mandatory_or": [{
            "http-equiv": "/Content-Type/i",
            "content": "/charset=(utf)|(UTF)-8/"
        }, {
            "charset": "/^(utf)|(UTF-8)/"
        }],
        "mandatory": {
            "name": "/^(viewport)?/",
            "content": "/((width|initial-scale)=.+){2}/"
        },
        "mandatory_parent": "head"
    },
    "link": {
        "mandatory": [{
            "rel": "/^(miphtml)|(canonical)|(standardhtml)$/"
        }, {
            "rel": "/^stylesheet$/",
            "href": "/^(https:)?\/\/(mipcache.bdstatic.com\/static\/mipmain)|(m.baidu.com\/static\/ala\/sf\/static\/)|((https:)?\/\/mipcache.bdstatic.com\/static\/v\\d\/)|((https:)?\/\/c.mipcdn.com\/static\/v\\d\/)|((https:)?\/\/c.mipcdn.com\/static\/mipmain)/"
        }],

        "mandatory_parent": "head",
        "duplicate": [{
            "rel": "/^(miphtml)|(standardhtml)$/"
        }, {
            "rel": "/^(miphtml)|(canonical)$/"
        }, {
            "rel": "/^stylesheet$/",
            "href": "/^(https:)?\/\/(mipcache.bdstatic.com\/static\/mipmain)|(m.baidu.com\/static\/ala\/sf\/static\/)|(c.mipcdn.com\/static\/mipmain)/"
        }],
        "attrs": {
            "href": [{
                "value": "/^(http(s)?:)?\/\//",
                "match": {
                    "rel": "/^(miphtml)|(canonical)|(standardhtml)$/"
                }
            }, {
                "value": "/^(?!\/[^\/])/",
                "match": {
                    "rel": "/^(?!(miphtml)|(canonical)|(standardhtml))$/"
                }
            }]

        }
    },
    "script": [
    {
        "mandatory": {
            "type": "/^(text\/javascript)?/",
            "src": "/^(https:)?\/\/(mipcache.bdstatic.com\/static\/mipmain)|(m.baidu.com\/static\/ala\/sf\/static\/)|((https:)?\/\/mipcache.bdstatic.com\/static\/v\\d\/)|((https:)?\/\/c.mipcdn.com\/static\/v\\d\/)|((https:)?\/\/c.mipcdn.com\/static\/mipmain)/"
        }
    },
    {
        "match": {
            "src": "/^(https:)?\/\/(mipcache.bdstatic.com\/static\/mipmain)|(m.baidu.com\/static\/ala\/sf\/static\/)|((https:)?\/\/mipcache.bdstatic.com\/static\/v\\d\/)|((https:)?\/\/c.mipcdn.com\/static\/v\\d\/)|((https:)?\/\/c.mipcdn.com\/static\/mipmain)/"
        },
        "attrs": {
            "type": {
                "value": "/^(text\/javascript)$/"
            }
        }
    }, {
        "match_ancestor": "head",
        "match": {
            "src":"/^((https:)?\/\/mipcache.bdstatic.com)|((https:)?\/\/m.baidu.com\/static\/ala\/sf\/static\/)|((https:)?\/\/c.mipcdn.com)/"
        },
        "attrs": {
            "async": {
                "mandatory": true
            }
        }
    }, {
        "disallow": true,
        "match": {
            "type": "/^(?!application\/(ld\\+)?json)/",
            "src":"/^(?!((https:)?\/\/mipcache.bdstatic.com)|((https:)?\/\/m.baidu.com\/static\/ala\/sf\/static\/)|((https:)?\/\/c.mipcdn.com))/"
        }
    }, {
        "disallowed_ancestor": "template"
    }],
    "mip-input": {
        "mandatory_ancestor": "mip-form",
        "attrs": {
            "name": {
                "mandatory": true
            }
        }
    },



    "img": {
        "disallow": true
    },
    "video": {
        "disallow": true
    },
    "audio": {
        "disallow": true
    },
    "frame": {
        "disallow": true
    },
    "frameset": {
        "disallow": true
    },
    "object": {
        "disallow": true
    },
    "param": {
        "disallow": true
    },
    "applet": {
        "disallow": true
    },
    "embed": {
        "disallow": true
    },
    "form": {
        "disallow": true
    },
    "iframe": {
        "disallow": true
    },
    "input": {
        "mandatory_ancestor": "mip-form"
    },
    "textarea": {
        "mandatory_ancestor": "mip-form"
    },
    "select": {
        "mandatory_ancestor": "mip-form"
    },
    "option": {
        "mandatory_ancestor": "mip-form"
    },


    "a": {
        "attrs": {
            "href": {
                "mandatory": true,
                "value": "/^((?!javascript:).*)$/"
            }
        }
    },
    "mip-img": {
        "attrs": {
            "src": {
                "mandatory": true,
                "value": "/^.+\\S/"
            },
            "srcset": {
                "value": "/^.+\\S/"
            }
        }
    },
    "mip-pix": {
        "attrs": {
            "src": {
                "mandatory": true,
                "value": "/^((https:)?\/\/)|(http:\/\/*\\?)/"
            }
        }
    },
    "mip-video": {
        "attrs": {
            "src": {
                "mandatory": true,
                "nomatch_descendant": "source"
            }
        }
    },
    "source": {
        "mandatory_ancestor": "mip-video",
        "attrs": {
            "src": {
                "mandatory": true,
                "value": "/^(?!\/[^\/])/"
            }
        }
    },
    "mip-carousel": {
        "attrs": {
            "width": {
                "mandatory": true,
                "value": "/^\\d{1,4}$/"
            },
            "height": {
                "mandatory": true,
                "value": "/^\\d{1,4}$/"
            }
        }
    },
    "mip-iframe": {
        "attrs": {
            "width": {
                "mandatory": true,
                "value": "/^\\d{1,4}$/"
            },
            "height": {
                "mandatory": true,
                "value": "/^\\d{1,4}$/"
            }
        }
    },
    "mip-appdl": {
        "attrs": {
            "tpl": {
                "mandatory": true,
                "value": "/^(noneImg)|(imageText)$/"
            },
            "src": {
                "mandatory": true,
                "value": "/^http(s)?:\/\//",
                "match": {
                    "tpl": "imageText"
                }
            },
            "texttip": {
                "mandatory": true,
                "value": "/^\\S+$/"
            }
        }
    },
    "mip-audio": {
        "attrs": {
            "src": {
                "mandatory": true,
                "value": "/^(?!\/[^\/])/"
            }
        }
    },
    "mip-stats-bidu": {
        "attrs": {
            "token": {
                "mandatory": true,
                "value": "/^\\S+$/"
            }
        }
    },
    "mip-form": {
        "attrs": {
            "method": {
                "value": "/^(post)|(get)$/i"
            },
            "url": {
                "mandatory": true,
                "value": "/^(http(s)?:)?\/\//"
            }
        }
    },
    "mip-link": {
        "attrs": {
            "href": {
                "mandatory": true,
                "value": "/^((?!javascript:).*)$/"
            }
        }
    },
    "mip-ad": {
        "attrs": {
            "type": {
                "mandatory": true
            }
        }
    },
    "mip-embed": {
        "attrs": {
            "type": {
                "mandatory": true
            }
        }
    },
    "head": {
        "duplicate": true,
        "mandatory": true,
        "mandatory_parent": "html"
    },
    "body": {
        "mandatory": true,
        "mandatory_parent": "html",
        "duplicate": true
    },
    "style": {
        "attrs": {
            "mip-custom": {
                "mandatory": true
            }
        },
        "duplicate": true,
        "mandatory_parent": "head"

    },
    "template": {
        "attrs": {
            "type": {
                 "mandatory": true
            }
        }
    },
    "base": {
        "attrs": {
            "target": {
                "value": "/^(^_top$)|(^_self$)|(^_blank$)$/i"
            },
            "href": {
                "value": "/^\/$/"
            }
        }
    },
    "mip-vd-baidu": {
        "attrs": {
            "src": {
                "mandatory": true,
                "value": "/^(http(s)?:)?\/\//"
            },
            "title": {
                "mandatory": true,
                "value": "/^\\S+$/"
            },
            "poster": {
                "mandatory": true,
                "value": "/^\\S+$/"
            }
        }
    }
}

},{}],64:[function(require,module,exports){
'use strict';

exports.detect = function () {
    return {
        encoding: 'UTF-8',
        confidence: 1
    };
};

},{}],65:[function(require,module,exports){
'use strict';

var jschardet = require('./fake-jschardet.js');
var ERR = require('../error/dfn.json');
var allowedEncoding = ['UTF-8', 'ascii'];
var logger = require('../logger.js')('mip-validator:encoding');

function checkUTF8(content, error) {
    var result = jschardet.detect(content);
    logger.debug('encoding detected:', result.encoding);
    if (allowedEncoding.indexOf(result.encoding) === -1 && result.confidence >= 0.9) {
        error(ERR.DISALLOWED_ENCODING, result.encoding);
    }
}

exports.checkUTF8 = checkUTF8;

},{"../error/dfn.json":67,"../logger.js":69,"./fake-jschardet.js":64}],66:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ = require('./../node_modules/lodash/lodash.min.js');
var Walker = require('./walker.js');
var assert = require('assert');
var ERR = require('./error/dfn.json');
var ruleParser = require('./rule-parser.js');
var parse5 = require('parse5');
var logger = require('./logger.js')('mip-validator:engine');
var checkUTF8 = require('./encoding').checkUTF8;
var ValidateError = require('./error/validation-error.js');

function Engine(rules) {
    assert(_.isObject(rules), 'rules must be object, ' + (typeof rules === 'undefined' ? 'undefined' : _typeof(rules)) + ' found');

    var config = ruleParser.mkConfig(rules);
    this.walker = Walker(config);
}

Engine.prototype.register = function (validator) {
    return this.walker.register(validator);
};

/**
 * Validate the HTML
 *
 * @param {string} html The HTML to validate.
 * @param {Boolean} options.fastMode Optional, abort on first error, default false.
 * @param {Object} options.rules Optional, the rules to validate the `html` with, first initialized in constructor
 * @param {string} options.type Optional, the sub type of MIP document, e.g. "custom"
 */
Engine.prototype.validate = function (html, options) {
    var _this = this;

    html = normalize(html);
    options = _.assign({
        fastMode: false,
        rules: undefined,
        type: undefined
    }, options);

    logger.debug('validating using options %J', options);

    return useErrorPolicy(function () {
        var errorGenertor = ValidateError.generator({
            html: html,
            fast: options.fastMode
        });

        checkUTF8(html, errorGenertor);
        var document = parse(html, options);
        behaveBuggyAsTheCPPVersion(document, errorGenertor);
        _this.walker.validate(document, errorGenertor, html);
        if (options.type) {
            var rules = ruleParser.typedRules(options.type);
            _this.walker.config = ruleParser.mkConfig(rules);
            _this.walker.validate(document, errorGenertor, html);
        }

        return errorGenertor.errors;
    }, options.fastMode);
};

/*
 * @param {String} content The unicode string from file
 * @return {String} The normalized string
 */
function normalize(content) {
    return content.toString().replace(/^\uFEFF/, '');
}

function useErrorPolicy(validate, fastMode) {
    if (!fastMode) {
        return validate();
    }
    try {
        validate();
        return [];
    } catch (e) {
        return [e];
    }
}

function parse(html, options) {
    return parse5.parse(html, {
        locationInfo: !options.fastMode
    });
}

function behaveBuggyAsTheCPPVersion(doc, errorGenertor) {
    var head = findFirstTagChild(findFirstTagChild(doc));
    var noscriptAppeared = false;

    head.childNodes.forEach(function (node) {
        if (node.tagName === 'noscript') {
            noscriptAppeared = true;
        } else if (node.tagName && noscriptAppeared) {
            // it's a tag after noscript
            var err = ERR.INVALID_NOSCRIPT;
            errorGenertor(err);
        }
    });
}

function findFirstTagChild(parent) {
    var ret;
    parent.childNodes.some(function (node) {
        ret = node;
        return node.tagName;
    });
    return ret;
}

module.exports = Engine;

},{"./../node_modules/lodash/lodash.min.js":11,"./encoding":65,"./error/dfn.json":67,"./error/validation-error.js":68,"./logger.js":69,"./rule-parser.js":71,"./walker.js":83,"assert":1,"parse5":20}],67:[function(require,module,exports){
module.exports={
    "DISALLOWED_ENCODING": {
        "code": "06200001",
        "message": "禁止使用'%s'，请统一使用UTF-8编码"
    },
    "INVALID_INNER_HTML": {
        "code": "03210001",
        "message": "标签 '%s' 的 HTML 内容不合法（%s）"
    },
    "MANDATORY_TAG_MISSING": {
        "code": "06200101",
        "message": "强制性标签'%s'缺失或错误",
        "misc": "去除该标签即可"
    },
    "DISALLOWED_TAG": {
        "code": "06200201",
        "message": "禁止使用'%s'标签"
    },
    "DUPLICATE_UNIQUE_TAG": {
        "code": "06200701",
        "message": "标签'%s'只能出现一次"
    },
    "MANDATORY_ONEOF_ATTR_MISSING": {
        "code": "06200501",
        "message": "标签'%s'的强制性属性'%s'缺失"
    },
    "DISALLOWED_ATTR": {
        "code": "06200202",
        "message": "'%s'标签中禁止使用'%s'属性"
    },
    "INVALID_ATTR_VALUE": {
        "code": "06200301",
        "message": "标签'%s'中的属性'%s'的属性值'%s'无效"
    },
    "DISALLOWED_TAG_ANCESTOR": {
        "code": "06200801",
        "message": "标签'%s'不应该是标签'%s'的子标签"
    },
    "MANDATORY_TAG_ANCESTOR": {
        "code": "06200901",
        "message": "标签'%s'只能是标签'%s'的子级标签"
    },
    "WRONG_PARENT_TAG": {
        "code": "06200601",
        "message": "标签'%s'的直接父标签应该是'%s'，而不是'%s'"
    },
    "INVALID_PROPERTY_VALUE_IN_ATTR_VALUE": {
        "code": "06200401",
        "message": "标签'%s'中的属性'%s'的属性'%s'被设置为'%s'，该属性值无效"
    },
    "INVALID_NOSCRIPT": {
        "code": "06201001",
        "message": "标签'<noscript>'在标签'<head>'中时强制为最后一个子节点"
    }
}
},{}],68:[function(require,module,exports){
'use strict';

var util = require('util');
var _ = require('./../../node_modules/lodash/lodash.min.js');

function ValidationError(message, code, location, lines) {
    this.message = message;
    this.code = code;
    this.line = location ? location.line : 0;
    this.col = location ? location.col : 0;
    this.offset = location ? location.startOffset : 0;
    this.input = location ? lines[location.line - 1] : '';
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.name = 'ValidationError';

function getGenerator(options) {
    var lines = options.html.split('\n');

    function generator(err) {
        var location = err.location;

        var args = _.toArray(arguments);
        args[0] = err.message;
        var message = util.format.apply(util, args);

        err = new ValidationError(message, err.code, location, lines);

        if (options.fast) {
            throw err;
        }
        generator.errors.push(err);
    }
    generator.errors = [];
    return generator;
}

exports.generator = getGenerator;
exports.ValidationError = ValidationError;

},{"./../../node_modules/lodash/lodash.min.js":11,"util":60}],69:[function(require,module,exports){
(function (process){
'use strict';

/*
 * Logger constructor
 * @param {String} id trace ID of the logger instance, typically use module ID
 */
function Logger(id) {
    if (!isString(id)) {
        throw new Error('invalid logger id: ' + id);
    }
    var debugEnabled = match(process.env.DEBUG, id);
    return {
        debug: debugEnabled ? createWith(console.log.bind(console), id) : function () {
            return false;
        },
        log: createWith(console.log.bind(console), id),
        warn: createWith(console.warn.bind(console), id),
        error: createWith(console.error.bind(console), id),
        info: createWith(console.info.bind(console), id)
    };
}

function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
}

/*
 * match id with DEBUG switch
 * @param {string} root DEBUG switch
 * @param {String} path trace ID
 */
function match(root, path) {
    if (!root) return false;
    root = String(root).split(':').filter(function (x) {
        return x.length;
    });
    path = path.split(':').filter(function (x) {
        return x.length;
    });
    for (var i = 0; i < root.length; i++) {
        if (path[i] !== root[i]) return false;
    }
    return true;
}

/*
 * create logger method with STDOUT instance and trace ID
 * @param {Function} output STDOUT instance
 * @param {String} id trace ID
 * legal:
 *      createWith(console.log.bind(console), 'mip:cache:getCache')
 */
function createWith(output, id) {
    return function () {
        var str = '[' + timestamp() + '][' + id + '] ';
        str += format.apply(exports, arguments);
        output(str);
        return str;
    };
}

/*
 * Pad number to 2-digit.
 * @param {Number} n The number
 * @return {String} 2-digit number string
 * legal:
 *      pad(2)      // 02
 *      pad(22)     // 22
 */
function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

/*
 * Generate a timestamp from current time
 * @return {String} the timestamp string
 * legal:
 *      timestamp()    // "2016/09/27-17:31:22"
 */
function timestamp() {
    var d = new Date();
    var date = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('/');
    var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
    return date + '-' + time;
}

var formatRegExp = /%[sdjJ%]/g;

/*
 * format arguments to a single string
 * @param {String} f Optional, the format string
 * @return {String} the formated string
 * legal:
 *      format('%s', 'foo', 'bar')  // foo bar
 *      format('%d', '200', 'bar')  // 200 bar
 *      format('%j', {foo: 'bar'}, 'bar')
 *                                  // {"foo":"bar"}bar
 *      format('%j', {foo: 'bar'}, 'bar')
 *                                  // \n{\n    "foo": "bar"\n}\nbar
 *      format('foo', 'bar')        // foo bar
 */
function format(f) {
    var i = 0;
    var args = arguments;
    var len = args.length;
    var str = '';
    if (isString(f)) {
        i++;
        str += f.replace(formatRegExp, function (x) {
            switch (x) {
                case '%%':
                    return '%';
                case '%s':
                    return String(args[i++]);
                case '%d':
                    return Number(args[i++]);
                case '%j':
                    try {
                        return JSON.stringify(args[i++]);
                    } catch (_) {
                        return '[Circular]';
                    }
                case '%J':
                    try {
                        return '\n' + JSON.stringify(args[i++], null, 4) + '\n';
                    } catch (_) {
                        return '\n[Circular]\n';
                    }
            }
        });
    }
    for (var x = args[i]; i < len; x = args[++i]) {
        str += ' ' + x;
    }
    return str;
}

module.exports = Logger;

}).call(this,require('_process'))
},{"_process":39}],70:[function(require,module,exports){
'use strict';

var _ = require('./../node_modules/lodash/lodash.min.js');
var regexSyntax = /^(!?)\/(.*)\/(\w*)$/;
var logger = require('./logger.js')('mip-validator:matcher');

/*
 * convert regex-like string to regex
 * @param {str} the regex-like string to convert
 */
function stringToRegex(str) {
    var match = str.match(regexSyntax);
    if (!match) {
        return null;
    }
    var regex = new RegExp(match[2], match[3]);
    if (match[1] === '!') {
        regex.negate = true;
    }
    return regex;
}

/*
 * match string with string rule
 * @param {String} src the string to match
 * @param {String} target the string or regex-like string to match with
 */
function matchValue(src, target) {
    var re;
    if (re = stringToRegex(target)) {
        var result = re.test(src);
        return re.negate ? !result : result;
    } else {
        return src === target;
    }
}

/*
 * object match: match src with target
 * @param {Object} src the object to match
 * @param {Object} target the object to match with
 * legal:
 *   match({
 *     id: 'modal-user'
 *   }, {
 *     id: '/^modal-.+$/'
 *   });
 */
function match(src, target) {
    var ret = true;
    _.forOwn(target, function (value, key) {
        if (!matchValue(src[key], value)) {
            ret = false;
        }
    });
    return ret;
}

/*
 * attributes match
 * @param {ASTNode} node the node of which attributes will be matched
 * @param {Object} target the attribute list object to match with
 * legal:
 *   matchAttrs(node, {
 *     style: 'color:red',
 *     id: '/mip-.+/'
 *   });
 */
function matchAttrs(node, target) {
    var attrSet = _.chain(node.attrs).map(function (attr) {
        return [attr.name, attr.value];
    }).fromPairs().value();
    return match(attrSet, target);
}

/*
 * match ancestor name
 * @param {ASTNode} node the node of which parent will be matched
 * @param {String} ancestorNodeName string or regex-like string to match with
 * legal:
 *   matchAncestor(node, 'form');
 *   matchAncestor(node, '/form|div|section/'
 */
function matchAncestor(node, ancestorNodeName) {
    // match_ancestor disabled
    if (!ancestorNodeName) return true;

    while (node = node.parentNode) {
        if (matchValue(node.nodeName, ancestorNodeName)) return true;
    }
    return false;
}

/*
 * match parent name
 * @param {ASTNode} node the node of which parent will be matched
 * @param {String} parentNodeName string or regex-like string to match with
 * legal:
 *   matchParent(node, 'form');
 *   matchParent(node, '/form|div|section/'
 */
function matchParent(node, parentNodeName) {
    // match disabled
    if (!parentNodeName) return true;

    logger.debug('matching parent:', parentNodeName);
    return matchValue(node.parentNode.nodeName, parentNodeName);
}

/*
 * match descendant node name
 * @param {ASTNode} node the node of which parent will be matched
 * @param {String} descendantNodeName string or regex-like string to match with
 * legal:
 *   matchDescendant(node, 'form');
 *   matchDescendant(node, '/form|div|section/'
 */
function matchDescendant(node, descendantNodeName) {
    // match disabled
    if (!descendantNodeName) return true;
    // is there a match?
    return dfsUntil(node, function (child) {
        return matchValue(child.nodeName, descendantNodeName);
    });
}

/*
 * nomatch descendant node name
 * @param {ASTNode} node the node of which parent will be matched
 * @param {String} descendantNodeName string or regex-like string to match with
 * legal:
 *   nomatchDescendant(node, 'form');
 *   nomatchDescendant(node, '/form|div|section/'
 */
function nomatchDescendant(node, descendantNodeName) {
    logger.debug('nomatching descendant:', descendantNodeName);

    // match disabled, pass
    if (!descendantNodeName) return true;
    // is there a match?
    return !matchDescendant(node, descendantNodeName);
}

function dfsUntil(node, predict) {
    // #text node do NOT have childNodes defined
    return predict(node) || (node.childNodes || []).some(function (child) {
        return dfsUntil(child, predict);
    });
}

/*
 * Create a ASTNode for given nodeName and attribute object
 */
function createNode(nodeName, attrsObj) {
    return {
        nodeName: nodeName,
        attrs: _.chain(attrsObj).toPairs().map(function (pair) {
            return {
                name: pair[0],
                value: pair[1]
            };
        }).value()
    };
}

/*
 * Generate a fingerprint for given nodeName and attributes
 * legal:
 *   fingerprintByObject('div', {id: 'modal'}); // returns: <div id="modal">
 */
function fingerprintByObject(nodeName, attrsObj) {
    var tag = createNode(nodeName, attrsObj);
    return fingerprintByTag(tag);
}

/*
 * Generate a fingerprint for given node
 * @param {ASTNode} node
 */
function fingerprintByTag(node) {
    var attrStr = _.chain(node.attrs).map(function (attr) {
        return attr.name + '="' + attr.value + '"';
    }).join(' ').value();
    if (attrStr.length) {
        attrStr = ' ' + attrStr;
    }
    return '<' + node.nodeName + attrStr + '>';
}

/*
 * Match tagnames from the given HTML
 * @param {Array} tagNames
 * @param {String} html
 * legal: matchTagNames(['div', 'head', 'iframe'], '<div><iframe></div>')
 */
function matchTagNames(tagNames, html) {
    var tagsStr = tagNames.join('|');
    var re = new RegExp('<\\s*(' + tagsStr + ')(?:\\s+[^>]*)*>', 'ig');
    return (html || '').match(re) || [];
}

module.exports = {
    match: match,
    matchAttrs: matchAttrs,
    matchValue: matchValue,
    regexSyntax: regexSyntax,
    fingerprintByTag: fingerprintByTag,
    createNode: createNode,
    fingerprintByObject: fingerprintByObject,
    stringToRegex: stringToRegex,
    matchTagNames: matchTagNames,
    matchParent: matchParent,
    matchAncestor: matchAncestor,
    nomatchDescendant: nomatchDescendant,
    matchDescendant: matchDescendant
};

},{"./../node_modules/lodash/lodash.min.js":11,"./logger.js":69}],71:[function(require,module,exports){
'use strict';

var _ = require('./../node_modules/lodash/lodash.min.js');
var assert = require('assert');
var matcher = require('./matcher.js');
var defaultRules = require('../rules.json');
var TYPED_RULES = {
    custom: require('../rules-custom.json')
};

var id = 0;

function normalize(rules) {
    return _.chain(rules || defaultRules).toPairs().map(function (pair) {
        return [pair[0], normalizeArray(pair[1]).map(function (tag) {
            return normalizeTag(tag);
        })];
    }).fromPairs().value();
}

function normalizeArray(v) {
    if (!v) {
        return [];
    }
    if (v === true) {
        v = {};
    }
    if (!_.isArray(v)) {
        v = [v];
    }
    return v;
}

function normalizeAttrs(attrs) {
    return _.chain(attrs).toPairs().map(function (pair) {
        return [pair[0], normalizeArray(pair[1])];
    }).fromPairs().value();
}

function normalizeTag(config) {
    assert(_.isObject(config), 'node name should be Array or Object');

    config.mandatory = normalizeArray(config.mandatory);
    config.duplicate = normalizeArray(config.duplicate);
    config.attrs = normalizeAttrs(config.attrs);
    return config;
}

function processNodeRules(nodes) {
    var regexNodes = {};
    // for each node
    _.forEach(nodes, function (rules, name) {
        if (matcher.regexSyntax.test(name)) {
            rules.regexStr = name;
            regexNodes[name] = rules;
        }
        _.forEach(rules, processNodeRule);
    });
    return regexNodes;
}

function processNodeRule(nodeRule) {
    nodeRule.id = id++;
    nodeRule.regexAttrs = {};
    _.forEach(nodeRule.attrs, function (rules, name) {
        if (matcher.regexSyntax.test(name)) {
            rules.regexStr = name;
            nodeRule.regexAttrs[name] = rules;
        }
        _.forEach(rules, processAttrRule);
    });
}

function processAttrRule(attrRule) {
    attrRule.id = id++;
}

function mkConfig(rules) {
    var normalizedRules = normalize(rules);
    var regexNodes = processNodeRules(normalizedRules);
    return {
        rules: normalizedRules,
        rawRules: rules,
        regexNodes: regexNodes
    };
}

function typedRules(type) {
    var rules = TYPED_RULES[type];
    if (!rules) {
        throw new Error('rules not found for type ' + type);
    }
    return rules;
}

exports.mkConfig = mkConfig;
exports.typedRules = typedRules;
exports.normalize = normalize;

},{"../rules-custom.json":62,"../rules.json":63,"./../node_modules/lodash/lodash.min.js":11,"./matcher.js":70,"assert":1}],72:[function(require,module,exports){
'use strict';

var ERR = require('../error/dfn.json');
var matcher = require('../matcher.js');

exports.onAttr = function (attr, attrRule, node, rule, error) {
    if (attrRule.disallow) {
        var err = ERR.DISALLOWED_ATTR;
        var tagStr = matcher.fingerprintByObject(node.tagName);
        error(err, tagStr, attr.name);
    }
};

},{"../error/dfn.json":67,"../matcher.js":70}],73:[function(require,module,exports){
'use strict';

var _ = require('./../../node_modules/lodash/lodash.min.js');
var ERR = require('../error/dfn.json');
var POLYFILL_TAGS = ['frame', 'frameset'];
var matcher = require('../matcher.js');
var logger = require('../logger.js')('mip-validator:disallowed_tag');

exports.onBegin = function (error, html, rules) {
    validatePolyfill(error, html, rules);
};

exports.onNode = function (node, rule, error) {
    if (!rule.disallow || _.includes(POLYFILL_TAGS, node.nodeName)) return;
    var err = ERR.DISALLOWED_TAG;
    error(err, matcher.fingerprintByTag(node));
};

// parse5 do not support frameset/frame
// ref: https://github.com/inikulin/parse5/issues/6
function validatePolyfill(error, html, rules) {
    var matches = matcher.matchTagNames(POLYFILL_TAGS, html);
    matches.forEach(function (tag) {
        var tagName = tag.match(/\w+/);
        if (tagName) {
            var subRules = _.get(rules, tagName[0]);
        }
        _.map(subRules, function (rule) {
            if (!rule.disallow) {
                return;
            }

            var err = ERR.DISALLOWED_TAG;
            error(err, tag);
        });
    });
}

},{"../error/dfn.json":67,"../logger.js":69,"../matcher.js":70,"./../../node_modules/lodash/lodash.min.js":11}],74:[function(require,module,exports){
'use strict';

var _ = require('./../../node_modules/lodash/lodash.min.js');
var ERR = require('../error/dfn.json');

exports.onNode = function (node, rule, error) {
    if (!rule.disallowed_ancestor) return;

    for (var cur = node.parentNode; cur && cur.nodeName; cur = cur.parentNode) {
        if (_.includes(rule.disallowed_ancestor, cur.nodeName)) {
            var err = ERR.DISALLOWED_TAG_ANCESTOR;
            return error(err, node.nodeName, cur.nodeName);
        }
    }
};

},{"../error/dfn.json":67,"./../../node_modules/lodash/lodash.min.js":11}],75:[function(require,module,exports){
'use strict';

var _ = require('./../../node_modules/lodash/lodash.min.js');
var ERR = require('../error/dfn.json');
var POLYFILL_TAGS = ['html', 'body', 'head'];
var matcher = require('../matcher.js');
var logger = require('../logger.js')('mip-validator:duplicate_unique_tag');

var tagOccurrence;

exports.onBegin = function (error, html, rules) {
    logger.debug('[DUPLICATE_UNIQUE_TAG] onBegin');
    tagOccurrence = {};

    _.forOwn(rules, function (subRules, ruleName) {
        _.map(subRules, function (rule) {
            _.map(rule.duplicate, function (pattern) {
                var fingerprint = matcher.fingerprintByObject(ruleName, pattern);
                var hash = fingerprint + rule.id;
                tagOccurrence[hash] = 0;
            });
        });
    });
    validatePolyfill(error, html, rules);
};

exports.onNode = function (node, rule, error) {
    if (!rule.duplicate || _.includes(POLYFILL_TAGS, node.nodeName)) return;

    var duplicates = rule.duplicate;

    _.map(duplicates, function (pattern) {
        if (!matcher.matchAttrs(node, pattern)) return;

        var fingerprint = matcher.fingerprintByObject(node.nodeName, pattern);
        var hash = fingerprint + rule.id;
        tagOccurrence[hash]++;
        if (tagOccurrence[hash] <= 1) return;

        error(ERR.DUPLICATE_UNIQUE_TAG, fingerprint);
    });
};

function validatePolyfill(error, html, rules) {
    POLYFILL_TAGS.forEach(function (tag) {
        var subRules = _.get(rules, '' + tag);
        _.map(subRules, function (rule) {
            if (rule.duplicate.length === 0) return;
            var matches = matcher.matchTagNames([tag], html);
            if (matches.length > 1) {
                error(ERR.DUPLICATE_UNIQUE_TAG, tag);
            }
        });
    });
}

},{"../error/dfn.json":67,"../logger.js":69,"../matcher.js":70,"./../../node_modules/lodash/lodash.min.js":11}],76:[function(require,module,exports){
'use strict';

var ERR = require('../error/dfn.json');
var matcher = require('../matcher.js');

exports.onAttr = function (attr, attrRule, node, rule, error) {
    if (attrRule.value) {
        if (matcher.matchValue(attr.value, attrRule.value)) return;

        var err = ERR.INVALID_ATTR_VALUE;
        error(err, node.tagName, attr.name, attr.value);
    }
};

},{"../error/dfn.json":67,"../matcher.js":70}],77:[function(require,module,exports){
'use strict';

var ERR = require('../error/dfn.json');
var matcher = require('../matcher.js');

exports.onNode = function (node, rule, error, html) {
    if (rule.inner_html === undefined) return;

    var loc = node.__location;
    var innerHTML = html.slice(loc.startTag.endOffset, loc.endTag.startOffset);
    if (matcher.matchValue(innerHTML, rule.inner_html)) return;

    var err = ERR.INVALID_INNER_HTML;
    error(err, node.tagName, rule.inner_html);
};

},{"../error/dfn.json":67,"../matcher.js":70}],78:[function(require,module,exports){
'use strict';

var _ = require('./../../node_modules/lodash/lodash.min.js');
var ERR = require('../error/dfn.json');

exports.onAttr = function (attr, attrRule, node, nodeRule, error) {
    if (!attrRule.properties) return;

    var obj = parseValueProperties(attr.value);
    _.forOwn(attrRule.properties, function (value, key) {
        var property = {
            name: key,
            value: obj[key]
        };

        if (property.value === value) return;

        error(ERR.INVALID_PROPERTY_VALUE_IN_ATTR_VALUE, node.nodeName, attr.name, property.name, property.value || '');
    });
};

function parseValueProperties(value) {
    return _.chain(value || '').split(/[,;]/).map(function (propertyStr) {
        return propertyStr.split('=').map(_.trim);
    }).fromPairs().value();
}

},{"../error/dfn.json":67,"./../../node_modules/lodash/lodash.min.js":11}],79:[function(require,module,exports){
'use strict';

var _ = require('./../../node_modules/lodash/lodash.min.js');
var ERR = require('../error/dfn.json');
var matcher = require('../matcher.js');

exports.onNode = function (node, nodeRule, error) {
    var attrOccurrence = _.keyBy(node.attrs, 'name');

    _.forOwn(nodeRule.attrs, function (rules, attrName) {
        rules.map(function (rule) {
            if (rule.mandatory && matcher.matchAttrs(node, rule.match) && matcher.nomatchDescendant(node, rule.nomatch_descendant) && !attrOccurrence[attrName]) {
                var err = ERR.MANDATORY_ONEOF_ATTR_MISSING;
                error(err, node.nodeName, attrName);
            }
        });
    });
};

},{"../error/dfn.json":67,"../matcher.js":70,"./../../node_modules/lodash/lodash.min.js":11}],80:[function(require,module,exports){
'use strict';

var ERR = require('../error/dfn.json');

exports.onNode = function (node, rule, error) {
    if (!rule.mandatory_ancestor) return;

    for (var cur = node.parentNode; cur && cur.nodeName; cur = cur.parentNode) {
        if (rule.mandatory_ancestor === cur.nodeName) {
            return;
        }
    }
    var err = ERR.MANDATORY_TAG_ANCESTOR;
    error(err, node.nodeName, rule.mandatory_ancestor);
};

},{"../error/dfn.json":67}],81:[function(require,module,exports){
'use strict';

var _ = require('./../../node_modules/lodash/lodash.min.js');
var ERR = require('../error/dfn.json');
var matcher = require('../matcher.js');
var POLYFILL_TAGS = ['html', 'body', 'head'];
var logger = require('../logger.js')('mip-validator:mandatory_tag_missing');

var tagOccurrence, anyTagOccurrence;

exports.onBegin = function (error, html, rules) {
    logger.debug('[MANDATORY_TAG_MISSING] onBegin');
    tagOccurrence = {};
    anyTagOccurrence = {};

    // 初始化Mandatory标记
    _.forOwn(rules, function (subRules, ruleName) {
        _.map(subRules, function (rule) {
            _.map(rule.mandatory, function (pattern) {
                var fp = matcher.fingerprintByObject(ruleName, pattern);
                tagOccurrence[fp] = {
                    rule: rule,
                    ruleName: ruleName,
                    pattern: pattern,
                    count: 0
                };
            });
            if (rule.mandatory_or) {
                anyTagOccurrence[ruleName] = {
                    rule: rule,
                    ruleName: ruleName,
                    count: 0
                };
            }
        });
    });

    validatePolyfill(error, html, rules);
};

exports.onNode = function (node, rule) {
    _.map(rule.mandatory, function (pattern) {
        if (!matcher.matchAttrs(node, pattern)) return;

        var fp = matcher.fingerprintByObject(node.nodeName, pattern);
        tagOccurrence[fp].count++;
    });
    _.map(rule.mandatory_or, function (pattern) {
        if (!matcher.matchAttrs(node, pattern)) return;
        anyTagOccurrence[node.nodeName].count++;
    });
};

exports.onEnd = function (error) {
    _.forOwn(tagOccurrence, function (v, k) {
        if (v.rule.mandatory && v.count < 1) {
            error(ERR.MANDATORY_TAG_MISSING, k);
        }
    });
    _.forOwn(anyTagOccurrence, function (v, k) {
        if (v.rule.mandatory_or && v.count < 1) {
            var fps = v.rule.mandatory_or.map(function (rule) {
                return matcher.fingerprintByObject(k, rule);
            }).join("'或'");
            error(ERR.MANDATORY_TAG_MISSING, fps);
        }
    });
};

function validatePolyfill(error, html, rules) {
    POLYFILL_TAGS.forEach(function (tag) {
        var subRules = _.get(rules, '' + tag);
        _.map(subRules, function (rule) {
            if (rule.mandatory.length === 0) {
                return;
            }
            var matches = matcher.matchTagNames([tag], html);
            if (matches.length === 0) {
                error(ERR.MANDATORY_TAG_MISSING, '<' + tag + '>');
            }
        });
    });
}

},{"../error/dfn.json":67,"../logger.js":69,"../matcher.js":70,"./../../node_modules/lodash/lodash.min.js":11}],82:[function(require,module,exports){
'use strict';

var _ = require('./../../node_modules/lodash/lodash.min.js');
var ERR = require('../error/dfn.json');

exports.onNode = function (node, rule, error) {
    if (!rule.mandatory_parent) return;

    var parent = node.parentNode && node.parentNode.nodeName;
    if (_.includes(rule.mandatory_parent, parent)) return;

    error(ERR.WRONG_PARENT_TAG, node.nodeName, rule.mandatory_parent, parent);
};

},{"../error/dfn.json":67,"./../../node_modules/lodash/lodash.min.js":11}],83:[function(require,module,exports){
'use strict';

var _ = require('./../node_modules/lodash/lodash.min.js');
var matcher = require('./matcher.js');
var logger = require('./logger.js')('mip-validator:walker');

/**
 * The validation engine constructor
 *
 * @class
 * @param {Object} config plain object configuring normalizedRules, rawRules, and regexRules
 */
function Walker(config) {
    this.onBeginCbs = [];
    this.onEndCbs = [];
    this.onAttrCbs = [];
    this.onNodeCbs = [];
    this.config = config;
}

Walker.prototype.register = function (validator) {
    validator.onBegin && this.onBeginCbs.push(validator.onBegin);
    validator.onEnd && this.onEndCbs.push(validator.onEnd);
    validator.onNode && this.onNodeCbs.push(validator.onNode);
    validator.onAttr && this.onAttrCbs.push(validator.onAttr);
};

/**
 * Callback when DFS begins
 *
 * @param {Function} error errorFactory to create an error.
 * @param {string} html the whole html of the document to validate
 */
Walker.prototype.onBegin = function (error, html) {
    var _this = this;

    logger.debug('onBegin');
    _.map(this.onBeginCbs, function (cb) {
        return cb(error, html, _this.config.rules);
    });
};

/*
 * Callback when DFS found a Node
 * @param {ASTNode}  node   the node currently found, see:
 *     https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/parse5
 * @param {Function} error  errorFactory to create an error.
 * @param {string} html the whole html of the document to validate
 */
Walker.prototype.onNode = function (node, error, html) {
    var _this2 = this;

    logger.debug('onNode', node.nodeName);
    // get active rules
    var rules = _.chain(this.config.regexNodes).filter(function (rules) {
        return matcher.matchValue(node.nodeName, rules.regexStr);
    }).flatten().concat(this.config.rules[node.nodeName] || []).filter(function (rule) {
        return matcher.matchAttrs(node, rule.match);
    }).filter(function (rule) {
        return matcher.matchParent(node, rule.match_parent);
    }).filter(function (rule) {
        return matcher.matchAncestor(node, rule.match_ancestor);
    }).value();

    _.forEach(rules, function (nodeRule) {
        // invoke callbacks
        _.map(_this2.onNodeCbs, function (cb) {
            cb(node, nodeRule, nodeError, html, _this2.config.rules);
        });
        // traverse attributes
        _.forEach(node.attrs, function (attr) {
            return _this2.onAttr(attr, node, nodeRule, nodeError, html);
        });
    });

    // error generator
    function nodeError(e) {
        e.location = node.__location;
        error.apply(null, arguments);
    }
};

/*
 * Callback when DFS found an attribute
 * @param {ASTAttribute} attribute the attribute currently found
 *   https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/parse5
 * @param {ASTNode} node the parent node
 * @param {Object} nodeRule rule config object for the node
 * @param {Function} error  errorFactory to create an error
 * @param {string} html the whole html of the document to validate
 */
Walker.prototype.onAttr = function (attr, node, nodeRule, error, html) {
    var _this3 = this;

    // get rules
    var rules = _.chain(nodeRule.regexAttrs).filter(function (rules) {
        return matcher.matchValue(attr.name, rules.regexStr);
    }).flatten().concat(nodeRule.attrs[attr.name] || []).filter(function (rule) {
        return matcher.matchAttrs(node, rule.match);
    }).filter(function (rule) {
        return matcher.nomatchDescendant(node, rule.nomatch_descendant);
    }).value();
    // call callbacks
    rules.map(function (rule) {
        _.map(_this3.onAttrCbs, function (cb) {
            return cb(attr, rule, node, nodeRule, error, html, _this3.config.rules);
        });
    });
};

/*
 * Callback when DFS ends
 * @param {Function} error errorFactory to create an error.
 * @param {string} html the whole html of the document to validate
 */
Walker.prototype.onEnd = function (error, html) {
    var _this4 = this;

    logger.debug('onEnd');
    _.map(this.onEndCbs, function (cb) {
        return cb(error, html, _this4.config.rules);
    });
};

/*
 * Do a DFS for the node
 * @param {ASTNode}  node the root node to dfs with
 * @param {Function} error errorFactory to create an error.
 * @param {String} html the whole html of the document to validate
 */
Walker.prototype.dfs = function (node, error, html) {
    var _this5 = this;

    if (node.nodeName === 'template') {
        logger.debug('<template> encountered');
        node.childNodes = node.content.childNodes;
        node.childNodes.forEach(function (child) {
            return child.parentNode = node;
        });
    }

    this.onNode(node, error, html);
    var children = node.childNodes || [];
    children.forEach(function (child) {
        return _this5.dfs(child, error, html);
    });
};

Walker.prototype.validate = function (document, errorGenertor, html) {
    this.onBegin(errorGenertor, html);
    this.dfs(document, errorGenertor, html);
    this.onEnd(errorGenertor, html);
};

module.exports = function (rules) {
    return new Walker(rules);
};

},{"./../node_modules/lodash/lodash.min.js":11,"./logger.js":69,"./matcher.js":70}],84:[function(require,module,exports){
'use strict';

var _ = require('./node_modules/lodash/lodash.min.js');
var Engine = require('./src/engine.js');
var defaultRules = require('./rules.json');
var rulesCustom = require('./rules-custom.json');
var logger = require('./src/logger.js')('mip-validator:index');

function engineFactory(rules) {
    // NPM compliance
    if (rules === 'package.json') {
        return require('./package.json');
    }
    var engine = new Engine(rules || defaultRules);

    // attr
    engine.register(require('./src/validators/disallowed_attr.js'));
    engine.register(require('./src/validators/mandatory_oneof_attr_missing.js'));
    engine.register(require('./src/validators/invalid_attr_value.js'));
    engine.register(require('./src/validators/invalid_property_value_in_attr_value.js'));

    // tag
    engine.register(require('./src/validators/disallowed_tag.js'));
    engine.register(require('./src/validators/duplicate_unique_tag.js'));
    engine.register(require('./src/validators/mandatory_tag_missing.js'));
    engine.register(require('./src/validators/invalid_inner_html.js'));

    // nesting
    engine.register(require('./src/validators/disallowed_tag_ancestor.js'));
    engine.register(require('./src/validators/mandatory_tag_ancestor.js'));
    engine.register(require('./src/validators/mandatory_tag_parent.js'));
    return engine;
}

// make a separate copy of rules
engineFactory.rules = _.cloneDeep(defaultRules);
engineFactory.rulesCustom = _.cloneDeep(rulesCustom);

module.exports = engineFactory;

},{"./node_modules/lodash/lodash.min.js":11,"./package.json":61,"./rules-custom.json":62,"./rules.json":63,"./src/engine.js":66,"./src/logger.js":69,"./src/validators/disallowed_attr.js":72,"./src/validators/disallowed_tag.js":73,"./src/validators/disallowed_tag_ancestor.js":74,"./src/validators/duplicate_unique_tag.js":75,"./src/validators/invalid_attr_value.js":76,"./src/validators/invalid_inner_html.js":77,"./src/validators/invalid_property_value_in_attr_value.js":78,"./src/validators/mandatory_oneof_attr_missing.js":79,"./src/validators/mandatory_tag_ancestor.js":80,"./src/validators/mandatory_tag_missing.js":81,"./src/validators/mandatory_tag_parent.js":82}]},{},[84])(84)
});})();
