import * as React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';
import FormItemDecorator from '@/components/FormItemDecorator';
import { TradeType } from '@xmly/cbp-spec/lib/portal/service/oss/AccountService';

type P = FormComponentProps &
  RouteComponentProps & {
    onSubmit(values: any): any;
  };
type S = {};

const { Option } = Select;
const { RangePicker } = DatePicker;

// 列表查询
class Query extends React.Component<P, S> {
  
  onSubmit = () => {
    setTimeout(() => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onSubmit(values);
        }
      });
    });
  };

  renderTradeType = () => {
    const options = [
      {
        value: TradeType.RECHARGE,
        name: '充值',
      },
      {
        value: TradeType.WITHDRAW,
        name: '提现',
      },
      {
        value: TradeType.PURCHASE,
        name: '采购',
      },
      {
        value: TradeType.TRANSER_IN,
        name: '转入',
      },
      {
        value: TradeType.TRANSER_OUT,
        name: '转出',
      },
      {
        value: TradeType.WITHDRAW_FEE,
        name: '提现手续费',
      },
    ];
    return options.map((item, index) => {
      return (
        <Option key={index} value={item.value.toString()}>
          {item.name}
        </Option>
      );
    });
  };

  render() {
    const form = this.props.form;

    return (
      <Form layout="inline" className="search-form">
        <div className="query-area">
          <div className="search-form-condition">
            <FormItemDecorator label="交易时间" form={form} field="tradeTime">
              <RangePicker onChange={this.onSubmit} allowClear></RangePicker>
            </FormItemDecorator>
            <FormItemDecorator label="交易类型" form={form} field="tradeType">
              <Select
                style={{ width: 200 }}
                placeholder="请选择交易类型"
                onChange={this.onSubmit}
                allowClear
              >
                {this.renderTradeType()}
              </Select>
            </FormItemDecorator>
            <FormItemDecorator label="交易流水号" form={form} field="trxNo">
              <Input
                style={{ width: 240 }}
                placeholder="请输入交易流水号"
                onPressEnter={this.onSubmit}
              ></Input>
            </FormItemDecorator>
          </div>
          <div className="search-form-btn">
            <Button
              icon="search"
              type="primary"
              style={{ marginRight: 10 }}
              onClick={this.onSubmit}
            >
              查询
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default withRouter(Form.create<P>()(Query));
