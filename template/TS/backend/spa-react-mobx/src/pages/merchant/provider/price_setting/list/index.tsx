import React, { Component } from 'react'
import { message, Table, Popconfirm, Tabs } from 'antd'
import Query from './query'
import { CustBreadcrumb } from '@/components/CustComponents'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ProductQueryRequest, TempProduct } from '@xmly/cbp-spec/lib/portal/service/oss/TempStrategyService'
import { AJAX_STATUS } from '@/shared/common/constants'
import { getLocalePrice, formatTimeByTimestamp, limitWord, optimizePic } from '@/shared/common/utils'
import PriceModal from '@/components/PriceModal'
import { PriceModalType } from '@/components/PriceModal/type'
import GenneralDataCompo from '@/hoc/GenneralDataCompo'
import { StrategyStatus } from '@xmly/cbp-spec/lib/portal/service/oss/TempStrategyService'
import './index.scss'
import API from '@/api'

type P = RouteComponentProps<{ uid: string }> & { roleList: Array<any> }
type S = {
  merchantInfo: any
  total: number
  loading: boolean
  searchParams: ProductQueryRequest
  dataSource: Array<TempProduct>
  curDataSource: Array<TempProduct>
  merchantRole: Record<string, any>
  visible: boolean
  modalType: PriceModalType
}

class PriceSetting extends Component<P, S> {
  state: S = {
    total: 0,
    loading: false,
    visible: false,
    modalType: PriceModalType.SPECIAL,
    merchantRole: null,
    dataSource: [],
    curDataSource: [],
    merchantInfo: null,
    searchParams: {
      pageIndex: 1,
      pageSize: 10,
      productId: null,
      userId: null,
      status: 1,
    },
  }

  componentDidMount() {
    this.initialRequest()
  }

  initialRequest = () => {
    const {
      match: { params },
    } = this.props
    const developerId = +params.uid
    this.getMerchantList(developerId)
  }

  // 获取商户列表
  getMerchantList = async developerId => {
    const searchParams = {
      developerId,
      companyName: '',
      agentDistrict: '',
      contractNo: '',
      startTs: null,
      endTs: null,
      role: null,
      pageNum: 1,
      pageSize: 10,
    }
    try {
      const res = await API.account.searchAccount(searchParams)
      if (res) {
        if (res.code === AJAX_STATUS.SUCCESS) {
          const resData: any = res.data
          const roleData = resData.list[0]
          this.setState(
            {
              merchantInfo: {
                ...roleData,
                name: this.getCurrentRole(roleData.role),
              },
            },
            () => {
              const { merchantInfo } = this.state
              const searchParams = {
                ...this.state.searchParams,
                userId: merchantInfo && merchantInfo.uid,
              }
              this.getSpecialPriceProducts(searchParams)
            },
          )
        } else {
          message.error(res.message)
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  onSubmit = (values: ProductQueryRequest) => {
    const { merchantInfo, searchParams } = this.state
    const params = {
      pageIndex: 1,
      pageSize: 10,
      productId: +values.productId || null,
      userId: merchantInfo && merchantInfo.uid,
      status: searchParams.status,
      // status: values.status,
    }
    this.getSpecialPriceProducts(params)
  }

  getSpecialPriceProducts = async (params: ProductQueryRequest) => {
    this.setState({
      loading: true,
      dataSource: [],
    })
    const res = await API.tempStrategy.queryProducts(params)
    if (res.code === AJAX_STATUS.SUCCESS) {
      const resData = res.data
      this.setState({
        dataSource: resData.data,
        total: resData.total,
        loading: false,
        searchParams: {
          ...params,
          pageIndex: resData.current,
        },
      })
    } else {
      message.error(res.message)
    }
  }

  cancelSpecialPrice = async (id: number) => {
    const { searchParams } = this.state
    const res: any = await API.tempStrategy.cancel(id)

    if (res.code === AJAX_STATUS.SUCCESS) {
      if (res.data) {
        message.success('特殊价取消成功')
        this.getSpecialPriceProducts(searchParams)
      }
    } else {
      message.error(res.message)
    }
  }

  showPriceModal = row => {
    this.setState({
      curDataSource: [row],
      visible: true,
    })
  }

  handleTabChange = (activeKey: string) => {
    const searchParams = {
      ...this.state.searchParams,
      status: +activeKey,
    }
    this.getSpecialPriceProducts(searchParams)
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

  getTableProps = () => {
    const { dataSource } = this.state
    let columns = []
    columns = [
      {
        title: '商品',
        dataIndex: 'productInfo',
        key: 'productInfo',
        width: 300,
        render: (info: any, rows: TempProduct) => {
          return (
            <div className="product">
              <div className="cover">
                <img src={optimizePic(rows.coverPath)} />
              </div>
              <div className="info">
                <p>{limitWord(rows.productName, 16)}</p>
                <p>商品ID: {rows.productId}</p>
              </div>
            </div>
          )
        },
      },
      {
        title: '原价',
        dataIndex: 'price',
        key: 'price',
        width: 200,
        render: (price: string) => {
          return getLocalePrice(price)
        },
      },
      {
        title: '价盘价',
        dataIndex: 'channelPrice',
        key: 'channelPrice',
        width: 200,
        render: (price: string) => {
          return getLocalePrice(price)
        },
      },
      {
        title: '特殊价',
        dataIndex: 'tempPrice',
        key: 'tempPrice',
        width: 200,
        render: (price: string) => {
          return getLocalePrice(price)
        },
      },
      {
        title: '特殊价有效期',
        dataIndex: 'validTime',
        key: 'validTime',
        width: 200,
        render: (curVal: any, rows: TempProduct) => {
          const start = formatTimeByTimestamp(rows.startTime)
          const end = formatTimeByTimestamp(rows.endTime)
          return (
            <>
              <p>{`${start.year}-${start.month}-${start.day} ${start.hour}:${start.min}:${start.seconds}`}</p>
              <p style={{ marginBottom: 0 }}>
                {`${end.year}-${end.month}-${end.day} ${end.hour}:${end.min}:${end.seconds}`}
              </p>
            </>
          )
        },
      },
      {
        title: '钉钉审批号',
        dataIndex: 'approvalId',
        key: 'approvalId',
        width: 200,
        render: approvalId => {
          return approvalId || '无'
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        width: 200,
        render: (val, row: TempProduct) => {
          const { searchParams } = this.state
          return (
            <>
              <a onClick={() => this.showPriceModal(row)} style={{ marginRight: 10 }}>
                查看
              </a>
              {searchParams.status === 1 && (
                <Popconfirm title="确定取消特殊价吗" onConfirm={() => this.cancelSpecialPrice(row.strategyId)}>
                  <a>取消特殊价</a>
                </Popconfirm>
              )}
            </>
          )
        },
      },
    ]
    return { dataSource, columns, rowKey: 'productId' }
  }

  getCurrentRole = (id: number) => {
    const { roleList } = this.props
    const role = roleList.find(item => id === item.id)
    return role ? role.name : ''
  }

  getTableColumns = () => {
    const columns = [
      {
        title: '商品',
        dataIndex: 'productInfo',
        key: 'productInfo',
      },
      {
        title: '原价',
        dataIndex: 'price',
        key: 'price',
        render: (curVal: string) => {
          return getLocalePrice(curVal)
        },
      },
      {
        title: '价盘价',
        dataIndex: 'channelPrice',
        key: 'channelPrice',
        render: (curVal: string) => {
          return getLocalePrice(curVal)
        },
      },
      {
        title: '特殊价',
        dataIndex: 'tempPrice',
        key: 'tempPrice',
        render: (curVal: string) => {
          return getLocalePrice(curVal)
        },
      },
      {
        title: '特殊价有效期',
        dataIndex: 'validDate',
        key: 'validDate',
        render: (timeStr: string, rows) => {
          const start = formatTimeByTimestamp(rows.startTime)
          const end = formatTimeByTimestamp(rows.endTime)
          return (
            <>
              <p>{`${start.year}-${start.month}-${start.day} ${start.hour}:${start.min}:${start.seconds}`}</p>
              <p style={{ marginBottom: 0 }}>
                {`${end.year}-${end.month}-${end.day} ${end.hour}:${end.min}:${end.seconds}`}
              </p>
            </>
          )
        },
      },
    ]
    return columns
  }

  render() {
    const { merchantInfo } = this.state
    const { curDataSource, total, modalType, loading, searchParams } = this.state
    const routes = [
      // { path: '/business/provider', name: '商户管理' },
      { path: '/business/provider', name: '商户列表' },
      { path: '', name: '设置特殊价' },
    ]
    return (
      <div className="price-setting">
        <CustBreadcrumb routes={routes}></CustBreadcrumb>
        <h2>设置特殊价</h2>
        <div className="company-info">
          <div className="item">
            <span>渠道：</span>
            {merchantInfo && merchantInfo.companyName}
          </div>
          <div className="item">
            <span>角色：</span>
            {merchantInfo && merchantInfo.name}
          </div>
        </div>
        <Tabs defaultActiveKey={String(StrategyStatus.EFFECTIVE)} onChange={this.handleTabChange}>
          <Tabs.TabPane tab="已生效" key={String(StrategyStatus.EFFECTIVE)}>
            <Query {...this.props} onSubmit={this.onSubmit} merchantInfo={merchantInfo} />
            {/* <div className="stastic">
              共 <span className="total"> {total} </span>条数据
            </div> */}
            <Table
              {...this.getTableProps()}
              className="table-list"
              loading={{ spinning: loading, tip: '数据加载中...' }}
              pagination={{
                total,
                current: searchParams.pageIndex,
                pageSize: searchParams.pageSize,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                  const searchParams = {
                    ...this.state.searchParams,
                    pageIndex: 1,
                    pageSize,
                  }
                  this.getSpecialPriceProducts(searchParams)
                  this.setState({
                    searchParams,
                  })
                },
                onChange: pageIndex => {
                  const searchParams = {
                    ...this.state.searchParams,
                    pageIndex,
                  }
                  this.getSpecialPriceProducts(searchParams)
                  this.setState({
                    searchParams,
                  })
                },
              }}
              scroll={{ x: 1300 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="未生效" key={String(StrategyStatus.BEFORE_EFFECTIVE)}>
            <Query {...this.props} onSubmit={this.onSubmit} merchantInfo={merchantInfo} />
            {/* <div className="stastic">
              共 <span className="total"> {total} </span>条数据
            </div> */}
            <Table
              {...this.getTableProps()}
              className="table-list"
              loading={{ spinning: loading, tip: '数据加载中...' }}
              pagination={{
                total,
                current: searchParams.pageIndex,
                pageSize: searchParams.pageSize,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                  const searchParams = {
                    ...this.state.searchParams,
                    pageIndex: 1,
                    pageSize,
                  }
                  this.getSpecialPriceProducts(searchParams)
                  this.setState({
                    searchParams,
                  })
                },
                onChange: pageIndex => {
                  const searchParams = {
                    ...this.state.searchParams,
                    pageIndex,
                  }
                  this.getSpecialPriceProducts(searchParams)
                  this.setState({
                    searchParams,
                  })
                },
              }}
              scroll={{ x: 1300 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已失效" key={String(StrategyStatus.EXPIRED)}>
            <Query {...this.props} onSubmit={this.onSubmit} merchantInfo={merchantInfo} />
            {/* <div className="stastic">
              共 <span className="total"> {total} </span>条数据
            </div> */}
            <Table
              {...this.getTableProps()}
              className="table-list"
              loading={{ spinning: loading, tip: '数据加载中...' }}
              pagination={{
                total,
                current: searchParams.pageIndex,
                pageSize: searchParams.pageSize,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                  const searchParams = {
                    ...this.state.searchParams,
                    pageIndex: 1,
                    pageSize,
                  }
                  this.getSpecialPriceProducts(searchParams)
                  this.setState({
                    searchParams,
                  })
                },
                onChange: pageIndex => {
                  const searchParams = {
                    ...this.state.searchParams,
                    pageIndex,
                  }
                  this.getSpecialPriceProducts(searchParams)
                  this.setState({
                    searchParams,
                  })
                },
              }}
              scroll={{ x: 1300 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已取消" key={String(StrategyStatus.CANCELED)}>
            <Query {...this.props} onSubmit={this.onSubmit} merchantInfo={merchantInfo} />
            {/* <div className="stastic">
              共 <span className="total"> {total} </span>条数据
            </div> */}
            <Table
              {...this.getTableProps()}
              className="table-list"
              loading={{ spinning: loading, tip: '数据加载中...' }}
              pagination={{
                total,
                current: searchParams.pageIndex,
                pageSize: searchParams.pageSize,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                  const searchParams = {
                    ...this.state.searchParams,
                    pageIndex: 1,
                    pageSize,
                  }
                  this.getSpecialPriceProducts(searchParams)
                  this.setState({
                    searchParams,
                  })
                },
                onChange: pageIndex => {
                  const searchParams = {
                    ...this.state.searchParams,
                    pageIndex,
                  }
                  this.getSpecialPriceProducts(searchParams)
                  this.setState({
                    searchParams,
                  })
                },
              }}
              scroll={{ x: 1300 }}
            />
          </Tabs.TabPane>
        </Tabs>
        <PriceModal
          visible={this.state.visible}
          width={932}
          currentRole={merchantInfo}
          columns={this.getTableColumns()}
          dataSource={curDataSource}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          type={modalType}
          destroyOnClose
        />
      </div>
    )
  }
}

export default withRouter(GenneralDataCompo(PriceSetting))
