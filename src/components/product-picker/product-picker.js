import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle
} from "recompose";

import ProductPickerView from "./product-picker.jsx";

import appState from "../../services/app-state";
import ceilingCapture from "../../services/ceiling-capture";
import { withSetLoading } from "../../services/loading";
import googleAnalytics from "../../services/google-analytics/index";
import { getUiConfigPath } from "../../utils";

import viewarApi, {
  arCamera,
  perspectiveCamera,
  modelManager,
  sceneManager
} from "viewar-api";

export const isNodeVisible = node =>
  !node.data || (!node.data.hideInModelPicker && !node.data.hidden);
export const isNodeAllowed = (node, authKey) => {
  if (node.data && node.data.auth) {
    return !!~node.data.auth.indexOf(authKey);
  }

  return true;
};

export const getChildren = node => {
  let children = node.children;
  children = children.filter(isNodeVisible);
  children = children.filter(node => isNodeAllowed(node, appState.authKey));
  return { children, name: node.name };
};

export const defaultPose = {
  position: { x: 0, y: 0, z: 0 },
  orientation: { w: 1, x: 0, y: 0, z: 0 }
};

export const findModels = (root, query) => {
  return root.reduce((acc, child) => {
    let results = [];
    if (isNodeVisible(child) && isNodeAllowed(child)) {
      if (child.children) {
        results = findModels(child.children, query);
      } else if (
        (child.name &&
          child.name.toLowerCase().includes(query.toLowerCase())) ||
        (child.foreignKey &&
          child.foreignKey.toLowerCase().includes(query.toLowerCase()))
      ) {
        results.push(child);
      }
    }
    return [...acc, ...results];
  }, []);
};

export const findModelById = ({ modelManager }) => async id => {
  const model = await modelManager.getModelFromRepository(id);
  return model;
};

export const toggleSearch = ({
  setSearchVisible,
  searchVisible,
  setQuery,
  updateContainsModels,
  stack
}) => () => {
  setSearchVisible(!searchVisible);
  setQuery("");
  updateContainsModels(stack, "");
};

export const openCategory = ({
  stack,
  setStack,
  getChildren,
  updateContainsModels,
  query
}) => child => {
  const newStack = [...stack, getChildren(child)];
  setStack(newStack);
  updateContainsModels(newStack, query);
};

export const goUp = ({
  isRootCategory,
  stack,
  setStack,
  updateContainsModels,
  query
}) => () => {
  if (!isRootCategory()) {
    const clonedStack = [...stack];
    clonedStack.pop();
    setStack(clonedStack);
    updateContainsModels(clonedStack, query);
  }
};

export const updateQuery = ({
  stack,
  updateContainsModels,
  setQuery
}) => query => {
  setQuery(query);
  updateContainsModels(stack, query);
};

export const updateContainsModels = ({
  getCategory,
  setContainsModels,
  setCategory
}) => async (stack, query) => {
  const category = await getCategory(stack, query);
  if (category) {
    setCategory(category);

    const containModels = !(
      category.children && category.children.some(child => child.children)
    );
    setContainsModels(containModels);
  }
};

export const isRootCategory = ({ stack }) => () => stack.length === 1;

export const insertModel = ({
  getInsertionPose,
  toggleProductPicker,
  modelManager,
  sceneManager,
  setLoading,
  zoomToFit,
  updateProgress,
  setCeilingModel,
  viewarApi: { cameras, trackers },
  setWallModel,
  query
}) => async model => {
  const pose = await getInsertionPose();

  if (query && query.startsWith("#") && query.length > 1) {
    await model.update();
  } else {
    await model.downloadDescription();
  }
  const placementType = model.data && model.data.placementType;

  const canUseCustomPlacement =
    cameras.arCamera.active && Object.keys(trackers).length;

  if (canUseCustomPlacement && placementType === "ceiling") {
    setCeilingModel(model);
  } else if (canUseCustomPlacement && placementType === "wall") {
    setWallModel(model);
  } else {
    toggleProductPicker();

    modelManager.on("transferProgress", updateProgress);
    setLoading(true, true);
    await sceneManager.insertModel(model, { pose });
    zoomToFit();
    modelManager.off("transferProgress", updateProgress);
    googleAnalytics.logEvent("scene", "insert", model.id);
    setLoading(false);
  }
};

export const updateProgress = ({ setLoading }) => (id, progress) => {
  setLoading(true, true, progress);
};

export const getInsertionPose = ({ viewarApi, defaultPose }) => async () => {
  let pose = defaultPose;

  if (arCamera.active) {
    pose = await arCamera.getPoseInViewingDirection(1500, true);
  } else if (viewarApi.cameras.walkCamera.active) {
    pose = await viewarApi.cameras.walkCamera.getPoseInViewingDirection(
      1500,
      true
    );
  }

  return pose;
};

export const zoomToFit = ({ viewarApi }) => async () => {
  return perspectiveCamera.active && perspectiveCamera.zoomToFit();
};

export const getCategory = ({ findModels, findModelById }) => async (
  stack,
  query
) => {
  if (query) {
    if (query.startsWith("#") && query.length > 1) {
      const model = await findModelById(query.slice(1));
      if (model) {
        return { children: [model] };
      } else {
        return false;
      }
    } else {
      return { children: findModels(stack[0].children, query) };
    }
  } else {
    return stack[stack.length - 1];
  }
};

export const toggleProductPicker = ({
  toggleProductPicker,
  setCeilingModel,
  setWallModel
}) => () => {
  setCeilingModel(null);
  setWallModel(null);
  toggleProductPicker();
};

export default compose(
  withSetLoading,
  withState("query", "setQuery", ""),
  withState("currentHeight", "setCurrentHeight", 0),
  withState("searchVisible", "setSearchVisible", false),
  withState("stack", "setStack", () => [
    getChildren(modelManager.rootCategory)
  ]),
  withState("ceilingModel", "setCeilingModel", null),
  withState("wallModel", "setWallModel", null),
  withState("containsModels", "setContainsModels", null),
  withState("category", "setCategory", { children: [] }),
  withProps({
    viewarApi,
    sceneManager,
    modelManager,
    defaultPose,
    appState,
    ceilingCapture,
    getUiConfigPath
  }),
  withProps(({ getUiConfigPath }) => ({
    showCategoryImages: getUiConfigPath("showCategoryImages"),
    findModels,
    getChildren
  })),
  withHandlers({
    findModelById
  }),
  withHandlers({
    getCategory
  }),
  withHandlers({
    updateContainsModels
  }),
  withHandlers({
    updateQuery,
    isRootCategory,
    getInsertionPose,
    zoomToFit,
    updateProgress,
    toggleSearch
  }),
  withHandlers({
    openCategory,
    goUp,
    insertModel,
    toggleProductPicker
  }),
  lifecycle({
    componentWillMount() {
      this.props.updateContainsModels(this.props.stack);
    }
  })
)(ProductPickerView);
