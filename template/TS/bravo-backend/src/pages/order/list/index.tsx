import React, { Component } from 'react'
import Query from './query'
import { Divider, Table, message, Button } from 'antd'

import './index.scss'
import API from '@/api'
import { OrderQuery, OrderState } from '@xmly/cbp-spec/lib/portal/service/oss/OrderService'
import { AJAX_STATUS } from '@/shared/common/constants'
import { getLocalePrice, limitWord, getRangePickerDate, download } from '@/shared/common/utils'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ColumnProps } from 'antd/lib/table'

type P = RouteComponentProps & {}
type S = {
  total: number
  loading: boolean
  dataSource: any[]
  searchParams: OrderQuery
  companyNameList: any[]
}

class RealOrder extends Component<P, S> {
  state = {
    total: 0,
    loading: false,
    dataSource: [],
    companyNameList: [],
    searchParams: {
      supplierIdList: null,
      state: OrderState.WAIT_DELIVER,
      startDate: null,
      endDate: null,
      orderNo: '',
      agentDistrict: '',
      companyName: '',
      pageNum: 1,
      pageSize: 10,
    },
  }

  componentDidMount() {
    this.initialRequest()
  }

  initialRequest = () => {
    const { searchParams } = this.state
    this.getOrderList(searchParams)
    this.getCompanyNameWithDeveloperId()
  }

  getCompanyNameWithDeveloperId = async () => {
    try {
      const res = await API.supplyChain.getAllCompanyNameWithDeveloperId()
      if (res.code === AJAX_STATUS.SUCCESS) {
        this.setState({
          companyNameList: res.data,
        })
      } else {
        message.info(res.message, 2, null)
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }

  onSubmit = (params: any) => {
    const { searchParams } = this.state
    const validTime = params.date
    const agencyArea = params.agencyArea
    const rangeTime = getRangePickerDate(validTime)
    const queryParams = {
      supplierIdList: params.supplierIdList || null,
      startDate: rangeTime.start,
      endDate: rangeTime.end,
      state: params.state,
      orderNo: params.orderNo || '',
      agentDistrict: agencyArea && agencyArea.length > 0 ? agencyArea[0].code : '',
      companyName: params.companyName || '',
      pageNum: 1,
      pageSize: searchParams.pageSize,
    }
    this.getOrderList(queryParams)
  }

  getOrderList = async (params: OrderQuery) => {
    this.setState({
      dataSource: [],
      loading: true,
    })
    try {
      const res = await API.order.list(params)
      if (res.code === AJAX_STATUS.SUCCESS) {
        const resData = res.data
        this.setState({
          dataSource: resData.list,
          total: resData.total,
          searchParams: {
            ...params,
            pageNum: resData.pageNum,
          },
        })
      } else {
        message.error(res.message)
      }
    } catch (err) {
      throw new Error(err)
    } finally {
      this.setState({
        loading: false,
      })
    }
  }

  handleDetails = (id: number) => {
    this.props.history.push(`/order/physical/detail/${id}`)
  }

  getOrderState = (state: OrderState) => {
    switch (state) {
      case OrderState.COMPLETE:
        return '已完成'
      case OrderState.WAIT_DELIVER:
        return '待发货'
      case OrderState.WAIT_RECEIVE:
        return '待收货'
    }
  }

  //  导出文件
  exportOrderList = () => {
    const { searchParams } = this.state
    const params = {}

    Object.keys(searchParams).map(key => {
      if (searchParams[key]) {
        params[key] = searchParams[key]
      }
    })

    const downloadUrl = '/portal-oss/order/export'
    download(downloadUrl, params)
  }

  getTableProps = () => {
    const { dataSource, searchParams, companyNameList } = this.state

    const expressNameCol = {
      title: '物流编号',
      dataIndex: 'expressOrderNo',
      key: 'expressOrderNo',
      width: 200,
      render: (expressOrderNo: string) => {
        return expressOrderNo ? limitWord(expressOrderNo, 20) : '--'
      },
    }
    const expressCol = {
      title: '物流公司',
      dataIndex: 'expressName',
      key: 'expressName',
      width: 200,
      render: (expressName: string) => {
        return expressName ? limitWord(expressName, 20) : '--'
      },
    }

    const columns: Array<ColumnProps<any>> = [
      {
        title: '订单编号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 260,
        render: (orderNo: string) => {
          return orderNo ? limitWord(orderNo, 30) : ''
        },
      },
      {
        title: '订单生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        align: 'center',
      },
      {
        title: '订单完成时间',
        dataIndex: 'completedTime',
        key: 'completedTime',
        width: 200,
        align: 'center',
        render: completedTime => {
          return completedTime || '--'
        },
      },
      {
        title: '企业/公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 180,
        render: companyName => {
          return companyName ? limitWord(companyName, 28) : ''
        },
      },
      // 所属业务暂时不展示
      // {
      //   title: '所属业务',
      //   dataIndex: 'businessType',
      //   key: 'businessType',
      //   width: 120,
      //   align: 'center',
      //   render(value) {
      //     return value&&BUSINESS_TYPE_DICT[value]?BUSINESS_TYPE_DICT[value].label:"--"
      //   },
      // },
      // {
      //   title: '代理地区',
      //   dataIndex: 'agentDistrict',
      //   key: 'agentDistrict',
      //   width: 120,
      //   align: 'center',
      //   render(codeStr) {
      //     const city = codeStr ? getCityInfoByCode(codeStr).name : '--';
      //     return city;
      //   },
      // },
      {
        title: '供应商',
        dataIndex: 'supplierId',
        key: 'supplierId',
        width: 120,
        align: 'center',
        render(value) {
          let name = '--'
          if (value) {
            companyNameList.forEach(e => {
              if (e.developerId === value) {
                name = e.companyName
              }
            })
          }
          return name
        },
      },
      {
        title: '货品种类',
        dataIndex: 'productTypeCount',
        key: 'productTypeCount',
        align: 'center',
        width: 120,
      },
      {
        title: '货品数量',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        align: 'center',
        width: 120,
      },
      {
        title: '订单金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width: 150,
        render: (price: string) => {
          const priceStr = String(price)
          return getLocalePrice(priceStr)
        },
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        width: 120,
        align: 'center',
        render: (state: OrderState) => {
          return this.getOrderState(state)
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: record => (
          <a
            onClick={() => {
              this.handleDetails(record.orderNo)
            }}
          >
            查看详情
          </a>
        ),
      },
    ]

    if (searchParams.state !== OrderState.WAIT_DELIVER) {
      columns.splice(1, 0, expressCol)
      columns.splice(1, 0, expressNameCol)
    }

    return { dataSource, columns, rowKey: 'id' }
  }

  render() {
    const { loading, total, searchParams, companyNameList } = this.state
    return (
      <div className="real-order">
        <h2 className="first-title">实物订单</h2>
        <div className="content-view">
          <Query onSubmit={this.onSubmit} companyNameList={companyNameList} />
          <Divider />
          <div className="stastic">
            {/* 共 <span className="total"> {total} </span>条数据 */}
            <Button icon={'upload'} onClick={this.exportOrderList}>
              导出文件
            </Button>
          </div>
          <Table
            {...this.getTableProps()}
            loading={{ spinning: loading, tip: '数据加载中...' }}
            scroll={{ x: 1300 }}
            pagination={{
              total,
              current: searchParams.pageNum,
              pageSize: searchParams.pageSize,
              showTotal: total => `共 ${total} 条数据`,
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (current, pageSize) => {
                const searchParams = {
                  ...this.state.searchParams,
                  pageSize,
                  pageNum: 1,
                }
                this.getOrderList(searchParams)
                this.setState({
                  searchParams,
                })
              },
              onChange: pageNum => {
                const searchParams = {
                  ...this.state.searchParams,
                  pageNum,
                }
                this.getOrderList(searchParams)
                this.setState({
                  searchParams,
                })
              },
            }}
          />
        </div>
      </div>
    )
  }
}

export default withRouter(RealOrder)
