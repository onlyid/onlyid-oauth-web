'use strict'

import axios from 'axios'
import config from './config'

function install (Vue) {
  const interceptRes = (response) => {
    if (response.data.code !== 0) {
      let message = response.data.message
      if (message.constructor === {}.constructor) {
        message = JSON.stringify(message)
      }
      window.vue.$message.error(message)
      return Promise.reject(new Error(JSON.stringify(response.data)))
    }
    return response
  }

  const interceptErr = (error) => {
    window.vue.$message.error(error.message)
    return Promise.reject(error)
  }

  const instance = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true
  })
  instance.interceptors.response.use(interceptRes, interceptErr)
  Vue.prototype.$axios = instance
}

export default install
