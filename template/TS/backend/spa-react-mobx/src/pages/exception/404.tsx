import { Result } from 'antd'
import React, { FC } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

type P = RouteComponentProps & {}

const Page404: FC<P> = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起, 你访问的路径不存在!"
    // extra={
    //   <Button type="primary" onClick={() => props.history.push("/")}>
    //     返回首页
    //   </Button>
    // }
  ></Result>
)

export default withRouter(Page404)
