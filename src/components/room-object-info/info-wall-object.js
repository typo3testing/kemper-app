import {
  compose,
  withProps,
  withState,
  withHandlers,
  withPropsOnChange,
  lifecycle
} from "recompose";

import viewarApi from "viewar-api";

import InfoWallObject from "./info-wall-object.jsx";

export const setInitialValues = ({
  object,
  setSelectedModel,
  setLength,
  setHeight,
  setVerticalOffset,
  setRotated,
  setMirrored
}) => () => {
  setSelectedModel(object.model);
  setLength(Math.round(object.length));
  setHeight(Math.round(object.height));
  setVerticalOffset(Math.round(object.verticalOffset));
  setRotated(Math.round(object.rotated));
  setMirrored(Math.round(object.mirrored));
};

export const prepareModelImages = ({
  setObjectImages,
  objects,
  viewarApi
}) => () =>
  setObjectImages(
    objects.map(
      ({ model }) => viewarApi.modelManager.findModelById(model.id).imageUrl
    )
  );

export const selectModel = ({ object, setSelectedModel }) => model => {
  setSelectedModel(model);
};

export const applyChanges = ({
  object,
  updateObject,
  length,
  height,
  verticalOffset,
  selectedModel,
  mirrored,
  rotated
}) => () => {
  Object.assign(object, {
    rotated,
    mirrored,
    model: selectedModel
  });

  updateObject({
    length: Math.round(length),
    height: Math.round(height),
    verticalOffset: Math.round(verticalOffset)
  });
};

export const revertChanges = ({ setInitialValues }) => setInitialValues;

export const isSelected = ({ selectedModel }) => model =>
  selectedModel && selectedModel.id === model.id;

export const toggleRotated = ({ rotated, setRotated }) => () =>
  setRotated(!rotated);

export const toggleMirrored = ({ mirrored, setMirrored }) => () =>
  setMirrored(!mirrored);

export default compose(
  withProps({
    viewarApi
  }),
  withState("selectedModel", "setSelectedModel", null),
  withState("length", "setLength", 0),
  withState("height", "setHeight", 0),
  withState("verticalOffset", "setVerticalOffset", 0),
  withState("rotated", "setRotated", false),
  withState("mirrored", "setMirrored", false),
  withState("objectImages", "setObjectImages", []),
  withHandlers({
    setInitialValues,
    isSelected,
    toggleRotated,
    toggleMirrored
  }),
  withHandlers({
    prepareModelImages,
    selectModel,
    applyChanges,
    revertChanges
  }),
  withPropsOnChange(
    ["object"],
    ({ object, setInitialValues }) => object && setInitialValues()
  ),
  withPropsOnChange(
    ["objects"],
    ({ objects, prepareModelImages }) => objects && prepareModelImages()
  ),
  lifecycle({
    componentDidMount() {
      this.props.attachApply &&
        this.props.attachApply("object", this.props.applyChanges);
    },
    componentWillUnmount() {
      this.props.detachApply && this.props.detachApply("object");
    }
  })
)(InfoWallObject);
