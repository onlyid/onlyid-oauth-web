'use strict'

import Vue from 'vue'
import Router from 'vue-router'
import Auth from './views/Auth'
import Login from './views/Login'
import Signup from './views/Signup'
import ResetPassword from './views/ResetPassword'
import About from './views/About'
import Playground from './views/Playground'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/auth/:clientId/:state/:redirectUri/:themeDark/:viewZoomed/:scene',
      component: Auth
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
      path: '/playground',
      component: Playground
    }
  ]
})
