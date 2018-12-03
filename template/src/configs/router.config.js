import { BrcoccoliChart, BroccoliForm } from "./component.config";

const BASE_PATH = "/wws-b/v2/broccoli";
const MENU = [
  {
    id: 1,
    sort: 1,
    title: "",
    name: "entry",
    path: '/',
    redirectPath: '/chart',
  },
  {
    id: 2,
    sort: 3,
    title: "可视化图表库",
    name: "broccoli_chart",
    isExact: true,
    path: "/chart",
    component: BrcoccoliChart.AllCharts,
    children: [
      {
        title: "柱形图",
        name: "Bar",
        path: "/charts/bar",
        component: BrcoccoliChart.BarChart
      },
      { title: "饼图", name: "Pie", path: "/charts/pie", component: "" }
    ]
  },
  {
    id: 3,
    sort: 3,
    title: "分步表单",
    name: "step_form",
    isExact: true,
    path: "/step/:step",
    component: BroccoliForm.StepForm,
    children: [
      {
        title: "步骤1",
        name: "step_1",
        path: "/step/1",
        component: BroccoliForm.StepForm1
      },
      {
        title: "步骤2",
        name: "step_2",
        path: "/step/2",
        component: BroccoliForm.StepForm2
      }
    ]
  }
];

export { BASE_PATH, MENU };
