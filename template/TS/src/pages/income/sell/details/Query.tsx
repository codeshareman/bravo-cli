import React, { Component } from "react";
import { Form, Button, DatePicker } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";
import moment, { Moment } from "moment";

type P = FormComponentProps & {
  defaultDate: Moment
  onSubmit?(value: any);
};
type S = {};

const { MonthPicker } = DatePicker;

class Query extends Component<P, S> {
  
  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    const fieldsData = form.getFieldsValue();
    const yearMonth = fieldsData.yearMonth;
    const values = {
      year: ~~yearMonth.format("YYYY"),
      month: ~~yearMonth.format("MM")
    };

    onSubmit(values);
  };

  render() {
    const { form, defaultDate } = this.props;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItemDecorator
          form={form}
          label="月份"
          filed="yearMonth"
          options={{ initialValue: defaultDate}}
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

export default Form.create<P>()(Query);
