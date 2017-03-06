module Test.Router (
  testSuite
  ) where

import Prelude hiding (div)
import Control.Comonad.Cofree ((:<))
import Data.Maybe (Maybe(..))
import React (createClassStateless, ReactElement, createElement)
import React.DOM (div, text)
import React.DOM.Props (_id)
import Test.Unit (TestSuite, failure, success, suite, test)
import Test.Unit.Assert (assert)

import React.Router (runRouter)
import React.Router.Types (Router, Route(..), RouteClass(..), RouteProps(..), Triple(..))

routeClass :: RouteClass
routeClass = RouteClass $ createClassStateless (\(RouteProps {id, args, query, hash}) -> div [_id id] [text $ "route: " <> id])

foreign import unsafeGetId :: ReactElement -> String

testSuite :: forall eff. TestSuite eff
testSuite =
    suite "Router" do
        suite "runRouter"
            let router :: Router
                router = (Route "main" "/" routeClass) :<
                            [ (Route "home" "home" routeClass) :< []
                            , (Route "user" "user/:user_id" routeClass) :<
                                [ (Route "books" "books" routeClass) :< []
                                , (Route "book" "books/:book_id" routeClass) :< []
                                ]
                            , (Route "user-settings" "user/:user_id/settings" routeClass) :< []
                            ]

                router2 :: Router
                router2 = (Route "main" "/" routeClass) :<
                            [ (Route "home" "home" routeClass) :< 
                                [ (Route "user" "user" routeClass) :< []
                                ]
                            , (Route "user-settings" "home/user/settings" routeClass) :< []
                            ]

                check router url expected = 
                    let res = runRouter url router
                     in case res of
                        Nothing -> failure $ "router did not find <" <> url <> ">"
                        Just (Triple cls props children) -> 
                            let el = createElement cls props children
                                ident = unsafeGetId el
                            in assert ("expected id '" <> expected <> "' got '" <> ident <> "'") (ident == expected)
            in do
                test "should find patterns" do
                    check router "/" "main"
                    check router "/home" "home"
                    check router "/user/2" "user"
                    check router "/user/2/books" "books"

                test "should find a route if a less speicalized one hides it" do
                    check router "/user/2/settings" "user-settings"
                    check router "/user/2/books/3" "book"

                test "find a route in a different branch" do
                    check router2 "/home/user/settings" "user-settings"
