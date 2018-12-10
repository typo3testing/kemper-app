import React from "react";
import cx from "classnames";
import { Redirect } from "react-router";
import styles from "./calculator-result.css";
import globalStyles from "../../../css/global.css";

import { ApiService } from "../../services/ApiService";
const apiService = new ApiService();

export default class CalculatorResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product_name: "",
      product_uid: "",
      area: "",
      content: [],
      dataReady: true
    };
  }
  componentDidMount() {
    let product = sessionStorage.getItem("product");
    let area = sessionStorage.getItem("area");
    area = area.toString().replace(",", ".");

    apiService
      .getProductCalculator({ product, area })
      .then(data => {
        this.setState({ product_name: data.product_name });
        this.setState({ area: data.area });
        this.setState({ product_uid: data.product_uid });
        this.setState({ content: data.content });
        this.setState({ dataReady: false });
        console.log(data.content);
      })
      .catch(error => console.log(error));
  }

  render() {
    let contentTemplate = this.state.content.map(v => (
      <div className={cx(globalStyles.ListingResultRow)} key={v.uid}>
        <h6>
          <span>{v.name}</span>
          {v.consumption_cal} {v.consumption_unit}
        </h6>
      </div>
    ));
    if (this.state.dataReady) {
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
    return (
      <div>
        <h4>Berechnete Mengen</h4>
        <p>
          Produkt / Systemaufbau: <br />
          {this.state.product_name}
        </p>
        <p>Fläche: {this.state.area} qm</p>
        <div className={cx(globalStyles.ResultModule)}>
          <h5>Benötigte Menge</h5>
          <div className={cx(globalStyles.ListingResultModule)}>
            {contentTemplate}
          </div>
        </div>
      </div>
    );
  }
}
