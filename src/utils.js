import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import config from "./config";

// TODO: I don't know how to test this, it simply works with React
export const runAfterUpdate = fn => () =>
  setTimeout(() => requestAnimationFrame(fn), 0);

export const shallowEquals = assert => (actual, expected, msg) => {
  if (
    isArray(actual) &&
    isArray(expected) &&
    actual.length === expected.length
  ) {
    return assert.ok(
      actual.every((item, index) => item === expected[index]),
      msg
    );
  }
  if (isObject(actual) && isObject(expected)) {
    const actualEntries = Object.entries(actual);
    const expectedEntries = Object.entries(expected);
    if (actualEntries.length === expectedEntries.length) {
      return assert.ok(
        actualEntries.every((item, index) => item === expectedEntries[index]),
        msg
      );
    }
  }
  return assert.equals(actual, expected, msg);
};

export const noop = () => {};

export const asyncNoop = async () => {};

export const getUiConfigPath = path => {
  const paths = path.split(".");

  let currentValue = config;

  for (let i = 0; i < paths.length; i++) {
    if (i < paths.length - 1) {
      currentValue = currentValue[paths[i]] || {};
    } else {
      currentValue = currentValue[paths[i]] || undefined;
    }
  }

  return currentValue;
};
