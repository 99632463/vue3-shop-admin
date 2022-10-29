import { createStore } from 'vuex'
import { login, getInfo } from '~/api/manager'
import { setToken, removeToken } from '~/composables/auth'

const store = createStore({
  state () {
    return {
      user: {},
      asideWidth: '250px',
      menus: [],
      ruleNames: []
    }
  },
  mutations: {
    // 记录用户信息
    SET_USERINFO(state, user) {
      state.user = user
    },
    // 展开、缩起侧边
    handleAsideWidth(state){
      state.asideWidth = state.asideWidth === '250px' ? '64px' : '250px'
    },
    SET_MENUS(state, menus){
      state.menus = menus
    },
    SET_RULENAMES(state, ruleNames){
      state.ruleNames = ruleNames
    }
  },
  actions: {
    login({commit}, {username, password}){
      return new Promise((resolve, reject) => {
        login(username, password).then(res => {
          // 存取token
          setToken(res.token) 
          resolve(res)
        }).catch(err => reject(err))
      })
    },
    getInfo({commit}) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          commit('SET_USERINFO', res)
          commit('SET_MENUS', res.menus)
          commit('SET_RULENAMES', res.ruleNames)
          resolve(res)
        }).catch(err => reject(err))
      })
    },
    logout({commit}){
      // 移除token
      removeToken()
      // 清楚 vuex 用户信息
      commit('SET_USERINFO', {})
    }
  }
})

export default store