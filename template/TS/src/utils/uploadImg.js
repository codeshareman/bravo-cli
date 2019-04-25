import axios from "axios";
const getEnv = function() {
  const host = window.location.hostname;
  let envName = "";
  const envEnum = {
    DEV: "dev",
    UAT: "uat",
    LOCAL: "dev",
    PROD: "prod"
  };
  if (~host.indexOf("test")) {
    envName = "DEV";
  } else if (~host.indexOf("uat")) {
    envName = "UAT";
  } else if (~host.indexOf("localhost")) {
    envName = "LOCAL";
  } else {
    envName = "PROD";
  }
  return envEnum[envName];
};
const urlMap = {
  getClamperToken: "/clamper-token/token",
  mkblk: "/clamper-server/mkblk",
  mkfile: "/clamper-server/mkfile/<%fileSize>/ext/<%ext>",
  mkVideoFile: "/clamper-server/mkfile/video/<%fileSize>/ext/<%ext>",
  getToken: "/wws-shared-web/gateway/upload/clamper-token/token"
};
const clampHost = {
  dev: "//upload.test.ximalaya.com",
  prod: "//upload.ximalaya.com",
  uat: "//upload.uat.ximalaya.com"
};
const tokenHost = {
  dev: "//wws.test.ximalaya.com",
  prod: "//wws.ximalaya.com",
  uat: "//wws.uat.ximalaya.com"
};
const ENV = getEnv();

/**
 * 获取风控token
 * @param {object} param
 * filename   [string] 文件名称
 * fileSize   [number] 文件大小
 * uploadType [number] 上传文件类型
 */
const getToken = function({ filename, fileSize, uploadType }) {
  // return axios.post(url, {
  const url = tokenHost[ENV] + urlMap.getToken;
  // .replace("<%fileName>", filename)
  // .replace("<%fileSize>", fileSize)
  // .replace("<%uploadType>", uploadType)
  // .replace("<%callerType>", 'wws')
  //   const url = tokenHost[ENV] + urlMap.getToken

  // return axios.post(url, {
  //   filename,
  //   fileSize,
  //   uploadType
  // });
  return axios.post(url, null, {
    params: {
      fileName: filename,
      fileSize,
      uploadType,
      callerType: "wws"
    }
  });
};

/**
 * 上传文件
 * @param {object} param
 * token  [string] token
 * file   [blob] 文件二进制
 */
const postMkblk = function({ token, file, onProgress }) {
  const url = clampHost[ENV] + urlMap.mkblk;
  return axios({
    url,
    method: "post",
    headers: {
      "Content-Type": "application/octet-stream",
      Authorization: token,
      "x-clamper-server-ip": ""
    },
    onUploadProgress: ({ total, loaded }) => {
      onProgress &&
        onProgress(
          { percent: Math.round((loaded / total) * 100).toFixed(2) },
          file
        );
    },
    data: file
  });
};
/**
 * 合并文件
 * @param {object} param
 * fileSize   [string] 文件名称
 * ext        [string] 文件后缀
 * token      [string] token
 * serverIp   [string] ip
 * ctx        [string] 块标识
 */
const postMkfile = function({
  uploadType,
  fileSize,
  ext,
  token,
  serverIp,
  ctx
}) {
  let mkfileUrl = uploadType === "video" ? urlMap.mkVideoFile : urlMap.mkfile;
  const url =
    clampHost[ENV] +
    mkfileUrl.replace("<%fileSize>", fileSize).replace("<%ext>", ext);

  return axios({
    url,
    method: "post",
    headers: {
      "Content-Type": "text/plain",
      Authorization: token,
      "x-clamper-server-ip": serverIp
    },
    data: "ctxList=" + ctx
  });
};

/**
 * 创建最终reponse给回调
 */
const createTerminalResponse = ({ filename, uid, fileSize, fileUrl }) => {
  return {
    name: filename,
    status: "done",
    size: fileSize,
    url: fileUrl
  };
};


const onProgress = ({ percent }, file) => {
  console.log("onProgress", `${percent}%`, file.name);
}

/**
 * 
 * @param {*} file 
 * @param {*} onSuccess  成功回调
 */
const uploadImg = async function(file, onSuccess) {
  console.log({ file });

  const fileSize = file.size;
  const filename = file.name;
  const uploadType = "picture";
  const splitArr = file.name.split(".");
  const ext = splitArr[splitArr.length - 1];
  console.log({ filename, fileSize, uploadType, ext });
  try {
    const tokenRes = await getToken({
      filename,
      fileSize,
      uploadType
    });
    console.log({ tokenRes });
    if (tokenRes.data.ret === 0) {
      const token = tokenRes.data.token;
      const mkblkRes = await postMkblk({ token, file, onProgress });
      console.log({mkblkRes})
      if (mkblkRes.data.ret === 0) {
        const { serverIp, ctx } = mkblkRes.data;
        const mkfileRes = await postMkfile({
          uploadType,
          fileSize,
          ext,
          token,
          serverIp,
          ctx
        });
        if (mkfileRes.data.ret === 0) {
          const { fileUrl, callbackData } = mkfileRes.data;
          onSuccess(
            createTerminalResponse({
              filename,
              fileSize,
              fileUrl,
              callbackData
            })
          );
        } else {
          message.warning(mkfileRes.data.msg);
        }
      }
    }
  } catch (error) {
    console.log({ error });
    message.error(error.message);
  }
};

export default uploadImg;
