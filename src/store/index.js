import Vue from 'vue'
import Vuex from 'vuex'
//* as 语法 可通过 action.xxx 取到想要的值
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
//检测state的修改过程并打印前后值
import createLogger from 'vuex/dist/logger'


Vue.use(Vuex)
 
//检测state的修改是否来源于mutations
const debug = process.env.NODE_ENV !== 'production'

//导出一个实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict:debug,
  plugins: debug ? [createLogger()] : []
})