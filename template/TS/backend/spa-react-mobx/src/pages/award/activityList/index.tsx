import React, { Component } from 'react'
import { Table, message, Button } from 'antd'
import API from '@/api'
import Form, { FormComponentProps } from 'antd/lib/form'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { formatTimeByTimestamp, limitWord } from '@/shared/common/utils'
import { AJAX_STATUS } from '@/shared/common/constants'
import Query from './query'
import { RIGHT_TYPE } from '../constants'
import GenneralDataCompo from '@/hoc/GenneralDataCompo'
import AddIcon from '@/assets/images/ico_16_add@2x.png'
import './style.scss'
import AuthCompo from '@/components/AuthCompo'
import { AuthType } from '@/components/AuthCompo/type'
// import AuthCompo from '@/components/AuthCompo';

interface ActivityListState {
  // page: number;
  // pageSize: number;
  total: number
  loadingTable: boolean
  dataSource: Array<any>
  operateData: any
  showEdit: boolean
  queryParams: any
}
interface ActivityListProps extends FormComponentProps, RouteComponentProps {}

@(withRouter as any)
class ActivityList extends Component<ActivityListProps, ActivityListState> {
  constructor(props: ActivityListProps) {
    super(props)
    this.state = {
      // page: 1,
      // pageSize: 10,
      total: 0,
      loadingTable: false,
      dataSource: [],
      operateData: {},
      showEdit: false,
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
      const res = await API.reward.activityList(params)
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
          total: res.data.total,
          queryParams: {
            ...params,
          },
        })
      } else {
        message.info(res.message, 2, null)
        this.setState({
          dataSource: [],
          // page:1,
          total: 0,
        })
      }
    } catch (e) {
      console.log(e)
      this.setState({
        dataSource: [],
        // page:1,
        total: 0,
      })
    } finally {
      this.setState({
        loadingTable: false,
      })
    }
  }

  jumpToAdd = () => {
    this.props.history.push('/award/activity/edit')
  }

  getDisplayTime = (time: any) => {
    return `${time.year}-${time.month}-${time.day} ${time.hour}:${time.min}:${time.seconds}`
  }

  showEdit = row => {
    this.setState({
      showEdit: true,
      operateData: { ...row },
    })
    this.props.history.push('/award/activity/edit', {
      record: row,
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
        key: 'opsActivityId',
        dataIndex: 'opsActivityId',
        title: '活动ID',
        align: 'left',
        render: (opsActivityId: string) => {
          return limitWord(opsActivityId, 30)
        },
      },
      {
        key: 'activityName',
        dataIndex: 'activityName',
        title: '活动名称',
        align: 'left',
        render: (activityName: string) => {
          return limitWord(activityName, 30)
        },
      },
      {
        key: 'uid',
        dataIndex: 'uid',
        title: '商户UID',
        align: 'left',
        width: 80,
      },
      {
        key: 'channelName',
        dataIndex: 'channelName',
        title: '所属业务线',
        align: 'left',
      },
      {
        key: 'presentType',
        dataIndex: 'presentType',
        title: '权益类型',
        align: 'left',
        width: 100,
        render: text => {
          let show = ''
          RIGHT_TYPE.forEach(e => {
            if (e.value === text) {
              show = e.label
            }
          })
          return show
        },
      },
      {
        key: 'commodityId',
        dataIndex: 'commodityId',
        title: '商品/礼包ID',
        width: 200,
        align: 'left',
        render: (commodityId: string) => {
          return limitWord(commodityId, 24)
        },
      },
      {
        key: 'number',
        dataInde: 'number',
        title: '已领取/总权益量',
        align: 'left',
        render: (text, row) => {
          return row.drawNumber + '/' + row.allNumber
        },
      },
      {
        key: 'pullNewUser',
        dataIndex: 'pullNewUser',
        title: '拉新数',
        align: 'left',
        width: 80,
      },
      {
        key: 'openDate',
        dataIndex: 'openDate',
        title: '开始/结束时间',
        align: 'left',
        render: (text, row) => {
          const startTime = this.getDisplayTime(formatTimeByTimestamp(row.startActivityDate))
          const endTime = this.getDisplayTime(formatTimeByTimestamp(row.endActivityDate))
          return (
            <div>
              <p>{startTime}</p>
              <p>{endTime}</p>
            </div>
          )
        },
      },
      {
        key: 'activityUrl',
        dataIndex: 'activityUrl',
        title: '活动链接',
        align: 'left',
        render: (link: string) => {
          return limitWord(link, 40)
        },
      },
      {
        key: 'activityStatus',
        dataIndex: 'activityStatus',
        title: '活动状态',
        align: 'left',
        width: 100,
        render: (text, row) => {
          let color = '#324150'
          let show = ''
          const now = new Date()
          if (now < row.startActivityDate) {
            show = '未开始'
          } else if (now > row.endActivityDate) {
            show = '已结束'
            color = '#BEC7D2'
          } else {
            show = '进行中'
            color = '#62C1AD'
          }
          return <span style={{ color: color }}>{show}</span>
        },
      },
      {
        key: 'applyUser',
        dataIndex: 'applyUser',
        title: '申请者',
        align: 'left',
        width: 150,
      },
      {
        key: 'createDate',
        dataIndex: 'createDate',
        title: '创建时间',
        align: 'left',
        render: text => {
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
          const now = new Date()
          let flag = false
          if (now <= rows.endActivityDate) {
            flag = true
          }
          return (
            <div className="table-actions">
              {/* // TODO */}
              {flag ? (
                <AuthCompo type={AuthType.ROLE} scope="tech">
                  <a onClick={() => this.showEdit(rows)}>编辑</a>
                </AuthCompo>
              ) : (
                <span>--</span>
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
  render() {
    const { loadingTable, queryParams, total } = this.state
    return (
      <div className="award-activity-list">
        <div className="title-wrapper">
          <div className="title">拉新活动</div>
          <AuthCompo type={AuthType.ROLE} scope="tech">
            <Button type="primary" ghost onClick={() => this.jumpToAdd()}>
              <img style={{ width: 16, height: 16, marginRight: 5, marginTop: -3 }} src={AddIcon} alt="add" />
              新增拉新活动
            </Button>
          </AuthCompo>
        </div>
        <Query getData={this.getData} />
        <Table
          className="table-list"
          {...this.getTableProps()}
          loading={{ spinning: loadingTable, tip: '数据加载中...' }}
          scroll={{ x: 2000 }}
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
      </div>
    )
  }
}

export default Form.create<ActivityListProps>()(GenneralDataCompo(ActivityList))
