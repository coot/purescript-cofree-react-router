module Thermite.Router where

import Prelude (class Functor, map)
import Data.Maybe (Maybe)
import Data.Tuple
import Control.Comonad.Cofree (Cofree(..))
import Routing.Match (Match)
import Thermite as T

-- routeSpec :: forall eff state props action. Route -> T.Spec eff (Tuple RouterState state) action

{--
  - Router
  - 
  - router =
  -     Route "/" Home
  -         [ IndexRoute Users []
  -         , Route "user/:id" User
  -             [ Route "email" UserEmail []
  -             , Route "password" UserPassword []
  -             ]
  -         , Route "books" Books
  -             [ Route ":id" Book []
  -             , Route "reader" BookReader []
  -             ]
  -         ]
  - 
  - this is an annotated tree!
  --}

type URL = String

-- | Ultimately I want to have combinators in the way purescript-routing is doing,
-- | but in addition I want them to be printable into strings provided arguments
type URLPattern = Match

-- | Route type
-- | The interface should allow to use lenses and prisms to map state and action from the larger state
-- | I want it to add route info into the props
data Route = Route (forall a. URLPattern a) (forall eff state props action. T.Spec eff state props action)
data IndexRoute = IndexRoute (forall eff state props action. T.Spec eff state props action)

type Router = Cofree Array (Tuple (Maybe IndexRoute) Route)

-- | runRouter
-- | run Router providing current URL return component to render
-- runRouter :: forall eff state props action. URL -> Router -> T.Spec eff state props action
-- runRouter url r = 



-- | routerSpec which runs `runRouter` computation on every route change
-- routerSpec :: forall eff state props action. T.Spec eff state props action
