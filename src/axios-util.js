'use strict'

import axios from 'axios'

function install (Vue) {
  // 初始化oauth的
  let instance = axios.create({
    baseURL: 'http://oauth.onlyid.net:3001',
    withCredentials: true
  })

  instance.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.data.code !== 0) {
      Vue.prototype.$message.error(response.data.message)
      return Promise.reject(new Error(JSON.stringify(response.data)))
    }
    return response
  }, function (error) {
    // Do something with response error
    Vue.prototype.$message.error(error.message)
    return Promise.reject(error)
  })

  Vue.prototype.$axiosOAuth = instance

  // 初始化onlyID的
  instance = axios.create({
    baseURL: 'http://onlyid.net:3000'
  })

  instance.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.data.code !== 0) {
      Vue.prototype.$message.error(response.data.message)
      return Promise.reject(new Error(JSON.stringify(response.data)))
    }
    return response
  }, function (error) {
    // Do something with response error
    Vue.prototype.$message.error(error.message)
    return Promise.reject(error)
  })

  Vue.prototype.$axios = instance
}

export default install
