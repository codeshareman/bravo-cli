import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import HeaderView from './HeaderView'
import ContentView from './ContentView'

type P = RouteComponentProps & {}
type S = {}

class MainLayout extends React.Component<P, S> {
  render() {
    return (
      <>
        <HeaderView />
        <ContentView>{this.props.children}</ContentView>
        {/* <FooterView /> */}
      </>
    )
  }
}

export default withRouter(MainLayout)
