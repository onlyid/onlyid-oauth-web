'use strict'

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style.css'
import App from './App'
import router from './router'
import { init } from './util'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)

init()

window.vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
