import {
  compose,
  lifecycle,
  withProps,
  withState,
  withHandlers
} from "recompose";

import Height from "./height.jsx";

export const activateStep = ({
  roomCapture,
  captureType,
  updateHeight
}) => async () => {
  roomCapture.on("height", updateHeight);
  await roomCapture.nextState();
};

export const deactivateStep = ({ roomCapture, updateHeight }) => async () => {
  roomCapture.off("height", updateHeight);
};

export const updateHeight = ({ setHeight }) => height => {
  setHeight(Math.round(height / 10));
};

export const captureRoomHeight = ({
  capturePoint,
  goToNextStep
}) => async () => {
  await capturePoint();
  goToNextStep();
};

export default compose(
  withProps({
    captureType: "roomheight"
  }),
  withState("height", "setHeight", 0),
  withHandlers({
    updateHeight,
    captureRoomHeight
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
)(Height);
