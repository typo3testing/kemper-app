import React from "react";
import cx from "classnames";

import { HomeWeatherDashboard } from "../../components/Weather/HomeWeatherDashboard";

import styles from "./home.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import TextButton from "../../components/text-button/text-button";
import Button from "../../components/button/button";

import { getProperBackgroundClass } from "../../utils/is-edge";

export default ({ goTo, showAuthDialog }) => (
  <div
    className={cx(
      selectionStyles.Container,
      styles.Container,
      globalStyles.ImageBackground
    )}
  >
    <div className={cx(globalStyles.Appheader)}>
      <div className={cx(globalStyles.Sitelogo)}>
        <div className={cx(globalStyles.Tablewrap)}>
          <div
            className={cx(
              globalStyles.Tablecell,
              globalStyles.Tablemiddleline,
              globalStyles.PullTextCenter
            )}
          >
            <img src={require("../../../assets/images/app-logo.svg")} />
          </div>
        </div>
      </div>
    </div>

    <div className={cx(globalStyles.AppContentArea)}>
      <div className={cx(globalStyles.MainWrap)}>
        <HomeWeatherDashboard />

        <div
          className={cx(
            globalStyles.BottomActionButtonHolder,
            globalStyles.BottomActionButtonHolderV1
          )}
        >
          <span
            key="buttonLive"
            onClick={() => goTo("/calibration-capture")}
            className={cx(globalStyles.ActionButtonMeasure)}
          />

          <span
            className={cx(globalStyles.ActionButtonCrackPortion)}
            onClick={() => goTo("/capture-area")}
          />
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
  </div>
);
