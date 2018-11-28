import test from "tape";
import "ignore-styles";

import {
  goBack,
  toggleProductPicker,
  toggleMenu,
  hideInfoOverlay,
  showInfoOverlay
} from "./main.js";

test("Main - showInfoOverlay() sets infoOverlayVisible state to true", assert => {
  assert.plan(1);

  let infoOverlayVisible = false;

  const setInfoOverlayVisible = value => (infoOverlayVisible = value);
  const hideInfoOverlay = () => {};
  const setTimeout = () => {};

  showInfoOverlay({ setInfoOverlayVisible, hideInfoOverlay, setTimeout })();

  assert.equal(infoOverlayVisible, true);

  assert.end();
});

test("Main - showInfoOverlay() sets infoOverlayVisible to false if an integer is passed as parameter", assert => {
  assert.plan(1);

  let infoOverlayVisible = false;

  const setInfoOverlayVisible = value => (infoOverlayVisible = value);
  const hideInfoOverlay = () => (infoOverlayVisible = false);
  const setTimeout = (next, ms) => next();

  showInfoOverlay({ setInfoOverlayVisible, hideInfoOverlay, setTimeout })(5000);

  assert.equal(infoOverlayVisible, false);

  assert.end();
});

test("Main - showInfoOverlay() sets infoOverlayVisible not to false if an non-integer is passed as parameter", assert => {
  assert.plan(1);

  let infoOverlayVisible = false;

  const setInfoOverlayVisible = value => (infoOverlayVisible = value);
  const hideInfoOverlay = () => (infoOverlayVisible = false);
  const setTimeout = (next, ms) => next();

  showInfoOverlay({ setInfoOverlayVisible, hideInfoOverlay, setTimeout })({});

  assert.equal(infoOverlayVisible, true);

  assert.end();
});

test("Main - hideInfoOverlay() sets infoOverlayVisible to false", assert => {
  assert.plan(1);

  let infoOverlayVisible = true;

  const setInfoOverlayVisible = value => (infoOverlayVisible = value);

  hideInfoOverlay({ setInfoOverlayVisible })();

  assert.equal(infoOverlayVisible, false);

  assert.end();
});

test("Main - toggleMenu() sets menuVisible to false if the value was true before", assert => {
  assert.plan(1);

  let menuVisible = true;

  const setMenuVisible = value => (menuVisible = value);

  toggleMenu({ setMenuVisible, menuVisible })();

  assert.equal(menuVisible, false);

  assert.end();
});

test("Main - toggleMenu() sets menuVisible to true if the value was false before", assert => {
  assert.plan(1);

  let menuVisible = false;

  const setMenuVisible = value => (menuVisible = value);

  toggleMenu({ setMenuVisible, menuVisible })();

  assert.equal(menuVisible, true);

  assert.end();
});

test("Main - toggleProductPicker() sets productPickerVisible to false if the value was true before", assert => {
  assert.plan(1);

  let productPickerVisible = true;

  const setProductPickerVisible = value => (productPickerVisible = value);

  toggleProductPicker({ setProductPickerVisible, productPickerVisible })();

  assert.equal(productPickerVisible, false);

  assert.end();
});

test("Main - toggleProductPicker() sets productPickerVisible to true if the value was false before", assert => {
  assert.plan(1);

  let productPickerVisible = false;

  const setProductPickerVisible = value => (productPickerVisible = value);

  toggleProductPicker({ setProductPickerVisible, productPickerVisible })();

  assert.equal(productPickerVisible, true);

  assert.end();
});
