import axios from 'axios'
import Router from 'router'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
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
  if (error.response.status) {
    switch (error.response.status) {
      case 401:
        Router.replace('/login');
    }
  }
  return Promise.reject(error);
})
