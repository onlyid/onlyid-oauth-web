<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent="submit">
      <el-form-item prop="mobile">
        <el-input placeholder="手机号" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">下一步</el-button>
      </el-form-item>
    </el-form>
    <div id="footer">
      <img src="../assets/logo1.png" width="100px"/>
    </div>
  </div>
</template>

<script>
  import ElInput from '../../node_modules/element-ui/packages/input/src/input.vue'
  import ElButton from '../../node_modules/element-ui/packages/button/src/button.vue'
  import Hi from './Hi.vue'
  import ElForm from '../../node_modules/element-ui/packages/form/src/form.vue'
  import ElFormItem from '../../node_modules/element-ui/packages/form/src/form-item.vue'
  import common from '../common'

  export default {
    components: {
      ElFormItem,
      ElForm,
      ElButton,
      ElInput,
      Hi
    },
    name: 'Authorize',
    data () {
      return {
        form: {
          mobile: ''
        },
        rules: {
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { len: 11, message: '请输入正确手机号', trigger: 'blur' },
            { pattern: /^[0-9]+$/, message: '请输入正确手机号', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            console.log('not valid')
            return
          }

          this.$axiosOAuth.post('/user/check-new', {
            mobile: this.form.mobile
          }).then((res) => {
            let route = '/login/'
            if (res.data.userType === 'new') {
              route = '/signup/'
            }
            this.$router.push(route + this.form.mobile +
              '/' + this.$route.query.client_id +
              '/' + this.$route.query.state +
              '/' + encodeURIComponent(this.$route.query.redirect_uri))
          }).catch((err) => {
            console.log(err)
          })
        })
      }
    },
    created () {
      this.$axiosOAuth.get('/client', {
        params: {
          client_id: this.$route.query.client_id
        }
      }).then((res) => {
        // do nothing
      }).catch((err) => {
        console.log(err)
      })

      // 先检查client
      const user = common.getUser()
      // 已经登录 直接请求code
      if (user) {
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #footer {
    margin-top: 50px;
  }
</style>
