<template>
  <div style="padding-bottom: 30px; margin-top: 50px">
    <el-input placeholder="请填写手机号" v-model="form.mobile" @keyup.native.enter="submit" clearable ref="mobile">
      <template slot="prepend">{{scene === 'change' ? '新号码' : '手机号'}}</template>
    </el-input>
    <p class="note" style="margin-top: 20px;">
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
      try {
        sessionStorage.mobile = this.form.mobile
        const { data: { isNew, needUpdatePassword } } = await this.$axios.post('/user/check-new', { mobile: this.form.mobile })

        const params = this.$route.params
        if (needUpdatePassword) {
          this.$message({
            message: '你的账号存在安全隐患，请重设密码',
            type: 'warning'
          })
          this.$router.push('/reset-password/' + this.form.mobile + '/' + params.clientId + '/' + params.state + '/' +
                  encodeURIComponent(params.redirectUri))
          return
        }

        let route = '/login/'
        if (isNew) {
          route = '/signup/'
        }
        this.$router.push(route + this.form.mobile + '/' + params.clientId + '/' + params.state +
            // 这个encode是必须的 否则跳到下个路由url又变回没转义的了
            '/' + encodeURIComponent(params.redirectUri) + '/' + params.scene)
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted () {
    this.$refs.mobile.focus()
  },
  created () {
    this.scene = this.$route.params.scene
    this.form.mobile = sessionStorage.mobile
  },
  computed: {
    state () {
      return this.$store.state
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
