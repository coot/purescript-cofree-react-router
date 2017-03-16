module Test.Router (
  testSuite
  ) where

import Data.Array as A
import Data.StrMap as SM
import Control.Comonad.Cofree (Cofree, (:<))
import Control.Monad.Eff.Console (log)
import Control.Monad.Eff.Unsafe (unsafePerformEff)
import Data.Maybe (Maybe(..), fromJust, isJust, maybe)
import Data.Tuple (Tuple(..))
import Global (decodeURIComponent)
import Partial.Unsafe (unsafePartial)
import React (ReactElement, ReactThis, createClass, createClassStateless, createElement, getChildren, getProps, spec)
import React.DOM (div, text)
import React.DOM.Props (className, _id)
import React.Router (matchRouter, runRouter)
import React.Router.Parser (parse)
import React.Router.Types (IndexRoute(..), Route(..), RouteClass, RouteProps, Router, URL, (:+))
import Test.Unit (TestSuite, failure, success, suite, test)
import Test.Unit.Assert (assert)
import Unsafe.Coerce (unsafeCoerce)
import Prelude hiding (div)

routeClass :: RouteClass
routeClass = createClassStateless (\props -> div [_id props.id] [text $ "route: " <> props.id])

routeClass2 :: RouteClass
routeClass2 = createClass $ spec 0 $
              (\this -> do
                    props <- getProps this
                    children <- getChildren this
                    pure $ div [_id props.id] children)

indexRouteClass :: RouteClass
indexRouteClass = 
    let clsSpec = (spec 0) $
        (\this -> do
                props <- getProps this
                pure $ div [_id props.id, className "index"] []
        )
     in createClass (clsSpec { displayName = "indexRouteClass" })

idTree :: Cofree Array {url :: URL, props :: RouteProps, route :: Route, indexRoute :: Maybe IndexRoute}
       -> Cofree Array {id :: String, indexId :: Maybe String}
idTree = map (\{url, props, route, indexRoute} -> {id: props.id, indexId: maybe Nothing (\(IndexRoute id _) -> Just id) indexRoute})

foreign import getIds :: ReactElement -> Array String

foreign import isLastIndexRoute :: ReactElement -> Boolean

foreign import countIndexRoutes :: ReactElement -> Int

-- we cannot use Eq class for Cofree since it is possibly infinite type
foreign import _eqCofree
  :: (Maybe String -> Boolean)
  -> (Maybe String -> String)
  -> Cofree Array {id :: String, indexId :: Maybe String}
  -> Cofree Array {id :: String, indexId :: Maybe String}
  -> Boolean

eqCofree
  :: Cofree Array {id :: String, indexId :: Maybe String}
  -> Cofree Array {id :: String, indexId :: Maybe String}
  -> Boolean
eqCofree = _eqCofree isJust (unsafePartial fromJust)

foreign import _getProp :: String -> (SM.StrMap String -> Maybe (SM.StrMap String)) -> Maybe (SM.StrMap String) -> String -> ReactElement -> Maybe (SM.StrMap String)

getArgs :: String -> ReactElement -> Maybe (SM.StrMap String)
getArgs = _getProp "args" Just Nothing

getQuery :: String -> ReactElement -> Maybe (SM.StrMap String)
getQuery = _getProp "query" Just Nothing

unsafeGetChildren :: ReactElement -> Array ReactElement
unsafeGetChildren = unsafePerformEff <<< getChildren <<< unsafeCoerceToReactElement
  where
    unsafeCoerceToReactElement :: forall props state. ReactElement -> ReactThis props state 
    unsafeCoerceToReactElement = unsafeCoerce

testSuite :: forall eff. TestSuite eff
testSuite =
    suite "Router" do
        suite "runRouter"
            let router :: Router
                router = Route "main" "/" routeClass :+
                            [ Route "home" "home" routeClass :+ []
                            , Tuple (Route "user" "user/:user_id" routeClass) (Just $ IndexRoute "user-index" indexRouteClass) :<
                                [ Route "book" "books/:book_id" routeClass :+
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
                          [ Tuple (Route "home" "home" routeClass2) (Just $ IndexRoute "home-index" indexRouteClass) :<
                              [ Tuple (Route "users" "user" routeClass2) (Just $ IndexRoute "users-index" indexRouteClass) :< []
                              , Route "user" "user/:user_id" routeClass2 :+ []
                              ]
                          ]

                check router_ url expected = 
                  case runRouter url router_ of
                       Nothing -> failure $ "router didn't found <" <> url <> ">"
                       Just el -> 
                         let ids = getIds el
                          in assert ("expected ids '" <> show expected <> "' got '" <> show ids <> "'") (ids == expected)

                checkTree router_ url expected =
                  case idTree <$> matchRouter (parse decodeURIComponent url) router_ of
                       Nothing -> failure $ "router did't found <" <> url <> ">"
                       Just tree ->
                         assert "trees do not match" $ eqCofree tree expected

            in do
                test "should find patterns" do
                  checkTree router "/" ({id: "main", indexId: Nothing} :< [])
                  check router "/" ["main"]
                  checkTree router "/home" $
                    {id: "main", indexId: Nothing} :<
                      [ {id: "home", indexId: Nothing} :< [] ]
                  check router "/home" ["main", "home"]

                test "should mount index route when present" do
                  checkTree router "/user/2" $
                    {id: "main", indexId: Nothing}  :<
                      [{id: "user", indexId: Just "user-index"} :< []]
                  check router "/user/2" ["main", "user", "user-index"]

                test "should not mount index route when the url goes deeper" do
                  checkTree router "/user/2/books/1" $
                    {id: "main", indexId: Nothing} :<
                      -- index is not removed yet at this step
                      [{id: "user", indexId: Just "user-index"} :<
                        [{id: "book", indexId: Nothing} :< []]]
                  -- but here the index cannot be present
                  check router "/user/2/books/1" ["main", "user", "book"]

                test "should find a long path" do
                  checkTree router "/user/2/books/1/pages/100" $ 
                    {id: "main", indexId: Nothing} :<
                      [{id: "user", indexId: Just "user-index"} :<
                        [{id: "book", indexId: Nothing} :<
                          [{id: "pages", indexId: Nothing} :<
                            [{id: "page", indexId: Nothing} :< []]]]]
                  check router "/user/2/books/1/pages/100" ["main", "user", "book", "pages", "page"]

                test "mount various paths at the same time" $
                  let router = Route "main" "/" routeClass :+
                               [ Route "users" "users" routeClass :+ []
                               , Route "books" "users" routeClass :+ []
                               ]
                   in do
                    checkTree router "/users" do
                       {id: "main", indexId: Nothing} :<
                         [ {id: "users", indexId: Nothing} :< []
                         , {id: "books", indexId: Nothing} :< []
                         ]
                    check router "/users" ["main", "users", "books"]

                test "mount various paths with indexes" $
                  let router = Route "main" "/" routeClass :+
                               [ Tuple (Route "users" "users" routeClass) (Just $ IndexRoute "users-index" indexRouteClass) :< []
                               , Tuple (Route "books" "users" routeClass) (Just $ IndexRoute "books-index" indexRouteClass) :< []
                               ]
                   in do
                      checkTree router "/users" $
                        {id: "main", indexId: Nothing} :<
                          [ {id: "users", indexId: Just "users-index"} :< []
                          , {id: "books", indexId: Just "books-index"} :< []
                          ]
                      check router "/users" ["main", "users", "users-index", "books", "books-index"]


                test "404 pages" do
                  -- not fully consumed path
                  case runRouter "/user/2/404-page" router of
                       Nothing -> success
                       Just el -> failure $ "router found \"/user/2/404-page\": " <> show (getIds el)

                  -- not fully consumed path
                  case runRouter "/user/2/books/10/404-page" router of
                       Nothing -> success
                       Just el -> failure $ "router found \"/user/2/bookes/10/404-page\": " <> show (getIds el)

                  -- root path not matching
                  case runRouter "/404-page/main" router of
                       Nothing  -> success
                       Just el -> failure $ "router found \"/404-page/main\": " <> show (getIds el)

                test "should find a route if a less speicalized one hides it" do
                  check router "/user/2/settings" ["main", "user-settings"]
                  check router "/user/2/books/3" ["main", "user", "book"]

                test "find a route in a different branch" do
                  check router2 "/home/user/settings" ["main", "user-settings"]

                test "should mount children" do

                  checkTree router2 "/home" $
                    {id: "main", indexId: Nothing} :<
                      [{id: "home", indexId: Nothing} :< []]

                  check router2 "/home" ["main", "home"]

                  case runRouter "/home" router2 of
                       Nothing -> failure "router2 didn't found </home>"
                       Just el -> do
                         let len = A.length $ unsafeGetChildren el
                         assert ("should have 1 child while found: " <> show len <> " children " <> (show $ getIds el) ) $ len == 1

                test "should mount index route"
                  case runRouter "/home/user" router3 of
                       Nothing -> failure "router3 didn't found </home/user>"
                       Just el -> assert "the last child is not an index route " $ isLastIndexRoute el

                test "should mount only one index route"
                  case runRouter "/home/user" router3 of
                       Nothing -> failure "router3 didn't found </home/user>"
                       Just el ->
                         let cnt = countIndexRoutes el
                          in do
                            assert ("there should by only one index route mounted, but found: " <> show cnt) $ cnt == 1

                test "should not mount index route when it is not configured"
                  case runRouter "/home/user/1" router3 of
                       Nothing -> failure "router3 didn't found </home/user/1>"
                       Just el ->
                         let cnt = countIndexRoutes el
                          in do
                            assert ("there should be no index route mounted, but found: " <> show cnt) $ cnt == 0
{--
  - 
  -                 test "test args" 
  -                     let url = "/user/2/books/1/pages/100"
  -                         expected = SM.fromFoldable 
  -                             [ Tuple "user_id" "2"
  -                             , Tuple "book_id" "1"
  -                             , Tuple "page_id" "100"
  -                             ]
  -                      in case runRouter url router of
  -                              Nothing -> failure $ "router didn't found <" <> url <> ">"
  -                              Just el -> let margsMain = getArgs "main" el
  -                                             margsHome = getArgs "user" el
  -                                          in do
  -                                            assert ("got props: " <> show ri.props.args <> " expecting " <> show expected) $ ri.props.args == expected
  -                                            case margsMain, margsHome of
  -                                                 Just argsMain, Just argsHome -> do
  -                                                     assert ("got #main props: " <> show argsMain <> " expecting " <> show expected) $ argsMain == expected
  -                                                     assert ("got #user props: " <> show argsHome <> " expecting " <> show expected) $ argsHome == expected
  -                                                 Nothing, _ -> failure "main not found"
  -                                                 _, Nothing -> failure "user not found"
  --}


                {--
                  - test "test quargs"
                  -   let url = "/user/2/books/1/pages/100?userId=2&bookId=1&pageId=100"
                  -       expected = SM.fromFoldable 
                  -       [ Tuple "userId" "2"
                  -       , Tuple "bookId" "1"
                  -       , Tuple "pageId" "100"
                  -       ]
                  -    in case res = runRouter url router of
                  -            Nothing -> failure $ "router didn't found <" <> url <> ">"
                  -            Just el -> let mqMain = getQuery "main" el
                  -                           mqHome = getQuery "user" el
                  -                        in do
                  -                          assert ("got query: " <> show ri.props.query <> " expecting " <> show expected) $ ri.props.query == expected
                  -                          case mqMain, mqHome of
                  -                               Just qMain, Just qHome -> do
                  -                                 assert ("got #main props: " <> show qMain <> " expecting " <> show expected) $ qMain == expected
                  -                                 assert ("got #user props: " <> show qHome <> " expecting " <> show expected) $ qHome == expected
                  -                                 Nothing, _ -> failure "main not found"
                  -                                 _, Nothing -> failure "user not found"
                  --}
