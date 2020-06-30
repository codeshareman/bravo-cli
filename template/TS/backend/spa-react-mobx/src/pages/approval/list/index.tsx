import React, { Component } from 'react'
import { FormComponentProps } from 'antd/lib/form'
import Query from './query'
import { Table, Modal, Form, Input, DatePicker, message } from 'antd'
import { ApprovalStatusType } from '../type'
import FormItemDecorator from '@/components/FormItemDecorator'
import REGEX from '@/shared/common/regex'
import { formatTimeByTimestamp, getTimestamp, limitWord, getRangePickerDate } from '@/shared/common/utils'
import {
  ApprovalStatus,
  HandleApprovalRequest,
  SearchApprovalRequest,
  Approval,
} from '@xmly/cbp-spec/lib/portal/service/oss/AccountService'
import { AJAX_STATUS } from '@/shared/common/constants'
import CustRoleSelect from '@/components/CustComponents/CustRoleSelect'
import { ColumnProps } from 'antd/lib/table'
import API from '@/api'
import './index.scss'

// import AuthCompo from '@/components/AuthCompo';

type P = FormComponentProps & {}
type S = {
  dataSource: Array<any>
  visible: boolean
  modalType: ApprovalStatusType
  curApprovalId: number
  total: number
  searchParams: SearchApprovalRequest
  loading: boolean
}

const { RangePicker } = DatePicker
const { TextArea } = Input

class ApprovalList extends Component<P, S> {
  state: S = {
    loading: true,
    visible: false,
    modalType: ApprovalStatusType.PASSED,
    curApprovalId: -1,
    total: 0,
    searchParams: {
      companyName: '',
      agencyArea: '',
      status: ApprovalStatus.WAITING_APPROVAL,
      createAtRangeStart: null,
      createAtRangeEnd: null,
      pageIndex: 1,
      pageSize: 10,
    },
    dataSource: [],
  }

  componentDidMount() {
    this.initialRequest()
  }

  initialRequest = () => {
    const { searchParams } = this.state
    this.getApprovalList(searchParams)
  }

  // 查询审批列表
  getApprovalList = async (params: SearchApprovalRequest) => {
    this.setState({
      loading: true,
      dataSource: [],
    })
    try {
      const res = await API.account.search(params)
      if (res) {
        if (res.code === AJAX_STATUS.SUCCESS) {
          const resData = res.data
          this.setState({
            dataSource: resData.data,
            total: resData.total,
            searchParams: {
              ...params,
              pageIndex: resData.current,
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

  // 获取审批状态
  getApprovalStatus = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.REJECTED:
        return '未通过'
      case ApprovalStatus.ACCEPTED:
        return '已通过'
      case ApprovalStatus.WAITING_APPROVAL:
        return '待审批'
    }
  }

  onSubmit = (values: any) => {
    const { searchParams } = this.state
    const rangeTime = getRangePickerDate(values.approvalTime)
    const agencyAreaCodes = values.agencyArea ? values.agencyArea.map(item => item.code) : []
    const agencyArea = agencyAreaCodes.length > 0 ? agencyAreaCodes.join(',') : ''
    const params = {
      companyName: values.companyName,
      status: values.status,
      createAtRangeStart: rangeTime.start,
      createAtRangeEnd: rangeTime.end,
      pageIndex: 1,
      pageSize: searchParams.pageSize,
      agencyArea,
    }

    this.getApprovalList(params)
  }

  // 审批
  showApprovalModal = (id: number) => {
    this.setState({
      curApprovalId: id,
      visible: true,
      modalType: ApprovalStatusType.PASSED,
    })
  }

  // 驳回
  showTurndownModal = (id: number) => {
    this.setState({
      visible: true,
      curApprovalId: id,
      modalType: ApprovalStatusType.NOT_PASSED,
    })
  }

  onCancel = () => {
    this.setState({
      visible: false,
    })
  }

  onArpovalSuccess = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          visible: false,
        })
        const { searchParams } = this.state
        const contractStartTime = values.startAndEndDate ? getTimestamp(values.startAndEndDate[0]) : null
        const contractEndTime = values.startAndEndDate ? getTimestamp(values.startAndEndDate[1]) : null

        const params: HandleApprovalRequest = {
          id: this.state.curApprovalId,
          approvalId: values.approvalId,
          accountRoleId: values.accountRoleId,
          contractId: values.contractId,
          cautionMoney: values.cautionMoney,
          contractStartTime,
          contractEndTime,
        }

        const res = await API.account.accept(params)

        if (res.code === AJAX_STATUS.SUCCESS) {
          this.getApprovalList(searchParams)
          message.success('审批已通过')
        } else {
          message.error(res.message)
        }
      }
    })
  }

  onArpovalReject = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          visible: false,
        })
        const { searchParams } = this.state
        const params: HandleApprovalRequest = {
          id: this.state.curApprovalId,
          approvalId: values.approvalId,
          remark: values.remark,
        }

        const res = await API.account.reject(params)

        if (res.code === AJAX_STATUS.SUCCESS) {
          this.getApprovalList(searchParams)
          message.success('审批已驳回')
        } else {
          message.error(res.message)
        }
      }
    })
  }

  getDisplayTime = (time: any) => {
    return `${time.year}-${time.month}-${time.day} ${time.hour}:${time.min}:${time.seconds}`
  }

  getTableProps = () => {
    const { dataSource, searchParams } = this.state

    const columns: Array<ColumnProps<any>> = [
      {
        key: 'companyName',
        dataIndex: 'companyName',
        title: '公司名称',
        width: 180,
        render(companyName: string) {
          return limitWord(companyName, 18)
        },
      },
      // {
      //   key: 'agencyArea',
      //   dataIndex: 'agencyArea',
      //   title: '代理地区',
      //   width: 160,
      //   render(codeStr: string) {
      //     const city = getCityInfoByCode(codeStr);
      //     return city ? city.name : '';
      //   },
      // },
      {
        key: 'contactName',
        dataIndex: 'contactName',
        width: 140,
        title: '公司联系人',
      },
      {
        key: 'contactMobile',
        dataIndex: 'contactMobile',
        width: 140,
        title: '手机号',
      },
      {
        key: 'updateTime',
        dataIndex: 'updateTime',
        width: 180,
        title: '申请/最后审批时间',
        render: (timestamp: number, rowData: Approval) => {
          const startTime = this.getDisplayTime(formatTimeByTimestamp(rowData.createAt))
          const endTime = this.getDisplayTime(formatTimeByTimestamp(rowData.updateAt))
          const waitApprove = rowData.createAt === rowData.updateAt
          return (
            <>
              <p style={{ marginBottom: 4 }}>{startTime}</p>
              <p style={{ marginBottom: 0 }}>{waitApprove ? '--' : endTime}</p>
            </>
          )
        },
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '审批状态',
        width: 100,
        align: 'center',
        render: (status: ApprovalStatus) => {
          return this.getApprovalStatus(status)
        },
      },
      {
        key: 'remark',
        dataIndex: 'remark',
        title: '备注',
        width: 140,
        align: 'center',
        render: (remark: string) => {
          return remark === '' ? '--' : limitWord(remark, 30)
        },
      },
    ]
    if (searchParams.status === ApprovalStatus.WAITING_APPROVAL) {
      const actionCols = {
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        width: 100,
        render: (curVal, rows: any) => {
          return (
            <>
              {/* <AuthCompo scope="approval_settle:pass_reject"> */}
              <a
                type="primary"
                style={{ marginRight: 16, cursor: 'pointer' }}
                onClick={() => this.showApprovalModal(rows.id)}
              >
                通过
              </a>
              {/* </AuthCompo> */}
              {/* <AuthCompo scope="approval_settle:pass_reject"> */}
              <a
                type="primary"
                style={{ color: '#989797', cursor: 'pointer' }}
                onClick={() => this.showTurndownModal(rows.id)}
              >
                驳回
              </a>
              {/* </AuthCompo> */}
            </>
          )
        },
      }
      columns.push(actionCols)
    }
    return { dataSource, columns, rowKey: 'id' }
  }

  render() {
    const { searchParams, total } = this.state
    const { visible, modalType } = this.state
    const labelCol = { span: 5 }
    const wrapperCol = { span: 18 }
    const approvalModalVisible = visible && modalType === ApprovalStatusType.PASSED
    const rejectModalVisible = visible && modalType === ApprovalStatusType.NOT_PASSED

    return (
      <div className="approval">
        <h2 className="first-title">入驻审批</h2>
        <Query onSubmit={this.onSubmit} />
        {/* <div className="stastic">
          共 <span className="total">{this.state.total} </span>条数据
        </div> */}
        <Table
          {...this.getTableProps()}
          loading={{ spinning: this.state.loading, tip: '数据加载中...' }}
          scroll={{ x: 800 }}
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
              this.getApprovalList(searchParams)
              this.setState({
                searchParams,
              })
            },
            onChange: (page: number) => {
              const params = {
                ...searchParams,
                pageIndex: page,
              }
              this.getApprovalList(params)
              this.setState({
                searchParams: params,
              })
            },
          }}
        ></Table>
        <Modal
          wrapClassName="modal-approval"
          visible={approvalModalVisible}
          // title="录入审核信息"
          title="审批通过"
          onCancel={this.onCancel}
          onOk={this.onArpovalSuccess}
          maskClosable={false}
          destroyOnClose
        >
          <Form labelAlign="right" colon={false}>
            <FormItemDecorator
              required
              form={this.props.form}
              field={'approvalId'}
              label="审批编号"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              options={{
                rules: [
                  {
                    required: true,
                    message: '审批编号不能为空',
                  },
                ],
              }}
            >
              <Input placeholder="请输入钉钉审批编号" autoFocus></Input>
            </FormItemDecorator>
            <FormItemDecorator
              required
              form={this.props.form}
              field={'accountRoleId'}
              label="商户角色"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              options={{
                rules: [
                  {
                    required: true,
                    message: '商户角色不能为空',
                  },
                ],
              }}
            >
              <CustRoleSelect placeholder="请选择商户所属角色" />
            </FormItemDecorator>
            <FormItemDecorator
              required
              form={this.props.form}
              field={'contractId'}
              label="合同编号"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              options={{
                rules: [
                  {
                    required: true,
                    message: '合同编号不能为空',
                  },
                ],
              }}
            >
              <Input placeholder="请输入合同编号"></Input>
            </FormItemDecorator>
            <FormItemDecorator
              required
              form={this.props.form}
              field={'startAndEndDate'}
              label="合同起止日期"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              options={{
                rules: [
                  {
                    required: true,
                    message: '请选择合同起止日期',
                  },
                ],
              }}
            >
              <RangePicker style={{ width: '100%' }} />
            </FormItemDecorator>
            <FormItemDecorator
              required
              form={this.props.form}
              field={'cautionMoney'}
              label="保证金金额"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              options={{
                rules: [
                  {
                    required: true,
                    message: '保证金金额不能为空',
                  },
                  {
                    pattern: REGEX.amount,
                    message: '保证金金额格式不正确',
                  },
                ],
              }}
            >
              <Input
                // style={{ width: 150 }}
                addonBefore="¥"
              />
            </FormItemDecorator>
          </Form>
        </Modal>
        <Modal
          wrapClassName="modal-approval"
          visible={rejectModalVisible}
          title="审批驳回"
          onOk={this.onArpovalReject}
          onCancel={this.onCancel}
          maskClosable={false}
          destroyOnClose
        >
          <Form labelAlign="right" colon={false}>
            <FormItemDecorator
              required
              form={this.props.form}
              field={'approvalId'}
              label="审批编号"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              options={{
                rules: [
                  {
                    required: true,
                    message: '审批编号不能为空',
                  },
                ],
              }}
            >
              <Input placeholder="请输入钉钉审批编号" autoFocus></Input>
            </FormItemDecorator>
            <FormItemDecorator
              required
              className="reject-reason"
              form={this.props.form}
              field={'remark'}
              label="驳回原因"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              options={{
                rules: [
                  {
                    required: true,
                    message: '驳回意见不能为空',
                  },
                ],
              }}
            >
              <TextArea placeholder="请输入审批驳回意见" autoSize={{ minRows: 3, maxRows: 3 }}></TextArea>
            </FormItemDecorator>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create<P>()(ApprovalList)
