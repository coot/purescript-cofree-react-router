module React.Router.Routing
  ( runRouter
  , matchRouter
  ) where

import Data.Array as A
import Control.Comonad.Cofree (Cofree, head, tail, (:<))
import Data.Foldable (foldl, foldr)
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..), fst, snd)
import Global (decodeURIComponent)
import Optic.Getter (view)
import Prelude (map, show, ($), (&&), (/=), (<$>), (<>), (==), (>))
import React (ReactClass, ReactElement, createElement)
import React.Router.Parser (match, parse)
import React.Router.Types (IndexRoute(..), Route(..), RouteClass, RouteData(..), RouteProps, Router, URL, routeUrlLens)

-- type alias to make type annotations more readable
type RouteInfo = {routeClass:: RouteClass, indexClass:: Maybe RouteClass, props:: RouteProps}

-- | remove all branches that are annotated with `Nothing`
-- | it should also elminate not fully consumed URLs
shake :: forall a. Cofree Array (Maybe {url :: URL, props :: RouteProps | a}) -> Maybe (Cofree Array {url :: URL, props :: RouteProps | a})
shake cof = case head cof of
    Nothing -> Nothing
    Just a -> 
      let tail_ = go (tail cof)
       in if is404 a.url tail_
             then Nothing
             else Just $ a :< go (tail cof)
  where
    is404 :: forall a. URL -> Array a -> Boolean
    is404 url tail = A.length url.path /= 0 && A.length tail == 0

    go :: Array (Cofree Array (Maybe { url :: URL, props :: RouteProps | a })) -> Array (Cofree Array { url :: URL, props :: RouteProps | a })
    go cofs = foldl f [] cofs
      where 
        f cofs cof = case head cof of
                          Nothing -> cofs
                          Just cofHead -> 
                            let tail_ = go (tail cof)
                             in if is404 cofHead.url tail_
                                   then cofs
                                   else A.snoc cofs (cofHead :< tail_)

matchRouter
  :: URL
  -> Router
  -> Maybe (Cofree Array {url :: URL, props :: RouteProps, route :: Route, indexRoute :: Maybe IndexRoute})
matchRouter url router = case shake $ go url router of
      Nothing -> Nothing
      Just cof -> Just cof
    where

    -- check if `url :: URL` matches `route :: Route`, if so return a Tuple of RouteClass and RouteProps.
    check :: Route
          -> URL
          -> Maybe {url :: URL, props :: RouteProps}
    check route url =
      case match (view routeUrlLens route) url of
           Nothing -> Nothing
           Just (Tuple urlRest (RouteData args query hash)) ->
             case route of
                  Route id _ _ -> Just { url: urlRest , props: { id, args, query, hash } }

    -- traverse Cofree and match routes
    go :: URL -> Router -> Cofree Array (Maybe {url :: URL, props :: RouteProps, route :: Route, indexRoute :: Maybe IndexRoute})
    go url r = case check route url of
                    Just {url, props} ->
                      Just {url, props, route, indexRoute} :< map (go url) (tail r)
                    Nothing ->
                      Nothing :< []
      where
        head_ = head r

        route :: Route
        route = fst head_

        indexRoute :: Maybe IndexRoute
        indexRoute = snd head_

runRouter ::  String -> Router -> Maybe ReactElement
runRouter urlStr router = createRouteElement <$> matchRouter (parse decodeURIComponent urlStr) router
    where

    -- traverse Cofree and produce ReactElement
    createRouteElement :: Cofree Array {url :: URL, props :: RouteProps, route :: Route, indexRoute :: Maybe IndexRoute}
                       -> ReactElement
    createRouteElement cof = asElement (head cof) (tail cof)
      where
        asElement :: {url :: URL, props :: RouteProps, route :: Route, indexRoute :: Maybe IndexRoute}
                  -> Array (Cofree Array {url :: URL, props :: RouteProps, route :: Route, indexRoute :: Maybe IndexRoute})
                  -> ReactElement
        asElement {url, props, route, indexRoute} [] =
          case route of (Route _ _ cls) -> createElement cls props (addIndex [])
          where
            -- add index if indexRoute is present
            addIndex :: Array ReactElement -> Array ReactElement
            addIndex children = maybe children (\(IndexRoute id idxCls) -> A.cons (createElement idxCls (props { id=id }) []) children) indexRoute
        asElement {url, props, route, indexRoute} cofs =
          case route of (Route _ _ cls) -> createElement cls props (createRouteElement <$> cofs)
