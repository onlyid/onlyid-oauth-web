<template>
  <div>
    <el-button style="margin-top: 5px" icon="el-icon-edit" type="text" @click="$router.back()">{{ mobile }}</el-button>
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 15px">
      <input type="text" :value="mobile" v-show="false"/>
      <el-form-item prop="password" v-if="loginType === 'password'" key="password">
        <password-input v-model="form.password" ref="password" @keyup.native.enter="submit" password-input/>
      </el-form-item>
      <el-form-item prop="smsCode" v-else key="smsCode">
        <sms-code-input :mobile="mobile" v-model="form.smsCode" @keyup.native.enter="submit" sms-code-input/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">下一步</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top: 40px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" @click="toggleLogin" size="medium" round class="small-button" plain>{{ toggleLoginText }}</el-button>
        </el-col>
        <el-col :span="12">
          <el-button @click="resetPassword" size="medium" round class="small-button" plain>重设密码</el-button>
        </el-col>
      </el-row>
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
        loginType: 'password',
        mobile: this.$route.params.mobile,
        form: {
          password: '',
          smsCode: ''
        },
        rules: config.rules
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
      submit () {
        this.$refs['form'].validate(async (valid) => {
          try {
            if (!valid) {
              console.log('not valid')
              return
            }

            const body = {mobile: this.mobile}
            if (this.loginType === 'password') {
              body.password = this.form.password
            } else {
              body.smsCode = this.form.smsCode
            }
            await this.$axios.post('/login', body)
            await this.$logStats(this.$route.params.clientId, this.mobile, 'login', true)
            // 登录成功，请求code
            location.assign(config.authorizeUrl +
              '&client_id=' + this.$route.params.clientId +
              '&state=' + this.$route.params.state +
              '&redirect_uri=' + encodeURIComponent(this.$route.params.redirectUri))
          } catch (err) {
            console.error(err)
            this.$logStats(this.$route.params.clientId, this.mobile, 'login', false)
          }
        })
      },
      resetPassword () {
        this.$router.push('/reset-password/' + this.$route.params.mobile +
          '/' + this.$route.params.clientId +
          '/' + this.$route.params.state +
          // 这个encode是必须的 否则跳到下个路由url又变回没转义的了
          '/' + encodeURIComponent(this.$route.params.redirectUri))
      }
    },
    mounted () {
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
