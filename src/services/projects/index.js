import viewarApi from "viewar-api";
import { createProjects } from "./projects";
import {
  getActiveTracker,
  saveTrackerFeatureSet,
  loadTrackerFeatureSet,
  unloadTrackerFeatureSet,
  trackerNeedsInitialization
} from "./tracking";
import { roomPlanner } from "../../services/index";
import googleAnalytics from "../../services/google-analytics/index";

export const saveScreenshot = async () => {
  const { screenshotManager } = viewarApi;
  await screenshotManager.takeScreenshot();
  return await screenshotManager.saveScreenshot("projects");
};

export const activatePerspectiveCamera = async () => {
  const { cameras } = viewarApi;
  if (cameras.perspectiveCamera) {
    await cameras.perspectiveCamera.activate();
    await cameras.perspectiveCamera.zoomToFit();
  }
};

export const getActiveCameraName = () => {
  const { cameras } = viewarApi;
  return cameras.arCamera.active ? "arCamera" : "perspectiveCamera";
};

export const activateCamera = cameraName => {
  const { cameras } = viewarApi;
  return cameras[cameraName].activate();
};

export const getSelection = () =>
  viewarApi.sceneManager.selection && viewarApi.sceneManager.selection.id;

export const getRoomEditorState = () =>
  JSON.parse(JSON.stringify(roomPlanner.exportState()));

export const takeFreezeFrame = async () => {
  const camera = viewarApi.cameras.arCamera;
  const frozen = camera.frozen;
  await camera.freeze();
  const freezeFrame = await camera.saveFreezeFrame(
    Math.random()
      .toString(36)
      .substring(7)
  );
  if (!frozen) {
    await camera.unfreeze();
  }

  return freezeFrame;
};

export const loadFreezeFrame = async name => {
  const {
    cameras: { arCamera }
  } = viewarApi;
  let freezeFrame = arCamera.freezeFrames.find(
    freezeFrame => freezeFrame.name === name
  );

  if (!freezeFrame) {
    freezeFrame = await arCamera.downloadFreezeFrame(name);
  }

  await arCamera.showFreezeFrame(freezeFrame);
};

export const createNewProject = (...args) =>
  viewarApi.projectManager.createNewProject(...args);

export const logEvent = (...args) => googleAnalytics.logEvent(...args);

export const importRoomState = editorState =>
  roomPlanner.importState(editorState);

export const updateProjectIndex = async () => {
  await viewarApi.projectManager.updateLocalProjectIndex();
  await viewarApi.projectManager.updateCloudIndex();
};

export const selectInstance = async instanceId => {
  const { sceneManager } = viewarApi;

  if (instanceId) {
    const selection = sceneManager.findNodeById(instanceId);
    if (selection) {
      await sceneManager.select(selection);
    }
  }
};

export const getProjects = () => viewarApi.projectManager.projects;

export const uploadFreezeFrames = async freezeFrames => {
  const { coreInterface } = viewarApi;

  for (let freezeFrame of freezeFrames || []) {
    await coreInterface.call("uploadFreezeFrameToServer", freezeFrame.name);
  }
};

export default createProjects({
  saveScreenshot,
  getActiveTracker,
  getActiveCameraName,
  activateCamera,
  saveTrackerFeatureSet,
  loadTrackerFeatureSet,
  unloadTrackerFeatureSet,
  activatePerspectiveCamera,
  getSelection,
  getRoomEditorState,
  takeFreezeFrame,
  loadFreezeFrame,
  createNewProject,
  logEvent,
  importRoomState,
  updateProjectIndex,
  selectInstance,
  getProjects,
  trackerNeedsInitialization,
  uploadFreezeFrames
});
