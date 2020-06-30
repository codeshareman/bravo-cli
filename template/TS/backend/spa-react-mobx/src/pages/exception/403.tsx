import { Result } from 'antd'
import React, { FC } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

type P = RouteComponentProps & {}

const Page403: FC<P> = () => <Result status={'403'} title="403" subTitle="对不起， 你没有权限访问当前页面!"></Result>

export default withRouter(Page403)
