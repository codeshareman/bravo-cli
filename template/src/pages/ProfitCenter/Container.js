import React, { Component } from "react";
import { connect } from "react-redux";

// UI Components
import ProfitCenter from "@SRC/pages/ProfitCenter/UI";

@connect(
  state => {
    return state;
  },
  dispatch => {
    return {
    };
  }
)
export default class extends Component {
  state = {};
  componentDidMount = async () => {
  };

  render() {
    return (
        <ProfitCenter />
    );
  }
}
