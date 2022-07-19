import Vue from 'vue'
import Vuex from 'vuex'

// Vuex持久化插件
import common from './common/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common
  }
})
