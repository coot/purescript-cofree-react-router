module React.Router.Types 
  ( (:+)
  , IndexRoute(IndexRoute)
  , Route(Route)
  , RouteClass
  , RouteProps(..)
  , Router
  , withoutIndex
  -- lenses
  , urlLens
  ) where

import Prelude
import Control.Comonad.Cofree ((:<), Cofree)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.NonEmpty (NonEmpty)
import Data.Tuple (Tuple(..))
import Data.Lens (Lens', lens)
import React (ReactClass)
import React.Router.Class (class RoutePropsClass)
import Routing.Match (Match) as R

-- | `RouteProps` type, one should not need it, it is used internally.
newtype RouteProps args = RouteProps { id :: String, args :: NonEmpty Array args }

-- | lens to get the id of route properties
-- | ```purescript
-- |    do
-- |      props <- getProps this
-- |      let id = view idLens props
-- | ```
idLens :: forall args. Lens' (RouteProps args) String
idLens = lens (\(RouteProps rp) -> rp.id) (\(RouteProps rp) id -> RouteProps (rp { id=id }))

instance routePropsRoutePropsClass :: RoutePropsClass RouteProps where
  idLens = idLens
  mkProps name args = RouteProps { id: name, args: args }

derive instance newtypeRouteProps :: Newtype (RouteProps args) _

-- | React component which will be mounted at matching node
-- | It recieves array of all matching routes.
type RouteClass props args = (RoutePropsClass props) => ReactClass (props args)

-- | Route type
-- | The first parameter is an identifier.
data Route props args = Route String (R.Match args) (RouteClass props args)

-- | IndexRoute type
-- | The first parameter is the id property.
data IndexRoute props args = IndexRoute String (RouteClass props args)

instance showRoute :: Show (Route props args) where
  show (Route id_ _ _) = "<Route \"" <> id_ <> "\">"

urlLens
  :: forall props args
   . (RoutePropsClass props)
  => Lens' (Route props args) (R.Match args)
urlLens = lens (\(Route _ url _) -> url) (\(Route id _ cls) url -> Route id url cls)

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
type Router props args = (RoutePropsClass props) => Cofree Array (Tuple (Route props args) (Maybe (IndexRoute props args)))

withoutIndex
  :: forall props args
   . (RoutePropsClass props)
  => Route props args
  -> Array (Cofree Array (Tuple (Route props args) (Maybe (IndexRoute props args))))
  -> Cofree Array (Tuple (Route props args) (Maybe (IndexRoute props args)))
withoutIndex r rs = Tuple r Nothing :< rs

-- | `:+` lets define routes without index route
infixr 6 withoutIndex as :+
