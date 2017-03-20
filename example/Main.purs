module Example.Main where

import Data.StrMap as M
import Control.Comonad.Cofree ((:<))
import Control.Monad.Eff (Eff)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (htmlDocumentToDocument)
import DOM.HTML.Window (document)
import DOM.Node.NonElementParentNode (getElementById)
import DOM.Node.Types (ElementId(..), documentToNonElementParentNode)
import Data.Maybe (Maybe(..), fromJust, maybe, maybe')
import Data.Nullable (toMaybe)
import Data.Tuple (Tuple(..))
import Partial.Unsafe (unsafePartial)
import Prelude (Unit, bind, pure, unit, void, ($), (<<<), (<>), (>>=))
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

user :: ReactClass RouteProps
user = createClass $ (spec unit render) { displayName = "User" }
  where
    render this = do
      props <- getProps this
      let userId = M.lookup "userId" props.args
          uLink = maybe' (\_ -> text "no such user") (\uId -> link' ("/" <> uId) [ text $ "User " <> uId ]) userId
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
      userId <- getProps this >>= (pure <<< M.lookup "userId" <<< _.args)
      chrn <- getChildren this
      pure $ div'
        [ h3' [ link' "/1" [ text "UserBooksIndex component" ] ]
        , div'
          [ div' [ link' "/1/book/fp-programming" [ text "Functional Programming" ] ]
          , div' [ link' "/1/book/grothendieck-galois-theory" [ text "Grothendick Galois Theory" ] ]
          , div' [ link' "/1/book/category-theory" [ text "Category Theory for the Working Mathematician" ]]
          ]
        , div' chrn
        ]

book :: ReactClass RouteProps
book = createClass $ (spec unit render) { displayName = "Book" }
  where
    render this = do
      p <- getProps this
      let bookTitle = case M.lookup "bookTitle" p.args of
            Just "fp-programming" -> "Functional Programing"
            Just "grothendieck-galois-theory" -> "Grothendick Galois Theory"
            Just "category-theory" -> "Category Theory for the Working Mathematician"
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
