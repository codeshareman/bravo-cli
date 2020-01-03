export const hotCityData = [
  {
    code: '11',
    name: '北京市',
    group: 'B',
    pinyin: 'bei jing shi',
  },
  {
    code: '31',
    name: '上海市',
    group: 'S',
    pinyin: 'shang hai shi',
  },
  {
    code: '4401',
    name: '广州市',
    group: 'G',
    pinyin: 'an zhou shi',
  },
  {
    code: '4403',
    name: '深圳市',
    group: 'S',
    pinyin: 'shen zhen shi',
  },
  {
    code: '12',
    name: '天津市',
    group: 'T',
    pinyin: 'tian jin shi',
  },
  {
    code: '6101',
    name: '西安市',
    group: 'X',
    pinyin: 'xi an shi',
  },
  {
    code: '50',
    name: '重庆市',
    group: 'C',
    pinyin: 'chong qing shi',
  },
  {
    code: '3301',
    name: '杭州市',
    group: 'H',
    pinyin: 'hang zhou shi',
  },
  {
    code: '3201',
    name: '南京市',
    group: 'N',
    pinyin: 'nan jing shi',
  },
  {
    code: '4201',
    name: '武汉市',
    group: 'W',
    pinyin: 'wu han shi',
  },
  {
    code: '5101',
    name: '成都市',
    group: 'C',
    pinyin: 'cheng du shi',
  },
];

export const cityData = window.city || [];

declare let window: Window & {
  city: Array<any>;
};
