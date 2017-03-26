module React.Router.Class where

import Data.NonEmpty (NonEmpty)
import Optic.Types (Lens, Lens')

class RoutePropsClass props where
  idLens :: forall args. Lens' (props args) String
  argsLens :: forall args args'. Lens (props args) (props args') (NonEmpty Array args) (NonEmpty Array args')
  mkProps :: forall args. String -> NonEmpty Array args -> props args
