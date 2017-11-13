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
  .el-input {
    /*margin-top: 10px;*/
    font-size: 22px;
  }
  .el-button {
    /*margin-top: 10px;*/
    font-size: 22px;
    width: 100%;
  }
  .el-form-item__error {
    font-size: 17px;
    color: #ffda00;
  }
  @media screen and (min-height: 740px) {
    body {
      padding-top: 150px;
    }
  }
  .el-message__content {
    font-size: 17px;
  }
</style>
