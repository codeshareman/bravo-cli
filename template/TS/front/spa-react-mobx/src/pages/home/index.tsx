import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Api from '@/api';
import { inject, observer } from 'mobx-react';
import { HTTP_STATUS, BASE_PATH } from '@/shared/common/constants';
import { getImgPath } from '@/shared/common/utils';
import { IUserStore } from '@/models/user';

import './index.scss';

type P = RouteComponentProps & {
  userStore?: IUserStore;
};
type S = {
  isLogin;
};

@inject('userStore')
@observer
class Home extends Component<P, S> {
  componentDidMount() {
    this.isLogin();
  }

  isLogin = async () => {
    const res = await Api.auth.checkLoginState();
    //已登录
    if (HTTP_STATUS.SUCCESSS === res.ret && res.login) {
      this.props.userStore.setIsLogin(true);
      this.getUserInfo();
    } else {
      sessionStorage.clear();
      this.props.userStore.clear();
    }
  };

  getUserInfo = async () => {
    const res = await Api.account.basicInfo();
    if (HTTP_STATUS.SUCCESSS === res.code) {
      this.props.userStore.setUserInfo(res.data);
    }
  };

  login = () => {
    const formUri = window.location.origin + BASE_PATH + '/index';
    Api.auth.login(formUri);
  };

  applyEntry = () => {
    //检测是否登录
    if (this.props.userStore.isLogin) {
      this.props.history.push('/index');
    } else {
      this.login();
    }
  };

  logout = async () => {
    const res = await Api.auth.logout();
    if (HTTP_STATUS.SUCCESSS === res.ret) {
      sessionStorage.clear();
      this.props.userStore.clear();
      this.props.history.replace('/');
    }
  };

  renderDownMenu = () => {
    const config = [
      {
        name: '退出',
        class: 'logout',
        link: '',
        onClick: this.logout,
      },
    ];
    const mItemList = config.map((item, index) => {
      return (
        <div key={index} className={`item  item-${item.class}`} onClick={item.onClick}>
          {item.name}
        </div>
      );
    });
    return <div className="dropdown-menu">{mItemList}</div>;
  };

  render() {
    const { userInfo, isLogin } = this.props.userStore;
    const imgPath = getImgPath();
    return (
      <div className="home">
        <div className="home-top">
          <div className="home-header">
            <div className="logo"></div>
            {isLogin ? (
              <div className="user-info">
                <img src={userInfo && imgPath + '/' + userInfo.logoPic} alt="" />
                <span>{userInfo && userInfo.nickname}</span>
                {this.renderDownMenu()}
              </div>
            ) : (
              <span className="login" onClick={this.login}>
                登录/注册
              </span>
            )}
          </div>
          <div className="home-header-intro">
            <h2>欢迎来到喜马商户平台</h2>
            <p>专为喜马拉雅合作商户打造的线上服务平台</p>
            <a onClick={this.applyEntry}>立即申请入驻</a>
          </div>
        </div>
        <div className="home-content">
          <h3>我们的服务</h3>
          <ul className="content-awrp">
            <li>
              <div className="img-cover cover-1"></div>
              <h4>支持多种合作模式</h4>
              <p>内容分销：分销喜马海量内容，轻松获取分销收益。</p>
              <p>企业采购：在线采购实物商品，尽享超低折扣。</p>
            </li>
            <li>
              <div className="img-cover cover-2"></div>
              <h4>线上一站式解决方案</h4>
              <p>商品选购：快速下单，有效降低沟通成本。</p>
              <p>订单管理：物流状态实时跟踪，避免人工订货漏单错单。</p>
              <p>账户管理：线上账户自助结算，收支明细随时查看，确保资金安全，账目清晰。</p>
            </li>
            <li>
              <div className="img-cover cover-3"></div>
              <h4>多样线下场景 多种营销玩法</h4>
              <p>多样产品：提供可满足多种线下场景的产品，如朗读亭、有声图书馆、小雅音箱等。</p>
              <p>营销玩法：支持发放活动优惠券、会员体验券、打折促销等多种营销手段。</p>
            </li>
          </ul>
        </div>
        <div className="footer">
          Copyright © 2012-2019 www.ximalaya.com lnc.ALL Rights Reserved
          上海喜马拉雅网络科技有限公司 版权所有
        </div>
      </div>
    );
  }
}

declare let window: Window & {
  cookies: any;
};

export default withRouter(Home);
