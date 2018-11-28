// IMPORT PACKAGE REFERENCES
import React, { Component } from "react";
import cx from "classnames";
import globalStyles from "../../../css/global.css";
import PropTypes from "prop-types";

class TaupunktDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taupunkt: 0
    };
  }
  componentDidMount() {
    this.setState({
      taupunkt: parseFloat(
        this.RHtoDP(this.props.temperature, this.props.humidity)
      ).toFixed(1)
    });
  }
  SDD(T) {
    var a, b;
    if (T >= 0) {
      a = 7.5;
      b = 237.3;
    } else {
      a = 7.6;
      b = 240.7;
    }

    var sdd = 6.1078 * Math.exp((a * T) / (b + T) / Math.LOG10E);

    return sdd;
  }
  DD(T, r) {
    var sdd = this.SDD(T);
    var dd = (r / 100) * sdd;

    return dd;
  }
  RHtoDP(T, r) {
    var dd = this.DD(T, r);
    var a, b;

    if (T >= 0) {
      a = 7.5;
      b = 237.3;
    } else {
      a = 7.6;
      b = 240.7;
    }

    var c = Math.log(dd / 6.1078) * Math.LOG10E;

    var Taupunkt = (b * c) / (a - c);

    return Taupunkt;
  }

  render() {
    return <span>{this.state.taupunkt}&deg;C</span>;
  }
}

TaupunktDisplay.propTypes = {
  temperature: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired
};
export { TaupunktDisplay };
