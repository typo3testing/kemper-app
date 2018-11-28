import React from "react";
import cx from "classnames";

import HeaderBar from "../../components/header-bar/header-bar";
import WalkControl from "../../components/walk-control/walk-control";

import styles from "./walk.css";
import viewStyles from "../views.css";
import globalStyles from "../../../css/global.css";

export default ({}) => (
  <div className={cx(viewStyles.Container, styles.Container)}>
    <HeaderBar goHome />
    <WalkControl joystickEnabled />
  </div>
);
