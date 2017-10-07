module React.Router.Types 
  ( class RoutePropsClass
  , idLens
  , mkProps
  , RouterConfig(RouterConfig)
  , IndexRoute(IndexRoute)
  , Route(Route, OpenRoute)
  , RouteClass
  , RouteProps(..)
  , Router
  , defaultConfig
  , withoutIndex
  , (:+)
  , _id
  , _url
  , _cls

  , RouteLeaf(..)
  ) where

import Prelude

import Control.Comonad.Cofree ((:<), Cofree)
import DOM.HTML.History (URL)
import Data.Lens (Lens', lens)
import Data.List (List(..), (:))
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple.Nested (type (/\), (/\))
import React (ReactClass)
import Routing.Match (Match) as R
import Routing.Types (Route) as R
import Unsafe.Reference (unsafeRefEq)

newtype RouteLeaf arg = RouteLeaf { url :: R.Route, arg :: arg }

derive instance eqLeaf :: Eq arg => Eq (RouteLeaf arg)
derive instance newtypeLeaf :: Newtype (RouteLeaf arg) _

-- | The `RoutePropsClass` type class let one extend the properties passed to
-- | each `RouteClass` react class component.  There is one instance
-- | `RouteProps` defined in the `React.Router.Type` module.
-- | The `mkProps` member function receives the name of the route and an
-- | nonempty array of args read from the url.  You can use
-- | `React.Router.Utils.last` function to get the last element of the array
-- | with arguments obtained from the corrsponding url part.
class RoutePropsClass props arg | props -> arg where
  idLens :: Lens' (props arg) String
  mkProps
    :: String
    -> arg
    -> List arg
    -> Map String String
    -> List (Cofree List (RouteLeaf arg))
    -> R.Route
    -> props arg

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
  , tail :: List (Cofree List (RouteLeaf arg))
  -- | the URL tail (what is left after the current mount point)
  , url :: R.Route
  }

derive instance eqRouteProps :: Eq arg => Eq (RouteProps arg)

unsafeShallowRoutePropsRefEq :: forall arg. Eq arg => RouteProps arg -> RouteProps arg -> Boolean
unsafeShallowRoutePropsRefEq (RouteProps a) (RouteProps b)
   = a.id == b.id
  && a.arg == b.arg
  && a.args == b.args
  && a.query == b.query
  && unsafeListRefEq a.tail b.tail

  where
  unsafeListRefEq :: forall a. List a -> List a -> Boolean
  unsafeListRefEq Nil Nil = true
  unsafeListRefEq _ Nil = false
  unsafeListRefEq Nil _ = false
  unsafeListRefEq (c:cs) (d:ds) = if not $ c `unsafeRefEq` d then false else unsafeListRefEq cs ds


-- | lens to get the id of route properties
-- | ```purescript
-- |    do
-- |      props <- getProps this
-- |      let id = view idLens props
-- | ```
_propsId :: forall arg. Lens' (RouteProps arg) String
_propsId = lens (\(RouteProps rp) -> rp.id) (\(RouteProps rp) id_ -> RouteProps (rp { id = id_ }))

instance routePropsRoutePropsClass :: RoutePropsClass RouteProps arg where
  idLens = _propsId
  mkProps name arg args query tail url = RouteProps { id: name, arg, args, query, tail, url }

derive instance newtypeRouteProps :: Newtype (RouteProps arg) _

-- | React component which will be mounted at matching node
-- | It recieves array of all matching routes.
type RouteClass props arg = (RoutePropsClass props arg) => ReactClass (props arg)

-- | Route type
-- | The first parameter is an identifier.
data Route props arg
  = Route String (R.Match arg) (RouteClass props arg)
  | OpenRoute String (R.Match arg) (RouteClass props arg)

_id :: forall props arg. Route props arg -> String
_id = case _ of
  Route a _ _ -> a
  OpenRoute a _ _ -> a

_url :: forall props arg. Route props arg -> R.Match arg
_url = case _ of
  Route _ a _ -> a
  OpenRoute _ a _ -> a

_cls :: forall props arg. RoutePropsClass props arg => (Route props arg) -> (RouteClass props arg)
_cls = case _ of
  Route _ _ a -> a
  OpenRoute _ _ a -> a

-- | IndexRoute type
-- | The first parameter is the id property.
data IndexRoute props arg = IndexRoute String (RouteClass props arg)

instance showRoute :: Show (Route props arg) where
  show (Route id_ _ _) = "<Route \"" <> id_ <> "\">"
  show (OpenRoute id_ _ _) = "<OpenROute \"" <> id_ <> "\">"

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
  => Cofree List ((Route props arg) /\ (Maybe (IndexRoute props arg)))

withoutIndex
  :: forall props arg
   . (RoutePropsClass props arg)
  => Route props arg
  -> List (Cofree List ((Route props arg) /\ (Maybe (IndexRoute props arg))))
  -> Cofree List ((Route props arg) /\ (Maybe (IndexRoute props arg)))
withoutIndex r rs = r /\ Nothing :< rs

-- | `:+` lets define routes without index route
infixr 5 withoutIndex as :+

newtype RouterConfig = RouterConfig
  -- | URL base name at which the router should expect to be mounted
  { baseName :: Maybe URL }

derive instance newtypeRouterConfig :: Newtype RouterConfig _

defaultConfig :: RouterConfig
defaultConfig = RouterConfig { baseName: Nothing }
