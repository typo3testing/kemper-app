import { withRouter } from "react-router";
import {
  compose,
  withHandlers,
  lifecycle,
  withProps,
  withState
} from "recompose";

import projectService from "../../services/projects";
import viewarApi from "viewar-api";
import { roomPlanner, translate } from "../../services";
import { withSetLoading } from "../../services/loading";
import { getUiConfigPath } from "../../utils";
import { withDialogControls } from "../../services/dialog";
import appState from "../../services/app-state";
import authManager from "../../services/auth-manager";
import roomCapture from "../../services/room-capturing";

import Home from "./home.jsx";
import { withSetToast } from "../../services/loading";

const getGpsPosition = ({ showDialog }) => async () => {
  const position = await viewarApi.coreInterface.call("getGPSData");

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
    
    showDialog(position.latitude + ' '+ position.longitude, {
        confirmText: 'DialogOK'
    });
    
    sessionStorage.setItem(
      "local_lat",
      parseFloat(position.latitude.toFixed(3))
    );
    sessionStorage.setItem(
      "local_long",
      parseFloat(position.longitude.toFixed(3))
    );
    sessionStorage.setItem(
      "cur_local_lat",
      parseFloat(position.latitude.toFixed(3))
    );
    sessionStorage.setItem(
      "cur_local_long",
      parseFloat(position.longitude.toFixed(3))
    );
    //history.push("/home");
    return {
      lat: parseFloat(position.latitude.toFixed(3)),
      lng: parseFloat(position.longitude.toFixed(3))
    };
  } else {
    return null;
  }
};

export const goTo = ({ history }) => async route => {
  history.push(route);
};

export const goToLive = ({ history, hasTrackers, setToast }) => () => {
  if (hasTrackers) {
    history.push("/calibration-main");
  } else {
    setToast(translate("TrackerInitError"), 4000, false); //false -> do not show icon
  }
};

export const showAuthDialog = ({
  showDialog,
  appState,
  authManager
}) => async () => {
  const { confirmed, input } = await showDialog("HomeEnterAuthKey", {
    input: appState.authKey,
    withInput: true,
    showCancel: true
  });

  if (confirmed && input) {
    await authManager.login(input);
  }
};
let gpsInterval;
export default compose(
  withRouter,
  withSetToast,
  withDialogControls,
  withSetLoading,
  withState("initialised", "setInitialised", false),
  withProps({
    viewarApi
  }),
  withHandlers({
    goTo,
    showAuthDialog,
    goToLive,
    getGpsPosition
  }),
  lifecycle({
    async componentDidMount() {
      const { setLoading, setInitialised, getGpsPosition } = this.props;
      setLoading(true);

      const position = await getGpsPosition();
      if (position) {
        //setTimeout(() => setCenter(position), 100)
      } else {
        gpsInterval = setInterval(async () => {
          const position = await getGpsPosition();
          if (position) {
            //setTimeout(() => setCenter(position), 100)
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
)(Home);
