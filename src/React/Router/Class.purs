module React.Router.Class where

import Data.NonEmpty (NonEmpty)
import Optic.Types (Lens, Lens')

-- | The `RoutePropsClass` type class let one extend the properties passed to
-- | each `RouteClass` react class component.  There is one instance
-- | `RouteProps` defined in the `React.Router.Type` module.
-- | The `mkProps` member function recieves the name of the route and the args
-- | matched from the url.
class RoutePropsClass props where
  idLens :: forall args. Lens' (props args) String
  argsLens :: forall args args'. Lens (props args) (props args') (NonEmpty Array args) (NonEmpty Array args')
  mkProps :: forall args. String -> args -> props args
