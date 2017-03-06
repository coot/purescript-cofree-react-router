module React.Router.Types where

import Prelude ((<>), class Eq, class Show, class Functor, append, show)
import Control.Comonad.Cofree (Cofree)
import Data.Dynamic (Dynamic)
import Data.StrMap (StrMap())
import Data.Newtype (class Newtype)
import Data.Typeable (class Typeable, mkTyRep)
import React (ReactClass)

data Triple a b c = Triple a b c

instance functorTriple :: Functor (Triple a b) where
    map f (Triple a b c) = Triple a b (f c)

newtype PathPart = PathPart String

derive instance newTypePathPart :: Newtype PathPart _

instance showPathPart :: Show PathPart where
    show (PathPart s) = "(PathPart \"" <> s <> "\")"

derive instance eqPathPart :: Eq PathPart

type Query = StrMap String

newtype Hash = Hash String

derive instance newHash :: Newtype Hash _

instance showHash :: Show Hash where
    show (Hash s) = "Hash " <> s

derive instance eqHash :: Eq Hash

type URL = { path:: Array PathPart, query:: Query, hash:: Hash }

data RouteData = RouteData (StrMap String) Query Hash

instance showRouteData :: Show RouteData where
    show (RouteData a q h) = "RouteData " <> " " <> show a <> " " <> show q <> " " <> show h

type URLPattern = String

newtype RouteProps = RouteProps { id:: String, args:: StrMap String, query:: StrMap String, hash:: Hash }

derive instance newtypeRouteProps :: Newtype RouteProps _

newtype RouteClass = RouteClass (ReactClass RouteProps)

derive instance newtypeRouteClass :: Newtype RouteClass _ 

-- | Route type
-- | The first parameter is an identifier
data Route = Route String URLPattern RouteClass

instance showRoute :: Show Route where
    show (Route id_ url _) = "<Route " <> id_ <> ">"

getRouteId :: Route -> String
getRouteId (Route id_ _ _) = id_

getRouteURLPattern :: Route -> URLPattern
getRouteURLPattern (Route _ pat _) = pat

getRouteClass :: Route -> RouteClass
getRouteClass (Route _ _ cls) = cls

-- | Router type
type Router = Cofree Array Route
