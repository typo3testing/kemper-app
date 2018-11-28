import React from "react";
import cx from "classnames";

import styles from "./button.css";
import globalStyles from "../../../css/global.css";

export default ({
  onClick,
  icon,
  className,
  size,
  active,
  hidden,
  dark,
  inactive,
  bordered,
  onTouchStart,
  onMouseDown,
  onTouchEnd,
  onMouseUp,
  touchable
}) => (
  <div
    id={icon}
    className={cx(
      styles.Container,
      size && styles[`size-${size}`],
      inactive && globalStyles.inactive,
      dark && styles.dark,
      active && styles.active,
      hidden && styles.hidden,
      touchable && "touchable",
      className
    )}
    onClick={e => !inactive && onClick && onClick(e)}
    onTouchStart={e => !inactive && onTouchStart && onTouchStart(e)}
    onTouchEnd={e => !inactive && onTouchEnd && onTouchEnd(e)}
    onMouseDown={e => !inactive && onMouseDown && onMouseDown(e)}
    onMouseUp={e => !inactive && onMouseUp && onMouseUp(e)}
  >
    <div className={cx(styles.Wrapper, touchable && "touchable")}>
      <div
        className={cx(
          styles.Background,
          globalStyles.ButtonBackground,
          touchable && "touchable"
        )}
      />
      <div
        className={cx(
          styles.Button,
          globalStyles.ButtonImage,
          globalStyles.BorderDark,
          dark ? globalStyles.ButtonColor2 : globalStyles.ButtonColor1,
          touchable && "touchable",
          icon && styles[`icon-${icon}`]
        )}
      />
    </div>
  </div>
);
