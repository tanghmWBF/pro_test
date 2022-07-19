import { get } from './fetch'

export default {
  /**
   * 表格获取数据
   */
  getModelData (api, params) {
    const region = window.global_config.BASE_REGION
    const regionObj = {}
    if (region) { regionObj.region = region }
    if (api.indexOf('region=') === -1) { Object.assign(params, regionObj) }
    return get(api, params)
  }
}
