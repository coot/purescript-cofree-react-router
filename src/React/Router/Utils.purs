module React.Router.Utils where

import Prelude
import Data.Array as A
import Data.List as L
import Data.Maybe (Maybe(..))
import Data.NonEmpty (NonEmpty, (:|))
import Routing.Types (Route, RoutePart(..)) as R

-- | Print `Routing.Types.Route` as a string,  useful for debugging.
routeToString :: R.Route -> String
routeToString url = L.intercalate "/" $ unwrap <$> url
  where
    unwrap (R.Path p) = p
    unwrap (R.Query q) = "?" <> (show q)
