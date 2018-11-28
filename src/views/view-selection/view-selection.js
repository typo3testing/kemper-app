import { withRouter } from "react-router";
import { compose, withHandlers, lifecycle, withProps } from "recompose";
import { getUiConfigPath } from "../../utils";
import { withSetLoading } from "../../services/loading";
import { withDialogControls } from "../../services/dialog";
import getFileTimestamp from "../../utils/get-file-timestamp";
import viewarApi from "viewar-api";

import ViewSelection from "./view-selection.jsx";

export const goToArMode = ({ viewarApi, history }) => async () => {
  await viewarApi.cameras.augmentedRealityCamera.activate();
  history.push("/main");
};

export const goToVrMode = ({ viewarApi, history }) => async () => {
  await viewarApi.cameras.perspectiveCamera.activate();
  history.push("/main");
};

export const goToWalkMode = ({ viewarApi, history }) => async () => {
  await viewarApi.cameras.walkCamera.activate();
  history.push("/walk");
};

export const goToRoomPlanner = ({ history }) => () => {
  history.push("/room-planner");
};

export const exportRoom = ({
  viewarApi: { sceneManager, appUtils },
  setLoading,
  showDialog
}) => async () => {
  const result = await showDialog("ViewSelectionExportRoom", {
    showCancel: true,
    confirmText: "DialogYes",
    cancelText: "DialogNo"
  });

  if (result.confirmed) {
    setLoading(true);
    const filename = `room_${getFileTimestamp()}`;
    const exportPath = await sceneManager.exportScene(filename);
    setLoading(false);

    await appUtils.sendEmail({ attachments: exportPath });
  }
};

export const init = ({}) => async () => {};

export default compose(
  withRouter,
  withDialogControls,
  withSetLoading,
  withProps({
    viewarApi,
    getUiConfigPath
  }),
  withProps(({ getUiConfigPath }) => ({
    roomExportEnabled: getUiConfigPath("roomExport")
  })),
  withHandlers({
    init,
    goToArMode,
    goToVrMode,
    goToWalkMode,
    goToRoomPlanner,
    exportRoom
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    }
  })
)(ViewSelection);
