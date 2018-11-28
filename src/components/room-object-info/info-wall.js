import {
  compose,
  withProps,
  withState,
  withHandlers,
  withPropsOnChange,
  lifecycle
} from "recompose";

import viewarApi from "viewar-api";

import InfoWall from "./info-wall.jsx";

export const setInitialValues = ({
  object,
  setSelectedOption,
  setLength,
  setHidden,
  material
}) => () => {
  setSelectedOption(
    (object.materials && object.materials.left) || material.options[0].id
  );
  setLength(Math.round(object.length));
  setHidden(Math.round(object.hidden));
};

export const applyChanges = ({
  object,
  selectedOption,
  hidden,
  length,
  updateObject
}) => () => {
  Object.assign(object, {
    hidden
  });

  updateObject({
    materials: {
      left: selectedOption,
      right: selectedOption
    },
    length: Math.round(length)
  });
};

export const revertChanges = ({ setInitialValues }) => setInitialValues;

export const toggleHidden = ({ hidden, setHidden }) => () => setHidden(!hidden);

export default compose(
  withProps(({ materials }) => ({
    viewarApi,
    material: materials.find(material => material.id === "Walls")
  })),
  withState("selectedOption", "setSelectedOption", null),
  withState("length", "setLength", 0),
  withState("hidden", "setHidden", false),
  withHandlers({
    setInitialValues,
    toggleHidden
  }),
  withHandlers({
    applyChanges,
    revertChanges
  }),
  withPropsOnChange(
    ["object"],
    ({ object, setInitialValues }) => object && setInitialValues()
  ),
  lifecycle({
    componentDidMount() {
      this.props.attachApply &&
        this.props.attachApply("wall", this.props.applyChanges);
    },
    componentWillUnmount() {
      this.props.detachApply && this.props.detachApply("wall");
    }
  })
)(InfoWall);
