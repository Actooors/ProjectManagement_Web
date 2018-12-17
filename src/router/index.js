import Vue from 'vue'
import Router from 'vue-router'
import Principal from 'group/principal'
import User from 'group/user'
import Admin from 'group/admin'
import Leader from 'group/leader'
import PrincipalMainPage from 'pages/principal/mainpage/mainpage'
import UserMainPage from 'pages/user/mainpage/mainpage'
import AdminMainPage from 'pages/admin/mainpage/mainpage'
import LeaderMainPage from 'pages/leader/mainpage/mainpage'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/user',
      component: User,
      redirect: {name: 'mainpage'},
      children: [
        {
          path: '',
          redirect: 'mainpage'
        },
        {
          path: 'mainpage',
          component: UserMainPage
        }
      ]
    },
    {
      path: '/principal',
      component: Principal,
      redirect: {name: 'mainpage'},
      children: [
        {
          path: '',
          redirect: 'mainpage'
        },
        {
          path: 'mainpage',
          component: PrincipalMainPage
        }
      ]
    },
    {
      path: '/admin',
      component: Admin,
      redirect: {name: 'mainpage'},
      children: [
        {
          path: '',
          redirect: 'mainpage'
        },
        {
          path: 'mainpage',
          component: AdminMainPage
        }
      ]
    },
    {
      path: '/leader',
      component: Leader,
      redirect: {name: 'mainpage'},
      children: [
        {
          path: '',
          redirect: 'mainpage'
        },
        {
          path: 'mainpage',
          component: LeaderMainPage
        }
      ]
    },
  ]
})
