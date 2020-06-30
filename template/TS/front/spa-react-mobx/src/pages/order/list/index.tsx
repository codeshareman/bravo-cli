import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import MainLayout from "@/layout";
import { Tabs } from "antd";
import OrderList from "./OrderList";

import "./index.scss";

export const enum TabPaneKey {
  //全部
  ALL = 0,
  // 待发货
  WAIT_DELIVER = 1,
  // 待收货
  WAIT_RECEIVE = 2,
  // 已完成
  COMPLETE = 3
}

const TabPane = Tabs.TabPane;

type P = RouteComponentProps & {};
type S = {
  tabKey: string;
};

// 订单中心
class OrderCenter extends React.Component<P, S> {
  readonly state: S = {
    tabKey: TabPaneKey.ALL.toString()
  };

  UNSAFE_componentWillMount() {
    const { state } = this.props.location;
    console.log({ state });
    if (state && state.orderState) {
      this.setState({
        tabKey: `${state.orderState}`
      });
    }
  }

  handleTabChange = (activeKey: string) => {
    this.setState({
      tabKey: activeKey
    });
  };

  render() {
    const { tabKey } = this.state;

    return (
      <MainLayout>
        <div className="order-center">
          <Tabs defaultActiveKey={tabKey} onChange={this.handleTabChange}>
            <TabPane tab="全部订单" key={TabPaneKey.ALL.toString()}>
              <OrderList tabkey={TabPaneKey.ALL} />
            </TabPane>
            <TabPane tab="待发货" key={TabPaneKey.WAIT_DELIVER.toString()}>
              <OrderList tabkey={TabPaneKey.WAIT_DELIVER} />
            </TabPane>
            <TabPane tab="待收货" key={TabPaneKey.WAIT_RECEIVE.toString()}>
              <OrderList tabkey={TabPaneKey.WAIT_RECEIVE} />
            </TabPane>
            <TabPane tab="已完成" key={TabPaneKey.COMPLETE.toString()}>
              <OrderList tabkey={TabPaneKey.COMPLETE} />
            </TabPane>
          </Tabs>
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(OrderCenter);
