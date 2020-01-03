import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import HeaderView from "./HeaderView";
import FooterView from "./FooterView";

type P = RouteComponentProps & {
  hideMenu?: boolean;
};
type S = {};

class MainLayout extends React.Component<P, S> {
  render() {
    const { hideMenu } = this.props;
    return (
      <>
        <HeaderView hideMenu={hideMenu} />
        <div
          className="main-content"
          style={hideMenu ? { backgroundColor: "#fff" } : {}}
        >
          {this.props.children}
        </div>
        <FooterView />
      </>
    );
  }
}

export default withRouter(MainLayout);
