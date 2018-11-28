import {
  compose,
  withProps,
  lifecycle,
  withHandlers,
  toClass,
  withState
} from "recompose";
import { withRouter } from "react-router";
import isEqual from "lodash/isEqual";

import { roomPlanner } from "../../services";
import roomCapture from "../../services/room-capturing";
import viewarApi from "viewar-api";
import RoomPlanner from "./room-planner.jsx";
import { getUiConfigPath } from "../../utils";
import { withSetLoading } from "../../services/loading";
import { withDialogControls } from "../../services/dialog";

export const goBack = ({
  showDialog,
  roomPlanner,
  initialRoomState,
  history
}) => async () => {
  const currentRoomState = roomPlanner.exportState();
  if (!isEqual(initialRoomState, currentRoomState)) {
    const result = await showDialog("RoomPlannerExitConfirmation", {
      showCancel: true,
      confirmText: "DialogYes",
      cancelText: "DialogNo"
    });

    if (result.confirmed) {
      roomPlanner.importState(initialRoomState);
      history.goBack();
    }
  } else {
    history.goBack();
  }
};

export const init = ({
  getRefs,
  attachRoomPlanner,
  roomPlanner,
  setColorOptions,
  setMaterials,
  viewarApi,
  setLoading,
  updateState,
  createObjects,
  getRoomCapture,
  loadRoomState,
  setRoomPickerVisible
}) => async () => {
  const { editor, canvas } = getRefs();

  setLoading(true);

  attachRoomPlanner(editor, canvas);
  await loadRoomState();

  const colorOptions = {};
  const materials = viewarApi.roomManager.roomMaterialDescription;
  materials.forEach(
    material => (colorOptions[material.name] = material.options[0].id)
  );

  setColorOptions(colorOptions);
  setMaterials(materials);

  const success = await createObjects();

  if (success) {
    updateState();

    if (!Object.keys(roomPlanner.exportState().scene.controlPoints).length) {
      setRoomPickerVisible(true);
    }
  }
  setLoading(false);
};

export const loadRoomState = ({
  roomPlanner,
  roomCapture,
  setInitialRoomState
}) => async () => {
  if (roomCapture.roomState) {
    roomPlanner.insertRoom(roomCapture.roomState);
    roomCapture.resetRoomState();
  }

  setInitialRoomState(roomPlanner.exportState());

  roomPlanner.updateSettings({ snapToGrid: true });
  roomPlanner.clearSelection();
};

export const createObjects = ({
  setLoading,
  history,
  showDialog,
  setObjects,
  viewarApi,
  processWallObjectModels,
  preloadImages,
  createObjectType
}) => async () => {
  const { roomManager, modelManager } = viewarApi;

  const total = roomManager.wallObjectModels.length;
  let current = 0;
  const updateProgress = (id, progress) => {
    const totalProgress =
      (current / total + (1 / total) * (progress / 100)) * 100;
    setLoading(true, true, totalProgress);
  };

  try {
    await roomManager.initResources();
    modelManager.on("transferProgress", updateProgress);
    for (let model of roomManager.wallObjectModels) {
      setLoading(true, true, (current / total) * 100);
      await model.download();
      current++;
    }
    setLoading(true, true, 100);
    modelManager.off("transferProgress", updateProgress);
  } catch (e) {
    modelManager.off("transferProgress", updateProgress);
    console.error(e.message);
    await showDialog("RoomPlannerDownloadFailed", {
      confirmText: "DialogOK"
    });
    history.push("/");
    return false;
  }
  const models = processWallObjectModels(roomManager.wallObjectModels);
  await preloadImages(models);

  const objects = {};
  objects["window"] = createObjectType(models, "window");
  objects["door"] = createObjectType(models, "door");

  setObjects(objects);

  return true;
};

export const preloadImages = async objects => {
  const imageDownloads = [];
  for (let object of objects) {
    imageDownloads.push(
      new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = object.model.imageUrl;
      })
    );
  }

  await Promise.race(imageDownloads);
};

export const processWallObjectModels = models =>
  models.map(model => ({
    model: {
      id: model.id,
      materials: model.materialDescription,
      imageUrl: model.imageUrl
    },
    type: model.data.semanticCategory,
    length: model.data.dimensions.x,
    height: model.data.dimensions.y,
    width: model.data.dimensions.z,
    verticalOffset: 80,
    rotated: true,
    mirrored: false
  }));

export const createObjectType = (models, type) => [
  ...models.filter(model => model.type === type)
];

export const attachRoomPlanner = ({ roomPlanner, updateState }) => async (
  editor,
  canvas
) => {
  roomPlanner.attach(window.document, editor, canvas, "touchable");

  window.addEventListener("resize", roomPlanner.resizeViewport);
  canvas.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  roomPlanner.on("selectionChanged", updateState);

  roomPlanner.resizeViewport();
};

export const detachRoomPlanner = ({ roomPlanner, updateState }) => canvas => {
  roomPlanner.detach();
  roomPlanner.off("selectionChanged", updateState);
  window.removeEventListener("resize", roomPlanner.resizeViewport);
};

export const createRefCalls = () => {
  const refs = {};
  return {
    getRefs: () => () => refs,
    addRef: () => name => ref => {
      refs[name] = ref;
    }
  };
};

export const createRoom = ({
  viewarApi,
  roomPlanner,
  colorOptions,
  history,
  setLoading
}) => async () => {
  setLoading(true);

  const exportState = roomPlanner.exportStateToCore(colorOptions);
  await viewarApi.roomManager.addRoomToScene(exportState);

  setLoading(false);

  history.push("/view-selection");
};

export const undo = ({ roomPlanner, updateState }) => () => {
  roomPlanner.undo();
  updateState();
};

export const touchEnd = ({ roomPlanner }) => () => {
  if (roomPlanner.selection && !roomPlanner.selection.wall) {
    roomPlanner.clearSelection();
  }
};

export const insert = ({
  roomPlanner,
  devicePixelRatio,
  getTouchPoint,
  objects
}) => (event, type) => {
  const { x, y } = getTouchPoint(event);

  if (x && y) {
    if (objects[type] && objects[type].length) {
      roomPlanner.insertWallObject(objects[type][0], {
        x: x * devicePixelRatio,
        y: y * devicePixelRatio
      });
    } else {
      console.error(`No objects of type '${type}' available.`);
    }
  }
};

export const getTouchPoint = event => {
  let x, y;
  switch (event.type) {
    case "mousedown": {
      x = event.pageX;
      y = event.pageY;
      break;
    }
    case "touchstart": {
      const touch = event.changedTouches[0];
      if (event) {
        x = touch.pageX;
        y = touch.pageY;
      }
      break;
    }
  }

  return { x, y };
};

export const updateState = ({
  roomPlanner,
  setCanUndo,
  setSelection,
  selection,
  setObjectInfoHidden,
  getName,
  getType
}) => () => {
  if (!selection || selection !== roomPlanner.selection) {
    setSelection(roomPlanner.selection);
    setObjectInfoHidden(false);
  }
  setTimeout(() => setCanUndo(roomPlanner.canUndo), 10);
};

export const toggleObjectInfo = ({
  objectInfoHidden,
  setObjectInfoHidden
}) => () => setObjectInfoHidden(!objectInfoHidden);

export const updateSelection = ({
  roomPlanner,
  setObjectInfoHidden
}) => values => {
  roomPlanner.updateSelection(values);
  roomPlanner.redraw();
  setObjectInfoHidden(true);
};

export const deleteSelection = ({ roomPlanner, setObjectInfoHidden }) => () => {
  roomPlanner.deleteSelection();
  setObjectInfoHidden(true);
};

export const toggleRoomPicker = ({
  roomPickerVisible,
  setRoomPickerVisible
}) => () => {
  setRoomPickerVisible(!roomPickerVisible);
};

export const insertRoom = ({
  setRoomPickerVisible,
  getUiConfigPath
}) => room => {
  setRoomPickerVisible(false);

  if (getUiConfigPath("hideRoomWalls")) {
    for (let wallId in room.state.walls) {
      room.state.walls[wallId].hidden = true;
    }
  }
  roomPlanner.insertRoom(room);
};

export const handleManualDraw = ({ setRoomPickerVisible }) => () => {
  setRoomPickerVisible(false);
  //TODO show some instructions
};

export default compose(
  toClass,
  withRouter,
  withSetLoading,
  withDialogControls,
  withState("roomPickerVisible", "setRoomPickerVisible", false),
  withState("initialRoomState", "setInitialRoomState", null),
  withState("colorOptions", "setColorOptions", {}),
  withState("materials", "setMaterials", {}),
  withState("canUndo", "setCanUndo", false),
  withState("selection", "setSelection", null),
  withState("objectInfoHidden", "setObjectInfoHidden", false),
  withState("objects", "setObjects", {}),
  withProps({
    devicePixelRatio: window.devicePixelRatio,
    roomPlanner,
    roomCapture,
    viewarApi,
    preloadImages,
    processWallObjectModels,
    createObjectType,
    getTouchPoint,
    getUiConfigPath
  }),
  withProps(({ selection, objectInfoHidden, getName }) => ({
    objectInfoVisible:
      selection &&
      !objectInfoHidden &&
      (selection.isRoom ||
        selection.isWall ||
        (selection.type && selection.wall))
  })),
  withHandlers(createRefCalls()),
  withHandlers({
    updateState,
    toggleObjectInfo
  }),
  withHandlers({
    handleManualDraw,
    insertRoom,
    toggleRoomPicker,
    attachRoomPlanner,
    detachRoomPlanner,
    loadRoomState,
    createRoom,
    createObjects,
    updateSelection,
    deleteSelection
  }),
  withHandlers({
    touchEnd,
    insert,
    undo,
    init,
    goBack
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.init();
    },
    componentWillUnmount() {
      this.props.detachRoomPlanner(this.props.getRefs().canvas);
    }
  })
)(RoomPlanner);
