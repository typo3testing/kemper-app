import test from "tape";
import "ignore-styles";

import { shallowEquals, noop } from "../../utils";
import { init } from "./walk-control.js";

test("Walk Control - init() sets keyboard controls active", async assert => {
  assert.plan(3);

  const viewarApi = {
    coreInterface: {
      Emscripten: true
    }
  };

  const setKeyboardActive = value => assert.equals(value, true);

  const keyboardMovementJoystick = {
    attach: assert.pass
  };

  const keyboardRotationJoystick = {
    attach: assert.pass
  };

  await init({
    viewarApi,
    setKeyboardActive,
    keyboardMovementJoystick,
    keyboardRotationJoystick
  })();

  assert.end();
});
