import React, { FC } from 'react';
import styled from 'styled-components';
import logo from 'assets/images/logo.png';
import logo_2x from 'assets/images/logo@2x.png';
import { Menu } from 'antd';
import { routers } from 'common/constants';
import { Link, useLocation } from 'react-router-dom';

const { Item } = Menu;

const LAVA_MENU = [
  {
    title: '业务数据管理',
    pathname: routers.processAvailable,
    icon: '',
  },
  {
    title: '指标管理',
    pathname: routers.indicatorsList,
    icon: '',
  },
  {
    title: '配置管理',
    pathname: routers.resourceUpload,
    icon: '',
  },
];

const Navigation: FC = () => {
  const { pathname } = useLocation();

  const renderMenu = () => {
    return LAVA_MENU.map((item, index) => {
      return (
        <Item className="menu-item" key={item.pathname} icon={item.icon}>
          <Link className="menu-link" to={item.pathname}>
            {item.title}
          </Link>
        </Item>
      );
    });
  };

  return (
    <Container>
      <div className="nav-wrapper">
        <div className="nav-logo">
          <div className="logo-img">
            <img src={logo} srcSet={`${logo_2x} 2x`} alt="logo"></img>
          </div>
          <div className="logo-name">
            天壤LAVA
            <br />
            控制台
          </div>
        </div>
        <Menu className="side-menu" theme="dark" selectedKeys={[pathname]}>
          {renderMenu()}
        </Menu>
      </div>
    </Container>
  );
};

const Container = styled.div.attrs({
  className: 'side-nav',
})`
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.15);
  position: relative;
  min-height: 100vh;
  .nav-wrapper {
    position: fixed;
    width: 220px;
    height: 100%;
  }
  .nav-logo {
    padding: 20px 0;
    background: #0b416d;
    > .logo-img {
      width: 100%;
      text-align: center;
    }
    > .logo-name {
      margin: 5px auto 0;
      text-align: center;
      height: 36px;
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
    }
  }
  .side-menu {
    height: 100%;
    background: rgba(6, 61, 107, 1) !important;
    .menu-item {
      height: 36px;
      border-left: 5px solid transparent;
    }
    .menu-link {
    }
  }
`;

export default Navigation;
