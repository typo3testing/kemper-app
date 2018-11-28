import React from "react";
import cx from "classnames";

import styles from "./property-picker.css";
import globalStyles from "../../../css/global.css";

import { isEdgeBrowser } from "../../utils/is-edge";
import EdgeButton from "../button/edge-button.jsx";

export default ({
  className,
  properties,
  selectNext,
  selectPrevious,
  activeProperty,
  showButtons
}) => (
  <div className={cx(styles.Container, className)}>
    {showButtons && (
      <span>
        {isEdgeBrowser ? (
          <EdgeButton
            className={styles.EdgeButtonPrevious}
            dark
            size={"small"}
            icon={"back"}
            onClick={selectNext}
          />
        ) : (
          <div
            className={cx(
              styles.Button,
              globalStyles.ButtonImage,
              globalStyles.ContentBoxColor,
              styles.Previous
            )}
            onClick={selectNext}
          />
        )}
      </span>
    )}
    <div
      className={cx(
        styles.Active,
        globalStyles.ContentBoxColor,
        globalStyles.ContentBoxTextColor,
        !showButtons && styles.noButtons
      )}
    >
      <div className={styles.Property}>{activeProperty.name + ":"}</div>
      <div className={styles.Value}>{activeProperty.value.name}</div>
    </div>
    {showButtons && (
      <span>
        {isEdgeBrowser ? (
          <EdgeButton
            className={styles.EdgeButtonNext}
            dark
            size={"small"}
            icon={"next"}
            onClick={selectPrevious}
          />
        ) : (
          <div
            className={cx(
              styles.Button,
              globalStyles.ButtonImage,
              globalStyles.ContentBoxColor,
              styles.Next
            )}
            onClick={selectPrevious}
          />
        )}
      </span>
    )}
  </div>
);
