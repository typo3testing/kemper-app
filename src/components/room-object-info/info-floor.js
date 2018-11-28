import {
  compose,
  withProps,
  withState,
  withHandlers,
  withPropsOnChange,
  lifecycle
} from "recompose";

import viewarApi from "viewar-api";

import InfoFloor from "./info-floor.jsx";

export const setInitialValues = ({
  object,
  setSelectedOption,
  material
}) => () => {
  setSelectedOption(object.material || material.options[0].id);
};

export const applyChanges = ({ selectedOption, updateObject }) => () =>
  updateObject({ material: selectedOption });

export const revertChanges = ({ setInitialValues }) => setInitialValues;

export default compose(
  withProps(({ materials }) => ({
    viewarApi,
    material: materials.find(material => material.id === "Floor")
  })),
  withState("selectedOption", "setSelectedOption", null),
  withHandlers({
    setInitialValues
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
        this.props.attachApply("floor", this.props.applyChanges);
    },
    componentWillUnmount() {
      this.props.detachApply && this.props.detachApply("floor");
    }
  })
)(InfoFloor);
