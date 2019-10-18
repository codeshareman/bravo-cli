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

export default {
  dowloadImage,
  drawSvgtoImgUrl
};
