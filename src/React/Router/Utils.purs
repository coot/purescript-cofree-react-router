module React.Router.Utils where

import Data.Array as A
import Data.Maybe (Maybe(..))
import Data.NonEmpty (NonEmpty, (:|))

last :: forall a. NonEmpty Array a -> a
last (a :| as) =
  case A.last as of
    Nothing -> a
    Just l -> l

snoc :: forall a. Array a -> a -> NonEmpty Array a
snoc as a =
  case A.uncons as of
    Nothing -> a :| as
    Just {head, tail} -> head :| A.snoc tail a
