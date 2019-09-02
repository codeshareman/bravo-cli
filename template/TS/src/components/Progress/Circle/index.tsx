import * as React from "react";

import CircleUtils from "./utils";
import "./style.scss";

interface P {
  percent?: number;
  quantity?: number;
  year?: number;
}
// 饼图进度条
class ProgressCircle extends React.Component<P> {

  componentDidMount() {
    const $pgrCircle = document.getElementsByClassName("progress-circle")[0];
    const $canvas = document.createElement("canvas");
    $canvas.width = 120;
    $canvas.height = 160;
    $pgrCircle.append($canvas);
    const configs = {
      percent: this.props.percent || 0,
      quantity: this.props.quantity || 0,
      year: this.props.year || 2019
    };
    const ProgressCircle = new CircleUtils($canvas, 50);
    ProgressCircle.init(configs);
  }

  render() {
    return <div className="progress-circle" />;
  }
}

export default ProgressCircle;
