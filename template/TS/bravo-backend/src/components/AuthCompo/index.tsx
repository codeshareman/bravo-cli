import React, { FC } from 'react'
import { authStore } from '@/models'
import { AuthType } from './type'

type P = {
  type?: AuthType
  scope: string
}

const AuthCompo: FC<P> = ({ scope, type = AuthType.ACTION, children }) => {
  const { permissions } = authStore
  const key = type === AuthType.ROLE ? `ROLE_${scope}` : `SCOPE_${scope}`
  const authorized = permissions.includes(key)
  return authorized ? <>{children}</> : null
}

export default AuthCompo
