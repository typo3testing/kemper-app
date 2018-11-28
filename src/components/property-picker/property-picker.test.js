import test from "tape";
import "ignore-styles";

import { selectPrevious, selectNext } from "./property-picker.js";

test("PropertyPicker - selectPrevious() selects previous property in list", assert => {
  assert.plan(1);

  const A = {};
  const B = {};
  const C = {};
  const properties = [A, B, C];
  const activeProperty = B;
  const setActiveProperty = newActiveProperty =>
    assert.equals(newActiveProperty, A);

  selectPrevious({ properties, activeProperty, setActiveProperty })();

  assert.end();
});

test("PropertyPicker - selectPrevious() handles left overflow", assert => {
  assert.plan(1);

  const A = {};
  const B = {};
  const C = {};
  const properties = [A, B, C];
  const activeProperty = A;
  const setActiveProperty = newActiveProperty =>
    assert.equals(newActiveProperty, C);

  selectPrevious({ properties, activeProperty, setActiveProperty })();

  assert.end();
});

test("PropertyPicker - selectNext() selects next property in list", assert => {
  assert.plan(1);

  const A = {};
  const B = {};
  const C = {};
  const properties = [A, B, C];
  const activeProperty = B;
  const setActiveProperty = newActiveProperty =>
    assert.equals(newActiveProperty, C);

  selectNext({ properties, activeProperty, setActiveProperty })();

  assert.end();
});

test("PropertyPicker - selectNext() selects next property in list", assert => {
  assert.plan(1);

  const A = {};
  const B = {};
  const C = {};
  const properties = [A, B, C];
  const activeProperty = C;
  const setActiveProperty = newActiveProperty =>
    assert.equals(newActiveProperty, A);

  selectNext({ properties, activeProperty, setActiveProperty })();

  assert.end();
});
