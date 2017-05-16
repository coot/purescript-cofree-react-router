module React.Router.Types 
  ( Config
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
import Data.Lens (Lens', lens)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple(..))
import React (ReactClass)
import React.Router.Class (class RoutePropsClass)
import Routing.Match (Match) as R

-- | `RouteProps` type keeps track route related data: id, currently matched
-- | argument and array of arguments - if the route is nested this will hold
-- | list of all parent arguments.
newtype RouteProps arg = RouteProps { id :: String, arg :: arg, args :: Array arg, query :: Map String String }

-- | lens to get the id of route properties
-- | ```purescript
-- |    do
-- |      props <- getProps this
-- |      let id = view idLens props
-- | ```
idLens :: forall arg. Lens' (RouteProps arg) String
idLens = lens (\(RouteProps rp) -> rp.id) (\(RouteProps rp) id_ -> RouteProps (rp { id = id_ }))

instance routePropsRoutePropsClass :: RoutePropsClass RouteProps where
  idLens = idLens
  mkProps name arg args query = RouteProps { id: name, arg, args, query }

derive instance newtypeRouteProps :: Newtype (RouteProps arg) _

-- | React component which will be mounted at matching node
-- | It recieves array of all matching routes.
type RouteClass props arg = (RoutePropsClass props) => ReactClass (props arg)

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
   . (RoutePropsClass props)
  => Lens' (Route props arg) (R.Match arg)
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
type Router props arg = (RoutePropsClass props) => Cofree Array (Tuple (Route props arg) (Maybe (IndexRoute props arg)))

withoutIndex
  :: forall props arg
   . (RoutePropsClass props)
  => Route props arg
  -> Array (Cofree Array (Tuple (Route props arg) (Maybe (IndexRoute props arg))))
  -> Cofree Array (Tuple (Route props arg) (Maybe (IndexRoute props arg)))
withoutIndex r rs = Tuple r Nothing :< rs

-- | `:+` lets define routes without index route
infixr 6 withoutIndex as :+

type Config = { basename :: Maybe String }

defaultConfig :: Config
defaultConfig = { basename: Nothing }
