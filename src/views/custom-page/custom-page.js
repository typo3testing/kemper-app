import { compose, withProps } from "recompose";
import { withRouter } from "react-router";
import { withSetLoading } from "../../services/loading";

import CustomPage from "./custom-page.jsx";
import viewarApi from "viewar-api";

export default compose(
  withRouter,
  withSetLoading,
  withProps({
    viewarApi
  }),
  withProps(({ viewarApi: { appUtils }, history }) => ({
    embedUrl:
      history.location.state &&
      history.location.state.url &&
      appUtils.getSecureUrl(history.location.state.url)
  }))
)(CustomPage);
