module React.Router.Types where

import Prelude ((<>), class Eq, class Show, class Semigroup, append, show)
import Control.Comonad.Cofree (Cofree)
import Data.Dynamic (Dynamic)
import Data.StrMap (StrMap())
import Data.Newtype (class Newtype)
import Data.Typeable (class Typeable, mkTyRep)
import React (ReactClass)

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

type URL = { path:: Array PathPart, query:: Query, hash:: Hash }

data RouteData = RouteData (StrMap String) Query Hash

instance semigroupRouteData :: Semigroup RouteData where
    append (RouteData rd q h) (RouteData rd' q' h') = RouteData (rd <> rd') q' h'

instance showRouteData :: Show RouteData where
    show (RouteData a q h) = "RouteData " <> show a <> " " <> show q <> " " <> show h

type URLPattern = String

newtype RouteClass = RouteClass (ReactClass RouteData)

instance newtypeRouteClass :: Newtype RouteClass (ReactClass RouteData) where
    unwrap (RouteClass cls) = cls
    wrap = RouteClass

-- | Route type
data Route = Route URLPattern RouteClass

getURLPattern :: Route -> URLPattern
getURLPattern (Route pat _) = pat

getClass :: Route -> RouteClass
getClass (Route _ cls) = cls

-- | Router type
type Router = Cofree Array Route
