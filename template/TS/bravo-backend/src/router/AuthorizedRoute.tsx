import React, { FC } from 'react'
import { IRouteItem } from './config'
import { Route, Redirect } from 'react-router-dom'
import { checkPermissionByPath } from './utils'
import Exception from '@/pages/exception'

type AuthorizedRouteProps = IRouteItem & {}

const AuthorizedRoute: FC<AuthorizedRouteProps> = ({ path, redirect, component: Component, ...rest }) => {
  return (
    <Route
      exact
      {...rest}
      render={props => {
        const { location } = props
        const curPath = location.pathname
        const authorized = checkPermissionByPath(curPath)

        return authorized ? redirect ? <Redirect to={path} /> : <Component {...props} /> : <Exception.page403 />
      }}
    />
  )
}

export default AuthorizedRoute
