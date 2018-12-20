import Vue from 'vue'
import Router from 'vue-router'
import Principal from 'group/principal'
import User from 'group/user'
import Expert from 'group/expert'
import Leader from 'group/leader'
import Login from 'pages/login/login'
import AvaProject from 'pages/user/avaProject/avaProject'
import ReqProject from 'pages/user/reqProject/reqProject'
import MyProject from 'pages/user/myProject/myProject'
import MyInfo from 'pages/user/myInfo/myInfo'
import PrincipalMainPage from 'pages/principal/mainpage/mainpage'
import ExpertMainPage from 'pages/expert/mainpage/mainpage'
import LeaderMainPage from 'pages/leader/mainpage/mainpage'

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/user',
      component: User,
      redirect: {name: 'avaProject'},
      children: [
        {
          path: '',
          redirect: 'avaProject'
        },
        {
          path: 'avaProject',
          component: AvaProject
        },
        {
          path: 'reqProject',
          component: ReqProject
        },
        {
          path: 'myProject',
          component: MyProject
        },
        {
          path: 'myInfo',
          component: MyInfo
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
      path: '/expert',
      component: Expert,
      redirect: {name: 'mainpage'},
      children: [
        {
          path: '',
          redirect: 'mainpage'
        },
        {
          path: 'mainpage',
          component: ExpertMainPage
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
    {
      path: '/login',
      component: Login,
      name: 'login'
    }
  ]
});
export default router
