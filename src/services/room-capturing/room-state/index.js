import { getCurrentRoomState } from "./room-state-export";

export const DEFAULT_ROOMSTATE = Object.freeze({
  edges: [],
  objects: {
    door: [],
    window: []
  },
  roomHeight: 0,
  hasRoomState: false
});

export const getRoomState = getCurrentRoomState;
