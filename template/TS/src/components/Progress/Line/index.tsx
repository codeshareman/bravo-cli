import * as React from "react";
import "./style.scss";

interface P {
  percent?: number;
}

class ProgressLine extends React.Component<P> {
  pgrbar: any;
  componentDidMount() {
    const { percent = 0 } = this.props;
    this.pgrbar.style.width = `${percent}%`;
    this.pgrbar.style.transition = `width 1s ease-in`;
  }

  render() {
    return (
      <div className="progress-line">
        <div ref={node => (this.pgrbar = node)} className="progress-bar" />
      </div>
    );
  }
}

export default ProgressLine;
