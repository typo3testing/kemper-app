const STATE_LEFT_CORNER = Symbol();
const STATE_RIGHT_CORNER = Symbol();
const STATE_STOPPED = Symbol();

import createVisualManager from "./room-capturing/visual-manager";
import viewarApi from "viewar-api";

export default createWallCapture(viewarApi);

//======================================================================================================================
// ROOM CAPTURING
//======================================================================================================================

function createWallCapture({
  cameras,
  coreInterface,
  modelManager,
  trackers,
  sceneManager,
  versionInfo
}) {
  const camera = cameras.arCamera;
  let tracker = null;

  let leftPoint = null;
  let rightPoint = null;
  let leftColumnInstance = null;
  let rightColumnInstance = null;
  let state = STATE_LEFT_CORNER;

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
    reset: resetInternalState,
    get points() {
      return [leftPoint, rightPoint];
    }
  };

  //======================================================================================================================
  // PUBLIC FUNCTIONS
  //======================================================================================================================

  async function startCapture() {
    initTracking();
    await visuals.initModels();
    await resetInternalState();
  }

  async function resetInternalState() {
    leftPoint = null;
    rightPoint = null;

    state = STATE_LEFT_CORNER;

    await removeColumns();
  }

  async function stopCapture() {
    await removeColumns();
    await visuals.clearVisuals();
    state = STATE_STOPPED;
  }

  async function capturePoint() {
    switch (state) {
      case STATE_LEFT_CORNER:
        await captureLeftFloorPoint();
        await addLeftColumn();
        state = STATE_RIGHT_CORNER;
        break;
      case STATE_RIGHT_CORNER:
        await captureRightFloorPoint();
        await addRightColumn();
        await visuals.clearVisuals();
        state = STATE_STOPPED;
        break;
    }
  }

  //======================================================================================================================
  // PRIVATE FUNCTIONS
  //======================================================================================================================

  async function addLeftColumn() {
    const columnModel = await modelManager.fetchModelFromRepository("42673");
    leftColumnInstance = await sceneManager.insertModel(columnModel, {
      pose: { position: leftPoint }
    });
  }

  async function addRightColumn() {
    const columnModel = await modelManager.fetchModelFromRepository("42673");
    rightColumnInstance = await sceneManager.insertModel(columnModel, {
      pose: { position: rightPoint }
    });
  }

  async function removeColumns() {
    leftColumnInstance && (await sceneManager.removeNode(leftColumnInstance));
    rightColumnInstance && (await sceneManager.removeNode(rightColumnInstance));
  }

  async function captureLeftFloorPoint() {
    leftPoint = await visuals.getTargetPosition();
    leftPoint.y = 0;
  }

  async function captureRightFloorPoint() {
    rightPoint = await visuals.getTargetPosition();
    rightPoint.y = 0;
  }

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
