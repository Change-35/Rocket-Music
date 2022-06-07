import fastclick from 'fastclick'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueLazyLoad,{
  loading:require('./common/image/default.png')
})


import './common/css/index.css'

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
