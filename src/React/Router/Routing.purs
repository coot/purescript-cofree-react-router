module React.Router.Routing
  ( runRouter
  , matchRouter
  ) where

import Prelude
import Data.Array as A
import Data.List as L
import React.Router.Utils as U
import Control.Comonad.Cofree (Cofree, head, tail, (:<))
import Data.Either (Either(..), either)
import Data.Foldable (foldl)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (wrap)
import Data.NonEmpty (fromNonEmpty, (:|))
import Data.Tuple (Tuple(..), fst, snd)
import Global (decodeURIComponent)
import Optic.Getter (view)
import Optic.Setter (over, set)
import React (ReactElement, createElement)
import React.Router.Class (class RoutePropsClass, mkProps, idLens, argsLens)
import React.Router.Match (runMatch)
import React.Router.Types (IndexRoute(..), Route(..), RouteProps(..), Router, urlLens)
import Routing.Match.Class (lit)
import Routing.Parser (parse) as R
import Routing.Types (Route) as R

-- | Remove all branches that are annotated with `Nothing`
-- | it also elminates not fully consumed URLs
shake
  :: forall a props args
   . (RoutePropsClass props)
  => Cofree Array (Maybe {url :: R.Route, props :: props args | a})
  -> Maybe (Cofree Array {url :: R.Route, props :: props args | a})
shake cof = case head cof of
    Nothing -> Nothing
    Just r ->
      let tail_ = go (tail cof)
      in if A.length tail_ /= 0 || matchEnd r.url
           then Just (r :< tail_)
           else Nothing
  where
    matchEnd :: R.Route -> Boolean
    matchEnd url
      = L.length url == 0
        || L.length url == 1
        && (either (const false) (const true) $ runMatch (unit <$ lit "") url)

    go
      :: Array (Cofree Array (Maybe {url :: R.Route, props :: props args | a }))
      -> Array (Cofree Array {url :: R.Route, props :: props args | a})
    go cofs = foldl f [] cofs
      where 
        f cofs cof = case head cof of
                       Nothing -> cofs
                       Just cofHead ->
                         let tail_ = go $ tail cof
                         in if A.length tail_ /= 0 || matchEnd cofHead.url
                              then A.snoc cofs (cofHead :< go (tail cof))
                              else cofs

matchRouter
  :: forall props args
   . (RoutePropsClass props)
  => R.Route
  -> Router props args
  -> Maybe (Cofree Array {url :: R.Route, props :: props args, route :: Route props args, indexRoute :: Maybe (IndexRoute props args)})
matchRouter url router = case shake $ go [] url router of
      Nothing -> Nothing
      Just cof -> Just cof
    where
    -- traverse Cofree and match routes
    go
      :: Array args
      -> R.Route
      -> Cofree Array (Tuple (Route props args) (Maybe (IndexRoute props args)))
      -> Cofree Array (Maybe {url :: R.Route, props :: props args, route :: Route props args, indexRoute :: Maybe (IndexRoute props args)})
    go argsArr url r =
      case head r of
        Tuple route indexRoute ->
          case runMatch (view urlLens route) url of
            Right (Tuple url args) ->
              let props = case route of
                            Route idRoute _ _ -> mkProps idRoute (U.snoc argsArr args)
              in Just {url, props, route, indexRoute} :< map (go (A.snoc argsArr args) url) (tail r)
            Left _ -> Nothing :< []

-- | Main entry point for running `Router`, it returns `ReactElement` that can
-- | be injected into React vDOM.
runRouter
  :: forall props args
   . (RoutePropsClass props)
  => String
   -> Cofree Array (Tuple (Route props args) (Maybe (IndexRoute props args)))
   -> Maybe ReactElement
runRouter urlStr router = createRouteElement <$> matchRouter (R.parse decodeURIComponent urlStr) router
    where

    -- traverse Cofree and produce ReactElement
    createRouteElement
      :: Cofree Array {url :: R.Route, props :: props args, route :: Route props args, indexRoute :: Maybe (IndexRoute props args)}
      -> ReactElement
    createRouteElement cof = asElement (head cof) (tail cof)

    asElement
      :: {url :: R.Route, props :: props args, route :: Route props args, indexRoute :: Maybe (IndexRoute props args)}
      -> Array (Cofree Array {url :: R.Route, props :: props args, route :: Route props args, indexRoute :: Maybe (IndexRoute props args)})
      -> ReactElement
    asElement {url, props, route: route@(Route _ _ cls), indexRoute} [] =
      createElement cls props (addIndex [])
      where
        -- add index
        addIndex :: Array ReactElement -> Array ReactElement
        addIndex children = maybe children (\(IndexRoute id idxCls) -> A.cons (createElement idxCls (set idLens id props) []) children) indexRoute

    asElement {url, props, route, indexRoute} cofs =
      case route of (Route _ _ cls) ->
        createElement cls props (createRouteElement <$> cofs)
