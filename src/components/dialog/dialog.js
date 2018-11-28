import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import styles from "./dialog.css";
import globalStyles from "../../../css/global.css";

export default ({
  message,
  visible,
  onConfirm,
  onCancel,
  showConfirm,
  showCancel,
  confirmText,
  cancelText,
  withInput,
  input,
  setInput
}) => (
  <div
    className={cx(
      styles.DialogWrapper,
      globalStyles.OverlayBackgroundColor,
      visible && styles.visible
    )}
  >
    <div className={cx(styles.Dialog)}>
      <div
        className={cx(
          styles.Content,
          globalStyles.InfoBoxTextColor,
          globalStyles.InfoBoxColor
        )}
      >
        <div className={cx(styles.Message)}>{translate(message)}</div>
        {withInput && (
          <div className={styles.Input}>
            <input
              type="text"
              value={input}
              className={globalStyles.CustomFont2}
              onChange={({ target }) => setInput(target.value)}
            />
          </div>
        )}
      </div>
      <div className={cx(styles.Buttons, globalStyles.InfoBoxColor)}>
        {showConfirm && (
          <div
            className={cx(
              styles.Button,
              globalStyles.CustomFont3,
              globalStyles.ButtonColor2,
              globalStyles.ButtonTextColor
            )}
            onClick={onConfirm}
          >
            {translate(confirmText)}
          </div>
        )}
        {showCancel && (
          <div
            className={cx(
              styles.Button,
              globalStyles.CustomFont3,
              globalStyles.ButtonColor2,
              globalStyles.ButtonTextColor
            )}
            onClick={onCancel}
          >
            {translate(cancelText)}
          </div>
        )}
      </div>
    </div>
  </div>
);
