/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-26 09:36:34
 * @LastEditTime: 2019-08-29 12:39:57
 * @LastEditors: Please set LastEditors
 */
import {
  ContenDimensionType,
  VisitDimensionType,
  TimeDimensionType,
  ActionDimensionType,
  OptionTypes,
  RegionDimensionType
} from "./enums";
import { StatisticalType } from "../../../../../../client/service/DashboardService2";

// 图书馆排行榜筛选项
export const LibRankList: OptionTypes[] = [
  {
    key: 0,
    title: "区域维度",
    field: "regionType",
    defalutVal: RegionDimensionType.COUNTRY,
    disabled: true,
    options: [
      {
        label: "全国",
        value: RegionDimensionType.COUNTRY
      },
      {
        label: "我的",
        value: RegionDimensionType.MINE
      }
    ]
  },
  {
    key: 1,
    title: "访问维度",
    field: "libVisitDis",
    defalutVal: VisitDimensionType.PV,
    options: [
      {
        label: "PV",
        value: VisitDimensionType.PV
      },
      {
        label: "UV",
        value: VisitDimensionType.UV
      },
      {
        label: "销售额",
        value: VisitDimensionType.SALES
      }
    ]
  },
  {
    key: 2,
    title: "时间维度",
    field: "statisticalType",
    defalutVal: StatisticalType.DAY,
    options: [
      {
        label: "昨日",
        value: StatisticalType.DAY
      },
      {
        label: "周",
        value: StatisticalType.WEEK
      },
      {
        label: "月",
        value: StatisticalType.MONTH
      },
      {
        label: "汇总",
        value: StatisticalType.TOTAL
      }
    ]
  }
];

// 图书馆内容排行榜筛选项
export const LibContenRankList = [
  {
    key: 0,
    title: "区域维度",
    field: "regionType",
    defalutVal: RegionDimensionType.COUNTRY,
    disabled: true,
    options: [
      {
        label: "全国",
        value: RegionDimensionType.COUNTRY
      },
      {
        label: "我的",
        value: RegionDimensionType.MINE
      }
    ]
  },
  {
    key: 1,
    title: "内容维度",
    field: "resourceType",
    defalutVal: ContenDimensionType.SOUND,
    options: [
      {
        label: "声音",
        value: ContenDimensionType.SOUND
      },
      {
        label: "专辑",
        value: ContenDimensionType.ALBUM
      }
    ]
  },
  {
    key: 2,
    title: "行为维度",
    field: "libContenActionDis",
    defalutVal: ActionDimensionType.PLAYCOUNT,
    options: [
      {
        label: "播放量",
        value: ActionDimensionType.PLAYCOUNT
      },
      {
        label: "销售额",
        value: ActionDimensionType.SALE
      }
    ]
  },
  {
    key: 3,
    title: "时间维度",
    field: "statisticalType",
    defalutVal: StatisticalType.DAY,
    options: [
      {
        label: "昨日",
        value: StatisticalType.DAY
      },
      {
        label: "周",
        value: StatisticalType.WEEK
      },
      {
        label: "月",
        value: StatisticalType.MONTH
      },
      {
        label: "汇总",
        value: StatisticalType.TOTAL
      }
    ]
  }
];
