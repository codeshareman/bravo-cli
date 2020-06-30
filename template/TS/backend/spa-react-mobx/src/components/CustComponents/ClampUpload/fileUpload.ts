import axios from 'axios'
import { message } from 'antd'
import { TokenParams, PostMkfileParams, PostMkblkParmas, TerminalParams } from './clamp'

export const enum UploadType {
  /**
   * 音频 1
   */
  AUDIO = 'audio',
  /**
   * 头像 2
   */
  HEADER = 'header',
  /**
   * 封面 3
   */
  COVER = 'cover',
  /**
   * 专辑封面 7
   */
  ALBUM = 'album',
  /**
   * 任意不裁剪的图片 10
   */
  PICTURE = 'picture',
  /**
   * 视频 42
   */
  VIDEO = 'video',
  /**
   * 文档 46
   */
  DOCUMENTATION = 'documentation',
}

export const enum EnvEnum {
  DEV = 'dev', //开发
  UAT = 'uat', //UAT 环境
  LOCAL = 'dev', //本地开发
  PROD = 'prod', // 生产环境
}

const urlMap = {
  getClamperToken: '/clamper-token/token',
  mkblk: '/clamper-server/mkblk',
  mkfile: '/clamper-server/mkfile/<%fileSize>/ext/<%ext>',
  mkVideoFile: '/clamper-server/mkfile/video/<%fileSize>/ext/<%ext>',
  getToken: '/wws-shared-web/gateway/upload/clamper-token/token',
}
const clampHost = {
  dev: '//upload.test.ximalaya.com',
  prod: '//upload.ximalaya.com',
  uat: '//upload.uat.ximalaya.com',
}
const tokenHost = {
  dev: '//wws.test.ximalaya.com',
  prod: '//wws.ximalaya.com',
  uat: '//wws.uat.ximalaya.com',
}

const getEnv = () => {
  const host = window.location.hostname
  let env = EnvEnum.PROD
  if (~host.indexOf('test')) {
    env = EnvEnum.DEV
  } else if (~host.indexOf('uat')) {
    env = EnvEnum.UAT
  } else if (~host.indexOf('localhost')) {
    env = EnvEnum.LOCAL
  } else {
    env = EnvEnum.PROD
  }
  return env
}

/**
 * 获取风控token
 * @param {object} param
 * filename   [string] 文件名称
 * fileSize   [number] 文件大小
 * uploadType [UploadType] 上传文件类型
 */
const getToken = (tokenParams: TokenParams) => {
  const { filename, fileSize, uploadType } = tokenParams
  const env = getEnv()
  const url = tokenHost[env] + urlMap.getToken
  return axios.post(url, null, {
    params: {
      fileName: filename,
      fileSize,
      uploadType,
      callerType: 'wws',
    },
  })
}

/**
 * 上传文件
 * @param {object} param
 * token  [string] token
 * file   [blob] 文件二进制
 */

const postMkblk = function(postMkblkParmas: PostMkblkParmas) {
  const { token, file, onProgress } = postMkblkParmas
  const env = getEnv()
  const url = clampHost[env] + urlMap.mkblk
  return axios({
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/octet-stream',
      Authorization: token,
      'x-clamper-server-ip': '',
    },
    onUploadProgress: ({ total, loaded }) => {
      onProgress && onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file)
    },
    data: file,
  })
}

/**
 * 合并文件
 * @param {object} param
 * fileSize   [string] 文件名称
 * ext        [string] 文件后缀
 * token      [string] token
 * serverIp   [string] ip
 * ctx        [string] 块标识
 */

const postMkfile = (parmas: PostMkfileParams) => {
  const { uploadType, fileSize, ext, token, serverIp, ctx } = parmas
  const mkfileUrl = uploadType === 'video' ? urlMap.mkVideoFile : urlMap.mkfile
  const env = getEnv()
  const url = clampHost[env] + mkfileUrl.replace('<%fileSize>', fileSize.toString()).replace('<%ext>', ext)

  return axios({
    url,
    method: 'post',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: token,
      'x-clamper-server-ip': serverIp,
    },
    data: 'ctxList=' + ctx,
  })
}

/**
 * 创建最终reponse给回调
 */
const createTerminalResponse = (params: TerminalParams) => {
  const { filename, uid, fileSize, fileUrl } = params
  return {
    name: filename,
    status: 'done',
    uid,
    size: fileSize,
    url: fileUrl,
  }
}

const fileUpload = async ({ data, file, filename, onError, onProgress, onSuccess }) => {
  if (data.limitSize) {
    if (file.size > data.limitSize) {
      message.error('上传的大小超出限制了')
      return
    }
  }
  const fileSize = file.size
  const uid = file.uid
  const fileWholeName = file.name.split('.')
  const ext = fileWholeName[1]
  filename = fileWholeName[0]
  try {
    const tokenRes = await getToken({
      filename,
      fileSize,
      uploadType: data.uploadType,
    })
    if (tokenRes.data.ret === 0) {
      const token = tokenRes.data.token
      const mkblkRes = await postMkblk({ token, file, onProgress })
      if (mkblkRes.data.ret === 0) {
        const { serverIp, ctx } = mkblkRes.data
        const mkfileRes = await postMkfile({
          uploadType: data.uploadType,
          fileSize,
          ext,
          token,
          serverIp,
          ctx,
        })
        if (mkfileRes.data.ret === 0) {
          const { fileUrl, callbackData } = mkfileRes.data
          onSuccess(
            createTerminalResponse({
              filename,
              uid,
              fileSize,
              fileUrl,
              callbackData,
            }),
          )
        } else {
          message.warning(mkfileRes.data.msg)
        }
      }
    }
  } catch (error) {
    onError && onError(error)
  }
  return {
    abort() {
      throw new Error('upload progress is aborted.')
    },
  }
}

export default fileUpload
