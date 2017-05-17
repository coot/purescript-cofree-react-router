module React.Router.Components 
  ( browserRouter
  , browserRouterClass
  , linkSpec
  , link
  , link'
  , to
  , goTo
  ) where

import Control.Comonad.Cofree (Cofree)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE)
import Control.Monad.Eff.Exception (EXCEPTION)
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
import Data.Maybe (Maybe(..), fromMaybe, isNothing, maybe')
import Data.Newtype (un)
import Data.Tuple (Tuple)
import Prelude (Unit, bind, const, discard, pure, unit, void, ($), (/=), (<<<), (<>), (>>=), (||))
import React (ReactClass, ReactElement, ReactSpec, createClass, createElement, getChildren, getProps, preventDefault, readState, spec, spec', transformState)
import React.DOM (a, div')
import React.DOM.Props (Props, href, onClick)
import React.Router.Class (class RoutePropsClass)
import React.Router.Routing (runRouter)
import React.Router.Types (IndexRoute, Route, RouterConfig(RouterConfig))
import React.Router.Utils (hasBaseName, joinUrls, stripBaseName, warning)

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

getLocation
  :: forall e
   . RouterConfig
  -> Eff (dom :: DOM, console :: CONSOLE | e) { hash :: String, pathname :: String, search :: String }
getLocation cfg = do
  l <- window >>= location
  h <- hash l
  p <- pathname l
  s <- search l
  let cfgR = un RouterConfig cfg
  warning
    (isNothing cfgR.baseName || (hasBaseName cfgR.baseName p))
    ("""You are using baseName on a page which URL path does not begin with.  Expecting path: """
     <> p <> """ to begin with: """ <> (fromMaybe "" cfgR.baseName))
  pure { hash: h, pathname: stripBaseName cfgR.baseName p, search: s }
  

-- | `ReactSpec` for the `browserRouterClass` - the main entry point react
-- | class for the router.
browserRouter
  :: forall eff props args notfound
   . (RoutePropsClass props)
  => RouterConfig
  -> ReactSpec (RouterProps props args notfound) RouterState (history :: HISTORY, dom :: DOM, console :: CONSOLE | eff)
browserRouter cfg = (spec' initialState render) { displayName = "BrowserRouter", componentWillMount = componentWillMount }
  where
    initialState this = do
      getLocation cfg

    renderNotFound props = 
      maybe' (const $ div' []) (\nf -> createElement nf.cls nf.props []) props.notFound

    render this = do
      props <- getProps this
      state <- readState this
      let loc = stripBaseName (un RouterConfig cfg).baseName state.pathname
            <> if state.search /= ""
                 then "?" <> state.search
                 else ""
            <> if state.hash /= ""
                 then "#" <> state.hash
                 else ""

      case runRouter loc props.router of
        Nothing -> do
          warning false ("Router did not found path '" <> loc <> "'")
          pure $ renderNotFound props
        Just el -> pure el

    componentWillMount this =
      window >>= addEventListener popstate (eventListener $ handler this) false <<< windowToEventTarget

    handler this ev = do
      loc <- getLocation cfg
      transformState this (_ { hash = loc.hash, pathname = loc.pathname, search = loc.search })

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
  => RouterConfig
  -> ReactClass (RouterProps props args notfound)
browserRouterClass cfg = createClass (browserRouter cfg)

type LinkProps = {to :: String, props :: Array Props}

to :: String -> LinkProps
to = { to: _, props: [] }

-- | `ReactSpec` for the `link` element; it takes a record of type `LinkProps`
-- | as properties.  The `props` record property is directly passed to underlying
-- | `a` element, e.g. this can be used to add css classes.
linkSpec :: RouterConfig -> ReactSpec LinkProps Unit ()
linkSpec cfg = (spec unit render) { displayName = "Link" }
  where
    render this = do
      p <- getProps this
      chrn <- getChildren this
      pure $ a
        ([href p.to, (onClick $ clickHandler this)] <> p.props)
        chrn

    clickHandler this ev = do
      _ <- preventDefault ev
      { to: url } <-  getProps this
      goTo cfg url

-- | React class for the `link` element.
linkClass :: RouterConfig -> ReactClass LinkProps
linkClass = createClass <<< linkSpec

-- | `link` element; use it instead of `a` to route the user through application.
link :: RouterConfig -> LinkProps -> Array ReactElement -> ReactElement
link cfg = createElement (linkClass cfg)

-- | as `link`, but with empty properties passed to the underlying `a` element.
link' :: RouterConfig -> String -> Array ReactElement -> ReactElement
link' cfg = link cfg <<< {to: _, props: []}

goTo
  :: forall eff
   . RouterConfig
  -> String
  -> Eff (dom :: DOM, err :: EXCEPTION, history :: HISTORY | eff) Unit
goTo cfg url = do
  w <- window
  h <- history w
  let url_ = joinUrls (fromMaybe "" (un RouterConfig cfg).baseName) url
  pushState (toForeign "") (DocumentTitle url_) (URL url_) h
  void $ dispatchEvent (createPopStateEvent url) (windowToEventTarget w)
