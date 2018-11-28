import React from "react";
import cx from "classnames";

import ProductImage from "../../components/product-image/product-image";
import DetailContent from "../detail-content/detail-content.js";

import styles from "./product-picker.css";
import globalStyles from "../../../css/global.css";

export default ({ category, openCategory, showCategoryImages }) => (
  <DetailContent className={styles.CategoryPicker}>
    {!showCategoryImages && (
      <div className={styles.Categories}>
        {category.children &&
          category.children.map((child, index) => (
            <div
              className={cx(styles.Category, globalStyles.BorderDark)}
              onClick={() => openCategory(child)}
              key={index}
            >
              {child.name}
            </div>
          ))}
      </div>
    )}
    {showCategoryImages && (
      <div className={styles.Products}>
        {category.children &&
          category.children.map((child, index) => (
            <ProductImage
              model={child}
              onClick={() => openCategory(child)}
              key={index}
              className={cx(styles.Product, globalStyles.BorderDark)}
            />
          ))}
      </div>
    )}
  </DetailContent>
);
