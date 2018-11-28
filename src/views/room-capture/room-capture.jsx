import React from "react";
import Walls from "./steps/walls.js";
import Height from "./steps/height.js";
import Doors from "./steps/doors.js";
import Windows from "./steps/windows.js";

export default props => {
  switch (props.currentStep) {
    case 0:
      return <Walls {...props} />;
    case 1:
      return <Height {...props} />;
    case 2:
      return <Doors {...props} />;
    case 3:
      return <Windows {...props} />;
    default:
      return null;
  }
};
