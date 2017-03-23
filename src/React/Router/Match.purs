module React.Router.Match where

import Prelude
import Data.Either (Either(..))
import Data.Foldable (foldl)
import Data.List (reverse)
import Data.Newtype (unwrap)
import Data.Tuple (Tuple)
import Data.Validation.Semiring (unV)
import Routing.Match (Match(..)) as R
import Routing.Match.Error (showMatchError) as R
import Routing.Types (Route) as R

runMatch :: forall a. R.Match a -> R.Route -> Either String (Tuple R.Route a)
runMatch (R.Match fn) = unV foldErrors Right <<< fn
  where
  foldErrors errs =
    Left $ foldl (\b a -> a <> "\n" <> b) "" do
      es <- reverse <$> unwrap errs
      pure $ foldl (\b a -> a <> ";" <> b) "" $ R.showMatchError <$>  es
