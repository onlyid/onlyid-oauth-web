<template>
  <div>
    <el-button style="margin-top: 15px" icon="el-icon-edit" type="text" @click="$router.back()">{{ mobile }}</el-button>
    <div style="margin-top: 15px">
      <password-input v-model="form.password" @keyup.native.enter="submit" v-if="loginType === 'password'" ref="password"/>
      <sms-code-input :mobile="mobile" v-model="form.smsCode" @keyup.native.enter="submit" v-else/>
      <el-button type="primary" @click="submit" style="margin-top: 20px;" :disabled="state.disabled">
        <template v-if="scene === 'login'">登 录</template>
        <template v-else-if="scene === 'bind'">绑 定</template>
        <template v-else-if="scene === 'change'">更 换</template>
        <template v-else-if="scene === 'auth'">验 证</template>
      </el-button>
    </div>
    <div style="margin-top: 30px">
      <el-button @click="toggleLogin" size="medium" round class="small-button">{{ toggleLoginText }}</el-button>
      <el-button @click="resetPassword" size="medium" round class="small-button">重设密码</el-button>
    </div>
  </div>
</template>

<script>
import SmsCodeInput from '../components/SmsCodeInput.vue'
import PasswordInput from '../components/PasswordInput.vue'
import config from '../config'

export default {
  components: { SmsCodeInput, PasswordInput },
  data () {
    return {
      loginType: 'password',
      mobile: this.$route.params.mobile,
      form: {
        password: '',
        smsCode: ''
      },
      scene: ''
    }
  },
  computed: {
    toggleLoginText () {
      return this.loginType === 'password' ? '短信验证' : '密码验证'
    },
    state () {
      return this.$store.state
    }
  },
  methods: {
    toggleLogin () {
      this.loginType = this.loginType === 'password' ? 'smsCode' : 'password'
      this.form.password = ''
      this.form.smsCode = ''
    },
    async submit () {
      const params = this.$route.params
      try {
        const body = { mobile: this.mobile }
        if (this.loginType === 'password') {
          body.password = this.form.password
        } else {
          body.smsCode = this.form.smsCode
        }
        await this.$axios.post('/login', body)
        await this.$logStats(params.clientId, 'login', true)
        // 登录成功，请求code
        const body1 = { clientId: params.clientId, mobile: this.mobile }
        const { data: { authorizationCode } } = await this.$axios.post(config.authorizeUrl, body1)
        let url = params.redirectUri + '?code=' + authorizationCode
        if (params.state !== 'empty') url += '&state=' + params.state

        location.assign(url)
      } catch (err) {
        console.error(err)
        await this.$logStats(params.clientId, 'login', false)
      }
    },
    resetPassword () {
      const params = this.$route.params
      // encode是必须的 否则跳到下个路由url又变回没转义的了
      this.$router.push('/reset-password/' + params.mobile + '/' + params.clientId + '/' + params.state + '/' +
          encodeURIComponent(params.redirectUri))
    }
  },
  mounted () {
    this.$refs.password.focus()
  },
  created () {
    this.scene = this.$route.params.scene
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
