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
import ExpertReqProject from 'pages/expert/reqProject/reqProject'
import ExpertEndProject from 'pages/expert/endProject/endProject'
import LeaderMainPage from 'pages/leader/mainpage/mainpage'
import LeaderReqProject from 'pages/leader/reqProject/reqProject'
import LeaderEndProject from 'pages/leader/endProject/endProject'
import LeaderProjectList from 'pages/leader/projectList/projectList'
import LeaderStatistic from 'pages/leader/statistic/statistic'

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
      redirect: {name: 'reqProject'},
      children: [
        {
          path: '',
          redirect: 'reqProject',
        },
        {
          path: 'reqProject',
          component: ExpertReqProject
        },
        {
          path: 'endProject',
          component: ExpertEndProject
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
        },
        {
          path: 'reqProject',
          component: LeaderReqProject
        },
        {
          path: 'endProject',
          component: LeaderEndProject
        },
        {
          path: 'projectList',
          component: LeaderProjectList
        },
        {
          path: 'statistic',
          component: LeaderStatistic
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
