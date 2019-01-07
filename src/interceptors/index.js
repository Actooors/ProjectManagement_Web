import axios from 'axios'
import Router from 'router'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config;
}, (error) => {
  console.error('request interceptor: ', error)
  if (error.response) {
    switch (error.response.status) {
      case 401:
        localStorage.clear()
        Router.replace('/login');
        break;
      case 403:
        localStorage.clear()
        Router.replace('/login');
        break;
    }
  }
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  return res;
}, (error) => {
  console.error('response interceptor: ', error)
  //TODO youwenti
  console.log(Object.assign({},error))
  if (error.response) {
    switch (error.response.status) {
      case 401:
        localStorage.clear()
        Router.replace('/login');
        break;
      case 403:
        localStorage.clear()
        Router.replace('/login');
        break;
    }
  } else {
    localStorage.clear();
    Router.replace("/login");
    this.$Message.error("未知错误错误错误错误错误错误错误错误错误错误！错误错误错误")
  }
  return Promise.reject(error);
})
