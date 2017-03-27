# Cofree React Router

Routing library for `React` in the spirit of
[react-router](https://github.com/ReactTraining/react-router) v3.
The router has type
```purescript
type Router props args = (RoutePropsClass props) => Cofree Array (Tuple (Route props args) (Maybe (IndexRoute props args)))
```
thus it is a cofree comonad for the `Array` functor.

You can define router using `:+` (adds routes without index) and `:<` (the
standard combinator for unfolding a cofree comonad) combinators:
```purescript
router =
    Route "home" "/" Home :+
        [ Route "user" "user/:id" User :+
            [ Route "email" "email" UserEmail :+ []
            , Route "password" "password" UserPassword :+ []
            ]
        , Tuple (Route "books" "books" Books) (Just BooksIndex) :<
            [ Route "book" ":id" Book :+ []
            , Route "reader" "reader" BookReader :+ []
            ]
        ]
```

## Applicative parser
Urls are parsed using the applicative parser from
[routing](https://pursuit.purescript.org/packages/purescript-routing) package.

## Browser history
For now, only browser history is supported, but it's not to difficult to change
the
[`browserRouter`](https://github.com/coot/purescript-cofree-react-router/blob/master/src/React/Router/Components.purs#L52)
spec to use hash history or in memory history for server side rendering.

## Example
Checkout the included example. To build and run type
```bash
npm run example
```
Now open `http://localhost:8080` in your prefered browser.
