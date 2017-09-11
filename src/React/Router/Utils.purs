module React.Router.Utils 
  ( showLocation
  , mountedLocations
  , mountedLocationsRelative
  , findLocation
  , composeFL
  , (:>>>)
  , composeFLFlipped
  , (:<<<)
  , stripBaseName
  , hasBaseName
  , joinUrls
  , routeToString
  , warning
  ) where

import Prelude

import Control.Comonad.Cofree (Cofree, head, tail)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE)
import Data.Foldable (class Foldable, foldMap, foldl, foldr)
import Data.List (List(..), concatMap, (:))
import Data.List as L
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Maybe.First (First(First))
import Data.Monoid (class Monoid, mempty)
import Data.Newtype (un)
import Data.String as S
import Data.Tuple (Tuple(Tuple), fst, snd)
import React.Router.Types (RouteProps(..))
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

-- | Join two url strings putting `/` separator in between if necessary.
joinUrls :: String -> String -> String
joinUrls a b | S.null a = b
             | S.null b = a
             | otherwise =
  let _a = if S.charAt (S.length a - 1) a == Just '/'
            then S.take (S.length a - 1) a
            else a
      _b = if S.charAt 0 b == Just '/'
            then S.drop 1 b
            else b
  in _a <> "/" <> _b

-- | Fold over list of locations and join them as urls.
-- | ``` purescript
-- | showLocation (Home : User 1 : Settings) -- /user/1/settings
-- | ```
showLocation :: forall a t. Show a => Foldable t => t a -> String
showLocation t = foldl (\url -> joinUrls url <<< show) "" t

-- | Find location inside a tail of `Cofree List`.  This is useful for
-- | querying about children that are mounted under a given component.
findLocation
  :: forall arg a
   . ({ arg :: arg, url :: R.Route } -> Maybe a)
  -> List (Cofree List { arg :: arg, url :: R.Route })
  -> Maybe (Tuple a (List (Cofree List { arg :: arg, url :: R.Route})))
findLocation fn = un First <<< foldMap go
  where
    go :: Cofree List { arg :: arg, url :: R.Route } -> First (Tuple a (List (Cofree List { arg :: arg, url :: R.Route })))
    go w = First $ (\a -> Tuple a (tail w)) <$> (fn (head w))

-- | Compose two `findLocation _` functions.  Note that this composition runs
-- | from left to right (unlike function composition), i.e. the left argument is
-- | applied first and then the right argument is applied to the tail returned by the
-- | first one.  For example
-- | ```
-- | data A = A
-- | data B = B
-- | data C = C
-- | type Arg = { arg :: Location, url :: Route}
-- |
-- | fn :: Arg -> Maybe A
-- | fn _ = Just A
-- |
-- | gn :: Arg -> Maybe B
-- | gn _ = Just B
-- |
-- | hn :: Arg -> Maybe C
-- | hn _ = Just C
-- |
-- | (findLocation fn) :>>> (findLocation gn)
-- |  :: Arg
-- |  -> Maybe (Tuple (Tuple A (Maybe B)) (List (Cofree List Arg)))
-- |
-- | (findLocation fn) :>>> (findLocation gn) :>>> (findLocation hn)
-- |   :: Arg
-- |   -> Maybe (Tuple (Tuple A (Maybe (Tuple B (Maybe C)))) (List (Cofree List Arg)))
-- | ```
composeFL
  :: forall arg a b
   . (List (Cofree List { arg :: arg, url :: R.Route }) -> Maybe (Tuple a (List (Cofree List { arg :: arg, url :: R.Route}))))
  -> (List (Cofree List { arg :: arg, url :: R.Route }) -> Maybe (Tuple b (List (Cofree List { arg :: arg, url :: R.Route}))))
  -> List (Cofree List { arg :: arg, url :: R.Route })
  -> Maybe (Tuple (Tuple a (Maybe b)) (List (Cofree List { arg :: arg, url :: R.Route })))
composeFL f g ws = shuffle <$> ((map g) <$> f ws)
  where
    shuffle :: forall x y z. Monoid z => Tuple x (Maybe (Tuple y z)) -> Tuple (Tuple x (Maybe y)) z
    shuffle (Tuple x my) = Tuple (Tuple x (fst <$> my)) (maybe mempty snd my)

infixr 7 composeFL as :>>>

composeFLFlipped
  :: forall arg a b
   . (List (Cofree List { arg :: arg, url :: R.Route }) -> Maybe (Tuple a (List (Cofree List { arg :: arg, url :: R.Route}))))
  -> (List (Cofree List { arg :: arg, url :: R.Route }) -> Maybe (Tuple b (List (Cofree List { arg :: arg, url :: R.Route}))))
  -> List (Cofree List { arg :: arg, url :: R.Route })
  -> Maybe (Tuple (Tuple b (Maybe a)) (List (Cofree List { arg :: arg, url :: R.Route })))
composeFLFlipped = flip composeFL

infixr 7 composeFLFlipped as :<<<

-- | Take tail of the `RouteProps` and list all mounted locations relative.
-- | The resulting routes are relative to the current path.
-- |
-- | Note that the current path (i.e. `RouteProps { args }`) is not included.
mountedLocationsRelative
  :: forall arg
   . RouteProps arg
  -> List (List arg)
mountedLocationsRelative (RouteProps { tail: ws }) = concatMap (foldr fn (Nil : Nil)) ws
  where
    fn :: { arg :: arg, url :: R.Route } -> List (List arg) -> List (List arg)
    fn { arg } l = (arg : _) `map` l

-- | Like `mountedLocationsRelative` but the list full paths instead of
-- | relative ones.
-- |
-- | Note that the current path (i.e. `RouteProps { args }`) is not included.
mountedLocations
  :: forall arg
   . RouteProps arg
  -> List (List arg)
mountedLocations r@RouteProps { args } = (args <> _) `map` mountedLocationsRelative r
