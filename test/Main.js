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
