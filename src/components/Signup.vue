<template>
  <div>
    <el-button style="margin-top: 5px" icon="el-icon-edit" type="text" @click="$router.back()">{{ mobile }}</el-button>
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 15px">
      <el-form-item prop="smsCode">
        <sms-code-input :mobile="mobile" v-model="form.smsCode" />
      </el-form-item>
      <input type="text" :value="mobile" v-show="false"/>
      <p style="text-align: left; font-size: 1.4rem;" class="color-note">设置密码，方便下次使用（可选）</p>
      <el-form-item prop="password">
        <password-input v-model="form.password" auto-complete="new-password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">下一步</el-button>
      </el-form-item>
    </el-form>
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
        rules: config.rules
      }
    },
    methods: {
      submit () {
        this.$refs.form.validate(async (valid) => {
          try {
            if (!valid) {
              console.log('not valid')
              return
            }

            const body = {
              mobile: this.mobile,
              password: this.form.password,
              smsCode: this.form.smsCode
            }
            await this.$axios.post('/signup', body)
            await this.$logStats(this.$route.params.clientId, this.mobile, 'signup', true)
            // 注册成功，请求code
            location.assign(config.authorizeUrl +
              '&client_id=' + this.$route.params.clientId +
              '&state=' + this.$route.params.state +
              '&redirect_uri=' + encodeURIComponent(this.$route.params.redirectUri))
          } catch (err) {
            console.error(err)
            await this.$logStats(this.$route.params.clientId, this.mobile, 'signup', false)
          }
        })
      }
    },
    mounted () {
      // 不强制要求密码
      this.rules.password.shift()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
