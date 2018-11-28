import React from "react";
import viewarApi from "viewar-api";
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps
} from "recompose";

import createKeyboardJoystick from "./joysticks/keyboard-joystick";

import WalkControl from "./walk-control.jsx";

export const movementKeys = {
  "x+": 68,
  "x-": 65,
  "y+": 83,
  "y-": 87
};

export const rotationKeys = {
  "x+": 39,
  "x-": 37,
  "y+": 38,
  "y-": 40
};

export const init = ({
  viewarApi,
  setUseKeyboard,
  keyboardMovementJoystick,
  keyboardRotationJoystick
}) => async () => {
  if (viewarApi.coreInterface.platform === "Emscripten") {
    setUseKeyboard(true);

    keyboardMovementJoystick.attach();
    keyboardRotationJoystick.attach();
  }
};

export const tearDown = ({
  useKeyboard,
  keyboardMovementJoystick,
  keyboardRotationJoystick
}) => () => {
  if (useKeyboard) {
    keyboardMovementJoystick.detach();
    keyboardRotationJoystick.detach();
  }
};

export const handleMovement = ({
  viewarApi,
  lastMovement,
  setLastMovement
}) => async ({ x, y, z }) => {
  if (lastMovement.x !== x || lastMovement.y !== y) {
    setLastMovement({ x, y });
    return viewarApi.cameras.walkCamera.translate({
      x: x,
      y: 0,
      z: y
    });
  }
};

export const handleRotation = ({
  viewarApi,
  lastRotation,
  setLastRotation
}) => async ({ x, y, z }) => {
  if (lastRotation.x !== x || lastRotation.y !== y) {
    setLastRotation({ x, y });
    return viewarApi.cameras.walkCamera.rotate({
      x: y,
      y: -x,
      z: 0
    });
  }
};

export default compose(
  withState("lastMovement", "setLastMovement", { x: 0, y: 0 }),
  withState("lastRotation", "setLastRotation", { x: 0, y: 0 }),
  withState("useKeyboard", "setUseKeyboard", false),
  withProps({
    viewarApi
  }),
  withHandlers({
    handleMovement,
    handleRotation
  }),
  withProps({
    movementKeys,
    rotationKeys
  }),
  withProps(
    ({
      viewar,
      handleMovement,
      handleRotation,
      movementKeys,
      rotationKeys
    }) => ({
      keyboardMovementJoystick: createKeyboardJoystick({
        maxValue: 20,
        keys: movementKeys,
        onUpdate: handleMovement
      }),
      keyboardRotationJoystick: createKeyboardJoystick({
        maxValue: 1 / (Math.PI * 30),
        keys: rotationKeys,
        onUpdate: handleRotation
      })
    })
  ),
  withHandlers({
    init,
    tearDown
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.init();
    },
    componentWillUnmount() {
      this.props.tearDown();
    }
  })
)(WalkControl);
