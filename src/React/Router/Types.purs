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
import DOM.HTML.History (URL)
import Data.Lens (Lens', lens)
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
newtype RouteProps arg = RouteProps
  -- | id of the route
  { id :: String
  -- | argument of the last matched url part
  , arg :: arg
  -- | list of all matched url parts (its head is `arg`)
  , args :: List arg
  -- | query map
  , query :: Map String String
  -- | tail of the route params, this complements the information from `args`.
  -- | It has the information about all mounted children.  You can use
  -- | `React.Router.Utils.findLocation` to query it.
  , tail :: List (Cofree List {url :: R.Route, arg :: arg})
  }

-- | lens to get the id of route properties
-- | ```purescript
-- |    do
-- |      props <- getProps this
-- |      let id = view idLens props
-- | ```
idLens :: forall arg. Lens' (RouteProps arg) String
idLens = lens (\(RouteProps rp) -> rp.id) (\(RouteProps rp) id_ -> RouteProps (rp { id = id_ }))

instance routePropsRoutePropsClass :: RoutePropsClass RouteProps arg where
  idLens = idLens
  mkProps name arg args query tail = RouteProps { id: name, arg, args, query, tail }

derive instance newtypeRouteProps :: Newtype (RouteProps arg) _

-- | React component which will be mounted at matching node
-- | It recieves array of all matching routes.
type RouteClass props arg = (RoutePropsClass props arg) => ReactClass (props arg)

-- | Route type
-- | The first parameter is an identifier.
data Route props arg = Route String (R.Match arg) (RouteClass props arg)

-- | IndexRoute type
-- | The first parameter is the id property.
data IndexRoute props arg = IndexRoute String (RouteClass props arg)

instance showRoute :: Show (Route props arg) where
  show (Route id_ _ _) = "<Route \"" <> id_ <> "\">"

urlLens
  :: forall props arg
   . (RoutePropsClass props arg)
  => Lens' (Route props arg) (R.Match arg)
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
type Router props arg =
    (RoutePropsClass props arg)
  => Cofree List (Tuple (Route props arg) (Maybe (IndexRoute props arg)))

withoutIndex
  :: forall props arg
   . (RoutePropsClass props arg)
  => Route props arg
  -> List (Cofree List (Tuple (Route props arg) (Maybe (IndexRoute props arg))))
  -> Cofree List (Tuple (Route props arg) (Maybe (IndexRoute props arg)))
withoutIndex r rs = Tuple r Nothing :< rs

-- | `:+` lets define routes without index route
infixr 5 withoutIndex as :+

newtype RouterConfig = RouterConfig
  -- | URL base name at which the router should expect to be mounted
  { baseName :: Maybe URL
  -- | If `ignore` returns `true`, this router will not update its state.
  -- | This lets emped a router inside another one.
  , ignore :: URL -> Boolean
  }

derive instance newtypeRouterConfig :: Newtype RouterConfig _

defaultConfig :: RouterConfig
defaultConfig = RouterConfig
  { baseName: Nothing
  , ignore: \_ -> false
  }
