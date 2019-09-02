import * as React from "react";
import SERVICE from "@/api";
import { seamlessScroll } from "@/utils/Helper";
import "./style.scss";
import { FormType } from "@/pages/income/big-screen/enums";
import { AJAX_STATUS } from "@/utils/constant";
import { message } from "antd";

interface P {}
interface S {}

// [活动列表]
class ActivityList extends React.Component<P, S> {
  state = {
    dataSource: []
  };

  componentDidMount() {
    this.queryInfo();
  }

  // 查询活动信息
  queryInfo = async () => {
    const infoType = FormType.ACTIVITY;
    const res = await SERVICE.dashboard.queryInfo(infoType);

    if (res.code === AJAX_STATUS.SUCCESS) {
      const activityData = res.data.map((item, index) => {
        return {
          id: item.id,
          ...item.content
        };
      });
      this.setState(
        {
          dataSource: activityData
        },
        () => {
          // 无缝滚动
          const $container = document.getElementsByClassName(
            "activity-content"
          )[0];
          const $origin: any = document.getElementById("origin");
          const $clone = document.getElementsByClassName("clone")[0];
          seamlessScroll($container, $origin, $clone, 60);
        }
      );
    } else {
      message.error("获取活动信息失败");
    }
  };

  render() {
    const { dataSource } = this.state;
    return (
      <div className="activity-wrapper">
        <div className="bd-img tl-img" />
        <div className="bd-img tr-img" />
        <div className="bd-img bl-img" />
        <div className="bd-img br-img" />
        <h3>
          <span className="icon-activity" /> 活动信息
        </h3>
        <div className="activity-content">
          <ul id="origin">
            {dataSource &&
              dataSource.map((item, index) => {
                return (
                  <li key={index}>
                    <span className="icon-dot" />
                    <div>
                      <p>
                        <b>{item.title}</b>
                      </p>
                      <p>
                        {item.time[0]}~{item.time[1]}
                      </p>
                      <p>{item.address}</p>
                    </div>
                  </li>
                );
              })}
          </ul>
          <ul className="clone" />
        </div>
      </div>
    );
  }
}

export default ActivityList;
