module React.Router.Components 
  ( browserRouter
  , browserRouterClass
  , linkSpec
  , link
  , link'
  , to
  , goTo
  ) where

import Data.String as S
import Control.Comonad.Cofree (Cofree)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (EXCEPTION)
import Control.Monad.Eff.Unsafe (unsafeCoerceEff)
import DOM (DOM)
import DOM.Event.EventTarget (addEventListener, dispatchEvent, eventListener)
import DOM.Event.Types (Event)
import DOM.HTML (window)
import DOM.HTML.Event.EventTypes (popstate)
import DOM.HTML.History (DocumentTitle(..), URL(..), pushState)
import DOM.HTML.Location (hash, pathname, search)
import DOM.HTML.Types (HISTORY, windowToEventTarget)
import DOM.HTML.Window (history, location)
import Data.Foreign (toForeign)
import Data.Maybe (Maybe(..), fromMaybe, maybe')
import Data.Tuple (Tuple)
import Prelude (Unit, bind, discard, id, pure, unit, void, ($), (<$>), (/=), (<<<), (<>), (>>=))
import React (ReactClass, ReactElement, ReactSpec, createClass, createElement, getChildren, getProps, preventDefault, readState, spec, spec', transformState)
import React.DOM (a, div')
import React.DOM.Props (Props, href, onClick)
import React.Router.Class (class RoutePropsClass)
import React.Router.Routing (runRouter)
import React.Router.Types (IndexRoute, Route, Config)

-- | RouterState type
type RouterState = 
  { hash :: String
  , pathname :: String
  , search :: String
  }

-- | RouterProps type
type RouterProps props args notFoundProps =
  { router :: Cofree Array (Tuple (Route props args) (Maybe (IndexRoute props args)))
  , notFound :: Maybe
    { cls :: ReactClass notFoundProps
    , props :: notFoundProps
    }
  }

foreign import createPopStateEvent :: String -> Event

getLocation :: forall e. Eff (dom :: DOM | e) { hash :: String, pathname :: String, search :: String }
getLocation = do
  l <- window >>= location
  h <- hash l
  p <- pathname l
  s <- search l
  pure { hash: h, pathname: p, search: s }
  

-- | `ReactSpec` for the `browserRouterClass` - the main entry point react
-- | class for the router.
browserRouter
  :: forall eff props args notfound
   . (RoutePropsClass props)
  => Config
  -> ReactSpec (RouterProps props args notfound) RouterState (history :: HISTORY, dom :: DOM | eff)
browserRouter config = (spec' initialState render) { displayName = "BrowserRouter", componentWillMount = coerceEff <<< componentWillMount }
  where
    initialState this = getLocation

    renderNotFound props _ = 
      maybe' (\_ -> div' []) (\nf -> createElement nf.cls nf.props []) props.notFound

    render this = do
      props <- getProps this
      state <- readState this
      let loc = state.pathname
            <> if state.search /= ""
                 then "?" <> state.search
                 else ""
            <> if state.hash /= ""
                 then "#" <> state.hash
                 else ""

      pure $ maybe'
        (renderNotFound props)
        id
        (runRouter loc props.router)

    componentWillMount this =
      window >>= addEventListener popstate (eventListener $ handler this) false <<< windowToEventTarget

    handler this ev = do
      loc <- getLocation
      let pathname =
            case config.basename of
              Just basename -> fromMaybe loc.pathname $ S.stripPrefix (S.Pattern basename) loc.pathname
              Nothing -> loc.pathname
      transformState this (_ { hash = loc.hash, pathname = pathname, search = loc.search })

    coerceEff :: forall a e. Eff (dom :: DOM | e) a -> Eff e a
    coerceEff = unsafeCoerceEff

-- | React class for the `browerRouter` element.  Use it to init your application.
-- | ```purescript
-- |  router = ... :: Router _
-- |  main = void $ elm >>= render (createElement browserRouterClass {router, notFound: Nothing} [])
-- |    where
-- |      elm = do
-- |        elm_ <- window >>= document >>= getElementById (ElementId "app") <<< documentToNonElementParentNode <<< htmlDocumentToDocument
-- |        pure $ unsafePartial fromJust (toMaybe elm_) 
-- |  ```
browserRouterClass
  :: forall props args notfound
   . (RoutePropsClass props)
  => Config
  -> ReactClass (RouterProps props args notfound)
browserRouterClass cfg = createClass (browserRouter cfg)

type LinkProps = {to :: String, props :: Array Props}

to :: String -> LinkProps
to = { to: _, props: [] }

-- | `ReactSpec` for the `link` element; it takes a record of type `LinkProps`
-- | as properties.  The `props` record property is directly passed to underlying
-- | `a` element, e.g. this can be used to add css classes.
linkSpec :: ReactSpec LinkProps Unit ()
linkSpec = (spec unit render) { displayName = "Link" }
  where
    render this = do
      p <- getProps this
      chrn <- getChildren this
      pure $ a
        ([href p.to, (onClick $ clickHandler this)] <> p.props)
        chrn

    clickHandler this ev = do
      _ <- preventDefault ev
      url <- _.to <$> getProps this
      goTo url

-- | React class for the `link` element.
linkClass :: ReactClass LinkProps
linkClass = createClass linkSpec

-- | `link` element; use it instead of `a` to route the user through application.
link :: LinkProps -> Array ReactElement -> ReactElement
link = createElement linkClass

-- | as `link`, but with empty properties passed to the underlying `a` element.
link' :: String -> Array ReactElement -> ReactElement
link'  = link <<< {to: _, props: []}

goTo :: forall eff. String -> Eff (dom :: DOM, err :: EXCEPTION, history :: HISTORY | eff) Unit
goTo url = do
  w <- window
  h <- history w
  pushState (toForeign "") (DocumentTitle url) (URL url) h
  void $ dispatchEvent (createPopStateEvent url) (windowToEventTarget w)
