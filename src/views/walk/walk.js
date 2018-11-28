import {
  compose,
  lifecycle,
  pure,
  withState,
  withHandlers,
  withProps
} from "recompose";
import { withRouter } from "react-router";

import Walk from "./walk.jsx";

export default compose(Walk);
