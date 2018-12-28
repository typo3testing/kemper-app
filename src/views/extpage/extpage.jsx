import React from "react";
import cx from "classnames";

import HeaderBar from "../../components/header-bar/header-bar";

import styles from "./extpage.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import TextButton from "../../components/text-button/text-button";
import Button from "../../components/button/button";
import Exframe from "../../components/exframe/exframe.jsx";

import { getProperBackgroundClass } from "../../utils/is-edge";

export default ({
  goTo,
  goToLive,
  goToRoomSelection,
  liveButtonVisible,
  showAuthDialog,
  authButtonEnabled,
  roomSelectionEnabled,
  projectsEnabled,
  videoUrl,
  videoExtension,
  shopFinderEnabled,
  showShopFinder
}) => (
  <div
    className={cx(
      selectionStyles.Container,
      styles.Container,
      globalStyles.ColoredBackgroundTypeOne
    )}
  >
    <HeaderBar className={cx(globalStyles.AppCustomBack)} goBack />

    <div className={cx(globalStyles.AppContentArea, globalStyles.NoAppheader)}>
      <div className={cx(globalStyles.MainWrap)}>
        <div
          className={cx(
            globalStyles.MainContentHolder,
            globalStyles.FullHeight
          )}
        >
          <div
            className={cx(
              globalStyles.ContentPadTypeEleven,
              globalStyles.FullHeight,
              globalStyles.BoxSizingDefault
            )}
          >
            <Exframe />
          </div>
        </div>
      </div>
    </div>

    <div
      className={cx(
        selectionStyles.ButtonBar,
        globalStyles.ButtonBar,
        globalStyles.CustomButtonBar
      )}
    >
      <TextButton
        onClick={() => goTo("/measurement")}
        icon={"MenuMeasurementCurrent"}
        className={cx(selectionStyles.Button)}
      />

      <TextButton
        onClick={() => goTo("/calculate-amount")}
        icon={"MenuCalculator"}
        className={cx(selectionStyles.Button)}
      />

      <TextButton
        onClick={() => goTo("/find-trader")}
        icon={"MenuMap"}
        className={cx(selectionStyles.Button)}
      />

      {liveButtonVisible && [
        <TextButton
          key="buttonLive"
          onClick={() => goTo("/calibration-capture")}
          icon={"RoomMeasure"}
          className={cx(selectionStyles.Button)}
        />
      ]}

      <TextButton
        onClick={() => goTo("/news")}
        icon={"ReleasedNews"}
        className={cx(selectionStyles.Button)}
      />

      <TextButton
        onClick={() => goTo("/help")}
        icon={"AppHelp"}
        className={cx(selectionStyles.Button)}
      />
    </div>

    <div
      className={cx(selectionStyles.BottomLine, getProperBackgroundClass())}
    />
    {authButtonEnabled && (
      <Button
        icon="login"
        dark
        size="small"
        className={styles.ButtonAuth}
        onClick={showAuthDialog}
      />
    )}
    {shopFinderEnabled && (
      <Button
        icon="shopfinder"
        dark
        size="small"
        className={styles.ButtonShopFinder}
        onClick={showShopFinder}
      />
    )}
  </div>
);
