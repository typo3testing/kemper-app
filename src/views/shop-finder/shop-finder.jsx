import React, { Fragment } from "react";
import cx from "classnames";

import { translate } from "../../services";

import HeaderBar from "../../components/header-bar/header-bar";
import Map from "../../components/map/map";
import MapMarker from "../../components/map-marker/map-marker";
import Button from "../../components/button/button";
import SelectedMarker from "./selected-marker.jsx";

import styles from "./shop-finder.css";
import globalStyles from "../../../css/global.css";

export default ({ url, type, marker, setActiveMarker, activeMarker }) => (
  <div className={cx(styles.Container)}>
    <HeaderBar goHome dark className={styles.HeaderBar} />

    {url && (
      <Fragment>
        <Fragment>
          <Map className={styles.Map}>
            {marker.map((marker, index) => (
              <MapMarker
                lat={marker.position.lat}
                lng={marker.position.lng}
                icon={marker.icon}
                text={marker.name}
                key={index}
                onSelect={() => setActiveMarker(marker)}
              />
            ))}
          </Map>
          <SelectedMarker marker={activeMarker} visible={activeMarker} />
          <Button
            onClick={() => setActiveMarker(null)}
            icon={"close"}
            className={styles.CloseMarker}
            hidden={!activeMarker}
            active={true}
          />
        </Fragment>
      </Fragment>
    )}
  </div>
);
