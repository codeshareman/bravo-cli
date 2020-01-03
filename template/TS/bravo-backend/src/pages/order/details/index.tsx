import React, { Component } from 'react';
import { Typography, Divider, message, Spin } from 'antd';
import { CustBreadcrumb } from '@/components/CustComponents';
import EditOrderList from '@/components/EditOrderList';

import './index.scss';
import API from '@/api';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AJAX_STATUS } from '@/shared/common/constants';
import { PurchaseOrderDetail, OrderState } from '@/client/portal/service/oss/OrderService';
import { getCityInfoByCode, getLocalePrice } from '@/shared/common/utils';
import { PurchaseProductGroupDetail } from '@/client/portal/service/provider/CartService';

type P = RouteComponentProps<{ id: string }> & {};
type S = {
  orderDetails: PurchaseOrderDetail;
  productList: Array<PurchaseProductGroupDetail>;
};

const routes = [
  {
    path: '/order',
    name: '实物订单',
  },
  {
    path: '',
    name: '订单详情',
  },
];

const { Paragraph, Text, Title } = Typography;

class Details extends Component<P, S> {
  readonly state: S = {
    orderDetails: {
      id: null,
      orderNo: '',
      createTime: '',
      productTypeCount: null,
      totalQuantity: null,
      totalAmount: '',
      state: null,
      completedTime: '',
      companyName: '',
      agentDistrict: '',
      purchaseList: null,
      contactName: '',
      phone: '',
      orderContactName: '',
      orderContactAddressLine: '',
      orderContactPhone: '',
      comment: '',
    },
    productList: [],
  };

  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails = async () => {
    const {
      match: { params },
    } = this.props;
    const id = params.id;
    try {
      const res = await API.order.purchaseList(id);
      if (res.code === AJAX_STATUS.SUCCESS) {
        const productInfo = res.data.purchaseList;
        this.setState({
          orderDetails: res.data,
          productList: productInfo.purchaseList,
        });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      throw new Error(err.toString());
    }
  };

  renderOrderStatus = (status: number) => {
    switch (status) {
      case OrderState.COMPLETE:
        return '已完成';
      case OrderState.WAIT_DELIVER:
        return '待发货';
      case OrderState.WAIT_RECEIVE:
        return '待收货';
    }
  };

  render() {
    const { orderDetails, productList } = this.state;
    return (
      <div className="order-details">
        <CustBreadcrumb routes={routes} showCurrentPosition />
        <div className="order-info">
          <div className="order-info-warp">
            <h3>商品信息</h3>
            <Paragraph>
              <Title level={4}>公司名称</Title>
              <Text>{orderDetails.companyName || '无'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>代理地区：</Title>
              <Text>
                {orderDetails.agentDistrict && getCityInfoByCode(orderDetails.agentDistrict).name}
              </Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>联系人：</Title>
              <Text>{orderDetails.contactName || '无'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>手机号码：</Title>
              <Text>{orderDetails.phone || '无'}</Text>
            </Paragraph>
          </div>
          <Divider type="vertical" />
          <div className="order-info-warp">
            <h3>订单信息</h3>
            <Paragraph>
              <Title level={4}>订单编号：</Title>
              <Text>{orderDetails.orderNo || '无'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>订单生成时间：</Title>
              <Text>{orderDetails.createTime || '无'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>订单金额：</Title>
              <Text>{getLocalePrice(orderDetails.totalAmount) || '无'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>订单状态：</Title>
              <Text>{orderDetails.state ? this.renderOrderStatus(orderDetails.state) : '无'}</Text>
            </Paragraph>
            {orderDetails.completedTime && (
              <Paragraph>
                <Title level={4}>订单完成时间：</Title>
                <Text>{orderDetails.completedTime || '无'}</Text>
              </Paragraph>
            )}
          </div>
          <Divider type="vertical" />
          <div className="order-info-warp">
            <h3>收货信息</h3>
            <Paragraph>
              <Title level={4}>收货人：</Title>
              <Text>{orderDetails.orderContactName || '无'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>收货地址：</Title>
              <Text>{orderDetails.orderContactAddressLine || '无'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>手机号码：</Title>
              <Text>{orderDetails.orderContactPhone || '无'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>备注：</Title>
              <Text>{orderDetails.comment || '无'}</Text>
            </Paragraph>
          </div>
        </div>
        <EditOrderList productList={productList} />
      </div>
    );
  }
}

export default withRouter(Details);
