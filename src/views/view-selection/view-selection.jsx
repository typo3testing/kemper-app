import React from "react";
import cx from "classnames";

import styles from "./view-selection.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import HeaderBar from "../../components/header-bar/header-bar";
import TextButton from "../../components/text-button/text-button";
import Button from "../../components/button/button";
import { getProperBackgroundClass } from "../../utils/is-edge";
import { translate } from "../../services";

export default ({
  goToWalkMode,
  goToArMode,
  goToVrMode,
  goToRoomPlanner,
  hasARMode,
  roomExportEnabled,
  exportRoom
}) => (
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
    <Button
      size="small"
      dark
      icon="download"
      onClick={exportRoom}
      className={styles.ExportRoomButton}
    />
    <div className={cx(selectionStyles.Info)}>
      {translate("ViewSelectionIntroduction")}
    </div>
    <div className={cx(selectionStyles.ButtonBar, globalStyles.ButtonBar)}>
      <div
        className={cx(selectionStyles.ButtonSeparator, styles.ButtonSeparator)}
      >
        <div className={getProperBackgroundClass()} />
      </div>
      {hasARMode && (
        <TextButton
          label={"ViewSelectionAR"}
          onClick={goToArMode}
          icon={"ar"}
          className={selectionStyles.Button}
        />
      )}
      {hasARMode && (
        <div
          className={cx(
            selectionStyles.ButtonSeparator,
            styles.ButtonSeparator
          )}
        >
          <div className={getProperBackgroundClass()} />
        </div>
      )}
      <TextButton
        label={"ViewSelectionVR"}
        onClick={goToVrMode}
        icon={"vr"}
        className={selectionStyles.Button}
      />
      <div
        className={cx(selectionStyles.ButtonSeparator, styles.ButtonSeparator)}
      >
        <div className={getProperBackgroundClass()} />
      </div>
      <TextButton
        label={"ViewSelectionWalk"}
        onClick={goToWalkMode}
        icon={"walk"}
        className={selectionStyles.Button}
      />
      <div
        className={cx(selectionStyles.ButtonSeparator, styles.ButtonSeparator)}
      >
        <div className={getProperBackgroundClass()} />
      </div>
      <TextButton
        label={"ViewSelectionRoom"}
        onClick={goToRoomPlanner}
        icon={"roomplanner"}
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
