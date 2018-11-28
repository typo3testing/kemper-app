import React from "react";
import cx from "classnames";

import styles from "./wall-capture.css";
import Button from "../button/button.js";
import Hint from "../hint/hint.js";
import { translate } from "../../services";

export default ({
  captureStep,
  confirmLeftPoint,
  confirmRightPoint,
  confirm
}) => (
  <div className={cx(styles.Container)}>
    <div className={cx(styles.ButtonContainer)}>
      {captureStep === "leftPoint" && (
        <Button icon={"capture"} onClick={confirmLeftPoint}>
          Capture left point
        </Button>
      )}
      {captureStep === "rightPoint" && (
        <Button icon={"capture"} onClick={confirmRightPoint}>
          Capture right point
        </Button>
      )}
      {captureStep === "positionObject" && (
        <Button icon={"finish"} onClick={confirm}>
          Confirm
        </Button>
      )}
    </div>
    <Hint small>{translate(`WallCaptureTutorial--${captureStep}`)}</Hint>
  </div>
);
