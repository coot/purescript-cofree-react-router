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
  , idLens
  , argsLens
  ) where

import Prelude
import Control.Comonad.Cofree ((:<), Cofree)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.NonEmpty (NonEmpty)
import Data.Tuple (Tuple(..))
import Optic.Lens (lens)
import Optic.Types (Lens, Lens')
import React (ReactClass)
import Routing.Match (Match) as R
import Routing.Types (Route) as R

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

-- | lens to get the arguments of route properties
-- | ```purescript
-- |    do
-- |      props <- getProps this
-- |      let arg = last (view argsLens props)
-- | ```
-- | where `last` is `React.Router.Utils.last`
-- | note that `view argsLens props` returns an object of type `NonEmpty Array _`.
argsLens :: forall args args'. Lens (RouteProps args) (RouteProps args') (NonEmpty Array args) (NonEmpty Array args')
argsLens = lens (\(RouteProps rp) -> rp.args) (\(RouteProps rp) args -> RouteProps (rp { args=args }))

derive instance newtypeRouteProps :: Newtype (RouteProps args) _

-- | React component which will be mounted at matching node
-- | It recieves array of all matching routes.
type RouteClass args = ReactClass (RouteProps args)

-- | Route type
-- | The first parameter is an identifier.
data Route args = Route String (R.Match args) (RouteClass args)

-- | IndexRoute type
-- | The first parameter is the id property.
data IndexRoute args = IndexRoute String (RouteClass args)

instance showRoute :: Show (Route args) where
  show (Route id_ _ _) = "<Route \"" <> id_ <> "\">"

urlLens :: forall args. Lens' (Route args) (R.Match args)
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
type Router args = Cofree Array (Tuple (Route args) (Maybe (IndexRoute args)))

withoutIndex
  :: forall args. Route args
  -> Array (Router args)
  -> Router args
withoutIndex r rs = Tuple r Nothing :< rs

-- | `:+` lets define routes without index route
infixr 6 withoutIndex as :+
