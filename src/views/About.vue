<template>
  <div id="content">
    <p style="font-size: 2rem; text-align: center"><img src="../assets/logo.png" width="66" style="vertical-align: -25%"/>开源账号</p>
    <p style="color: #7f7f7f;">我们为app和网站提供手机账号服务。开发者不用开通短信，轻松获取用户手机号。广泛应用于手机号登录、三方登录绑定手机等场景。</p>
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
    <p style="margin-top: 30px; font-size: 1.4rem">了解更多请访问 <a href="https://onlyid.net" target="_blank">onlyid.net</a></p>
    <el-button @click="$router.back()" type="primary" style="margin-top: 20px">返 回</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #content {
    text-align: left;
    font-size: 1.5rem;
  }
  .advantage-image {
    float: left;
    font-size: 35px;
    margin-right: 20px;
  }
  .advantage {
    width: 260px;
    margin: 25px auto 0;
  }
  .advantage-title {
    font-size: 1.6rem;
    padding-top: 5px;
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
