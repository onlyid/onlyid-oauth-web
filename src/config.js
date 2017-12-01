'use strict'

const prod = {
  authorizeUrl: 'https://oauth.onlyid.net/authorize?response_type=code',
  baseUrl: 'https://oauth.onlyid.net'
}

const dev = {
  authorizeUrl: 'http://oauth.onlyid.net:3001/authorize?response_type=code',
  baseUrl: 'http://oauth.onlyid.net:3001'
}

if (process.env.NODE_ENV !== 'production') {
  for (let k in dev) {
    prod[k] = dev[k]
  }
}
export default prod
