import * as React from 'react'
import { Form, Input, Select, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import FormItemDecorator from '@/components/FormItemDecorator'
import { Character } from '@xmly/cbp-spec/lib/portal/service/oss/ChannelStrategyService'
import CustRoleSelect from '@/components/CustComponents/CustRoleSelect'

type P = FormComponentProps & {
  currentRole: Character
  roleList: Array<Character>
  onSetCurrentRole(role: { id: number; name: string }): any
  onSubmit(params: any): any
}
type S = {
  productId: string | number
  visible: boolean
  // roleList: Array<Character>;
}

const { Option } = Select

// 列表查询
class Query extends React.Component<P, S> {
  state = {
    visible: false,
    productId: '',
    roleList: [],
  }

  componentDidMount() {
    // this.getMerchantRoles();
  }

  onSubmit = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const params = {
              pageIndex: 1,
              pageSize: 10,
              productId: ~~values.productId,
              ...values,
            }
            this.props.onSubmit(params)
          }
        })
      })
      resolve({ code: 0, message: '请求完成' })
    })
  }

  showBacthSetModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleConfirm = () => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  // 获取角色列表
  // getMerchantRoles = async () => {
  //   try {
  //     const res = await API.channel.getAllCharacters();
  //     if (res.code === AJAX_STATUS.SUCCESS) {
  //       const roleList = res.data;
  //       this.setState({
  //         roleList,
  //       });
  //     } else {
  //       message.error(res.message);
  //     }
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // };

  setCurrentRole = async (id: number, role) => {
    const currentRole = {
      id,
      name: role.props.children,
    }
    this.onSubmit().then(() => {
      this.props.onSetCurrentRole(currentRole)
    })
  }

  renderRoleList = () => {
    const { roleList } = this.props
    return roleList.map((item: Character, index) => {
      return (
        <Option key={index} value={item.id}>
          {item.name}
        </Option>
      )
    })
  }

  render() {
    const { currentRole } = this.props
    const form = this.props.form
    const defalutRoleId = currentRole ? currentRole.id : ''
    return (
      <div>
        <Form layout="inline" className="search-form">
          <div className="search-form-condition">
            <FormItemDecorator label="商品ID" field="productId" form={form}>
              <Input style={{ width: 200 }} placeholder="请输入商品ID" onPressEnter={this.onSubmit} />
            </FormItemDecorator>
            <FormItemDecorator label="角色" field="characterId" form={form} options={{ initialValue: defalutRoleId }}>
              <CustRoleSelect style={{ width: 200 }} onSubmit={(e, role) => this.setCurrentRole(e, role)} />
            </FormItemDecorator>
            {/* <FormItemDecorator label="原价区间" form={form} field="originPrice">
              <RangePrice form={this.props.form} field="originPrice"/>
            </FormItemDecorator>
            <FormItemDecorator label="采购价区间" form={form} field="purchasePrice">
              <RangePrice form={this.props.form} field="purchasePrice"/>
            </FormItemDecorator> */}
          </div>
          <div className="search-form-btn">
            <Button icon="search" type="primary" style={{ marginRight: 10 }} onClick={this.onSubmit}>
              查询
            </Button>
            {/* <Button icon="close" onClick={this.showBacthSetModal}>
              批量设置价盘
            </Button> */}
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create<P>()(Query)
