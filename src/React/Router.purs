module React.Router where

import Data.Array as A
import Control.Comonad.Cofree (Cofree, head, tail, (:<))
import Data.Foldable (foldl, foldr)
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..), fst, snd)
import Global (decodeURIComponent)
import Optic.Getter (view)
import Prelude (map, ($), (<$>))
import React (ReactClass, ReactElement, createElement)
import React.Router.Parser (match, parse)
import React.Router.Types (Route(..), RouteClass, RouteData(..), RouteProps, Router, URL, routeUrlLens)

-- type alias to make type annotations more readable
type RouteInfo = {routeClass:: RouteClass, indexClass:: Maybe RouteClass, props:: RouteProps}

-- | remove all branches that are annotated with `Nothing`
shake :: forall a. Cofree Array (Maybe a) -> Maybe (Cofree Array a)
shake cof = case head cof of
    Nothing -> Nothing
    Just a -> Just $ a :< go (tail cof)
  where
    go :: Array (Cofree Array (Maybe a)) -> Array (Cofree Array a)
    go cofs = foldl f [] cofs
      where f cofs cof = case head cof of
              Nothing -> cofs
              Just cofHead -> A.snoc cofs (cofHead :< go (tail cof))

runRouter ::  String -> Router -> Maybe ReactElement
runRouter urlStr router = case shake $ go (parse decodeURIComponent urlStr) router of
      Nothing -> Nothing
      Just cof -> Just (createRouteElement cof)
    where

    -- check if `url :: URL` matches `route :: Route`, if so return a Tuple of RouteClass and RouteProps.
    check :: Route
          -> URL
          -> Maybe {url :: URL, props :: RouteProps}
    check route url =
        case match (view routeUrlLens route) url of
            Nothing -> Nothing
            Just (Tuple urlReset (RouteData args query hash)) -> case route of
                Route id _ _ -> Just { url: urlReset
                                     , props: { id, args, query, hash }
                                     }

    -- traverse Cofree and match routes
    go :: URL -> Router -> Cofree Array (Maybe {url :: URL, props :: RouteProps, route :: Route, indexRoute :: Maybe (ReactClass RouteProps)})
    go url r = case match of
          Just {url, props} -> Just {url, props, route, indexRoute} :< map (go url) (tail r)
          Nothing -> Nothing :< []
      where
        head_ = head r

        route :: Route
        route = fst head_

        indexRoute :: Maybe RouteClass
        indexRoute = snd head_

        match = check route url

    -- traverse Cofree and produce ReactElement
    createRouteElement :: Cofree Array {url :: URL, props :: RouteProps, route :: Route, indexRoute :: Maybe (ReactClass RouteProps)}
                       -> ReactElement
    createRouteElement cof = asElement (head cof) (tail cof)
      where
        asElement :: {url :: URL, props :: RouteProps, route :: Route, indexRoute :: (Maybe RouteClass)}
                  -> Array (Cofree Array {url :: URL, props :: RouteProps, route :: Route, indexRoute :: (Maybe RouteClass)})
                  -> ReactElement
        asElement {url, props, route, indexRoute} [] =
          case route of (Route _ _ cls) -> createElement cls props (maybe [] (\idxCls -> A.singleton $ createElement idxCls props []) indexRoute)
        asElement {url, props, route, indexRoute} cofs =
          case route of (Route _ _ cls) -> createElement cls props (addIndex $ createRouteElement <$> cofs)
            where
              -- add index if indexRoute is present
              addIndex :: Array ReactElement -> Array ReactElement
              addIndex children = maybe children (\idxCls -> A.cons (createElement idxCls props []) children) indexRoute


-- | routerSpec which runs `runRouter` computation on every route change
-- router :: Router -> ReactSpec
-- router = unsafeCoerce
