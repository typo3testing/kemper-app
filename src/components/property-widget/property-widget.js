import { compose, withState, withProps, withHandlers } from "recompose";
import { withSetLoading } from "../../services/loading";
import PropertyWidget from "./property-widget.jsx";

export const valueValid = ({ configuration }) => value => {
  return value.isValid(configuration);
};

export const selectValue = ({
  property,
  valueValid,
  setValues,
  setLoading
}) => async value => {
  setLoading(true);
  if (valueValid(value)) {
    await setValues({
      [property.name]: value.key
    });
  }
  setLoading(false);
};

export default compose(
  withSetLoading,
  withProps(({ property: { values, value, type } }) => ({
    type,
    selectedValue: value,
    values: [...values]
  })),
  withHandlers({
    valueValid
  }),
  withHandlers({
    selectValue
  })
)(PropertyWidget);
