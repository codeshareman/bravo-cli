import * as React from "react";
import CountUp from "react-countup";
import SERVICE from "@/api";
import Progress from "@/components/Progress";
import "./style.scss";
import { AJAX_STATUS } from "@/utils/constant";
import { message } from 'antd';
import { getAreaInfo } from '@/utils/Helper';

let dataSource = [];

// [新增图书馆排行榜]
class AddLibRankList extends React.Component {

  componentDidMount() {
    this.queryLibraryCitySummary();
  }

  queryLibraryCitySummary = async (province = "330000") => {
    const res = await SERVICE.dashboard.queryLibraryCitySummary(province);

    if (res.code === AJAX_STATUS.SUCCESS) {
      dataSource = res.data.increment.map((item, index) => {
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

  renderTableBody = () => {
    const baseNum = 100;
    return (
      dataSource &&
      dataSource.map((item, index) => {
        const percent = (item.count / baseNum) * 100;
        return (
          <tr key={index}>
            <td>{item.city}</td>
            <td>
              <Progress.Line percent={percent} />
            </td>
            <td>
              <CountUp start={0} end={item.count} />
            </td>
          </tr>
        );
      })
    );
  };

  render() {
    return (
      <div className="libadd-wrapper">
        <h3>
          <span className="icon-increase" />
          有声图书馆新增情况
        </h3>
        <div className="chart-area">
          <table>
            <tbody>{this.renderTableBody()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default AddLibRankList;
