import * as React from 'react'
import { Avatar, Dropdown, Icon, Menu, Button } from 'antd'
import API from '@/api'
import { UrlConfig } from '@/shared/common/constants'
import { getEnv } from '@/shared/common/utils'
import { inject } from 'mobx-react'
import { IAuthStore } from '@/models/auth'
import './index.scss'

const env = getEnv()

const { loginUrl, logoutUrl } = UrlConfig[env]

type P = {
  authStore?: IAuthStore
}
type S = {
  userInfo: {
    opsId?: string
    adminFlag?: boolean
    realName: string
    zhName?: string
    username: string
    email: string
    dingTalkId: string
  }
}

// 用户头像
@inject('authStore')
class GlobalAvatar extends React.Component<P, S> {
  state: S = {
    userInfo: {
      opsId: '',
      adminFlag: false,
      realName: '',
      zhName: '',
      username: '',
      email: '',
      dingTalkId: null,
    },
  }

  componentDidMount() {
    this.getUserInfo()
  }

  getUserInfo = async () => {
    if (window.merchant && window.merchant.userinfo) {
      this.setState({
        userInfo: window.merchant.userinfo,
      })
    } else {
      const res: any = await API.auth.userInfo()
      if (res && res.opsId) {
        this.setState({
          userInfo: res,
        })
      } else {
        // message.error(res.message);
      }
    }
  }

  handleLogin = async () => {
    window.location.href = loginUrl
  }

  handelLogout = async () => {
    const redirect_uri = encodeURIComponent(window.location.href)
    try {
      await API.auth.logoutLocal()
      window.location.href = logoutUrl + '?service=' + redirect_uri
    } catch (err) {
      throw new Error(err.message)
    }
  }

  renderDownMenu = () => {
    return (
      <Menu style={{ width: 100 }}>
        <Menu.Item key={1} onClick={this.handelLogout}>
          退出登录
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const menu = this.renderDownMenu()
    const { userInfo } = this.state

    return (
      <div className="global-avatar">
        {!userInfo.realName ? (
          <Button onClick={this.handleLogin}>登录</Button>
        ) : (
          <div className="user-info">
            <Avatar shape="circle" src="http://fdfs.xmcdn.com/group61/M0A/7C/F3/wKgMZl0wBcnxgorbAABWZX_GLtM979.jpg" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link">
                {userInfo.realName} <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        )}
      </div>
    )
  }
}

export default GlobalAvatar

declare let window: Window & {
  merchant: {
    userinfo: any
    permissions: string[]
  }
}
