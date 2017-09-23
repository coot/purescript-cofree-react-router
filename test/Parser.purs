module Test.Parser
  ( testSuite ) where

import Prelude

import Data.Foldable (foldMap)
import Data.List (List(..), zip, (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(Nothing, Just))
import Data.Monoid (mempty)
import Data.Monoid.Disj (Disj(..))
import Data.Newtype (ala)
import Data.Traversable (sequence_)
import Data.Tuple (Tuple(..))
import Routing.Parser (parse)
import Routing.Types (RoutePart(..))
import Test.Unit (TestSuite, suite, test)
import Test.Unit.Assert (assert)

testSuite :: forall eff. TestSuite eff
testSuite =
  suite "Parser" do
    test "parse with query"
      let urls = "/home?a=1&b=2" : "/home/10/?a=1&b=2" : "/home?a=1?b=2" : Nil
          lastIsQuery rs = case L.last rs of
                             Just (Query q) -> true
                             _ -> false
          rss = lastIsQuery <<< parse id <$> urls
          zipped = zip urls (lastIsQuery <<< parse id <$> urls)

          _test (Tuple url isQuery) = assert ("last path part should be query in " <> url) isQuery

      in sequence_ (_test <$> zipped)

    test "parse query"
      let urls = "/home?a=1&b=2" : "/home?a=1&b=2" : "/home?c=1?a=1&b=2" : Nil
          getQuery rs =
            case L.last rs of
              (Just (Query q)) -> q
              _ -> mempty
          zipped = zip urls (getQuery <<< parse id <$> urls)
          _test (Tuple url q) = assert ("unexpected query for url: " <> url) $ q == M.fromFoldable [Tuple "a" "1", Tuple "b" "2"] 
      in sequence_ (_test <$> zipped)

    test "parse query with trailing slash"
      let url = "/home?a=1&b=2/"
          rs = parse id url

          lastIsEmpty =
            case L.last rs of
              Just (Path p) -> p == ""
              Just _ -> false
              Nothing -> false

          containsQuery = ala Disj foldMap
            $ (case _ of
                Path _ -> false
                Query _ -> true) <$> rs

      in do
        assert "unexpected length" $ L.length rs == 4
        assert "last path part is not empty string" $ lastIsEmpty
        assert "should contain query" $ containsQuery

