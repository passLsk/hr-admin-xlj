import { login, getInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userInfo: ''
}
const mutations = {
  // token
  setToken (state, payload) {
    state.token = payload
  },
  // 用户信息
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  // 移除token
  removeToken (state) {
    state.token = null
    removeToken()
  },
  // 移除用户信息
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  // 登录请求
  async login (context, data) {
    const res = await login(data)
    console.log('login', res)
    context.commit('setToken', res)
    setToken(res)
    setTime(Date.now()) // 登录的时候存入当前的时间戳
  },
  // 发起获取用户信息的请求 获取数据在permission 进入路由时
  async getInfo (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    console.log('用户信息', res)
    console.log('用户信息1', res1)
    context.commit('setUserInfo', { ...res, ...res1 })
    // 权限管理
    return res
  },
  // 清除token并清空用户信息
  logout (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
      // 重置路由
      resetRouter()
      // 还有一步  vuex中的数据是不是还在
      // 要清空permission模块下的state数据
      // vuex中 user子模块  permission子模块
      // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
      // 父模块 调用 子模块的action
      context.commit('permission/setRoutes', [], { root: true })
      // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
