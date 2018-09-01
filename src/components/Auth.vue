<template>
  <div style="padding-bottom: 30px">
    <p style="text-align: left; font-size: 1.4rem; margin-bottom: -25px; margin-top: 25px" v-if="client.review.status === 'dev'">
        <span style="color: #E6A23C;">【开发中】</span>应用未经审核，请注意风险
    </p>
    <div style="margin-top: 50px">
      <el-input placeholder="请填写手机号" v-model="form.mobile" @keyup.native.enter="submit" clearable ref="mobile">
        <template slot="prepend">{{scene === 'change' ? '新号码' : '手机号'}}</template>
      </el-input>
      <p class="color-note note" style="margin-top: 20px;">
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
      <el-button type="primary" @click="submit" :disabled="state.disabled">下 一 步</el-button>
    </div>
  </div>
</template>

<script>
  import {store} from 'onlyid-frontend-common'

  export default {
    props: ['client'],
    data () {
      return {
        form: {
          mobile: ''
        },
        scene: '',
        state: store.state
      }
    },
    methods: {
      async submit () {
        try {
          localStorage.setItem('mobile', this.form.mobile)

          const {data: {isNew}} = await this.$axios.post('/user/check-new', {mobile: this.form.mobile})
          let route = '/login/'
          if (isNew) {
            route = '/signup/'
          }

          const params = this.$route.params
          this.$router.push(route + this.form.mobile + '/' + params.clientId + '/' + params.state +
            // 这个encode是必须的 否则跳到下个路由url又变回没转义的了
            '/' + encodeURIComponent(params.redirectUri) + '/' + params.scene)
        } catch (err) {
          console.error(err)
        }
      }
    },
    mounted () {
      this.scene = this.$route.params.scene
      this.form.mobile = localStorage.getItem('mobile')
      this.$refs.mobile.focus()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
