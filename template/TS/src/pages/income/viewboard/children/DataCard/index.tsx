import * as React from "react";
import { Card } from "antd";
import CountUp from "react-countup";
import "./style.scss";
import { REQUEST_STATUS, CardType } from "./enums";

interface P {
  title: string;
  count: number | string;
  suffix?: React.ReactNode;
  type?: CardType;
}

interface S {}

class DataCard extends React.Component<P, S> {
  render() {
    const { title, count, suffix, type = CardType.DATA } = this.props;
    const decimals = type === CardType.DATA ? 0 : 3;

    return (
      <Card className="data-card">
        <div className="title">{title}</div>
        <div className="count">
          {count !== REQUEST_STATUS.FALSE ? (
            <CountUp start={0} end={count} separator="," decimals={decimals} />
          ) : (
            "--"
          )}
        </div>
      </Card>
    );
  }
}

export default DataCard;
