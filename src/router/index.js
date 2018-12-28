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
import UserInfo from 'pages/user/myInfo/myInfo'
import PrincipalMainPage from 'pages/principal/mainpage/mainpage'
import ExpertReqProject from 'pages/expert/reqProject/reqProject'
import ExpertEndProject from 'pages/expert/endProject/endProject'
import ExpertInfo from 'pages/expert/myInfo/myInfo'
import AllProject from 'pages/leader/allProject/allProject'
import LeaderReqProject from 'pages/leader/reqProject/reqProject'
import LeaderEndProject from 'pages/leader/endProject/endProject'
import LeaderProjectList from 'pages/leader/projectList/projectList'
import LeaderStatistic from 'pages/leader/statistic/statistic'
import Error from 'pages/error404/error404'
import fourEx from 'pages/principal/fourEx/fourEx'


Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path:'',
      redirect:{name:'login'}
    },
    {
      path: '/login',
      component: Login,
      name: 'login'
    },
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
          component: UserInfo
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
          redirect:'mainpage'
        },
        {
          path: 'mainpage',
          component: PrincipalMainPage
        },
        {
          path:'fourEx',
          component:fourEx
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
        },
        {
          path:'myInfo',
          component:ExpertInfo
        }
      ]
    },
    {
      path: '/leader',
      component: Leader,
      redirect: {name: 'allProject'},
      children: [
        {
          path: '',
          redirect: 'allProject'
        },
        {
          path: 'allProject',
          component: AllProject
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
      path: '*',
      component: Error,
      name: 'error404'
    }
  ]
});
export default router
