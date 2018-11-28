import test from "tape";
import "ignore-styles";

import { init, goTo } from "./home.js";

test("Home - init() calls clearScene", async assert => {
  assert.plan(1);

  const sceneManager = {
    clearScene: async () => assert.pass()
  };

  const getRoomCapture = async () => ({
    resetRoomState: () => {}
  });

  const getRoomPlanner = () => ({
    clear: () => {}
  });

  const viewarApi = {
    roomManager: {
      removeRoomFromScene: async () => {}
    }
  };

  await init({ sceneManager, getRoomCapture, getRoomPlanner, viewarApi })();

  assert.end();
});

test("Home - init() resets the room capturing's state", async assert => {
  assert.plan(1);

  const sceneManager = {
    clearScene: async () => {}
  };

  const getRoomCapture = async () => ({
    resetRoomState: assert.pass
  });

  const getRoomPlanner = () => ({
    clear: () => {}
  });

  const viewarApi = {
    roomManager: {
      removeRoomFromScene: async () => {}
    }
  };

  await init({ sceneManager, getRoomCapture, getRoomPlanner, viewarApi })();

  assert.end();
});

test("Home - init() clears the inserted room", async assert => {
  assert.plan(1);

  const sceneManager = {
    clearScene: async () => {}
  };

  const getRoomCapture = async () => ({
    resetRoomState: () => {}
  });

  const getRoomPlanner = () => ({
    clear: () => {}
  });

  const viewarApi = {
    roomManager: {
      removeRoomFromScene: async () => assert.pass()
    }
  };

  await init({ sceneManager, getRoomCapture, getRoomPlanner, viewarApi })();

  assert.end();
});

test("Home - init() resets the room planner's state", async assert => {
  assert.plan(1);

  const sceneManager = {
    clearScene: async () => {}
  };

  const getRoomCapture = async () => ({
    resetRoomState: () => {}
  });

  const getRoomPlanner = () => ({
    clear: assert.pass
  });

  const viewarApi = {
    roomManager: {
      removeRoomFromScene: async () => {}
    }
  };

  await init({ sceneManager, getRoomCapture, getRoomPlanner, viewarApi })();

  assert.end();
});

test("Home - init() reads the persisted app state", async assert => {
  assert.plan(1);

  const sceneManager = {
    clearScene: async () => {}
  };

  const getRoomCapture = async () => ({
    resetRoomState: () => {}
  });

  const getRoomPlanner = () => ({
    clear: () => {}
  });

  const viewarApi = {
    roomManager: {
      removeRoomFromScene: async () => {}
    }
  };

  const readPersistedAppState = async () => assert.pass();

  await init({
    sceneManager,
    getRoomCapture,
    getRoomPlanner,
    viewarApi,
    readPersistedAppState
  })();

  assert.end();
});

test("Home - goTo() pushes to a specific route", assert => {
  assert.plan(1);

  const mockRoute = "/test";

  const history = {
    push: route => assert.equals(route, mockRoute)
  };

  goTo({ history })(mockRoute);

  assert.end();
});
