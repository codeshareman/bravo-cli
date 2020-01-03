import React, { Component } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { message, ConfigProvider } from 'antd';
import { Helmet } from 'react-helmet';
import { Provider } from 'mobx-react';
import store from '@/models';
import * as Sentry from '@sentry/browser';

import MainLayout from './layout';
import MainRoutes from './router';

import { BASE_PATH } from '@/shared/common/constants';
import { getEnv } from '@/shared/common/utils';
import zh_CN from 'antd/lib/locale/zh_CN';
import '@/assets/css/app.scss';

// 当前环境
const env = getEnv();

// sentry初始化
function initSentry() {
  env === 'prod' &&
    Sentry.init({
      dsn: 'https://1dd94f76011b4f8dbad47c2ba842c965@websentry.ximalaya.com/50',
    });
}

// 设置消息提示的数量
message.config({
  maxCount: 2,
});

initSentry();

export default class App extends Component {
  componentDidMount() {
    console.log({ store });
  }

  componentDidCatch(error: object) {
    env === 'prod' && Sentry.captureException(error);
  }

  render() {
    return (
      <div className="page-container">
        <Helmet>
          <title>喜马拉雅商户平台</title>
        </Helmet>
        <Provider {...store}>
          <ConfigProvider locale={zh_CN}>
            <Router basename={BASE_PATH}>
              <MainLayout>
                {/* <MainRoutes /> */}
                <Switch> {MainRoutes} </Switch>
                {/* <DevTools /> */}
              </MainLayout>
            </Router>
          </ConfigProvider>
        </Provider>
      </div>
    );
  }
}
