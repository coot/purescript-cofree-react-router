module React.Router.Components 
  ( browserRouter
  , browserRouterClass
  , linkSpec
  , link
  , link'
  , routeSpec
  , routeClass
  ) where

import Control.Monad.Eff (Eff)
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
import Data.Maybe (Maybe, maybe')
import Prelude (Unit, bind, id, pure, unit, ($), (/=), (<<<), (<>), (>>=))
import React (ReactClass, ReactElement, ReactSpec, createClass, createElement, getChildren, getProps, preventDefault, readState, spec, spec', transformState)
import React.DOM (a, div')
import React.DOM.Props (Props, href, onClick)
import React.Router.Routing (runRouter)
import React.Router.Types (Router, RouteProps)

type RouterState = 
  { hash :: String
  , pathname :: String
  , search :: String
  }

type RouterProps locations notFoundProps =
  { router :: Router locations
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
  
browserRouter :: forall locations notfound. ReactSpec (RouterProps locations notfound) RouterState (history :: HISTORY, dom :: DOM)
browserRouter = (spec' initialState render) { displayName = "BrowserRouter", componentWillMount = componentWillMount }
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
      transformState this (_ { hash = loc.hash, pathname = loc.pathname, search = loc.search })

browserRouterClass :: forall locations notfound. ReactClass (RouterProps locations notfound)
browserRouterClass = createClass browserRouter

type LinkProps = {to :: String, props :: Array Props}

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
      preventDefault ev
      p <- getProps this
      w <- window
      history w >>= pushState (toForeign "") (DocumentTitle p.to) (URL p.to)
      dispatchEvent (createPopStateEvent p.to) (windowToEventTarget w)
      pure unit

linkClass :: ReactClass LinkProps
linkClass = createClass linkSpec

link :: LinkProps -> Array ReactElement -> ReactElement
link = createElement linkClass

link' :: String -> Array ReactElement -> ReactElement
link' to = link {to, props: []}

routeSpec :: forall locations. ReactSpec (RouteProps locations) Unit _
routeSpec = (spec unit render) { displayName = "Route" }
  where
    render this = do
      chrn <- getChildren this
      pure $ div' chrn

routeClass :: forall locations. ReactClass (RouteProps locations)
routeClass = createClass routeSpec
