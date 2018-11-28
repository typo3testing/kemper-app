import React from "react";
import cx from "classnames";

import styles from "./detail-container.css";
import globalStyles from "../../../css/global.css";

import { isEdgeBrowser } from "../../utils/is-edge";

export default ({ className, children, gap }) => (
  <div
    className={cx(
      styles.Container,
      gap && !isEdgeBrowser && styles[`gap-${gap}`],
      className
    )}
  >
    {children}
  </div>
);
