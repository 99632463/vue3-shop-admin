import axios from "axios";
import { toast } from '~/composables/utils'
import { getToken } from '~/composables/auth'
import store from './store'

const service = axios.create({
  baseURL: '/api'
})

service.interceptors.request.use(config => {
  const token = getToken()

  if(token){
    config.headers['token'] = token
  }
  return config
}, err => {
  return Promise.reject(err)
})

service.interceptors.response.use(response => {
  return response.data.data
}, async err => {
  // 统一错误处理
  const msg = err.response.data.msg || '请求失败'
  if (msg === '非法token') {
    await store.dispatch('logout')
    location.reload()
  }
  
  toast(msg, 'error')
  return Promise.reject(err)
})

export default service