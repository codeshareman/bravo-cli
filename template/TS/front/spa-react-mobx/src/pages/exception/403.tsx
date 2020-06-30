import { Button, Result } from "antd";
import React, { FC } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

type P = RouteComponentProps & {};

const NoFoundPage: FC<P> = props => (
  <Result
    status="403"
    title="403"
    subTitle="对不起， 你没有权限访问当前页面!"
    extra={
      <Button type="primary" onClick={() => props.history.push("/dashboard")}>
        返回首页
      </Button>
    }
  ></Result>
);

export default withRouter(NoFoundPage);
