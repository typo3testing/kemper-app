import test from "tape";

import { goBack } from "./handlers";

test("Handlers - goBack() calls goBack method of history api", async assert => {
  assert.plan(1);

  const history = {
    goBack: () => assert.pass()
  };

  goBack({ history })();

  assert.end();
});
