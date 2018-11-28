import { withRouter } from "react-router";
import { modelManager, roomManager } from "viewar-api";

import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle
} from "recompose";
import { roomPlanner, translate } from "../../services";
import roomCapture from "../../services/room-capturing";

import projects from "../../services/projects";
import { withSetLoading, withSetToast } from "../../services/loading";
import { withDialogControls } from "../../services/dialog";
import { getUiConfigPath } from "../../utils";

import RoomCapture from "./room-capture.jsx";

/* No need to add tests for these */
export const startCapture = ({
  history,
  goToFinalStep,
  goToNextStep,
  showDialog,
  roomCapture,
  setCanUndo,
  setCanFinish,
  setCanCapture,
  displayEvent,
  updateProgress,
  setLoading
}) => async () => {
  roomCapture.on("canUndo", setCanUndo);
  roomCapture.on("canFinish", setCanFinish);
  roomCapture.on("canCapture", setCanCapture);
  roomCapture.on("event", displayEvent);
  roomCapture.on("roomClosed", goToFinalStep);

  setLoading(true);
  try {
    await roomCapture.start(updateProgress);
  } catch (e) {
    console.error(e);
    setLoading(false);
    await showDialog("RoomPlannerDownloadFailed", {
      confirmText: "DialogOK"
    });
    history.push("/");
  }
  sessionStorage.setItem("initialPoints", "");
  setLoading(false);
};
export const stopCapture = ({
  roomCapture,
  setCanUndo,
  setCanFinish,
  setCanCapture,
  displayEvent,
  history,
  showDialog
}) => async () => {
  roomCapture.off("canUndo", setCanUndo);
  roomCapture.off("canFinish", setCanFinish);
  roomCapture.off("canCapture", setCanCapture);
  roomCapture.off("event", displayEvent);
  await roomCapture.stop();
  /*
  var initialPoints = sessionStorage.getItem('initialPoints');
  if(initialPoints!=''){
    var points = JSON.parse(sessionStorage.getItem('initialPoints'));
    var l = points.length;
    var det = 0;
    if (points[0] != points[points.length -1])  
      points = points.concat(points[0])

    for (var i = 0; i < l; i++)
      det += points[i].x * points[i + 1].y
        - points[i].y * points[i + 1].x
    var area = Math.abs(det) / 2;

    showDialog("stopCapture Area: "+area+" cord: "+sessionStorage.getItem('initialPoints'), {
        confirmText: 'DialogOK'
    });  
  }
  */
};

export const undoCapture = ({ roomCapture }) => () => roomCapture.undo();
export const capturePoint = ({ roomCapture, showDialog }) => () => {
  roomCapture.capture();
  /*
  showDialog("capturePoint ", {
      confirmText: 'DialogOK'
  });
  */
};
export const cancel = ({ history }) => () => history.push("/");

export const finishCapture = ({
  history,
  showDialog,
  roomManager,
  roomCapture,
  roomPlanner,
  setLoading,
  projects,
  setToast,
  stopCapture,
  projectsEnabled
}) => async () => {
  setLoading(true);

  const materials = roomManager.roomMaterialDescription;
  const colorOptions = {};
  materials.forEach(color => (colorOptions[color.id] = color.options[0].id));

  roomCapture.finish();
  roomPlanner.insertRoom(roomCapture.roomState);

  const exportState = roomPlanner.exportStateToCore(colorOptions);
  await stopCapture();
  await roomManager.addRoomToScene(exportState);

  if (projectsEnabled) {
    await projects.saveProject(undefined, undefined, true);
  }

  setToast(translate("ProjectSaved"), 3000);

  setLoading(false);
  /*
  showDialog("finishCapture ", {
      confirmText: 'DialogOK'
  });
  */
  history.push("/view-selection-ar");
};

export const goToNextStep = ({
  setLoading,
  currentStep,
  setCurrentStep,
  roomCapture,
  showDialog,
  history
}) => async () => {
  //setCurrentStep(currentStep + 1)
  /*
  showDialog("goToNextStep ", {
      confirmText: 'DialogOK'
  });
  */
  await roomCapture.stop();
  history.push("/calculate-area");
};
export const goToFinalStep = ({
  currentStep,
  setCurrentStep,
  roomCapture,
  showDialog,
  history
}) => async () => {
  /*showDialog("goToFinalStep ", {
      confirmText: 'DialogOK'
  });*/
};

export const updateProgress = ({ setLoading }) => progress => {
  true, true, progress;
};

export const displayEvent = ({ setToast }) => event => {
  setToast(translate("RoomCapture" + event), 1000, false);
};

export default compose(
  withRouter,
  withSetLoading,
  withDialogControls,
  withSetToast,
  withProps({
    roomCapture,
    roomManager,
    roomPlanner,
    projects,
    getUiConfigPath
  }),
  withProps(() => ({
    projectsEnabled: getUiConfigPath("projects")
  })),
  withState("currentStep", "setCurrentStep", 0),
  withState("canUndo", "setCanUndo", false),
  withState("canFinish", "setCanFinish", false),
  withState("canCapture", "setCanCapture", false),
  withHandlers({
    updateProgress,
    cancel,
    undoCapture,
    goToNextStep,
    capturePoint,
    displayEvent,
    goToFinalStep
  }),
  withHandlers({
    startCapture,
    stopCapture
  }),
  withHandlers({
    finishCapture
  }),
  lifecycle({
    async componentDidMount() {
      const { setLoading, startCapture } = this.props;
      await startCapture();
    },
    async componentWillUnmount() {
      await this.props.stopCapture();
    }
  })
)(RoomCapture);
