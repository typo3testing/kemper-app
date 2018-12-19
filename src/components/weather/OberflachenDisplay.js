// IMPORT PACKAGE REFERENCES
import React, { Component } from "react";
import cx from "classnames";
import globalStyles from "../../../css/global.css";
import PropTypes from "prop-types";

class OberflachenDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oberflachen: 0
    };
  }
  componentDidMount() {
    this.setState({
      oberflachen: parseFloat(
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

    var Oberflachen = (b * c) / (a - c) + 3;

    return Oberflachen;
  }

  render() {
    return <span>{this.state.oberflachen}&deg;C</span>;
  }
}

OberflachenDisplay.propTypes = {
  temperature: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired
};
export { OberflachenDisplay };
