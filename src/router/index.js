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
import ExpertReqProject from 'pages/expert/reqProject/reqProject'
import ExpertEndProject from 'pages/expert/endProject/endProject'
import ExpertInfo from 'pages/expert/myInfo/myInfo'
// import ProjectCategory from 'pages/leader/projectCategory/projectCategory'
import LeaderReqProject from 'pages/leader/reqProject/reqProject'
import LeaderEndProject from 'pages/leader/endProject/endProject'
import LeaderProjectList from 'pages/leader/projectList/projectList'
import LeaderStatistic from 'pages/leader/statistic/statistic'
import LeaderInfo from 'pages/leader/myInfo/myInfo'
import Error from 'pages/error404/error404'
import NewCategory from 'pages/principal/newCategory/newCategory'
import CategoryList from 'pages/principal/categoryList/categoryList'
import threeEx from 'pages/principal/threeEx/threeEx'
import twoEx from 'pages/principal/twoEx/twoEx'
import oneEx from 'pages/principal/oneEx/oneEx'
import PrincipalInfo from 'pages/principal/myInfo/myInfo'


Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '',
      redirect: {name: 'login'}
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
      redirect: {name: 'newCategory'},
      children: [
        {
          path: '',
          redirect: 'newCategory'
        },
        {
          path: 'newCategory',
          component: NewCategory
        },
        {
          path: 'categoryList',
          component: CategoryList
        },
        {
          path: 'threeEx',
          component: threeEx
        },
        {
          path: 'twoEx',
          component: twoEx
        },
        {
          path: 'oneEx',
          component: oneEx
        },
        {
          path: 'myInfo',
          component: PrincipalInfo
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
          path: 'myInfo',
          component: ExpertInfo
        }
      ]
    },
    {
      path: '/leader',
      component: Leader,
      redirect: {name: 'reqProject'},
      children: [
        {
          path: '',
          redirect: 'reqProject'
        },
        // {
        //   path: 'projectCategory',
        //   component: ProjectCategory
        // },
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
        },
        {
          path: 'myInfo',
          component: LeaderInfo
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
