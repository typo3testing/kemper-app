import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle
} from "recompose";

import CeilingCapture from "./wall-capture.jsx";

import { arCamera, modelManager, sceneManager } from "viewar-api";
import wallCapture from "../../services/wall-capture";
import { withSetLoading } from "../../services/loading";
import {
  getPlaneIntersection,
  getRayFromPose
} from "../../services/room-capturing/math/math";

export const confirmLeftPoint = ({
  wallCapture,
  setCaptureStep
}) => async () => {
  await wallCapture.capturePoint();
  setCaptureStep("rightPoint");
};
export const confirmRightPoint = ({
  wallCapture,
  setCaptureStep,
  positionObject
}) => async () => {
  await wallCapture.capturePoint();
  await positionObject();
  setCaptureStep("positionObject");
};

export const insertModel = ({
  updateProgress,
  modelManager,
  sceneManager,
  setLoading,
  currentHeight,
  wallModel
}) => async pose => {
  setLoading(true, true);
  modelManager.on("transferProgress", updateProgress);
  const instance = await sceneManager.insertModel(wallModel, {
    visible: false
  });
  modelManager.off("transferProgress", updateProgress);
  await instance.setPose(pose);
  await instance.setVisible(true);
  setLoading(false);
  return instance;
};

export const orientatePoints = ([p1, p2], p0) => {
  const result =
    (p1.x - p0.x) * (p1.z + p0.z) +
    (p2.x - p1.x) * (p2.z + p1.z) +
    (p0.x - p2.x) * (p0.z + p2.z);
  return result < 0 ? [p1, p2] : [p2, p1];
};

export const positionObject = ({
  wallCapture,
  arCamera,
  insertModel,
  setInterval
}) => async () => {
  let inserted = false;
  let instance;

  arCamera.startPoseUpdate(15);

  setInterval(
    window.setInterval(async () => {
      const pose = await arCamera.updatePose();
      const ray = getRayFromPose(pose);
      const points = orientatePoints(wallCapture.points, pose.position);

      const intersection = getPlaneIntersection(ray, points);

      if (intersection) {
        if (!inserted) {
          inserted = true;
          instance = await insertModel(intersection);
        } else if (instance) {
          await instance.setPose({ position: intersection.position });
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

export const reset = ({ wallCapture, setCaptureStep }) => async () => {
  await wallCapture.reset();
  setCaptureStep("leftPoint");
};

export const updateProgress = ({ setLoading }) => (id, progress) => {
  setLoading(true, true, progress);
};

export default compose(
  withSetLoading,
  withState("captureStep", "setCaptureStep", "leftPoint"),
  withState("interval", "setInterval", 0),
  withProps({
    modelManager,
    sceneManager,
    wallCapture,
    arCamera
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
    updateProgress,
    confirmLeftPoint,
    confirmRightPoint,
    confirm,
    reset
  }),
  lifecycle({
    async componentDidMount() {
      const { setLoading, updateProgress, wallCapture } = this.props;
      setLoading(true, true);
      modelManager.on("transferProgress", updateProgress);
      await wallCapture.startCapture();
      modelManager.off("transferProgress", updateProgress);
      setLoading(false);
    },
    async componentWillUnmount() {
      this.props.arCamera.stopPoseUpdate();
      await this.props.wallCapture.stopCapture();
    }
  })
)(CeilingCapture);
