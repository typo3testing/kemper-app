import React from "react";
import cx from "classnames";

import Button from "../../components/button/button";

import styles from "./header-bar.css";
import globalStyles from "../../../css/global.css";

export default ({
  goBack,
  goHome,
  showHelp,
  goHomeFunction,
  goBackFunction,
  showHomeIconOnBack,
  dark,
  className
}) => (
  <div className={cx(styles.Container, className)}>
    <Button
      onClick={goBackFunction}
      icon={showHomeIconOnBack ? "home" : "back"}
      size={"small"}
      dark={dark}
      className={cx(!goBack && styles.hidden, styles.Button)}
    />

    <Button
      onClick={showHelp ? showHelp : () => {}}
      icon={"help"}
      size={"small"}
      dark={dark}
      className={cx(
        !showHelp && styles.hidden,
        styles.Button,
        styles.ButtonShowHelp
      )}
    />

    <Button
      onClick={goHomeFunction}
      icon={"back"}
      size={"small"}
      dark={dark}
      className={cx(
        !goHome && styles.hidden,
        styles.Button,
        !showHelp && !goBack && styles.Button
      )}
    />
  </div>
);
