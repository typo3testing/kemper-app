import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import Currency from "../../components/currency/currency";
import ProductImage from "../../components/product-image/product-image";
import DetailContainer from "../detail-container/detail-container.js";
import DetailHeader from "../detail-header/detail-header.js";
import DetailContent from "../detail-content/detail-content.js";
import DetailFooter from "../detail-footer/detail-footer.js";
import Button from "../button/button.js";

import styles from "./shopping-cart.css";
import globalStyles from "../../../css/global.css";

export default ({
  checkout,
  shoppingCartManager,
  onClose,
  className,
  sum,
  items,
  hidden,
  increaseItemAmount,
  decreaseItemAmount,
  gapPosition
}) => (
  <div className={cx(styles.Container, className)}>
    <DetailContainer
      gap={`right${gapPosition}`}
      className={styles[`DetailContainer-gap${gapPosition}`]}
    >
      <DetailHeader className={styles.DetailHeader}>
        <div className={styles.Title}>{translate("ShoppingCartTitle")}</div>
        {/*<Button className={styles.ButtonShare} icon="share_outline" dark />*/}
      </DetailHeader>

      <DetailContent>
        <div className={styles.ItemsContainer}>
          <div className={styles.Items}>
            {!items.length && (
              <div className={styles.Empty}>
                {translate("ShoppingCartEmpty")}
              </div>
            )}
            {items.map((item, index) => (
              <div
                className={cx(styles.Item, globalStyles.BorderDark)}
                key={index}
              >
                <div className={styles.ContentWrapper}>
                  <div className={styles.Content}>
                    <ProductImage
                      model={item}
                      className={styles.Image}
                      hideName
                    />
                    <div className={styles.Details}>
                      <div
                        className={cx(
                          styles.ProductName,
                          globalStyles.CustomFont2
                        )}
                      >
                        {item.name}
                      </div>
                      <div className={styles.ArticleNumber}>12346234</div>
                      <div className={styles.Amount}>
                        <Button
                          icon="add_outline"
                          dark
                          className={styles.Add}
                          onClick={() => increaseItemAmount(item)}
                        />
                        <div
                          className={cx(styles.Number, globalStyles.BorderDark)}
                        >
                          {item.amount}
                        </div>
                        <div className={styles.Filler} />
                        <Button
                          icon="remove_outline"
                          dark
                          className={styles.Remove}
                          onClick={() => decreaseItemAmount(item)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.ContentWrapper}>
                  <div className={styles.Content}>
                    <div className={styles.Properties}>
                      {Object.entries(item.propertyValues).map(
                        ([key, value], index) => (
                          <div className={styles.Property} key={index}>
                            <div className={styles.Name}>
                              <div className={styles.Key}>{key}</div>
                              {/*<div className={styles.Colon}>:</div>*/}
                            </div>
                            <div
                              className={cx(
                                styles.Value,
                                globalStyles.CustomFont2
                              )}
                            >
                              {value}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className={cx(styles.Price)}>
                  {!!item.price && <Currency value={item.price} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DetailContent>
      <DetailFooter className={styles.DetailFooter}>
        {!!items.length && shoppingCartManager.checkoutUrl && (
          <div onClick={() => checkout()} className={globalStyles.Button}>
            {translate("ShoppingCartBuy")}
          </div>
        )}
        <div className={styles.TotalSum}>
          <div className={styles.TotalSumValue}>
            {translate("ShoppingCartTotal")}
          </div>
          <Currency value={sum} />
        </div>
      </DetailFooter>
    </DetailContainer>
  </div>
);
