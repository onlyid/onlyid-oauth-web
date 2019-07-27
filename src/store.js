import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    disabled: false
  },
  mutations: {
    disabled (state, val) {
      state.disabled = val
    }
  },
  actions: {

  }
})
