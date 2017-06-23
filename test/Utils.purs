module Test.Utils
  ( testSuite ) where

import Prelude
import Data.Maybe (Maybe(Just, Nothing))
import React.Router.Utils (hasBaseName, joinUrls, stripBaseName)
import Test.Unit (TestSuite, suite, test)
import Test.Unit.Assert (assert)

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
    assert ("expected /a/b bot got " <> r3) $ r3 == "/a/b"
    let r4 = joinUrls "" "/b"
    assert ("expected /b bot got " <> r4) $ r4 == "/b"
