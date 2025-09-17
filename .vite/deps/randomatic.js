import {
  __commonJS
} from "./chunk-LK32TJAX.js";

// node_modules/is-number/index.js
var require_is_number = __commonJS({
  "node_modules/is-number/index.js"(exports, module) {
    "use strict";
    module.exports = function isNumber(num) {
      var type = typeof num;
      if (type === "string" || num instanceof String) {
        if (!num.trim()) return false;
      } else if (type !== "number" && !(num instanceof Number)) {
        return false;
      }
      return num - num + 1 >= 0;
    };
  }
});

// node_modules/kind-of/index.js
var require_kind_of = __commonJS({
  "node_modules/kind-of/index.js"(exports, module) {
    var toString = Object.prototype.toString;
    module.exports = function kindOf(val) {
      if (val === void 0) return "undefined";
      if (val === null) return "null";
      var type = typeof val;
      if (type === "boolean") return "boolean";
      if (type === "string") return "string";
      if (type === "number") return "number";
      if (type === "symbol") return "symbol";
      if (type === "function") {
        return isGeneratorFn(val) ? "generatorfunction" : "function";
      }
      if (isArray(val)) return "array";
      if (isBuffer(val)) return "buffer";
      if (isArguments(val)) return "arguments";
      if (isDate(val)) return "date";
      if (isError(val)) return "error";
      if (isRegexp(val)) return "regexp";
      switch (ctorName(val)) {
        case "Symbol":
          return "symbol";
        case "Promise":
          return "promise";
        // Set, Map, WeakSet, WeakMap
        case "WeakMap":
          return "weakmap";
        case "WeakSet":
          return "weakset";
        case "Map":
          return "map";
        case "Set":
          return "set";
        // 8-bit typed arrays
        case "Int8Array":
          return "int8array";
        case "Uint8Array":
          return "uint8array";
        case "Uint8ClampedArray":
          return "uint8clampedarray";
        // 16-bit typed arrays
        case "Int16Array":
          return "int16array";
        case "Uint16Array":
          return "uint16array";
        // 32-bit typed arrays
        case "Int32Array":
          return "int32array";
        case "Uint32Array":
          return "uint32array";
        case "Float32Array":
          return "float32array";
        case "Float64Array":
          return "float64array";
      }
      if (isGeneratorObj(val)) {
        return "generator";
      }
      type = toString.call(val);
      switch (type) {
        case "[object Object]":
          return "object";
        // iterators
        case "[object Map Iterator]":
          return "mapiterator";
        case "[object Set Iterator]":
          return "setiterator";
        case "[object String Iterator]":
          return "stringiterator";
        case "[object Array Iterator]":
          return "arrayiterator";
      }
      return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
    };
    function ctorName(val) {
      return typeof val.constructor === "function" ? val.constructor.name : null;
    }
    function isArray(val) {
      if (Array.isArray) return Array.isArray(val);
      return val instanceof Array;
    }
    function isError(val) {
      return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
    }
    function isDate(val) {
      if (val instanceof Date) return true;
      return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
    }
    function isRegexp(val) {
      if (val instanceof RegExp) return true;
      return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
    }
    function isGeneratorFn(name, val) {
      return ctorName(name) === "GeneratorFunction";
    }
    function isGeneratorObj(val) {
      return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
    }
    function isArguments(val) {
      try {
        if (typeof val.length === "number" && typeof val.callee === "function") {
          return true;
        }
      } catch (err) {
        if (err.message.indexOf("callee") !== -1) {
          return true;
        }
      }
      return false;
    }
    function isBuffer(val) {
      if (val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
  }
});

// node_modules/math-random/browser.js
var require_browser = __commonJS({
  "node_modules/math-random/browser.js"(exports, module) {
    module.exports = function(global) {
      var uint32 = "Uint32Array" in global;
      var crypto = global.crypto || global.msCrypto;
      var rando = crypto && typeof crypto.getRandomValues === "function";
      var good = uint32 && rando;
      if (!good) return Math.random;
      var arr = new Uint32Array(1);
      var max = Math.pow(2, 32);
      function random() {
        crypto.getRandomValues(arr);
        return arr[0] / max;
      }
      random.cryptographic = true;
      return random;
    }(typeof self !== "undefined" ? self : window);
  }
});

// node_modules/randomatic/index.js
var require_randomatic = __commonJS({
  "node_modules/randomatic/index.js"(exports, module) {
    var isNumber = require_is_number();
    var typeOf = require_kind_of();
    var mathRandom = require_browser();
    module.exports = randomatic;
    module.exports.isCrypto = !!mathRandom.cryptographic;
    var type = {
      lower: "abcdefghijklmnopqrstuvwxyz",
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      number: "0123456789",
      special: "~!@#$%^&()_+-={}[];',."
    };
    type.all = type.lower + type.upper + type.number + type.special;
    function randomatic(pattern, length, options) {
      if (typeof pattern === "undefined") {
        throw new Error("randomatic expects a string or number.");
      }
      var custom = false;
      if (arguments.length === 1) {
        if (typeof pattern === "string") {
          length = pattern.length;
        } else if (isNumber(pattern)) {
          options = {};
          length = pattern;
          pattern = "*";
        }
      }
      if (typeOf(length) === "object" && length.hasOwnProperty("chars")) {
        options = length;
        pattern = options.chars;
        length = pattern.length;
        custom = true;
      }
      var opts = options || {};
      var mask = "";
      var res = "";
      if (pattern.indexOf("?") !== -1) mask += opts.chars;
      if (pattern.indexOf("a") !== -1) mask += type.lower;
      if (pattern.indexOf("A") !== -1) mask += type.upper;
      if (pattern.indexOf("0") !== -1) mask += type.number;
      if (pattern.indexOf("!") !== -1) mask += type.special;
      if (pattern.indexOf("*") !== -1) mask += type.all;
      if (custom) mask += pattern;
      if (opts.exclude) {
        var exclude = typeOf(opts.exclude) === "string" ? opts.exclude : opts.exclude.join("");
        exclude = exclude.replace(new RegExp("[\\]]+", "g"), "");
        mask = mask.replace(new RegExp("[" + exclude + "]+", "g"), "");
        if (opts.exclude.indexOf("]") !== -1) mask = mask.replace(new RegExp("[\\]]+", "g"), "");
      }
      while (length--) {
        res += mask.charAt(parseInt(mathRandom() * mask.length, 10));
      }
      return res;
    }
  }
});
export default require_randomatic();
/*! Bundled license information:

is-number/index.js:
  (*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

randomatic/index.js:
  (*!
   * randomatic <https://github.com/jonschlinkert/randomatic>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
//# sourceMappingURL=randomatic.js.map
