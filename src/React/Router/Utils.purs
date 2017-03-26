module React.Router.Utils where

import Prelude
import Data.Array as A
import Data.List as L
import Data.Maybe (Maybe(..))
import Data.NonEmpty (NonEmpty, (:|))
import Routing.Types (Route, RoutePart(..)) as R

-- | get last element on `NonEmpty Array a`
-- | this is useful to get the route args for the current args inside
-- | `RouteClass` component:
-- | ```purescript
-- |    do
-- |      props <- getProps this
-- |      let arg = last props.args
-- | ```
last :: forall a. NonEmpty Array a -> a
last (a :| as) =
  case A.last as of
    Nothing -> a
    Just l -> l

append :: forall a. Array a -> NonEmpty Array a -> NonEmpty Array a
append as (b :| bs) = case A.uncons as of
                        Nothing -> b :| bs
                        Just {head, tail} -> head :| (A.snoc tail b <> bs)

-- | Print `Routing.Types.Route` as a string,  useful for debugging.
routeToString :: R.Route -> String
routeToString url = L.intercalate "/" $ unwrap <$> url
  where
    unwrap (R.Path p) = p
    unwrap (R.Query q) = "?" <> (show q)
