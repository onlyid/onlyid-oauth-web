'use strict'

export default {
  getUser () {
    return sessionStorage.user
  },
  setUser (user) {
    sessionStorage.user = user
  }
}
