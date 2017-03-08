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
    , getRouteURLPattern
    )
import React.Router.Parser (match, parse)

-- type alias to make type annotations more readable
type RouteInfo = {routeClass:: RouteClass, indexClass:: (Maybe RouteClass), props:: RouteProps}

runRouter ::  String -> Router -> Maybe {routeClass:: (ReactClass RouteProps), props:: RouteProps, children:: (Array ReactElement)}
runRouter urlStr router =
    combine $ addEmptyChildren $ stepBF [{matches: [], url: url, router: router}]
    where
        url :: URL
        url = parse decodeURIComponent urlStr

        -- check if `url1 :: URL` matches `route :: Route`, if so return a Tuple of RouteClass and RouteProps.
        check :: Route
              -> URL
              -> Maybe {url:: URL, routeClass:: RouteClass, props:: RouteProps}
        check route url1 =
            case match (getRouteURLPattern route) url1 of
                Nothing -> Nothing
                Just (Tuple url2 (RouteData args query hash)) -> case route of
                    Route id_ _ cls -> Just { url: url2
                                            , routeClass: cls
                                            , props: (RouteProps { id: id_, args, query, hash})
                                            }

        -- pushes tail of the router onto the stack
        push :: {matches:: Array RouteInfo, url:: URL, router:: Router}
             -> Array {matches:: (Array RouteInfo), url:: URL, router:: Router}
             -> Array {matches:: (Array RouteInfo), url:: URL, router:: Router}
        push r rs = rs <> (map (r { router = _ }) $ tail r.router)

        -- (tco) breadth first search
        stepBF :: Array {matches:: (Array RouteInfo), url:: URL, router:: Router}
               -> Array RouteInfo
        stepBF rs = do
            case A.uncons rs of
                 -- 404 error
                 Nothing -> []
                 Just {head: ri, tail: rsTail} ->
                    -- match for route at the head of the router
                    let route = fst $ head ri.router
                        midx = snd $ head ri.router
                     in case check route ri.url of
                        -- match returns rest of the url, a RouteClass and RouteProps
                        Just {url: url'', routeClass, props} ->
                            if A.length url''.path == 0
                               -- return the results, include index route
                               then A.snoc ri.matches {routeClass, props, indexClass: midx}
                               -- continue matching and add a tuple of url and
                               -- a router to match at one level deeper
                               else stepBF $ push { matches: A.snoc ri.matches {routeClass, props, indexClass: Nothing}
                                                  , url: url''
                                                  , router: ri.router
                                                  } rsTail 
                        Nothing -> stepBF (maybe [] id $ A.tail rs)

        -- add children (index route) and unwrap RouteClass
        addEmptyChildren :: Array RouteInfo
                         -> Array {routeClass:: (ReactClass RouteProps), props:: RouteProps, children:: Array ReactElement}
        addEmptyChildren =
            map (\ri -> { routeClass: (unwrap ri.routeClass)
                        , props: ri.props
                        , children: maybe [] (\cls -> [createElement (unwrap cls) ri.props []]) ri.indexClass
                        }
                )

        -- build ReactClass from a list of classes, traverse the list from the
        -- end creating elements and attaching them as children of the parent
        combine :: Array {routeClass:: (ReactClass RouteProps), props:: RouteProps, children:: Array ReactElement}
                -> Maybe {routeClass:: (ReactClass RouteProps), props:: RouteProps, children:: Array ReactElement}
        combine rps | A.length rps == 1 = A.head rps
        combine rps | A.length rps >= 2 = combine $ A.snoc (A.take (len - 2) rps) newLast
          where
              len = A.length rps

              t = unsafePartial $ fromJust (rps A.!! (len - 2))

              t' = unsafePartial $ fromJust (A.last rps)

              newLast :: {routeClass:: (ReactClass RouteProps), props:: RouteProps, children:: Array ReactElement}
              newLast = t { children = t.children <> [ createElement t'.routeClass t'.props t'.children ] }
        combine _ = Nothing


-- | routerSpec which runs `runRouter` computation on every route change
-- router :: Router -> ReactSpec
-- router = unsafeCoerce
