import React from "react";
import cx from "classnames";

import styles from "./button-menu.css";
import globalStyles from "../../../css/global.css";

import Button from "../button/button";

export default ({ children, open, ...rest }) => (
  <div className={cx(styles.ButtonMenu, open && styles.open, "coui-noinput")}>
    <Button {...rest} />
    {children}
  </div>
);
