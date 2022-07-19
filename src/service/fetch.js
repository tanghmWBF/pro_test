import axios from 'axios'
import config from './config.js'
// import Qs from 'qs'
// import store from '../store/index'
import Toast from '../components/toast/index'
const ENV = process.env.NODE_ENV
let loading = null
let getUrl = null
// 环境切换(开发，正式环境)
if (ENV === 'development') {
  axios.defaults.baseURL = config.development
} else if (ENV === 'production') {
  axios.defaults.baseURL = window.global_config.BASE_URL
}
// 请求超时
axios.defaults.timeout = 60000
// post 请求头设置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // const token = store.state.login.token
    // if (typeof token === 'string' && token !== '') {
    //   config.headers.Authorization = 'Bearer ' + token
    // }
    /* eslint-disable no-new */
    getUrl = config.url
    if (getUrl.indexOf('signalPdf') === -1 && getUrl.indexOf('exportReportPdf') === -1) {
      console.log(123)
      loading = new Toast({
        type: 'loading',
        message: '加载中',
        duration: 60000
      })
    }
    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (getUrl.indexOf('signalPdf') === -1 && getUrl.indexOf('exportReportPdf') === -1) {
      loading.show = false
    }
    if (response.status === 200) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    loading.show = false
    let response = error.response
    if (!response) {
      /* eslint-disable no-new */
      new Toast({
        type: 'error',
        message: '请求超时'
      })
      return Promise.reject(error)
    }
    let code = response.status
    if (code) {
      switch (code) {
        case 401:
          /* eslint-disable no-new */
          new Toast({
            type: 'error',
            message: error.response.data.message
          })
          break
        // token过期
        case 403:
          new Toast({
            type: 'error',
            message: '403'
          })
          break
        // 404请求不存在
        case 404:
          /* eslint-disable no-new */
          new Toast({
            type: 'error',
            message: '请求不存在'
          })
          break
        case 500:
          /* eslint-disable no-new */
          new Toast({
            type: 'error',
            message: '服务器错误'
          })
          break
      }
    }
    return Promise.reject(error)
  }
)
/**
 * get方法
 * @param url [请求的url地址]
 * @param params [请求的参数]
 * @returns {Promise<any>}
 */
export function get (url, params) {
  if (!params) params = {}
  if (!params.region && url.indexOf('region=') === -1) {
    const regionCode = window.global_config.BASE_REGION
    const regionObj = {
      region: regionCode
    }
    Object.assign(params, regionObj)
  }
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
/**
 * post方法
 * @param url [请求的url地址]
 * @param params [请求的参数]
 * @returns {Promise<any>}
 */
export function post (url, params, format) {
  if (!params) params = {}
  if (!params.region && url.indexOf('region=') === -1) {
    const regionCode = window.global_config.BASE_REGION
    const regionObj = {
      region: regionCode
    }
    Object.assign(params, regionObj)
  }
  let p = format && { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data; charset=utf-8' } }
  // let p = format && { responseType: 'blob' }
  return new Promise((resolve, reject) => {
    axios.post(url, format ? params : params, p).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
