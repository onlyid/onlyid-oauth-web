<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" width="300px" :show-close="false" :close-on-click-modal="false">
      <span style="font-size: 1.5rem;">已重设密码，现在返回 {{client.name}}</span>
      <span slot="footer">
        <el-button type="primary" @click="redirect">好 的</el-button>
      </span>
    </el-dialog>

    <el-button style="margin-top: 15px" icon="el-icon-edit" type="text" @click="$router.go(-2)">{{ mobile }}</el-button>
    <div style="margin-top: 15px">
      <sms-code-input :mobile="mobile" v-model="form.smsCode"/>
      <p class="note">密码要包含字母、数字或标点符号中的两种</p>
      <password-input v-model="form.password" label="新密码" auto-complete="new-password"/>
      <div style="text-align: left; margin-top: 20px;">
        <el-checkbox v-model="form.keepLoggedIn">记住我</el-checkbox><span style="color: #7f7f7f;">（保持登录三个月）</span>
      </div>
      <div style="margin-top: 20px;">
        <el-button @click="$router.back()" style="width: 35%">取 消</el-button>
        <el-button type="primary" @click="submit" :disabled="state.disabled" style="width: 60%; margin-left: 5%">重 设</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SmsCodeInput from '../components/SmsCodeInput.vue'
import PasswordInput from '../components/PasswordInput.vue'
import config from '../config'
import { store } from 'onlyid-web-common'

export default {
  props: ['client'],
  components: { SmsCodeInput, PasswordInput },
  data () {
    return {
      mobile: this.$route.params.mobile,
      form: {
        smsCode: '',
        password: '',
        keepLoggedIn: true
      },
      state: store.state,
      url: '',
      dialogVisible: false
    }
  },
  methods: {
    async submit () {
      const params = this.$route.params
      try {
        const body = {
          mobile: this.mobile,
          password: this.form.password,
          smsCode: this.form.smsCode,
          keepLoggedIn: this.form.keepLoggedIn
        }
        await this.$axios.put('/user/password', body)
        await this.$logStats(params.clientId, 'resetPassword', true)
        // 重设成功，请求code
        const { data: { authorizationCode } } = await this.$axios.get(
          config.authorizeUrl + '&client_id=' + params.clientId + '&mobile=' + this.mobile)
        this.url = params.redirectUri + '?code=' + authorizationCode
        if (params.state !== 'empty') this.url += '&state=' + params.state

        this.dialogVisible = true
      } catch (err) {
        console.error(err)
        await this.$logStats(params.clientId, 'resetPassword', false)
      }
    },
    redirect () {
      location.assign(this.url)
    }
  },
  created () {
    this.form.keepLoggedIn = this.$route.params.keepLoggedIn === 'true'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
