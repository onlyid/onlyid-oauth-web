<template>
  <div>
    <el-input :placeholder="placeholder1" :type="showPassword ? 'text' : 'password'" v-model="password" ref="password" :auto-complete="autoComplete || 'off'"></el-input>
    <i class="el-icon-view show-password" :class="{'show-password-active': showPassword}" @click="toggleShowPassword"></i>
  </div>
</template>

<script>
  export default {
    props: ['value', 'placeholder', 'autoComplete'],
    data () {
      return {
        placeholder1: this.placeholder || '密码',
        showPassword: false
      }
    },
    methods: {
      toggleShowPassword () {
        this.showPassword = !this.showPassword
      },
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
    position: absolute;
    right: 12px;
    top: 10px;
    font-size: 2.2rem;
    color: #7f7f7f;
    cursor: pointer;
  }
  .show-password-active {
    color: #409EFF;
  }
</style>
