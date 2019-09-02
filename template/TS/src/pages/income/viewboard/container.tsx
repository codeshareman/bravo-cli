import * as React from "react";
import ViewBoard from "./UI";
import { MainContent } from "@/layout";

class Container extends React.Component {
  render() {
    return (
      <MainContent
        className="board-conten"
        pageHeader={{
          title: "",
          hidePageHeader: false
        }}
      >
        <div className="vb-wrapper">
          <ViewBoard />
        </div>
      </MainContent>
    );
  }
}

export default Container;
