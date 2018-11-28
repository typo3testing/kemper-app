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
  finishCapture,
  tutorialVisible,
  hideTutorial,
  capturePoint,
  undoCapture,
  canUndo,
  canFinish,
  canCapture
}) => (
  <div>
    <div className={cx(styles.Step, styles.Windows)}>
      <HeaderBar goBack />

      <div className={styles.CrossHairWrapper}>
        <div className={styles.CrossHair} />
      </div>

      <Hint small className={styles.MeasureHint}>
        {translate("RoomCaptureTutorialWindows")}
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
              onClick={goToNextStep}
              className={cx(globalStyles.ActionButtonSave)}
              inactive={!canFinish}
            />
          </div>
        </div>

        <div className={cx(globalStyles.ActionButtonPartArea)}>
          <div className={cx(globalStyles.GlobalRightAlignElements)}>
            <span
              onClick={undoCapture}
              className={cx(globalStyles.ActionButtonReset)}
              inactive={!canUndo}
            />
            <div className={cx(globalStyles.Clear)} />
            <span
              onClick={capturePoint}
              className={cx(globalStyles.ActionButtonCapture)}
              inactive={!canCapture}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
