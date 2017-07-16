module Test.Router (
  testSuite
  ) where

import Control.Comonad.Cofree (Cofree, head, hoistCofree, unfoldCofree, (:<))
import Control.Monad.Aff (Aff)
import Control.Monad.Eff.Unsafe (unsafePerformEff)
import Data.Array as A
import Data.Lens (view)
import Data.List (List(..), fromFoldable, toUnfoldable, (:))
import Data.Map as M
import Data.Maybe (Maybe(Nothing, Just), maybe)
import Data.Tuple (Tuple(..))
import Global (decodeURIComponent)
import Prelude hiding (div)
import React (ReactElement, ReactThis, createClass, createClassStateless, getChildren, getProps, spec)
import React.DOM (div, text)
import React.DOM.Props (className, _id)
import React.Router (matchRouter, runRouter, IndexRoute(..), Route(..), RouteClass, RouteProps, Router, idLens, (:+))
import Routing.Match.Class (int, lit)
import Routing.Parser (parse) as R
import Routing.Types (Route) as R
import Test.Unit (TestSuite, failure, success, suite, test)
import Test.Unit.Assert (assert)
import Unsafe.Coerce (unsafeCoerce)

routeClass :: forall args e. RouteClass RouteProps args e
routeClass = createClassStateless (\props -> div [_id (view idLens props)] [text $ "route: " <> (view idLens props)])

routeClass2 :: forall args e. RouteClass RouteProps args e
routeClass2 = createClass $ spec 0 $
              (\this -> do
                    props <- getProps this
                    children <- getChildren this
                    pure $ div [_id (view idLens props)] children)

indexRouteClass :: forall args e. RouteClass RouteProps args e
indexRouteClass = 
    let clsSpec = (spec 0) $
        (\this -> do
                props <- getProps this
                pure $ div [_id (view idLens props), className "index"] []
        )
     in createClass (clsSpec { displayName = "indexRouteClass" })

idTree
  :: forall props arg r e
   . Cofree List {url :: R.Route, route :: Route props arg e, indexRoute :: Maybe (IndexRoute props arg e) | r}
  -> Cofree List {id :: String, indexId :: Maybe String}
idTree = map (\{url, route: (Route id_ _ _), indexRoute} -> {id: id_, indexId: maybe Nothing (\(IndexRoute id _) -> Just id) indexRoute})

foreign import getIds :: ReactElement -> Array String

foreign import isLastIndexRoute :: ReactElement -> Boolean

foreign import countIndexRoutes :: ReactElement -> Int

hoist :: forall a. Cofree List a -> Cofree Array a
hoist = hoistCofree toUnfoldable

unhoist :: forall a. Cofree Array a -> Cofree List a
unhoist = hoistCofree fromFoldable

-- we cannot use Eq class for Cofree since it is possibly infinite type
foreign import _eqCofree
  :: forall a
   . (a -> a -> Boolean)
  -> Cofree Array a
  -> Cofree Array a
  -> Boolean

eqCofree
  :: Cofree List {id :: String, indexId :: Maybe String}
  -> Cofree List {id :: String, indexId :: Maybe String}
  -> Boolean
eqCofree c1 c2 = _eqCofree (\a b -> a.id == b.id && a.indexId == b.indexId) (hoist c1) (hoist c2)

foreign import _getProp :: forall prop. String -> (prop -> Maybe prop) -> Maybe prop -> String -> ReactElement -> Maybe prop

getArgs :: forall arg. String -> ReactElement -> Maybe (List arg)
getArgs = _getProp "args" Just Nothing

getArg :: forall arg. String -> ReactElement -> Maybe (arg)
getArg = _getProp "arg" Just Nothing

getQuery :: String -> ReactElement -> Maybe (M.Map String String)
getQuery = _getProp "query" Just Nothing

getTail :: forall arg. String -> ReactElement -> Maybe (List (Cofree List {url :: R.Route, arg:: arg}))
getTail = _getProp "tail" Just Nothing

unsafeGetChildren :: ReactElement -> Array ReactElement
unsafeGetChildren = unsafePerformEff <<< getChildren <<< unsafeCoerceToReactElement
  where
    unsafeCoerceToReactElement :: forall props state. ReactElement -> ReactThis props state 
    unsafeCoerceToReactElement = unsafeCoerce

-- this works only for elements with id in props
unsafeChildrenTree :: ReactElement -> Cofree List String
unsafeChildrenTree el = unhoist $ getId <$> unfoldCofree id unsafeGetChildren el
  where
    getId :: ReactElement -> String
    getId el_ = _.id <<< unsafeCoerce <<< unsafePerformEff <<< getProps <<< unsafeCoerce $ el_

eqCofreeS
  :: Cofree List String
  -> Cofree List String
  -> Boolean
eqCofreeS c1 c2 = _eqCofree (\a b -> a == b) (hoist c1) (hoist c2)

foreign import _showCofree
  :: forall a
   . (a -> String)
  -> Cofree Array a
  -> String

showChildrenTree :: Cofree List String -> String
showChildrenTree = _showCofree showId <<< hoist
  where
    showId :: String -> String
    showId = id

data Locations
  = User Int
  | Book Int
  | Page Int
  | Ignore

derive instance eqLocations :: Eq Locations

instance showLocations :: Show Locations where
  show (User i) = "User " <> show i
  show (Book i) = "Book " <> show i
  show (Page i) = "Page " <> show i
  show (Ignore) = "Ignore"

testSuite :: forall eff. TestSuite eff
testSuite =
    suite "Router" do
        suite "runRouter"
            let
                router :: Router RouteProps Unit eff
                router =
                  Route "main" (unit <$ lit "") routeClass :+
                    (Route "home" (unit <$ lit "home") routeClass :+ Nil)
                    : (Tuple (Route "user" (unit <$ (lit "user" *> int)) routeClass) (Just $ IndexRoute "user-index" indexRouteClass) :<
                        (Route "book" (unit <$ (lit "books" *> int)) routeClass :+
                          (Route "pages" (unit <$ lit "pages") routeClass :+
                            (Route "page" (unit <$ int) routeClass :+ Nil)
                            : Nil)
                          : Nil)
                        : Nil)
                    : (Route "user-settings" (unit <$ (lit "user" *> int *> lit "settings")) routeClass :+ Nil)
                    : Nil

                router2 :: Router RouteProps Unit eff
                router2 =
                  Route "main" (unit <$ lit "") routeClass2 :+
                    (Route "home" (unit <$ lit "home") routeClass2 :+
                      (Route "user" (unit <$ lit "user") routeClass2 :+ Nil)
                      : Nil)
                    : (Route "user-settings" (unit <$ (lit "home" *> lit "user" *> lit "settings")) routeClass :+ Nil)
                    : Nil

                router3 :: Router RouteProps Unit eff
                router3 = 
                  (Route "main" (unit <$ lit "") routeClass2) :+
                    (Tuple (Route "home" (unit <$ lit "home") routeClass2) (Just $ IndexRoute "home-index" indexRouteClass) :<
                      (Tuple (Route "users" (unit <$ lit "users") routeClass2) (Just $ IndexRoute "users-index" indexRouteClass) :< Nil)
                      : (Route "user" (unit <$ (lit "users" *> int)) routeClass2 :+ Nil)
                      : Nil)
                  : Nil

                router4 :: Router RouteProps Locations eff
                router4 =
                  Route "main" (Ignore <$ lit "") routeClass
                  :+
                    (Route "home" (Ignore <$ lit "home") routeClass :+ Nil)
                    : (Tuple (Route "user" (User <$> (lit "user" *> int)) routeClass) (Just $ IndexRoute "user-index" indexRouteClass)
                      :<
                        (Route "book" (Book <$> (lit "books" *> int)) routeClass
                        :+
                          (Route "pages" (Ignore <$ lit "pages") routeClass
                          :+
                            (Route "page" (Page <$> int) routeClass :+ Nil)
                            : Nil)
                          : Nil)
                        : Nil)
                    : Nil

                checkElementTree router_ url expected =
                  case runRouter url router_ of
                       Nothing -> failure $ "router didn't found <" <> url <> ">"
                       Just el -> 
                         let chTree = unsafeChildrenTree el
                          in assert
                            ("children trees are not equal: got\n" <> (showChildrenTree chTree) <> "\nexpected\n" <> (showChildrenTree expected)) $
                            eqCofreeS chTree expected

                checkTree
                  :: Router RouteProps Unit eff
                  -> String
                  -> Cofree List { id :: String, indexId :: Maybe String }
                  -> Aff eff Unit
                checkTree router_ url expected =
                  case idTree <$> matchRouter (R.parse decodeURIComponent url) router_ of
                       Nothing -> failure $ "router did't found <" <> url <> ">"
                       Just tree ->
                         assert "trees do not match" $ eqCofree tree expected

            in do
                test "should find patterns" do
                  checkTree router "/" $ {id: "main", indexId: Nothing} :< Nil
                  checkElementTree router "/" $ "main" :< Nil
                  checkTree router "/home" $
                    {id: "main", indexId: Nothing} :<
                      (({id: "home", indexId: Nothing} :< Nil) : Nil)
                  checkElementTree router "/home" $
                    "main" :<
                      ("home" :< Nil) : Nil

                test "should mount index route when present" do
                  checkTree router "/user/2" $
                    {id: "main", indexId: Nothing}  :<
                      ({id: "user", indexId: Just "user-index"} :< Nil) : Nil
                  checkElementTree router "/user/2" $
                    "main" :<
                      ("user" :<
                        ("user-index" :< Nil)
                        : Nil)
                      : Nil

                test "should not mount index route when the url goes deeper" do
                  checkTree router "/user/2/books/1" $ unhoist $
                    {id: "main", indexId: Nothing} :<
                      -- index is not removed yet at this step
                      [{id: "user", indexId: Just "user-index"} :<
                        [{id: "book", indexId: Nothing} :< []]]
                  -- but here the index cannot be present
                  checkElementTree router "/user/2/books/1" $ unhoist $
                    "main" :<
                      ["user" :<
                        ["book" :< []]]

                test "should find a long path" do
                  checkTree router "/user/2/books/1/pages/100" $ unhoist $
                    {id: "main", indexId: Nothing} :<
                      [{id: "user", indexId: Just "user-index"} :<
                        [{id: "book", indexId: Nothing} :<
                          [{id: "pages", indexId: Nothing} :<
                            [{id: "page", indexId: Nothing} :< []]]]]
                  checkElementTree router "/user/2/books/1/pages/100" $ unhoist $
                    "main" :<
                      ["user" :<
                        ["book" :<
                          ["pages" :<
                            ["page" :< []]]]]

                test "mount various paths at the same time" $
                  let rtr =
                        Route "main" (unit <$ lit "") routeClass :+
                          (Route "users" (unit <$ lit "users") routeClass :+ Nil) 
                          : (Route "books" (unit <$ lit "users") routeClass :+ Nil)
                          : Nil
                   in do
                    checkTree rtr "/users" do
                       {id: "main", indexId: Nothing} :<
                         ({id: "users", indexId: Nothing} :< Nil)
                         : ({id: "books", indexId: Nothing} :< Nil)
                         : Nil
                    checkElementTree rtr "/users" $
                      "main" :< 
                        ("users" :< Nil)
                        : ("books" :< Nil)
                        : Nil

                test "mount various paths with indexes" $
                  let rtr = Route "main" (unit <$ lit "") routeClass :+
                               ( Tuple (Route "users" (unit <$ lit "users") routeClass) (Just $ IndexRoute "users-index" indexRouteClass) :< Nil)
                               : (Tuple (Route "books" (unit <$ lit "users") routeClass) (Just $ IndexRoute "books-index" indexRouteClass) :< Nil)
                               : Nil
                   in do
                      checkTree rtr "/users" $
                        {id: "main", indexId: Nothing} :<
                          ({id: "users", indexId: Just "users-index"} :< Nil)
                          : ({id: "books", indexId: Just "books-index"} :< Nil)
                          : Nil
                      checkElementTree rtr "/users" $
                        "main" :<
                          ("users" :<
                            ("users-index" :< Nil)
                            : Nil)
                          : ("books" :<
                            ("books-index" :< Nil)
                            : Nil)
                          : Nil


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
                      ("user-settings" :< Nil)
                      : Nil
                  checkElementTree router "/user/2/books/3" $
                    "main" :<
                      ("user" :< 
                        ("book" :< Nil)
                        : Nil)
                      : Nil

                test "find a route in a different branch" do
                  checkElementTree router2 "/home/user/settings" $
                    "main" :<
                      ("user-settings" :< Nil)
                      : Nil

                test "should mount children" do

                  checkTree router2 "/home" $
                    {id: "main", indexId: Nothing} :<
                      ({id: "home", indexId: Nothing} :< Nil)
                      : Nil

                  checkElementTree router2 "/home" $
                    "main" :<
                      ("home" :< Nil)
                      : Nil

                  case runRouter "/home" router2 of
                       Nothing -> failure "router2 didn't found </home>"
                       Just el -> do
                         let len = A.length $ unsafeGetChildren el
                         assert ("should have 1 child while found: " <> show len <> " children " <> (show $ getIds el) ) $ len == 1

                test "should mount index route" do
                  checkElementTree router3 "/home/users" $
                    "main" :<
                      ("home" :<
                        ("users" :<
                          ("users-index" :< Nil)
                          : Nil)
                        : Nil)
                      : Nil
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
                      ("home" :<
                        ("user" :< Nil)
                        : Nil)
                      : Nil
                  case runRouter "/home/users/1" router3 of
                       Nothing -> failure "router3 didn't found </home/users/1>"
                       Just el ->
                         let cnt = countIndexRoutes el
                          in do
                            assert ("there should be no index route mounted, but found: " <> show cnt) $ cnt == 0

                test "test args" 
                    let url = "/user/2/books/1/pages/100"
                        userExpected = User 2 : Ignore : Nil
                        pageExpected = Page 100 : Ignore : Book 1 : User 2 : Ignore : Nil
                     in case runRouter url router4 of
                             Nothing -> failure $ "router didn't found <" <> url <> ">"
                             Just el -> let margsUser = getArgs "user" el
                                            margsPage = getArgs "page" el
                                         in do
                                           case margsUser, margsPage of
                                                Just argsUser, Just argsPage -> do
                                                    assert ("wrong #user args at " <> url <> " " <> show argsUser <> " but expected: " <> show userExpected ) $ argsUser == userExpected
                                                    assert ("wrong #page args at " <> url <> " " <> show argsPage <> " but expected: " <> show pageExpected ) $ argsPage == pageExpected
                                                Nothing, _ -> failure "#user not found"
                                                _, Nothing -> failure "#page not found"

                test "test arg" 
                    let url = "/user/2/books/1/pages/100"
                        userExpected = User 2
                        pageExpected = Page 100
                     in case runRouter url router4 of
                             Nothing -> failure $ "router didn't found <" <> url <> ">"
                             Just el -> let margUser = getArg "user" el
                                            margPage = getArg "page" el
                                         in do
                                           case margUser, margPage of
                                                Just argUser, Just argPage -> do
                                                    assert ("wrong #user arg: " <> show argUser <> " but expected: " <> show userExpected ) $ argUser == userExpected
                                                    assert ("wrong #page arg: " <> show argPage <> " but expected: " <> show pageExpected ) $ argPage == pageExpected
                                                Nothing, _ -> failure "#user not found"
                                                _, Nothing -> failure "#page not found"

                test "test query"
                    let url = "/user/1/books/2/pages/4/?userId=8&bookId=16&pageId=32"
                        expected = M.fromFoldable 
                                    [ Tuple "userId" "8"
                                    , Tuple "bookId" "16"
                                    , Tuple "pageId" "32"
                                    ]
                    in case runRouter url router4 of
                         Nothing -> failure $ "router didn't found <" <> url <> ">"
                         Just el -> 
                           case getQuery "main" el, getQuery "user" el of
                              Just qMain, Just qHome -> do
                                assert ("got #main props: " <> show qMain <> " expecting " <> show expected) $ qMain == expected
                                assert ("got #user props: " <> show qHome <> " expecting " <> show expected) $ qHome == expected
                              Nothing, _ -> failure "main not found"
                              _, Nothing -> failure "user not found"

                test "test tail"
                  let url = "/user/1/books/2/pages/4"
                  in case runRouter url router4 of
                     Nothing -> failure $ "router didn't found <" <> url <> ">"
                     Just el ->
                       case getTail "main" el, getTail "user" el of
                         Just tailMain, Just tailUser ->
                           let mArgs = _.arg <<< head <$> tailMain
                               uArgs = _.arg <<< head <$> tailUser

                           in do
                             assert ("expected [ User 1 ] in tail, got: " <> show mArgs) $ mArgs == User 1 : Nil
                             assert ("expected in tail, got: " <> show uArgs) $ uArgs == Book 2 : Nil
                         Nothing, _ -> failure "main not found"
                         _, Nothing -> failure "user not found"

                test "test tail on index"
                  let url = "/user/1"
                  in case runRouter url router4 of
                       Nothing -> failure $ "router did't found <" <> url <> ">"
                       Just el ->
                         case getTail "user" el of
                           Nothing -> failure "user not found"
                           Just tailUser ->
                             let
                              uArgs :: List Locations
                              uArgs = _.arg <<< head <$> tailUser
                             in do
                               assert ("expected [] in tail, got: " <> show uArgs) $ uArgs == Nil
