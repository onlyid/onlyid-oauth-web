<template>
  <div>
    <p style="text-align: left; font-size: 1.4rem; margin-bottom: -20px; margin-top: 20px" v-if="isShowTip">
      <template v-if="expired">
        <span style="color: #E6A23C;">【已过期】</span>该{{ client.type === 'app' ? 'app' : '网站' }}的开发者账号已过期，请及时续费
      </template>
      <template v-else-if="client.review && client.review.status === 'dev'">
        <span style="color: #E6A23C;">【开发中】</span>该{{ client.type === 'app' ? 'app' : '网站' }}未经审核，请注意风险
      </template>
      <template v-else-if="client.review && client.review.status === 'rejected'">
        <span style="color: #F56C6C;">【审核未通过】</span>该{{ client.type === 'app' ? 'app' : '网站' }}存在违法违规行为
      </template>
    </p>
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent style="margin-top: 50px">
      <el-form-item prop="mobile">
        <el-input placeholder="手机号" v-model="form.mobile" ref="mobile" type="tel" @keyup.native.enter="submit" :disabled="isDisable" clearable el-input/>
      </el-form-item>
      <p style="margin: 20px 0 10px; text-align: left; font-size: 1.4rem" class="color-note">{{ client.name }}使用唯ID的技术来帮助你验证手机号。此操作不会产生短信或其他费用。</p>
      <el-form-item>
        <el-button type="primary" @click="submit" :disabled="isDisable">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import config from '../config'

  export default {
    props: ['client'],
    data () {
      return {
        form: {
          mobile: ''
        },
        rules: config.rules
      }
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            console.log('not valid')
            return
          }

          localStorage.setItem('mobile', this.form.mobile)

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
    mounted () {
      this.form.mobile = localStorage.getItem('mobile')
      this.$nextTick(() => {
        this.$refs.mobile.focus()

        // 记录统计
        // 如果不放nextTick的话 会报 Cannot read property '$axios' of undefined
        this.$logStats(this.$route.params.clientId, null, 'request', null)
      })
    },
    computed: {
      isShowTip () {
        if (!this.client) {
          return false
        }

        if (this.client.review.status === 'dev' || this.client.review.status === 'rejected' || this.expired) {
          return true
        } else {
          return false
        }
      },
      isDisable () {
        if (!this.client) {
          return false
        }
        if (this.client.review.status === 'rejected' || this.expired) {
          return true
        } else {
          return false
        }
      },
      expired () {
        if (!this.client) {
          return false
        }
        if (new Date(this.client.developer.expires) < new Date()) {
          return true
        }

        return false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
