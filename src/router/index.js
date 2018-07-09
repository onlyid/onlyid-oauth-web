'use strict'

import Vue from 'vue'
import Router from 'vue-router'
import Authorize from '@/components/Authorize'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import ResetPassword from '@/components/ResetPassword'
import About from '@/components/About'
import Demo from '@/components/Demo'
import Playground from '@/components/Playground'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/authorize/:clientId/:state/:redirectUri/:themeDark/:viewZoomed/:scene',
      component: Authorize
    },
    {
      path: '/login/:mobile/:clientId/:state/:redirectUri/:scene',
      component: Login
    },
    {
      path: '/signup/:mobile/:clientId/:state/:redirectUri/:scene',
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
      path: '/demo',
      component: Demo
    },
    {
      path: '/playground',
      component: Playground
    }
  ]
})
