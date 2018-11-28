import React from "react";
import cx from "classnames";

import ProductImage from "../../components/product-image/product-image";
import DetailContent from "../detail-content/detail-content.js";

import styles from "./product-picker.css";
import globalStyles from "../../../css/global.css";

export default ({ category, insertModel }) => (
  <DetailContent>
    <div className={styles.Products}>
      {category.children &&
        category.children.map((child, index) => (
          <ProductImage
            model={child}
            onClick={() => insertModel(child)}
            key={index}
            className={cx(styles.Product, globalStyles.BorderDark)}
          />
        ))}
    </div>
  </DetailContent>
);
