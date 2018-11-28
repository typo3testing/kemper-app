import React, { Fragment } from "react";
import cx from "classnames";
import LazyLoad from "react-lazy-load";
import styles from "./product-image.css";
import globalStyles from "../../../css/global.css";

export default ({ model, onClick, className, hideName }) => (
  <LazyLoad className={cx(styles.Container, className)}>
    <Fragment>
      <div
        className={cx(styles.Image, hideName && styles["name-hidden"])}
        style={{ backgroundImage: `url('${model.imageUrl}')` }}
        onClick={onClick}
      />
      {!hideName && (
        <div
          className={cx(styles.Name, globalStyles.CustomFont2)}
          onClick={onClick}
        >
          {model.name}
        </div>
      )}
    </Fragment>
  </LazyLoad>
);
