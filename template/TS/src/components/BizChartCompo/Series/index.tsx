import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend, Guide } from "bizcharts";
import DataSet from "@antv/data-set";
import "./index.scss";
import { ChartType } from "@/utils/enums";
import { Color } from "csstype";
const { Line } = Guide;

interface P {
  dataSource: Array<any>;
  type: ChartType;
  color?: Color;
}
interface S {}

class Series extends React.Component<P, S> {
  render() {
    const { dataSource, type, color = "#40a9ff" } = this.props;
    const dv = new DataSet.View().source(dataSource);
    let dynamicField = [];
    let formatMapData = null;
    if (type === ChartType.VIP) {
      dynamicField = ["vipConversionRate"];
      formatMapData = {
        vipConversionRate: "会员转化率"
      };
    } else if (type === ChartType.RETAIN) {
      dynamicField = ["nextDayRetained"];
      formatMapData = {
        nextDayRetained: "次日留存"
      };
    } else {
      dynamicField = ["pageView", "uniqueVisitor", "newUniqueVisitor"];
      formatMapData = {
        pageView: "图书馆访问PV",
        uniqueVisitor: "图书馆访问UV",
        newUniqueVisitor: "图书馆新增UV"
      };
    }

    dv.transform({
      type: "fold",
      fields: dynamicField,
      key: "key",
      value: "count"
    });
    const cols = {
      firstDay: {
        range: [0, 0.8]
      }
    };

    return (
      <div className="series-wrapper">
        <Chart height={400} data={dv} scale={cols} forceFit>
          <Legend
            marker="square"
            offsetY={20}
            itemFormatter={val => {
              return formatMapData[val];
            }}
          />
          <Axis name="firstDay" />
          <Axis
            name="count"
            line={{
              stroke: "#ccc",
              fill: "#ffffff",
              lineDash: [0, 0],
              lineWidth: 1
            }}
            subTickLine={{
              lineWidth: 1, // 次刻度线宽
              stroke: "#ddd", // 次刻度线颜色
              strokeOpacity: 0.5, // 次刻度线颜色的透明度
              length: 3 // 次刻度线的长度，可以为负值（表示反方向渲染）
            }}
            label={{
              formatter: val => {
                const value = parseFloat(val);
                if (type === ChartType.VISIT) {
                  return value / 1000 + "k";
                } else {
                  return (value * 100).toFixed(2) + "%";
                }
              }
            }}
          />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="firstDay*count"
            tooltip={[
              "firstDay*count*key",
              (firstDay, count, key) => {
                let curVal = "";
                if (type === ChartType.VISIT) {
                  curVal = count / 1000 + "k";
                } else {
                  curVal = (count * 100).toFixed(2) + "%";
                }
                return {
                  //自定义 tooltip 上显示的 title 显示内容等。
                  name: formatMapData[key],
                  title: firstDay,
                  value: curVal
                };
              }
            ]}
            size={2}
            color={"key"}
            shape={"smooth"}
          />
          <Geom
            type="point"
            position="firstDay*count"
            size={4}
            shape={"circle"}
            tooltip={[
              "firstDay*count*key",
              (firstDay, count, key) => {
                let curVal = "";
                if (type === ChartType.VISIT) {
                  curVal = count / 1000 + "k";
                } else {
                  curVal = (count * 100).toFixed(2) + "%";
                }
                return {
                  //自定义 tooltip 上显示的 title 显示内容等。
                  name: formatMapData[key],
                  title: firstDay,
                  value: curVal
                };
              }
            ]}
            color={"key"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default Series;
