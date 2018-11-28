import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle
} from "recompose";
import { translationProvider } from "../../services";
import { withSetLoading } from "../../services/loading";
import viewarApi from "viewar-api";

import Map from "./map.jsx";

const DEFAULT_CENTER = {
  lat: 31.4,
  lng: -9.2
};

const DEFAULT_ZOOM = 9;

const API_KEY = "AIzaSyD61f8082DHyEaBV0lzGzSKsFWby9L1f2w";

const getGpsPosition = ({ viewarApi: { coreInterface } }) => async () => {
  const position = await coreInterface.call("getGPSData");
  // Filter out default longitude/latitude returned from core if no gps signal.
  if (
    position &&
    !(
      (position.longitude === 16.3614 &&
        position.latitude === 48.223 &&
        position.altitude === 0) ||
      (!position.longitude && !position.latitude && !position.altitude)
    )
  ) {
    return {
      lat: parseFloat(position.latitude.toFixed(3)),
      lng: parseFloat(position.longitude.toFixed(3))
    };
  } else {
    return null;
  }
};

let gpsInterval;
export default compose(
  withSetLoading,
  withState("initialised", "setInitialised", false),
  withState("center", "setCenter", DEFAULT_CENTER),
  withProps({
    translationProvider,
    viewarApi,
    defaultCenter: DEFAULT_CENTER
  }),
  withProps(({ translationProvider }) => ({
    language: translationProvider.language,
    key: API_KEY,
    zoom: DEFAULT_ZOOM
  })),
  withHandlers({
    getGpsPosition
  }),
  lifecycle({
    async componentDidMount() {
      const {
        setLoading,
        setInitialised,
        setCenter,
        getGpsPosition
      } = this.props;
      setLoading(true);

      const position = await getGpsPosition();
      if (position) {
        setTimeout(() => setCenter(position), 100);
      } else {
        gpsInterval = setInterval(async () => {
          const position = await getGpsPosition();
          if (position) {
            setTimeout(() => setCenter(position), 100);
            clearInterval(gpsInterval);
            gpsInterval = false;
          }
        }, 500);
      }

      setInitialised(true);
      setLoading(false);
    },
    componentWillUnmount() {
      gpsInterval && clearInterval(gpsInterval);
    }
  })
)(Map);
