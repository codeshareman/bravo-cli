import * as React from "react";
import { routes } from "@/router";

type P = {};

type S = {
  collapsed: boolean;
};

class ScreenLayout extends React.Component<P, S> {
  state = {
    collapsed: false
  };

  render() {
    return <div className="bs-container">{routes}</div>;
  }
}

export default ScreenLayout;
