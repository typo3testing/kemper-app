import React from "react";
import cx from "classnames";

import styles from "./ceiling-capture.css";
import Button from "../button/button.js";
import Hint from "../hint/hint.js";
import { translate } from "../../services";

export default ({
  captureStep,
  confirmFloorPoint,
  confirmCeilingPoint,
  confirm,
  currentHeight
}) => (
  <div className={cx(styles.Container)}>
    <div className={cx(styles.ButtonContainer)}>
      {captureStep === "floorPoint" && (
        <Button icon={"capture"} onClick={confirmFloorPoint}>
          Capture floor point
        </Button>
      )}
      {captureStep === "ceilingPoint" && (
        <Button icon={"capture"} onClick={confirmCeilingPoint}>
          Capture ceiling point
        </Button>
      )}
      {captureStep === "positionObject" && (
        <Button icon={"finish"} onClick={confirm}>
          Confirm
        </Button>
      )}
    </div>
    {captureStep === "ceilingPoint" && <div className={styles.CrossHair} />}
    <Hint small>
      {translate(`CeilingCaptureTutorial--${captureStep}`)}
      {currentHeight !== -1 && <span>{Math.round(currentHeight / 10)} cm</span>}
    </Hint>
  </div>
);
