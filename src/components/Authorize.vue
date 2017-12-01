<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent="submit">
      <el-form-item prop="mobile">
        <el-input placeholder="手机号" v-model="form.mobile" ref="mobile"></el-input>
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
  import common from 'onlyid-frontend-common'

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
        rules: common.rules
      }
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            console.log('not valid')
            return
          }

          sessionStorage.setItem('mobile', this.form.mobile)

          this.$axios.post('/user/check-new', {
            mobile: this.form.mobile
          }).then((res) => {
            let route = '/login/'
            if (res.data.userType === 'new') {
              route = '/signup/'
            }
            this.$router.push(route + this.form.mobile +
              '/' + this.$route.params.clientId +
              '/' + this.$route.params.state +
              // 这个encode是必须的 否则跳到下个路由url又变回没转义的了
              '/' + encodeURIComponent(this.$route.params.redirectUri))
          }).catch((err) => {
            console.log(err)
          })
        })
      }
    },
    created () {
      this.$axios.get('/clients/' + this.$route.params.clientId).then((res) => {
        if (res.data.client.redirectUris[0] !== this.$route.params.redirectUri) {
          this.$message.error('redirect uri错误')
        }
      }).catch((err) => {
        console.log(err)
      })

      this.form.mobile = sessionStorage.getItem('mobile')
    },
    mounted () {
      this.$refs.mobile.focus()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #footer {
    margin-top: 50px;
  }
</style>
