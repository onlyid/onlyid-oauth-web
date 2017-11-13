'use strict'

function install (Vue) {
  const bus = new Vue()
  Vue.prototype.$bus = bus
}

export default install
