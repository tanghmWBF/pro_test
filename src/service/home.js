import { get, post } from './fetch'

export default {
  /**
   * 热度走势分析统计
   * @param params
   * @returns {Promise<any>}
   */
  statHeatTrendAnalyze (params) {
    return get('data/statHeatTrendAnalyze', params)
  },
  /**
   * 获取平台名称
   * @param params
   * @returns {Promise<any>}
   */
  getTitle (params) {
    return get('rest/sysModelController/getTitle', params)
  },
  /**
   * 过字典key获取报告类型、报告状态
   */
  getReportTypeList (params) {
    return get('rest/reportListController/getReportTypeList', params)
  },
  /**
   * 系统模型 列表
   */
  sysModelList (params) {
    return get('rest/sysModelController/sysModelList', params)
  },
  /**
   * 报告列表
   */
  reportList (params) {
    return get('rest/reportListController/reportList', params)
  },
  /**
   * 模版选择
   */
  getTemplateLibType (params) {
    return get('rest/reportListController/getTemplateLibType', params)
  },
  /**
   * 保存报告
   */
  saveOrUpdateReport (params) {
    return post('rest/reportListController/saveOrUpdateReport', params)
  },
  /**
   * 模板库列表
   */
  templateLib (params) {
    return get('rest/reportTemplateController/templateLib', params)
  },
  /**
   * 系统模型树
   */
  getSysModelTree (params) {
    return get('rest/reportTemplateController/getSysModelTree', params)
  },
  /**
   * 保存模版
   */
  saveOrUpdateTemplateLib (params) {
    return post('rest/reportTemplateController/saveOrUpdateTemplateLib', params)
  },
  /**
   * 获取模版详情
   */
  getTemplateLibDetail (params) {
    return get('rest/reportTemplateController/getTemplateLibDetail', params)
  },
  /**
   * 删除模版
   */
  deleteModel (params) {
    return get('rest/reportTemplateController/deleteModel', params)
  },
  /**
   * 删除报告
   */
  deleteReport (params) {
    return get('rest/reportListController/deleteReport', params)
  },
  /**
   * 导出报告
   */
  exportReportPdf (params) {
    return post('rest/reportListController/exportReportPdf', params, true)
  },
  /**
   * 导出报告
   */
  signalPdf (params) {
    return post('rest/reportListController/signalPdf', params)
  }
}
