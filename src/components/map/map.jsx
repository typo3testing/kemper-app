import React from "react";
import cx from "classnames";

import styles from "./map.css";
import globalStyles from "../../../css/global.css";

import GoogleMapReact from "google-map-react";

// Note: Always set height explicitly on parent div so that the map will be displayed.
// Use children to render any type of marker or objects (with props lat, lng and text)
export default ({
  children,
  key,
  language,
  center,
  defaultCenter,
  initialised,
  zoom,
  className
}) => (
  <div className={cx(styles.Container, className)}>
    {initialised && (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyD61f8082DHyEaBV0lzGzSKsFWby9L1f2w",
          language
        }}
        defaultCenter={defaultCenter}
        center={center}
        defaultZoom={zoom}
      >
        {children}
      </GoogleMapReact>
    )}
  </div>
);
