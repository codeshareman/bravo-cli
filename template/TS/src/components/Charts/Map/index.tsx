import * as React from "react";
import _ from "loadsh";
import G2 from "@antv/g2";
import "./style.scss";
import viewboard from "@/store/reducers/viewboard";
import { getAreaInfo } from "@/utils/Helper";

declare let window: Window & {
  AMap: any;
  AMapUI: any;
  districtExplorer: any;
  currentAreaNode: any;
  DataSet: any;
};

let provinceChart = void 0;

interface P {
  dataSource: Array<any>;
}
interface S {}
// 省维的地图
class Map extends React.Component<P, S> {
  render() {
    const data = [
      {
        x: 200,
        y: -65,
        city: "湖州市",
        height: 100,
        num: 230
      },
      {
        x: 130,
        y: 50,
        city: "杭州市",
        height: 100,
        num: 130
      },
      {
        x: 310,
        y: -39,
        city: "嘉兴市",
        height: 100,
        num: 30
      },
      {
        x: 290,
        y: 45,
        city: "绍兴市",
        height: 100,
        num: 12
      },
      {
        x: 380,
        y: 55,
        city: "宁波市",
        height: 100,
        num: 88
      },
      {
        x: 195,
        y: 120,
        city: "金华市",
        height: 100,
        num: 99
      },
      {
        x: 65,
        y: 135,
        city: "衢州市",
        height: 100,
        num: 100
      },
      {
        x: 135,
        y: 220,
        city: "丽水市",
        height: 100,
        num: 120
      },
      {
        x: 260,
        y: 250,
        city: "温州市",
        height: 100,
        num: 140
      },
      {
        x: 335,
        y: 135,
        city: "台州市",
        height: 100,
        num: 180
      },
      {
        x: 465,
        y: 10,
        city: "舟山市",
        height: 100,
        num: 307
      }
    ];
    const dataSource = this.props.dataSource;
    const cityData = dataSource.map(item => {
      const areaStr = item.city.join(",");
      const cityStr= getAreaInfo(areaStr).split("-")[1];
      return cityStr;
    });

    const areaData = data.map((item, index) => {
      const cityIndex = cityData.indexOf(item.city);
      item.num = ~cityIndex ? dataSource[cityIndex].count : 0;
      return item;
    });

    return (
      <div className="province-wrapper">
        <div id="province">
          <div className="map">
            {areaData.map((item, index) => {
              const col_h = item.num < 100 ? item.num : 100;
              return (
                <div key={index} className="sub-area" style={{ left: item.x, top: item.y }}>
                  <div className="columns-wrapper">
                    <div className="column" style={{ height: col_h }} />
                    <p style={{ bottom: -15 }}>{item.city}</p>
                    <p style={{ bottom: -35 }}>{item.num}</p>
                  </div>
                </div>
              );
            })}
            <div className="legend" />
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
