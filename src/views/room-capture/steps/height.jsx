import React from "react";
import cx from "classnames";

import { translate } from "../../../services";

import Button from "../../../components/button/button";
import Hint from "../../../components/hint/hint";
import HeaderBar from "../../../components/header-bar/header-bar";

import styles from "../room-capture.css";
import viewStyles from "../../views.css";
import globalStyles from "../../../../css/global.css";

export default ({
  cancel,
  captureRoomHeight,
  goToNextStep,
  capturePoint,
  undoCapture,
  height,
  currentStep,
  canUndo,
  canFinish,
  canCapture
}) => (
  <div>
    <div className={cx(styles.Step, styles.Height)}>
      <HeaderBar goBack />

      {height > 0 && (
        <div
          className={cx(
            styles.Measurement,
            globalStyles.ContentBoxColor,
            globalStyles.ContentBoxTextColor
          )}
        >
          Height: {height}cm
        </div>
      )}
      <Hint small className={styles.MeasureHint}>
        {translate("RoomCaptureTutorialHeight")}
      </Hint>

      <div
        className={cx(
          globalStyles.BottomActionButtonHolder,
          globalStyles.BottomActionButtonHolderV2,
          globalStyles.BottomActionButtonHolderV2,
          globalStyles.ContentPadTypeFour
        )}
      >
        <div className={cx(globalStyles.ActionButtonPartArea)}>
          <div className={cx(globalStyles.GlobalLeftAlignElements)}>
            <span
              onClick={captureRoomHeight}
              className={cx(globalStyles.ActionButtonSave)}
              inactive={!canCapture}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
