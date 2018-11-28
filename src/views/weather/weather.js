import { withRouter } from "react-router";
import { compose, withHandlers, lifecycle, withProps } from "recompose";

import projectService from "../../services/projects";
import viewarApi from "viewar-api";
import { roomPlanner, translate } from "../../services";
import { getUiConfigPath } from "../../utils";
import { withDialogControls } from "../../services/dialog";
import appState from "../../services/app-state";
import authManager from "../../services/auth-manager";
import roomCapture from "../../services/room-capturing";

import Weather from "./weather.jsx";
import { withSetToast } from "../../services/loading";

export const getVideoExtension = url => {
  if (url) {
    try {
      const extension = url
        .split(".")
        .pop()
        .toLowerCase();
      return `video/${extension}}`;
    } catch (e) {
      return "video/mp4";
    }
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

export const goToRoomSelection = ({
  history,
  hasARMode,
  hasARKit,
  hasARCore
}) => () => {
  if (hasARMode && (hasARKit || hasARCore)) {
    history.push("/room-selection");
  } else {
    history.push("/room-planner");
  }
};

export const init = ({
  viewarApi,
  projectService,
  resetRoomState,
  resetTrackers,
  insertOriginModel,
  authManager
}) => async () => {
  const {
    cameras: { perspectiveCamera },
    sceneManager
  } = viewarApi;
  await sceneManager.clearScene();
  await perspectiveCamera.activate();
  if (projectService.activeProject) {
    await projectService.unloadProject(projectService.activeProject);
  }
  await insertOriginModel();
  await resetRoomState();
  await resetTrackers();
  await authManager.readPersisted();
};

export const resetTrackers = ({ viewarApi }) => async () => {
  for (let tracker of Object.values(viewarApi.trackers)) {
    await tracker.deactivate();
  }
};

export const resetRoomState = ({
  getUiConfigPath,
  roomPlanner,
  roomCapture,
  viewarApi
}) => async () => {
  const { roomManager, appUtils } = viewarApi;

  roomCapture.resetRoomState();
  roomCapture.wallsVisible = !getUiConfigPath("hideRoomWalls");

  if (getUiConfigPath("noCollision")) {
    appUtils.setCollisionMode(0);
  }

  roomPlanner.clear();
  await roomManager.removeRoomFromScene();
};

export const insertOriginModel = ({
  viewarApi,
  getModelFromRepository
}) => async () => {
  const { appConfig, modelManager, sceneManager } = viewarApi;
  if ((appConfig.uiConfig || {}).originModel) {
    const id = appConfig.uiConfig.originModel;
    try {
      const model =
        modelManager.findModelByForeignKey(id) ||
        (await getModelFromRepository(id));
      if (model) {
        const origin = {
          position: {
            x: 0,
            y: 0,
            z: 0
          },
          orientation: {
            w: 1,
            x: 0,
            y: 0,
            z: 0
          }
        };
        sceneManager.insertModel(model, { pose: origin });
      } else {
        console.error(`Origin model '${id}' not available.`);
      }
    } catch (e) {
      console.error(`Could not insert origin model '${id}': ${e.message}`);
    }
  }
};

export const getModelFromRepository = ({ viewarApi }) => (
  modelId,
  timeout = 5000
) => {
  const { modelManager } = viewarApi;

  let timeoutId;

  const timeoutFn = new Promise(resolve => {
    timeoutId = setTimeout(() => {
      console.error(`Getting model '${modelId}' from repository timed out.`);
      resolve(null);
    }, timeout);
  });

  const modelManagerFn = new Promise(resolve => {
    modelManager.getModelFromRepository(modelId).then(model => {
      clearTimeout(timeoutId);
      resolve(model);
    });
  });

  return Promise.race([modelManagerFn, timeoutFn]);
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

export const showShopFinder = ({
  setLoading,
  getUiConfigPath,
  history,
  viewarApi: { appUtils }
}) => async () => {
  const shopFinderUrl =
    getUiConfigPath("shopFinder.url") || getUiConfigPath("shopFinder");
  const shopFinderType = getUiConfigPath("shopFinder.type") || "external";

  switch (shopFinderType) {
    case "external":
      appUtils.openUrl(shopFinderUrl);
      break;
    case "iframe":
      history.push({ pathname: "custom-page", state: { url: shopFinderUrl } });
      break;
    default:
      history.push("/shop-finder");
      break;
  }
};

export default compose(
  withRouter,
  withSetToast,
  withDialogControls,
  withProps({
    viewarApi,
    roomCapture,
    roomPlanner,
    appState,
    getUiConfigPath,
    projectService,
    authManager
  }),
  withProps(({ viewarApi, getUiConfigPath }) => ({
    hasTrackers: !!Object.keys(viewarApi.trackers).length,
    hasARMode: viewarApi.coreInterface.platform !== "Emscripten",
    hasARKit:
      viewarApi.coreInterface.platform !== "Emscripten" &&
      !!viewarApi.trackers.ARKit,
    hasARCore:
      viewarApi.coreInterface.platform !== "Emscripten" &&
      !!viewarApi.trackers.ARCore,
    authButtonEnabled: getUiConfigPath("auth"),
    liveEnabled: getUiConfigPath("live"),
    roomSelectionEnabled: getUiConfigPath("roomPlanner"),
    projectsEnabled: getUiConfigPath("projects"),
    videoUrl: getUiConfigPath("introVideo"),
    shopFinderEnabled: !!(
      getUiConfigPath("shopFinder.url") || getUiConfigPath("shopFinder")
    )
  })),
  withProps(({ hasARMode, liveEnabled, videoUrl }) => ({
    liveButtonVisible: liveEnabled && hasARMode,
    videoExtension: getVideoExtension(videoUrl)
  })),
  withHandlers({
    getModelFromRepository
  }),
  withHandlers({
    resetRoomState,
    resetTrackers,
    insertOriginModel,
    goToLive,
    goToRoomSelection,
    showShopFinder
  }),
  withHandlers({
    init,
    goTo,
    showAuthDialog
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    }
  })
)(Weather);
