import React from "react";
import cx from "classnames";

import styles from "./text-button.css";
import globalStyles from "../../../css/global.css";

import EdgeButton from "../button/edge-button.jsx";
import { isEdge } from "../../utils/is-edge";
import { translate } from "../../services";

const TextButton = ({ label, onClick, icon, className }) => (
  <div
    className={cx(
      styles.TextButton,
      styles[`icon-${icon}`],
      className,
      globalStyles.ButtonTextColor
    )}
    id={label}
    onClick={onClick}
  >
    <div className={styles.ImageContainer}>
      <div
        className={cx(
          styles.Image,
          globalStyles.ButtonColor3,
          globalStyles.ButtonImage
        )}
      />
      <div
        className={cx(
          styles.ImageBackground,
          globalStyles.TextButtonBackground
        )}
      />
    </div>
    <div className={cx(styles.Text, globalStyles.CustomFont2)}>
      {translate(label)}
    </div>
    <div className={cx(styles.Background, globalStyles.ButtonBarColor)} />
  </div>
);

const EdgeTextButton = ({ label, onClick, icon, className }) => (
  <div
    className={cx(styles.TextButton, globalStyles.ButtonTextColorEdge)}
    onClick={onClick}
  >
    <EdgeButton
      size=""
      buttonColor={globalStyles.ButtonColor3}
      className={className}
      dark
      icon={icon}
    />
    <div className={cx(styles.Text, styles.TextEdge, globalStyles.CustomFont2)}>
      {translate(label)}
    </div>
  </div>
);

export default isEdge(EdgeTextButton)(TextButton);
