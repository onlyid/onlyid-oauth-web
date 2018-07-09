<template>
  <div style="padding-bottom: 30px">
    <p style="text-align: left; font-size: 1.4rem; margin-bottom: -25px; margin-top: 25px" v-if="isShowTip">
      <template v-if="expired">
        <span style="color: #E6A23C;">【已过期】</span>该{{ client.type === 'app' ? 'app' : '网站' }}的唯ID服务已过期，请续费
      </template>
      <template v-else-if="client.review && client.review.status === 'dev'">
        <span style="color: #E6A23C;">【开发中】</span>该{{ client.type === 'app' ? 'app' : '网站' }}未经审核，请注意风险
      </template>
      <template v-else-if="client.review && client.review.status === 'rejected'">
        <span style="color: #F56C6C;">【审核未通过】</span>该{{ client.type === 'app' ? 'app' : '网站' }}存在违法违规行为
      </template>
    </p>
    <div style="margin-top: 50px">
      <el-input placeholder="请填写手机号" v-model="form.mobile" @keyup.native.enter="submit" :disabled="isDisable" clearable ref="mobile">
        <template slot="prepend">手机号</template>
      </el-input>
      <p class="color-note note">
        <template v-if="scene === 'login'">
          你正在登录{{client.name}}，点击“下一步”继续
        </template>
        <template v-else-if="scene === 'bind'">
          你正在绑定手机号，点击“下一步”继续
        </template>
        <template v-else-if="scene === 'change'">
          你正在更换手机号，点击“下一步”继续
        </template>
        <template v-else-if="scene === 'auth'">
          你正在验证手机号，点击“下一步”继续
        </template>
      </p>
      <el-button type="primary" @click="submit" :disabled="isDisable">下 一 步</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['client'],
    data () {
      return {
        form: {
          mobile: ''
        },
        scene: ''
      }
    },
    methods: {
      async submit () {
        localStorage.setItem('mobile', this.form.mobile)

        this.$axios.post('/user/check-new', {
          mobile: this.form.mobile
        }).then((res) => {
          let route = '/login/'
          if (res.data.userType === 'new') {
            route = '/signup/'
          }

          const params = this.$route.params
          this.$router.push(route + this.form.mobile + '/' + params.clientId + '/' + params.state +
            // 这个encode是必须的 否则跳到下个路由url又变回没转义的了
            '/' + encodeURIComponent(params.redirectUri) + '/' + params.scene)
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    mounted () {
      this.form.mobile = localStorage.getItem('mobile')
      this.scene = this.$route.params.scene
      this.$refs.mobile.focus()
    },
    computed: {
      isShowTip () {
        return this.client.review.status === 'dev' || this.client.review.status === 'rejected' || this.expired
      },
      isDisable () {
        return this.client.review.status === 'rejected' || this.expired
      },
      expired () {
        return new Date(this.client.developer.expires) < new Date()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
