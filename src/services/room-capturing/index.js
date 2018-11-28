import viewarApi from "viewar-api";
import {
  stateString,
  STATE_STOPPED,
  STATE_EDGE,
  STATE_WINDOW,
  STATE_DOOR,
  STATE_ROOMHEIGHT,
  STATE_FINISHED,
  OBJECT_MODELS,
  WALL_HEIGHT
} from "./constants";
import { DEFAULT_ROOMSTATE, getRoomState } from "./room-state";
import { assign } from "./utils";

import createStateStopped from "./states/state-stopped";
import createStateEdge from "./states/state-edge";
import createStateRoomheight from "./states/state-roomheight";
import createStateDoor from "./states/state-door";
import createStateWindow from "./states/state-window";
import createStateFinished from "./states/state-finished";

import createVisualManager from "./visual-manager";
import makeEmitter from "./emitter";

export const createStateMachine = () => {
  const stateMachine = makeEmitter({});

  let currentState = STATE_STOPPED;
  let objectModels = null;
  let roomState = {};
  let wallsVisible = true;
  const visuals = createVisualManager();

  const states = {};
  states[STATE_STOPPED] = createStateStopped({
    nextState: STATE_EDGE,
    roomState,
    emit: stateMachine.emit,
    visuals
  });
  states[STATE_EDGE] = createStateEdge({
    nextState: STATE_ROOMHEIGHT,
    roomState,
    emit: stateMachine.emit,
    visuals
  });
  states[STATE_ROOMHEIGHT] = createStateRoomheight({
    nextState: STATE_DOOR,
    roomState,
    emit: stateMachine.emit,
    visuals
  });
  states[STATE_DOOR] = createStateDoor({
    nextState: STATE_WINDOW,
    roomState,
    emit: stateMachine.emit,
    visuals
  });
  states[STATE_WINDOW] = createStateWindow({
    nextState: STATE_FINISHED,
    roomState,
    emit: stateMachine.emit,
    visuals
  });
  states[STATE_FINISHED] = createStateFinished({
    nextState: STATE_STOPPED,
    roomState,
    emit: stateMachine.emit,
    visuals
  });

  const start = async progressListener => {
    if (currentState === STATE_STOPPED) {
      checkTracking();
      resetInternalState();
      await initObjectModels();
      await visuals.initModels(progressListener);
      await setState(STATE_EDGE);
    } else {
      console.info("Room capturing already running.");
    }
  };

  const stop = async () => {
    if (currentState !== STATE_STOPPED) {
      await setState(STATE_STOPPED);
    }
  };

  const nextState = async () => {
    await setState(states[currentState].nextState);
  };

  const capture = async () => {
    await states[currentState].capture();
    updateStatus();
  };

  const undo = async () => {
    const success = await states[currentState].undo();

    updateStatus();
    return success;
  };

  const setState = async state => {
    await states[currentState].stop();
    await states[state].start();
    currentState = state;

    stateMachine.emit("event", `Type${stateString[currentState]}`);
    updateStatus();
  };

  function updateStatus() {
    stateMachine.emit("canUndo", states[currentState].canUndo);
    stateMachine.emit("canFinish", states[currentState].canFinish);
    stateMachine.emit("canCapture", states[currentState].canCapture);
  }

  function getInternalState() {
    return {
      edges: roomState.edges,
      objects: roomState.objects,
      roomHeight: roomState.roomHeight
        ? roomState.roomHeight / 10
        : WALL_HEIGHT,
      objectModels
    };
  }

  /**
   * Checks if tracking provider is activated, the ground is confirmed and the augmented reality camera is active.
   */
  function checkTracking() {
    const {
      trackers,
      cameras: { arCamera }
    } = viewarApi;
    let tracker;

    if (trackers && Object.keys(trackers).length) {
      tracker = Object.values(trackers)[0];
    }

    if (!tracker) {
      throw new Error(
        "Can't start room capturing: No tracking provider available."
      );
    }

    if (!tracker.active) {
      throw new Error(
        "Can't start room capturing: Tracking provider not activated."
      );
    }

    if (!tracker.groundConfirmed) {
      throw new Error(
        "Can't start room capturing: Tracking provider hasn't confirmed ground yet."
      );
    }

    if (!arCamera.active) {
      throw new Error(
        "Can't start room capturing: Augmented reality camera not active."
      );
    }
  }

  async function initObjectModels() {
    const { modelManager } = viewarApi;
    if (!objectModels) {
      objectModels = {};
      for (let [type, id] of Object.entries(OBJECT_MODELS)) {
        const model = await modelManager.getModelFromRepository(id);
        const width = model.data.dimensions.z;
        objectModels[type] = {
          id,
          width
        };
      }
    }
  }

  function resetInternalState() {
    Object.assign(roomState, JSON.parse(JSON.stringify(DEFAULT_ROOMSTATE)));
  }

  function resetRoomState() {
    if (currentState === STATE_STOPPED) {
      resetInternalState();
    } else {
      console.log("Can't reset room state while capturing.");
    }
  }

  function finish() {
    roomState.hasRoomState = true;
  }

  assign(stateMachine, {
    start,
    stop,
    finish,
    nextState,
    capture,
    undo,
    resetRoomState,

    get canUndo() {
      return states[currentState].canUndo;
    },
    get canFinish() {
      return states[currentState].canFinish;
    },
    get canCapture() {
      return states[currentState].canCapture;
    },
    get internalState() {
      return getInternalState();
    },
    get roomState() {
      return (
        roomState.hasRoomState && getRoomState(getInternalState(), wallsVisible)
      );
    },
    get wallsVisible() {
      return wallsVisible;
    },
    set wallsVisible(newWallsVisible) {
      wallsVisible = newWallsVisible;
    }
  });

  return stateMachine;
};

const roomCapturinge = createStateMachine();
export default roomCapturinge;
