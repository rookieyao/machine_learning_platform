import router from '@/router'
import Axios, { Method, ResponseType, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

interface axiosData {
  url: string
  method: Method
  headers?: any
  json: boolean
  contentType?: string
  data?: any
  params?: any
  timeout?: number
  responseType?: ResponseType
}

const axios = Axios.create({
  // baseURL,
  timeout: 20000
})
// 允许携带cookie
axios.defaults.withCredentials = true
// 请求头信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// 默认使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('accessToken')) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    }
    return config
  },
  (err) => Promise.reject(err)
)
let forbiddenCount = 0
// 响应拦截器
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.data) {
      // const code = err.response.status
      if (err.response.status === 403) {
        ElMessage.error('无权限或权限过期，请重新登录或咨询管理员')
      } else {
        const msg = err.response.data.message ?? err.response.data.detail ?? err.response.data
        if (msg) {
          ElMessage.error(msg)
        }
      }
    } else {
      if (err) {
        ElMessage.error(`${err}`)
      }
    }
    if (err.response.status === 401) {
      // 401无权限自动跳转登录页面
      router.replace('/login')
      localStorage.removeItem('auth')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
    }
    return Promise.reject(err)
  }
)

/** *
 * axios({url,method,content,params,datas})
 *
 * @param {string}  url，(必填)
 * @param {string}  method,默认post
 * @param {boolean} json, content-type类型，(必填)
 * @param {object}  params
 * @param {object}  datas  //token在datas中
 *
 */
export default function request(arr: axiosData) {
  return new Promise<any>((resolve, reject) => {
    axios({
      timeout: arr.timeout === undefined ? 10000 : arr.timeout, // 请求超时时间
      url: arr.url,
      method: arr.method || 'POST',
      headers: {
        'content-type': arr.contentType ? arr.contentType : arr.json ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8',
        // debug 环境使用x-user
        'X-User': localStorage.getItem('username') ?? '',
        'X-Roles': localStorage.getItem('role') ?? '',
        userid: '666'
      },
      params: arr.params || '',
      data: arr.data || '',
      responseType: arr.responseType || 'json'
    })
      .then((response: AxiosResponse<any>) => {
        /**
         * response格式
         *
         * {
          data:{},
          status:200,
          statusText:'OK',//从服务器返回的http状态文本
          headers: {},//响应头信息
          config: {} //`config`是在请求的时候的一些配置信息
        }
         */
        const responseStatus = `${response.status}`
        // 状态码2开头的处理逻辑
        if (responseStatus.charAt(0) === '2') {
          if (response.data.status && response.data.status !== 200) {
            ElMessage({
              type: 'error',
              message: response.data.msg ?? response.data.message
            })
          }
          resolve(response.data)
        } else if (responseStatus === '401') {
          // 如果状态码为401则退出登录
          ElMessage({
            type: 'error',
            message: response.data.msg
          })
          reject(response.data)
        } else {
          ElMessage({
            type: 'error',
            message: response.data.msg
          })
          reject(response.data)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
