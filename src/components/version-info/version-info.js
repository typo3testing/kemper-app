import { compose, withProps } from "recompose";
import viewarApi from "viewar-api";

import VersionInfo from "./version-info.jsx";

export default compose(
  withProps({
    viewarApi
  }),
  withProps(({ viewarApi: { appConfig, versionInfo } }) => ({
    versionInfo: Object.assign({}, versionInfo, { pkId: appConfig.pkId })
  }))
)(VersionInfo);
