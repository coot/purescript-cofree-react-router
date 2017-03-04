module Thermite.Router.Parser
    ( parse
    ) where

import Prelude ((<<<), (<=), (<$>), (<*>), (<>), ($), bind, map)
import Control.MonadPlus (guard)
import Data.Array as A
import Data.Either (fromRight)
import Data.StrMap as SM
import Data.Maybe (Maybe(..))
import Data.String as S
import Data.String.Regex (regex, split) as Reg
import Data.String.Regex.Flags (global) as Reg
import Data.Tuple (Tuple(..))
import Data.Traversable (traverse)
import Partial.Unsafe (unsafePartial)

import Thermite.Router.Types (Route, PathPart(..), Query, Hash(..))

parseQuery :: (String -> String) -> String -> Maybe Query
parseQuery decode str = do
    map SM.fromFoldable $ traverse part2tuple parts
    where
        parts :: Array String
        parts = A.fromFoldable $ S.split (S.Pattern "&") str

        part2tuple :: String -> Maybe (Tuple String String)
        part2tuple inp = do
            let keyVal = S.split (S.Pattern "=") inp
            guard $ A.length keyVal <= 2
            Tuple <$> (map decode $ A.head keyVal) <*> (map decode $ keyVal A.!! 1)

split :: String -> Array String
split url = Reg.split reg url
    where reg = unsafePartial $ fromRight $ Reg.regex "(?=[?#])" Reg.global

parse :: (String -> String) -> String -> Route
parse decode url = A.foldl go { path: [], query: SM.empty, hash: Hash "" } (split url) 
  where
      go :: Route -> String -> Route
      go r p = 
          case S.take 1 p of
            "?" -> case (parseQuery decode $ S.drop 1 p) of
                        Nothing -> r
                        Just q -> r { query = r.query <> q }
            "#" -> r { hash = Hash (decode $ S.drop 1 p) } 
            _ -> r { path = r.path <> ((PathPart <<< decode) <$> S.split (S.Pattern "/") p) }
