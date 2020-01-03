import * as React from 'react';
import { Avatar, Dropdown, Icon, Menu, Button, message } from 'antd';

import './index.scss';
import API from '@/api';
import { UrlConfig, AJAX_STATUS } from '@/shared/common/constants';
import { getEnv } from '@/shared/common/utils';

const env = getEnv();
const { loginUrl, serviceUrl, logoutUrl } = UrlConfig[env];
type P = {};
type S = {
  userInfo: {
    opsId?: string;
    adminFlag?: boolean;
    realName: string;
    zhName?: string;
  };
};

// 用户头像
class GlobalAvatar extends React.Component<P, S> {
  state: S = {
    userInfo: {
      opsId: '',
      adminFlag: false,
      realName: '',
      zhName: '',
    },
  };

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const res: any = await API.auth.userInfo();
    if (res) {
      if (res.code) {
        if (res.code !== AJAX_STATUS.SUCCESS) {
          message.error(res.message);
        }
      } else {
        this.setState({
          userInfo: {
            realName: res.userName,
          },
        });
      }
    }
  };

  handleLogin = () => {
    window.location.href = loginUrl;
  };

  handelLogout = async () => {
    const res = await API.auth.logout();

    if (res.code !== AJAX_STATUS.SUCCESS) {
      message.error(res.message);
      return;
    }

    sessionStorage.clear();

    const iframe = document.createElement('iframe');
    iframe.src = logoutUrl;
    iframe.style.visibility = 'hidden';
    iframe.style.width = `0`;
    iframe.style.height = `0`;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      document.body.removeChild(iframe);
      window.location.reload();
    };
  };

  renderDownMenu = () => {
    return (
      <Menu>
        <Menu.Item key={1} onClick={this.handelLogout}>
          退出登录
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const menu = this.renderDownMenu();
    const { userInfo } = this.state;
    console.log(userInfo);
    return (
      <div className="global-avatar">
        {!userInfo.realName ? (
          <Button onClick={this.handleLogin}>登录</Button>
        ) : (
          <div className="user-info">
            <Avatar
              shape="circle"
              src="http://fdfs.xmcdn.com/group61/M0A/7C/F3/wKgMZl0wBcnxgorbAABWZX_GLtM979.jpg"
            />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                {userInfo.realName} <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        )}
      </div>
    );
  }
}

export default GlobalAvatar;
