module Thermite.Router.Parser
    ( parse
    , match
    ) where

import Prelude ((<<<), (<=), (==), (/=), (<$>), (<*>), (<>), ($), bind, id, map)
import Control.MonadPlus (guard)
import Data.Array as A
import Data.Either (fromRight)
import Data.StrMap as SM
import Data.Maybe (Maybe(..), maybe)
import Data.String as S
import Data.String.Regex (regex, split) as Reg
import Data.String.Regex.Flags (global) as Reg
import Data.Tuple (Tuple(..))
import Data.Traversable (traverse)
import Partial.Unsafe (unsafePartial)

import Thermite.Router.Types (Route, PathPart(..), Query, Hash(..), UrlPattern, RouteData)

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


match :: UrlPattern -> Route -> Maybe (RouteData)
match pat r = 
    if  A.length patPath /= A.length r.path
        then Nothing
        else maybe Nothing wrap $ go (A.zip patPath r.path) SM.empty
    where
        patPath :: Array PathPart
        patPath = (parse id pat).path

        go :: Array (Tuple PathPart PathPart) -> (SM.StrMap String) -> Maybe (SM.StrMap String)
        go ps args =
            case head of
                 Nothing -> Just args
                 Just (Tuple (PathPart p) (PathPart u)) -> case S.take 1 p of
                                   ":" -> go (maybe [] id tail) (args <> SM.singleton (S.drop 1 p) u)
                                   _ -> if (p == u)
                                           then go (maybe [] id tail) args
                                           else Nothing
            where
              head = A.head ps
              tail = A.tail ps
              
        wrap :: SM.StrMap String -> Maybe RouteData
        wrap args = Just { args: args, query: r.query, hash: r.hash }
