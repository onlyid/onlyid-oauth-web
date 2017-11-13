<template>
  <div id="signup">
    <p>{{ mobile }}</p>
    <el-input placeholder="验证码" style="margin-top: 0px"></el-input>
    <el-button id="send-sms-code" type="text" >发送验证码</el-button>
    <el-input placeholder="昵称"></el-input>
    <el-input placeholder="新密码" :type="showPassword ? 'text' : 'password'"></el-input>
    <i class="el-icon-view show-password" :class="{'show-password-active': showPassword}" @click="toggleShowPassword"></i>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-button>上一步</el-button>
      </el-col>
      <el-col :span="14">
        <el-button type="success">注册</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ElInput from '../../node_modules/element-ui/packages/input/src/input.vue'
  import ElButton from '../../node_modules/element-ui/packages/button/src/button.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'

  export default {
    components: {
      ElCol,
      ElRow,
      ElButton,
      ElInput},
    name: 'Signup',
    data () {
      return {
        mobile: '18588237889',
        showPassword: false
      }
    },
    computed: {
    },
    methods: {
      toggleShowPassword () {
        this.showPassword = !this.showPassword
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  p {
    font-size: 22px;
  }
  #send-sms-code {
    margin: 0px;
    position: absolute;
    right: 10px;
    top: 47px;
    width: auto;
  }
  #signup {
    position: relative;
  }
  .show-password {
    position: absolute;
    right: 20px;
    top: 155px;
    font-size: 30px;
    color: #7f7f7f;
    cursor: pointer;
  }
  .show-password-active {
    color: #409EFF;
  }
</style>
