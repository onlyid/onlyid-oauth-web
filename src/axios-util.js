'use strict'

import axios from 'axios'
import config from './config'

const install = (Vue) => {
  const instance = axios.create({baseURL: config.baseUrl, withCredentials: true})

  instance.interceptors.response.use((res) => { return res }, (err) => {
    let res = err.response
    if (res) {
      window.vue.$message.error(res.data.error)
    } else {
      window.vue.$message.error(err.message)
    }
    return Promise.reject(err)
  })

  Vue.prototype.$axios = instance
}

export default install
