module React.Router where

import Prelude (($), id)
import Control.Comonad.Cofree (head, tail)
import Data.Array as A
import Data.Maybe (Maybe(..), maybe)
import React (ReactClass, ReactElement, createElement)
import Global (decodeURIComponent)

import Data.Dynamic (Dynamic, fromDynamic, toDynamic)

import React.Router.Types (Route, Router, URL, getURLPattern, getDynamic)
import React.Router.Parser (match, parse)
import Data.Typeable (class Typeable, class Typeable1, mkTyRep)

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

newtype ReactClass' props = RC (ReactClass props)

instance typeable1ReactClass' :: Typeable1 ReactClass' where
    typeOf1 _ = mkTyRep "React.Router" "ReactClass'"

rr :: forall props. Typeable props => ReactClass props -> Dynamic
rr cls = toDynamic (RC cls :: ReactClass' props)

re :: forall props. Typeable props => Dynamic -> props -> Array ReactElement
re dyn props = maybe [] (\cls -> [createElement cls props []]) $ fromDynamic dyn

runRouter ::  String -> Router -> Array ReactElement
runRouter urlStr router = stepBF [router] [router]
    where
        url :: URL
        url = parse decodeURIComponent urlStr

        check :: Route -> Maybe (Array ReactElement)
        check route =
            case match (getURLPattern route) url of
                Nothing -> Nothing
                Just rd -> Just $ re (getDynamic route) rd

        -- breadth first search
        stepBF :: Array Router -> Array Router -> Array ReactElement
        stepBF rs rs' =
            case A.head rs of
                 Nothing -> let rs1 = A.concatMap tail rs'
                             in stepBF rs1 rs1
                 Just r -> case check (head r) of
                    Just res -> res
                    Nothing -> stepBF (maybe [] id $ A.tail rs) rs'


-- | routerSpec which runs `runRouter` computation on every route change
-- router :: Router -> ReactSpec
-- router = unsafeCoerce
