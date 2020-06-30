export type ColItemType = {
  title: string;
  dataIndex: string;
  key: string;
  render?(curVal: any, index: number, item?: any): any;
};

export enum TreeLevel {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOUR = 4,
}
