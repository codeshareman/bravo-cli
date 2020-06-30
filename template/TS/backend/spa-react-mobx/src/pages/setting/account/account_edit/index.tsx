import React, { FC, useState, useEffect } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { Form, Input, Select, Button, message } from 'antd'
import FormItemDecorator from '@/components/FormItemDecorator'
import { FormComponentProps } from 'antd/lib/form'
import API from '@/api'

import './index.scss'
import { CustBreadcrumb } from '@/components/CustComponents'
import { AJAX_STATUS } from '@/shared/common/constants'
import { BackendAccountUpdateReq } from '@xmly/cbp-spec/lib/portal/service/oss/BackendAccountService'

const { Option } = Select

type P = FormComponentProps & {}

const AccountEdit: FC<P> = props => {
  const { form } = props
  const history = useHistory()
  const match: any = useRouteMatch()
  const isEdit = match.params && match.params.uid
  const [loading, setLoading] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const routes = [
    { path: 'setting/account', name: '用户管理' },
    { path: '', name: '编辑用户角色' },
  ]
  const wrapperCol = {
    xs: 12,
    sm: 4,
    lg: 10,
    xl: 8,
    xxl: 5,
  }

  useEffect(() => {
    getOpsRoleList()
    getUserInfo()
  }, [])

  const onSubmit = () => {
    form.validateFieldsAndScroll((err, values) => {
      const userId = match.params.uid
      const params = {
        userId,
        roles: values.roles,
      }
      if (!err) {
        saveUserInfo(params)
      }
    })
  }

  // 获取ops用户角色列表
  const getOpsRoleList = async () => {
    const res = await API.userManage.roles()

    if (res.code === AJAX_STATUS.SUCCESS) {
      setRoleList(res.data)
    } else {
      message.error(res.message)
    }
  }

  const getUserInfo = async () => {
    const uid = match.params.uid
    const res = await API.userManage.detail(uid)

    if (res.code === AJAX_STATUS.SUCCESS) {
      setUserInfo(res.data)
    } else {
      message.error(res.message)
    }
  }

  const saveUserInfo = async (params: BackendAccountUpdateReq) => {
    setLoading(true)
    const res = await API.userManage.update(params)
    try {
      if (res.code === AJAX_STATUS.SUCCESS) {
        message.success('保存成功')
        setLoading(false)
        history.push('/setting/account')
      } else {
        message.error(res.message)
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  const defaultRoles = userInfo ? Object.keys(userInfo.roles) : []

  return (
    <div className="account-edit">
      <CustBreadcrumb routes={routes} />
      <h2 className="first-title">{isEdit ? '编辑用户角色' : '新增用户角色'}</h2>
      <Form>
        <FormItemDecorator
          required
          form={form}
          label="OPS用户名"
          field="opsName"
          wrapperCol={wrapperCol}
          options={{
            initialValue: userInfo && userInfo.userName,
            rules: [
              {
                required: true,
                message: '你还未输入OPS用户名',
              },
            ],
          }}
        >
          <Input disabled placeholder="请输入OPS用户名" />
        </FormItemDecorator>
        <FormItemDecorator
          required
          form={form}
          label="真实姓名"
          field="realName"
          wrapperCol={wrapperCol}
          options={{
            initialValue: userInfo && (userInfo.realName || userInfo.userName),
            rules: [
              {
                required: true,
                message: '你还未输入真实姓名',
              },
            ],
          }}
        >
          <Input disabled placeholder="请输入真实姓名" />
        </FormItemDecorator>
        <FormItemDecorator
          required
          form={form}
          label="角色"
          field="roles"
          wrapperCol={wrapperCol}
          options={{
            initialValue: defaultRoles,
            rules: [
              {
                required: true,
                message: '你还未选择角色',
              },
            ],
          }}
        >
          <Select mode="multiple" placeholder="请选择角色">
            {roleList &&
              roleList.map(item => {
                return (
                  <Option key={item.id} value={item.name}>
                    {item.description}
                  </Option>
                )
              })}
          </Select>
        </FormItemDecorator>
        {/* <FormItemDecorator
          required
          form={form}
          label="负责地区"
          field="manageArea"
          wrapperCol={wrapperCol}
          options={{
            rules: [
              {
                required: true,
                message: '你还未选择负责地区',
              },
            ],
          }}
        >
          <CustAreaSelect
            form={form}
            fieldName="manageArea"
            fieldType="box"
            type={selectAreaType.MULTI}
            onSubmit={onSubmit}
          />
        </FormItemDecorator> */}
        <div className="action-group">
          <Button type="primary" onClick={onSubmit} loading={loading}>
            保存
          </Button>
          <Button>取消</Button>
        </div>
      </Form>
    </div>
  )
}

export default Form.create()(AccountEdit)
