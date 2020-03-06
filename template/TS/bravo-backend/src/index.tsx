// 库
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Helmet } from 'react-helmet'
import { message } from 'antd'
import API from '@/api'
import { AJAX_STATUS } from './shared/common/constants'

window.merchant = {
  userinfo: null,
  permissions: [],
}

message.config({
  maxCount: 1,
})

const loadJs = (url: string) => {
  return new Promise((resolve, reject) => {
    const oscript = document.createElement('script')
    oscript.src = url
    document.head.appendChild(oscript)
    oscript.onload = function() {
      resolve({ code: 0, message: '加载完成' })
    }
    oscript.onerror = function() {
      reject({ code: -1, message: '加载失败' })
    }
  })
}

const loadCity = loadJs(`//s1.xmcdn.com/yx/common-sdk/last/lib/city.js?v=1`)

const getUserInfo = () => {
  return API.auth.userInfo()
}

const render = C => {
  ReactDOM.render(
    <>
      <Helmet>
        <title>喜马拉雅商户平台</title>
      </Helmet>
      <C />
    </>,
    document.getElementById('root-app'),
  )
}

Promise.all([loadCity, getUserInfo()])
  .then(res => {
    const userRes: any = res[1]
    if (userRes && userRes.opsId) {
      window.merchant.userinfo = userRes
      //获取权限
      API.auth
        .permissionList()
        .then(r => {
          if (AJAX_STATUS.SUCCESS === r.code) {
            window.merchant.permissions = r.data || []
          }
          render(App)
        })
        .catch(() => {
          render(App)
        })
    } else {
      render(App)
    }
  })
  .catch(e => {
    throw new Error(e.message)
  })

declare let window: Window & {
  merchant: {
    userinfo: any
    permissions: string[]
  }
}
