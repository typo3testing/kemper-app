import React, { Fragment } from "react";
import cx from "classnames";

import HeaderBar from "../../components/header-bar/header-bar";

import styles from "./custom-page.css";
import globalStyles from "../../../css/global.css";

export default ({ embedUrl, type, marker, setActiveMarker, activeMarker }) => (
  <div className={cx(styles.Container)}>
    <HeaderBar goBack dark className={styles.HeaderBar} />

    {embedUrl && (
      <Fragment>
        <div className={cx(styles.IframeContainer)}>
          <iframe className={styles.Iframe} src={embedUrl} />
        </div>
      </Fragment>
    )}
  </div>
);
