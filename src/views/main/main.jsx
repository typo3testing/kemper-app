import React from "react";
import cx from "classnames";

import Button from "../../components/button/button";
import ButtonMenu from "../../components/button-menu/button-menu";
import ShoppingCart from "../../components/shopping-cart/shopping-cart";
import HeaderBar from "../../components/header-bar/header-bar";
import HelpOverlay from "../../components/help-overlay/help-overlay";
import ProductPicker from "../../components/product-picker/product-picker";
import Configurator from "../../components/configurator/configurator";
import ProductInfo from "../../components/product-info/product-info";
import Toolbar from "../../components/toolbar/toolbar";
import SaveProjectDialog from "../../components/save-project-dialog/save-project-dialog";
import PlaybackControls from "../../components/playback-controls/playback-controls";
import TrackingLost from "../../components/tracking-lost/tracking-lost";

import { Screenshot } from "../../components/screenshot/screenshot.jsx";

import styles from "./main.css";
import viewStyles from "../views.css";
import globalStyles from "../../../css/global.css";
import { isEdgeBrowser } from "../../utils/is-edge";

export default ({
  uiVisible,
  emailScreenshot,
  currentScreenshotPath,
  viewarApi,
  saveScreenshot,
  shareScreenshot,
  screenshotMenuVisible,
  toggleScreenshotMenu,
  productButtonHidden,
  menuButtonHidden,
  configuratorButtonHidden,
  infoButtonHidden,
  deleteButtonHidden,
  selectionHasProperties,
  productPickerVisible,
  toggleProductPicker,
  removeSelection,
  goBack,
  saveProject,
  infoOverlayVisible,
  hideInfoOverlay,
  showInfoOverlay,
  menuVisible,
  toggleMenu,
  selectedInstance,
  configuratorVisible,
  toggleConfigurator,
  productInfoVisible,
  toggleProductInfo,
  useConfiguratorList,
  helpButtonHidden,
  selectionToolbarHidden,
  configuratorButtonEnabled,
  toolbarHidden,
  toolbarButtonHidden,
  shoppingCartVisible,
  toggleShoppingCart,
  projectsButtonHidden,
  screenshotButtonHidden,
  resetTracking,
  showHomeIconOnBack,
  trackingActive,
  playbackButtonEnabled,
  togglePlaybackControls,
  playbackButtonHidden,
  playbackControlsVisible,
  onHelpScreenChange,
  headerBarHidden,
  infoButtonEnabled,
  playbackGapOffset,
  infoGapOffset,
  shoppingCartEnabled,
  shareEnabled,
  projectsEnabled,
  menuEnabled,
  onSaveProject,
  showSaveProjectDialog,
  tracking,
  getScreenshotImage
}) => (
  <div className={cx(viewStyles.Container, styles.Container)}>
    {currentScreenshotPath && <Screenshot src={getScreenshotImage()} />}
    <HelpOverlay
      onScreenChange={onHelpScreenChange}
      menuVisible={menuVisible}
      resetTracking={trackingActive ? resetTracking : false}
      screenshotMenuVisible={screenshotMenuVisible}
      selectedInstance={false}
      onClick={hideInfoOverlay}
      className={cx(
        !infoOverlayVisible && viewStyles.hidden,
        viewStyles.HelpOverlay
      )}
    />
    {!productInfoVisible && configuratorVisible && (
      <Configurator
        instance={selectedInstance}
        widgetClassName={viewStyles.ConfiguratorWidget}
        className={viewStyles.Configurator}
      />
    )}
    <ProductPicker
      className={cx(viewStyles.ProductPicker)}
      toggleProductPicker={toggleProductPicker}
      productPickerVisible={productPickerVisible}
      productButtonHidden={productButtonHidden}
    />
    <ProductInfo
      className={cx(
        viewStyles.ProductInfo,
        (!productInfoVisible || !selectedInstance) && viewStyles.hidden
      )}
      instance={selectedInstance}
      gapOffset={infoGapOffset}
    />
    <PlaybackControls
      className={cx(
        viewStyles.PlaybackControls,
        (!playbackControlsVisible || !selectedInstance) && viewStyles.hidden
      )}
      instance={selectedInstance}
      gapOffset={playbackGapOffset}
    />

    <div
      className={cx(
        viewStyles.ScreenshotOverlay,
        !screenshotMenuVisible && viewStyles.hidden
      )}
    />
    <ShoppingCart
      onClose={toggleShoppingCart}
      className={cx(
        !shoppingCartVisible && viewStyles.hidden,
        viewStyles.ShoppingCart
      )}
      hidden={!shoppingCartVisible}
    />

    <SaveProjectDialog
      visible={showSaveProjectDialog}
      onSaveProject={onSaveProject}
    />

    <TrackingLost tracking={tracking} />

    <HeaderBar
      goBack={goBack}
      showHomeIconOnBack={showHomeIconOnBack}
      showHelp={!helpButtonHidden && showInfoOverlay}
      className={cx(viewStyles.HeaderBar, headerBarHidden && viewStyles.hidden)}
    />

    <Toolbar
      position="right"
      hidden={toolbarHidden}
      className={viewStyles.Menu}
    >
      {projectsEnabled && (
        <Button
          onClick={saveProject}
          icon={"save"}
          className={cx(
            viewStyles.Button,
            projectsButtonHidden && viewStyles.hidden,
            viewStyles.ButtonSaveProject
          )}
        />
      )}
      {shoppingCartEnabled && (
        <Button
          onClick={toggleShoppingCart}
          withBackground={isEdgeBrowser && shoppingCartVisible}
          active={shoppingCartVisible}
          icon={"cart"}
          className={cx(
            viewStyles.Button,
            toolbarButtonHidden && viewStyles.hidden,
            viewStyles.ButtonShoppingCart
          )}
        />
      )}
      {shareEnabled && (
        <ButtonMenu
          icon={"screenshot"}
          open={screenshotMenuVisible}
          onClick={toggleScreenshotMenu}
          className={cx(
            viewStyles.Button,
            screenshotButtonHidden && viewStyles.hidden,
            viewStyles.ButtonScreenshot
          )}
          active={screenshotMenuVisible}
        >
          <Button
            onClick={shareScreenshot}
            icon={"share"}
            className={cx(
              viewStyles.Button,
              viewStyles.ShareButton,
              !screenshotMenuVisible && viewStyles.hidden,
              viewStyles.ButtonShareShare
            )}
          />
          <Button
            onClick={emailScreenshot}
            icon={"send"}
            className={cx(
              viewStyles.Button,
              viewStyles.ShareButton,
              !screenshotMenuVisible && viewStyles.hidden,
              viewStyles.ButtonShareSend
            )}
          />
        </ButtonMenu>
      )}
      {menuEnabled && (
        <Button
          onClick={toggleMenu}
          icon={"menu"}
          hidden={menuButtonHidden}
          active={menuVisible}
          className={cx(viewStyles.Button)}
        />
      )}
    </Toolbar>

    <Toolbar
      position="left"
      className={cx(
        selectionToolbarHidden && viewStyles.hidden,
        viewStyles.ToolbarSelection
      )}
    >
      <Button
        onClick={removeSelection}
        icon={"delete"}
        className={cx(
          viewStyles.Button,
          deleteButtonHidden && viewStyles.hidden,
          viewStyles.ButtonDelete
        )}
      />
      {playbackButtonEnabled && (
        <Button
          onClick={togglePlaybackControls}
          icon={"play"}
          className={cx(
            viewStyles.Button,
            playbackButtonHidden && viewStyles.hidden,
            viewStyles.ButtonPlayback
          )}
          active={playbackControlsVisible}
        />
      )}
      {infoButtonEnabled && (
        <Button
          onClick={toggleProductInfo}
          icon={"info"}
          withBackground={isEdgeBrowser && productInfoVisible}
          className={cx(
            viewStyles.Button,
            infoButtonHidden && viewStyles.hidden,
            viewStyles.ButtonInfo
          )}
          active={productInfoVisible}
        />
      )}
      {configuratorButtonEnabled && (
        <Button
          onClick={toggleConfigurator}
          icon={"configure"}
          className={cx(
            viewStyles.Button,
            configuratorButtonHidden && viewStyles.hidden,
            viewStyles.ButtonConfigurator
          )}
          active={configuratorVisible}
        />
      )}
    </Toolbar>
  </div>
);
