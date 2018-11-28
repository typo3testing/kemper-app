import React from "react";
import cx from "classnames";

import { HomeWeatherDashboard } from "../../components/Weather/HomeWeatherDashboard";

import styles from "./home.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import TextButton from "../../components/text-button/text-button";
import Button from "../../components/button/button";

import { getProperBackgroundClass } from "../../utils/is-edge";

import HeaderBar from "../../components/header-bar/header-bar";

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
  <div className={cx(selectionStyles.Container, styles.Container)}>
    {videoUrl && (
      <video
        autoPlay
        playsInline
        muted
        src={videoUrl}
        type={videoExtension}
        className={styles.BackgroundVideo}
      />
    )}

    <div
      className={cx(globalStyles.CapturedAreaAtbg, globalStyles.CustomHidden)}
    />

    <HeaderBar className={cx(globalStyles.AppCustomBack)} goBack />

    <div
      className={cx(
        globalStyles.AppContentArea,
        globalStyles.AppContentAreaPadType3
      )}
    >
      <div className={cx(globalStyles.MainWrap)}>
        <div
          className={cx(
            globalStyles.BottomActionButtonHolder,
            globalStyles.BottomActionButtonHolderV3,
            globalStyles.BottomActionButtonHolderV3Absolute,
            globalStyles.TakeShotWrap
          )}
        >
          <span className={cx(globalStyles.ActionButtonCamera)} />
        </div>

        <div
          className={cx(
            globalStyles.CapturedPortionActivityModule,
            globalStyles.ContentPadTypeSeven,
            globalStyles.CustomHidden
          )}
        >
          <div className={cx(globalStyles.CapturedImage)}>
            <img src={require("../../../assets/images/captured-img.png")} />
          </div>

          <div className={cx(globalStyles.CapturedImageTitle)}>
            <input type="text" placeholder="Titel eingeben…" />
          </div>

          <div
            className={cx(
              globalStyles.BottomActionButtonHolder,
              globalStyles.BottomActionButtonHolderV3
            )}
          >
            <span
              className={cx(
                globalStyles.ActionButtonDownload,
                globalStyles.disabled
              )}
            />
            <span
              className={cx(
                globalStyles.ActionButtonEmail,
                globalStyles.disabled
              )}
            />
            <span
              className={cx(
                globalStyles.ActionButtonDelete,
                globalStyles.disabled
              )}
            />
          </div>
        </div>
      </div>
    </div>

    <div
      className={cx(
        selectionStyles.ButtonBar,
        globalStyles.ButtonBar,
        globalStyles.CustomButtonBar,
        globalStyles.CustomHidden
      )}
    >
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

      <TextButton
        key="buttonLive"
        onClick={() => goTo("/calibration-capture")}
        icon={"RoomMeasure"}
        className={cx(selectionStyles.Button)}
      />

      <TextButton
        onClick={() => goTo("/weather")}
        icon={"WeatherInfo"}
        className={cx(selectionStyles.Button)}
      />

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
