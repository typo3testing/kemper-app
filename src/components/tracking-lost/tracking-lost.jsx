import React from "react";
import cx from "classnames";
import { translate } from "../../services";

import globalStyles from "../../../css/global.css";
import styles from "./tracking-lost.css";

export default ({ children, className, tracking }) => (
  <div
    className={cx(
      styles.TrackingLost,
      tracking && styles.isHidden,
      globalStyles.ContentBoxColor,
      globalStyles.ContentBoxTextColor,
      className
    )}
  >
    {translate("TrackingLost")}
  </div>
);
