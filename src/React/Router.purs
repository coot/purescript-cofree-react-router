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

-- routeSpec :: forall eff state props action. Route -> T.Spec eff (Tuple RouterState state) action

{--
  - Router
  - 
  - router =
  -     Route "/" Home
  -         [ IndexRoute Users []
  -         , Route "user/:id" User
  -             [ Route "email" UserEmail []
  -             , Route "password" UserPassword []
  -             ]
  -         , Route "books" Books
  -             [ Route ":id" Book []
  -             , Route "reader" BookReader []
  -             ]
  -         ]
  - 
  - this is an annotated tree!
  --}

type RouteArgs = { id:: String, routeData:: RouteData, children:: Array ReactElement }

routeProps :: RouteArgs -> RouteProps
routeProps { id, routeData, children } =
    case routeData of
        RouteData args query hash -> RouteProps { id, args, query, hash }

runRouter ::  String -> Router -> Maybe (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
runRouter urlStr router =
    combine $ addEmptyChildren $ stepBF [Triple [] url router] []
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

        -- breadth first search
        stepBF :: Array (Triple (Array (Triple RouteClass (Maybe RouteClass) RouteProps)) URL Router)
               -> Array (Triple (Array (Triple RouteClass (Maybe RouteClass) RouteProps)) URL Router)
               -> Array (Triple RouteClass (Maybe RouteClass) RouteProps)
        stepBF rs rs' = do
            case A.uncons rs of
                 Nothing -> let 
                                rs1 :: Array (Triple (Array (Triple RouteClass (Maybe RouteClass) RouteProps)) URL (Array Router))
                                rs1 = map (map tail) rs'

                                rs2 :: Array (Triple (Array (Triple RouteClass (Maybe RouteClass) RouteProps)) URL Router)
                                rs2 = A.concatMap (\(Triple cnt' url routers) -> map (\router_ -> Triple cnt' url router_) routers) rs1
                             in if A.length rs2 == 0
                                   -- 404 error
                                   then []
                                   else stepBF rs2 []
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
                               else stepBF rsTail (A.snoc rs' (Triple (A.snoc cnt (Triple cls Nothing props)) url'' r))
                        Nothing -> stepBF (maybe [] id $ A.tail rs) rs'

        -- add children (index route) and unwrap RouteClass
        addEmptyChildren :: Array (Triple RouteClass (Maybe RouteClass) RouteProps)
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
