import React, { FC } from "react";
import { Redirect, Route } from "react-router-dom";
import { IRouteItem } from "./config";
import Page403 from "@/pages/exception/403";
import { checkPermissions } from "./utils";

interface AuthorizedRouteProps extends IRouteItem {}

const AuthorizedRoute: FC<AuthorizedRouteProps> = ({
  component: Component,
  render,
  ...rest
}) => {
  return (
    <Route
      exact
      {...rest}
      render={props => {
       // console.log({ props }, "---");
        const { location, ...rest } = props;
        //const isLogin = false;

        //未登录跳转到登录页面
        //isLogin && Api.auth.login(window.origin + "/app/entry/merchart/index");
        //isLogin && Api.auth.login();

        const authority = checkPermissions(location.pathname);

        return authority ? <Component {...props} /> : <Page403 />;
      }}
    />
  );
};

export default AuthorizedRoute;
