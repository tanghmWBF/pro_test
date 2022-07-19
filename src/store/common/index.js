const GET_REGION = 'GET_REGION'
const GET_PARAMS = 'GET_PARAMS'
const GET_LIST = 'GET_LIST'
// 获取日期参数
function getDate (num) {
  let time = new Date()
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let sm = time.getMonth() + 1
  if (m.toString().length === 1) {
    m = '0' + m
  }
  if (num) {
    if (sm === 12) {
      sm = '01'
      return y + '-' + sm
    } else {
      if (sm < 9) {
        return (y - 1) + '-' + '0' + (sm + 1)
      } else {
        return (y - 1) + '-' + (sm + 1)
      }
    }
  } else {
    return y + '-' + m
  }
}

// state
const state = {
  region: '',
  params: {
    dateType: 'MONTH',
    sdate: getDate(1),
    edate: getDate()
  },
  list: []
}
// getter
const getter = {}
// mutation
const mutations = {
  [GET_REGION] (state, region) {
    state.region = region
  },
  [GET_PARAMS] (state, params) {
    state.params = params
  },
  [GET_LIST] (state, list) {
    state.list = list
  }
}
// actions
const actions = {
  [GET_LIST] ({ state, commit }, item) {
    if (typeof item.index === 'number') {
      let list = state.list
      list[item.index].essentials = item.essentials
      commit('GET_LIST', list)
    } else {
      commit('GET_LIST', item.data)
    }
  }
}
export default {
  namespaced: true,
  state,
  getter,
  mutations,
  actions
}
