<template>
  <div>
    <el-input placeholder="验证码" v-model="smsCode" ref="smsCode" type="tel"></el-input>
    <el-button id="send-sms-code" type="text" @click="sendSmsCode" :disabled="sendSmsCodeDisabled">{{ sendSmsCodeText }}</el-button>
  </div>
</template>

<script>
  import config from '../config'
  import Validator from 'async-validator'

  export default {
    props: ['value', 'mobile'],
    data () {
      return {
        sendSmsCodeDisabled: false,
        sendSmsCodeText: '发送验证码'
      }
    },
    methods: {
      sendSmsCode () {
        const descriptor = {mobile: config.rules.mobile}
        const validator = new Validator(descriptor)
        validator.validate({mobile: this.mobile}, {first: true}, async (errors, fields) => {
          try {
            if (errors) {
              return
            }

            await this.$axios.post('/sms-code/send', {
              mobile: this.mobile,
              client: this.$route.params.clientId
            })
            this.$refs.smsCode.focus()

            let countDown = 60
            this.sendSmsCodeDisabled = true
            this.sendSmsCodeText = countDown
            const h = setInterval(() => {
              countDown--
              if (countDown === 0) {
                clearInterval(h)
                this.sendSmsCodeDisabled = false
                this.sendSmsCodeText = '发送验证码'
              } else {
                this.sendSmsCodeText = countDown
              }
            }, 1000)
          } catch (err) {
            console.error(err)
          }
        })
      }
    },
    computed: {
      smsCode: {
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
  #send-sms-code {
    padding-top: 10px;
    position: absolute;
    top: 0px;
    right: 10px;
    width: auto;
  }
</style>
