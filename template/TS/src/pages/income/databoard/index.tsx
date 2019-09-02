import * as React from "react";
import SERVICE from "@/api";

import CountUp from "react-countup";
import Progress from "@/components/Progress";
import Charts from "@/components/Charts";
import LibRankList from "./children/LibRankList";
import AlbumRankList from "./children/AlbumRankList";
import AddLibRankList from "./children/AddLibRankList";
import CityRankList from "./children/CityRankList";
import ActivityList from "./children/ActivityList";

import moment from "moment";
import { FormType } from "../big-screen/enums";
import { AJAX_STATUS } from "@/utils/constant";
import { message } from "antd";
import "./index.scss";

interface P {}
interface S {
  goalData: Array<any>;
  describe: string;
  chartLineData: Array<any>;
  distributed: Array<any>;
  libSummary: {
    cityCount: number;
    total: number;
  };
}
// 大数据看版
class DataBoard extends React.Component<P, S> {
  state: S = {
    goalData: [],
    libSummary: {
      cityCount: 0,
      total: 0
    },
    chartLineData: [],
    distributed: [],
    describe: ""
  };

  componentDidMount() {
    this.queryDescribe();
    this.queryGoalInfo();
    this.queryLibraryCitySummary();
  }



  queryDescribe = async () => {
    const res = await SERVICE.dashboard.queryInfo(FormType.DESCRIPTION);
    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        describe: res.data[0].content ? res.data[0].content.desc : ""
      });
    } else {
      message.error("获取信息失败");
    }
  };

  queryGoalInfo = async () => {
    const res = await SERVICE.dashboard.queryInfo(FormType.GOAL);

    if (res.code === AJAX_STATUS.SUCCESS) {
      const resInfo = res.data.map((item, index) => {
        return {
          id: item.id,
          ...item.content
        };
      });

      this.setState({
        goalData: resInfo
      });
    } else {
      message.error("获取信息失败");
    }
  };

  queryLibraryCitySummary = async (province = "330000") => {
    const res = await SERVICE.dashboard.queryLibraryCitySummary([province]);

    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        libSummary: {
          total: res.data.total,
          cityCount: res.data.cityCount
        },
        distributed: res.data.distributed
      });
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { libSummary } = this.state;
    const today = new Date().getDay();
    const week = ["日", "一", "二", "三", "四", "五"];
    return (
      <div className="databoard-wrapper">
        <div className="dbd">
          <div className="left">
            <LibRankList />
            <AlbumRankList />
          </div>
          <div className="mid">
            <div className="top">
              <h1>
                浙江省有声图书馆
                <span className="datetime">
                  {moment().format("YYYY")}
                  <span className="dw">年</span>
                  {moment().format("MM")}
                  <span className="dw">月</span>
                  {moment().format("DD")}
                  <span className="dw">日</span>
                  <span className="week">星期{week[today]}</span>
                </span>
              </h1>
              <p>{this.state.describe}</p>
            </div>
            <div className="center">
              <div className="left">
                <div className="item">
                  <div className="title">
                    <div className="tl-border tl">
                      <span />
                      <span />
                    </div>
                    <div className="tl-border tr">
                      <span />
                      <span />
                    </div>
                    <div className="tl-border bl">
                      <span />
                      <span />
                    </div>
                    <div className="tl-border br">
                      <span />
                      <span />
                    </div>
                    浙江省有声图书馆统计
                  </div>
                  <div className="stastics">
                    <div className="total">
                      <CountUp
                        className="num"
                        start={0}
                        end={libSummary.total || 0}
                      />
                      <p>总量（个）</p>
                    </div>
                    <div className="city">
                      <CountUp
                        className="num"
                        start={0}
                        end={libSummary.cityCount || 0}
                      />
                      <p>分布城市（个）</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="title">
                    <div className="tl-border tl">
                      <span />
                      <span />
                    </div>
                    <div className="tl-border tr">
                      <span />
                      <span />
                    </div>
                    <div className="tl-border bl">
                      <span />
                      <span />
                    </div>
                    <div className="tl-border br">
                      <span />
                      <span />
                    </div>
                    城市覆盖率目标
                  </div>
                  <div className="progress-circle">
                    {this.state.goalData.map((item, index) => {
                      return (
                        <Progress.Circle
                          key={index}
                          percent={item.coverage}
                          quantity={item.target}
                          year={item.year}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div id="map-wrapper" className="right">
                <Charts.Map dataSource={this.state.distributed} />
              </div>
            </div>
            <div className="bottom">
              <Charts.Line />
            </div>
          </div>
          <div className="right">
            <ActivityList />
            <div className="br-rank-block">
              <div className="bd-img tl-img" />
              <div className="bd-img tr-img" />
              <div className="bd-img bl-img" />
              <div className="bd-img br-img" />
              <CityRankList />
              <AddLibRankList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataBoard;
