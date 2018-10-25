<template>
  <div>
    <p class="note" style="margin-top: 40px;">
      <template v-if="scene === 'login'">
        你正在登录{{client.name}}，选择一个账号继续
      </template>
      <template v-else-if="scene === 'bind'">
        你正在绑定手机号，选择一个账号继续
      </template>
      <template v-else-if="scene === 'change'">
        你正在更换手机号，选择一个账号继续
      </template>
      <template v-else-if="scene === 'auth'">
        你正在验证手机号，选择一个账号继续
      </template>
    </p>
    <account v-for="user in users" :key="user.id" :mode="mode" :user="user" @deleted="delete1" @logout="logout"></account>
    <div style="text-align: left; padding: 16px 10px;" class="useNew" @click="goAuth(false)">
      <span style="font-size: 1.6rem;"><i class="el-icon-plus"></i> 使用新手机号</span>
    </div>
    <div style="margin-top: 20px">
      <el-button @click="toggleLogout" size="medium" round class="small-button" :disabled="mode === 'delete'">{{ mode === 'logout' ? '完 成' : '退 出' }}</el-button>
      <el-button @click="toggleDelete" size="medium" round class="small-button" :disabled="mode === 'logout'">{{ mode === 'delete' ? '完 成' : '删 除' }}</el-button>
    </div>
  </div>
</template>

<script>
import Account from '../components/Account'

export default {
  props: ['client'],
  components: { Account },
  name: 'Choose',
  data () {
    return {
      users: [],
      mode: 'normal',
      scene: ''
    }
  },
  methods: {
    toggleDelete () {
      if (this.mode === 'delete') this.mode = 'normal'
      else this.mode = 'delete'
    },
    toggleLogout () {
      if (this.mode === 'logout') this.mode = 'normal'
      else this.mode = 'logout'
    },
    delete1 (user) {
      this.users.splice(this.users.indexOf(user), 1)
      this.$message({ message: '已删除', type: 'success' })
      this.mode = 'normal'
      if (this.users.length === 0) {
        this.goAuth(true)
      }
    },
    logout () {
      this.$message({ message: '已退出', type: 'success' })
      this.mode = 'normal'
    },
    goAuth (replace) {
      const params = this.$route.params
      const route = '/auth/' + params.clientId + '/' + params.state + '/' +
        // 这个encode是必须的 否则跳到下个路由url又变回没转义的了
        encodeURIComponent(params.redirectUri) + '/' + params.themeDark + '/' + params.viewZoomed + '/' + params.scene
      if (replace) {
        this.$router.replace(route)
      } else {
        this.$router.push(route)
      }
      delete sessionStorage.mobile
    }
  },
  async created () {
    try {
      this.scene = this.$route.params.scene
      const { data } = await this.$axios.get('/session-users')
      this.users = data
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
  .useNew:hover {
    background-color: #f7f8f9;
    cursor: pointer;
  }
</style>
