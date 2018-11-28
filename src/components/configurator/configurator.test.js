import test from "tape";
import "ignore-styles";

import { shallowEquals, noop } from "../../utils";
import { compileDisplayTemplate, setValues } from "./configurator.js";

test("Configurator - compileDisplayTemplate() respects property order in template", assert => {
  assert.plan(1);

  const fakeProperty = { options: ["a", "b"] };
  const A = fakeProperty;
  const B = fakeProperty;
  const C = fakeProperty;
  const D = fakeProperty;
  const E = fakeProperty;
  const properties = { A, B, C, D, E };
  const displayTemplate = [
    {
      label: "Group 1",
      properties: [{ name: "C" }, { name: "B" }]
    },
    {
      label: "Group 2",
      properties: [{ name: "D" }, { name: "A" }]
    }
  ];

  const template = compileDisplayTemplate({ properties, displayTemplate });

  shallowEquals(assert)(template, [C, B, D, A]);

  assert.end();
});

test("Configurator - compileDisplayTemplate() filters properties with less than 2 options", assert => {
  assert.plan(1);

  const fakeProperty = { options: ["a", "b"] };
  const A = fakeProperty;
  const B = { options: ["a"] };
  const C = { options: [] };
  const D = fakeProperty;
  const E = fakeProperty;
  const properties = { A, B, C, D, E };
  const displayTemplate = [
    {
      label: "Group 1",
      properties: [{ name: "C" }, { name: "B" }]
    },
    {
      label: "Group 2",
      properties: [{ name: "D" }, { name: "A" }]
    }
  ];

  const template = compileDisplayTemplate({ properties, displayTemplate });

  shallowEquals(assert)(template, [D, A]);

  assert.end();
});

test("Configurator - setValues() updates property values of selected instance", async assert => {
  assert.plan(1);

  const values = {};
  const instance = {
    displayTemplate: [],
    setPropertyValues: async newValues => assert.equals(values, newValues)
  };

  await setValues({ instance, setPropertyValues: noop })(values);

  assert.end();
});

test("Configurator - setValues() updates UI with correct property values", async assert => {
  assert.plan(1);

  const newValues = {
    A: 4
  };
  const oldValues = {
    A: 1,
    B: 2,
    C: 3
  };
  const correctValues = {
    A: 4,
    B: 2,
    C: 3
  };
  const instance = {
    propertyValues: oldValues,
    displayTemplate: [],
    setPropertyValues: async newValues => {
      Object.assign(instance.propertyValues, newValues);
    }
  };
  const setPropertyValues = newValues =>
    assert.deepEquals(instance.propertyValues, correctValues);

  await setValues({ instance, setPropertyValues })(newValues);

  assert.end();
});
