// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import echarts from 'echarts'
import 'iview/dist/styles/iview.css';
import 'normalize.css'
import '@/interceptors'

Vue.use(iView)
Vue.config.productionTip = false
Vue.use(echarts)
// Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
