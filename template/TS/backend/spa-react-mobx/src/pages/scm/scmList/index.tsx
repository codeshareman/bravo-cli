import React, { Component } from 'react'
import './style.scss'
import { Table, Button, Modal, Form, Tooltip, Input, message } from 'antd'
import AddIcon from '@/assets/images/ico_16_add@2x.png'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import cx from 'classnames'
import { ACCOUNT_STATUS_DICT } from '../constants'
import moment from 'moment'
import { FormComponentProps } from 'antd/lib/form'
import FormItemDecorator from '@/components/FormItemDecorator'
import API from '@/api'
import { AJAX_STATUS } from '@/shared/common/constants'
import { limitWord } from '@/shared/common/utils'
import { AuthType } from '@/components/AuthCompo/type'
import AuthCompo from '@/components/AuthCompo'

const MSG_TYPE = {
  delete: 'delete',
  open: 'open',
  close: 'close',
}
const MSG_DICT = {
  delete: {
    title: '确定删除该供应商账户吗？',
    msg: '请先确保供应商没有未完成订单',
    async: 'deleteSupplier',
  },
  open: {
    title: '',
    msg: '确定启用该供应商账户吗？',
    async: 'enableSupplier',
  },
  close: {
    title: '确定停用该供应商账户吗？',
    msg: '请先确保供应商没有未完成订单',
    async: 'disableSupplier',
  },
}
interface SCMListProps extends RouteComponentProps, FormComponentProps {}
interface SCMListState {
  page: number
  pageSize: number
  showAdd: boolean
  showMessage: boolean
  dataSource: Array<any>
  chooseMessageType: string
  chooseRowData: any
  loadingTable: boolean
  total: number
}

@(withRouter as any)
class SCMList extends Component<SCMListProps, SCMListState> {
  constructor(props: SCMListProps) {
    super(props)
    this.state = {
      page: 1,
      pageSize: 10,
      showAdd: false,
      showMessage: false,
      dataSource: [],
      chooseMessageType: MSG_TYPE.delete,
      chooseRowData: {},
      loadingTable: false,
      total: 0,
    }
  }
  componentDidMount() {
    this.getData()
  }
  getData = async (page?, pageSize?) => {
    this.setState({
      loadingTable: true,
    })
    page = page || this.state.page
    pageSize = pageSize || this.state.pageSize
    try {
      const res = await API.supplyChain.supplierList(page, pageSize)
      if (res.code === AJAX_STATUS.SUCCESS) {
        this.setState({
          dataSource: res.data.data,
          total: res.data.total,
        })
      } else {
        message.info(res.message, 2, null)
      }
    } catch (e) {
      throw new Error(e.message)
    } finally {
      this.setState({
        loadingTable: false,
      })
    }
  }
  // 表格显示
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
              {row.companyName.length > 28 ? (
                <Tooltip title={row.companyName}>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.companyName}
                  </p>
                </Tooltip>
              ) : (
                <p>{row.companyName}</p>
              )}
              <p className="sub-info">供应商ID：{row.developerId || '无'}</p>
              <p style={{ marginTop: 6 }}>
                <span
                  className={cx({
                    'account-status': true,
                    'account-enabled': row.supplierStatus === ACCOUNT_STATUS_DICT.normal,
                    'account-disabled': row.supplierStatus !== ACCOUNT_STATUS_DICT.normal,
                  })}
                >
                  {row.supplierStatus === ACCOUNT_STATUS_DICT.normal ? '正常' : '停用'}
                </span>
              </p>
            </>
          )
        },
      },
      {
        key: 'url',
        dataIndex: 'url',
        title: '公司网址',
        align: 'left',
        width: 200,
        render: text => {
          return text ? limitWord(text, 28) : '--'
        },
      },
      {
        key: 'contactsName',
        dataIndex: 'contactsName',
        title: '联系人姓名',
        align: 'left',
        width: 200,
        render: text => {
          return text ? text : '--'
        },
      },
      {
        key: 'contactsPhone',
        dataIndex: 'contactsPhone',
        title: '联系人手机号',
        align: 'left',
        width: 200,
        render: text => {
          return text ? text : '--'
        },
      },
      {
        key: 'contactsEmail',
        dataIndex: 'contactsEmail',
        title: '联系人邮箱',
        align: 'left',
        width: 200,
        render: text => {
          return text ? limitWord(text, 28) : '--'
        },
      },
      {
        key: 'createdTime',
        dataIndex: 'createdTime',
        title: '创建时间',
        align: 'left',
        width: 160,
        render: text => {
          if (text === -1) {
            return '--'
          }
          return moment(text).format('YYYY-MM-DD hh:mm:ss')
        },
      },
      {
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        width: 130,
        align: 'center',
        render: (cur, rows) => {
          return (
            <div className="table-actions">
              {rows.supplierStatus === ACCOUNT_STATUS_DICT.normal ? (
                <a onClick={() => this.showMessageModal(MSG_TYPE.close, rows)}>停用</a>
              ) : (
                <a onClick={() => this.showMessageModal(MSG_TYPE.open, rows)}>启用</a>
              )}
              <a onClick={() => this.jumpToDetail(rows)}>查看</a>
              <a onClick={() => this.showMessageModal(MSG_TYPE.delete, rows)}>删除</a>
            </div>
          )
        },
      },
    ]
    return {
      dataSource,
      columns,
      rowKey: 'developerId',
    }
  }
  // 展示modal并更新相应的类型和所点击的行
  showMessageModal = (type: string, row) => {
    this.setState({
      showMessage: true,
      chooseMessageType: type,
      chooseRowData: { ...row },
    })
  }
  // 跳转到详情页
  jumpToDetail = rows => {
    this.props.history.push(`/scm/scmList/detail/${rows.developerId}`)
  }
  // 添加按钮
  clickAdd = () => {
    this.setState({
      showAdd: true,
    })
  }
  cancalAddModal = () => {
    this.setState({
      showAdd: false,
    })
  }
  okAddModal = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const res = await API.supplyChain.addSupplier(values.developerID)
          if (res.code === AJAX_STATUS.SUCCESS) {
            message.info('添加供应商成功', 2, null)
            this.cancalAddModal()
            this.getData()
          } else {
            message.info(res.message, 2, null)
          }
        } catch (e) {
          throw new Error(e.message)
        }
      }
    })
  }
  cancalMessageModal = () => {
    this.setState({
      showMessage: false,
    })
  }

  okMessageModal = async () => {
    const { chooseMessageType, chooseRowData } = this.state
    try {
      const res = await API.supplyChain[MSG_DICT[chooseMessageType].async](chooseRowData.developerId)
      if (res.code === AJAX_STATUS.SUCCESS) {
        this.cancalMessageModal()
        this.getData()
      } else {
        message.info(res.message, 2, null)
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }

  showMessageComponent = () => {
    const { chooseMessageType } = this.state
    return (
      <div className="modal-message-wrapper">
        <p className="modal-message-title">{MSG_DICT[chooseMessageType].title}</p>
        <p className="modal-message-msg">{MSG_DICT[chooseMessageType].msg}</p>
      </div>
    )
  }
  blurDeveloper = async () => {
    this.props.form.setFieldsValue({ companyName: '' })
    this.props.form.validateFields(async (err, values) => {
      if (!err && values.developerID) {
        try {
          const res = await API.supplyChain.getCompanyNameByDeveloperId(values.developerID)
          if (res.code === AJAX_STATUS.SUCCESS) {
            const name = res.data
            this.props.form.setFieldsValue({ companyName: name })
          } else {
            message.info(res.message, 2, null)
          }
        } catch (e) {
          throw new Error(e.message)
        }
      }
    })
  }
  render() {
    const { showAdd, showMessage, loadingTable, pageSize, page, total } = this.state
    return (
      <div className="scm-list">
        <div className="title-wrapper">
          <div className="title">供应商管理</div>
          <AuthCompo type={AuthType.ROLE} scope="supply_chain">
            <Button type="primary" ghost onClick={() => this.clickAdd()}>
              <img style={{ width: 16, height: 16, marginRight: 5, marginTop: -3 }} src={AddIcon} alt="add" />
              新增供应商
            </Button>
          </AuthCompo>
        </div>
        <Table
          {...this.getTableProps()}
          loading={{ spinning: loadingTable, tip: '数据加载中...' }}
          scroll={{ x: 1000 }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showTotal: total => {
              return `共${total}条数据`
            },
            onChange: (page: number) => {
              this.setState({
                page: page,
              })
              this.getData(page)
            },
          }}
        />
        <Modal
          visible={showAdd}
          title="新建供应商"
          onCancel={this.cancalAddModal}
          onOk={this.okAddModal}
          destroyOnClose
        >
          <Form
            labelCol={{
              xs: { span: 24 },
              sm: { span: 6 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 18 },
            }}
          >
            <FormItemDecorator
              style={{ marginBottom: 0 }}
              form={this.props.form}
              field={'developerID'}
              label="供应商开发者ID"
              required={true}
              options={{
                rules: [
                  {
                    required: true,
                    message: '请输入供应商开发者ID',
                  },
                  {
                    pattern: /^[0-9]*$/,
                    message: '只能输入数字',
                  },
                ],
              }}
            >
              <Input placeholder="请输入供应商开发者ID" onBlur={this.blurDeveloper} />
            </FormItemDecorator>
            <FormItemDecorator
              style={{ marginBottom: 0 }}
              form={this.props.form}
              field={'companyName'}
              label="供应商公司名称"
            >
              <Input disabled placeholder="请先输入正确的供应商开发者ID" />
            </FormItemDecorator>
          </Form>
        </Modal>
        <Modal
          visible={showMessage}
          title="提示"
          onCancel={this.cancalMessageModal}
          onOk={this.okMessageModal}
          destroyOnClose
          width={400}
        >
          {this.showMessageComponent()}
        </Modal>
      </div>
    )
  }
}

const WrapperComponent = Form.create({})(SCMList)
export default WrapperComponent
