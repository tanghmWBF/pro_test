/*
 * @Author: hejp
 * @Date:   11:38
 * @Last Modified by:   hejp
 * @Last Modified time: 11:38
 */
export function fmtDate (date, fmt) {
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 获取url参数
 * @param name
 * @returns {any}
 */
export function getUrlParam (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let result = window.location.search.substr(1).match(reg)
  // let result = window.location.href.split('?')[1].match(reg)
  return result ? decodeURIComponent(result[2]) : null
}

/**
 * 获取参数值
 * @param name
 * @returns {any}
 */
export function getUrl (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let result = window.location.hash.split('/&')[1].substr(1).match(reg)
  return result ? decodeURIComponent(result[2]) : null
}

export default {
  fmtDate,
  getUrlParam,
  getUrl
}
