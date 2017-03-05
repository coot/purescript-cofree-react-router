module React.Router.Types where

import Prelude ((<>), class Eq, class Show, show)
import Control.Comonad.Cofree (Cofree)
import Data.Dynamic (Dynamic)
import Data.StrMap (StrMap())
import Data.Newtype (class Newtype)
import Data.Typeable (class Typeable, mkTyRep)

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

instance showRouteData :: Show RouteData where
    show (RouteData a q h) = "RouteData " <> show a <> " " <> show q <> " " <> show h

instance typeableRouteData :: Typeable RouteData where
    typeOf _ = mkTyRep "React.Router.Types" "RouteData"

type URLPattern = String

-- | Route type
data Route = Route URLPattern Dynamic

getURLPattern :: Route -> URLPattern
getURLPattern (Route pat dyn) = pat

getDynamic :: Route -> Dynamic
getDynamic (Route pat dyn) = dyn

-- | Router type
type Router = Cofree Array Route
