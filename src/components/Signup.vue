<template>
  <div>
    <el-button style="margin-top: 5px" icon="el-icon-edit" type="text" @click="$router.back()">{{ mobile }}</el-button>
    <div style="margin-top: 15px">
      <sms-code-input :mobile="mobile" v-model="form.smsCode"/>
      <p class="note color-note">设置密码，方便下次使用（可选）</p>
      <input type="text" :value="mobile" v-show="false"/>
      <password-input v-model="form.password" auto-complete="new-password"/>
      <el-button type="primary" @click="submit" style="margin-top: 20px;">
        <template v-if="scene === 'login'">登 录</template>
        <template v-else-if="scene === 'bind'">绑 定</template>
        <template v-else-if="scene === 'change'">更 换</template>
        <template v-else-if="scene === 'auth'">验 证</template>
      </el-button>
    </div>
  </div>
</template>

<script>
  import SmsCodeInput from './SmsCodeInput.vue'
  import PasswordInput from './PasswordInput.vue'
  import config from '../config'

  export default {
    components: {
      SmsCodeInput,
      PasswordInput
    },
    data () {
      return {
        mobile: this.$route.params.mobile,
        form: {
          smsCode: '',
          password: ''
        },
        scene: ''
      }
    },
    methods: {
      async submit () {
        const params = this.$route.params
        try {
          const body = {
            mobile: this.mobile,
            password: this.form.password,
            smsCode: this.form.smsCode
          }
          await this.$axios.post('/signup', body)
          await this.$logStats(params.clientId, 'signup', true)
          // 注册成功，请求code
          location.assign(config.authorizeUrl + '&client_id=' + params.clientId + '&state=' + params.state +
            '&redirect_uri=' + encodeURIComponent(params.redirectUri))
        } catch (err) {
          console.error(err)
          await this.$logStats(params.clientId, 'signup', false)
        }
      }
    },
    mounted () {
      this.scene = this.$route.params.scene
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
