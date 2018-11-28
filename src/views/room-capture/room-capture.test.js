import test from "tape";

import { goToNextStep } from "./room-capture.js";

test("Handlers - goToNextStep() switches to the next step", async assert => {
  assert.plan(1);

  const currentStep = 0;
  const setCurrentStep = nextStep => assert.equals(currentStep + 1, nextStep);

  goToNextStep({ currentStep, setCurrentStep })();

  assert.end();
});
