import React from "react";
import cx from "classnames";
import { compose, lifecycle, withState } from "recompose";

import styles from "../property-widget.css";
import globalStyles from "../../../../css/global.css";

const ThumbnailWidget = ({
  className,
  selectedValue,
  values,
  selectValue,
  valueValid,
  showCircle
}) => (
  <div
    className={cx(
      styles.Container,
      styles.Thumbnail,
      globalStyles.ContentBoxTextColor,
      className
    )}
  >
    {values.filter(valueValid).map(value => (
      <div
        className={styles.Value}
        key={value.key}
        onClick={() => selectValue(value)}
      >
        <div
          className={styles.Image}
          style={{ backgroundImage: `url(${value.imageUrl})` }}
        />
        {showCircle && (
          <div
            className={cx(
              styles.Circle,
              selectedValue === value && styles.selected,
              selectedValue === value && globalStyles.CustomFont2
            )}
          />
        )}
      </div>
    ))}
  </div>
);

export default compose(
  withState("showCircle", "setShowCircle", false),
  lifecycle({
    async componentDidMount() {
      setTimeout(() => this.props.setShowCircle(true), 250); //TODO maybe trigger on imageLoad
    }
  })
)(ThumbnailWidget);
