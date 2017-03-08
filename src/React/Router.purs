module React.Router where

import Prelude (($), (==), (>=), (-), (<>), id, map)
import Control.Comonad.Cofree (head, tail)
import Data.Array as A
import Data.Maybe (Maybe(..), fromJust, maybe)
import Data.Newtype (unwrap)
import Data.Tuple (Tuple(Tuple), fst, snd)
import React (ReactClass, ReactElement, createElement)
import Global (decodeURIComponent)
import Partial.Unsafe (unsafePartial)

import React.Router.Types
    ( Route(Route)
    , Router
    , URL
    , RouteData(RouteData)
    , RouteClass
    , RouteProps(RouteProps)
    , Triple(Triple)
    , getRouteURLPattern
    )
import React.Router.Parser (match, parse)

-- type alias to make type annotations more readable
type RouteInfo = Triple RouteClass (Maybe RouteClass) RouteProps

runRouter ::  String -> Router -> Maybe (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
runRouter urlStr router =
    combine $ addEmptyChildren $ stepBF [Triple [] url router]
    where
        url :: URL
        url = parse decodeURIComponent urlStr

        -- check if `url1 :: URL` matches `route :: Route`, if so return a Tuple of RouteClass and RouteProps.
        check :: Route
              -> URL
              -> Maybe {url:: URL, cls:: RouteClass, props:: RouteProps}
        check route url1 =
            case match (getRouteURLPattern route) url1 of
                Nothing -> Nothing
                Just (Tuple url2 (RouteData args query hash)) -> case route of
                    Route id_ _ cls -> Just { url: url2
                                            , cls: cls
                                            , props: (RouteProps { id: id_, args, query, hash})
                                            }

        -- pushes tail of the router onto the stack
        push :: (Triple (Array RouteInfo) URL Router)
             -> Array (Triple (Array RouteInfo) URL Router)
             -> Array (Triple (Array RouteInfo) URL Router)
        push r rs = rs <> rs_
          where
              rs_ = case map tail r of 
                        Triple cnt url router -> map (\router_ -> Triple cnt url router_) router

        -- breadth first search
        stepBF :: Array (Triple (Array RouteInfo) URL Router)
               -> Array RouteInfo
        stepBF rs = do
            case A.uncons rs of
                 -- 404 error
                 Nothing -> []
                 Just {head: (Triple cnt url' r), tail: rsTail} ->
                    -- match for route at the head of the router
                    let route = fst $ head r
                        midx = snd $ head r
                     in case check route url' of
                        -- match returns rest of the url, a RouteClass and RouteProps
                        Just {url: url'', cls, props} ->
                            if A.length url''.path == 0
                               -- return the results, include index route
                               then A.snoc cnt (Triple cls midx props)
                               -- continue matching and add a tuple of url and
                               -- a router to match at one level deeper
                               else stepBF $ push (Triple (A.snoc cnt (Triple cls Nothing props)) url'' r) rsTail 
                        Nothing -> stepBF (maybe [] id $ A.tail rs)

        -- add children (index route) and unwrap RouteClass
        addEmptyChildren :: Array RouteInfo
                         -> Array (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
        addEmptyChildren = map (\(Triple cls midx props) -> Triple (unwrap cls) props (maybe [] (\cls -> [createElement (unwrap cls) props []]) midx))

        -- build ReactClass from a list of classes, traverse the list from the
        -- end creating elements and attaching them as children of the parent
        combine :: Array (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
                -> Maybe (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
        combine rps | A.length rps == 1 = A.head rps
        combine rps | A.length rps >= 2 = combine $ A.snoc (A.take (len - 2) rps) newLast
          where
              len = A.length rps

              t = unsafePartial $ fromJust (rps A.!! (len - 2))

              t' = unsafePartial $ fromJust (A.last rps)

              newLast :: Triple (ReactClass RouteProps) RouteProps (Array ReactElement)
              newLast = case t, t' of
                    Triple cls props children, Triple cls' props' children' ->
                        Triple cls props (children <> [ createElement cls' props' children' ])
        combine _ = Nothing


-- | routerSpec which runs `runRouter` computation on every route change
-- router :: Router -> ReactSpec
-- router = unsafeCoerce
