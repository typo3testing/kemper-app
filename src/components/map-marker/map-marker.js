import { compose, withProps } from "recompose";
import viewarApi from "viewar-api";

import MapMarker from "./map-marker.jsx";

export default compose(
  withProps({
    getSecureIcon: viewarApi.appUtils.getSecureUrl
  })
)(MapMarker);
