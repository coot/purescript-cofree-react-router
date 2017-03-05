module React.Router where

import Prelude (($), (==), (>), (-), id, map)
import Control.Comonad.Cofree (head, tail)
import Data.Array as A
import Data.Maybe (Maybe(..), fromJust, maybe)
import Data.Newtype (unwrap)
import Data.Tuple (Tuple(..), fst, snd)
import React (ReactClass, ReactElement, createElement)
import Global (decodeURIComponent)
import Partial.Unsafe (unsafePartial)

import React.Router.Types (Route, Router, URL, RouteData, RouteClass, getURLPattern, getClass)
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

type RouteArgs = { routeData :: RouteData, children :: Array ReactElement }

runRouter ::  String -> Router -> Maybe (Tuple RouteClass RouteArgs)
runRouter urlStr router = combine $ stepBF [] [Tuple url router] []
    where
        url :: URL
        url = parse decodeURIComponent urlStr

        check :: Route -> URL -> Maybe (Tuple URL (Tuple RouteClass RouteArgs))
        check route url1 =
            case match (getURLPattern route) url1 of
                Nothing -> Nothing
                Just (Tuple url2 routeData) -> Just $ Tuple url2 (Tuple (getClass route) ({ routeData, children: [] } :: RouteArgs))

        -- breadth first search
        stepBF :: Array (Tuple RouteClass RouteArgs) -> Array (Tuple URL Router) -> Array (Tuple URL Router) -> Array (Tuple RouteClass RouteArgs)
        stepBF cnt rs rs' =
            case A.head rs of
                 Nothing -> let rs1 = map (map tail) rs' :: Array (Tuple URL (Array Router))
                                rs2 = A.concatMap (\(Tuple a bs) -> map (\b -> Tuple a b) bs) rs1 :: Array (Tuple URL Router)
                             in stepBF cnt rs2 []
                 Just (Tuple url' r) -> case check (head r) url' of
                    Just (Tuple url'' res') -> 
                        if A.length url''.path == 0
                           then A.snoc cnt res'
                           else stepBF cnt [] (A.snoc rs' (Tuple url'' r))
                    Nothing -> stepBF cnt (maybe [] id $ A.tail rs) rs'

        combine :: Array (Tuple RouteClass RouteArgs) -> Maybe (Tuple RouteClass RouteArgs)
        combine rps | A.length rps == 1 = A.head rps
        combine rps | A.length rps  > 2 = combine $ A.snoc (A.take (len - 3) rps) newLast
          where
              len = A.length rps
              t = unsafePartial $ fromJust (rps A.!! (len - 2))

              rCls :: RouteClass
              rCls = fst t

              routeArgs :: RouteArgs
              routeArgs = snd t

              t' = unsafePartial $ fromJust (A.last rps)

              cls' :: ReactClass RouteData
              cls' = unwrap $ fst t'

              routeArgs' :: RouteArgs
              routeArgs' = snd t'

              newLast :: Tuple RouteClass RouteArgs
              newLast = Tuple rCls (routeArgs { children = [ createElement cls' (routeArgs'.routeData)  (routeArgs'.children) ] })
        combine _ = Nothing


-- | routerSpec which runs `runRouter` computation on every route change
-- router :: Router -> ReactSpec
-- router = unsafeCoerce
