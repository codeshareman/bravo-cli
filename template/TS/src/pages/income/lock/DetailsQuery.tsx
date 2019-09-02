import React, { Component } from "react";
import { Form, Select, DatePicker, Button, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";

type P = FormComponentProps & {
  onSubmit(values);
};
type S = {};

class DetailsQuery extends Component<P, S> {
  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    const values = form.getFieldsValue();
    onSubmit && onSubmit(values);
  };

  render() {
    const { form } = this.props;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItemDecorator form={form} label="订单号" filed="orderId">
          <Input placeholder="请输入订单号" style={{ width: 300 }} />
        </FormItemDecorator>
        <FormItemDecorator form={form} label="用户名称" filed="buyerName">
          <Input placeholder="请输入用户名称" />
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

export default Form.create<P>()(DetailsQuery);
