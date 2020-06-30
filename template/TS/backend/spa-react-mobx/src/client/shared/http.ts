import axios, { AxiosInstance, AxiosPromise } from 'axios'

/**
 * 说明：这里是公用http.ts, ximall的http.ts是定制的
 *
 */

export const lift = <T>(response: AxiosPromise<T>): Promise<T> => response.then(it => it.data)

export const createHttp = (baseURL: string) => axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  withCredentials: true,
})

export const useLoggerInterceptor = (http: AxiosInstance) => http.interceptors.request.use(r => {

  const contentType = (r.headers || {})['Content-Type']

  const bodyString = r.data ? JSON.stringify(r.data || {}, null, '  ') : ''
  console.log([
    `${r.method!!.toUpperCase()} ${r.baseURL}${r.url}`,
    `Content-Type: ${contentType}`,
    '',
    bodyString].join('\n'))
  return r
})

export default createHttp