import * as React from 'react';
import { Link } from 'react-router-dom';

import cx from 'classnames';
import { getMenuByPath } from '@/router/utils';
import { BASE_PATH } from '@/shared/common/constants';
import './index.scss';

type P = {};
type S = {};

// 侧边栏
class SiderView extends React.Component<P, S> {
  render() {
    const sideMenu = getMenuByPath();

    return (
      <div className="sider-wrapper">
        <div className="top">
          <h3>
            <i></i>
            <span>{sideMenu.title}</span>
          </h3>
        </div>
        <div className="bottom">
          {sideMenu.childRoute.map(({ id, title, path, hideMenu }, index) => {
            const pathname = window.location.pathname;
            return (
              !hideMenu && <div
                key={id}
                className={cx({
                  'menu-item': BASE_PATH + path !== pathname,
                  'menu-item--active': BASE_PATH + path === pathname,
                })}
              >
                <Link to={path}>{title}</Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SiderView;
