import React, { Component } from "react";
import { Form, Button, Input, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";
import SERVICE from "@/api";
import { Cascader } from "antd";
import { AJAX_STATUS } from "@/utils/constant";
import { Distributor } from "client/service/RevenueService";
import { FilterParams } from "@/types/agent";

import "./index.scss";

type P = FormComponentProps & {
  filter: FilterParams;
  onSubmit(value: any);
};
type S = {
  distributorList: Distributor[];
  initialDist: Distributor[];
};

type CascaderDataType = {
  area: string;
  parentUid: number;
  distType: string;
  value: number;
  label: string;
  children?: CascaderDataType[];
};

class Query extends Component<P, S> {
  state = {
    distributorList: [],
    initialDist: []
  };

  componentDidMount = () => {
    this.getDistributor();
  };

  componentWillReceiveProps(nextProps) {
    const preFilter = this.props.filter;
    const nextFilter = nextProps.filter;

    //如果父级条件有变化则重置表单内容
    if (
      preFilter.businessType !== nextFilter.businessType ||
      preFilter.params.month !== nextFilter.params.month ||
      preFilter.params.year !== nextFilter.params.year
    ) {
      const { form } = nextProps;
      form.resetFields();
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        onSubmit(values);
      }
    });
  };

  // 获取所属商户
  getDistributor = async () => {
    const res = await SERVICE.revenue.getDistributorTree();
    let distributorList = [];
    try {
      if (res.code === AJAX_STATUS.SUCCESS) {
        distributorList = [this.getCascaderData(res.data)];
      } else {
        distributorList = [];
      }
      this.setState({
        distributorList
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  // 获取级联商户数据
  getCascaderData = (data: any) => {
    if (Object.prototype.toString.call(data) !== "[object Array]") {
      let itemData: CascaderDataType = {
        area: data.area,
        parentUid: data.parentUid,
        distType: data.distType,
        value: data.uid,
        label: data.nickName || data.uid
      };
      if (data.child && data.child.length > 0) {
        itemData.children = this.getCascaderData(data.child);
      }
      return itemData;
    } else {
      return data.map((item, index) => {
        let itemData: CascaderDataType = {
          area: item.area,
          parentUid: item.parentUid,
          distType: item.distType,
          value: item.uid,
          label: item.nickName || item.uid
        };
        if (item.child && item.child.length > 0) {
          itemData.children = this.getCascaderData(item.child);
        }
        return itemData;
      });
    }
  };

  render() {
    const { form } = this.props;
    return (
      <Form
        layout="inline"
        onSubmit={this.handleSubmit}
        className="sell-agent-query"
      >
        <FormItemDecorator
          required
          form={form}
          label="所属商户"
          filed="distUid"
          validator="required"
          options={{ initialValue: this.state.initialDist }}
        >
          <Cascader
            changeOnSelect
            style={{ minWidth: 300 }}
            options={this.state.distributorList}
            placeholder="请选择商户"
          />
        </FormItemDecorator>
        <FormItemDecorator form={form} label="图书馆" filed="queryString">
          <Input placeholder="请输入图书馆ID或名称" />
        </FormItemDecorator>
        <Form.Item>
          <Button icon="search" htmlType="submit" type="primary">
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<P>()(Query);
