import * as React from "react";
import _ from "loadsh";
import G2 from "@antv/g2";
import "./style.scss";
import viewboard from "@/store/reducers/viewboard";

declare let window: Window & {
  AMap: any;
  AMapUI: any;
  districtExplorer: any;
  currentAreaNode: any;
  DataSet: any;
};

let provinceChart = void 0;

// 省维的地图
class Map extends React.Component {
  map = new window.AMap.Map("china", {
    zoom: 4
  });

  componentDidMount() {
    let _this = this;

    let colors = [
      "#3366cc",
      "#dc3912",
      "#ff9900",
      "#109618",
      "#990099",
      "#0099c6",
      "#dd4477",
      "#66aa00",
      "#b82e2e",
      "#316395",
      "#994499",
      "#22aa99",
      "#aaaa11",
      "#6633cc",
      "#e67300",
      "#8b0707",
      "#651067",
      "#329262",
      "#5574a6",
      "#3b3eac"
    ];
    // 当前聚焦的区域
    let currentAreaNode = void 0;

    window.AMapUI.load(
      ["ui/geo/DistrictExplorer", "lib/$"],
      (DistrictExplorer: any) => {
        // 创建一个实例
        let districtExplorer = (window.districtExplorer = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: this.map
        }));

        // feature被点击
        districtExplorer.on("featureClick", (e, feature) => {
          let props = feature.properties;
          //如果存在子节点
          if (props.childrenNum > 0) {
            //切换聚焦区域
            _this.switch2AreaNode(props.adcode);
          }
        });

        //外部区域被点击
        districtExplorer.on("outsideClick", function(e) {
          districtExplorer.locatePosition(
            e.originalEvent.lnglat,
            function(error, routeFeatures) {
              if (routeFeatures && routeFeatures.length > 1) {
                //切换到省级区域
                _this.switch2AreaNode(routeFeatures[1].properties.adcode);
              } else {
                //切换到全国
                _this.switch2AreaNode(100000);
              }
            },
            {
              evelLimit: 2
            }
          );
        });

        // 浙江
        _this.switch2AreaNode(330000);
      }
    );
  }

  //绘制某个区域的边界
  renderAreaPolygons = areaNode => {
    let _this = this;
    let node = _.cloneDeep(areaNode);
    let colors = [
      "#3366cc",
      "#dc3912",
      "#ff9900",
      "#109618",
      "#990099",
      "#0099c6",
      "#dd4477",
      "#66aa00",
      "#b82e2e",
      "#316395",
      "#994499",
      "#22aa99",
      "#aaaa11",
      "#6633cc",
      "#e67300",
      "#8b0707",
      "#651067",
      "#329262",
      "#5574a6",
      "#3b3eac"
    ];
    window.districtExplorer.clearFeaturePolygons();

    window.districtExplorer.renderSubFeatures(node, function(feature, i) {
      let fillColor = colors[i % colors.length];
      let strokeColor = colors[colors.length - 1 - (i % colors.length)];
      return {
        cursor: "default",
        bubble: true,
        strokeColor: strokeColor, //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor: fillColor, //填充色
        fillOpacity: 0.35 //填充透明度
      };
    });

    //绘制父区域
    window.districtExplorer.renderParentFeature(node, {
      cursor: "default",
      bubble: true,
      strokeColor: "#fff", //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 1, //线宽
      fillColor: null, //填充色
      fillOpacity: 0.35 //填充透明度
    });
  };

  //切换区域后刷新显示内容
  refreshAreaNode = areaNode => {
    window.districtExplorer.setHoverFeature(null);
    this.renderAreaPolygons(areaNode);
  };

  //加载区域
  loadAreaNode = (adcode, callback) => {
    window.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }

      this.renderG2Map(areaNode); // 使用 G2 绘制地图

      if (callback) {
        callback(null, areaNode);
      }
    });
  };

  //切换区域
  switch2AreaNode = (adcode, callback?: any) => {
    if (
      window.currentAreaNode &&
      "" + window.currentAreaNode.getAdcode() === "" + adcode
    ) {
      return;
    }

    this.loadAreaNode(adcode, (error, areaNode) => {
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }
      window.currentAreaNode = window.currentAreaNode = areaNode;
      
      // this.refreshAreaNode(areaNode);
      if (callback) {
        callback(null, areaNode);
      }
    });
  };

  renderG2Map = (areaNode: any) => {
    let adcode = areaNode.getAdcode();
    let geoJSON = areaNode.getSubFeatures(); // 获取 geoJSON 数据
    let name = areaNode.getName();
    provinceChart && provinceChart.destroy();
    provinceChart = null;
    if (
      !geoJSON ||
      (window.currentAreaNode &&
        "" + window.currentAreaNode.getAdcode() === "" + adcode)
    ) {
      return;
    }
    let dv = this.processData(geoJSON);
    
    // start: 计算地图的最佳宽高
    let longitudeRange = dv.range("longitude");
    let lantitudeRange = dv.range("latitude");
    let ratio =
      (longitudeRange[1] - longitudeRange[0]) /
      (lantitudeRange[1] - lantitudeRange[0]);
    let width = void 0;
    let height = void 0;
    if (ratio > 1) {
      width = 550;
      height = width / ratio;
    } else {
      width = 300 * ratio;
      height = 700;
    }
    // end: 计算地图的最佳宽高
    provinceChart = new G2.Chart({
      container: "province",
      width: width,
      height: height,
      padding: 0
    });
    provinceChart.source(dv);
    provinceChart.axis(false);
    provinceChart.tooltip({
      showTitle: false
    });
    provinceChart
      .polygon()
      .position("longitude*latitude")
      .label("name", {
        textStyle: {
          fill: "#fff",
          fontSize: 12,
          shadowBlur: 2,
          shadowColor: "rgba(0, 0, 0, .45)"
        }
      })
      .style({
        stroke: "#fff",
        lineWidth: 2
      })
      .color("value", "#BAE7FF-#1890FF-#0050B3");
    provinceChart.render();
  };

  processData = geoJSON => {
    let mapData = {
      type: "FeatureCollection",
      features: geoJSON
    };
    // 构造虚拟数据
    let userData = [];
    for (let i = 0; i < geoJSON.length; i++) {
      let name = geoJSON[i].properties.name;
      userData.push({
        name: name,
        value: Math.round(Math.random() * 1000)
      });
    }
    let ds = new window.DataSet();
    let geoDataView = ds.createView().source(mapData, {
      type: "GeoJSON"
    }); // geoJSON 经纬度数据

    // 用户数据
    let dvData = ds.createView().source(userData);
    dvData.transform({
      type: "geo.region",
      field: "name",
      geoDataView: geoDataView,
      as: ["longitude", "latitude"]
    });

    return dvData;
  };

  render() {
    return (
      <div className="province-wrapper">
        <div id="province" />
      </div>
    );
  }
}

export default Map;
