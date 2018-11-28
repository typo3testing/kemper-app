import test from "tape";
import "ignore-styles";

import { init, goTo } from "./view-selection.js";

test("View Selection - init() calls clearScene", assert => {
  assert.plan(1);

  const sceneManager = {
    clearScene: () => assert.pass()
  };

  init({ sceneManager })();

  assert.end();
});

test("View Selection - goTo() pushes to a specific route", assert => {
  assert.plan(1);

  const mockRoute = "/test";

  const history = {
    push: route => assert.equals(route, mockRoute)
  };

  goTo({ history })(mockRoute);

  assert.end();
});
