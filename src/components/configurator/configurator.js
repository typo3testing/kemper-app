import {
  compose,
  withState,
  withProps,
  withHandlers,
  withPropsOnChange
} from "recompose";
import flatMap from "lodash/flatMap";

import { getUiConfigPath } from "../../utils";
import Configurator from "./configurator.jsx";

export const compileDisplayTemplate = ({ displayTemplate, properties }) =>
  flatMap(
    displayTemplate.map(({ properties: items }) =>
      items.map(({ name, label, widget }) => properties[name])
    )
  ).filter(property => property.options.length > 1);

export const setValues = ({ instance, setPropertyValues }) => async values => {
  await instance.setPropertyValues(values);
  setPropertyValues(instance.propertyValues);
};

export const valueValid = ({ instance }) => value => value.isValid(instance);

export const filterSingleOptions = properties => {};

export default compose(
  withProps({
    filterSingleOptions
  }),
  withProps(({ instance }) => ({
    properties: instance ? compileDisplayTemplate(instance) : [],
    showPropertyList: getUiConfigPath("showPropertyList")
  })),
  withState("propertyValues", "setPropertyValues", ({ instance }) =>
    instance ? instance.propertyValues : []
  ),
  withState("activeProperty", "setActiveProperty", ({ properties }) =>
    properties && properties.length
      ? properties[0]
      : {
          value: {},
          values: []
        }
  ),
  withPropsOnChange(
    ["instance"],
    ({ setActiveProperty, setPropertyValues, properties, instance }) => {
      setActiveProperty(
        properties && properties.length
          ? properties[0]
          : { value: {}, values: [] }
      );
      setPropertyValues(instance ? instance.propertyValues : []);
    }
  ),
  withHandlers({
    setValues,
    valueValid
  })
)(Configurator);
