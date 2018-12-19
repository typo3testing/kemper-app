// IMPORT PACKAGE REFERENCES
import React, { Component } from "react";
import cx from "classnames";
import PropTypes from "prop-types";

import { Route, Redirect } from "react-router";

import globalStyles from "../../../css/global.css";

import { TaupunktDisplay } from "./TaupunktDisplay";
import { OberflachenDisplay } from "./OberflachenDisplay";

// IMPORT PROJECT SERVICES
import { WeatherService } from "../../services/WeatherService";

// INITIALIZE SERVICES
const weatherService = new WeatherService();

class CurrentWeatherDisplay extends Component {
  constructor(props) {
    super(props);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleChangeSubmit = this.handleChangeSubmit.bind(this);
    this.handleCancelChangeLocation = this.handleCancelChangeLocation.bind(
      this
    );

    this.state = {
      showChangeBox: false,
      showChangeResultBox: false,
      newlocation: ""
    };
  }
  handleChangeLocation(event) {
    event.preventDefault();
    console.log("clicked");
    this.setState(() => ({ showChangeBox: true }));
  }
  handleChangeSubmit(event) {
    event.preventDefault();
    console.log("Submit");
    console.log(this.state.newlocation);
    if (this.state.newlocation != "") {
      sessionStorage.setItem("searchCity", this.state.newlocation);
      var handleToUpdate = this.props.handleToUpdate;
      handleToUpdate(true);
    }
  }
  handleCancelChangeLocation(event) {
    event.preventDefault();
    console.log("Cancel");
    this.setState(() => ({ showChangeBox: false }));
  }
  render() {
    const { weather } = this.props;
    const changeClick = this.state.showChangeBox;
    let heading;
    if (changeClick) {
      heading = (
        <tr>
          <th colSpan={2}>
            <input
              type="text"
              value={this.state.newlocation}
              onChange={e => {
                this.setState({ newlocation: e.target.value });
              }}
              className={cx(globalStyles.SiteFormInput)}
              name="newlocation"
              id="newlocation"
            />
            <span onClick={this.handleChangeSubmit}>Submit</span>
            <span onClick={this.handleCancelChangeLocation}>Cancel</span>
          </th>
        </tr>
      );
    } else {
      heading = (
        <tr>
          <th />
          <th>
            <span className={cx(globalStyles.CurrentLocation)}>
              <i>{weather.location.name}</i>
            </span>
            <span
              className={cx(globalStyles.ChangeLocation)}
              onClick={this.handleChangeLocation}
            />
          </th>
        </tr>
      );
    }

    return (
      <div className={cx(globalStyles.WeatherForecastModule)}>
        <div className={cx(globalStyles.WeatherWidget)}>
          <div className={cx(globalStyles.WeatherWidgetPrimaryPart)}>
            <div className={cx(globalStyles.WeatherWidgetMainIcon)}>
              <i className={`weather-wi weather-wi-owm-${weather.icon}`} />
            </div>
            <div className={cx(globalStyles.Clear)} />
            <div className={cx(globalStyles.WeatherWidgetTemp)}>
              {parseInt(weather.temperature.current)}&deg;C
            </div>
          </div>
          <div className={cx(globalStyles.WeatherWidgetSecondaryPart)}>
            <div className={cx(globalStyles.WeatherCondition)}>
              <span className={cx(globalStyles.BestCondition)}>
                {weather.description}
              </span>
            </div>
          </div>
        </div>
        <div className={cx(globalStyles.WeatherDetailInfoModule)}>
          <div className={cx(globalStyles.WeatherPrimaryDetailInfo)}>
            <table>
              <thead>{heading}</thead>
              <tbody>
                <tr>
                  <td>Taupunkt</td>
                  <td><TaupunktDisplay humidity={weather.temperature.humidity} temperature={weather.temperature.maximum} /></td>
                </tr>
                <tr>
                  <td>Oberflächentemperatur</td>
                  <td><OberflachenDisplay humidity={weather.temperature.humidity} temperature={weather.temperature.maximum} /></td>
                </tr>
                <tr>
                  <td>Niederschlag</td>
                  <td>{weather.rain}%</td>
                </tr>
                <tr>
                  <td>Feuchtigkeit</td>
                  <td>{weather.temperature.humidity}%</td>
                </tr>
                <tr>
                  <td>Wind</td>
                  <td>{weather.wind.speed}km/h</td>
                </tr>
                <tr>
                  <td>Tiefsttemperatur</td>
                  <td>{parseInt(weather.temperature.minimum)}&deg;C</td>
                </tr>
                <tr>
                  <td>Höchsttemperatur</td>
                  <td>{parseInt(weather.temperature.maximum)}&deg;C</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

CurrentWeatherDisplay.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  weather: PropTypes.object.isRequired
};

export { CurrentWeatherDisplay };
