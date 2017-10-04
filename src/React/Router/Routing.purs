module React.Router.Routing
  ( runRouter
  , matchRouter
  , LeafVal(..)
  ) where

import Prelude

import Control.Alt ((<|>))
import Control.Comonad.Cofree (Cofree, head, tail, (:<))
import Control.Monad.State (State, evalState, get, modify)
import DOM.HTML.History (URL(..))
import Data.Array as A
import Data.Either (Either(..))
import Data.Foldable (foldMap, foldr)
import Data.HeytingAlgebra (implies)
import Data.Lens (set)
import Data.List (List(..), null, toUnfoldable, (:))
import Data.Map (Map) as M
import Data.Maybe (Maybe(..), maybe)
import Data.Monoid (mempty)
import Data.Newtype (class Newtype)
import Data.Traversable (sequence)
import Data.Tuple (Tuple(..))
import Data.Validation.Semiring (unV)
import Global (decodeURIComponent)
import React (ReactElement, createElement)
import React.Router.Types (class RoutePropsClass, mkProps, idLens, RouteLeaf, IndexRoute(IndexRoute), Route(..), Router, _cls, _id, _url)
import Routing.Match (Match(..))
import Routing.Match.Class (end, lit, params)
import Routing.Parser (parse)
import Routing.Types (Route, RoutePart(..)) as R
import Unsafe.Coerce (unsafeCoerce)

newtype LeafVal props arg = LeafVal
  { url :: R.Route
  , arg :: arg
  , route :: Route props arg
  , indexRoute :: Maybe (IndexRoute props arg)
  , isOpen :: Boolean
  }

derive instance newtypeLeafVal :: Newtype (LeafVal props arg) _

-- | Remove all branches that are annotated with `Nothing`
-- | it also elminates not fully consumed URLs
shake
  :: forall props arg
   . Cofree List (Maybe (LeafVal props arg))
  -> Maybe (Cofree List (LeafVal props arg))
shake cof = case head cof of
    Nothing -> Nothing
    Just r@(LeafVal { url }) ->
      let tail_ = go (tail cof)
      in if not (null tail_) || matchEnd url
           then Just (r :< tail_)
           else Nothing
  where
    matchEnd :: R.Route -> Boolean
    matchEnd url =
      -- match end, trailing "/" or trailing params
      case end <|> lit "" *> end <|> params *> end of
        Match fn -> unV (const false) (const true) $ fn url

    go
      :: List (Cofree List (Maybe (LeafVal props arg)))
      -> List (Cofree List (LeafVal props arg))
    go cofs = foldr f Nil cofs
      where
        f cof_ cofs_ =
          case head cof_ of
            Nothing -> cofs_
            Just cofHead@LeafVal { isOpen, url } ->
              let tail_ = go $ tail cof_
              in if not isOpen `implies` (null tail_ `implies` matchEnd url)
                then (cofHead :< tail_) : cofs_
                else cofs_

matchRouter
  :: forall props arg
   . (RoutePropsClass props arg)
  => R.Route
  -> Router props arg
  -> Maybe (Cofree List (LeafVal props arg))
matchRouter url_ router = shake $ go url_ router
    where
    -- traverse Cofree and match routes
    go
      :: R.Route
      -> Cofree List (Tuple (Route props arg) (Maybe (IndexRoute props arg)))
      -> Cofree List (Maybe (LeafVal props arg))
    go url' r =
      case head r of
        Tuple route indexRoute ->
          case _url route of
            Match mFn ->
              let isOpen = case route of
                    Route _ _ _ -> false
                    OpenRoute _ _ _ -> true
              in case unV Left Right (mFn url') of
                Right (Tuple url arg) -> Just (LeafVal {url, arg, route, indexRoute, isOpen}) :< map (go url) (tail r)
                Left err -> Nothing :< Nil

-- | Main entry point for running `Router`, it returns `ReactElement` that can
-- | be injected into React vDOM.
runRouter
  :: forall props arg
   . (RoutePropsClass props arg)
  => URL
  -> Cofree List (Tuple (Route props arg) (Maybe (IndexRoute props arg)))
  -> Maybe ReactElement
runRouter (URL urlStr) router =
  evalState (sequence $ createRouteElement <$> matchRouter url_ router) Nil
    where
    url_ = parse decodeURIComponent urlStr

    query :: M.Map String String
    query = foldMap toMap url_

    toMap :: R.RoutePart -> M.Map String String
    toMap (R.Path _) = mempty
    toMap (R.Query q) = q

    -- traverse Cofree and produce ReactElement
    createRouteElement
      :: Cofree List (LeafVal props arg)
      -> State (List arg) ReactElement
    createRouteElement cof = asElement (head cof) (tail cof)

    asElement
      :: LeafVal props arg
      -> List (Cofree List (LeafVal props arg))
      -> State (List arg) ReactElement
    asElement (LeafVal {arg, route, indexRoute}) Nil = do
      args <- get
      let
        id_ = _id route
        cls = _cls route

        props :: props arg
        props = mkProps id_ arg (arg : args) query Nil
        index :: Array ReactElement
        index = maybe [] (\(IndexRoute id idxCls) -> A.cons (createElement idxCls (set idLens id props) []) []) indexRoute
      pure $ createElement cls props index
    asElement (LeafVal {arg, route, indexRoute}) cofs =
      let id_ = _id route
          cls = _cls route
      in do
        modify (arg : _)
        args <- get
        children <- sequence $ createRouteElement <$> cofs
        pure $ createElement cls (mkProps id_ arg args query (coerce cofs)) (toUnfoldable children)

    -- unsafe optimization trick
    coerce :: List (Cofree List (LeafVal props arg)) -> List (Cofree List (RouteLeaf arg))
    coerce = unsafeCoerce
