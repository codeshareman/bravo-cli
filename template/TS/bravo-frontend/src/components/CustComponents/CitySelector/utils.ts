import { cityData, hotCityData } from "./city";

const PinYinList = [
  "热门城市",
  "A B C",
  "D E F G",
  "H I",
  "J K",
  "L M N",
  "O P Q R",
  "S T U",
  "V W X",
  "Y Z",
  "所有城市"
];

// 根据城市首字母获取地区数据
export const getDictDataByFirstLetter = (type: string) => {
  let dictData = {};

  if (typeof type !== "string") return [];
  cityData.forEach(() => {
    const typeStr = type.replace(/\s+/g, '');
    if (typeStr === '所有城市') {
      dictData[type] = cityData;
    } else if (typeStr === '热门城市') {
      dictData[type] = hotCityData;
    } else {
      const dictTypeData = cityData.filter(item => {
        let cityItem = Object.assign({}, item);
        if (item.name === '广州市') {
          cityItem = {
            ...item,
            group: 'G',
            pinyin: 'guang zhou shi',
          };
        }
        return ~typeStr.indexOf(cityItem.group) && item.name !== '县';
      });
      dictData[type] = dictTypeData;
    }
  });
  return dictData;
};

export const getDictInfoByCode = (code: number | string) => {
  let dictInfo = { name: "" };

  if (typeof code !== "number" && typeof code !== "string") return dictInfo;

  return cityData.find(item => {
    const cityCode = item.code;
    return ~~code === ~~cityCode;
  });
};
