import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import CustBreadcrumb from '@/components/CustComponents/CustBreadcrumb'
import './style.scss'
import API from '@/api'
import { AJAX_STATUS } from '@/shared/common/constants'

type SCMDetailProps = RouteComponentProps<{ id: string }> & {}

interface SCMDetailState {
  dataSource: any
}

@(withRouter as any)
class SCMDetail extends Component<SCMDetailProps, SCMDetailState> {
  constructor(props: SCMDetailProps) {
    super(props)
    this.state = {
      dataSource: {},
    }
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const {
      match: { params },
    } = this.props
    const id = +params.id
    try {
      const res = await API.supplyChain.selectSupplier(id)
      if (res.code === AJAX_STATUS.SUCCESS) {
        this.setState({
          dataSource: res.data,
        })
      }
    } catch (e) {
      console.log(e)
      this.setState({
        dataSource: {
          // 公司名称
          companyName: '11111111',
          // 公司网址
          url: '11111111',
          // 公司介绍
          presentation: '11111111',
          // 公司地址
          address: '11111111',
          // 公司联系人名称
          contactsName: '11111111',
          // 联系人手机号
          contactsPhone: '11111111',
          // 联系人邮箱
          contactsEmail: '11111111',
        },
      })
    }
  }
  render() {
    const routes = [
      {
        path: '/scm/scmList',
        name: '供应商管理',
      },
      {
        path: '',
        name: '供应商详情',
      },
    ]
    const { dataSource } = this.state
    return (
      <div className="scm-detail">
        <CustBreadcrumb routes={routes} showCurrentPosition />
        <div className="title-wrapper">
          <div className="title">供应商详情</div>
        </div>
        <div className="detail-body">
          <div className="body-row">
            <div className="left">公司名称：</div>
            <div>{dataSource.companyName}</div>
          </div>
          <div className="body-row">
            <div className="left">公司网址：</div>
            <div>{dataSource.url}</div>
          </div>
          <div className="body-row">
            <div className="left">公司介绍：</div>
            <div>{dataSource.presentation}</div>
          </div>
          <div className="body-row">
            <div className="left">公司地址：</div>
            <div>{dataSource.address}</div>
          </div>
          <div className="body-row">
            <div className="left">联系人姓名：</div>
            <div>{dataSource.contactsName}</div>
          </div>
          <div className="body-row">
            <div className="left">联系人手机号：</div>
            <div>{dataSource.contactsPhone}</div>
          </div>
          <div className="body-row">
            <div className="left">联系人邮箱：</div>
            <div>{dataSource.contactsEmail}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default SCMDetail
