import * as React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';
import FormItemDecorator from '@/components/FormItemDecorator';
import { AccountRole } from '@/client/portal/service/oss/AccountService';
import CustRoleSelect from '@/components/CustComponents/CustRoleSelect';

type P = FormComponentProps & RouteComponentProps & {};
type S = {};

const { Option } = Select;
const { RangePicker } = DatePicker;

// 列表查询
@(withRouter as any)
class Query extends React.Component<P, S> {
  // 添加特殊价商品
  addSpecialProduct = () => {
    this.props.history.push('/business/provider/specialPrice/add');
  };

  renderMerchantRoles = () => {
    const options = [
      {
        value: AccountRole.SERVICE_PROVIDER,
        name: '服务商',
      },
      {
        value: AccountRole.DEALER,
        name: '经销商',
      },
      {
        value: AccountRole.DIRECT_CUSTOMER,
        name: '直客',
      },
    ];
    return options.map((item, index) => {
      return (
        <Option key={index} value={item.value}>
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
            <FormItemDecorator label="真实姓名" form={form} field="shopNumOrName">
              <Input style={{ width: 220 }} placeholder="请输入用户真实姓名"></Input>
            </FormItemDecorator>
            <FormItemDecorator label="角色" form={form} field="validDate">
              <CustRoleSelect style={{ width: 200 }} placeholder="请选择角色" allowClear />
            </FormItemDecorator>
          </div>
          <div className="search-form-btn">
            <Button icon="search" type="primary" style={{ marginRight: 10 }}>
              查询
            </Button>
            <Button icon="add">重置</Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create()(Query);
