// IMPORT PACKAGE REFERENCES
import React, { Component } from "react";
import cx from "classnames";
import PropTypes from "prop-types";

import globalStyles from "../../../css/global.css";

// IMPORT PROJECT REFERENCES
import { DailyWeatherForecastCard } from "./DailyWeatherForecastCard";

class DailyWeatherDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={cx(globalStyles.WeatherDetailInfoModule)}>
        <div className={cx(globalStyles.WeatherUpcomingInfoModule)}>
          <table>
            <tbody>
              {!!this.props.dailyForecasts &&
                this.props.dailyForecasts.map((fc, i) => (
                  <DailyWeatherForecastCard forecast={fc} key={i} />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

DailyWeatherDisplay.propTypes = {
  dailyForecasts: PropTypes.array.isRequired
};

export { DailyWeatherDisplay };
