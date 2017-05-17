module React.Router.Utils where

import Prelude
import Data.List as L
import Data.String as S
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE)
import Data.Maybe (Maybe(..), isJust)
import Routing.Types (Route, RoutePart(..)) as R

-- | Print `Routing.Types.Route` as a string,  useful for debugging.
routeToString :: R.Route -> String
routeToString url = L.intercalate "/" $ unwrap <$> url
  where
    unwrap (R.Path p) = p
    unwrap (R.Query q) = "?" <> (show q)

foreign import warning :: forall e. Boolean -> String -> Eff (console :: CONSOLE | e) Unit

hasBaseName :: Maybe String -> String -> Boolean
hasBaseName Nothing _ = true
hasBaseName (Just b) s = isJust (S.stripPrefix (S.Pattern b) s) && (S.null rest || next == "/" || next == "#" || next == "?")
  where
    rest = S.drop (S.length b) s
    next = S.take 1 rest

stripBaseName :: Maybe String -> String -> String
stripBaseName Nothing s = s
stripBaseName (Just b) s = S.drop (S.length b) s

joinUrls :: String -> String -> String
joinUrls a b =
  if S.null a
    then b
    else
      let _a = if S.charAt (S.length a - 1) a == Just '/'
                 then S.take (S.length a - 1) a
                 else a
          _b = if S.charAt 0 b == Just '/'
                 then S.drop 1 b
                 else b
      in _a <> "/" <> _b

  
