<template>
  <div>
    <el-button style="margin-top: 5px" icon="el-icon-edit" type="text" @click="$router.back()">{{ mobile }}</el-button>
    <div style="margin-top: 15px">
      <input type="text" :value="mobile" v-show="false"/>
      <password-input v-model="form.password" @keyup.native.enter="submit" v-if="loginType === 'password'" ref="password"/>
      <sms-code-input :mobile="mobile" v-model="form.smsCode" @keyup.native.enter="submit" v-else/>
      <el-button type="primary" @click="submit" style="margin-top: 20px;" :disabled="state.disabled">
        <template v-if="scene === 'login'">登 录</template>
        <template v-else-if="scene === 'bind'">绑 定</template>
        <template v-else-if="scene === 'change'">更 换</template>
        <template v-else-if="scene === 'auth'">验 证</template>
      </el-button>
    </div>
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :span="12">
        <el-button @click="toggleLogin" size="medium" round class="small-button">{{ toggleLoginText }}</el-button>
      </el-col>
      <el-col :span="12">
        <el-button @click="resetPassword" size="medium" round class="small-button">重设密码</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SmsCodeInput from './SmsCodeInput.vue'
  import PasswordInput from './PasswordInput.vue'
  import config from '../config'
  import {store} from 'onlyid-frontend-common'

  export default {
    components: {SmsCodeInput, PasswordInput},
    data () {
      return {
        loginType: 'password',
        mobile: this.$route.params.mobile,
        form: {
          password: '',
          smsCode: ''
        },
        scene: '',
        state: store.state
      }
    },
    computed: {
      toggleLoginText () {
        return this.loginType === 'password' ? '短信验证' : '密码验证'
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
          const body = {mobile: this.mobile}
          if (this.loginType === 'password') {
            body.password = this.form.password
          } else {
            body.smsCode = this.form.smsCode
          }
          await this.$axios.post('/login', body)
          await this.$logStats(params.clientId, 'login', true)
          // 登录成功，请求code
          const {data: {authorizationCode}} = await this.$axios.get(config.authorizeUrl + '&client_id=' + params.clientId)
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
      this.scene = this.$route.params.scene
      this.$refs.password.focus()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .small-button {
    width: auto;
    font-size: 1.4rem;
  }
</style>
