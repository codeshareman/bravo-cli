import * as React from "react";
import SERVICE from "@/api";
import cx from "classnames";
import Regex from "@/utils/regex";
import { AJAX_STATUS } from "@/utils/constant";
import { message } from "antd";
import defaultImg from "../../assets/img_morenfengm@2x.png";
import "./style.scss";

let columns = [
  {
    title: "名次",
    key: "rank",
    dataIndex: "rank",
    align: "center"
  },
  {
    title: "专辑名称",
    key: "resourceTile",
    dataIndex: "resourceTile",
    width: 240,
    render: (curVal: any) => {
      return curVal.length > 10 ? curVal.substring(0, 10) + "..." : curVal;
    }
  },
  {
    title: "播放量",
    key: "pageView",
    dataIndex: "pageView"
  }
];

interface P {}

interface S {
  province: string;
  dataSource: Array<any>;
  albumnData: Array<any>;
  audioData: Array<any>;
}

// [PV、UV 排行榜]
class AlbumRankList extends React.Component<P, S> {
  state = {
    province: "330000",
    albumnData: [],
    audioData: [],
    dataSource: []
  };

  componentDidMount() {
    let showAlbum = true;

    this.initialRequest(showAlbum);
    const timer = setInterval(() => {
      showAlbum = !showAlbum;
      this.switchTableInfo(showAlbum);
    }, 5000);
  }

  initialRequest = () => {
    this.queryAlbumTop10();
    this.queryTrackTop10();
  };

  switchTableInfo = (showAlbum: boolean) => {
    columns = [
      {
        title: "名次",
        key: "rank",
        dataIndex: "rank",
        align: "center"
      },
      {
        title: showAlbum ? "专辑名称" : "声音名称",
        key: "resourceTile",
        dataIndex: "resourceTile",
        width: 240
      },
      {
        title: "播放量",
        key: "pageView",
        dataIndex: "pageView"
      }
    ];
    if (showAlbum) {
      this.setState({
        dataSource: this.state.albumnData
      });
    } else {
      this.setState({
        dataSource: this.state.audioData
      });
    }
  };

  renderTableHead = () => {
    return columns.map(item => {
      return (
        <th style={{ width: item.width || "auto" }} key={item.key}>
          {item.title}
        </th>
      );
    });
  };

  // 查询专辑排行前十
  queryAlbumTop10 = async () => {
    const { province } = this.state;
    const res = await SERVICE.dashboard.queryAlbumTop10(province);

    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        albumnData: res.data.data,
        dataSource: res.data.data
      });
    } else {
      const errMsg = res.data.msg;
      message.info(errMsg || "获取专辑排行失败");
    }
  };

  // 查询声音排行前十
  queryTrackTop10 = async () => {
    const { province } = this.state;
    const res = await SERVICE.dashboard.queryTrackTop10(province);

    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        audioData: res.data.data
      });
    } else {
      const errMsg = res.data.msg;
      message.info(errMsg || "获取声音排行失败");
    }
  };

  renderTableBody = () => {
    const { dataSource } = this.state;
    return (
      dataSource &&
      dataSource.map((item, index) => {
        return (
          <tr key={index}>
            {columns.map((cItem, cIndex) => {
              return (
                <td key={cItem.key}>
                  {cIndex === 0 ? (
                    <span className={cx("rank-num", `rank-${index + 1}`)}>
                      {index + 1}
                    </span>
                  ) : cItem.key === "pageView" ? (
                    item[cItem.key].toString().replace(Regex.thousands, ",")
                  ) : (
                    <div className="album-name">
                      <img
                        src={item.coverPath || defaultImg}
                        onError={() => {
                          const img: any = event.srcElement;
                          img.src = defaultImg;
                        }}
                      />
                      <p>
                        {item[cItem.key].length > 10
                          ? item[cItem.key].substring(0, 10) + "..."
                          : item[cItem.key]}
                      </p>
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        );
      })
    );
  };

  render() {
    return (
      <div className="rank-wrapper album-rank-wrapper">
        <div className="bd-img tl-img" />
        <div className="bd-img tr-img" />
        <div className="bd-img bl-img" />
        <div className="bd-img br-img" />
        <div className="table-wrapper">
          <div className="thead-border" />
          <table>
            <thead>
              <tr>{this.renderTableHead()}</tr>
            </thead>
            <tbody>{this.renderTableBody()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default AlbumRankList;
