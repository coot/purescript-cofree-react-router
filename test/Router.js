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
      var cofA_ = cofA.thunk()
      var cofB_ = cofB.thunk()
      if (!eq(cofA_.value0)(cofB_.value0))
        return false

      var tailA = cofA_.value1
      var tailB = cofB_.value1
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
      var cof_ = cof.thunk()
      var indent = Array.apply(Array, Array(level)).map(function(el) {return "  "}).join("")
      var str = show(cof_.value0) + "\n" + indent + "  ["
      var tail = cof_.value1.forEach(function(cof_, idx) {str = str + (idx === 0 ? " " : ("\n" + indent + "  , ")) +  _show(cof_, level + 1)})
      return str + "\n" + indent + "  ]"
    })(cof, 0)
  }
}
