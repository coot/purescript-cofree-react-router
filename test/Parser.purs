module Test.Parser
  ( testSuite ) where

import Prelude

import Data.List (List(..), zip, (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(Nothing, Just), isJust)
import Data.Monoid (mempty)
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
      let urls = "/home?a=1&b=2" : "/home/10/?a=1&b=2" : Nil
          lastIsQuery rs = case L.last rs of
                             Just (Query q) -> true
                             _ -> false
          rss = lastIsQuery <<< parse id <$> urls
          zipped = zip urls (lastIsQuery <<< parse id <$> urls)

          _test (Tuple url isQuery) = assert ("last path part should be query in " <> url) isQuery

      in sequence_ (_test <$> zipped)

    test "parse query"
      let urls = "/home?a=1&b=2" : "/home?a=1&b=2" : Nil
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

          lastQuery =
            case L.last rs of
              Just (Query a) -> Just a
              _ -> Nothing

      in do
        assert ("unexpected length: " <> (show $ L.length rs)) $ L.length rs == 3
        assert "last path part is not empty string" $ isJust lastQuery
        let a = lastQuery >>= M.lookup "b"
        assert ("b is equal `2/`: " <> show a) $ a == Just "2/"
