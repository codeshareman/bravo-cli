import * as React from "react";
import { connect } from "react-redux";
import cx from "classnames";

import SERVICE from "@/api";
import CombineFilter from "../children/CombineFilter";
import { Table, Row, Col, message, Tooltip } from "antd";
import {
  LibRankList,
  LibContenRankList
} from "../children/CombineFilter/config";
import {
  VisitDimensionType,
  ActionDimensionType,
  ContenDimensionType
} from "../children/CombineFilter/enums";
import { SET_BOARD_PARAMS } from "@/store/actionTypes/viewboard";
import "../styles/rank-layer.scss";
import { AJAX_STATUS } from "@/utils/constant";
import { getAreaInfo } from "@/utils/Helper";
import { StatisticalType } from "../../../../../client/service/DashboardService2";
import Regex from "@/utils/regex";

interface P {
  viewBoard: {
    queryParams: any;
  };
  setBoardParams: (e: any) => {};
}
interface S {
  libDataSource: Array<any>;
  libContenDataSource: Array<any>;
  curVisitDimension: number;
  curResourceType: number;
  curActionType: number;
  loadingLib: boolean;
  loadingContent: boolean;
}

// 排行榜
class RankPanel extends React.Component<P, S> {
  state: S = {
    libDataSource: [],
    libContenDataSource: [],
    curVisitDimension: VisitDimensionType.PV,
    loadingLib: true,
    loadingContent: true,
    curResourceType: ContenDimensionType.SOUND,
    curActionType: ActionDimensionType.PLAYCOUNT
  };

  componentWillReceiveProps(nextProps: React.ComponentProps<any>) {
    if (
      nextProps.viewBoard.queryParams.productVal !==
      this.props.viewBoard.queryParams.productVal
    ) {
      this.initialRequest();
    }
  }

  initialRequest = () => {
    this.getLibRankList();
    this.getLibContentRankList();
  };

  handleSubmit = (values: any) => {
    if (values.resourceType) {
      this.getLibContentRankList();
      this.setState({
        curResourceType: values.resourceType,
        curActionType: values.libContenActionDis
      });
    } else {
      this.setState({
        curVisitDimension: values.libVisitDis
      });
      this.getLibRankList();
    }
  };

  getLibRankList = () => {
    const { viewBoard } = this.props;
    const propsParams = viewBoard.queryParams;
    const stasticType = propsParams.statisticalType;
    this.setState({
      loadingLib: true
    });
    if (this.state.curVisitDimension === VisitDimensionType.PV) {
      this.queryLibraryPVTop10(stasticType);
    } else if (this.state.curVisitDimension === VisitDimensionType.UV) {
      this.queryLibraryUVTop10(stasticType);
    } else {
      this.queryLibrarySaleTop10(stasticType);
    }
  };

  // 按照统计类型查询图书馆PV排行
  queryLibraryPVTop10 = async (stasticType: number) => {
    this.setState({
      libDataSource: [],
      loadingLib: true
    });
    const res = await SERVICE.viewboard.queryLibraryPVTop10(stasticType);
    if (res.code === AJAX_STATUS.SUCCESS) {
      const resData = res.data;
      const tableSource = resData.data.map((item, index) => {
        return {
          ...item,
          count: item.pageView
        };
      });
      this.setState({
        libDataSource: tableSource,
        loadingLib: false
      });
    } else {
      message.error("获取图书馆PV排行失败");
    }
  };

  // 按照统计类型查询图书馆UV排行
  queryLibraryUVTop10 = async (stasticType: number) => {
    this.setState({
      libDataSource: [],
      loadingLib: true
    });

    const res = await SERVICE.viewboard.queryLibraryUVTop10(stasticType);

    if (res.code === AJAX_STATUS.SUCCESS) {
      const resData = res.data;
      const tableSource = resData.data.map((item, index) => {
        return {
          ...item,
          count: item.uniqueVisitor
        };
      });
      this.setState({
        libDataSource: tableSource,
        loadingLib: false
      });
    } else {
      message.error("获取图书馆UV排行失败");
    }
  };

  // 按照统计类型获取图书馆销售数据
  queryLibrarySaleTop10 = async (stasticType: number) => {
    this.setState({
      libDataSource: [],
      loadingLib: true
    });
    const res = await SERVICE.viewboard.queryLibrarySaleTop10(stasticType);
    if (res.code === AJAX_STATUS.SUCCESS) {
      const resData = res.data;
      const tableSource = resData.data.map((item, index) => {
        return {
          ...item,
          count: ~~item.albumSaleAmount
        };
      });
      this.setState({
        libDataSource: tableSource,
        loadingLib: false
      });
    } else {
      message.error("获取图书馆销售数据排行失败");
    }
  };

  // 获取播放量内容排行榜
  queryResourcePlayTop10 = async (params: {
    statisticalType: number;
    resourceType: number;
  }) => {
    this.setState({
      libContenDataSource: [],
      loadingContent: true
    });
    const res = await SERVICE.viewboard.queryResourcePlayTop10(
      params.statisticalType,
      params.resourceType
    );

    if (res.code === AJAX_STATUS.SUCCESS) {
      const resData = res.data;
      const tableSource = resData.data.map((item, index) => {
        return {
          ...item,
          playCount: item.pageView
        };
      });
      this.setState({
        libContenDataSource: tableSource,
        loadingContent: false
      });
    } else {
      message.error("获取图书馆播放量内容排行失败");
    }
  };

  // 查询图书馆内容销售量排行榜
  queryResourceSaleTop10 = async (params: {
    statisticalType: number;
    resourceType: number;
  }) => {
    this.setState({
      libContenDataSource: [],
      loadingContent: true
    });
    const res = await SERVICE.viewboard.queryResourceSaleTop10(
      params.statisticalType,
      params.resourceType
    );

    if (res.code === AJAX_STATUS.SUCCESS) {
      const resData = res.data;
      const tableSource = resData.data.map((item, index) => {
        return {
          ...item,
          playCount: item.saleAmount
        };
      });
      this.setState({
        libContenDataSource: tableSource,
        loadingContent: false
      });
    } else {
      message.error("获取图书馆销售量内容排行失败");
    }
  };

  getLibContentRankList = () => {
    const { viewBoard } = this.props;
    const propsParams = viewBoard.queryParams;
    const params = {
      statisticalType: propsParams.statisticalType,
      resourceType: propsParams.resourceType
    };
    this.setState({
      loadingContent: true
    });
    if (propsParams.libContenActionDis === ActionDimensionType.PLAYCOUNT) {
      this.queryResourcePlayTop10(params);
    } else {
      this.queryResourceSaleTop10(params);
    }
  };

  getLibTableProps = () => {
    const { libDataSource, curVisitDimension } = this.state;
    let dynamicTitle = "";

    if (curVisitDimension === VisitDimensionType.PV) {
      dynamicTitle = "PV";
    } else if (curVisitDimension === VisitDimensionType.UV) {
      dynamicTitle = "UV";
    } else {
      dynamicTitle = "销售额";
    }

    const columns = [
      {
        title: "名次",
        dataIndex: "rank",
        key: "rank",
        align: "center",
        width: 80,
        render: (curVal: string, itemData: Object, index: number) => {
          if (index <= 2) {
            return (
              <span className={cx("rank", `rank-${index + 1}`)}>
                {index + 1}
              </span>
            );
          }
          return index + 1;
        }
      },
      {
        title: "图书馆名称",
        dataIndex: "libraryTitle",
        key: "libraryTitle",
        width: 190,
        render: (title: string) => {
          return title.length > 10 ? (
            <Tooltip title={title}>{title.substring(0, 10) + "..."}</Tooltip>
          ) : (
            title
          );
        }
      },
      {
        title: "所在城市",
        dataIndex: "libraryCity",
        key: "libraryCity",
        render: (area: Array<string>) => {
          const areaCodeStr = area.join(",");
          const areaStr = getAreaInfo(areaCodeStr);
          return areaStr && areaStr.split("-")[1];
        }
      },
      {
        title: dynamicTitle,
        dataIndex: "count",
        key: "count",
        width: 120,
        align: "center",
        render: curVal => {
          if (
            curVisitDimension === VisitDimensionType.PV ||
            curVisitDimension === VisitDimensionType.UV
          ) {
            return curVal.toString().replace(Regex.thousands, ",");
          } else {
            return curVal.toFixed(3);
          }
        }
      }
    ];
    return {
      columns,
      dataSource: libDataSource,
      pagination: false,
      bordered: true
    };
  };

  getLibContenProps = () => {
    const { libContenDataSource, curResourceType, curActionType } = this.state;
    const dynamicTitle =
      curResourceType === ContenDimensionType.SOUND ? "声音标题" : "专辑标题";
    const dynamicActionFields =
      curActionType === ActionDimensionType.PLAYCOUNT ? "播放次数" : "销售额";
    const columns = [
      {
        title: "名次",
        dataIndex: "1",
        width: 80,
        key: "rank",
        align: "center",
        render: (curVal: string, itemData: Object, index: number) => {
          if (index <= 2) {
            return (
              <span className={cx("rank", `rank-${index + 1}`)}>
                {index + 1}
              </span>
            );
          }
          return index + 1;
        }
      },
      {
        title: dynamicTitle,
        dataIndex: "resourceTile",
        key: "resourceTile",
        render: (title: string) => {
          return title.length > 20 ? (
            <Tooltip title={title}>{title.substring(0, 20) + "..."}</Tooltip>
          ) : (
            title
          );
        }
      },
      {
        title: dynamicActionFields,
        dataIndex: "playCount",
        key: "playCount",
        align: "center",
        width: 100,
        render: (curVal: number) => {
          if (curActionType === ActionDimensionType.PLAYCOUNT) {
            return curVal.toString().replace(Regex.thousands, ",");
          } else {
            return curVal
          }
        }
      }
    ];

    return {
      columns,
      dataSource: libContenDataSource,
      pagination: false,
      bordered: true
    };
  };

  render() {
    return (
      <div className="rank-wrapper">
        <h2>排行榜</h2>
        <Row gutter={30}>
          <Col span={12}>
            <h3 className="sub-title">图书馆排行榜</h3>
            <CombineFilter options={LibRankList} onSubmit={this.handleSubmit} />
            <Table
              loading={{
                spinning: this.state.loadingLib,
                tip: "数据加载中..."
              }}
              {...this.getLibTableProps()}
            />
          </Col>
          <Col span={12}>
            <h3 className="sub-title">图书馆内容排行榜</h3>
            <CombineFilter
              options={LibContenRankList}
              onSubmit={this.handleSubmit}
            />
            <Table
              loading={{
                spinning: this.state.loadingContent,
                tip: "数据加载中..."
              }}
              {...this.getLibContenProps()}
            />
          </Col>
        </Row>
        <div className="attention">
          <p>PV：指某个图书馆的所有访问量。</p>
          <p>UV：指某个图书馆的独立访客数量</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    viewBoard: state.viewBoard
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    setBoardParams: (data: Object) => {
      dispatch({
        type: SET_BOARD_PARAMS,
        payload: data
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RankPanel);
