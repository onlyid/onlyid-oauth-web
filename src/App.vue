<template>
  <div id="app">
    <el-card class="card">
      <div v-if="showIcon" style="margin-top: 20px">
        <img :src="iconUrl" width="64" class="icon"/>
        <p style="margin-top: 5px; font-size: 1.4rem">{{ client.name }}</p>
      </div>
      <router-view :client="client"/>
      <div style="margin-top: 50px" v-if="showLogo">
        <div class="logo" @click="goAbout"></div>
        <p style="cursor: pointer; font-size: 1.4rem; margin-top: 5px" class="color-note" @click="goAbout">手机号验证服务</p>
      </div>
    </el-card>
    <div id="footer">
      <p>onlyid.net &nbsp; © &nbsp; {{ currentYear }}</p>
      <p>深圳市友全科技有限公司 </p>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        currentYear: new Date().getFullYear(),
        client: '',
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
        const res = await this.$axios.get('/clients/' + this.$route.params.clientId)
        this.client = res.data.client
        if (this.client.redirectUris[0] !== this.$route.params.redirectUri) {
          this.$message.error('redirect uri错误')
        }

        this.iconUrl = this.client.iconUrl + '?' + Date.now()
      } catch (err) {
        console.error(err)
      }
    },
    created () {
      if (this.$route.params.viewZoomed === 'true') {
        require.ensure([], (require) => {
          require('./assets/style-zoomed.css')
        })
      }
      if (this.$route.params.themeDark === 'true') {
        require.ensure([], (require) => {
          require('./assets/style-dark.css')
        })
      }
    },
    computed: {
      showIcon () {
        return this.$route.path !== '/about'
      },
      showLogo () {
        return this.$route.path !== '/about'
      }
    }
  }
</script>

<style scoped>
  #app {
    width: 320px;
    margin: 0 auto;
  }
  #footer {
    font-size: 1.3rem;
  }
  .card {
    padding: 10px;
  }
  .icon {
    border-radius: 5px;
  }
</style>
