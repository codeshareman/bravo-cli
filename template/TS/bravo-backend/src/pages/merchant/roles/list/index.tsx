import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { AJAX_STATUS } from '@/shared/common/constants'
import { message, Button, Table, Form, Input, Modal } from 'antd'
import FormItemDecorator from '@/components/FormItemDecorator'
import TextArea from 'antd/lib/input/TextArea'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import { Character, CreateCharacterRequest } from '@xmly/cbp-spec/lib/portal/service/oss/ChannelStrategyService'
import API from '@/api'
import './index.scss'

type P = RouteComponentProps & FormComponentProps & {}
type S = {
  dataSource: Array<any>
  searchParams: any
  loading: boolean
  isEdit: boolean
  visible: boolean
  curRole: { id: number; name: string }
}

@observer
class MerchantRole extends Component<P, S> {
  state = {
    dataSource: [],
    searchParams: null,
    loading: true,
    isEdit: false,
    visible: false,
    curRole: null,
  }

  componentDidMount() {
    this.initialRequest()
  }

  initialRequest = () => {
    this.getMerchantRoles()
  }

  getMerchantRoles = async () => {
    this.setState({
      loading: true,
      dataSource: [],
    })
    try {
      const res = await API.channel.getAllCharacters()
      if (res.code === AJAX_STATUS.SUCCESS) {
        const dataSource = res.data
        this.setState({
          loading: false,
          dataSource,
        })
      } else {
        message.error(res.message)
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  getTableProps = () => {
    const { dataSource } = this.state
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (id: number, rows, index) => {
          return index + 1
        },
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '备注',
        dataIndex: 'description',
        key: 'description',
        render: curVal => {
          return curVal ? curVal : '无'
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        render: (val, row) => {
          return (
            <>
              <a style={{ marginRight: 10 }} onClick={() => this.setPricePlate(row)}>
                设置价盘
              </a>
              {/* <a>开通权益充值</a> */}
              {/* <a onClick={() => this.handleDelete(row)}>删除</a> */}
            </>
          )
        },
      },
    ]
    return { dataSource, columns, rowKey: 'id' }
  }

  // 设置价盘
  setPricePlate = (rows: Character) => {
    this.props.history.push({
      pathname: `/business/role/channelPrice/${rows.id}`,
    })
  }

  handleAddRole = () => {
    this.setState({
      visible: true,
      isEdit: false,
    })
  }

  handleEdit = () => {
    this.setState({
      visible: true,
      isEdit: true,
    })
  }

  handleConfirm = () => {
    this.props.form.validateFields((err, params) => {
      if (!err) {
        const createParams = {
          name: params.name || '',
          description: params.description || '',
        }
        this.createCharacter(createParams)
        this.setState({
          visible: false,
        })
      }
    })
  }

  createCharacter = async (params: CreateCharacterRequest) => {
    const res = await API.channel.createCharacter(params)
    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success('角色创建成功')
      this.getMerchantRoles()
    } else {
      message.error(res.message)
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { loading } = this.state
    const { form } = this.props

    return (
      <div className="merchant-role">
        {/* <CustBreadcrumb routes={routes} showCurrentPosition /> */}
        <h2 className="first-title">商户角色</h2>
        <div className="table-actions">
          <Button type="primary" onClick={this.handleAddRole}>
            添加
          </Button>
        </div>
        {/* <div className="stastic">
          共 <span className="total"> {dataSource.length} </span> 条数据
        </div> */}
        <Table
          {...this.getTableProps()}
          loading={{
            spinning: loading,
            tip: '数据加载中...',
          }}
          pagination={false}
        />
        {/* 添加or编辑 */}
        <Modal
          title={!this.state.isEdit ? '添加角色' : '修改角色'}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={this.handleConfirm}
          maskClosable={false}
          destroyOnClose
        >
          <FormItemDecorator
            required
            field="name"
            label="角色名称"
            form={form}
            labelCol={{ span: 4, style: { textAlign: 'right' } }}
            wrapperCol={{ span: 20 }}
            options={{
              rules: [
                {
                  required: true,
                  message: '你还未输入角色名称',
                },
              ],
            }}
          >
            <Input disabled={this.state.isEdit} placeholder="请输入角色名称"></Input>
          </FormItemDecorator>
          <FormItemDecorator
            field="description"
            label="备注"
            form={form}
            labelCol={{ span: 4, style: { textAlign: 'right', lineHeight: 'normal' } }}
            wrapperCol={{ span: 20 }}
          >
            <TextArea placeholder="请输入备注(选填)" autoSize={{ minRows: 5, maxRows: 5 }}></TextArea>
          </FormItemDecorator>
        </Modal>
      </div>
    )
  }
}

export default withRouter(Form.create<P>()(MerchantRole))
