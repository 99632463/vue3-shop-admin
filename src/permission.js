import router from './router'
import { getToken } from '~/composables/auth'
import { toast, showFullLoading, hideFullLoading } from '~/composables/utils'
import store from './store'

let hasGetInfo = false
router.beforeEach(async(to,from,next) => {
  showFullLoading()

  const token = getToken()

  // 没有登录，强制跳回登录页
  if(!token && to.path !== '/login'){
    toast('请先登录', 'error')
    return next('/login')
  }
  // 防止重复登录
  if(token && to.path === '/login'){
    toast('请勿重复登录', 'error')
    return next(from.path || '/')
  }
  // 如果用户登录了，自动获取用户信息，并存储在 vuex 中
  if (token && !hasGetInfo) {
    await store.dispatch('getInfo')
    hasGetInfo = true
  }
  // 设置页面标题
  let title = (to.meta.title || '') + '--帝杀商城'
  document.title = title

  next()
})

router.afterEach(() => {
  hideFullLoading()
})