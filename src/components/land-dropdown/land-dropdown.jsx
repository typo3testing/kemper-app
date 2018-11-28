import React from "react";
import cx from "classnames";
import { Redirect } from "react-router";
import styles from "./land-dropdown.css";
import globalStyles from "../../../css/global.css";

export default class LandDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      redirect: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("land") != "" || data.get("postalcode") != "") {
      sessionStorage.setItem("land", data.get("land"));
      sessionStorage.setItem("postalcode", data.get("postalcode"));
      this.setState({ redirect: true });
    }
  }

  componentDidMount() {
    let initialPlanets = [];
    if (sessionStorage.getItem("initialLandList") == null) {
      fetch("http://kemperol.vonuebermorgen.de/?api=kemper&action=land")
        .then(response => {
          return response.json();
        })
        .then(data => {
          initialPlanets = data.results.map(planet => {
            return planet;
          });
          sessionStorage.setItem(
            "initialLandList",
            JSON.stringify(initialPlanets)
          );
          this.setState({
            values: initialPlanets
          });
        });
    } else {
      // console.log(JSON.parse(sessionStorage.getItem('initialLandList')));
      let initialPlanets = JSON.parse(
        sessionStorage.getItem("initialLandList")
      );
      this.setState({
        values: initialPlanets
      });
    }
  }

  render() {
    let optionTemplate = this.state.values.map(v => (
      <option key={v.id} value={v.id}>
        {v.name}
      </option>
    ));

    if (this.state.redirect) {
      return <Redirect push to="/found-traders" />;
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className={cx(globalStyles.SiteFormRow, globalStyles.Clearfix)}>
            <div className={cx(globalStyles.SiteFormBlock)}>
              <label>Land</label>
              <div
                className={cx(
                  globalStyles.SiteFormField,
                  globalStyles.SelectField
                )}
              >
                <select
                  className={cx(globalStyles.NoSelectYet)}
                  name="land"
                  id="land"
                >
                  <option value="" />
                  {optionTemplate}
                </select>
              </div>
            </div>
          </div>
          <div className={cx(globalStyles.SiteFormRow, globalStyles.Clearfix)}>
            <div className={cx(globalStyles.SiteFormBlock)}>
              <label>Postleitzahl</label>
              <div className={cx(globalStyles.SiteFormField)}>
                <input
                  type="text"
                  className={cx(globalStyles.SiteFormInput)}
                  defaultValue=""
                  name="postalcode"
                  id="postalcode"
                />
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
                  value="Händler finden"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
