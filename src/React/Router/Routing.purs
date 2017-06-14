module React.Router.Routing
  ( runRouter
  , matchRouter
  ) where

import Prelude

import Control.Alt ((<|>))
import Control.Comonad.Cofree (Cofree, head, tail, (:<))
import Data.Array as A
import Data.Either (Either(..))
import Data.Foldable (foldMap, foldl)
import Data.Lens (view, set)
import Data.Map (Map) as M
import Data.Maybe (Maybe(..), maybe)
import Data.Monoid (mempty)
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

-- | Remove all branches that are annotated with `Nothing`
-- | it also elminates not fully consumed URLs
shake
  :: forall a arg
   . Cofree Array (Maybe {url :: R.Route, arg :: arg, args :: Array arg | a})
  -> Maybe (Cofree Array {url :: R.Route, arg :: arg, args :: Array arg | a})
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
      :: Array (Cofree Array (Maybe {url :: R.Route, arg :: arg, args :: Array arg | a }))
      -> Array (Cofree Array {url :: R.Route, arg :: arg, args :: Array arg | a})
    go cofs = foldl f [] cofs
      where 
        f cofs_ cof_ = case head cof_ of
                       Nothing -> cofs_
                       Just cofHead ->
                         let tail_ = go $ tail cof_
                         in if A.length tail_ /= 0 || matchEnd cofHead.url
                              then A.snoc cofs_ (cofHead :< go (tail cof_))
                              else cofs_

matchRouter
  :: forall props arg
   . (RoutePropsClass props arg)
  => R.Route
  -> Router props arg
  -> Maybe (Cofree Array {url :: R.Route, arg :: arg, args :: Array arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)})
matchRouter url_ router = shake $ go [] url_ router
    where
    -- traverse Cofree and match routes
    go
      :: Array arg
      -> R.Route
      -> Cofree Array (Tuple (Route props arg) (Maybe (IndexRoute props arg)))
      -> Cofree Array (Maybe {url :: R.Route, arg:: arg, args :: Array arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)})
    go argsArr url' r =
      case head r of
        Tuple route indexRoute ->
          case view urlLens route of
            Match mFn ->
              case unV Left Right (mFn url') of
                Right (Tuple url arg) ->
                  let -- props = case route of Route idRoute _ _ -> mkProps idRoute arg (A.snoc argsArr arg) query
                      args = A.snoc argsArr arg
                  in Just {url, arg, args, route, indexRoute} :< map (go args url) (tail r)
                Left err -> Nothing :< []

-- | Main entry point for running `Router`, it returns `ReactElement` that can
-- | be injected into React vDOM.
runRouter
  :: forall props arg
   . (RoutePropsClass props arg)
  => String
  -> Cofree Array (Tuple (Route props arg) (Maybe (IndexRoute props arg)))
  -> Maybe ReactElement
runRouter urlStr router = createRouteElement <$> matchRouter url_ router
    where
    url_ = parse decodeURIComponent urlStr

    query :: M.Map String String
    query = foldMap toMap url_

    toMap :: R.RoutePart -> M.Map String String
    toMap (R.Path _) = mempty
    toMap (R.Query q) = q

    -- traverse Cofree and produce ReactElement
    createRouteElement
      :: Cofree Array {url :: R.Route, arg :: arg, args :: Array arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)}
      -> ReactElement
    createRouteElement cof = asElement (head cof) (tail cof)

    asElement
      :: {url :: R.Route, arg :: arg, args :: Array arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)}
      -> Array (Cofree Array {url :: R.Route, arg :: arg, args :: Array arg, route :: Route props arg, indexRoute :: Maybe (IndexRoute props arg)})
      -> ReactElement
    asElement {url, arg, args, route: route@(Route id_ _ cls), indexRoute} [] =
      createElement cls props (addIndex [])
      where
        props :: props arg
        props = mkProps id_ arg args query

        -- add index
        addIndex :: Array ReactElement -> Array ReactElement
        addIndex children = maybe children (\(IndexRoute id idxCls) -> A.cons (createElement idxCls (set idLens id props) []) children) indexRoute

    asElement {url, arg, args, route, indexRoute} cofs =
      case route of (Route id_ _ cls) ->
        createElement cls (mkProps id_ arg args query) (createRouteElement <$> cofs)
