<template>
  <div>
    <p>{{ mobile }}</p>
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent="submit">
      <el-form-item prop="password" v-if="loginType === 'password'" key="password">
        <password-input v-model="form.password" ref="password"></password-input>
      </el-form-item>
      <el-form-item prop="smsCode" v-else key="smsCode">
        <sms-code-input :mobile="mobile" v-model="form.smsCode"></sms-code-input>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-button @click="back">上一步</el-button>
          </el-col>
          <el-col :span="14">
            <el-button type="primary" @click="submit">登录</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-button id="toggle-login" type="info" @click="toggleLogin">{{ toggleLoginText }}</el-button>
  </div>
</template>

<script>
  import ElInput from '../../node_modules/element-ui/packages/input/src/input.vue'
  import ElButton from '../../node_modules/element-ui/packages/button/src/button.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import ElTag from '../../node_modules/element-ui/packages/tag/src/tag.vue'
  import ElForm from '../../node_modules/element-ui/packages/form/src/form.vue'
  import ElFormItem from '../../node_modules/element-ui/packages/form/src/form-item.vue'
  import SmsCodeInput from '../common/SmsCodeInput.vue'
  import PasswordInput from '../common/PasswordInput.vue'
  import common from 'onlyid-frontend-common'
  import config from '../config'

  export default {
    components: {
      ElFormItem,
      ElForm,
      ElTag,
      ElCol,
      ElRow,
      ElButton,
      ElInput,
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
        rules: common.rules
      }
    },
    computed: {
      toggleLoginText () {
        return this.loginType === 'password' ? '短信登录' : '密码登录'
      }
    },
    methods: {
      toggleLogin () {
        this.loginType = this.loginType === 'password' ? 'smsCode' : 'password'
        this.form.password = ''
        this.form.smsCode = ''
      },
      back () {
        this.$router.back()
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            console.log('not valid')
            return
          }

          let body = { mobile: this.mobile }
          if (this.loginType === 'password') {
            body.password = this.form.password
          } else {
            body.smsCode = this.form.smsCode
          }
          this.$axios.post('/login', body).then((res) => {
            // 登录成功，请求code
            location.assign(config.authorizeUrl +
              '&client_id=' + this.$route.params.clientId +
              '&state=' + this.$route.params.state +
              '&redirect_uri=' + encodeURIComponent(this.$route.params.redirectUri))
          }).catch((err) => {
            console.log(err)
          })
        })
      }
    },
    mounted () {
      this.$refs.password.focus()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #toggle-login {
    font-size: 17px;
    width: auto;
    margin-top: 40px;
  }
</style>
