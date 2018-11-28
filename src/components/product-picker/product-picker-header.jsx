import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import DetailHeader from "../detail-header/detail-header.js";

import styles from "./product-picker.css";
import globalStyles from "../../../css/global.css";

import Button from "../../components/button/button";
import { isEdge, isEdgeBrowser } from "../../utils/is-edge";

export default ({
  query,
  setQuery,
  goUp,
  isRootCategory,
  category,
  searchVisible,
  toggleSearch
}) => (
  <DetailHeader className={styles.Header}>
    {(!isRootCategory() || searchVisible) && (
      <BackButton
        icon={"back"}
        onClick={searchVisible ? toggleSearch : goUp}
        className={cx(
          styles.HeaderButton,
          styles.HeaderButtonBack,
          globalStyles.ButtonColor2,
          globalStyles.BorderDark,
          globalStyles.ButtonImage,
          globalStyles.BackgroundDark
        )}
      />
    )}
    {searchVisible && (
      <div className={cx(styles.SearchProduct)}>
        <input
          type="text"
          value={query}
          onChange={({ target }) => setQuery(target.value)}
          className={globalStyles.CustomFont2}
          placeholder={translate("ProductPickerSearchPlaceholder", false)}
        />
      </div>
    )}
    {!searchVisible && (
      <div className={styles.Title}>
        {isRootCategory() ? translate("ProductPickerTitle") : category.name}
      </div>
    )}
    {isEdgeBrowser ? (
      <Button
        icon={"search"}
        className={cx(
          styles.HeaderButton,
          styles.HeaderButtonSearch,
          globalStyles.ButtonImage,
          globalStyles.ButtonColor2
        )}
        onClick={toggleSearch}
      />
    ) : (
      <div
        className={cx(
          styles.HeaderButton,
          styles.HeaderButtonSearch,
          globalStyles.ButtonImage,
          globalStyles.ButtonColor2
        )}
        onClick={toggleSearch}
      />
    )}
  </DetailHeader>
);

const BackButton = isEdge(Button)(props => <div {...props} />);
