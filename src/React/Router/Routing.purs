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
import Data.Tuple (Tuple(..), fst, snd)
import Global (decodeURIComponent)
import Optic.Getter (view)
import Optic.Setter (set)
import React (ReactElement, createElement)
import React.Router.Match (runMatch)
import React.Router.Types (IndexRoute(..), Route(..), RouteProps_(..), RouteProps, Router, idLens, urlLens)
import Routing.Match.Class (lit)
import Routing.Parser (parse) as R
import Routing.Types (Route) as R

-- | Remove all branches that are annotated with `Nothing`
-- | it also elminates not fully consumed URLs
shake
  :: forall a args
   . Cofree Array (Maybe {url :: R.Route, props :: (RouteProps_ args) | a})
  -> Maybe (Cofree Array {url :: R.Route, props :: (RouteProps_ args) | a})
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
      :: Array (Cofree Array (Maybe {url :: R.Route, props :: (RouteProps_ args) | a }))
      -> Array (Cofree Array {url :: R.Route, props :: (RouteProps_ args) | a})
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
  :: forall args
   . R.Route
  -> Router args
  -> Maybe (Cofree Array {url :: R.Route, props :: RouteProps_ args, route :: Route args, indexRoute :: Maybe (IndexRoute args)})
matchRouter url router = case shake $ go url router of
      Nothing -> Nothing
      Just cof -> Just cof
    where

    -- check if `url :: R.Route` matches `route :: Route`, if so return a Tuple of RouteClass and RouteProps.
    check :: Route args
          -> R.Route
          -> Maybe {url :: R.Route, props :: (RouteProps_ args)}
    check route@(Route idRoute _ _) url =
      case runMatch (view urlLens route) url of
           Left _ -> Nothing
           Right (Tuple urlRest args) -> Just { url: urlRest , props: wrap { id: idRoute, args } }

    -- traverse Cofree and match routes
    go
      :: R.Route
      -> Router args
      -> Cofree Array (Maybe {url :: R.Route, props :: (RouteProps_ args), route :: Route args, indexRoute :: Maybe (IndexRoute args)})
    go url r = case check route url of
                    Just {url, props} ->
                      Just {url, props, route, indexRoute} :< map (go url) (tail r)
                    Nothing ->
                      Nothing :< []
      where
        head_ = head r

        route :: Route args
        route = fst head_

        indexRoute :: Maybe (IndexRoute args)
        indexRoute = snd head_

-- | Main entry point for running `Router`, it returns `ReactElement` that can
-- | be injected into React vDOM.
runRouter
  :: forall args
   . String
   -> Router args
   -> Maybe ReactElement
runRouter urlStr router = createRouteElement [] <$> matchRouter (R.parse decodeURIComponent urlStr) router
    where

    -- traverse Cofree and produce ReactElement
    createRouteElement
      :: Array args
      -> Cofree Array {url :: R.Route, props :: RouteProps_ args, route :: Route args, indexRoute :: Maybe (IndexRoute args)}
      -> ReactElement
    createRouteElement args cof = asElement args (head cof) (tail cof)
      where
        asElement
          :: Array args
          -> {url :: R.Route, props :: RouteProps_ args, route :: Route args, indexRoute :: Maybe (IndexRoute args)}
          -> Array (Cofree Array {url :: R.Route, props :: RouteProps_ args, route :: Route args, indexRoute :: Maybe (IndexRoute args)})
          -> ReactElement
        asElement argsArr {url, props: props@(RouteProps propsRec), route, indexRoute} [] =
          case route of (Route _ _ cls) -> createElement cls newProps (addIndex [])
          where
            -- add index if indexRoute is present
            addIndex :: Array ReactElement -> Array ReactElement
            addIndex children = maybe children (\(IndexRoute id idxCls) -> A.cons (createElement idxCls (set idLens id newProps) []) children) indexRoute

            newArgsArr = A.snoc argsArr propsRec.args

            newProps :: RouteProps args
            newProps = RouteProps (propsRec { args = U.snoc argsArr propsRec.args })

        asElement argsArr {url, props: props@(RouteProps propsRec), route, indexRoute} cofs =
          case route of (Route _ _ cls) ->
            createElement cls newProps (createRouteElement newArgsArr <$> cofs)
              where
              newArgsArr = A.snoc argsArr propsRec.args

              newProps :: RouteProps args
              newProps = RouteProps (propsRec { args = U.snoc argsArr propsRec.args })
