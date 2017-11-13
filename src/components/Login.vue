<template>
  <div>
    <p>{{ mobile }}</p>
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent="submit">
      <el-form-item prop="password" v-if="loginType === 'password'" key="password">
        <el-input v-model="form.password" :placeholder="placeholder" type="password"></el-input>
      </el-form-item>
      <el-form-item style="position: relative" prop="smsCode" v-else key="smsCode">
        <el-input v-model="form.smsCode" :placeholder="placeholder"></el-input>
        <el-button id="send-sms-code" type="text" @click="sendSmsCode" :disabled="sendSmsCodeDisabled">{{ sendSmsCodeText }}</el-button>
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

  export default {
    components: {
      ElFormItem,
      ElForm,
      ElTag,
      ElCol,
      ElRow,
      ElButton,
      ElInput},
    name: 'Login',
    data () {
      return {
        loginType: 'password',
        mobile: this.$route.params.mobile,
        form: {
          password: '',
          smsCode: ''
        },
        rules: {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '请输入正确密码', trigger: 'blur' }
          ],
          smsCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { len: 4, message: '请输入正确验证码', trigger: 'blur' },
            { pattern: /^[0-9]+$/, message: '请输入正确验证码', trigger: 'blur' }
          ]
        },
        sendSmsCodeDisabled: false,
        sendSmsCodeText: '发送验证码'
      }
    },
    computed: {
      placeholder () {
        return this.loginType === 'password' ? '密码' : '验证码'
      },
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
      sendSmsCode () {
        this.$axios.post('/sms_code/send', {
          mobile: this.mobile
        }).then((res) => {
          let countDown = 60
          this.sendSmsCodeDisabled = true
          this.sendSmsCodeText = countDown
          let h = setInterval(() => {
            countDown -= 1
            this.sendSmsCodeText = countDown
          }, 1000)
          setTimeout(() => {
            clearInterval(h)
            this.sendSmsCodeDisabled = false
            this.sendSmsCodeText = '发送验证码'
          }, countDown * 1000)
        }).catch((err) => {
          console.log(err)
        })
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            console.log('not valid')
            return
          }

          console.log(this.$route.params.redirectUri)

          let body = { mobile: this.mobile }
          if (this.loginType === 'password') {
            body.password = this.form.password
          } else {
            body.smsCode = this.form.smsCode
          }
          this.$axiosOAuth.post('/login', body).then((res) => {
            // 登录成功，请求code
            return this.$axiosOAuth.get('/authorize', {
              params: {
                response_type: 'code',
                client_id: this.$route.params.clientId,
                state: this.$route.params.state,
                redirect_uri: decodeURIComponent(this.$route.params.redirectUri)
              }
            })
          }).then((res) => {
            console.log(res)
          }).catch((err) => {
            console.log(err)
          })
        })
      }
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
  #send-sms-code {
    padding-top: 10px;
    position: absolute;
    top: 0px;
    right: 10px;
    width: auto;
  }
</style>
