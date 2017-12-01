<template>
  <div>
    <p>{{ mobile }}</p>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="smsCode">
        <sms-code-input :mobile="mobile" v-model="form.smsCode"></sms-code-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input placeholder="昵称" v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <password-input v-model="form.password"></password-input>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-button @click="back">上一步</el-button>
          </el-col>
          <el-col :span="14">
            <el-button type="primary" @click="submit">注册</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ElInput from '../../node_modules/element-ui/packages/input/src/input.vue'
  import ElButton from '../../node_modules/element-ui/packages/button/src/button.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
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
      ElCol,
      ElRow,
      ElButton,
      ElInput,
      SmsCodeInput,
      PasswordInput
    },
    data () {
      return {
        mobile: this.$route.params.mobile,
        form: {
          smsCode: '',
          nickname: '',
          password: ''
        },
        rules: common.rules
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      submit () {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            console.log('not valid')
            return
          }

          let body = {
            mobile: this.mobile,
            password: this.form.password,
            smsCode: this.form.smsCode,
            nickname: this.form.nickname
          }
          this.$axios.post('/signup', body).then((res) => {
            // 注册成功，请求code
            location.assign(config.authorizeUrl +
              '&client_id=' + this.$route.params.clientId +
              '&state=' + this.$route.params.state +
              '&redirect_uri=' + encodeURIComponent(this.$route.params.redirectUri))
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
  p {
    font-size: 22px;
  }

</style>
