const path = require('path')

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://static.onlyid.net/onlyid-oauth/' : '/',
  outputDir: path.join(__dirname, '../dist/onlyid-static/onlyid-oauth'),
  indexPath: path.join(__dirname, '../dist/index/onlyid-oauth.html'),
  devServer: {
    port: 8081,
    disableHostCheck: true
  },
  configureWebpack (config) {
  }
}
