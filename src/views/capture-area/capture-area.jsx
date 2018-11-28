import React from "react";
import cx from "classnames";

import HeaderBar from "../../components/header-bar/header-bar";

import styles from "./capture-area.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import TextButton from "../../components/text-button/text-button";
import Button from "../../components/button/button";
import { CameraShot } from "../../components/camera-shot/camera-shot.jsx";

import { getProperBackgroundClass } from "../../utils/is-edge";

export default ({
  goTo,
  liveButtonVisible,
  showAuthDialog,
  authButtonEnabled,
  shopFinderEnabled,
  showShopFinder,
  cameraCapture,
  currentScreenshotPath,
  getScreenshotImage,
  viewarApi,
  saveScreenshot,
  shareScreenshot,
  emailScreenshot,
  cancelScreenshot,
  capture,
  subjectValue
}) => (
  <div className={cx(selectionStyles.Container, styles.Container)}>
    {!capture && <div className={cx(globalStyles.CapturedAreaAtbg)} />}

    <HeaderBar className={cx(globalStyles.AppCustomBack)} goHome />

    <div
      className={cx(
        globalStyles.AppContentArea,
        globalStyles.AppContentAreaNoPad
      )}
    >
      <div className={cx(globalStyles.MainWrap)}>
        {capture && (
          <div
            className={cx(
              globalStyles.BottomActionButtonHolder,
              globalStyles.BottomActionButtonHolderV3,
              globalStyles.BottomActionButtonHolderV3Absolute,
              globalStyles.TakeShotWrap,
              globalStyles.ContentPadTypeEight
            )}
          >
            <span
              className={cx(globalStyles.ActionButtonCamera)}
              onClick={() => cameraCapture()}
            />
          </div>
        )}

        {!capture && (
          <div
            className={cx(
              globalStyles.CapturedPortionActivityModule,
              globalStyles.ContentPadTypeNine
            )}
          >
            {currentScreenshotPath && (
              <div className={cx(globalStyles.CapturedImage)}>
                <CameraShot src={getScreenshotImage()} />
              </div>
            )}

            <div className={cx(globalStyles.CapturedImageTitle)}>
              <input
                type="text"
                onChange={e => subjectValue(e.target.value)}
                placeholder="Titel eingeben…"
                name="subject"
                id="subject"
              />
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
                onClick={() => saveScreenshot()}
              />
              <span
                className={cx(
                  globalStyles.ActionButtonEmail,
                  globalStyles.disabled
                )}
                onClick={() => emailScreenshot()}
              />
              <span
                className={cx(
                  globalStyles.ActionButtonDelete,
                  globalStyles.disabled
                )}
                onClick={() => cancelScreenshot()}
              />
            </div>
          </div>
        )}
      </div>
    </div>

    {!capture && (
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
    )}

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
