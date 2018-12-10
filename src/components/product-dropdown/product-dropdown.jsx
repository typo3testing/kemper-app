import React from "react";
import cx from "classnames";
import { Redirect } from "react-router";
import styles from "./product-dropdown.css";
import globalStyles from "../../../css/global.css";

export default class ProductDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      redirect: false,
      area_capture: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get("product") != "" && data.get("area") != "") {
      sessionStorage.setItem("product", data.get("product"));
      sessionStorage.setItem("area", data.get("area"));
      this.setState({ redirect: true });
    }
  }
  handleClick() {
    console.log("hello");
  }

  componentDidMount() {
    let initialPlanets = [];
    if (sessionStorage.getItem("initialProductList") == null) {
      console.log(
        "https://kemperol.kemper-system.de/?api=kemper&action=product"
      );
      fetch("https://kemperol.kemper-system.de/?api=kemper&action=product")
        .then(response => {
          return response.json();
        })
        .then(data => {
          initialPlanets = data.results.map(planet => {
            return planet;
          });
          sessionStorage.setItem(
            "initialProductList",
            JSON.stringify(initialPlanets)
          );
          this.setState({
            values: initialPlanets
          });
        });
    } else {
      // console.log(JSON.parse(sessionStorage.getItem('initialProductList')));
      let initialPlanets = JSON.parse(
        sessionStorage.getItem("initialProductList")
      );
      this.setState({
        values: initialPlanets
      });
    }
    this.setState({ area_capture: sessionStorage.getItem("area_capture") });
    // this.setState({area_capture: 'ok'});
  }

  renderSublist(lists) {
    return lists.map(list => {
      return (
        <option key={list.id} value={list.id}>
          {list.name}
        </option>
      );
    });
  }
  render() {
    let optionTemplate = this.state.values.map(v => (
      <optgroup key={v.title} label={v.title}>
        {this.renderSublist(v.child)}
      </optgroup>
    ));

    if (this.state.redirect) {
      return <Redirect push to="/calculated-quantities" />;
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className={cx(globalStyles.SiteFormRow, globalStyles.Clearfix)}>
            <div className={cx(globalStyles.SiteFormBlock)}>
              <label>Product / Systemaufbau</label>
              <div
                className={cx(
                  globalStyles.SiteFormField,
                  globalStyles.SelectField
                )}
              >
                <select
                  className={cx(globalStyles.NoSelectYet)}
                  name="product"
                  id="product"
                >
                  <option value="" />
                  {optionTemplate}
                </select>
              </div>
            </div>
          </div>
          <div className={cx(globalStyles.SiteFormRow, globalStyles.Clearfix)}>
            <div className={cx(globalStyles.SiteFormBlock)}>
              <label>Fläche</label>
              <div
                className={cx(
                  globalStyles.SiteFormField,
                  globalStyles.HasInputLegend
                )}
              >
                <input
                  type="text"
                  key={this.state.area_capture}
                  className={cx(globalStyles.SiteFormInput)}
                  defaultValue={this.state.area_capture}
                  name="area"
                  id="area"
                />
                <div className={cx(globalStyles.InputLegend)}>
                  <span>qm</span>
                </div>
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
                  value="Berechnen"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
