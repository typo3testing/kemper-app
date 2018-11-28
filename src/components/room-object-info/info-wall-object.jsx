import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import styles from "./room-object-info.css";
import globalStyles from "../../../css/global.css";

export default ({
  object,
  objects,
  selectModel,
  isSelected,
  setLength,
  setHeight,
  setVerticalOffset,
  applyChanges,
  revertChanges,
  length,
  height,
  verticalOffset,
  toggleRotated,
  toggleMirrored,
  deleteObject,
  rotated,
  mirrored,
  withVerticalOffset,
  objectImages
}) => (
  <div className={cx(styles.Info, styles.InfoWallObject)}>
    <div className={styles.PropertyWrapper}>
      <div
        className={cx(
          styles.Property,
          styles.ModelImages,
          globalStyles.BorderDark
        )}
      >
        {objects.map(({ model }, index) => (
          <div
            onClick={() => selectModel(model)}
            className={cx(
              styles.ModelImageContainer,
              globalStyles.BorderDark,
              isSelected(model) && styles.selected
            )}
            key={index}
          >
            <div
              className={styles.ModelImage}
              style={{ backgroundImage: `url('${objectImages[index]}')` }}
            />
          </div>
        ))}
      </div>
    </div>

    <div className={styles.PropertyWrapper}>
      <div className={styles.Properties}>
        <div
          className={cx(
            styles.Button,
            globalStyles.CustomFont3,
            globalStyles.ColorBright,
            globalStyles.BorderDark,
            globalStyles.BackgroundDark,
            rotated && styles.active
          )}
          onClick={toggleRotated}
        >
          {translate("RoomPlannerRotate")}
        </div>
        <div
          className={cx(
            styles.Button,
            globalStyles.CustomFont3,
            globalStyles.ColorBright,
            globalStyles.BorderDark,
            globalStyles.BackgroundDark,
            mirrored && styles.active
          )}
          onClick={toggleMirrored}
        >
          {translate("RoomPlannerMirror")}
        </div>
        <div
          className={cx(
            styles.Button,
            globalStyles.CustomFont3,
            globalStyles.ColorBright,
            globalStyles.BorderDark,
            globalStyles.BackgroundDark
          )}
          onClick={deleteObject}
        >
          {translate("RoomPlannerDelete")}
        </div>
      </div>

      <div className={cx(styles.Properties, styles.Text)}>
        <div className={styles.Labels}>
          <div className={styles.Label}>{translate("RoomPlannerLength")}</div>
          <div className={styles.Label}>{translate("RoomPlannerHeight")}</div>
          {withVerticalOffset && (
            <div className={styles.Label}>
              {translate("RoomPlannerVerticalOffset")}
            </div>
          )}
        </div>
        <div className={styles.Inputs}>
          <div className={styles.Input}>
            <input
              type="text"
              pattern="[0-9]*"
              value={length}
              onChange={({ target }) => setLength(target.value)}
            />
          </div>
          <div className={styles.Input}>
            <input
              type="text"
              pattern="[0-9]*"
              value={height}
              onChange={({ target }) => setHeight(target.value)}
            />
          </div>
          {withVerticalOffset && (
            <div className={styles.Input}>
              <input
                type="text"
                pattern="[0-9]*"
                value={verticalOffset}
                onChange={({ target }) => setVerticalOffset(target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
