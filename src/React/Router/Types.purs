module React.Router.Types 
  ( (:+)
  , Hash(Hash)
  , IndexRoute(IndexRoute)
  , PathPart(PathPart)
  , Query
  , Route(Route)
  , RouteClass
  , RouteData(RouteData)
  , RouteProps
  , Router
  , URL
  , URLPattern
  , routeClassLens
  , routeIdLens
  , routeUrlLens
  , withoutIndex
  ) where

import Prelude ((<>), class Eq, class Show, show)
import Control.Comonad.Cofree ((:<), Cofree)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.StrMap (StrMap())
import Data.Tuple (Tuple(..))
import Optic.Types (Lens')
import Optic.Lens (lens)
import React (ReactClass)

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

type RouteProps = { id :: String, args :: StrMap String, query :: StrMap String, hash :: Hash }

type RouteClass = ReactClass RouteProps

-- | Route type
-- | The first parameter is the id property
data Route = Route String URLPattern RouteClass

-- | IndexRoute type
-- | The first parameter is the id property
data IndexRoute = IndexRoute String RouteClass

instance showRoute :: Show Route where
    show (Route id_ url _) = "<Route \"" <> id_ <> "\" \"" <> url <> "\">"

routeIdLens :: Lens' Route String
routeIdLens = lens (\(Route id _ _) -> id) (\(Route _ url cls) id -> Route id url cls)

routeUrlLens :: Lens' Route URLPattern
routeUrlLens = lens (\(Route _ url _) -> url) (\(Route id _ cls) url -> Route id url cls)

routeClassLens :: Lens' Route (ReactClass RouteProps)
routeClassLens = lens (\(Route _ _ cls) -> cls) (\(Route id url _) cls -> Route id url cls)

-- | Router
-- | ```
-- | router =
-- |     Route "home" "/" Home :+
-- |         [ Route "user" "user/:id" User :+
-- |             [ Route "email" "email" UserEmail :+ []
-- |             , Route "password" "password" UserPassword :+ []
-- |             ]
-- |         , Tuple (Route "books" "books" Books) (Just BooksIndex) :<
-- |             [ Route "book" ":id" Book :+ []
-- |             , Route "reader" "reader" BookReader :+ []
-- |             ]
-- |         ]
-- | ```


type Router = Cofree Array (Tuple Route (Maybe IndexRoute))

withoutIndex :: Route -> Array Router -> Router
withoutIndex r rs = Tuple r Nothing :< rs

infixr 6 withoutIndex as :+
