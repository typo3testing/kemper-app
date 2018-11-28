import React from "react";
import cx from "classnames";

import DetailContainer from "../../components/detail-container/detail-container.js";
import DetailHeader from "../../components/detail-header/detail-header.js";

import styles from "./property-list.css";
import globalStyles from "../../../css/global.css";

export default ({
  className,
  properties,
  activeProperty,
  setActiveProperty
}) => (
  <div className={cx(styles.Container, className)}>
    <DetailContainer>
      <DetailHeader>Product Options</DetailHeader>
      <DetailContent className={styles.Content}>
        {properties.map(property => (
          <div
            key={property.name}
            className={cx(styles.Property, {
              [styles.Active]: activeProperty.name === property.name
            })}
            onClick={() => setActiveProperty(property)}
          >
            {property.name}
          </div>
        ))}
      </DetailContent>
    </DetailContainer>
  </div>
);
