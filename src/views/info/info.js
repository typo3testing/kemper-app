import { compose, withHandlers, withProps } from "recompose";

import { getUiConfigPath } from "../../utils";

import Info from "./info.jsx";
import viewarApi from "viewar-api";

export const openUrl = ({ viewarApi }) => async url => {
  viewarApi.appUtils.openUrl(url);
};

export default compose(
  withProps({
    viewarApi,
    getUiConfigPath
  }),
  withProps(({ getUiConfigPath }) => ({
    infoText: getUiConfigPath("infoText")
  })),
  withHandlers({
    openUrl
  })
)(Info);
