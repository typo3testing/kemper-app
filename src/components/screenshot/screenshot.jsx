import React from "react";
import styles from "./screenshot.css";

export const Screenshot = ({ src }) => (
  <img className={styles.screenshot} src={src} />
);
