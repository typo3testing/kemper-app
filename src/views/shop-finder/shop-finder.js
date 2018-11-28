import {
  compose,
  withState,
  withHandlers,
  withProps,
  lifecycle
} from "recompose";
import { withSetLoading } from "../../services/loading";
import { getUiConfigPath } from "../../utils";

import ShopFinder from "./shop-finder.jsx";
import viewarApi from "viewar-api";

const prepareMarker = ({ url, viewarApi: { http } }) => async () => {
  let marker = [];

  try {
    const result = await http.get(url);
    if (result) {
      marker = JSON.parse(result);

      marker.forEach(
        singleMarker =>
          (singleMarker.position = {
            lat: Number.parseFloat(singleMarker.position.lat),
            lng: Number.parseFloat(singleMarker.position.lng)
          })
      );
    }
  } catch (e) {
    console.error(e);
  }

  return marker || [];
};

export default compose(
  withSetLoading,
  withState("marker", "setMarker", []),
  withState("activeMarker", "setActiveMarker", null),
  withProps({
    viewarApi,
    getUiConfigPath
  }),
  withProps(({ getUiConfigPath }) => ({
    url: getUiConfigPath("shopFinder.url") || getUiConfigPath("shopFinder")
  })),
  withHandlers({
    prepareMarker
  }),
  lifecycle({
    async componentDidMount() {
      const { prepareMarker, setLoading, setMarker } = this.props;

      setLoading(true);
      const marker = await prepareMarker();
      setMarker(marker);
      setLoading(false);
    }
  })
)(ShopFinder);
