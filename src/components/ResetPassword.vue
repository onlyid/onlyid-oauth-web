<template>
  <div>
    <el-button style="margin-top: 5px" icon="el-icon-edit" type="text" @click="$router.go(-2)">{{ mobile }}</el-button>
    <div style="margin-top: 15px">
      <sms-code-input :mobile="mobile" v-model="form.smsCode"/>
      <p class="note color-note">密码要包含字母、数字或标点符号中的两种</p>
      <input type="text" :value="mobile" v-show="false"/>
      <password-input v-model="form.password" label="新密码" auto-complete="new-password"/>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="10">
          <el-button @click="$router.back()">取 消</el-button>
        </el-col>
        <el-col :span="14">
          <el-button type="primary" @click="submit" :disabled="state.disabled">重 设</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import SmsCodeInput from './SmsCodeInput.vue'
  import PasswordInput from './PasswordInput.vue'
  import config from '../config'
  import {store} from 'onlyid-frontend-common'

  export default {
    props: ['client'],
    components: {SmsCodeInput, PasswordInput},
    data () {
      return {
        mobile: this.$route.params.mobile,
        form: {
          smsCode: '',
          password: ''
        },
        state: store.state
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
          await this.$axios.put('/user/password', body)
          await this.$logStats(params.clientId, 'resetPassword', true)
          this.$message({
            type: 'success',
            message: '已重设密码，即将跳转 ' + this.client.name
          })
          // 重设成功，请求code
          const {data: {authorizationCode}} = await this.$axios.get(config.authorizeUrl + '&client_id=' + params.clientId)
          let url = params.redirectUri + '?code=' + authorizationCode
          if (params.state !== 'empty') {
            url += '&state=' + params.state
          }
          setTimeout(() => { location.assign(url) }, 4000)
        } catch (err) {
          console.error(err)
          await this.$logStats(params.clientId, 'resetPassword', false)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
