<template>
  <div id="content">
    <div class="logo"></div>
    <p style="font-size: 2rem">简单、可信赖的手机号验证服务</p>
    <p style="" class="color-note">我们为app和网站提供简单、可信赖的手机号验证服务。开发者无需关心发送短信、比对验证码等细节，轻松获取用户手机号。可广泛应用于短信验证码登录、三方登录绑定手机号等场景。</p>
    <div class="advantage">
      <i class="material-icons advantage-image" id="developer_mode">developer_mode</i>
      <p class="advantage-title">极简API，半小时闪电接入</p>
    </div>
    <div class="advantage">
      <i class="material-icons advantage-image" id="security">security</i>
      <p class="advantage-title">银行级团队为安全保驾护航</p>
    </div>
    <div class="advantage">
      <i class="material-icons advantage-image" id="textsms">textsms</i>
      <p class="advantage-title">不限量验证短信任性发</p>
    </div>
    <p style="margin-top: 30px">了解更多请访问onlyid.net</p>
    <el-button @click="back" type="primary" style="margin-top: 20px">返回</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      back () {
        this.$router.back()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #content {
    text-align: left;
    font-size: 1.4rem;
  }
  .advantage-image {
    float: left;
    font-size: 35px;
    margin: 0 20px 0 -0.6rem;
  }
  .advantage {
    margin-top: 25px;
  }
  .advantage-title {
    font-size: 1.6rem;
    padding-top: 5px;
    white-space: nowrap;
  }
  #textsms {
    color: #67C23A;
  }
  #security {
    color: #F56C6C;
  }
  #developer_mode {
    color: #409EFF;
  }
</style>
