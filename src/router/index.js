'use strict'

import Vue from 'vue'
import Router from 'vue-router'
import Authorize from '@/components/Authorize'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import ResetPassword from '@/components/ResetPassword'
import About from '@/components/About'
import Hi from '@/components/Hi'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/authorize/:clientId/:state/:redirectUri/:themeDark/:viewZoomed',
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
      path: '/reset-password/:mobile/:clientId/:state/:redirectUri',
      component: ResetPassword
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/hi',
      component: Hi
    }
  ]
})
