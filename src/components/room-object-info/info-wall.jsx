import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import styles from "./room-object-info.css";
import globalStyles from "../../../css/global.css";

export default ({
  selectedOption,
  setSelectedOption,
  material,
  applyChanges,
  revertChanges,
  length,
  setLength,
  hidden,
  toggleHidden,
  deleteObject
}) => (
  <div className={cx(styles.Info, styles.InfoWall)}>
    <div className={styles.PropertyWrapper}>
      <div
        className={cx(
          styles.Property,
          styles.ModelImages,
          globalStyles.BorderDark
        )}
      >
        <div className={styles.Material}>
          {material.options.map(option => (
            <div
              className={styles.Option}
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
            >
              <div
                className={styles.Image}
                style={{ backgroundImage: `url('${option.imageUrl}')` }}
              />
              {selectedOption === option.id && (
                <div className={cx(styles.Circle, globalStyles.BorderDark)} />
              )}
            </div>
          ))}
        </div>
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
            hidden && styles.active
          )}
          onClick={toggleHidden}
        >
          {translate("RoomPlannerHidden")}
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
        </div>
      </div>
    </div>
  </div>
);
