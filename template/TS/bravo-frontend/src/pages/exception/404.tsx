import { Button, Result } from "antd";
import React, { FC } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

type P = RouteComponentProps & {};

const NoFoundPage: FC<P> = props => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" onClick={() => props.history.push("/dashboard")}>
        返回首页
      </Button>
    }
  ></Result>
);

export default withRouter(NoFoundPage);
