<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  body {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    background-color: #7f7f7f;
    width: 320px;
    margin: 0 auto;
    color: white;
    text-align: center;
    font-size: 22px;
  }
  #app {
    margin-top: 50px;
  }
  .el-message__content,
  .el-input {
    font-size: 22px;
  }
  .el-button {
    font-size: 22px;
    width: 100%;
  }
  .el-form-item__error {
    font-size: 17px;
    color: #ffda00;
  }
  .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus {
    border-color: #ffda00;
  }
  @media screen and (min-height: 740px) {
    body {
      padding-top: 150px;
    }
  }
  button {
    -webkit-tap-highlight-color: rgba(0,0,0,0); /* ios safari 去掉灰色点击效果 */
  }
  .el-message {
    width: 320px;
    min-width: 320px;
  }
  .el-message__content {
    word-wrap: break-word;
    word-break:break-all;
  }
</style>
