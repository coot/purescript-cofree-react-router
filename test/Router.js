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
