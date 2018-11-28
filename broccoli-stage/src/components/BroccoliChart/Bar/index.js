import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from "bizcharts";

// 数据源
const data = [
  { genre: "Sports", sold: 275, income: 2300 },
  { genre: "Strategy", sold: -115, income: 667 },
  { genre: "Action", sold: -120, income: 982 },
  { genre: "Shooter", sold: 350, income: 5271 },
  { genre: "Other", sold: 150, income: 3710 }
];

// 定义度量
const cols = {
  sold: { alias: "销售量" },
  genre: { alias: "游戏种类" }
};

class BarChart extends Component {
  state = {
    chartOption: {
      width: 500,
      height: 320
    }
  };
  componentDidMount() {
    const chartItem = document.getElementsByClassName("item-chart")[0];
    this.setState({
      chartOption: {
        width: chartItem.width,
        height: chartItem.height
      }
    });
  }
  render() {
    const { chartOption } = this.state;
    return (
       (
        <Chart
          width={500}
          height={320}
          data={data}
          scale={cols}
        >
          {/* <Coord type="polar" reflect='y'></Coord> */}
          <Axis name="genre" tickLine={{lineWidth:10, length: 10, stroke: '#f00'}}/>
          <Axis name="sold" />
          <Legend position="bottom" dy={20} />
          <Tooltip />
          <Geom type="interval" position="genre*sold" color="genre" />
        </Chart>
      )
    );
  }
}

export default withRouter(BarChart);
