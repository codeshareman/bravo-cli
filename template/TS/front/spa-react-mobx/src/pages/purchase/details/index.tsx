import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Tabs, message } from "antd";
import MainLayout from "@/layout";
import { CustBreadcrumb } from "@/components/CustComponents";
import Gallery from "./gallery";
import DetailProperty from "./DetailProperty";
import Specifications from "./Specifications";
import Description from "./Description";
import { Product, SpecAttributes } from "@/api/service/ProductService";
import { HTTP_STATUS } from "@/shared/common/constants";
import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps<{
  id: string;
}> & {};
type S = {
  product: Product;
  attributes: SpecAttributes[];
};

const { TabPane } = Tabs;
class Details extends Component<P, S> {
  state = {
    product: null,
    attributes: []
  };

  UNSAFE_componentWillMount() {
    this.getDetailInfo();
  }

  getDetailInfo = async () => {
    const { id } = this.props.match.params;
    const res = await Api.product.findProductById(Number(id));
    if (HTTP_STATUS.SUCCESSS !== res.code) {
      message.error(res.message);
      return false;
    }
    const product = res.data;
    this.setState({
      product
    });
    if (product.categoryId) {
      const tempRes = await Api.product.findTemplateByCategoryId(
        product.categoryId
      );
      if (HTTP_STATUS.SUCCESSS === res.code) {
        this.setState({
          attributes: tempRes.data.specAttributes || []
        });
      } else {
        message.error(res.message);
      }
    }
  };

  handleTabsChange = () => {};

  render() {
    const { product, attributes } = this.state;
    const pictures =
      product && product.pictures && product.pictures.length
        ? product.pictures
        : [];

    return (
      <MainLayout>
        <div className="purchase-details">
          <CustBreadcrumb />
          <div className="purchase-details-content">
            {pictures && pictures.length ? (
              <Gallery dataSource={pictures} />
            ) : null}
            <DetailProperty product={product} attributes={attributes} />
          </div>
          <Tabs defaultActiveKey="1" onChange={this.handleTabsChange}>
            <TabPane tab="商品详情" key="1">
              <Description product={product} />
            </TabPane>
            {/* <TabPane tab="参数规格" key="2">
              <Specifications product={product} />
            </TabPane> */}
          </Tabs>
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(Details);
