const STATE_CORNER_FLOOR = Symbol();
const STATE_CORNER_CEILING = Symbol();
const STATE_STOPPED = Symbol();

import { length } from "./room-capturing/math/vector3";
import createVisualManager from "./room-capturing/visual-manager";
import { HEIGHT_UPDATE_INTERVAL } from "./room-capturing/constants";
import viewarApi from "viewar-api";

export default createHeightCapture(viewarApi);

//======================================================================================================================
// ROOM CAPTURING
//======================================================================================================================

function createHeightCapture({
  cameras,
  coreInterface,
  modelManager,
  trackers,
  sceneManager,
  versionInfo
}) {
  const camera = cameras.augmentedRealityCamera;
  let tracker = null;

  let heightUpdateHandle = 0;
  let currentHeight = null;
  let roomHeight = null;
  let floorPoint = null;
  let columnInstance = null;
  let state = STATE_CORNER_FLOOR;
  let onHeightUpdate = () => {};

  const visuals = createVisualManager({
    coreInterface,
    modelManager,
    sceneManager,
    versionInfo
  });

  return {
    startCapture,
    stopCapture,
    capturePoint,
    get currentHeight() {
      return currentHeight;
    }
  };

  //======================================================================================================================
  // PUBLIC FUNCTIONS
  //======================================================================================================================

  async function startCapture(onUpdate) {
    initTracking();
    await visuals.initModels();
    resetInternalState();
    onHeightUpdate = onUpdate;
  }

  async function stopCapture() {
    if (state !== STATE_STOPPED) {
      await visuals.clearVisuals();
      state = STATE_STOPPED;
    }
  }

  async function capturePoint() {
    switch (state) {
      case STATE_CORNER_FLOOR:
        await captureFloorPoint();
        await addColumn();
        startHeightUpdate();
        state = STATE_CORNER_CEILING;
        break;
      case STATE_CORNER_CEILING:
        stopHeightUpdate();
        await removeColumn();
        await visuals.clearVisuals();
        state = STATE_STOPPED;
        break;
    }
  }

  //======================================================================================================================
  // PRIVATE FUNCTIONS
  //======================================================================================================================

  async function addColumn() {
    await visuals.hide("target");
    const columnModel = await modelManager.fetchModelFromRepository("42673");
    columnInstance = await sceneManager.insertModel(columnModel, {
      pose: { position: floorPoint }
    });
  }

  async function removeColumn() {
    columnInstance && (await sceneManager.removeNode(columnInstance));
  }

  function resetInternalState() {
    stopHeightUpdate();

    roomHeight = null;
    currentHeight = null;
    floorPoint = null;
    onHeightUpdate = () => {};

    state = STATE_CORNER_FLOOR;
  }

  // Capture
  //--------------------------------------------------------------------------------------------------------------------

  async function captureFloorPoint() {
    floorPoint = await visuals.getTargetPosition();
    floorPoint.y = 0;
  }

  // Height measuring
  //--------------------------------------------------------------------------------------------------------------------

  function startHeightUpdate() {
    if (heightUpdateHandle) {
      stopHeightUpdate();
    }
    heightUpdateHandle = setInterval(updateHeight, HEIGHT_UPDATE_INTERVAL);
  }

  function stopHeightUpdate() {
    if (heightUpdateHandle) {
      clearInterval(heightUpdateHandle);
      heightUpdateHandle = 0;
    }
  }

  function getXAngle({ w, x, y, z }) {
    let heading;
    let attitude;
    let bank;

    const test = x * y + w * z;
    if (test > 0.49999) {
      heading = 2 * Math.atan2(x, w);
      attitude = Math.PI / 2;
      bank = 0;
    } else if (test < -0.49999) {
      heading = -2 * Math.atan2(x, w);
      attitude = -Math.PI / 2;
      bank = 0;
    } else {
      const sqx = x * x;
      const sqy = y * y;
      const sqz = z * z;

      heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
      attitude = Math.asin(2 * test);
      bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);
    }
    return bank;
  }

  async function updateHeight() {
    const pose = await camera.updatePose();

    const cameraHeight = pose.position.y;
    const distance = length({
      x: floorPoint.x - pose.position.x,
      y: 0,
      z: floorPoint.z - pose.position.z
    });

    const angle = getXAngle(pose.orientation);

    currentHeight = cameraHeight + distance * Math.tan(angle);

    columnInstance.setPose({
      scale: { x: 1, y: currentHeight / 2612.2001953125, z: 1 }
    });

    onHeightUpdate(currentHeight);
  }

  // Tracking
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Checks if tracking provider is activated, the ground is confirmed and the augmented reality camera is active.
   */
  function initTracking() {
    if (!tracker && trackers && Object.keys(trackers).length) {
      tracker = Object.values(trackers)[0];
    }

    if (!tracker) {
      throw new Error(
        "Can't start room capturing: No tracking provider available."
      );
    }

    if (!tracker.active) {
      throw new Error(
        "Can't start room capturing: Tracking provider not activated."
      );
    }

    if (!tracker.groundConfirmed) {
      throw new Error(
        "Can't start room capturing: Tracking provider hasn't confirmed ground yet."
      );
    }

    if (!camera.active) {
      throw new Error(
        "Can't start room capturing: Augmented reality camera not active."
      );
    }
  }
}
