/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-26 09:36:34
 * @LastEditTime: 2019-08-29 11:34:11
 * @LastEditors: Please set LastEditors
 */
export enum RegionDimensionType {
  COUNTRY = 1,
  MINE = 2
}

// 访问维度
export enum VisitDimensionType {
  PV = 1,
  UV = 2,
  SALES = 3
}

// 时间维度
export enum TimeDimensionType {
  ALL = -1,
  YESTERDAY = 1,
  WEEK = 2,
  MONTH = 3
}

// 内容维度
export enum ContenDimensionType {
  SOUND = 1,
  ALBUM = 2
}

// 行为维度
export enum ActionDimensionType {
  PLAYCOUNT = 1,
  SALE = 2
}

// 筛选项child类型
export type OptionChildTypes = {
  label: string;
  value: number;
};

// 筛选项类型
export type OptionTypes = {
  key: Number;
  title: string;
  field: string;
  defalutVal: Number;
  disabled?: boolean
  options: OptionChildTypes[];
};
