import React from "react";
import cx from "classnames";
import { Redirect, Router } from "react-router";
import { Link } from "react-router-dom";
import styles from "./haftzugmessung-calculation.css";
import globalStyles from "../../../css/global.css";

import { ApiService } from "../../services/ApiService";

const apiService = new ApiService();
export default class HaftzugmessungCalculation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [],
      dataReady: true,
      redirect: false
    };
    this.loadLink = this.loadLink.bind(this);
  }
  loadLink(link) {
    sessionStorage.setItem("extlink", link);
    this.setState({ redirect: true });
  }
  componentDidMount() {
    let manufacturer = sessionStorage.getItem("manufacturer");
    let designation = sessionStorage.getItem("designation");
    let initialPlanets = [];
    apiService
      .getDesignationCategory({ designation })
      .then(data => {
        initialPlanets = data.map(planet => {
          return planet;
        });
        this.setState({ content: initialPlanets });
        this.setState({ dataReady: false });
        console.log(initialPlanets);
      })
      .catch(error => console.log(error));
  }

  render() {
    let contentTemplate = this.state.content.map(v => (
      <div className={cx(globalStyles.LinkBox)} key={v.id}>
        <div
          className={cx(
            globalStyles.LinkBoxElement,
            globalStyles.LinkBoxPrimaryPart
          )}
        >
          <a onClick={() => this.loadLink(v.url)} href="#">
            <div className={cx(globalStyles.MainWrap)}>{v.category}</div>
          </a>
        </div>
        <div
          className={cx(
            globalStyles.LinkBoxElement,
            globalStyles.LinkBoxSecondaryPart
          )}
        >
          <div className={cx(globalStyles.MainWrap)}>{v.title}</div>
        </div>
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
    if (this.state.redirect) {
      return <Redirect push to="/extpage" />;
    }
    return (
      <div>
        <div className={cx(globalStyles.LinkBoxModule)}>{contentTemplate}</div>
      </div>
    );
  }
}
