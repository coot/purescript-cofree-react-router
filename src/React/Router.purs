module React.Router where

import Prelude (($), (==), (>=), (-), id, map)
import Control.Comonad.Cofree (head, tail)
import Data.Array as A
import Data.Maybe (Maybe(..), fromJust, maybe)
import Data.Newtype (unwrap)
import Data.Tuple (Tuple(Tuple))
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
        check :: Route -> URL -> Maybe (Triple URL RouteClass RouteProps)
        check route url1 =
            case match (getRouteURLPattern route) url1 of
                Nothing -> Nothing
                Just (Tuple url2 (RouteData args query hash)) -> case route of
                        Route id_ _ cls -> Just $ Triple url2 cls (RouteProps { id: id_, args, query, hash})

        -- breadth first search
        stepBF :: Array (Triple (Array (Tuple RouteClass RouteProps)) URL Router) -> Array (Triple (Array (Tuple RouteClass RouteProps)) URL Router) -> Array (Tuple RouteClass RouteProps)
        stepBF rs rs' = do
            case A.uncons rs of
                 Nothing -> let rs1 = map (map tail) rs' :: Array (Triple (Array (Tuple RouteClass RouteProps)) URL (Array Router))
                                rs2 = A.concatMap (\(Triple cnt' a bs) -> map (\b -> Triple cnt' a b) bs) rs1 :: Array (Triple (Array (Tuple RouteClass RouteProps)) URL Router)
                             in if A.length rs2 == 0
                                   -- 404 error
                                   then []
                                   else stepBF rs2 []
                 Just {head: (Triple cnt url' r), tail: rsTail} ->
                    -- match for route at the head of the router
                    case check (head r) url' of
                        -- match returns rest of the url, a RouteClass and RouteProps
                        Just (Triple url'' cls props) ->
                            if A.length url''.path == 0
                                -- return the results
                                then A.snoc cnt (Tuple cls props)
                                -- continue matching and add a tuple of url and
                                -- a router to match at one level deeper
                                else stepBF rsTail (A.snoc rs' (Triple (A.snoc cnt (Tuple cls props)) url'' r))
                        Nothing -> stepBF (maybe [] id $ A.tail rs) rs'

        -- add empty children and unwrap RouteClass
        addEmptyChildren :: Array (Tuple RouteClass RouteProps) -> Array (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
        addEmptyChildren = map (\(Tuple cls props) -> Triple (unwrap cls) props [])

        -- build ReactClass from a list of classes, traverse the list from the
        -- end creating elements and attaching them as children of the parent
        combine :: Array (Triple (ReactClass RouteProps) RouteProps (Array ReactElement)) -> Maybe (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
        combine rps | A.length rps == 1 = A.head rps
        combine rps | A.length rps >= 2 = combine $ A.snoc (A.take (len - 2) rps) newLast
          where
              len = A.length rps

              t = unsafePartial $ fromJust (rps A.!! (len - 2))

              t' = unsafePartial $ fromJust (A.last rps)

              newLast :: Triple (ReactClass RouteProps) RouteProps (Array ReactElement)
              newLast = case t, t' of
                    Triple cls props children, Triple cls' props' children' ->
                        Triple cls props [ createElement cls' props' children' ]
        combine _ = Nothing


-- | routerSpec which runs `runRouter` computation on every route change
-- router :: Router -> ReactSpec
-- router = unsafeCoerce
