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
  goToNextStep,
  capturePoint,
  undoCapture,
  currentStep,
  length,
  canUndo,
  canFinish,
  canCapture
}) => (
  <div>
    <div className={cx(styles.Step, styles.Walls)}>
      <HeaderBar goBack />

      {length > 0 && (
        <div
          className={cx(
            styles.Measurement,
            globalStyles.ContentBoxColor,
            globalStyles.ContentBoxTextColor
          )}
        >
          Length: {length}cm
        </div>
      )}
      <Hint small className={styles.MeasureHint}>
        {translate("RoomCaptureTutorialWalls")}
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
            <Button
              onClick={goToNextStep}
              className={cx(
                globalStyles.ActionButtonButtonType,
                globalStyles.Save
              )}
              inactive={!canFinish}
            />
          </div>
        </div>

        <div className={cx(globalStyles.ActionButtonPartArea)}>
          <div className={cx(globalStyles.GlobalRightAlignElements)}>
            <Button
              onClick={undoCapture}
              className={cx(
                globalStyles.ActionButtonButtonType,
                globalStyles.Reset
              )}
              inactive={!canUndo}
            />
            <div className={cx(globalStyles.Clear)} />
            <Button
              onClick={capturePoint}
              className={cx(
                globalStyles.ActionButtonButtonType,
                globalStyles.Capture
              )}
              inactive={!canCapture}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
