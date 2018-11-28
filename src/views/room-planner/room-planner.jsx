import React from "react";
import cx from "classnames";

import Button from "../../components/button/button";
import Toggle from "../../components/toggle/toggle";
import Toolbar from "../../components/toolbar/toolbar";
import HeaderBar from "../../components/header-bar/header-bar";
import RoomObjectInfo from "../../components/room-object-info/room-object-info";
import RoomPicker from "../../components/room-picker/room-picker";

import styles from "./room-planner.css";
import viewStyles from "../views.css";
import globalStyles from "../../../css/global.css";

import { isEdgeBrowser } from "../../utils/is-edge";

export default ({
  handleManualDraw,
  roomPickerVisible,
  insertRoom,
  toggleRoomPicker,
  addRef,
  createRoom,
  canUndo,
  undo,
  insert,
  touchEnd,
  selection,
  objectInfoVisible,
  toggleObjectInfo,
  objects,
  updateSelection,
  deleteSelection,
  materials,
  goBack
}) => (
  <div className={styles.Background} ref={addRef("editor")}>
    <canvas className={cx(styles.Canvas, "touchable")} ref={addRef("canvas")} />

    <Toolbar position="left" hidden={roomPickerVisible || objectInfoVisible}>
      <Button
        onClick={createRoom}
        icon={"finish"}
        className={cx(viewStyles.Button)}
        dark
      />
    </Toolbar>

    <Toolbar position="right" hidden={objectInfoVisible || roomPickerVisible}>
      <Button
        onClick={undo}
        icon={"undo"}
        className={cx(viewStyles.Button)}
        dark
        inactive={!canUndo}
      />
      <Button
        icon={"window"}
        onTouchStart={touch => insert(touch, "window")}
        touchable
        onMouseDown={touch => insert(touch, "window")}
        onMouseUp={touchEnd}
        onTouchEnd={touchEnd}
        className={viewStyles.Button}
        dark
      />
      <Button
        icon={"door"}
        onTouchStart={touch => insert(touch, "door")}
        onMouseDown={touch => insert(touch, "door")}
        onMouseUp={touchEnd}
        onTouchEnd={touchEnd}
        className={viewStyles.Button}
        dark
        touchable
      />
      <Toggle
        icon1="sketch"
        icon2="move"
        hidden
        buttonClass={viewStyles.Button}
      />
    </Toolbar>

    <RoomPicker
      className={cx(styles.RoomPicker, !roomPickerVisible && styles.hidden)}
      onManual={handleManualDraw}
      onSelect={insertRoom}
    />

    {(roomPickerVisible || objectInfoVisible) && (
      <div
        className={cx(
          styles.BackgroundOverlay,
          globalStyles.OverlayBackgroundColor,
          objectInfoVisible && styles.noClick
        )}
      />
    )}

    <RoomObjectInfo
      object={selection}
      objects={objects}
      updateObject={updateSelection}
      deleteObject={deleteSelection}
      materials={materials}
      className={cx(styles.ObjectInfo, !objectInfoVisible && styles.hidden)}
    />

    {objectInfoVisible && (
      <Toolbar position="right" className={styles.Toolbar}>
        <Button
          withBackground={isEdgeBrowser}
          icon={"abort"}
          onClick={toggleObjectInfo}
          hidden={selection.type !== "window"}
          className={cx(viewStyles.Button)}
        />
        <Button
          withBackground={isEdgeBrowser}
          icon={"abort"}
          onClick={toggleObjectInfo}
          hidden={selection.type !== "door"}
          className={cx(viewStyles.Button)}
        />
        {/*<Button icon={'dummy'} hidden={true} className={cx(viewStyles.Button)} />*/}
        <Button
          withBackground={isEdgeBrowser}
          icon={"abort"}
          onClick={toggleObjectInfo}
          hidden={!selection.isWall && !selection.isRoom}
          className={cx(viewStyles.Button)}
        />
      </Toolbar>
    )}

    <HeaderBar goBack={goBack} dark />
  </div>
);
