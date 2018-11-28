import { withRouter } from "react-router";
import { compose, withHandlers, lifecycle, withProps } from "recompose";

import RoomSelection from "./room-selection.jsx";

export const goToRoomPlanner = ({ history }) => () => {
  history.push("/room-planner");
};

export const goToRoomCapture = ({ history }) => () => {
  history.push("/calibration-capture");
};

export default compose(
  withRouter,
  withHandlers({
    goToRoomPlanner,
    goToRoomCapture
  })
)(RoomSelection);
