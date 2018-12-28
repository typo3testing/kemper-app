import React from "react";
import cx from "classnames";
import { Redirect, Router } from "react-router";
import { Link } from "react-router-dom";
import styles from "./exframe.css";
import globalStyles from "../../../css/global.css";

export default class Exframe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
  }
  componentDidMount() {
    let extlink = sessionStorage.getItem("extlink");
    this.setState({ url: extlink });
  }
  render() {
    return (
      <div>
        <iframe src={this.state.url} width="100%" height="100%" />
      </div>
    );
  }
}
