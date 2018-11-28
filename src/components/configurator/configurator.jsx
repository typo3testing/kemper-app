import React from "react";
import cx from "classnames";

import PropertyPicker from "../property-picker/property-picker";
import PropertyList from "../property-list/property-list";
import PropertyWidget from "../property-widget/property-widget";

import styles from "./configurator.css";

import viewStyles from "../../views/views.css";

export default ({
  properties,
  activeProperty,
  setValues,
  showPropertyList,
  setActiveProperty,
  className,
  widgetClassName,
  instance
}) => (
  <div className={cx(styles.Container, className)}>
    {showPropertyList ? (
      <PropertyList
        properties={properties}
        activeProperty={activeProperty}
        setActiveProperty={setActiveProperty}
        className={viewStyles.ConfiguratorList}
      />
    ) : (
      <PropertyPicker
        properties={properties}
        activeProperty={activeProperty}
        setActiveProperty={setActiveProperty}
        className={viewStyles.ConfiguratorPicker}
      />
    )}
    <PropertyWidget
      property={activeProperty}
      setValues={setValues}
      className={widgetClassName}
      configuration={instance}
    />
  </div>
);
