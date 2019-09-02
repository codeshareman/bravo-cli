/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 06:03:07
 * @LastEditTime: 2019-08-28 11:29:20
 * @LastEditors: Please set LastEditors
 */
// 绘制二维码图标
export const drawSvgtoImgUrl = svgData =>
  "data:image/svg+xml;base64," +
  window.btoa(unescape(encodeURIComponent(svgData)));

// 下载二维码
export const dowloadImage = (
  svgData,
  type = "png",
  imgW = 200,
  imgH = 200,
  canvasW = 300,
  canvasH = 300
) => {
  let image = new Image();
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  const base64Url =
    "data:image/svg+xml;base64," +
    window.btoa(unescape(encodeURIComponent(svgData)));

  image.src = base64Url;
  image.width = imgW;
  image.height = imgH;

  canvas.width = canvasW;
  canvas.height = canvasH;
  ctx.drawImage(image, 0, 0);

  if (type === "png") {
    const downloadUrl = canvas.toDataURL("image/png");
    return downloadUrl;
  } else {
    return base64Url;
  }
};

// 获取地区信息
export const getAreaInfo = (casaderStr: string) => {
  const { provinceArray, citiesArray, areasArray } = window.casader || {
    areasArray: [],
    citiesArray: [],
    provinceArray: []
  };
  try {
    if (casaderStr !== "") {
      let areaArr = casaderStr.split(",");
      const crtProvince =
        areaArr[0] &&
        provinceArray.filter(item => {
          return item.code === areaArr[0];
        });
      const crtCity =
        areaArr[1] &&
        citiesArray.filter(item => {
          return item.code === areaArr[1];
        });

      const crtArea =
        areaArr[2] &&
        areasArray.filter(item => {
          return item.code === areaArr[2];
        });

      if (crtProvince && crtCity && !crtArea) {
        return `${crtProvince[0].name}-${crtCity[0].name}`;
      } else if (crtProvince && !crtCity && !crtArea) {
        return `${crtProvince[0].name}`;
      } else if (!crtProvince && !crtCity && !crtArea) {
        return null;
      } else {
        return `${crtProvince[0].name}-${crtCity[0].name}-${crtArea[0].name}`;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.log(err.message);
  } finally {
  }
};

// 获取级联菜单选项
export const getCasaderData = () => {
  const { provinceArray, citiesArray, areasArray } = window.casader || {
    areasArray: [],
    citiesArray: [],
    provinceArray: []
  };
  let casaderArr = [];
  provinceArray.forEach((item, index) => {
    let itemJson = {
      label: item.name,
      value: item.code,
      children: []
    };
    citiesArray.forEach((cItem, cIndex) => {
      if (cItem.provinceCode === item.code) {
        let cItemJson = {
          label: cItem.name,
          value: cItem.code,
          children: []
        };
        itemJson.children.push(cItemJson);
        areasArray.forEach((aItem, aIndex) => {
          if (aItem.cityCode === cItem.code) {
            let aItemJson = {
              label: aItem.name,
              value: aItem.code
            };
            cItemJson.children.push(aItemJson);
          }
        });
      }
    });
    casaderArr.push(itemJson);
  });
  return casaderArr;
};

// 获取当前环境
export const getEnv = () => {
  const origin = window.location.origin;
  const isTest = ~origin.indexOf("wws.test.ximalaya.com");
  const isUat = ~origin.indexOf("wws.uat.ximalaya.com");
  const isProd = ~origin.indexOf("wws.ximalaya.com");
  if (isTest) {
    return "dev";
  } else if (isUat) {
    return "uat";
  } else if (isProd) {
    return "prod";
  }
};

export const formatDateTime = (timestamp: number, separator = "-") => {
  let date = new Date(timestamp);
  let y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();

  const mStr = m < 10 ? "0" + m : m;
  const dStr = d < 10 ? "0" + d : d;
  const hStr = h < 10 ? "0" + h : h;
  return y + separator + mStr + separator + dStr;
};
// 无缝滚动
export const seamlessScroll = (
  $container: any,
  $origin: any,
  $clone: any,
  interval: number
) => {
  $clone.innerHTML = $origin.innerHTML;
  let timer = setInterval(() => {
    if ($container.scrollTop >= $origin.offsetHeight) {
      $container.scrollTop = 0;
    } else {
      $container.scrollTop++;
    }
  }, interval);

  $container.addEventListener("mouseover", () => {
    clearInterval(timer);
  });

  $container.addEventListener("mouseout", () => {
    timer = setInterval(() => {
      if ($container.scrollTop >= $origin.offsetHeight) {
        $container.scrollTop = 0;
      } else {
        $container.scrollTop++;
      }
    }, interval);
  });
};

declare let window: Window & {
  casader: {
    areasArray: any[];
    citiesArray: any[];
    provinceArray: any[];
  };
};

export default {
  dowloadImage,
  drawSvgtoImgUrl
};
