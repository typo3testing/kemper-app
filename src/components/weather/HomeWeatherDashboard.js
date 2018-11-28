// IMPORT PACKAGE REFERENCES
import React, { Component } from "react";

// IMPORT PROJECT REFERENCES
import { HomeWeatherDisplay } from "./HomeWeatherDisplay";

// IMPORT PROJECT SERVICES
import { WeatherService } from "../../services/WeatherService";
import { GeolocationService } from "../../services/GeolocationService";

import cx from "classnames";
import globalStyles from "../../../css/global.css";

// INITIALIZE SERVICES
const weatherService = new WeatherService();
const geolocationService = new GeolocationService();

class HomeWeatherDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCurrentWeatherHome: false,
      showAPIWeatherError: true
    };

    this.handleOnRefresh = this.handleOnRefresh.bind(this);
  }

  componentDidMount() {
    console.log(sessionStorage.getItem("local_lat"));
    console.log(sessionStorage.getItem("local_long"));
    if (
      sessionStorage.getItem("local_lat") != null &&
      sessionStorage.getItem("local_long") != null
    ) {
      let position = {
        latitude: sessionStorage.getItem("local_lat"),
        longitude: sessionStorage.getItem("local_long")
      };
      this.loadCurrentWeatherHomeByPosition(position);
    } else {
      geolocationService
        .getCurrentPosition()
        .then(position => {
          this.loadCurrentWeatherHomeByPosition(position);
        })
        .catch(error => console.log(error));
    }
  }

  loadCurrentWeatherHomeByPosition(position) {
    if (!position) {
      throw Error("A valid position must be specified");
    }

    weatherService
      .getCurrentWeatherHomeByPosition(position)
      .then(weather => {
        console.log(weather);
        this.setState(() => ({
          weather: weather,
          showCurrentWeatherHome: true,
          showAPIWeatherError: false
        }));
      })
      .catch(error => console.log(error));
  }

  handleOnRefresh() {
    this.setState(() => ({
      showCurrentWeatherHome: false
    }));

    console.log(sessionStorage.getItem("local_lat"));
    console.log(sessionStorage.getItem("local_long"));
    if (
      sessionStorage.getItem("local_lat") != null &&
      sessionStorage.getItem("local_long") != null
    ) {
      console.log(sessionStorage.getItem("local_lat"));
      let position = {
        latitude: sessionStorage.getItem("local_lat"),
        longitude: sessionStorage.getItem("local_long")
      };
      this.loadCurrentWeatherHomeByPosition(position);
    } else {
      geolocationService
        .getCurrentPosition()
        .then(position => {
          this.loadCurrentWeatherHomeByPosition(position);
        })
        .catch(error => console.log(error));
    }
  }

  showWeather() {
    return this.state.showCurrentWeatherHome;
  }

  showSpinner() {
    return !this.state.showCurrentWeatherHome;
  }

  render() {
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
      <div className="global-WeatherWidget global-ContentPadTypeOne">
        {this.showWeather() && (
          <div>
            <HomeWeatherDisplay
              weather={this.state.weather}
              onRefresh={this.handleOnRefresh}
            />
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

export { HomeWeatherDashboard };
