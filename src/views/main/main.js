import {
  compose,
  lifecycle,
  pure,
  withState,
  withHandlers,
  withProps
} from "recompose";
import { withRouter } from "react-router";
import isInteger from "lodash/isInteger";
import flatMap from "lodash/flatMap";

import authManager from "../../services/auth-manager";
import appState from "../../services/app-state";
import projects from "../../services/projects";
import googleAnalytics from "../../services/google-analytics/index";
import { withSetLoading, withSetToast } from "../../services/loading";
import { withDialogControls } from "../../services/dialog";
import { translate } from "../../services";

import { getUiConfigPath } from "../../utils";
import viewarApi, { sceneManager } from "viewar-api";

import Main from "./main.jsx";

export const showInfoOverlay = ({
  setInfoOverlayVisible,
  setTimeout
}) => hideAfter => {
  setInfoOverlayVisible(true);
  googleAnalytics.logEvent("infoOverlay", "show", "");
  isInteger(hideAfter) &&
    setTimeout(() => setInfoOverlayVisible(false), hideAfter);
};

export const hideInfoOverlay = ({ setInfoOverlayVisible }) => () =>
  setInfoOverlayVisible(false);

export const toggleMenu = ({ setMenuVisible, menuVisible }) => () =>
  setMenuVisible(!menuVisible);

export const toggleShoppingCart = ({
  setShoppingCartVisible,
  shoppingCartVisible
}) => () => setShoppingCartVisible(!shoppingCartVisible);

export const toggleProductPicker = ({
  setProductPickerVisible,
  productPickerVisible,
  setMenuVisible,
  menuVisible
}) => () => {
  menuVisible && setMenuVisible(false);
  setProductPickerVisible(!productPickerVisible);
};

export const toggleConfigurator = ({
  setConfiguratorVisible,
  configuratorVisible
}) => () => setConfiguratorVisible(!configuratorVisible);

export const toggleProductInfo = ({
  setProductInfoVisible,
  productInfoVisible,
  configuratorVisible,
  setConfiguratorVisible
}) => () => {
  configuratorVisible && setConfiguratorVisible(false);
  setProductInfoVisible(!productInfoVisible);
};

export const saveProject = ({
  setShowSaveProjectDialog,
  saveLocalProject,
  projects,
  setLoading,
  setToast,
  getUiConfigPath
}) => async () => {
  if (getUiConfigPath("cloudProjects")) {
    setShowSaveProjectDialog(true);
  } else {
    await saveLocalProject();
  }
};

export const onSaveProject = ({
  setShowSaveProjectDialog,
  saveLocalProject,
  saveCloudProject
}) => async dialogResult => {
  setShowSaveProjectDialog(false);

  if (dialogResult.confirmed) {
    if (dialogResult.isCloudProject) {
      await saveCloudProject(dialogResult.projectName);
    } else {
      await saveLocalProject(dialogResult.projectName);
    }
  }
};

export const saveLocalProject = ({
  setLoading,
  setToast,
  projects
}) => async projectName => {
  setLoading(true);
  await projects.saveProject(projectName);
  setLoading(false);
  setToast(translate("ProjectSaved"));
};

export const saveCloudProject = ({
  showAuthDialog,
  appState,
  setLoading,
  setToast,
  projects
}) => async projectName => {
  let loggedIn = appState.authKey;
  if (!loggedIn) {
    loggedIn = await showAuthDialog();
  }

  if (loggedIn) {
    setLoading(true);
    await projects.saveCloudProject(projectName);
    setLoading(false);
    setToast(translate("ProjectSaved"));
  }
};

export const showAuthDialog = ({
  showDialog,
  appState,
  authManager
}) => async () => {
  const { confirmed, input } = await showDialog("DialogEnterEmail", {
    input: appState.authKey,
    withInput: true,
    showCancel: true
  });

  if (confirmed && input) {
    await authManager.login(input);
    return true;
  }

  return false;
};

export const removeSelection = ({
  sceneManager,
  selectedInstance,
  setConfiguratorVisible
}) => () => {
  setConfiguratorVisible(false);
  googleAnalytics.logEvent("scene", "remove", selectedInstance.id);
  sceneManager.removeNode(selectedInstance);
};

export const init = ({
  setTracking,
  updateTracking,
  showOldDeviceWarning,
  showGroundConfirmedToast,
  setToast,
  sceneManager,
  selectInstance,
  viewarApi,
  setTrackingActive
}) => async () => {
  const { trackers, cameras } = viewarApi;

  const tracker = Object.keys(trackers).length && Object.values(trackers)[0];
  const isTracking =
    tracker && tracker.active && cameras.augmentedRealityCamera.active;

  if (!isTracking) {
    setTracking(true);
  } else {
    if (tracker && tracker.loadTrackingMap) {
      tracker.on("trackingTargetStatusChanged", updateTracking);
    }

    updateTracking();
  }

  setTrackingActive(isTracking);

  await showOldDeviceWarning(isTracking);

  if (showGroundConfirmedToast)
    setTimeout(() => setToast(translate("GroundConfirmed"), 2000), 500);

  sceneManager.on("selectionChanged", selectInstance);
};

export const updateTracking = ({
  setTracking,
  viewarApi: { sceneManager, trackers }
}) => () => {
  const tracker = Object.values(trackers)[0];

  let tracking = true;
  if (tracker.loadTrackingMap) {
    tracking = tracker.targets.filter(
      target => target.type === "map" && target.tracked
    ).length;
  }

  sceneManager.scene.setVisible(tracking);
  setTracking(tracking);
};

export const showOldDeviceWarning = ({
  showDialog,
  viewarApi
}) => async isTracking => {
  if (isTracking) {
    const trackerName = Object.keys(viewarApi.trackers)[0];
    const trackingConfig = viewarApi.appConfig.trackerList.find(
      tracker => tracker.name === trackerName
    );
    const isOldDevice = trackingConfig && trackingConfig.config.replaces;
    if (isOldDevice) {
      await showDialog("OldDeviceWarning", {
        confirmText: "DialogOK"
      });
    }
  }
};

export const destroy = ({
  viewarApi: { trackers },
  updateTracking,
  sceneManager,
  selectInstance
}) => async () => {
  sceneManager.off("selectionChanged", selectInstance);

  const tracker = Object.values(trackers)[0];
  tracker && tracker.off("trackingTargetStatusChanged", updateTracking);
};

export const selectionHasInfo = ({ selectedInstance }) => () =>
  selectedInstance &&
  selectedInstance.model &&
  selectedInstance.model.info &&
  selectedInstance.model.info.description;

export const selectionHasProperties = ({ selectedInstance }) => () => {
  if (
    selectedInstance &&
    selectedInstance.displayTemplate &&
    selectedInstance.properties
  ) {
    const { properties, displayTemplate } = selectedInstance;
    const sanitizedProperties = flatMap(
      displayTemplate.map(({ properties: items }) =>
        items.map(({ name }) => properties[name])
      )
    ).filter(property => property.options && property.options.length > 1);
    return !!sanitizedProperties.length;
  }
  return false;
};

export const selectionHasPlayables = ({ selectedInstance }) => () =>
  selectedInstance &&
  [
    ...Object.keys(selectedInstance.animations),
    ...Object.keys(selectedInstance.videos)
  ].length >= 1;

export const goBack = ({ history, backButtonPath, prevView }) => () => {
  if (prevView) {
    history.push(prevView);
  } else if (backButtonPath) {
    history.push(backButtonPath);
  } else {
    history.goBack();
  }
};

export const takeScreenshot = ({
  viewarApi,
  setCurrentScreenshotPath
}) => async () => {
  await viewarApi.screenshotManager.takeScreenshot();
  const path = await viewarApi.screenshotManager.saveScreenshot("screenshots");
  setCurrentScreenshotPath(path);
};

export const saveScreenshot = ({ viewarApi, setToast }) => async () => {
  await viewarApi.screenshotManager.saveScreenshotToGallery();
  googleAnalytics.logEvent("screenshot", "save", "");
  setToast(translate("ScreenshotSaved"));
};

export const emailScreenshot = ({ viewarApi }) => async () => {
  googleAnalytics.logEvent("screenshot", "email", "");
  await viewarApi.screenshotManager.emailScreenshot();
};

export const shareScreenshot = ({
  viewarApi,
  currentScreenshotPath
}) => async () => {
  const screenshotManager = viewarApi.screenshotManager;
  googleAnalytics.logEvent(
    "screenshot",
    "share",
    currentScreenshotPath.replace(/.*:\/\//, "")
  );

  await screenshotManager.shareScreenshot("native", currentScreenshotPath);
};

export const cancelScreenshot = ({
  viewarApi,
  currentScreenshotPath,
  setCurrentScreenshotPath
}) => async () => {
  // viewarApi.screenshotManager.deleteScreenshot(currentScreenshotPath, 'screenshots')
  setCurrentScreenshotPath(null);
};

export const toggleScreenshotMenu = ({
  setLoading,
  setScreenshotMenuVisible,
  screenshotMenuVisible,
  takeScreenshot,
  cancelScreenshot
}) => async () => {
  setLoading(true);
  if (screenshotMenuVisible) {
    await cancelScreenshot();
  } else {
    await takeScreenshot();
  }
  setScreenshotMenuVisible(!screenshotMenuVisible);
  setLoading(false);
};

export const selectInstance = ({
  setSelectedInstance,
  setConfiguratorVisible,
  setProductInfoVisible,
  setPlaybackControlsVisible
}) => instance => {
  if (!instance) {
    setConfiguratorVisible(false);
    setProductInfoVisible(false);
    setPlaybackControlsVisible(false);
  }
  setSelectedInstance(instance);
};

export const togglePlaybackControls = ({
  playbackControlsVisible,
  setPlaybackControlsVisible
}) => () => setPlaybackControlsVisible(!playbackControlsVisible);

export const resetTracking = ({ history, showDialog }) => async () => {
  const result = await showDialog("MainResetTracking", {
    showCancel: true,
    confirmText: "DialogYes",
    cancelText: "DialogNo"
  });

  if (result.confirmed) {
    history.goBack();
  }
};

export const getScreenshotImage = ({
  viewarApi,
  currentScreenshotPath
}) => () => viewarApi.coreInterface.resolveUrl(currentScreenshotPath);

export const onHelpScreenChange = ({ setHelpScreen }) => screenName => {
  setHelpScreen(screenName);
};

export default compose(
  withSetLoading,
  withSetToast,
  withDialogControls,
  withRouter,
  withState("currentScreenshotPath", "setCurrentScreenshotPath", null),
  withState("infoOverlayVisible", "setInfoOverlayVisible", false),
  withState("menuVisible", "setMenuVisible", false),
  withState("screenshotMenuVisible", "setScreenshotMenuVisible", false),
  withState("productPickerVisible", "setProductPickerVisible", false),
  withState("configuratorVisible", "setConfiguratorVisible", false),
  withState("productInfoVisible", "setProductInfoVisible", false),
  withState("shoppingCartVisible", "setShoppingCartVisible", false),
  withState("trackingActive", "setTrackingActive", false),
  withState("playbackControlsVisible", "setPlaybackControlsVisible", false),
  withState("helpScreen", "setHelpScreen", "buttons"),
  withState("showSaveProjectDialog", "setShowSaveProjectDialog", false),
  withState("tracking", "setTracking", false),
  withProps({
    setTimeout,
    projects,
    sceneManager,
    viewarApi,
    authManager,
    appState,
    getUiConfigPath
  }),
  withState(
    "selectedInstance",
    "setSelectedInstance",
    ({ sceneManager }) => sceneManager.selection
  ),
  withHandlers({
    selectionHasInfo,
    selectionHasProperties,
    selectionHasPlayables,
    saveScreenshot,
    emailScreenshot,
    shareScreenshot,
    takeScreenshot,
    cancelScreenshot,
    resetTracking,
    togglePlaybackControls,
    getScreenshotImage
  }),
  withProps(({ getUiConfigPath }) => ({
    showPropertyList: getUiConfigPath("showPropertyList"),
    shoppingCartEnabled: getUiConfigPath("shoppingCart"),
    shareEnabled: getUiConfigPath("share"),
    projectsEnabled: getUiConfigPath("projects")
  })),
  withProps(
    ({
      history,
      productPickerVisible,
      screenshotMenuVisible,
      menuVisible,
      configuratorVisible,
      shoppingCartVisible,
      productInfoVisible,
      selectionHasProperties,
      infoOverlayVisible,
      selectedInstance,
      selectionHasPlayables,
      playbackControlsVisible,
      helpScreen,
      selectionHasInfo,
      shoppingCartEnabled,
      shareEnabled,
      projectsEnabled
    }) => ({
      showGroundConfirmedToast:
        history.location.state && history.location.state.showGroundConfirmToast,
      backButtonPath:
        history.location.state && history.location.state.backButtonPath,
      productButtonHidden:
        configuratorVisible ||
        productInfoVisible ||
        screenshotMenuVisible ||
        shoppingCartVisible ||
        playbackControlsVisible ||
        (infoOverlayVisible && helpScreen === "gestures"),
      toolbarHidden:
        configuratorVisible ||
        productInfoVisible ||
        productPickerVisible ||
        playbackControlsVisible ||
        (infoOverlayVisible && helpScreen === "gestures"),
      toolbarButtonHidden: screenshotMenuVisible || !menuVisible,
      projectsButtonHidden:
        screenshotMenuVisible || !menuVisible || shoppingCartVisible,
      screenshotButtonHidden: !menuVisible || shoppingCartVisible,
      menuButtonHidden: shoppingCartVisible || screenshotMenuVisible,
      infoButtonHidden:
        configuratorVisible || playbackControlsVisible || productPickerVisible,
      infoButtonEnabled: selectedInstance && selectionHasInfo(),
      deleteButtonHidden:
        configuratorVisible ||
        productPickerVisible ||
        playbackControlsVisible ||
        productInfoVisible,
      configuratorButtonHidden:
        !selectedInstance ||
        productPickerVisible ||
        productInfoVisible ||
        playbackControlsVisible ||
        !selectionHasProperties(),
      configuratorButtonEnabled: selectedInstance && selectionHasProperties(),
      playbackButtonHidden:
        !selectedInstance ||
        configuratorVisible ||
        productPickerVisible ||
        productInfoVisible ||
        !selectionHasPlayables(),
      playbackButtonEnabled: selectedInstance && selectionHasPlayables(),
      helpButtonHidden:
        infoOverlayVisible ||
        configuratorVisible ||
        shoppingCartVisible ||
        productPickerVisible ||
        productInfoVisible ||
        screenshotMenuVisible,
      selectionToolbarHidden:
        !selectedInstance || infoOverlayVisible || shoppingCartVisible,
      headerBarHidden: infoOverlayVisible && helpScreen === "gestures",
      menuEnabled: projectsEnabled || shareEnabled || shoppingCartEnabled
    })
  ),
  withProps(
    ({ configuratorButtonEnabled, infoButtonEnabled, backButtonPath }) => ({
      playbackGapOffset:
        (!configuratorButtonEnabled ? -1 : 0) + (!infoButtonEnabled ? -1 : 0),
      infoGapOffset: !configuratorButtonEnabled ? -1 : 0,
      showHomeIconOnBack: backButtonPath === "/"
    })
  ),
  withHandlers({
    showAuthDialog
  }),
  withHandlers({
    saveLocalProject,
    saveCloudProject
  }),
  withHandlers({
    selectInstance,
    toggleConfigurator,
    removeSelection,
    hideInfoOverlay,
    onSaveProject,
    toggleProductPicker,
    toggleProductInfo,
    toggleMenu,
    toggleShoppingCart,
    toggleScreenshotMenu,
    showInfoOverlay,
    goBack,
    onHelpScreenChange,
    showOldDeviceWarning,
    updateTracking
  }),
  withHandlers({
    init,
    saveProject,
    destroy
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    componentWillUnmount() {
      this.props.destroy();
    }
  }),
  pure
)(Main);
