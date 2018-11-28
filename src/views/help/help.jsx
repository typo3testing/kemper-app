import React from "react";
import cx from "classnames";

import HeaderBar from "../../components/header-bar/header-bar";

import styles from "./help.css";
import selectionStyles from "../selection-view.css";
import globalStyles from "../../../css/global.css";

import TextButton from "../../components/text-button/text-button";
import Button from "../../components/button/button";

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
          <div className={cx(globalStyles.ContentPadTypeTwo)}>
            <div
              className={cx(
                globalStyles.Element,
                globalStyles.ElementGapMedium
              )}
            >
              <div className={cx(globalStyles.Entry)}>
                <h4>Hilfe & Tipps</h4>
              </div>
            </div>

            <div
              className={cx(
                globalStyles.Element,
                globalStyles.ElementGapMedium
              )}
            >
              <div className={cx(globalStyles.ModuleIconicTextContent)}>
                <div
                  className={cx(globalStyles.ElementRow, globalStyles.Clearfix)}
                >
                  <div className={cx(globalStyles.IconBlock)}>
                    <img
                      src={require("../../../assets/images/icons/room-measure-icon-primary.svg")}
                      width="42"
                    />
                  </div>
                  <div
                    className={cx(
                      globalStyles.IconicExcerptBlock,
                      globalStyles.Entry
                    )}
                  >
                    <p>
                      Vermessen Sie einfach und schnell Flächen als Grundlage
                      für den Mengenkalkulator. Markieren Sie einfach die Ecken
                      der Fächen mit einem Fingertippen. Am Ende führen sie die
                      Linien zusammen und bestätigen mit einem Klick auf den
                      Haken.
                    </p>
                  </div>
                </div>

                <div
                  className={cx(globalStyles.ElementRow, globalStyles.Clearfix)}
                >
                  <div className={cx(globalStyles.IconBlock)}>
                    <img
                      src={require("../../../assets/images/icons/crack-portion-icon.svg")}
                      width="35"
                    />
                  </div>
                  <div
                    className={cx(
                      globalStyles.IconicExcerptBlock,
                      globalStyles.Entry
                    )}
                  >
                    <p>
                      Schießen sie ein Foto einer Schadstelle mit Ihrem Handy
                      und schicken sie es uns einfach mit keiner kurzen
                      Beschreibung per Mail. Unser Service Team meldet sich so
                      schnell wie möglich bei Ihnen.
                    </p>
                  </div>
                </div>

                <div
                  className={cx(globalStyles.ElementRow, globalStyles.Clearfix)}
                >
                  <div className={cx(globalStyles.IconBlock)}>
                    <img
                      src={require("../../../assets/images/icons/calculator-icon-primary.svg")}
                      width="28"
                    />
                  </div>
                  <div
                    className={cx(
                      globalStyles.IconicExcerptBlock,
                      globalStyles.Entry
                    )}
                  >
                    <p>
                      Geben Sie einfach Ihr Land und Ihre Postleitzahl ein und
                      schon finden Sie den KEMPEROL Händler, der Ihnen am
                      nächsten ist.
                    </p>
                  </div>
                </div>

                <div
                  className={cx(globalStyles.ElementRow, globalStyles.Clearfix)}
                >
                  <div className={cx(globalStyles.IconBlock)}>
                    <img
                      src={require("../../../assets/images/icons/location-icon-primary.svg")}
                      width="25"
                    />
                  </div>
                  <div
                    className={cx(
                      globalStyles.IconicExcerptBlock,
                      globalStyles.Entry
                    )}
                  >
                    <p>
                      Geben Sie einfach Ihr Land und Ihre Postleitzahl ein und
                      schon finden Sie den KEMPEROL Händler, der Ihnen am
                      nächsten ist.
                    </p>
                  </div>
                </div>

                <div
                  className={cx(globalStyles.ElementRow, globalStyles.Clearfix)}
                >
                  <div className={cx(globalStyles.IconBlock)}>
                    <img
                      src={require("../../../assets/images/icons/weather-icon-primary.svg")}
                      width="35"
                    />
                  </div>
                  <div
                    className={cx(
                      globalStyles.IconicExcerptBlock,
                      globalStyles.Entry
                    )}
                  >
                    <p>
                      Hier finden Sie Informationen zu den
                      Verarbeitungsbedingungen an Ihrem Sandort. Wenn Sie ie
                      Bedingungen an einem anderen Ort prüfen wollen, ändern Sie
                      diesen einfach über den Stift.
                    </p>
                  </div>
                </div>

                <div
                  className={cx(globalStyles.ElementRow, globalStyles.Clearfix)}
                >
                  <div className={cx(globalStyles.IconBlock)}>
                    <img
                      src={require("../../../assets/images/icons/news-icon-primary.svg")}
                      width="38"
                    />
                  </div>
                  <div
                    className={cx(
                      globalStyles.IconicExcerptBlock,
                      globalStyles.Entry
                    )}
                  >
                    <p>Hier finden Sie Neuigkeiten rund um Kemper.</p>
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
        icon={"AppHelpCurrent"}
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
