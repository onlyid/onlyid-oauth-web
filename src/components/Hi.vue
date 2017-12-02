<template>
  <div>
    <div>
      <el-button @click="focus">focus</el-button>
      <el-button @click="storage">html5 storage</el-button>
      <el-form ref="form" :model="form" @submit.native.prevent="onSubmit">
        <el-form-item label="活动名称">
          <el-input v-model="form.name" @keyup.enter.native="onSubmit" ref="input1"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
      <!--<el-input name="input2" v-validate="'required|email'" :class="{'is-danger': errors.has('input2')}" @keyup.enter="handleClick" v-model="input2"></el-input>-->
      <!--<el-input name="input3" v-validate="'required|email'" :class="{'is-danger': errors.has('input3')}"></el-input>-->
      <!--<p>{{ errors.all() }}</p>-->
      <!--<p style="color: #eb9e05">{{ fields }}</p>-->
    </div>
    <form action="http://oauth.onlyid.net:3001/hi" method="post">
      <input type="checkbox" name="checkbox1" value="banana" id="checkbox1"/><label for="checkbox1">香蕉</label><br/>
      <input type="radio" name="sex" id="male" value="male"/><label for="male">男</label><br/>
      <input type="radio" name="sex" id="female" value="female"/><label for="female">女</label><br/>
      <label for="input1">input1</label>
      <input id="input1" name="input1"/>
      <input type="submit" value="submit"/>
    </form>
    <h1>{{ msg }}</h1>
    <el-button @click="validator">async-validator</el-button>
  </div>
</template>

<script>
  import Validator from 'async-validator'

  export default {
    data () {
      return {
        msg: 'hi',
        p1: true,
        form: {
          name: '活动名称',
          sex: 'male'
        },
        input2: 'mobile'
      }
    },
    watch: {
      input2 (val1, val2) {
        console.log(val1 + ' ' + val2)
      }
    },
    methods: {
      storage () {
//        localStorage.name = 'ltb'
        console.log(localStorage.name)
      },
      onSubmit () {
        console.log('here')
      },
      validator () {
        var descriptor = {
          password: {required: true, min: 6, max: 16},
          smsCode: {required: true, pattern: /^[0-9]{4}$/},
          nickname: {required: true, max: 20}
        }
        var validator = new Validator(descriptor)
        validator.validate({smsCode: '1234'}, (errors, fields) => {
          if (errors) {
            // validation failed, errors is an array of all errors
            // fields is an object keyed by field name with an array of
            // errors per field
//            return handleErrors(errors, fields);
            for (let x in errors) {
              console.log(x)
            }
//            console.log('errors: ' + errors)
//            console.log('fields: ' + fields)
            return
          }
          // validation passed
          console.log('passed')
        })
      },
      focus () {
        console.log('focus' + this.$refs.input1.$el)
        this.$refs.input1.focus()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*.is-danger {*/
    /*color: #fa5555;*/
  /*}*/
</style>
