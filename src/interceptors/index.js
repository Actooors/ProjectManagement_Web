import axios from 'axios'
import Router from 'router'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config;
}, (error) => {
  // console.error('request interceptor: ', error)
  if (error.response) {
    switch (error.response.status) {
      case 401:
        localStorage.clear()
        Router.replace('/login');
        setTimeout(() => {
          this.$Notice.error({
            title: "您没有访问权限",
            content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
            duration: 5
          })
        }, 1500)
        break;
      case 403:
        localStorage.clear()
        Router.replace('/login');
        setTimeout(() => {
          this.$Notice.error({
            title: "您没有访问权限",
            content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
            duration: 5
          })
        }, 1500)
        break;
    }
  }
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  return res;
}, (error) => {
  // console.error('response interceptor: ', error)
  console.log(Object.assign({}, error))
  if (error.response) {
    switch (error.response.status) {
      case 401:
        localStorage.clear()
        Router.replace('/login');
        setTimeout(() => {
          this.$Notice.error({
            title: "您没有访问权限",
            content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
            duration: 5
          })
        }, 1500)
        break;
      case 403:
        localStorage.clear()
        Router.replace('/login');
        setTimeout(() => {
          console.log('!!!')
          this.$Notice.error({
            title: "您没有访问权限",
            content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
            duration: 5
          })
        }, 1500)
        break;
    }
  } else {
    localStorage.clear();
    Router.replace("/login");
    setTimeout(() => {
      console.log('!!!')
      this.$Notice.error({
        title: "您没有访问权限",
        content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
        duration: 5
      })
    }, 1500)
  }
  return Promise.reject(error);
})
