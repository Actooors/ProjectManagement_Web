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
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  return res;
}, (error) => {
  console.log('response interceptor: ', error)
  if (error.response) {
    switch (error.response.status) {
      case 401:
        localStorage.clear()
        Router.replace('/login');
    }
  }
  return Promise.reject(error);
})
