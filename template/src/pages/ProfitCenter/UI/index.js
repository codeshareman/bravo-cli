import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import styles from "./index.scss";
import CountUp from "react-countup";
import { APP_CONFIG } from "@SRC/utils/constant";
import "moment/locale/zh-cn";
import { Row, Col, Table, DatePicker, Card, Tooltip } from "antd";
import Icon from "antd/lib/icon/";
import Helper from "@SRC/utils/helper";
const cx = classNames.bind(styles);
moment.locale("zh-cn");

@connect(
  state => {
    return state;
  },
  dispatch => {
    return {
      getProfitSummary: function(data, callback) {
        dispatch({
          type: "GET_PROFIT_SUMMARY",
          data: data,
          callback: callback
        });
      },
      getProfitDetail: function(data, callback) {
        dispatch({
          type: "GET_PROFIT_DETAIL",
          data: data,
          callback: callback
        });
      },
      getBannerConten: function(callback) {
        dispatch({
          type: "GET_BANNER_CONTEN",
          // data: data,
          callback: callback
        });
      },
      downloadExcel: function(data, callback) {
        dispatch({
          type: "DOWNLOAD_EXCEL",
          data: data,
          callback: callback
        });
      }
    };
  }
)
class ProfitCenter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingCard: true,
      isLoadingTable: true,
      currentYear: null,
      currentMonth: null,
      currentPage: 1,
      isChangeed: false,
      drawerConfig: {
        isShow: false
      },
      areaInfo: {}
    };
    this.downloadUrl = "";
    this.tableSource = [];
  }

  componentDidMount() {
    this.initialData(() => {
      const { bannerConten } = this.props.profit;
      const AreaInfo =
        bannerConten &&
        Helper.getAreaInfo(bannerConten.province, bannerConten.city);
      this.setState({
        isLoadingCard: false,
        areaInfo: AreaInfo,
        currentPage: +Helper.getQuery("page") || 1
      });
    });
  }
  // 初始化页面数据
  initialData = callback => {
    if (!Helper.getQuery("page")) {
      this.props.history.push("/wws-b/v2/profit/mine?page=1");
    }
    const currentDate = new Date();
    const params = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      pageIndex: Helper.getQuery("page") || 1
    };
    this.downloadUrl = `${APP_CONFIG.basePath}/revenue/detail/download?year=${
      params.year
    }&month=${params.month}`;
    this.props.getBannerConten(callback);
    this.props.getProfitDetail({ ...params }, callback);
    this.props.getProfitSummary(
      { year: params.year, month: params.month },
      callback
    );
    this.props.downloadExcel(
      { year: params.year, month: params.month },
      callback
    );
    this.setState({
      currentYear: params.year,
      currentMonth: params.month
    });
  };

  // 月份改变
  onMonthChange = async (date, dateStr) => {
    const now_date = Date.now();
    const selectedDate = new Date(date);
    const cell_date = Date.parse(selectedDate);
    const params = {
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth() + 1
    };
    const detailParams = {
      ...params,
      pageIndex: 1
    };

    if (
      cell_date > now_date ||
      params.year < 2018 ||
      (params.year === 2018 && params.month < 12)
    ) {
      return null;
    }
    this.setState({
      isLoadingCard: true,
      isLoadingTable: true
    });
    this.props.getProfitSummary(params);
    this.props.getProfitDetail(detailParams);
    this.downloadUrl = `${APP_CONFIG.basePath}/revenue/detail/download?year=${
      params.year
    }&month=${params.month}`;
    this.props.history.push(`?page=1`);
    setTimeout(() => {
      this.setState({
        currentYear: params.year,
        currentMonth: params.month,
        isLoadingCard: false,
        isLoadingTable: false,
        currentPage: 1,
        isChanged: true
      });
    }, 500);
  };

  // 页面改变
  onPageChange = async page => {
    const { currentMonth, currentYear } = this.state;
    const params = {
      year: currentYear,
      month: currentMonth,
      pageIndex: page.current
    };
    this.setState({
      currentPage: page.current
    });
    this.props.history.push(`?page=${page.current}`);
    this.props.getProfitDetail(params);
  };

  // 过滤单元格
  filterCells = date => {
    const now_timestamp = Date.now();
    const cell_timestamp = Date.parse(new Date(date));
    const cell_date = new Date(date);
    const params = {
      year: cell_date.getFullYear(),
      month: cell_date.getMonth() + 1
    };
    return (
      cell_timestamp > now_timestamp ||
      params.year < 2018 ||
      (params.year === 2018 && params.month < 12)
    );
  };

  // 显示详情
  showDrawer = () => {
    this.setState({
      drawerConfig: {
        isShow: true
      }
    });
  };

  // 关闭详情
  closeDrawer = e => {
    this.setState({
      drawerConfig: {
        isShow: false
      }
    });
  };

  // 获得table数据源
  getDataSource = () => {
    const { profitDetail } = this.props.profit;
    let transfered_Id = "";
    let newItem = null;
    if (profitDetail.length > 0) {
      this.tableSource = profitDetail.map((item, index) => {
        newItem = JSON.parse(JSON.stringify(item));
        newItem.key = index;
        newItem.productTitle = item.productTitle || "--";
        newItem.clearingAmount =
          +item.clearingAmount === 0 ? (
            item.clearingAmount
          ) : (
            <span key={index} className="profit-plus">
              + {item.clearingAmount}
            </span>
          );
        transfered_Id = item.orderId.replace(
          item.orderId.substring(9, item.orderId.length - 4),
          "..."
        );
        newItem.orderId = item.orderId && (
          <Tooltip
            className="orderid-tips"
            placement="topLeft"
            title={item.orderId}
          >
            <span className="ordernum">{transfered_Id}</span>
          </Tooltip>
        );
        return newItem;
      });
    }
    return this.tableSource;
  };

  pageItemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return <a>上一页</a>;
    }
    if (type === "next") {
      return <a>下一页</a>;
    }
    return originalElement;
  };

  render() {
    const { fixedRatio } = window.config;
    const { isLoadingCard, areaInfo, currentPage, isChanged } = this.state;
    const { MonthPicker } = DatePicker;
    const { profitSummary, total_detail, bannerConten } = this.props.profit;
    const { isLoading } = this.props.loading;
    const currentRevenue = +profitSummary || 0;
    const cardGrid = {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
      lg: { span: 12 },
      xl: { span: 8 },
      xxl: { span: 6 }
    };

    // 分页设置
    const pagination = {
      current: currentPage,
      pageSize: 10,
      total: Math.ceil(total_detail),
      itemRender: this.pageItemRender
    };
    const dataSource = this.getDataSource();
    const columns = [
      {
        width: 120,
        title: "交易时间",
        dataIndex: "createAt",
        key: "createAt"
      },
      {
        width: 100,
        title: "交易单号",
        dataIndex: "orderId",
        key: "orderId"
      },
      {
        width: 100,
        title: "类型",
        dataIndex: "revenueType",
        key: "revenueType"
      },
      {
        width: 160,
        title: "购买用户",
        dataIndex: "buyerName",
        key: "buyerName"
      },
      {
        width: 160,
        title: "商品名称",
        dataIndex: "productTitle",
        key: "productTitle"
      },
      {
        width: 120,
        title: <span>订单金额(元)</span>,
        dataIndex: "totalAmount",
        key: "totalAmount"
      },
      {
        width: 140,
        title: (
          <span>
            手续费(元){" "}
            <Tooltip
              placement="topLeft"
              title={
                "手续费根据用户购买商品时所使用的支付方式对应扣取（微信支付扣取订单金额的1%，支付宝支付扣取订单金额的0.6%）"
              }
            >
              <Icon type="exclamation-circle" />
            </Tooltip>
          </span>
        ),
        dataIndex: "channelAmount",
        key: "channelAmount"
      },
      {
        width: 100,
        title: "分成比例",
        dataIndex: "ratio",
        key: "ratio"
      },
      {
        width: 140,
        title: (
          <span>
            实际收入(元){" "}
            <Tooltip
              placement="topLeft"
              title={
                "每笔订单实际所获收益，即实际收入=（订单金额 - 手续费）x 分成比例"
              }
            >
              <Icon type="exclamation-circle" />
            </Tooltip>
          </span>
        ),
        dataIndex: "clearingAmount",
        key: "clearingAmount"
      },
      {
        width: 90,
        title: "状态",
        dataIndex: "orderStatus",
        key: "orderStatus"
      }
    ];

    return (
      <div className="profit-wrapper">
        <div className="header-bg">
          <h1>{bannerConten && bannerConten.title}</h1>
          <p>
            {areaInfo && areaInfo.province}{" "}
            {areaInfo && areaInfo.city}
          </p>
          {/* <p>创建时间：{bannerConten && bannerConten.createAt}</p> */}
        </div>
        <Row>
          <h3 className="title">
            选择日期
            <MonthPicker
              allowClear={false}
              onChange={this.onMonthChange}
              disabledDate={this.filterCells}
              placeholder={moment().format("YYYY-MM")}
              style={{ marginLeft: 20 }}
            />
          </h3>
          <Row className="profit-panel" type="flex" justify="start" gutter={20}>
            {/* //canlendar */}
            <Col className="panel-item" {...cardGrid}>
              <Card
                bordered={false}
                loading={isLoadingCard}
                className="card-profit"
                title="本月当前收入(元)"
                extra={
                  <Tooltip
                    placement="topLeft"
                    title={
                      "截止本月当日，您通过订单分成所获的实际收入总和，即本月收入=（本月订单总额 - 本月手续费总和）x 分成比例"
                    }
                  >
                    <Icon type="exclamation-circle" />
                  </Tooltip>
                }
              >
                <div className="content">
                  <span className="money-prefix">￥</span>
                  <span>
                    <CountUp end={currentRevenue} decimals={3} decimal="." />
                  </span>
                </div>
              </Card>
            </Col>
            <Col className="panel-item" {...cardGrid}>
              <Card
                bordered={false}
                loading={isLoadingCard}
                className="card-profit"
                title="当前分成比例"
                extra={
                  <Tooltip
                    placement="topLeft"
                    title={
                      "根据您和喜马拉雅万物声的销售协议，每笔销售您可获得的分成比例"
                    }
                  >
                    <Icon type="exclamation-circle" />
                  </Tooltip>
                }
              >
                <div className="content">
                  <span>{fixedRatio || "5%"}</span>
                </div>
              </Card>
            </Col>
          </Row>
        </Row>
        <Row className="table-wrapper">
          <div className="table-pannel">
            <div className="data-operation">
              <span className="data-total">共找到 {total_detail} 笔明细</span>
              <a href={this.downloadUrl} className="download-xls">
                下载表格
                <i />
              </a>
            </div>
          </div>
          <Table
            className="profit-table"
            loading={{
              tip: "loading...",
              spinning: isLoading
            }}
            scroll={{ x: 600 }}
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            onChange={this.onPageChange}
          />
        </Row>
      </div>
    );
  }
}

export default withRouter(ProfitCenter);
