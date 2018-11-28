import isEqual from "lodash/isEqual";
import throttle from "lodash/throttle";
import { length as vec3length, sub as vec3sub } from "../math/vector3";
import {
  CURRENT_EDGE_UPDATE_INTERVAL,
  FIRST_EDGE_NEAR_DISTANCE
} from "../constants";

export const stateEdge = ({ nextState, roomState, emit, visuals }) => {
  let edgeUpdate = 0;
  let currentLength = 0;
  let wasNearFirstEdge = false;
  let isClosed = false;
  let updateMutex = Promise.resolve();

  const start = async () => {
    isClosed = false;
    edgeUpdate = 0;
    currentLength = 0;
  };

  const stop = async () => {
    const points = roomState.edges.map(edge => ({
      x: edge.x,
      y: edge.z
    }));

    sessionStorage.setItem("initialPoints", JSON.stringify(points));
    if (isRoomCounterClockwise(points)) {
      await swapEdges();
    }

    if (
      roomState.edges.length > 2 &&
      !isEqual(roomState.edges[roomState.edges.length - 1], roomState.edges[0])
    ) {
      await visuals.insertWall(
        roomState.edges[roomState.edges.length - 1],
        roomState.edges[0]
      );
    }

    stopEdgeUpdate();
    await visuals.hide("target");
    await visuals.hide("closingwalltarget");
  };

  const captureFn = () =>
    (updateMutex = updateMutex.then(() => capture(), () => capture()));
  const capture = async () => {
    stopEdgeUpdate();
    const { position, isNear } = await getTargetPosition();

    await visuals.setCurrentWallPosition(position);

    if (isNear) {
      isClosed = true;
      await visuals.hide("currentwall");
      await visuals.hide("target");
      await visuals.hide("closingwalltarget");
      emit("roomClosed");
    } else {
      if (roomState.edges.length) {
        await visuals.insertWall(
          roomState.edges[roomState.edges.length - 1],
          position
        );
        emit("event", "CapturedEdge");
      } else {
        emit("event", "CapturedFirstEdge");
      }

      roomState.edges.push(position);
      startEdgeUpdate();
    }
  };

  const undo = async () => {
    if (roomState.edges.length) {
      await visuals.show("target");

      if (isClosed) {
        isClosed = false;
        await visuals.hideClosingWall();
        await visuals.setCurrentWallPosition(
          roomState.edges[roomState.edges.length - 1]
        );

        emit("event", "UndidEdge");
      } else {
        if (roomState.edges.length > 1) {
          await visuals.removeLastWall();
        }

        roomState.edges.splice(roomState.edges.length - 1, 1);
        if (roomState.edges.length) {
          await visuals.setCurrentWallPosition(
            roomState.edges[roomState.edges.length - 1]
          );
          emit("event", "UndidEdge");
        } else {
          stopEdgeUpdate();
          await visuals.hide("currentwall");
          emit("event", "UndidFirstEdge");
        }
      }

      currentLength = 0;
      return true;
    }
    return false;
  };

  // Edge update
  //--------------------------------------------------------------------------------------------------------------------

  function startEdgeUpdate() {
    if (!edgeUpdate) {
      updateMutex = Promise.resolve();
      wasNearFirstEdge = false;
      edgeUpdate = setInterval(updateEdge, CURRENT_EDGE_UPDATE_INTERVAL);
    }
  }

  function stopEdgeUpdate() {
    clearInterval(edgeUpdate);
    edgeUpdate = 0;
    currentLength = 0;
  }

  const getTargetPosition = async () => {
    let position = await visuals.getTargetPosition();
    const isNear = roomState.edges.length > 2 && isNearFirstEdge(position);

    if (isNear) {
      position = roomState.edges[roomState.edges.length - 1];
    }

    return {
      position,
      isNear
    };
  };

  async function updateEdge() {
    if (!!edgeUpdate) {
      const { position, isNear } = await getTargetPosition();
      let length = 0;
      if (roomState.edges.length) {
        await updateClosingEdgeFn(isNear);
        length = vec3length(
          vec3sub(position, roomState.edges[roomState.edges.length - 1])
        );
      }

      if (!!edgeUpdate) {
        emit("length", length);
        currentLength = length;
      }
    }
  }

  function isNearFirstEdge(position) {
    const distance = vec3length(vec3sub(position, roomState.edges[0]));
    return distance <= FIRST_EDGE_NEAR_DISTANCE;
  }

  const updateClosingEdgeFn = isNear =>
    (updateMutex = updateMutex.then(
      () => updateClosingEdge(isNear),
      () => updateClosingEdge(isNear)
    ));
  const updateClosingEdge = throttle(async isNear => {
    if (isNear !== wasNearFirstEdge) {
      if (isNear) {
        await visuals.hide("target");
        await visuals.hide("currentwall");
        await visuals.showClosingWall(
          roomState.edges[roomState.edges.length - 1],
          roomState.edges[0]
        );
      } else {
        await visuals.hideClosingWall();
        await visuals.show("target");
        await visuals.show("currentwall");
      }
      wasNearFirstEdge = isNear;
    }
  }, 1000);

  const swapEdges = async () => {
    roomState.edges.reverse();
    await visuals.removeAll("wall");
    for (let i = 0; i < roomState.edges.length; i++) {
      const p1 = roomState.edges[i];
      const p2 = roomState.edges[(i + 1) % roomState.edges.length];
      await visuals.insertWall(p1, p2);
    }
  };

  const isRoomCounterClockwise = points => {
    let signedArea = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];

      signedArea += p1.x * p2.y - p2.x * p1.y;
    }

    return signedArea < 0;
  };

  //--------------------------------------------------------------------------------------------------------------------

  return {
    start,
    stop,
    capture: captureFn,
    undo,

    get nextState() {
      return nextState;
    },
    get canUndo() {
      return roomState.edges.length;
    },
    get canFinish() {
      return roomState.edges.length >= 3;
    },
    get canCapture() {
      return !isClosed;
    }
  };
};

export default stateEdge;
