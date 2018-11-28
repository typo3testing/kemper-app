import { compose, lifecycle, withProps, withHandlers } from "recompose";

import { activateStep } from "./common";
import Doors from "./doors.jsx";

export default compose(
  withProps({
    captureType: "doors"
  }),
  withHandlers({
    activateStep
  }),
  lifecycle({
    componentDidMount() {
      this.props.activateStep();
    }
  })
)(Doors);
