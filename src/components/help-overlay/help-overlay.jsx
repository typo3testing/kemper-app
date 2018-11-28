import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import styles from "./help-overlay.css";
import globalStyles from "../../../css/global.css";

export default ({
  onClick,
  menuVisible,
  selectedInstance,
  screenshotMenuVisible,
  className,
  isWebVersion,
  resetTracking,
  screen,
  changeScreen,
  shoppingCartEnabled,
  shareEnabled,
  projectsEnabled,
  menuEnabled,
  shoppingCartPosition,
  savePosition
}) => (
  <div
    className={cx(
      styles.Container,
      globalStyles.OverlayBackgroundColor,
      globalStyles.OverlayTextColor,
      className
    )}
    onClick={onClick}
  >
    <div className={styles.ButtonContainer}>
      <div
        className={cx(
          styles.Button,
          globalStyles.ColorDark,
          screen === "buttons" && styles.active
        )}
        onClick={event => changeScreen("buttons", event)}
      >
        {translate("HelpButtons")}
      </div>
      <div
        className={cx(
          styles.Button,
          globalStyles.ColorDark,
          screen === "gestures" && styles.active
        )}
        onClick={event => changeScreen("gestures", event)}
      >
        {translate("HelpGestures")}
      </div>
      {resetTracking && (
        <div
          className={cx(styles.Button, globalStyles.ColorDark)}
          onClick={resetTracking}
        >
          {translate("HelpResetTracking")}
        </div>
      )}
    </div>

    {screen === "buttons" && (
      <div>
        <div className={cx(styles.Help, styles.Back, styles.right)}>
          <div className={cx(styles.Line)} />
          <div className={cx(styles.Message)}>{translate("HelpGoBack")}</div>
        </div>

        <div className={cx(styles.Help, styles.AddProduct, styles.left)}>
          <div className={cx(styles.Line)} />
          <div className={cx(styles.Message)}>
            {translate("HelpAddProduct")}
          </div>
        </div>
        {!menuVisible && menuEnabled && (
          <div className={cx(styles.Help, styles.Menu, styles.top)}>
            <div className={cx(styles.Line)} />
            <div className={cx(styles.Message)}>{translate("HelpMenu")}</div>
          </div>
        )}
        {menuVisible && shoppingCartEnabled && (
          <div
            className={cx(
              styles.Help,
              styles.MenuItem,
              styles[`MenuItem-position${shoppingCartPosition}`],
              styles.left
            )}
          >
            <div className={cx(styles.Line)} />
            <div className={cx(styles.Message)}>
              {translate("HelpShoppingCart")}
            </div>
          </div>
        )}
        {menuVisible && projectsEnabled && (
          <div
            className={cx(
              styles.Help,
              styles.MenuItem,
              styles[`MenuItem-position${savePosition}`],
              styles.left
            )}
          >
            <div className={cx(styles.Line)} />
            <div className={cx(styles.Message)}>{translate("HelpSave")}</div>
          </div>
        )}
        {menuVisible && shareEnabled && (
          <div
            className={cx(
              styles.Help,
              styles.MenuItem,
              styles[`MenuItem-position0`],
              styles.left
            )}
          >
            <div className={cx(styles.Line)} />
            <div className={cx(styles.Message)}>
              {translate("HelpScreenshot")}
            </div>
          </div>
        )}
        {selectedInstance && (
          <div className={cx(styles.Help, styles.Info, styles.right)}>
            <div className={cx(styles.Line)} />
            <div className={cx(styles.Message)}>
              {translate("HelpProductInfo")}
            </div>
          </div>
        )}
        {selectedInstance && (
          <div className={cx(styles.Help, styles.Configure, styles.right)}>
            <div className={cx(styles.Line)} />
            <div className={cx(styles.Message)}>
              {translate("HelpProductOptions")}
            </div>
          </div>
        )}
        {selectedInstance && (
          <div className={cx(styles.Help, styles.Delete, styles.right)}>
            <div className={cx(styles.Line)} />
            <div className={cx(styles.Message)}>{translate("HelpDelete")}</div>
          </div>
        )}
      </div>
    )}

    {screen === "gestures" && (
      <div
        className={cx(styles.InteractionContainer, globalStyles.BorderBright)}
      >
        {isWebVersion ? <MouseInteractions /> : <TouchInteractions />}
      </div>
    )}
  </div>
);

const TouchInteractions = () => [
  <div className={cx(styles.InteractionHelp, styles.OneFinger)}>
    <div className={cx(styles.Image)} />
    <div className={cx(styles.InteractionMessage)}>
      {translate("HelpInteractionMove")}
    </div>
  </div>,
  <div className={cx(styles.InteractionHelp, styles.TwoFingers)}>
    <div className={cx(styles.Image)} />
    <div className={cx(styles.InteractionMessage)}>
      {translate("HelpInteractionRotate")}
    </div>
  </div>,
  <div className={cx(styles.InteractionHelp, styles.ThreeFingers)}>
    <div className={cx(styles.Image)} />
    <div className={cx(styles.InteractionMessage)}>
      {translate("HelpInteractionMoveVertical")}
    </div>
  </div>
];

const MouseInteractions = () => [
  <div className={cx(styles.InteractionHelp, styles.MouseMovement)}>
    <div className={cx(styles.Image)} />
    <div className={cx(styles.InteractionMessage)}>
      {translate("HelpInteractionMove")}
    </div>
  </div>,
  <div className={cx(styles.InteractionHelp, styles.MouseUp)}>
    <div className={cx(styles.Image)} />
    <div className={cx(styles.InteractionMessage)}>
      {translate("HelpInteractionMoveVertical")}
    </div>
  </div>,
  <div className={cx(styles.InteractionHelp, styles.MouseRotate)}>
    <div className={cx(styles.Image)} />
    <div className={cx(styles.InteractionMessage)}>
      {translate("HelpInteractionRotate")}
    </div>
  </div>
];
