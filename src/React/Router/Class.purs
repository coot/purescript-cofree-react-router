module React.Router.Class where


import Control.Comonad.Cofree (Cofree)
import Data.Lens (Lens')
import Data.Map (Map)
import Routing.Types (Route) as R

-- | The `RoutePropsClass` type class let one extend the properties passed to
-- | each `RouteClass` react class component.  There is one instance
-- | `RouteProps` defined in the `React.Router.Type` module.
-- | The `mkProps` member function receives the name of the route and an
-- | nonempty array of args read from the url.  You can use
-- | `React.Router.Utils.last` function to get the last element of the array
-- | with arguments obtained from the corrsponding url part.
class RoutePropsClass props arg | props -> arg where
  idLens :: Lens' (props arg) String
  mkProps :: String -> arg -> Array arg -> Map String String -> Array (Cofree Array {url :: R.Route, arg :: arg}) -> props arg
