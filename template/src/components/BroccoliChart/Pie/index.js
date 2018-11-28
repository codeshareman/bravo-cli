import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

class PieChart extends Component {
  render() {
    const data = [
      {
        toolTitle: 'hello',
        year: "2005",
        population: 38.3
      },
      {
        toolTitle: 'hello',
        year: "2006",
        population: 28
      },
      {
        toolTitle: 'hello',
        year: "2007",
        population: 42.5
      },
      {
        toolTitle: 'hello',
        year: "2008",
        population: 30.3
      },
      {
        toolTitle: 'hello',
        year: "2009",
        population: 38.3
      },
      {
        toolTitle: 'hello',
        year: "2010",
        population: 28
      },
      {
        toolTitle: 'hello',
        year: "2011",
        population: 42.5
      },
      {
        toolTitle: 'hello',
        year: "2012",
        population: 30.3
      }
    ];

    return (
      <div>
        <Chart
          height={300}
          width={200}
          data={data}
          forceFit
        >
          <Coord type="polar" innerRadius={0.1} />
          <Tooltip 
            showTitle={true}
            title='year'
          />
          <Legend position="bottom" offsetY={-300 / 2 + 180} offsetX={-10} />
          <Geom
            type="interval"
            color="year"
            position="year*population"
            tooltip={
              ['year*population', (year, population) => {
                return { 
                  name: 'population',
                  title: '数据统计分析',
                  value: population
                }
              }]
            }
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default withRouter(PieChart);
