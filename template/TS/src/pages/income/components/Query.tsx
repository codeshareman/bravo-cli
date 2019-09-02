import React, { Component } from "react";
import { Form, Select, DatePicker, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { connect } from "react-redux";
import FormItemDecorator from "@/components/FormItemDecorator";
import moment from "moment";
import SERVICE from "@/api";
import { AJAX_STATUS } from "@/utils/constant";
import { BusinessType } from "client/service/RevenueService";

type P = FormComponentProps & {
  onSubmit?(value: any);
  saleRevenue?: any;
};
type S = {
  bussinessTypes: Array<BusinessType>;
  loading: boolean;
};

const { MonthPicker } = DatePicker;

class Query extends Component<P, S> {
  state = {
    bussinessTypes: [],
    loading: true
  };

  componentDidMount() {
    this.getBusinessTypes();
  }

  setInitialParams = () => {
    const { bussinessTypes } = this.state;
    const { setFieldsValue } = this.props.form;

    setFieldsValue({
      businessType: bussinessTypes.length > 0 ? bussinessTypes[0].id : -1
    });

    //初始化数据完成后 直接查询数据
    this.handleSubmit(window.event);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    const values = form.getFieldsValue();
    onSubmit(values);
  };

  // 获取业务类型
  getBusinessTypes = async () => {
    const res = await SERVICE.revenue.getBusinessTypes();
    try {
      if (AJAX_STATUS.SUCCESS === res.code) {
        const bussinessTypes = res.data || [];
        this.setState(
          {
            bussinessTypes,
            loading: false
          },
          () => {
            this.setInitialParams();
          }
        );
      } else {
        message.error("业务类型获取失败~");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // 渲染业务类型
  renderBussinessType = () => {
    const { bussinessTypes } = this.state;
    return bussinessTypes.map((item, index) => {
      return (
        <Select.Option key={index} value={item.id}>
          {item.name}
        </Select.Option>
      );
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldValue } = form;
    const { loading } = this.state;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItemDecorator
          form={form}
          label="筛选"
          filed="businessType"
          options={{
            initialValue: getFieldValue("businessType")
          }}
        >
          <Select style={{ minWidth: 150 }} loading={loading}>
            {this.renderBussinessType()}
          </Select>
        </FormItemDecorator>

        <FormItemDecorator
          form={form}
          label="月份"
          filed="yearMonth"
          options={{ initialValue: moment() }}
        >
          <MonthPicker placeholder="请选择月份" />
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

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(Form.create<P>()(Query));
