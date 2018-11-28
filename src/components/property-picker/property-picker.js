import {
  compose,
  withProps,
  withHandlers,
  branch,
  renderNothing
} from "recompose";

import PropertyPicker from "./property-picker.jsx";

export const selectPrevious = ({
  properties,
  activeProperty,
  setActiveProperty
}) => () => {
  const oldIndex = properties.indexOf(activeProperty);
  const newIndex = (properties.length + (oldIndex - 1)) % properties.length;
  setActiveProperty(properties[newIndex]);
};

export const selectNext = ({
  properties,
  activeProperty,
  setActiveProperty
}) => () => {
  const oldIndex = properties.indexOf(activeProperty);
  const newIndex = (properties.length + (oldIndex + 1)) % properties.length;
  setActiveProperty(properties[newIndex]);
};

export default compose(
  withProps(({ properties }) => ({
    showButtons: properties.length > 1
  })),
  withHandlers({
    selectPrevious,
    selectNext
  }),
  branch(({ properties }) => !properties.length, renderNothing)
)(PropertyPicker);
