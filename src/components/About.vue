<template>
  <div id="content">
    <p>唯一ID是全球首家账号服务商，为app和网站提供免费、共享的短信验证码登录服务。</p>
    <div class="gradient-hr"></div>
    <p>了解更多请访问onlyid.net</p>
    <el-button @click="back" type="primary" style="margin-top: 30px">好</el-button>
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
  }
</style>
