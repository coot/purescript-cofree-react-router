module React.Router.Routing
  ( runRouter
  , matchRouter
  ) where

import Prelude
import Data.Array as A
import Control.Comonad.Cofree (Cofree, head, tail, (:<))
import Data.Either (Either(..))
import Data.Foldable (foldl)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (wrap)
import Data.NonEmpty (NonEmpty)
import Data.Tuple (Tuple(..), fst, snd)
import Global (decodeURIComponent)
import Optic.Getter (view)
import Optic.Setter (set)
import React (ReactElement, createElement)
import React.Router.Match (runMatch)
import React.Router.Types (IndexRoute(..), Route(..), RouteProps(RouteProps), Router, URL, idLens, urlLens)
import React.Router.Utils as U
import Routing.Parser (parse) as R

-- | remove all branches that are annotated with `Nothing`
-- | it should also elminate not fully consumed URLs
shake
  :: forall a args
   . Cofree Array (Maybe {url :: URL, props :: (RouteProps args) | a})
  -> Maybe (Cofree Array {url :: URL, props :: (RouteProps args) | a})
shake cof = case head cof of
    Nothing -> Nothing
    Just a -> Just (a :< go (tail cof))
  where
    go
      :: Array (Cofree Array (Maybe {url :: URL, props :: (RouteProps args) | a }))
      -> Array (Cofree Array {url :: URL, props :: (RouteProps args) | a})
    go cofs = foldl f [] cofs
      where 
        f cofs cof = case head cof of
                       Nothing -> cofs
                       Just cofHead -> A.snoc cofs (cofHead :< go (tail cof))

matchRouter
  :: forall args
   . URL
  -> Router args
  -> Maybe (Cofree Array {url :: URL, props :: RouteProps args, route :: Route args, indexRoute :: Maybe (IndexRoute args)})
matchRouter url router = case shake $ go url router of
      Nothing -> Nothing
      Just cof -> Just cof
    where

    -- check if `url :: URL` matches `route :: Route`, if so return a Tuple of RouteClass and RouteProps.
    check :: Route args
          -> URL
          -> Maybe {url :: URL, props :: (RouteProps args)}
    check route url =
      case runMatch (view urlLens route) url of
           Left _ -> Nothing
           Right (Tuple urlRest args) ->
             case route of
                  Route id _ _ -> Just { url: urlRest , props: wrap { id, args } }

    -- traverse Cofree and match routes
    go
      :: URL
      -> Router args
      -> Cofree Array (Maybe {url :: URL, props :: (RouteProps args), route :: Route args, indexRoute :: Maybe (IndexRoute args)})
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
      -> Cofree Array {url :: URL, props :: RouteProps args, route :: Route args, indexRoute :: Maybe (IndexRoute args)}
      -> ReactElement
    createRouteElement args cof = asElement args (head cof) (tail cof)
      where
        asElement
          :: Array args
          -> {url :: URL, props :: RouteProps args, route :: Route args, indexRoute :: Maybe (IndexRoute args)}
          -> Array (Cofree Array {url :: URL, props :: RouteProps args, route :: Route args, indexRoute :: Maybe (IndexRoute args)})
          -> ReactElement
        asElement argsArr {url, props: props@(RouteProps propsRec), route, indexRoute} [] =
          case route of (Route _ _ cls) -> createElement cls newProps (addIndex [])
          where
            -- add index if indexRoute is present
            addIndex :: Array ReactElement -> Array ReactElement
            addIndex children = maybe children (\(IndexRoute id idxCls) -> A.cons (createElement idxCls (set idLens id newProps) []) children) indexRoute

            newArgsArr = A.snoc argsArr propsRec.args

            newProps = RouteProps (propsRec { args = U.snoc argsArr propsRec.args })

        asElement argsArr {url, props: props@(RouteProps propsRec), route, indexRoute} cofs =
          case route of (Route _ _ cls) ->
            createElement cls newProps (createRouteElement newArgsArr <$> cofs)
              where
              newArgsArr = A.snoc argsArr propsRec.args

              newProps = RouteProps (propsRec { args = U.snoc argsArr propsRec.args })
