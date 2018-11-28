import React from "react";
import cx from "classnames";
import { compose, lifecycle, withState } from "recompose";

import styles from "../property-widget.css";
import globalStyles from "../../../../css/global.css";

const ListWidget = ({
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
      styles.List,
      globalStyles.ContentBoxTextColor,
      className
    )}
  >
    <div className={styles.ValueWrapper}>
      {values.filter(valueValid).map(value => (
        <div
          className={cx(
            styles.Value,
            selectedValue === value && styles.selected,
            selectedValue === value && globalStyles.CustomFont2
          )}
          key={value.key}
          onClick={() => selectValue(value)}
        >
          <div className={cx(styles.Text, globalStyles.ContentBoxColor)}>
            {value.name}
          </div>
          {showCircle && <div className={cx(styles.Circle)} />}
        </div>
      ))}
    </div>
  </div>
);

export default compose(
  withState("showCircle", "setShowCircle", false),
  lifecycle({
    async componentDidMount() {
      setTimeout(() => this.props.setShowCircle(true), 250); //TODO maybe trigger on imageLoad
    }
  })
)(ListWidget);
