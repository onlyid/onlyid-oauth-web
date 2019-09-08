<template>
  <div id="content">
    <p style="font-size: 2rem; text-align: center">
      <img src="../assets/logo.png"
           width="66"
           style="vertical-align: -25%" />开源账号</p>
    <div style="color: #7f7f7f;">
      <p>欢迎使用唯ID，我是项目发起人ltb，前招行Java工程师，现为平安高级Web开发工程师。</p>
      <p>我一直坚信：<span class="emphasize">账号和言论自由、互联网安全一样，是人们的基本权利</span>，所以我在<span class="emphasize">2017年6月12日</span>发起了唯ID项目。</p>
      <p>唯ID是通用的账号和认证平台，用户只需要在一个接入唯ID的应用注册，即可在所有应用使用。</p>
    </div>
    <div class="advantage">
      <i class="material-icons advantage-image"
         id="developer_mode">developer_mode</i>
      <p class="advantage-title">极简API，半小时闪电接入</p>
    </div>
    <div class="advantage">
      <i class="iconfont advantage-image"
         id="github">&#xe6f6;</i>
      <p class="advantage-title">开源、自由，采用GPLv3协议，托管在
        <a href="https://github.com/lltb"
           target="_blank">github</a></p>
    </div>
    <div class="advantage">
      <i class="material-icons advantage-image"
         id="textsms">textsms</i>
      <p class="advantage-title">不限量验证短信任性发</p>
    </div>
    <p style="margin-top: 30px; font-size: 1.4rem">了解更多请访问
      <a href="https://www.onlyid.net"
         target="_blank">www.onlyid.net</a></p>
    <el-button @click="$router.back()"
               type="primary"
               style="margin-top: 20px">返 回</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
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
  width: 35px;
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
  color: #67c23a;
}
#github {
  color: #333;
  font-size: 28px;
  margin-left: 2px;
  margin-top: 10px;
}
#developer_mode {
  color: #409eff;
}
.emphasize {
  color: black;
}
</style>
