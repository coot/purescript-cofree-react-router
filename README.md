# Cofree React Router

[![Maintainer: coot](https://img.shields.io/badge/maintainer-coot-lightgrey.svg)](http://github.com/coot)
[![Documentation](https://pursuit.purescript.org/packages/purescript-cofree-react-router/badge)](https://pursuit.purescript.org/packages/purescript-cofree-react-router)
[![Build Status](https://travis-ci.org/coot/purescript-cofree-react-router.svg?branch=master)](https://travis-ci.org/coot/purescript-cofree-react-router)

## Installation

```
bower i --save purescript-cofree-react-router
npm i --save warning react react-dom
```

## Intro

Routing library for `React` in the spirit of
[react-router](https://github.com/ReactTraining/react-router) v3.
The router has type
```purescript
type Router props args = (RoutePropsClass props) => Cofree List (Tuple (Route props args) (Maybe (IndexRoute props args)))
```
thus it is a cofree comonad for the `Array` functor.

You can define router using `:+` (adds routes without index) and `:<` (the
standard combinator for unfolding a cofree comonad) combinators:
```purescript
router :: Router RouteProps Unit
router =
  Route "main" (unit <$ lit "") mainClass :+
    (Route "home" (unit <$ lit "home") homeClass :+ Nil)
    : (Tuple (Route "user" (unit <$ (lit "user" *> int)) userClass) (Just $ IndexRoute "user-index" userIndexClass) :<
        (Route "book" (unit <$ (lit "books" *> int)) bookClass :+
          (Route "pages" (unit <$ lit "pages") pagesClass :+
            (Route "page" (unit <$ int) pageClass :+ Nil)
            : Nil)
          : Nil)
        : Nil)
    : (Route "user-settings" (unit <$ (lit "user" *> int *> lit "settings")) settingsClass :+ Nil)
    : Nil
```

## Applicative parser
Urls are parsed using the applicative parser from
[routing](https://pursuit.purescript.org/packages/purescript-routing) package.
There are some assumptions:
* if you need to use query args, the router is taking care of them and the
  parsed dictionary is made available in `RouteParams` for all the routes.  The
  cofree router will go through the parsed url and sum all query maps and use
  that.  You can still match `params` in parts of the url, but then they will
  be available only for that route.
* The router will match end of url with `end <|> lit "" *> end <|> params *> end`
  to check if all the route parts where exhousted.  This matches end, trailing
  "/" or trailing search params.

## Browser history
For now, only browser history is supported, but it's not to difficult to change
the
[browserRouter](https://github.com/coot/purescript-cofree-react-router/blob/master/src/React/Router/Components.purs#L52)
spec to use hash history.

## Server side rendering
For server side rendering use `matchRouter`.  Checkout the [isomorphic react
example](https://github.com/coot/purescript-isomorphic-react-example) how to
set-up server side rendering together with [hyper](https://github.com/owickstrom/hyper).

## Example
Checkout the included example. To build and run type
```bash
npm run example
```
Now open `http://localhost:8080` in your prefered browser.
