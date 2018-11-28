import test from "tape";

import { selectValue } from "./property-widget.js";

test("PropertyWidget - selectValue() applies selected value to instance props", async assert => {
  assert.plan(1);

  const property = {
    name: "A",
    values: [1, 2, 3],
    value: 1
  };
  const selectedValue = 2;
  const setValues = async newPropValues => assert.equals(newPropValues["A"], 2);

  await selectValue({ property, valueValid: () => true, setValues })({
    key: selectedValue
  });

  assert.end();
});

test("PropertyWidget - selectValue() will not apply invalid value", async assert => {
  assert.plan(1);

  const property = {
    name: "A",
    values: [1, 2, 3],
    value: 1
  };
  const selectedValue = 2;
  const setValues = async () => assert.fail();

  await selectValue({ property, valueValid: () => false, setValues })(
    selectedValue
  );

  assert.pass();

  assert.end();
});
