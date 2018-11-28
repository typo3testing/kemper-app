import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import HeaderBar from "../../components/header-bar/header-bar";
import VersionInfo from "../../components/version-info/version-info";

import styles from "./info.css";
import globalStyles from "../../../css/global.css";

export default ({ openUrl, versionInfo, infoText }) => (
  <div
    className={cx(
      styles.Container,
      globalStyles.Background,
      globalStyles.BackgroundImage,
      globalStyles.BackgroundColor
    )}
  >
    <div className={styles.ColorUnderlay} />
    <HeaderBar goHome dark />

    <div className={cx(styles.Info)}>
      <div>{translate(infoText)}</div>
      <br />
      <h1>{translate("InfoDeveloper")}</h1>
      <div className={cx(styles.Logo)} />
      <p>
        Augmented Reality Solutions
        <br />
        <a
          className={cx(styles.Link)}
          onClick={() => openUrl("http://www.viewar.com")}
        >
          www.viewar.com
        </a>
      </p>
    </div>
    <VersionInfo className={styles.VersionInfo} />
  </div>
);
