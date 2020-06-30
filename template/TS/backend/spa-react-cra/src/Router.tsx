import React, { lazy, Suspense } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { routers } from 'common/constants';
import AuthRoute from 'components/molecules/AuthRoute';
import Indicators from 'components/pages/Indicators';
import Process from 'components/pages/Process';
import FileUpload from 'components/pages/Upload';
import { Spin } from 'antd';

const Layer = lazy(() => import('components/pages/Layer'));

const LAVA_ROUTERS = [
  {
    pathname: routers.processAvailable,
    component: <Process.List />,
  },
  {
    pathname: routers.indicatorsList,
    component: <Indicators.List />,
  },
  {
    pathname: routers.resourceUpload,
    component: <FileUpload />,
  },
];

const Router: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Spin indicator={<LoadingOutlined />} size="large" tip="即将进入天壤控制台">
          <div style={{ height: '100vh', width: '100%' }}></div>
        </Spin>
      }
    >
      <Switch>
        <Layer>
          {LAVA_ROUTERS.map((route) => {
            const { pathname, component } = route;
            return (
              <AuthRoute exact key={pathname} path={pathname}>
                {component}
              </AuthRoute>
            );
          })}
          <Route
            exact
            path="/"
            render={() => {
              return <Redirect to={routers.processAvailable}></Redirect>;
            }}
          ></Route>
        </Layer>
      </Switch>
    </Suspense>
  );
};

export default Router;
