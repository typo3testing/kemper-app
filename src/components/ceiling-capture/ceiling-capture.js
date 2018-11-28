import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle
} from "recompose";

import CeilingCapture from "./ceiling-capture.jsx";

import { arCamera, modelManager, sceneManager } from "viewar-api";
import appState from "../../services/app-state";
import ceilingCapture from "../../services/ceiling-capture";
import { withSetLoading } from "../../services/loading";
import {
  getRayFromPose,
  rayPlaneIntersection
} from "../../services/room-capturing/math/math";

export const confirmFloorPoint = ({
  ceilingCapture,
  setCaptureStep
}) => async () => {
  await ceilingCapture.capturePoint();
  setCaptureStep("ceilingPoint");
};

export const confirmCeilingPoint = ({
  ceilingCapture,
  appState,
  positionObject,
  setCaptureStep
}) => async () => {
  await ceilingCapture.capturePoint();
  appState.ceilingHeight = ceilingCapture.currentHeight;
  await positionObject();
  setCaptureStep("positionObject");
};

export const insertModel = ({
  updateProgress,
  modelManager,
  sceneManager,
  setLoading,
  currentHeight,
  ceilingModel
}) => async pose => {
  setLoading(true, true);
  modelManager.on("transferProgress", updateProgress);
  const instance = await sceneManager.insertModel(ceilingModel, {
    visible: false
  });
  modelManager.off("transferProgress", updateProgress);
  await instance.setPose(pose);
  await instance.setVisible(true);
  setLoading(false);
  return instance;
};

export const positionObject = ({
  currentHeight,
  arCamera,
  insertModel,
  setInterval
}) => async () => {
  let inserted = false;
  let instance;

  arCamera.startPoseUpdate(15);

  setInterval(
    window.setInterval(async () => {
      const ray = getRayFromPose(await arCamera.updatePose());

      const intersection = rayPlaneIntersection(ray, {
        equation: {
          A: 0,
          B: 1,
          C: 0,
          D: -currentHeight
        }
      });

      console.log(intersection);

      if (intersection) {
        if (!inserted) {
          inserted = true;
          instance = await insertModel(intersection);
        } else if (instance) {
          await instance.setPose({ position: intersection });
        }
      }
    }, 15)
  );
};

export const confirm = ({
  setCaptureStep,
  wallCapture,
  arCamera,
  insertModel,
  interval,
  toggleProductPicker,
  close
}) => async () => {
  arCamera.stopPoseUpdate();
  window.clearInterval(interval);
  toggleProductPicker();
  close();
};

export const reset = () => {};

export const updateProgress = ({ setLoading }) => (id, progress) => {
  setLoading(true, true, progress);
};

export default compose(
  withSetLoading,
  withState("captureStep", "setCaptureStep", "floorPoint"),
  withState("currentHeight", "setCurrentHeight", -1),
  withState("interval", "setInterval", 0),
  withProps({
    arCamera,
    modelManager,
    sceneManager,
    appState,
    ceilingCapture
  }),
  withHandlers({
    updateProgress
  }),
  withHandlers({
    insertModel
  }),
  withHandlers({
    positionObject
  }),
  withHandlers({
    confirmFloorPoint,
    confirmCeilingPoint,
    confirm,
    reset
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.ceilingCapture.startCapture(this.props.setCurrentHeight);
    },
    async componentWillUnmount() {
      this.props.arCamera.stopPoseUpdate();
      await this.props.ceilingCapture.stopCapture();
    }
  })
)(CeilingCapture);
