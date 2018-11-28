import React from "react";
import cx from "classnames";
import { Redirect } from "react-router";
import styles from "./process-area.css";
import globalStyles from "../../../css/global.css";

export default class ProcessArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: "",
      dataReady: true
    };
  }
  componentDidMount() {
    var initialPoints = sessionStorage.getItem("initialPoints");
    if (initialPoints != "") {
      var points = JSON.parse(sessionStorage.getItem("initialPoints"));
      var l = points.length;
      var det = 0;
      if (points[0] != points[points.length - 1])
        points = points.concat(points[0]);

      for (var i = 0; i < l; i++)
        det += points[i].x * points[i + 1].y - points[i].y * points[i + 1].x;

      var area = Math.abs(det) / 2;
      area = area / 1000000;
      area = area.toFixed(2);
      var displayArea = area.toString().replace(".", ",");
      this.setState({ points: displayArea });
      sessionStorage.setItem("area_capture", displayArea);
    }
  }

  render() {
    return <i>{this.state.points} qm</i>;
  }
}
