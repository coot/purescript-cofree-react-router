"use strict"

exports.createPopStateEvent = function(state) {
  return new PopStateEvent("popstate", {state: state})
}
