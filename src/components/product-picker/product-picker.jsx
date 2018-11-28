import React, { Fragment } from "react";
import cx from "classnames";

import styles from "./product-picker.css";
import globalStyles from "../../../css/global.css";

import Button from "../../components/button/button";
import ProductPickerHeader from "./product-picker-header.jsx";
import CategoryPicker from "./category-picker.jsx";
import ModelPicker from "./model-picker.jsx";
import CeilingCapture from "../ceiling-capture/ceiling-capture.js";
import WallCapture from "../wall-capture/wall-capture.js";

import DetailContainer from "../detail-container/detail-container.js";
import DetailHeader from "../detail-header/detail-header.js";

import { isEdgeBrowser } from "../../utils/is-edge";

import viewStyles from "../../views/views.css";

export default ({
  query,
  updateQuery,
  goUp,
  className,
  isRootCategory,
  category,
  openCategory,
  containsModels,
  productButtonHidden,
  productPickerVisible,
  insertModel,
  searchVisible,
  toggleSearch,
  ceilingModel,
  wallModel,
  toggleProductPicker,
  setCeilingModel,
  setWallModel,
  showCategoryImages
}) => (
  <Fragment>
    <Button
      active={productPickerVisible}
      withBackground={isEdgeBrowser && productPickerVisible}
      onClick={toggleProductPicker}
      icon={"addProduct"}
      className={cx(
        viewStyles.ProductPickerButton,
        (productButtonHidden || ceilingModel || wallModel) && viewStyles.hidden
      )}
    />

    <div
      className={cx(
        styles.Container,
        className,
        !productPickerVisible && styles.hidden
      )}
    >
      {ceilingModel && (
        <CeilingCapture
          ceilingModel={ceilingModel}
          close={() => setCeilingModel(null)}
          toggleProductPicker={toggleProductPicker}
        />
      )}
      {wallModel && (
        <WallCapture
          wallModel={wallModel}
          close={() => setWallModel(null)}
          toggleProductPicker={toggleProductPicker}
        />
      )}
      {!(ceilingModel || wallModel) && (
        <DetailContainer gap="right1">
          <ProductPickerHeader
            query={query}
            setQuery={updateQuery}
            goUp={goUp}
            isRootCategory={isRootCategory}
            category={category}
            searchVisible={searchVisible}
            toggleSearch={toggleSearch}
          />
          {!containsModels ? (
            <CategoryPicker
              category={category}
              showCategoryImages={showCategoryImages}
              openCategory={openCategory}
            />
          ) : (
            <ModelPicker category={category} insertModel={insertModel} />
          )}
        </DetailContainer>
      )}
    </div>
  </Fragment>
);
