import React from "react";
import cx from "classnames";

import HeaderBar from "../../components/header-bar/header-bar";

import styles from "./calculate-area.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import TextButton from "../../components/text-button/text-button";
import Button from "../../components/button/button";

import ProcessArea from "../../components/process-area/process-area.jsx";

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
      globalStyles.ImageBackground,
      globalStyles.GotResultBG
    )}
  >
    <HeaderBar className={cx(globalStyles.AppCustomBack)} goHome />

    <div className={cx(globalStyles.AppContentArea, globalStyles.NoAppheader)}>
      <div className={cx(globalStyles.MainWrap)}>
        <div className={cx(globalStyles.Tablewrap)}>
          <div
            className={cx(globalStyles.Tablecell, globalStyles.Tablebottomline)}
          >
            <div
              className={cx(
                globalStyles.MainContentHolder,
                globalStyles.PullTextCenter
              )}
            >
              <div
                className={cx(
                  globalStyles.ContentPadTypeSix,
                  globalStyles.HasOrientationNav
                )}
              >
                <div className={cx(globalStyles.GotResultModule)}>
                  <div className={cx(globalStyles.GotResultTick)} />

                  <div className={cx(globalStyles.GotResultInfo)}>
                    <span>Die berechnete Flä̈che beträgt</span>
                    <ProcessArea />
                  </div>

                  <div
                    className={cx(
                      globalStyles.BottomActionButtonHolder,
                      globalStyles.BottomActionButtonHolderV3,
                      globalStyles.OrientationTopNav
                    )}
                  >
                    <span
                      key="buttonLive"
                      onClick={() => goTo("/calculate-amount")}
                      className={cx(
                        globalStyles.ActionButtonCalculate,
                        globalStyles.inactive
                      )}
                    />

                    <span
                      key="buttonLive"
                      onClick={() => goTo("/find-trader")}
                      className={cx(
                        globalStyles.ActionButtonLocation,
                        globalStyles.inactive
                      )}
                    />

                    <span
                      key="buttonLive"
                      onClick={() => goTo("/calibration-capture")}
                      className={cx(
                        globalStyles.ActionButtonTrash,
                        globalStyles.inactive
                      )}
                    />
                  </div>
                </div>
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
