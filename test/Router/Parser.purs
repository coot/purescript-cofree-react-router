module Test.Router.Parser (
    testSuite
  ) where

import Prelude
import Data.Maybe (Maybe(..))
import Data.StrMap as SM
import Data.Tuple (Tuple(..))
import Test.Unit (TestSuite, failure, success, suite, test)
import Test.Unit.Assert (assert)

import React.Router.Types (PathPart(..), RouteData(..), Hash(..))
import React.Router.Parser (match, parse)

testSuite :: forall eff. TestSuite eff
testSuite =
    suite "Router.Parser" do
        suite "parse" do
            test "parse path" $
                let url = "/user/1/settings"
                    urlR = parse id url
                    expected = [PathPart "", PathPart "user", PathPart "1", PathPart "settings"]
                in assert ("path for url " <> url <> ": " <> show urlR.path) $ (urlR.path) == expected

            test "parse query" $
                let url = "?a=1&b=2"
                    urlR = parse id url
                    expected = SM.fromFoldable [Tuple "a" "1", Tuple "b" "2"]
                in assert ("query for url " <> url <> ": " <> show urlR.query) $ urlR.query == expected

            test "join queries" $ 
                let url = "?a=1?b=2"
                    urlR = parse id url
                    expected = SM.fromFoldable [Tuple "a" "1", Tuple "b" "2"]
                in assert ("query for url " <> url <> ": " <> show urlR.query) $ urlR.query == expected

            test "parse hash" $
                let url = "#hash"
                    urlR = parse id url
                    expected = Hash "hash"
                in assert ("hash for url " <> url <> ": " <> show urlR.hash) $ urlR.hash == expected

            test "parse path query and hash"
                let url = "user/1/settings?a=1&b=2#hash"
                    urlR = parse id url
                    expected = { path: [PathPart "user", PathPart "1", PathPart "settings"]
                            , query: (SM.fromFoldable [Tuple "a" "1", Tuple "b" "2"])
                            , hash: Hash "hash"
                            }
                in do
                    assert ("parsing url " <> url <> " returned path: " <> show urlR.path) $ urlR.path == expected.path
                    assert ("parsing url " <> url <> " returned query: " <> show urlR.query) $ urlR.query == expected.query
                    assert ("parsing url " <> url <> " returned hash: " <> show urlR.hash) $ urlR.hash == expected.hash

        suite "match" do
            test "match paths"
                let
                    match_ pat url expected = 
                        let urlR = parse id url
                            res = match pat urlR
                        in case res of
                                Nothing -> failure $ "pattern <" <> pat <> "> did not match url <" <> url <> ">"
                                Just (Tuple _ rd) -> assert ("got wrong args for url: " <> url <> ": " <> show rd)
                                    case rd of RouteData args _ _ -> args == expected
                in do
                    match_ "/" "/" (SM.empty)
                    match_ "/" "/home" (SM.empty)
                    match_ "user/:user_id" "user/2" (SM.singleton "user_id" "2")
                    match_ "user" "user/2" (SM.empty)
                    match_ "/user/:user_id/book/:book_id" "/user/1/book/2" (SM.fromFoldable [Tuple "user_id" "1", Tuple "book_id" "2"])

            test "do not match paths"
                let doNotMatch pat url =
                        let urlR = parse id url
                            res = match pat urlR
                        in case res of
                                Nothing -> success
                                Just _ -> failure $ "url <" <> url <> "> matched <" <> pat <> ">"
                in do
                    doNotMatch "/user/:user_id/lunch/:lunch_id" "/user/1/book/2"
                    doNotMatch "/user" "user"
                    doNotMatch "/user" "user/"
                    doNotMatch "/user/" "/user"
                    doNotMatch "/user/:user_id" "user/23"
