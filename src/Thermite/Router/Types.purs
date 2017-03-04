module Thermite.Router.Types where

import Prelude ((<>), class Eq, class Show)
import Data.StrMap (StrMap())
import Data.Newtype (class Newtype)

newtype PathPart = PathPart String

derive instance newTypePathPart :: Newtype PathPart _

instance showPathPart :: Show PathPart where
    show (PathPart s) = "(PathPart " <> s <> ")"

derive instance eqPathPart :: Eq PathPart

type Query = StrMap String

newtype Hash = Hash String

derive instance newHash :: Newtype Hash _

instance showHash :: Show Hash where
    show (Hash s) = "Hash " <> s

derive instance eqHash :: Eq Hash

type Route = { path:: Array PathPart, query:: Query, hash:: Hash }

type RouteData =  { args:: StrMap String, query:: Query, hash:: Hash }

type UrlPattern = String
