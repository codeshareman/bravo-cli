import * as React from 'react';
import { DatePicker, Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import FormItemDecorator from '@/components/FormItemDecorator';

const { RangePicker } = DatePicker;

type P = FormComponentProps & {
  onSubmit(values);
};
type S = {};

class Query extends React.Component<P, S> {
  
  handleSubmit = () => {
    const { onSubmit, form } = this.props;
    onSubmit && onSubmit(form.getFieldsValue());
  };

  render() {
    const { form } = this.props;
    return (
      <Form layout="inline">
        <FormItemDecorator form={form} field="orderCreateTime" label="订单生成时间">
          <RangePicker />
        </FormItemDecorator>
        <FormItemDecorator form={form} field="orderNo" label="订单号">
          <Input style={{ width: 250 }} placeholder="请输入订单号" />
        </FormItemDecorator>
        <Form.Item>
          <Button type="primary" onClick={this.handleSubmit}>
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<P>()(Query);
