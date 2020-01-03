import * as React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';
import FormItemDecorator from '@/components/FormItemDecorator';

type P = FormComponentProps &
  RouteComponentProps & {
    merchantInfo: any;
    onSubmit(values: any): any;
  };
type S = {};

const { Option } = Select;
const { RangePicker } = DatePicker;

// 列表查询
@(withRouter as any)
class Query extends React.Component<P, S> {
  componentDidMount() {}

  // 添加特殊价商品
  addSpecialProduct = () => {
    const { merchantInfo, history } = this.props;
    history.push({
      pathname: `/business/provider/specialPrice/add/${merchantInfo.developerId}`,
    });
  };

  onSubmit = () => {
    setTimeout(() => {
      this.props.form.validateFields((err, values) => {
        this.props.onSubmit(values);
      });
    });
  };

  render() {
    const form = this.props.form;

    return (
      <Form layout="inline" className="search-form">
        <div className="query-area">
          <div className="search-form-condition">
            <FormItemDecorator
              label="是否有效"
              form={form}
              field="status"
              options={{
                initialValue: 1,
              }}
            >
              <Select style={{ width: 150 }} onChange={this.onSubmit}>
                <Option value={1}>已生效</Option>
                <Option value={2}>未生效</Option>
                <Option value={0}>已失效</Option>
              </Select>
            </FormItemDecorator>
            <FormItemDecorator label="商品ID" form={form} field="productId">
              <Input
                style={{ width: 220 }}
                placeholder="请输入商品ID"
                onPressEnter={this.onSubmit}
              ></Input>
            </FormItemDecorator>
            {/* <FormItemDecorator label="有效期" form={form} field="validDate">
              <RangePicker format="YYYY/MM/DD" placeholder={['开始时间', '截止时间']} />
            </FormItemDecorator> */}
          </div>
          <div className="search-form-btn">
            <Button type="primary" style={{ marginRight: 10 }} onClick={this.onSubmit}>
              查询
            </Button>
            <Button onClick={this.addSpecialProduct}>新增特殊价</Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create<P>()(Query);
