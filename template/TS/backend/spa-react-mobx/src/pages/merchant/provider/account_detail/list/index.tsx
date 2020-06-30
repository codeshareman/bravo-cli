import React, { Component } from 'react'
import { Divider, Table, message, Button, Typography } from 'antd'
import { CustBreadcrumb } from '@/components/CustComponents'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { AJAX_STATUS } from '@/shared/common/constants'
import { ColumnProps } from 'antd/lib/table'
import { AccountDetail, AccountStatus } from '@xmly/cbp-spec/lib/portal/service/oss/AccountService'
import {
  formatTimeByTimestamp,
  getDisplayTime,
  getLocalePrice,
  getRangePickerDate,
  limitWord,
  download,
} from '@/shared/common/utils'
import { DealStatementQueryRequest, TradeType } from '@xmly/cbp-spec/lib/portal/service/oss/AccountService'
import GenneralDataCompo from '@/hoc/GenneralDataCompo'
import API from '@/api'
import Query from './query'
import './index.scss'

type P = RouteComponentProps<{ uid: string }> & { roleList: Array<any> }
type S = {
  loading: boolean
  total: number
  searchParams: DealStatementQueryRequest
  dataSource: Array<any>
  accountDetail: AccountDetail
}

const { Paragraph, Text, Title } = Typography

class AccountManage extends Component<P, S> {
  state: S = {
    loading: true,
    total: 0,
    dataSource: [],
    accountDetail: {
      uid: null,
      developerId: null,
      companyName: null,
      spreaderId: null,
      agentDistrict: null,
      availableAmount: null,
      distributor: null,
      cautionMoney: null,
      balance: null,
      freezeMoney: null,
      contractNo: null,
      contractStart: null,
      contractEnd: null,
      createTime: null,
      updateTime: null,
      status: null,
      role: null,
      roleName: null,
      businessOpsId: null,
      depositCert: null,
    },
    searchParams: {
      tradeTimeStart: null,
      tradeTimeEnd: null,
      tradeType: null,
      trxNo: null,
      uid: null,
      pageIndex: 1,
      pageSize: 10,
    },
  }

  componentDidMount() {
    this.initialRequest()
  }

  initialRequest = () => {
    const {
      match: { params },
    } = this.props
    const uid = +params.uid
    const searchParams = {
      ...this.state.searchParams,
      uid,
    }
    this.getDealStatement(searchParams)
    this.getAccountDetail(uid)
  }

  onSubmit = values => {
    const {
      match: { params },
    } = this.props
    const uid = +params.uid
    const rangeTime = getRangePickerDate(values.tradeTime)
    const searchParams = {
      trxNo: values.trxNo || null,
      tradeType: values.tradeType || null,
      tradeTimeStart: rangeTime.start,
      tradeTimeEnd: rangeTime.end,
      pageIndex: 1,
      pageSize: 10,
      uid,
    }

    this.getDealStatement(searchParams)
  }

  getAccountDetail = async (uid: number) => {
    const res = await API.account.detail(uid)
    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        accountDetail: res.data,
      })
    }
  }

  getDealStatement = async (params: DealStatementQueryRequest) => {
    this.setState({
      loading: true,
      dataSource: [],
    })
    try {
      const res = await API.account.queryDealStatement(params)
      const resData = res.data
      const dealList = resData.data
      if (res.code === AJAX_STATUS.SUCCESS) {
        this.setState({
          loading: false,
          dataSource: dealList,
          searchParams: {
            ...params,
            pageIndex: resData.current,
          },
          total: resData.total,
        })
      } else {
        message.error(res.message)
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  //  导出文件账户明细
  exportAccountDetail = async () => {
    const { searchParams } = this.state
    const params = {}

    Object.keys(searchParams).map(key => {
      if (searchParams[key]) {
        params[key] = searchParams[key]
      }
    })

    const downloadUrl = '/portal-oss/account/deal/statement/query/download'
    download(downloadUrl, params)
  }

  // 渲染交易类型
  renderNameByTradeType = (tradeType: string) => {
    const tradeTypeList = [
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
    ]
    const colItem = tradeTypeList.find(item => item.value === tradeType)
    return colItem.name || ''
  }

  getTableProps = () => {
    const { dataSource } = this.state

    const columns: Array<ColumnProps<any>> = [
      {
        title: '交易流水号',
        dataIndex: 'trxNo',
        key: 'trxNo',
        render: trxNo => {
          return limitWord(trxNo, 35)
        },
      },
      {
        title: '收入',
        dataIndex: 'income',
        key: 'income',
        render: (price: string) => {
          return <span className="txt-income"> {getLocalePrice(price)} </span>
        },
      },
      {
        title: '支出',
        dataIndex: 'expense',
        key: 'expense',
        render: (price: string) => {
          return <span className="txt-expenditure">{getLocalePrice(price)}</span>
        },
      },
      {
        title: '账户总金额',
        dataIndex: 'balance',
        key: 'balance',
        render: (price: string) => {
          return getLocalePrice(price)
        },
      },
      {
        title: '交易类型',
        dataIndex: 'tradeType',
        key: 'tradeType',
        align: 'center',
        render: (tradeType: string) => {
          return this.renderNameByTradeType(tradeType)
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: remark => {
          return remark || '--'
        },
      },
      {
        title: '交易时间',
        dataIndex: 'tradeTime',
        key: 'tradeTime',
        render: timestamp => {
          return getDisplayTime(formatTimeByTimestamp(timestamp))
        },
      },
    ]
    return { columns, dataSource, rowKey: 'id' }
  }

  getCurrentRole = (roleId: number) => {
    if (!roleId) return
    const { roleList } = this.props
    const curRole = roleList.find(role => role.id === roleId)
    return curRole
  }

  render() {
    const { loading, searchParams, total, accountDetail } = this.state
    const routes = [
      // { path: '/business/provider', name: '商户管理' },
      { path: '/business/provider', name: '商户列表' },
      { path: '', name: '账户明细' },
    ]
    const curRole = this.getCurrentRole(accountDetail.role)

    return (
      <div className="account-detail">
        <CustBreadcrumb routes={routes}></CustBreadcrumb>
        <h2>账户信息</h2>
        <div className="account-info">
          <div className="account-info-wrapper">
            <Paragraph>
              <Title level={4}>公司名称：</Title>
              <Text>{accountDetail.companyName}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>推广者id：</Title>
              <Text>{accountDetail.spreaderId || '--'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>开发者id：</Title>
              <Text>{accountDetail.developerId || '--'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>账户状态：</Title>
              <Text>{accountDetail.status && (accountDetail.status === AccountStatus.NORMAL ? '正常' : '停用')}</Text>
            </Paragraph>
          </div>
          <Divider type="vertical" />
          <div className="account-info-wrapper">
            <Paragraph>
              <Title level={4}>现金账户余额：</Title>
              <Text>{getLocalePrice(accountDetail.availableAmount)}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>冻结金额：</Title>
              <Text>{getLocalePrice(accountDetail.freezeMoney)}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>创建时间：</Title>
              <Text>{accountDetail.createTime}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>更新时间：</Title>
              <Text>{accountDetail.updateTime}</Text>
            </Paragraph>
          </div>
          <Divider type="vertical" />
          <div className="account-info-wrapper">
            <Paragraph>
              <Title level={4}>角色：</Title>
              <Text>{curRole && curRole.name}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>保证金金额：</Title>
              <Text>{getLocalePrice(accountDetail.cautionMoney) || '--'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>保证金凭证：</Title>
              <Text>{accountDetail.depositCert || '--'}</Text>
            </Paragraph>
          </div>
          <Divider type="vertical" />
          <div className="account-info-wrapper">
            <Paragraph>
              <Title level={4}>是否为分销商：</Title>
              <Text>{accountDetail.distributor ? '是' : '否'}</Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>合同时间：</Title>
              <Text>
                {accountDetail.contractStart}~{accountDetail.contractEnd}
              </Text>
            </Paragraph>
            <Paragraph>
              <Title level={4}>合同编号/附件：</Title>
              <Text>{accountDetail.contractNo}</Text>
            </Paragraph>
          </div>
        </div>
        <h2>账户明细</h2>
        <Query onSubmit={this.onSubmit} />
        <Divider />
        <div className="stastic">
          共 <span className="total">{this.state.total} </span>条数据
          <Button icon="upload" onClick={this.exportAccountDetail}>
            导出文件
          </Button>
        </div>
        <Table
          loading={{ spinning: loading, tip: '数据加载中...' }}
          {...this.getTableProps()}
          className="table-list"
          pagination={{
            total,
            current: searchParams.pageIndex,
            pageSize: searchParams.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (current, pageSize) => {
              const searchParams = {
                ...this.state.searchParams,
                pageIndex: 1,
                pageSize,
              }
              this.getDealStatement(searchParams)
              this.setState({
                searchParams,
              })
            },
            onChange: pageIndex => {
              const searchParams = {
                ...this.state.searchParams,
                pageIndex,
              }
              this.getDealStatement(searchParams)
              this.setState({
                searchParams,
              })
            },
          }}
        />
        {/* <PriceModal
          productId={this.state.productId}
          visible={this.state.visible}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          destroyOnClose
        /> */}
      </div>
    )
  }
}

export default withRouter(GenneralDataCompo(AccountManage))
