<template>
  <div>
    <!--<el-button type="primary" style="font-size: 16px; margin-top: 150px">手机号登录</el-button>-->

    <!--<div class="step-complete">-->
      <!--<i class="el-icon-success"></i>-->
    <!--</div>-->
    <!--<p style="font-size: 1.6rem">登录成功</p>-->
    <!--<p style="font-size: 1.4rem; color: #7f7f7f">获取手机号18512345678</p>-->

    <!--<img src="../assets/shouji-dun.png" width="61" style="margin-top: 60px"/>-->
    <!--<p style="font-size: 1.4rem; color: #7f7f7f;">为了您的账号安全，请绑定手机哦</p>-->
    <!--<el-button type="primary" style="font-size: 16px;">绑定手机号</el-button>-->

    <p style="font-size: 1.8rem; margin-top: 80px">更换手机号</p>
    <p style="font-size: 1.4rem; color: #7f7f7f;">更换绑定的手机号，之后可以用新手机号登录</p>
    <el-button type="primary" style="font-size: 16px;">验证新手机号</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .step-complete {
    color: #0be1f4;
    font-size: 50px;
    margin-top: 70px;
  }
</style>
