import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import DetailContainer from "../detail-container/detail-container.js";
import DetailHeader from "../detail-header/detail-header.js";
import DetailContent from "../detail-content/detail-content.js";

import styles from "./product-info.css";
import globalStyles from "../../../css/global.css";

export default ({ header, content, className, instance, gapOffset }) => (
  <div className={cx(styles.Container, className)}>
    <DetailContainer gap={"left" + (2 + gapOffset)}>
      <DetailHeader>
        {instance && instance.model && instance.model.name}
      </DetailHeader>
      <DetailContent className={styles.Content}>
        <div className={styles.Description}>
          {instance &&
            instance.model &&
            instance.model.info &&
            translate(
              instance.model.info.description || "ProductInfoUnavailable"
            )}
        </div>
      </DetailContent>
    </DetailContainer>
  </div>
);
