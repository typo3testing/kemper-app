import React from "react";
import cx from "classnames";

import styles from "./room-object-info.css";
import globalStyles from "../../../css/global.css";

export default ({
  selectedOption,
  setSelectedOption,
  material,
  applyChanges,
  revertChanges
}) => (
  <div className={cx(styles.Info, styles.InfoFloor)}>
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
  </div>
);
