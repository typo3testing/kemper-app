// IMPORT PACKAGE REFERENCES
import React, { Component } from "react";

import { Route, Redirect } from "react-router";

// IMPORT PROJECT REFERENCES
import { CurrentWeatherDisplay } from "./CurrentWeatherDisplay";
import { DailyWeatherDisplay } from "./DailyWeatherDisplay";

// IMPORT PROJECT SERVICES
import { WeatherService } from "../../services/WeatherService";
import { GeolocationService } from "../../services/GeolocationService";

import cx from "classnames";
import globalStyles from "../../../css/global.css";

// INITIALIZE SERVICES
const weatherService = new WeatherService();
const geolocationService = new GeolocationService();

class WeatherDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCurrentWeather: false,
      showDailyWeather: false,
      showAPIWeatherError: true,
      showChangeResultBox: false,
      showChangeResultContent: 1
    };

    this.handleOnRefresh = this.handleOnRefresh.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    var handleToUpdate = this.handleToUpdate.bind(this);
  }

  handleChangeLocation(event) {
    event.preventDefault();
    console.log("clicked");
  }

  componentDidMount() {
    console.log(sessionStorage.getItem("cur_local_lat"));
    console.log(sessionStorage.getItem("cur_local_long"));
    if (
      sessionStorage.getItem("cur_local_lat") != null &&
      sessionStorage.getItem("cur_local_long") != null
    ) {
      let position = {
        latitude: sessionStorage.getItem("cur_local_lat"),
        longitude: sessionStorage.getItem("cur_local_long")
      };
      this.loadCurrentWeatherByPosition(position);
      this.loadDailyWeatherByPosition(position);
    } else {
      geolocationService
        .getCurrentPosition()
        .then(position => {
          this.loadCurrentWeatherByPosition(position);
          this.loadDailyWeatherByPosition(position);
        })
        .catch(error => console.log(error));
    }
  }

  loadCurrentWeatherByPosition(position) {
    if (!position) {
      throw Error("A valid position must be specified");
    }

    weatherService
      .getCurrentWeatherByPosition(position)
      .then(weather => {
        // console.log(weather);
        this.setState(() => ({
          weather: weather,
          showCurrentWeather: true,
          showAPIWeatherError: false
        }));
      })
      .catch(error => console.log(error));
  }

  loadDailyWeatherByPosition(position) {
    if (!position) {
      throw Error("A valid position must be specified");
    }

    weatherService
      .getDailyWeatherByPosition(position)
      .then(dailyForecasts => {
        // console.log(dailyForecasts);
        this.setState(() => ({
          dailyForecasts: dailyForecasts,
          showDailyWeather: true,
          showAPIWeatherError: false
        }));
      })
      .catch(error => console.log(error));
  }

  handleOnRefresh() {
    this.setState(() => ({
      showCurrentWeather: false,
      showDailyWeather: false
    }));
    console.log(sessionStorage.getItem("cur_local_lat"));
    console.log(sessionStorage.getItem("cur_local_long"));

    if (
      sessionStorage.getItem("cur_local_lat") != null &&
      sessionStorage.getItem("cur_local_long") != null
    ) {
      let position = {
        latitude: sessionStorage.getItem("cur_local_lat"),
        longitude: sessionStorage.getItem("cur_local_long")
      };
      this.loadCurrentWeatherByPosition(position);
      this.loadDailyWeatherByPosition(position);
    } else {
      geolocationService
        .getCurrentPosition()
        .then(position => {
          this.loadCurrentWeatherByPosition(position);
          this.loadDailyWeatherByPosition(position);
        })
        .catch(error => console.log(error));
    }
  }

  handleToUpdate(someArg) {
    //console.log(someArg);
    this.setState(() => ({ showChangeResultBox: true }));
  }

  showWeather() {
    return this.state.showCurrentWeather && this.state.showDailyWeather;
  }

  showSpinner() {
    return !this.state.showCurrentWeather || !this.state.showDailyWeather;
  }

  render() {
    var handleToUpdate = this.handleToUpdate;

    if (this.state.showChangeResultBox) {
      return <Redirect push to="/city-search" />;
    }
    if (this.state.showAPIWeatherError) {
      return (
        <div className="global-WeatherWidget global-ContentPadTypeOne">
          <div className={cx(globalStyles.MainContentHolder)}>
            <div className={cx(globalStyles.WeatherWidgetPrimaryPart)}>
              <div className={cx(globalStyles.WeatherName)}>
                <div className={cx(globalStyles.CustomLoading)} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="global-WeatherForecastModule">
        {this.showWeather() && (
          <div>
            <CurrentWeatherDisplay
              weather={this.state.weather}
              onRefresh={this.handleOnRefresh}
              handleToUpdate={handleToUpdate.bind(this)}
            />
            <DailyWeatherDisplay dailyForecasts={this.state.dailyForecasts} />
          </div>
        )}
        {this.showSpinner() && (
          <div className="w-100 text-center mt-5">
            <i className="fa fa-spinner fa-spin fa-3x fa-fw" />
          </div>
        )}
      </div>
    );
  }
}

export { WeatherDashboard };
