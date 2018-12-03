import React from "react";
import Loadable from "react-loadable";
import { Spin } from "antd";

// 可视化图表
const BrcoccoliChart = {
  AllCharts: Loadable({
    loader: () => import("@/pages/BroccoliChart/Container"),
    loading() {
      return (
        <Spin tip="loading...">
          <div style={{ minHeight: "200px" }} />
        </Spin>
      );
    }
  }),
  BarChart: Loadable({
    loader: () => import("@/pages/BroccoliChart/Container"),
    loading() {
      return (
        <Spin tip="loading...">
          <div style={{ minHeight: "200px" }} />
        </Spin>
      );
    }
  })
};

// 分步表单
const BroccoliForm = {
  StepForm: Loadable({
    loader: () => import("@/routes/StepForm"),
    loading() {
      return (
        <Spin tip="loading...">
          <div style={{ minHeight: "200px" }} />
        </Spin>
      );
    }
  }),
  StepForm1: Loadable({
    loader: () => import("@/pages/StepForm1"),
    loading() {
      return (
        <Spin tip="loading...">
          <div style={{ minHeight: "200px" }} />
        </Spin>
      );
    }
  }),
  StepForm2: Loadable({
    loader: () => import("@/pages/StepForm2"),
    loading() {
      return (
        <Spin tip="loading...">
          <div style={{ minHeight: "200px" }} />
        </Spin>
      );
    }
  })
};

export { BrcoccoliChart, BroccoliForm };
