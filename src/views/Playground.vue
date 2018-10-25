<template>
  <div>
    <!--<el-button @click="testCache">test cache</el-button>-->
    <!--<el-input suffix-icon="el-icon-view">-->
    <!--</el-input>-->
    <!--<el-input>-->
      <!--<i slot="suffix" class="el-icon-view"></i>-->
    <!--</el-input>-->
    <!--<div>-->
      <!--<el-button @click="focus">focus</el-button>-->
      <!--<el-button @click="storage">html5 storage</el-button>-->
      <!--<el-form ref="form" :model="form" @submit.native.prevent="onSubmit">-->
        <!--<el-form-item label="活动名称">-->
          <!--<el-input v-model="form.name" @keyup.enter.native="onSubmit" ref="input1"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="onSubmit">立即创建</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--&lt;!&ndash;<el-input name="input2" v-validate="'required|email'" :class="{'is-danger': errors.has('input2')}" @keyup.enter="handleClick" v-model="input2"></el-input>&ndash;&gt;-->
      <!--&lt;!&ndash;<el-input name="input3" v-validate="'required|email'" :class="{'is-danger': errors.has('input3')}"></el-input>&ndash;&gt;-->
      <!--&lt;!&ndash;<p>{{ errors.all() }}</p>&ndash;&gt;-->
      <!--&lt;!&ndash;<p style="color: #eb9e05">{{ fields }}</p>&ndash;&gt;-->
    <!--</div>-->
    <!--<form action="http://oauth.onlyid.net:3001/hi" method="post">-->
      <!--<input type="checkbox" name="checkbox1" value="banana" id="checkbox1"/><label for="checkbox1">香蕉</label><br/>-->
      <!--<input type="radio" name="sex" id="male" value="male"/><label for="male">男</label><br/>-->
      <!--<input type="radio" name="sex" id="female" value="female"/><label for="female">女</label><br/>-->
      <!--<label for="input1">input1</label><input id="input1" name="input1"/>-->
      <!--<input type="submit" value="submit"/>-->
    <!--</form>-->
  </div>
</template>

<script>
export default {
  data () {
    return {
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
    async testCache () {
      try {
        const { data } = await this.$axios.get('/playground')
        console.log(data)
      } catch (err) {
        console.error(err)
      }
    },
    async testAxios () {
      try {
        this.$axios.post('/hi')
      } catch (err) {
        console.error(err)
      }
    },
    storage () {
      //        localStorage.name = 'ltb'
      console.log(localStorage.name)
    },
    onSubmit () {
      console.log('here')
    },
    focus () {
      console.log('focus' + this.$refs.input1.$el)
      this.$refs.input1.focus()
    }
  },
  mounted () {
    this.testCache()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
