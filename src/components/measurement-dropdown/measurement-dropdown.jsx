import React from "react";
import cx from "classnames";
import { Redirect } from "react-router";
import styles from "./measurement-dropdown.css";
import globalStyles from "../../../css/global.css";

import { ApiService } from "../../services/ApiService";
const apiService = new ApiService();
export default class MeasurementDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manufacturerValues: [],
      designationValues: [],
      redirect: false,
      preloader: true,
      manufacturer: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ designationValues: [] });
    let manufacturer = event.target.value;
    let initialPlanets = [];
    if (manufacturer != "") {
      this.setState({ preloader: true });
      apiService.getDesignation({ manufacturer }).then(data => {
        initialPlanets = data.map(planet => {
          return planet;
        });
        this.setState({
          designationValues: initialPlanets
        });
        this.setState({ preloader: false });
        this.setState({ manufacturer: manufacturer });
      });
    } else {
      this.setState({
        designationValues: initialPlanets
      });
      this.setState({ manufacturer: "" });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("manufacturer") != "" && data.get("designation") != "") {
      sessionStorage.setItem("manufacturer", data.get("manufacturer"));
      sessionStorage.setItem("designation", data.get("designation"));
      this.setState({ redirect: true });
    }
  }

  componentDidMount() {
    let initialPlanets = [];
    if (sessionStorage.getItem("initialManufacturerList") == null) {
      apiService
        .getManufacturer()
        .then(data => {
          initialPlanets = data.map(planet => {
            return planet;
          });
          sessionStorage.setItem(
            "initialManufacturerList",
            JSON.stringify(initialPlanets)
          );
          this.setState({
            manufacturerValues: initialPlanets
          });
          this.setState({ preloader: false });
        })
        .catch(error => console.log(error));
    } else {
      // console.log(JSON.parse(sessionStorage.getItem('initialManufacturerList')));
      let initialPlanets = JSON.parse(
        sessionStorage.getItem("initialManufacturerList")
      );
      this.setState({
        manufacturerValues: initialPlanets
      });
      this.setState({ preloader: false });
    }
  }

  render() {
    if (this.state.preloader) {
      return (
        <div
          className={cx(
            globalStyles.CustomLoading,
            globalStyles.PullTextCenter
          )}
        >
          <div className={cx(globalStyles.Tablewrap)}>
            <div
              className={cx(
                globalStyles.Tablecell,
                globalStyles.Tablemiddleline
              )}
            >
              Wird geladen...
            </div>
          </div>
        </div>
      );
    }

    let optionManufacturerTemplate = this.state.manufacturerValues.map(v => (
      <option key={v.id} value={v.id}>
        {v.name}
      </option>
    ));
    let optionDesignationTemplate = this.state.designationValues.map(v => (
      <option key={v.id} value={v.id}>
        {v.name}
      </option>
    ));

    if (this.state.redirect) {
      return <Redirect push to="/haftzugmessung" />;
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className={cx(globalStyles.SiteFormRow, globalStyles.Clearfix)}>
            <div className={cx(globalStyles.SiteFormBlock)}>
              <label>Hersteller</label>
              <div
                className={cx(
                  globalStyles.SiteFormField,
                  globalStyles.SelectField
                )}
              >
                <select
                  className={cx(globalStyles.NoSelectYet)}
                  name="manufacturer"
                  id="manufacturer"
                  onChange={this.handleChange}
                  value={this.state.manufacturer}
                >
                  <option value="" />
                  {optionManufacturerTemplate}
                </select>
              </div>
            </div>
          </div>
          <div className={cx(globalStyles.SiteFormRow, globalStyles.Clearfix)}>
            <div className={cx(globalStyles.SiteFormBlock)}>
              <label>Bezeichnung der Bahn</label>
              <div
                className={cx(
                  globalStyles.SiteFormField,
                  globalStyles.SelectField
                )}
              >
                <select
                  className={cx(globalStyles.NoSelectYet)}
                  name="designation"
                  id="designation"
                >
                  <option value="" />
                  {optionDesignationTemplate}
                </select>
              </div>
            </div>
          </div>

          <div
            className={cx(
              globalStyles.SiteFormRow,
              globalStyles.Clearfix,
              globalStyles.SiteSubmitRow
            )}
          >
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
                  value="Haftzugmessung"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
