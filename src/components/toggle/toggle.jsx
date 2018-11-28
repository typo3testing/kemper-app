import React from "react";
import cx from "classnames";

import Button from "../../components/button/button";

import styles from "./toggle.css";
import globalStyles from "../../../css/global.css";

export default ({
  toggleClick,
  children,
  isActive,
  icon1,
  icon2,
  hidden,
  className,
  buttonClass
}) => (
  <div
    className={cx(styles.Container, hidden && styles.hidden, className)}
    onClick={toggleClick}
  >
    <Button className={cx(styles.SizeDummy, buttonClass)} hidden />
    <div className={cx(styles.ActiveBackground)} />
    <Button
      icon={icon1}
      className={cx(styles.Child, isActive && styles.inactive, buttonClass)}
      dark
    />
    <Button
      icon={icon2}
      className={cx(styles.Child, !isActive && styles.inactive, buttonClass)}
      dark
    />
  </div>
);
