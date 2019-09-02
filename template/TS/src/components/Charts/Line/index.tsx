import * as React from "react";
import SERVICE from "@/api";
import { G2, Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";

import { message } from "antd";
import { AJAX_STATUS } from "@/utils/constant";
import "./style.scss";

let dataSource = [];

declare let window: Window & {
  DataSet: any;
};
// 折线图
class Line extends React.Component {
  componentDidMount() {
    this.queryMonthLibraryData();
  }

  // 获取曲线图需要的pu/uv等数据
  queryMonthLibraryData = async (area = "330000") => {
    const res = await SERVICE.dashboard.queryMonthLibraryData([area]);
    if (res.code === AJAX_STATUS.SUCCESS) {
      dataSource = res.data.data;
    } else {
      message.error("获取图书馆统计图表数据失败");
    }
  };

  render() {
    const dv = new DataSet.View().source(dataSource);
    dv.transform({
      type: "fold",
      fields: ["pageView", "uniqueVisitor", "newUniqueVisitor"],
      key: "key",
      value: "value"
    });
    const cols = {
      firstDay: {
        range: [0, 0.8]
      },
      value: {
        alias: "单位(人)"
      }
    };
    const legendArr = {
      pageView: "图书馆访问PV",
      uniqueVisitor: "图书馆访问UV",
      newUniqueVisitor: "图书馆新增UV"
    };
  

    return (
      <div className="chart-line-wrapper">
        <div className="bd-img tl-img" />
        <div className="bd-img tr-img" />
        <div className="bd-img bl-img" />
        <div className="bd-img br-img" />
        <div>
          <Chart
            style={{
              position: "absolute",
              width: "100%",
              left: -30,
              top: 30
            }}
            height={350}
            data={dv}
            scale={cols}
            forceFit
          >
            <Legend
              position="top-right"
              offsetY={0}
              height={120}
              marker="square"
              itemFormatter={val => {
                const legendArr = {
                  pageView: "图书馆访问PV",
                  uniqueVisitor: "图书馆访问UV",
                  newUniqueVisitor: "图书馆新增UV"
                };
                return legendArr[val];
              }}
            />
            <Axis
              name="firstDay"
              line={{ stroke: "#A5B6CD", lineWidth: 1 }}
              label={{
                textStyle: {
                  textAlign: "center",
                  fill: "#a5b6cd"
                }
              }}
              grid={null}
            />
            <Axis
              name="value"
              line={{ stroke: "#A5B6CD", lineWidth: 1 }}
              title={{
                autoRotate: false,
                textStyle: {
                  fontSize: "12",
                  fill: "#A5B6CD"
                },
                offset: 20,
                position: "end"
              }}
              label={{
                textStyle: {
                  fill: "#a5b6cd"
                }
              }}
              grid={{
                type: "polygon",
                lineStyle: {
                  stroke: "rgba(165, 182, 205, 0.3)", // 网格线的颜色
                  lineWidth: 1, // 网格线的宽度复制代码
                  lineDash: [0, 0]
                }
              }}
            />
            <Tooltip
              useHtml={false}
              ca
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="line"
              position="firstDay*value"
              size={2}
              color={"key"}
              shape={"smooth"}
            />
          </Chart>
        </div>
      </div>
    );
  }
}

export default Line;
