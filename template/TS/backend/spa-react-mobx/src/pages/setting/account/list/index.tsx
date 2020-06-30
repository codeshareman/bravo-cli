import React, { Component } from 'react'
import { Divider, Table, Modal, message, Tag } from 'antd'
import { CustBreadcrumb } from '@/components/CustComponents'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { AJAX_STATUS } from '@/shared/common/constants'
import API from '@/api'
import './index.scss'

type P = RouteComponentProps & {}
type S = {
  visible: boolean
  dataSource: Array<any>
  loading: boolean
  total: number
  totalPage: number
  curKcId: string
  curUserName: string
  searchParams: {
    pageNum: number
    pageSize: number
  }
}

class AccountManage extends Component<P, S> {
  state = {
    visible: false,
    loading: true,
    totalPage: 1,
    total: 0,
    curKcId: '',
    curUserName: '',
    searchParams: {
      pageNum: 1,
      pageSize: 10,
    },
    dataSource: [],
  }

  componentDidMount() {
    this.initialRequest()
  }

  initialRequest = () => {
    const { searchParams } = this.state
    this.getList(searchParams)
  }

  getList = async (searchParams: { pageNum: number; pageSize: number }) => {
    this.setState({
      dataSource: [],
      total: 0,
      loading: true,
    })

    try {
      const res = await API.userManage.list(searchParams.pageNum, searchParams.pageSize)
      if (res.code === AJAX_STATUS.SUCCESS) {
        this.setState({
          dataSource: res.data.list,
          total: res.data.total,
          totalPage: res.data.totalPage,
          loading: false,
        })
      } else {
        message.error(res.message)
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  handleAccountEdit = ({ kcId }) => {
    console.log(kcId, '====')
    this.props.history.push(`/setting/account/edit/${kcId}`)
  }

  handleAccountCreate = () => {
    this.props.history.push(`/setting/account/add`)
  }

  handleAccountDelete = async ({ kcId, userName }) => {
    this.setState({
      visible: true,
      curKcId: kcId,
      curUserName: userName,
    })
  }

  onOk = async () => {
    const { curKcId, searchParams } = this.state
    const res = await API.userManage.del(curKcId)
    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success('删除成功')
      const params = {
        ...searchParams,
        pageNum: 1,
      }
      this.getList(params)
    } else {
      message.error('删除失败')
    }
    this.setState({
      visible: false,
    })
  }

  onCancel = () => {
    this.setState({
      visible: false,
    })
  }

  getTableProps = () => {
    const { dataSource } = this.state
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '真实姓名',
        width: 200,
        dataIndex: 'realName',
        key: 'realName',
        render: realName => {
          return realName || '--'
        },
      },
      {
        title: '角色',
        width: 300,
        dataIndex: 'roles',
        key: 'roles',
        render: (roles: Array<any>) => {
          if (JSON.stringify(roles) !== '{}') {
            return Object.keys(roles).map((key, index) => {
              return (
                <Tag key={index} style={{ marginBottom: 4 }}>
                  {roles[key]}
                </Tag>
              )
            })
          } else {
            return '--'
          }
        },
      },
      // {
      //   title: '负责地区',
      //   width: 200,
      //   dataIndex: 'area',
      //   key: 'area',
      // },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        render: (curVal, row: any) => {
          return (
            <>
              <a style={{ marginRight: 10 }} onClick={() => this.handleAccountEdit(row)}>
                修改
              </a>
              <a style={{ marginRight: 10 }} onClick={() => this.handleAccountDelete(row)}>
                删除
              </a>
            </>
          )
        },
      },
    ]
    return {
      dataSource,
      columns,
      rowKey: 'kcId',
    }
  }

  render() {
    const { visible, loading, searchParams, total, curUserName } = this.state
    const routes = [
      { path: '', name: '设置' },
      { path: '', name: '用户管理' },
    ]
    return (
      <div className="account-setting">
        <CustBreadcrumb routes={routes}></CustBreadcrumb>
        <h2>
          用户管理
          {/* <div className="feature-btns">
            <Button className="btn-role--create" onClick={this.handleAccountCreate}>
              <i className="icon-add"></i>新建用户角色
            </Button>
          </div> */}
        </h2>
        {/* <Query /> */}
        <Divider />
        <Table
          {...this.getTableProps()}
          className="table-list"
          loading={{ spinning: loading, tip: '数据加载中...' }}
          pagination={{
            pageSize: searchParams.pageSize,
            current: searchParams.pageNum,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条数据`,
            onShowSizeChange: (current, pageSize) => {
              const searchParams = Object.assign({}, this.state.searchParams, {
                pageSize,
                pageNum: 1,
              })
              this.getList(searchParams)
              this.setState({
                searchParams,
              })
            },
            onChange: page => {
              const searchParams = Object.assign({}, this.state.searchParams, { pageNum: page })
              this.getList(searchParams)
              this.setState({
                searchParams,
              })
            },
          }}
        />
        <Modal title="提示" visible={visible} onOk={this.onOk} onCancel={this.onCancel}>
          确认删除 {curUserName} 吗?
        </Modal>
      </div>
    )
  }
}

export default withRouter(AccountManage)
