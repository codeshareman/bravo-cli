import React, { Component } from "react";
import { connect } from "react-redux";
// UI Components
import ChartLayout from "@/pages/BroccoliChart/UI";

@connect(
  state => {
    return state;
  },
  dispatch => {
    return {
      getRandomPoetry() {
        dispatch({
          type: "GET_RANDOM_POETRY",
          name: "lufei"
        });
      }
    };
  }
)
export default class extends Component {
  state = {};
  componentDidMount = async() => {
    this.props.getRandomPoetry();
  }

  render() {
    return <ChartLayout />;
  }
}
