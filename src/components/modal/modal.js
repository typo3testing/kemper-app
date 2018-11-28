import React from "react";
import cx from "classnames";

import styles from "./modal.css";
import globalStyles from "../../../css/global.css";

export const Modal = ({ children, className }) => (
  <div className={cx(styles.wrapper, globalStyles.ColorBright, className)}>
    <div className={cx(styles.content, globalStyles.BorderBright)}>
      {children}
    </div>
  </div>
);
