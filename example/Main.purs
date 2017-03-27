module Example.Main where

import Prelude
import Data.Array as A
import Control.Comonad.Cofree ((:<))
import Control.Monad.Eff (Eff)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (htmlDocumentToDocument)
import DOM.HTML.Window (document)
import DOM.Node.NonElementParentNode (getElementById)
import DOM.Node.Types (ElementId(..), documentToNonElementParentNode)
import Data.Maybe (Maybe(..), fromJust)
import Data.Newtype (unwrap)
import Data.NonEmpty (NonEmpty(..))
import Data.Nullable (toMaybe)
import Data.Tuple (Tuple(..))
import Optic.Getter (view)
import Partial.Unsafe (unsafePartial)
import React (ReactClass, createClass, createElement, getChildren, getProps, spec)
import React.DOM (div', h1', h2', h3', h4', text)
import React.Router (IndexRoute(..), Route(..), RouteProps, Router, browserRouterClass, link', (:+))
import React.Router.Utils (last) as R
import ReactDOM (render)
import Routing.Match.Class (int, lit, str)

data Locations
  = Home
  | User Int
  | Book String

instance showLocations :: Show Locations where
  show Home = "/"
  show (User uid) = show uid
  show (Book title) = title

home :: ReactClass (RouteProps Locations)
home = createClass $ (spec unit render) { displayName = "Home" }
  where 
    render this = do
      chrn <- getChildren this
      pure $ div'
        [ h1' [ link' (show Home) [text "Home component"] ] 
        , div' chrn
        ]

usersIndex :: ReactClass (RouteProps Locations)
usersIndex = createClass $ (spec unit render) { displayName = "UsersIndex" }
  where
    render this = do
      pure $ div'
        [ h2' [ text "UserIndex component" ]
        , div' [ div' [link' "/1" [ text "User 1" ]]
               , div' [link' "/2" [ text "User 2" ]]
               , div' [link' "/3" [ text "User 3" ]]
               ]
        ]

user :: ReactClass (RouteProps Locations)
user = createClass $ (spec unit render) { displayName = "User" }
  where
    render this = do
      props <- getProps this
      let uID =
            case R.last (unwrap props).args of
              User uID -> uID
              _ -> 0
          uLink = if uID /= 0
                    then text $ "User " <> show uID
                    else text "no such user"
      chrn <- getChildren this
      pure $ div'
        [ h2' [ text "User component" ]
        , div' [ uLink ]
        , div' chrn
        ]

userBooksIndex :: ReactClass (RouteProps Locations)
userBooksIndex = createClass $ (spec unit render) { displayName = "UserBooksIndex" }
  where
    render this = do
      props <- getProps this
      let  uID =
            case R.last $ (unwrap props).args of
              User uid -> uid
              _ -> 0
      chrn <- getChildren this
      pure $ div'
        [ h3' [ link' ("/" <> show uID) [ text "UserBooksIndex component" ] ]
        , div'
          [ div' [ link' ("/" <> show uID <> "/book/fp-programming") [ text "Functional Programming" ] ]
          , div' [ link' ("/" <> show uID <> "/book/grothendieck-galois-theory") [ text "Grothendick Galois Theory" ] ]
          , div' [ link' ("/" <> show uID <> "/book/category-theory") [ text "Category Theory for the Working Mathematician" ]]
          ]
        , div' chrn
        ]

book :: ReactClass (RouteProps Locations)
book = createClass $ (spec unit render) { displayName = "Book" }
  where
    render this = do
      props <- getProps this
      let book = R.last (unwrap props).args
          bookTitle = case book of
            Book "fp-programming" -> "Functional Programing"
            Book "grothendieck-galois-theory" -> "Grothendick Galois Theory"
            Book "category-theory" -> "Category Theory for the Working Mathematician"
            _ -> "404 boook ;"
      pure $ div'
        [ h3' [ text "Book component" ]
        , h4' [ text bookTitle ]
        ]

      
router :: Router RouteProps Locations
router =
  (Tuple (Route "home" (Home <$ (lit "")) home) (Just $ IndexRoute "user-index" usersIndex))  :<
    [ Route "user" (User <$> int) user :+ []
    , Route "book-index" (User <$> int) userBooksIndex :+
      [ Route "book" (Book <$> (lit "book" *> str)) book :+ []
      ]
    ]

main :: forall e. Eff (dom :: DOM | e) Unit
main = void $ elm >>= render (createElement browserRouterClass {router, notFound: Nothing} [])
  where
    elm = do
      elm' <- window >>= document >>= getElementById (ElementId "app") <<< documentToNonElementParentNode <<< htmlDocumentToDocument
      pure $ unsafePartial fromJust (toMaybe elm') 
