module React.Router.Types 
  ( RouterConfig(RouterConfig)
  , IndexRoute(IndexRoute)
  , Route(Route)
  , RouteClass
  , RouteProps(..)
  , Router
  , defaultConfig
  , withoutIndex
  , (:+)
  -- lenses
  , urlLens
  ) where

import Prelude

import Control.Comonad.Cofree ((:<), Cofree)
import Control.Monad.Eff (Eff)
import Data.Lens (Lens', Getter', lens, to)
import Data.List (List)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple(..))
import React (ReactClass)
import React.Router.Class (class RoutePropsClass)
import Routing.Match (Match) as R
import Routing.Types (Route) as R

-- | `RouteProps` type keeps track route related data: id, currently matched
-- | argument and array of arguments - if the route is nested this will hold
-- | list of all parent arguments.
newtype RouteProps arg eff = RouteProps
  { id :: String
  , arg :: arg
  , args :: List arg
  , query :: Map String String
  , tail :: List (Cofree List {url :: R.Route, arg :: arg})
  , onLeave :: Eff eff Unit
  }

derive instance newtypeRouteProps :: Newtype (RouteProps arg eff) _

-- | lens to get the id of route properties
-- | ```purescript
-- |    do
-- |      props <- getProps this
-- |      let id = view idLens props
-- | ```
idLens :: forall arg e. Lens' (RouteProps arg e) String
idLens = lens (\(RouteProps rp) -> rp.id) (\(RouteProps rp) id_ -> RouteProps (rp { id = id_ }))

onLeaveGetter :: forall arg eff. Getter' (RouteProps arg eff) (Eff eff Unit)
onLeaveGetter = to (\(RouteProps { onLeave }) -> onLeave)

instance routePropsRoutePropsClass :: RoutePropsClass RouteProps arg eff where
  onLeave = onLeaveGetter
  idLens = idLens
  mkProps name arg args query tail onLeave = RouteProps { id: name, arg, args, query, tail, onLeave }

-- | React component which will be mounted at matching node
-- | It recieves array of all matching routes.
type RouteClass props arg eff = (RoutePropsClass props arg eff) => ReactClass (props arg eff)

-- | Route type
-- | The first parameter is an identifier.
data Route props arg eff = Route String (R.Match arg) (RouteClass props arg eff)

-- | IndexRoute type
-- | The first parameter is the id property.
data IndexRoute props arg eff = IndexRoute String (RouteClass props arg eff)

instance showRoute :: Show (Route props arg eff) where
  show (Route id_ _ _) = "<Route \"" <> id_ <> "\">"

urlLens
  :: forall props arg eff
   . (RoutePropsClass props arg eff)
  => Lens' (Route props arg eff) (R.Match arg)
urlLens = lens (\(Route _ url _) -> url) (\(Route id _ cls) url -> Route id url cls)

-- | Router
-- | ```
-- | router :: Router RouteProps Unit
-- | router =
-- |   Route "main" (unit <$ lit "") mainClass :+
-- |     (Route "home" (unit <$ lit "home") homeClass :+ Nil)
-- |     : (Tuple (Route "user" (unit <$ (lit "user" *> int)) userClass) (Just $ IndexRoute "user-index" userIndexClass) :<
-- |         (Route "book" (unit <$ (lit "books" *> int)) bookClass :+
-- |           (Route "pages" (unit <$ lit "pages") pagesClass :+
-- |             (Route "page" (unit <$ int) pageClass :+ Nil)
-- |             : Nil)
-- |           : Nil)
-- |         : Nil)
-- |     : (Route "user-settings" (unit <$ (lit "user" *> int *> lit "settings")) settingsClass :+ Nil)
-- |     : Nil
-- | ```
type Router props arg eff =
    (RoutePropsClass props arg eff)
  => Cofree List (Tuple (Route props arg eff) (Maybe (IndexRoute props arg eff)))

withoutIndex
  :: forall props arg eff
   . (RoutePropsClass props arg eff)
  => Route props arg eff
  -> List (Cofree List (Tuple (Route props arg eff) (Maybe (IndexRoute props arg eff))))
  -> Cofree List (Tuple (Route props arg eff) (Maybe (IndexRoute props arg eff)))
withoutIndex r rs = Tuple r Nothing :< rs

-- | `:+` lets define routes without index route
infixr 5 withoutIndex as :+

newtype RouterConfig = RouterConfig { baseName :: Maybe String }

derive instance newtypeRouterConfig :: Newtype RouterConfig _

defaultConfig :: RouterConfig
defaultConfig = RouterConfig { baseName: Nothing }
