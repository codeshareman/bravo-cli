import * as React from "react";

import SERVICE from "@/api";
import Regex from "@/utils/regex";
import "./style.scss";
import { AJAX_STATUS } from "@/utils/constant";
import { message } from "antd";
import { getAreaInfo } from "@/utils/Helper";

interface P {}
interface S {
  province: string;
  dataSource: Array<any>;
  libPvData: Array<any>;
  libUvData: Array<any>;
  showPV: boolean;
}
// [PV、UV 排行榜]
class LibRankList extends React.Component<P, S> {
  state: S = {
    province: "330000",
    dataSource: [],
    libPvData: [],
    libUvData: [],
    showPV: true
  };

  componentDidMount() {
    this.initialRequest();
    const timer = setInterval(() => {
      this.setState(
        {
          showPV: !this.state.showPV
        },
        () => {
          this.switchTableInfo();
        }
      );
    }, 5000);
  }

  initialRequest = () => {
    this.queryLibraryPVTop10();
    this.queryLibraryUVTop10();
  };

  switchTableInfo = () => {
    const { showPV } = this.state;

    if (showPV) {
      this.setState({
        dataSource: this.state.libPvData
      });
    } else {
      this.setState({
        dataSource: this.state.libUvData
      });
    }
  };

  // 图书馆PV前十
  queryLibraryPVTop10 = async () => {
    const res = await SERVICE.dashboard.queryLibraryPVTop10([
      this.state.province
    ]);

    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        libPvData: res.data.data,
        dataSource: res.data.data
      });
    } else {
      message.info(res.data.msg || "获取图书馆排行失败");
    }
  };

  // 图书馆UV前十
  queryLibraryUVTop10 = async () => {
    const res = await SERVICE.dashboard.queryLibraryUVTop10([
      this.state.province
    ]);
    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        libUvData: res.data.data
      });
    } else {
      message.info(res.data.msg || "获取图画馆UV排行失败");
    }
  };

  renderTableHead = columns => {
    columns[columns.length - 1].title = this.state.showPV ? "PV" : "UV";
    return columns.map(item => {
      return <td key={item.key}>{item.title}</td>;
    });
  };

  renderTableBody = columns => {
    const { dataSource } = this.state;
    return (
      dataSource &&
      dataSource.map((item, index) => {
        return (
          <tr key={index}>
            {columns.map((cItem, cIndex) => {
              return (
                <td key={cItem.key}>
                  {cIndex === 0 && (
                    <span className="rank-num">{index + 1}</span>
                  )}
                  {(cItem.key === "pageView" ||
                    cItem.key === "uniqueVisitor") &&
                    item[cItem.key].toString().replace(Regex.thousands, ",")}
                  {cItem.key === "libraryCity" &&
                    getAreaInfo(item[cItem.key].join(",")).split("-")[1]}
                  {cItem.key === "libraryTitle" && (item[cItem.key].length > 10 ? item[cItem.key].substring(0, 10) + "..." : item[cItem.key])}
                </td>
              );
            })}
          </tr>
        );
      })
    );
  };

  render() {
    const { showPV } = this.state;
    let columns = [
      {
        title: "名次",
        key: "rank",
        dataIndex: "rank"
      },
      {
        title: "图书馆名称",
        key: "libraryTitle",
        dataIndex: "libraryTitle",
        width: 240
      },
      {
        title: "所在城市",
        key: "libraryCity",
        dataIndex: "libraryCity"
      },
      {
        title: showPV ? "pageView" : "uniqueVisitor",
        key: showPV ? "pageView" : "uniqueVisitor",
        dataIndex: showPV ? "pageView" : "uniqueVisitor"
      }
    ];
    return (
      <div className="rank-wrapper lib-rank-wrapper">
        <div className="bd-img tl-img" />
        <div className="bd-img tr-img" />
        <div className="bd-img bl-img" />
        <div className="bd-img br-img" />

        <div className="table-wrapper">
          <div className="thead-border" />
          <table>
            <thead>
              <tr>{this.renderTableHead(columns)}</tr>
            </thead>
            <tbody>{this.renderTableBody(columns)}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default LibRankList;
