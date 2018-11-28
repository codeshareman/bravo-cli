import React, { PureComponent } from "react";
import { Row, Col } from "antd";
import "./index.scss";
// bussiness components
import BroccoliChart from "@/components/BroccoliChart";

class ChartLayout extends PureComponent {
  render() {
    const { PieChart, BarChart } = BroccoliChart;
    return (
      <div>
        <Row type="flex" justify="start" gutter={15}>
          <Col span={8}>
            <div className="item-chart">
              <BarChart />
            </div>
          </Col>
          <Col span={8}>
            <div className="item-chart">
              <PieChart />
            </div>
          </Col>
          <Col span={8}>
            <div className="item-chart">
            </div>
          </Col>
          <Col span={8}>
            <div className="item-chart">
            </div>
          </Col>
          <Col span={8}>
            <div className="item-chart">
            </div>
          </Col>
          <Col span={8}>
            <div className="item-chart">
            </div>
          </Col>
          <Col span={8}>
            <div className="item-chart">
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChartLayout;
