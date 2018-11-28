import React from "react";
import cx from "classnames";

import TranslationJoystick from "./joysticks/translation-joystick";
import RotationJoystick from "./joysticks/rotation-joystick";

import styles from "./walk-control.css";
import globalStyles from "../../../css/global.css";

export default ({
  useKeyboard,
  joystickEnabled,
  handleMovement,
  handleRotation
}) => (
  <div className={cx(styles.Container, !useKeyboard && styles.visible)}>
    <div className={styles.left}>
      <TranslationJoystick
        enabled={joystickEnabled}
        baseClass={cx(styles.JoystickBase)}
        buttonClass={cx(styles.JoystickButton, globalStyles.BackgroundDark)}
      />
    </div>
    <div className={styles.right}>
      <RotationJoystick
        enabled={joystickEnabled}
        baseClass={cx(styles.JoystickBase)}
        buttonClass={cx(styles.JoystickButton, globalStyles.BackgroundDark)}
      />
    </div>
  </div>
);
