<template>
  <div>
    <el-button style="margin-top: 5px" icon="el-icon-edit" type="text" @click="$router.go(-2)">{{ mobile }}</el-button>
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 15px">
      <el-form-item prop="smsCode">
        <sms-code-input :mobile="mobile" v-model="form.smsCode" />
      </el-form-item>
      <input type="text" :value="mobile" v-show="false"/>
      <el-form-item prop="password">
        <password-input v-model="form.password" placeholder="新密码" auto-complete="new-password" />
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-button @click="$router.back()">取消</el-button>
          </el-col>
          <el-col :span="14">
            <el-button type="primary" @click="submit">下一步</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SmsCodeInput from './SmsCodeInput.vue'
  import PasswordInput from './PasswordInput.vue'
  import config from '../config'

  export default {
    props: ['client'],
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
            await this.$axios.put('/user/password', body)
            await this.$logStats(this.$route.params.clientId, this.mobile, 'resetPassword', true)
            this.$message({
              type: 'success',
              message: '已重设密码，即将跳转 ' + this.client.name
            })
            // 重设成功，请求code
            setTimeout(() => {
              location.assign(config.authorizeUrl +
                '&client_id=' + this.$route.params.clientId +
                '&state=' + this.$route.params.state +
                '&redirect_uri=' + encodeURIComponent(this.$route.params.redirectUri))
            }, 4000)
          } catch (err) {
            console.error(err)
            this.$logStats(this.$route.params.clientId, this.mobile, 'resetPassword', false)
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
