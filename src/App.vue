<template>
  <div id="app">
    <div id="main">
      <el-card :body-style="{padding: '30px'}" id="card1">
        <div v-if="showIcon" style="margin-top: 20px">
          <img :src="iconUrl" width="64" class="icon"/>
          <p style="margin: 5px 0;">{{ client.name }}</p>
<!--          <span v-if="client.review.status === 'dev'" class="review-status">开发版</span>-->
        </div>
        <router-view :client="client"/>
        <div style="margin-top: 50px" v-if="showLogo">
          <img width="66" src="./assets/logo.png" @click="goAbout" style="cursor: pointer;"/><br/>
          <span style="color: #7f7f7f; margin: 0; cursor: pointer;" @click="goAbout">开源帐号</span>
        </div>
      </el-card>
    </div>
    <div id="footer">
      <p>onlyid.net &nbsp; © &nbsp; {{ currentYear }}</p>
    </div>
  </div>
</template>

<script>
import url from 'url'
import { store } from 'onlyid-web-common'

export default {
  data () {
    return {
      currentYear: new Date().getFullYear(),
      client: { review: '', developer: '' }, // 设置初始值 否则会报错
      iconUrl: ''
    }
  },
  methods: {
    goAbout () {
      this.$router.push('/about')
    }
  },
  async mounted (data) {
    try {
      const { data: client } = await this.$axios.get('/clients/' + this.$route.params.clientId)
      this.client = client
      const domains = client.redirectDomains
      const { hostname } = url.parse(this.$route.params.redirectUri)
      if (domains.length > 0 && !domains.includes(hostname)) {
        store.setDisabled(true)
        this.$message.error('redirect uri不属于回调域名')
      } else if (new Date(client.developer.expires) < new Date()) {
        store.setDisabled(true)
        this.$message.error('唯ID服务已过期，请续费')
      }

      this.iconUrl = client.iconUrl + '?' + Date.now()

      switch (this.$route.params.scene) {
        case 'login':
          document.title = '登录' + client.name
          break
        case 'bind':
          document.title = '绑定手机号'
          break
        case 'change':
          document.title = '更换手机号'
          break
        case 'auth':
          document.title = '验证手机号'
          break
      }
    } catch (err) {
      console.error(err)
    }
  },
  created () {
    console.log('app created')
    if (this.$route.params.viewZoomed === 'true') import('./assets/zoomed.css')
    if (this.$route.params.themeDark === 'true') import('./assets/dark.css')

    // 记录统计
    // 如果不放nextTick的话 会报 Cannot read property '$axios' of undefined
    this.$nextTick(async () => {
      await this.$logStats(this.$route.params.clientId, 'request', null)
    })
  },
  computed: {
    showIcon () {
      const path = this.$route.path
      return path !== '/about' && path !== '/demo'
    },
    showLogo () {
      const path = this.$route.path
      return path !== '/about' && path !== '/demo'
    }
  }
}
</script>

<style scoped>
  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  #card1 {
    width: 350px;
    margin-top: 20px;
  }
  #main {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  #footer {
    font-size: 1.3rem;
  }
  .icon {
    border-radius: 5px;
  }
  .review-status {
      color: white;
      background-color: #F56C6C;
      padding: 3px 5px;
      border-radius: 5px;
      font-size: 1.3rem;
  }
</style>
