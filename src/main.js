'use strict'

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style.css'
import App from './App'
import router from './router'
import { VueBus, Focus } from 'onlyid-web-common'
import AxiosUtil from './axios-util'
import StatsPlugin from './stats-plugin'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueBus)
Vue.use(AxiosUtil)
Vue.use(Focus)
Vue.use(StatsPlugin)

window.vue = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
