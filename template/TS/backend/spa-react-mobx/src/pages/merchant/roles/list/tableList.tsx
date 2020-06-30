import React, { Component } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'

import './index.scss'

import FormItemDecorator from '@/components/FormItemDecorator'
import { FormComponentProps } from 'antd/lib/form'
import TextArea from 'antd/lib/input/TextArea'
import { withRouter, RouteComponentProps } from 'react-router-dom'

type P = FormComponentProps & RouteComponentProps & {}
type S = {
  isEdit: boolean
  setModalVisible: boolean
  visible: boolean
  productId: string | number
  dataSource: Array<any>
}

@(withRouter as any)
class TableList extends Component<P, S> {
  readonly state: S = {
    isEdit: false,
    visible: false,
    setModalVisible: false,
    productId: '',
    dataSource: [],
  }

  // 设置价盘
  setPricePlate = () => {
    this.props.history.push({
      pathname: '/business/provider/specialPrice/add',
    })
  }

  handleAddRole = () => {
    this.setState({
      visible: true,
      isEdit: false,
    })
  }

  handleEdit = row => {
    this.setState(
      {
        visible: true,
        isEdit: true,
      },
      () => {
        this.props.form.setFieldsValue(row)
      },
    )
  }

  handleConfirm = () => {
    if (this.state.isEdit) {
      this.props.form.validateFields(err => {
        if (!err) {
          this.setState({
            visible: false,
          })
        }
      })
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'roleId',
        key: 'roleId',
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
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
              <a style={{ marginRight: 10 }} onClick={() => this.handleEdit(row)}>
                修改
              </a>
              <a style={{ marginRight: 10 }} onClick={this.setPricePlate}>
                设置价盘
              </a>
              {/* <a onClick={() => this.handleDelete(row)}>删除</a> */}
            </>
          )
        },
      },
    ]

    return (
      <div className="content-view">
        <div className="table-actions">
          <Button type="primary" onClick={this.handleAddRole}>
            添加
          </Button>
        </div>
        <Table
          className="table-list"
          dataSource={this.state.dataSource}
          columns={columns}
          rowSelection={{
            type: 'checkbox',
          }}
          pagination={false}
          rowKey="roleId"
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
          <Form>
            <FormItemDecorator
              label="角色名称"
              labelCol={{ span: 4, style: { textAlign: 'left' } }}
              wrapperCol={{ span: 20 }}
              form={this.props.form}
              field="roleName"
            >
              <Input disabled={this.state.isEdit} placeholder="请输入角色名称"></Input>
            </FormItemDecorator>
            <FormItemDecorator
              label="备注"
              labelCol={{ span: 4, style: { textAlign: 'left' } }}
              wrapperCol={{ span: 20 }}
              form={this.props.form}
              field="remark"
            >
              <TextArea placeholder="请输入备注(选填)" autoSize={{ minRows: 5, maxRows: 5 }}></TextArea>
            </FormItemDecorator>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create<P>()(TableList)
