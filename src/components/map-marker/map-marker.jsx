import React from "react";
import cx from "classnames";

import styles from "./map-marker.css";
import globalStyles from "../../../css/global.css";

export default ({ children, icon, className, getSecureIcon, onSelect }) => (
  <div
    className={cx(styles.Container, className)}
    style={icon && { backgroundImage: `url(${getSecureIcon(icon)})` }}
    onClick={onSelect}
  />
);
