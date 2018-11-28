import React from "react";
import cx from "classnames";

import styles from "./room-selection.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import HeaderBar from "../../components/header-bar/header-bar";
import TextButton from "../../components/text-button/text-button";
import { getProperBackgroundClass } from "../../utils/is-edge";
import { translate } from "../../services";

export default ({ goBack, goToRoomPlanner, goToRoomCapture }) => (
  <div
    className={cx(
      selectionStyles.Container,
      styles.Container,
      globalStyles.Background,
      globalStyles.BackgroundImage,
      globalStyles.BackgroundColor
    )}
  >
    <HeaderBar goHome dark />
    <div className={cx(selectionStyles.Info)}>
      {translate("RoomSelectionIntroduction")}
    </div>
    <div className={cx(selectionStyles.ButtonBar, globalStyles.ButtonBar)}>
      <div
        className={cx(selectionStyles.ButtonSeparator, styles.ButtonSeparator)}
      >
        <div className={getProperBackgroundClass()} />
      </div>
      <TextButton
        label={"RoomSelectionMeasure"}
        onClick={goToRoomCapture}
        icon={"livemeasure"}
        className={selectionStyles.Button}
      />
      <div
        className={cx(selectionStyles.ButtonSeparator, styles.ButtonSeparator)}
      >
        <div className={getProperBackgroundClass()} />
      </div>
      <TextButton
        label={"RoomSelectionSketch"}
        onClick={goToRoomPlanner}
        icon={"sketchplan"}
        className={selectionStyles.Button}
      />
      <div
        className={cx(selectionStyles.ButtonSeparator, styles.ButtonSeparator)}
      >
        <div className={getProperBackgroundClass()} />
      </div>
    </div>
    <div
      className={cx(selectionStyles.BottomLine, getProperBackgroundClass())}
    />
  </div>
);
