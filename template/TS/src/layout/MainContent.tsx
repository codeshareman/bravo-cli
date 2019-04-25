import React, { Component } from "react";
import "./index.scss";

type P = {
  children: React.ReactNode;
};

type S = {};

export default class MainContent extends Component<P, S> {
  render() {
    return (
      <div className="page-container">
        <div className="main-content">{this.props.children}</div>
      </div>
    );
  }
}
