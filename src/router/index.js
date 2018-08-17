'use strict'

import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/components/Auth'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import ResetPassword from '@/components/ResetPassword'
import About from '@/components/About'
import Playground from '@/components/Playground'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/auth/:clientId/:state/:redirectUri/:themeDark/:viewZoomed/:scenario',
      component: Auth
    },
    {
      path: '/login/:mobile/:clientId/:state/:redirectUri/:scenario',
      component: Login
    },
    {
      path: '/signup/:mobile/:clientId/:state/:redirectUri/:scenario',
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
      path: '/playground',
      component: Playground
    }
  ]
})
