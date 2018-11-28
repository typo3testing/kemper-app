import React, { Fragment } from "react";
import cx from "classnames";

import { translate } from "../../services";

import DetailContainer from "../../components/detail-container/detail-container.js";
import DetailHeader from "../../components/detail-header/detail-header.js";
import DetailContent from "../../components/detail-content/detail-content.js";

import styles from "./shop-finder.css";
import globalStyles from "../../../css/global.css";

export default ({ marker, visible }) => (
  <div className={cx(styles.SelectedMarker, visible && styles.isVisible)}>
    <DetailContainer gap="left1">
      <DetailHeader>
        <div className={styles.Title}>{marker && marker.name}</div>
      </DetailHeader>
      <DetailContent className={styles.Content}>
        {marker &&
          Object.entries(marker.details).map(([key, value]) => (
            <div className={styles.Detail}>
              <div className={cx(styles.Key, globalStyles.CustomFont2)}>
                {translate(key)}:
              </div>
              <div className={styles.Value}>{value}</div>
            </div>
          ))}
        {marker && marker.email && (
          <div className={styles.Email}>
            <a href={`mailto:${marker.email}`}>{marker.email}</a>
          </div>
        )}
      </DetailContent>
    </DetailContainer>
  </div>
);
