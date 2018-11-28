import React from "react";
import cx from "classnames";

import styles from "./detail-content.css";
import globalStyles from "../../../css/global.css";

export default ({ className, children }) => (
  <div
    className={cx(
      styles.Container,
      globalStyles.ContentBoxColor,
      globalStyles.ContentBoxTextColor,
      className
    )}
  >
    {children}
  </div>
);
