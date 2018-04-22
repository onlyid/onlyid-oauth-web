const install = (Vue) => {
  Vue.prototype.$logStats = async (client, mobile, type, success) => {
    try {
      await window.vue.$axios.post('/statistics', {
        client,
        mobile,
        type,
        success
      })
    } catch (err) {
      console.error(err)
    }
  }
}

export default install
