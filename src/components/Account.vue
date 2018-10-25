<template>
  <div id="content" :class="[mode, user.loggedInExpires > Date.now() ? 'logged-in' : 'not-logged-in']" @click="submit">
    <span style="font-family: 'Helvetica Neue',Arial; font-size: 1.7rem;">{{user.mobile}}</span>
    <span class="tip hover-visible" v-if="mode === 'normal'">
      <span v-if="user.loggedInExpires > Date.now()">已登录</span>
      <span v-else>已退出</span>
    </span>
    <span class="tip" v-else-if="mode === 'logout'">
      <span v-if="user.loggedInExpires > Date.now()">退出</span>
      <span v-else>已退出</span>
    </span>
    <span class="tip" v-else>
      <i class="el-icon-close" style="font-size: 20px;"></i>
    </span>
  </div>
</template>

<script>
import config from '../config'

export default {
  props: ['mode', 'user'],
  name: 'Account',
  data () {
    return {
    }
  },
  methods: {
    async submit () {
      try {
        switch (this.mode) {
          case 'normal':
            this.choose()
            break
          case 'logout':
            if (this.user.loggedInExpires === 0) return

            await this.$axios.post('/session-users/' + this.user.id + '/logout')
            this.user.loggedInExpires = 0
            this.user.keepLoggedIn = false
            this.$emit('logout')
            break
          default: // delete
            await this.$axios.delete('/session-users/' + this.user.id)
            this.$emit('deleted', this.user)
        }
      } catch (err) {
        console.error(err)
      }
    },
    async choose () {
      const params = this.$route.params
      try {
        // +5s是防止用户过期的那一刻点 后台报错
        if (this.user.loggedInExpires < Date.now() + 5000) {
          this.$router.push('/login/' + this.user.mobile + '/' + params.clientId + '/' + params.state +
            // 这个encode是必须的 否则跳到下个路由url又变回没转义的了
            '/' + encodeURIComponent(params.redirectUri) + '/' + params.scene + '/' + this.user.keepLoggedIn)
        } else {
          await this.$logStats(params.clientId, 'choose', true)
          const { data: { authorizationCode } } = await this.$axios.get(
            config.authorizeUrl + '&client_id=' + params.clientId + '&mobile=' + this.user.mobile)
          let url = params.redirectUri + '?code=' + authorizationCode
          if (params.state !== 'empty') url += '&state=' + params.state
          location.assign(url)
        }
      } catch (err) {
        console.error(err)
        await this.$logStats(params.clientId, 'choose', false)
      }
    }
  }
}
</script>

<style scoped>
  #content {
    padding: 16px 10px;
    border-bottom: solid 1px #E4E7ED;
    text-align: left;
  }
  .logged-in {
    color: #409EFF;
  }
  .logout.not-logged-in {
    background-color: #f7f8f9;
    color: #7f7f7f;
    cursor: not-allowed;
  }
  .logged-in:hover {
    background-color: #ecf5ff;
    cursor: pointer;
  }
  .normal.not-logged-in:hover, .delete.not-logged-in:hover {
    background-color: #f7f8f9;
    cursor: pointer;
  }
  .hover-visible {
    visibility: hidden;
  }
  #content:hover .hover-visible {
    visibility: visible;
  }
  .tip {
    float: right;
    padding: 2px;
    font-size: 1.4rem;
  }
</style>
