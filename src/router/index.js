'use strict'

import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Authorize from '@/components/Authorize'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Hi from '@/components/Hi'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/authorize',
      component: Authorize
    },
    {
      path: '/login/:mobile/:clientId/:state/:redirectUri',
      component: Login
    },
    {
      path: '/signup/:mobile/:clientId/:state/:redirectUri',
      component: Signup
    },
    {
      path: '/hello',
      component: HelloWorld
    },
    {
      path: '/hi',
      component: Hi
    }
  ]
})
