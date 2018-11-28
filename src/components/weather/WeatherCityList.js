// IMPORT PACKAGE REFERENCES
import React, { Component } from "react";

import { Route, Redirect } from "react-router";

import cx from "classnames";
import globalStyles from "../../../css/global.css";

// IMPORT PROJECT SERVICES
import { WeatherService } from "../../services/WeatherService";

// INITIALIZE SERVICES
const weatherService = new WeatherService();

class WeatherCityList extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSubmit = this.handleChangeSubmit.bind(this);
    this.state = {
      values: [],
      showChangeResultBox: false,
      newlocation: ""
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.intialSearchLoad();
  }

  intialSearchLoad() {
    let initialCity = [];
    if (sessionStorage.getItem("searchCity") != null) {
      weatherService
        .getCityList({ location: sessionStorage.getItem("searchCity") })
        .then(data => {
          initialCity = data.map(city => {
            return city;
          });
          this.setState({
            values: initialCity
          });
        })
        .catch(error => console.log(error));
    }
  }

  handleChangeSubmit(event) {
    event.preventDefault();
    if (this.state.newlocation != "") {
      sessionStorage.setItem("searchCity", this.state.newlocation);
      this.intialSearchLoad();
    }
  }

  handleClick(lat, long) {
    sessionStorage.setItem("cur_local_lat", lat);
    sessionStorage.setItem("cur_local_long", long);
    this.setState(() => ({ showChangeResultBox: true }));
  }

  render() {
    if (this.state.showChangeResultBox) {
      return <Redirect push to="/weather" />;
    }

    return (
      <div
        className={cx(
          globalStyles.WeatherCityList,
          globalStyles.SiteFormModule
        )}
      >
        <div
          className={cx(globalStyles.Element, globalStyles.ElementGapMedium)}
        >
          <div className={cx(globalStyles.SiteFormRow, globalStyles.Clearfix)}>
            <div className={cx(globalStyles.SiteFormBlock)}>
              <div className={cx(globalStyles.SiteFormField)}>
                <input
                  type="text"
                  defaultValue={sessionStorage.getItem("searchCity")}
                  onChange={e => {
                    this.setState({ newlocation: e.target.value });
                  }}
                  className={cx(globalStyles.SiteFormInput)}
                  name="newlocation"
                  id="newlocation"
                />
              </div>
            </div>
          </div>
          <div className={cx(globalStyles.SiteFormRow, globalStyles.Clearfix)}>
            <div className={cx(globalStyles.SiteFormBlock)}>
              <div className={cx(globalStyles.SiteFormField)}>
                <input
                  type="submit"
                  className={cx(
                    globalStyles.SiteFormButton,
                    globalStyles.PageButton,
                    globalStyles.PrimaryColorButton,
                    globalStyles.BlockButton
                  )}
                  value="Finden"
                  onClick={this.handleChangeSubmit}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={cx(globalStyles.Element, globalStyles.ElementGapMedium)}
        >
          <div className={cx(globalStyles.WeatherUpcomingInfoModule)}>
            <table>
              <tbody>
                {!!this.state.values &&
                  this.state.values.map((fc, i) => (
                    <tr
                      onClick={() =>
                        this.handleClick(fc.latitude, fc.longitude)
                      }
                      key={i}
                    >
                      <td>
                        {fc.name}, {fc.country}
                      </td>
                      <td>
                        {parseInt(fc.temperature.maximum)}&deg; /{" "}
                        {parseInt(fc.temperature.minimum)}&deg;
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export { WeatherCityList };
