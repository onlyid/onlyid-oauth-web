const install = (Vue) => {
  Vue.prototype.$logStats = async (client, type, success) => {
    try {
      await window.vue.$axios.post('/stats', {client, type, success})
    } catch (err) {
      console.error(err)
    }
  }
}

export default install
