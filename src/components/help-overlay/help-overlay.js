import { compose, withProps, withState, withHandlers } from "recompose";
import viewarApi from "viewar-api";
import { getUiConfigPath } from "../../utils";

import HelpOverlay from "./help-overlay.jsx";

export const changeScreen = ({ setScreen, onScreenChange }) => (
  screenName,
  event
) => {
  setScreen(screenName);
  onScreenChange && onScreenChange(screenName);
  event.stopPropagation();
};

export default compose(
  withState("screen", "setScreen", "buttons"),
  withProps({
    viewarApi,
    getUiConfigPath
  }),
  withProps(({ getUiConfigPath, viewarApi: { coreInterface } }) => ({
    isWebVersion: coreInterface.platform === "Emscripten",
    shoppingCartEnabled: getUiConfigPath("shoppingCart"),
    shareEnabled: getUiConfigPath("share"),
    projectsEnabled: getUiConfigPath("projects")
  })),
  withProps(({ projectsEnabled, shareEnabled, shoppingCartEnabled }) => ({
    menuEnabled: projectsEnabled || shareEnabled || shoppingCartEnabled,
    shoppingCartPosition: shareEnabled ? 1 : 0,
    savePosition: (shareEnabled ? 1 : 0) + (shoppingCartEnabled ? 1 : 0)
  })),
  withHandlers({
    changeScreen
  })
)(HelpOverlay);
