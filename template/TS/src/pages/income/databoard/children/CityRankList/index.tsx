import * as React from "react";
import SERVICE from "@/api";
import cx from "classnames";
import "./style.scss";
import { AJAX_STATUS } from "@/utils/constant";
import { getAreaInfo } from "@/utils/Helper";
import { message } from "antd";

let dataSource = [];

// [城市图书馆排行榜]
class CityRankList extends React.Component {
  componentDidMount() {
    this.queryLibraryCitySummary();
  }

  queryLibraryCitySummary = async (province = "330000") => {
    const res = await SERVICE.dashboard.queryLibraryCitySummary(province);

    if (res.code === AJAX_STATUS.SUCCESS) {
      dataSource = res.data.distributed.map((item, index) => {
        const areaStr = getAreaInfo(item.city.join(","));
        const city = areaStr.split("-")[1];
        return {
          city,
          count: item.count
        };
      });
    } else {
      message.error("获取城市图书馆排行信息失败");
    }
  };

  render() {
    const leftDataSource = [];
    const rightDataSource = [];
    dataSource.forEach((item, index) => {
      if (index <= 5) {
        leftDataSource.push(item);
      } else {
        rightDataSource.push(item);
      }
    });
    return (
      <div className="city-rank-wrapper">
        <h3>
          <span className="icon-city-rank" />
          城市拥有有声图书馆数量排行
        </h3>
        <div className="rank-content">
          <div className="left">
            {leftDataSource.map((item, index) => {
              return (
                <div className="city" key={index}>
                  <span
                    className={cx({
                      "rank-flag": true,
                      [`rank-${index + 1}`]: index <= 3
                    })}
                  >
                    {index + 1}
                  </span>
                  {item.city}
                </div>
              );
            })}
          </div>
          <div className="right">
            {rightDataSource.map((item, index) => {
              return (
                <div className="city" key={index}>
                  <span className="rank-flag">{index + 7}</span>
                  {item.city}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default CityRankList;
