import React from "react";
import cx from "classnames";

import HeaderBar from "../../components/header-bar/header-bar";

import styles from "./find-trader.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import TextButton from "../../components/text-button/text-button";
import Button from "../../components/button/button";
import LandDropDown from "../../components/land-dropdown/land-dropdown.jsx";

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
    <HeaderBar className={cx(globalStyles.AppCustomBack)} goHome />

    <div className={cx(globalStyles.AppContentArea, globalStyles.NoAppheader)}>
      <div className={cx(globalStyles.MainWrap)}>
        <div className={cx(globalStyles.MainContentHolder)}>
          <div className={cx(globalStyles.ContentPadTypeThree)}>
            <div
              className={cx(
                globalStyles.Element,
                globalStyles.ElementGapMedium
              )}
            >
              <div className={cx(globalStyles.Entry)}>
                <h4>Hier finden Sie den Händler in Ihrer Nähe</h4>
              </div>
            </div>

            <div
              className={cx(
                globalStyles.Element,
                globalStyles.ElementGapMedium
              )}
            >
              <div
                className={cx(
                  globalStyles.SiteFormModule,
                  globalStyles.Clearfix
                )}
              >
                <LandDropDown />
              </div>
            </div>
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
        onClick={() => goTo("/calculate-amount")}
        icon={"MenuCalculator"}
        className={cx(selectionStyles.Button)}
      />

      <TextButton
        onClick={() => goTo("/find-trader")}
        icon={"MenuMapCurrent"}
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
