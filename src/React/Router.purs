module React.Router where

import Prelude (($), (==), (>), (-), id, map)
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
    combine $ addEmptyChildren $ stepBF [] [Tuple url router] []
    where
        url :: URL
        url = parse decodeURIComponent urlStr

        -- check if `url1 :: URL` matches `route :: Route`, if so return a Tuple of RouteClass and RouteProps.
        check :: Route -> URL -> Maybe (Tuple URL (Tuple RouteClass RouteProps))
        check route url1 =
            case match (getRouteURLPattern route) url1 of
                Nothing -> Nothing
                Just (Tuple url2 (RouteData args query hash)) -> case route of
                        Route id_ _ cls -> Just $ Tuple url2 (Tuple cls (RouteProps { id: id_, args, query, hash} ))

        -- breadth first search
        stepBF :: Array (Tuple RouteClass RouteProps) -> Array (Tuple URL Router) -> Array (Tuple URL Router) -> Array (Tuple RouteClass RouteProps)
        stepBF cnt rs rs' = do
            case A.head rs of
                 Nothing -> let rs1 = map (map tail) rs' :: Array (Tuple URL (Array Router))
                                rs2 = A.concatMap (\(Tuple a bs) -> map (\b -> Tuple a b) bs) rs1 :: Array (Tuple URL Router)
                             in if A.length rs2 == 0
                                   -- 404 error
                                   then []
                                   else stepBF cnt rs2 []
                 Just (Tuple url' r) ->
                    -- match for route at the head of the router
                    case check (head r) url' of
                        -- match returns rest of the url and a tuple of RouteClass and RouteArgs
                        Just (Tuple url'' res') -> 
                            if A.length url''.path == 0
                                -- return the results
                                then A.snoc cnt res'
                                -- continue matching at one level deeper
                                else stepBF cnt [] (A.snoc rs' (Tuple url'' r))
                        Nothing -> stepBF cnt (maybe [] id $ A.tail rs) rs'

        -- add empty children and unwrap RouteClass
        addEmptyChildren :: Array (Tuple RouteClass RouteProps) -> Array (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
        addEmptyChildren = map (\(Tuple cls props) -> Triple (unwrap cls) props [])

        -- build ReactClass from a list of classes, traverse the list from the
        -- end creating elements and attaching them as children of the parent
        combine :: Array (Triple (ReactClass RouteProps) RouteProps (Array ReactElement)) -> Maybe (Triple (ReactClass RouteProps) RouteProps (Array ReactElement))
        combine rps | A.length rps == 1 = A.head rps
        combine rps | A.length rps  > 2 = combine $ A.snoc (A.take (len - 3) rps) newLast
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
