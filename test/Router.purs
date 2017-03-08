module Test.Router (
  testSuite
  ) where

import Prelude hiding (div)
import Control.Comonad.Cofree ((:<))
import Data.Array as A
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.StrMap as SM
import Data.Tuple (Tuple(..))
import React (createClassStateless, ReactElement, spec, getProps, getChildren, createElement, createClass)
import React.DOM (div, text)
import React.DOM.Props (className, _id)
import Test.Unit (TestSuite, failure, suite, test)
import Test.Unit.Assert (assert)

import Control.Monad.Eff.Console (log)

import React.Router (runRouter)
import React.Router.Types ((:+), Router, Route(..), RouteClass(..), RouteProps(..))

routeClass :: RouteClass
routeClass = RouteClass $ createClassStateless (\(RouteProps {id, args, query, hash}) -> div [_id id] [text $ "route: " <> id])

routeClass2 :: RouteClass
routeClass2 = RouteClass $ createClass $ spec 0 $
              (\this -> do
                    props <- getProps this
                    children <- getChildren this
                    pure $ div [_id (unwrap props).id] children)

indexRouteClass :: RouteClass
indexRouteClass = 
    let clsSpec = (spec 0) $
        (\this -> do
                props <- getProps this
                log "rendering indexRouteClass"
                pure $ div [_id ((unwrap props).id <> "-index"), className "index"] []
        )
     in RouteClass $ createClass (clsSpec { displayName = "indexRouteClass" })

foreign import getIds :: ReactElement -> Array String

foreign import isLastIndexRoute :: ReactElement -> Boolean

foreign import countIndexRoutes :: ReactElement -> Int

foreign import _getProp :: String -> (SM.StrMap String -> Maybe (SM.StrMap String)) -> Maybe (SM.StrMap String) -> String -> ReactElement -> Maybe (SM.StrMap String)

getArgs :: String -> ReactElement -> Maybe (SM.StrMap String)
getArgs = _getProp "args" Just Nothing

getQuery :: String -> ReactElement -> Maybe (SM.StrMap String)
getQuery = _getProp "query" Just Nothing

testSuite :: forall eff. TestSuite eff
testSuite =
    suite "Router" do
        suite "runRouter"
            let router :: Router
                router = Route "main" "/" routeClass :+
                            [ Route "home" "home" routeClass :+ []
                            , Route "user" "user/:user_id" routeClass :+
                                [ Route "books" "books" routeClass :+ []
                                , Route "book" "books/:book_id" routeClass :+
                                    [ Route "pages" "pages" routeClass :+
                                        [ Route "page" ":page_id" routeClass :+ [] ]
                                    ]
                                ]
                            , Route "user-settings" "user/:user_id/settings" routeClass :+ []
                            ]

                router2 :: Router
                router2 = Route "main" "/" routeClass2 :+
                            [ Route "home" "home" routeClass2 :+ 
                                [ Route "user" "user" routeClass2 :+ []
                                ]
                            , Route "user-settings" "home/user/settings" routeClass :+ []
                            ]

                router3 :: Router
                router3 = Route "main" "/" routeClass2 :+
                          [ Tuple (Route "home" "home" routeClass2) (Just indexRouteClass) :<
                              [ Tuple (Route "users" "user" routeClass2) (Just indexRouteClass) :< []
                              , Route "user" "user/:user_id" routeClass2 :+ []
                              ]
                          ]

                check router_ url expected = 
                    let res = runRouter url router_
                     in case res of
                        Nothing -> failure $ "router didn't found <" <> url <> ">"
                        Just ri -> 
                            let el = createElement ri.routeClass ri.props ri.children
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
                             Just ri -> do
                                 assert ("should have 1 child while found: " <> show (A.length ri.children) <> " children") $ A.length ri.children == 1 

                test "should mount index route"
                    let res = runRouter "/home/user" router3
                     in case res of
                             Nothing -> failure "router3 didn't found </home/user>"
                             Just ri ->
                                 let el = createElement ri.routeClass ri.props ri.children
                                  in do
                                      assert "the last child is not an index route " $ isLastIndexRoute el

                test "should mount only one index route"
                    let res = runRouter "/home/user" router3
                     in case res of
                             Nothing -> failure "router3 didn't found </home/user>"
                             Just ri ->
                                 let el = createElement ri.routeClass ri.props ri.children
                                     cnt = countIndexRoutes el
                                  in do
                                      assert ("there should by only one index route mounted, but found: " <> show cnt) $ cnt == 1

                test "should not mount index route when it is not configured"
                    let res = runRouter "/home/user/1" router3
                     in case res of
                             Nothing -> failure "router3 didn't found </home/user/1>"
                             Just ri ->
                                 let el = createElement ri.routeClass ri.props ri.children
                                     cnt = countIndexRoutes el
                                  in do
                                      assert ("there should be no index route mounted, but found: " <> show cnt) $ cnt == 0

                test "test args" 
                    let url = "/user/2/books/1/pages/100"
                        res = runRouter url router
                        expected = SM.fromFoldable 
                            [ Tuple "user_id" "2"
                            , Tuple "book_id" "1"
                            , Tuple "page_id" "100"
                            ]
                     in case res of
                             Nothing -> failure $ "router didn't found <" <> url <> ">"
                             Just ri -> case ri.props of
                                             RouteProps props -> 
                                                 let el = createElement ri.routeClass ri.props ri.children
                                                     margsMain = getArgs "main" el
                                                     margsHome = getArgs "user" el
                                                  in do
                                                    assert ("got props: " <> show props.args <> " expecting " <> show expected) $ props.args == expected
                                                    case margsMain, margsHome of
                                                         Just argsMain, Just argsHome -> do
                                                             assert ("got #main props: " <> show argsMain <> " expecting " <> show expected) $ argsMain == expected
                                                             assert ("got #user props: " <> show argsHome <> " expecting " <> show expected) $ argsHome == expected
                                                         Nothing, _ -> failure "main not found"
                                                         _, Nothing -> failure "user not found"


                test "test quargs" 
                    let url = "/user/2/books/1/pages/100?userId=2&bookId=1&pageId=100"
                        res = runRouter url router
                        expected = SM.fromFoldable 
                            [ Tuple "userId" "2"
                            , Tuple "bookId" "1"
                            , Tuple "pageId" "100"
                            ]
                     in case res of
                             Nothing -> failure $ "router didn't found <" <> url <> ">"
                             Just ri -> case ri.props of
                                             RouteProps props -> 
                                                 let el = createElement ri.routeClass ri.props ri.children
                                                     mqMain = getQuery "main" el
                                                     mqHome = getQuery "user" el
                                                  in do
                                                    assert ("got query: " <> show props.query <> " expecting " <> show expected) $ props.query == expected
                                                    case mqMain, mqHome of
                                                         Just qMain, Just qHome -> do
                                                             assert ("got #main props: " <> show qMain <> " expecting " <> show expected) $ qMain == expected
                                                             assert ("got #user props: " <> show qHome <> " expecting " <> show expected) $ qHome == expected
                                                         Nothing, _ -> failure "main not found"
                                                         _, Nothing -> failure "user not found"
