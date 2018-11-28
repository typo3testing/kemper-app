import {
  compose,
  lifecycle,
  withProps,
  withHandlers,
  withState
} from "recompose";

import Walls from "./walls.jsx";

export const activateStep = ({ roomCapture, updateLength }) => async () => {
  roomCapture.on("length", updateLength);
};

export const deactivateStep = ({ roomCapture, updateLength }) => async () => {
  roomCapture.off("length", updateLength);
};

export const updateLength = ({ setLength }) => length => {
  setLength(Math.round(length / 10));
};

export default compose(
  withProps({
    captureType: "walls"
  }),
  withState("length", "setLength", 0),
  withHandlers({
    updateLength
  }),
  withHandlers({
    activateStep,
    deactivateStep
  }),
  lifecycle({
    componentDidMount() {
      this.props.activateStep();
    },
    componentWillUnmount() {
      this.props.deactivateStep();
    }
  })
)(Walls);
