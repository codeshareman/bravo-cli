import React, { FC } from 'react'
import { Route } from 'react-router-dom'
import Page403 from '@/pages/exception/403'
import Page404 from '@/pages/exception/404'

type P = {}

const ExceptionRoute: FC<P> = () => {
  return (
    <>
      <Route exact component={Page403} />
      <Route exact path="/exception/404" component={Page404} />
    </>
  )
}

export default ExceptionRoute
