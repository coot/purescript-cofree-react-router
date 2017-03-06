module Test.Router (
  testSuite
  ) where

import Prelude hiding (div)
import Control.Comonad.Cofree ((:<))
import Data.Array as A
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import React (createClassStateless, ReactElement, spec, getProps, getChildren, createElement, createClass)
import React.DOM (div, text)
import React.DOM.Props (_id)
import Test.Unit (TestSuite, failure, suite, test)
import Test.Unit.Assert (assert)

import React.Router (runRouter)
import React.Router.Types (Router, Route(..), RouteClass(..), RouteProps(..), Triple(..))

routeClass :: RouteClass
routeClass = RouteClass $ createClassStateless (\(RouteProps {id, args, query, hash}) -> div [_id id] [text $ "route: " <> id])

routeClass2 :: RouteClass
routeClass2 = RouteClass $ createClass $ spec 0 $
              (\this -> do
                    props <- getProps this
                    children <- getChildren this
                    pure $ div [_id (unwrap props).id] [])

foreign import getIds :: ReactElement -> Array String

testSuite :: forall eff. TestSuite eff
testSuite =
    suite "Router" do
        suite "runRouter"
            let router :: Router
                router = (Route "main" "/" routeClass) :<
                            [ (Route "home" "home" routeClass) :< []
                            , (Route "user" "user/:user_id" routeClass) :<
                                [ (Route "books" "books" routeClass) :< []
                                , (Route "book" "books/:book_id" routeClass) :<
                                    [ (Route "pages" "pages" routeClass) :<
                                        [ (Route "page" ":page_id" routeClass) :< [] ]
                                    ]
                                ]
                            , (Route "user-settings" "user/:user_id/settings" routeClass) :< []
                            ]

                router2 :: Router
                router2 = (Route "main" "/" routeClass2) :<
                            [ (Route "home" "home" routeClass2) :< 
                                [ (Route "user" "user" routeClass2) :< []
                                ]
                            , (Route "user-settings" "home/user/settings" routeClass) :< []
                            ]

                check router_ url expected = 
                    let res = runRouter url router_
                     in case res of
                        Nothing -> failure $ "router didn't found <" <> url <> ">"
                        Just (Triple cls props children) -> 
                            let el = createElement cls props children
                                ids = getIds el
                            in assert ("expected ids '" <> show expected <> "' got '" <> show ids <> "'") (ids == expected)
            in do
                test "should find patterns" do
                    check router "/" ["main"]
                    check router "/home" ["main", "home"]
                    check router "/user/2" ["main", "user"]

                test "should find a long path" $
                    check router "/user/2/books/1/pages/100" ["main", "user", "book", "pages", "page"]

                test "should find a route if a less speicalized one hides it" do
                    check router "/user/2/settings" ["main", "user-settings"]
                    check router "/user/2/books/3" ["main", "user", "book"]

                test "find a route in a different branch" do
                    check router2 "/home/user/settings" ["main", "user-settings"]

                test "should mount children" $
                    let res = runRouter "/home" router2
                     in case res of
                             Nothing -> failure "router2 didn't found </home>"
                             Just (Triple cls props children) -> do
                                 assert ("should have 1 child while found: " <> show (A.length children) <> " children") $ A.length children == 1 
