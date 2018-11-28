import viewarApi from "viewar-api";
import { getRayFromPose, getPlaneIntersections } from "../math/math";

export const stateDoor = ({ nextState, roomState, emit, visuals }) => {
  let currentObject = null;

  const start = async () => {
    currentObject = null;
  };

  const stop = async () => {
    if (currentObject) {
      await undo();
    }
  };

  const capture = async () => {
    const pose = await viewarApi.cameras.arCamera.updatePose();
    const ray = getRayFromPose(pose);
    const intersections = getPlaneIntersections(ray, roomState.edges);

    if (intersections.length) {
      if (!currentObject) {
        // Captured first point of wall object.
        const { position, orientation } = intersections[0];
        position.y = 0;

        await visuals.setCurrentWallObjectPose({ position, orientation });

        currentObject = intersections[0];

        emit("event", "CapturedDoorFirstPoint");
      } else {
        // Captured second point of wall object.
        let intersection;
        const currentWallIntersections = intersections.filter(
          intersection =>
            intersection.start === currentObject.start &&
            intersection.end === currentObject.end
        );

        if (currentWallIntersections.length) {
          intersection = currentWallIntersections[0];

          let bottomLeft;
          let topRight;
          if (currentObject.position.y < intersection.position.y) {
            bottomLeft = currentObject.position;
            topRight = intersection.position;
          } else {
            topRight = currentObject.position;
            bottomLeft = intersection.position;
          }

          await visuals.insertWallObject(bottomLeft, topRight);
          await visuals.hide("currentwallobject");

          roomState.objects["door"].push({
            start: currentObject.start,
            end: currentObject.end,
            bottomLeft,
            topRight,
            type: "door"
          });
          currentObject = null;

          emit("event", "CapturedDoor");
        } else {
          console.log("Top right point not on same wall as bottom left point.");
        }
      }
    } else {
      emit("event", "CaptureNoWallIntersection");
      console.log("No intersection with any wall.");
    }
  };

  const undo = async () => {
    if (!currentObject) {
      if (roomState.objects["door"].length) {
        roomState.objects["door"].splice(roomState.objects.length - 1, 1);
        await visuals.removeLastWallObject();
        emit("event", "UndidDoor");
        return true;
      }
    } else {
      await visuals.hide("currentwallobject");
      currentObject = null;
      emit("event", "UndidDoorFirstPoint");
      return true;
    }

    return false;
  };

  return {
    start,
    stop,
    capture,
    undo,

    get nextState() {
      return nextState;
    },
    get canUndo() {
      return currentObject || roomState.objects["door"].length;
    },
    get canFinish() {
      return !currentObject;
    },
    get canCapture() {
      return true;
    }
  };
};

export default stateDoor;
