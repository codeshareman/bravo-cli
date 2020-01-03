import * as React from 'react';
import { Form, Input, Select, DatePicker, Button, Modal, Table } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';
import FormItemDecorator from '@/components/FormItemDecorator';
import RangePrice from '@/components/RangePrice';
import PriceSetModal from '@/components/PriceSetModal';

type P = FormComponentProps &
  RouteComponentProps & {
    onSubmit(values: any): any;
  };
type S = {
  visible: boolean;
  productId: string | number;
};

const { Option } = Select;
const { RangePicker } = DatePicker;

// 列表查询
@(withRouter as any)
class Query extends React.Component<P, S> {
  readonly state: S = {
    visible: false,
    productId: '',
  };

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      this.props.onSubmit(values);
    });
  };

  // 批量设置特殊价
  batchSetSpecialPrice = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleConfirm = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const form = this.props.form;
    const spuColumn = [
      {
        title: '商品',
        dataIndex: 'productInfo',
        key: 'productInfo',
        width: 270,
        render: (product: { name: string; num: string }) => {
          return (
            <>
              <p>商品名称: {product.name}</p>
              <p>商品名称: {product.num}</p>
            </>
          );
        },
      },
      {
        title: '原价(元)',
        dataIndex: 'originalPrice',
        key: 'originalPrice',
        width: 100,
        render: (originalPrice: number) => {
          return originalPrice.toFixed(2);
        },
      },
      {
        title: '价盘价(元)',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        render: (price: number) => {
          return price.toFixed(2);
        },
      },
      {
        title: '特殊价',
        dataIndex: 'specialPrice',
        key: 'specialPrice',
        width: 200,
        render: (specialPrice: number) => {
          return specialPrice.toFixed(2);
        },
      },
      {
        title: '特殊价有效期',
        dataIndex: 'specialValidDate',
        key: 'specialValidDate',
      },
    ];

    return (
      <div>
        <Form layout="inline" className="search-form">
          <div className="query-area">
            <div className="search-form-condition">
              <FormItemDecorator label="商品ID" form={form} field="productId">
                <Input style={{ width: 220 }} placeholder="请输入商品编号" onPressEnter={this.onSubmit}></Input>
              </FormItemDecorator>
              {/* <FormItemDecorator label="原价" form={form} field="validDate">
                <RangePrice />
              </FormItemDecorator> */}
            </div>
            <div className="search-form-btn">
              <Button style={{ marginRight: 10 }} type="primary" onClick={this.onSubmit}>
                查询
              </Button>
              {/* <Button icon="add" onClick={this.batchSetSpecialPrice}>
                批量设置特殊价
              </Button> */}
            </div>
          </div>
        </Form>
        {/* <PriceSetModal
          title="批量设置特殊价"
          productId={this.state.productId}
          visible={this.state.visible}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          destroyOnClose
        /> */}
      </div>
    );
  }
}

export default Form.create()(Query);
