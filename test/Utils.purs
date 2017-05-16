module Test.Utils
  ( testSuite ) where

import Prelude
import Data.Maybe (Maybe(..), isJust)
import Data.Traversable (sequence_)
import Test.Unit (TestSuite, failure, success, suite, test)
import Test.Unit.Assert (assert)
import React.Router.Utils (hasBaseName, stripBaseName)

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
