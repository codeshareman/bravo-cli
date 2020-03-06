import React, { Component } from 'react'
import { Table, Input, Modal, message, Tooltip } from 'antd'
import Form, { FormComponentProps } from 'antd/lib/form'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import FormItemDecorator from '@/components/FormItemDecorator'
import cx from 'classnames'
import { formatTimeByTimestamp } from '@/shared/common/utils'
import { AJAX_STATUS } from '@/shared/common/constants'
import Query from './query'
import { ACCOUNT_STATUS_DICT, AWARD_STATUS, AWARD_STATUS_DICT } from '../constants'
import GenneralDataCompo from '@/hoc/GenneralDataCompo'
import AuthCompo from '@/components/AuthCompo'
import API from '@/api'
import './style.scss'

// import AuthCompo from '@/components/AuthCompo';

interface MerchantListState {
  // page: number;
  // pageSize: number;
  total: number
  loadingTable: boolean
  dataSource: Array<any>
  closeText: string
  showCloseModal: boolean
  showOpenModal: boolean
  operateData: any
  queryParams: any
}
interface MerchantListProps extends FormComponentProps, RouteComponentProps {}

@(withRouter as any)
class MerchantList extends Component<MerchantListProps, MerchantListState> {
  constructor(props: MerchantListProps) {
    super(props)
    this.state = {
      // page: 1,
      // pageSize: 10,
      total: 0,
      loadingTable: false,
      dataSource: [],
      closeText: '',
      showCloseModal: false,
      showOpenModal: false,
      operateData: {},
      queryParams: {
        page: 1,
        pageSize: 10,
      },
    }
  }
  componentDidMount() {
    this.getData()
  }
  getData = async (values: any = {}) => {
    this.setState({
      loadingTable: true,
    })
    // const {companyName, developId, promotionUid, status, ddApprovalNo, endDate, beginDate, page, pageSize} = this.state
    const { queryParams } = this.state
    const params = {
      // page: page,
      // pageSize: pageSize,
      ...queryParams,
      ...values,
    }
    try {
      const res = await API.reward.accountList(params)
      if (res.code === AJAX_STATUS.SUCCESS) {
        const dataSource = res.data.data.map((item, index) => {
          return {
            id: index,
            ...item,
          }
        })
        this.setState({
          dataSource,
          // page: res.data.current,
          queryParams: {
            ...params,
          },
          total: res.data.total,
        })
      } else {
        message.info(res.message, 2, null)
        this.setState({
          dataSource: [],
          // page: 1,
          total: 0,
        })
      }
    } catch (e) {
      console.log(e)
      this.setState({
        dataSource: [],
        // page: 1,
        total: 0,
      })
    } finally {
      this.setState({
        loadingTable: false,
      })
    }
  }
  getDisplayTime = (time: any) => {
    return `${time.year}-${time.month}-${time.day} ${time.hour}:${time.min}:${time.seconds}`
  }
  showCloseModal = (row: any) => {
    let text = ''
    if (row.availableBalance === 0) {
      text = '关闭奖励账户后，不会再有新用户的拉新奖励，确定关闭账户的奖励权限？'
    } else {
      text = '该商户的奖励余额不为0，确定关闭账户的奖励权限？'
    }
    this.setState({
      showCloseModal: true,
      closeText: text,
      operateData: { ...row },
    })
  }
  showOpenModal = (row: any) => {
    this.setState({
      showOpenModal: true,
      operateData: { ...row },
    })
  }
  getTableProps = (): {
    dataSource: Array<any>
    columns: any
    rowKey: string
  } => {
    const { dataSource } = this.state
    const columns = [
      {
        key: 'baseAccount',
        dataIndex: 'baseAccount',
        title: '公司名称',
        align: 'left',
        width: 200,
        render: (text, row) => {
          return (
            <>
              {text.companyName.length > 28 ? (
                <Tooltip title={text.companyName}>
                  <p
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {text.companyName}
                  </p>
                </Tooltip>
              ) : (
                <p>{text.companyName}</p>
              )}
              <p className="sub-info">商户UID：{text.uid || '无'}</p>
              <p style={{ marginTop: 6 }}>
                <span
                  className={cx({
                    'account-status': true,
                    'account-enabled': row.accountStatus === ACCOUNT_STATUS_DICT.normal,
                    'account-disabled': row.accountStatus !== ACCOUNT_STATUS_DICT.normal,
                  })}
                >
                  {row.accountStatus === ACCOUNT_STATUS_DICT.normal ? '正常' : '停用'}
                </span>
              </p>
            </>
          )
        },
      },
      // {
      //     key: 'availableBalance',
      //     dataIndex: 'availableBalance',
      //     title: '奖励账户总余额',
      //     align: 'left',
      //     render:(price: string) => {
      //         return price ? '¥ ' + price.replace(regex.thounsand, ',') : '无';
      //     },
      // },
      // {
      //     key: 'freezeBalance',
      //     dataIndex: 'freezeBalance',
      //     title: '冻结金额',
      //     align: 'left',
      //     render:(price: string) => {
      //         return price ? '¥ ' + price.replace(regex.thounsand, ',') : '无';
      //     },
      // },
      {
        key: 'ddApprovalNo',
        dataIndex: 'ddApprovalNo',
        title: '钉钉审批编号',
        align: 'left',
        width: 140,
        render: text => {
          return text ? text : '--'
        },
      },
      {
        key: 'awardAccountStatus',
        dataIndex: 'awardAccountStatus',
        title: '奖励账户状态',
        align: 'left',
        width: 140,
        render: text => {
          let color = '#FE5461'
          if (text == AWARD_STATUS_DICT.normal) {
            color = '#62C1AD'
          }
          let show = ''
          AWARD_STATUS.forEach(e => {
            if (e.value === text) {
              show = e.label
            }
          })
          return <span style={{ color: color }}>{show}</span>
        },
      },
      {
        key: 'openDate',
        dataIndex: 'openDate',
        title: '奖励开通时间',
        align: 'left',
        width: 160,
        render: text => {
          if (text === -1) {
            return '--'
          }
          // const startTime = this.getDisplayTime(formatTimeByTimestamp(row.createTime));
          // const endTime = this.getDisplayTime(formatTimeByTimestamp(row.updateTime));
          return this.getDisplayTime(formatTimeByTimestamp(text))
        },
      },
      {
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        width: 100,
        align: 'center',
        render: (cur, rows) => {
          return (
            <div className="table-actions">
              {rows.awardAccountStatus === AWARD_STATUS_DICT.normal ? (
                <AuthCompo scope="award:enable_disable">
                  <a onClick={() => this.showCloseModal(rows)}>关闭奖励</a>
                </AuthCompo>
              ) : (
                <AuthCompo scope="award:enable_disable">
                  <a onClick={() => this.showOpenModal(rows)}>开通奖励</a>
                </AuthCompo>
              )}
            </div>
          )
        },
      },
    ]
    return {
      dataSource,
      columns,
      rowKey: 'id',
    }
  }
  cancalCloseModal = () => {
    this.setState({
      showCloseModal: false,
    })
  }
  okCloseModal = async () => {
    const { operateData } = this.state
    try {
      const res = await API.reward.accountCloseAward(operateData.baseAccount.uid)
      if (res.code !== AJAX_STATUS.SUCCESS) {
        message.info(res.message, 2, null)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.cancalCloseModal()
      this.getData()
    }
  }
  cancalOpenModal = () => {
    this.setState({
      showOpenModal: false,
    })
  }
  okOpenModal = () => {
    const { operateData } = this.state
    console.log(operateData)
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const params = {
            uid: operateData.baseAccount.uid,
            ddApprovalNo: values.ddApprovalNo,
          }
          const res = await API.reward.accountOpenAward(params)
          if (res.code !== AJAX_STATUS.SUCCESS) {
            message.info(res.message, 2, null)
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.cancalOpenModal()
          this.getData()
        }
      }
    })
  }
  render() {
    const { loadingTable, queryParams, total, closeText, showCloseModal, showOpenModal } = this.state
    return (
      <div className="award-merchant-list">
        <div className="title">商户列表</div>
        <Query getData={this.getData} />
        <Table
          className="table-list"
          {...this.getTableProps()}
          loading={{ spinning: loadingTable, tip: '数据加载中...' }}
          scroll={{ x: 1000 }}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.pageSize,
            total: total,
            showTotal: total => {
              return `共${total}条数据`
            },
            onChange: (page: number) => {
              const params = {
                page: page,
              }
              this.getData(params)
            },
          }}
        />
        <Modal
          visible={showCloseModal}
          title="账号停用"
          onCancel={this.cancalCloseModal}
          onOk={this.okCloseModal}
          destroyOnClose
        >
          <p>{closeText}</p>
        </Modal>
        <Modal
          visible={showOpenModal}
          title="账号启用"
          onCancel={this.cancalOpenModal}
          onOk={this.okOpenModal}
          destroyOnClose
        >
          <Form
            labelCol={{
              xs: { span: 24 },
              sm: { span: 4 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 20 },
            }}
          >
            <FormItemDecorator
              style={{ marginBottom: 0 }}
              form={this.props.form}
              field={'ddApprovalNo'}
              label="审批编号"
              required={true}
              options={{
                rules: [
                  {
                    required: true,
                    message: '钉钉审批编号不能为空',
                  },
                ],
              }}
            >
              <Input placeholder="请输入钉钉审批编号" />
            </FormItemDecorator>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create<MerchantListProps>()(GenneralDataCompo(MerchantList))
