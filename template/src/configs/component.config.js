import React from "react";
import Loadable from "react-loadable";

// 数据看板
const ProfitCenter = {
  MyProfit: Loadable({
    loader: () => import("@SRC/pages/ProfitCenter"),
    loading() {
      return (  
        <div></div>
      );
    }
  })
};

export { ProfitCenter };
