module Test.Router.Parser (
    testSuite
  ) where

import Prelude
import Data.Array ((!!))
import Data.Maybe (Maybe(..))
import Data.StrMap as SM
import Data.Tuple (Tuple(..))
import Test.Unit (failure, success, suite, test)
import Test.Unit.Assert (assert)

import Thermite.Router.Types (PathPart(..), Hash(..))
import Thermite.Router.Parser (match, parse)

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
            test "match paths" $
                let url = "/user/1/book/2"
                    urlR = parse id url
                    pat = "/user/:user_id/book/:book_id"
                    res = match pat urlR
                    expected = SM.fromFoldable [Tuple "user_id" "1", Tuple "book_id" "2"]
                 in case res of
                         Nothing -> failure ("url: " <> url <> " did not match: " <> pat)
                         Just args -> assert ("got wrong args for url: " <> url <> ": " <> show args.args ) $ args.args == expected

            test "do not match paths" $ do
                doNotMatch "/user/:user_id/lunch/:lunch_id" "/user/1/book/2"
                doNotMatch "/user" "user"
                doNotMatch "/user" "user/"
                doNotMatch "/user/" "/user"
                doNotMatch "/user/:user_id" "user/23"
              where
                  doNotMatch pat url =
                    let urlR = parse id url
                        res = match pat urlR
                    in case res of
                            Nothing -> success
                            Just _ -> failure $ "url " <> url <> " matched " <> pat
