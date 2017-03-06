"use strict"

exports.getIds = function(element) {
  var ids = []
  return (function _getIds(element) {
    ids.push(element.props.id);
    var children = element.props.children
    if (!!children)
      return _getIds(children)
    else {
      return ids
    }
  })(element)
}
