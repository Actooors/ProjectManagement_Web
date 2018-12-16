import Vue from 'vue'
import Router from 'vue-router'
import Principal from 'group/principal'
import Admin from 'group/admin'
import MainPage from 'pages/principal/mainpage/mainpage'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      component: Principal,
      redirect: {name: 'mainpage'},
      children: [
        {
          path:'',
          redirect:'mainpage'
        },
        {
          path: 'mainpage',
          component: MainPage
        }
      ]
    },
    {
      path: '/admin',
      component: Admin,
      children: []
    }
  ]
})
