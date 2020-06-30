import React, { FC } from 'react';
import { RouteProps, Route } from 'react-router-dom';

// 权限路由
const AuthRoute: FC<RouteProps> = ({ children, render, component: Compo, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (children) {
          return children;
        } else if (render) {
          return render(props);
        } else if (Compo) {
          return <Compo {...props}></Compo>;
        }
      }}
    ></Route>
  );
};

export default AuthRoute;
