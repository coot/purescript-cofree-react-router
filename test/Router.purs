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

createRoute :: RouteClass
createRoute = RouteClass $ createClassStateless (\(RouteProps {id, args, query, hash}) -> div [_id id] [text $ "route: " <> id])

foreign import unsafeGetId :: ReactElement -> String

testSuite :: forall eff. TestSuite eff
testSuite =
    suite "Router" do
        suite "runRouter" do
            test "should find patterns"
                let router :: Router
                    router = (Route "main" "/" $ createRoute) :<
                                [ (Route "home" "home" (createRoute)) :< []
                                , (Route "user" "user/:user_id" (createRoute)) :< []
                                ]
                    check url expected = 
                        let res = runRouter url router
                         in case res of
                            Nothing -> failure $ "router did not find <" <> url <> ">"
                            Just (Triple cls props children) -> 
                                let el = createElement cls props children
                                    ident = unsafeGetId el
                                in assert ("expected id '" <> expected <> "' got '" <> ident <> "'") (ident == expected)
                 in do
                check "/" "main"
                check "/home" "home"
                check "/user/2" "user"


