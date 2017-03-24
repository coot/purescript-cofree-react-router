module Test.Router (
  testSuite
  ) where

import Data.Array as A
import Data.StrMap as SM
import Control.Comonad.Cofree (Cofree, unfoldCofree, (:<))
import Control.Monad.Aff (Aff)
import Control.Monad.Eff.Console (log)
import Control.Monad.Eff.Unsafe (unsafePerformEff)
import Data.Maybe (Maybe(..), fromJust, isJust, maybe)
import Data.Newtype (unwrap)
import Data.Tuple (Tuple(..))
import Global (decodeURIComponent)
import Optic.Getter (view)
import Partial.Unsafe (unsafePartial)
import Prelude (unit)
import React (ReactElement, ReactThis, createClass, createClassStateless, createElement, getChildren, getProps, spec)
import React.DOM (div, text)
import React.DOM.Props (className, _id)
import React.Router (matchRouter, runRouter)
import React.Router.Types (IndexRoute(..), Route(..), RouteClass, RouteProps_, RouteProps, Router, URL, idLens, (:+))
import Routing.Match.Class (int, lit)
import Routing.Parser (parse) as R
import Test.Unit (TestSuite, failure, success, suite, test)
import Test.Unit.Assert (assert)
import Unsafe.Coerce (unsafeCoerce)
import Prelude hiding (div)

routeClass :: forall args. RouteClass args
routeClass = createClassStateless (\props -> div [_id (view idLens props)] [text $ "route: " <> (view idLens props)])

routeClass2 :: forall args. RouteClass args
routeClass2 = createClass $ spec 0 $
              (\this -> do
                    props <- getProps this
                    children <- getChildren this
                    pure $ div [_id (view idLens props)] children)

indexRouteClass :: forall args. RouteClass args
indexRouteClass = 
    let clsSpec = (spec 0) $
        (\this -> do
                props <- getProps this
                pure $ div [_id (view idLens props), className "index"] []
        )
     in createClass (clsSpec { displayName = "indexRouteClass" })

idTree
  :: forall args
   . Cofree Array {url :: URL, props :: RouteProps_ args, route :: Route args, indexRoute :: Maybe (IndexRoute args)}
  -> Cofree Array {id :: String, indexId :: Maybe String}
idTree = map (\{url, props, route, indexRoute} -> {id: (view idLens props), indexId: maybe Nothing (\(IndexRoute id _) -> Just id) indexRoute})

foreign import getIds :: ReactElement -> Array String

foreign import isLastIndexRoute :: ReactElement -> Boolean

foreign import countIndexRoutes :: ReactElement -> Int

-- we cannot use Eq class for Cofree since it is possibly infinite type
foreign import _eqCofree
  :: forall a
   . (a -> a -> Boolean)
  -> Cofree Array a
  -> Cofree Array a
  -> Boolean

eqCofree
  :: Cofree Array {id :: String, indexId :: Maybe String}
  -> Cofree Array {id :: String, indexId :: Maybe String}
  -> Boolean
eqCofree = _eqCofree (\a b -> a.id == b.id && a.indexId == b.indexId)

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

-- this works only for elements with id in props
unsafeChildrenTree :: ReactElement -> Cofree Array String
unsafeChildrenTree el = getId <$> unfoldCofree el id unsafeGetChildren
  where
    getId :: ReactElement -> String
    getId el_ = _.id <<< unsafeCoerce <<< unsafePerformEff <<< getProps <<< unsafeCoerce $ el_

eqCofreeS
  :: Cofree Array String
  -> Cofree Array String
  -> Boolean
eqCofreeS = _eqCofree (\a b -> a == b)

foreign import _showCofree
  :: forall a
   . (a -> String)
  -> Cofree Array a
  -> String

showChildrenTree :: Cofree Array String -> String
showChildrenTree = _showCofree showId
  where
    showId :: String -> String
    showId = id

testSuite :: forall eff. TestSuite eff
testSuite =
    suite "Router" do
        suite "runRouter"
            let
                router :: Router Unit
                router = Route "main" (unit <$ lit "") routeClass :+
                          [ Route "home" (unit <$ lit "home") routeClass :+ []
                          , Tuple (Route "user" (unit <$ (lit "user" *> int)) routeClass) (Just $ IndexRoute "user-index" indexRouteClass) :<
                            [ Route "book" (unit <$ (lit "books" *> int)) routeClass :+
                              [ Route "pages" (unit <$ lit "pages") routeClass :+
                                [ Route "page" (unit <$ int) routeClass :+ [] ]
                              ]
                            ]
                            , Route "user-settings" (unit <$ (lit "user" *> int *> lit "settings")) routeClass :+ []
                          ]

                router2 :: Router Unit
                router2 = Route "main" (unit <$ lit "") routeClass2 :+
                            [ Route "home" (unit <$ lit "home") routeClass2 :+ 
                              [ Route "user" (unit <$ lit "user") routeClass2 :+ []
                              ]
                              , Route "user-settings" (unit <$ (lit "home" *> lit "user" *> lit "settings")) routeClass :+ []
                            ]

                router3 :: Router Unit
                router3 = Route "main" (unit <$ lit "") routeClass2 :+
                          [ Tuple (Route "home" (unit <$ lit "home") routeClass2) (Just $ IndexRoute "home-index" indexRouteClass) :<
                            [ Tuple (Route "users" (unit <$ lit "users") routeClass2) (Just $ IndexRoute "users-index" indexRouteClass) :< []
                            , Route "user" (unit <$ (lit "users" *> int)) routeClass2 :+ []
                            ]
                          ]

                checkElementTree router_ url expected =
                  case runRouter url router_ of
                       Nothing -> failure $ "router didn't found <" <> url <> ">"
                       Just el -> 
                         let chTree = unsafeChildrenTree el
                          in assert
                            ("children trees are not equal: got\n" <> (showChildrenTree chTree) <> "\nexpected\n" <> (showChildrenTree expected)) $
                            eqCofreeS chTree expected

                checkTree
                  :: Router Unit
                  -> String
                  -> Cofree Array { id :: String, indexId :: Maybe String }
                  -> Aff _ Unit
                checkTree router_ url expected =
                  case idTree <$> matchRouter (R.parse decodeURIComponent url) router_ of
                       Nothing -> failure $ "router did't found <" <> url <> ">"
                       Just tree ->
                         assert "trees do not match" $ eqCofree tree expected

            in do
                test "should find patterns" do
                  checkTree router "/" $ {id: "main", indexId: Nothing} :< []
                  checkElementTree router "/" $ "main" :< []
                  checkTree router "/home" $
                    {id: "main", indexId: Nothing} :<
                      [{id: "home", indexId: Nothing} :< []]
                  checkElementTree router "/home" $
                    "main" :<
                      ["home" :< []]

                test "should mount index route when present" do
                  checkTree router "/user/2" $
                    {id: "main", indexId: Nothing}  :<
                      [{id: "user", indexId: Just "user-index"} :< []]
                  checkElementTree router "/user/2" $
                    "main" :<
                      ["user" :<
                        ["user-index" :< []]]

                test "should not mount index route when the url goes deeper" do
                  checkTree router "/user/2/books/1" $
                    {id: "main", indexId: Nothing} :<
                      -- index is not removed yet at this step
                      [{id: "user", indexId: Just "user-index"} :<
                        [{id: "book", indexId: Nothing} :< []]]
                  -- but here the index cannot be present
                  checkElementTree router "/user/2/books/1" $
                    "main" :<
                      ["user" :<
                        ["book" :< []]]

                test "should find a long path" do
                  checkTree router "/user/2/books/1/pages/100" $ 
                    {id: "main", indexId: Nothing} :<
                      [{id: "user", indexId: Just "user-index"} :<
                        [{id: "book", indexId: Nothing} :<
                          [{id: "pages", indexId: Nothing} :<
                            [{id: "page", indexId: Nothing} :< []]]]]
                  checkElementTree router "/user/2/books/1/pages/100" $
                    "main" :<
                      ["user" :<
                        ["book" :<
                          ["pages" :<
                            ["page" :< []]]]]

                test "mount various paths at the same time" $
                  let router = Route "main" (unit <$ lit "") routeClass :+
                               [ Route "users" (unit <$ lit "users") routeClass :+ []
                               , Route "books" (unit <$ lit "users") routeClass :+ []
                               ]
                   in do
                    checkTree router "/users" do
                       {id: "main", indexId: Nothing} :<
                         [ {id: "users", indexId: Nothing} :< []
                         , {id: "books", indexId: Nothing} :< []
                         ]
                    checkElementTree router "/users" $
                      "main" :< 
                        ["users" :< []
                        ,"books" :< []
                        ]

                test "mount various paths with indexes" $
                  let router = Route "main" (unit <$ lit "") routeClass :+
                               [ Tuple (Route "users" (unit <$ lit "users") routeClass) (Just $ IndexRoute "users-index" indexRouteClass) :< []
                               , Tuple (Route "books" (unit <$ lit "users") routeClass) (Just $ IndexRoute "books-index" indexRouteClass) :< []
                               ]
                   in do
                      checkTree router "/users" $
                        {id: "main", indexId: Nothing} :<
                          [ {id: "users", indexId: Just "users-index"} :< []
                          , {id: "books", indexId: Just "books-index"} :< []
                          ]
                      checkElementTree router "/users" $
                        "main" :<
                          ["users" :<
                            ["users-index" :< []]
                          ,"books" :<
                            ["books-index" :< []]
                          ]


                suite "404 pages" do
                  test "not fully consumed path" do
                    case runRouter "/user/2/404-page" router of
                        Nothing -> success
                        Just el -> failure $ "router found \"/user/2/404-page\": " <> show (getIds el)

                  test "not fully consumed path 2" do
                    case runRouter "/user/2/books/10/404-page" router of
                        Nothing -> success
                        Just el -> failure $ "router found \"/user/2/books/10/404-page\": " <> show (getIds el)

                  test "root path not matching" do
                    case runRouter "/404-page/main" router of
                        Nothing  -> success
                        Just el -> failure $ "router found \"/404-page/main\": " <> show (getIds el)

                test "should find a route if a less speicalized one hides it" do
                  checkElementTree router "/user/2/settings" $
                    "main" :<
                      ["user-settings" :< []]
                  checkElementTree router "/user/2/books/3" $
                    "main" :<
                      ["user" :<
                        ["book" :< []]]

                test "find a route in a different branch" do
                  checkElementTree router2 "/home/user/settings" $
                    "main" :< 
                      ["user-settings" :< []]

                test "should mount children" do

                  checkTree router2 "/home" $
                    {id: "main", indexId: Nothing} :<
                      [{id: "home", indexId: Nothing} :< []]

                  checkElementTree router2 "/home" $
                    "main" :<
                      ["home" :< []]

                  case runRouter "/home" router2 of
                       Nothing -> failure "router2 didn't found </home>"
                       Just el -> do
                         let len = A.length $ unsafeGetChildren el
                         assert ("should have 1 child while found: " <> show len <> " children " <> (show $ getIds el) ) $ len == 1

                test "should mount index route" do
                  checkElementTree router3 "/home/users" $
                    "main" :<
                      ["home" :<
                        ["users" :<
                          ["users-index" :< []]]]
                  case runRouter "/home/users" router3 of
                       Nothing -> failure "router3 didn't found </home/user>"
                       Just el -> assert "the last child is not an index route " $ isLastIndexRoute el

                test "should mount only one index route" do
                  case runRouter "/home/users" router3 of
                       Nothing -> failure "router3 didn't found </home/user>"
                       Just el ->
                         let cnt = countIndexRoutes el
                          in do
                            assert ("there should by only one index route mounted, but found: " <> show cnt) $ cnt == 1

                test "should not mount index route when it is not configured" do
                  checkElementTree router3 "/home/users/1" do
                    "main" :<
                      ["home" :<
                        ["user" :< []]]
                  case runRouter "/home/users/1" router3 of
                       Nothing -> failure "router3 didn't found </home/users/1>"
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
