import { compose, lifecycle, withProps, withHandlers } from "recompose";

import { activateStep } from "./common";
import Windows from "./windows.jsx";

export default compose(
  withProps({
    captureType: "windows"
  }),
  withHandlers({
    activateStep
  }),
  lifecycle({
    componentDidMount() {
      this.props.activateStep();
    }
  })
)(Windows);
