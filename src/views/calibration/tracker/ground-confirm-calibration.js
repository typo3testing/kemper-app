import { withRouter } from "react-router";
import {
  compose,
  pure,
  lifecycle,
  withState,
  withProps,
  withHandlers
} from "recompose";
import { withSetLoading } from "../../../services/loading";
import projectManager from "../../../services/projects";

import viewarApi from "viewar-api";

import GroundConfirmCalibration from "./ground-confirm-calibration.jsx";

import {
  initTracking,
  activateARCamera,
  getDeviceType
} from "../tracking-utils.js";

export default compose(
  withRouter,
  withSetLoading,
  withState("loadingVisible", "setLoadingVisible", true),
  withState("deviceType", "setDeviceType", null),
  withProps({
    getDeviceType,
    initTracking,
    activateARCamera
  }),
  withHandlers({
    onTrackingChanged: ({
      setLoading,
      tracker,
      onTrackingChanged,
      history,
      nextView
    }) => async () => {
      if (tracker.tracking) {
        setLoading(true);

        tracker.off("trackingTargetStatusChanged", onTrackingChanged);
        await tracker.confirmGroundPosition();
        await projectManager.loadFeatureSet();

        setLoading(false);
        history.push({
          pathname: nextView,
          state: { backButtonPath: "/", showGroundConfirmToast: true }
        });
      }
    }
  }),
  withHandlers({
    goBack: ({ history, tracker, onTrackingChanged }) => () => {
      tracker.off("trackingTargetStatusChanged", onTrackingChanged);
      history.goBack();
    }
  }),
  lifecycle({
    async componentWillMount() {
      const {
        getDeviceType,
        setDeviceType,
        setLoading,
        initTracking,
        activateARCamera,
        tracker,
        onTrackingChanged
      } = this.props;

      setDeviceType(getDeviceType(viewarApi));

      setLoading(true);
      await activateARCamera(viewarApi);
      await initTracking(tracker);
      tracker.on("trackingTargetStatusChanged", onTrackingChanged);
      setLoading(false);
    }
  }),
  pure
)(GroundConfirmCalibration);
