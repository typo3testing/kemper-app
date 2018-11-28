import { compose, withState, withHandlers } from "recompose";

import Toggle from "./toggle.jsx";

export const toggleClick = ({ onClick, isActive, setIsActive }) => () => {
  setIsActive(!isActive);
  return onClick && onClick();
};

export default compose(
  withState("isActive", "setIsActive", false),
  withHandlers({
    toggleClick
  })
)(Toggle);
