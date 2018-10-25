<template>
  <el-input placeholder="请填写密码" :type="showPassword ? 'text' : 'password'" v-model="password" :auto-complete="autoComplete || 'off'" ref="password">
    <i slot="suffix" class="el-icon-view show-password" :class="{'show-password-active': showPassword}" @click="showPassword = !showPassword"></i>
    <template slot="prepend">{{this.label || '密码'}}</template>
  </el-input>
</template>

<script>
export default {
  props: ['value', 'label', 'autoComplete'],
  data () {
    return {
      showPassword: false
    }
  },
  methods: {
    focus () {
      this.$refs.password.focus()
    }
  },
  computed: {
    password: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .show-password {
    font-size: 1.8rem;
    margin-right: 5px;
    color: #7f7f7f;
    cursor: pointer;
    margin-top: 12px;
  }
  .show-password-active {
    color: #409EFF;
  }
</style>
