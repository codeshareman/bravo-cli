import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import HeaderView from './HeaderView';
import FooterView from './FooterView';
import ContentView from './ContentView';
import { getMenuDefaultKeyByPath } from '@/router/utils';

type P = RouteComponentProps & {};
type S = {};

class MainLayout extends React.Component<P, S> {
  componentDidMount() {}

  render() {
    return (
      <>
        <HeaderView />
        <ContentView children={this.props.children} />
        {/* <FooterView /> */}
      </>
    );
  }
}

export default withRouter(MainLayout);
