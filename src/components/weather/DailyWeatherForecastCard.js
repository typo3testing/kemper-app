// IMPORT PACKAGE REFERENCES
import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import globalStyles from "../../../css/global.css";
import { TaupunktDisplay } from "./TaupunktDisplay";
import { OberflachenDisplay } from "./OberflachenDisplay";

const weekday = new Array(7);
weekday[0] = "So";
weekday[1] = "Mo";
weekday[2] = "Di";
weekday[3] = "Mi";
weekday[4] = "Do";
weekday[5] = "Fr";
weekday[6] = "Sa";

const getTime = date => {
  return `${date.getHours()}:00`;
};

const getDate = date => {
  return `${weekday[date.getDay()]}`;
};

const getSingleTime = date => {
  return `${date.getHours()}`;
};

const DailyWeatherForecastCard = ({ forecast }) => {
  if (getSingleTime(forecast.date) > 4 && getSingleTime(forecast.date) < 21) {
    return (
      <tr>
        <td>
          <input type="checkbox" />
          <div className={cx(globalStyles.TableModule)}>
            <div className={cx(globalStyles.LeftModule)}>
              <span className={cx(globalStyles.ForecastDay)}>{getDate(forecast.date)}</span>
              <small>{getTime(forecast.date)}</small>
              <i className={`weather-wi weather-wi-owm-${forecast.icon}`} />
            </div>
            <div className={cx(globalStyles.RightModule)}>
              {parseInt(forecast.temperature.maximum)}&deg; /{" "}
              {parseInt(forecast.temperature.minimum)}&deg;
            </div>
          </div>
          <div className={cx(globalStyles.AccordionModule)}>
            <p>
              <span>Taupunkt:</span>
              <TaupunktDisplay humidity={forecast.temperature.humidity} temperature={forecast.temperature.maximum} />
            </p>
            <p>
              <span>Oberflächentemperatur:</span>
              <OberflachenDisplay humidity={forecast.temperature.humidity} temperature={forecast.temperature.maximum} />
            </p>
          </div>
        </td>
      </tr>
    );
  } else {
    return null;
  }
};

DailyWeatherForecastCard.propTypes = {
  forecast: PropTypes.object.isRequired
};

export { DailyWeatherForecastCard };
