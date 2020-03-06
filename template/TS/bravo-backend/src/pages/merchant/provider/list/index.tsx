import React, { Component } from 'react'
import cx from 'classnames'
import { Table, message, Modal, Form, Input, Button } from 'antd'
import FormItemDecorator from '@/components/FormItemDecorator'
import { getLocalePrice, getRangePickerDate, limitWord, download } from '@/shared/common/utils'
import { SearchAccountRequest, Account } from '@xmly/cbp-spec/lib/portal/service/oss/AccountService'
import { FormComponentProps } from 'antd/lib/form'
import { AccountStatus } from './type'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import CustRoleSelect from '@/components/CustComponents/CustRoleSelect'
import GenneralDataCompo from '@/hoc/GenneralDataCompo'
import { ColumnProps } from 'antd/lib/table'
import { AJAX_STATUS } from '@/shared/common/constants'
import './index.scss'
import API from '@/api'
import Query from './query'
import AuthCompo from '@/components/AuthCompo'
import { AuthType } from '@/components/AuthCompo/type'
// import AuthCompo from '@/components/AuthCompo';

type P = FormComponentProps &
  RouteComponentProps & {
    roleList: Array<any>
  }
type S = {
  loading: boolean
  total: number
  dataSource: Array<any>
  searchParams: SearchAccountRequest
  rowData: Account
  accountStatus: AccountStatus
  roleModalVisibile: boolean
  merChantRoles: Array<any>
}

const { TextArea } = Input

// 服务商列表
@(withRouter as any)
class ProvideList extends Component<P, S> {
  state: S = {
    total: 0,
    loading: false,
    rowData: null,
    accountStatus: -1,
    roleModalVisibile: false,
    merChantRoles: [],
    searchParams: {
      companyName: '',
      // agentDistrict: '',
      developerId: null,
      contractNo: '',
      startTs: null,
      endTs: null,
      role: null,
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
    this.getMerchantList(searchParams)
  }

  // 获取商户列表
  getMerchantList = async (params: SearchAccountRequest) => {
    this.setState({
      loading: true,
      dataSource: [],
      accountStatus: -1,
    })
    try {
      const res = await API.account.searchAccount(params)
      if (res) {
        if (res.code === AJAX_STATUS.SUCCESS) {
          const resData: any = res.data
          this.setState({
            dataSource: resData.list,
            total: resData.total,
            searchParams: {
              ...params,
              pageNum: resData.pageNum,
            },
            loading: false,
          })
        } else {
          message.error(res.message)
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  // 禁用
  forbiddenAccount = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          accountStatus: -1,
        })
        const { searchParams, rowData } = this.state
        const params = {
          uid: rowData.uid,
          reason: values.reason,
        }
        const res = await API.account.disabled(params)

        if (res.code === AJAX_STATUS.SUCCESS) {
          message.success('账号已禁用')
          this.onSubmit(searchParams)
        } else {
          message.error(res.message)
        }
      }
    })
  }

  // 启用
  enableAccount = async () => {
    const { searchParams, rowData } = this.state
    const uid = rowData.uid
    const res = await API.account.enable(uid)

    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success('账号已启用')
      this.onSubmit(searchParams)
    } else {
      message.error(res.message)
    }
  }

  // 设置账号状态
  setAccountStatus = (rows: Account) => {
    this.setState({
      rowData: rows,
      accountStatus: rows.status,
    })
  }

  //  导出文件
  exportAccountList = () => {
    const { searchParams } = this.state
    const params = {}

    Object.keys(searchParams).map(key => {
      if (searchParams[key]) {
        params[key] = searchParams[key]
      }
    })

    const downloadUrl = '/portal-oss/account/export'
    download(downloadUrl, params)
  }

  onCancel = () => {
    this.setState({
      accountStatus: -1,
    })
  }

  onConfirmModifyRole = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          roleModalVisibile: false,
        })
        const { rowData, searchParams } = this.state
        const params = {
          uid: rowData.uid,
          role: values.role,
        }

        const res = await API.account.modifyRole(params.uid, params.role)
        if (res.code === AJAX_STATUS.SUCCESS) {
          message.success('角色修改成功~')
          // 调用接口
          this.getMerchantList(searchParams)
        } else {
          message.error(res.message)
        }
      }
    })
  }

  onShowRoleModal = (rows: Account) => {
    this.setState({
      rowData: rows,
      roleModalVisibile: true,
    })
  }

  onHideRoleModal = () => {
    this.setState({
      roleModalVisibile: false,
    })
  }

  turnToSpecialPrice = (rows: Account) => {
    this.props.history.push({
      pathname: `/business/provider/specialPrice/${rows.developerId}`,
      state: {
        ...rows,
      },
    })
  }

  onSubmit = values => {
    const { searchParams } = this.state
    const rangeTime = getRangePickerDate(values.createTime)
    // const agencyAreaCodes = values.agencyArea ? values.agencyArea.map(item => item.code) : []
    // const agencyArea = agencyAreaCodes.length > 0 ? agencyAreaCodes.join(',') : ''

    const params = {
      companyName: values.companyName || '',
      // agentDistrict: agencyArea,
      developerId: values.developerId || null,
      contractNo: values.contractNo || '',
      role: values.role,
      startTs: rangeTime.start,
      endTs: rangeTime.end,
      pageNum: 1,
      pageSize: searchParams.pageSize,
    }

    this.getMerchantList(params)
  }

  getDisplayTime = (time: any) => {
    return `${time.year}-${time.month}-${time.day} ${time.hour}:${time.min}:${time.seconds}`
  }

  getTableProps = () => {
    const { dataSource } = this.state
    const columns: Array<ColumnProps<Account>> = [
      {
        key: 'companyName',
        dataIndex: 'companyName',
        title: '公司名称',
        width: 240,
        render: (curVal, row: Account) => {
          return (
            <>
              <p className="company-name">{limitWord(row.companyName, 14)}</p>
              <p className="sub-info">开发者ID：{row.developerId || '无'}</p>
              <p className="sub-info">推广者ID：{row.spreaderId || '无'}</p>
              <p style={{ marginTop: 8 }}>
                <span
                  className={cx({
                    'account-status': true,
                    'account-enabled': row.status === AccountStatus.NORMAL,
                    'account-disabled': row.status === AccountStatus.DISABLE,
                  })}
                >
                  {row.status === AccountStatus.NORMAL ? '正常' : '停用'}
                </span>
              </p>
            </>
          )
        },
      },
      // {
      //   key: 'agentDistrict',
      //   dataIndex: 'agentDistrict',
      //   title: '代理地区',
      //   width: 100,
      //   align: 'center',
      //   render(codeStr: string) {
      //     const city = getCityInfoByCode(codeStr);
      //     return city ? city.name : '--';
      //   },
      // },
      {
        key: 'role',
        dataIndex: 'role',
        title: '角色',
        width: 120,
        render: (rowId: number) => {
          const { roleList } = this.props
          const role = roleList.find(item => rowId === item.id)
          return role ? role.name : '--'
        },
      },
      {
        key: 'distributor',
        dataIndex: 'distributor',
        title: '是否为分销商',
        width: 120,
        align: 'center',
        render: (distributor: boolean) => {
          return distributor ? '是' : '否'
        },
      },
      {
        key: 'cautionMoney',
        dataIndex: 'cautionMoney',
        title: '保证金金额',
        width: 150,
        render(price: string) {
          return getLocalePrice(price)
        },
      },
      {
        key: 'availableAmount',
        dataIndex: 'availableAmount',
        title: '现金账户可用余额',
        width: 160,
        render(price: string) {
          return getLocalePrice(price)
        },
      },
      {
        key: 'freezeMoney',
        dataIndex: 'freezeMoney',
        title: '冻结金额',
        width: 120,
        render(price: string) {
          return getLocalePrice(price)
        },
      },
      {
        key: 'contractInfo',
        dataIndex: 'contractInfo',
        title: '合同信息',
        width: 250,
        render: (curVal, row: Account) => {
          const startTime = row.contractStart && row.contractStart.split(' ')[0]
          const endTime = row.contractEnd && row.contractEnd.split(' ')[0]
          return (
            <>
              <p>{limitWord(row.contractNo, 25)}</p>
              <p className="sub-info">
                {startTime} ~ {endTime}
              </p>
            </>
          )
        },
      },
      {
        key: 'updateTime',
        dataIndex: 'updateTime',
        title: '创建/更新时间',
        width: 200,
        render: (curVal, row: Account) => {
          return (
            <>
              <p>{row.createTime}</p>
              <p style={{ marginBottom: 0 }}>{row.updateTime}</p>
            </>
          )
        },
      },
      {
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        width: 100,
        render: (cur, rows: Account) => {
          return (
            <div className="table-actions">
              <AuthCompo scope="account:enable_disable">
                <a onClick={() => this.setAccountStatus(rows)}>
                  {rows.status === AccountStatus.DISABLE ? '启用' : '停用'}
                </a>
              </AuthCompo>
              <Link to={`/business/provider/account/${rows.uid}`}>账户明细</Link>
              <AuthCompo type={AuthType.ROLE} scope="supply_chain">
                <a onClick={() => this.turnToSpecialPrice(rows)}>设置特殊价</a>
              </AuthCompo>
              <AuthCompo scope="account:update_role">
                <a onClick={() => this.onShowRoleModal(rows)}>修改角色</a>
              </AuthCompo>
            </div>
          )
        },
      },
    ]
    return {
      dataSource,
      columns,
      rowKey: 'uid',
    }
  }

  render() {
    const { searchParams, total, accountStatus, roleModalVisibile, rowData } = this.state
    return (
      <div className="provider-list">
        {/* <CustBreadcrumb routes={routes} showCurrentPosition /> */}
        <h2 className="first-title">商户列表</h2>
        <Query onSubmit={this.onSubmit} />
        <div className="stastic">
          {/* 共 <span className="total"> {total} </span>条数据 */}
          <Button icon={'upload'} onClick={this.exportAccountList}>
            导出文件
          </Button>
        </div>
        <Table
          {...this.getTableProps()}
          className="table-list"
          loading={{ spinning: this.state.loading, tip: '数据加载中...' }}
          scroll={{ x: 1200 }}
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
                pageNum: 1,
                pageSize,
              }
              this.getMerchantList(searchParams)
              this.setState({
                searchParams,
              })
            },
            onChange: (page: number) => {
              const params = {
                ...searchParams,
                pageNum: page,
              }
              this.getMerchantList(params)
              this.setState({
                searchParams: params,
              })
            },
          }}
        ></Table>
        <Modal
          visible={accountStatus === AccountStatus.DISABLE}
          title="账号启用"
          onCancel={this.onCancel}
          onOk={this.enableAccount}
          maskClosable={false}
          destroyOnClose
        >
          确定启用该账号吗?
        </Modal>
        <Modal
          wrapClassName="account-modal"
          visible={accountStatus === AccountStatus.NORMAL}
          title="账号停用"
          onCancel={this.onCancel}
          onOk={this.forbiddenAccount}
          destroyOnClose
          maskClosable={false}
        >
          <Form>
            <FormItemDecorator
              style={{ marginBottom: 0 }}
              form={this.props.form}
              field={'reason'}
              options={{
                rules: [
                  {
                    required: true,
                    message: '账号停用原因不能为空',
                  },
                ],
              }}
            >
              <TextArea placeholder="(必填) 请输入账号停用原因" autoSize={{ minRows: 5, maxRows: 5 }}></TextArea>
            </FormItemDecorator>
          </Form>
        </Modal>
        <Modal
          wrapClassName={'modal-wrap--role'}
          title="修改角色"
          visible={roleModalVisibile}
          onOk={this.onConfirmModifyRole}
          onCancel={this.onHideRoleModal}
          maskClosable={false}
          destroyOnClose
        >
          <Form layout="inline">
            <FormItemDecorator
              form={this.props.form}
              required
              field="role"
              label="角色"
              options={{
                initialValue: rowData && rowData.role,
                rules: [
                  {
                    required: true,
                    message: '你还未选择角色',
                  },
                ],
              }}
            >
              <CustRoleSelect style={{ width: 200 }} placeholder="请选择角色" allowClear />
            </FormItemDecorator>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create<P>()(GenneralDataCompo(ProvideList))
