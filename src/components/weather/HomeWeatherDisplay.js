// IMPORT PACKAGE REFERENCES
import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import globalStyles from "../../../css/global.css";

import { TaupunktDisplay } from "./TaupunktDisplay";
import { OberflachenDisplay } from "./OberflachenDisplay";

const HomeWeatherDisplay = props => {
  const { weather } = props;

  return (
    <div className={cx(globalStyles.MainContentHolder)}>
      <div className={cx(globalStyles.WeatherWidgetPrimaryPart)}>
        <div className={cx(globalStyles.WeatherWidgetMainIcon)}>
          <i className={`weather-wi weather-wi-owm-${weather.icon}`} />
        </div>
      </div>
      <div className={cx(globalStyles.WeatherWidgetSecondaryPart)}>
        <div className={cx(globalStyles.WeatherWidgetTemp)}>
          {parseInt(weather.temperature.current)}&deg;C
        </div>
      </div>
      <div className={cx(globalStyles.WeatherWidgetBottomPart)}>
        <div className={cx(globalStyles.WeatherLink)}>
          <Link to="/weather" />
        </div>
        <div className={cx(globalStyles.WeatherCondition)}>
          <span>{weather.description}</span>
        </div>
        <div className={cx(globalStyles.WeatherPresentZone)}>
          <i />
          <span>{weather.location.name}</span>
        </div>
        <div className={cx(globalStyles.WeatherWidgetTaupunkt)}>
          Taupunkt:{" "}
          <TaupunktDisplay
            humidity={weather.temperature.humidity}
            temperature={weather.temperature.maximum}
          />
        </div>
        <div className={cx(globalStyles.WeatherWidgetTaupunkt)}>
          Oberflächentemperatur:{" "}
          <OberflachenDisplay
            humidity={weather.temperature.humidity}
            temperature={weather.temperature.maximum}
          />
        </div>
      </div>
    </div>
  );
};

HomeWeatherDisplay.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  weather: PropTypes.object.isRequired
};

export { HomeWeatherDisplay };
