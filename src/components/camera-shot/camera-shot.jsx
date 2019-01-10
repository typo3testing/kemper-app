import React from "react";
import cx from "classnames";
import styles from "./camera-shot.css";

export default class CameraShot extends React.Component {
  constructor(props) {
    super(props),
      (this.state = {
        isDrawing: false,
        lastX: 0,
        lastY: 0,
        hue: 1,
        direction: true,
        controlDisplay: "none",
        controlLeft: "100%",
        color: "#000000"
      });
    this.draw = this.draw.bind(this);
  }

  draw(e) {
    const ctx = this.ctx();
    let hue = this.state.hue;

    if (this.state.isDrawing) {
      ctx.strokeStyle = this.state.color;

      ctx.beginPath();
      ctx.moveTo(this.state.lastX, this.state.lastY);
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
      hue++;
      if (hue >= 360) {
        hue = 1;
      }
      this.setState({
        hue: hue,
        lastX: e.nativeEvent.offsetX,
        lastY: e.nativeEvent.offsetY
      });
    }
  }
  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const img = this.refs.image;
    ctx.canvas.width = 450;
    ctx.canvas.height = 350;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 450, 350);
    };
  }
  canvas() {
    return document.querySelector("#canvas");
  }
  ctx() {
    return this.canvas().getContext("2d");
  }
  render() {
    return (
      <div>
        <canvas
          id="canvas"
          ref="canvas"
          onMouseMove={this.draw}
          onMouseDown={e => {
            this.setState({
              isDrawing: true,
              lastX: e.nativeEvent.offsetX,
              lastY: e.nativeEvent.offsetY
            });
          }}
          onMouseUp={() => this.setState({ isDrawing: false })}
          onMouseOut={() => this.setState({ isDrawing: false })}
          onTouchStart={e => {
            this.setState({
              isDrawing: true,
              lastX: e.nativeEvent.offsetX,
              lastY: e.nativeEvent.offsetY
            });
          }}
          onTouchMove={this.draw}
          onTouchEnd={() => this.setState({ isDrawing: false })}
          onTouchCancel={() => this.setState({ isDrawing: false })}
        />
        <img
          ref="image"
          src={this.props.src}
          className={cx(styles.hiddenCamera)}
        />
      </div>
    );
  }
}
