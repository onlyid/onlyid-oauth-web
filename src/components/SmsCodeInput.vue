<template>
  <el-input placeholder="请填写验证码" v-model="smsCode" type="tel" ref="smsCode">
    <el-button slot="suffix" type="text" @click="sendSmsCode" style="padding-right: 5px; font-size: 1.4rem; margin-top: 1px" :disabled="sent">
      {{sent ? countDown + '秒后重试' : '发送验证码'}}</el-button>
    <template slot="prepend">验证码</template>
  </el-input>
</template>

<script>
export default {
  props: ['value', 'mobile'],
  data () {
    return {
      sent: false,
      countDown: 60
    }
  },
  methods: {
    async sendSmsCode () {
      try {
        await this.$axios.post('/sms-code/send', { mobile: this.mobile, client: this.$route.params.clientId })

        this.$refs.smsCode.focus()

        this.countDown = 60
        this.sent = true
        const h = setInterval(() => {
          this.countDown--
          if (this.countDown === 0) {
            clearInterval(h)
            this.sent = false
          }
        }, 1000)
      } catch (err) {
        console.error(err)
      }
    }
  },
  computed: {
    smsCode: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  created () {
    // this.sendSmsCode()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
