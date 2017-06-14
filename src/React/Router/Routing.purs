module React.Router.Routing
  ( runRouter
  , matchRouter
  ) where

import Prelude

import Control.Alt ((<|>))
import Control.Comonad.Cofree (Cofree, head, tail, (:<))
import Control.Monad.State (State, evalState, get, modify)
import Data.Array as A
import Data.Either (Either(..))
import Data.Foldable (foldMap, foldr)
import Data.Lens (view, set)
import Data.Map (Map) as M
import Data.Maybe (Maybe(..), maybe)
import Data.Monoid (mempty)
import Data.Traversable (sequence)
import Data.Tuple (Tuple(..))
import Data.Validation.Semiring (unV)
import Global (decodeURIComponent)
import React (ReactElement, createElement)
import React.Router.Class (class RoutePropsClass, mkProps, idLens)
import React.Router.Parser (parse)
import React.Router.Types (IndexRoute(..), Route(..), Router, urlLens)
import Routing.Match (Match(..))
import Routing.Match.Class (end, lit, params)
import Routing.Types (Route, RoutePart(..)) as R
import Unsafe.Coerce (unsafeCoerce)

-- | Remove all branches that are annotated with `Nothing`
-- | it also elminates not fully consumed URLs
shake
  :: forall a arg
   . Cofree Array (Maybe {url :: R.Route, arg :: arg | a})
  -> Maybe (Cofree Array {url :: R.Route, arg :: arg | a})
shake cof = case head cof of
    Nothing -> Nothing
    Just r ->
      let tail_ = go (tail cof)
      in if A.length tail_ /= 0 || matchEnd r.url
           then Just (r :< tail_)
           else Nothing
  where
    matchEnd :: R.Route -> Boolean
    matchEnd url =
      -- match end, trailing "/" or trailing params
      case end <|> lit "" *> end <|> params *> end of
        Match fn -> unV (const false) (const true) $ fn url

    go
      :: Array (Cofree Array (Maybe {url :: R.Route, arg :: arg | a }))
      -> Array (Cofree Array {url :: R.Route, arg :: arg | a})
    go cofs = foldr f [] cofs
      where 
        f cof_ cofs_ = case head cof_ of
                       Nothing -> cofs_
                       Just cofHead ->
                         let tail_ = go $ tail cof_
                         in if A.length tail_ /= 0 || matchEnd cofHead.url
                              then A.cons (cofHead :< go (tail cof_)) cofs_
                              else cofs_

matchRouter
  :: forall props arg
   . (RoutePropsClass props arg)
  => R.Route
  -> Router props arg
  -> Maybe (Cofree Array {url :: R.Route, arg :: arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)})
matchRouter url_ router = shake $ go url_ router
    where
    -- traverse Cofree and match routes
    go
      :: R.Route
      -> Cofree Array (Tuple (Route props arg) (Maybe (IndexRoute props arg)))
      -> Cofree Array (Maybe {url :: R.Route, arg:: arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)})
    go url' r =
      case head r of
        Tuple route indexRoute ->
          case view urlLens route of
            Match mFn ->
              case unV Left Right (mFn url') of
                Right (Tuple url arg) -> Just {url, arg, route, indexRoute} :< map (go url) (tail r)
                Left err -> Nothing :< []

-- | Main entry point for running `Router`, it returns `ReactElement` that can
-- | be injected into React vDOM.
runRouter
  :: forall props arg
   . (RoutePropsClass props arg)
  => String
  -> Cofree Array (Tuple (Route props arg) (Maybe (IndexRoute props arg)))
  -> Maybe ReactElement
runRouter urlStr router =
  evalState (sequence $ createRouteElement <$> matchRouter url_ router) []
    where
    url_ = parse decodeURIComponent urlStr

    query :: M.Map String String
    query = foldMap toMap url_

    toMap :: R.RoutePart -> M.Map String String
    toMap (R.Path _) = mempty
    toMap (R.Query q) = q

    -- traverse Cofree and produce ReactElement
    createRouteElement
      :: Cofree Array {url :: R.Route, arg :: arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)}
      -> State (Array arg) ReactElement
    createRouteElement cof = asElement (head cof) (tail cof)

    asElement
      :: {url :: R.Route, arg :: arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)}
      -> Array (Cofree Array {url :: R.Route, arg :: arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)})
      -> State (Array arg) ReactElement
    asElement {arg, route: route@(Route id_ _ cls), indexRoute} [] = do
      args <- get
      let 
        props :: props arg
        props = mkProps id_ arg (A.cons arg args) query []
        index :: Array ReactElement
        index = maybe [] (\(IndexRoute id idxCls) -> A.cons (createElement idxCls (set idLens id props) []) []) indexRoute
      pure $ createElement cls props index
    asElement {arg, route: (Route id_ _ cls), indexRoute} cofs = do
      modify (A.cons arg)
      args <- get
      children <- sequence $ createRouteElement <$> cofs
      pure $ createElement cls (mkProps id_ arg args query (coerce cofs)) children

    coerce :: forall r. Array (Cofree Array {url :: R.Route, arg :: arg | r}) -> Array (Cofree Array {url :: R.Route, arg :: arg })
    coerce = unsafeCoerce
