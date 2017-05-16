"use strict"

var _warning = require("warning")

exports.warning = function(cond) {
  return function(fmt) {
    return function() {
      return _warning(cond, fmt)
    }
  }
}
