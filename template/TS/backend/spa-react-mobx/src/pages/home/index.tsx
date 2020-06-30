import React, { Component } from 'react'
import weclomeImg from '@/assets/images/bg-home@2x.png'

import './index.scss'

type P = {}
type S = {}

// 审批列表
class Home extends Component<P, S> {
  render() {
    return (
      <div id="homepage">
        <div className="welcome">
          <p>欢迎来到喜马商户平台管理后台</p>
          <img src={weclomeImg} />
        </div>
      </div>
    )
  }
}

export default Home
