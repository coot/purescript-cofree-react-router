module Test.Utils
  ( testSuite ) where

import Prelude

import Control.Comonad.Cofree ((:<))
import Data.Either (Either(..))
import Data.List (List(..), (:))
import Data.Maybe (Maybe(Just, Nothing))
import Data.Tuple (Tuple(..))
import React.Router.Utils (findLocation, hasBaseName, joinUrls, showLocation, stripBaseName, (:<<<), (:>>>))
import Test.Unit (TestSuite, failure, suite, test)
import Test.Unit.Assert (assert)

data Location = Home | User Int | Settings

instance showLocation :: Show Location where
  show Home = "/home"
  show (User id) = "user/" <> show id
  show (Settings) = "settings/"

testSuite :: forall eff. TestSuite eff
testSuite = suite "Utils" do

  test "hasBaseName" do
    assert "should return true when basename is Nothing" $ hasBaseName Nothing "/home"
    assert "expected /prefix to have basename (Just /prefix)" $ hasBaseName (Just "/prefix") "/prefix"
    assert "expected /prefix/ to have basename (Just /prefix)" $ hasBaseName (Just "/prefix") "/prefix/"
    assert "expected /prefix? to have basename (Just /prefix)" $ hasBaseName (Just "/prefix") "/prefix?"
    assert "expected /prefix# to have basename (Just /prefix)" $ hasBaseName (Just "/prefix") "/prefix#"
    assert "expected /prefixx to not have basename (Just /prefix)" $ not $ hasBaseName (Just "/prefix") "/prefixx"
    assert "expected /home to not have basename (Just /prefix)" $ not $ hasBaseName (Just "/prefix") "/home"

  test "stripBaseName" do
    let s = stripBaseName (Just "/home") "/home/url"
    assert ("expected /home/url to be /url but got: " <> s) $ s == "/url"

  test "joinUrls" do
    let r1 = joinUrls "/a" "/b"
    assert ("expected /a/b but got " <> r1) $ r1 == "/a/b"
    let r2 = joinUrls "/a/" "/b"
    assert ("expected /a/b but got " <> r2) $ r2 == "/a/b"
    let r3 = joinUrls "/a/" "b" 
    assert ("expected /a/b but got " <> r3) $ r3 == "/a/b"
    let r4 = joinUrls "" "/b"
    assert ("expected /b but got " <> r4) $ r4 == "/b"
    let r5 = joinUrls "/a" ""
    assert ("expected /a but got " <> r5) $ r5 == "/a"

  test "showLocation" do
    let r1 = showLocation (Home : User 1 : Nil)
        e1 = "/home/user/1"
    assert ("expected " <> e1 <> " but got " <> r1) $ r1 == e1
    let r2 = showLocation (Home : User 1 : Settings : Nil)
        e2 = "/home/user/1/settings/"
    assert ("expected " <> e2 <> " but got " <> r2) $ r2 == e2
    let r3 = showLocation [Home, Settings, User 1]
        e3 = "/home/settings/user/1"
    assert ("expected " <> e3 <> " but got " <> r3) $ r3 == e3

  test "findLocation & composeFL" do
    let ws =
          ({ arg: Left "left", url: Nil } :<
            (({ arg: Right "right", url: Nil } :< Nil)
            : Nil))
          : Nil
        _left { arg: Left x } = Just x
        _left { arg: Right _ } = Nothing

        _right { arg: Left _ } = Nothing
        _right { arg: Right x } = Just x

    case (findLocation _right :<<< findLocation _left) ws of
      Just (Tuple (Tuple "left" (Just "right")) _) -> pure unit
      _ -> failure "failed to pattern match"

    case (findLocation _right :>>> findLocation _left) ws of
      Nothing -> pure unit
      Just _  -> failure "should not match"
