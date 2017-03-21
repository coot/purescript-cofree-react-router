module Example.Main where

import Data.StrMap as M
import Control.Comonad.Cofree ((:<))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (Error)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (htmlDocumentToDocument)
import DOM.HTML.Window (document)
import DOM.Node.NonElementParentNode (getElementById)
import DOM.Node.Types (ElementId(..), documentToNonElementParentNode)
import Data.Either (Either, either)
import Data.Foreign.Class (class IsForeign, readProp)
import Data.Function (const)
import Data.HObject.Record (hObjToRecord)
import Data.Maybe (Maybe(..), fromJust, maybe, maybe')
import Data.Newtype (class Newtype, unwrap)
import Data.Nullable (toMaybe)
import Data.Tuple (Tuple(..))
import Partial.Unsafe (unsafePartial)
import Prelude (Unit, bind, const, id, pure, unit, void, ($), (/=), (<<<), (<>), (>>=))
import React (ReactClass, createClass, createElement, getChildren, getProps, spec)
import React.DOM (div', h1', h2', h3', h4', text)
import React.Router (IndexRoute(..), Route(..), RouteProps, Router, browserRouterClass, link', (:+))
import ReactDOM (render)

home :: ReactClass RouteProps
home = createClass $ (spec unit render) { displayName = "Home" }
  where 
    render this = do
      chrn <- getChildren this
      pure $ div'
        [ h1' [ link' "/" [text "Home component"] ] 
        , div' chrn
        ]

usersIndex :: ReactClass RouteProps
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

newtype User = User {userId :: String}

instance isForeignUser :: IsForeign User where
  read obj = do
    userId <- readProp "userId" obj
    pure $ User { userId }

derive instance newtypeUser :: Newtype User _

user :: ReactClass RouteProps
user = createClass $ (spec unit render) { displayName = "User" }
  where
    render this = do
      props <- getProps this
      let user = either (const $ User {userId: "1"}) id (hObjToRecord props.args :: Either Error User)
      let userId =  (unwrap user).userId
          uLink = if userId /= ""
                    then text $ "User " <> userId
                    else text "no such user"
      chrn <- getChildren this
      pure $ div'
        [ h2' [ text "User component" ]
        , div' [ uLink ]
        , div' chrn
        ]

userBooksIndex :: ReactClass RouteProps
userBooksIndex = createClass $ (spec unit render) { displayName = "UserBooksIndex" }
  where
    render this = do
      uID <- getProps this >>= (pure <<< _.userId <<< unwrap <<< either (const (User {userId: ""})) id <<< hObjToRecord <<<  _.args)
      chrn <- getChildren this
      pure $ div'
        [ h3' [ link' ("/" <> uID) [ text "UserBooksIndex component" ] ]
        , div'
          [ div' [ link' ("/" <> uID <> "/book/fp-programming") [ text "Functional Programming" ] ]
          , div' [ link' ("/" <> uID <> "/book/grothendieck-galois-theory") [ text "Grothendick Galois Theory" ] ]
          , div' [ link' ("/" <> uID <> "/book/category-theory") [ text "Category Theory for the Working Mathematician" ]]
          ]
        , div' chrn
        ]


newtype Book = Book { bookTitle :: String }

derive instance newtypeBook :: Newtype Book _

instance isForeignBook :: IsForeign Book where
  read obj = do
    bookTitle <- readProp "bookTitle" obj
    pure $ Book { bookTitle }

book :: ReactClass RouteProps
book = createClass $ (spec unit render) { displayName = "Book" }
  where
    render this = do
      props <- getProps this
      let book = either (const $ Book {bookTitle: ""}) id (hObjToRecord props.args :: Either Error Book)
      let bookTitle = case (unwrap book).bookTitle of
            "fp-programming" -> "Functional Programing"
            "grothendieck-galois-theory" -> "Grothendick Galois Theory"
            "category-theory" -> "Category Theory for the Working Mathematician"
            _ -> "404 boook ;"
      pure $ div'
        [ h3' [ text "Book component" ]
        , h4' [ text bookTitle ]
        ]

      
router :: Router
router =
  (Tuple (Route "home" "/" home) (Just $ IndexRoute "user-index" usersIndex))  :<
    [ Route "user" ":userId" user :+ []
    , Route "book-index" ":userId" userBooksIndex :+
      [ Route "book" "book/:bookTitle" book :+ []
      ]
    ]

main :: forall e. Eff (dom :: DOM | e) Unit
main = void $ elm >>= render (createElement browserRouterClass {router, notFound: Nothing} [])
  where
    elm = do
      elm' <- window >>= document >>= getElementById (ElementId "app") <<< documentToNonElementParentNode <<< htmlDocumentToDocument
      pure $ unsafePartial fromJust (toMaybe elm') 
