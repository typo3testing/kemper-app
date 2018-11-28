import React from "react";

import Joystick from "../../../components/joystick/joystick.js";

import styles from "../walk-control.css";

export default ({ updateOffset, baseClass, buttonClass, responseFn }) => (
  <div className={styles.Joystick}>
    <Joystick
      onChange={updateOffset}
      responseFn={responseFn}
      baseClass={baseClass}
      buttonClass={buttonClass}
    />
  </div>
);
